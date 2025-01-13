<template>
	<view class="login-container">
		<view class="login-top">
			<view class="logo-image">
				<img src="/static/image/logo2.png" alt="" srcset="" style="height: 100px; width: 250px;" />
			</view>
			<view class="logo-text">
				<text>和爱的人</text>
			</view>
			<view class="logo-text">
				<text>一起记账吧</text>
			</view>
		</view>
		<view class="login-bottom">
			<view class="bottom-content">
				<view class="bottom-login-LoginBut" @click="text()">
					<view class="button-logo">
						<img src="/static/image/phoneIcon.png" alt="" />
					</view>
					<view class="button-text">
						<text>账号登录</text>
					</view>
				</view>
				<view class="bottom-login-LoginBut smsBut" style="margin-top: 15px;">
					<view class="button-logo">
						<img src="/static/image/smsIcon.png" />
					</view>
					<view class="button-text">
						<text>短信验证码登录</text>
					</view>
				</view>
			</view>
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
			text() {
				alert("hello")
			}
		}
	}
</script>

<style scoped>
	.login-container {
		/* background-color: rgb(254,251,236); */
		background-color: white;
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.logo-image {
		margin-top: 50px;
		padding-left: 20px;
		width: 100%;
		height: auto;
	}

	.logo-text {
		padding-left: 45px;
		font-family: "方正宋体";
		font-size: 30px;
		letter-spacing: 5px;
		/* 增加2像素的字符间距 */
		color: rgb(17, 17, 17);
	}

	.login-top {
		display: flex;
		flex: 6;
		/* border: 1px solid red; */
		height: 100%;
		width: 100%;
		flex-direction: column;
	}

	.login-bottom {
		display: flex;
		flex: 4;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.bottom-content {
		width: 90%;
		height: 100%;
		/* border: 1px solid blue; */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.bottom-login-LoginBut {
		height: 45px;
		width: 100%;
		background-color: rgb(41, 96, 238);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
		border-radius: 20px;
		position: relative;
	}

	.button-logo {
		/* display: flex; */
		/* flex: 2; */
		/* height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center; */
		position: absolute;
		left: 30px;
		z-index: 100;

	}

	.button-logo img {
		height: 21px;
		width: 21px;
	}

	.button-text {
		height: 100%;
		width: 100%;
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
	}

	.smsBut {
		background-color: rgb(234, 230, 211);
		color: black;
	}
</style>