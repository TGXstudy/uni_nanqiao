<template>
    <view class="nav">
        <view class="nav-inner" :style="{height: !val.navType ? swiperHight : 'auto'}">
            <swiper class="nav-swiper" circular=false autoplay=false :vertical="val.vertical" v-if="!val.navType" @change="changeSwiper">
                <swiper-item v-for="(item, index) in swiperPage" :key="index">
                    <ul>
                        <li @tap="$mUtils.goLink(_item)" v-for="(_item, _index) in swiperList" :key="_index" :class="'col-icon-'+val.cols" :style="{padding: $mUtils.px(val.padding)}">
                            <view class="lazy-img" v-if="val.iconShow">
                                <image :src="$mUtils.imgUrl()+_item.src" class="pic" :style="{height: iconHeight}"></image>
                            </view>
                            <view v-if="val.txtShow" class="img-txt">{{_item.desc}}</view>
                        </li>
                    </ul>
                </swiper-item>
            </swiper>
            <view class="nav-vertical-list" v-else>
                <view class="nav-vertical-item" v-for="(item, index) in val.list" :key="index">
					<view class="item-l" @tap="$mUtils.goLink(item)">
                        <view class="item-icon" v-if="val.iconShow">
                            <view class="lazy-img">
								<image :src="$mUtils.imgUrl()+item.src" class="pic"></image>	
							</view>
                        </view>
                        <view class="txt" v-if="val.txtShow">{{item.desc}}</view>
                    </view>
					<view class="item-r">
                        <view class="arrow-right">
                            <image src="../static/imgs/ic_order_rightarrow.png" />
                        </view>
                    </view>
				</view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props: ['val'],
	data(){
		return {
			current: 0
		}
	},
	computed:{
        swiperPage(){
            let count = Math.ceil(this.val.list.length/(Number(this.val.cols)*Number(this.val.rows))),
                arr = []
            for(var i=0; i<count; i++) {
                arr.push(i)
            }
            return arr
        },
        swiperList () {
            let index = this.current
            return this.val.list.slice(index*Number(this.val.cols)*Number(this.val.rows), (index+1)*Number(this.val.cols)*Number(this.val.rows))
        },
		swiperHight(){
            try {
                const res = uni.getSystemInfoSync()
                let w = res.windowWidth,
                    l = this.val.list.length,
                    cow = Number(this.val.cols)
                return (Math.ceil(w/cow)+2*uni.upx2px(18))*(Math.ceil(l/cow))+'px'
            }catch(e){}
        },
        iconHeight(){
            try {
                const res = uni.getSystemInfoSync()
                let w = res.windowWidth,
                    cols = Number(this.val.cols),
                    padding = Number(this.val.padding)
                return (Math.ceil(w/cols)-4*uni.upx2px(padding))+'px'
            }catch(e){}
        }
    },
    methods:{
        changeSwiper(e){
            this.current = e.detail.current
            console.log(e)
        }
    }
}
</script>


<style lang="scss">
.nav{
    position: relative;
    background: #FFF;
    .nav-inner{
		width: 100%;
        .van-swipe__indicators{
            .van-swipe__indicator{
                width: 4px;
                height: 3px;
                background: #E8E8E8;
                &.van-swipe__indicator--active{
                    width: 11px;
                    background: #999999;
                }
            }
        }
		.nav-swiper{
			width: 100%;
			height: 100%;
		}
        ul{
            display: flex;
            // justify-content: space-between;
            flex-wrap: wrap;
            li{
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #333;
                font-size: 24upx;
                box-sizing: border-box;
                .lazy-img{
                    background: transparent;
					width: 100%;
					height: 100%;
                    img{
                        display: block;
                        // width: 100%;
                        // &[lazy="error"], &[lazy="loading"]{
                        //     width: 40%;
                        //     height: 30%;
                        // }
                    }
                    // &:after{
                    //     display: block;
                    //     padding-top: 100%;
                    //     content: '';
                    // }
                }
                .img-txt{
                    display: block;
                    width: 100%;
                    height: 36upx;
                    line-height: 36upx;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    white-space: normal;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    text-align: center;
                }
                &.col-icon-2{
                    width: 50%;
                }
                &.col-icon-3{
                    width: calc(100%/3);
                   
                }
                &.col-icon-4{
                    width: 25%;
                }
                &.col-icon-5{
                    width: 20%;
                }
            }
        }
        .nav-vertical-list{
            display: block;
            width: 100%;
            .nav-vertical-item{
                height: 120upx;
                border-bottom: 1px solid #E5E5E5;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 28upx;
                padding-right: 30upx;
                .item-l{
                    display: flex;
                    align-items: center;
                    padding-left: 30upx;
                    flex: 1;
                    .item-icon{
                        width: 80upx;
                        height: 80upx;
                        .lazy-img{
                            width: 100%;
                            height: 100%;
                        }
                        img, image{
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .txt{
                        flex: 1;
                        padding-left: 60upx;
                        color: #666;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 1;
                        white-space: normal;
                        word-break: break-all;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        font-size: 30upx;
                    }
                }
                .item-r{
                    display: flex;
                    align-items: center;
                    .arrow-right{
                        width: 20upx;
                        height: 30upx;
                        margin-left: 20upx;
                        img, image{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
}
</style>

