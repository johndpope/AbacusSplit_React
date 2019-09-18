// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
// import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
// export const MyPracticeExamMaster = new Mongo.Collection('myPracticeExamMaster');

// if(Meteor.isServer){
// 	Meteor.publish("showAllPracticeAnswer",function(){
// 		return MyPracticeExamMaster.find({});
		
// 	});
// 	Meteor.publish("showAllStudPracticeExams",function(){
// 		return MyPracticeExamMaster.find({"StudentId":Meteor.userId()});
		
// 	});
// 	Meteor.publish("showSinglePracticePaper",function(id){
// 		return MyPracticeExamMaster.find({"_id":id});
		
// 	});
// 	Meteor.publish("InCompletedExam",function(){
// 		return MyPracticeExamMaster.find({"StudentId": Meteor.userId(),"examStatus":"InCompleted"});
// 	});
// 	Meteor.publish("LoginStudTodaysExam",function(date){
// 		return MyPracticeExamMaster.find({"StudentId": Meteor.userId(),"date":date});	
// 	});
// 	Meteor.publish("CompletedExam",function(){
// 		return MyPracticeExamMaster.find({"StudentId": Meteor.userId(),"examStatus":"Completed"});
// 	});
// }

// // shuffle questions 
// shuffle = function(array) {
// 	var currentIndex = array.length, temporaryValue, randomIndex;
// 	// While there remain elements to shuffle...
// 	while (0 !== currentIndex) {
// 	// Pick a remaining element...
// 	randomIndex = Math.floor(Math.random() * currentIndex);
// 	currentIndex -= 1;
// 	// And swap it with the current element.
// 	temporaryValue = array[currentIndex];
// 	array[currentIndex] = array[randomIndex];
// 	array[randomIndex] = temporaryValue;
// 	}
// 	return array;
// }

// Meteor.methods({
	
// 	'StartPracticeExam':function(ID){
// 		// console.log("ID",ID);
// 		if(ID){
// 			var questionPaperMasterData = QuestionPaperMaster.findOne({"_id":ID});
// 		}	

// 			if(questionPaperMasterData){
// 				var id = MyPracticeExamMaster.insert({
// 					"StudentId"    : Meteor.userId(),
// 					"examPaperId"  : ID,
// 					"originalTime" : questionPaperMasterData.examTime,
// 					"examTime"     : questionPaperMasterData.examTime,
// 					"examName"     : questionPaperMasterData.quePaperTitle,
// 					"category"     : questionPaperMasterData.category,
// 					"marksPerQues" : questionPaperMasterData.marksPerQues,
// 				    "totalQuestion": (questionPaperMasterData.questionsArray).length,
// 				    "examType"     : questionPaperMasterData.examType,
// 				    "totalMarks"   : questionPaperMasterData.totalMarks,
// 					"attemptedQues": 0,
// 					"correctAnswer": 0,
// 					"wrongAnswer"  : 0,
// 					"totalScore"   : 0,
// 				    "createdAt"    : new Date(),
// 				    "date"         : moment(new Date).format("DD/MM/YYYY"), 
// 				    "examStatus"   : "InCompleted",
// 				    "answerArray" : [],

// 				},function(error,result){
// 					if(error){}else if(result){}
// 			});
// 			if(id){
// 			 	var questionArray =  questionPaperMasterData.questionsArray;
// 			 	if(questionArray){
// 			 		var questionArray1 = shuffle(questionArray);
// 			 		if(questionArray1){
// 			 			var questionArrayLen = questionArray1.length;
// 			 		}
							
