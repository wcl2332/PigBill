<script>
	export default {
		onLaunch: function() {
			//判断是否已经登录。
			const token = uni.getStorageSync("token");
			console.log('token', token)
			if (token == null || token.length<=0) {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			}
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>