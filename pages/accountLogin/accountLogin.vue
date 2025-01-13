<template>
	<view class="accountLogin-container">
		<view class="acc-login-top">
			<view class="login-top-text">
				<text>Hi,你的</text>
			</view>
			<view class="login-top-text">
				<text>账号密码是？</text>
			</view>
		</view>
		<view class="acc-login-form">
			<view class="login-form">
				<uni-forms>
					<uni-forms-item>
						<uni-easyinput type="text" placeholder="请输入账号" />
					</uni-forms-item>
				</uni-forms>
			</view>
		</view>
		<view class="acc-login-bottom">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.accountLogin-container {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: white;
	}
	.acc-login-top { 
		flex: 3;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
	}
	.login-top-text {
		width: 90%;
		font-size: 40px;
		font-family: '方正宋体';
		letter-spacing: 3px;
	}
	.acc-login-form { 
		flex: 3;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.login-form {
		display: flex;
		/* border:  1px solid red; */
		width: 90%;
		height: 100%;
		flex-direction: column;
	}
	
	
	.acc-login-bottom {
		flex: 4;
		display: flex;
	}
</style>
