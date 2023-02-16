<h1 align="center">create-quick</h1>
<p align="center">约定代替编码，更灵活、迅速的脚手架搭建工具</p>

<p align="center">
  <a target="_blank" href="">文档网站（暂无）</a>
  &nbsp;
</p>



---



## 介绍

create-quick对脚手架核心业务进行封装，使用者只需关心脚手架的内容，约定代替编码的方式更灵活、迅速的创建脚手架





<br />

## 演示

```sh
npm create quick
# or
npm init quick
# or
npx create-quick
```



<br />

## 约定

`templates`文件夹就是我们脚手架模板存放的地方，里面使用约定代替配置的方式，有着以下约定

- templates文件夹里面的第一层为模板名，例如：templates/vue3、templates/nest
- 模板名里面有着三个文件夹，分别是`base`、`options`、`ejs`（可通过配置变量自定义命名）
- options文件夹里面的各种选项里面的文件目录需要跟base目录一一对应
- options里面的`package.json`会和base的`package.json`进行合并，其他文件全是替换
- options里面的`ejsData.js`为参数变量，用于给ejs模板引擎渲染的，同时里面可以定义一个回调函数，到该options执行完成之后会调用回调函数，可以接收两个值，一个是新项目路径，一个是config参数。该文件也不会添加到base里（可通过配置变量自定义命名）
- ejs文件夹为模板引擎，里面的文件目录也是和base目录一一对应，例如：`main.ts.ejs`文件名最终合并到base里面的名字为`main.ts`，也会覆盖base



核心函数`createTemplate`接收三个参数：

```ts
const config: configType = {	// 渲染参数
    projectName: 'default-project',
    template: 'vue3',
    ejsVarAilas: 'config-text.js',
    options: ['pinia', 'prettier', 'vue-router']
}

const templatesRoot = path.resolve(__dirname, './templates')	// 模板文件夹path

createTemplate(config, templatesRoot, ({ newProjectPath }) => {
    // 渲染完成的回调函数
    console.log(`创建完成,新项目路径为${newProjectPath}`)
})
```



仓库里面的入口文件`index.ts`询问方式可以自定义，你只需要将数据给到createTemplate渲染函数即可



<br />

## 快速上手

前往最小化demo仓库   <a target="_blank" href="https://gitee.com/lianxuan7/create-quick">create-mini-quick</a>







<br />

## 疑问交流

QQ群: <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=LrFpPFoHAHFikBUJQqKjViRJIY1BH250&jump_from=webapi">qian-cli(746382337)</a>