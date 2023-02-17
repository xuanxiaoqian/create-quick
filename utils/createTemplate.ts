import ejs from 'ejs'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { mergePackage, readJsonFile, recursionDir } from './common'
import { defaultConfig } from './defaultConfig'
import { configType, configTypeDeepRequired } from './types'

/**
 * 用于创建渲染项目
 * @param config 配置参数
 * @param templatesRoot 模板位置
 * @param fn 执行完成的回调函数
 */
export const createTemplate = (
  config: configType,
  templatesRoot: string,
  fn?: (data: { newProjectPath: string; config: configType }) => void
) => {
  config = Object.assign(defaultConfig, config)

  const { projectName, dirAlias, template, ejsVarAilas, options } = config as configTypeDeepRequired

  const newProjectPath = path.join(process.cwd(), projectName)

  const curTemplate = path.join(templatesRoot, template)
  const curBase = path.join(curTemplate, dirAlias.base)
  const curOptions = path.join(curTemplate, dirAlias.options)
  const curEjs = path.join(curTemplate, dirAlias.ejs)

  const ejsData: any = {}

  renderBase(curBase, newProjectPath)

  initOptionsEjsData(curOptions, { ejsVarAilas: ejsVarAilas, ejsData })

  //copy optionsDir and ejsData
  options?.map((item) => {
    const curItemPath = path.join(curOptions, item)
    let fn: Function | any

    if (!fs.existsSync(curItemPath)) {
      return false
    }

    fse.copySync(curItemPath, newProjectPath, {
      filter(src, dest) {
        const basename = path.basename(src)

        switch (basename) {
          case 'node_modules':
            return false
          case 'package.json':
            mergePackage(src, dest)
            return false
          case ejsVarAilas:
            const optionEjsData = require(src)

            Object.keys(optionEjsData).map((key) => {
              if (typeof optionEjsData[key] === 'function') {
                fn = optionEjsData[key]
                return
              }

              const curData = optionEjsData[key]
              ejsData[key] += curData
            })
            return false

          default:
            return true
        }
      }
    })

    if (typeof fn === 'function') {
      fn(newProjectPath, config)
    }
  })

  renderEjs(curEjs, newProjectPath, { ejsData })

  endFolw(newProjectPath)

  if (typeof fn === 'function') {
    fn({ newProjectPath, config })
  }
}

//copy baseDir
const renderBase = (curBase: string, newProjectPath: string) => {
  fse.copySync(curBase, newProjectPath, {
    filter(src) {
      const basename = path.basename(src)

      return basename !== 'node_modules'
    }
  })
}

// 递归初始化ejs的值,防止ejs模板undefind报错
const initOptionsEjsData = (targetPath: string, config: { ejsVarAilas: string; ejsData: any }) => {
  if (!fs.existsSync(targetPath)) {
    return false
  }

  const { ejsVarAilas, ejsData } = config

  recursionDir(targetPath, (data) => {
    const filename = path.basename(data.path)

    if (filename === ejsVarAilas) {
      const optionEjsData = require(data.path)

      Object.keys(optionEjsData).map((k) => {
        ejsData[k] = ''
      })
    }
  })
}

// 递归渲染ejs
const renderEjs = (targetPath: string, newPath: string, config: { ejsData: any }) => {
  if (!fs.existsSync(targetPath)) {
    return false
  }

  const { ejsData } = config
  recursionDir(targetPath, (data) => {
    const basename = path.basename(data.path)

    if (basename === 'node_modules') {
      return false
    }

    try {
      ejs.renderFile(data.path, ejsData, (err: Error | null, str: string) => {
        if (err) {
          return
        }

        const renderEjsPath = path.join(newPath, path.relative(targetPath, data.path))

        let deleteEjsSuffix = renderEjsPath.split('.')
        deleteEjsSuffix.pop()

        fs.writeFileSync(deleteEjsSuffix.join('.'), str)
      })
    } catch (error) {
      console.log(error)
    }
  })
}

// 最后结束要做的事
const endFolw = (targetPath: string) => {
  // TODO:: 修改package.json信息
  const RootPackageJsonPath = path.join(targetPath, 'package.json')

  if (fs.existsSync(RootPackageJsonPath)) {
    let _data: any = readJsonFile(RootPackageJsonPath)
    _data.name = path.basename(targetPath)
    _data.version = '0.0.0'
    _data.private = _data.private ? false : _data.private

    let str = JSON.stringify(_data, null, 2)
    fs.writeFileSync(RootPackageJsonPath, str)
  }
}
