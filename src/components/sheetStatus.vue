<template>
	<view class="sheet-status">
		<view  class="status-item"  v-for="(item,index) in status" :key="index" @tap="getStatus(item.statusCode)" :class="nowStatus == item.statusCode ? 'this-status':''">
			 {{item.statusText}}
		</view>
	</view>
</template>

<script>
	export default {
	    props: ['status','curStatus'],
			data(){
				return {
					nowStatus:this.curStatus
				}
			},
	    methods:{
	        getStatus(code){
						this.nowStatus=code
						this.$emit('getStatus',this.nowStatus)
					},
	    }
	}
</script>

<style scoped lang="scss">
	.sheet-status{
		width:100%;
		height: 80upx;
		
		box-sizing: border-box;
		padding: 20upx 40upx;
		box-sizing: border-box;
		background-color:#fff;
		justify-content:space-between;
		.status-item{
			color: #999999;
			font-size:26upx;
			padding-bottom: 10upx;
		}
		.this-status{
			color:#27C79A;
			border-bottom: 2upx solid #27C79A;
		}
	}
	
</style>
