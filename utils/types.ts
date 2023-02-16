export type DeepRequired<T> = {
  [K in keyof T]: Required<DeepRequired<T[K]>>
}

export type configTypeDeepRequired = Required<DeepRequired<configType>>

export type configType = {
  // 项目名
  projectName: string

  // 模板名
  template: string

  // 模板详细文件夹别名
  dirAlias?: {
    // 基础文件夹
    base?: string
    // 选项文件夹
    options?: string
    // ejs模板文件夹
    ejs?: string
  }

  // ejs值的别名
  ejsVarAilas?: string

  // 选项文件夹名列表
  options?: Array<string>
}
