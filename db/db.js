var config = require('../config.js');
var nano =  require('nano');

var payangeDB = nano(config.couchurl).db.use(config.db);
var pushDeviceDB = nano(config.couchurl).db.use(config.pushdb);

module.exports = {
    payangeDB:{
        getUsers: getUsers,
        native:payangeDB
    },
    pushDeviceDB:{
        getAllPushDevices:getAllPushDevices,
        getPushDeviceForUser:getPushDeviceForUser,
        saveNotificationSuccess:saveNotificationSuccess,
        saveNotificationError:saveNotificationError,
        getDocumentsByTag:getDocumentsByTag,
        native:pushDeviceDB
    }
};

function getUsers(query, done){
    payangeDB.get('08d39a2a22bf073ac84f1a0f4bca2d59', function(err, body){
        if(err){
            console.log("Error ", err);
            return done(err);
        }
        return done(null, body);

    });
}

function getAllPushDevices(){
    return {"status":"ok"};
}


function getPushDeviceForUser(userId){
    return {"status":"ok"};
}

function saveNotificationSuccess(doc, done){
    doc.status='Success';
    doc.docType='Notification';
    doc.time=Date.now();
    return pushDeviceDB.insert(doc, done);
}

function saveNotificationError(doc, done){
    doc.status='Error';
    doc.docType='Notification';
    doc.time=Date.now();
    return pushDeviceDB.insert(doc, done);
}

function getDocumentsByTag(tag, done){
    var params ={
        include_docs:true,
        reduce:false,
        key:tag
    };
    return pushDeviceDB.view("all_tags","view",params, done);
}