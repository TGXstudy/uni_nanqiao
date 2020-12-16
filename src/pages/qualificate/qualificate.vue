<template>
	<view class="container">
		<view class="steps-bar">
			<view class="steps-item">
				<image v-if="step_status == 1" src="../../static/image/icon/step1_now.png" ></image>
				<image  v-else src="../../static/image/icon/step1.png" ></image>
				
				<text :class="step_status == 1 ?'greet-txt':''">填写信息</text>
			</view>
			<view class="line green-line"></view>
			<view class="steps-item">
				<image v-if="step_status == 2"  src="../../static/image/icon/step2_now.png" ></image>
				<image v-else src="../../static/image/icon/step2.png" ></image>
				<text :class="step_status == 2 ?'greet-txt':''">审核中</text>
			</view>
			
			<view class="line grey-line"></view>
			
			<view class="steps-item">
				<image v-if="step_status == 3"   src="../../static/image/icon/step3_now.png" ></image>
				<image v-else src="../../static/image/icon/step3.png" ></image>
				<text :class="step_status == 3 ?'greet-txt':''">审核通过</text>
			</view>
			
		</view>
		<view class="seam">	</view>
		<view class="form-box">
			<form @submit="subQua" >
				<view class="input-box bor-bot" >
					<label class="label-txt" >姓名</label>
					<input type="text" placeholder="请输入真实姓名"  v-model="name" :disabled="!canEdit"/>
				</view>
				<view class="input-box bor-bot" >
					<label class="label-txt" >身份证号 </label>
					<input type="number" placeholder="请输入身份证号"  v-model="idnum" maxlength="18" :disabled="!canEdit" />
				</view>
				<view class="input-box bor-bot" >
					<label class="label-txt" >手机号 </label>
					<input type="number" placeholder="请输入联系方式" v-model="tel" :disabled="!canEdit"/>
				</view>
				<view class="input-box bor-bot" >
					<label class="label-txt" >验证码</label>
					<input type="number" placeholder="验证码"  v-model="code" :disabled="!canEdit"/>
					<!-- <verifyCode class="code-btn" :mob="tel" :type=""></verifyCode> -->
					<verifyCode v-if="canEdit" class="code-btn" :btnColor="'green'" :mob="tel" :type="1" ></verifyCode>
					<button v-else  class='dis-btn' disabled="true">获取</button>
				</view>
				<view class="input-box bor-bot">
					<label class="label-txt" >所在区域</label>
					<view v-if="canEdit" class="show-txt" @tap="goChooseAddr">
						<text v-if="addr" style="color:#333">{{addrText}}</text>
						<text v-else>点击选择</text>
						<image src="../../static/image/icon/enter_icon.png" ></image>
					</view>
					<view v-else class="show-txt">
						<text  style="color:#333">{{addrText}}</text>
						<image src="../../static/image/icon/enter_icon.png" ></image>
					</view>
				</view>
				<view class='radio-opt'>
				 	<view class="opt-title">
				 		请上传您的身份证：
				 	</view>
					<view class="addImg-box">
						<image v-if="canEdit" :src="id_card_front_pre || '../../static/image/icon/zhengmian.png'" @tap="upImg('front')"></image>
						<image v-else :src="id_card_front_pre" ></image>
						
						<image v-if="canEdit" :src="id_card_back_pre || '../../static/image/icon/fanmian-.png'" @tap="upImg('back')"></image> 
						<image v-else  :src="id_card_back_pre" ></image> 
					</view>
					
				 	
				</view>
				<view class="seam"></view>
				
				<view class='radio-opt'>
				 	<view class="opt-title">
				 		请上传您的健康证（选填）：
				 	</view>
					<view class="addImg-box">
					<image v-if="canEdit"  :src="health_card_pre || '../../static/image/icon/jiankang.png'" @tap="upImg('health')"></image>
					<image v-else  :src="health_card_pre || '../../static/image/icon/jiankang.png'" @tap="showTips"></image>
					</view>
					
				 	
				</view>
				<view class="seam"></view>
				
				<view class="fix-part">
					<view class="agress-box">
							<label class="radio-item" @tap="this.is_agree=!this.is_agree" >
								<radio  :checked="is_agree" name="is_agress" color="#27C79A" />
								我已阅读并同意 <text class="green-txt" @tap="seeProtocol">《南峤宿洁入驻协议》</text>
							</label>
						</radio-group>
					</view>
					<view class="btn-area">
						<button formType="submit" :disabled="!canEdit">提交</button>
					</view>
					
				</view>
				
				
			</form>
		</view>
	</view>
</template>

