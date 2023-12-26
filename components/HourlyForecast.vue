<template>
  <UContainer class="flex flex-row w-full justify-between rounded-xl py-4 bg-slate-300" :ui="uiBase">
    <UContainer v-for="forecast in props.forecastData" :key="forecast.dt" class="flex flex-col w-auto text-center"
      :ui="uiBase">
      <span class="font-bold">{{ forecast.time.hour }}:{{ forecast.time.minute }}</span>
      <div class="flex w-full justify-center">
        <UAvatar size="lg" v-bind:src="forecast.icon" alt="img" />
      </div>
      <span class="font-bold">{{ forecast.temp }}°</span>
    </UContainer>
  </UContainer>
</template>

<script setup>
const props = defineProps(['bgImage', 'forecastData']);
const uiBase = { strategy: 'override', padding: '0px' };
</script>