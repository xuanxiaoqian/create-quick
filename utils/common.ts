import fs from 'fs'
import path from 'path'

const isObject = (val: any) => val && typeof val === 'object'

// 数组去重
const mergeArrayWithDedupe = (a: Array<any>, b: Array<any>) => Array.from(new Set([...a, ...b]))

// 递归 将新对象的内容合并到现有对象
export function deepMerge(target: any, obj: any) {
  for (const key of Object.keys(obj)) {
    const oldVal = target[key]
    const newVal = obj[key]

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      target[key] = mergeArrayWithDedupe(oldVal, newVal)
    } else if (isObject(oldVal) && isObject(newVal)) {
      target[key] = deepMerge(oldVal, newVal)
    } else {
      target[key] = newVal
    }
  }

  return target
}

// 将json数据的属性排一下序
export default function sortDependencies(packageJson: any) {
  const sorted: any = {}

  const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {}

      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          sorted[depType][name] = packageJson[depType][name]
        })
    }
  }

  return {
    ...packageJson,
    ...sorted
  }
}

/**
 * 读取指定路径下 json 文件
 * @param filename json 文件的路径
 */
export function readJsonFile<T>(filename: string): T {
  return JSON.parse(fs.readFileSync(filename, { encoding: 'utf-8' }))
}

/**
 * 递归目录,以回调函数的形式传递参数
 * @param targetPath 目标文件路径
 * @param newTargetPath 需要复制的目标路径
 * @param fn 回调函数
 * @returns
 */
export function recursionDir(
  targetPath: string,
  fn: (data: { path: string; isDir: boolean }) => void
) {
  if (!fs.existsSync(targetPath)) {
    return false
  }
  const stats = fs.statSync(targetPath)

  fn({ path: targetPath, isDir: stats.isDirectory() })

  if (stats.isDirectory()) {
    for (const file of fs.readdirSync(targetPath)) {
      recursionDir(path.resolve(targetPath, file), fn)
    }
  }
}

/**
 * 合并两个package.json内容至newTargetPath
 * @param targetPath 目标package.json路径
 * @param newTargetPath 合并至package.json路径
 */
export const mergePackage = (targetPath: string, newTargetPath: string) => {
  const filename = path.basename(targetPath)

  if (filename === 'package.json' && fs.existsSync(newTargetPath)) {
    const existing = JSON.parse(fs.readFileSync(newTargetPath, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(targetPath, 'utf8'))
    const pkg = sortDependencies(deepMerge(existing, newPackage))
    fs.writeFileSync(newTargetPath, JSON.stringify(pkg, null, 2) + '\n')
  }
}
