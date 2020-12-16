<template>
	<view class="container">
		<form @submit="subFeed" >
			<view class="input-box">
				<textarea value="" placeholder="最多输入30个汉字" maxlength="30"  name="feedTxt"/>
			</view>
			<view class="service">
				客服电话：{{kf}}
			</view>
			<view class="btn-area">
				<button formType="submit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				kf:"",
				Authorization:this.$store.getters.getAuthorization,
			}
		},
		onLoad() {
			//获取客服电话
			this.kfTel()
		},
		methods:{
			kfTel(){
				this.$api.kftel().then(res=>{
					if(res.data.code === 200){
						console.log(res.data.data)
						this.kf=res.data.data.kf_tel
					}else{
						this.$mUtils.toast(res.data.msg)
					}
				})
			},
			subFeed(e){
				let that=this;
				let fd=e.detail.value;
				if(fd.feedTxt.trim().length === 0){
					that.$mUtils.toast("请输入内容");
					return;
				}
				that.$api.callback({
					data:{
						content:fd.feedTxt
					}
				},that.Authorization).then(res=>{
					if(res.data.code === 200){
							that.$mRouter.back()
					}
					that.$mUtils.toast(res.data.msg);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		background-color:#fff;
		textarea{
			background-color:#f6f6f6;
			width: 100%;
			border: 2upx solid #e5e5e5;
			padding: 20upx;
		}
		.service{
			display: block;
			width: 100%;
			text-align: center;
			font-size: 30upx;
		}
	}
</style>
