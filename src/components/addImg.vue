<template>
	<view class="addimgs-box">
		<view class="imgs-box">
			<view class="img-box" v-for="(item,index) in imgs" :key="index" :style="{width:px(size),height:px(size)}" >
				<image :src="item"></image>
				<image class='del-icon' :src="delIcon" :data-idx="index" @tap="delThisImg"></image>
			</view>
			<view class="img-box" v-show="showAddIcon">
				<image  :src="addImgIcon" mode="" :style="{width:px(size),height:px(size)}" @tap="addImg"></image>
			</view>
		</view>
		<!-- <view class="add-box">
			
		</view> -->
	</view>
</template>

<script>
	export default{
		props:{
			
			initImg:{
				type:Array
			},
			//添加图片icon
			addImgIcon:{
				type:String
			},
			//删除图片icon
			delIcon:{
				type:String
			},
			//最多上传图片张数
			maxCount:{
				type:Number,
				value:9
			},
			//图片尺寸
			size:{
				type:Number,
				value:200
			},
		},
		data(){
			return {
				imgs: this.initImg, //预览的图片
				upImgs:[], //新选择的上传图片
				curCount: 0, //当前图片张数
				showAddIcon:true, //是否显示添加图标
				leftCount:0, //剩余可选择的图片张数
				finishImg:[], // 上传后的图片路径
			}
		},
		methods:{
			px(num) {
				return uni.upx2px(num) + "px"
			},
			delThisImg(e){
				let idx=e.currentTarget.dataset.idx
				this.imgs=this.imgs.slice(0,idx).concat(this.imgs.slice(idx+1,this.imgs.length))
				this.curCount=this.imgs.length;
				this.showAddIcon = this.curCount<this.maxCount
				
				this.finishImg=this.finishImg.slice(0,idx).concat(this.finishImg.slice(idx+1,this.finishImg.length))
				console.log("执行删除后上传后的图片路径",this.finishImg)
				
				console.log("选择图片del",this.imgs);
				this.$emit("addImg",{imgs:this.finishImg})
			},
			addImg(){
				let that=this;
				that.leftCount=that.maxCount- that.curCount;
				uni.chooseImage({
					count: that.leftCount, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album',"camera"], //从相册选择
					    
					success(res) {
						console.log(res)
						that.upImgs=res.tempFilePaths.slice(0,that.leftCount)
						that.imgs=that.imgs.concat(that.upImgs)
						that.curCount=that.imgs.length;
						that.leftCount=that.maxCount- that.curCount;
						that.showAddIcon = that.curCount<that.maxCount
						console.log("选择图片add",that.imgs.length,that.upImgs.length);
						that.upImages(that.upImgs)
						//that.$emit("addImg",{imgFiles:that.imgFiles,imgs:that.imgs})
					}
				})
				
			},
			
			upImages(imgs){
				let that=this;
				
				console.log("上传的图片",imgs.length)
				for(let i=0;i<imgs.length;i++){
					that.$api.uploadFile(imgs[i],"file",that.Authorization)
					.then(res=>{
						let result=JSON.parse(res.data);
						console.log("添加图片",result)
						if(result.code === "200"){
							that.finishImg.push(result.data.url)
							console.log("上传后的图片路径",that.finishImg)
							this.$emit("addImg",{imgs:this.finishImg})
						}else{
							that.$mUtils.toast(result.msg)
						}
						
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.addimgs-box{
		 width:100%;
		 display:block;
		.imgs-box{
			 display:flex;
			 flex-wrap:wrap;
		}
		.img-box{
			position:relative;
			margin-right: 20upx;
			margin-bottom: 20upx;
			image{
				width: 100%;
				height: 100%;
			}
			.del-icon{
				position:absolute;
				top:-10upx;
				right:-10upx;
				width: 60upx;
				height: 60upx;
			}
		}
		
	}
</style>
