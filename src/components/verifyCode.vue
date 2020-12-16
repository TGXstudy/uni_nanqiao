<template>
    <view class="verify-component" :class=" btnColor == 'green'?'green':''">
        <tui-button size="mini" class="org-btn" shape="circle"  :disabled="disabled" :class="mob.length == 11?'light':''" @click="getVerify">{{verifyText}}</tui-button>
    </view>
</template>
<script>
    import tuiButton from "@/components/tui/button/button"
    export default{
        name: 'verifyCode',
        components: {tuiButton},
        props: {
            mob: {
              type: String
            },
            type: {
              type: Number
            },
						btnColor:{
							 type: String
						},
						
				},
        data() {
            return {
              disabled:false,
							verifyText:'获取',
							Authorization:this.$store.getters.getAuthorization,
            }
        },
        methods: {
            getVerify(){
							console.log("单击获取",this.mob)
              if(this.mob.trim().length === 0) {
								 this.$mUtils.toast('请输入手机号')
								return
							}
              if(this.mob.length < 11 || !this.$regs.isPhone.test(this.mob)){
                this.$mUtils.toast('手机格式不正确')
                return 
              }
              this.disabled = true
              this.verifyText = '请稍候...'
              this.$api.sendMsg({
                  data:{
                    model: this.type,
                    tel: this.mob
                  }
              },this.Authorization).then(res=>{
                  console.log("获取验证码",res)
                  if(res.data.code === 200){
										this.$mUtils.toast(res.data.msg)
                    this.countDown(60)
                  }else{
                    this.disabled = false
                    this.verifyText = '获取验证码'
                    this.$mUtils.toast(res.data.msg)
                  }
              }).catch(err=>{

              })
           },

           countDown(seconds){
              this.verifyText = `已发送${seconds}s`
              var auth_timetimer =  setInterval(()=>{
                  if(seconds > 0 ){
                     this.verifyText = `已发送${seconds}s`
                     --seconds
                  }else{
                      this.verifyText='重新获取'
                      this.disabled = false
                      clearInterval(auth_timetimer)
                  }
              }, 1000);
           }
        },
             
    }
</script>
<style lang="scss">
    uni-button, tui-button{
      &.verify{
        color: #999!important;
        padding: 0;
        width: 156upx;
        height: 48upx;
        line-height: 48upx;
        font-size: 24upx;
        box-sizing: border-box;
        background: transparent;
        button{
          width: 100%!important;
          height: 100%!important;
          font-size: 24upx!important;
          padding: 0;
          line-height: 48upx;
        }
        &:after{
            border: 2upx solid #999!important;
        }
        &.light{
            color: #1FA76E!important;
            &:after{
              border-color: #1FA76E!important;
            }
        }
        
      }
    }
		.tui-gradual-hover{
			background: #F08E3B !important;
		}
		.tui-gradual{
			background: #F08E3B !important;
		}
		.green .tui-gradual{
			background: #27C79A !important;
		}
		
		
		
</style>