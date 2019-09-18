import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const PhotoGallery = new Mongo.Collection("photoGallery");
// export const PhotoGallery = new Mongo.Collection("photogallerys");
export const TempPhotoGallery = new Mongo.Collection("tempPhotoGallery");
// export const TempPhotoGallery = new Mongo.Collection("tempphotogallerys");
if(Meteor.isServer){
    Meteor.publish('photoGallery',()=>{
        return PhotoGallery.find({});
    });
    Meteor.publish('tempPhotoGallery',()=>{
        return TempPhotoGallery.find({});
    });

    Meteor.methods({
      'uploadTempPhotoGallery':function(id,amazonUrl,uploadTime,altAttribute){
    		TempPhotoGallery.insert({
    			'id'             : id,
    			'amazonUrl'      : amazonUrl,
    			'uploadTime'     : new Date(),
          'authorUserId'   : id,
          'altAttribute'   : altAttribute,
          'submitted'      : false,
    		});
    	},
      'updateTempPhotoGallery': function(_id, boolean) {
        TempPhotoGallery.update({
          '_id': _id
        }, {
          $set: {
            'submitted': boolean,
          }
        });
    	},
      'removeTempPhotoGallery':function(id){
        TempPhotoGallery.remove({'id':id,'submitted':true});
      },
      'removeUnsubmitGalleryImages':function(id){
        TempPhotoGallery.remove({'id':id,'submitted':false});
      },
      'removeUrlGalleryImages':function(url){
        TempPhotoGallery.remove({'amazonUrl':url});
      },
    	'createPhotoGallery':function(albumName,altAttribute,s3,userId,updateTimestamp){
    		PhotoGallery.insert({
    			'albumName'     : albumName,
    			'altAttribute'  : altAttribute,
    			's3'            : s3,
    			'createdAt'     : new Date(),
          'authorUserId'  : userId,
          'lastModified'  : updateTimestamp,
    		});
    	},
      'updatePhotoGallery':function(id,albumName,altAttribute,userId,updateTimestamp){
    		PhotoGallery.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'albumName'     : albumName,
            			'altAttribute'  : altAttribute,
            			'authorUserId'  : userId,
                  'lastModified'  : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'updateEditPhotoGallery':function(amazonUrl){
    		PhotoGallery.update(
    			{ "s3.amazonUrl": amazonUrl },
    	        {
    	          $set:{

                  's3.$.amazonUrl'   : "",
                  's3.$.uploadTime'  : "",
    	        } //End of set
    	      }
    		);
    	},
      'updateGalleryAmazonUrl':function(amazonUrl,uploadTime,altAttribute,id){
    		PhotoGallery.update(
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
      'deletePhotoGallery':function(id){
     		 PhotoGallery.remove({'_id': id});

    	},
    });
}
