
// export const MyTempQuestionPaperMaster = new Mongo.Collection('myTempQuestionPaperMaster');
// export const MyTempQuestionPaperMaster = new Mongo.Collection('mytempquestionpapermasters');

// if(Meteor.isServer){
// 	Meteor.publish("showAllTempQAnswer",function(){
// 		return MyTempQuestionPaperMaster.find({});
		
// 	});
// 	Meteor.publish("showAllStudTempQExams",function(){
// 		return MyTempQuestionPaperMaster.find({"StudentId":Meteor.userId()});
		
// 	});
// 	Meteor.publish("showSingleTempQPaper",function(){
// 		return MyTempQuestionPaperMaster.find({"studentId":Meteor.userId()});
		
// 	});
// }

// Meteor.methods({
	
// 	'myTempPracticeExam':function(questionArray1,quesPaperData,myPEId){
// 		var StudPracticeExist = MyTempQuestionPaperMaster.findOne({"studentId":Meteor.userId(),"examType":"Practice Exam"});
// 		// console.log(StudPracticeExist);
// 		if(StudPracticeExist){
// 			return 'examPaperExist';
// 		}else{
// 			if(quesPaperData.examType=="Practice Exam"){
// 				var id = MyTempQuestionPaperMaster.insert({
// 					'examPaperId'   : quesPaperData._id,
// 					'studentId'     : Meteor.userId(),
// 					'examType'      : quesPaperData.examType,
// 					'quePaperTitle' : quesPaperData.quePaperTitle,
// 					'category'      : quesPaperData.category,
// 					'subCategory'   : quesPaperData.subCategory,
// 					'noOfQuestion'  : quesPaperData.noOfQuestion,
// 					'marksPerQues'  : quesPaperData.marksPerQues,
// 					'totalMarks'    : quesPaperData.totalMarks,
// 					'examTime'      : quesPaperData.examTime,
// 					'createdAt'     : quesPaperData.createdAt,
// 				});
// 				for(var i=0; i<questionArray1.length; i++){
// 					MyTempQuestionPaperMaster.update({'_id':id},
// 					{
// 						$push:{
// 							'questionsArray':{
// 								'questionNumber'  : i,
// 								'questionId'      : questionArray1[i].questionId,
// 								'question'        : questionArray1[i].question,
// 								'A'               : questionArray1[i].A,
// 								'B'               : questionArray1[i].B,
// 								'C'               : questionArray1[i].C,
// 								'D'               : questionArray1[i].D,
// 								'correctAnswer'   : questionArray1[i].correctAnswer,
// 							}
// 						}
// 					});
// 				}
// 			}else{
// 				var StudPracticeExist = MyTempQuestionPaperMaster.findOne({"studentId":Meteor.userId(),"examType":"Final Exam"});
// 				if(StudPracticeExist){
// 					return 'examPaperExist';
// 				}else{
// 						var id = MyTempQuestionPaperMaster.insert({
// 							'examPaperId'   : quesPaperData._id,
// 							'studentId'     : Meteor.userId(),
// 							'examType'      : quesPaperData.examType,
// 							'quePaperTitle' : quesPaperData.quePaperTitle,
// 							'category'      : quesPaperData.category,
// 							'subCategory'   : quesPaperData.subCategory,
// 							'noOfQuestion'  : quesPaperData.noOfQuestion,
// 							'marksPerQues'  : quesPaperData.marksPerQues,
// 							'totalMarks'    : quesPaperData.totalMarks,
// 							'examTime'      : quesPaperData.examTime,
// 							'createdAt'     : quesPaperData.createdAt,
// 						});
// 						for(var i=0; i<questionArray1.length; i++){
// 							MyTempQuestionPaperMaster.update({'_id':id},
// 							{
// 								$push:{
// 									'questionsArray':{
// 										'questionNumber'  : i,
// 										'questionId'      : questionArray1[i].questionId,
// 										'question'        : questionArray1[i].question,
// 										'A'               : questionArray1[i].A,
// 										'B'               : questionArray1[i].B,
// 										'C'               : questionArray1[i].C,
// 										'D'               : questionArray1[i].D,
// 										'correctAnswer'   : questionArray1[i].correctAnswer,
// 									}
// 								}
// 							});
// 						}
// 					}
// 				}
// 		}
// 	},

// 	'removeTempCurStudData':function(){
// 		MyTempQuestionPaperMaster.remove({"studentId":Meteor.userId(),"examType":"Practice Exam"});
// 	},

// 	'removeTempCurMEStudData':function(){
// 		MyTempQuestionPaperMaster.remove({"studentId":Meteor.userId(),"examType":"Final Exam"});
// 	},

// //------------- get mainexam question ----------------//
// 	// 'getMainExamQuestions':function(){
// 	// 	var postData = MyTempQuestionPaperMaster.findOne({"studentId":Meteor.userId(),"examType":"Final Exam"});
// 	// 	if(postData){
// 	// 		questionArrayFromTC = postData.questionsArray;
// 	// 		if(questionArrayFromTC){
// 	// 		questionArrayFromTC.push({'finishText' : 'You are about to finish the Exam.', 
//  // 							'finishSubtext': 'Please click on below button to finish the Exam.',
//  // 							'finish_button': 'Finish The  Exam' });
// 	// 		}
// 	// 		var dataObject = {
// 	// 			"noOfQuestion": postData.noOfQuestion,
// 	// 			"totalMarks": postData.totalMarks,
// 	// 			"questionArrayFromTC": questionArrayFromTC,


// 	// 		}
// 	// 		// console.log("dataObject",dataObject);
// 	// 	return dataObject;
// 	// 	}
// 	// },

// //------------- get practice exam question ----------------//
 
// 	'getExamQuestions':function(){
// 		var postData = MyTempQuestionPaperMaster.findOne({"studentId":Meteor.userId(),"examType":"Practice Exam"});
// 		var questionArrayFromTC=[];
// 		if(postData){
// 			questionArrayFromTC = postData.questionsArray;
// 			if(questionArrayFromTC){
// 			questionArrayFromTC.push({'finishText' : 'You are about to finish the Test.', 
//  							'finishSubtext': 'Please click on below button to finish the Test.',
//  							'finish_button': 'Finish The Practice Test' });
// 			}
// 			var dataObject = {
// 				"noOfQuestion": postData.noOfQuestion,
// 				"totalMarks": postData.totalMarks,
// 				"questionArrayFromTC": questionArrayFromTC,

// 			}

// 		}
// 		return dataObject;
// 	}	
// });