import {TempImage} from '/imports/s3/api/ClientImageCall.js';
import {ProductImage} from '/imports/s3/api/ProductImage.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import { FranchiseDetails } from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import {PackageQuestionPaperMaster} from '/imports/admin/forms/invoice/api/packageQuestionPaperMaster.js';
export const StudentMaster = new Mongo.Collection('studentMaster');
// export const StudentMaster = new Mongo.Collection('studentmasters');

if(Meteor.isServer){
	Meteor.publish("showAllStudent",function(){
		return StudentMaster.find({},{sort:{studentFirstName:1}});
		
	});
	Meteor.publish("showStudentCategorywise",function(CategoryNM,subCategory){
		return StudentMaster.find({$or:[{'category':CategoryNM,'examStatus': 'Not Completed'},{"subCategory":subCategory}]});
		
	});
	Meteor.publish("showStudentFMTwise",function(FMT){
		return StudentMaster.find({$or:[{'franchiseName':FMT},{"teacherName":FMT},{"franchiseMobileNumber":FMT}]});
		
	});
	Meteor.publish("singleStudent",function(){
		return StudentMaster.find({"studentId":Meteor.userId()});
		
	});
	Meteor.publish("StudentId",function(StudentID){
		return StudentMaster.find({"studentId":StudentID});
		
	});
	Meteor.publish("LoginInStudent",function(id){
		return StudentMaster.find({"studentId":id});
		
	});
	Meteor.publish("paidStudent",function(){
		return StudentMaster.find({"status":'Paid'});
		
	});
	Meteor.publish('allPaidStudCount', function() {
	  Counts.publish(this, 'allPaidStudCount', StudentMaster.find({"status":"Paid"}));
	});
	Meteor.publish('allUnPaidStudCount', function() {
	  Counts.publish(this, 'allUnPaidStudCount', StudentMaster.find({"status":"UnPaid"}));
	});
	Meteor.publish("unPaidStudent",function(){
		return StudentMaster.find({"status":'UnPaid'});
		
	});
	Meteor.publish("todaysStudRegistraion",function(){
		 Counts.publish(this, 'todaysStudRegistraion', StudentMaster.find({}));
		
	});
	Meteor.publish("franchiseStudentRegistration",function(){
     	Counts.publish(this, 'franchiseStudentRegistration', StudentMaster.find({"franchiseId":Meteor.userId()}));
  });
	// Meteor.publish("franchiseStudCnt",function(companyId){
	// 	 Counts.publish(this, 'franchiseStudCnt', StudentMaster.find({"companyId":companyId}));
		
	// });
	Meteor.publish("showFranchiseStudent",function(companyId){
		return StudentMaster.find({"companyId":companyId});
	});

	Meteor.publish("PaidStudentStatus",function(){
		return StudentMaster.find({"studentId":Meteor.userId()});		
	});
}

