import request from '../../utils/http/index';
import Config from '../../utils/http/Config';
import queryString from 'querystring';
/**
 * 订单列表
 * @method GET
 * @param {string} store_id
 * @param {string} page_size
 * @param {string} page_index
 * */
export async function get_order_list(params) {
    return request({
        // host:Config.E_COM_API,
        host:'https://weshop-capi-sit.ykbenefit.com',
        // host:'http://10.30.0.134:49204',
        uri:'/orders/get_order_list',
        params,
    });
}
/**
 * 订单详情
 * @method GET
 * @param {string} store_id
 * @param {string} customer_id
 * @param {string} order_id
 * */
export async function getOrderInfo(params) {
    return request({
        host:Config.API_GATEWAY_IP,
        // host:'http://10.30.0.134:49204',
        // host: 'http://10.30.0.62:49204',
        uri:'/orders/get_order_info',
        params,
    });
}

export async function getCurrentSelectAddress() {
    return request({
        host:Config.API_GATEWAY_IP,
        // host:'http://10.30.0.134:49204',
        uri:'/addresses/get_order_selected_address',
    });
}

