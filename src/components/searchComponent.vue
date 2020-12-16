<template>
   <view class="searchComponent" :style="{position: val.isFixed?'absolute':'relative'}">
        <view class="search-inner" :style="{backgroundColor:val.bgColor, opacity: val.opacity}" @tap="search">
            <view class="icon"></view>
            <text :style="{color: val.color}">{{val.placeholder}}</text>
        </view>
    </view>
</template>

<script>
export default {
    props: ['val'],
    methods:{
        search(){
            this.$mRouter.push({
                route: this.$mRoutesConfig.search,
				query: {}
            })
        }
    }
}
</script>


<style lang="scss">
.searchComponent{
    width: 100%;
    height: 96upx;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    background: transparent;
    padding: 0 30upx;
    z-index: 100;
    box-sizing: border-box;
    .search-inner{
        width: 100%;
        height: 60upx;
        border-radius: 36upx;
        display: flex;
        align-items: center;
        font-size: 28upx;
        .icon{
            margin: 0 10upx 0 20upx;
            width: 30upx;
            height: 30upx;
            background-image: url('../static/imgs/icon_search_hui@2x.png');
            background-size: contain;
        }
    }
}
</style>

