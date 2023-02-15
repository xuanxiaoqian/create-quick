import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'

import { resolve } from 'path'

export default defineConfig({
  plugins: [
    uni(),
    vueJsx(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'types/auto-imports.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
