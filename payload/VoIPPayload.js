/**
 * Created by HughFace on 2018/4/12.
 */
var util = require('util');
var Payload = require('./Payload');

function VoIPPayload() {
    this.voIPPayload = JSON.stringify({
        'alert': '这里是默认VoIP信息'
    });
}

util.inherits(VoIPPayload, Payload);

VoIPPayload.prototype.getPayload = function() {
    try {
        var tmp = {
            'payload': this.voIPPayload,
            'isVoIP': 1,
        };
        return JSON.stringify(tmp);
    } catch (e) {
        console.log(e);
        throw Error('create voip payload error:' + e.message);
    }
};

module.exports = VoIPPayload;