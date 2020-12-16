<template>
	<view class="container"> 
		<view class="sheet-box">
			<noData v-if="orders.length == 0" :msg=" '暂无数据'" class='no-data'></noData>
			<view v-else class="sheet-item" v-for="item in orders" :key="item.id">
				
				<view class="sheet-info">
					<view>
						<view class="location-box">
							<text class="grab-type" v-if="item.assign_clean_worker">指派订单</text>
							<text class="grab-type green-bc" v-else>公共订单</text>
							{{item.addr}}
							
						</view>
						<text class="distance-box">
							{{item.distance_um}}km
						</text>
					</view>
					<view>金额：<text>￥{{item.total_fee}}</text></view>
				</view>
				<view class="sheet-desc">
					<view class="order-desc">
						<text>订单编号：{{item.out_trade_num}}</text>
						<text>服务时间：{{item.serv_time}}</text>
					</view>
					<view class="grab-btn">
						<button @tap="getTheOrder(item.id)">抢单</button>
					</view>
				</view>
			</view>
		
			
		</view>
		<loadmore :visible="isLoading"></loadmore>
		<nomore :visible="!isMore && orders.length != 0" ></nomore>
		<view class="fix-menu" @tap="goSheet">
			<text>已抢工单</text>
		</view>
	</view>
</template>

<script>
	import 	noData from '../../components/noData.vue'
	import loadmore from '../../components/tui/loadmore/loadmore.vue'
	import nomore from '../../components/tui/nomore/nomore.vue'
	export default{
		components:{noData,loadmore,nomore},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				orders:[],
				totalPage:0, //总页数
				page:1,//当前页码
				isLoading:true,
				isMore:true,
				cityName:""
			}
		},
		methods:{
			//抢单
			getTheOrder(orderId){
				console.log(this.Authorization)
				console.log("//抢单",orderId)
				let that=this;
				that.$api.grabOrder({
					data:{
						id:orderId
					}
				},that.Authorization).then(res=>{
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						let tid=setTimeout(()=>{
							that.getOrderZone();
							clearTimeout(tid)
						},500)
					}
					console.log("//抢单结果",res.data)
				})
			},
			//获取抢单区数据
			getOrderZone(){
				let that=this;
				that.$api.getOrderZone({
					data:{
						page:that.page,
						city:that.cityName
					}
				},that.Authorization)
				.then(res=>{
					console.log("获取抢单区数据",res.data)
					if(res.data.code === 200){
						that.isLoading=false
						if(that.page ==	1){
							that.orders=res.data.data.data;
						}else{
							that.orders=that.orders.concat(res.data.data.data)
						}
						that.totalPage=res.data.data.last_page;
						that.page=res.data.data.current_page;
						that.isMore= that.totalPage>that.page?true:false;
						
					}else{
						
					}
				})
			},
			////跳转已抢工单
			goSheet(){
				console.log("跳转已抢工单");
				this.$mRouter.push({route:this.$mRoutesConfig.sheet})	
			}
		},
		onLoad(opt){
			if(opt.cityName){
				this.cityName=opt.cityName;
			}
			console.log("城市名",opt,this.cityName)
			//获取抢单区数据
			this.getOrderZone();
			
		},
		onReachBottom() {
			console.log("上拉加载更多",this.page)
			if(this.isMore){
				++this.page;
				this.getOrderZone();
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.container{
		width:100%;
		display:block;
		padding-bottom:100upx;
		.sheet-box{
			width:100%;
			display:block;
			background-color:#F6F6F6;
			.sheet-item{
				display:block;
				width:95%;
				background-color:#fff;
				margin:20upx auto;
				border-radius: 10upx;
				.sheet-info {
					padding: 30upx 20upx 0 20upx;
					color:#333333;
					display:block;
					line-height:50upx;
					view:first-child{
						
						
						.location-box{
							flex: 1;
							font-size:30upx;
							font-weight: bold;
							display: block;
							.grab-type{
								font-weight: normal;
								color: #fff;
								border-radius: 10upx;
								 background-color: #F08E3B ;
								 font-size:24upx;
								padding:6upx 10upx;
								margin-right: 20upx;
							}
							.green-bc{
								background-color: #27C79A ;
								}
						}
						.distance-box{
							display: block;
							width: 200upx;
							color:#999999;
							font-size: 26upx;
							text-align: right;
						}
						
					}
					view:last-child{
						font-size:26upx;
						text{
							color: #F08E3B;
							font-size: 36upx;
						}
					}
				}
				.sheet-desc  {
					padding: 30upx 20upx;
					color:#999999;
					font-size: 26upx;
					justify-content:space-between;
					align-items:center;
					.order-desc{
						display: block;
						flex:1;
						text{
							display: block;
						}
					} 
					.grab-btn{
						button{
							width: 200upx;
							background-color: #27C79A;
							color:#fff;
							font-size: 36upx;
							border-radius: 50upx;
						}
					}
				}
			}
		} 	 
		.fix-menu{

			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 100upx;
			background-color: #fff;
			
			color:#F08E3B;
			font-size: 36upx;
			text{
				display: block;
				width: 100%;
				height: 100upx;
				line-height: 100upx;
				text-align: center;
			}
		}
	}
</style>
