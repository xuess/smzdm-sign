/**
 * https 请求模块
 * xuess<wuniu2010@126.com>
 * 2018-04-17
 */

'use strict';
const http = require('https');
const querystring = require('querystring');
const url = require('url');

/**
 *     
 */
module.exports = function(options, cookie, referer) {

    let URL = url.parse(options.url);
    let type = options.type.toUpperCase() || 'GET';
    
    //处理cookie
    cookie = cookie || '';

    //处理请求参数
    let contents = false;
    if(!!options.params) {
        contents = querystring.stringify(options.params);
    }

    //如果是get,把参数跟在url后面
    let path = URL.path;
    if(type === 'GET' && contents) {
        path = path + '?' + contents;
    }

    let requestOptions = {
        host: URL.hostname,
        port: URL.port,
        path: path,
        method: type,
        headers: {
            Cookie: cookie,
            Referer : referer
        }
    };
    
    requestOptions.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36';

    if(type ==='POST' && contents) {
        requestOptions.headers['Content-Type'] = 'application/json;charset=UTF-8';
        requestOptions.headers['Content-Length'] = contents.length;
    }
	
//	console.log('requestOptions === ',requestOptions);
    let req = http.request(requestOptions, function(res) {
        res.setEncoding('UTF-8');
        let str = '';
        res.on('data', function(chunk) {
           str = str + chunk;
        });

        res.on('end', function() {
            let setCookie = res.headers['set-cookie'];
            //执行回调
            options.callback && options.callback(str, setCookie);
        });

        res.on('error', function(e) {
            options.callback && options.callback(e);
        });
    });

    req.on('error', function(e) {
         options.callback && options.callback(e);
    });

    //post请求，需要把请求体发送过去
    if(type === 'POST' && contents) {
        req.write(contents);
    }

    req.end();

};


