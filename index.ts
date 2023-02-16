#!/usr/bin/env node
import path from 'path'
import { inquiry } from './inquiry'
import { configType, createTemplate } from './utils'

async function init() {
  let promptsResult = await inquiry()

  const config: configType = {
    projectName: promptsResult['projectName'],
    template: promptsResult['templateName'],
    ejsVarAilas: 'config-text.js',
    options: promptsResult['options']
  }

  const templatesRoot = path.resolve(__dirname, './templates')

  createTemplate(config, templatesRoot, ({ newProjectPath }) => {
    console.log(`创建完成,新项目路径为${newProjectPath}`)
  })
}

init().catch((err) => {
  console.log(err)

  process.exit()
})
