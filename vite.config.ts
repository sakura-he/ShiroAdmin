import { defineConfig,type PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { visualizer } from "rollup-plugin-visualizer";
import ViteMonacoPlugin from 'vite-plugin-monaco-editor-esm'

// Arco组件自动引入
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver } from 'unplugin-vue-components/resolvers';
import vueJsx from '@vitejs/plugin-vue-jsx';
// https://vitejs.dev/config/
export default defineConfig({
	css:{
		modules:{
			
		}
	},
	plugins: [
		vue(),
		vueJsx(),
		AutoImport({
			resolvers: [ArcoResolver(),],
			imports: ['vue',],
			dts: true
		}),
		Components({
			resolvers: [
				ArcoResolver({
					sideEffect: true
				})
			]
		}),
		visualizer() as unknown as PluginOption,
		ViteMonacoPlugin()
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src/')
		}
	}
});
