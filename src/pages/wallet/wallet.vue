<template>
	<view class="container">
		<view class="wallet-top">
			<text class="txt1">账户余额(元）</text>
			<text class="txt2">{{balance}}</text> 
			<button class="org-btn" @tap="operate('recharge')">充值</button>
			<button class="gre-btn"  @tap="operate('cashout')">提现</button>
			<text class="txt3"  @tap="operate('cashRecd')">提现记录</text>
		</view>
		<view class="seam"></view>
		<view class="wallet-detail">
			<view class="detail-status bor-bot">
				<view :class="type=='in'?'this-status':''" @tap="switchType('in')">收入明细</view>
				<view :class="type=='out'?'this-status':''" @tap="switchType('out')">支出明细</view>
			</view>
			
			<view  class="detail-con">
				<noData v-if="recdList.length === 0 && !isLoading" :msg="'暂无记录'"></noData>
				<block v-else>
					<view class="detail-item bor-bot" v-for="item in recdList" :key="item.id">
						<view class="detail-left">
							<text>{{item.bill_source}}</text>
							<text>{{item.create_time}}</text>
						</view>
						<view class="detail-right">
							<text>￥{{item.bill_amt}}</text>
						</view>
					</view>
					<loadmore :visible="isLoading"></loadmore>
					<nomore :visible="!isMore && !isLoading" ></nomore>
				</block>
				
			</view>
		</view>
	</view>
</template>

<script>
	import noData from "../../components/noData.vue"
	import loadmore from '../../components/tui/loadmore/loadmore.vue'
	import nomore from '../../components/tui/nomore/nomore.vue'
	export default{
		components:{noData,loadmore,nomore},
		data(){
			return{
				Authorization:this.$store.getters.getAuthorization,
				page:1,
				type:"in" ,//type=in收入，type=out 支出
				balance:0, //账户余额(元）
				recdList:[], //记录列表
				totalPage:0, //记录总页码
				isLoading:true,
				isMore:true,
			}
		},
		methods:{
			operate(optype){
				let route={};
				switch(optype){
					case 'recharge':
						route=this.$mRoutesConfig.recharge
					break;
					case 'cashout':
						route=this.$mRoutesConfig.cashout
					break;
					case 'cashRecd':
						route=this.$mRoutesConfig.cashRecd
					break;
					
				}
				this.$mRouter.push({route})
				
			} ,
			//获取我的钱包数据
			myWallet(){
				let that=this;
				that.$api.myWallet({
					 data:{
						 page:that.page,
						 type:that.type
					 }
				},that.Authorization).then(res=>{
					console.log("获取我的钱包数据",res.data.data)
					if(res.data.code === 200){
						that.isLoading=false;
						if(that.page == 1){
							that.recdList=res.data.data.list.data;
						}else{
							that.recdList=that.recdList.concat(res.data.data.list.data);
						}
						that.balance=res.data.data.balance;
						that.totalPage=res.data.data.list.last_page;
						that.page=res.data.data.list.current_page;
						that.isMore= that.totalPage>that.page?true:false;
						console.log("收支明细",that.recdList)
					}else{
						that.$mUtils.toast(res.data.msg)
					}
				})
			},
			//切换收支类型，type=in收入，type=out 支出
			switchType(type){
				this.page=1;
				this.type=type;
				this.recdList=[];
				this.myWallet();
			}
		},
		onLoad(){
			//获取我的钱包数据
			this.myWallet();
		},
		onShow(){
			//获取我的钱包数据
			this.myWallet();
		},
		onReachBottom() {
			if(this.isMore){
				++this.page;
				this.myWallet()
			}
			console.log("上拉加载更多",this.page)
		}
	}
</script>

<style lang="scss" scoped>
		
	.container{
		.wallet-top{
			width: 100%;
			background-color: #fff;
			flex-direction:column;
			justify-content:center;
			align-items:center;
			
			text,button{
				display: block;
			}
			button{
				width: 450upx;
				height: 80upx;
				line-height: 80upx;
				color:#fff;
				font-size: 30upx;
				border-radius: 50upx;
				margin-bottom: 30upx;
			}
				
			.org-btn{
				color:#fff;
				background-color: #F08E3B;
			}
			.gre-btn{
				color:#16BD8E;
				background-color: #EDFFFA;
				border: 2upx solid #16BD8E ;
				
			}
			.txt1{
				color:#666666;
				font-size: 24upx;
				margin-top: 30upx;
			}
			.txt2{
				font-size: 60upx;
				color:#222222;
				margin-bottom: 80upx;
			}
			.txt3{
				color: #999;
				font-size: 26upx;
				margin-bottom: 30upx;
			}
		}
		.wallet-detail{
			width: 100%;
			display: block;
			background-color: #fff;
			.detail-status{
				width: 95%;
				margin: 0 auto;
				height: 128upx;
				font-size: 28upx;
				color:#999999;
				align-items:center;
				view{
					height: 50upx;
					border-bottom: 2upx solid transparent;
					margin-right: 20upx;
				}
				.this-status{
					color:#333;
					border-bottom: 2upx solid #16BD8E;
				}
			}
			
			.detail-con{
				width: 95%;
				margin: 0 auto;
				display:block;
				padding-bottom:20upx;
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
	}
</style>
