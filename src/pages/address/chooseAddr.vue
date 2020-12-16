<template>
	<view class="container">
		<view class="input-addr"> 
			<form @submit="getTheAddr">
				<input v-show="false" v-model="location" name="location"></input>
				<input v-show="false" v-model="addrJson" name="addrJson"></input>
		    <view class="addr-detail bor-bot">
		      <input placeholder="请输入地址" @input="getAmapAddr" v-model="addr" name="addr"></input>
					<image src="../../static/image/icon/close.png" @tap="addr =''"></image>
		    </view>
		    <view class="floor-num">
		      <input placeholder="楼层/门牌号" name='addrDetail'></input>
		      <button formType="submit" class="addr-btn" >确定地址</button>
		    </view>
			</form>
		</view>
		<view class="map-box">
			<map id='map' :latitude="latitude" :longitude="longitude" :markers="markers" @regionchange="moveMap"></map>
			<cover-view class="location-now" @tap="getCurLoc">
				<cover-image class='fun-icon' src="../../static/image/icon/location_icon.png"></cover-image>
			</cover-view>
		</view>
		<view class="near-points">
			<view class="point-item bor-bot" v-for="(item,idx) in POIs" :key="idx" @tap="getThisPOI(item)">
				<image src="../../static/image/icon/loc_icon.png" mode=""></image>
				<view class="point-txt">
					<text>{{item.name}}</text>
					<text>{{item.pname}}{{item.cityname}}{{item.adname}}{{item.address}}</text>
				</view>
			</view>
		</view>
		
		
		<cover-view class='input-tips'  v-show="showTips">
			<cover-view class="tip-item bor-bot" v-for="(item,idx) in tips" :key="idx" @tap="getThisTip(item)">
				<cover-view class="text">{{item.name}}</cover-view>
				<cover-view class='small-font'>{{item.district}}</cover-view>
			</cover-view>
		</cover-view>
		
			
		
		
	</view>
</template>

<script>
	import aMap from "../../common/amap-wx.js"
	export default{
	    name: 'chooseAddr',
	    data(){
	        return {
						
						key: '04825bc5fca185682c12da224ce2eb89',
						amapPlugin:null,
						city:'',
						showTips:false, //输入关键字，高德显示附近地址
						tips:[],//输入关键字，高德附近地址
						addr:"", //高德获得的地址
						addrJson:"",
						addrDetail:'', //楼层、门牌号
						location:'',
						POIs:[],//获取单击的地址附近的POI
						latitude:'30.572262 ',
						longitude:'104.066513',
						markers:[
							{
								latitude:'30.572262 ',
								longitude:'104.066513',
								iconPath:"/static/image/icon/curloc_icon.png",
								width:40,
								height:56,
							}
						],
	        }
	    },
	    methods: {
				
				//单击获取当前定位
				getCurLoc(){
					let that=this;
					this.$mUtils.getCurLoc(res => {
							console.log("获取当前定位",res)
							that.latitude=res.latitude; //设置地图中心点
							that.longitude=res.longitude; //设置地图中心点
							that.markers.push({
								latitude: res.latitude,
								longitude: res.longitude,
								iconPath:"/static/image/icon/curloc_icon.png",
								width:40,
								height:56,
							})
						});
				},
				
				//点击确定地址
				getTheAddr(e){
					let that=this;
					let fd=e.detail.value;
					
					if(that.tips.length === 0 && that.POIs.length === 0){
						that.$mUtils.toast("该地址不存在，请重新输入选择");
						return;
					}
					
					if(fd.addr.trim().length === 0){
						that.$mUtils.toast("请输入地址");
						return;
					}
					if(fd.addrDetail.trim().length === 0){
						that.$mUtils.toast("请输入楼层/门牌号");
						return;
					}
					
					if(that.fromPage === 'addAddr'){
						that.$store.dispatch('setNewAddress',fd);
						console.log(fd)
						that.$mRouter.back(-1,50)
					}else if(	that.fromPage === 'qualificate'){
						console.log(fd)
						that.$store.dispatch('setNewAddress',e.detail.value);
						that.$mRouter.back(-1,50)
					}
					console.log("点击确定地址 fd ",e.detail.value);
				},
				//拖动地图
				moveMap(e){
					if(e.type == 'end'){
						//拖动结束，设置地图中心点
						this.setCenter();
					}
				},
				//拖动结束，设置地图中心点
				setCenter(){
					let that=this;
					//获取map上下文
					let mapContext=uni.createMapContext('map');
					mapContext.getCenterLocation({
						success(res) {
							// console.log(res)
							let location=that.$mUtils.locToStr(res.latitude,res.longitude)
							that.setMapCenter(location);
							that.getAmapPOI(location)
						},
						fail(res) {
							
						}
					})
				},
				//设置地图中心点
				setMapCenter(location){
					 let locArr=this.$mUtils.locToArr(location)
					this.latitude=locArr[1]; //设置地图中心点
					this.longitude=locArr[0];
							
					//设置中心点显示
					this.markers=[{
						latitude: locArr[1],
						longitude: locArr[0],
						iconPath:"/static/image/icon/curloc_icon.png",
						width:40,
						height:56,
					}]
					
				},
				//输入关键字，高德附近地址
				getAmapAddr(e) {
					let that = this;
					let keywords = e.detail.value;
					that.amapPlugin.getInputtips({
						keywords: keywords,
						city: that.city,
						success: function (data) {
							that.showTips=true;
							console.log('success', data)
							that.tips=data.tips
			
						},
						fail: function (data) {
							console.log('fail', data)
							
						}
					})
					
				},
				
				//点击关键字 地址
				getThisTip(tip){
				
				 console.log("点击关键字",tip);
				 this.addr=tip.district+tip.address+tip.name
				 this.showTips=false;
				 let addrObj=this.$mUtils.addrToObj(tip.district)
				 addrObj.addr=tip.address+tip.name
				 this.addrJson=JSON.stringify(addrObj)
				 this.location=tip.location
				 console.log("点击关键字",this.addrJson)
				this.setMapCenter(tip.location);
				 //获取单击的地址附近的POI
				 this.getAmapPOI(tip.location)
				},
	
				//获取单击的地址附近的POI
				getAmapPOI(location) {
					let that = this;
					console.log("获取地址附近的POI",location)
					
					that.amapPlugin.getPoiAround({
						location: location,
						success: function (data) {
							that.POIs=data.poisData.slice(0, 5);
							// console.log('success', that.POIs)
						},
						fail: function (data) {
							that.$mUtils.toast("获取附近地址失败，请重试...")
							console.log('fail', data)
						}
					})
				},
				
				//点击POI获取 地址
				getThisPOI(item){
					console.log("点击POI获取",item)
					this.addr=item.pname+item.cityname+item.adname+item.address+item.name;
					this.location=item.location
					let addrObj={
						province:item.pname,			
						city:item.cityname,	
						county:item.adname,	
						addr:item.address+item.name//		详细地址
					}
					this.addrJson=JSON.stringify(addrObj)
					console.log("点击POI获取",this.addrJson)
					this.setMapCenter(item.location)
					//获取单击的地址附近的POI
					this.getAmapPOI(item.location)
				}
			},
		onLoad(options){
			if(options.fromPage){
				console.log("页面来源",options.fromPage)
				this.fromPage=options.fromPage
			}
			
			this.amapPlugin=new aMap.AMapWX({ key: this.key });
			
			// this.getAmapPOI(this.longitude+","+this.latitude)
		
		}
	}
