#!/usr/bin/env node
import minimist from 'minimist'
import path from 'path'
import prompts from 'prompts'
import { configType, createTemplate, readJsonFile } from './utils'

const handleOptions = (data: any) => {
  const options = []

  let obj = {
    type: 'select',
    name: 'templateName',
    message: 'Pick template',
    choices: [] as any
  }

  Object.keys(data).map((k) => {
    const title = data[k]['title']
    obj.choices.push({
      title,
      value: k
    })
  })
  options.push(obj)

  options.push({
    type: (prev: any) => (data[prev]['options'].length > 1 ? 'multiselect' : null),
    name: 'options',
    message: 'Pick options',
    choices: (prev: any) => data[prev]['options']
  })

  return options
}

const argv = minimist(process.argv.slice(2), { string: ['_'] })
let projectName = argv._[0]
let defaultProjectName = projectName ? projectName : 'test-project'

const templatesData: Object = readJsonFile(path.join(__dirname, './templatesData.json'))
const promptsOptions: Array<any> = handleOptions(templatesData)

const promptsArray: Array<any> = [
  {
    name: 'projectName',
    type: projectName ? null : 'text',
    message: 'Project name:',
    initial: defaultProjectName,
    onState: (state: any) => (projectName = String(state.value).trim() || defaultProjectName)
  }
]

async function init() {
  let promptsResult = await prompts(promptsArray.concat(promptsOptions))

  const config: configType = {
    projectName: promptsResult['projectName'],
    template: promptsResult['templateName'],
    ejsVarAilas: 'config-text.js',
    options: promptsResult['options']
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
