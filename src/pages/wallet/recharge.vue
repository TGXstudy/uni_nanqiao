<template>
	<view class="container">
		<view class="title">
			充值金额
		</view>
		<view class="con-item input-item">
			<text>￥</text>
			<input type="digit" v-model="money" placeholder="输入充值金额"/>
		</view>
		<view class="con-item">
			<image src="../../static/image/icon/weixin.png" ></image>
			<text class="way-title">微信充值</text>
		</view>
		<view class="btn-box">
			<button @tap="wxRecharge"> 确认 </button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				money:''
			}
		},
		methods:{
			wxRecharge(){
				console.log(this.money)
				let that=this;
				if(that.money == 0 || that.money.trim().length == 0){
					that.$mUtils.toast("请输入充值金额");
					return;
				}
				
				that.$api.recharge({
					data:{
						total_fee:that.money - 0
					}
				},that.Authorization).then(res=>{
					console.log("充值结果",res.data)
						/*
						id: "3"
						out_trade_num: "cz386571569208231"
						time: "2019-09-23 11:10:31"
						total_fee: 0.01
						uid: 2*/
					if(res.data.code === 200){
						let orderId=res.data.data.id;
						that.$api.wxpay({
							data:{
								order_id:orderId -0,
								type:1
							}
						},that.Authorization).then(res=>{
							console.log("支付结果",res.data)
							if(res.data.code === 200){
								let payData=res.data.data;
								this.wxPayMoney(payData)
							}else{
								that.$mUtils.toast(res.data.msg)
							}
							
							
						})
					
					}
				})
			},
			/*
			appId: "wxec777cb548047bfb"
			nonceStr: "fjpc42qidemj2masyzuzkfo097v5l9aj"
			package: "prepay_id=wx23113134492729ae0935bec61286690900"
			paySign: "2D8F8F964360541F2E5C23202C61E356"
			signType: "MD5"
			timeStamp: "1569209494"*/
			wxPayMoney(payData){
				let that=this;
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: 'recharge',
					timeStamp:payData.timeStamp,//	String	微信小程序必填	时间戳从1970年1月1日至今的秒数，即当前的时间。	微信小程序
					nonceStr:payData.nonceStr,//	String	微信小程序必填	随机字符串，长度为32个字符以下。	微信小程序
					package:payData.package,//	String	微信小程序必填	统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。	微信小程序
					signType:payData.signType,//	String	微信小程序必填	签名算法，暂支持 MD5。	微信小程序
					paySign:payData.paySign,//
					success: res => {
						console.log("success:",res);
						that.$mUtils.toast('充值成功')
						that.$mRouter.back(-1,500)
					},
					fail: (res) => {
						if(res.errMsg == "requestPayment:fail cancel"){
							that.$mUtils.toast("支付取消")
							that.$mRouter.back(-1,500)
						}else{
							console.log("fail:",res);
							that.$mUtils.toast(res.errMsg)
						}
						
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width:100%;
		background-color:#ffffff;
		.title{
			width: 95%;
			margin:  0 auto;
			font-size: 30upx;
			color:#333;
			font-weight: bold;
			line-height: 80upx;
		}
		.con-item{
			width: 95%;
			margin:  0 auto;
			font-size: 28upx;
			display:flex;
			justify-content:flex-start;
			align-items:center;
			padding:20upx 0;
			image{
				width: 55upx;
				height: 55upx;
				margin-right: 20upx;
			}
		}
		.input-item{
			font-size: 36upx;
			input{
				flex: 1;
				border: none;
				border-bottom: 2upx solid #e5e5e5;
			}
		}
		.btn-box{
			width: 95%;
			margin:  0 auto;
			padding-top:40upx;
			button{
				width: 100%;
				background-color: #27C79A;
				color:#fff;
				border-radius: 50upx;
			}
		}
	}
</style>
