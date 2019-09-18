import {Mongo} from 'meteor/mongo';

export const InstructionMaster = new Mongo.Collection('instructionMaster');
// export const InstructionMaster = new Mongo.Collection('instructionmasters');

if(Meteor.isServer){
	Meteor.publish("instructionData",function(){
		return InstructionMaster.find({});
	});
	Meteor.publish("instruction_Stud",function(){
		return InstructionMaster.find({"instructionFor":"Student Registration"});
	});
	Meteor.publish("instruction_Franchise",function(){
		return InstructionMaster.find({"instructionFor":"Franchise Instruction"});
	});
	Meteor.publish("instruction_ME",function(){
		return InstructionMaster.find({"instructionFor":"Main Exam"});
	});
	Meteor.publish("instruction_PE",function(){
		return InstructionMaster.find({"instructionFor":"Practice Exam"});
	});
	Meteor.publish("instruction_Mod",function(){
		return InstructionMaster.find({"instructionFor":"Moderator"});
	});
	Meteor.publish("TermsandConditions",function(){
		return InstructionMaster.find({"instructionFor":"Terms & Conditions"});
	});
	Meteor.publish("TermsandConditionsStudent",function(){
		return InstructionMaster.find({"instructionFor":"Terms & Conditions For Student"});
	});
	Meteor.publish("TermsandConditionsFranchise",function(){
		return InstructionMaster.find({"instructionFor":"Terms & Conditions For Franchise"});
	});

}

Meteor.methods({

	'addInstruction':function(instructionValue){
	
		var findInstruction = InstructionMaster.findOne({"instructionFor":instructionValue.instructionFor});
		if(findInstruction){
		if(instructionValue.id){
			InstructionMaster.update({"_id":instructionValue.id},
				{
					$set:
						{
						'instructionFor' : instructionValue.instructionFor,
						'instruction'    : instructionValue.instruction,
						}
				},function(error,result){
					if(error){

					}else if(result){

					}
				});
				return 'updated';
			}else{
				
				return 'NotUpdated';
			}
		}else{
			InstructionMaster.insert({
				'instructionFor' : instructionValue.instructionFor,
				'instruction'    : instructionValue.instruction,
				'createdAt'       : new Date(),
			});
			}
	},

	'removeInstruction':function(_id){
		InstructionMaster.remove({"_id":_id})
	},

	'getStudentTerms':function(){
		return InstructionMaster.findOne({"instructionFor":"Terms & Conditions For Student"});
	},
});