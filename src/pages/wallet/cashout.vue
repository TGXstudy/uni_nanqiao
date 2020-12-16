<template>
	<view class="container">
		<view class="title">
			提现金额
		</view>
		<view class="con-item input-item">
			<text>￥</text>
			<input type="digit"  v-model="money" placeholder="输入提现金额"/>
		</view>
		<view class="con-item">
			<image src="../../static/image/icon/weixin.png" ></image>
			<text class="way-title">提现到微信钱包</text>
		</view>
		<view class="btn-box">
			<button @tap="showPwdInPopup"> 确认 </button>
		</view>
		
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
	import sixPwd from '../../components/sixPwd.vue'
	export default{
		components:{
			bottomPopup,sixPwd
		},
		data(){
			return {
				Authorization:this.$store.getters.getAuthorization,
				showPwdIn:false,
				money:'',
				dot:[],
				pwdNum:'',
			}
		},
		methods:{
			inputPwd(e){
				this.dot=[];
				console.log("获得密码",e.detail.value,this.pwdNum)
				for(let i=0;i<e.detail.value.length;i++){
					this.dot[i]="●"
				}
							
			},
			showPwdInPopup(){
				let that=this;
				if(this.money.trim().length === 0){
					this.$mUtils.toast("请输入提现金额");
					return;
				}
				
				//判断是否设置密码
				that.$api.checkPayPass(that.Authorization)
				.then(res=>{
					console.log("判断是否设置密码",res.data)
					if(res.data.code ==200){
						that.dot=[];
						that.pwdNum="";
						that.showPwdIn=true;
					}else if(res.data.code == 500){
						that.$mUtils.toast(res.data.msg);
						let tid=setTimeout(()=>{
							that.$mRouter.push({route:that.$mRoutesConfig.pwd})
						},500)
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					
					
				})
				
			},
			// //获得密码
			// getPwd(e){
			// 	this.pwd=e
			// 	// console.log("getPwd",e)
			// },
			//确定密码
			surePwd(){
				let that=this;
				that.showPwdIn=false;
				console.log(that.money,that.pwdNum)
				that.$api.addDeposit({
					data:{
						money:that.money-0,
						pay_pass:that.pwdNum
					}
				},that.Authorization).then(res=>{
					console.log('提现申请操作 结果',res)
					this.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						that.$mRouter.back(-1,1000)
					}
				})
				
			},
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
				letter-spacing: 60upx;
				border:none;
				// background-color:red;
				// opacity: 0;
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
