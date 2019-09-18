import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {QuickWalletMaster} from '/imports/admin/configuration/api/quickWalletMaster.js';
import {CompetitionRegisterOrder} from '/imports/student/api/competitionRegisterOrder.js';
// import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';

export const ExamMaster = new Mongo.Collection('examMaster');
// export const ExamMaster = new Mongo.Collection('exammasters');

if(Meteor.isServer){
Meteor.publish("showAllExam",function(){
	return ExamMaster.find({});

});
Meteor.publish("singleCompetition",function(id){
	return ExamMaster.find({"_id":id});

});
Meteor.publish("categoryWiseExam",function(category){
	return ExamMaster.find({"category":category});

});
Meteor.publish("assignedExam",function(category){
	return ExamMaster.find({"status":"Assigned",});

});
Meteor.publish("lastExam",function(category,subCategory){
	return ExamMaster.find({"category":category,"subCategory":subCategory},{$sort:{"competitionDate":-1}});
});
Meteor.publish("latestCompetition",function(){	
	return ExamMaster.find({},{$sort:{"competitionDate":-1}});
});
Meteor.publish("startCompetition",function(){	
	return ExamMaster.find({"competitionStatus" : "start"});
});

}

Meteor.methods({
	
	// 'addCompetitionDetails':function(competitionName){
	// 	var examId = ExamMaster.insert({
	// 		'competitionName' : competitionName,
	// 		'competitionExams': [], 
	// 	},function(err,res){
	// 		if(err){}else{}
	// 	});
	// 	return examId;
	// },

	'addCompetitionMoreDetails':function(competitionFormValues){
		// var sameDateExam = ExamMaster.findOne({"competitionDate":new Date(competitionFormValues.competitionDate)});
		// if(sameDateExam){
		// 	return 'sameDateNotAllowed';
		// }else{
			if(competitionFormValues.competition_id){

				var startExamData=ExamMaster.findOne({"_id":competitionFormValues.competition_id});
				if(startExamData){
					var examStartStatus=startExamData.competitionStatus;
					if(examStartStatus=="stop"){
						ExamMaster.update({"_id":competitionFormValues.competition_id},
						{
							$set:{
								"competitionName"  : competitionFormValues.competitionName,
								"competitionDate"  :  new Date(competitionFormValues.competitionDate),
								"startTime"   : competitionFormValues.startTime,
								"endTime"     : competitionFormValues.endTime,
								"competitionFees" : competitionFormValues.competitionFees,
								"franchiseShare" : competitionFormValues.franchiseShare,
								"maatsShare"     : parseInt(competitionFormValues.competitionFees)-parseInt(competitionFormValues.franchiseShare),
								"termsCondition" : competitionFormValues.termsCondition,
								"createdAt"       : new Date(),
								"competitionStatus" : "stop",
							}

						});
					}else{
						return 'competitionStarted';
					}

				}

				// ExamMaster.update({"_id":competitionFormValues.competition_id},
				// {
				// 	$set:{
				// 		"competitionName"  : competitionFormValues.competitionName,
				// 		"competitionDate"  :  new Date(competitionFormValues.competitionDate),
				// 		"startTime"   : competitionFormValues.startTime,
				// 		"endTime"     : competitionFormValues.endTime,
				// 		"competitionFees" : competitionFormValues.competitionFees,
				// 		"franchiseShare" : competitionFormValues.franchiseShare,
				// 		"maatsShare"     : parseInt(competitionFormValues.competitionFees)-parseInt(competitionFormValues.franchiseShare),
				// 		"termsCondition" : competitionFormValues.termsCondition,
				// 		"createdAt"       : new Date(),
				// 		"competitionStatus" : "stop",
				// 	}

				// });


			}else{

				var sameDateExam = ExamMaster.findOne({"competitionDate":new Date(competitionFormValues.competitionDate)});
				if(sameDateExam){
					return 'sameDateNotAllowed';
				}else{
					var examId = ExamMaster.insert({
						"competitionName"  : competitionFormValues.competitionName,
						"competitionDate"  :  new Date(competitionFormValues.competitionDate),
						"startTime"   : competitionFormValues.startTime,
						"endTime"     : competitionFormValues.endTime,
						"competitionFees" : competitionFormValues.competitionFees,
						"franchiseShare" : competitionFormValues.franchiseShare,
						"maatsShare"     : parseInt(competitionFormValues.competitionFees)-parseInt(competitionFormValues.franchiseShare),
						"termsCondition" : competitionFormValues.termsCondition,
						"createdAt"       : new Date(),
						"competitionStatus" : "stop",
					});
					return examId;
				}
			}
		
	},

	'addQPInCompetition':function(QPId,competitionId){
		var examMasterData = ExamMaster.findOne({"_id":competitionId,"competitionExams.questionPaperId":QPId});
		if(examMasterData){
			ExamMaster.update({"_id":competitionId},
				{
					$pull:{
						"competitionExams":{
							"questionPaperId":QPId,
						}
					}
			});
		}else{
			var questionPaperMasterData = QuestionPaperMaster.findOne({"_id" : QPId});
			if(questionPaperMasterData){
				ExamMaster.update({"_id":competitionId},
					{
					$push:{
						'competitionExams':{
							"questionPaperId" : QPId,
							"category"    : questionPaperMasterData.category, 
							"subCategory" : questionPaperMasterData.subCategory,
							"paperTitle" : questionPaperMasterData.quePaperTitle,
							"examDuration" : questionPaperMasterData.examTime,
							"totalMarks" : questionPaperMasterData.totalMarks,
							"marksPerQuestion": questionPaperMasterData.marksPerQues,
							"examStatus" : "stop",
						}
					}
				});
			}
		}
	},

	'allCompetitions':function(){
	  	return ExamMaster.find({"competitionView":"Show"},{fields:{"competitionName":1,"competitionView":1}}).fetch(); 
	},
	'allCompetitionsResult':function(){
	  	return ExamMaster.find({"result":"Declared"},{fields:{"competitionName":1,"competitionView":1}}).fetch(); 
	},

	'getCompetitionDeclareStatus':function(id){
		return ExamMaster.findOne({"_id":id},{fields:{"result":1}}); 
	},
	  
	  // Remove competition from collection.

	'removeExam':function(_id){
		var regForCompetition = CompetitionRegisterOrder.findOne({'competitionId':_id,'status':'paid'});
		if(regForCompetition){
			return 'regForCompetiton';
		}else{
			ExamMaster.remove({"_id":_id});
		}
	},

	// Update exam status 
		// 'ExamStatus':function(_id){
		// 	var examData = ExamMaster.findOne({"_id":_id,'status':'Assigned'});
		// 	if(examData){
		// 		ExamMaster.update({"_id":_id},
		// 		{
		// 			$set:{
		// 				'status' : 'Not Assigned'
		// 			}
		// 		});
		// 	}else{
		// 		ExamMaster.update({"_id":_id},
		// 		{
		// 			$set:{
		// 				'status' : 'Assigned'
		// 			}
		// 		});
		// 	}
		// },
		'examFinished':function(_id){
			ExamMaster.update({"_id":_id},
			{
				$set:{
					'status': "Complete",
				}
			});

			ExamMaster.update({"_id":_id},
			{
				$set:{
					'competitionStatus': "stop",
				}
			});
		},
		'examYettoStart':function(_id){
			var examMasterData = ExamMaster.findOne({"_id":_id});
			if(examMasterData){
				var competitionStatus = examMasterData.competitionStatus;
				var competitionDate = examMasterData.competitionDate;
				var curDate = new Date();
				if(competitionStatus == "start"){
					ExamMaster.update({"_id":_id},
							{
								$set:{
									'competitionStatus': 'stop',
									
								}
							});
					return "changeExamStatus";
				}else{
				if(moment(competitionDate).format("MM/DD/YYYY") != moment(curDate).format("MM/DD/YYYY")){
					return 'dateisnotTodaysDate';
				}else{
						if(competitionStatus=="stop"){
							ExamMaster.update({"_id":_id},
							{
								$set:{
									'competitionStatus': 'start',
									
								}
							});

						}else{
							ExamMaster.update({"_id":_id},
							{
								$set:{
									'competitionStatus': 'stop',
									
								}
							});
						}
					}
				}
			}
			
		},

		'examNotYetStart':function(_id){
			ExamMaster.update({"_id":_id},
			{
				$set:{
					'competitionStatus': "Not yet conducted",
				}
			});
		},

		'declaredExamResult':function(examId){
			var isDeclared = ExamMaster.findOne({"_id":examId,'result': 'Declared'});
			if(isDeclared){
				ExamMaster.update({"_id":examId},
				{
					$set:{
						'result': 'Not Declared',
					}
				});
				return "examNotDeclared";
			}else{
				ExamMaster.update({"_id":examId},
				{
					$set:{
						'result': 'Declared',
					}
				});

				return "Declared";
			}
		},


		paymentGatewayforCompetition: function (competitionFees,comp_id,QPID) {
			// console.log("in payment gateway",competitionFees,comp_id,QPID);
		    Meteor.call("applyForCompetition",competitionFees,comp_id,QPID);
		    var userId       = Meteor.userId();
		    var userObj      = Meteor.users.findOne({"_id":userId});
		    var mobileNumber = userObj.profile.mobNumber;
		    var QWCredential = QuickWalletMaster.findOne({});
		    if(QWCredential){
			    if(QWCredential.environment=="production"){
			    	var API = QWCredential.prodAPI;
			    	var partnerid = QWCredential.prodKey;
			    	var secret    = QWCredential.prodSecret;
			    }else{
			    	var API       = QWCredential.sandboxAPI;
			    	var partnerid = QWCredential.sandboxKey;
			    	var secret    = QWCredential.sandboxSecret;
			    }
			    var quickWalletInput = {
			    		   "partnerid" : partnerid,
			               "mobile"   :   mobileNumber,
			               "secret"   :   secret,
			               "amount"   :    competitionFees,
			               "redirecturl" : Meteor.absoluteUrl()+'payment-response/'+userId+'/'+comp_id,             
			    };
			    try {
			      if (Meteor.isServer) {
			        var result = HTTP.call("POST", API+"/api/partner/"+quickWalletInput.partnerid+"/requestpayment",
			                               {params: quickWalletInput});
			        if(result.data.status == 'success'){
			          var paymentUrl = result.data.data.url;
			          return paymentUrl;
			        }else{
			          return false;
			        }
			      }
			    } catch (err) {
			      console.log(err)
			      // Got a network error, time-out or HTTP error in the 400 or 500 range.
			      return false;
			    }
			}
		  },

		  getCompetitionExams(compId){
		  	// return ExamMaster.findOne({"_id":compId});
		  	// var categoeyWiseExam = ExamMaster.findOne({"_id":compId}, {$sort:{"competitionExams.category": 1}});
		  	var competitionExams = ExamMaster.findOne({"_id":compId}).competitionExams;
		  	if(competitionExams){
			  	var x =  _.sortBy(competitionExams, function(exams){ return exams.category && exams.subCategory; });
			  	if(x){
			  	
			  	return x;
			  }
		  	}
		  },

		  updateExamStatusStartStop(compId,questionPaperId){
		  	var compExam = ExamMaster.findOne({"_id":compId});
		  	if(compExam){
		  		var ExamArray = compExam.competitionExams;
		  		var index = ExamArray.findIndex(examArray => examArray.questionPaperId == questionPaperId);
		  		if(index>=0){
			  		var updateExamArray = compExam.competitionExams[index];
			  		if(compExam.competitionStatus =="start"){
				  		if(updateExamArray.examStatus == "stop"){
				  			ExamMaster.update({"_id":compId, competitionExams:{$elemMatch:{'questionPaperId':questionPaperId}}},
				  				{
				  					$set:
					  					{
					  						'competitionExams.$.examStatus':"start"
					  					}
				  				});
				  			return "start";
				  		}
				  		else{
				  			ExamMaster.update({"_id":compId,competitionExams:{$elemMatch:{"questionPaperId":questionPaperId}}},
				  				{
				  					$set:
					  					{
					  						'competitionExams.$.examStatus':"stop"
					  					}
				  				});
				  			return "stop";
				  		}
			  		}else{
			  			return 'startCompetitionFirst';
			  		}
		  		}
		  	}
		  }

});



