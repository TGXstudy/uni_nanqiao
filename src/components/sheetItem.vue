<template>
	<view class="sheets-box">
		<block :items="items" v-for="(item,idx) in items" :key="idx">
			<view class="sheet-item" >
			
				<view class="order-info bor-bot">
					<text class="order-num">订单编号：{{item.out_trade_num}}</text>
					<text class="order-status">{{item.status_des}}</text>
				</view>
				<view class="sheet-info" @tap="goSheetDetail(item.id)">
					<view>{{item.addr}}</view>
					<view>金额：<text>￥{{item.total_fee}}</text></view>
					<view>服务时间：{{item.serv_time}}	</view>
				</view>
				<view class="sheet-desc">
					
					<view class="grab-btn" v-if="pageType === 'order'">
						
						<button class="gray-btn"  v-if=" item.status === '2' || item.status === '3'" @tap="showDelCanPopup('cancel',item.id)">取消订单</button>
						<button class="gray-btn" v-if="item.status === '5' "  @tap="showDelCanPopup('del',item.id)" >删除订单</button>
					
						<button @tap="showEvalPopup(item.id)" v-if=" item.status === '4'">立即评价</button>
						
						<button @tap="showCallOrFav('fav',item.clean_worker)" v-if=" item.status === '5' && item.is_collect === false ">收藏保洁</button>
						<button @tap="showCallOrFav('cleaner',item.id)" v-if="item.status === '3' || item.status === '4'">联系保洁</button>
					</view>
					<view class="grab-btn" v-else-if="pageType === 'sheet'">
						
						<button class="gray-btn" v-if="item.status === '5'"  @tap="showDelCanPopup('del',item.id)">删除订单</button>
						<button @tap="showCallOrFav('client',item.id)"  v-if="item.status === '3' || item.status === '4'">联系客户</button>
						<button v-if="item.status === '3'" @tap="mapNavigate(item)">导航</button>
						<button @tap="showFinishPopup(item.id)" v-if="item.status === '3'">完成订单</button>
						<button @tap="showChangePopup(item.id)" v-if="item.status === '4'">更改图片</button>
					</view>
				</view>
			</view>
			
		</block>
		
		<bottomPopup 
								 :show="showFinish"
								 @close="showFinish=false">
			<view class="pwd-box">
				  <view class="pwd-top">
				  	<text>完成订单</text>
						<image src="../static/image/icon/close.png" @tap="showFinish = false"></image>
				  </view>
					<form @submit="finishOrder" @reset="formReset">
						<view class="popup-con">
							<view class="con-item">
								<view class="item-title">保洁自检项</view>
								<view class="item-con">
									<radio-group >
									<label class="radio-item" @tap="kongtiao=!kongtiao" >
										<radio class="small-radio" :checked="kongtiao" color="#27C79A" />
										空调关闭
									</label>
									</radio-group>
									<label class="radio-item"  @tap="diandeng=!diandeng">
										<radio class="small-radio" :checked="diandeng" color="#27C79A" />
										电灯关闭
									</label>
								</view>
							</view>
							<view class="con-item">
								<textarea name="desc" v-model="work_done_des" placeholder="请输入完成工单描述" cursor-spacing=10 :fixed="true" v-show="showFinish"/>
							</view>
							<view class="con-item">
								<view class="item-title">上传图片</view>
								<!-- <addImg
									:initImg="initImg"
									:maxCount="9"
									:addImgIcon="'../../../static/image/icon/addimg_icon.png'"
									:delIcon="'../../../static/image/icon/delimg_icon.png'"
									:size="180"
									@addImg="addImg">
								</addImg> -->
								<view class="addimgs-box">
									<view class="imgs-box">
										<view class="img-box" v-for="(item,index) in imgs" :key="index" >
											<image :src="item"></image>
											<image class='del-icon' src="/static/image/icon/delimg_icon.png"  @tap="delTheImg($event,index)"></image>
										</view>
										<view class="img-box" v-show="showAddIcon">
											<image  src="/static/image/icon/addimg_icon.png"   @tap="addImgs"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="pwd-btn">
							<button  @tap="showFinish = false">取消</button>
							<button formType="submit" class='green-btn'>确定</button>
						</view>
					</form>
			</view>
		
		</bottomPopup>
		
		<bottomPopup
								 :show="showChange"
								 @close="showChange=false">
			<view class="pwd-box">
				  <view class="pwd-top">
				  	<text>更改图片</text>
						<image src="../static/image/icon/close.png" @tap="showChange = false"></image>
				  </view>
					<form @submit="changeOrder">
						<view class="popup-con">
							<view class="con-item">
								<view class="item-title">保洁自检项</view>
								<view class="item-con">
									<radio-group name="air_off">
									<label class="radio-item">
										<radio class="small-radio" :value="detail.air_off" :checked="detail.air_off == '1' ? true :false" color="#27C79A" />
										空调关闭
									</label>
									</radio-group>
									<radio-group name="light_off">
									<label class="radio-item">
										<radio class="small-radio" :value="detail.light_off" :checked="detail.light_off == '1' ? true :false" color="#27C79A" />
										电灯关闭
									</label>
									</radio-group>
								</view>
							</view>
							<view class="con-item" >
								<textarea name="desc" v-model="detail.work_done_des" :fixed="true" placeholder="请输入完成工单描述" cursor-spacing=10 v-show="showChange"/>
							</view>
							<view class="con-item">
								<view class="item-title">上传图片</view>
								<view class="addimgs-box">
									<view class="imgs-box">
										<view class="img-box" v-for="(item,index) in imgs" :key="index" >
											<image :src="item"></image>
											<image class='del-icon' src="../../../static/image/icon/delimg_icon.png"  @tap="delTheImg($event,index)"></image>
										</view>
										<view class="img-box" v-show="showAddIcon">
											<image  src="../../../static/image/icon/addimg_icon.png"   @tap="addImgs"></image>
										</view>
									</view>
								</view>
								
							</view>
						</view>
						<view class="pwd-btn">
							<button  @tap="showChange = false">取消</button>
							<button formType="submit" class='green-btn'>确定</button>
						</view>
					</form>
			</view>
		
		</bottomPopup>
		
		<bottomPopup 
								 :show="showCallFav"
								 @close="showCallFav=false">
				<view class="pwd-box">
						<view class="pwd-top"> 
							<text>{{callFavTxt}}</text>
							<image src="../static/image/icon/close.png" @tap="showCallFav = false"></image>
						</view>
				
						<view class="pwd-btn">
							<button  @tap="showCallFav = false">取消</button>
							<button class='green-btn' @tap="makeCallOrFav">确定</button>
						</view>
				</view>
		</bottomPopup>
		
		<bottomPopup
								 :show="showDelCan"
								 @close="showDelCan=false">
				<view class="pwd-box">
						<view class="pwd-top"> 
							<text>{{delCanTxt}}</text>
							<image src="../static/image/icon/close.png" @tap="showDelCan = false"></image>
						</view>
				
						<view class="pwd-btn">
							<button  @tap="showDelCan = false">取消</button>
							<button class='green-btn' @tap="delOrCancel">确定</button>
						</view>
				</view>
		</bottomPopup>
		<bottomPopup 
								 :show="showEval"
								 @close="showEval=false">
			<view class="pwd-box">
						<view class="pwd-top">
							<text>立即评价</text>
							<image src="../static/image/icon/close.png" @tap="showEval = false"></image>
						</view>
						<form @submit="evalNow" @reset="formReset">
							<view class="popup-con">
								<view class="con-item">
									<view class="item-title">评价星级</view>
									<view class="item-con">
										<input type="number" name='rate' v-model="rateVal" v-show="false"/>
										<evalRate ref="rateStar" :quantity="5" 
															:current="rateVal" 
															:size="35"
															:active="'#F08E3B'"
															:normal="'#CCCCCC'"
															@change="evalRate">
										</evalRate>
									</view>
								</view>
								<view class="con-item">
									<textarea name="evalTxt" value="" placeholder="请输入评价内容 " cursor-spacing=10 :fixed="true"  v-show="showEval"/>
								</view>
								
							</view>
							<view class="pwd-btn">
								<button  @tap="showEval = false">取消</button>
								<button formType="submit" class='green-btn'>确定</button>
							</view>
						</form>
				</view>
		
		</bottomPopup>
	</view>
	
