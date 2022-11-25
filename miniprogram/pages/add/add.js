var db_util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [ ],
        title:''
        // context:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    afterRead(event) {
        const { file } = event.detail;   
        let that =this   
        let user = wx.getStorageSync("userInfo");
        if(this.data.fileList.length>=3){
            wx.showToast({
                icon:'error',
              title: '最多上传3张图片～',
            })
            return
        }
       // 云函数调用
            wx.showLoading({
                title: '上传中...',
            })
            wx.cloud.callFunction({
                name: 'check', // 这里是咱们创建的云函数名称 叫check
                data: {
                    imgData: wx.cloud.CDN({
                        type: 'filePath',
                        filePath: file.path, // img 是你的临时文件的路径 
                    }),
                    openId:user.open_id	
                },
                success(res){
                    that.upLoadFile(file.path,"babay_image",res.result.traceId) 
                },
                fail(res){
                    console.info(res)
                    wx.showModal({
                        title: '',
                        content: '上传失败，请重试～',
                        duration: 3000,
                        showCancel:false,
                        success :function(){}
                  })
                }                
            })
      },
       /** 
   * 上传文件封装函数, 文件名随机性处理，由17位随机字符+13位时间戳组成
   * @param {string} filePath 要上传图片的临时路径
   * @param {string} cloudPathPrefix 云数据库存储文件路径前缀
   */
  upLoadFile(filePath, cloudPathPrefix,traceId) {
    // 取随机名
    let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomStr = '';
    for (let i = 17; i> 0; --i) {
      randomStr += str[Math.floor(Math.random() * str.length)];
    }
    randomStr += new Date().getTime();

    return new Promise((resolve, reject)=>{
      let suffix = /\.\w+$/.exec(filePath) //正则表达式返回文件的扩展名
      let cloudPath = cloudPathPrefix + '/' + randomStr + suffix
      let that=this;
     
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: filePath,
        success(res) {
          resolve(res);
          const url=res.fileID;
          const files=that.data.fileList;
          files.push({
              url:url,
              traceId:traceId,
              show:false
          });     
          that.setData({
              fileList:files
          })  
          wx.hideLoading();

        },
        fail(err) {
          resolve(false)
         wx.showToast({
           title: '上传失败',
           icon:"error",
           duration:2000
         });

        },
      });
    });
  },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },
    deleteImg(event){
        const index= event.detail.index
        let files = this.data.fileList
        let newFiles=[]
        for(let i in files){
            if(i != index){
                newFiles.push(files[i])
            }
        }
     
        this.setData({
            fileList:newFiles
        })
    },
  add(){
    let user = wx.getStorageSync("userInfo");
     let babyImages = {};
    babyImages.title = this.data.title
    // babyImages.context = this.data.context
    if(babyImages.title == ''){
        wx.showToast({
            icon:'error',
          title: '请输入内容',
        })
        return
    }
    if(babyImages.context == ''){
        wx.showToast({
            icon:'error',
        title: '请输入内容',
        })
        return
    }
    if(this.data.fileList.length <= 0){
        wx.showToast({
            icon:'error',
          title: '请至少上传一张图片～',
        })
        return
    }
    if(this.data.fileList.length>3){
        wx.showToast({
            icon:'error',
          title: '最多上传3张图片～',
        })
        return
    }
    babyImages.create_time = db_util.getLocalTime(new Date().getTime());
    babyImages.user_id = user._id
    babyImages.nick_name = user.nick_name
    babyImages.avatar_url = user.avatar_url
    babyImages.likes=0
    let fs=this.data.fileList
    db_util.add('mm_babay_images', babyImages, function(_id) {    
        for(let i in fs){
            let item=fs[i]
            item.image_id=_id
            db_util.add('mm_images', item, function(_id) { })
        }
        
        wx.showModal({
          title: '',
          content: '发布成功，内容审核中，请等待～',
          duration: 3000,
          showCancel:false,
          success :function(){           
            wx.navigateBack({
                delta: 1,
            })
          }
        })
        })}, 
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})