<template>
	<view class="six-input">
		<input type="number" password="true"  v-model="pwdNum" @input="inputPwd"  maxlength="6" cursor-spacing=10 />
		<view class="txt-box">
			<text>{{dot[0]}}</text>
			<text>{{dot[1]}}</text>
			<text>{{dot[2]}}</text>
			<text>{{dot[3]}}</text>
			<text>{{dot[4]}}</text>
			<text>{{dot[5]}}</text>
		</view>
		<!-- ● -->
	</view>
</template>

<script>
	export default{
		data(){
			return {
				length:0,
				dot:[],
				pwdNum:""
			}
		},
		methods:{
			inputPwd(e){
				this.dot=[]
				let pwd=e.detail.value;
				this.length=pwd.length;
				for(let i=0;i<e.detail.value.length;i++){
					this.dot[i]="●"
				}
				console.log("sixPwd",this.length)
				
				if(this.length == 6){
					this.$emit('getPwd',pwd)
				}
							
			},
			
		}
	}
</script>

<style lang="scss">
	input{
		border: 2upx solid #e5e5e5;
	}
	.six-input{
		width: 100%;
		box-sizing: border-box;
		padding: 20upx;
		margin: 0 auto;
		background-color:#fff;
		position:relative;
		input{
			padding: 0;
			box-sizing: border-box;
			width:540upx;
			display: block;
			position:absolute;
			top:20upx;
			left:115upx;
			letter-spacing: 60upx;
			border:none;
			// background-color:red;
			// opacity: 0;
			height: 90upx;
			margin: 0 auto;
			// padding-left: 600upx;
		}
		.txt-box{
			width: 540upx;
			margin: 0 auto;
			display: flex;
			justify-content: center;
			text{
				display: inline-block;
				width: 90upx;
				height: 90upx;
				line-height: 90upx;
				text-align: center;
				border: 2upx solid #e5e5e5;
			}
		}
		
	}
</style>
