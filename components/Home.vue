<template>
  <UContainer class="w-full lg:w-2/3 max-w-screen-lg h-screen p-5" :ui="uiBase">
    <UInput @keyup.enter="getCityWeather" v-model="cityToSearch" icon="i-mdi-magnify" :loading="isLoading" size="lg"
      placeholder="Enter a city..." />

    <UContainer v-if="weatherObject.statusCode == 200"
      class="flex flex-col rounded-xl w-full h-1/2 justify-between p-5 my-5"
      :style="{ backgroundImage: `url(${backgroundImage})` }" :ui="uiBase">
      <span class="font-bold text-4xl px-0 pb-3">{{ weatherObject.city }}</span>
      <div class="flex w-full justify-center py-3"></div>
      <UContainer class="flex flex-col w-full" :ui="uiBase">
        <UContainer class="flexflex-row w-full justify-start" :ui="uiBase">
          <span class="font-extrabold text-6xl">{{ weatherObject.temperature }}°</span>
          <span class="font-bold self-end text-xl mb-1">{{ parseWeatherDescription() }}</span>
        </UContainer>
        <UContainer class="flex flex-row w-full justify-start px-0" :ui="uiBase">
          <span class="font-semibold">{{ parseMinMaxTemp() }}</span>
        </UContainer>
      </UContainer>
    </UContainer>

    <UContainer v-if="weatherObject.statusCode == 200" class="flex flex-col mb-5" :ui="uiBase">
      <HourlyForecast :bgImage="backgroundImage" :forecastData="forecastObject" />
    </UContainer>
  </UContainer>
</template>

<script setup>
const uiBase = { strategy: 'override', padding: '0px' };
const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const isLoading = ref(false);

const cityToSearch = ref('');
const backgroundImage = ref('');
const weatherObject = ref({
  statusCode: 0,
  city: '',
  description: '',
  temperature: 0,
  temperature_min: 0,
  temperature_max: 0,
  icon: ''
});
const forecastObject = ref([]);

const getCityWeather = async () => {
  isLoading.value = true;
  await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityToSearch.value}&appid=7e9c2b8ea7b178102ac5390695dbedb4`)
    .then(response => {
      response.json()
        .then(data => {
          weatherObject.value.city = data.name;
          weatherObject.value.description = `${data.weather[0].main}, ${data.weather[0].description}`;
          weatherObject.value.icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          weatherObject.value.temperature = Math.round(data.main.temp);
          weatherObject.value.temperature_min = Math.round(data.main.temp_min);
          weatherObject.value.temperature_max = Math.round(data.main.temp_max);
          weatherObject.value.statusCode = data.cod;

          isLoading.value = false;
          setBackgroundImage(data.weather[0].main);
          getCityForecast();
        });
    })
    .catch(error => { console.error(error) });
};

const getCityForecast = async () => {
  await fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${weatherObject.value.city}&appid=7e9c2b8ea7b178102ac5390695dbedb4`)
    .then(response => {
      response.json()
        .then(data => {
          let itemsArray = [];
          let itemsCount = 0;
          data.list.forEach((item) => {
            let itemDate = new Date(item.dt_txt);
            let obj = {
              dt: item.dt,
              time: {
                hour: itemDate.getHours() < 10 ? `0${itemDate.getHours()}` : itemDate.getHours(),
                minute: itemDate.getMinutes() < 10 ? `0${itemDate.getMinutes()}` : itemDate.getMinutes()
              },
              icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
              temp: Math.round(item.main.temp)
            };
            if (itemsCount < 5) itemsArray.push(obj);
            itemsCount++;
          });
          forecastObject.value = itemsArray;
        });
    })
    .catch(error => { console.error(error) });
};

const setBackgroundImage = async (query) => {
  await fetch(`https://api.unsplash.com/search/photos?orientation=landscape&query=${query}`, {
    headers: {
      'Authorization': 'Bearer Client-ID 207ThCRe4EOKQ_qkJgMNYSqp6dbCIFQHm7YU_S-ARS8'
    }
  }).then(response => {
    response.json()
      .then(data => {
        backgroundImage.value = data.results[0].urls.full;
      });
  }).catch(error => { console.error(error) });
};

const parseWeatherDescription = () => {
  return weatherObject.value.description.charAt(0).toUpperCase() + weatherObject.value.description.slice(1);
};

const parseMinMaxTemp = () => {
  return `${weekday[new Date().getDay()]} ${weatherObject.value.temperature_max}° / ${weatherObject.value.temperature_min}°`;
};
</script>