<template>
	<view class="container">
		<form @submit="submitOrder">
			
			<view  v-if="myAddr.id" class='addr-box'  @tap.stop="goAddrList">
				<!-- <input type="text" v-model="myAddr.id" name="addr_id" v-show="false" /> -->
				<input type="text" v-model="myAddr.id" name="addr_id" v-show="false" />
				<text>地址</text>
				<view class="addr-con">
					<view class="person-info">
						<text>{{myAddr.name}}</text>
						<text>{{myAddr.tel}}</text>
					</view>
					<view class="addr-info">
						{{myAddr.addr}}
					</view>
				</view>
				<image src="../../static/image/icon/enter_icon.png"></image>
			</view>
			<view v-else class="addr-box flex-center" @tap.stop="goAddrList" >
				<image src="../../static/image/icon/addfee_icon.png"></image>
				<text>新增地址</text>
			</view>
			<view class='radio-opt'>
				<view class="opt-title">
					户型
				</view>
				<view class="opt-box">
					<radio-group  @change="radioOpt($event,'huxing')" name="huxing" >
						<label class="opt-item" v-for="item in serList.huxing" :key="item.id"  :class="chooseId.huxing === item.id? 'this-opt' : ''"  >
							{{item.des}} 
							<radio :value="JSON.stringify(item)" v-show="false" />
						</label>
					</radio-group>
				</view>
			</view>
			<view class='radio-opt'>
				<view class="opt-title">
					床位
				</view>
				<view class="">
					<radio-group name="beds" @change="radioOpt($event,'beds')">
						<!-- {{item.price}} -->
						<label class="opt-item"  v-for="item in serList.beds" :key="item.id"  :class="chooseId.beds === item.id? 'this-opt' : ''"  >
							{{item.des}} 
							<radio :value="JSON.stringify(item)"   v-show="false" />
						</label>
					</radio-group>
				</view>
			</view>
			<view class='radio-opt'>
				<view class="opt-title">
					卫生间
				</view>
				<view class="">
					<!-- {{item.price}} -->
					<radio-group name="baths"  @change="radioOpt($event,'baths')">
						<label class="opt-item"  v-for="item in serList.baths" :key="item.id"  :class="chooseId.baths === item.id? 'this-opt' : ''"  >
							{{item.des}} 
							<radio :value="JSON.stringify(item)"   v-show="false" />
						</label>
					</radio-group>
				</view>
			</view>
			<view class='radio-opt'>
				<view class="opt-title">
					其他
				</view>
				<view class="">
					<!-- {{item.price}} -->
					
					<checkbox-group name="other"  @change="checkOpt($event,'other')">
						<label class="opt-item"  v-for="item in serList.other" :key="item.id"  :class="chooseId.other.indexOf(item.id) > -1? 'this-opt' : ''"  >
							{{item.des}} 
							<checkbox :value="JSON.stringify(item)"  v-show="false"  />
						</label>
						
						
					</checkbox-group>
				</view>
			</view>
			<view class="seam"></view>
			
			
			<view class='radio-opt'>
				<view class="opt-title">
					清洁类型
				</view>
				<view class="">
					<radio-group name="clean_type"  @change="radioOpt($event,'clean_type')">
						<label class="radio-item" v-for="item in serList.clean_type" :key="item.id">
							<radio :value="JSON.stringify(item)" color="#27C79A" /> {{item.des}} 
						</label>
					</radio-group>
				</view>
			</view>
			<view class='radio-opt'>
				<view class="opt-title">
					工具及清洁剂
				</view>
				<view class="">
					
					<radio-group name="clean_tool"  @change="radioOpt($event,'clean_tool')">
						<label class="radio-item" v-for="item in serList.clean_tool" :key="item.id">
							<radio :value="JSON.stringify(item)" color="#27C79A" /> {{item.des}} 
						</label>
					</radio-group>
				</view>
			</view>
			<view class='radio-opt'>
				<view class="opt-title">
					布草清洗
				</view>
				<view class="">
					<radio-group name="clean_cloth"  @change="radioOpt($event,'clean_cloth')">
						<label class="radio-item" v-for="item in serList.clean_cloth" :key="item.id">
							<radio :value="JSON.stringify(item)" color="#27C79A" /> {{item.des}} 
						</label>
					</radio-group>
				</view>
			</view>
			<view class="seam"></view>
			
			<view class="other-data">  
				<view class="data-title">
					加急服务费
				</view>
				<view class="data-con">
					<input type="number" v-show="false" name="urgent_fee" v-model="orderInfo.urgent_fee">
					<numberbox :step="step" 
										 :value="orderInfo.urgent_fee"
										 :iconcolor="'#27C79A'"
										 @change="urgentFee" >
					</numberbox>
				</view>
			</view>
			<view class="seam"></view>
			
			
			<input type="text" :value="orderInfo.serv_time" name="serv_time" v-show="false"/>
			<view class="other-data bor-bot">
				<view class="data-title">
					选择服务日期
				</view>
				<view class="data-con">
					<input type="text" :value="serv_date" name="pick_date" v-show="false"/>
					<picker mode="date" @change="pickDate">
						<view>{{serv_date}} <image src="../../static/image/icon/enter_icon.png" ></image></view>
					</picker>
				</view>
			</view>
			<view class="other-data bor-bot">
				<view class="data-title">
					选择服务时间
				</view>
				<view class="data-con">
					<input type="text" :value="serv_time" name="pick_time" v-show="false"/>
					<picker mode="time" @change="pickTime">
						<view>{{serv_time}} <image src="../../static/image/icon/enter_icon.png" ></image></view>
					</picker>
				</view>
			</view>
			
			<view class="other-data bor-bot">
				<view class="data-title ">
					指定保洁人员 
				</view>
				<view class="data-con" @tap="goCleanList">
					<input type="text" v-show="false" name="assign_clean_worker" v-model="clean.clean_id"/>
					<view v-if="clean.id" class="clean-box">
						<image  class="avatar-img" :src="clean.avatar" ></image>
						<text>{{clean.name}}</text>
					</view>
					<text v-else>请选择</text>
					<image src="../../static/image/icon/enter_icon.png" ></image>
				</view>
			</view>
			<view class="other-data bor-bot">
				<view class="data-title">
					智能密码锁 
				</view>
				<view class="data-con">
					<input type="text" value="" name="lock_pass" placeholder="请输入智能锁密码" />
				</view>
			</view>
			<view class="other-data">
				<view class="data-title">
					备注 
				</view>
				<view class="data-con">
					<input type="text" value="" name="des" placeholder="请输入备注信息 "/>
				</view>
			</view>
			<view class="seam"></view>
			<view class='radio-opt'>
			 	<view class="opt-title">
			 		房间示例图
			 	</view>
				<addImg 
					:maxCount="9"
					:addImgIcon="'../../../static/image/icon/addimg_icon.png'"
					:delIcon="'../../../static/image/icon/delimg_icon.png'"
					:size="180"
					@addImg="addImg">
				</addImg>
			 	
			</view>
			<view class="seam"></view>
			<view class="fix-part">
				<view class="agress-box">
						<label class="radio-item" @tap="this.is_agree=!this.is_agree" >
							<radio value="0" :checked="is_agree" name="is_agress" color="#27C79A" />
							我已阅读并同意 <text class="green-txt" @tap="seeProtocol">《南峤宿洁服务协议》</text>
						</label>
					</radio-group>
				</view>
				<view class="detail-box"> 
					<view class="detail-info">
						<view class="total-sum">
							共<text>￥{{sum}}</text>元
						</view>
						<view class="see-detail"  @tap="goBookDetail">
							查看明细 <image src="../../static/image/icon/enter_icon.png"></image>
						</view>
					</view>
					<button type="primary" form-type="submit">提交</button>
				</view>
				
			</view>
			
		</form> 
	</view>
