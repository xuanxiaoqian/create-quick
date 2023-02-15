<h1 align="center">create-quick</h1>
<p align="center">约定代替编码，更灵活、迅速的脚手架搭建工具</p>

<p align="center">
  <a href="">文档网站（暂无）</a>
  &nbsp;
</p>



---



## 介绍

create-quick对脚手架核心业务进行封装，使用者只需关心脚手架的内容，约定代替编码的方式更灵活、迅速的创建脚手架





<br />

## 使用

1.首先克隆本仓库

```sh
git clone https://gitee.com/xuanxiaoqian/create-quick.git
```

如果你想要干净的脚手架，请删除以下文件/文件夹（都在根目录）：

`.husky`



<br />

2.现在在脚手架编码这个点上我们只需要关心`index.ts`文件



<br />

3.`templates`文件夹就是我们脚手架模板存放的地方，里面使用约定代替配置的方式，有着以下约定

- templates文件夹里面的第一层为模板名，例如：templates/vue3、templates/nest
- 模板名里面有着三个文件夹，分别是`base`、`options`、`ejs`（可通过配置变量修改名字）
- options文件夹里面的各种选项里面的文件目录需要跟base目录一一对应
- options里面的`package.json`会和base的`package.json`进行合并，其他文件全是替换
- options里面的`ejsData.js`为参数变量，用于给ejs模板引擎渲染的，该文件也不会添加到base里（可通过配置变量修改名字）
- ejs文件夹为模板引擎，里面的文件目录也是和base目录一一对应，`main.ts.ejs`文件名最终合并到base里面的名字为`main.ts`，也会覆盖base



4.核心函数`createTemplate`接收三个参数：

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





## 示例：

敬请期待...







## 疑问交流

QQ群: <a target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=LrFpPFoHAHFikBUJQqKjViRJIY1BH250&jump_from=webapi">qian-cli(746382337)</a>