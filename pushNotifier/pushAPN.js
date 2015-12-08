var apn  = require("apn");
var db = require("../db/db.js");

var apnError = function(err){
    console.log("APN Error:", err);
};

var options = {
    "cert": "cert.pem",
    "key":  "key.pem",
    "passphrase": null,
    "gateway": "gateway.sandbox.push.apple.com",
    "port": 2195,
    "enhanced": true,
    "cacheLength": 5
};
options.errorCallback = apnError;

var feedBackOptions = {
    "batchFeedback": true,
    "interval": 300
};

var apnConnection, feedback;

module.exports = {
    init : function(){
        apnConnection = new apn.Connection(options);

        apnConnection.on("connected", function() {
            console.log("Connected");
        });

        apnConnection.on("transmitted", function(notification, device) {
            console.log("Notification transmitted to:" + device.token.toString("hex"));
            db.pushDeviceDB.saveNotificationSuccess({deviceId:device.token.toString("hex"), notification:notification}, function(err, data){
                console.log(err, data);
            })
        });

        apnConnection.on("transmissionError", function(errCode, notification, device) {
            console.error("Notification caused error: " + errCode + " for device ", device, notification);
            if (errCode === 8) {
                console.log("A error code of 8 indicates that the device token is invalid. This could be for a number of reasons - are you using the correct environment? i.e. Production vs. Sandbox");
            }
            db.pushDeviceDB.saveNotificationError({deviceId:device.token.toString("hex"), errorCode: errCode, notification:notification}, function(err, data){
                console.log(err, data);
            })
        });

        apnConnection.on("timeout", function () {
            console.log("Connection Timeout");
        });

        apnConnection.on("disconnected", function() {
            console.log("Disconnected from APNS");
        });

        apnConnection.on("socketError", console.error);


        feedback = new apn.Feedback(feedBackOptions);
        feedback.on("feedback", function(devices) {
            devices.forEach(function(item) {
                //Do something with item.device and item.time;
                console.log('Feedback:', item);
                var deviceToken = item.device.token.toString("hex");
                var time = item.time;
                db.pushDeviceDB.deleteDeviceFromList(deviceToken, function(err,data){
                    console.log(err,data);
                })
            });
        });
    },

    send : function (params){
        var myDevice, note;

        myDevice = new apn.Device(params.token);
        note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = params.message;
        note.payload = {'messageFrom': params.from};

        if(apnConnection) {
            apnConnection.pushNotification(note, myDevice);
        }
    },

    sendMulti : function (params){
        var token, note;

        token = params.token;
        note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = params.message;
        note.payload = {'messageFrom': params.from};

        if(apnConnection) {
            apnConnection.pushNotification(note, token);
        }
    }
};