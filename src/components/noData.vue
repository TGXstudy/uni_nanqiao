<template>
    <!-- 缺省图 -->
    <view class="no-data">
        <view class="image" v-show="imgPath">
            <image  :src="imgPath" ></image>
        </view>
        <text class="txt">{{msg}}</text>
    </view>
</template>

<script>
    export default{
        name: 'NoData',
        props:{
            imgPath:{

            },
            msg:{
                type: String
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style lang="scss">
    .no-data{
			width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        .image{
            width: 122px;
            height: 106px;
            overflow: hidden;
            uni-image, image{
                width: 100%;
                height: 100%;
            }
        }
        .txt{
					width: 100%;
					display: block;
            padding-top: 20px;
            color: #999;
            font-size: 14px;
            text-align: center;
        }
    }
</style>
