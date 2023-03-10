import fs from 'fs'
import minimist from 'minimist'
import path from 'path'
import prompts from 'prompts'
import { configType, configTypeDeepRequired, deepAssign, readJsonFile } from './utils'
import { defaultConfig } from './utils/defaultConfig'

const argv = minimist(process.argv.slice(2), { string: ['_'] })
let projectName = argv._[0]
let defaultProjectName = projectName ?? 'test-project'

const autoImport = (defaultConfig: configTypeDeepRequired) => {
  const { templatesRoot, dirAlias } = defaultConfig

  const templatesData = {} as any
  let projectNames = fs.readdirSync(templatesRoot)

  projectNames.forEach((value) => {
    templatesData[value] = { title: value }
    templatesData[value]['options'] = []

    const optionsPath = path.join(templatesRoot, value, dirAlias.options)

    if (fs.existsSync(optionsPath)) {
      fs.readdirSync(optionsPath).forEach((v2) => {
        templatesData[value]['options'].push({
          title: v2,
          value: v2
        })
      })
    }
  })

  return templatesData
}

const handleOptions = (autoLoad: boolean, defaultConfig: configTypeDeepRequired) => {
  let data: any = autoLoad ? autoImport(defaultConfig) : readJsonFile(path.join(__dirname, './templatesData.json'))

  const options = []

  let obj = {
    type: 'select',
    name: 'templateName',
    message: 'Pick template',
    choices: [] as Array<any>
  }
  Object.keys(data).map((k) => {
    const title = data[k]['title']
    const value = k
    obj.choices.push({ title, value })
  })
  options.push(obj)

  options.push({
    type: (prev: any) => (data[prev]['options']?.length > 1 ? 'multiselect' : null),
    name: 'options',
    message: 'Pick options',
    choices: (prev: any) => data[prev]['options']
  })

  return options
}

export const inquiry = async (autoLoad: boolean = false): Promise<configType> => {
  const templatesRoot = path.resolve(__dirname, './templates')
  const initConfig = deepAssign(defaultConfig, {
    templatesRoot
  } as Partial<typeof defaultConfig>)

  const promptsOptions: Array<any> = handleOptions(autoLoad, initConfig)

  const promptsArray: Array<any> = [
    {
      name: 'projectName',
      type: projectName ? null : 'text',
      message: 'Project name:',
      initial: defaultProjectName,
      onState: (state: any) => (projectName = String(state.value).trim() || defaultProjectName)
    },
    ...promptsOptions
  ]

  let promptsResult = (await prompts(promptsArray)) as {
    projectName: string
    templateName: string
    options: Array<string>
  }

  promptsResult.projectName = promptsResult.projectName ?? defaultProjectName

  const config: configType = deepAssign(initConfig, {
    projectName: promptsResult['projectName'],
    templateName: promptsResult['templateName'],
    options: promptsResult['options']
  })

  return config
}
