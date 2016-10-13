var GeTui = require('./GT.push');

exports.gt = '';
exports.APPID = '';
exports.APPKEY = '';
exports.MASTERSECRET = '';
exports.HOST = '';

exports.init = function(HOST, APPID, APPKEY, MASTERSECRET) {
	module.exports.gt = new GeTui(HOST, APPKEY, MASTERSECRET)
	module.exports.HOST = HOST
	module.exports.APPID = APPID
	module.exports.APPKEY = APPKEY
	module.exports.MASTERSECRET = MASTERSECRET
}