<script>
	import addImg from "../../components/addImg.vue"
	import verifyCode from "../../components/verifyCode.vue"
	import tuiButton from "@/components/tui/button/button"
	export default{
		components:{
			addImg,verifyCode,tuiButton
		},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				is_agree:true,
				name:"", //	String				姓名
				idnum:"",//	String				身份证号
				tel:"",//	String			电话
				code:'',
				province:'', //	String	 		所在省
				city: "", //	String				所在城市
				county:"",//	String					所在区
				addr:"",//	String				详细地址
				house_num:"", //	String		门牌号
				lon: '', //String			经度
				lat:'',//	String						纬度
				id_card_front_pre:'',//	String						身份证正面
				id_card_back_pre:'',//	String						身份证背面
				health_card_pre:'',//String						健康证(选填)
				id_card_front:'',//	String						身份证正面
				id_card_back:'',//	String						身份证背面
				health_card	:'',//String						健康证(选填)
				addrText:'',
				canEdit:false, //是否可编辑
				status:'',//审核状态
				step_status:"1" , //认证步骤
			}
		},
		onLoad(){
			//获取认证信息
			this.getCertInfo();
		},
		onShow(){
			let addr=this.$store.getters.getNewAddress;
			console.log("onShow",addr)
			if(addr.addr){
				console.log("getaddr",addr)
				let addrObj=JSON.parse(addr.addrJson)
				this.province=addrObj.province;
				this.city=addrObj.city;
				this.county=addrObj.county;		//			所在区
				this.addr=addrObj.addr;
				this.house_num=addr.addrDetail;
				let locArr=this.$mUtils.locToArr(addr.location);
				this.lon=locArr[0]
				this.lat=locArr[1]
				this.addrText=addr.addr+" "+addr.addrDetail
			}
			
			
			
		},
		methods:{
			//
			showTips(){
				this.$mUtils.toast("正在审核,请等待...")
			},
			//获取认证信息
			getCertInfo(){
				let that=this;
				
				that.$api.getCert(that.Authorization)
				.then(res=>{
					console.log("获取认证信息结果",res.data)
					if(res.data.code === 200){
						let data=res.data.data;
						
						that.status=data.status;//审核状态
						
						that.name=data.name;
						that.idnum=data.idnum;
						that.tel=data.tel;
						that.province=data.province; //	String	 		所在省
						that.city=data.city; //	String				所在城市
						that.county=data.county;//	String					所在区
						that.addr=data.addr;//	String				详细地址
						that.house_num=data.house_num ;//	String		门牌号
						that.lon=data.lon; //String			经度
						that.lat=data.lat;//	String						纬度
						that.id_card_front_pre=data.id_card_front_pre;//	String						身份证正面
						that.id_card_back_pre=data.id_card_back_pre;//	String						身份证背面
						that.health_card_pre=data.health_card_pre;//String						健康证(选填)
						that.id_card_front=data.id_card_front; //ring						身份证正面
						that.id_card_back=data.id_card_back;//	String						身份证背面
						that.health_card=data.health_card;//String						健康证(选填)
						that.step_status=data.step_status
						
						if( data.city !=undefined && data.county !=undefined && data.addr !=undefined && data.house_num !=undefined){
							that.addrText=data.province+data.city+data.county+data.addr+" "+data.house_num;
						}
						
						
						console.log(that.addrText,data.province)
						
						if(data.refuse === '拒绝'){
							that.$mUtils.toast("审核拒绝,请重新提交")
						}
						if(data.status === '0' ){
							that.$mUtils.toast("正在审核,请等待...")
							that.canEdit= false;
						}else if(data.status === '1'){
							that.$mUtils.toast("审核通过")
							that.canEdit= false;
						}else{
							that.canEdit= true;
						}
						
						
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				})
				
			},
			//
			subQua(e){
				let that=this;
				if(this.is_agree){
					// console.log("提交认证",e.detail.value,this.name,this.idnum,this.tel,this.code);
					// console.log("提交认证",this.province,this.city,this.county,this.addr,this.house_num);
					// console.log("提交认证",this.lon,this.lat,this.id_card_front,this.id_card_back,this.health_card);
					// console.log("提交认证",this.addrText);
					
					if(that.name == undefined || that.name.trim().length === 0){
						that.$mUtils.toast("请输入真实姓名")
						return;
					}
					if(that.idnum == undefined || that.idnum.trim().length === 0){
						that.$mUtils.toast("请输入身份证号")
						return;
					}else if(!that.$regs.isIdCard.test(that.idnum)){
						that.$mUtils.toast("请输入正确的身份证号")
						return;
					}
					if(that.tel == undefined || that.tel.trim().length === 0){
						that.$mUtils.toast("请输入联系方式")
						return;
					}else if(!that.$regs.isPhone.test(that.tel)){
						that.$mUtils.toast("请输入正确的手机号")
						return;
					}
					if(that.code == undefined || that.code.trim().length === 0){
						that.$mUtils.toast("请输入验证码")
						return;
					}
					if(that.addrText == undefined || that.addrText.trim().length === 0){
						that.$mUtils.toast("请选择所在区域")
						return;
					}
					if(that.id_card_front == undefined || that.id_card_front.trim().length === 0){
						that.$mUtils.toast("请上传您的身份证正面")
						return;
					}
					if( that.id_card_back == undefined || that.id_card_back.trim().length === 0){
						that.$mUtils.toast("请上传您的身份证反面")
						return;
					}
					// console.log("请选择所在区域",that.addrText)
					//提交认证
					that.subCert()
				
				}else{
					this.$mUtils.toast("请先阅读并同意《南峤宿洁入驻协议》")
				}
				
			},
			//提交认证
			subCert(){
				let that=this;
				that.$api.submitCert({
					data:{
						name:that.name, //	String				姓名
						idnum:that.idnum,//	String				身份证号
						tel:that.tel,//	String			电话
						code:that.code,
						province:that.province, //	String	 		所在省
						city:that.city, //	String				所在城市
						county:that.county,//	String					所在区
						addr:that.addr,//	String				详细地址
						house_num:that.house_num, //	String		门牌号
						lon: that.lon, //String			经度
						lat:that.lat,//	String						纬度
						id_card_front:that.id_card_front,//	String						身份证正面
						id_card_back:that.id_card_back,//	String						身份证背面
						health_card	:that.health_card,//String						健康证(选填)
					}
				},that.Authorization).then(res=>{
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						let tid=setTimeout(()=>{
							that.$mRouter.push({route:that.$mRoutesConfig.index})
							clearTimeout(tid)
						},500)
						
					}
					console.log("提交认证结果",res.data)
				})
			},
			
			//
			upImg(imgType){
				let that=this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera'], //从相册选择
					success: function (res) {
						
						that.$api.uploadFile(res.tempFilePaths[0],"file",that.Authorization)
						.then(res=>{
							let result=JSON.parse(res.data)
							// console.log("上传记录",result)
							if(result.code === "200"){
								
								if(imgType === 'front'){
									that.id_card_front_pre=result.data.preview_url
									that.id_card_front=result.data.url
								}else if(imgType === 'back'){
									that.id_card_back_pre=result.data.preview_url
									that.id_card_back=result.data.url
								}else if(imgType === 'health'){
									 that.health_card_pre=result.data.preview_url
									 that.health_card=result.data.url
								}
								console.log("上传记录",result.data.preview_url)
							}else{
								that.$mUtils.toast(result.msg)
							}
							// console.log("上传记录",res)
						})
						
					}
				})
			},
			seeProtocol(){
				this.$mRouter.push({route:this.$mRoutesConfig.protocol,query:{type:'joindoc'}})	
			},
			//跳转选择地址
			goChooseAddr(){
				this.$mRouter.push({route:this.$mRoutesConfig.chooseAddr,query:{fromPage:'qualificate'}})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.container{
		width: 100%;
		background-color:#fff;
		padding-bottom:240upx;
		.steps-bar{
			width: 100%;
			height: 150upx;
			
			justify-content:center;
			align-items:center;
			.steps-item{
				width: 100upx;
				flex-direction:column;
				justify-content:center;
				align-items:center;
				text{
					font-size: 22upx;
					color: #999999;
				}
				.greet-txt{
					color:#27C79A
				}
				image{
					width: 50upx;
					height: 50upx;
				}
			}
			
			.line{
				width: 150upx;
				height: 4upx;
				margin: 0 10upx;
			}
			.green-line{
				background-color: #27C79A;
			}
			.grey-line{
				background-color: #DCDCDC;
			}
		}
		form{
			display: block;
			width: 100%;
			background-color: #ffffff;
			.form-box{
				width: 100%;
				background-color:#fff;
				
			}
		.radio-opt{
			width: 95%;
			margin: 0 auto;
			display:block;
			margin-bottom: 20upx;
			.opt-title{
				color:#333333;
				font-size: 28upx;
				padding:30upx 0;
			}
			.addImg-box{
				width: 90%;
				margin: 0 auto;
				justify-content:space-between;
				image{
					width:280upx;
					height:185upx;
				}
			}
		}
		
			.fix-part{
					display:flex;
					flex-direction: column;
					justify-content: center;
					background-color: #ffffff;
					position: fixed;
					bottom:0;
					left: 0;
					width: 100%;
					height: 240upx;
					padding:20upx;
					z-index: 999;
					box-sizing:border-box;
					.agress-box{
						color:#AAAAAA;
						font-size: 28upx;
						line-height: 80upx;
						radio{
							transform: scale(.7);
						}
						.green-txt{
							color:#27C79A
						}
					}
					
					button{
						width: 95%;
						height: 90upx;
						line-height: 90upx;
						text-align: center;
						border-radius: 50upx;
						background-color: #27C79A;
						font-size: 36upx;
						padding: 0;
					}
				}
			
		}
		
	}
	  .dis-btn{
			border-radius: 45upx;
			background-color: #f6f6f6;
			font-size: 24upx;
	  }
	
</style>