// import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
// import {QuickWalletMaster} from '/imports/admin/configuration/api/quickWalletMaster.js';

// export const ExamMaster = new Mongo.Collection('examMaster');

// if(Meteor.isServer){
// Meteor.publish("showAllExam",function(){
// return ExamMaster.find({});

// });
// Meteor.publish("singleCompetition",function(id){
// return ExamMaster.find({"_id":id});

// });
// Meteor.publish("categoryWiseExam",function(category){
// return ExamMaster.find({"category":category});

// });
// Meteor.publish("assignedExam",function(category){
// return ExamMaster.find({"status":"Assigned",});

// });
// Meteor.publish("lastExam",function(category,subCategory){
// return ExamMaster.find({"category":category,"subCategory":subCategory},{$sort:{"examDate":-1}});
// });
// Meteor.publish("latestCompetition",function(){
// return ExamMaster.find({},{$sort:{"competitionDate":-1}});
// });
// }

// Meteor.methods({
	
// 	'addCompetitionDetails':function(competitionName){
// 		var examId = ExamMaster.insert({
// 			'competitionName' : competitionName,
// 			'competitionExams': [], 
// 		},function(err,res){
// 			if(err){}else{}
// 		});
// 		return examId;
// 	},

// 	'addCompetitionMoreDetails':function(competitionFormValues){
// 		ExamMaster.update({"_id":competitionFormValues.competition_id},
// 		{
// 			$set:{
// 				"competitionName"  : competitionFormValues.competitionName,
// 				"competitionDate"  : competitionFormValues.competitionDate,
// 				"startTime"   : competitionFormValues.startTime,
// 				"endTime"     : competitionFormValues.endTime,
// 				"competitionFees" : competitionFormValues.competitionFees,
// 				"franchiseShare" : competitionFormValues.franchiseShare,
// 				"termsCondition" : competitionFormValues.termsCondition,
// 				"createdAt"       : new Date(),
// 				"competitionDateFormat": new Date(competitionFormValues.competitionDate),
// 				"status"    : "Not Assigned",
// 				// "competition"      : "Completed",
// 				"competitionStatus" : "Not Yet Conduct",
// 			}

