var db_util = require('../../utils/util.js');
import Notify from '@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    message:"",
    activeNames: []

  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  bugInput:function(e){
    let message=this.data.message;
    message=e.detail;
    this.setData({
      message:message
    });
  },
  bugSubmit:function(e){
    let user=wx.getStorageSync('userInfo');
    if(user!=null&&user._id!=null&&user._id!=""){
      let bugs={}; 
      bugs.text=this.data.message;
      bugs.user_id=user._id;
      if(bugs.text==''){
        Notify({ type: 'danger',background:"#FF9DCA", message: '请输入问题建议' });    
          return;
      }
      bugs.create_time=db_util.getLocalTime(new Date().getTime());
      let me=this;
    db_util.add('mm_bugs',bugs,function(e){
      Notify({ type: 'danger',background:"#FF9DCA", message: '提交成功!' });
      me.setData({
        message:""
      });

    });
  }else{  
    Notify({ type: 'danger',background:"#FF9DCA", message: '您还没有登录哦' });    

    }
    
  },
  onTabbarChange(event){
    if(event.detail==0){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }if(event.detail==1){
wx.redirectTo({
url: '/pages/search/search',
})
    } if(event.detail==2){
      wx.redirectTo({
        url: '/pages/charts/charts',
      })
            }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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