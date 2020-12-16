<template>
	<view class="container">
		<form @submit="subPwd" @reset="formReset">
			<view class="tel-num">
				{{hideTel}}
			</view>
			<view class="input-box bor-bot" >
				<label class="label-txt" >验证码</label>
				<input type="number" placeholder="输入验证码" name="code"/>
				<verifyCode class="code-btn" :mob="tel" :type="2"></verifyCode>
			</view>
			<view class="input-box bor-bot">
				<label class="label-txt">支付密码</label>
				<input type="number" password placeholder="设置6位数字的密码"  maxlength="6" name="pwd"/>
			</view>
			<view class="input-box bor-bot">
				<label class="label-txt">确认密码</label>
				<input type="number"  password placeholder="再次确认支付密码" maxlength="6" name="cpwd"/>
			</view>
			
			<view class="btn-area">
				<button formType="submit">确定</button>
			</view>
		</form>
	</view>
</template>

<script>
	
	import sha1 from 'js-sha1';
	import verifyCode from '../../components/verifyCode.vue'
	export default{
		components:{
			verifyCode
		},
		data(){
			return {
				tel:"",
				hideTel:"",
				Authorization:this.$store.getters.getAuthorization,
			}
		},
		methods:{
			subPwd(e){
				let that=this;
				let fd=e.detail.value; //表单数据
				if(fd.code.trim().length === 0){
					that.$mUtils.toast("请输入验证码");
					return;
				}
				if(fd.pwd.trim().length === 0){
					that.$mUtils.toast("请输入密码");
					return;
				}
				if(fd.cpwd.trim().length === 0){
					that.$mUtils.toast("请输入确认密码");
					return;
				}
				if(fd.cpwd !== fd.pwd ){
					that.$mUtils.toast("两次输入的密码不相同");
					return;
				}
				//设置交易密码
				that.setPayPass(fd);
			},
			//设置交易密码
			setPayPass(fd){
				let that=this;
				that.$api.setPayPass({
					data:{
						tel:that.tel,
						code:fd.code,
						password:fd.pwd,	
						repass:fd.cpwd
					}
				},this.Authorization).then(res=>{
					console.log("设置交易密码结构",res)
					if(res.data.code === 200){
						that.$mUtils.toast(res.data.msg)
						that.$mRouter.back()
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				})
			},
			
			//判断是否绑定了手机
			checkBindTel(){
				let that=this;
				that.$api.checkBindTel({},that.Authorization)
				.then(res=>{
					console.log(res)
					if(res.data.code === 200){  //绑定了手机
						console.log("绑定了手机")
						//获取手机号
						that.getTelNum();
						// this.$mRouter.push({route:this.$mRoutesConfig.pwd,query:{tel:that.user.bind_tel}})
					}else if(res.data.code === 500){
						that.$mUtils.toast("请先绑定手机号");
						let tid=setTimeout(()=>{
							this.$mRouter.redirectTo({route:this.$mRoutesConfig.bindTel});
							clearTimeout(tid)
						},500)
						
					}else{
						that.$mUtils.toast(res.data.msg)
						
					}
				})
				
			},
			
			//获取手机号
			getTelNum(){
				let that=this;
				that.$api.getMyInfo({	},that.Authorization)
				.then(res=>{
					
					if(res.data.code === 200){
						that.tel=res.data.data.bind_tel;
						that.hideTel=that.$mUtils.hideTel(that.tel);
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					console.log("我的手机",that.tel)
				})
			}
		},
	
		onLoad() {
			//判断是否绑定了手机
			this.checkBindTel()
			// 
			// if(opt.tel){
			// 	this.tel=opt.tel;
			// 	this.hideTel=this.$mUtils.hideTel(this.tel);
			// }
			// 
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
