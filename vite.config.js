import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import CesiumPlugin from 'vite-plugin-cesium'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '^/geo8085/.*': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo8085/, '')
      },
    }
  },
  resolve:{
    alias:{
      'primitive-geojson':path.resolve(`primitive-geojson`)
    }
  },
  plugins: [vue(),CesiumPlugin()],
})
