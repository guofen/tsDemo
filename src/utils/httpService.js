import axios from 'axios'

// let baseUrl = 'http://localhost:13529';
// let baseUrl = 'http://dev.eldereal.me:13529'

let baseUrl = 'https://www.baisushuo.com/platform-api/wechat';
// https://www.baisushuo.com/platform-api/wechat/api/feed/followFeed?start=0&refreshType=1&pageSize=10
const httpService = axios.create({
  baseURL: baseUrl,
  timeout: 120000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyMDY4NDM2MzE3MzA1ODQzMjEiLCJpYXQiOjE1OTYxNjE4MzAsImV4cCI6MTU5Njc2NjYzMH0.VbpYB_tyqiIcBOCE7QNpuef2Ufqvs4b20hgpHthUvmVHjPrgjZIKYjR4nJ6iXotFBSz8jZ3ZfPclP_TWLLU6Ww',
  }
})

// request拦截器
httpService.interceptors.request.use(config => {
  return config
}, error => {
  console.log(error);
  return Promise.reject(error)
})

// respone拦截器
httpService.interceptors.response.use(
  response => {
    //console.log(response.config.url + '接口的返回',response)
    //console.log('arguments',arguments)
    if(response && response.data && response.data.code === 0){
      return response.data
    }else{
      console.log('/utils/httpService.js',response)
    }
  },
  error => {
    //请求超时
    return Promise.reject(error)
  }
)

export default httpService
