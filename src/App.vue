<script>
	export default {
		onLaunch: function(o) {
			console.log('onLauch', o)
			this.$AppEntryController.getWeChatOpenId();
			// #ifdef H5
			this.$AppEntryController.handleH5BrowserAddressBarAuth();
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import './common/common.css';
	page{
		position: relative;
	}
	page,
	view {
		display: flex;
	}

	page {
		display: flex;
		min-height: 100%;
		background-color: #f5f5f5;
	}
	
	.seam{
		width: 100%;
		height: 20upx;
		background-color: #F6F6F6;
	}
	
	.bor-bot{
		border-bottom: 2upx solid #e5e5e5;
	}
	.small-radio{
		transform: scale(.7);
	}
	.input-box{
		width:95%;
		margin:0 auto;
		font-size: 28upx;
		line-height:50upx;
		padding:20upx 0;
		align-items:center;
		radio{
			transform: scale(.7);
		}
		.label-txt{
			color:#333333;
			margin-right: 20upx;
		}
		input{
			flex: 1;
			border: none;
		}
		.show-txt{
			color:#AAAAAA;
			flex: 1;
			
			display:flex;
			justify-content:space-between;
			align-items:center;
			image{
				width: 40upx;
				height: 40upx;
			}
		}
	}
	
	.btn-area{
		width: 100%;
		padding: 20upx 0;
		button{
			width: 95%;
			margin: 0 auto;
			background-color:#27C79A;
			font-size:36upx;
			color:#fff;
			text-align: center;
			border-radius: 50upx;
		}
	}
	
	.tui-swipeout-content {
		width: 100%;
	}
	
</style>
