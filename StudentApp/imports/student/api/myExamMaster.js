import {StudentMaster} from '/imports/student/api/studentMaster.js';
// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import {ExamMaster} from '/imports/studentMainExam/api/examMaster.js';
// import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {MyTempQuestionPaperMaster} from '/imports/student/api/myTempQuestionPaperMaster.js';
// import {MyTempQuestionPaperMaster} from '/imports/admin/forms/student/api/myTempQuestionPaperMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export const MyExamMaster = new Mongo.Collection('myExamMaster');
// export const MyExamMaster = new Mongo.Collection('myexammasters');

if(Meteor.isServer){
	Meteor.publish("showAllAnswer",function(){
		return MyExamMaster.find({});
		
	});
	Meteor.publish("showAllStudExams",function(){
		return MyExamMaster.find({"StudentId":Meteor.userId()});
		
	});
		Meteor.publish("showStudExams",function(){
		return MyExamMaster.find({"StudentId":FlowRouter.getParam("id")});
		
	});
	Meteor.publish("showSingleAnsPaper",function(id){
		// console.log('id:',id);
		// console.log(MyExamMaster.find({"_id":id,"StudentId":this.userId}).fetch());
		return MyExamMaster.find({"_id":id,"StudentId":this.userId});
		// return MyExamMaster.find({});
		
	});
	Meteor.publish("showLoginStudInCompleteExam",function(){
		return MyExamMaster.find({"StudentId":Meteor.userId(),"examStatus" : "InCompleted"});
		
	});

	Meteor.publish("showStudentInCompleteExam",function(){
		return MyExamMaster.find({"StudentId":this.userId,"examStatus" : "InCompleted"});		
	});

	Meteor.publish("franchisewiseStudHS",function(compId){
		return MyExamMaster.find({"franchise_id":Meteor.userId(),"competitionId" : compId});
		
	});
	Meteor.publish('allExamCount', function() {
	  Counts.publish(this, 'allExamCount', MyExamMaster.find());
	});

// ------------------ selected competition category wise result count --------//
	Meteor.publish('competitionCWStudentCount', function(compId) {
	  Counts.publish(this, 'competitionCWStudentCount', MyExamMaster.find({'competitionId':compId}));
	});

	Meteor.publish('getcompetitionwiseStudCount', function(compId,category,subCategory) {
	  Counts.publish(this, 'getcompetitionwiseStudCount', MyExamMaster.find({'competitionId':compId,'category':category,'subCategory':subCategory}));
	});




	




	Meteor.publish("showSinglePaper",function(competitionId){
		return MyExamMaster.find({"competitionId":competitionId});
	});

	Meteor.publish("showSinglePaperNew",function(competitionId){
		return MyExamMaster.find({"competitionId":competitionId,"StudentId":Meteor.userId()});
	});

	Meteor.publish("showSinglePaperNewStudentwise",function(competitionId){
		return MyExamMaster.find({"competitionId":competitionId,"StudentId":Meteor.userId(),"examStatus" : "InComplete"});
	});

	Meteor.publish("appearingStuCount",function(competitionId){
		Counts.publish(this, 'appearingStuCount', MyExamMaster.find({"competitionId":competitionId,"status": "Appearing"}));
	});

	Meteor.publish("attemptedStuCount",function(competitionId){
		Counts.publish(this, 'attemptedStuCount', MyExamMaster.find({"competitionId":competitionId,$or:[{"status":"Attepmted"},{"status":"Attempted"}]}));
	});


Meteor.methods({
	'getcompetitionwiseStudCount':function(compId,category,subCategory){

		if(category=="all"){
			var count =  MyExamMaster.find({'competitionId':compId}).count();
		}else{
			if(subCategory=="all"){
				var count =  MyExamMaster.find({'competitionId':compId,'category':category}).count();

			}else{
				var count =  MyExamMaster.find({'competitionId':compId,'category':category,'subCategory':subCategory}).count();

			}
		}
		return ['getCount',count];
	},

	'StartExamCategoryWise':function(compId){
			
			// MyExamMaster.remove({"StudentId": Meteor.userId()},{$sort:{"examDate":-1}});
			MyExamMaster.remove({"competitionId":compId,"StudentId":Meteor.userId()},{multi: true});
			var studentData = StudentMaster.findOne({"studentId": Meteor.userId()});
			if(studentData){
				var categoryName = studentData.category;
				var subCategory = studentData.subCategory;
				var companyId = studentData.companyId;
				var franchise_id = studentData.franchiseId;
				// var franchise_id = studentData.franchise_id;
				if(categoryName){					
					var examMasterData = ExamMaster.findOne({"_id":compId,"competitionStatus":"start"});
					if(examMasterData && studentData){
					var studentCategory = 	examMasterData.competitionExams;

					if(studentCategory){
						var index = studentCategory.findIndex(data => data.subCategory == studentData.subCategory);
						var categoryWiseExamData =studentCategory[index];
					}
				}
				
					if(examMasterData && categoryWiseExamData){
						var id = MyExamMaster.insert({
							"StudentId"    : Meteor.userId(),
							"companyId"    : companyId,
							"franchise_id" : franchise_id,
							"firstName"    : studentData.studentFirstName,
							"lastName"     : studentData.studentLastName,
							"fullName"     : studentData.studentFirstName+' '+studentData.studentMiddleName+' '+studentData.studentLastName,
							"studImg"      : studentData.imgSrc,
						    "competitionId" : examMasterData._id,
						    "competitionName"    : examMasterData.competitionName,
						    "examDate"           : examMasterData.competitionDate,
						    "examDateFormat"     : new Date(examMasterData.competitionDate),
						    "category"           : categoryName,
						    "subCategory"        : subCategory,
						    "paperName"          : categoryWiseExamData.questionPaperId,
						    "examTime"           : categoryWiseExamData.examDuration,
						    "examSolvingTime"    : categoryWiseExamData.examDuration,
						    "examSolvedTime"     : '',
						    "paperTitle"         : categoryWiseExamData.paperTitle,
						    "examType"		     :"Final Exam",
						    "examFees"           : examMasterData.competitionFees,
						    "totalMarks"         : categoryWiseExamData.totalMarks,
						    "marksPerQuestion"   : categoryWiseExamData.marksPerQuestion,
						    "totalQuestion"  : 0,
							"attemptedQues"  : 0,
							"correctAnswer"  : 0,
							"wrongAnswer"    : 0,
							"totalScore"     : 0,
						    "createdAt"      : new Date(),
						    "status"         : 'Appearing', 
						    "examStatus"     : "InComplete",
						    "answerArray"    : [ ],
						    "studentImageArray":[],


						},function(error,result){
							if(error){

							}else if(result){

							}
						});
						
				
			if(id){
				var quesPaperData =  QuestionPaperMaster.findOne({"_id":categoryWiseExamData.questionPaperId});
				if(quesPaperData){
				 	var questionArray =  quesPaperData.questionsArray;
				 	if(questionArray){

				 		var questionArray1 = shuffle(questionArray);
				 		// shuffle questions 
						 	function shuffle(array) {
							  var currentIndex = array.length, temporaryValue, randomIndex;

							  // While there remain elements to shuffle...
							  while (0 !== currentIndex) {

							    // Pick a remaining element...
							    randomIndex = Math.floor(Math.random() * currentIndex);
							    currentIndex -= 1;

							    // And swap it with the current element.
							    temporaryValue = array[currentIndex];
							    array[currentIndex] = array[randomIndex];
							    array[randomIndex] = temporaryValue;
							  }

							  return array;
							}

												

							// if(questionArray.length == questionArray1.length ){
							// 	questionArray1.map((allQuestions,index)=>{
							// 		MyExamMaster.update({'_id':id},
							// 		{
							// 			$push:{
							// 				'answerArray':{
							// 					'questionNumber'  : index,
							// 					'questionId'      : allQuestions.questionId,
							// 					'question'        : allQuestions.question,
							// 					'A'               : allQuestions.A,
							// 					'B'               : allQuestions.B,
							// 					'C'               : allQuestions.C,
							// 					'D'               : allQuestions.D,
							// 					'correctAnswer'   : allQuestions.correctAnswer,
							// 					'attempted'       :'no',
							// 					'studentAnswer'  : '',
							// 					'answer'         : '',
							// 					'dummyId'        : '',
							// 					'indicatorClass' : '',	
							// 				}
							// 			}
							// 		});
							// 	});
							// return id ;
							// }


							//-------------- new update ---------------//
							var questionArrayLen = questionArray1.length;
							var i=0;
							for(i=0; i<questionArrayLen; i++){
								// console.log("i-& id--->",i,id);
								MyExamMaster.update({'_id':id},
									{
										$push:{
											'answerArray':{
												'questionNumber'  : i,
												'questionId'      : questionArray1[i].questionId,
												'question'        : questionArray1[i].question,
												'A'               : questionArray1[i].A,
												'B'               : questionArray1[i].B,
												'C'               : questionArray1[i].C,
												'D'               : questionArray1[i].D,
												'correctAnswer'   : questionArray1[i].correctAnswer,
												'attempted'       :'no',
												'studentAnswer'  : '',
												'answer'         : '',
												'dummyId'        : '',
												'indicatorClass' : '',	
											}
										}
									});	
								
							}
							var examData = MyExamMaster.findOne({"_id":id});
							// console.log(examData);
							if(examData){
								var questionArray=examData.answerArray;
								if(questionArray){

								var questionArrayLength=questionArray.length;
								// console.log(questionArrayLength);
								if(questionArrayLength==questionArrayLen){
									return id ;
								}else{
									// console.log("wow");
									MyExamMaster.remove({"_id":id});
									Meteor.call("StartExamCategoryWise",compId);
								}

								}
							}
							//-------------- new update ---------------//


						}
					}

				}
			
		  }
		 }
		}
		
	},

	'getMainExamQuestions':function(id){
		var postData = MyExamMaster.findOne({"_id":id,"StudentId":Meteor.userId(),"examType":"Final Exam"});
		if(postData){
			questionArrayFromTC = postData.answerArray;
			if(questionArrayFromTC){
			questionArrayFromTC.push({'finishText' : 'You are about to finish the Exam.', 
 							'finishSubtext': 'Please click on below button to finish the Exam.',
 							'finish_button': 'Finish The  Exam' });
			}
			var dataObject = {
				"noOfQuestion": questionArrayFromTC.length-1,
				"totalMarks": postData.totalMarks,
				"questionArrayFromTC": questionArrayFromTC,


			}
			// console.log("dataObject",dataObject);
		return dataObject;
		}
	},

	'getMainExamLastVisitedQuestion':function(id){
		var studentAnserSheet = MyExamMaster.findOne({"_id":id},{fields:{'lastVisitedQuestion':1,
						'lastVisitedQAnswer':1}});
		if(studentAnserSheet){
			return studentAnserSheet;
		}

	},

	'updateExamTimeAndStudenAnswer':function(examId,index,studAnswer,examTime){
		try{
			MyExamMaster.update({"_id":examId},
			{
				$set:{
					'examSolvingTime':examTime,
					'lastVisitedQuestion':parseInt(index),
					'lastVisitedQAnswer':studAnswer,
				}
			});
			var examAnswerData =  MyExamMaster.findOne({"_id":examId});
			if(examAnswerData){
				var answerArray = examAnswerData.answerArray[index];
				if(answerArray){
					if(answerArray.correctAnswer==studAnswer){
						var answer = 'Correct';
					}else{
						var answer = "Wrong";
					}
									
					var res = MyExamMaster.update({"_id":examId},
					{
						$set:{
							['answerArray.'+index+'.attempted']:"Yes",
							['answerArray.'+index+'.studentAnswer']:studAnswer,
							['answerArray.'+index+'.answer']:answer,
						}
					}

					);	
					return res;
				}
			}
		}catch(exception){
			// console.log("exception = ",exception);
			return exception;
		}		
},
	'getExamTimeData':function(id,studId){
		var examData =  MyExamMaster.findOne({"_id":id,"StudentId": studId})||{};
		if(examData){
			return ['data',examData.examSolvingTime]; 
		}
	},

	
	'updateMainExamTime':function(examTime,id){
		MyExamMaster.update({"_id":id},
		{
			$set:{
				'examSolvingTime':examTime,
			}
		});
	},

	'getStudentMainExamReport':function(){
		return MyExamMaster.find({"StudentId":Meteor.userId(),"examStatus":"Completed",},{fields:{"competitionName":1,"examDate":1,"category":1,"totalQuestion":1,"attemptedQues":1,"correctAnswer":1,"wrongAnswer":1,"examSolvedTime":1,"totalScore":1}}).fetch();
	},

	'addAnswers':function(studAnswer,questionIndex,answer,dummyId,id){
		MyExamMaster.update({"_id":id},
			{
				$push :{
					"answerArray":{
						questionNumber : questionIndex,
						studentAnswer  : studAnswer,
						answer         : answer,
						dummyId        : dummyId,
						indicatorClass : "A-"+questionIndex,
						
					}
				}

			});
	},
	'removequestionAnswer':function(questionIndex,id){
		// Meteor.call("updateQuestionMasterFalse",questionId);

		MyExamMaster.update({"_id":id},
		{
			$pull:{
				"answerArray":{
					"questionNumber":questionIndex,
				}
			}
		});
	},
	'ExamFinished':function(id){
		MyExamMaster.update({"_id":id},
			{
				$set:{
					"examStatus":"Completed",
				}
			});
	},

	'ExamMarksUpdate':function(examId,examSolvingTime){
		var myExamMasterData = MyExamMaster.findOne({"_id":examId});
		if(myExamMasterData){
			var answeArrayLen = myExamMasterData.answerArray.length;
			var correctAnswer = myExamMasterData.answerArray.filter(function(mapData){
						    return mapData.answer === "Correct";
						}).length;

			var wrongAnswer  = myExamMasterData.answerArray.filter(function(mapData){
							    return mapData.answer === "Wrong";
							}).length;

			var attepmted  = myExamMasterData.answerArray.filter(function(mapData){
							    return mapData.attempted === "Yes";
							}).length;
			var totalScore = parseInt(correctAnswer ) * parseInt(myExamMasterData.marksPerQuestion);
			var m1 = myExamMasterData.examTime;
			var m2 = examSolvingTime;
			if(m1 && m2){
				var min1 = m1.split(":");
				var min2 = m2.split(":");
				if(min1[1] =="00" && min2[1]=="00"){
                   var examSolvedTime = min1[0]-min2[0];
                  		var examSolvedTime =  examSolvedTime < 10 ? "0"+examSolvedTime : examSolvedTime;
                  		var examSolvedTime = examSolvedTime+":00";
                }else{  
					if(min1[1]=="00"){
						min1[0]-=1;
					}
					var res1 = min1[0]-min2[0];
	              	res1 = res1 <10 ? "0"+res1 : res1;
	              	if(min1[1]>=min2[1]){
					var res2 = (min1[1]=="00") ? 60-min2[1] : min1[1]-min2[1];
	                }else{
					var res2 = (min1[1]=="00") ? 60-min2[1] : min2[1]-min1[1];
	                }
	              	res2 = res2 < 10 ? "0"+res2 : res2;
					if(res2==60){res1+=1;res2=0;}
					var examSolvedTime = res1+":"+res2;
					}
					MyExamMaster.update({"_id":examId},
					{
						$set:{
							"totalQuestion":answeArrayLen,
							"attemptedQues":attepmted,
							"correctAnswer":correctAnswer,
							"wrongAnswer":wrongAnswer,
							"totalScore":totalScore,
							"examSolvedTime":examSolvedTime,
							"examSolvingTime":examSolvingTime,
							"examStatus":"Completed",
							"status":"Attempted",
						}
					});
			}

		}
	},


	
	'updateMyExamFee':function(examId){
		MyExamMaster.update({"_id":examId},
		{
			$set:{
				'examFees': 200,
			}
		});
	},
	'addStudentImagesToMaster':function(_id,link){

        MyExamMaster.update(
        {"_id":_id,"StudentId":Meteor.userId()},
           {
			$push:{
				'studentImageArray':{
					'studentImage':link
				}
		      }
		    }
		)     

	},

	'generateRankCatSubCatWise':function(category,subCategory,competitionId){
		var allCategoryWiseStudent = MyExamMaster.find({'category':category,'subCategory':subCategory,'competitionId':competitionId},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
		
		if(allCategoryWiseStudent){
			var totalMarks = allCategoryWiseStudent[0].totalMarks;
			var minMarks = (totalMarks/100)*50;
			var rank = 1;
			// allocateRank(allCategoryWiseStudent,minMarks,rank);
			Meteor.call('allocateRank',allCategoryWiseStudent,minMarks,rank);
		}

	},

	'allocateRank': function(studentData,minMarks,rank){
		// if(rank<=10 && studentData.length>0){
		if(rank<=3 && studentData.length>0){
			var rankValues = {1:'1st',2:'2nd',3:'3rd'};
			// console.log("rank ------------ ",rank);

			var time = studentData[0].examSolvedTime;
			var score = studentData[0].totalScore;

			var rankedStudents = studentData.filter(function(data){
				return data.totalScore==score && data.examSolvedTime==time;
			});

			// console.log("rankedStudents ==> ",rankedStudents.length);
			rankedStudents.map((student)=>{
				MyExamMaster.update({"_id":student._id},
					{
						$set:{
							"rank": rankValues[rank],	
						}
					});
			});

			var remainingStudents = studentData.filter(function(data){ // remove max score min time record objects
				return data.examSolvedTime != time || data.totalScore != score;
			});
			// console.log("remainingStudents => ",remainingStudents.length);
			// console.log("totalStudents ==> ",studentData.length);

			Meteor.call('allocateRank',remainingStudents,minMarks,rank+1);
		}
		else if(rank>3 && rank<=10 && studentData.length>0){
			// console.log("rank ================= ",rank);
			var time = studentData[0].examSolvedTime;
			var score = studentData[0].totalScore;

			if(score>minMarks){

				var rankedStudents = studentData.filter(function(data){
					return data.totalScore==score && data.examSolvedTime==time;
				});

				// console.log("rankedStudents ==> ",rankedStudents.length);
				rankedStudents.map((student)=>{
					MyExamMaster.update({"_id":student._id},
						{
							$set:{
								"rank": 'Consolation',	
							}
						});
				});

				var remainingStudents = studentData.filter(function(data){ // remove max score min time record objects
					return data.examSolvedTime != time || data.totalScore != score;
				});
				// console.log("remainingStudents => ",remainingStudents.length);
				// console.log("totalStudents ==> ",studentData.length);

				Meteor.call('allocateRank',remainingStudents,minMarks,rank+1);
			}//if
		}
	},

	'changeStatusByAdmin':function(studId){
		MyExamMaster.update({"StudentId":studId},
		{
			$set:{
				"examStatus"    : "InCompleted",
			}
		})
	},

//---------------- report ----------------//
	'getCategoryWiseSWTT':function(categoryName,subCategory,competitionId,startRange,limitRange){
		// console.log("startRange",startRange);
		// console.log("limitRange",limitRange);
		if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin','Student'])){
			if(categoryName=="all"){
				var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId},{sort:{"totalScore":-1,"examSolvedTime":1},skip:startRange, limit: limitRange,fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;				
				}
			}else{
				// console.log("in meteor category");
				if(subCategory=="all"){
					// console.log("in meteor All category");
					var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId,'category':categoryName},{sort:{"totalScore":-1,"examSolvedTime":1},skip:startRange, limit: limitRange,fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
					if(allCategoryWiseStudent){
						return allCategoryWiseStudent;				
					}
				}else{
					// console.log("in meteor selected category11");
					var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId,'category':categoryName,'subCategory':subCategory},{sort:{"totalScore":-1,"examSolvedTime":1},skip:startRange, limit: limitRange,fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
					if(allCategoryWiseStudent){
					// console.log("in meteor selected category data------->",allCategoryWiseStudent);

						return allCategoryWiseStudent;				
					}

				}
				

			}
			

		}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
			if(categoryName=="all"){
				var allCategoryWiseStudent = MyExamMaster.find({'franchise_id':Meteor.userId(),'competitionId':competitionId},{sort:{"totalScore":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;				
				}
			}else{
				if(subCategory=="all"){
				var allCategoryWiseStudent = MyExamMaster.find({'franchise_id':Meteor.userId(),'competitionId':competitionId,'category':categoryName},{sort:{"totalScore":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;				
				}
			}else{
				var allCategoryWiseStudent = MyExamMaster.find({'franchise_id':Meteor.userId(),'competitionId':competitionId,'category':categoryName,'subCategory':subCategory},{sort:{"totalScore":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;				
				}

			}

			}

		}else{
			if(categoryName=="all"){
				var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId},{sort:{"totalScore":-1,"examSolvedTime":1},skip:startRange, limit: limitRange,fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;				
				}
			}else{
				// console.log("in meteor category");
				if(subCategory=="all"){
					// console.log("in meteor All category");
					var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId,'category':categoryName},{sort:{"totalScore":-1,"examSolvedTime":1},skip:startRange, limit: limitRange,fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
					if(allCategoryWiseStudent){
						return allCategoryWiseStudent;				
					}
				}else{
					// console.log("in meteor selected category11");
					var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId,'category':categoryName,'subCategory':subCategory},{sort:{"totalScore":-1,"examSolvedTime":1},skip:startRange, limit: limitRange,fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
					if(allCategoryWiseStudent){
					// console.log("in meteor selected category data------->",allCategoryWiseStudent);

						return allCategoryWiseStudent;				
					}

				}
				

			}
		}
	},


//-------------- get franchise wise competition result -------------//
	'getFranchisewiseCompetitionResult':function(categoryName,subCategory,competitionId,franchiseId){
		
		if(categoryName=="all"){
			var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId,'franchise_id':franchiseId},{sort:{"totalScore":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"firstName":1,"lastName":1,"competitionName":1,"totalQuestion":1,"attemptedQues":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1}}).fetch();
			if(allCategoryWiseStudent){
				return allCategoryWiseStudent;				
			}
		}else{
			if(subCategory=="all"){
				var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId,'category':categoryName,'franchise_id':franchiseId},{sort:{"totalScore":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"firstName":1,"lastName":1,"competitionName":1,"totalQuestion":1,"attemptedQues":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;				
				}
			}else{
				var allCategoryWiseStudent = MyExamMaster.find({'competitionId':competitionId,'category':categoryName,'subCategory':subCategory,'franchise_id':franchiseId},{sort:{"totalScore":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"firstName":1,"lastName":1,"competitionName":1,"totalQuestion":1,"attemptedQues":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;				
				}
			}
			
		}
		
	},
// ---------------- search by Franchise -----------------------//
	'getFranchisewiseCompetitionResultSearch':function(categoryName,studentNameCWTD,franchiseId,compId){
		if(categoryName=="all"){
			var allCategoryWiseStudent = MyExamMaster.find({$and:[{'fullName':studentNameCWTD}],'franchise_id':franchiseId,'competitionId':compId},{sort:{"totalMarks":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"firstName":1,"lastName":1,"competitionName":1,"totalQuestion":1,"attemptedQues":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1}}).fetch();

			if(allCategoryWiseStudent){
				return allCategoryWiseStudent;
			}
		}else{
			var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':categoryName}]},{'fullName':studentNameCWTD}],'franchise_id':franchiseId,'competitionId':compId},{sort:{"totalMarks":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"firstName":1,"lastName":1,"competitionName":1,"totalQuestion":1,"attemptedQues":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1}}).fetch();
			if(allCategoryWiseStudent){
				return allCategoryWiseStudent;
			}			
		}
	},
		

// ---------------- search  by Admin-----------------------//
	'getCategoryWiseSWTTSearch':function(categoryName,studentNameCWTD,compId){
		
		if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
			if(categoryName=="all"){
				var allCategoryWiseStudent = MyExamMaster.find({$and:[{'fullName':studentNameCWTD,'franchise_id':Meteor.userId(),'competitionId':compId}]},{sort:{"totalMarks":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;
				}
			}else{
				var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':categoryName}]},{'fullName':studentNameCWTD,'franchise_id':Meteor.userId(),'competitionId':compId}]},{sort:{"totalMarks":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;
				}
			}
		}else{

			if(categoryName=="all"){
				var allCategoryWiseStudent = MyExamMaster.find({$and:[{'fullName':studentNameCWTD,'competitionId':compId}]},{sort:{"totalMarks":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;
				}
			}else{
				var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':categoryName}]},{'fullName':studentNameCWTD,'competitionId':compId}]},{sort:{"totalMarks":-1,"examSolvedTime":1},fields:{"totalMarks":1,"StudentId":1,"attemptedQues":1,"competitionName":1,"firstName":1,"lastName":1,"totalQuestion":1,"totalScore":1,"examSolvedTime":1,"status":1,"rank":1,"category":1,"subCategory":1,"studImg":1}}).fetch();
				if(allCategoryWiseStudent){
					return allCategoryWiseStudent;
				}
			}

		}
		
	},
	'getCategoryWiseSWTTFranchise':function(ID,categoryName,startDate,endDate){
		var allCategoryWiseStudent = MyExamMaster.find({'franchise_id':ID,'category':categoryName,'examDateFormat':{$gte : startDate, $lt : endDate }},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
		if(allCategoryWiseStudent){
			return allCategoryWiseStudent;
		}
	},
	'getCategoryWiseSWTTSearchFranchise':function(categoryName,startDate,endDate,studentNameCWTD){
		
		var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':categoryName}]},{'fullName':studentNameCWTD,'examDateFormat':{$gte : startDate, $lt : endDate }}]},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
		
		if(allCategoryWiseStudent){
			return allCategoryWiseStudent;
		}
	},

// -------------------------Rank get certicate ----------------- //
  	
  	'competitionWiseCertificate':function(competitionId,userId){
  		return MyExamMaster.findOne( {"competitionId":competitionId,"StudentId" : userId, $and : [{$or : [{"rank" : "1st"},{"rank" : "2nd"},{"rank":"3rd"},{"rank":"Consolation"}]}] })||{};
  	},

//----------------- participation certificate ----------------//

  	'competitionWiseParticipationCertificate':function(competitionId,userId){
  		var studentData = StudentMaster.findOne({"studentId":userId});
  		if(studentData){
  			var middleName = studentData.studentMiddleName;
  		}
  		var resultData = MyExamMaster.findOne({"competitionId":competitionId,"StudentId":userId});
  		resultData.middleName = middleName;
  		return resultData
  	},

  	'competitionWiseRankCertificate':function(competitionId,userId){
  		return MyExamMaster.findOne({"competitionId":competitionId,"StudentId":userId, $and : [{$or : [{"rank" : "1st"},{"rank" : "2nd"},{"rank":"3rd"},{"rank":"Consolation"}]}]});
  	},

//----------------- check wheather rank generated for selected competition --------------//
	'checkCompetitionResultDeclare':function(competitionId,category,subCategory){
		var competitionData = MyExamMaster.findOne({"competitionId":competitionId,"category":category,"subCategory":subCategory,"rank":"1st"});
		if(competitionData){
			return 'resultDeclared';
		}else{
			return 'resultNotDeclared';
		}
	},

//--------------------- get student solved question anser -------------------//

	'getAlreadySolvedQuesAns':function(getIndex,id){

		var answerData =  MyExamMaster.findOne({"_id":id});
		if(answerData && getIndex){			
			var answerDataArray = answerData.answerArray[getIndex];	
			if(answerDataArray){
				return ['getStudAns',answerDataArray.studentAnswer];
			}
		}
	},
//------------- remove student from selected student -------------------//

'removeStudentFromSelectedCompetition':function(studId,compId){
	MyExamMaster.remove({"StudentId":studId,"competitionId":compId});
	return 'studRemoved';
}
});



}