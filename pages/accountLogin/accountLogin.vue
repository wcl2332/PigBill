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
						<uni-easyinput class="acc-login-form-input" type="text" placeholder="请输入账号" v-model="account" />
					</uni-forms-item>
					<uni-forms-item>
						<uni-easyinput type="password" placeholder="请输入密码" v-model="password" />
					</uni-forms-item>
					<button class="acc-btn-submit" @click="submit()">确定</button>
				</uni-forms>
			</view>
		</view>
		<view class="acc-login-bottom">

		</view>
	</view>
</template>

<script>
	import request from '@/utils/requst.js'
	export default {
		data() {
			return {
				account: '',
				password: ''
			}
		},
		methods: {
			async submit() {
				console.log(this.$data.account)
				if (this.$data.account == '') {
					uni.showToast({
						title: '账户不能为空',
						icon: 'error'
					})
					return;
				} else if (this.$data.password == '') {
					uni.showToast({
						title: '密码不能为空',
						icon: 'error'
					})
					return;
				}
				let data = {
					'userId': this.$data.account,
					'password': this.$data.password
				}
				const rep = await request.post("/login", data, {}, true, false, "form");
				console.log('reponse');
				let result = rep.data
				let tokenName = result.tokenName;
				let tokenValue = result.tokenValue;
				if (tokenName != '' && tokenValue != '') {
					uni.setStorageSync(tokenName, tokenValue);
					uni.switchTab({
						url:'/pages/index/index'
					})
				} else {
					uni.showToast({
						title: '登录异常，请重试',
						icon: 'error'
					})
				}
			},
			test() {
				let data = {
					'userId': this.$data.account,
					'password': this.$data.password
				}
				request.post("/login", data, {}, true, false, "form").then(rep => {
					console.log('test', rep)
				});
			}
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
		height: 100%;
		justify-content: center;
		align-items: center;
	}

	.login-form {
		display: flex;
		width: 90%;
		height: 100%;
		flex-direction: column;
	}

	:deep(.uni-easyinput__content-input) {
		height: 40px;
	}

	:deep(.is-input-border) {
		border-radius: 25px;
		background-color: rgb(237, 234, 220);
	}

	.acc-btn-submit {
		border-radius: 25px;
		background-color: #0051ff;
		color: #ffffff;
	}

	uni-button:after {
		border: none;
	}

	.acc-login-bottom {
		flex: 4;
		display: flex;
	}
</style>