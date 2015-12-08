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
        deleteDeviceFromList:deleteDeviceFromList,
        native:pushDeviceDB
    }
};

function formatDeviceToken(token){
    var len = token.length;
    var spaceCount = (len / 8);
    var j=0;
    var arr = [];
    for(var i=0;i<spaceCount;i++, j=j+8){
        arr.push(token.substring(j,j+8))
    }

    return "<" + arr.join(' ') + ">"

}

function deleteDeviceFromList(deviceToken, done){
    var params ={
        include_docs:true,
        reduce:false,
        key:formatDeviceToken(deviceToken)
    };
    console.log (params);
    pushDeviceDB.view("all_tags","view",params, function(err, docs){
        if(err)
            return done(err);
        if(docs.rows.length>0){
            var docId =docs.rows[0].doc._id;
            var revId = docs.rows[0].doc._rev;
            pushDeviceDB.destroy(docId, revId, function(err,body){
                if(err){
                    console.log('Error while deleting the Doc -', docId, revId, err);
                    return done(err)
                }
                else{
                    return done(null,true);
                }
            })
        }
        else{
            return done(null,false)
        }
    });
}

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