// request.js
const BASE_URL = 'https://localhost:7023'; // 你的接口基础地址

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
    if (token) {
      options.header = {
        ...options.header,
        token: `${token}`, // 添加 Token
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

  // 返回 Promise 对象
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url, // 拼接完整请求地址
      method: options.method || 'GET', // 默认 GET 请求
      data: options.data || {}, // 请求参数
      header: {
        'Content-Type': 'application/json', // 默认请求头
        ...options.header, // 合并自定义请求头
      },
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
              title: res.data.message || '请求失败',
              icon: 'none',
            });
            reject(res.data);
          }
        } else {
          // HTTP 状态码错误处理
          uni.showToast({
            title: `请求失败，状态码：${res.statusCode}`,
            icon: 'none',
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
 * @returns {Promise} 返回 Promise 对象
 */
const post = (url, data = {}, header = {}, loading = true, auth = true) => {
  return request({
    url,
    method: 'POST',
    data,
    header,
    loading,
    auth,
  });
};

/**
 * PUT 请求
 * @param {string} url 请求地址
 * @param {Object} [data={}] 请求参数
 * @param {Object} [header={}] 请求头
 * @param {boolean} [loading=true] 是否显示加载动画
 * @param {boolean} [auth=true] 是否需要携带 Token
 * @returns {Promise} 返回 Promise 对象
 */
const put = (url, data = {}, header = {}, loading = true, auth = true) => {
  return request({
    url,
    method: 'PUT',
    data,
    header,
    loading,
    auth,
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