Meteor.methods({


	// 'addStudentRegistration':function(studFormValues,age,res){
	'addStudentRegistration':function(studFormValues,age,studUserId){
		
			var franchiseData = FranchiseDetails.findOne({"companyId":parseInt(studFormValues.companyId)});
			if(franchiseData){
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
				 var userData = Meteor.users.findOne({"_id":studUserId});
			      if(userData){
			        var profileData = userData.profile;
			        if(profileData){
			          var imgSrc =  profileData.userProfile;
			        }
			        Meteor.users.update({ '_id': studUserId },
			          {
			            $set:{
			            	"profile.firstname"   : studFormValues.studentFirstName,
			                "profile.lastname"   : studFormValues.studentLastName,
			                "profile.fullName"   : studFormValues.studentFirstName+' '+studFormValues.studentLastName,
			                "profile.mobNumber"   : studFormValues.mobileNumber,
			                "profile.franchiseName"   : studFormValues.franchiseName,
			                "profile.franchise_id"   : franchiseData.franchiseCodeForCompanyId,
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
						'studentFirstName'  		: studFormValues.studentFirstName,
						'studentMiddleName' 		: studFormValues.studentMiddleName,
						'studentLastName'   		: studFormValues.studentLastName,
						'studentFullName'   		: studFormValues.studentFirstName+' '+studFormValues.studentMiddleName+ ' '+studFormValues.studentLastName,
						'mobileNumber'   			: studFormValues.mobileNumber,
						'studentDOB'     			: studFormValues.studentDOB,
						'studentAge'     			: age,
						'schoolName'     			: studFormValues.schoolName,
						'franchiseName'  			: studFormValues.franchiseName,
						'companyId'    				: parseInt(studFormValues.companyId),
						'franchiseId'               : franchiseData.franchiseCodeForCompanyId,
						'franchiseMobileNumber' 	: studFormValues.franchiseMobileNumber,
						'studentAddress' 			: studFormValues.studentAddress,
						'studentCountry' 			: studFormValues.studentCountry,
						'studentState'   			: studFormValues.studentState,
						'studentCity'    			: studFormValues.studentCity,
						'pincode'        			: studFormValues.pincode,
						'category'       			: studFormValues.category,
						'subCategory'    			: subCategory,
						'studentEmail'   			: studFormValues.studentEmail,
						'genderType'     			: studFormValues.genderType,
						'imgSrc'         			: imgSrc
					}
				});
			}else{
				StudentMaster.insert({
					
						'studentId'        			: studUserId,
						'studentFirstName' 			: studFormValues.studentFirstName,
						'studentMiddleName'			: studFormValues.studentMiddleName,
						'studentLastName'  			: studFormValues.studentLastName,
						'studentFullName'   		: studFormValues.studentFirstName+' '+studFormValues.studentMiddleName+' '+studFormValues.studentLastName,
						'mobileNumber'   			: studFormValues.mobileNumber,
						'studentDOB'     			: studFormValues.studentDOB,
						'studentAge'     			: age,
						'schoolName'     			: studFormValues.schoolName,
						'franchiseName'  			: studFormValues.franchiseName,
						'companyId'   	 			: parseInt(studFormValues.companyId),
						'franchiseId'               : studFormValues.franchiseUserId,
						'franchiseMobileNumber'  	: studFormValues.franchiseMobileNumber,
						'studentAddress' 			: studFormValues.studentAddress,
						'studentCountry' 			: studFormValues.studentCountry,
						'studentState'   			: studFormValues.studentState,
						'studentCity'    			: studFormValues.studentCity,
						'pincode'        			: studFormValues.pincode,
						'category'       			: studFormValues.category,
						'subCategory'    			: subCategory,
						'studentEmail'   			: studFormValues.studentEmail,
						'genderType'     			: studFormValues.genderType,
						'createdAt'      			: new Date(),
						'imgSrc'         			: imgSrc,
						 
				});
			}
		}else{
			return 'franchiseUserIdNotFound';
		}	
	},

	'allStudentCategoryWise':function(franchiseId){
		 return StudentMaster.find({'franchiseId':franchiseId},{sort:{'createdAt':-1}}).fetch();
	},
	'allStudentCategoryWiseListOfFranchise':function(franchiseId){
		 return StudentMaster.find({'franchiseId':franchiseId},{sort:{'createdAt':-1},fields:{"category":1,"mobileNumber":1,"studentId":1,"subCategory":1,"studentFullName":1}}).fetch();
	},

	'SearchStudentCategoryWiseListOfFranchise':function(franchiseId,studName){
		return StudentMaster.find({'franchiseId':franchiseId,'studentFullName': studName},{sort:{'createdAt':-1},fields:{"category":1,"mobileNumber":1,"studentId":1,"subCategory":1,"studentFullName":1}}).fetch();
	},

	'updateStudentNotificationStatus':function(){
		StudentMaster.update({"studentId":Meteor.userId()},
		{
			$set:{
				'notificationStatus':'Unread',
			}
		});

	},

	'updateStudentNotificationStatusToRead':function(){
		StudentMaster.update({"studentId":Meteor.userId()},
		{
			$set:{
				'notificationStatus':'Read',
			}
		});

	},

	'updateStudentNotificationDownTimeStatus':function(){
		StudentMaster.update({"studentId":Meteor.userId()},
		{
			$set:{
				'downTimeStatus':'Unread',				
			}
		});

	},

	'updateStudentDownTimeStatusStatusToRead':function(){
		StudentMaster.update({"studentId":Meteor.userId()},
		{
			$set:{
				'downTimeStatus':'Read',
			}
		});

	},


	'updateStudentInfo':function(stud_id,formValues){
		var userInfo=Meteor.users.findOne({"_id":stud_id});	
		if(userInfo){
			var userProfileInfo=userInfo.profile;
			if(userProfileInfo){
				var imgSrcLink=userProfileInfo.userProfile;
			}
		}
		StudentMaster.update({"studentId":stud_id},
		{
			$set:{
				'studentFirstName': formValues.firstname,
				'studentLastName':formValues.lastname ,				
				'mobileNumber': formValues.mobNumber,
				'updatedAt' :	new Date(),	
				'imgSrc':imgSrcLink ,		
			}
		});
	},
	
	'SearchStudentCategoryWise':function(franchiseId,studName){
		return StudentMaster.find({'franchiseId':franchiseId,'studentFullName': studName},{sort:{'createdAt':-1}}).fetch();
	},

	'franchiseWiseStudentList':function(franchiseFNMNTN){
			return StudentMaster.find({$or:[{'franchiseName':franchiseFNMNTN},{'teacherName':franchiseFNMNTN},{'franchiseMobileNumber':franchiseFNMNTN}]},{sort:{'createdAt':-1}}).fetch();
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

	'AllowStudentProfileUpdate':function(id){
		// console.log("idd---->",id);
		StudentMaster.update({"studentId":id},
		{
			$set:{
				"profileEditStatus": "Active",
			}
		})
	},

	'DontAllowStudentProfileUpdate':function(id){
		// console.log("idd---->",id);
		StudentMaster.update({"studentId":id},
		{
			$set:{
				"profileEditStatus": "Blocked",
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
	},

	'updateAllStudentReadStatus':function(){
		StudentMaster.update({"category":{$regex:"."}},
		{
			$set:{
				'downTimeStatus': "Unread",
			}
		},{
			multi:true
		});
	},

	'allStudent':function(){
		 return StudentMaster.find({},{sort: {createdAt: -1}}).fetch();

	},
	
	'SearchStudent':function(studName){
		return StudentMaster.find({$or:[{'studentFirstName':studName},{'mobileNumber':studName},{'franchiseName':studName},{'studentEmail': studName}]}).fetch();

	},

	//------------------ Student registration Report --------------------//

	'getCategoryWiseTodayStudReg':function(ID,category,startDate,endDate){
		return	StudentMaster.find({'franchiseId':ID, 'category':category,'createdAt':{$gte : startDate, $lt : endDate }}, {sort: {'createdAt': -1},fields:{"franchiseName":1,"studentId":1,"studentFirstName":1,"studentLastName":1,"studentEmail":1,"mobileNumber":1,"category":1}}).fetch();
	},

	'getCategoryWiseTodaySearchStudReg':function(id,category,startDate,endDate,studName){
		var allCategoryWiseStudent = StudentMaster.find({$and:[{$or:[{'category':category},{'franchiseId':id}]},{"studentFullName":studName,'createdAt':{$gte : startDate, $lt : endDate }}]}, {sort: {'createdAt': -1},fields:{"franchiseName":1,"studentId":1,"studentFirstName":1,"studentLastName":1,"studentEmail":1,"mobileNumber":1,"category":1}}).fetch();
		if(allCategoryWiseStudent){
			return allCategoryWiseStudent;
		}
	},

	'getFranchiseName':function(studentId){
		var studData = StudentMaster.findOne({"studentId":studentId});	
		if(studData){		
			return studData.franchiseName;
		}
	},
	'deleteStudent':function(id){
		StudentMaster.remove({"_id":id});
	},

	//--------------------- get month wise student registrations count for graph ----------------//

	'getMonthWiseRegistrationCount':function(){
		var monthRegArrayCnt = [];
  		var date  = new Date();
		for(var i=0; i<=11;i++){
		    var monthFirstDate = new Date(date.getFullYear(), i, 1); // get 1st date of month starting from january e.g(01/01/2018)
		    var nextMonthStartDate =  new Date(date.getFullYear(), i+1, 0); // get last date of month starting from january e.g(31/01/2018)
		   	var monthwiseRegCnt=  StudentMaster.find({'createdAt':{$gte : monthFirstDate, $lt : nextMonthStartDate }}, {sort: {'createdAt': -1}}).count();
		    monthRegArrayCnt.push(monthwiseRegCnt);
		}
		return monthRegArrayCnt
	},

	//-------------------- franchise student registration ------------------//

	'getFranchiseMonthWiseRegistrationCount':function(){
		var monthRegArrayCnt = [];
  		var date  = new Date();
		for(var i=0; i<=11;i++){
		    var monthFirstDate = new Date(date.getFullYear(), i, 1); // get 1st date of month starting from january e.g(01/01/2018)
		    var nextMonthStartDate =  new Date(date.getFullYear(), i+1, 0); // get last date of month starting from january e.g(31/01/2018)
		   	var monthwiseRegCnt=  StudentMaster.find({'franchiseId':Meteor.userId(),'createdAt':{$gte : monthFirstDate, $lt : nextMonthStartDate }}, {sort: {'createdAt': -1}}).count();
		   monthRegArrayCnt.push(monthwiseRegCnt);
		}
		return monthRegArrayCnt
	},
	'setCompetitionPaymentStatus':function(){
		StudentMaster.update({"studentId":Meteor.userId()},
		{
			$set:{
				'competitionPaymentStatus': "paid",
			}
		});
	},
	'setCompetitionPaymentStatusManually':function(studId){
		StudentMaster.update({"studentId":studId},
		{
			$set:{
				'competitionPaymentStatus': "paid",
			}
		});
	},
	'resetCompetitionPaymentStatus':function(){
		StudentMaster.update({"studentId":Meteor.userId()},
		{
			$set:{
				'competitionPaymentStatus': "unPaid",
			}
		});
	},
	

});