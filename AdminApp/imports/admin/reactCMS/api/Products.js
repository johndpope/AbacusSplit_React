import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Products = new Mongo.Collection("products");
// export const Products = new Mongo.Collection("products");
export const TempProductImages = new Mongo.Collection("tempProductImages");
// export const TempProductImages = new Mongo.Collection("tempproductimages");
if(Meteor.isServer){
    Meteor.publish('products',()=>{
        return Products.find({});
    });
    Meteor.publish('tempProductImages',()=>{
        return TempProductImages.find({});
    });

    Meteor.methods({
      'uploadTempProductImages':function(id,amazonUrl,uploadTime){
    		TempProductImages.insert({
    			'id'             : id,
    			'amazonUrl'      : amazonUrl,
    			'uploadTime'     : new Date(),
          'authorUserId'   : id,
          'submitted'       : false,
    		});
    	},
      'updateTempProductImages':function(_id,boolean){
    		TempProductImages.update({
    			'_id'           : _id},
          {$set:{
    			'submitted'      : boolean,
    		}});
    	},
      'removeTempProductImages':function(id){
        TempProductImages.remove({'id':id,'submitted':true});
      },
      'removeProductUnsubmitImages':function(id){
        TempProductImages.remove({'id':id,'submitted':false});
      },
      'removeProductUrlImages':function(url){
        TempProductImages.remove({'amazonUrl':url});
      },
    	'createProduct':function(productName,productBody,s3,userId,updateTimestamp){
        console.log(s3);
    		Products.insert({
    			'productName'  : productName,
    			'productBody'  : productBody,
          's3'            : s3,
    			'createdAt'     : new Date(),
          'authorUserId'  : userId,
          'lastModified'  : updateTimestamp,
    		});
    	},
      'updateProduct':function(id,productName,productBody,userId,updateTimestamp){
    		Products.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'productName'  : productName,
            			'productBody'  : productBody,
                  'authorUserId'  : userId,
                  'lastModified'  : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'updateEditProduct':function(amazonUrl){
    		Products.update(
    			{ "s3.amazonUrl": amazonUrl },
    	        {
    	          $set:{

                  's3.$.amazonUrl'   : "",
                  's3.$.uploadTime'  : "",
    	        } //End of set
    	      }
    		);
    	},
      'updateProductAmazonUrl':function(amazonUrl,uploadTime,id){
    		Products.update(
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
      'deleteProduct':function(id){
     		 Products.remove({'_id': id});

    	},
    });
}
