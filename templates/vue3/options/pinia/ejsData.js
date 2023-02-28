module.exports = {
  descripts: 'pinia',
  importList: `import pinia from '@/store/index' \n`,
  useList: `app.use(pinia) \n`,
  arr: [123],
  callback({ targetPath, config, ejsData }) {
    console.log(targetPath, config, ejsData)
  }
}
