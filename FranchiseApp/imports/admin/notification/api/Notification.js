import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Notification = new Mongo.Collection('notification');
// export const Notification = new Mongo.Collection('notifications');
export const SMS = new Mongo.Collection('sms');

if(Meteor.isServer){

  Meteor.startup(() => {
    Notification._ensureIndex({ "toUserId": 1});
  });
  
  Meteor.publish('notification',function notification(){
      return Notification.find({});
  });

   Meteor.publish('sms',function sms(){
      return SMS.find({});
  });
  
}

Meteor.methods({
 'insertNotification' : function(eventName,toMailId,toUserId,notifBody){
        
        var notifData = Notification.findOne({}, {sort: {notificationId: -1}});

        if(notifData){
        notificationId = notifData.notificationId + 1;
        }else{
          notificationId = 1;
        }

            Notification.insert({
              'notificationId' :notificationId,
              'event'          : eventName,
              'toMailId'       : toMailId,
              'toUserId'       : toUserId,
              'notifBody'      : notifBody,
              'status'         : 'unread',
              'date'           : new Date(),
          });

       
        
      },

      

      'insertSMS' : function(toUserId,smsBody,toNumber){
        
        var smsData = SMS.findOne({}, {sort: {smsId: -1}});

        if(smsData){
        smsId = smsData.smsId + 1;
        }else{
          smsId = 1;
        }

            Notification.insert({
              'smsId'      :smsId,
              'toUserId'   : toUserId,
              'smsBody'    : smsBody,
              'status'     : 'unread',
              'date'       : new Date(),
          });

       
        
      },

  'updateNotification' : function(id){
    Notification.update(
              { "_id" : id },
              { $set: { "status"         : 'Read',  
                                
                       }  
              },
        );//end update 

  },

  'deleteNotification' : function(id){
    Notification.remove({"_id": id});

  },

  'updateSMS' : function(id){
    SMS.update(
              { "_id" : id },
              { $set: { "status"         : 'Read',  
                                
                       }  
              },
        );//end update 

  },

  'deleteSMS' : function(id){
    SMS.remove({"_id": id});

  }

});