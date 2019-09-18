import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {MyTempQuestionPaperMaster} from '/imports/admin/forms/student/api/myTempQuestionPaperMaster.js';
export const MyExamMaster = new Mongo.Collection('myExamMaster');
// export const MyExamMaster = new Mongo.Collection('myexammasters');

if(Meteor.isServer){
	Meteor.publish("showAllAnswer",function(){
		return MyExamMaster.find({});
		
	});
	Meteor.publish("showAllStudExams",function(){
		return MyExamMaster.find({"StudentId":Meteor.userId()});
		
	});
	Meteor.publish("showSingleAnsPaper",function(id){
		return MyExamMaster.find({"_id":id});
		
	});
	Meteor.publish("showLoginStudInCompleteExam",function(){
		return MyExamMaster.find({"StudentId":Meteor.userId(),"examStatus" : "InCompleted"});
		
	});
	Meteor.publish('allExamCount', function() {
	  Counts.publish(this, 'allExamCount', MyExamMaster.find());
	});
}

Meteor.methods({
	
	'StartExamCategoryWise':function(){
			var studentData = StudentMaster.findOne({"studentId": Meteor.userId()});
			if(studentData){
				var categoryName = studentData.category;
				var subCategory = studentData.subCategory;
				if(categoryName){
					var examMasterData = ExamMaster.findOne({"category":categoryName,"subCategory":subCategory});
					if(examMasterData){
						var id = MyExamMaster.insert({
							"StudentId"   : Meteor.userId(),
							"examPaperId" : examMasterData._id,
							"firstName"   : studentData.studentFirstName,
							"lastName"    : studentData.studentLastName,
							"fullName"    : studentData.studentFirstName+' '+studentData.studentLastName,
						    "examName"    : examMasterData.examName,
						    "examDate"    : examMasterData.examDate,
						    "examDateFormat" : new Date(examMasterData.examDate),
						    "category"    : examMasterData.category,
						    "subCategory"    : examMasterData.subCategory,
						    "paperName"   : examMasterData.paperName,
						    "examTime"    : examMasterData.examTime,
						    "examSolvingTime" : examMasterData.examTime,
						    "paperTitle"  : examMasterData.paperTitle,
						    "examFees"    : 200,
						    "totalQuestion":'',
							"attemptedQues":'',
							"correctAnswer":'',
							"wrongAnswer":'',
							"totalScore":'',
						    "createdAt"   : new Date(),
						    "examStatus"    : "InCompleted",
						    "answerArray" : [ ],
						    "studentImageArray":[],

						},function(error,result){
							if(error){

							}else if(result){

							}
						});
						
				
			if(id){
				var answerData = MyExamMaster.findOne({"_id":id,"StudentId":Meteor.userId()});
				if(answerData){
					// console.log('answerData',answerData);
					var quesPaperData =  QuestionPaperMaster.findOne({"_id":answerData.paperName});
					if(quesPaperData){
						// console.log("quesPaperData",quesPaperData);
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
						 		Meteor.call('myTempPracticeExam',questionArray1,quesPaperData,id,(error,result)=>{
							 			if(error){

							 			}else{
						 					questionArrayFromTC.push({'finishText' : 'You are about to finish the Test.',
								 							'finishSubtext': 'Please click on below button to finish the Test.',
								 							'finish_button': 'Finish The Test' });
							 				}		
							 			// }
							 	});
						}
					}
				}
			}
			return id ;
		  }
		 }
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
	'ExamMarksUpdate':function(id,quesPaperDataLen,answeArrayLen,totalCorrectAns,totalWrongAns,totalScore){
		MyExamMaster.update({"_id":id},
		{
			$set:{
				"totalQuestion":quesPaperDataLen,
				"attemptedQues":answeArrayLen,
				"correctAnswer":totalCorrectAns,
				"wrongAnswer":totalWrongAns,
				"totalScore":totalScore,
				"examStatus":"Completed",
			}
		})
	},
	'updateMyExamFee':function(examId){
		MyExamMaster.update({"_id":examId},
		{
			$set:{
				'examFees': 200,
			}
		});
	},
	'addStudentImagesToMaster':function(_id,img){
        MyExamMaster.update(
        {"_id":_id,"StudentId":Meteor.userId()},
           {
			$push:{
				'studentImageArray':{
					'studentImage':img
				}
		      }
		    }
		)     

	},
});