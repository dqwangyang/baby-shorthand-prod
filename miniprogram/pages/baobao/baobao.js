const db = wx.cloud.database();
var db_util = require('../../utils/util.js');
Page({
    data: {
      pageList: [],
      pageSize:5,
      pageIndex:0,
      active:"a",
      myPageList: [],
      myPageSize:5,
      myPageIndex:0,
      animationList:[]
    },
    onTabsChange(event){
      const tabName=event.detail.name
        this.setData({
          active:tabName
        })
        if(tabName == 'b'){
          if(this.data.myPageList.length<=0){
            this.getImages(this.data.myPageIndex,"b")
          }
        }
    },
     onLoad(options){       
      let user = wx.getStorageSync("userInfo");
		if (user == null || user._id == null || user._id == "") {
			wx.showModal({
				title: '提示',
				content: '您还没有登录',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						wx.redirectTo({
							url: '/pages/index/index',
						})
					}
				}
			})
			return;
        }
        let pageIndex = this.data.pageIndex
        this.getImages(pageIndex,"a")
    },
    onShow(){
    },
      getImages(pageIndex,tabName){
        let list =[]
        let that=this
        wx.showLoading({
            title: '加载中',
        })
        const user = wx.getStorageSync("userInfo");

        let userId=''
        if(tabName=="b"){
          userId=user._id
        }
        db_util.getImages( this.data.pageSize,pageIndex,userId, function(res) {
            if(res.length<=0){
                wx.showToast({
                  title: '没有更多了～',
                })
                let pIndex = pageIndex -1
                if(tabName == "b"){
                  that.setData({
                    myPageIndex: pIndex
                }) 
                }else{
                that.setData({
                    pageIndex: pIndex
                })          
              }             
            }else{
            for(let i in res){
                let item ={};
                item.id=res[i]._id
                item.name = res[i].nick_name
                item.avatar = res[i].avatar_url
                item.title =res[i].title 
                item.likeCount = res[i].likeCount
                item.userId = res[i].user_id
                const images = res[i].images         
                item.url= images.length > 0 ? images[0].url: "cloud://mengmeng-8swro.6d65-mengmeng-8swro-1302795357/babay_image/215B21g7yS1qvzlu31669127298442.jpeg"
                item.images =images
                if(item.images.length<= 0){
                    item.images.push({
                        url:item.url
                    })
                }
                item.createTime=res[i].create_time
                 list.push(item)
                
            }
            if(pageIndex>0){         
               let pageList = that.data.pageList
               if(tabName=='b'){
                pageList = that.data.myPageList
               }
               list =  pageList.concat(list)
            }   
            if(tabName == "a"){
              that.setData({
                pageList:list
            })
            }else{
              that.setData({
                myPageList:list
            })
            }
           
        }
           wx.stopPullDownRefresh()
            wx.hideLoading({
                complete: (res) => {},
            })
           
        })
    },
    heartClick(e){
      const userId = e.currentTarget.dataset.userid
      const index = e.currentTarget.dataset.index
      let user = wx.getStorageSync("userInfo");
      if(user._id == userId){
        wx.showToast({
          title: '不能给自己点赞～',
          icon:'error'
        })
        return 
      }
// 顺时针旋转实例
var animation = wx.createAnimation({
  duration: 1000,
  timingFunction: 'ease'
})
// 逆时针旋转实例
var animation1 = wx.createAnimation({
  duration: 10,
  timingFunction: 'ease'
})

animation.rotate(450).step()
this.setData({
  animationData: animation.export()
})
setTimeout(function () {
  animation1.rotate(0).step()
  this.setData({
    animationData: animation1.export()
  })
}.bind(this), 300);

        const id = e.currentTarget.dataset.id
       
        //点赞 增加一条点赞记录
        let heart = {}
        heart.babayImageId=id
        heart.openId=user.openId
        heart.createTime=db_util.getLocalTime(new Date().getTime())
        const that =this
        db_util.add('mm_babay_images_hearts', heart, function(_id) {
            //查询最新点赞数
                    db_util.updateLike(id,function(res){})
                      //页面直接+1，不在进行查询
                      let dataList = that.data.pageList
                      if(that.data.active == 'b'){
                        dataList = that.data.myPageList
                      }
                      let newDataList=[];
                      for(let i in dataList){
                         let newItem =dataList[i];
                         if(newItem.id== id){                               
                             newItem.likeCount += 1 
                         }
                         newDataList.push(newItem)
                      }
                      if(that.data.active == 'b'){
                        that.setData({
                          myPageList:newDataList
                      })
                      }else{
                        that.setData({
                          pageList:newDataList
                      })
                      }
                     
        })       
    },
    previewImage (e){
        const current = e.currentTarget.dataset.item;
        var imgList = [];
        for (let i = 0; i < current.length; i++) {
         imgList.push(current[i].url);
        }
        wx.previewImage({
         current: current,//当前点击的图片链接
         urls: imgList//图片数组
        })
    },
    toAdd:function(){
        wx.navigateTo({
            url: '/pages/add/add',
        })
    },
     onPullDownRefresh(){
       if(this.data.active == "b"){
        this.setData({
          myPageIndex:0,
          pageSize:5,
      })
       }else{
        this.setData({
            pageIndex:0,
            pageSize:5,
        })
      }
       this.getImages(0,this.data.active)        
    },
    /**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
        let   pageIndex= this.data.pageIndex + 1
        if(this.data.active =="b"){
          pageIndex = this.data.myPageIndex + 1
          this.setData({
            myPageIndex:pageIndex,
            pageSize:5,
        })
        }else{
          this.setData({
            pageIndex:pageIndex,
            pageSize:5,
        })
        }
       
       this.getImages(pageIndex,this.data.active)  
  },
  onShareAppMessage: function() {

		
	},
  })