import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {PackageOrderMaster} from '/imports/admin/forms/invoice/api/packageOrderMaster.js';
import {PackageManagementMaster} from '/imports/admin/packageManagement/api/packageManagementMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {MyPracticeExamMaster} from '/imports/admin/forms/student/api/myPracticeExamMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
export const PackageQuestionPaperMaster = new Mongo.Collection("packageQuestionPaperMaster");
// export const PackageQuestionPaperMaster = new Mongo.Collection("packagequestionpapermasters");


if(Meteor.isServer){
	Meteor.publish("loginUserPackageQP",function(userId){
		return PackageQuestionPaperMaster.find({"buyerId":userId});
	});

	Meteor.methods({
		'createQuestionPaperMasterAccordingtoPackages':function(_id){
			// console.log("Inside code");
			var packageOrderMasterData = PackageOrderMaster.findOne({"_id":_id});
			if(packageOrderMasterData){
				var studentInfo = StudentMaster.findOne({'studentId':packageOrderMasterData.buyerId});
				
				var allPackages = packageOrderMasterData.packages;
				if(allPackages && studentInfo){
					var allPackagesLen = allPackages.length;
					// allPackages.map((myMackages,index)=>{
					for(var j=0; j<allPackagesLen; j++){
						var packageId = allPackages[j].packageId;
						if(packageId){
							var PMMData = PackageManagementMaster.findOne({"_id":packageId});
							if(PMMData){
								// PMMData.practicePaperID.map((practicePaperID,indexx)=>{
									var practicePaperIDArray = PMMData.practicePaperID;
									if(practicePaperIDArray){
										var practicePaperIDArrayLen = practicePaperIDArray.length;
										// console.log("practicePaperIDArrayLen",practicePaperIDArrayLen);
									
										for(var i=0;i<practicePaperIDArrayLen;i++ ){
										var practicePapId = practicePaperIDArray[i].paperID;
										// console.log('question Paper Id',practicePapId);
											if(practicePapId){
												var QuestionPaperMasterData = QuestionPaperMaster.findOne({"_id":practicePapId});
												if(QuestionPaperMasterData){
													var PackageQuestionPaperMasterDataLen = PackageQuestionPaperMaster.find({"order_id":_id,"packageId":packageId}).count();
													if(PackageQuestionPaperMasterDataLen<=practicePaperIDArrayLen){
													var id = PackageQuestionPaperMaster.insert({
														'order_id'         : _id,
														'buyerId'          : packageOrderMasterData.buyerId,
														'packageId'        : packageId,
														'packageName'      : PMMData.packageName,
														'questionPaper_id' : QuestionPaperMasterData._id,
														'questionPaperName': QuestionPaperMasterData.quePaperTitle,
														'franchiseId'      : studentInfo.franchiseId,
														'companyId'        : studentInfo.companyId,
														'studentFullName'  : studentInfo.studentFullName,
														'category'         : studentInfo.category,
														'subCategory'      : studentInfo.subCategory,	
														'createdAt'        : new Date(),											
													});
													if(id){
														for(var k=0; k<PMMData.AttemptOfPracticeTest;k++){
															PackageQuestionPaperMaster.update({"_id":id},
																{
																	$push:{
																		noOfAttempts:{
																		 // 'AtteptCount' : '',
																		 'status'      : false,
																		 'attemptedAt' : '',
																		}
																	}
																});
														}						
													}
												}//check package question paper count and packageQuestionPaperMaster count

												}
											}
									// });
									  }
								}//packageManagamenetMaster if
							}
						}
					} //package loop
					return true;
				}
			}
		},

		'updateQuestionPaperMasterAccordingtoPackages':function(qpid,urlPackageId,BtnIndex,orderId){
			var practiceExamId = MyPracticeExamMaster.findOne({"examPaperId":qpid});
			// if(practiceExamId){
			// 	var idForExam = practiceExamId.examPaperId;
			// }
			var questionPaperDetails = PackageQuestionPaperMaster.findOne({"questionPaper_id":qpid,"buyerId":Meteor.userId(),"packageId":urlPackageId,"order_id":orderId});
			
			if(questionPaperDetails){
				var PckgData = PackageManagementMaster.findOne({"_id":questionPaperDetails.packageId,"order_id":orderId});
			}
			if(PckgData){
				var attempts= PckgData.AttemptOfPracticeTest;
			}
			if(questionPaperDetails){
					PackageQuestionPaperMaster.update({"_id":questionPaperDetails._id,"order_id":orderId,"packageId":urlPackageId,"buyerId":Meteor.userId(),'questionPaper_id':qpid},
						{$set:{
							["noOfAttempts."+BtnIndex+".status"]:true,
							["noOfAttempts."+BtnIndex+".attemptedAt"]:moment().format("MMM Do YY"),
							}
						},);
			}
							
		},
		'allStudentPracticeTestDataMonthly':function(companyId,monthDateStart,monthDateToSess,studentname){	
					
		  if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
			if(studentname==''){
	  				var packagesData = PackageOrderMaster.find({"status" : "paid","franchiseId":companyId,'paymentDate':{$gte: monthDateStart,$lt: monthDateToSess}},{$sort:{"paymentDate":-1}}).fetch();
					if(packagesData){
						var packagesDataLen = packagesData.length;
						var packagePurchaseDetails = [];
						var packageQPCount = 0;
						for(var i=0; i<packagesDataLen;i++){
							var buyerId = packagesData[i].buyerId; 
							var _id = packagesData[i]._id;
							var studentName = Meteor.call("getPPStudentName",packagesData[i].buyerId);
							var packageArray = packagesData[i].packages;
							if(packageArray){
								var packageArrayLen = packageArray.length;
								for(var j=0; j<packageArrayLen;j++){
									var attemptedPackageQP = Meteor.call('attemptedPackageQuesPaper',_id,packageArray[j].packageId);
									var packageName = packageArray[j].packageName;
									var category = packageArray[j].category;
									var subCategory = packageArray[j].subCategory;
									var packageDetails = Meteor.call("getPackageDetails",packageArray[j].packageId);
									if(packageDetails){
										var packageQPCount = parseInt(packageDetails[0]) * parseInt(packageDetails[1]);
									}
									packagePurchaseDetails.push({
									'_id'                : _id,
									'buyerId'            : buyerId,
									'studentName'        : studentName,
									'catg_subCatg'       : category+'-'+subCategory,
									'packageName'        : packageName,
									'packageQPCount'     : packageQPCount,
									'attemptedPackageQP' : attemptedPackageQP,
									});
								} //for j
							} 
						}//for i
						return packagePurchaseDetails;
					}else{
						return [];
					}
		  			// var examArr=PackageQuestionPaperMaster.find({'companyId':companyId,'category':category,'createdAt':{$gte: monthDateStart,$lt: monthDateToSess}},{$sort:{'createdAt':-1}}).fetch();
		  		}else{
		  			var packagesData = PackageOrderMaster.find({"status" : "paid","franchiseId":companyId,"studentName":studentname,'paymentDate':{$gte: monthDateStart,$lt: monthDateToSess}},{$sort:{"paymentDate":-1}}).fetch();
					if(packagesData){
						// console.log("in packagesData");
						var packagesDataLen = packagesData.length;
						var packagePurchaseDetails = [];
						var packageQPCount = 0;
						for(var i=0; i<packagesDataLen;i++){
							var buyerId = packagesData[i].buyerId; 
							var _id = packagesData[i]._id;
							var studentName = Meteor.call("getPPStudentName",packagesData[i].buyerId);
							var packageArray = packagesData[i].packages;
							if(packageArray){
								var packageArrayLen = packageArray.length;
								for(var j=0; j<packageArrayLen;j++){
									var attemptedPackageQP = Meteor.call('attemptedPackageQuesPaper',_id,packageArray[j].packageId);
									var packageName = packageArray[j].packageName;
									var category = packageArray[j].category;
									var subCategory = packageArray[j].subCategory;
									var packageDetails = Meteor.call("getPackageDetails",packageArray[j].packageId);
									if(packageDetails){
										var packageQPCount = parseInt(packageDetails[0]) * parseInt(packageDetails[1]);
									}
									packagePurchaseDetails.push({
									'_id'                : _id,
									'buyerId'            : buyerId,
									'studentName'        : studentName,
									'catg_subCatg'       : category+'-'+subCategory,
									'packageName'        : packageName,
									'packageQPCount'     : packageQPCount,
									'attemptedPackageQP' : attemptedPackageQP,
									});
								} //for j
							} 
						}//for i
						return packagePurchaseDetails;
					}else{
						// console.log("in packagesData no data");

						return [];
					}
		  		}

	  	}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
	  		if(studentname==''){
	  			var packagesData = PackageOrderMaster.find({"status" : "paid","franchiseId":Meteor.userId(),'paymentDate':{$gte: monthDateStart,$lt: monthDateToSess}},{$sort:{"paymentDate":-1}}).fetch();
					if(packagesData){
						var packagesDataLen = packagesData.length;
						var packagePurchaseDetails = [];
						var packageQPCount = 0;
						for(var i=0; i<packagesDataLen;i++){
							var buyerId = packagesData[i].buyerId; 
							var _id = packagesData[i]._id;
							var studentName = Meteor.call("getPPStudentName",packagesData[i].buyerId);
							var packageArray = packagesData[i].packages;
							if(packageArray){
								var packageArrayLen = packageArray.length;
								for(var j=0; j<packageArrayLen;j++){
									var attemptedPackageQP = Meteor.call('attemptedPackageQuesPaper',_id,packageArray[j].packageId);
									var packageName = packageArray[j].packageName;
									var category = packageArray[j].category;
									var subCategory = packageArray[j].subCategory;
									var packageDetails = Meteor.call("getPackageDetails",packageArray[j].packageId);
									if(packageDetails){
										var packageQPCount = parseInt(packageDetails[0]) * parseInt(packageDetails[1]);
									}
									packagePurchaseDetails.push({
									'_id'                : _id,
									'buyerId'            : buyerId,
									'studentName'        : studentName,
									'catg_subCatg'       : category+'-'+subCategory,
									'packageName'        : packageName,
									'packageQPCount'     : packageQPCount,
									'attemptedPackageQP' : attemptedPackageQP,
									});
								} //for j
							} 
						}//for i
						return packagePurchaseDetails;
					}else{
						return [];
					}
	  			
	  		}else{
	  			var packagesData = PackageOrderMaster.find({"status" : "paid","franchiseId":Meteor.userId(),"studentName":studentname,'paymentDate':{$gte: monthDateStart,$lt: monthDateToSess}},{$sort:{"paymentDate":-1}}).fetch();
					if(packagesData){
						var packagesDataLen = packagesData.length;
						var packagePurchaseDetails = [];
						var packageQPCount = 0;
						for(var i=0; i<packagesDataLen;i++){
							var buyerId = packagesData[i].buyerId; 
							var _id = packagesData[i]._id;
							var studentName = Meteor.call("getPPStudentName",packagesData[i].buyerId);
							var packageArray = packagesData[i].packages;
							if(packageArray){
								var packageArrayLen = packageArray.length;
								for(var j=0; j<packageArrayLen;j++){
									var attemptedPackageQP = Meteor.call('attemptedPackageQuesPaper',_id,packageArray[j].packageId);
									var packageName = packageArray[j].packageName;
									var category = packageArray[j].category;
									var subCategory = packageArray[j].subCategory;
									var packageDetails = Meteor.call("getPackageDetails",packageArray[j].packageId);
									if(packageDetails){
										var packageQPCount = parseInt(packageDetails[0]) * parseInt(packageDetails[1]);
									}
									packagePurchaseDetails.push({
									'_id'                : _id,
									'buyerId'            : buyerId,
									'studentName'        : studentName,
									'catg_subCatg'       : category+'-'+subCategory,
									'packageName'        : packageName,
									'packageQPCount'     : packageQPCount,
									'attemptedPackageQP' : attemptedPackageQP,
									});
								} //for j
							} 
						}//for i
						return packagePurchaseDetails;
					}else{
						return [];
					}
	  		}
	  	}
		return examArr;
	},
	
//---------------------- get purchased package details -------------------//

	getPackageDetails(packageId){
		var packageDetailsData = PackageManagementMaster.findOne({"_id":packageId});
		if(packageDetailsData){
			return [packageDetailsData.NoOfPracticeTest,packageDetailsData.AttemptOfPracticeTest];
		}
	},
//---------------------- get package buyer Student name ------------------// 
	getPPStudentName(studentId){
		var studentData = StudentMaster.findOne({"studentId":studentId});
		if(studentData){
			return studentData.studentFullName;
		}

	},

//---------------------- attempted Package Question Paper count------------------//
	attemptedPackageQuesPaper(pom_id,packageId){
		var pqpmasterData = PackageQuestionPaperMaster.find({"order_id":pom_id,"packageId":packageId}).fetch();
		if(pqpmasterData){
			var pqpmasterDataLen = pqpmasterData.length;
			var noOfAttempts = 0;
			for(var i=0; i<pqpmasterDataLen;i++){
				var noOfAttemptsArray = pqpmasterData[i].noOfAttempts;
				if(noOfAttemptsArray){
					var count = pqpmasterData[i].noOfAttempts.filter(function(attepmtedQP){
						return attepmtedQP.status==true;
					}).length;
					noOfAttempts +=count;
				}
			}
			return noOfAttempts;
		}
	},

	'deleteDummyPaper':function(_id){
		PackageQuestionPaperMaster.remove({"_id":_id});
	},
	'getExamExist':function(pckgName){
		return PackageQuestionPaperMaster.findOne({"packageName":pckgName})||{}
	},
	
	});
}

