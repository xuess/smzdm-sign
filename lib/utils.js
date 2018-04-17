//时间格式化
Date.prototype.Format = function(fmt) {
	let o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(let k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

//取随机数 min = 最小值 ； max = 最大值
let getRandom = (min, max) => {
	return parseInt(Math.random() * (max - min + 1) + min);
}

//转码ascii 转 native
let ascii2native = (str) => {
	let asciicode = str.split("\\u");
	let nativeValue = asciicode[0];
	for(let i = 1; i < asciicode.length; i++) {
		let code = asciicode[i];
		nativeValue += String.fromCharCode(parseInt("0x" + code.substring(0, 4)));
		if(code.length > 4) {
			nativeValue += code.substring(4, code.length);
		}
	}
	return nativeValue;
}

module.exports = {
	getRandom,
	ascii2native
}
