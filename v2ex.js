const axios =require('axios')
const cookie = process.env.V2EXCK
const qmsgapi = process.env.QMSGAPI
once=null
notice=""
const header = {
  headers: {
    Referer: 'https://www.v2ex.com/mission',
    "Host":"www.v2ex.com",
    "user-agent":"Mozilla/5.0 (Linux; Android 10; Redmi K30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.83 Mobile Safari/537.36",
    cookie: `'${cookie}'` }
}
console.log(header)
function check() {
  return new Promise(async resolve => {
    try {
  let url = 'https://www.v2ex.com/mission/daily'
  let res = await axios.get(url, header)
  reg=/每日登录奖励已领取/
  if(reg.test(res.data))
  {
    console.log("今天已经签到过啦")
      notice+="今天已经签到过啦"
  }
  else{
    reg=/redeem\?once=(.*?)'/
    once=res.data.match(reg)[1]
    console.log(`获取成功 once:${once}`)
  }
    } catch (err) {
      console.log(err)
    }
    resolve()
  })
}
//每日签到
function daily() {
  return new Promise(async resolve => {
    try {
      let url = `https://www.v2ex.com/mission/daily/redeem?once=${once}`
      let res = await axios.get(url, header) 
    } catch (err) {     
      console.log(err)
    }
    resolve()
  })
}



function balance() {
  return new Promise(async resolve => {
    try {
      let url = 'https://www.v2ex.com/balance'
  let res = await axios.get(url, header)
  reg=/\d+?\s的每日登录奖励\s\d+\s铜币/
  console.log(res.data.match(reg)[0])
  notice+=res.data.match(reg)[0]
    } catch (err) {     
      console.log(err)
    }
    resolve()
  })
}
function qmsg(msg) {
  return new Promise(async resolve => {
    try {
      let url = `${qmsgapi)}?msg=${encodeURI(msg)}`
  let res = await axios.get(url)
  if (res.data.code == 0) {
    console.log('Qmsg酱：发送成功')
  } else {
    console.log('Qmsg酱：发送失败!' + res.data.reason)
  }
    } catch (err) {
      console.log(err)
    }
    resolve()
  })
}




function sign() {
  return new Promise(async resolve => {
    try {
    if(!cookie){
    console.log("你的cookie呢！！！")
    qmsg("你的cookie呢！！！")
    return}
    await check()    
    if(once){
    await daily()
    }
    await balance()
    qmsg(notice)
    } catch (err) {     
      console.log(err)
    }
    resolve()
  })
}

sign()
