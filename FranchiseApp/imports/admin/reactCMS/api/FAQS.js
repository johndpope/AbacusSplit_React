import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const FAQS = new Mongo.Collection("faqs");
// export const FAQS = new Mongo.Collection("faqs");

if(Meteor.isServer){
    Meteor.publish('faqs',()=>{
        return FAQS.find({});
    });

    Meteor.methods({
    	'createFAQ':function(FAQQuestion,FAQAnswer,userId,updateTimestamp){

    		FAQS.insert({
    			'FAQQuestion'    : FAQQuestion,
    			'FAQAnswer'      : FAQAnswer,
    			'createdAt'      : new Date(),
          'authorUserId'   : userId,
          'lastModified'   : updateTimestamp,
    		});
    	},
      'updateFAQ':function(id,FAQQuestion,FAQAnswer,userId,updateTimestamp){
    		FAQS.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'FAQQuestion'    : FAQQuestion,                
                  'FAQAnswer'      : FAQAnswer,
                  'authorUserId'   : userId,
                  'lastModified'   : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'deleteFAQ':function(id){
     		 FAQS.remove({'_id': id});

    	},
    });
}
