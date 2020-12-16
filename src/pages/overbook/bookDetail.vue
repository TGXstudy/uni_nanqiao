<template>
	<view class="container">
		<view class="total-sum">  
			总费：<text>￥{{sum}}</text>元
		</view>
		<view class="detail-sum">
		
			<view class="detail-item" v-if="orderDetail.huxing">
				<view>卧室费</view>
				<view>￥{{orderDetail.huxing}} </view>
			</view>
			<view class="detail-item" v-if="orderDetail.beds">
				<view>床位费</view>
				<view>￥{{orderDetail.beds}} </view>
			</view>
			<view class="detail-item" v-if="orderDetail.baths">
				<view>卫生间费</view>
				<view>￥{{orderDetail.baths}} </view>
			</view>
			<view class="detail-item" v-if="orderDetail.other.length>0">
				<view>其他费</view>
					<view> ￥{{orderDetail.other}} </view>
				
			</view>
			<view class="detail-item" v-if="orderDetail.clean_type">
				<view>清洁费</view>
				<view>￥{{orderDetail.clean_type}} </view>
			</view>
			<view class="detail-item" v-if="orderDetail.clean_tool">
				<view>工具费</view>
				<view>￥{{orderDetail.clean_tool}} </view>
			</view>
			<view class="detail-item" v-if="orderDetail.clean_cloth">
				<view>布草费</view>
				<view>￥{{orderDetail.clean_cloth}} </view>
			</view>
			<view class="detail-item" v-if="orderDetail.urgent_fee">
				<view>加急费</view>
				<view>￥{{orderDetail.urgent_fee}} </view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				orderDetail:{},
				sum:0
			}
		},
		onLoad(query) {
			// console.log("订单明细",query)
			this.orderDetail=JSON.parse(query.order);
			console.log(this.orderDetail)
			this.sum=query.sum
		}
	}	
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		.container{
			width: 100%;
			height: 100%;
			background-color: #ffffff;
			.total-sum {
				display: block;
				width: 95%;
				margin: 0 auto;
				text-align: center;
				line-height:120upx;
				border-bottom:2upx solid #e5e5e5;
				text{
					color:#EC772A;
				}
			}
			.detail-sum{
				display: block;
				padding-top: 10upx;
				width: 85%;
				margin: 0 auto;
			
				.detail-item{
					width: 100%;
					line-height: 60upx;
					color:#333333;
					font-size: 26upx;
					font-weight: bold;
					display: flex;
					justify-content: space-between;
					align-items: center;
				
				}
			} 
		}
	}
</style>
