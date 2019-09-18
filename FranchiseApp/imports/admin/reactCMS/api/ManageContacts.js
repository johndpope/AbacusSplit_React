import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const ManageContacts = new Mongo.Collection("manageContacts");
// export const ManageContacts = new Mongo.Collection("managecontacts");

if(Meteor.isServer){
    Meteor.publish('manageContacts',()=>{
        return ManageContacts.find({});
    });

    Meteor.methods({
    	'createManageContact':function(manageContactName,manageContactAddress,manageContactPhone,manageContactEmail,manageContactSubject,manageContactMessage,userId,updateTimestamp){

    		ManageContacts.insert({
          'manageContactName'     : manageContactName,
    			'manageContactAddress'  : manageContactAddress,
    			'manageContactPhone'    : manageContactPhone,
    			'manageContactEmail'    : manageContactEmail,
          'manageContactSubject'  : manageContactSubject,
    			'manageContactMessage'  : manageContactMessage,
    			'createdAt'             : new Date(),
          'authorUserId'          : userId,
          'lastModified'          : updateTimestamp,
    		});
    	},
      'updateManageContact':function(id,manageContactName,manageContactAddress,manageContactPhone,manageContactEmail,manageContactSubject,manageContactMessage,userId,updateTimestamp){
    		ManageContacts.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'manageContactName'     : manageContactName,
                  'manageContactAddress'  : manageContactAddress,
            			'manageContactPhone'    : manageContactPhone,
            			'manageContactEmail'    : manageContactEmail,
                  'manageContactSubject'  : manageContactSubject,
            			'manageContactMessage'  : manageContactMessage,
                  'authorUserId'   : userId,
                  'lastModified'   : updateTimestamp,
    	        } //End of set
    	      }
    		);
    	},
      'deleteManageContact':function(id){
     		 ManageContacts.remove({'_id': id});

    	},
    });
}
