<template>
	<view class="container">
		<view class="content-box">  
			<view class="content-item left-right bor-bot" v-for="item in msgs" :key="item.id">
				<view class="item-left">
					<image src="../../static/image/icon/bell_icon.png"></image>
				</view>
				<view class="item-right">
					<view class="item-title">
						<text>系统消息</text>
						<text class="item-date">{{item.time}}</text>
					</view>
					<view class="item-txt"> 
						{{item.content}}
					</view>
				</view>
			</view>
			
		</view>
	
		<loadmore :visible="isLoading"></loadmore>
		<nomore :visible="!isMore" ></nomore>
	</view>
</template>

<script>
	import loadmore from '../../components/tui/loadmore/loadmore.vue'
	import nomore from '../../components/tui/nomore/nomore.vue'
	export default{
		components:{loadmore,nomore},
		data(){
			return {
				Authorization:this.$store.getters.getAuthorization,
				msgs:[],//消息列表
				totalPage:0, //总页数
				page:1,//当前页码
				isLoading:true,
				isMore:true,
			}
		},
		onLoad(){
			//获取我的消息
			this.getMyMsg();
		},
		onReachBottom() {
			console.log("上拉加载更多",this.page)
			if(this.page<this.totalPage){
				++this.page;
				this.getMyMsg()
			}
			
		},
		methods:{
			//获取我的消息
			getMyMsg(){
				let that=this;
				that.$api.myMsg({
					data:{
						page:that.page
					}
				},that.Authorization).then(res=>{
					// console.log("获取我的消息  ",that.totalPage,that.page)
					
					if(res.data.code === 200){
						that.isLoading=false;
						if(that.page == 1){
							that.msgs=res.data.data.data;
						}else{
							console.log("获取我的消息",that.page)
							that.msgs=that.msgs.concat(res.data.data.data);
							
						}
						that.totalPage=res.data.data.last_page;
						that.page=res.data.data.current_page;
						that.isMore= that.totalPage>that.page?true:false;
						
						
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				
					console.log("获取我的消息",res)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width:100%;
		background-color:#fff;
		.content-box{
			width:100%;
			display:block;
			.content-item{
				width:95%;
				margin:0 auto;	
			}
			.left-right{
				display:flex;
				justify-content:space-between;
				align-items:center;
				.item-left{
					margin-right:20upx;
					image{
						width: 80upx;
						height: 80upx;
					}
				}
				.item-right{
					flex:1;
					display:block;
					padding:20upx 0;
					.item-title{
						display:flex;
						justify-content:space-between;
						align-items:center;
						font-size:30upx;
						.item-date{
							color:#999999;
							font-size: 22upx;
						}
					}  
					.item-txt{
						color:#999999;
						font-size: 26upx;
					}
				}
			}
		}
	}
</style>
