import { TempLogoImage } from './TempLogoImage.js';
// export const Logo = new Mongo.Collection('logos');
import { Meteor } from 'meteor/meteor';
// import {TempLogoImage} from '/TempLogoImage.js';
// import { Email } from 'meteor/email';
// if(Meteor.isServer){
// 	Meteor.publish("CareerFormData", function(){
// 		return CareerForm.find({});
// 	});	
// }
// console.log('attachment');

Meteor.methods({

  // sendEmail(mailID, content) {
  // 	console.log(mailID, content);
  //   // console.log("Form details - ",to,from,subject,text,extension,attachment);
  // 	// var to     = 'admin@vtc3pl.com';
  // 	// var from   = from;
  // 	// var subject=subject;
  // 	// var text   =text;  	
  // 	// var Resume = attachment;
  // 	// console.log("Resume: ",Resume);

  //   var attach = [];
  //  //  attach.push({filename: "Resume."+extension,path: attachment});
  //  //  console.log("attach ",attach);
  //   var mailSettings = CareerForm.findOne({"uniquemail"	:mailID});
  //   if(mailSettings){
	 //    attach.push({"filename": "Resume."+mailSettings.extension,"path": mailSettings.resume});
	 //    // console.log("attach ",attach);
	 //    var email = {
	 //        from:    mailID,
	 //        to:      'admin@vtc3pl.com',
	 //        subject: "Application for job",
	 //        html:    content,
	 //        attachments: attach
	 //    };    
	 //    // console.log("email ",email);
	 //    if(Meteor.isServer){
  //   		Email.send(email);	
  //   		CareerForm.remove({"uniquemail"	:mailID});
  //   	}
  //   }


  // },

	'UploadLogoFile' : function(fileObjpath,fileobjID){
		if(fileObjpath){
			// var profileobj = LogoFiles.findOne({'_id':fileobjID});

			// if(profileobj){
			// console.log(profileobj);
			// console.log(ResumeFiles.find({'_id':fileObj}).count());
				var path="https://s3.ap-south-1.amazonaws.com/sresiassureit/"+fileObjpath;
				var extension=fileObjpath.split('.')[1];
				TempLogoImage.insert({
					"extension" :extension,
					"logo" 		: path,										
				}, (error,result)=>{
					if(error){
						return error;
					}else{
						return result;
					}
				});
		}
	},

	
	// 'insertCareerForm' : function(content,mailID){
	// 	var careerData = CareerForm.findOne({"uniquemail":mailID});
	// 	if(careerData){
	// 		console.log('insertCareerForm: ',insertCareerForm);
	// 		TempLogoImage.update({"_id":careerData._id},
	// 			{$set:{
	// 				"content" 		: content,
					
	// 			}});
	// 		console.log('insertCareerForm: ',insertCareerForm);
	// 		return careerData._id;
	// 	}
		
	// 	},

		// 'deleteCareerForm' : function(mailID){
		// 	TempLogoImage.remove({"uniquemail":mailID},
		// 	function(error,result){
		// 		if(error){
		// 			return error;
		// 		}else{
		// 			return result;
		// 		}
		// 	}
		// );
		// }

});
