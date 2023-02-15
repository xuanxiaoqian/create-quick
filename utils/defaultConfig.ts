import { configType } from './types'

// 可选参数默认变量
export const defaultConfig: configType = {
  projectName: 'default-project',
  template: 'default-template',
  dirAlias: {
    base: 'base',
    options: 'options',
    ejs: 'ejs'
  },
  ejsVarAilas: 'ejsData.js',
  options: []
}
