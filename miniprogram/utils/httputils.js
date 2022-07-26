/**
 * 请求头
 */
const app = getApp();


/**
 * 供外部post请求调用  
 */
function post(url, params, onSuccess, onFailed) {
  request(url, params, "POST", onSuccess, onFailed);

}

/**
 * 供外部get请求调用
 */
function get(url, params, onSuccess, onFailed) {
  request(url, params, "GET", onSuccess, onFailed);
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 */

function request(url, params, method, onSuccess, onFailed) {
 
     let user= wx.getStorageSync("user");
  var header = {
    'content-type': 'application/json',
    'Authorization':  wx.getStorageSync("user").id, 
  }
  if(user==null||user==''||user=='null'){
    header = {
      'content-type': 'application/json',
      'Authorization':  '', 
    }
  }
  if(url!=app.URL+"/tool/log"&&url!=app.URL+"/daka/mini/days21/playLog"){
    wx.showLoading({
      title: '',
    })
  }
  
  wx.request({
    url: url,
    data: dealParams(params),
    method: method,
    header: header,
    success: function(res) {
      wx.hideLoading();
      if (res.data) {
        /** start 根据需求 接口的返回状态码进行处理 */
        if (res.statusCode == 200&&res.data.type=='info') {
          onSuccess(res.data); //request success
        } else {
          onFailed(res.data); //request failed
          // wx.showToast({
          //   title: res.data.message,
          //   icon: 'none',
          //   duration: 2000
          // })

        }
        /** end 处理结束*/
      }
    },
    fail: function(error) {
      onFailed(""); //failure for other reasons
      wx.hideLoading();
    }
  })
}

/**
 * function: 根据需求处理请求参数：添加固定参数配置等
 * @params 请求参数
 */
function dealParams(params) {
  return params;
}
function userLog(params){
  let app=getApp();
  params.platformType='XCX';
 
  params.device=app.globalData.platform;
  post(app.URL+"/tool/log", params, function(res){}, function(err){});
}


// 1.通过module.exports方式提供给外部调用
module.exports = {
  postRequest: post,
  getRequest: get,
  userLog:userLog
}
