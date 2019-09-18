import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Events = new Mongo.Collection("events");
// export const Events = new Mongo.Collection("events");
export const TempEventImages = new Mongo.Collection("TempEventImages");
// export const TempEventImages = new Mongo.Collection("tempeventimages");
if(Meteor.isServer){
    Meteor.publish('events',()=>{
        return Events.find({});
    });
    Meteor.publish('tempEventImages',()=>{
        return TempEventImages.find({});
    });

    Meteor.methods({
      'uploadTempEventImages':function(id,amazonUrl,uploadTime){
    		TempEventImages.insert({
    			'id'             : id,
    			'amazonUrl'      : amazonUrl,
    			'uploadTime'     : new Date(),
          'authorUserId'   : id,
          'submitted'       : false,
    		});
    	},
      'updateTempEventImages':function(_id,boolean){
    		TempEventImages.update({
    			'_id'           : _id},
          {$set:{
    			'submitted'      : boolean,
    		}});
    	},
      'removeTempEventImages':function(id){
        TempEventImages.remove({'id':id,'submitted':true});
      },
      'removeEventUnsubmitImages':function(id){
        TempEventImages.remove({'id':id,'submitted':false});
      },
      'removeEventUrlImages':function(url){
        TempEventImages.remove({'amazonUrl':url});
      },
    	'createEvent':function(eventName,eventVenue,eventTime,eventVideo,eventBody,s3,userId,updateTimestamp){
        console.log(s3);
    		Events.insert({
    			'eventName'     : eventName,
          'eventVenue'    : eventVenue,
          'eventTime'     : eventTime,
          'eventVideo'    : eventVideo,
    			'eventBody'     : eventBody,
          's3'            : s3,
    			'createdAt'     : new Date(),
          'authorUserId'  : userId,
          'lastModified'  : updateTimestamp,
    		});
    	},
      'updateEvent':function(id,eventName,eventVenue,eventTime,eventVideo,eventBody,userId,updateTimestamp){
    		Events.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'eventName'     : eventName,
                  'eventVenue'    : eventVenue,
                  'eventTime'     : eventTime,
                  'eventVideo'    : eventVideo,
            			'eventBody'     : eventBody,
                  'authorUserId'  : userId,
                  'lastModified'  : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'updateEditEvent':function(amazonUrl){
    		Events.update(
    			{ "s3.amazonUrl": amazonUrl },
    	        {
    	          $set:{

                  's3.$.amazonUrl'   : "",
                  's3.$.uploadTime'  : "",
    	        } //End of set
    	      }
    		);
    	},
      'updateEventAmazonUrl':function(amazonUrl,uploadTime,id){
    		Events.update(
    			   { '_id': id },
    	        {
    	          $push:{
                    's3':
                    {
                      'amazonUrl': amazonUrl,
                      'uploadTime':uploadTime,
                    }
    	        }
    	      }
    		);
    	},
      'deleteEvent':function(id){
     		 Events.remove({'_id': id});

    	},
    });
}
