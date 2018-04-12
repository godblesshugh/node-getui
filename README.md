# node-getui
不知道为啥个推不把 SDK 放上来。无法用 npm 装。本仓库单纯做了一个方法整理，加速开发。

包括两种提醒方式：APNs & VoIP

# 安装方法
		npm install --save git+https://github.com/godblesshugh/node-getui.git

# 使用方法（暂时只有一个向单人发推送的方法，后续看需要补充）
		var getui = require("node-getui").init(HOST, APPID, APPKEY, MASTERSECRET);

		// 这里是普通提醒（应用在后台的时候进行apns推送）
	    getui.pushMessageToSingle(clientId, JSON.stringify({
	        alert: '这里是透传消息'
	    }), "测试通知", 0, null).then(function(data) {
	        console.log(data);
	    }, function(err) {
	        console.error(err);
	    });
	   
	    // 这里是声音提醒（应用在后台的时候进行VoIP推送）
	    getui.pushMessageToSingleVoIP(clientId, JSON.stringify({
	        alert: '这里是透传消息'
	    }), "测试通知", 0, null).then(function(data) {
	        process.exit();
	    }, function(err) {
	        console.error(err);
	    });
