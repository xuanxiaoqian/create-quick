module.exports = {
  descripts: 'pinia',
  importList: `import pinia from '@/store/index' \n`,
  useList: `app.use(pinia) \n`,
  callback(traget, config) {
    console.log(traget)
    console.log(config)
  }
}
