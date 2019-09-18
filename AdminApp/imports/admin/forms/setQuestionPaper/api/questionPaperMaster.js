import {Meteor} from 'meteor/meteor';
import {QuestionMaster} from '/imports/admin/forms/addQuestions/api/questionMaster.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {MyPracticeExamMaster} from '/imports/admin/forms/student/api/myPracticeExamMaster.js';
import {PackageQuestionPaperMaster} from '/imports/admin/forms/invoice/api/packageQuestionPaperMaster.js';

export const QuestionPaperMaster = new Mongo.Collection('questionPaperMaster');
// export const QuestionPaperMaster = new Mongo.Collection('questionpapermasters');

if(Meteor.isServer){
	// QuestionPaperMaster._ensureIndex({questionsArray : { $elemMatch : { questionId:1} } },{ unique: true });
	Meteor.publish("ShowQuestionPaper",function(){
		return QuestionPaperMaster.find({});		
	});

	Meteor.publish("CreateExamShowQuestionPaper",function(){		
		return QuestionPaperMaster.find({"examType":"Final Exam","isDraft" : ""});		
	});

	Meteor.publish("ShowQuestionPaperCategorywise",function(category,subCategory){

		return QuestionPaperMaster.find({"examType":"Practice Exam","category":category,"subCategory":subCategory},{sort:{'createdAt':-1}});		
	});

	Meteor.publish("ShowQuestionPaperMainExam",function(category,subCategory){
		return QuestionPaperMaster.find({"examType":"Final Exam","category":category,"subCategory":subCategory},{sort:{'createdAt':-1}});		
	});


	Meteor.publish("singleQuestionPaper",function(id){
		return QuestionPaperMaster.find({"_id":id});	
	});

	Meteor.publish("questionPaperbyCategory",function(category){
		return QuestionPaperMaster.find({"category":category});	
	});
	Meteor.publish("quesPaperPracticeExam",function(category){
		return QuestionPaperMaster.find({"examType":"Practice Exam"});	
	});
	Meteor.publish("assignedPracticePaper",function(category){
		return QuestionPaperMaster.find({"examType":"Practice Exam","paperStatus" : "Assigned"});	
	});
	Meteor.publish("quesPaperTitle",function(questionPaperTit){
		return QuestionPaperMaster.find({"quePaperTitle":questionPaperTit});	
	});
	Meteor.publish('allQuestionPaperCount', function() {
	  Counts.publish(this, 'allQuestionPaperCount', QuestionPaperMaster.find({"isDraft":{$nin:["[Draft]"]}}));
	});
	
}