</script>

<style lang="scss">
	page{
		width: 100%;
		height: 100%;
		.container{
			width: 100%;
			height:100%;
			display:flex;
			flex-direction:column;
			justify-content:space-between;
			
			
			.input-addr{
				width:100%;
				background-color:#ffffff;
				display:block;
				font-size:26upx;
				.addr-detail{
					 width: 95%;
					 margin: 0 auto;
					 display:flex;
					 justify-content:center;
					 align-items:center;
					 input{
						 flex:1;
						 word-break: break-word;
						 border:none;
						 width: 100%;
						 height: 100upx;
						 line-height: 100upx;
					 }
					 image{
						 width: 50upx;
						 height: 50upx;
					 }
				} 
				.floor-num{
					width: 95%;
					 height: 100upx;
					 line-height: 100upx;
					 display: flex;
					 justify-content: space-between;
					 align-items: center;
					margin: 0 auto;
					input{
						flex: 1;
						border: none;
					}
					.addr-btn{
						height: 60upx;
						line-height: 60upx;
						padding: 0 20upx;
						border-radius: 30upx;
						background-color: #27C79A;
						font-size: 26upx;
						color:#FFFFFF;
						margin: 0;
					}
				} 
			} 
			.map-box{
				width: 100%;
				flex:1;
				position:relative;
				map{
					width: 100%;
					height: 100%;
				}
				.location-now{
				width: 88upx;
				height: 88upx;
				position: absolute;
				right: 50upx;
				bottom:50upx;
			}
			}
		
			.near-points{
				width: 100%;
				display: block;
				background-color: #ffffff;
				.point-item{
					width: 95%;
					margin: 0 auto;
					display:flex;
					justify-content:space-between;
					align-items:center;
					padding:20upx 0;
					image{
						width: 32upx;
						height: 36upx;
					}
					.point-txt{
						flex: 1;
						margin-left: 20upx;
						display: block;
						text:first-child{
							display: block;
							color: #333333;
							font-size: 28upx;
						}
						text:last-child{
							display: block;
							color:#999999;
							font-size:22upx;
						}
					}
				}
			}
			.input-tips{
			  background-color: #fff;
			  width: 100%;
			  position: absolute;
			  z-index: 1000;
			  top:80upx;
			  left: 0;
			}
			.input-tips>cover-view{
			  padding:10upx 30upx;
			  box-sizing: border-box;
			  
			}
			.tip-item{
			  padding:10upx 20upx;
			}
			
			.tip-item .text{
				line-height: 40upx;
			  display: block;
			  font-size: 32upx;
			}
			
			
			.small-font{
				line-height: 30upx;
			  font-size:24upx ;
			  color:#999999;
			}
		}
	}
</style>
