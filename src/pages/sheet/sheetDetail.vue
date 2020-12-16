<template>
	<view class="container">
		<view class="sheet-status">
			订单{{detail.status_des}}
		</view>
		<view class="sheet">
			<view class="sheet-info bor-bot">
				<view class="bold-txt">{{detail.addr}}</view>
				<view>金额：<text class="org-txt">￥{{detail.total_fee}}</text></view>
			</view>
			<view class="sheet-info bor-bot">
				<view class="item-bet" v-if="pageType === 'sheet' ">
					<view class="item-start no-margin">
						<text class='gray-txt'>客户昵称：</text>
						<text>{{detail.kh_name}}</text>
					</view>
					<view class="item-start no-margin" @tap="makeCall">
						<image class='icon-img' src="../../static/image/icon/phone_icon.png"></image>
						<text class='green-txt'>联系客户</text>
					</view>
				</view>
				<view class="item-bet" v-else-if="pageType === 'order' && (detail.status == 3 || detail.status == 4 ||detail.status == 5)">
					<view class="item-start no-margin">
						<text class='gray-txt'>保洁姓名：</text>
						<text>{{detail.clean_worker_name}}</text>
					</view>
					<view class="item-start no-margin" @tap="makeCall">
						<image class='icon-img' src="../../static/image/icon/phone_icon.png"></image>
						<text class='green-txt'>联系保洁</text>
					</view>
				</view>
				<view class="item-start">
					<text class='gray-txt'>服务时间：</text>
					<text>{{detail.serv_time}}</text>
				</view>
				<view class="item-start">
					<text class='gray-txt'>订单编号：</text>
					<text>{{detail.out_trade_num}}</text>
				</view>
			</view>
			<view class="sheet-info bor-bot"> 
				<view class="item-title">
					服务明细
				</view>
				<view class="item-bet">
					<text class="gray-txt">户型</text>
					<text class='bor-txt'>{{detail.huxing}}</text>
				</view>
				<view class="item-bet">
					<text class="gray-txt">床位数</text>
					<text class='bor-txt'>{{detail.beds}}</text>
				</view>
				<view class="item-bet">
					<text class="gray-txt">卫生间数量</text>
					<text class='bor-txt'>{{detail.bathroom}}</text>
				</view>
				<view class="item-bet">
					<text class="gray-txt">其他</text>
					<view class="many-item">
						<text v-for="(item,idx) in detail.other" :key="idx" class='bor-txt'>{{item}}</text>
					</view>
					
				</view>
				<view class="item-bet">
					<text class="gray-txt">清洁类型</text>
					<text>{{detail.clean_type}}</text>
				</view>
				<view class="item-bet">
					<text class="gray-txt">工具及清洁剂</text>
					<text>{{detail.clean_tool}}</text>
				</view>
				<view class="item-bet">
					<text class="gray-txt">布草清洗</text>
					<text>{{detail.clean_cloth}}</text>
				</view>
				<view class="item-bet" >
					<text class="gray-txt">加急服务费</text>
					<text class='sorg-txt' v-if="detail.urgent_fee">{{"￥"+detail.urgent_fee }}</text>
					<text class='sorg-txt' v-else>0</text>
				</view>
				
			</view>
			<view class="sheet-info bor-bot" v-if="detail.lock_pass"> 
				<view class="item-bet">
					<text class="gray-txt">智能锁密码</text>
					<text class="many-txt">{{detail.lock_pass}}</text>
				</view>
			</view>
			<view class="sheet-info bor-bot">
				<view class="item-bet">
					<text class="gray-txt">备注信息</text>
					<text class="many-txt">{{detail.des || '无'}}</text>
				</view>
			</view>
			<view class="sheet-info" v-if="detail.room_imgs_pre.length != 0">
				<view class="gray-txt high-txt">
					房间示例图
				</view>
				<view class="item-start"> 
					<image v-for="(item,idx) in detail.room_imgs_pre" :key="idx" class='img-size' :src="item" @tap="previewImg(detail.room_imgs_pre,idx)"></image>
				</view>
			</view>
		</view>
	
		<view class="sheet">
			<view class="sheet-info" v-if="detail.work_done_des">
				<view class="gray-txt high-txt">
					完成描述
				</view>
				<view>
					{{detail.work_done_des || '无'}}
					
				</view>
			</view>
			<view class="sheet-info" v-if="detail.work_img_pre.length != 0">
				<view class="gray-txt high-txt">
					完成图片
				</view>
				<view class="item-start"> 
					<image v-for="(item,idx) in detail.work_img_pre" :key="idx" class='img-size' :src="item" @tap="previewImg(detail.work_img_pre,idx)"></image>
				</view>
			</view>
		</view>
		
		<view class="sheet" >
			<!--  -->
			<view class="sheet-info" v-if="detail.comment_start" >
				<view class="item-bet">
					<text class="gray-txt">评价星级</text>
					<view class='star-box'>
						<evalRate :quantity="5"
											:current="detail.comment_start" 
											:size="28"
											:active="'#F08E3B'"
											:normal="'#CCCCCC'"
											@change="evalRate">
						</evalRate>
					</view>
				</view>
			</view>
			<view class="sheet-info" v-if="detail.comment">
				<text class="gray-txt high-txt">评价信息</text>
				<view>
					{{detail.comment}}
				</view>
			</view>
			<!-- <image src="../../static/image/icon/default_img.png" mode=""></image> -->
		</view>
	</view>
