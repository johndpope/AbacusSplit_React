import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {createContainer} from 'meteor/react-meteor-data';
import { Email } from 'meteor/email';

import { NotificationTemplate } from '../api/NotificationTemplate.js';


sendMailNotification = function(inputObj) {
	if(inputObj){
	//============================================================
	//  Mail Function
	//============================================================

	var fromId 	= getMailId(inputObj.from);
	var to 		= getMailId(inputObj.to);  
	var subject	= getSubject(inputObj.templateName);
	var body	= getMessageContent(inputObj.templateName,inputObj.variables);

	console.log("from: "+fromId);
	console.log("to: "+to);
	console.log("subject: "+subject);
	console.log("body: "+body);

	Meteor.call('sendEmailnNotification',to, fromId, subject, body,function(error,result){
		if(error){
			Bert.alert(error,'danger', 'growl-top-right');
		}else{
			console.log('Mail Sent','success', 'growl-top-right');
				
			}

	});
	} // if inputObj

}

sendInAppNotification = function(inputObj) {
	if(inputObj){

	//============================================================
	//  Notification Function
	//============================================================

		var notifBody    = getNotificationContent(inputObj.templateName,inputObj.variables);
		var toMailId     = getMailId(inputObj.to); 
		var toUserId     = inputObj.to;
		var templateName = inputObj.templateName;

		// console.log("notifBody: "+notifBody);
		// console.log("to: "+toUserId);

		Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,function(error,result){
			if(error){
				console.log(error,'danger', 'growl-top-right');
			}else if(result){
				console.log("Notification sent",'success', 'growl-top-right');

			}
		}); // end of insertNotification
	} // if inputObj

}

sendSMS = function(inputObj) {
	if(inputObj){

	//============================================================
	//  Notification Function
	//============================================================

		var smsBody    = getSMSContent(inputObj.templateName,inputObj.variables);
		var toUserId   = inputObj.to;
		var toNumber   = inputObj.number;

		// console.log("smsBody: "+smsBody);
		// console.log("to: "+toUserId);
		// console.log("toNumber: "+toNumber);

		Meteor.call('sendSMS',toNumber,smsBody,function(error,result){
			if(error){
				console.log(error);
			}else{
				console.log('SMS sent');
				Meteor.call('insertSMS',toUserId,smsBody,toNumber,function(error,result){
					if(error){
						console.log(error,'danger', 'growl-top-right');
					}else if(result){
						console.log("SMS sent",'success', 'growl-top-right');

					}
				}); // end of insertSMS
			}
		})

	} // if inputObj

}

getMailId = function(to,templateName){
	var userData = Meteor.users.findOne({'_id':to});
	if(userData){
		var emailAddress = userData.emails[0].address;
	}//userData
	return emailAddress;
}

getSubject = function(templateName){
	var NotificationData = NotificationTemplate.findOne({'templateName':templateName});
	if(NotificationData){
		var subject = NotificationData.subject;
	}//NotificationData

	return subject;

}

getMessageContent = function(templateName,varObj){
	// get all content from templatename

	var NotificationData = NotificationTemplate.findOne({"templateType" : "Email",'templateName':templateName});
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace("<p>", "<div>");
		content = content.replace("</p>", "</div>");
		content = content.replace("&nbsp;", " ");
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}


		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData

	return content;
}

getSMSContent = function(templateName,varObj){
	// get all content from templatename

	var NotificationData = NotificationTemplate.findOne({"templateType" : "SMS",'templateName':templateName});
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace("<p>", "<div>");
		content = content.replace("</p>", "</div>");
		content = content.replace("&nbsp;", " ");
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}


		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData

	return content;
}

getNotificationContent = function(templateName,varObj){
	var NotificationData = NotificationTemplate.findOne({"templateType" : "Notification",'templateName':templateName});
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace("<p>", "<div>");
		content = content.replace("</p>", "</div>");
		content = content.replace("&nbsp;", " ");
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}


		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData

	return content;
}

