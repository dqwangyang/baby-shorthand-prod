// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    let message="";  
    const wxContext = cloud.getWXContext()   
        if (event.result.suggest == 'pass') {
                //通过trace_id拿到哪个类型的集合发来的审核
                let traceId=event.trace_id     
                message = "-----Id为"+traceId    
                const json = {
                    traceId:traceId
                }
                cloud.database().collection("mm_image_audit").add({
                    // data 字段表示需新增的 JSON 数据
                    data: json,
                    success: function(res) {
                      // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                      message += "审核id为"+res._id
              
                    }
                  })
                                              
                }  
            return {
                event    ,
                message
                         
            }  
}