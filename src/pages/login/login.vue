<template>
	<view class="container">
		<!-- #ifdef MP-WEIXIN -->
		<image src="../../static/image/icon/marker_icon.png"></image>
		    <view class="black-txt">南峤宿洁</view>
		    <view class="black-txt">申请获得以下权限</view>
		    <view class="gray-txt">获得你的公开信息(昵称，头像，地区及性别)</view>
		    <button class='fun-btn radius-btn' 
								lang="zh_CN"
								open-type="getUserInfo"
								@getuserinfo="getInfo">
				授权登录</button>
		<!-- #endif -->
		
	</view>
</template>

<script>
	export default{
		methods:{
			getInfo(){
				let that=this;
				let data={};
				uni.login({
					provider: 'weixin',
					success: res => {
						// console.log("code code code code",res);
						let code=res.code;
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
									// console.log("infoRes 获取",infoRes);
								if(infoRes.errMsg === "getUserInfo:ok"){
									data={
										signature:infoRes.signature,
										rawData:infoRes.rawData,	
										encryptedData:infoRes.encryptedData,
										iv:infoRes.iv,
										code:code
									}
									that.wxLoginApi(data)
								}
							},
							fail(infoRes) {
								// console.log("infoRes 获取fail",infoRes);
								console.log("拒绝授权")
								that.$mUtils.toast("拒绝授权")
							}
						})
					},
					fail: (res) => {
						that.$mUtils.toast(res.errMsg)
					},
				})
			},
			
			wxLogin(e){
				let that=this;
				// uni.getUserInfo({
						// provider: 'weixin',
						// success: function(infoRes) {
						// 		console.log("infoRes 获取",infoRes);
						// 	if(infoRes.errMsg === "getUserInfo:ok"){
						// 		let data={
						// 			signature:infoRes.signature,
						// 			rawData:infoRes.rawData,	
						// 			encryptedData:infoRes.encryptedData,
						// 			iv:infoRes.iv
						// 		}
				// 				uni.login({
									// provider: 'weixin',
									// success: res => {
									// 	console.log(res);
									// 	data.code=res.code;
									// 	that.wxLoginApi(data)
									// },
									// fail: (res) => {
									// 	that.$mUtils.toast(res.errMsg)
									// },
				// 					
				// 				});
				// 			}else if(e.detail.errMsg == "getUserInfo:fail auth deny"){
				// 				console.log("拒绝授权")
				// 			}
				// 		},
				// 		fail(res) {}
				// });
				console.log("微信登录",e)
				if(e.detail.errMsg === "getUserInfo:ok"){
					let data={
						signature:e.detail.signature,
						rawData:e.detail.rawData,	
						encryptedData:e.detail.encryptedData,
						iv:e.detail.iv
					}
					uni.login({
						provider: 'weixin',
						success: res => {
							console.log(res);
							data.code=res.code;
							
							that.wxLoginApi(data)
						},
						fail: (res) => {
							that.$mUtils.toast(res.errMsg)
						},
						
					});
				}else if(e.detail.errMsg == "getUserInfo:fail auth deny"){
					console.log("拒绝授权")
				}
			},
			
			
			
			wxLoginApi(data){
				let that=this;
				that.$api.wxLogin({
					data
				}).then(res=>{
					console.log("登录结果",res)
					if(res.data.code === 200){
						uni.showToast({
							title: '登录成功'
						})
						
						this.$store.dispatch('setAuthorization',res.data.data.authorization)
						that.$mRouter.push({route:this.$mRoutesConfig.index})
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		background-color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		 image{
		  display: block;
		  width: 150upx;
		  height: 150upx;
		  border-radius: 50%;
		  margin:0upx auto;
		}
		view{
		  width: 80%;
		  margin: 0 auto;
		  font-size: 30upx;
		  line-height: 50upx;
		
		}
		
		.gray-txt{
		color:#666;
		padding: 50upx 0;
		}
		
		.radius-btn{
			background-color: #27C79A;
		  width: 80%;
		 border-radius: 50upx;
		 color:#fff;
		}
	}
</style>
