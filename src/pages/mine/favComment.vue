<template>
	<view class="container">
		<noData v-if="comments.length === 0 " :msg=" '暂无评论'" class='no-data'></noData>
		<view v-else class="com-box">
			<view class="com-item bor-bot" v-for="(item,idx) in comments" :key="idx">
				<rate :quantity="5" :current="item.comment_start" :normal="'#fff'" :size="30"></rate>
				<view class="com-txt">
					<text class="txt-title">评价内容：</text>
					<text class="txt-con">{{item.comment}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import rate from "../../components/tui/rate/rate.vue";
	import noData from "../../components/noData.vue"
	export default{
		components:{	rate,noData	},
		data(){
			return {
				Authorization:this.$store.getters.getAuthorization,
				cleanId:0,
				comments:[],
				totalPage:0, //总页数
				page:1,//当前页码
			}
		},
		onLoad(opt) {
			if(opt.cleanId){
				this.cleanId=opt.cleanId;
				//获取保洁的评论
				this.getCleanCom();
			}
		},
		methods:{
			//获取保洁的评论
			getCleanCom(){
				let that=this;
				
				that.$api.commentList({
					data:{
						clean_id:that.cleanId
					}
				},that.Authorization).then(res=>{
					console.log("获取保洁的评论",res.data);
					
					if(res.data.code === 200){
						that.comments=res.data.data.data;
						that.totalPage=res.data.data.last_page;
						that.page=res.data.data.current_page;
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
		background-color: #fff;
		.com-box{
			width: 95%;
			margin: 0 auto;
				display: block;
			.com-item{
				display: block;
				width: 100%;
					padding: 20upx 0;
				.com-txt{
					
					font-size: 26upx;
					.txt-title{
						color: #333333;
					}
					.txt-con{
						display: block;
						flex: 1;
						color:#999999;
						word-break: break-all;
					}
				}
			}
		}
	}
</style>
