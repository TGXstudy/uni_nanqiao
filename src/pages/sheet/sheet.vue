<template>
	<view class="container">
		<sheetStatus :status="status" :curStatus="curStatus" @getStatus="getStatus"></sheetStatus>
		<view class="sheet-box">
			<!-- <noData v-if="grabOrders.length == 0" :msg=" '暂无记录'" class='no-data'></noData> -->
			<sheetItem  :items="grabOrders" :pageType="'sheet'" @updatePage="updatePage"></sheetItem>
		</view>
		<loadmore :visible="isLoading"></loadmore>
		<nomore :visible="!isMore" ></nomore>
		
	</view>
</template>

<script>
	import  sheetStatus from '../../components/sheetStatus.vue';
	import  sheetItem from '../../components/sheetItem.vue';
	import loadmore from '../../components/tui/loadmore/loadmore.vue'
	import nomore from '../../components/tui/nomore/nomore.vue';
	import 	noData from '../../components/noData.vue'
	export default{
		components:{
			sheetStatus,sheetItem,loadmore,nomore,noData
		},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				grabOrders:[],//消息列表
				totalPage:0, //总页数
				page:1,//当前页码
				curStatus:'',
				status:[
					{
						statusCode:'',
						statusText:"全部"
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
		methods:{
			//更新页面数据
			updatePage(){
				console.log("更新页面数据")
				this.page =1;
				this.grabOrders=[];
				this.myGrabOrder();
			},
			getStatus(status){
				this.curStatus=status;
				this.grabOrders=[];
				this.page=1;
				console.log("获取当前订单状态",status)
				this.myGrabOrder()
			},
			//获取我的已抢工单
			myGrabOrder(){
				let that=this;
				that.$api.myGrabOrder({
					data:{
						status:that.curStatus,
						page:that.page
					}
				},that.Authorization).then(res=>{
					console.log("获取我的已抢工单结果",res.data)
					if(res.data.code === 200){
						that.isLoading=false;
						if(that.page == 1){
							that.grabOrders=res.data.data.data;
						}else{
							that.grabOrders=that.grabOrders.concat(res.data.data.data);
							
						}
						
						that.totalPage=res.data.data.last_page;
						that.page=res.data.data.current_page;
						that.isMore= that.totalPage>that.page?true:false;
						
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					//grabOrders
				})
			}
			
		},
		onLoad(){
			//获取我的已抢工单
			this.myGrabOrder();
		},
		onReachBottom() {
			console.log("上拉加载更多",this.page)
			if(this.isMore){
				++this.page;
				this.myGrabOrder();
			}
			
		},
	}
</script>

<style lang="scss" scoped>
	
	.container{
		width:100%;
		display:flex;
		flex-direction:column;
		justify-content:flex-start;
		.sheet-box{
			flex: 1;
			width:100%;
			display:block;
			background-color:#F6F6F6;
		} 
	}
	</style>