</template>

<script>
	import  bottomPopup from '@/components/tui/bottom-popup/bottom-popup.vue';
	import  evalRate from '@/components/tui/rate/rate.vue';
	import  addImg from '@/components/addImg.vue';
	export default{
		components:{
			bottomPopup,
			addImg,
			evalRate ,
		},
		props: ['items','pageType'],
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				showFinish:false, //完成订单弹窗的显示状态
				showChange:false, //
				showCallFav:false,//联系客户或收藏保洁弹窗的显示状态
				showEval:false,//立即评价弹窗的显示状态
				callFavTxt:"是否拨打客户电话", //联系客户或收藏保洁弹窗的显示文本
				rateVal:0,//评价爱心个数
				finishImg:[], //完成订单图片
				orderId:'',//当前操作订单的id
				kongtiao:false,
				diandeng:false,
				callOrFav:'',
				detail:{}, //根据id获取的订单详情
				showAddIcon:true,
				imgs:[],
				upImgs:[],
				curCount:0,
				maxCount:9,
				leftCount:0,
				showDelCan:false,
				delCanTxt:"",
				cleanerId:"" ,//保洁id,
				work_done_des:'',
				telNum:'',
				initImg:[],
			}
		},
		methods:{
			delTheImg(e,index){
					console.log('index',index)
					
					let idx=index
					// this.finishImg=this.finishImg.slice(0,idx).concat(this.finishImg.slice(idx+1,this.finishImg.length))
					this.imgs=this.imgs.slice(0,idx).concat(this.imgs.slice(idx+1,this.imgs.length))
					this.finishImg=this.imgs;
					this.curCount=this.imgs.length;
					this.showAddIcon = this.curCount<this.maxCount
					console.log("删除",this.imgs,this.finishImg,this.upImgs);
					// this.uploadImg(this.imgs)
					
					
				},
				addImgs(){
					let that=this;
					that.leftCount=that.maxCount-that.imgs.length;
					uni.chooseImage({
						count: that.leftCount, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album',"camera"], //从相册选择
						    
						success(res) {
							console.log("从相册选择",that.leftCount,res.tempFilePaths.length)
							that.upImgs=res.tempFilePaths.slice(0,that.leftCount)
							
							that.imgs=that.imgs.concat(that.upImgs)
							that.curCount=that.imgs.length;
							that.showAddIcon = that.curCount<that.maxCount
							console.log("选择图片;;;;;;",that.imgs,that.upImgs);
						
						
								that.uploadImg(that.upImgs);
							
						}
					})
					
				},
				uploadImg(imgs){
					let that=this;
					
					console.log("啦啦啦啦啦啦",imgs)
					for(let i=0;i<imgs.length;i++){
						that.$api.uploadFile(imgs[i],"file",that.Authorization)
						.then(res=>{
							let result=JSON.parse(res.data);
							console.log("添加图片",result)
							if(result.code === "200"){
								that.finishImg.push(result.data.url)
							}else{
								that.$mUtils.toast(result.msg)
							}
							
						})
					}
				},
			
			//调起手机地图app
			mapNavigate(item){
				console.log("调起手机地图",item)
				uni.openLocation({
					latitude:item.lat-0,//	Float	是	纬度，范围为-90~90，负数表示南纬，使用 gcj02 国测局坐标系	
					longitude:item.lon-0,//	Float	是	经度，范围为-180~180，负数表示西经，使用 gcj02 国测局坐标系	
					name:item.addr//	String	否	位置名	
					// address://	String	否	地址的详细说明
				})
				
			},
			
			//显示完成订单操作弹窗
			showFinishPopup(orderId){
				let that=this;
				that.showFinish= true;
				that.orderId=orderId;
				that.kongtiao =false;
				that.diandeng=false;
				that.work_done_des="";
				that.imgs=[];
				that.finishImg=[];
			},
			//显示更改图片操作弹窗
			showChangePopup(orderId){
				let that=this;
				that.showChange= true;
				that.orderId=orderId;
				that.imgs=[];
				//获取数据需要回填数据
				that.$api.grabOrderInfo({
					data:{
						id:that.orderId
					}
				},that.Authorization).then(res=>{
					
					console.log("获取订单详情",res.data)
					if(res.data.code === 200){
						that.detail=res.data.data;
						that.imgs=res.data.data.work_img_pre
						that.curCount=that.imgs.length;
						that.leftCount=that.maxCount-that.curCount;
						that.showAddIcon = that.curCount<that.maxCount
						
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				})
			},
			showCallOrFav(opType,param){ 
				//显示联系客户或收藏保洁弹窗
				this.showCallFav=true;
				this.callOrFav='';
				
				console.log("操作类型",opType)
				if(opType === 'fav'){
					this.callFavTxt='是否收藏该保洁人员?';
					this.callOrFav='fav';
					this.cleanerId=param;
				}else if(opType === 'client'){
					this.callFavTxt='是否拨打客户电话?';
					this.callOrFav='call';
					this.orderId=param;
				}if(opType === 'cleaner'){
					this.callFavTxt='是否拨打保洁电话?';
					this.callOrFav='call';
					this.orderId=param;
				} 
			},
			//确定拨打电话或收藏保洁
			makeCallOrFav(){
				console.log("确定拨打电话或收藏保洁",this.orderId);
				let that=this;
				that.showCallFav=false;
				if(that.callOrFav === 'call'){
					console.log('确定拨打电话');
					//获取电话号码，并拨打
					that.$api.makeCall({
						data:{
							id:that.orderId
						}
					},that.Authorization).then(res=>{
						console.log("获取电话号码结果",res.data)
						if(res.data.code === 200){
							that.telNum=res.data.data.telX
							uni.makePhoneCall({
								 phoneNumber: that.telNum
							})
						}else if(res.data.code === 500){
							console.log(that.telNum)
							uni.makePhoneCall({
								 phoneNumber: that.telNum
							})
						}else{
							that.$mUtils.toast(res.data.msg);
						}
					})
				}else if(that.callOrFav === 'fav'){
					console.log('确定收藏保洁',that.cleanerId);
					//收藏保洁操作
					that.favCleaner();
					that.$emit("updateOrder")
					
				}
			},
			
			//收藏保洁操作
			favCleaner(){
				let that=this;
				console.log('收藏保洁操作',that.cleanerId);
				that.$api.colCleaner({
					data:{
						clean_id:that.cleanerId
					}
				},that.Authorization).then(res=>{
					console.log("收藏保洁操作结果",res.data)
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						that.showCallFav=false;
						that.$emit('updateOrder');
					}
				})
				
			},
			goSheetDetail(orderId){
				this.$mRouter.push({route:this.$mRoutesConfig.sheetDetail,query:{orderId,pageType:this.pageType}})	
			},
			
			addImg(e){
				this.finishImg=e.imgs				
			},
			//
			changeOrder(e){
				console.log("完成订单 lallalall",e.detail.value,this.imgs,this.orderId)
				let that=this;
				let fd=e.detail.value
				that.$api.workDone({
					data:{
						id:that.orderId ,//					订单id
						air_off:fd.air_off ,//		0空调未关闭，1空调已关闭
						light_off:fd.light_off,//	String				0电灯未关闭，1电灯已关闭
						work_done_des:fd.desc, //	String					完成描述
						work_imgs:that.finishImg//	Array						上传的完成图片
					}
				},that.Authorization).then(res=>{
					console.log("完成订单结果",res.data)
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						let tid=setTimeout(()=>{
							that.$emit('updatePage')
							that.showChange=false;
							clearInterval(tid)
						},500)
						
					}
				})
			},
			//完成订单
			finishOrder(e){
				console.log("完成订单",this.imgs,this.finishImg,this.orderId,this.diandeng)
				
				let that=this;
				
				
				if(!that.kongtiao){
					that.$mUtils.toast("请关闭空调");
					return;
				}
				if(!that.diandeng){
					that.$mUtils.toast("请关闭电灯");
					return;
				}
				if(e.detail.value.desc.trim().length === 0){
					e.detail.value.desc="无"
					//that.$mUtils.toast("请输入完成描述");
					//return;
				}
				if(this.finishImg.length === 0){
					that.$mUtils.toast("请上传完成图片");
					return;
				}
				
				that.$api.workDone({
					data:{
						id:that.orderId ,//					订单id
						air_off: that.kongtiao?'1':'0',//		0空调未关闭，1空调已关闭
						light_off:  that.diandeng?'1':'0',//	String				0电灯未关闭，1电灯已关闭
						work_done_des:e.detail.value.desc, //	String					完成描述
						work_imgs:that.finishImg//	Array						上传的完成图片
					}
				},that.Authorization).then(res=>{
					console.log("完成订单结果",res.data)
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						let tid=setTimeout(()=>{
							that.$emit('updatePage')
							that.showFinish=false;
							clearInterval(tid)
						},500)
						
					}
				})
			},
			
			//立即评价弹窗
			showEvalPopup(orderId){
				this.showEval = true;
				this.orderId=orderId;
				console.log("this.$refs.rateStar",this.$refs.rateStar)
				this.rateVal=0;
				
				console.log('立即评价弹窗',this.orderId)
			},
			//立即评价
			evalNow(e){
				let that=this;
				console.log("立即评价",e.detail.value,this.orderId)
				let fd=e.detail.value;
				if(fd.rate == '0'){
					that.$mUtils.toast("请选择评价星级");
					return;
				}
				if(fd.evalTxt.trim().length == 0){
					// that.$mUtils.toast("请输入评价内容");
					fd.evalTxt="默认好评"
					// return;
				}
				
				that.$api.comment({
					data:{
						id:that.orderId,//	Number						订单id
						comment_start:fd.rate-0,//	Number				评论星级
						comment:fd.evalTxt//	String				评价内容
					}
				},that.Authorization).then(res=>{
					console.log("立即评价结果",res.data)
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						that.showEval=false;
						that.$emit('updateOrder')
					}else{
						
					}
				})
			},
			//爱心评分
			evalRate(e){
				this.rateVal=e.index
				console.log("爱心评分",e)
			},
			
			//显示删除订单或取消订单弹窗
			showDelCanPopup(opType,orderId){
				let that=this;
				that.orderId=orderId;
				that.showDelCan=true;
				that.opType=opType;
				if(that.pageType === 'order'){
					if(opType === 'del'){
						 that.delCanTxt="确认删除订单?"
					}else if(opType === 'cancel'){
						 that.delCanTxt="确认取消订单?"
					}
				}else if(that.pageType === 'sheet'){
					if(opType === 'del'){
						 that.delCanTxt="确认删除订单?"
					}
				}
				console.log('显示删除订单或取消订单弹窗',opType,orderId,this.pageType)
			},
			//删除订单或取消订单弹窗 确认
			delOrCancel(){
				let that=this;
				console.log("删除订单或取消订单弹窗 确认",this.orderId,this.pageType,this.opType);
				if(that.pageType === 'order'){
					if(that.opType === 'del'){
						//删除客户订单
						that.delOrder();
					}else if(that.opType === 'cancel'){
						//客户取消订单
						that.cancelOrder()
					}
				}else if(that.pageType === 'sheet'){
					if(that.opType === 'del'){
						 //保洁删除订单
						 that.delSheet()
					}
				}
			},
			//保洁删除订单
			delSheet(){
				let that=this;
				console.log("保洁删除订单操作",that.orderId);
				
				that.$api.delSheet({
					data:{
						id:that.orderId
					}
				},that.Authorization).then(res=>{
					console.log("保洁删除订单操作 结果",res.data);
					that.$mUtils.toast(res.data.msg);
					if(res.data.code === 200){
						that.showDelCan=false;
						that.$emit("updatePage")
					}
				})
			},
			//删除客户订单
			delOrder(){
				let that=this;
				console.log("删除订单操作",this.orderId,this.pageType,this.opType);
				that.$api.delOrder({
					data:{
						id:that.orderId,
					}
				},that.Authorization).then(res=>{
					console.log("删除订单操作结果",res.data)
					that.$mUtils.toast(res.data.msg);
					
					if(res.data.code === 200){
						that.showDelCan=false;
						that.$emit("updateOrder");
					}
				})
			},
			//客户取消订单
			cancelOrder(){
				let that=this;
				console.log("客户取消订单",this.orderId,this.pageType,this.opType);
				that.$api.cancelOrder({
					data:{
						id:that.orderId,
					}
				},that.Authorization).then(res=>{
					console.log("客户取消订单结果",res.data)
					that.$mUtils.toast(res.data.msg);
					
					if(res.data.code === 200){
						that.showDelCan=false;
						that.$emit("updateOrder");
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.sheets-box{
		display:block;
	.sheet-item{
			display:block;
			width:95%;
			background-color:#fff;
			margin:20upx auto;
			border-radius: 10upx;
			.order-info{
				padding:20upx;
				justify-content:space-between;
				.order-num{
					color:#999999;
					font-size: 26upx;
				}
				.order-status{
					color:#F08E3B;
					font-size: 28upx;
				}
			}
			.sheet-info {
				padding: 30upx 20upx 0 20upx;
				color:#333333;
				display:block;
				line-height:50upx;
				view:first-child{
					font-size:30upx;
					font-weight: bold;
				}
				view:nth-child(2){
					font-size:26upx;
					text{
						color: #F08E3B;
						font-size: 36upx;
					}
				}
				view:nth-child(3){
					color:#999999;
					font-size: 26upx;
				}
			}
			.sheet-desc  {
				padding: 30upx 20upx;
					justify-content:flex-end;
				.grab-btn{
					flex-wrap:wrap;
					padding-top:20upx;
				
					button{
						width: 180upx;
						background-color: #27C79A;
						color:#fff;
						font-size: 28upx;
						border-radius: 50upx;
						margin-right: 20upx;
						margin-left: 0;
						margin-bottom: 10upx;
					}
					.gray-btn{
						background-color: transparent;
						color:#999999;
						border: 1upx solid #e5e5e5;
					}
				}
			}
		}
		
	.popup{
					
					position:fixed;
					width: 100%;
					height: 100%;
					top:0;
					left:0;
					z-index: 999;
					display: flex;
					justify-content: center;
					flex-direction: column;
					align-items:center;
					background-color: #fff;
				}
				.pwd-box{
					width: 100%;
					display: block;
					margin-top: -120upx;

					.pwd-top{
						background-color: #fff;
						height: 100upx;
						display:flex;
						font-weight: bold;
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
					.popup-con{
						width: 100%;
						background-color: #fff;
						display: block;
						.con-item{
							width: 95%;
							margin: 0 auto;
							display: block;
							
							.item-title{
								color:#333333;
								font-size: 28upx;
								font-weight: bold;
								line-height: 80upx;
							}
							.item-con{
								font-size: 26upx;
								line-height: 50upx;
							}
							textarea{
								box-sizing: border-box;
								border: 2upx solid #e5e5e5;
								height: 150upx;
								padding: 20upx ;
								width: 100%;
								font-size: 26upx;
							}
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
			
		}
		.imgs-box{
			 display:flex;
			 flex-wrap:wrap;
		}
	
	
	
	
	.addimgs-box{
		 width:100%;
		 display:block;
		.imgs-box{
			 display:flex;
			 flex-wrap:wrap;
		}
	
	}
	.img-box{
		position:relative;
		margin-right: 20upx;
		margin-bottom: 20upx;
		width: 180upx;
		height: 180upx;
		background-color: red;
		image{
			width: 180upx;
			height: 180upx;
			// background-color: green;
		}
		.del-icon{
			position:absolute;
			top:-10upx;
			right:-10upx;
			width: 60upx;
			height: 60upx;
		}
	}	
</style>
