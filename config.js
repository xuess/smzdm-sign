/**
 * 项目配置表
 * 邮件推荐使用qq邮箱，其他邮箱可能协议方面要自行设置
 * xuess<wuniu2010@126.com>
 * 2018-04-17
 */

// email 登陆账号 如：xxxx@qq.com
const emailName = 'hawka@126.com';
// email 登陆密码
const emailPassword = '318020';
// 接收者 邮箱
const toEmail = 'hawka@126.com';

//用于签到的 账号信息 列表
const cookieListValKey = [
	{
		'username': '非必填，用户发送邮件展示',
		'phone': '非必填，用户发送邮件展示',
		'cookies': '__ckguid=G6b2SNIrb41sTecVL4rAO72; device_id=213070643316051406903846135c494db0e2034c79be13e75e73b4b51e; homepage_sug=i; r_sort_type=score; __jsluid_s=c29f9dd6dc6012ae245cfd39e6a1d489; _zdmA.vid=*; sajssdk_2015_cross_new_user=1; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%22175b9d74de76b0-0f0beadd55f6f2-326e7207-2007040-175b9d74de8bf5%22%2C%22first_id%22%3A%22%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22%24device_id%22%3A%22175b9d74de76b0-0f0beadd55f6f2-326e7207-2007040-175b9d74de8bf5%22%7D; Hm_lvt_9b7ac3d38f30fe89ff0b8a0546904e58=1605140702; footer_floating_layer=0; ad_date=12; ad_json_feed=%7B%7D; zdm_qd=%7B%7D; _ga=GA1.2.1100156082.1605140716; _gid=GA1.2.1228285478.1605140716; sess=M2NjNmR8MTYwOTAyODk3NXw1ODA0MTk4OTAzfDA1ZDA0YTRiYjA1MTQ0ZTk5MGM1ZWYxZDFkZWUwOGE3; user=user%3A5804198903%7C5804198903; _zdmA.uid=ZDMA.79SBvxNCY.1605141028.2419200; userId=user:5804198903|5804198903; smzdm_id=5804198903; __gads=ID=726534a4da95afdb-2285a1f02bb90063:T=1605141030:RT=1605141030:S=ALNI_MaQ9PzlfTFs9XrJXUc2OoJD_yQwLQ; Hm_lpvt_9b7ac3d38f30fe89ff0b8a0546904e58=1605141033; bannerCounter=%5B%7B%22number%22%3A0%2C%22surplus%22%3A1%7D%2C%7B%22number%22%3A0%2C%22surplus%22%3A1%7D%2C%7B%22number%22%3A0%2C%22surplus%22%3A1%7D%2C%7B%22number%22%3A0%2C%22surplus%22%3A1%7D%2C%7B%22number%22%3A0%2C%22surplus%22%3A1%7D%2C%7B%22number%22%3A0%2C%22surplus%22%3A1%7D%5D; amvid=c2cc6480765f1df02c32ffbd47ab5069; _zdmA.time=1605141109215.0.https%3A%2F%2Fwww.smzdm.com%2F'
	},
];


//回复列表 用于发表评论的内容
let commitList = [
	'感谢爆料，很不错',
	'现在这个价格还可入手吗？',
	'感谢爆料，价格不错~~',
];

module.exports = {
	emailName,
	emailPassword,
	toEmail,
	cookieListValKey,
	commitList
};
