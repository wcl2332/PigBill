<template>
	<view class="index-container">
		<view class="index-title">

		</view>
		<view class="index-top">
			<view class="index-top-statistics">
				<view class="statistics-top">
					<view class="statistics-top-left">
						<view class="statistics-date">
							<view class="statistics-date-content">
								<text>本月支出({{currentMonth}})</text>
							</view>
						</view>
						<view class="statistics-expense">
							<view class="statistics-expense-content">
								<view class="testtest">
									<text>￥{{disburse}}</text>
								</view>
							</view>
						</view>
						<view class="statistics-netIncomeAndIncome">
							<view class="statistics-netIncomeAndIncome-content">
								<view class="statistics-Income-content">
									<view class="statistics-IncomeAndBlance-title">
										<text>本月收入</text>
									</view>
									<view class="statistics-IncomeAndBlance-text">
										<text>{{income}}</text>
									</view>
								</view>
								<view class="statistics-balance-content">
									<view class="statistics-IncomeAndBlance-title">
										<text>本月结余</text>
									</view>
									<view class="statistics-IncomeAndBlance-text">
										<text>{{balance}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="statistics-top-right">
						<image src="../../static/image/pig_1.jpg" style="height: 100px; width: 100px;"></image>
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
				currentMonth: '',
				disburse: 0.00,
				income: 0.00,
				balance: 0.00
			}
		},
		methods: {
			billToatlOneMon() {
				const theNowMonth = this.getNowMonth();
				request.post('/bill/getTotalBillOneMonth', {
					'month': theNowMonth
				}, {}, false, true, 'form').then(rep => {
					console.log('rep', rep);
					this.$data.balance=rep.data.netIncome;
					this.$data.income = rep.data.totalIncome;
					this.$data.disburse = Math.abs(rep.data.totalExpense);
				})
			},
			getMonthBill() {
				const theNowMonth = this.getNowMonth();
				const data = {
					'month': theNowMonth,
					'pageNo': this.$data.pageNo,
					'pageSize': this.$data.pageSize
				}
				request.post('/bill/getBillByMonth', data, {}, false, true, 'form').then(rep => {
					console.log('rep', rep);
				})
			},
			getNowMonth() {
				const now = new Date();
				const year = now.getFullYear();
				let month = now.getMonth() + 1;
				// 如果月份小于 10，前面加 0
				month = month.toString().padStart(2, '0');
				const theNowMonth = year + '-' + month;
				this.$data.currentMonth = year + '年' + month + '月'
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
	@font-face {
	  font-family: "xiaodoudaoqiurihejianfan"; /* 自定义字体名称 */
	  src: url("../static/font/xiaodoudaoqiurihejianfan.ttf") format("truetype"); /* 字体文件路径 */
	}
	.index-container {
		height: calc(100vh - 60px);
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
		/* height: 100%; */
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
		flex: 8;
		flex-direction: row;
	}

	.statistics-top-left {
		display: flex;
		flex: 6;
		flex-direction: column;
	}

	.statistics-date {
		display: flex;
		flex: 3;
		justify-content: center;
		align-items: center;
		font-size: 14px;
		width: 100%;
	}

	.statistics-date-content {
		display: flex;
		width: 85%;
		height: 100%;
		/* align-items: center; */
		/* background-color: red; */
		flex-direction: column;
		justify-content: flex-end;
	}


	.statistics-expense {
		display: flex;
		flex: 3;
		justify-content: center;
		align-items: center;
	}
	
	.statistics-expense-content {
		display: flex;
		width: 95%;
		height: 100%;
		align-items: center;
		font-family: "xiaodoudaoqiurihejianfan", sans-serif; /* 使用自定义字体 */
		/* background-color: red; */
		font-size: 40px;
		font-weight: bold;
		text-indent: 0;
	}

	.statistics-netIncomeAndIncome {
		display: flex;
		flex: 4;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}
	
	.statistics-netIncomeAndIncome-content {
		width: 85%;
		height: 100%;
		display: flex;
		/* align-items: center; */
		flex-direction: row;
	}
	.statistics-Income-content {
		display: flex;
		flex: 5;
		flex-direction: column;
	}
	.statistics-balance-content {
		display: flex;
		flex: 5;
		flex-direction: column;
		
	}
	.statistics-IncomeAndBlance-title {
		display: flex;
		flex: 3;
		font-size: 12px;
	}
	.statistics-IncomeAndBlance-text {
		display: flex;
		flex: 7;
		font-family: "xiaodoudaoqiurihejianfan", sans-serif; /* 使用自定义字体 */
		font-size: 20px;
	}
	
	.statistics-top-right {
		display: flex;
		flex: 4;
		justify-content: center;
		align-items: center;
	}

	.statistics-bottom {
		display: flex;
		flex: 2;
		background-color: rgb(204,225,255) ;
		 border-radius: 0 0 15px 15px;
	}

	.index-bil-list {
		flex: 7;
		display: flex;
		flex-direction: column;
		/* height: 100%;
		width: 100%;
		margin-bottom: 60px;
		overflow: auto; */
	}

	
</style>