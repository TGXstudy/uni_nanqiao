<template>
	<view class="container">
		<noData v-if="cleaners.length === 0 " :msg=" '暂无收藏'" class='no-data'></noData>
		<swipeAction v-else v-for="item in cleaners" :key="item.id" class='swipe-act' :actions="actions" :operateWidth="50" @click="actionHandle($event,item.id)">
			<view class="per-item" slot="content" @tap="getThisClean(item)">
				<view class="per-left">
					<image :src="item.avatar"></image>
				</view>
				<view class="per-right bor-bot">
					<text >{{item.name}}</text>
					<text class="green-txt" @tap.stop="goComment(item.clean_id)">对TA的评价</text>
				</view>
			</view>	
		</swipeAction>
		
		<text v-if="fromPage == 'overbook'" class="no-clean" @tap="noChoose">
			不指定保洁员
		</text>
	</view>
</template>

<script>
	import swipeAction from "../../components/tui/swipe-action/swipe-action.vue"
	import noData from "../../components/noData.vue"
	export default{
		components:{
			swipeAction,noData
		},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				actions:[
					{
						// name: '删除',
						// color: '#fff',
						fontsize: 32,//单位upx
						width: 80, //单位px
						imgWidth:50,
						imgHeight:50,
						icon: '../../../static/image/icon/delete_icon.png',//此处为图片地址
						background: '#FC715F'
						
					}
				],
				fromPage:'',
				cleaners:[],//收藏的保洁列表
				totalPage:0, //总页数
				page:1,//当前页码
			}
		
		},
		onLoad(opt){
			if(opt.fromPage){
				this.fromPage=opt.fromPage;
				
			}
			console.log("页面来源",this.fromPage)
			//获取收藏的保洁列表
			this.getCleaners();
		},
		methods:{
			noChoose(){
				if(this.fromPage === 'overbook'){
					console.log("不选择保洁员",);
					this.$store.dispatch("setClean",{})
					this.$mRouter.back(-1,50);
				}
				
			},
			//单击选择该保洁
			getThisClean(clean){
				if(this.fromPage === 'overbook'){
					console.log("单击选择该保洁",clean);
					this.$store.dispatch("setClean",clean)
					this.$mRouter.back(-1,50);
				}
			},
			//获取收藏的保洁列表
			getCleaners(){
				let that=this;
				
				that.$api.collectList(that.Authorization)
				.then(res=>{
					console.log("获取收藏的保洁列表",res.data)
					if(res.data.code === 200){
						that.cleaners=res.data.data.data
						that.totalPage=res.data.data.last_page;
						that.page=res.data.data.current_page;
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				})
			},
			goComment(cleanId){
				this.$mRouter.push({route:this.$mRoutesConfig.favComment,query:{cleanId}})
			},
			actionHandle(e,id){
				console.log("滑动",e,id);
				this.id
				if(e.index === 0){
					//取消收藏保洁员
					this.cancelCollect(id)
				}
			},
			//取消收藏保洁员
			cancelCollect(id){
				let that=this;
				that.$api.cancelCollect({
					data:{
						id
					}
				},that.Authorization).then(res=>{
					console.log('取消收藏保洁员 结果',res.data)
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						let tid=setTimeout(()=>{
							that.getCleaners()
							clearTimeout(tid)
						},500)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// .tui-swipeout-content{
	// 	width: 100% ;
	// 	}
	.container{
		 width:100%;
		 background-color:#F6F6F6;
		 padding-bottom:100upx;
		 .swipe-act{
			  width:100%;
		.per-item{
			height: 150upx;
			width: 95%;
			margin: 0 auto;
			display: flex;
			justify-content:flex-start;
			align-items:center;
			.per-left{
				width: 100upx;
				margin-right:20upx;
				image{
					border-radius: 50%;
					width: 100upx;
					height: 100upx;
				}
			}
			.per-right{
				flex: 1;
				height: 100%;
				display: flex;
				justify-content:space-between;
				align-items:center;
				box-sizing: border-box;
				font-size: 28upx;
				.green-txt{
					color: #27C79A;
					
				}
			}
			}
			
	}
		
		.no-clean{
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #fff;
			width: 100%;
			height: 100upx;
			text-align: center;
			line-height: 100upx;
			font-size: 30upx;
			color: #27C79A;
		}
}
</style>

