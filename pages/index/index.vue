<template>
	<view class="index-container">
		<view class="index-title">

		</view>
		<view class="index-top">
			<view class="index-top-statistics">
				<view class="statistics-top">
					<view class="statistics-top-left">

					</view>
					<view class="statistics-top-right">

					</view>
				</view>
				<view class="statistics-bottom">

				</view>
			</view>
		</view>
		<view class="index-bil-list">

		</view>

		<uni-fab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" @fabClick="fabClick">
		</uni-fab>
	</view>
</template>

<script>
	import request from '@/utils/requst.js';
	export default {
		onShow() {
			//获取当前月份的总支出等
			this.billToatlOneMon();
			this.getMonthBill();
		},
		data() {
			return {
				vertical: 'bottom',
				horizontal: 'right',
				pattern: {
					buttonColor: '#007AFF',
				},
				pageNo: 1,
				pageSize: 10,
			}
		},
		methods: {
			billToatlOneMon() {
				const theNowMonth = this.getNowMonth();
				request.post('/bill/getTotalBillOneMonth', {
					'month': theNowMonth
				}, {}, true, true, 'form').then(rep => {
					console.log('rep', rep);
				})
			},
			getMonthBill() {
				const theNowMonth = this.getNowMonth();
				const data = {
					'month' : theNowMonth,
					'pageNo' : this.$data.pageNo,
					'pageSize': this.$data.pageSize
				}
				request.post('/bill/getBillByMonth',data,{},true,true,'form').then(rep=>{
					console.log('rep',rep);
				})
			},
			getNowMonth() {
				const now = new Date();
				const year = now.getFullYear();
				let month = now.getMonth() + 1;
				// 如果月份小于 10，前面加 0
				month = month.toString().padStart(2, '0');
				const theNowMonth = year + '-' + month;
				return theNowMonth;
			},
			fabClick() {
				uni.showToast({
					title: '点击了悬浮按钮',
					icon: 'none'
					
				})
			},
		}
	}
</script>

<style scoped>
	.index-container {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: rgb(255, 255, 255);
	}

	:deep(.uni-fab__circle) {
		height: 50px;
		width: 50px;
	}

	.index-title {
		flex: 1;
		display: flex;
	}

	.index-top {
		flex: 3;
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: center;
	}

	.index-top-statistics {
		display: flex;
		width: 90%;
		height: 100%;
		/* border: 1px solid red; */
		background-color: rgb(242, 246, 255);
		border-radius: 15px;
		flex-direction: column;
	}

	.statistics-top {
		display: flex;
		flex: 7;
		flex-direction: row;
	}

	.statistics-top-left {
		display: flex;
		flex: 5;

	}

	.statistics-top-right {
		display: flex;
		flex: 5;
	}

	.statistics-bottom {
		display: flex;
		flex: 3;
		/* background-color: rgb(204,225,255) ; */
	}

	.index-bil-list {
		flex: 7;
		display: flex;
	}
</style>