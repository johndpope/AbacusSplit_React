import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';

export const AccessManagementMaster = new Mongo.Collection('accessManagementMaster');
// export const AccessManagementMaster = new Mongo.Collection('accessmanagementmasters');

if(Meteor.isServer){
	Meteor.publish('allAccessManagement',function(){
		return AccessManagementMaster.find({});
	});

	Meteor.publish('getSingleModule',function(id){
		return AccessManagementMaster.find({"_id":id});
	});
}

Meteor.methods({
	'addModuleName':function(moduleName,id){
		
		if(id){
			var moduleId = AccessManagementMaster.update({"_id":id},
				{
					$set:{
						'moduleName' : moduleName,
					}
				}
			);
			return id;
			
		}else{
			var moduleId = AccessManagementMaster.insert({
				'moduleName' : moduleName,
				'facilities' : [],
				'createdAt'  : new Date(),
			});
			return moduleId;
		}
		
	},

	'addModuleFacilityName':function(moduleFacilityName,id){
		AccessManagementMaster.update({"_id":id,},
		{
			$push:{
				'facilities':{
					'facilityName' : moduleFacilityName,
				}
			}
		});
	},

	'removeModule':function(removeModuleId){
		AccessManagementMaster.remove({"_id":removeModuleId});
	},

	'removeModuleFacility':function(_id,index){
		AccessManagementMaster.update({'_id':_id},
		{
			$unset:{
				['facilities.'+index]:1
			}
		});

		AccessManagementMaster.update({'_id':_id},
		{
			$pull:{
				'facilities' : null
			}
		});
	}
});