// 						if(id && (questionArrayLen == questionArray.length)){
// 							// questionArray1.map((allQuestions,index)=>{
// 							// 	MyPracticeExamMaster.update({'_id':id},
// 							// 	{
// 							// 		$push:{
// 							// 			'answerArray':{
// 							// 				'questionNumber'  : index,
// 							// 				'questionId'      : allQuestions.questionId,
// 							// 				'question'        : allQuestions.question,
// 							// 				'A'               : allQuestions.A,
// 							// 				'B'               : allQuestions.B,
// 							// 				'C'               : allQuestions.C,
// 							// 				'D'               : allQuestions.D,
// 							// 				'correctAnswer'   : allQuestions.correctAnswer,
// 							// 				'attempted'       :'no',
// 							// 				'studentAnswer'  : '',
// 							// 				'answer'         : '',
// 							// 				'dummyId'        : '',
// 							// 				'indicatorClass' : '',	
// 							// 			}
// 							// 		}
// 							// 	});
// 							// });
// 							// console.log("questionArray1-->",questionArray1);

// 							var i=0;
// 							for(i=0; i<questionArrayLen; i++){
// 								// console.log("i-& id--->",i,id);
// 								MyPracticeExamMaster.update({'_id':id},
// 									{
// 										$push:{
// 											'answerArray':{
// 												'questionNumber'  : i,
// 												'questionId'      : questionArray1[i].questionId,
// 												'question'        : questionArray1[i].question,
// 												'A'               : questionArray1[i].A,
// 												'B'               : questionArray1[i].B,
// 												'C'               : questionArray1[i].C,
// 												'D'               : questionArray1[i].D,
// 												'correctAnswer'   : questionArray1[i].correctAnswer,
// 												'attempted'       :'no',
// 												'studentAnswer'  : '',
// 												'answer'         : '',
// 												'dummyId'        : '',
// 												'indicatorClass' : '',	
// 											}
// 										}
// 									});	
								
// 							}
// 							var examData = MyPracticeExamMaster.findOne({"_id":id});
// 							// console.log(examData);
// 							if(examData){
// 								var questionArray=examData.answerArray;
// 								if(questionArray){

// 								var questionArrayLength=questionArray.length;
// 								// console.log(questionArrayLength);
// 								if(questionArrayLength==questionArrayLen){
// 									return id ;
// 								}else{
// 									// console.log("wow");
// 									MyPracticeExamMaster.remove({"_id":id});
// 									Meteor.call("StartPracticeExam",ID);
// 								}

// 								}
// 							}
							
// 					}//EOF if
// 					}
					
// 				} //if id
// 			}		
		
// 	},

// 	'getExamQuestions':function(examId){
		
// 		var postData = MyPracticeExamMaster.findOne({"_id":examId,"StudentId":Meteor.userId()});
// 		var questionArrayFromTC=[];
// 		if(postData){
// 			questionArrayFromTC = postData.answerArray;
// 			if(questionArrayFromTC){
// 			questionArrayFromTC.push({  
// 									'finishText' : 'You are about to finish the Test.', 
//  									'finishSubtext': 'Please click on below button to finish the Test.',
//  									'finish_button': 'Finish The Practice Test' 
//  								});
// 			}
// 			var dataObject = {
// 				"noOfQuestion" : postData.totalQuestion,
// 				"totalMarks"   : postData.totalMarks,
// 				"questionArrayFromTC": questionArrayFromTC,
// 				"examTime": postData.examTime,
// 				"examName": postData.examName,
// 			}
// 			// console.log(dataObject);

// 		}
// 		return dataObject;
// 	},

// 	'updatePracticeExamTimeAndStudenAnswer':function(examId,index,studAnswer,examTime){
// 		try{
// 			MyPracticeExamMaster.update({"_id":examId},
// 			{
// 				$set:{
// 					'examTime':examTime,
// 				}
// 			});
// 			var examAnswerData =  MyPracticeExamMaster.findOne({"_id":examId});
// 			if(examAnswerData){
// 				var answerArray = examAnswerData.answerArray[index];
// 				if(answerArray.correctAnswer==studAnswer){
// 					var answer = 'Correct';
// 				}else{
// 					var answer = "Wrong";
// 				}
				
// 				var res = MyPracticeExamMaster.update({"_id":examId},
// 				{
// 					$set:{
// 						['answerArray.'+index+'.attempted']:"Yes",
// 						['answerArray.'+index+'.studentAnswer']:studAnswer,
// 						['answerArray.'+index+'.answer']:answer,
// 					}
// 				}

