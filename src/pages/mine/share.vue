<template>
	<view class="container">
		<image :src="img" @longpress="saveImg"></image>
	</view>
</template>

<script>
	export default{
		data(){
				return{
					Authorization:this.$store.getters.getAuthorization,
					img:''
				}
		},
		onLoad() {
			this.$api.shareQrcode().then(res=>{
				console.log("分享好友",res)
				if(res.data.code == 200){
					this.img=res.data.data.img;
				}else{
					this.$mUtils.toast(res.data.msg)
				}
			})
		},
		methods:{
			saveImg(){
				let that=this;
				console.log("长按保存图片")
				uni.showActionSheet({
					itemList:[
						"保存图片"
					],
					success(res) {
						
						if(res.errMsg=="showActionSheet:ok"&& res.tapIndex==0){
							
							uni.getSetting({
								success(res) {
									if (!res.authSetting['scope.writePhotosAlbum']) {
										uni.authorize({
											scope: 'scope.writePhotosAlbum',
											success () {//用户允许授权，保存图片到相册
												that.saveToAblum();
											},
											fail() {
												uni.openSetting({
													success () {
														wx.authorize({
															scope: 'scope.writePhotosAlbum',
															success() {
																that.saveToAblum();
															}
														})
													}
												})
											}
										})
									}else{
										that.saveToAblum();
									}
								}
							})
						}
					}
				})
			},
			saveToAblum(){
				let that=this;
			
			console.log("图片文件路径",that.img)
				uni.downloadFile({
					url:that.img,
					success(res) {
						console.log("图片文件路径",res.tempFilePath)
						uni.saveImageToPhotosAlbum({
							filePath:res.tempFilePath,//	String	是	图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
							success(res) {
								console.log("保存成功",res)
								that.$mUtils.toast("保存成功")
							},
							fail() {
								console.log("保存失败",res)
								that.$mUtils.toast("保存失败")
							}
						})
					},
					fail(res) {
						that.$mUtils.toast("downloadFile fail")
						console.log("downloadFile fail",res);
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
		
	
			
			image{
				width: 100%;
			height: 100%;
			}
		
	
	
</style>
