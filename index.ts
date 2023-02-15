#!/usr/bin/env node

import path from 'path'
import { configType, createTemplate } from './utils'

async function init() {
  const config: configType = {
    projectName: 'default-project',
    template: 'vue3',
    ejsVarAilas: 'config-text.js',
    options: ['pinia', 'prettier', 'vue-router']
  }

  const templatesRoot = path.resolve(__dirname, './templates')

  // TODO: 修改为Promise
  createTemplate(config, templatesRoot, ({ newProjectPath }) => {
    console.log(`创建完成,新项目路径为${newProjectPath}`)
  })
}

init().catch((err) => {
  console.log(err)

  process.exit()
})
