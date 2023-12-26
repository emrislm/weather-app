// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	modules: ["@nuxt/ui"],
	ui: {
		global: true,
		icons: ["mdi", "simple-icons"],
	},
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
	],
	colorMode: {
		preference: "light",
	},
});
