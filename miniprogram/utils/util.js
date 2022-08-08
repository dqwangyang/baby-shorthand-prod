const db = wx.cloud.database();
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function deleteRecord(recordId,onSuccess){
  const $ = db.command;
  db.collection('mm_records').where({    
    _id:recordId
   
  }).remove({
    success:res=>{
      onSuccess(res);
    }
  });
}

async function getRecordsBySearchTime(seach_time,childId,onSuccess){
  let today=formatTime(new Date(seach_time.replace(/-/g,'/')),'Y-M-D')+" 00:00:01";
  console.info(seach_time);
  let tt=new Date(today.replace(/-/g,'/')).getTime();
  console.info(tt);
  const $ = db.command;
    const MAX_LIMIT = 20;
    //先取出集合的总数
    const countResult = await db.collection('mm_records').where({    
        child_id:childId,
        seach_time: $.gte(tt)
      }).count();
    const total = countResult.total;
    //计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT);
    // 承载所有读操作的 promise 的数组
    const arraypro = [];

    for (let i = 0; i < batchTimes; i++) {
        const promise = await  db.collection('mm_records').where({    
            child_id:childId,
            seach_time: $.gte(tt)
        }).orderBy('seach_time', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        for (let j = 0; j < promise.data.length;j++){
            arraypro.push(promise.data[j])
          }
    }   
onSuccess(arraypro);
}
async function getRecordsByTypeName(childId,typeName,onSuccess){  
  const $ = db.command;
  //获取记录
  const countResult= await db.collection('mm_records').where({    
    child_id:childId,
    name:typeName
  }).count();
  const total = countResult.total;
  const MAX_LIMIT=20;
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const arraypro = [];

  for (let i = 0; i < batchTimes; i++) {

    const promise = await db.collection('mm_records').where({    
            child_id:childId,
            name:typeName
        }).orderBy('seach_time', 'asc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();

        for (let j = 0; j < promise.data.length;j++){
            arraypro.push(promise.data[j]);
          }
}
    onSuccess(arraypro);

}


async  function getRecordsBySearchTimeAndTypeName(seach_time,childId,typeName,onSuccess){
  seach_time=seach_time+"-01";
  let today=formatTime(new Date(seach_time.replace(/-/g,'/')),'Y-M-D')+" 00:00:01"; 
  let tt=new Date(today.replace(/-/g,'/')).getTime();   
  let month=new Date(seach_time.replace(/-/g,'/')).getMonth();
  let endTime=new Date(seach_time.replace(/-/g,'/'));
  endTime=endTime.setMonth(month+1);
  let endDay=getLocalTime(endTime);
  endDay=new Date(endDay.replace(/-/g,'/')).getTime();
  const $ = db.command;
  //获取记录
  const countResult= await db.collection('mm_records').where({    
    child_id:childId,
    seach_time: $.and($.gte(tt),$.lt(endDay)),
    name:typeName
  }).count();
  const total = countResult.total;
  const MAX_LIMIT=20;
  const batchTimes = Math.ceil(total / MAX_LIMIT);
  const arraypro = [];

  for (let i = 0; i < batchTimes; i++) {
    const    promise= await db.collection('mm_records').where({    
            child_id:childId,
            seach_time: $.and($.gte(tt),$.lt(endDay)),
            name:typeName
        }).orderBy('seach_time', 'asc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();

        for (let j = 0; j < promise.data.length;j++){
            arraypro.push(promise.data[j]);
          }
    }
    onSuccess( arraypro);
}
function updateUser(nickName,avatarUrl,id, onSuccess) {
    db.collection('mm_user').doc(id).update({
      data:{
        avatar_url:avatarUrl,
        nick_name:nickName
         },
         success(res){
           onSuccess(res.data);
         }
        })
  
  }
function updateRecords(record, onSuccess) {
  db.collection('mm_records').doc(record._id).update({
    data:{
      text1:record.text1,
      text2:record.text2,
      text3:record.text3,
      text4:record.text4,
      seach_time:record.seach_time
       },
       success(res){
         onSuccess(res.data);
       }
      })

}
function updateChild(child, onSuccess) {
  db.collection('mm_childs').doc(child._id).update({
    data:{
      brithday:child.brithday,
      name:child.name,
      sex:child.sex
       },
       success(res){
         onSuccess(res.data);
       }
      })

}
function getUserByOpenId(open_id,onSuccess){
  db.collection('mm_user').where({
    open_id: open_id
  })
  .get({
    success: function(res) {
      onSuccess(res.data);
    }
  })
}

function getChild(childId,onSuccess){
  db.collection('mm_childs').where({
    _id: childId
  })
  .get({
    success: function(res) {
      onSuccess(res.data);
    }
  })
}
function getUserById(id,onSuccess){
  db.collection('mm_user').where({
    _id: id
  }).get({
    success: function(res) {
      onSuccess(res.data);
    }
  })
}
function getChildIdByUserId(userId,onSuccess){
  db.collection('mm_user_childs').where({
    user_id: userId
  }).get({
    success: function(res) {
      onSuccess(res.data[0].child_id);
    }
  })
}
//根据用户ID获取用户和宝宝的关联关系记录
function getUserChildByUserId(userId,onSuccess){
  db.collection('mm_user_childs').where({
    user_id: userId
  }).get({
    success: function(res) {
      onSuccess(res.data[0]);
    }
  })
}
//更新用户的宝宝
function updateUserChild(id,childId,onSuccess){
  db.collection('mm_user_childs').doc(id).update({
    data:{
      child_id:childId
       },
       success(res){
         onSuccess(res.data);
       }
      })
}

//获取今天的记录 
async function getRecordsToday( userId,childId,onSuccess){
  let today=formatTime(new Date(),'Y-M-D')+" 00:00:01";
  let tt=new Date(today.replace(/-/g,'/')).getTime();
  const $ = db.command;
  const MAX_LIMIT = 20;
    //先取出集合的总数
    const countResult = await db.collection('mm_records').where({    
        child_id:childId,
        seach_time: $.gte(tt)
      }).count();
    const total = countResult.total
    //计算需分几次取
    const batchTimes = Math.ceil(total / MAX_LIMIT)
    // 承载所有读操作的 promise 的数组
    const arraypro = []

    for (let i = 0; i < batchTimes; i++) {
        const promise = await  db.collection('mm_records').where({    
            child_id:childId,
            seach_time: $.gte(tt)
        }).orderBy('seach_time', 'desc').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get();
        for (let j = 0; j < promise.data.length;j++){
            arraypro.push(promise.data[j])
          }
        }
        onSuccess(arraypro);
}

function add(name,json, onSuccess) {
    db.collection(name).add({
      // data 字段表示需新增的 JSON 数据
      data: json,
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        onSuccess(res._id);

      }
    })
  
}
 /** 时间戳转日期 格式2017-01-20 00:00:00*/
 function getLocalTime (ns) {
  //needTime是整数，否则要parseInt转换  
  var time = new Date(parseInt(ns) * 1); //根据情况*1000
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}
//小于10的补零操作
function add0(m){
  return m < 10 ? '0' + m : m ;
}

/**时间戳转日期 格式17/12/28*/
function getYMD(ns){
  var allStr = this.getLocalTime(ns);
  var year = allStr.substr(2,2);
  var month = allStr.substr(5, 2);
  var day = allStr.substr(8, 2);
  return year+'/'+month+'/'+day;
}
/**时间戳转日期 格式2017/12/28*/
function getYearMD (ns) {
  var allStr = this.getLocalTime(ns);
  var year = allStr.substr(0, 4);
  var month = allStr.substr(5, 2);
  var day = allStr.substr(8, 2);
  return year + '/' + month + '/' + day;
}
/**时间戳转日期 格式2018年01月01日*/
function getChaYMD (ns) {
  var allStr = this.getLocalTime(ns);
  var year = allStr.substr(0, 4);
  var month = allStr.substr(5, 2);
  var day = allStr.substr(8, 2);
  return year + '年' + month + '月' + day + '日';
}



/** 
* 时间戳转化为年 月 日 时 分 秒 
* number: 传入时间戳 
* format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime(date, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
// 根据出生日期计算年龄周岁
function getAge(strBirthday) {
  var returnAge = '';
  var mouthAge = '';
  var strBirthdayArr = strBirthday.split("-");
  var birthYear = strBirthdayArr[0];
  var birthMonth = strBirthdayArr[1];
  var birthDay = strBirthdayArr[2];
  if(birthDay==''){
    birthDay="01";
  }
  var d = new Date();
  var nowYear = d.getFullYear();
  var nowMonth = d.getMonth() + 1;
  var nowDay = d.getDate();
  if (nowYear == birthYear) {
    // returnAge = 0; //同年 则为0岁
    var monthDiff = nowMonth - birthMonth; //月之差   
    if (monthDiff <= 0) {
      return  nowDay-parseInt(birthDay)+'天'; //日之差 
    } else {
      mouthAge = monthDiff + '个月';  
     
    }
  } else {
    var ageDiff = nowYear - birthYear; //年之差
    if (ageDiff > 0) {
      if (nowMonth == birthMonth) {
        var dayDiff = nowDay - birthDay; //日之差 
        if (dayDiff < 0) {
          returnAge = ageDiff - 1 + '岁';
        } else {
          returnAge = ageDiff + '岁';
        }
      } else {
        var monthDiff = nowMonth - birthMonth; //月之差 
        if (monthDiff < 0) {
          returnAge = ageDiff - 1 + '岁';
        } else {
          mouthAge = monthDiff + '个月';
          returnAge = ageDiff + '岁';
        }
      }
    } else {
      returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
    }
  }

  return returnAge + mouthAge; //返回周岁年龄+月份
}

// 1.通过module.exports方式提供给外部调用
module.exports = {
  add: add,
  getUserByOpenId:getUserByOpenId,
  getUserById:getUserById,
  getLocalTime:getLocalTime,
  formatTime:formatTime,
  getRecordsToday:getRecordsToday,
  getChildIdByUserId:getChildIdByUserId,
  updateRecords:updateRecords,
  getChild:getChild,
  updateChild:updateChild,
  getAge:getAge,
  getRecordsBySearchTime:getRecordsBySearchTime,
  getRecordsBySearchTimeAndTypeName:getRecordsBySearchTimeAndTypeName,
  updateUser:updateUser,
  getRecordsByTypeName:getRecordsByTypeName,
  deleteRecord:deleteRecord,
  updateUserChild:updateUserChild,
  getUserChildByUserId:getUserChildByUserId
}

