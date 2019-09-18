import {TempImage} from '/imports/s3/api/ClientImageCall.js';
import {ProductImage} from '/imports/s3/api/ProductImage.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
export const StudentMaster = new Mongo.Collection('studentMaster');
// export const StudentMaster = new Mongo.Collection('studentmasters');

if(Meteor.isServer){
	Meteor.publish("showAllStudent",function(){
		return StudentMaster.find({});
		
	});
	Meteor.publish("showStudentCategorywise",function(CategoryNM){
		return StudentMaster.find({'category':CategoryNM,'examStatus': 'Not Completed',});
		
	});
	Meteor.publish("singleStudent",function(id){
		return StudentMaster.find({"_id":id});
		
	});
	Meteor.publish("LoginInStudent",function(id){
		return StudentMaster.find({"studentId":id});
		
	});
	Meteor.publish("paidStudent",function(){
		return StudentMaster.find({"status":'Paid'});
		
	});
}

Meteor.methods({
	'addStudentRegistration':function(studFormValues,age){
			var TempImg = TempImage.findOne({"userId":Meteor.userId()});
			if(TempImg){
				var imgSrc = TempImg.imagePath;
				TempImage.remove({'userId':Meteor.userId()});
				Meteor.users.update(
		          { '_id': Meteor.userId() },
		          {
		            $set:{
		                "profile.userProfile"   : imgSrc,
		          } //End of set
		        }); 
			}else{
				 var userData = Meteor.users.findOne({"_id":Meteor.userId()});
			      if(userData){
			        var profileData = userData.profile;
			        if(profileData){
			          var imgSrc =  profileData.userProfile;
			        }
			        Meteor.users.update({ '_id': Meteor.userId() },
			          {
			            $set:{
			            	"profile.firstname"   : studFormValues.studentFirstName,
			                "profile.lastname"   : studFormValues.studentLastName,
			                "profile.mobNumber"   : studFormValues.mobileNumber,
			                
			          } //End of set
			        }); 
			      
				}

			}
		var categoryData = CategoryMaster.findOne({"categoryName":studFormValues.category});
		if (categoryData) {
			var subCategory = categoryData.categoryName;
			if(age<=7){
				var subCategory = subCategory+'1';
			}else if(age>7 && age<=9){
				var subCategory = subCategory+'2';
			}else if(age>9 && age<=11){
				var subCategory = subCategory+'3';
			}else if(age>11){
				var subCategory = subCategory+'4';
			}
		}
			 
		if(studFormValues._id){
			StudentMaster.update({"_id":studFormValues._id},
			{
				$set:{
					'studentFirstName'  : studFormValues.studentFirstName,
					'studentMiddleName' : studFormValues.studentMiddleName,
					'studentLastName'   : studFormValues.studentLastName,
					// 'StudParentName' : studFormValues.StudParentName,
					'mobileNumber'   : studFormValues.mobileNumber,
					'studentDOB'     : studFormValues.studentDOB,
					'studentAge'     : age,
					'schoolName'     : studFormValues.schoolName,
					'studentAddress' : studFormValues.studentAddress,
					'studentCountry' : studFormValues.studentCountry,
					'studentState'   : studFormValues.studentState,
					'studentCity'    : studFormValues.studentCity,
					'pincode'        : studFormValues.pincode,
					'category'       : studFormValues.category,
					'subCategory'    : subCategory,
					'studentEmail'   : studFormValues.studentEmail,
					'genderType'     : studFormValues.genderType,
					'imgSrc'         : imgSrc
				}
			});
		}else{
			StudentMaster.insert({
				
					'studentId'        : Meteor.userId(),
					'studentFirstName' : studFormValues.studentFirstName,
					'studentMiddleName': studFormValues.studentMiddleName,
					'studentLastName'  : studFormValues.studentLastName,
					// 'StudParentName' : studFormValues.StudParentName,
					'mobileNumber'   : studFormValues.mobileNumber,
					'studentDOB'     : studFormValues.studentDOB,
					'studentAge'     : age,
					'schoolName'     : studFormValues.schoolName,
					'studentAddress' : studFormValues.studentAddress,
					'studentCountry' : studFormValues.studentCountry,
					'studentState'   : studFormValues.studentState,
					'studentCity'    : studFormValues.studentCity,
					'pincode'        : studFormValues.pincode,
					'category'       : studFormValues.category,
					'subCategory'    : subCategory,
					'studentEmail'   : studFormValues.studentEmail,
					'genderType'     : studFormValues.genderType,
					'status'         : "UnPaid",
					'createdAt'      : new Date(),
					'imgSrc'         : imgSrc,
					'examStatus'     : 'Not Completed',
					'examFee'        : 0,
					 
			});
		}
	},

	'removeStudent':function(_id){
		StudentMaster.remove({"_id":_id});
	},
	'updateStudExamStatus':function(id){
		StudentMaster.update({"studentId":id},
		{
			$set:{
				"examStatus": "Completed",
			}
		})
	},

	'paidUnpaidStudent':function(_id){
		var studPaid = StudentMaster.findOne({"_id":_id,'status':'Paid'});
		if(studPaid){
			StudentMaster.update({"_id":_id},
			{
				$set:{
					'status' : 'Unpaid'
				}
			});
		}else{
			StudentMaster.update({"_id":_id},
			{
				$set:{
					'status' : 'Paid'
				}
			});
		}
	},
	'uploadFromDashboard':function(){
		var TempImg = TempImage.findOne({"userId":Meteor.userId()});
			if(TempImg){
				var imgSrc = TempImg.imagePath;
				TempImage.remove({'userId':Meteor.userId()});
			
				StudentMaster.update({"studentId": Meteor.userId()},
				{
					$set:{
						'imgSrc' : imgSrc
					}
				});
				Meteor.users.update(
		          { '_id': Meteor.userId() },
		          {
		            $set:{
		                "profile.userProfile"   : imgSrc,
		          } //End of set
		        });  
			}
			
	},

	'updateExamFee':function(stud_id){
		StudentMaster.update({"_id":stud_id},
		{
			$set:{
				'examFee': 200,
			}
		});
	}

});