// 		});
// 	},

// 	'addQPInCompetition':function(QPId,competitionId){
// 		var examMasterData = ExamMaster.findOne({"_id":competitionId,"competitionExams.questionPaperId":QPId});
// 		if(examMasterData){
// 			ExamMaster.update({"_id":competitionId},
// 				{
// 					$pull:{
// 						"competitionExams":{
// 							"questionPaperId":QPId,
// 						}
// 					}
// 			});
// 		}else{
// 			var questionPaperMasterData = QuestionPaperMaster.findOne({"_id" : QPId});
// 			if(questionPaperMasterData){
// 				ExamMaster.update({"_id":competitionId},
// 					{
// 					$push:{
// 						'competitionExams':{
// 							"questionPaperId" : QPId,
// 							"category"    : questionPaperMasterData.category, 
// 							"subCategory" : questionPaperMasterData.subCategory,
// 							"paperTitle" : questionPaperMasterData.quePaperTitle,
// 							"examTime"   : questionPaperMasterData.examTime,
// 							// "paperName"  : questionPaperMasterData._id,
// 							"totalMarks" : questionPaperMasterData.totalMarks,
// 							"marksPerQuestion": questionPaperMasterData.marksPerQues,
// 							"examStatus" : "stop",
// 						}
// 					}
// 				});
// 			}
// 		}
// 	},

