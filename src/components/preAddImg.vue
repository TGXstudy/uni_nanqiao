<template>
		<view class="addimgs-box">
			<view class="imgs-box">
				<view class="img-box" v-for="(item,index) in preImgs" :key="index" :style="{width:px(size),height:px(size)}" >
					<image :src="item"></image>
					<image class='del-icon' :src="delIcon" :data-idx="index" @tap="delThisImg"></image>
				</view>
				<view class="img-box" v-for="(item,index) in imgs" :key="index" :style="{width:px(size),height:px(size)}" >
					<image :src="item"></image>
					<image class='del-icon' :src="delIcon" :data-idx="index" @tap="delThisImg"></image>
				</view>
				<view class="img-box" v-show="showAddIcon">
					<image  :src="addImgIcon" mode="" :style="{width:px(size),height:px(size)}" @tap="addImg"></image>
				</view>
			</view>
		</view>
		<!-- <view class="add-box">
			
		</view> -->
</template>

<script>
	export default{
		props:{
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
			preImgs:{
				type:Array,
				value:[]
			}
		
		},
		data(){
			return {
				imgs:  [],
				curCount: 0, //当前图片张数
				showAddIcon:true, //是否显示添加图标
				imgFiles:[],
			}
		},
		computed:{
			setPreImgs(){
				return this.preImgs;
			}
		},
		
		methods:{
			px(num) {
				return uni.upx2px(num) + "px"
			},
			delThisImg(e){
				let idx=e.currentTarget.dataset.idx
				this.imgs=this.imgs.slice(0,idx).concat(this.imgs.slice(idx+1,this.imgs.length))
				this.imgFiles=this.imgFiles.slice(0,idx).concat(this.imgFiles.slice(idx+1,this.imgFiles.length))
				// console.log(this.imgs)
				this.curCount=this.imgs.length;
				this.showAddIcon = this.curCount<this.maxCount
				
				this.$emit("preAddImg",{imgs:this.imgFiles})
			},
			addImg(){
				let that=this;
				uni.chooseImage({
					count: that.maxCount, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album',"camera"], //从相册选择
					    
					success(res) {
						console.log(res)
						that.imgFiles=that.imgs.concat(res.tempFiles).slice(0,that.maxCount)
						that.imgs=that.imgs.concat(res.tempFilePaths).slice(0,that.maxCount)
						that.$mUtils.toast("最大选择"+that.maxCount+"张图片")
						that.curCount=that.imgs.length;
						that.showAddIcon = that.curCount<that.maxCount
						// console.log("选择图片",res,";;;;;;",that.imgs,that.showAddIcon);
						that.$emit("preAddImg",{imgFiles:that.imgFiles,imgs:that.imgs})
					}
				})
				
			}
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
