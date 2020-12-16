<template>
	<view class="container">
		<form @submit="subBindTel" @reset="formReset">
			<view class="input-box bor-bot">
				<label class="label-txt">手机号</label>
				<input type="number" placeholder="请输入手机号" v-model="tel" name="tel"/>
			</view>
			<view class="input-box bor-bot" >
				<label class="label-txt" >验证码</label>
				<input type="number" placeholder="输入验证码" v-model="code" name="code"/>
				<verifyCode class="code-btn" :mob="tel" :type="3"></verifyCode>
			</view>
			
			<view class="btn-area">
				<button formType="submit">确定</button>
			</view>
		</form>
	</view>
</template>

<script>
	import verifyCode from '../../components/verifyCode.vue'
	export default{
		components:{
			verifyCode
		},
		data(){
			return {
				tel:"",
				code:"",
				Authorization:this.$store.getters.getAuthorization,
			}
		},
		methods:{
			//绑定手机号
			bindTel(){
				let that=this;
				console.log("绑定手机号",that.tel,that.code)
				that.$api.bindTel({
					data:{
						tel:that.tel,
						code:that.code
					}
				},that.Authorization).then(res=>{
					if(res.data.code === 200){
						that.$mUtils.toast(res.data.msg);
						that.$mRouter.back();
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					
				})
			},
			//提交绑定手机号
			subBindTel(e){
				let that=this;
				let formData=e.detail.value
				if(formData.tel.trim().length === 0){
					that.$mUtils.toast("请输入手机号");
					return;
				}
				if(formData.code.trim().length === 0){
					that.$mUtils.toast("请输入验证码");
					return;
				}
				//绑定手机号API
				that.bindTel();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		background-color: #fff;
		padding-top:50upx;
		.tel-num{
			width: 95%;
			margin: 0 auto;
		}
		.input-box{
			align-items: center;
		}
	}
</style>
