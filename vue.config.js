module.exports = {
  pluginOptions: {
    electronBuilder: {
      mainProcessWatch: ['src/app/**/*.ts'],
      preload: 'src/preload.ts'
    }
  },
  lintOnSave: false
}
