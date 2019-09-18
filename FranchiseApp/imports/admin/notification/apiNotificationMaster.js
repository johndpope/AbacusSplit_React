import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import { Email } from 'meteor/email';

export const NotificationMaster = new Mongo.Collection('notificationMaster');
// export const NotificationMaster = new Mongo.Collection('notificationmasters');
export const SiteDowntime = new Mongo.Collection('siteShutdownTime');
// export const SiteDowntime = new Mongo.Collection('siteshutdowntimes');

if(Meteor.isServer){

	Meteor.startup(() => {
		NotificationMaster._ensureIndex({ "templateCategory": 1});
	});
	
	Meteor.publish('NotificationMaster',function(){
	    return NotificationMaster.find({});
	});

	Meteor.publish("NotificationMasternotes",function(id){
		return NotificationMaster.find({"_id":id});
	});

	Meteor.publish("NotificationMasterstatus",function(id){
		return NotificationMaster.find({"status" : "Broadcast"});
	});
	Meteor.publish("Notificationstatus",function(id){
		return SiteDowntime.find({"status" : "Broadcasted"});
	});

	Meteor.publish('SiteDowntimeInfo',function(){
	    return SiteDowntime.find({});
	});
} 

Meteor.methods({
	'insertnotification':function(subject,cketext){
		
		NotificationMaster.insert({			

			
			'subject'       : subject,
			'content'       : cketext,	
			'status'		: "cancel",
			'createdAt'     : new Date(),
		});
	},
	'insertSiteDownTime':function(values){
		
			var downtime=SiteDowntime.insert({			
			'startTime'       : values.startTime,
			'endTime'         : values.endTime,	
			'date'            : values.date,
			'downtimeDate'    : values.downtimeDate,	
			'text'		      : "Service will be down :",			
			'createdAt'       : new Date(),
		});
			return downtime
		},


	'updateNotificationtemp':function(Notisid,subject,cketext){
		
		NotificationMaster.update(
			{ '_id': Notisid },
	        {
	          $set:{
	              "subject"   	   : subject,
	              "content"        : cketext,
	             
	        }
	      }
		)
	},
	'getNotificationStatus':function(){
        return NotificationMaster.find({"status":"Broadcast"}).fetch();
      },

      'getDownTimeStatusInfo':function(){
        return SiteDowntime.find({"timeStatus":"Broadcasted"}).fetch();
      },



	'updateNoticeStatus':function(_id,status){
	
		NotificationMaster.update(
			{ '_id': _id },
	        {
	          $set:{
	         	
	              "status"		   : status,
	             
	        } //End of set
	      }
		)
	},
	

	'getdownTimeStatus':function(id){
	
		SiteDowntime.update(
			{ '_id': id },
	        {
	          $set:{
	         	
	              "timeStatus"		   : "Broadcasted",
	             
	        } //End of set
	      }
		)
	},

	'updatenotifications':function(notifId,subject,cketext){
	

		NotificationMaster.update(
			{ '_id': notifId },
	        {
	          $set:{
	           
	              "subject"        : subject,
	              "content"        : cketext,
	              'status'		   : cancel,
	        } //End of set
	      }
		)
	},



	'Deletenotification':function(id){

 		 NotificationMaster.remove({'_id': id});
  
	},
	'DeleteDowntime':function(id){

 		 SiteDowntime.remove({'_id': id});
  
	},
	
});
