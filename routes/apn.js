var express = require('express');
var async = require('async');
var router = express.Router();

var db = require("../db/db.js");

var pushNotifier = require('../pushNotifier/pushAPN.js');
pushNotifier.init();

/**
 * use valid device token to get it working
 * pushNotifier.send({token:'', message:'Test message', from: 'sender'});
 */

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body);
  var notification = {
    token : req.body.token,
    message : req.body.message,
    from : req.body.sender
  };
  console.log(notification);
  if( typeof notification.token === 'string' || notification.token instanceof String) {
      pushNotifier.send(notification);
      res.send(' Pushed to Device through APN.');
  }
  else{
      res.status(302).send('Invalid Token Format. User String.')
  }
});

router.post('/user', function(req, res, next) {
    console.log(req.body);
    var userId = req.body.userId;
    if( typeof userId === 'string' || userId instanceof String) {

        db.pushDeviceDB.native.get(userId, function(err, doc){
            if(err){
                console.log(err);
                return res.status(302).send('This user does not have valid registered device token for push notifications.');
            }
            var notification = {
                token : doc.pushId,
                message : req.body.message,
                from : 'PayRange'
            };
            pushNotifier.send(notification);
            res.send('Pushed to Device through APN.');
        });
    }
    else{
        res.status(302).send('Invalid User.')
    }

});

router.post('/multi', function(req, res, next) {
    console.log(req.body);
    var notification = {
        token : req.body.token,
        message : req.body.message,
        from : req.body.sender
    };
    console.log(notification);
    if(notification.token instanceof Array){
        pushNotifier.sendMulti(notification);
        res.send('Multi Device: Pushed to Devices through APN.');
    }
    else
        res.status(302).send('Invalid Token Format. User Array.')

});

router.post('/deleteDeviceToken', function(req, res, next) {
    console.log(req.body);
    var token = req.body.token;
    if(token){
        db.pushDeviceDB.deleteDeviceFromList(token, function(err, status){
            if(err){
                res.send('Error while deleting'+ err);
            }
            else{
                if (status)
                    res.send('Deleted Successfully!');
                else
                    res.send('No such device found.');
            }
        })
    }
    else{
        res.send('Nothing to Delete');
    }

});

router.post('/find', function(req, res, next) {
    console.log(req.body);
    var tag = req.body.tag;
    var message = req.body.message;
    var sendNotification = req.body.send || false;
    if(!message)
        return res.status(302).send('Please provide a valid message');

    var tokens=[];
    var users=[];
    db.pushDeviceDB.getDocumentsByTag(tag, function(err,docs){
        if(err){
            console.log(err);
            return res.status(302).send(err);
        }
        if(docs.rows.length>0){

            async.eachSeries(
                docs.rows,
                function(item, callback){
                    tokens.push(item.doc.pushId);
                    db.payangeDB.native.get(item.doc._id, function(err,data){
                        if(err)
                            console.log(err);
                        else
                            users.push({name:data.name,id:item.doc._id});
                        callback(null);
                    });

                },
                function(err){
                    if(err){
                        console.log(err);
                    }
                    var notification = {
                        token : tokens,
                        message : message,
                        from : 'PayRange'
                    };
                    if(sendNotification){
                        pushNotifier.sendMulti(notification);
                        return res.send({message:"Notifications sent",users:users});
                    }
                    else{
                        return res.send({message:"Matching users",users:users});
                    }

                }
            );

        }
        else{
            return res.send('No matching users found.')
        }
        //res.send(docs.rows);
    });

});

module.exports = router;
