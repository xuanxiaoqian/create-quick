# 介绍
 此项目为uniapp的vue3 + ts + vite + pinia的模板


如果你安装pinia报错那就用这行命令安装
~~~sh
npm i pinia --legacy-peer-deps
~~~

输入npm -V发现我的npm版本为7.x的，因为npm7.x版本对某些命令比npm6.x更严格，所以莫名报了这个错



推荐一个vue3脚手架

[https://gitee.com/xuanxiaoqian/qian-cli](https://gitee.com/xuanxiaoqian/qian-cli)





## 1. tailwindCss

~~~sh
npm install -D tailwindcss postcss autoprefixer postcss-class-rename css-byebye
~~~

`tailwind.config.cjs`

~~~js
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
~~~

`postcss.config.cjs`

~~~js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
~~~

`App.vue`

~~~css
<style>
@import 'tailwindcss/tailwind.css';
</style>
~~~



`vite.config.ts`

~~~ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { uniPostcssPlugin } from '@dcloudio/uni-cli-shared'

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
  css: {
    postcss: {
      plugins: [
        require('postcss-import')({
          resolve(id: any) {
            if (id.startsWith('~@/')) {
              return resolve(process.env.UNI_INPUT_DIR as string, id.substr(3))
            } else if (id.startsWith('@/')) {
              return resolve(process.env.UNI_INPUT_DIR as string, id.substr(2))
            } else if (id.startsWith('/') && !id.startsWith('//')) {
              return resolve(process.env.UNI_INPUT_DIR as string, id.substr(1))
            }
            return id
          },
        }),
        require('tailwindcss')(),
        // 根据平台差异进行不同的样式处理
        ...(process.env.UNI_PLATFORM !== 'h5'
          ? [
              // 使用postcss-class-name 包将小程序不支持的类名转换为支持的类名
              require('postcss-class-rename')({
                '\\\\:': '--',
                '\\\\/': '--',
                '\\\\.': '--',
                // '.:': '--',
                '\\*': '--',
              }),
              require('css-byebye')({
                rulesToRemove: [/\*/],
                map: false,
              }),
            ]
          : []),
        /* ******* */
        uniPostcssPlugin(),
        require('autoprefixer')({
          remove: true,
        }),
      ],
    },
  },
})
~~~

运行后如果出现class任意值在APP失效例如 w-[200rpx] 则使用下面配置

`vite.config.ts`

~~~ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import { uniPostcssPlugin } from '@dcloudio/uni-cli-shared'

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
  css: {
    postcss: {
      plugins: [
        require('postcss-import')({
          resolve(id: any) {
            if (id.startsWith('~@/')) {
              return resolve(process.env.UNI_INPUT_DIR as string, id.substr(3))
            } else if (id.startsWith('@/')) {
              return resolve(process.env.UNI_INPUT_DIR as string, id.substr(2))
            } else if (id.startsWith('/') && !id.startsWith('//')) {
              return resolve(process.env.UNI_INPUT_DIR as string, id.substr(1))
            }
            return id
          },
        }),
        require('tailwindcss')(),
        // 根据平台差异进行不同的样式处理
        ...(process.env.UNI_PLATFORM !== 'h5' ? [] : []),
        /* ******* */
        uniPostcssPlugin(),
        require('autoprefixer')({
          remove: true,
        }),
      ],
    },
  },
})
~~~





## 2. vk-uview-ui

> https://vkuviewdoc.fsq.pub/components/icon.html

~~~sh
npm i vk-uview-ui
~~~



`main.ts`

~~~ts
import uView from 'vk-uview-ui'
import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './store'

export function createApp() {
    const app = createSSRApp(App)
    app.use(uView)
    app.use(pinia)
    return {
        app,
    }
}

~~~

`vk-uview-ui.d.ts`

```ts
declare module 'vk-uview-ui' {
    const install: PluginInstallFunction;
}
```



`uni.scss`

```scss
/* 颜色变量 */
@import 'vk-uview-ui/theme.scss';
```

`pages.json`

```json
"easycom": {
    "autoscan": true,
    "custom": {
        "^u-(.*)": "vk-uview-ui/components/u-$1/u-$1.vue"
    }
}
```

`app.vue`

```vue
<style lang="scss">
@import 'vk-uview-ui/index.scss';
</style>
```

使用

```vue
<u-button>月落</u-button>
```