Meteor.methods({
	'createQuestionPaper':function(formValues){
		if(formValues._id){
			var _id = QuestionPaperMaster.update({"_id":formValues._id},
				{
					$set:{
						'examType'      : formValues.examType,
						'quePaperTitle' : formValues.quePaperTitle,
						'category'      : formValues.category,
						'subCategory'   : formValues.subCategory,
						// 'Level'         : formValues.Level,
						'noOfQuestion'  : formValues.noOfQuestion,
						'marksPerQues'  : formValues.marksPerQues,
						'totalMarks'    : formValues.totalMarks,
						'examTime'      : formValues.examTime,
						"status" : "IncompleteQPaper",
    					"isDraft" : "[Draft]", 
					}});
		}else{
			if(formValues.examType !="Practice Exam"){
				var paperId = QuestionPaperMaster.insert({
					'examType'      : formValues.examType,
					'quePaperTitle' : formValues.quePaperTitle,
					'category'      : formValues.category,
					'subCategory'   : formValues.subCategory,
					// 'Level'         : formValues.Level,
					'noOfQuestion'  : formValues.noOfQuestion,
					'marksPerQues'  : formValues.marksPerQues,
					'totalMarks'    : formValues.totalMarks,
					'examTime'      : formValues.examTime,
					'createdAt'      : new Date(),
					'questionsArray':[],
				},function(error,result){
					if(error){

					}else if(result){

					}
					
				});
				return paperId;
			}else{
				var paperId = QuestionPaperMaster.insert({
					'examType'      : formValues.examType,
					'quePaperTitle' : formValues.quePaperTitle,
					'category'      : formValues.category,
					'subCategory'   : formValues.subCategory,
					// 'Level'         : formValues.Level,
					'noOfQuestion'  : formValues.noOfQuestion,
					'marksPerQues'  : formValues.marksPerQues,
					'totalMarks'    : formValues.totalMarks,
					'examTime'      : formValues.examTime,
					'createdAt'      : new Date(),
					'questionsArray':[],
					'paperStatus' : 'Not Assign',
				},function(error,result){
					if(error){

					}else if(result){

					}
					
				});
				return paperId;
			}
		}
	},

	'addQuestioToPaper':function(questionId,_id){
			var quesMasterData =  QuestionMaster.findOne({"_id":questionId});
			if(quesMasterData){
			// Meteor.call("updateQuestionMaster",questionId);

			var questionId = QuestionPaperMaster.update({"_id":_id},
			{
				$push:{
					"questionsArray":{
						'questionId'    : questionId,
						'question'      : quesMasterData.question,
						'A'    			: quesMasterData.A,
						'B'    			: quesMasterData.B,
						'C'             : quesMasterData.C,
						'D'             : quesMasterData.D,
						'correctAnswer' : quesMasterData.correctAnswer,
					}
				}
			});
		}
			
	},

// add Multple questions at a time

	'addMultipleQuestionToPaper':function(questionArray,_id){
		var duplicate_cnt   = 0;
		var nonDuplicateCnt = 0;
		var extraQuestion   = 0;
		var removedQuestions = [];
		questionArray.map((questions, index)=>{
			var quesMasterDataFound =  QuestionPaperMaster.findOne({"_id":_id,"questionsArray.questionId":questions});
			if(!quesMasterDataFound){
				// console.log(quesMasterDataFound);
				var getArrayLen = QuestionPaperMaster.findOne({"_id":_id});
				if(getArrayLen){
					var questionsArray = getArrayLen.questionsArray;
					if(questionsArray){
						var questionsArrayLen = questionsArray.length;
						if(getArrayLen.noOfQuestion>questionsArrayLen){
							nonDuplicateCnt = nonDuplicateCnt + 1;
							var quesMasterData =  QuestionMaster.findOne({"_id":questions});
							if(quesMasterData){
								var questionId = QuestionPaperMaster.update({"_id":_id},
								{
									$push:{
										"questionsArray":{
											'questionId'    : questions,
											'question'      : quesMasterData.question,
											'A'    			: quesMasterData.A,
											'B'    			: quesMasterData.B,
											'C'             : quesMasterData.C,
											'D'             : quesMasterData.D,
											'correctAnswer' : quesMasterData.correctAnswer,
										}
									}
								});
							}	
						}else{
							extraQuestion = extraQuestion + 1;
						}
					}
				}
				
			}else{
				duplicate_cnt = duplicate_cnt + 1;
				removedQuestions.push(questions);
				QuestionPaperMaster.update({"_id":_id},
				{
					$pull:{
						"questionsArray":{
							"questionId":questions,
						}
					}
				});
			}
		});
		var duplicate_nonDuplicate = [nonDuplicateCnt,duplicate_cnt,removedQuestions,extraQuestion];
		return duplicate_nonDuplicate;
		// console.log("duplicatequestion count -----> ",cnt);
		// console.log("non duplicates ------>",nonDuplicateCnt);
	},

	'removeSelectedQuestion':function(id,questionId){
		// console.log(id);
		// Meteor.call("updateQuestionMasterFalse",questionId);

		QuestionPaperMaster.update({"_id":id},
		{
			$pull:{
				"questionsArray":{
					"questionId":questionId,
				}
			}
		});
	},
	
	'removeQuestionPaper':function(_id){
		var ExistInMainExam = ExamMaster.findOne({"competitionExams.questionPaperId":_id});
		if(ExistInMainExam){
			return 'CantDeleteExamCreated';
		}else{
			var existInQPMaster = QuestionPaperMaster.findOne({"_id":_id,'paperStatus' : 'Assigned'});
			if(existInQPMaster){
				return 'qpAssigned';
			}else{
				QuestionPaperMaster.remove({"_id":_id});
			}
		}
	},

	'IsQuestionPaperAttempted':function(_id){
		var ExistInAnswrSheet = PackageQuestionPaperMaster.findOne({"questionPaper_id":_id});
		if(ExistInAnswrSheet){
			return 'CantDeletePracticeExam';
		}else{
			return 'DeletePracticeExam'
		}
	},

	'saveDraft':function(_id){
		QuestionPaperMaster.update({"_id":_id},
		{
			$set:{
				'status': 'IncompleteQPaper',
				'isDraft': '[Draft]',
			}
		})
	},
	'saveQuestionPaper':function(_id){
		QuestionPaperMaster.update({"_id":_id},
		{
			$set:{
				'status': 'CompleteQPaper',
				'isDraft': '',
			}
		})
	},

	'AssignOrUnAssignStatus':function(_id){
		var paperStatusData = QuestionPaperMaster.findOne({"_id":_id,"paperStatus": "Not Assign"});
		if(paperStatusData){
			QuestionPaperMaster.update({"_id":_id},
			{
				$set:{
					'paperStatus' : 'Assigned', 	
				}
			});
		}else{
			QuestionPaperMaster.update({"_id":_id},
			{
				$set:{
					'paperStatus' : 'Not Assign',
				}
			});
		}
		
	}
});