</template>

<script>
	import  evalRate from '@/components/tui/rate/rate.vue';
	export default{
		components:{evalRate},
		data(){
			return {
				Authorization:this.$store.getters.getAuthorization,
				pageType:'',
				orderId:'',
				detail:{}, //订单详情数据
				contactTel:'',
			}
		},
		onLoad(opt){
			console.log("onload",opt)
			if(opt.orderId && opt.pageType){
				this.orderId=opt.orderId;
				this.pageType=opt.pageType;
			}
			//获取订单详情
			this.getOrderDetail();
						
		},
		methods:{
			//图片预览
			previewImg(imgs,idx){
				console.log("imgs idx",imgs,idx)
				//https://img.cdnqsm.cn/default/20191102/1822d201911022205455217.jpg
				uni.previewImage({
					urls:imgs,
					current:idx
				})
			},
			//获取订单详情
			getOrderDetail(){
				if(this.pageType === 'sheet'){
					//获取保洁已抢订单详情
					this.grabOrderInfo();
				}else if(this.pageType === 'order'){
					//获取客户订单详情
					this.grabOrderInfo();
				}
			},
			//获取保洁已抢订单详情
			grabOrderInfo(){
				let that=this;
				that.$api.grabOrderInfo({
					data:{
						id:that.orderId
					}
				},that.Authorization).then(res=>{
					
					console.log("获取保洁已抢订单详情",res.data)
					if(res.data.code === 200){
						that.detail=res.data.data;
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				})
			},
			//
			makeCall(){
				let that=this;
				//获取电话号码，并拨打
				that.$api.makeCall({
					data:{
						id:that.orderId
					}
				},that.Authorization).then(res=>{
					console.log("获取电话号码结果",res.data)
					if(res.data.code === 200){
						that.contactTel=res.data.data.telX
						that.makePhoneCall()
						
					}else if(res.data.code === 500){
						that.makePhoneCall()
					}else{
						that.$mUtils.toast(res.data.msg);
						
					}
				})
			},
			makePhoneCall(){
				uni.makePhoneCall({
					 phoneNumber:this.contactTel 
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	
	.container{
		.sheet-status{
			font-size: 36upx;
			width: 95%;
			height: 100upx;
			margin: 0 auto;
			font-weight: blod;
			line-height: 100upx;
		}
		
		.sheet{
			width: 95%;
			margin: 0 auto 20upx auto;
			background-color: #fff;
			display:block;
			font-size:26upx;
			.sheet-info {
				width: 95%;
				margin: 0 auto;
				color:#333333;
				display:block;
				line-height:50upx;
				.bold-txt{
					font-size:30upx;
					font-weight: bold;
				}
				.org-txt{
					color: #F08E3B;
					font-size: 36upx;
				}
				.sorg-txt{
					color: #F08E3B;
				}
			.item-bet{
				justify-content: space-between;
				align-items:center;
				margin-bottom: 10upx;
				
				.star-box{
					display: flex;
					justify-content: flex-end;
					align-items:center;
				}
			}
			.no-margin{
				margin: 0;
			}
			.item-start{
				justify-content: flex-start;
				align-items:center;
				margin-bottom: 10upx;
				flex-wrap: wrap;
			}
			
			.icon-img{
				width: 30upx;
				height: 30upx;
			}
			.green-txt{
				color:#27C79A;
			}
			.gray-txt{
				color:#999999;
				
			}
			.many-item{
				flex: 1;
				justify-content: flex-end;
				flex-wrap: wrap;
				margin-left: 20upx;
			}
			.many-txt{
				flex: 1;
				margin-left: 20upx;
				text-align: right;
			}
			.bor-txt{
				color:#27C79A;
				font-size: 26upx;
				background-color: #EDFFFA;
				border: #27C79A solid 2upx;
				padding:0 20upx;
				border-radius: 30upx;
				box-sizing: border-box;
				margin-bottom: 10upx;
				margin-left: 10upx;
			}
			.high-txt{
				line-height: 80upx;
			}
			.img-size{
				width: 180upx;
				height: 180upx;
				margin-right: 20upx;
				margin-bottom: 20upx;
			}
			.like-icon{
				width: 33upx;
				height: 30upx;
				margin-right: 5upx;
			}
			}
		}
		
	}
	
	
</style>
