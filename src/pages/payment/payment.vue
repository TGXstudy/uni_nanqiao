<template>
	<view class="container">
		<form @submit="subPayment" @reset="formReset">
			<view class="total-money">
				<text>支付金额</text>
				<text>￥{{sum}}</text>
			</view>
			<view class="pay-way">
				<view class="pay-title">
					支付方式
				</view>
				<radio-group class="way-box" name='payway'>
					<view class="way-item bor-bot">
						<view class="way-title">
							<image src="../../static/image/icon/weixin.png" mode=""></image>
							<text>微信支付</text>
						</view>
						<radio class="small-radio" color="#27C79A" value='weixin' />
					</view>
					<view class="way-item">
						<view class="way-title">
							<image src="../../static/image/icon/yue.png" mode=""></image>
							<text>余额支付</text>
						</view>
						<radio class="small-radio"  value='yue' color="#27C79A" />
					</view>
				</radio-group>
				<view class="btn-area">
					<button formType="submit">确认支付</button>
				</view>
			</view>
		</form>
		
		
		<bottomPopup 
								 :show="showPwdIn"
								 @close="showPwdIn=false">
			 <view class="pwd-box">
				 
						<view class="pwd-top">
							<text>输入密码</text>
							<image src="../../static/image/icon/close.png" @tap="showPwdIn = false"></image>
						</view>
						<!-- <sixPwd @getPwd="getPwd"></sixPwd> -->
						<view class="six-input">
							<input type="number" password="true"  v-model="pwdNum" @input="inputPwd"  maxlength="6" cursor-spacing=10 />
							<view class="txt-box">
								<text>{{dot[0]}}</text>
								<text>{{dot[1]}}</text>
								<text>{{dot[2]}}</text>
								<text>{{dot[3]}}</text>
								<text>{{dot[4]}}</text>
								<text>{{dot[5]}}</text>
							</view>
						</view>
						<view class="pwd-btn">
							<button @tap="showPwdIn = false">取消</button>
							<button class='green-btn' @tap="surePwd">确定</button>
						</view>
					
			</view>
		</bottomPopup>
	</view>
	
</template>

