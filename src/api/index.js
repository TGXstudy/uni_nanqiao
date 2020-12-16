import http from "@/http/index"
import config from "@/config/index.config.js"
const api = {}


// 微信授权登录
api.wxLogin = (parmas) => http.post(`${config.baseUrl}/api/wechat/user/wxLogin`, parmas)

// 获取首页数据
api.getIndexData = (parmas) => http.post(`${config.baseUrl}/api/wechat/index/lbs`, parmas)

//我的 - 我的信息
api.getMyInfo = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/personal/myInfo`, parmas,headerAuth)

//检查是否绑定了手机号
api.checkBindTel = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/personal/checkBindTel`, parmas,headerAuth)

//发送短信验证码
api.sendMsg = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/index/sendMsg`, parmas,headerAuth)

//绑定手机号
api.bindTel = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/personal/bindTel`, parmas,headerAuth)

//设置交易密码
api.setPayPass = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/personal/setPayPass`, parmas,headerAuth)

//我的钱包-余额 收支记录
api.myWallet = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/wallet/myWallet`, parmas,headerAuth)

//检查是否通过认证
api.checkCert = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/user/checkCert`, parmas,headerAuth)

//获取我的地址
api.getAddrs = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/addr/getAddrs`, parmas,headerAuth)

//添加地址
api.addAddr = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/addr/addAddr`, parmas,headerAuth)

//获取服务清单
api.serviceList = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/Order/serviceList`, parmas,headerAuth)


//分享好友
api.shareQrcode = () => http.post(`${config.baseUrl}/api/wechat/personal/shareQrcode`, {},"")


//获取客服电话
api.kftel = () => http.post(`${config.baseUrl}/api/wechat/personal/kftel`,{},"")

// 意见反馈
api.callback = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/personal/callback`, parmas,headerAuth)

// 获取协议
api.getRules = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/index/getRules`, parmas,headerAuth)

//文件上传
api.uploadFile = (filePath,filename,headerAuth) => http.upload(`${config.baseUrl}/api/wechat/upload/uploadFile`,filePath,filename,headerAuth)

//提交订单
api.submitOrder = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/order/submitOrder`, parmas,headerAuth)

//余额支付
api.balancePay = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/Pay/balancePay`, parmas,headerAuth)

//我的订单 /api/wechat/order/myOrder
api.myOrder = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/order/myOrder`, parmas,headerAuth)

//提交信息认证
api.submitCert = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/user/submitCert`, parmas,headerAuth)

//获取认证信息
api.getCert = (headerAuth) => http.post(`${config.baseUrl}/api/wechat/user/getCert`,{},headerAuth)

//抢单区
api.getOrderZone = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/grab_order/getOrderZone`,parmas,headerAuth)

//我的信息
api.myMsg = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/personal/myMsg`,parmas,headerAuth)

//抢单
api.grabOrder = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/grab_order/grabOrder`,parmas,headerAuth)

// 已抢订单
api.myGrabOrder = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/grab_order/myGrabOrder`,parmas,headerAuth)

//已抢订单详情
api.grabOrderInfo = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/grab_order/GrabOrderInfo`,parmas,headerAuth)

//完成订单
api.workDone = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/grab_order/workDone`,parmas,headerAuth)


//联系
api.makeCall = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/Ytx/bindTel`,parmas,headerAuth)

// 客户评论订单
api.comment = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/order/comment`,parmas,headerAuth)

//客户删除订单
api.delOrder = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/order/delOrder`,parmas,headerAuth)

//客户取消订单
api.cancelOrder = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/order/cancelOrder`,parmas,headerAuth)

//收藏保洁员
api.colCleaner = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/collect/collect`,parmas,headerAuth)

//保洁删除订单
api.delSheet = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/grab_order/delOrder`,parmas,headerAuth)

//收藏的保洁列表
api.collectList = (headerAuth) => http.post(`${config.baseUrl}/api/wechat/collect/collectList`,{},headerAuth)

//查看保洁评论
api.commentList = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/collect/commentList`,parmas,headerAuth)

// 取消收藏保洁员
api.cancelCollect = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/collect/cancelCollect`,parmas,headerAuth)

// 删除地址
api.delAddr = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/addr/delAddr`,parmas,headerAuth)

//根据地址id获取地址详情
api.getAddrById = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/addr/getAddrById`,parmas,headerAuth)

// 编辑地址
api.editAddr = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/addr/editAddr`,parmas,headerAuth)

//提现申请
api.addDeposit = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/wallet/addDeposit`,parmas,headerAuth)

//获取提现记录
api.getDeposit = (headerAuth) => http.post(`${config.baseUrl}/api/wechat/wallet/getDeposit`,{},headerAuth)

// 提交充值订单
api.recharge = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/wallet/recharge`,parmas,headerAuth)

// 微信支付
api.wxpay = (parmas,headerAuth) => http.post(`${config.baseUrl}/api/wechat/Order/wxpay`,parmas,headerAuth)

// 检查是否设置交易密码
api.checkPayPass = (headerAuth) => http.post(`${config.baseUrl}/api/wechat/user/checkPayPass`,{},headerAuth)


export default api