// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	modules: ["@nuxt/icon", "shadcn-nuxt", "@nuxtjs/supabase"],
	css: ["~/assets/css/tailwind.css", "~/assets/css/main.css"],
	vite: {
		plugins: [tailwindcss()],
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui",
	},
	supabase: {
		redirect: false,
	},
	runtimeConfig: {
		public: {
			cloud_name: process.env.PUBLIC_CLOUD_NAME,
			cloud_key: process.env.PUBLIC_CLOUD_API_KEY,
			preset_name: process.env.PUBLIC_PRESET_NAME,
		},
	},
	ssr: false,
});
