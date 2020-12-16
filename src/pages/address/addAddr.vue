<template>
	<view class="container">
			<form @submit="subAddAddr" @reset="formReset">
				<view class="input-box bor-bot" >
					<label class="label-txt" >联系人</label>
					<input type="text" placeholder="请输入联系人姓名"  name="name" v-model="name"/>
				</view>
				<view class="input-box bor-bot">
					<label class="label-txt">手机号</label>
					<input type="text" placeholder="请输入联系人手机号码" name="tel" v-model="tel"/> 
				</view>
				<view class="input-box bor-bot">
					<label class="label-txt" >所在区域</label>
					<input v-show="false" name="addr" v-model="addr"/>
					<view class="show-txt" @tap="goChooseAddr">
						<text v-if="addr" style="color:#333">{{addrTxt}}</text>
						<text v-else>点击选择</text>
						<image src="../../static/image/icon/enter_icon.png" mode=""></image>
					</view>
				</view>
				<view class="input-box">
					<label class="label-txt" >门牌号</label>
					<input v-show="false" name="house_num" v-model="house_num"/>
					<view class="show-txt">
						<text v-if="house_num" style="color:#333">{{house_num}}</text>
						<text v-else>输入门牌号</text>
					</view>
				</view>
				<view class="seam"></view>
				<view class="input-box">
					<input v-show="false"  v-model="is_top" name="is_top" />
					<radio-group  >
					<label class="radio-item" @tap="setIsTop" >
						<radio :checked="is_top"   color="#27C79A" />
						设为默认
					</label>
					</radio-group>
				</view>
				<view class="seam"></view>
				<view class="btn-area">
					<button formType="submit">保存</button>
					
				</view>
			</form>
	</view>
</template>

<script>
	export default{
	  data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				
				name:"" ,//	String 姓名
				tel:"",//	String					电话
				province:"" ,//	String			所在省
				city:"",//	String		所在城市
				county:"",//	String	所在区
				addr:"", //	String		详细地址
				house_num:"",//String  门牌号
				lon:"" , //	String	经度
				lat:"", //	String		纬度
				is_top:0 ,//String	必填 设为默认 is_top = 1
				addrTxt:'',
				opType:'',
				addrId:'',
			}
			
		},
		methods: {
			subAddAddr(e){
				
				let that=this;
				
				console.log("提交新增地址",e.detail.value)
				console.log("提交新增地址",that.province,that.city,that.county,that.addr,that.house_num,that.lon,that.lat)
				
				let fd=e.detail.value;
				
				if(fd.name.trim().length === 0){
					that.$mUtils.toast("请输入联系人姓名");
					return;
				}
				if(fd.tel.trim().length === 0){
					that.$mUtils.toast("请输入联系人手机号码");
					return;
				}else if(!that.$regs.isPhone.test(fd.tel)){
					that.$mUtils.toast("请输入正确的手机号码");
					return;
				}
				if(fd.addr.trim().length === 0){
					that.$mUtils.toast("请选择地址");
					return;
				}
				if(fd.house_num.trim().length === 0){
					that.$mUtils.toast("输入门牌号");
					return;
				}
				console.log("提交新增地址",e.detail.value)
				console.log("提交新增地址",that.province,that.city,that.county,that.addr,that.house_num,that.lon,that.lat)
				
				if(that.opType== 'add'){
					that.addAddr(fd);
				}else if(that.opType== 'edit'){
					that.editAddr(fd);
				}
				
			},
			//编辑地址操作
			editAddr(fd){
				let that=this;
				console.log("提交新增地址",fd)
				console.log("提交新增地址",that.addrId,that.province,that.city,that.county,that.addr,that.house_num)
				console.log("经纬度",that.lon,that.lat)
				that.$api.editAddr({
					data:{
						id:that.addrId,//	String	
						name:	fd.name,
						tel:	fd.tel,
						province:that.province,
						city:that.city,
						county:that.county,
						addr:that.addr,
						house_num:that.house_num,
						lon:that.lon,
						lat:that.lat,
						is_top:fd.is_top,
					}
				},that.Authorization).then(res=>{
					console.log("编辑结果",res.data);
					that.$mUtils.toast(res.data.msg);
					if(res.data.code == 200){
						// that.$mRouter.push({route:that.$mRoutesConfig.address})
						that.$mRouter.back(-1,500)
					}
				})
			},
			//新增地址操作
			addAddr(fd){
				let that=this;
				that.$api.addAddr({
					data:{
						name:	fd.name,					
						tel:	fd.tel,
						province:that.province,
						city:that.city,
						county:that.county,
						addr:that.addr,
						house_num:that.house_num,
						lon:that.lon,
						lat:that.lat,
						is_top:fd.is_top,
						
					}
				},that.Authorization).then(res=>{
					
					console.log("提交新增地址",res)
					that.$mUtils.toast(res.data.msg);
					if(res.data.code == 200){
						// that.$mRouter.push({route:that.$mRoutesConfig.address})
						that.$mRouter.back(-1,500)
					}
				})
			},
			//设置为默认地址
			setIsTop(){
				if(this.is_top === 0){
					this.is_top=1
				}else{
					this.is_top=0
				}
				console.log("设置为默认地址",this.is_top)
			},
			//跳转选择地址
			goChooseAddr(){
				this.$mRouter.push({route:this.$mRoutesConfig.chooseAddr,query:{fromPage:'addAddr'}})
			},
			//获取地址数据 回填
			getAddrById(){
				let that=this;
				
				that.$api.getAddrById({
					data:{
						id:that.addrId
					}
				},that.Authorization).then(res=>{
					console.log("根据地址id获取地址详情",res.data)
					if(res.data.code === 200){
						console.log(res.data.data,res.data.data.is_top)
						let data=res.data.data
						that.addr=data.addr;//: "天府大道北段1700号环球中心S1-727A成都欧格人力资源有限公司"
						that.city=data.city;////: "成都市"
						that.county=data.county;////: "武侯区"
						that.house_num=data.house_num;////: "12"
						that.is_top=data.is_top;//// 0
						that.lat=data.lat;//// "30.567299"
						that.lon=data.lon;//104.061718"
						that.name=data.name;//"客户123"
						that.province=data.province;//四川省"
						that.tel=data.tel;//"15565655555"
						that.addrTxt=data.province+data.city+data.county+data.addr+data.house_num;
					}
				})
			},
		},
		onLoad(opt){
			if(opt.opType){
				this.opType=opt.opType;
				if(opt.addrId){
					this.addrId=opt.addrId;
					
					
				}
			}
			console.log(this.opType,this.addrId)
			if(this.opType === 'edit'){
				//获取地址数据 回填
				this.getAddrById();
			}
		},
		onShow() {
			console.log("onshow onshow",this.$store.getters.getNewAddress)
			let newAddr=this.$store.getters.getNewAddress;
			if(newAddr.addr){
				this.addrTxt=newAddr.addr;
				this.house_num=newAddr.addrDetail
				let address=JSON.parse(newAddr.addrJson)
				this.province=address.province;
				this.city=address.city;
				this.county=address.county;
				this.lat=this.$mUtils.locToArr(newAddr.location)[1];
				this.lon=this.$mUtils.locToArr(newAddr.location)[0];
				this.addr=address.addr
			}
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		.container{
			width: 100%;
			height: 100%;
			background-color: #F6F6F6;
			form{
				display: block;
				width: 100%;
				background-color: #ffffff;
			}
		}
	}
</style>
