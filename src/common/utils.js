export default {

	/* 
	 * obj 转 params字符串参数  
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = "";
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},

	/* 
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || "/";
		let paramsStr = "";
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += "?");
		url += paramsStr;
		return url;
	},

	/* 
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || "";
		let theRequest = new Object();
		let str = href.split("?")[1];
		if (str != undefined) {
			let strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},


	/**
	 * 乘法，解决js精度损失问题
	 * @param {*} arg1 
	 * @param {*} arg2 
	 */
	accMul(arg1, arg2) {
		arg1 = arg1 || 0;
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	},

	// 组件化装修跳转
	goLink(item){
		console.log(item)
	},
	
	// 随机生成n位随机数
    getRandStr(n){
        let str = ''
        for (let i = 0; i < n; i++) {
            str += Math.floor(Math.random() * 10).toString()
        }
        return str
	},
	// 获取当前时间
    getCurTime(){
        let date = new Date(),
            y = date.getFullYear().toString().substr(2),
            m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString(),
            d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString(),
            h = date.getHours() % 12 < 10 ? '0' + date.getHours() % 12 : (date.getHours() % 12).toString(),
            i = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString(),
            s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds().toString();
        return (y + m + d + h + i + s)
	},
	// 提示组件
	toast(text, duration, success) {
		uni.showToast({
			title: text,
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	// upx转px
	px(num){
		return 2*uni.upx2px(num)+'px';
	},
	imgUrl(){
		let url = process.env.VUE_APP_PLATFORM == "h5" ? "" : "https://shop.wsyjcs.cn";
		return url
	},
	
	hideTel(tel){
		return tel.substr(0,3)+"****"+tel.substr(7)
	},
	
	//经纬度字符串拆分数组
	locToArr(locStr){
		return locStr.split(",");
	},
	//经纬度合并成字符串
	locToStr(latitude,longitude){
		return longitude+","+latitude;
	},
	//地址字符串拆分成对象
	addrToObj(district){
		console.log("地址字符串拆分成对象",district)
		if(district.indexOf("省") !== -1){
			console.log("省")
			let p1=district.split("省");
			let province=p1[0]+"省";
			let p2=p1[1].split("市");
			let city=p2[0]+"市";
			let county=p2[1];
			return {
				province,	
				city,	
				county,	
			}
		}else{
			console.log("市")
			let p1=district.split("市");
			let city=p1[0]+"市";
			let county=p1[1];
			return {
				province:"",	
				city,	
				county,	
			}
		}
		
	},
	
	strNotNull(str,msg){
		if(str.trim().length === 0 || str===''){
			uni.showToast({
				title:msg,
				icon:"icon"
			});
			return false;
		}
		return true;
	},
	
	callGetLoction(){
		console.log("callGetLocation")
	},
	
	getCurLoc(suc){
		uni.getSetting({
			success(res) {
				console.log("是否获得位置授权",res.authSetting["scope.userLocation"])
				if(res.authSetting["scope.userLocation"] == false){
					
					uni.openSetting({
						success(res) {
							console.log("打开设置是否获得位置授权：false",res.authSetting["scope.userLocation"])
							if(res.authSetting["scope.userLocation"]){
								uni.getLocation({
									type: 'gcj02',
									success:res=>{
										console.log("回调",res)
										suc(res);
									},				
									fail: (res) => {
										console.log(res.errMsg)
										// that.$mUtils.toast(res)
									},
									
								});
							}
						}
					})
				}else if(res.authSetting["scope.userLocation"]){
					uni.getLocation({
						type: 'gcj02',
						success:res=>{
							console.log("回调",res)
							suc(res);
						},				
						fail: (res) => {
							console.log(res.errMsg)
							// that.$mUtils.toast(res)
						},
						
					});
				}else if(res.authSetting["scope.userLocation"] == undefined){
					uni.getLocation({
						type: 'gcj02',
						success:res=>{
							console.log("回调",res)
							suc(res);
						},				
						fail: (res) => {
							console.log(res.errMsg)
							// that.$mUtils.toast(res)
						},
						
					});
				}
			}
		})
	},
	
	
}