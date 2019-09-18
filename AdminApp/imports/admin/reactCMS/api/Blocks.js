import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Blocks = new Mongo.Collection("blocks");
// export const Blocks = new Mongo.Collection("blocks");
export const TempBlockImages = new Mongo.Collection("tempBlockImages");
// export const TempBlockImages = new Mongo.Collection("tempblockimages");
if(Meteor.isServer){
    Meteor.publish('blocks',()=>{
        return Blocks.find({});
    });
    Meteor.publish('tempBlockImages',()=>{
        return TempBlockImages.find({});
    });

    Meteor.methods({
      'uploadTempBlockImages':function(id,amazonUrl,uploadTime){
    		TempBlockImages.insert({
    			'id'             : id,
    			'amazonUrl'      : amazonUrl,
    			'uploadTime'     : new Date(),
          'authorUserId'   : id,
          'submitted'       : false,
    		});
    	},
      'updateTempBlockImages':function(_id,boolean){
    		TempBlockImages.update({
    			'_id'           : _id},
          {$set:{
    			'submitted'      : boolean,
    		}});
    	},
      'removeTempBlockImages':function(id){
        TempBlockImages.remove({'id':id,'submitted':true});
      },
      'removeBlockUnsubmitImages':function(id){
        TempBlockImages.remove({'id':id,'submitted':false});
      },
      'removeBlockUrlImages':function(url){
        TempBlockImages.remove({'amazonUrl':url});
      },
    	'createBlock':function(blockName,blockBody,s3,userId,updateTimestamp){
        console.log(s3);
    		Blocks.insert({
    			'blockName'  : blockName,
    			'blockBody'  : blockBody,
          's3'            : s3,
    			'createdAt'     : new Date(),
          'authorUserId'  : userId,
          'lastModified'  : updateTimestamp,
    		});
    	},
      'updateBlock':function(id,blockName,blockBody,userId,updateTimestamp){
    		Blocks.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'blockName'  : blockName,
            			'blockBody'  : blockBody,
                  'authorUserId'  : userId,
                  'lastModified'  : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'updateEditBlock':function(amazonUrl){
    		Blocks.update(
    			{ "s3.amazonUrl": amazonUrl },
    	        {
    	          $set:{

                  's3.$.amazonUrl'   : "",
                  's3.$.uploadTime'  : "",
    	        } //End of set
    	      }
    		);
    	},
      'updateBlockAmazonUrl':function(amazonUrl,uploadTime,id){
    		Blocks.update(
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
      'deleteBlock':function(id){
     		 Blocks.remove({'_id': id});

    	},
    });
}
