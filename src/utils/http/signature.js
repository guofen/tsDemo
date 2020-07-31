const CryptoJS = require('crypto-js');

let k = '';
let s = '';

function sign(stringToSign) {
    return CryptoJS.HmacSHA256(stringToSign, s).toString(CryptoJS.enc.Base64);
}
function md5(content) {
    return CryptoJS.MD5(content).toString(CryptoJS.enc.Base64);
}
function loweredKeys(headers = {}) {
    const lowered = {};
    const keys = Object.keys(headers);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        lowered[key.toLowerCase()] = headers[key];
    }
    return lowered;
}
function getSignHeaderKeys(headers) {
    const keys = Object.keys(headers).sort();
    const signKeys = [];
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // x-ca- 开头的header或者指定的header
        if (key.startsWith('x-ca-')) {
            signKeys.push(key);
        }
    }
    // 按字典序排序
    return signKeys.sort();
}
function getSignedHeadersString(signHeaders, headers) {
    const list = [];
    for (let i = 0; i < signHeaders.length; i++) {
        const key = signHeaders[i];
        list.push(key + ':' + headers[key]);
    }
    return list.join('\n');
}
function buildStringToSign(method, headers, signedHeadersStr, uri) {
    // accept, contentMD5, contentType,
    const lf = '\n';
    const list = [method.toLocaleUpperCase(), lf];

    const accept = headers.accept || headers.common.accept || headers.common.Accept;
    if (accept) {
        list.push(accept);
    } else {
        list.push('*/*');
    }
    list.push(lf);

    const contentMD5 = headers['content-md5'];
    if (contentMD5) {
        list.push(contentMD5);
    }
    list.push(lf);

    const contentType = headers['content-type'] || '';
    if (contentType) {
        list.push(contentType);
    }
    list.push(lf);

    const date = headers.date;
    if (date) {
        list.push(date);
    }
    list.push(lf);

    if (signedHeadersStr) {
        list.push(signedHeadersStr);
        list.push(lf);
    }

    list.push(uri);

    return list.join('');
}
function generateURI(uri, queryData = {}) {
    let _uri = uri;
    try {
        let queryObj = {};
        const queryKeys = Object.keys(queryData);
        const indexOfSeparator = _uri.indexOf('?');
        if(indexOfSeparator !== -1) {
            _uri = _uri.substring(0, indexOfSeparator);
            const _queryAry = _uri.substring(indexOfSeparator + 1).split('&');
            for(let i = 0, len = _queryAry.length; i < len; i++) {
                const query = _queryAry[i];
                if(query) {
                    const _query = query.split('=');
                    const key = _query[0];
                    if(queryKeys.indexOf(key) === -1) {
                        queryKeys.push(key);
                    }
                    queryObj[key] = _query[1];
                }
            }
        }
        queryObj = {...queryObj, ...queryData};
        queryKeys.sort();
        for(let i = 0, len = queryKeys.length; i < len; i++) {
            const key = queryKeys[i];
            const value = queryObj[key];
            // 阿里验签 无值  不参与验签
            if((value === undefined || value === null || value === '')) {
                continue;
            }
            if (_uri.indexOf('?') !== -1) {
                _uri = _uri + '&' + key + '=' + value;
            } else {
                _uri = _uri + '?' + key + '=' + value;
            }
        }
    } catch (e) {
        console.log(e);
    }
    return _uri;
}
export default function signature(config, sign_k, sign_s) {
    const urlComponents = config.url.split('/');
    // const host = urlComponents.splice(0, 3).join('/');
    urlComponents.splice(0, 3).join('/');
    let uri = '/' + urlComponents.join('/');
    const query = config.params;
    const data = config.data;
    const headers = config.headers;
    const method = config.method;
    uri = generateURI(uri, query);
    k = sign_k;
    s = sign_s;
    // const url = host + uri;
    const _headers = {
        'x-ca-timestamp': Date.now(),
        'x-ca-key': k,
        'x-ca-stage': 'RELEASE',
        ...loweredKeys(headers),
    };
    if(data) {
        _headers['content-md5'] = md5(data);
    }
    const signHeaderKeys = getSignHeaderKeys(_headers);
    _headers['x-ca-signature-headers'] = signHeaderKeys.join(',');
    const signedHeadersStr = getSignedHeadersString(signHeaderKeys, _headers);
    const stringToSign = buildStringToSign(method, _headers, signedHeadersStr, uri);
    _headers['x-ca-signature'] = sign(stringToSign);

    return {...config, headers: _headers, stringToSign: stringToSign};
}

export function getSignHeaders(url, header, postDataStr, method) {
    const _headers = {
        'x-ca-timestamp': Date.now(),
        'x-ca-key': k,
        'x-ca-stage': 'RELEASE',
        ...loweredKeys(header),
    };
    if(postDataStr) {
        _headers['content-md5'] = md5(postDataStr);
    }
    const signHeaderKeys = getSignHeaderKeys(_headers);
    _headers['x-ca-signature-headers'] = signHeaderKeys.join(',');
    const signedHeadersStr = getSignedHeadersString(signHeaderKeys, _headers);
    const stringToSign = buildStringToSign(method, _headers, signedHeadersStr, url);
    // console.log("stringToSign", stringToSign);
    _headers['x-ca-signature'] = sign(stringToSign);
    return _headers;
}
