import {mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';
// import {FranchiseDetails} from '../imports/admin/companySetting/api/CompanySettingMaster.js';
// import {StudentMaster} from '../imports/admin/forms/student/api/studentMaster.js';
// import {SMSReportMaster} from '../imports/admin/SMSManagement/api/sendSMS.js';
// import {Session} from 'meteor/session';
// import { check} from 'meteor/check';
// var contactArray=[];

export const SMSReportMaster = new Mongo.Collection('smsReportMaster');
// export const SMSReportMaster = new Mongo.Collection('smsreportmasters');

if(Meteor.isServer){
	Meteor.publish("allSMS",function(){
		return SMSReportMaster.find({});
	});
}

Meteor.methods({
	"addSMSReport":function(smsText,SuccessContactNo,FailureContactNo){
		// if(!_id){
			

			SMSReportMaster.insert({
				'smsText': smsText,				
				'SuccessContactNo':SuccessContactNo,
				'FailureContactNo':FailureContactNo,
				'SMSSentAt':new Date(),

			});
		// }else{
		// 	CategoryMaster.update({"_id":_id},{
		// 		$set:{
		// 			'categoryName': categoryName,
		// 			'NoofQuestion': NoofQuestion,
		// 			'categoryMarks': categoryMarks,
		// 		}
		// 	});
		// }
	},

	//remove Category

	'removeSMSReport':function(_id){
		SMSReportMaster.remove({"_id":_id});
	},

	'getSMSData':function(){
		return SMSReportMaster.find({},{sort: {SMSSentAt: -1}}).fetch({})
	},
	
});