// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    try {		
		const result = await cloud.openapi.security.mediaCheckAsync({			
                mediaUrl:event.imgData,
                mediaType:2,
                version:2,
                openid : event.openId,
                scene:4			
		})
		return result
	} catch (err) {
		return err
	}
    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }
}