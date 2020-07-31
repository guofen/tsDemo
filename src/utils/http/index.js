/**
 * axios 网络请求封装1
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';

import signature from './signature';

let _sign_key = '';
let _sign_secret = '';
let _params = {};
let _data = {};
let _header = {};
let _errorHandle = () => {};
let _error_msg = {
    timeoutMsg: '请求超时，请稍后重试',
    noNetworkMsg: '没有网络连接，请检查您的网络设置',
    networkErrorMsg: '服务器开小差了，请稍后重试',
    otherErrorMsg: '服务器开小差了，请稍后重试'
};

const logger = (title, data) => {
    console.group(title);
    console.log(data);
    console.groupEnd();
};
/**
 * 请求接口报错信息，可在httpConfig中配置
 * @param status 状态码 1000，400， 401等
 * @param msg
 * @param response
 * */
const errorHandler = (status, msg, response) => {
    _errorHandle({
        status,
        msg,
        response
    });
};

const returnResponse = (response = {}) => {
    const responseStatus = response.status;
    const responseStatusText = response.statusText;
    const responseData = response.data || {};
    const config = response && response.config || {};
    const api = config.url || '';
    const requestTime = config.requestTime || Date.now();
    const responseTime = Date.now() - requestTime;
    logger(`response ${api}`, {
        api: api,
        responseStatus: responseStatus,
        responseStatusText: responseStatusText,
        responseData: responseData,
        responseTime: responseTime
    });
    let status = responseStatus, msg = responseStatusText, data = responseData;
    if(responseStatus === 200) {
        status = 0;
        if(typeof(responseData) === 'object' && responseData.hasOwnProperty('status')) {
            status = responseData.status;
            msg = responseData.msg || responseData.message;
            data = responseData.data;
        }
    }
    if (status !== 0) {
        errorHandler(status, msg, response);
    }
    return Promise.resolve({
        status,
        data,
        msg,
        message: msg,
    });
};

axios.defaults.headers.common.Accept = 'application/json';

// 请求拦截器
axios.interceptors.request.use((config) => {
    const withoutCheckSign = config.withoutCheckSign || false; // 不需要阿里验签
    if (config.headers.access_token) {
        config.headers.common.Authorization = config.headers.access_token;
    }
    delete config.headers.access_token;
    if (!withoutCheckSign) {
        config.headers['Content-Type'] = 'application/json; charset=UTF-8';
    }
    const _requestConfig = config.hasOwnProperty('__retryCount') || withoutCheckSign ? config : signature(config, _sign_key, _sign_secret);
    logger(`request ${_requestConfig.url}`, {
        api: _requestConfig.url,
        method: _requestConfig.method,
        params: _requestConfig.params,
        data: _requestConfig.data && typeof _requestConfig.data === 'string' ? JSON.parse(_requestConfig.data) : _requestConfig.data,
        requestConfig: _requestConfig
    });
    return _requestConfig;
}, (error) => Promise.reject(error));
// 响应拦截器
axios.interceptors.response.use((response) => returnResponse(response), (error) => {
    const {
        config,
        request,
        response,
        message
    } = error || {};
    const onLine = navigator.onLine;
    // 请求重试
    if (onLine && config && config.retry && config.retry > 0) {
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount < config.retry) {
            config.__retryCount = config.__retryCount + 1;
            if (config.__retryDelayTimeout) {
                clearTimeout(config.__retryDelayTimeout);
            }
            const timeout = new Promise((resolve) => {
                config.__retryDelayTimeout = setTimeout(() => {
                    resolve();
                }, config.retryDelay || 1);
            });
            return timeout.then(() => axios.request(config));
        }
    }

    if (response && onLine) {
        // 请求已经发出，但响应为非200状态
        return returnResponse(response);
    }
    // 请求已经发出，但未收到任何响应。
    // 网络错误、无网络连接...
    let errorMessage = message;
    if (!onLine) {
        errorMessage = _error_msg.noNetworkMsg;
    } else if (message.indexOf('Network Error') !== -1) {
        errorMessage = _error_msg.networkErrorMsg;
    } else if (message.indexOf('timeout') !== -1) {
        errorMessage = _error_msg.timeoutMsg;
    } else {
        errorMessage = _error_msg.otherErrorMsg;
    }
    return returnResponse({
        status: -1000,
        statusText: message,
        config: config,
        request: request,
        data: {
            status: -1000,
            msg: errorMessage
        }
    });
});

/**
 * 配置http请求
 * @param sign_key 阿里验签key
 * @param sign_secret 阿里验签秘钥
 * @param errorHandle 返回错误信息
 * */
export function httpConfig({
    sign_key,
    sign_secret,
    errorHandle = () => {},
    errorMsg = {}
}) {
    _sign_key = sign_key;
    _sign_secret = sign_secret;
    _errorHandle = errorHandle;
    _error_msg = {
        ..._error_msg,
        ...errorMsg
    };
}

/**
 * 配置http请求的参数
 * @param params 已GET和HEAD请求
 * @param data 已POST和PUT请求
 * */
export function httpParamsDataConfig({
    params = {},
    data = {}
}) {
    _params = {
        ..._params,
        ...params
    };
    _data = {
        ...data,
        ...data
    };
}

/**
 * 配置http header请求的参数配置
 * */
export function httpHeaderConfig(header = {}) {
    _header = {
        ..._header,
        ...header
    };
}

/**
 * @param host
 * @param uri
 * @param params 已GET和HEAD请求
 * @param data 已POST和PUT请求
 * @param method
 * @param headers.access_token
 * @param options.withoutCheckSign 是否不需要阿里验签， 默认 false
 * @param options.timeout 超时时间， 默认 10 * 1000
 * @param options.retry 请求失败自动重试次数， 默认 3
 * @param options.retryDelay 重试间隔， 默认 2000
 * @param options.withoutStoreID 不需要店铺ID，默认 false
 * */
export function request({
    host,
    uri,
    params = {},
    data = {},
    headers = {},
    method = 'GET',
    options = {}
}) {
    const url = host + uri;
    if (url.indexOf('http') !== 0) {
        throw new Error(`非法请求: ${url}`);
    }
    const defaultOptions = {
        withoutCheckSign: false,
        withoutStoreID: false,
        timeout: 10 * 1000,
        retry: 3,
        retryDelay: 2000,
    };
    const defaultHeaders = {

    };

    // body参数处理
    let bodyData;
    if(data instanceof FormData) {
        bodyData = data;
        defaultOptions.withoutCheckSign = true;
    } else {
        bodyData = JSON.stringify({
            ...data,
            ..._data
        });
    }
    const config = {
        ...defaultOptions,
        ...options,
        url: url,
        headers: {
            ...defaultHeaders,
            ..._header,
            ...headers
        },
        method: method,
        params: {
            ..._params,
            ...params,
        },
        data: bodyData,
        requestTime: Date.now(),
    };
    // argus参数处理
    for (const key in config.params) {
        if (config.params.hasOwnProperty(key)) {
            const value = config.params[key];
            if (value === undefined || value === null || value === '') {
                delete config.params[key];
            }
        }
    }
    // if(!config.withoutStoreID && config.params.store_id) {
    //     return Promise.resolve({status: -1, msg: '请求失败'});
    // }

    return axios.request(config);
}
export default request;
// window.request = request;
// window.requestConfig = {
//     httpConfig,
//     httpParamsDataConfig,
//     httpHeaderConfig,
// };
