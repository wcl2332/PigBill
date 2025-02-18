<template>
	<view class="add-bill-container">
		<view class="form-container">
			<!-- 金额输入 -->
			<view class="form-item">
				<text class="form-label">金额</text>
				<input v-model="form.amount" class="amount-input" :class="form.type" type="number" placeholder="0.00"
					placeholder-class="placeholder-style" focus @input="handleAmountInput" />
			</view>

			<!-- 类型选择 -->
			<view class="type-selector">
				<view class="type-item" :class="{ active: form.type === 'expense' }"
					@click="handleTypeChange('expense')">
					支出
				</view>
				<view class="type-item" :class="{ active: form.type === 'income' }" @click="handleTypeChange('income')">
					收入
				</view>
			</view>

			<!-- 修改后的分类选择部分 -->
			<view class="form-item column-layout">
				<text class="form-label">分类</text>
				<view class="category-list">
					<!-- 分类列表 -->
					<view v-for="item in filterCategories" :key="item.id" class="category-item"
						:class="{ active: form.categoryId === item.id }" @click="handleCategorySelect(item.id)">
						<uni-icons :type="item.icon" size="24"
							:color="form.categoryId === item.id ? '#fff' : '#666'"></uni-icons>
						<text class="category-name">{{ item.categoryName }}</text>
					</view>

					<!-- 新增分类按钮 -->
					<view class="category-item add-btn" @click="handleAddCategory">
						<uni-icons type="plusempty" size="24" color="#09BE4F"></uni-icons>
						<text class="category-name">新增分类</text>
					</view>
				</view>
			</view>

			<!-- 修改后的标签选择部分 -->
			<view class="form-item column-layout">
				<text class="form-label">标签</text>
				<view class="tag-list">
					<!-- 标签列表 -->
					<view v-for="tag in filterTags" :key="tag.id" class="tag-item"
						:class="{ active: form.tagId === tag.id }" @click="handleTagSelect(tag.id)">
						{{ tag.tagName }}
					</view>

					<!-- 新增标签按钮 -->
					<view class="tag-item add-btn" @click="handleAddTag">
						<uni-icons type="plusempty" size="16" color="#09BE4F"></uni-icons>
						<text>新增标签</text>
					</view>
				</view>
			</view>

			<!-- 日期选择 -->
			<view class="form-item date-picker">
				<text class="form-label">日期</text>
				<view class="date-selector" @click="openCalendar">
					<uni-icons type="calendar" size="18" color="#666"></uni-icons>
					<text class="date-text">{{ formatDate(form.date) }}</text>
				</view>
				<uni-calendar ref="calendar" :insert="false" @confirm="handleDateConfirm" :date="form.date" />
			</view>

			<!-- 备注输入 -->
			<view class="form-item">
				<text class="form-label">备注</text>
				<input v-model="form.remark" class="remark-input" placeholder="选填内容"
					placeholder-class="placeholder-style" />
			</view>

			<!-- 提交按钮 -->
			<button class="submit-btn" @click="handleSubmit">提交账单</button>
		</view>

		<!-- 加载状态 -->
		<!-- <view v-if="loading" class="loading-mask"> -->
		<!-- <uni-loading></uni-loading> -->
		<!-- </view> -->
	</view>


	<!-- 在模板最后添加弹窗组件 -->
	<uni-popup ref="dialog" type="dialog">
		<view class="dialog-content">
			<text class="dialog-title">{{ dialogConfig.title }}</text>

			<!-- 动态表单 -->
			<input v-if="dialogConfig.type === 'tag'" v-model="tempData.name" placeholder="请输入标签名称"
				class="input-field" />

			<template v-if="dialogConfig.type === 'category'">
				<input v-model="tempData.name" placeholder="请输入分类名称" class="input-field" />
				<view class="icon-picker">
					<text class="sub-title">选择图标：</text>
					<picker @change="handleIconChange" :value="iconIndex" :range="iconOptions">
						<view class="picker-item">
							<uni-icons :type="tempData.icon" size="28"></uni-icons>
							{{ tempData.icon }}
						</view>
					</picker>
				</view>
				<!-- <view class="color-picker">
					<text class="sub-title">选择颜色：</text>
					<view v-for="color in colorOptions" :key="color" class="color-item"
						:style="{backgroundColor: color}" @click="tempData.color = color">
						<uni-icons v-if="tempData.color === color" type="checkmarkempty" color="#fff"></uni-icons>
					</view>
				</view> -->
			</template>

			<view class="dialog-btns">
				<button class="btn cancel" @click="closeDialog">取消</button>
				<button class="btn confirm" @click="handleConfirm">确定</button>
			</view>
		</view>
	</uni-popup>
