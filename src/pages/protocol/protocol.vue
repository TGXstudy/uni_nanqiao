<template>
	<view class="container">
		<rich-text :nodes="content"> </rich-text>
	</view>
</template>

<script>
	export default{
		data(){
				
			return{
				Authorization:this.$store.getters.getAuthorization,
				content:""
			}
		},
		onLoad(opt){
			let pType=opt.type;
			console.log("onLoad",pType)
			this.$api.getRules({
				data:{
					rule:pType
				}
			},this.Authorization).then(res=>{
				console.log(res)
				if(res.data.code === 200){
					let richtext=res.data.data.option_value;
					
					const regex = new RegExp('<img', 'gi');
					richtext= richtext.replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
            .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 style="width: 100%; border-radius: 8Px;"');
			 
					this.content = richtext;
				}else{
					this.$mUtils.toast(res.data.msg)
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width:100%;
		height:100%;
	
		.content{
			width: 95%;
			margin: 0 auto;
			
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	
	rich-text{
		width:95%;
		margin: 0 auto;
	}
</style>
