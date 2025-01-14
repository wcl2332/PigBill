// request.js
const BASE_URL = 'http://localhost:7023'; // 你的接口基础地址

/**
 * 获取 Token
 * @returns {string} 返回 Token
 */
const getToken = () => {
	return uni.getStorageSync('token') || ''; // 从本地缓存中获取 Token
};

/**
 * 封装 uni.request 请求
 * @param {Object} options 请求配置
 * @param {string} options.url 请求地址
 * @param {string} [options.method='GET'] 请求方法，默认 GET
 * @param {Object} [options.data={}] 请求参数
 * @param {Object} [options.header={}] 请求头
 * @param {boolean} [options.loading=true] 是否显示加载动画
 * @param {boolean} [options.auth=true] 是否需要携带 Token
 * @param {string} [options.contentType='json'] 请求内容类型，支持 json、form、formData
 * @returns {Promise} 返回 Promise 对象
 */
const request = (options) => {
	// 显示加载动画
	if (options.loading !== false) {
		uni.showLoading({
			title: '加载中...',
			mask: true,
		});
	}

	// 如果需要携带 Token，则添加到请求头
	if (options.auth !== false) {
		const token = getToken();
		console.log('request.js token', token);
		if (token) {
			options.header = {
				...options.header,
				'token': token, // 添加 Token // 添加 Token
			};
		} else {
			// 如果没有 Token，跳转到登录页
			uni.showToast({
				title: '请先登录',
				icon: 'none',
			});
			uni.navigateTo({
				url: '/pages/login/login', // 跳转到登录页
			});
			return Promise.reject('未登录');
		}
	}

	// 根据 contentType 设置请求头
	let contentType = 'application/json'; // 默认 JSON 格式
	if (options.contentType === 'form') {
		contentType = 'application/x-www-form-urlencoded'; // 表单格式
	} else if (options.contentType === 'formData') {
		contentType = 'multipart/form-data'; // 文件上传格式
	}

	// 合并请求头
	options.header = {
		'Content-Type': contentType,
		...options.header, // 合并自定义请求头
	};

	// 返回 Promise 对象
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + options.url, // 拼接完整请求地址
			method: options.method || 'GET', // 默认 GET 请求
			data: options.data || {}, // 请求参数
			header: options.header, // 请求头
			success: (res) => {
				// 请求成功处理
				if (res.statusCode === 200) {
					// 这里可以根据后端返回的数据结构进行调整
					if (res.data.code === 0) {
						resolve(res.data); // 返回成功数据
					} else if (res.data.code === 3001) {
						// Token 过期或无效
						uni.showToast({
							title: '登录已过期，请重新登录',
							icon: 'none',
						});
						uni.navigateTo({
							url: '/pages/login/login', // 跳转到登录页
						});
						reject(res.data);
					} else {
						// 业务逻辑错误处理
						uni.showToast({
							title: res.data.msg || '请求失败',
							icon: 'error',
						});
						reject(res.data);
					}
				} else {
					// HTTP 状态码错误处理
					uni.showToast({
						title: `请求失败，状态码：${res.statusCode}`,
						icon: 'error',
					});
					reject(res);
				}
			},
			fail: (err) => {
				// 网络错误处理
				uni.showToast({
					title: '网络连接失败，请检查网络',
					icon: 'none',
				});
				reject(err);
			},
			complete: () => {
				// 隐藏加载动画
				if (options.loading !== false) {
					uni.hideLoading();
				}
			},
		});
	});
};

/**
 * GET 请求
 * @param {string} url 请求地址
 * @param {Object} [data={}] 请求参数
 * @param {Object} [header={}] 请求头
 * @param {boolean} [loading=true] 是否显示加载动画
 * @param {boolean} [auth=true] 是否需要携带 Token
 * @returns {Promise} 返回 Promise 对象
 */
const get = (url, data = {}, header = {}, loading = true, auth = true) => {
	return request({
		url,
		method: 'GET',
		data,
		header,
		loading,
		auth,
	});
};

/**
 * POST 请求
 * @param {string} url 请求地址
 * @param {Object} [data={}] 请求参数
 * @param {Object} [header={}] 请求头
 * @param {boolean} [loading=true] 是否显示加载动画
 * @param {boolean} [auth=true] 是否需要携带 Token
 * @param {string} [contentType='json'] 请求内容类型，支持 json、form、formData
 * @returns {Promise} 返回 Promise 对象
 */
const post = (url, data = {}, header = {}, loading = true, auth = true, contentType = 'json') => {
	return request({
		url,
		method: 'POST',
		data,
		header,
		loading,
		auth,
		contentType,
	});
};

/**
 * PUT 请求
 * @param {string} url 请求地址
 * @param {Object} [data={}] 请求参数
 * @param {Object} [header={}] 请求头
 * @param {boolean} [loading=true] 是否显示加载动画
 * @param {boolean} [auth=true] 是否需要携带 Token
 * @param {string} [contentType='json'] 请求内容类型，支持 json、form、formData
 * @returns {Promise} 返回 Promise 对象
 */
const put = (url, data = {}, header = {}, loading = true, auth = true, contentType = 'json') => {
	return request({
		url,
		method: 'PUT',
		data,
		header,
		loading,
		auth,
		contentType,
	});
};

/**
 * DELETE 请求
 * @param {string} url 请求地址
 * @param {Object} [data={}] 请求参数
 * @param {Object} [header={}] 请求头
 * @param {boolean} [loading=true] 是否显示加载动画
 * @param {boolean} [auth=true] 是否需要携带 Token
 * @returns {Promise} 返回 Promise 对象
 */
const del = (url, data = {}, header = {}, loading = true, auth = true) => {
	return request({
		url,
		method: 'DELETE',
		data,
		header,
		loading,
		auth,
	});
};

// 导出方法
export default {
	request,
	get,
	post,
	put,
	delete: del, // 避免关键字冲突
};