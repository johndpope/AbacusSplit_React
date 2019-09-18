
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {Session} from 'meteor/session';
import { check} from 'meteor/check';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
export const QuestionMaster = new Mongo.Collection('questionMaster');
// export const QuestionMaster = new Mongo.Collection('questionmasters');

if(Meteor.isServer){
	Meteor.publish("allQuestion",function(){
		return QuestionMaster.find({});
	});
	Meteor.publish("categorywiseQuestion",function(category){
		return QuestionMaster.find({'categoryName':category});
	});

	Meteor.publish("showCategoryWiseQuestion",function(category,subCategory,startRange,limitRange){
		return QuestionMaster.find({'categoryName':category,"subCategory":subCategory},{sort:{'createdAt':-1},skip:startRange, limit: limitRange});
	});

	Meteor.publish('allQuestionCount', function() {
  		Counts.publish(this, 'allQuestionCount', QuestionMaster.find());
	});

	Meteor.publish("showCatWiseQuesforPagination",function(category,subCategory){
		Counts.publish(this, 'showCatWiseQuesforPagination', QuestionMaster.find({'categoryName':category,"subCategory":subCategory}));
	});

	Meteor.publish("singleQuestion",function(_id){
		return QuestionMaster.find({"_id":_id});
	});


Meteor.methods({
	
	/*
		Add question using form.
	*/
	'addQuestion':function(questionValues,_id){
			if(questionValues._id){
				QuestionMaster.update({"_id":questionValues._id},
					{
						$set:{
							'categoryName'  : questionValues.categoryName,
							'subCategory'   : questionValues.subCategory,
							'question'      : questionValues.question,
							'A'             : questionValues.option_A,
							'B'             : questionValues.option_B,
							'C'             : questionValues.option_C,
							'D'             : questionValues.option_D,
							'correctAnswer' : questionValues.correctAnswer,
						}
					}
				);
			}else{	
			var QuestionExist = QuestionMaster.findOne({"question":questionValues.question,'subCategory':questionValues.subCategory});
			if(!QuestionExist){
				QuestionMaster.insert({
					'categoryName'  : questionValues.categoryName,
					'subCategory'   : questionValues.subCategory,
					'question'      : questionValues.question,
					'A'             : questionValues.option_A,
					'B'             : questionValues.option_B,
					'C'             : questionValues.option_C,
					'D'             : questionValues.option_D,
					'correctAnswer' : questionValues.correctAnswer,
					'createdAt'     : new Date(),
				});
			}else{
				return 'QExist';
			}
		}
	},

	'getQuestionData' : function(categoryName,subCategory,startRange,limitRange){
		var questionMasterData = QuestionMaster.find({"categoryName":categoryName, "subCategory":subCategory},{sort:{'createdAt':-1},skip:startRange, limit: limitRange}).fetch();
		return questionMasterData;
	},
	
	'getQuestionDataaa' : function(categoryName,subCategory,startRange,limitRange){
		var questionMasterData = QuestionMaster.find({"categoryName":categoryName, "subCategory":subCategory},{sort:{'createdAt':-1},skip:startRange, limit: limitRange}).fetch();
		return questionMasterData;
	},

	/*
		upload question using csv file.
	*/
	'BulkQuestionCSVUpload': function(csvObject){
		check( csvObject, Array);
		var test = [];
		// console.log('csvObject: ',csvObject);
		if(csvObject){
			// console.log("csvObject.length: ",csvObject.length);
			UserSession.set("allProgressbarSession", csvObject.length-1, Meteor.userId());
			for(i=0;i<csvObject.length;i++){
				var uploadQuestion = csvObject[i];
				var QuestionExist = QuestionMaster.findOne({"question":csvObject[i].question,'subCategory':csvObject[i].subCategory});
				if(!QuestionExist){
					test[i] = QuestionMaster.insert({
						'categoryName'  : csvObject[i].categoryName,		
						'subCategory'   : csvObject[i].subCategory,		
						'question'      : csvObject[i].question,	
						'A'             : csvObject[i].A,	
						'B'             : csvObject[i].B,	
						'C'             : csvObject[i].C,	
						'D'             : csvObject[i].D,	
						'correctAnswer' : csvObject[i].correctAnswer,
						'createdAt'     : new Date(),	
					});
				}else{
					test[i]= QuestionMaster.update({"_id":QuestionExist._id},
					{
						$set:{
							'categoryName'  : csvObject[i].categoryName,		
							'subCategory'   : csvObject[i].subCategory,		
							'question'      : csvObject[i].question,	
							'A'             : csvObject[i].A,	
							'B'             : csvObject[i].B,	
							'C'             : csvObject[i].C,	
							'D'             : csvObject[i].D,	
							'correctAnswer' : csvObject[i].correctAnswer,
							'createdAt'     : new Date(),	
						}
					});
						
					
				}

				if(test[i]){
					UserSession.set("progressbarSession", i, Meteor.userId());
				}

			}// EOF i
		}
	},

	 // 'BulkContactCSVUpload': function(csvObject){
  //       check( csvObject, Array);
  //       var test = [];
  //       if(csvObject){
  //         UserSession.set("allProgressbarSessionContact", csvObject.length-2, Meteor.userId());
  //         var contactArray=[];
  //         var arrayLength=csvObject.length;
  //         for(i=0;i<arrayLength;i++){
  //           var uploadQuestion = csvObject[i];
  //           contactArray.push({'userName'  : csvObject[i].userName,'contactNum'  : csvObject[i].contactNum,})
  //           if(test[i]){
  //             UserSession.set("progressbarSessionContact", i, Meteor.userId());
  //           }

  //         }// EOF i
  //           // console.log("---->",contactArray);
  //           console.log("-UserSession--->",UserSession.get("allProgressbarSession"));

  //           // return contactArray


          
  //       }
  //     },
	
	/*
		Remove selected question.
	*/
	'removeQuestion':function(_id){
		var quesExist = QuestionPaperMaster.findOne({'questionsArray.questionId':_id});
		if(quesExist){
			return quesExist;
		}else{
			QuestionMaster.remove({"_id":_id});
		}
	},
	'updateQuestionMaster':function(_id){
		QuestionMaster.update({"_id":_id},
			{
				$set:{
					'checkBox': true,
				}
			});
	},
	'updateQuestionMasterFalse':function(_id){
		QuestionMaster.update({"_id":_id},
			{
				$set:{
					'checkBox': false,
				}
			});
	},
	 deleteSelectedQuestions: function(checkedQuestionList){
	    // console.log('Serverside-Checked checkboxes:'+ array);
	    for (var i=0; i<checkedQuestionList.length; i++) {
	        // console.log('value: ' + array[i]);
	      QuestionMaster.remove({'_id': checkedQuestionList[i]}); //end of update
	    } //End of for loop

	},
})

}