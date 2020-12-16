import Vue from 'vue'
import Vuex from 'vuex'
import $mConfig from '@/config/index.config.js'
import $mRoutesConfig from '@/config/routes.config.js'
import $mRouter from '@/common/router.js'

Vue.use(Vuex)

// uni.setStorageSync("token", "oVG1b1Bgrb");
// uni.setStorageSync("openId", "oVG1b1Bgrb-l6jNYCUr6sYpQ5F-U");

// const Authorization = uni.getStorageSync("Authorization") || "";

const Authorization = "";
const TOKEN = uni.getStorageSync("token") || "";
const OPENID = uni.getStorageSync("openId") || "";
const USER_INFO = uni.getStorageSync("userInfo") || {};

const store = new Vuex.Store({
	state: {
		// 是否強制登录
		forcedLogin:$mConfig.forcedLogin,
		// 前端token
		token: TOKEN,
		// 用户openid
		openId: OPENID,
		// 用户信息 头像 昵称
		userInfo: USER_INFO,
		
		Authorization:Authorization,
		
		//下单页的地址
		address:{},
		
		//添加的新地址
		newAddress:{},
		
		//指定的保洁
		clean:{}
		
	},
	getters: {
		// 用户是否登录
		hasLogin: state => {
			if (Object.keys(state.userInfo).length) {
				return true;
			} else {
				return false;
			}
		},
		getAuthorization:state=>{
			return state.Authorization;
		},
		getAddress:state=>{
			return state.address;
		},
		getNewAddress:state=>{
			return state.newAddress;
		},
		getClean:state=>{
			return state.clean;
		},
	},
	
	mutations: {
		login(state, provider){
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
		},
		logout(state) {
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            })
		},
		SET_TOKEN(state, token) {
			state.token = token;
			uni.setStorageSync("token", token);
		},
		SET_Authorization(state, Authorization) {
			state.Authorization = Authorization;
			// uni.setStorageSync("Authorization", Authorization);
		},
		SET_OPENID(state, openId) {
			state.openId = openId;
			uni.setStorageSync("openId", openId);
		},
		SET_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
			uni.setStorageSync("userInfo", userInfo);
		},
		SET_LOGOUT(state) {
			state.token = "";
			uni.setStorageSync("token", "");
		},
		SET_Address(state,address){
			state.address=address
		},
		SET_NewAddress(state,newAddress){
			state.newAddress=newAddress
		},
		SET_Clean(state,clean){
			state.clean=clean
		}
		
	},
	actions: {
		// 登录过期 重新登录
		reLogin({
			commit
		}, info) {
			commit("SET_TOKEN","");
			$mRouter.redirectTo({
				route:$mRoutesConfig.login
			});
		},
		setAuthorization(context,Authorization) {
			context.commit('SET_Authorization',Authorization)
		},
		setAddress(context,address) {
			context.commit('SET_Address',address)
		},
		setNewAddress(context,newAddress) {
			context.commit('SET_NewAddress',newAddress)
		},
		setClean(context,clean) {
			context.commit('SET_Clean',clean)
		},
		
	}
})

export default store