// 	'allCompetitions':function(){
// 	  	return ExamMaster.find({}).fetch(); 
// 	  },
	  
// 	  // Remove competition from collection.

// 	'removeExam':function(_id){
// 			ExamMaster.remove({"_id":_id});
// 	},

// 	// Update exam status 
// 		'ExamStatus':function(_id){
// 			var examData = ExamMaster.findOne({"_id":_id,'status':'Assigned'});
// 			if(examData){
// 				ExamMaster.update({"_id":_id},
// 				{
// 					$set:{
// 						'status' : 'Not Assigned'
// 					}
// 				});
// 			}else{
// 				ExamMaster.update({"_id":_id},
// 				{
// 					$set:{
// 						'status' : 'Assigned'
// 					}
// 				});
// 			}
// 		},
// 		'examFinished':function(_id){
// 			ExamMaster.update({"_id":_id},
// 			{
// 				$set:{
// 					'status': "Complete",
// 				}
// 			});

// 			ExamMaster.update({"_id":_id},
// 			{
// 				$set:{
// 					'examStatus': "Exam has been finished",
// 				}
// 			});
// 		},
// 		'examYettoStart':function(_id){
// 			var examMasterData = ExamMaster.findOne({"_id":_id});
// 			if(examMasterData){
// 				var examStatus = examMasterData.examStatus;
// 				var examDate = examMasterData.competitionDate;
// 				var curDate = new Date();
// 				if(examStatus == "Exam has been started"){
// 					ExamMaster.update({"_id":_id},
// 							{
// 								$set:{
// 									'status': "Complete",
// 									'examStatus': 'Exam has been finished',
									
