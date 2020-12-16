<template>
    <view class="container">
			<cover-view class="merchant-book" @tap="goOverbook">
				<cover-view class='fun-text'>选择服务地址</cover-view>
				<cover-view class='fun-btn'>商户下单</cover-view>
			</cover-view>
			<!-- :include-points="markers" -->
			<map id='map'  :latitude="latitude" :longitude="longitude" :markers="markers" @regionchange="moveMap"></map>
			<cover-view class="location-now" @tap="getCurLoc">
				<cover-image class='fun-icon' src="../../static/image/icon/location_icon.png" mode=""></cover-image>
			</cover-view>
			<cover-view class="footer-fun">
				<cover-view @tap="goMyOrder"> 
					<cover-image class='fun-icon' src="../../static/image/icon/order_icon.png"></cover-image>
				</cover-view>
				<cover-view class='fun-btn' @tap="goGrabOrder">保洁抢单</cover-view>
				<cover-view @tap="goMyFile">
					<cover-image class='fun-icon' src="../../static/image/icon/mine_icon.png"></cover-image>
				</cover-view>
			</cover-view>
    </view>
</template>
<script>
	import aMap from "../../common/amap-wx.js"
export default{
    name: 'index',
    data(){
        return {
					key: '04825bc5fca185682c12da224ce2eb89',
					amapPlugin:null,
					Authorization:this.$store.getters.getAuthorization,
					latitude:'30.545570', //30.572262
					longitude:'104.068555', //104.066513
					markers:[
						{},
						{
							iconPath:"/static/image/icon/curloc_icon.png",
							width:40,
							height:56,
						},
						
						
					],
					cityName:"",
        }
    },
    methods: {
			//拖动地图
			moveMap(e){
				// console.log("move move",e)
				if(e.type == 'end'){
					// console.log("拖动结束，设置地图中心点")
					//拖动结束，设置地图中心点
					this.setCenter();
				}else{
					
				}
			},
			//拖动结束，设置地图中心点
			setCenter(){
				let that=this;
				//获取map上下文
				let mapContext=uni.createMapContext('map');
				mapContext.getCenterLocation({
					success(res) {
						var distance = that.getDistance(res.latitude, res.longitude, that.latitude, that.longitude)
						// console.log("distance distance",distance)
						if ((res.latitude == that.latitude && res.longitude == that.longitude) || distance < 1) {
							return;
						}
						that.latitude=res.latitude; //设置地图中心点
						that.longitude=res.longitude;
						// 设置中心点显示
						that.markers[0]={
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath:"/static/image/icon/curloc_icon.png",
							width:40,
							height:56,
						}
					},
					fail(res) {				}
				})
			},
			
			getDistance(lat1, lng1, lat2, lng2){
		    lat1 = lat1 || 0;
		    lng1 = lng1 || 0;
		    lat2 = lat2 || 0;
		    lng2 = lng2 || 0;
		    var rad1 = lat1 * Math.PI / 180.0;
		    var rad2 = lat2 * Math.PI / 180.0;
		    var a = rad1 - rad2;
		    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
		    var r = 6378137;
		    return (r*2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+Math.cos(rad1)*Math.cos(rad2)*Math.pow(Math.sin(b / 2), 2)))).toFixed(0)
		 
		  },
			
			goOverbook(){ //跳转商户下单页面 overbook
				let that=this;
				// console.log("哈哈哈",that.Authorization);
				if(that.Authorization === ''){
					 that.$mUtils.toast("请先登录")
					 // console.log("请先登录",this.$mRoutesConfig.login);
					 let tid=setTimeout(()=>{
						 that.$mRouter.push({route:this.$mRoutesConfig.login});
						 clearTimeout(tid)
					 },200)
				}else{
					console.log("跳转商户下单页面",this.$mRoutesConfig.overbook);
					that.$mRouter.push({route:this.$mRoutesConfig.overbook})	
				}
			},
			goGrabOrder(){//跳转保洁页面 
				 let that=this;
				 
				 //判断用户是否登录
				 if(that.Authorization === ''){
					 that.$mUtils.toast("请先登录");
					 let tid=setTimeout(()=>{
						 that.$mRouter.push({route:this.$mRoutesConfig.login});
						 clearTimeout(tid)
					 },200)
				 }else{
					 //判断是否认证保洁，并根据结果跳转页面
					 that.$api.checkCert({
					 					
					 },that.Authorization).then(res=>{
						 			 console.log("是否认证保洁",res)
						 if(res.data.code === 500){
							 
							 that.$mUtils.toast(res.data.msg)
							 let tid=setTimeout(()=>{
								 that.$mRouter.push({route:that.$mRoutesConfig.qualificate})
								 clearTimeout(tid);
							 },1000)
							 
						 }else if(res.data.code === 200){
							  that.$mRouter.push({route:that.$mRoutesConfig.grabOrder,query:{cityName:that.cityName}})
						 }else if(res.data.code === 1003){
								that.$mUtils.toast("请先登录")
								let tid=setTimeout(()=>{
									 that.$mRouter.push({route:this.$mRoutesConfig.login});
									 clearTimeout(tid)
								},200)
						}
					 		
					 })
				 }
				 	
			},
			goMyOrder(){ //跳转订单页面 order
				console.log("跳转订单页面");
				this.$mRouter.push({route:this.$mRoutesConfig.order})	 
			},
			goMyFile(){ //跳转我的页面
				console.log("跳转我的页面");
				this.$mRouter.push({route:this.$mRoutesConfig.mine})	
			},
			//获取保洁的定位点
			getCleaners(){
				let that=this;
				
				that.$api.getIndexData({
				  
				}).then((res)=>{
					if(res.data.code == 200){
						console.log("获取保洁的定位点",res);
						let markers=res.data.data;
						let markerArr=[]
						for(let i=0;i<markers.length;i++){
							
							let marker={
								id:i,
								iconPath:"/static/image/icon/marker_icon.png",
								width:72,
								height:72,
							
							}
							marker.latitude=markers[i].lat;
							marker.longitude=markers[i].lon;
							markerArr.push(marker)
						}
						
						that.markers=markerArr
						console.log("that.markers",that.markers)
					}else{
						uni.showToast({
							title: res.msg,
							icon:"none"
						});
					}
					
					
				})
				
			},
			//获取当前定位
			getCurLoc(){
				let that=this;
				this.$mUtils.getCurLoc(res => {
						// console.log("获取当前定位",res)
						that.latitude=res.latitude; //设置地图中心点
						that.longitude=res.longitude; //设置地图中心点
						that.markers[0]={
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath:"/static/image/icon/curloc_icon.png",
							width:40,
							height:56,
						}
						
					});
			},
			//强制获取用户定位
			forceGetCurLoc(){
				let that=this;
				
				uni.getSetting({
					success(res) {
						
						if(res.authSetting["scope.userLocation"] == undefined || res.authSetting["scope.userLocation"]){
							uni.getLocation({
								success:res=>{
									that.latitude=res.latitude; //设置地图中心点
									that.longitude=res.longitude; //设置地图中心点
									that.markers[0]={
										latitude: res.latitude,
										longitude: res.longitude,
										iconPath:"/static/image/icon/curloc_icon.png",
										width:40,
										height:56,
									}	
									console.log("强制获取用户定位：",that.longitude,that.latitude)
									
									//根据经纬度获取城市名
									that.getCityByLoc(that.longitude,that.latitude)
									
								},
								fail(res) {
									if(res.errMsg == "getLocation:fail auth deny"){
										console.log("拒绝")
										that.openAuth()
									}
								}
							})
						}else if(res.authSetting["scope.userLocation"] == false){
							//打开设置授权
							that.openAuth();
						}
					},
					
				})
			},
			
			//根据经纬度获取城市名
			getCityByLoc(longitude,latitude){
				let that=this;
				that.amapPlugin.getRegeo({
					location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
					success: function (data) {
						that.cityName = data[0].regeocodeData.addressComponent.city
						console.log("高德获取城市",that.cityName) 
					},
					fail: function (info) { 
						noneToast(info)
					}
				});
			},
			openAuth(){
				let that=this;
				console.log("打开设置授权");
				
				uni.showModal({
					title: '提示',
					content: '您拒绝了位置授权，将无法使用南峤宿洁的部分功能，是否重新定位？',
					
					success: res => {
						console.log("success",res)
						if( res.confirm){
							uni.openSetting({
								success(res) {
									console.log(res.authSetting)
									if(!res.authSetting["scope.userLocation"]){
										that.openAuth()
									}
								}
								
							})
						}
					},
					fail: (res) => {
						console.log("fail",res)
					},
				
				});
				
			},
    },
	
	 onLoad(options){
		//获取保洁的定位点
		// this.getCleaners();
		
		//强制获取用户定位
		// this.forceGetCurLoc();
		this.amapPlugin=new aMap.AMapWX({ key: this.key });
		
	},
	
	onShareAppMessage(res) {
		// console.log("onShareAppMessage",res)
		// 	return {
		// 		from:"menu",
		// 		title: '南峤宿洁',
		// 		path: '/pages/index/index'
		// 	}
	},
	onShow() {
		//强制获取用户定位
		this.forceGetCurLoc();
		
		// 获取保洁的定位点
		this.getCleaners();
	
	}
}
</script>