</template>

<script>
	import numberbox from "../../components/tui/numberbox/numberbox.vue"
	import addImg from "../../components/addImg.vue"
	export default{
		components:{
			numberbox,addImg
		},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				myAddr:{},
				addr_id:"", //服务地址id,
				serList:{},//获取服务清单 
				orderInfo:{
					addr_id:"",//	String	服务地址id
					huxing:"",//	String	户型
					beds:"",//	String				床位数
					baths:"",//	String卫生间数
					clean_type:"",//	String 清洁类型
					clean_tool:"",//	String		清洁工具
					clean_cloth:"",//	String				布草清洗
					serv_time:"",//	String		服务时间
					total_fee:"",//	String	总价格
					other:[],//Array		其他服务（选填）
					urgent_fee:"",//String		加急费用（选填）
					assign_clean_worker:"",//String		指定保洁员（选填）
					lock_pass:"",//	String		智能密码锁(选填)
					des:"",//	String		备注信息(选填)
					servInfo:"", //	String	服务价格明细
					room_imgs :[],//	String		房间图片
				},
				chooseId:{
					other:[],//Array		其他服务（选填）
				},
				step:5, //加急费用步长
				orderPrice:{
					huxing:0,//户型
					beds:"",//	String				床位数
					baths:"",//	String卫生间数
					other:[],//Array		其他服务（选填）
				},
				sum:0,//总金额
				is_agree:true,
				// serv_date:new Date().toLocaleDateString().replace(/\//g,"-"),
				serv_date:'请选择',
				// serv_time:new Date().getHours()+":"+new Date().getMinutes(),
				serv_time:'请选择',
				clean:null,
			}
		},
		onLoad(){
			//获取我的地址
			this.getAddrs()
			//获取服务清单
			this.serviceList();
		},
		onShow() {
			
			
			if(this.$store.getters.getAddress.addr){
				this.myAddr=this.$store.getters.getAddress
				this.addr_id=this.myAddr.id;
				this.myAddr.tel=this.$mUtils.hideTel(this.myAddr.tel)
			}
			if(this.$store.getters.getClean){
				this.clean=this.$store.getters.getClean
				console.log("页面显示",this.$store.getters.getClean,this.clean)
			}
		
		},
		methods:{
			//跳转保洁收藏页面
			goCleanList(){
				this.$mRouter.push({route:this.$mRoutesConfig.fav,query:{ fromPage:'overbook'}})
			},
			//查看协议
			seeProtocol(){
				this.$mRouter.push({route:this.$mRoutesConfig.protocol,query:{type:'serdoc'}})	
			},
			//获取服务清单 serList
			serviceList(){
				this.$api.serviceList({},this.Authorization)
				.then(res=>{
					if(res.data.code === 200){
						this.serList=res.data.data;
						console.log("获取服务清单",res.data.data)
					}
					
				})
			},
			//获取我的地址
			getAddrs(){
				let that=this;
				that.$api.getAddrs({},that.Authorization)
				.then(res=>{
					if(res.data.code === 200){
					
						that.myAddr=res.data.data[0];
						that.myAddr.tel=this.$mUtils.hideTel(that.myAddr.tel)
						this.addr_id=this.myAddr.id;
					}else if(res.data.code === 1003){
						that.$mUtils.toast("请先登录")
						// that.$mRouter.back();
						let tid=setTimeout(()=>{
							 that.$mRouter.push({route:this.$mRoutesConfig.login});
							 clearTimeout(tid)
						},200)
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					
				})
			},
			//跳转地址列表页
			goAddrList(){
				this.$mRouter.push({route:this.$mRoutesConfig.address,query:{fromPage:'overbook'}})
			},
			// 查看明细
			goBookDetail(){
				if(this.sum !== 0){
					this.$mRouter.push({route:this.$mRoutesConfig.bookDetail,query:{order:JSON.stringify(this.orderPrice),sum:this.sum}})
				}else{
					this.$mUtils.toast("请先选择")
				}
				 // console.log("查看明细",this.orderPrice)
			},
			radioOpt(e,field){
				let that=this;
				// console.log("单选",e,field,e.detail.value);
				that.orderInfo[field]=JSON.parse(e.detail.value).des;
				that.orderPrice[field]=JSON.parse(e.detail.value).price;
				that.chooseId[field]=JSON.parse(e.detail.value).id;
			
				//计算总金额
				that.computeSum(); 
			},
			
			checkOpt(e,field){
				let that=this;
				let checkData=e.detail.value;
				// console.log("多选",e.detail.value)
				if(checkData.length !== 0){
					// console.log("多选",e.detail.value,JSON.parse(checkData[0]));
					let desArr=[]
					let pirceArr=[]
					let idArr=[]
					for(let i in checkData){
						console.log(checkData[i])
						desArr.push(JSON.parse(checkData[i]).des)
						pirceArr.push(JSON.parse(checkData[i]).price)	
						idArr.push(JSON.parse(checkData[i]).id)
					}		
					that.orderInfo[field]=desArr
					that.orderPrice[field]=pirceArr
					that.chooseId[field]=idArr
				}else{
					that.orderInfo[field]=[]
					that.orderPrice[field]=[]
					that.chooseId[field]=[]
				}
				//计算总金额
				that.computeSum(); 
			},
			
			//计算总金额
			computeSum(){
			
				let that=this;
				that.sum=0;
				// console.log("计算总金额",that.orderPrice)
				for(let key in that.orderPrice){
					that.sum= that.sum - 0
					if(that.orderPrice[key] instanceof Array ){
						let arrItem=that.orderPrice[key]
						for(let i=0;i<arrItem.length;i++){
							that.sum += (arrItem[i] - 0);
						}
						
					}else{
						that.sum += (that.orderPrice[key] - 0);
					}
					
				}
				
				// 获取加急费用
				// that.sum+=(this.orderInfo.urgent_fee-0);
				
				that.sum=that.sum.toFixed(2)
				
				that.orderInfo.total_fee=that.sum;
				// console.log("计算总金额",that.sum)
			},
			//获取加急费用
			urgentFee(e){
				// this.sum -=0;
				this.orderInfo.urgent_fee=e.value
				this.orderPrice.urgent_fee=e.value
				// if(e.type == "plus"){
				// 	this.sum += (this.step-0)
				// }else if(e.type == "reduce"){
				// 	this.sum -=this.step
				// }
				console.log("加急费用",e,this.orderInfo.urgent_fee);
				
				this.computeSum(); 
				
				
			},
			pickDate(e){
				console.log("服务时间",e)
				this.serv_date=e.detail.value
				this.orderInfo.serv_time=this.serv_date+" "+this.serv_time
			},
			//
			pickTime(e){
				console.log("服务时间",e)
				this.serv_time=e.detail.value
				this.orderInfo.serv_time=this.serv_date+" "+this.serv_time
			},
			//
			addImg(e){
				this.orderInfo.room_imgs=e.imgs;		
			},
			
			//api提交订单
			saveOrder(formData){
				let that=this;
				//提交订单
				that.$api.submitOrder({
					data:{
						addr_id:formData.addr_id,//	String	服务地址id
						huxing:that.orderInfo.huxing,//	String	户型
						beds:that.orderInfo.beds,//	String				床位数
						bathroom:that.orderInfo.baths,//	String卫生间数
						clean_type:that.orderInfo.clean_type,//	String 清洁类型
						clean_tool:that.orderInfo.clean_tool,//	String		清洁工具
						clean_cloth:that.orderInfo.clean_cloth,//	String				布草清洗
						serv_time:formData.serv_time,//	String		服务时间
						total_fee:that.sum,//	String	总价格
						other:that.orderInfo.other,//Array		其他服务（选填）
						urgent_fee:that.orderInfo.urgent_fee,//String		加急费用（选填）
						assign_clean_worker:formData.assign_clean_worker,//String		指定保洁员（选填）
						lock_pass:formData.lock_pass,//	String		智能密码锁(选填)
						des:formData.des,//	String		备注信息(选填)
						servInfo:JSON.stringify(formData), //	String	服务价格明细
						room_imgs :JSON.stringify(that.orderInfo.room_imgs),//	String		房间图片
					}
				},that.Authorization).then(res=>{
					if(res.data.code === 200){
						this.$mUtils.toast(res.data.msg)
						this.$mRouter.push({route:this.$mRoutesConfig.payment,query:{sum:this.sum,fromPage:'overbook',orderId:res.data.data.order_id}})
					}else{
						this.$mUtils.toast(res.data.msg)
					}
					console.log("提交订单结果",res.data)
				})
				
			},
			
			//提交订单
			submitOrder(e){
				let that=this;
				if(that.is_agree){
				
					let formData=e.detail.value;
					
					console.log("this.orderInfo的值：",this.orderInfo)
					console.log("String	总价格 that.sum：",this.sum)
					console.log("this.orderPrice的值：",this.orderPrice)
					console.log("提交订单表单数据",formData)
					console.log("指定保洁员",formData.assign_clean_worker)
					
					
					if( formData.pick_date == '请选择'){
							that.$mUtils.toast("选择服务日期");
							return;
					}
					if( formData.pick_time == '请选择'){
							that.$mUtils.toast("选择服务时间");
							return;
					}
					if(formData.serv_time === ''){
							formData.serv_time=formData.pick_date+" "+formData.pick_time
					}
					//检查是否绑定手机号  绑定了 调用saveOrder(formData)
					that.hasBindTel(formData);
				
				}else{
					this.$mUtils.toast("请先阅读并同意《南峤宿洁服务协议》")
				}
				
			},
			//检查是否绑定手机号  绑定了 调用saveOrder(formData)
			hasBindTel(formData){
				let that=this;
				that.$api.checkBindTel({},that.Authorization)
				.then(res=>{
					console.log("检查是否绑定手机号",res)
					if(res.data.code == 200){
						that.saveOrder(formData);
					}else if(res.data.code == 500){
						that.$mUtils.toast(res.data.msg);
						let tid=setTimeout(()=>{
							that.$mRouter.push({route:that.$mRoutesConfig.bindTel})
						},500)
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					
				})
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.container{
		width: 100%;
		background-color: #ffffff;
		padding-bottom:240upx;
		
		radio-group{
			display: flex;
			width: 100%;
			flex-wrap: wrap;
			justify-content: flex-start;

		}
		.bor-bot{
			border-bottom: 2upx solid #e5e5e5;
		}
		.addr-box{
			width: 95%;
			margin: 0 auto;
			border-bottom: 2upx solid #e5e5e5;
			display: flex;
			justify-content:space-between;
			align-items: center;
			padding:20upx 0;
			text{
				display: block;
				width: 150upx;
				font-size: 28upx;
				color:#666666;
			}
			.addr-con{
			  flex:1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				line-height: 50upx;
				.person-info{
					
					text{
						color:#333333;
						
						font-size: 30upx;
						font-weight: bold;
					}
					
				}
				.addr-info{
					color:#999999;
					font-size: 28upx;
				}
				
			}
			image{
				width: 40upx;
				height: 40upx;
			}
		}
		.flex-center{
			
				justify-content: center ;
				text{
					display: block;
					margin-left: 20upx;
					color: #333;
				}
		}
		
		.radio-opt{
			width: 95%;
			margin: 0 auto;
			display:block;
			
			.opt-title{
				color:#333333;
				font-size: 28upx;
				font-weight: bold;
				padding: 20upx 0;
			}
			
			.opt-item{
				display: inline-block;
				color:#27C79A;
				font-size: 26upx;
				background-color: #EDFFFA;
				border: #27C79A solid 2upx;
				padding:10upx 20upx;
				border-radius: 30upx;
				margin-right: 20upx;
				margin-bottom: 15upx;
			}
			.this-opt{
				background-color: #27C79A;
				color:#ffffff;
			}
			.radio-item{
				font-size: 26upx;
				margin-right: 20upx;
				margin-bottom: 20upx;
				radio{
					transform:scale(0.7);
				}
			}
		}
		.other-data{
			width:95%;
			margin:0 auto;
			height:100upx;
			display:flex;
			justify-content:space-between;
			align-items:center;
			.data-title{
				color:#333333;
				font-size: 28upx;
			}
			.data-con{
				font-size: 28upx;
				display:flex;
				justify-content:flex-end;
				align-items:center;
				input{
					text-align: right;
					font-size: 28upx;
				}
				image{
					width: 40upx;
					height: 40upx;
				}
				.clean-box{
					display:flex;
					justify-content:flex-end;
					align-items:center;
				}
				.avatar-img{
					width: 80upx;
					
					height: 80upx;
					border-radius: 50%;
					margin-right: 10upx;
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
			.detail-box{
				display:flex;
				justify-content:space-between;
				.detail-info{
					
					display:block;
					.total-sum{
						display:flex;
						align-items:center;
						color: #333333;
						font-size: 28upx;
						text{
							color:#EC772A;
							font-size: 36upx;
						}
					} 
					.see-detail{
						color: #999999;
						font-size: 22upx;
						display:flex;
						align-items:center;
						image{
							width: 40upx;
							height: 40upx;
						}
					}
					
				}
				button{
					width: 460upx;
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
	input{
		border: none;
	}
</style>
