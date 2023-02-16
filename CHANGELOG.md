# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/xuanxiaoqian/create-quick/compare/v1.2.4...v1.3.0) (2023-02-16)


### Features

* 新增了endFolw函数初始化package.json，修复了ts的type为必选 ([23c55ed](https://github.com/xuanxiaoqian/create-quick/commit/23c55eddc617d3e7df121defb22fe29496b444ba))

### [1.2.4](https://github.com/xuanxiaoqian/create-quick/compare/v1.2.2...v1.2.4) (2023-02-15)


### Bug Fixes

* 最终修复上线npm读取不到templatesData.json的问题 ([1fa940d](https://github.com/xuanxiaoqian/create-quick/commit/1fa940d98ad8bdb80f3aa98ab01306305e3fa2a5))

### [1.2.2](https://github.com/xuanxiaoqian/create-quick/compare/v1.2.1...v1.2.2) (2023-02-15)


### Bug Fixes

* 修复入口文件index.ts读取templates 从 './templates' 至 path.resolve(__dirname, './templates') ([a6fd7c9](https://github.com/xuanxiaoqian/create-quick/commit/a6fd7c9befddfe1fd24869760466d1c2a5441a3d))

### [1.2.1](https://github.com/xuanxiaoqian/create-quick/compare/v1.2.0...v1.2.1) (2023-02-15)


### Bug Fixes

* 修复package.json的files未添加templatesData.json文件 ([a0e6c54](https://github.com/xuanxiaoqian/create-quick/commit/a0e6c540f887dbc4d3ac8b9d5421e0a7c0250857))

## [1.2.0](https://github.com/xuanxiaoqian/create-quick/compare/v1.1.0...v1.2.0) (2023-02-15)


### Features

* 新增入口文件的询问环节 ([cc7ba76](https://github.com/xuanxiaoqian/create-quick/commit/cc7ba76893ab74591cc96bcbecc07e2c2d0a6f4a))

## 1.1.0 (2023-02-15)


### Features

* 新增项目渲染函数createTemplate、入口文件index.ts功能完善 ([5ae5eeb](https://github.com/xuanxiaoqian/create-quick/commit/5ae5eeb447420c5ed006e4c027f096612a829f14))