<script>
	import  bottomPopup from '../../components/tui/bottom-popup/bottom-popup.vue';
	import  keyboardInput from '../../components/tui/keyboard-input/keyboard-input.vue';
	import sixPwd from '../../components/sixPwd.vue'
	export default{
		components:{
			bottomPopup,keyboardInput,sixPwd
		},
		data(){
			return {
				Authorization:this.$store.getters.getAuthorization,
				showPwdIn:false,
				sum:0,
				dot:[],
				pwdNum:'',
			}
		},
		methods:{
			inputPwd(e){
				this.dot=[];
				for(let i=0;i<e.detail.value.length;i++){
					this.dot[i]="●"
				}
			},
			subPayment(e){
				let that=this;
				let payway=e.detail.value.payway;
				if(payway == ""){
					that.$mUtils.toast("请先选择支付方式")
				}else{
					if(payway === 'yue'){
						//判断是否设置密码
						that.$api.checkPayPass(that.Authorization)
						.then(res=>{
							console.log(res.data)
							if(res.data.code ==200){
								// 弹出密码输入框
								that.showPwdInput()
							}else if(res.data.code == 500){
								that.$mUtils.toast(res.data.msg);
								let tid=setTimeout(()=>{
									that.$mRouter.push({route:that.$mRoutesConfig.pwd})
								},500)
							}else{
								that.$mUtils.toast(res.data.msg)
							}
							
							
						})
					}else if(payway === 'weixin'){
						console.log('微信支付');
						that.wxPay();
					}
				}
			},
			//'微信支付'
			wxPay(){
				let that=this;
				that.$api.wxpay({
					data:{
						order_id:that.orderId - 0,
						type:2
					}
				},that.Authorization).then(res=>{
					console.log("支付结果",res.data)
					if(res.data.code === 200){
						let payData=res.data.data;
						that.wxPayMoney(payData)
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					
					
				})
			},
			wxPayMoney(payData){
				let that=this;
				uni.requestPayment({
					provider: 'wxpay',
					orderInfo: 'orderPay',
					timeStamp:payData.timeStamp,//	String	微信小程序必填	时间戳从1970年1月1日至今的秒数，即当前的时间。	微信小程序
					nonceStr:payData.nonceStr,//	String	微信小程序必填	随机字符串，长度为32个字符以下。	微信小程序
					package:payData.package,//	String	微信小程序必填	统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。	微信小程序
					signType:payData.signType,//	String	微信小程序必填	签名算法，暂支持 MD5。	微信小程序
					paySign:payData.paySign,//
					success: res => {
						console.log("success:",res);
						that.$mUtils.toast('支付成功');
						let tid=setTimeout(()=>{
							that.$mRouter.reLaunch({route:that.$mRoutesConfig.order})
							 // that.$mRouter.push({route:that.$mRoutesConfig.order})
						},200)
					},
					fail: (res) => {
						// console.log("fail:",res);
						if(errMsg == "requestPayment:fail cancel"){
							that.$mUtils.toast("支付取消")
						}
					}
				});
			},
			// 弹出密码输入框
			showPwdInput(){
				// console.log('弹出密码输入框')
				this.dot=[];
				this.pwdNum="";
				this.showPwdIn=true;
				
			},
			
			//确定密码
			surePwd(){
				let that=this;
				console.log(this.pwdNum,this.sum,this.orderId,this.fromPage);
				that.showPwdIn=false;
				that.$api.balancePay({
					data:{
						order_id:that.orderId,
						total_fee:that.sum,
						pay_pass:that.pwdNum
					}
				},that.Authorization).then(res=>{
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						if(that.fromPage === 'overbook'){
							 // that.$mRouter.redirectTo({route:that.$mRoutesConfig.order})
							 that.$mRouter.reLaunch({route:that.$mRoutesConfig.order})
						}
					}
					
				})
				
			}
		},
		onLoad(opt) {
			console.log("onload",opt)
			if(opt){
				this.sum=parseFloat(opt.sum).toFixed(2)
				this.orderId=opt.orderId;
				this.fromPage=opt.fromPage;
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width:100%;
		background-color:#ffffff;
		.total-money{
			width:95%;
			margin:0 auto;
			display:block;
			padding:40upx 0;
			text-align:center;
			text:first-child{
				display:block;
				color:#999999;
				font-size:22upx;
			}
			text:last-child{
				display:block;
				color:#333333;
				font-size:60upx;
			}
		}
		.pay-way{
			width:95%;
			margin:0 auto;
			display:block;
			.pay-title{
				color:#333333;
				font-size:30upx;
				font-weight: bold;
			}
			.way-box{
				.way-item{
					width:100%;
					height:100upx;
					display:flex;
					justify-content:space-between;
					align-items:center;
					.way-title{
						flex: 1;
						color:#333333;
						font-size:28upx;
						display:flex;
						justify-content:flex-start;
						align-items:center;
						image{
							width: 55upx;
							height: 55upx;
							margin-right: 20upx;
						}
					}
					
				}
			}
		}
	  
		.popup{
			
			position:fixed;
			width: 100%;
			height: 100%;
			top:0;
			left:0;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background-color: #fff;
		}
		.pwd-box{
			width: 100%;
			display: block;
			.pwd-top{
				background-color: #fff;
				height: 100upx;
				display:flex;
				justify-content:space-between;
				align-items:center;
				text{
					display: block;
					flex: 1;
					text-align: center;
					color:#333;
					font-size: 30upx;
				}
				image{
					width: 50upx;
					height: 50upx;
				}
			}
			.pwd-btn{
				padding:40upx 0;
				background-color: #fff;
				button{
					font-size:30upx;
					color:#AAAAAA;
					background-color:transparent;
					padding: 0 80upx;
				}
				.green-btn{
					
					background-color: #27C79A;
					color:#fff;
					border-radius: 50upx;
				}
			}
		}
	}
	
	.six-input{
			width: 100%;
			box-sizing: border-box;
			padding: 20upx;
			margin: 0 auto;
			background-color:#fff;
			position:relative;
			input{
				padding: 0;
				box-sizing: border-box;
				width:540upx;
				display: block;
				position:absolute;
				top:20upx;
				left:115upx;
				border:none;
				height: 90upx;
				margin: 0 auto;
				padding-left: 600upx;
				// text-align: right;
			}
			.txt-box{
				width: 540upx;
				margin: 0 auto;
				display: flex;
				justify-content: center;
				text{
					display: inline-block;
					width: 90upx;
					height: 90upx;
					line-height: 90upx;
					text-align: center;
					border: 2upx solid #e5e5e5;
				}
			}
			
		}
</style>