</template>

<script>
	import request from '@/utils/requst.js'
	import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'
	import uniCalendar from '@dcloudio/uni-ui/lib/uni-calendar/uni-calendar.vue'
	import {
		mockCategories,
		mockTags
	} from '@/mockData.js'
	import {
		formatDate
	} from '@/utils/date.js'

	export default {
		components: {
			uniIcons,
			uniCalendar
		},
		data() {
			return {
				loading: false,
				showCalendar: false,
				form: {
					amount: '',
					type: 'expense',
					categoryId: '',
					tagId: '',
					date: this.getCurrentDate(),
					remark: ''
				},
				categories: [],
				tags: [],
				dialogConfig: {
					visible: false,
					title: '',
					type: '' // 'category' 或 'tag'
				},
				tempData: {
					name: '',
					icon: 'help',
					color: '#cccccc'
				},
				iconOptions: ['shop', 'car', 'cart', 'home', 'medal', 'moneybags', 'staff'],
				colorOptions: ['#FF6B6B', '#4D8AF0', '#FFA940', '#5CDBD3', '#73D13D', '#FFC53D', '#597EF7']
			}
		},
		computed: {
			filterCategories() {
				return this.categories.filter(item => item.type === this.form.type)
			},
			filterTags() {
				return this.tags.filter(item => item.categoryId === this.form.categoryId)
			}
		},
		async onLoad() {
			try {
				//this.loading = true
				await this.loadCategories()
				await this.loadTags()
			} catch (e) {
				console.error('初始化失败:', e)
				uni.showToast({
					title: '数据加载失败',
					icon: 'none'
				})
			} finally {
				//this.loading = false
			}
		},
		methods: {
			async loadCategories() {
				await new Promise(resolve => setTimeout(resolve, 300))
				this.categories = mockCategories
				// 设置默认选中第一个分类
				if (this.filterCategories.length) {
					this.form.categoryId = this.filterCategories[0].id
				}
			},
			async loadTags() {
				await new Promise(resolve => setTimeout(resolve, 300))
				this.tags = mockTags
			},

			openCalendar() {
				this.$refs.calendar.open();
			},

			handleTypeChange(type) {
				this.form.type = type
				this.form.categoryId = this.filterCategories[0]?.id || ''
				this.form.tagId = this.filterTags[0]?.id || ''
			},

			handleCategorySelect(categoryId) {
				this.form.categoryId = categoryId
				// 自动选择第一个标签
				if (this.filterTags.length) {
					this.form.tagId = this.filterTags[0].id
				}
			},

			handleTagSelect(tagId) {
				this.form.tagId = tagId
			},

			handleDateConfirm(e) {
				this.form.date = e.fulldate
			},

			getCurrentDate() {
				return formatDate(new Date(), 'YYYY-MM-DD')
			},

			formatDate(date) {
				return formatDate(date)
			},

			handleAmountInput(e) {
				let value = e.detail.value
				value = value.replace(/[^0-9.]/g, '')
				const parts = value.split('.')
				if (parts.length > 1) {
					value = `${parts[0]}.${parts[1].slice(0, 2)}`
				}
				this.form.amount = value
			},

			validateForm() {
				if (!this.form.amount || parseFloat(this.form.amount) <= 0) {
					uni.showToast({
						title: '请输入有效金额',
						icon: 'none'
					})
					return false
				}
				if (!this.form.categoryId) {
					uni.showToast({
						title: '请选择分类',
						icon: 'none'
					})
					return false
				}
				return true
			},

			async handleSubmit() {
				if (!this.validateForm()) return

				try {
					//this.loading = true
					uni.showLoading({
						title: '提交中...'
					})

					// 模拟提交
					await new Promise(resolve => setTimeout(resolve, 1500))

					uni.showToast({
						title: '添加成功'
					})
					setTimeout(() => uni.navigateBack(), 1500)
				} catch (error) {
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					})
				} finally {
					//this.loading = false
					uni.hideLoading()
				}
			},
			// 打开分类弹窗
			handleAddCategory() {
				this.dialogConfig = {
					title: '新建分类',
					type: 'category'
				}
				this.tempData = {
					name: '',
					icon: 'help',
					color: '#cccccc'
				}
				this.$refs.dialog.open()
			},

			// 打开标签弹窗
			handleAddTag() {
				this.dialogConfig = {
					title: '新建标签',
					type: 'tag'
				}
				this.tempData = {
					name: ''
				}
				this.$refs.dialog.open()
			},

			// 图标选择
			handleIconChange(e) {
				this.tempData.icon = this.iconOptions[e.detail.value]
			},

			// 确认提交
			async handleConfirm() {
				if (!this.validateForm()) return

				try {
					if (this.dialogConfig.type === 'category') {
						const newCategory = this.createCategory()
						this.categories.push(newCategory)
						this.form.categoryId = newCategory.id // 自动选中新建分类
					} else {
						const newTag = this.createTag()
						this.tags.push(newTag)
						this.form.tagId = newTag.id // 自动选中新建标签
					}
					this.$refs.dialog.close()
				} catch (error) {
					uni.showToast({
						title: '创建失败',
						icon: 'none'
					})
				}
			},

			// 表单验证
			validateForm() {
				if (!this.tempData.name.trim()) {
					uni.showToast({
						title: '名称不能为空',
						icon: 'none'
					})
					return false
				}
				if (this.dialogConfig.type === 'category' && !this.tempData.color) {
					uni.showToast({
						title: '请选择颜色',
						icon: 'none'
					})
					return false
				}
				return true
			},

			// 创建分类数据
			createCategory() {
				return {
					id: Date.now(),
					categoryName: this.tempData.name,
					type: this.form.type,
					icon: this.tempData.icon,
					color: this.tempData.color
				}
			},

			// 创建标签数据
			createTag() {
				return {
					id: Date.now(),
					tagName: this.tempData.name,
					categoryId: this.form.categoryId
				}
			},

			closeDialog() {
				this.$refs.dialog.close()
			}
		}
	}
