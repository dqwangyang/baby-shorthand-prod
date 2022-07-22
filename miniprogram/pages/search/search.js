var db_util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDayList:false,
    currentDate: new Date().getTime(),
    defaultDate:db_util.formatTime(new Date(),'Y-M-D'),
    recordList:[],
    activeNames: ['0']
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  dayListConfirm(event) {
    var t=event.detail;
    var selectTime=db_util.getLocalTime(t);
    let childId=wx.getStorageSync('child_id');
    this.setData({
      showDayList:false,
      defaultDate:db_util.formatTime(new Date(selectTime.replace(/-/g,'/')),'Y-M-D')
    });
    let me=this;
    wx.showLoading({
      title: '加载中',
    })
    db_util.getRecordsBySearchTime(selectTime,childId,function(res){
         me.getShowRecords(res);       

        wx.hideLoading({
          complete: (res) => {},
        })
    })
  },
  dayListClick(){
    this.setData({
      showDayList:true
    });
  },
  dayListCancel(event) {
   this.setData({
     showDayList:false
   });
  },
  onTabbarChange(event){
    if(event.detail==0){
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
    if(event.detail==3){
      wx.redirectTo({
        url: '/pages/about/about',
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
    var selectTime=this.data.defaultDate;
    let childId=wx.getStorageSync('child_id');
    let me=this;
    wx.showLoading({
      title: '加载中',
    })
    db_util.getRecordsBySearchTime(selectTime,childId,function(res){        
          me.getShowRecords(res);   
          wx.hideLoading({
            complete: (res) => {},
          })    
    })
  },

  getShowRecords(records){
    let timeList=[];
    let ls={};
    let recordGroups=[];
    let allList=[];
   for(let i in records){
     let item=records[i];
     let showTime=db_util.formatTime(new Date(item.seach_time),'Y-M-D');
     let recordGroup={};
     if(timeList.indexOf(showTime)<0){
       timeList.push(showTime);   
       recordGroup={};
       recordGroups=[];
       ls={};
        ls.headTime=showTime;       
        recordGroup.name=item.name;
        recordGroup.showTime=db_util.formatTime(new Date(item.seach_time),'h:m');
        recordGroup.text1=item.text1;
        recordGroup.text2=item.text2;
        recordGroup.text3=item.text3;
        recordGroup.text4=item.text4;
        recordGroup.id=item._id;
        recordGroup.icon=item.icon;
        recordGroups.push(recordGroup);
        ls.recordGroups=recordGroups;
        allList.push(ls);
     }else{       
        ls.headTime=showTime;       
        recordGroup.name=item.name;
        recordGroup.showTime=db_util.formatTime(new Date(item.seach_time),'h:m');
        recordGroup.text1=item.text1;
        recordGroup.text2=item.text2;
        recordGroup.text3=item.text3;
        recordGroup.text4=item.text4;
        recordGroup.id=item._id;

        recordGroup.icon=item.icon;
        recordGroups.push(recordGroup);
        ls.recordGroups=recordGroups;
     }
    
   }
      console.info(allList);

        for(let i in allList){
          let recordGroups=allList[i].recordGroups;
          let weinaiList=[];
          let xinaiList=[];
          let xizaoList=[];
          let chiyaoList=[];
          let fushiList=[];
          let niaobuList=[];
          let qitaList=[];
          let shuijiaoList=[];
          let daySum={};

          for(let j in recordGroups){
              let item=recordGroups[j];
              if(item.name=='喂奶'){
                let weinai={};
                weinai.showTime=item.showTime;
                weinai.quantity=item.text2;
                weinai.location=item.text1;
                weinai.icon=item.icon;
                weinaiList.push(weinai);
              }
              if(item.name=='吸奶'){
                let xinai={};
                xinai.showTime=item.showTime;
                xinai.quantity=item.text2;
                xinai.location=item.text1;
                xinai.icon=item.icon;
                xinaiList.push(xinai);
              }
              if(item.name=='洗澡'){
                let xizao={};
                xizao.showTime=item.showTime;               
                xizao.memoto=item.text2;
                xizao.icon=item.icon;
                xizaoList.push(xizao);
              }
              if(item.name=='其它'){
                let qita={};
                qita.showTime=item.showTime;               
                qita.memoto=item.text2;
                qita.icon=item.icon;
                qitaList.push(qita);
              }
              if(item.name=='换尿布'){
                let niaobu={};
                niaobu.showTime=item.showTime;               
                niaobu.memoto=item.text2;
                niaobu.icon=item.icon;;
                niaobuList.push(niaobu);
              }
              if(item.name=='吃药'){
                let chiyao={};
                chiyao.showTime=item.showTime;               
                chiyao.text1=item.text1;    
                chiyao.icon=item.icon;           
                chiyaoList.push(chiyao);
              }
              if(item.name=='辅食'){
                let fushi={};
                fushi.showTime=item.showTime;               
                fushi.text1=item.text1; 
                fushi.quantity=item.text2;   
                fushi.icon=item.icon;           
                fushiList.push(fushi);
              }
              if(item.name=='睡觉'){
                let shuijiao={};
                shuijiao.showTime=item.showTime;    
                shuijiao.icon=item.icon;           
                shuijiao.text1=Math.round((new Date(item.text2.replace(/-/g,'/')).getTime() - new Date(item.text1.replace(/-/g,'/')).getTime()) / (1000 * 60 * 60 )*100/100);     
                  shuijiaoList.push(shuijiao);
              }
              
          }
          allList[i].weinaiList=weinaiList;             
              for(let s in weinaiList){
                daySum.weinaiCount=weinaiList.length;
                daySum.weinaiQuantity=(daySum.weinaiQuantity||0)+(weinaiList[s].quantity*1);
              }
              allList[i].xinaiList=xinaiList;
              for(let s in xinaiList){
                daySum.xinaiCount=xinaiList.length;
                daySum.xinaiQuantity=(daySum.xinaiQuantity||0)+(xinaiList[s].quantity*1);
              }
              allList[i].fushiList=fushiList;
              for(let s in fushiList){
                daySum.fushiCount=fushiList.length;
                daySum.fushiQantity=(daySum.fushiQantity||0)+(fushiList[s].quantity*1);
              }
              allList[i].chiyaoList=chiyaoList;
             daySum.chiyaoCount=chiyaoList.length;
              
              allList[i].shuijiaoList=shuijiaoList;
              for(let s in shuijiaoList){
                daySum.shuijiaoCount=shuijiaoList.length;
                daySum.shuijiaoHours=(daySum.shuijiaoHours||0)+(shuijiaoList[s].text1*1);
              }
              allList[i].niaobuList=niaobuList;
                daySum.niaobuCount=niaobuList.length;
            
              allList[i].xizaoList=xizaoList;
                daySum.xizaoCount=xizaoList.length;
            
              allList[i].qitaList=qitaList;
              daySum.qitaCount=qitaList.length;

              allList[i].daySum=daySum;
        }
       this.setData({
         recordList:allList
       });
console.info(allList);
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