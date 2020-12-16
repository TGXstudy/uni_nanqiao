<template>
	<view class="container">
		<sheetStatus :status="status" :curStatus="curStatus" @getStatus="getStatus"></sheetStatus>
		<view class="sheet-box login-txt" v-if="!hasAuth">
			<text @tap="goLogin">请先登录 </text>
		</view>
		<view class="sheet-box" v-else>
			<!-- <noData v-if="orderItems.length == 0" :msg=" '暂无记录'" class='no-data'></noData> -->
			<sheetItem  :items="orderItems" :pageType="'order'" @updateOrder="updateOrder"></sheetItem>
			<loadmore :visible="isLoading"></loadmore>
			<nomore :visible="!isMore" ></nomore>
		</view>
		<view class="home-box" @tap="goIndex">
			<image src="../../static/image/icon/home_icon.png"></image>
		</view>
	</view>
</template>

<script>
	import  sheetStatus from '../../components/sheetStatus.vue';
	import  sheetItem from '../../components/sheetItem.vue';
	import 	noData from '../../components/noData.vue';
	import loadmore from '../../components/tui/loadmore/loadmore.vue';
	import nomore from '../../components/tui/nomore/nomore.vue';
	export default{
		components:{
			sheetStatus,sheetItem,noData,loadmore,nomore
		},
		onReachBottom() {
			if(this.page<this.totalPage){
				++this.page;
				this.getMyOrder()
			}
			console.log("上拉加载更多",this.page,"是否还有更多数据", !this.isMore && this.orderItems.length !=0)
		},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				hasAuth:false,
				orderItems:[],
				page:1,
				totalPage:0,
				curStatus:'',
				status:[
					{
						statusCode:'',
						statusText:"全部"
					},
					{
						statusCode:'2',
						statusText:"待接受"
						
					},
					{
						statusCode:'3',
						statusText:"待服务"
					},
					{
						statusCode:'4',
						statusText:"待评论"
					},
					{
						statusCode:'5',
						statusText:"已完成"
					},
				],
				isLoading:true,
				isMore:true,
			}
		},
		onLoad(){
			this.orderLoad();			
		},
		onShow(){
			this.orderLoad();			
		},
		methods:{
			
			//跳转首页
			goIndex(){
				this.$mRouter.push({route:this.$mRoutesConfig.index})
			},
			updateOrder(){
				console.log("更新订单页面")
				this.page=1;
				this.getMyOrder();
			},
			//跳转登录
			goLogin(){
				this.$mRouter.push({route:this.$mRoutesConfig.login})
			},
			//获取当前订单状态
			getStatus(status){
				this.curStatus=status;
				this.orderItems=[];
				this.page=1;
				console.log("获取当前订单状态",status)
				this.orderLoad()
			},
			//订单加载
			orderLoad(){
				if(this.Authorization === ''){
					this.hasAuth=false;
				}else{
					this.hasAuth=true;
					this.getMyOrder();
				}
			},
			//获取订单
			getMyOrder(){
				let that=this;
				that.$api.myOrder({
					data:{
						status:that.curStatus,
						page:that.page
					}
				},that.Authorization).then(res=>{ 
					if(res.data.code === 200){
						
						
						that.isLoading=false;
						if(that.page == 1){
							that.orderItems=res.data.data.data;
						}else{
							// console.log("获取订单",that.page)
							that.orderItems=that.orderItems.concat(res.data.data.data);
							
						}
						that.totalPage=res.data.data.last_page;
						that.page=res.data.data.current_page;
						that.isMore= that.totalPage>that.page?true:false;
						console.log("是否还有更多数据",that.isMore, !that.isMore && that.orderItems.length !=0);
					}else if(res.data.code === 1003){
						that.hasAuth=false;
						// that.$mUtils.toast("请先登录")
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					// console.log("获取订单",res.data)
					console.log("获取订单",that.orderItems,that.page,that.totalPage)
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.sheet-box{
		display: block;
		
	}
	.no-data{
		width: 100%;
	}
	.login-txt{
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content:center;
		align-items:center;
		text{
			border: 2upx solid 	#27C79A;
			padding: 10upx 20upx;
			color:#27C79A;
			font-size: 30upx;
		}
	}
	
	.home-box{
		width: 125upx;
		height: 125upx;
		position: fixed;
		bottom: 40upx;
		left: 40upx;
		image{
			width: 100%;
			height: 100%;
		}
	}
</style>
