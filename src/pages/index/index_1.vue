<template>
	<view class="container">
		<indexSerch :section="city.cityName"></indexSerch>
		<indexBanner :imglist="bannerList" @chengeToUrl="chengeToUrl"></indexBanner>
		<indexNavList></indexNavList>
		<indexTitle :title="'招标信息'" @tapDots="tapDots('bid')"></indexTitle>
		<indexBid :items="bidItems"></indexBid>
		<view class="gray-seam"></view>

		<indexTitle :title="'工程案例'" @tapDots="tapDots('project')"></indexTitle>
		<indexProject :items="caseItems"></indexProject>
		<view class="gray-seam"></view>

		<indexTitle :title="'人才中心'" @tapDots="tapDots('talent')"></indexTitle>
		<indexTalent :items='talentList'></indexTalent>
		<view class="gray-seam"></view>
		<indexTitle :title="'商家'" @tapDots="tapDots('merchant')"></indexTitle>
		<indexMerchant :items="shopItems"></indexMerchant>


	</view>
</template>

<script>
	import indexSerch from "../../components/index/indexSerch.vue"
	import indexBanner from "../../components/index/indexBanner.vue"
	import indexNavList from "../../components/index/indexNavList.vue"
	import indexProject from "../../components/index/indexProject.vue"
	import indexTalent from "../../components/index/indexTalent.vue"
	import indexTitle from '../../components/index/indexTitle.vue';
	import indexMerchant from "../../components/index/indexMerchant.vue";
	import indexBid from "../../components/index/indexBid.vue"
	//#ifdef MP-WEIXIN
	//引入高德地图
	import aMap from "common/amap-wx.js"
	//#endif
	//#ifdef H5
	import aMapH5 from "@/common/AMap.js"
	//#endif
	export default {
		components: {
			indexSerch,
			indexBanner,
			indexNavList,
			indexProject,
			indexTalent,
			indexTitle,
			indexMerchant,
			indexBid
		},
		data() {
			return {
				bannerList: [],
				bidItems: [], //招标信息
				caseItems: [], //工程案例
				talentList: [], //人才列表
				shopItems: [], //商家列表
				city: {}, //获取当前城市
				location: {},
				amapPlugin: null,
			}
		},
		onLoad() {
			//#ifdef MP-WEIXIN
			this.amapPlugin = new aMap.AMapWX({
				key: '591e929d30f8468980cb92d69671e2d1'
			});
			//获取当前定位
			this.getMPCurLocation()
			//#endif
			// #ifdef  H5
			//获取当前定位
			this.getCurLocation()
			// #endif
		},
		onShow() {
			
			//获取广告
			this.getBanner()
			
			//设置城市名，adcode的store，并更新首页数据
			this.city = this.$store.getters.getCity
			this.location = this.$store.getters.getLocation
			this.refreshData(this.city.cityName,this.city.adcode);
		},
		methods: {
			//#ifdef H5
			//获取当前定位
			getCurLocation() {
				// console.log("获取当前定位H5")
				let that = this;
				aMapH5().then(AMap => {
					AMap.plugin("AMap.Geolocation", function() {
						let geoloc = new AMap.Geolocation({
							// 是否使用高精度定位，默认：true
							enableHighAccuracy: true,
							// 设置定位超时时间，默认：无穷大
							timeout: 10000,
						
						})
						geoloc.getCurrentPosition()
						AMap.event.addListener(geoloc, 'complete', onComplete)
						AMap.event.addListener(geoloc, 'error', onError)

						function onComplete(data) {
							// console.log("具体的定位信息", data.addressComponent,data.position);
							let location=data.addressComponent;
							//设置经纬度，
							that.$store.dispatch("setLocation", {
								latitude: data.position.lat,
								longitude: data.position.lng
							})
							//设置城市名，adcode的store，并更新首页数据
							let adcode=location.adcode
							adcode = (adcode + '').slice(0, 4) + "00"
							that.refreshData(location.city,adcode);
						}

						function onError(data) {
							// 定位出错
							// console.log("定位出错", data);
							that.$mUtils.toast("GPS定位失败,切换为IP定位")
							// 调用ip定位
							that.getLocByIp();

						}
					})

				}, e => {
					console.log('地图加载失败', e)
				})
			},
			// 调用ip定位
			getLocByIp() {
				alert("切换为IP定位");
				let that = this;
				aMapH5().then(AMap => {
					AMap.plugin('AMap.CitySearch', function() {
						var citySearch = new AMap.CitySearch();
						citySearch.getLocalCity(function(status, result) {
							if (status === 'complete' && result.info === 'OK') {
								// 查询成功，result即为当前所在城市信息
								console.log('通过ip获取当前城市：', result.city,result.adcode,result.rectangle)
								let lnglat = result.rectangle.split(';')[0].split(',');
								console.log(lnglat);
								that.$store.dispatch("setLocation", {
									latitude: lnglat[1],
									longitude: lnglat[0]
								})
								//设置城市名，adcode的store，并更新首页数据
								let adcode=result.adcode
								adcode = (adcode + '').slice(0, 4) + "00"
								that.refreshData(result.city,adcode);
							}
						})
					})
				}, e => {
					console.log('地图加载失败', e)
				})
			},

			//#endif
			//#ifdef MP-WEIXIN
			//获取当前定位
			getMPCurLocation() {
				console.log("获取当前定位MP")
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					success(res) {
						console.log("获取当前定位success", res)
						that.$store.dispatch("setLocation", {
							latitude: res.latitude,
							longitude: res.longitude
						})
						console.log(that.$store.getters.getLocation)
						that.getCityByLoc(res.longitude, res.latitude)
					},
					complete(res){
						console.log("获取当前定位complete", res)
					}
				})

			},

			//根据经纬度获取城市名
			getCityByLoc(longitude, latitude) {
				let that = this;

				that.amapPlugin.getRegeo({
					location: '' + longitude + ',' + latitude + '', //location的格式为'经度,纬度'
					success: function(data) {
						let cityName = data[0].regeocodeData.addressComponent.city.length !== 0 ? data[0].regeocodeData.addressComponent
							.city : data[0].regeocodeData.addressComponent.province;
						let adcode = data[0].regeocodeData.addressComponent.adcode
						adcode = (adcode + '').slice(0, 4) + "00"
						console.log("高德获取城市MP", data, cityName, adcode)
						//设置城市名，adcode的store，并更新首页数据
						that.refreshData(cityName,adcode);
						
					},
					fail: function(info) {}
				});
			},
			//#endif
			//设置城市名，adcode的store，并更新首页数据
			refreshData(cityName,adcode){
				let that=this;
				this.$mUtils.toast("当前定位城市："+cityName)
				console.log("//设置城市名，adcode的store，并更新首页数据",cityName,adcode);
				that.$store.dispatch("setCity", {
					cityName,
					adcode
				})
				that.city = {
					cityName,
					adcode
				}
				//招标信息列表
				that.getBidList();
				//案例列表 
				that.getCaseList();
				//人才列表
				that.getTalentList()
				//商家列表
				that.getShopList();
			},

			// 点击跳抓图片链接
			chengeToUrl(msg) {
				console.log('msg.link_params', msg.link_params)
				if (msg.link_params != '') {
					let to = {
						path: msg.link_params
					}
					this.$mRouter.push({
						route: to
					})
				}
			},

			getShopList() {
				this.$api.shopList({
					data: {
						page: 1,
						pre_page: 3,
						longitude: this.location.longitude,

						latitude: this.location.latitude, //纬度
						recommend: 1, //是否推荐 0->不推荐;1->推荐
					},
					header: {
						auth: this.$store.getters.getMember.token,
						device: true
					}
				}).then(res => {
					console.log("商家列表", res);
					if (res.code === 1) {
						this.shopItems = res.data.data;
					} else {
						console.log("商家列表", res);
					}
				})
			},

			//人才列表
			getTalentList() {
				this.$api.talentList({
					data: {
						page: 1,
						page_size: 3,
						adcode: this.city.adcode, //	String	
						is_recommend: 2,
					},
					header: {
						auth: this.$store.getters.getMember.token,
						device: true
					}
				}).then(res => {
					console.log("人才列表", res.data.data)
					if (res.code === 1) {
						this.talentList = res.data.data
					} else {

					}
				})
			},
			//获取广告
			getBanner() {
				this.$api.getBanner({
					data: {
						position_id: 1
					}
				}).then(res => {
					console.log("获取广告", res)
					if (res.code === 1) {
						this.bannerList = res.data
					} else {
						console.log("获取广告", res)
					}
				})
			},
			//案例列表
			getCaseList() {
				this.$api.caseList({
					data: {
						page: 1,
						page_size: 3,
						adcode: this.city.adcode, //	String	
						is_recommend: 2
					},
					header: {
						auth: this.$store.getters.getMember.token,
						device: true
					}
				}).then(res => {

					if (res.code === 1) {
						this.caseItems = res.data.data
					} else {
						console.log("获取案例列表", res)
					}
				})
			},


			//招标信息列表
			getBidList() {
				this.$api.bidList({
					data: {
						page: 1, //String						页数；
						page_size: 3, //	String						每页数量；
						adcode: this.city.adcode, //	String	
						is_recommend: 2
					},
					header: {
						auth: this.$store.getters.getMember.token,
						device: true
					}
				}).then(res => {
					if (res.code === 1) {
						this.bidItems = res.data.data
					} else {
						console.log("招标信息列表", res);
					}
				})
			},
			tapDots(type) {
				console.log("点击...", type)
				if (type === 'merchant') {
					this.$mRouter.switchTab({
						route: this.$mRoutesConfig.nearby
					})
				} else {
					this.$mRouter.push({
						route: this.$mRoutesConfig[type]
					})
				}

			}
		}
	}
</script>

<style>

</style>
