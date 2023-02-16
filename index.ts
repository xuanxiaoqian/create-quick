#!/usr/bin/env node
import path from 'path'
import { inquiry } from './inquiry'
import { createTemplate } from './utils'

async function init() {
  let config = await inquiry()

  const templatesRoot = path.resolve(__dirname, './templates')

  createTemplate(config, templatesRoot, ({ newProjectPath }) => {
    console.log(`创建完成,新项目路径为${newProjectPath}`)
  })
}

init().catch((err) => {
  console.log(err)

  process.exit()
})
