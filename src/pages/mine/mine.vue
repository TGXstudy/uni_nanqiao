<template>
	<view class="container">
		<view class="info-box">
			<image :src="user.avatar || '../../static/image/icon/mine_icon.png'" @error="setDefault"></image>
			<text v-if="hasAuth">{{user.username}}</text>
			<text v-else @tap="goLogin">点击登录</text>
		</view>
		<view class="fun-box">
			<view class="fun-item" @tap="goPage('wallet')"> 
				<view class="fun-title">
					<image src="../../static/image/icon/wallet_icon.png"></image>
					<text>我的钱包</text>
				</view>
				<view class="fun-more" >
					<text>{{user.money}}</text>
					<image src="../../static/image/icon/enter_icon.png" ></image>
				</view>
			</view>
			<view class="fun-item" @tap="goPage('fav')"> 
				<view class="fun-title">
					<image src="../../static/image/icon/fav_icon.png"></image>
					<text>我的收藏</text>
				</view>
				<view class="fun-more">
					<image src="../../static/image/icon/enter_icon.png" ></image>
				</view>
			</view>
			<view class="fun-item" @tap="goPage('share')">  
				<view class="fun-title">
					<image src="../../static/image/icon/share_icon.png"></image>
					<text>分享好友</text>
				</view>
				<view class="fun-more">
					<image src="../../static/image/icon/enter_icon.png" ></image>
				</view>
			</view>
			<view class="fun-item"  @tap="goPage('msg')"> 
				<view class="fun-title">
					<image src="../../static/image/icon/msg_icon.png"></image>
					<text>我的消息</text>
				</view>
				<view class="fun-more">
					<image v-show="user.hasnewmsg" class='dot' src="../../static/image/icon/red-dot.png"></image>
					<image src="../../static/image/icon/enter_icon.png" ></image>
				</view>
			</view>
			<view class="fun-item" @tap="goPage('pwd')"> 
				<view class="fun-title">
					<image src="../../static/image/icon/pwd_icon.png"></image>
					<text>支付密码</text>
				</view>
				<view class="fun-more">
					<image src="../../static/image/icon/enter_icon.png" ></image>
				</view>
			</view>
			<view class="fun-item"  @tap="goPage('feed')">
				<view class="fun-title">
					<image src="../../static/image/icon/feed_icon.png"></image>
					<text>意见反馈</text>
				</view>
				<view class="fun-more">
					<image src="../../static/image/icon/enter_icon.png" ></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				hasAuth:false,
				user:{}, //我的信息
			}
		},
		onLoad() {
			//
			this.infoLoad()
			
		},
		onShow() {
			this.infoLoad()
		},
		methods:{
			
			infoLoad(){
				if(this.Authorization === ''){
					this.hasAuth=false;
				}else{
					this.hasAuth=true;
					this.getMyInfo()
				}
			},
			//设置默认头像
			setDefault(){
				this.user.avatar = '../../static/image/icon/mine_icon.png';
			},
			//我的信息
			getMyInfo(){
				console.log("getMyInfo")
				let that=this;
				that.$api.getMyInfo({	},that.Authorization)
				.then(res=>{
					
					if(res.data.code === 200){
						that.user=res.data.data;
					}else if(res.data.code === 1003){
						that.hasAuth=false;
						// that.$mUtils.toast("请先登录")
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					console.log("我的信息",res)
				})
			},
			//单击登录
			goLogin(){
				this.$mRouter.push({route:this.$mRoutesConfig.login}) 
			},
			
			//跳转各功能页面
			goPage(funName){
				if(this.Authorization){
					let route={};	
					
						switch(funName){
							case 'wallet':
								route=this.$mRoutesConfig.wallet
							break;
							case 'fav':
								route=this.$mRoutesConfig.fav
							break;
							case 'msg':
								route=this.$mRoutesConfig.msg
							break;
							case 'share':
								route=this.$mRoutesConfig.share
							break;
							case 'feed':
								route=this.$mRoutesConfig.feed
							break;
							case 'pwd':
								route=this.$mRoutesConfig.pwd;
							break;
						}
						console.log(route)
						this.$mRouter.push({route})
						
					
					
				}else{
					uni.showToast({
						title: '请先登录',
						icon:"none"
					});
				}
				
			},
			 
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		flex-direction:column;
		.info-box{
			width: 100%;
			flex-direction:column;
			justify-content:center;
			align-items:center;
			height:350upx;
			background-color:#f6f6f6;
			background-image:url("../../static/image/icon/backimg.png");
			background-size:cover;
			image{
				width: 125upx;
				height: 125upx;
				display: block;
				border-radius: 50%;
				margin-bottom: 20upx;
			}
			text{
				display: block;
				color:#333;
				font-size: 36upx;
				font-weight: bold;
			}
		}
		.fun-box{
			width: 100%;
			flex:1;
			background-color: #fff;
			display:block;
			.fun-item{
				color:#333333;
				font-size: 28upx;
				width: 95%;
				height: 80upx;
				margin: 0 auto;
				background-color: #fff;
				justify-content:space-between;
				align-items:center;
				image{
					width: 50upx;
					height: 50upx;
				}
				.fun-title{
					align-items:center;
					text{
					}
				}
				.fun-more{
					align-items:center;
					text{
						
					}
				}
				.dot{
					width: 20upx;
					height: 20upx;
				}
			}
		}
	}
</style>