// 								}
// 							});
// 					return "changeExamStatus";
// 				}else{
// 				if(examDate != moment(curDate).format("MM/DD/YYYY")){
// 					return 'dateisnotTodaysDate';
// 				}else{
// 						if(examStatus=="Exam has been finished"){
// 							ExamMaster.update({"_id":_id},
// 							{
// 								$set:{
// 									'status' : 'Assigned',
// 									'examStatus': 'Exam has been started',
									
// 								}
// 							});

// 						}else{
// 							ExamMaster.update({"_id":_id},
// 							{
// 								$set:{
// 									'status': "Complete",
// 									'examStatus': 'Exam has been finished',
									
// 								}
// 							});
// 						}
// 					}
// 				}
// 			}
			
// 		},

// 		'examNotYetStart':function(_id){
// 			ExamMaster.update({"_id":_id},
// 			{
// 				$set:{
// 					'examStatus': "Not yet conducted",
// 				}
// 			});
// 		},

// 		'declaredExamResult':function(examId){
// 			var isDeclared = ExamMaster.findOne({"_id":examId,'result': 'Declared'});
// 			if(isDeclared){
// 				ExamMaster.update({"_id":examId},
// 				{
// 					$set:{
// 						'result': 'Not Declared',
// 					}
// 				});
// 				return "examNotDeclared";
// 			}else{
// 				ExamMaster.update({"_id":examId},
// 				{
// 					$set:{
// 						'result': 'Declared',
// 					}
// 				});

// 				return "Declared";
// 			}
// 		},


// 		paymentGatewayforCompetition: function (competitionFees,comp_id,QPID) {
// 		    Meteor.call("applyForCompetition",competitionFees,comp_id,QPID);
// 		    var userId       = Meteor.userId();
// 		    var userObj      = Meteor.users.findOne({"_id":userId});
// 		    var mobileNumber = userObj.profile.mobNumber;
// 		    var QWCredential = QuickWalletMaster.findOne({});
// 		    if(QWCredential){
// 			    if(QWCredential.environment=="production"){
// 			    	var API = QWCredential.prodAPI;
// 			    	var partnerid = QWCredential.prodKey;
// 			    	var secret    = QWCredential.prodSecret;
// 			    }else{
// 			    	var API       = QWCredential.sandboxAPI;
// 			    	var partnerid = QWCredential.sandboxKey;
// 			    	var secret    = QWCredential.sandboxSecret;
// 			    }
// 			    var quickWalletInput = {
// 			    		   "partnerid" : partnerid,
// 			               "mobile"   :   mobileNumber,
// 			               "secret"   :   secret,
// 			               "amount"   :    competitionFees,
// 			               "redirecturl" : Meteor.absoluteUrl()+'payment-response/'+userId+'/'+comp_id,             
// 			    };
// 			    try {
// 			      if (Meteor.isServer) {
// 			        var result = HTTP.call("POST", API+"/api/partner/"+quickWalletInput.partnerid+"/requestpayment",
// 			                               {params: quickWalletInput});
// 			        if(result.data.status == 'success'){
// 			          var paymentUrl = result.data.data.url;
// 			          return paymentUrl;
// 			        }else{
// 			          return false;
// 			        }
// 			      }
// 			    } catch (err) {
// 			      console.log(err)
// 			      // Got a network error, time-out or HTTP error in the 400 or 500 range.
// 			      return false;
// 			    }
// 			}
// 		  },

// 		  getCompetitionExams(compId){
// 		  	return ExamMaster.findOne({"_id":compId});
// 		  },

// 		  updateExamStatusStartStop(compId,arrayIndex){
// 		  	var compExam = ExamMaster.findOne({"_id":compId});
// 		  	if(compExam){
// 		  		var compExamArray = compExam.competitionExams[arrayIndex];
// 		  		// console.log(compExamArray);
// 		  		if(compExamArray.examStatus == "stop"){
// 		  			ExamMaster.update({"_id":compId},
// 		  				{$set:
// 		  					{
// 		  						['competitionExams.'+arrayIndex+'.examStatus']:"start"
// 		  					}
// 		  				});
// 		  			return "start";
// 		  		}else{
// 		  			ExamMaster.update({"_id":compId},
// 		  				{$set:
// 		  					{
// 		  						['competitionExams.'+arrayIndex+'.examStatus']:"stop"
// 		  					}
// 		  				});
// 		  			return "stop";
// 		  		}
// 		  	}
// 		  }

// });