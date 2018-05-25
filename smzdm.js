/**
 * 什么值得买签到程序 
 * 支持自动签到，自动评论3条，自动错误邮件提醒
 * xuess<wuniu2010@126.com>
 */

const request = require('./lib/request_https');
const cheerio = require("cheerio"); //文档转换
const ejs = require("ejs"); //模板
const schedule = require("node-schedule"); //定时器
const { getRandom, ascii2native } = require('./lib/utils'); //工具类
const { mailSend } = require("./lib/mail"); //发邮件
const { cookieListValKey, commitList } = require("./config"); //配置文件

console.log('什么值得买 签到相关', new Date());


//日志信息
let logoInfoCommit = [];
let logoInfoSign = [];

//文章列表 默认
let postIdList = [];

//评论地址 
//家居生活 发现频道 300 - 550 页 随机页数
let getCommitUrl = () => {
	let random = getRandom(300, 550);
	let commitUrl = `https://faxian.smzdm.com/h1s0t0f37c0p${random}/`;
	return commitUrl;
}

/**
 * 什么值得买 获取用来评论的文章id
 * @param {Object} url 需要访问的url
 * @param {Object} refererUrl 来源url
 * @param {Object} cookieSess 用来请求的 cookie
 */
let getPostID = (url, refererUrl, cookieSess = '') => {
	//如果没传值 随机取一个cookie 防止重复提交
	let cookie = cookieSess || cookieListValKey[getRandom(0, cookieListValKey.length - 1)].cookies;
	let referer = refererUrl;
	let options = {
		url: url,
		type: 'GET'
	}
	new Promise(function(resolve, reject) {
		options.callback = function(data, _setCookie) {
			//临时列表
			let tempPostIdList = [];
			try {
				let $ = cheerio.load(data);
				$('.feed-ver-pic').each(function(i, e) {
					let href = $(e).find('a').eq(0).attr('href');
					tempPostIdList.push(href.substring(href.indexOf('/p/') + 3, href.length - 1));
				});
				console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + ' --- 新文章列表：', tempPostIdList);
				//获取新列表，再更新，否则不更新
				if(tempPostIdList.length > 0){
					postIdList = tempPostIdList;
				}
			} catch(error) {
				console.log(error);
				//发邮件
				mailSend('什么值得买获取【文章列表报错】', `时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>错误内容: ${ascii2native(error)}`);
			} finally {}
		}
		request(options, cookie, referer);
	});
}

/**
 * 什么值得买 评论
 * @param {Object} cookieSess cookie信息
 */
let smzdmCommit = (cookieSess) => {
	//	let num = Math.floor(Math.random() * 900);
	let cookie = cookieSess.cookies;
	let cookieName = cookieSess.username;
	let referer = 'https://zhiyou.smzdm.com/user/submit/';
	let options = {
		url: 'https://zhiyou.smzdm.com/user/comment/ajax_set_comment?callback=jQuery111006551744323225079_' + new Date().getTime() + '&type=3&pid=' + postIdList[Math.floor(Math.random() * postIdList.length)] + '&parentid=0&vote_id=0&vote_type=&vote_group=&content=' + encodeURI(commitList[Math.floor(Math.random() * commitList.length)]) + '&_=' + new Date().getTime(),
		type: 'GET'
	}

	console.log(options);

	new Promise((resolve, reject) => {
		options.callback = (data, _setCookie) => {
			try {
				console.log('data===', data);
				if(data.indexOf('"error_code":0') != -1) {
					console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + ' --- 什么值得买 评论成功!!!!');
					//记录评论日志
					let logInfo = {};
					logInfo.cookie = cookieSess.username;
					logInfo.date = new Date().Format("yyyy-MM-dd hh:mm:ss");
					logInfo.data = ascii2native(data);
					let logJson = JSON.parse(`{${data.substring(data.indexOf('"error_msg"')+13,data.indexOf('"head"')-1)}}`)
					logInfo.jsonData = logJson;
					logoInfoCommit.push(logInfo);
				} else {
					//发邮件
					mailSend('什么值得买发送【评论报错】' ,`时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>用户: ${cookieName} <br/>错误内容: ${ascii2native(data)}`);
				}

			} catch(error) {
				console.log(error);
				//发邮件
				mailSend('什么值得买发送【评论报错】' ,`时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>用户: ${cookieName} <br/>错误内容: ${ascii2native(error)}`);
			} finally {}

		}
		request(options, cookie, referer);
	});
}