// 				);	
// 				return res;
// 			}
// 		}catch(exception){
// 			console.log("exception = ",exception);
// 			return exception;
// 		}

			
			
		
// },

// 	'removequestionPracticeAnswer':function(questionIndex,id){
// 		MyPracticeExamMaster.update({"_id":id},
// 		{
// 			$pull:{
// 				"answerArray":{
// 					"questionNumber":questionIndex,
// 				}
// 			}
// 		});
// 	},

// 	'practiceExamFinished':function(id){
// 		MyPracticeExamMaster.update({"_id":id},
// 			{
// 				$set:{
// 					"examStatus":"Completed",
// 				}
// 		});
// 	},
	
// 	'PracticeExamMarksUpdate':function(id){
// 		var practiceExamData  = MyPracticeExamMaster.findOne({"_id":id});
// 		if(practiceExamData){
// 			var marksPerQues     = practiceExamData.marksPerQues;
// 			// var answeArrayLen    = (practiceExamData.answerArray).length;
// 			var correctAnswer = practiceExamData.answerArray.filter(function(mapData){
// 							    return mapData.answer === "Correct";
// 							}).length;
// 			var wrongAnswer  = practiceExamData.answerArray.filter(function(mapData){
// 							    return mapData.answer === "Wrong";
// 							}).length;
// 			var attepmted  = practiceExamData.answerArray.filter(function(mapData){
// 							    return mapData.attempted === "Yes";
// 							}).length;
// 			var totalScore  = correctAnswer * marksPerQues;
// 			MyPracticeExamMaster.update({"_id":id},
// 			{
// 				$set:{
// 					"attemptedQues":attepmted,
// 					"correctAnswer":correctAnswer,
// 					"wrongAnswer"  :wrongAnswer,
// 					"totalScore"   :totalScore,
// 					"examStatus"   :"Completed",
// 				}
// 			});
// 		}
// 	},

// 	'getPracticeExamTimeData':function(id,studId){
// 		var examData =  MyPracticeExamMaster.findOne({"_id":id,"StudentId": studId})||{};
// 		if(examData){
// 			return ['data',examData.examTime]; 
// 		}
// 	},

// 	'getPracticeExamInfo':function(id){
// 		var testexamData =  MyPracticeExamMaster.findOne({"_id":id,"StudentId": Meteor.userId()})||{};
// 		if(testexamData){
// 			return testexamData; 
// 		}
// 	},


// 	// 'checkExamISsolveToday':function(paperId){
// 	// 	// console.log("paperId",paperId);
// 	// 	var existorNot = MyPracticeExamMaster.findOne({"StudentId":Meteor.userId(),"examPaperId":paperId,"date":moment().format("DD/MM/YYYY")});
// 	// 	if(existorNot){
// 	// 		return 'exist';
// 	// 	}else{
// 	// 		MyPracticeExamMaster.update({"StudentId":Meteor.userId(),"examStatus":"InCompleted"},
// 	// 			{
// 	// 				$set:{
// 	// 					"examStatus":"Completed"
// 	// 				}
// 	// 			},
// 	// 			{multi:true}
// 	// 		);
// 	// 		return 'not-exist';
// 	// 	}

// 	// },


// 	'checkExamISsolveToday':function(paperId){
// 		// console.log("paperId",paperId);
// 		var existorNot = MyPracticeExamMaster.findOne({"StudentId":Meteor.userId(),"examPaperId":paperId});
// 		if(existorNot){
// 			return 'exist';
// 		}else{

// 			return 'not-exist';
// 		}

// 	},

// 	// 'getPracticeExamTimeData':function(id,studId){
// 	// 	var examData =  MyPracticeExamMaster.findOne({"_id":id,"StudentId": studId})||{};
// 	// 	if(examData){
// 	// 		return ['practiceData',examData.examTime]; 
// 	// 	}
// 	// },

// 	'finishExamBtnClick':function(){
// 		return "returnTrue";
// 	}

// });