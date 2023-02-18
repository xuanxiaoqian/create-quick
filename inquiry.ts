import minimist from 'minimist'
import path from 'path'
import prompts from 'prompts'
import { configType, readJsonFile } from './utils'

const argv = minimist(process.argv.slice(2), { string: ['_'] })
let projectName = argv._[0]
let defaultProjectName = projectName ? projectName : 'test-project'

const handleOptions = (data: any) => {
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
    type: (prev: any) => (data[prev]['options'].length > 1 ? 'multiselect' : null),
    name: 'options',
    message: 'Pick options',
    choices: (prev: any) => data[prev]['options']
  })

  return options
}

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

export const inquiry = async (): Promise<configType> => {
  let promptsResult = (await prompts(promptsArray.concat(promptsOptions))) as {
    projectName: string
    templateName: string
    options: Array<string>
  }

  promptsResult.projectName = promptsResult.projectName
    ? promptsResult.projectName
    : defaultProjectName

  const config: configType = {
    projectName: promptsResult['projectName'],
    template: promptsResult['templateName'],
    ejsVarAilas: 'config-text.js',
    options: promptsResult['options']
  }

  return config
}
