/* 
 * 路由表对象：
 * 该文件挂载在Vue原型中 $mRoutesConfig
 * 作用：调用$mRouter对象的方法 传入以下对应的路由对象，详细见common目录下的router.js
 * 示例：this.$mRouter.push({route:this.$mRoutesConfig.main,query:{a:1}})
 * 注意：所有在pages目录下新建的页面都必须在"路由表"中进行声明，并且在框架的pages.json注册。
 * 
 * 配置参数项说明： 
 * name:可选配置 （路由名称）
 * path:必填配置 （路由地址）
 * requiresAuth:可选配置 （是否权限路由）
 */

export default {
	// 权限路由
    overbook: {
			name: "商户下单",
			path: "/pages/overbook/overbook",
			// requiresAuth: true
    },
		bookDetail: {
			name: "商户下单明细",
			path: "/pages/overbook/bookDetail",
			// requiresAuth: true
		},
		address: {
			name: "地址列表",
			path: "/pages/address/address",
			// requiresAuth: true
		},
		addAddr:{
			name: "新增地址",
			path: "/pages/address/addAddr"
			// requiresAuth: true
		},
		chooseAddr:{
			name: "选择地址",
			path: "/pages/address/chooseAddr"
			// requiresAuth: true
		},
		payment:{
			name: "支付",
			path: "/pages/payment/payment"
		},
		grabOrder:{
			name: "保洁抢单",
			path: "/pages/grabOrder/grabOrder"
		},
		sheet:{
			name: "已抢工单",
			path: "/pages/sheet/sheet"
		},
		sheetDetail:{
			name: "详情",
			path: "/pages/sheet/sheetDetail"
		},
		mine:{
			name: "我的",
			path: "/pages/mine/mine"
		},
		order:{
			name: "详情",
			path: "/pages/order/order"
		},
		fav:{
			name: "我的收藏",
			path: "/pages/mine/fav"
		},
		feed:{
			name: "意见反馈",
			path: "/pages/mine/feed"
		},
		msg:{
			name: "我的消息",
			path: "/pages/mine/msg"
		},
		pwd:{
			name: "我的密码",
			path: "/pages/mine/pwd"
		},
		share:{
			name: "分享",
			path: "/pages/mine/share"
		},
		wallet:{
			name: "我的钱包",
			path: "/pages/wallet/wallet"
		},
		qualificate:{
			name: "认证",
			path: "/pages/qualificate/qualificate"
		},
		cashout:{
			name: "提现",
			path: "/pages/wallet/cashout"
		},
		recharge:{
			name: "充值",
			path: "/pages/wallet/recharge"
		},
		cashRecd:{
			name: "提现记录",
			path: "/pages/wallet/cashRecd"
		},
		 favComment:{
			 name: "收藏评价",
			 path: "/pages/mine/favComment"
		 },
		 bindTel:{
				 name: "绑定手机号",
				 path: "/pages/mine/bindTel"
		 },
		 protocol:{
			 name: "协议",
			 path: "/pages/protocol/protocol"
		 },
	// 非权限路由
	index: {
		name: "首页",
		path: "/pages/index/index"
	},
	
	
	login: {
		name: "登录",
		path: "/pages/login/login"
	},
	

}