import httpService from '../../utils/httpService';
import queryString from 'querystring';

export function getSearchListCall() {
    return httpService({
        url: '/v1.0/api/searchList/call',
        method: 'get',
    })
}

export function getdemo(){
    return httpService({
        url:'/api/feed/followFeed?start=0&refreshType=1&pageSize=10',
        method:'get'
    })
}

export function search(){
    return httpService({
        url:'/api/search/searchAgent',
        method:'post',
        data:{"keyword":"","cityName":"北京市","start":0,"pageSize":10}
    })
}