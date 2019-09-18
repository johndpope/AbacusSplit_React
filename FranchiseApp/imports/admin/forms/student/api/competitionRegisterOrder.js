
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
export const CompetitionRegisterOrder= new Mongo.Collection('competitionRegisterOrder');
// export const CompetitionRegisterOrder= new Mongo.Collection('competitionregisterorders');

if(Meteor.isServer){
	Meteor.publish("showAllCompRegOrder",function(){
		return CompetitionRegisterOrder.find({});
		
	});
	
	Meteor.publish("latestCRO",function(competitionId){
		return CompetitionRegisterOrder.find({"competitionId":competitionId});
		
	});
	
	Meteor.publish("latestCRONew",function(competitionId){
		return CompetitionRegisterOrder.find({"competitionId":competitionId,"studentId":Meteor.userId()});
		
	});

	Meteor.publish("paidStudentData",function(){
		return CompetitionRegisterOrder.find({"studentId":Meteor.userId(),"status":"paid"});
		
	});
	
	Meteor.publish("competionfranchisePayReport",function(competitionId,franchiseId){
		return CompetitionRegisterOrder.find({"competitionId":competitionId,"franchiseId":franchiseId});
		
	});

	Meteor.publish("latestTenRegistration",function(compId){
		var latestRecord = CompetitionRegisterOrder.find({"competitionId":compId,"franchiseId":Meteor.userId(),"status":"paid"},{$sort:{"paymentDate":-1},limit: 10});
		// console.log("latestRecord",latestRecord);
		return latestRecord;
	});
	
	// Meteor.publish("latestTweentyRegistration",function(){
	// 	var latestRecord = CompetitionRegisterOrder.find({"status":"paid"},{$sort:{"paymentDate":-1}},{skip:0,limit:20});
	// 	console.log("latestRecord",latestRecord);
	// 	return latestRecord;
	// 	return latestRecord;
	// });

	Meteor.publish("franchAllPaidStudCount",function(compId){
    	Counts.publish(this,"franchAllPaidStudCount", CompetitionRegisterOrder.find({"competitionId":compId,"franchiseId":Meteor.userId()}));
	});

	Meteor.publish("competitionStudentCnt",function(competitionId){
		Counts.publish(this, 'competitionStudentCnt', CompetitionRegisterOrder.find({"competitionId":competitionId,"status":"paid"}));
	});

	Meteor.methods({

		'applyForCompetition':function(compFees,compId,QPId){
			var studentMasterData = StudentMaster.findOne({"studentId":Meteor.userId()});
			var ExamMasterData = ExamMaster.findOne({"_id":compId});
			if(studentMasterData && ExamMasterData){

				CompetitionRegisterOrder.insert({
					'competitionId'	  : compId,
					'competitionName' : ExamMasterData.competitionName,
					'studentFullName' : studentMasterData.studentFullName,
					'studentId' 	  : Meteor.userId(),
					'category'        : studentMasterData.category,
					'subCategory'     : studentMasterData.subCategory,
					'franchiseId'     : studentMasterData.franchiseId,
					'franchiseName'   : studentMasterData.franchiseName,
					"competitionFees" : compFees,
					"franchiseShare"  : ExamMasterData.franchiseShare,
					"maatsShare"      : ExamMasterData.maatsShare,
					'status'    	  : 'UnPaid',
				});
			}
		},

		'updateOnlineDetailsToOrder':function(studentId,compId,status,transid,billnumbers){

			var order = CompetitionRegisterOrder.findOne({'competitionId': compId,"studentId":studentId});
			if(order){
				CompetitionRegisterOrder.update(
					{"_id"	: 	order._id},
					{$set : {
								'status'		: status,
								'transactionId'	: transid,
								'billnumbers'   : billnumbers,
								'paymentDate' 	: new Date(),
							}
					},
					function(error,result){
						if(error){
							console.log(error);
							return error;
						}else{
							return result;
						}
					}
				);
			}
		},

//--------------- get competition wise franchise details ----------------------//
		'getCompetitionWiseFranchise':function(competitionId){
			var competitionRegOrderData = CompetitionRegisterOrder.find({"competitionId":competitionId,"status":"paid"}).fetch();
			if(competitionRegOrderData){
				var franchiseIds = _.pluck(competitionRegOrderData, "franchiseId");
				var uniqFranchises   = _.uniq(franchiseIds); //get unique uniqFranchiseIds
				var allFranchiseDataSummary = [];
				var totalStudent            = 0;
				var totalReceivedAmount     = 0;
				var totalMaatsShare         = 0;
				var totalFranchiseShare     = 0;
				for(var i=0; i<uniqFranchises.length; i++){
					var studCountbyFranchise = Meteor.call("getFranchiseWiseStudCount",competitionId,uniqFranchises[i]);
					// var franchiseName        = Meteor.call("getCompOrderFranchiseName",uniqFranchises[i]);
					var franchiseData        = Meteor.call("getCompOrderFranchiseName",uniqFranchises[i],competitionId);
					var franchiseName        = franchiseData[0];
					// var ReceivedAmount       = studCountbyFranchise * competitionRegOrderData[0].competitionFees; 
					var ReceivedAmount       = franchiseData[1]; 
					// var franchiseShare       = studCountbyFranchise * competitionRegOrderData[0].franchiseShare; 
					var franchiseShare       = franchiseData[2];
					// var maatsShare           = (studCountbyFranchise * (competitionRegOrderData[0].competitionFees) - (studCountbyFranchise * competitionRegOrderData[0].franchiseShare)); 
					var maatsShare           = ReceivedAmount - franchiseShare;
					var totalStudent         = studCountbyFranchise + totalStudent;
					var totalReceivedAmount  = ReceivedAmount + totalReceivedAmount;
					var totalFranchiseShare  = franchiseShare + totalFranchiseShare;
				    var totalMaatsShare      = maatsShare + totalMaatsShare;
					allFranchiseDataSummary.push({
						"franchiseId"          : uniqFranchises[i],
						"franchiseName"        : franchiseName,
						"studCountbyFranchise" : studCountbyFranchise,
						"ReceivedAmount"       : ReceivedAmount,
						"maatsShare"           : maatsShare,
						"franchiseShare"       : franchiseShare,
						"competitionId"        : competitionId,
					});

				}
				allFranchiseDataSummary.push({
					"totalStudent"         : totalStudent,
					"totalReceivedAmount"  : totalReceivedAmount,
					"totalMaatsShare"      : totalMaatsShare,
					"totalFranchiseShare"  : totalFranchiseShare,
				});
			return allFranchiseDataSummary;	
				
			}

		},

		getFranchiseWiseStudCount(competitionId,CompFranchises){
			return CompetitionRegisterOrder.find({"competitionId":competitionId,"franchiseId":CompFranchises,"status":"paid"}).count();
		},

		getCompOrderFranchiseName(CompFranchises,competitionId){
			var competitionData   = CompetitionRegisterOrder.findOne({"franchiseId":CompFranchises,"competitionId":competitionId,"status":"paid"});
			var franchiseStudData = CompetitionRegisterOrder.find({"franchiseId":CompFranchises,"competitionId":competitionId,"status":"paid"}).fetch();
			if(franchiseStudData && competitionData){
				var franchiseName   = competitionData.franchiseName;
				var competitionFees = franchiseStudData.reduce((addCompetitionFee, data)=> addCompetitionFee + parseInt(data.competitionFees),0);
				var franchiseShare  = franchiseStudData.reduce((addFranchiseFee, data)=> addFranchiseFee + parseInt(data.franchiseShare),0);
					return [franchiseName,competitionFees,franchiseShare];
			}
		},

		//------------------ Franchise wise payment details -----------------//

		'getFranchiseWiseStudent':function(compId,franchiseId){
			return CompetitionRegisterOrder.find({"competitionId":compId,"franchiseId":franchiseId,"status":"paid"},{$sort:{"paymentDate":-1},fields:{"billnumbers":0,"competitionName":0,"competitionId":0,"franchiseId":0,"franchiseName":0,"status":0,"transactionId":0}}).fetch();
			
		},

		'getFranchiseWiseStudentDOB':function(compId,franchiseId){
			var allStudentData = CompetitionRegisterOrder.find({"competitionId":compId,"franchiseId":franchiseId,"status":"paid"},{$sort:{"paymentDate":-1},fields:{"billnumbers":0,"competitionName":0,"competitionId":0,"franchiseId":0,"franchiseName":0,"status":0,"transactionId":0}}).fetch();
			if(allStudentData){
				for(var i=0;i<allStudentData.length;i++){
					var studId= allStudentData[i].studentId;
					if(studId){
						var studInfo = StudentMaster.findOne({"studentId":studId});
						if(studInfo){
						allStudentData[i].dob = studInfo.studentDOB;
						}

					}

				}

			}

			return allStudentData;
		},

		showExamWiseCompetitionData(examId,franchiseLoginId){
			
			return CompetitionRegisterOrder.find({'competitionId':examId,'franchiseId':franchiseLoginId,'status':'paid'}).fetch();
		},

		searchExamWiseCompetitionData(franchiseLoginId,examId,studentNameMonthly){
			return CompetitionRegisterOrder.find({$and:[{$or:[{'franchiseId':franchiseLoginId,'competitionId':examId,'status':'paid'}]},{'studentFullName':studentNameMonthly}]}).fetch();
		},

		'getFranchiseWiseCompetitionPaidStudent':function(compId,franchiseId){
			var paidStudentData= CompetitionRegisterOrder.find({"competitionId":compId,"franchiseId":franchiseId,"status":"paid"},{$sort:{"paymentDate":-1},fields:{"billnumbers":0,"competitionName":0,"franchiseId":0,"franchiseName":0,"competitionId":0,"status":0,"transactionId":0}}).fetch();
			return paidStudentData;
		},

		'getSummaryCompetitionPaidStudent':function(compId,franchiseId){
			var paidData= CompetitionRegisterOrder.find({"competitionId":compId,"franchiseId":franchiseId,"status":"paid"},{$sort:{"paymentDate":-1}}).fetch();
			var totalCompetitionAmount=0;
			var totalFranchiseShareAmount=0;
			var totalMaatsShareAmount=0;
			var DataSummary = [];
			if(paidData){
				for(i=0;i<paidData.length;i++){
					totalCompetitionAmount    = totalCompetitionAmount+parseInt(paidData[i].competitionFees);
					totalFranchiseShareAmount = totalFranchiseShareAmount+parseInt(paidData[i].franchiseShare);
					totalMaatsShareAmount     = totalMaatsShareAmount+parseInt(paidData[i].maatsShare);
				}
			DataSummary.push({
					"totalStudent"         : paidData.length,
					"totalReceivedAmount"  : totalCompetitionAmount,
					"totalMaatsShare"      : totalMaatsShareAmount,
					"totalFranchiseShare"  : totalFranchiseShareAmount,
				});
			}

			return DataSummary;
		},

		// //------------------ Franchise  payment details -----------------//

		// 'getFranchiseWisePaidCompetition':function(competitionId){
		// 	var competitionRegOrderData = CompetitionRegisterOrder.find({"competitionId":competitionId,"franchiseId":Meteor.userId()}).fetch();
		// 	if(competitionRegOrderData){
		// 		var franchiseIds = _.pluck(competitionRegOrderData, "franchiseId");
		// 		var uniqFranchises   = _.uniq(franchiseIds); //get unique uniqFranchiseIds'
		// 		var allFranchiseDataSummary = [];
		// 		var totalStudent            = 0;
		// 		var totalReceivedAmount     = 0;
		// 		var totalMaatsShare         = 0;
		// 		var totalFranchiseShare     = 0;
		// 		for(var i=0; i<uniqFranchises.length; i++){
		// 			var studCountbyFranchise = Meteor.call("getFranchiseWiseStudCount",competitionId,uniqFranchises[i]);
		// 			var franchiseName  = Meteor.call("getCompOrderFranchiseName",uniqFranchises[i]);
		// 			var ReceivedAmount = studCountbyFranchise * competitionRegOrderData[0].competitionFees; 
		// 			var franchiseShare = studCountbyFranchise * competitionRegOrderData[0].franchiseShare; 
		// 			var maatsShare     = studCountbyFranchise * (competitionRegOrderData[0].competitionFees - studCountbyFranchise * competitionRegOrderData[0].franchiseShare); 
		// 			var totalStudent   =     studCountbyFranchise + totalStudent;
		// 			var totalReceivedAmount  = ReceivedAmount + totalReceivedAmount;
		// 			var totalFranchiseShare  = franchiseShare + totalFranchiseShare;
		// 		    var totalMaatsShare      = maatsShare + totalMaatsShare;
		// 			allFranchiseDataSummary.push({
		// 				"franchiseId"          : uniqFranchises[i],
		// 				"franchiseName"        : franchiseName,
		// 				"studCountbyFranchise" : studCountbyFranchise,
		// 				"ReceivedAmount"       : ReceivedAmount,
		// 				"maatsShare"           : maatsShare,
		// 				"franchiseShare"       : franchiseShare,
		// 				"competitionId"        : competitionId,
		// 				// "competitionId"        : competitionId,
		// 			});

		// 		}
		// 		allFranchiseDataSummary.push({
		// 			"totalStudent"         : totalStudent,
		// 			"totalReceivedAmount"  : totalReceivedAmount,
		// 			"totalMaatsShare"      : totalMaatsShare,
		// 			"totalFranchiseShare"  : totalFranchiseShare,
		// 		});
		// 	return allFranchiseDataSummary;	
				
		// 	}

		// },

	//--------------------- get competition wise registrations count for graph ----------------//
		'getCompetitionwiseRegistrationCnt':function(){
  			var allCompetitions = ExamMaster.find({},{$sort:{"createdAt":1}}).fetch(); 
  			if(allCompetitions){
  				var allCompetitionsLen = allCompetitions.length;
  				var competitionArrayCnt = [];
	  			for(var i=0; i<allCompetitionsLen; i++){
	  				var competitionRegCnt = CompetitionRegisterOrder.find({"competitionId":allCompetitions[i]._id,"status":"paid"}).count();
	  				competitionArrayCnt.push({
	  					'competitionRegCnt': competitionRegCnt,
	  					'competitionName'   : allCompetitions[i].competitionName,
	  				});
	  			}
	  			// console.log("competitionArrayCnt ----> ",competitionArrayCnt);
	  			return competitionArrayCnt;
			}
		},

	//--------------------- get franchise wise and competition wise registrations count for graph ----------------//
		'getFranchisewiseCompetitionwiseRegistrationCnt':function(){
  			var allCompetitions = ExamMaster.find({},{$sort:{"createdAt":1}}).fetch(); 
  			if(allCompetitions){
  				var allCompetitionsLen = allCompetitions.length;
  				var competitionArrayCnt = [];
	  			for(var i=0; i<allCompetitionsLen; i++){
	  				var competitionRegCnt = CompetitionRegisterOrder.find({"franchiseId":Meteor.userId(),"competitionId":allCompetitions[i]._id,"status":"paid"}).count();
	  				competitionArrayCnt.push(competitionRegCnt);
	  			}
	  			return competitionArrayCnt;
			}
		},

	//------------------ add cash payment by maats manually ---------------------//

	'addCompPayDetails':function(paymentFormValues){
		var paymentALreadyDone = CompetitionRegisterOrder.findOne({"studentId":paymentFormValues.studentId,'competitionId':paymentFormValues.competitionId,'status':'paid'});
		if(paymentALreadyDone){
			return "alreadyPaid";
		}else{
			var competitionData = ExamMaster.findOne({"_id":paymentFormValues.competitionId});
			var studenData      = StudentMaster.findOne({"studentId":paymentFormValues.studentId});
			 var transactionId  = Math.floor(1000 + Math.random() * 900000);
			 var billnumbers    = Math.floor(1000 + Math.random() * 90000000);
			if(studenData && competitionData){
				CompetitionRegisterOrder.insert({
					"competitionId" : paymentFormValues.competitionId,
				    "competitionName" : paymentFormValues.competitionName,
				    "studentFullName" : studenData.studentFullName,
				    "studentId" : studenData.studentId,
				    "category" : studenData.category,
				    "subCategory" : studenData.subCategory,
				    "franchiseId" : studenData.franchiseId,
				    "franchiseName" : studenData.franchiseName,
				    "competitionOriginalFees": competitionData.competitionFees,
				    "competitionFees" : parseInt(paymentFormValues.paymentReceived) + parseInt(paymentFormValues.franchiseShare) ,
				    "franchiseShare" : parseInt(paymentFormValues.franchiseShare),
				    "status" : "paid",
				    "transactionId": transactionId,
				    "billnumbers"  : billnumbers,
				    "paymentMode": "Cash Payment",
				    "paymentDate" : new Date(),
				});
			}
		}
	},

	//------------- latest 20 cometition registrations ----------------//
	'getLatestTweentyRegistration':function(){
		// var competitionData = ExamMaster.findOne({},{"sort":{"competitionDate":-1}});
		// console.log(competitionData);
		// if(competitionData){
	  		return  CompetitionRegisterOrder.find({"status":"paid"},{"sort":{"paymentDate":-1},limit:20}).fetch();
		// }
	},

	//------------- latest 20 cometition franchise student registrations ----------------//
	'getLatestTweentyFranchStudRegistration':function(){
	  	return  CompetitionRegisterOrder.find({"franchiseId":Meteor.userId(),"status":"paid"},{"sort":{"paymentDate":-1},limit:20}).fetch();
	},

	// 'getLatestCompetition':function(compId,compFee){
	// 	console.log("compId----> ",compId);
	// 	console.log("compFee----> ",compFee);
	// 	var competitionData = ExamMaster.findOne({"_id":compId});
	// 	// console.log("competitionData --->",competitionData);
	// 	if(competitionData){
	// 		if(competitionData.competitionFees==compFee){
	// 			console.log("if",competitionData.competitionFees);
	// 			return competitionData.competitionFees
	// 		}else{
	// 			console.log("else",competitionData.competitionFees);

	// 			return competitionData.competitionFees;
	// 		}
	// 	}
	// }


});
}


