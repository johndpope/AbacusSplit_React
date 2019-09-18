import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const BasicPages = new Mongo.Collection("basicPages");
// export const BasicPages = new Mongo.Collection("basicpages");

if(Meteor.isServer){
    Meteor.publish('basicPages',()=>{
        return BasicPages.find({});
    });

    Meteor.methods({
    	'createBasicPage':function(basicPageName,basicPageUrl,basicPageBody,userId,updateTimestamp){

    		BasicPages.insert({
    			'basicPageName'  : basicPageName,
    			'basicPageUrl'   : basicPageUrl,
    			'basicPageBody'  : basicPageBody,
    			'createdAt'      : new Date(),
          'authorUserId'   : userId,
          'lastModified'   : updateTimestamp,
    		});
    	},
      'updateBasicPage':function(id,basicPageName,basicPageUrl,basicPageBody,userId,updateTimestamp){
        console.log("update server method");
        console.log(id);
    		BasicPages.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'basicPageName'  : basicPageName, 
                  'basicPageUrl'   : basicPageUrl,
                  'basicPageBody'  : basicPageBody,
                  'authorUserId'   : userId,
                  'lastModified'   : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'deleteBasicPage':function(id){
     		 BasicPages.remove({'_id': id});

    	},
    });
}
