// function initConfig() {
    const domain = document.domain.toLowerCase();
    let RUN_ENV = 'sit'; // local dev sit uat prod
    if (domain.indexOf('dev') !== -1) {
        RUN_ENV = 'dev';
    } else if (domain.indexOf('sit') !== -1) {
        RUN_ENV = 'sit';
    } else if (domain.indexOf('mysuiyun.com') !== -1 || domain.indexOf('wheatbuy.shop') !== -1) {
        RUN_ENV = 'prod';
    }

    let WEB_IP = '';
    let API_GATEWAY_IP = window.run_country === 'cn' ? 'https://weshop-capi-dev.ykbenefit.com' : 'https://weshop-capi-dev-us.ykbenefit.com';
    let STATIC_FILE_IP = '';
    let SIGN_KEY = window.run_country === 'cn' ? '203780229' : '203795967';
    let SIGN_SECRET = window.run_country === 'cn' ? 'p5941p4ckhqmu3bwxtu15la7yw92pwtc' : 'o7123jai77fo1kaye0dshay4irlz8002';
    let WX_APP_ID = window.run_country === 'cn' ? 'wxca639e6511ff5994' : 'wxd20e1ce4bde0f278';
    let COMMON_CDN_IP = 'https://cdn-source-dev.ykbenefit.com'; // 商品、文章CDN请求地址,非线上环境使用接口网关地址
    let COUNTLY_IP = 'https://behavior-tracker-dev.ykbenefit.com';
    let COUNTLY_APP_KEY = 'cd154de2393b8db3920b9f3b2c4a32038810e077';
    let UPLOAD_API_IP = window.run_country === 'cn' ? 'https://cfs-center-dev.ykbenefit.com' : 'https://cfs-center-dev-us.ykbenefit.com'; // 文件上传

     // mock地址
     const mock_ip = 'http://yapi.ykbenefit.com/mock';
     const CLAW_API =  mock_ip + '/27';
     const E_COM_API = mock_ip + '/29';
     const ACEO_API = mock_ip + '/19';
     const CORN_API = mock_ip + '/31';

    // // 本地调试sit环境，将下列注释代码放开即可
    API_GATEWAY_IP = window.run_country === 'cn' ? 'https://weshop-capi-sit.ykbenefit.com' : 'https://weshop-capi-sit-us.ykbenefit.com';
    SIGN_KEY = window.run_country === 'cn' ? '203786453' : '203795971';
    SIGN_SECRET = window.run_country === 'cn' ? 'zybk0anglmgeko422ys1pbki9458kel2' : 'xp0w0jj4mdomixoqyvtzjklpu0s2nns7';
    COMMON_CDN_IP = 'https://cdn-source-sit.ykbenefit.com';
    API_GATEWAY_IP = 'http://10.10.0.26:5000';
    /**
     * 以下内容严禁私自修改
     * */
    const uriImgSuffix = function (w = 0, h = 0, q = 100) {
        return w === 0 && h === 0 ? '' : `?x-oss-process=image/resize,m_lfit,${w ? 'w_' + parseInt(w, 10) + ',' : ''}${h ? 'h_' + parseInt(h, 10) + ',' : ''}limit_0/auto-orient,1/quality,q_${q}`;
    };
    if (RUN_ENV === 'dev') {
        WEB_IP = window.run_country === 'cn' ? 'https://corn-customer-web-dev.ykbenefit.com' : 'https://corn-customer-web-us-dev.ykbenefit.com';
        STATIC_FILE_IP = window.run_country === 'cn' ? 'https://corn-static-web-dev.ykbenefit.com' : 'https://corn-static-web-us-dev.ykbenefit.com';
        API_GATEWAY_IP = window.run_country === 'cn' ? 'https://weshop-capi-dev.ykbenefit.com' : 'https://weshop-capi-dev-us.ykbenefit.com';
        SIGN_KEY = window.run_country === 'cn' ? '203780229' : '203795967';
        SIGN_SECRET = window.run_country === 'cn' ? 'p5941p4ckhqmu3bwxtu15la7yw92pwtc' : 'o7123jai77fo1kaye0dshay4irlz8002';
        COMMON_CDN_IP = 'https://cdn-source-dev.ykbenefit.com';
    } else if (RUN_ENV === 'sit') {
        WEB_IP = window.run_country === 'cn' ? 'https://corn-customer-web-sit.ykbenefit.com' : 'https://corn-customer-web-us-sit.ykbenefit.com';
        STATIC_FILE_IP = window.run_country === 'cn' ? 'https://corn-static-web-sit.ykbenefit.com' : 'https://corn-static-web-us-sit.ykbenefit.com';
        API_GATEWAY_IP = window.run_country === 'cn' ? 'https://weshop-capi-sit.ykbenefit.com' : 'https://weshop-capi-sit-us.ykbenefit.com';
        UPLOAD_API_IP = window.run_country === 'cn' ? 'https://cfs-center-sit.ykbenefit.com' : 'https://cfs-center-sit-us.ykbenefit.com';
        SIGN_KEY = window.run_country === 'cn' ? '203786453' : '203795971';
        SIGN_SECRET = window.run_country === 'cn' ? 'zybk0anglmgeko422ys1pbki9458kel2' : 'xp0w0jj4mdomixoqyvtzjklpu0s2nns7';
        COMMON_CDN_IP = 'https://cdn-source-sit.ykbenefit.com';
    } else if (RUN_ENV === 'prod') {
        WEB_IP = window.run_country === 'cn' ? 'https://cweb1.mysuiyun.com' : 'https://cweb1.wheatbuy.shop';
        STATIC_FILE_IP = `https://${window.run_country}-static-cdn.yhkfile.com`;
        API_GATEWAY_IP = window.run_country === 'cn' ? 'https://capi1.mysuiyun.com' : 'https://capi1.wheatbuy.shop';
        UPLOAD_API_IP = window.run_country === 'cn' ? 'https://cfs.mysuiyun.com' : 'https://cfs.wheatbuy.shop';
        COMMON_CDN_IP = `https://${window.run_country}-cdn.yhkfile.com`;
        WX_APP_ID = window.run_country === 'cn' ? 'wxe7a9ab4237cd03db' : 'wx7a2a6a906dd9a4e6';
        SIGN_KEY = window.run_country === 'cn' ? '203796825' : '203796833';
        SIGN_SECRET = window.run_country === 'cn' ? 'leq2m9b4kjhfqpofj4y8eveh4bjxkn7l' : 'ay789z38ldqpku4s5cd6t2od772gv3ab';
        COUNTLY_IP = '';
        COUNTLY_APP_KEY = '';
    }
const Config = {
        RUN_ENV: RUN_ENV,
        WEB_IP: WEB_IP,
        API_GATEWAY_IP: API_GATEWAY_IP,
        COMMON_CDN_IP: COMMON_CDN_IP || API_GATEWAY_IP, // 商品、文章CDN请求地址,非线上环境使用接口网关地址
        STATIC_FILE_IP: STATIC_FILE_IP,
        SIGN_KEY: SIGN_KEY,
        SIGN_SECRET: SIGN_SECRET,
        WX_APP_ID: WX_APP_ID,
        URI_IMG_SUFFIX: uriImgSuffix,
        COUNTLY_IP,
        COUNTLY_APP_KEY,
        UPLOAD_API_IP: UPLOAD_API_IP,
        // mock
        CLAW_API: RUN_ENV === 'local' ? CLAW_API : '',
        E_COM_API: RUN_ENV === 'local' ? E_COM_API : '',
        ACEO_API: RUN_ENV === 'local' ? ACEO_API : '',
        CORN_API: RUN_ENV === 'local' ? CORN_API : '',
    };
export default Config;
// }
