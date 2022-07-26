//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

     //版本更新
     if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
       if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
         wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
           if (res.confirm) {
            updateManager.applyUpdate()
           }
          }
         })
        })
        updateManager.onUpdateFailed(function () {
         wx.showModal({
          title: '已经有新版本了',
          content: '新版本已经上线啦~，请您重新启动客户端~'
         })
        })
       }
      })
     } else {
      wx.showModal({
       title: '提示',
       content: '当前客户端版本过低，无法使用该功能，请升级到最新版本后重试。'
      })
     }


    this.globalData = {}
  },
   // URL:"http://192.168.0.104:8080/weixin"

  //URL:"http://zhiniao.vipgz1.idcfengye.com"
  //URL:"https://wx.25youshi.com"
  
})