<style lang="scss" scoped>
	page{
		width: 100%;
		height: 100%;
		
		.container{
			width: 100%;
			
			.merchant-book{
				width: 94%;
				height: 90upx;
				line-height: 90upx;
				background: #fff;
				position: fixed;
				top:20upx;
				left: 3%;
				border-radius: 50upx;
				z-index: 999;
				padding: 0 20upx;
				box-sizing: border-box;
				font-size: 28upx;
				color: #999999;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.fun-text{
					flex: 1;
					box-sizing: border-box;
					// text-indent: 50upx;
					padding-left: 50upx;
				}
				.fun-btn{
					width: 180upx;
					height: 60upx;
					line-height: 60upx;
					background-color: #F08E3B;
					color:#ffffff;
					border-radius: 30upx;
					text-align: center;
				}
			}
			map{
				width: 100%;
				height: 100%;
			}
			.fun-icon{
				width: 100upx;
				height: 100upx;
			}
			.location-now{
				width: 100upx;
				height: 100upx;
				position: fixed;
				right: 3%;
				bottom:160upx;
			}
			.footer-fun{
				width: 94%;
				height: 90upx;
				position: fixed;
				left: 3%;
				bottom:50upx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.fun-btn{
					background-color: #27C79A;
					font-size: 36upx;
					color: #ffffff;
					width: 459upx;
					height: 90upx;
					text-align: center;
					line-height: 90upx;
					border-radius: 50upx;
				}
			}
		}
	}

</style>

