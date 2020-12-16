<template>
	<view class="container">
		<noData v-if="cashRecd.length === 0 " :msg="'暂无记录'"></noData>
			<view class="detail-con" v-else>
				<view class="detail-item bor-bot" v-for="item in cashRecd" :key="item.id">
					<view class="detail-left">
						<text>{{item.status_des}}</text>
						<text>{{item.update_time || item.create_time}}</text>
					</view>
					<view class="detail-right">
						<text>￥{{item.deposit}}</text>
					</view>
				</view>
				
			</view>
			
		
	</view>
</template>

<script>
	import noData from "../../components/noData.vue"
	export default{
		components:{noData},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				cashRecd:[]
			}
		},
		onLoad() {
			//获取提现记录
			this.getDeposit();
		},
		methods:{
			//获取提现记录
			getDeposit(){
				let that=this;
				that.$api.getDeposit(that.Authorization)
				.then(res=>{
					console.log("获取提现记录 结果",res.data)
					if(res.data.code === 200){
						that.cashRecd=res.data.data;
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					console.log("获取提现记录 结果",that.cashRecd)
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.container{
		width:100%;
		background-color:#fff;
		.detail-con{
				width: 95%;
				margin: 0 auto;
				display:block;
				.detail-item{
					height: 120upx;
					width: 100%;
					justify-content: space-between;
					align-items: center;
					.detail-left{
						flex-direction: column;
						justify-content: center;
						text:first-child{
							display: block;
							color:#333333;
							font-size:30upx;
							font-weight: bold;
							margin-bottom: 10upx;
						}
						text:last-child{
							display: block;
							color:#999;
							font-size:22upx;
						}
					}
					.detail-right{
						color:#333333;
						font-size:30upx;
						font-weight: bold;
					}
				}
				
			}
		
	}
</style>
