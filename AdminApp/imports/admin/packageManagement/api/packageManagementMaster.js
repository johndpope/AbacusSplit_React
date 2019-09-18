
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {Session} from 'meteor/session';
import { check} from 'meteor/check';
import {PackageOrderMaster} from '/imports/admin/forms/invoice/api/packageOrderMaster.js';

export const PackageManagementMaster = new Mongo.Collection('packageManagementMaster');
// export const PackageManagementMaster = new Mongo.Collection('packagemanagementmasters');

if(Meteor.isServer){
	Meteor.publish("packageManagementData",function(){
		return PackageManagementMaster.find({});
	});
	
	Meteor.publish("packageData",function(id){
		return PackageManagementMaster.find({'_id':id});
	});

	Meteor.publish("checkExistInPackage",function(paperId){
		return PackageManagementMaster.find({"practicePaperID.paperID":paperId});
	});

	Meteor.publish("allPackagesCount",function(){
		Counts.publish(this, 'allPackagesCount', PackageManagementMaster.find({}));
	});

Meteor.methods({
	'createPackage':function(packageValues,_id){
			if(_id){
				PackageManagementMaster.update({"_id":_id},
					{
						$set:{
							'packageName'           : packageValues.packageName,
							'categoryName'          : packageValues.categoryName,
							'subCategory'           : packageValues.subCategory,
							'NoOfPracticeTest'      : packageValues.NoOfPracticeTest,
							'AttemptOfPracticeTest' : packageValues.AttemptOfPracticeTest,
							'PackagePrice'          : parseFloat(packageValues.PackagePrice),
							// 'GST'                : packageValues.GST,
							'Description'           : packageValues.Description,
							'practicePaperID'       : packageValues.practicePaperID,
							'packageStatus'         : packageValues.packageStatus,
						}
					}
				);
			
		}else{
			
			var id = PackageManagementMaster.insert({
							'packageName'           : packageValues.packageName,
							'categoryName'          : packageValues.categoryName,
							'subCategory'           : packageValues.subCategory,
							'NoOfPracticeTest'      : packageValues.NoOfPracticeTest,
							'AttemptOfPracticeTest' : packageValues.AttemptOfPracticeTest,
							'PackagePrice'          : parseFloat(packageValues.PackagePrice),
							// 'GST'                   : packageValues.GST,
							'practicePaperID'       : packageValues.practicePaperID,
							'Description'           : packageValues.Description,
							'createdAt'     : new Date(),
							'packageStatus'         : packageValues.packageStatus,
			});
			return id;
		}
	},

	'removePackage':function(_id){
		PackageManagementMaster.remove({"_id":_id});
	},
	
	'removeEmptyPackage':function(){
		PackageManagementMaster.remove({'packageStatus':'NotCreated'},{multi: true});
	},

	'allPackage':function(){
		return PackageManagementMaster.find({},{sort: {createdAt: -1}}).fetch();
	},
	
	'SearchPackage':function(studName){
		return PackageManagementMaster.find({$or:[{'packageName':studName},{'categoryName':studName},{'subCategory':studName}]}).fetch();
	},
	
	'allPackages':function(){
		var allPackageData =  PackageManagementMaster.find({},{$sort:{"createdAt":1}}).fetch();
		if(allPackageData){
			var allPackages = allPackageData.map((packages,index)=>{
				return packages.packageName;
			});
			return allPackages;
		}
	},

	'allPackages':function(){
		var allPackageData =  PackageManagementMaster.find({},{$sort:{"createdAt":1}}).fetch();
		if(allPackageData){
			var allPackages = allPackageData.map((packages,index)=>{
				return packages.packageName;
			});
			return allPackages;
		}
	},
	
	'packagePurchageCnt':function(){
		var allPackageData =  PackageManagementMaster.find({},{$sort:{"createdAt":1}}).fetch();
		if(allPackageData){
			var allPackageDataLen = allPackageData.length;
			var packagePurchaseCntArray = [];
			for(var i=0; i<allPackageDataLen;i++){
				var packageOrderCnt = PackageOrderMaster.find({"packages.packageId":allPackageData[i]._id,'status':'paid'}).count();
				packagePurchaseCntArray.push(packageOrderCnt);
			}
			return packagePurchaseCntArray;
		}
	}


  })
}












