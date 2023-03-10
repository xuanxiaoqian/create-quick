import ejs from 'ejs'
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path'
import { deepAssign, joinPath, mergePackage, myTypeof, readJsonFile, recursionDir } from './common'
import { defaultConfig } from './defaultConfig'
import { allConfigType, configType, configTypeDeepRequired } from './types'

/**
 * 用于创建渲染项目
 * @param config 配置参数
 * @param templatesRoot 模板位置
 * @param fn 执行完成的回调函数
 */
export const createTemplate = (config: configType, fn?: (data: allConfigType) => void) => {
  config = deepAssign(defaultConfig, config)

  const { projectName, templatesRoot, dirAlias, templateName, ejsDataJsAlias, options } =
    config as configTypeDeepRequired

  const targetPath = path.join(process.cwd(), projectName)
  const templateBasePath = joinPath(path.join(templatesRoot, templateName))

  const basePath = templateBasePath(dirAlias.base)
  const optionsPath = templateBasePath(dirAlias.options)
  const ejsPath = templateBasePath(dirAlias.ejs)

  const allConfig = {
    targetPath,
    basePath,
    optionsPath,
    ejsPath,
    ejsDataJsAlias,
    options,
    config,
    ejsData: {}
  }

  renderBase(allConfig)

  initOptionsEjsData(allConfig)

  renderOptions(allConfig)

  renderEjs(allConfig)

  endFolw(allConfig)

  if (typeof fn === 'function') {
    fn(allConfig)
  }
}

const renderBase = (allConfig: allConfigType) => {
  const { basePath, targetPath } = allConfig

  fse.copySync(basePath, targetPath, {
    filter(src) {
      const basename = path.basename(src)

      return basename !== 'node_modules'
    }
  })
}

// 递归初始化ejs的值,防止ejs模板undefind报错
const initOptionsEjsData = (allConfig: allConfigType) => {
  const { optionsPath, ejsDataJsAlias, ejsData } = allConfig

  if (!fs.existsSync(optionsPath)) {
    return false
  }

  recursionDir(optionsPath, (data) => {
    const filename = path.basename(data.path)

    if (filename === ejsDataJsAlias) {
      const optionEjsData = require(data.path)

      Object.keys(optionEjsData).map((k) => {
        const curData = optionEjsData[k]

        switch (myTypeof(curData)) {
          case 'function':
            ejsData[k] = new Function()
            break
          case 'array':
            ejsData[k] = []
            break
          default:
            ejsData[k] = ''
            break
        }
      })
    }
  })
}

const renderOptions = (allConfig: allConfigType) => {
  const { options, optionsPath, targetPath, ejsDataJsAlias, ejsData } = allConfig

  options?.map((item: any) => {
    const curItemPath = path.join(optionsPath, item)
    let fn: Function | any

    fse.copySync(curItemPath, targetPath, {
      filter(src, dest) {
        const basename = path.basename(src)

        switch (basename) {
          case 'node_modules':
            return false
          case 'package.json':
            mergePackage(src, dest)
            return false
          case ejsDataJsAlias:
            const optionEjsData = require(src)

            Object.keys(optionEjsData).map((key) => {
              let curData = optionEjsData[key]

              switch (myTypeof(curData)) {
                case 'function':
                  fn = curData
                  break
                case 'array':
                  ejsData[key] = [...ejsData[key], ...curData]
                  break
                default:
                  ejsData[key] += curData
                  break
              }
            })
            return false
          default:
            return true
        }
      }
    })

    if (typeof fn === 'function') {
      fn(allConfig)
    }
  })
}

// 递归渲染ejs
const renderEjs = (allConfig: allConfigType) => {
  const { targetPath, ejsPath, ejsData } = allConfig

  if (!fs.existsSync(ejsPath)) {
    return false
  }

  recursionDir(ejsPath, (data) => {
    const basename = path.basename(data.path)

    if (basename === 'node_modules') {
      return false
    }

    try {
      ejs.renderFile(data.path, ejsData, (err: Error | null, str: string) => {
        if (err) {
          return
        }

        const renderEjsPath = path.join(targetPath, path.relative(ejsPath, data.path))

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
const endFolw = (allConfig: allConfigType) => {
  const { targetPath } = allConfig

  const RootPackageJsonPath = path.join(targetPath, 'package.json')

  if (fs.existsSync(RootPackageJsonPath)) {
    let _data: any = readJsonFile(RootPackageJsonPath)
    _data.name = path.basename(targetPath)
    _data.version = '1.0.0'
    _data.private = _data.private ? false : _data.private

    let str = JSON.stringify(_data, null, 2)
    fs.writeFileSync(RootPackageJsonPath, str)
  }
}
