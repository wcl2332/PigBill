<template>
	<view class="index-container">
		<view class="user-header">
			<view class="header-content">
				<text class="month-title">
					<text class="month-title" style="font-family: 'xiaodoudaoqiurihejianfan', sans-serif; font-size: 35px; font-weight: 500;">小猪记账</text>
				</text>
				<view class="avatar-group">
					<view class="avatar-wrapper" :class="{'active': activeUser === 'self'}" @click="switchUser('self')">
						<image class="user-avatar" :src="userInfo.avatar || '../../static/image/default-avatar.png'" />
						<text class="user-name">{{userInfo.name || '我'}}</text>
					</view>
					<view v-if="partnerInfo" class="partner-divider">|</view>
					<view v-if="partnerInfo" class="avatar-wrapper" :class="{'active': activeUser === 'partner'}"
						@click="switchUser('partner')">
						<image class="user-avatar"
							:src="partnerInfo.avatar || '../../static/image/default-avatar.png'" />
						<text class="user-name">{{partnerInfo.name || '伴侣'}}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 		<view class="index-title">
			<view class="user-switcher">
				<image class="user-avatar" :class="{'active-user': activeUser === 'self'}"
					:src="userInfo.avatar || '../../static/image/default-avatar.jpg'" @click="switchUser('self')" />
				<image v-if="partnerInfo" class="user-avatar" :class="{'active-user': activeUser === 'partner'}"
					:src="partnerInfo.avatar || '../../static/image/default-avatar.jpg'"
					@click="switchUser('partner')" />
			</view>
		</view> -->
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
		<view class="index-bill-list">
			<view class="bill-list-content" v-for="(records,date) in billListByDate" :key="date">
				<view class="bill-list-content-title">
					<text>{{date}}</text>
				</view>
				<view class="bill-list-content-info">
					<view class="bill-list-content-item" v-for="bill in records" :key="bill.id">
						<view class="bill-list-item-icon">
							<!-- <uni-icons  custom-prefix="iconfont" type="icon-_xican" size="30px"></uni-icons> -->
							<text :class="[bill.billCategory.icon]"></text>
						</view>
						<view class="bill-list-item-info">
							<view class="list-item-info-top">
								<text>{{ bill.billCategory.categoryName }}</text>
							</view>
							<view class="list-item-info-bottom">
								<text>{{ bill.billTag.tagName }}</text>&nbsp;&nbsp;&nbsp;<text>{{ bill.remark }}</text>
							</view>
						</view>
						<view class="bill-list-item-amount">
							<text>￥{{ bill.amount }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-fab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" @fabClick="fabClick">
		</uni-fab>
	</view>
</template>

<script>
	import request from '@/utils/requst.js';
	export default {
		onShow() {
			this.fetchUserInfo();
			//获取当前月份的总支出等
			this.billToatlOneMon();
			this.getMonthBill();
		},
		data() {
			return {
				// 新增用户相关数据
				userInfo: {},
				partnerInfo: null,
				activeUser: 'self',
				currentUserId: '',

				vertical: 'bottom',
				horizontal: 'right',
				pattern: {
					buttonColor: '#007AFF',
				},
				pageNo: 1,
				pageSize: 50,
				currentMonth: '',
				disburse: 0.00,
				income: 0.00,
				balance: 0.00,
				billListByDate: {}
			}
		},
		methods: {
			// 新增用户切换方法
			switchUser(type) {
				this.activeUser = type;
				const userId = type === 'self' ? this.userInfo.id : this.partnerInfo?.id;
				if (userId) {
					this.currentUserId = userId;
					this.billToatlOneMon();
					this.getMonthBill();
				}
			},

			// 新增获取用户信息方法
			async fetchUserInfo() {
				// try {
				// 	const res = await request.get('/user/getCurrentUser');
				// 	this.userInfo = res.data;
				// 	this.currentUserId = res.data.id;

				// 	if (res.data.partnerId) {
				// 		const partnerRes = await request.get(`/user/getUserById?id=${res.data.partnerId}`);
				// 		this.partnerInfo = partnerRes.data;
				// 	}
				// } catch (error) {
				// 	console.error('获取用户信息失败:', error);
				// }
				// 模拟用户数据
				this.userInfo = {
					id: 1001,
					name: "用户",
					avatar: "../../static/image/default-avatar.jpg",
					partnerId: 1002
				};

				// 模拟伴侣数据
				this.partnerInfo = {
					id: 1002,
					name: "伴侣",
					avatar: "../../static/image/default-avatar.jpg"
				};

				this.currentUserId = this.userInfo.id;
			},


			billToatlOneMon() {
				const theNowMonth = this.getNowMonth();
				request.post('/bill/getTotalBillOneMonth', {
					'month': theNowMonth,
					'userId': this.currentUserId
				}, {}, false, true, 'form').then(rep => {
					console.log('rep', rep);
					this.$data.balance = rep.data.netIncome;
					this.$data.income = rep.data.totalIncome;
					this.$data.disburse = Math.abs(rep.data.totalExpense);
				})
			},
			getMonthBill() {
				const theNowMonth = this.getNowMonth();
				const data = {
					'month': theNowMonth,
					'pageNo': this.$data.pageNo,
					'pageSize': this.$data.pageSize,
					'userId': this.currentUserId
				}
				request.post('/bill/getBillByMonth', data, {}, false, true, 'form').then(rep => {
					this.$data.billListByDate = rep.data.records.reduce((result, record) => {
						const date = record.date;
						// 如果日期不存在，初始化一个空数组
						if (!result[date]) {
							result[date] = [];
						}
						// 将当前记录添加到对应日期的数组中
						result[date].push(record);
						return result;
					}, {});
				})
				console.log('billListByDate', this.$data.billListByDate)
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
				uni.navigateTo({
					url: '../pages/addBill/addBill'
				})
			},
		},
		onReachBottom() {
			console.log('已经滑动到底部')
		}
	}
</script>

<style scoped>
	@import "@/static/iconfont-webapp-icon.css";

	@font-face {
		font-family: "xiaodoudaoqiurihejianfan";
		/* 自定义字体名称 */
		src: url("../static/font/xiaodoudaoqiurihejianfan.ttf") format("truetype");
		/* 字体文件路径 */
	}


	/* 头部样式 */
	.user-header {
		padding: 15px 20px;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		margin-bottom: 20px;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.month-title {
		font-size: 18px;
		color: #2c3e50;
		font-weight: 500;
		letter-spacing: 0.5px;
	}

	.avatar-group {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.avatar-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 6px;
		border-radius: 12px;
		transition: all 0.25s ease;
		position: relative;
	}

	.avatar-wrapper.active {
		background: rgba(0, 122, 255, 0.1);
	}

	.avatar-wrapper.active::after {
		content: "";
		position: absolute;
		bottom: -8px;
		width: 60%;
		height: 2px;
		background: #007AFF;
		border-radius: 2px;
	}

	.user-avatar {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		margin-bottom: 4px;
		border: 1.5px solid #fff;
	}

	.user-name {
		font-size: 12px;
		color: #7f8c8d;
		letter-spacing: 0.3px;
	}

	.avatar-wrapper.active .user-name {
		color: #007AFF;
		font-weight: 500;
	}

	.partner-divider {
		color: #bdc3c7;
		font-weight: 300;
		transform: scale(0.8);
	}






	.index-container {
		height: calc(100vh - 60px);
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: rgb(244, 244, 244);
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
		/* background-color: rgb(242, 246, 255); */
		background-color: white;
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
		font-family: "xiaodoudaoqiurihejianfan", sans-serif;
		/* 使用自定义字体 */
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
		font-family: "xiaodoudaoqiurihejianfan", sans-serif;
		/* 使用自定义字体 */
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
		background-color: rgb(204, 225, 255);
		border-radius: 0 0 15px 15px;
	}

	.index-bill-list {
		flex: 7;
		display: flex;
		flex-direction: column;
		/* overflow: hidden; */
		/* justify-content: center; */
		align-items: center;
		padding-top: 20px;
		overflow: scroll;
		padding-bottom: 20px;
	}

	.bill-list-content {
		width: 90%;
		/* height: 100%; */
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}

	.bill-list-content-title {
		height: 30px;
		width: 100%;
		/* border: 1px solid red; */
		display: flex;
		align-items: center;
		font-size: 16px;
		color: rgb(159, 159, 159);
		padding-left: 5px;
		font-family: "xiaodoudaoqiurihejianfan", sans-serif;
		font-weight: bold;
	}

	.bill-list-content-info {
		width: 100%;
		/* border: 1px solid red; */
		border-radius: 15px;
		background-color: rgb(255, 255, 255);
		justify-items: center;
		align-items: center;
	}

	.bill-list-content-item {
		height: 70px;
		display: flex;
		/* background-color: red; */
		width: 95%;
		/* margin-bottom: 10px; */
		border-bottom: 0.5px solid rgb(244, 244, 244);
	}

	.bill-list-content-item:last-child {
		border-bottom: none;
	}

	.bill-list-item-icon {
		display: flex;
		flex: 1;
		justify-content: center;
		align-items: center;
	}

	.bill-list-item-info {
		display: flex;
		flex: 6;
		flex-direction: column;
	}

	.list-item-info-top {
		display: flex;
		flex: 6;
		align-items: center;
		font-size: 20px;
		padding-left: 10px;
		font-weight: bold;
		/* font-family: "xiaodoudaoqiurihejianfan", sans-serif; */
	}

	.list-item-info-bottom {
		display: flex;
		flex: 4;
		padding-left: 10px;
		color: rgb(150, 150, 150);
		font-size: 13px;
		/* justify-content: center; */
		align-items: center;
	}

	.bill-list-item-amount {
		display: flex;
		flex: 3;
		justify-content: center;
		align-items: center;
		font-family: "xiaodoudaoqiurihejianfan", sans-serif;
		font-size: 22px;
		font-weight: bold;
	}



	/* 新增用户切换样式 */
	/* 	.user-switcher {
		display: flex;
		align-items: center;
		padding: 10px 15px;
		gap: 15px;
	}

	.user-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 2px solid #fff;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}

	.user-avatar.active-user {
		border: 2px solid #007AFF;
		transform: scale(1.1);
	} */
</style>