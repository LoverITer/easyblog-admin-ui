module.exports = {
  lintOnSave: false,
  //自定义不同环境下得打包入口
  chainWebpack: config => {

    //发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
    })

    //开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
