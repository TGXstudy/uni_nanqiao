<template>
	<view class="container">
		<view class="addr-box" v-if="addrList.length !== 0">
			<swipeAction v-for="(item,idx) in addrList" :key="idx" class='swipe-act' :actions="actions" :operateWidth="50" @click="actionHandle($event,item.id)">
				<view class="addr-item" slot="content">
					<view class="addr-info" @tap="getTheAddr(item)">
						<view class="addr-text">
							<image v-if="item.is_top == 1 " src="../../static/image/icon/defaddr_icon.png"></image>
							<text>{{item.name}}</text>  
							<text>{{item.tel}}</text>
						</view>
						<view class="addr-msg">
							{{item.province}}
							{{item.city}}
							{{item.county}}
							{{item.addr}}
							{{item.house_num}}
						</view>
					</view>
					<view class="addr-op" @tap="goEdit(item.id)">
						<image src="../../static/image/icon/editor.png" mode=""></image>
					</view>
				</view>	
			</swipeAction>
			<view class="seam">			</view>
		</view>
		<view class="addr-box" v-else>
			<noData :msg="'暂无数据'"></noData>
		</view>
		
		
		<view class="fix-add">
			<button class="add-btn" @click="goAddAddr">
				<image src="../../static/image/icon/addaddr_icon.png"></image>
				<text>新增</text>
			</button>
		</view>
		
		<bottomPopup
								 :show="showConfirm"
								 @close="showConfirm=false">
				<view class="pwd-box">
						<view class="pwd-top"> 
							<text>确认删除?</text>
							<image src="../../static/image/icon/close.png" @tap="showConfirm = false"></image>
						</view>
				
						<view class="pwd-btn">
							<button  @tap="showConfirm = false">取消</button>
							<button class='green-btn' @tap="confirmDel">确定</button>
						</view>
				</view>
		</bottomPopup>
	</view>
	
</template>

<script>
	import swipeAction from "../../components/tui/swipe-action/swipe-action.vue"
	import noData from "../../components/noData.vue"
	import bottomPopup from '../../components/tui/bottom-popup/bottom-popup.vue'
	export default{
		components:{
			swipeAction,noData,bottomPopup
		},
		data(){
			return{
				showConfirm:false,
				fromPage:"",
				Authorization:this.$store.getters.getAuthorization,
				addrList:[], //地址列表
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
				]
			}
		},
		methods:{
			//
			actionHandle(e,addrId){
				console.log("滑动删除",e,addrId)
				if(e.index === 0){
					this.showConfirm=true;
					this.addrId=addrId;
				}
			},
			
			//确认删除
			confirmDel(){
				let that=this;
				
				that.$api.delAddr({
					data:{
						id:that.addrId
					}
				},that.Authorization).then(res=>{
					console.log("确认删除 结果",res.data);
					that.$mUtils.toast(res.data.msg)
					if(res.data.code === 200){
						that.showConfirm=false;
						that.getAddrs();
					}
				})
			},
			//跳转新增地址
			goAddAddr(){
				this.$mRouter.push({route:this.$mRoutesConfig.addAddr,query:{opType:'add'}})
			},
			//跳转编辑地址
			goEdit(addrId){
				this.$mRouter.push({route:this.$mRoutesConfig.addAddr,query:{opType:'edit',addrId}})
			},
			//选择该地址
			getTheAddr(item){
				let that=this;
				if(that.fromPage === 'overbook'){
					that.$store.dispatch("setAddress",item);
					that.$mRouter.back(-1,500)
				}
				
			},
			//获取我的地址
			getAddrs(){
				let that=this;
				that.$api.getAddrs({},that.Authorization)
				.then(res=>{
					if(res.data.code === 200){
						console.log("获取我的地址",res,res.data.data);
						
						that.addrList=res.data.data
						that.addrList.map(addr=>{
							return addr.tel=that.$mUtils.hideTel(addr.tel)
						})
						console.log(that.addrList)
					}else{
						that.$mUtils.toast(res.data.msg)
					}
					
				})
			},
		},
		onShow() {
			//获取我的地址
			this.getAddrs()
		},
		onLoad(opt) {
			if(opt.fromPage){
				console.log("页面来源",opt.fromPage);
				this.fromPage=opt.fromPage
			}
			//获取我的地址
			this.getAddrs()
		}
	}
</script>

<style lang="scss" scoped>
	
	.container{
		 width:100%;
		 background-color:#F6F6F6;
		 padding-bottom:100upx;
		 .addr-box{
			  width:100%;
			 display: block;
		 }
		 .swipe-act{
			  width:100%;
				margin-bottom:20upx;
		.addr-item{
			padding: 30upx 0;
			width: 95%;
			margin: 0 auto;
			display: flex;
			justify-content: space-between;
			align-items:center;
			box-sizing: border-box;

			.addr-info{
				 flex: 1;
				 display:block;
				
				 image{
					 width:50upx;
					 height: 40upx;
						margin-right: 20upx;
				 }
				 .addr-text{
					  width: 100%;
					 text{
						margin-right: 20upx;
						 font-size: 30upx;
						 color:#333333;
						 font-weight: bold;
					 }
				 }
				 .addr-msg{
					 display: block;
					 width: 100%;
					 line-height: 40upx;
					 color:#999999;
					 font-size: 26upx;
					 word-wrap:normal;
					 word-break: break-all;
					 white-space:normal;
				 }
			}
			.addr-op{
				width:100upx;
				justify-content: center;
				align-items:center;
				image{
				 width:50upx;
				 height: 50upx;
				}
			}
		}
	}
	.fix-add{
		width: 100%;
		height: 100upx;
		position:fixed;
		left:0;
		bottom:0;
		background-color: #ffffff;
		.add-btn{
			width: 95%;
			height: 90upx;
			margin: 5upx auto;
		 border-radius: 50upx;
			background-color: #27C79A;
			display: flex;
			justify-content: center;
			align-items:center;
			image{
				width: 50upx;
				height: 50upx;
			}
			text{
				color:#FFFFFF;
				font-size:30upx;
			}
		}
	}
	}
	
	.pwd-box{
		width: 100%;
		display: block;
		margin-top: -120upx;
	
		.pwd-top{
			background-color: #fff;
			height: 100upx;
			display:flex;
			font-weight: bold;
			justify-content:space-between;
			align-items:center;
			text{
				display: block;
				flex: 1;
				text-align: center;
				color:#333;
				font-size: 30upx;
			}
			image{
				width: 50upx;
				height: 50upx;
			}
		}
		.popup-con{
			width: 100%;
			background-color: #fff;
			display: block;
			.con-item{
				width: 95%;
				margin: 0 auto;
				display: block;
				
				.item-title{
					color:#333333;
					font-size: 28upx;
					font-weight: bold;
					line-height: 80upx;
				}
				.item-con{
					font-size: 26upx;
					line-height: 50upx;
				}
				textarea{
					box-sizing: border-box;
					border: 2upx solid #e5e5e5;
					height: 150upx;
					padding: 20upx ;
					width: 100%;
					font-size: 26upx;
				}
			}
		}
		.pwd-btn{
			padding:40upx 0;
			background-color: #fff;
			button{
				font-size:30upx;
				color:#AAAAAA;
				background-color:transparent;
				padding: 0 80upx;
			}
			.green-btn{
				
				background-color: #27C79A;
				color:#fff;
				border-radius: 50upx;
			}
		}
	}
			
</style>
