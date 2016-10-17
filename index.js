'use strict';
var GlobalConfig = require('./GlobalConfig');
var APNPayload = require('./payload/APNPayload');
var SimpleAlertMsg = require('./payload/SimpleAlertMsg');
var Target = require('./getui/Target');
var SingleMessage = require('./getui/message/SingleMessage');
var TransmissionTemplate = require('./getui/template/TransmissionTemplate');

function pushMessageToSingle(clientId, content, alertMessage, badge, sound, ALIAS) {
	var gt = GlobalConfig.gt
    var template = createTransmissionTemplate(content, alertMessage, badge, sound);
    //单推消息体
    var message = new SingleMessage({
        isOffline: true,                        //是否离线
        offlineExpireTime: 3600 * 1000 * 24 * 3,    //离线时间，三天
        data: template                          //设置推送消息类型
    });
    //接收方
    var target = new Target({
        appId: GlobalConfig.APPID,
        clientId: clientId
    });

    if (ALIAS) {
	    target.setAppId(GlobalConfig.APPID).setAlias(ALIAS);
    } else {
	    target.setAppId(GlobalConfig.APPID).setClientId(clientId);
    }
    var result = ''
    return new Promise(function(resolve, reject){
	    gt.pushMessageToSingle(message, target, function(err, res){
	        if(err != null){
	            reject(err)
	        } else {
		        resolve(res)
	        }
	    })
    }).then(function(data){
    	if (data) {
    		result = data
    	}
    }, function(err){
    	if (err != null && err.exception != null && err.exception instanceof RequestError) {
    		return new Promise(function(resolve, reject){
	            //发送异常重传
	            gt.pushMessageToSingle(message,target,requestId,function(err, res){
	            	if (err) {
	            		reject(err)
	            	} else {
	            		resolve(res)
	            	}
	            });
            })
    	} else {
    		return Promise.reject(err)
    	}
    }).then(function(data){
    	if (data) {
    		result = data
    	}
		return Promise.resolve(result)
    }, function(err){
    	return Promise.reject(err)
    })
}

function createTransmissionTemplate(content, alertMessage, badge, sound) {
    var template = new TransmissionTemplate();
    template.setAppId(GlobalConfig.APPID);
    template.setAppkey(GlobalConfig.APPKEY);
    template.setTransmissionContent(content);
    template.setTransmissionType(1);
    if (alertMessage) {
        var payload = new APNPayload();
        payload.badge = badge;
        payload.contentAvailable = 1;
        payload.category = "ACTIONABLE";
        payload.sound = sound;
        payload.customMsg.payload = "payload";
        // 简单模式使用
        var alertMsg = new SimpleAlertMsg();
        alertMsg.alertMsg = alertMessage;
        payload.alertMsg = alertMsg;
        // payload.alertMsg = getDictionaryAlertMsg();
        template.setApnInfo(payload);
    }
    return template
}

// 字典形式的 alert，暂时不使用
function getDictionaryAlertMsg() {
    var alertMsg = new DictionaryAlertMsg();
    alertMsg.body = "body";
    alertMsg.actionLocKey = "ActionLockey";
    alertMsg.locKey = "LocKey";
    alertMsg.locArgs = "loc-args";
    alertMsg.launchImage = "launch-image";
    // IOS8.2以上版本支持
    alertMsg.title = "Title";
    alertMsg.titleLocKey = "TitleLocKey";
    alertMsg.titleLocArgs = "TitleLocArg";
    return alertMsg;
}

/**
 * 初始化个推的参数
 * @function  init
 * @param     {string}  HOST  示例：http://sdk.open.api.igexin.com/apiex.htm
 * @param     {string}  APPID  示例：JroCkPGgpF6LzFQqqoWlhA
 * @param     {string}  APPKEY  示例：Mjv706pTKt5cTcjtqaToz8
 * @param     {string}  MASTERSECRET  示例：uIBtmad7RK706cy5MKdfp3
 * @returns   {object}  返回一个新的对象，其中包括了所有 module.export.* 的方法和参数
 */
exports.init = function(HOST, APPID, APPKEY, MASTERSECRET) {
	GlobalConfig.init(HOST, APPID, APPKEY, MASTERSECRET)

	/**
	 * 给单个用户发送推送，优先以 ALIAS 为准（存在 ALIAS 则不会给 clientId 发送）
	 * @function  pushMessageToSingle
	 * @param     {string}  clientId  接收推送的 clientId
	 * @param     {string}  content   推送内容
	 * @param     {string}  alertMessage   提示内容
	 * @param     {int}  badge  iOS badge
	 * @param     {string}  sound  iOS sound
	 * @param     {string || null}  ALIAS   如果传 ALIAS，则默认 clientId 失效
	 * @returns   {Promise}  Promise
	 */
	module.exports.pushMessageToSingle = function(clientId, content, alertMessage, badge, sound, ALIAS){
		return pushMessageToSingle(clientId, content, alertMessage, badge, sound, ALIAS)
	}

	return this
}