</script>

<style lang="scss">
	.add-bill-container {
		background-color: #f5f5f5;
		height: 100vh;
	}

	.form-container {
		background: white;
		border-radius: 12px;
		padding: 15px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
	}

	.form-item {
		padding: 15px 0;
		border-bottom: 1px solid #eee;
		display: flex;
		align-items: center;
		justify-content: space-between;

		&.column-layout {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	.type-selector {
		display: flex;
		margin: 20px 0;
		border-radius: 8px;
		overflow: hidden;
		background: #f8f8f8;

		.type-item {
			flex: 1;
			padding: 14px;
			font-size: 16px;
			transition: all 0.3s;
			position: relative;
			cursor: pointer;

			&.active {
				background: #007AFF;
				color: white;
			}
		}
	}

	/* 修改后的样式 */
	.category-list,
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		/* 项间距 */
		width: 100%;
		margin-top: 10px;

		.category-item,
		.tag-item {
			flex: none;
			padding: 8px 15px;
			border-radius: 20px;
			background: #f8f8f8;
			transition: all 0.3s;
			cursor: pointer;

			/* 分类项特定样式 */
			&.category-item {
				display: flex;
				align-items: center;
			}

			&.active {
				background: #007AFF;
				color: white;
			}
		}

		.category-name {
			margin-left: 8px;
			font-size: 14px;
		}

		.tag-item {
			font-size: 14px;
		}


		.add-btn {
			background: #f8f8f8;
			border: 1px dashed #000000;
			box-sizing: border-box;

			&:active {
				background: #e8fae8;
			}

			text,
			.category-name {
				color: #000000 !important;
			}
		}
	}

	.date-selector {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 8px 0;
		cursor: pointer;

		.date-text {
			margin: 0 10px;
			color: #333;
		}
	}

	.submit-btn {
		margin-top: 40px;
		background: #007AFF;
		color: white;
		border-radius: 25px;
		height: 50px;
		font-size: 16px;
	}

	.loading-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.dialog-content {
		background: white;
		padding: 25px;
		border-radius: 12px;
		width: 80vw;
	}

	.dialog-title {
		font-size: 18px;
		font-weight: 500;
		margin-bottom: 20px;
		display: block;
		text-align: center;
	}

	.input-field {
		width: 100%;
		height: 40px;
		border: 1px solid #eee;
		border-radius: 8px;
		padding: 0 10px;
		margin-bottom: 15px;
	}

	.sub-title {
		color: #666;
		font-size: 14px;
		margin: 10px 0;
	}

	.icon-picker {
		.picker-item {
			display: flex;
			align-items: center;
			padding: 8px;
			border: 1px solid #eee;
			border-radius: 8px;
		}
	}

	.color-picker {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin: 10px 0;

		.color-item {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
		}
	}

	.dialog-btns {
		display: flex;
		gap: 15px;
		margin-top: 20px;

		.btn {
			flex: 1;
			height: 40px;
			line-height: 40px;
			border-radius: 20px;
			font-size: 14px;

			&.cancel {
				background: #f8f8f8;
				color: #666;
			}

			&.confirm {
				background: #08B9FF;
				color: white;
			}
		}
	}
</style>