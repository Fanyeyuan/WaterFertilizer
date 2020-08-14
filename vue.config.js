module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessWatch: ['src/app/**/*.ts'],
      preload: './src/app/common/preload.ts'
    }
  },
  lintOnSave: false
}