/**
 * 什么值得买签到  
 * @param {Object} cookieSess
 */
let smzdmSign = (cookieSess) => {
	let cookie = cookieSess.cookies;
	let cookieName = cookieSess.username;
	let referer = 'http://www.smzdm.com/qiandao/';
	let options = {
		url: 'https://zhiyou.smzdm.com/user/checkin/jsonp_checkin?callback=jQuery112409568846254764496_' + new Date().getTime() + '&_=' + new Date().getTime(),
		type: 'GET'
	}

	new Promise((resolve, reject) => {
		options.callback = (data, _setCookie) => {
			try {
				console.log('data===', data);
				if(data.indexOf('"error_code":0') != -1) {
					console.log(new Date().Format("yyyy-MM-dd hh:mm:ss") + ' -- 什么值得买 签到成功!!!!');
					//记录签到日志
					let logInfo = {};
					logInfo.cookie = cookieSess.username;
					logInfo.date = new Date().Format("yyyy-MM-dd hh:mm:ss");
					logInfo.data = ascii2native(data);
					let resJson = JSON.parse(`{${data.substring(data.indexOf('"add_point"'),data.indexOf('"slogan"')-1)}}`)
					logInfo.jsonData = resJson;
					logoInfoSign.push(logInfo);
				} else {
					//发邮件
					mailSend('什么值得买【签到报错】', `时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>用户: ${cookieName} <br/>错误内容: ${ascii2native(data)}`);
				}
			} catch(error) {
				console.log(error);
				//发邮件
				mailSend('什么值得买【签到报错】', `时间: ${new Date().Format("yyyy-MM-dd hh:mm:ss")}  <br/>用户: ${cookieName} <br/>错误内容: ${ascii2native(error)}`);
			} finally {}
		}
		request(options, cookie, referer);
	});

}

//延迟执行签到
let setTimeSmzdmSign = (cookieSess) => {
	setTimeout(() => {
		//签到
		smzdmSign(cookieSess);
		console.log('签到！！');
		}, getRandom(1000, 100000));
//	}, getRandom(10000, 10000000));
}

//评论三次 执行时间自定
let commitSettimeout = (cookieSess, timeNum = 1) => {
	if(timeNum == 4) {
		return;
	}
	//延迟发评论
	setTimeout(() => {
		//发现频道 最新
		getPostID(getCommitUrl(), 'https://www.smzdm.com/jingxuan/', cookieSess.cookies);
		setTimeout(() => {
			console.log('cookieSess==', cookieSess);
			smzdmCommit(cookieSess);
			console.log('评论次数', timeNum);
		}, 5000);
		}, getRandom(4000, 10000));
//	}, getRandom(40000, 1000000));

	setTimeout(() => {
		timeNum++;
		commitSettimeout(cookieSess, timeNum);
		}, getRandom(6000, 100000) * timeNum);
//	}, getRandom(60000, 6000000) * timeNum);

}

//每天6点10执行 签到和评论
schedule.scheduleJob('30 10 6 * * *', () => {
	//发现频道 最新
	getPostID(getCommitUrl(), 'https://www.smzdm.com/jingxuan/');
	for(let i = 0; i < cookieListValKey.length; i++) {
		let cookieSess = cookieListValKey[i];
		//延迟签到
		setTimeSmzdmSign(cookieSess);
		//发表三次评论
		commitSettimeout(cookieSess);
	}
});


//每天17点30 发邮件
schedule.scheduleJob('30 30 17 * * *', () => {
	try {
		
		//使用ejs 模板引擎发送html 内容 2018-05-13 
		let data = {logoInfoSign, logoInfoCommit};
		ejs.renderFile('./lib/mail-template.ejs', data, {}, function(err, str){
		    mailSend(new Date().Format("yyyy-MM-dd") + '什么值得买签到评论日志', str);
		});

	} catch(error) {
		console.log(error);
	} finally {
		//清空
		logoInfoCommit = [];
		logoInfoSign = [];
	}
});

//获取最新 待评论的 文章id
getPostID(getCommitUrl(), 'https://www.smzdm.com/jingxuan/');


//TODO 此处测试，可以删掉
for(let i = 0; i < cookieListValKey.length; i++) {
	let cookieSess = cookieListValKey[i];
	//延迟签到
	setTimeSmzdmSign(cookieSess);
	//发表三次评论
	commitSettimeout(cookieSess);
}
