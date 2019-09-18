import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {AccessManagementMaster} from './accessManagementMaster.js';
export const AccessPermissionManagement = new Mongo.Collection('accessPermissionManagement');
// export const AccessPermissionManagement = new Mongo.Collection('accesspermissionmanagements');

if(Meteor.isServer){
	Meteor.publish('allAccessPermission',function(){
		return AccessPermissionManagement.find({});
	});

Meteor.methods({

	// ------------------  assign permission to all roles and its facility. If module is not available  in this collection add module and assign permission to all role  expect---------------- // 

	'addRolesAccessPermission':function(moduleId,arrayIndex,FacilityName){
		var AccessManagementMasterData = AccessManagementMaster.findOne({"_id":moduleId}); // get module details from accessManagementMaster 
		
		if(AccessPermissionManagement){
			var moduleName = AccessManagementMasterData.moduleName; 
			var facilityArray = AccessManagementMasterData.facilities;
			if(facilityArray){
				var facilityName = facilityArray[arrayIndex].facilityName;
			} 
			var moduleId = AccessManagementMasterData._id;  
		} 

		var AccessPermissionManagementData = AccessPermissionManagement.findOne({$and:[{$or:[{'facilityPermission' : 'Active'},{'facilityPermission' : 'InActive'}]},{"moduleId":moduleId,"facilityName":FacilityName}]}); // if module exist in this collection change the facility permission.
		if(AccessPermissionManagementData){
			if(AccessPermissionManagementData.facilityPermission=="Active"){
			AccessPermissionManagement.update({"_id":AccessPermissionManagementData._id},
			{
				$set:
					{
						'facilityPermission' : 'InActive',
					}
			});
				var rolesData = Meteor.roles.find({}).fetch();
				var rolesLen = rolesData.length;
				if(rolesData){
					for(var i=0; i<rolesLen; i++){
						var rolesName = rolesData[i].name;
						if(rolesData[i].name=="Anonymous User"){
							AccessPermissionManagement.update({"_id":AccessPermissionManagementData._id},
							{
								$set:
									{
										['moduleFacilityPermission.'+i+'.'+rolesName]: 'No',
									}
							});
						}else{
							AccessPermissionManagement.update({"_id":AccessPermissionManagementData._id},
							{
								$set:
									{
										['moduleFacilityPermission.'+i+'.'+rolesName]: 'No'
											
										
									}
							});
						}
					}
				}
			}else{
				AccessPermissionManagement.update({"_id":AccessPermissionManagementData._id},
			{
				$set:
					{
						'facilityPermission' : 'Active',
					}
			});
				var rolesData = Meteor.roles.find({}).fetch();
				var rolesLen = rolesData.length;
				if(rolesData){
					for(var i=0; i<rolesLen; i++){
						var rolesName = rolesData[i].name;
						if(rolesData[i].name=="Anonymous User"){
							AccessPermissionManagement.update({"_id":AccessPermissionManagementData._id},
							{
								$set:
									{
										['moduleFacilityPermission.'+i+'.'+rolesName]: 'No',
									}
							});
						}else{
							AccessPermissionManagement.update({"_id":AccessPermissionManagementData._id},
							{
								$set:
									{
										['moduleFacilityPermission.'+i+'.'+rolesName]: 'Yes'
											
										
									}
							});
						}
					}
				}
			}
			
		}else{ 
			var lastId = AccessPermissionManagement.insert({
				'moduleName': moduleName,
				'moduleId'  : moduleId,
				'facilityName': facilityName,
				'facilityPermission': 'Active',
				'moduleFacilityPermission' : [],
				'createdAt'   : new Date(),

			});

			if(lastId){
				// var rolesData = Meteor.roles.find({name:{$nin:['Anonymous User']}}).fetch();
				var rolesData = Meteor.roles.find({}).fetch();
				var rolesLen = rolesData.length;
				if(rolesData){
					for(var i=0; i<rolesLen; i++){
						var rolesName = rolesData[i].name;
						if(rolesData[i].name=="Anonymous User"){
							AccessPermissionManagement.update({"_id":lastId},
							{
								$push:
									{
										'moduleFacilityPermission':{
											[rolesName] : 'No',
										}
									}
							});
						}else{
							AccessPermissionManagement.update({"_id":lastId},
							{
								$push:
									{
										'moduleFacilityPermission':{
											[rolesName] : 'Yes',
											'rolepermissionId' : moduleId+'-'+i,
										}
									}
							});
						}
					}
				}
			}
		}	
	},

	// ------------------  assign permission to facility. If module have not insert in this collection add module and assign permission to seleted role ---------------- // 
	'addRemoveRolePermission':function(id,facilityName,roleIndex,facilityIndex){
		var accessPermissionData = AccessPermissionManagement.findOne({"moduleId":id,"facilityName":facilityName});
		if(accessPermissionData){
			var  facilityArray = accessPermissionData.moduleFacilityPermission[roleIndex];
			var arryRoleName = Object.keys(facilityArray)[0];
			var arryRoleValue = Object.values(facilityArray)[0];
			if(arryRoleValue =='No'){
				AccessPermissionManagement.update({"moduleId":id,"facilityName":facilityName},
				{
					$set:{
						['moduleFacilityPermission.'+roleIndex+"."+arryRoleName] : 'Yes',
					}
				});
			}else{
				AccessPermissionManagement.update({"moduleId":id,"facilityName":facilityName},
				{
					$set:{
						['moduleFacilityPermission.'+roleIndex+"."+arryRoleName] : 'No',
					}
				});
			}

		}else{
			var AccessManagementMasterData = AccessManagementMaster.findOne({"_id":id});
		
			if(AccessPermissionManagement){
				var moduleName = AccessManagementMasterData.moduleName; 
				var facilityArray = AccessManagementMasterData.facilities;
				if(facilityArray){
					var facilityName = facilityArray[facilityIndex].facilityName;
				} 
				var moduleId = AccessManagementMasterData._id;  
			} 

			var lastId = AccessPermissionManagement.insert({
				'moduleName': moduleName,
				'moduleId'  : moduleId,
				'facilityName': facilityName,
				'facilityPermission': 'Active',
				'moduleFacilityPermission' : [],
				'createdAt'   : new Date(),

			});

			if(lastId){
				// var rolesData = Meteor.roles.find({name:{$nin:['Anonymous User']}}).fetch();
				var rolesData = Meteor.roles.find({}).fetch();
				var rolesLen = rolesData.length;
				if(rolesData){
					for(var i=0; i<rolesLen; i++){
						var rolesName = rolesData[i].name;
						if(rolesData[i].name=="Anonymous User"){
							AccessPermissionManagement.update({"_id":lastId},
							{
								$push:
									{
										'moduleFacilityPermission':{
											[rolesName] : 'No',
										}
									}
							});
						}else{
							AccessPermissionManagement.update({"_id":lastId},
							{
								$push:
									{
										'moduleFacilityPermission':{
											[rolesName] : 'No',
										}
									}
							});
						}
					}
				// give permission to only selected role
					var accessPermissionData = AccessPermissionManagement.findOne({"moduleId":id,"facilityName":facilityName});
					if(accessPermissionData){
						var  facilityArray = accessPermissionData.moduleFacilityPermission[roleIndex];
						var arryRoleName = Object.keys(facilityArray)[0];
						var arryRoleValue = Object.values(facilityArray)[0];
						if(arryRoleValue =='No'){
							AccessPermissionManagement.update({"moduleId":id,"facilityName":facilityName},
							{
								$set:{
									['moduleFacilityPermission.'+roleIndex+"."+arryRoleName] : 'Yes',
								}
							});
							return "addComment";
						}else{
							AccessPermissionManagement.update({"moduleId":id,"facilityName":facilityName},
							{
								$set:{
									['moduleFacilityPermission.'+roleIndex+"."+arryRoleName] : 'No',
								}
							});
						}

					}
				}
			}
		}	
	},

	// ------------------- check permission -----------------//

	'isAuthenticated':function(facilityName){
		var userData = Meteor.users.findOne({"_id":Meteor.userId()});
		if(userData){
			var userRole = userData.roles;
			 var findObj = userRole.indexOf('superAdmin');
			if(findObj>=0){
				return true;
			}else{
				var accessPermissionData = AccessPermissionManagement.findOne({"facilityName":facilityName});
				if(accessPermissionData){
					var  facilityArray = accessPermissionData.moduleFacilityPermission.filter((role)=>role.Admin);
					var arryRoleValue = facilityArray[0].Admin;
					if(arryRoleValue=="Yes"){
						return true;
					}else{
						return false;
					}
				}
			}
		}
	},


 }); 

}
