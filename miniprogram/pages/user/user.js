// miniprogram/pages/user/user.js
var db_util = require('../../utils/util.js');
Page({
  

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    userInfo:{},
    nickName:"",
    updateImage:false,
    updateNickName:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync("userInfo");
    const version = wx.getSystemInfoSync().SDKVersion
    let f= this.compareVersion(version,'2.21.2');

     if(f<0){
        wx.showModal({
          title:'提示',
          content:'当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
          showCancel:false,
          success(res) {
            if (res.confirm) {
             wx.navigateBack({
               delta: 1,
             })
              
            }
          }
        })
     }
        this.setData({
      userInfo:user,
      avatarUrl:user.avatar_url,
      nickName:user.nick_name
    });
  },
   compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
  
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
  
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
  
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
  
    return 0
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.upLoadFile(avatarUrl,'head');
   
  },
   /** 
   * 上传文件封装函数, 文件名随机性处理，由17位随机字符+13位时间戳组成
   * @param {string} filePath 要上传图片的临时路径
   * @param {string} cloudPathPrefix 云数据库存储文件路径前缀
   */
  upLoadFile(filePath, cloudPathPrefix) {
    // 取随机名
    let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomStr = '';
    for (let i = 17; i> 0; --i) {
      randomStr += str[Math.floor(Math.random() * str.length)];
    }
    randomStr += new Date().getTime();

    return new Promise((resolve, reject)=>{
      let suffix = /\.\w+$/.exec(filePath)[0] //正则表达式返回文件的扩展名
      let cloudPath = cloudPathPrefix + '/' + randomStr + suffix
      let that=this;
      wx.showLoading({
        title: '上传中...',
      })
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath,
        success(res) {
          resolve(res);
          that.setData({
            avatarUrl:res.fileID,
            updateImage:true    

          });
          wx.hideLoading();

        },
        fail(err) {
          resolve(false)
         wx.showToast({
           title: '修改失败',
           icon:"error",
           duration:2000
         });

        },
      });
    });
  },
    nickInput(e){
    this.setData({
      nickName:e.detail.value,
      updateNickName:true
    });
  },

 
    updateUser(){
    let userInfo=this.data.userInfo;
    
    if(this.data.updateImage){
      userInfo.avatar_url= this.data.avatarUrl;
    }
    if(this.data.updateNickName){
      userInfo.nick_name=this.data.nickName;
    }
    if(this.data.updateNickName||this.data.updateImage){
      db_util.updateUser( userInfo.nick_name,userInfo.avatar_url,userInfo._id,function(res) {       
        wx.setStorageSync("userInfo",userInfo);
        wx.navigateBack({
          delta: 1,
        })
      
    });
    }else{
      wx.showToast({
        title: '您没有做任何修改！',
        icon:"none",
        duration:2000
      });
    }   

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})