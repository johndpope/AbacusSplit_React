import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import {TempImage} from '/imports/s3/api/ClientImageCall.js';
import {TempDocumentsImage} from '/imports/s3/api/ClientImageCall.js';

export const FranchiseDetailsMaster = new Mongo.Collection('franchiseDetailsMaster');
// export const FranchiseDetailsMaster = new Mongo.Collection('franchisedetailsmasters');

if(Meteor.isServer){
	Meteor.publish("allFranchise",function(){
		// console.log("console : ",)
		return FranchiseDetailsMaster.find({});
	});

	
}

Meteor.methods({
	"addFranchiseDetails":function(formvalues,_id,IP,res){
		// console.log("formvalues-->",formvalues,_id,IP,res);
		var documentType = ["Adhar Card", "Pan Card","Bank Passbook"];
		var adharDoc = '';
		var panDoc = '';
		var bankDoc = '';
		var Document=[];
		for(var i=0;i<documentType.length;i++){
			var docFound = TempDocumentsImage.findOne({"userId":Meteor.userId() , "documentType" : documentType[i]});
			if(docFound){
				if(i==0){
					var obj={
						DocumentType:documentType[i],
						ImgSource:docFound.imagePath,
					}
					 Document.push(obj);
					
				}else if(i==1){
					var obj={
						DocumentType:documentType[i],
						ImgSource:docFound.imagePath,
					}
					 Document.push(obj);
					
				}else if(i==2){
					var obj={
						DocumentType:documentType[i],
						ImgSource:docFound.imagePath,
					}
					 Document.push(obj);
					
				}
			}
		}
		var TempImg = TempImage.findOne({"userId":Meteor.userId()});
		if(TempImg){
			var imgSrc = TempImg.imagePath;
			TempImage.remove({'userId':Meteor.userId()});
		}
		if(!_id && formvalues && IP){
			FranchiseDetailsMaster.insert({
				"franchiseID"        : res,
				"firstName"          : formvalues.firstName,
				"middleName"         : formvalues.middleName,
				"lastName"           : formvalues.lastName,
				"contactNo"          : formvalues.contactNo,
			    "alternateContactNo" : formvalues.alternateContactNo,
				"addressLine1"       : formvalues.addressLine1,
				"addressLine2"       : formvalues.addressLine2,
				"city"               : formvalues.city,
				"state"              : formvalues.state,
				"country"            : formvalues.country,
				"pincode"            : formvalues.pincode,
				"mail"               : formvalues.mail,
				"dob"                : formvalues.dob,
				"franchiseName"      : formvalues.franchiseName,
				"franchisePhoto"     : imgSrc,
				"Documents"			 : Document,
				"IPAddress"          : IP,
				"franchiseCode"      : formvalues.franchiseCode,
				"createdAt"          :new Date(),
				"RegistrationDate"   :moment(new Date()).format("MM.DD.YYYY"),
				"RegistrationTime"   :moment(new Date()).format('HH:mm:ss'),
			},(error,result)=>{
					if(error){

					}else{
						TempDocumentsImage.remove({'userId':Meteor.userId()});
					}
				}
			);

			
		}else{
			if(formvalues){
			FranchiseDetailsMaster.update({"_id":_id},{
				$set:{
					"firstName"          : formvalues.firstName,
					"middleName"         : formvalues.middleName,
					"lastName"           : formvalues.lastName,
					"contactNo"          : formvalues.contactNo,
			   	    "alternateContactNo" : formvalues.alternateContactNo,
					"addressLine1"       : formvalues.addressLine1,
					"addressLine2"       : formvalues.addressLine2,
					"city"               : formvalues.city,
					"state"              : formvalues.state,
					"country"            : formvalues.country,
					"pincode"            : formvalues.pincode,
					"mail"               : formvalues.mail,
					"dob"                : formvalues.dob,
					"franchiseName"      : formvalues.franchiseName,
					"franchisePhoto"     : imgSrc,
					"Documents"			 : Document,
					"IPAddress"          : IP,
					"franchiseCode"      : formvalues.franchiseCode,
					
				}
			},(error,result)=>{
				if(error){

				}else{
					TempDocumentsImage.remove({'userId':Meteor.userId()});
				}
			}
			);
		}
	}
	},

	'removeCompanyImage':function(imgLink,_id){
    FranchiseDetailsMaster.update(
      {"_id":_id},
      {$unset: 
          {
            'franchisePhoto' : imgLink,  
          }
      }
    ); 
    FranchiseDetailsMaster.update(
      {"_id":_id},
      {$pull: 
          {
            'franchisePhoto' : null,
          }
      }
    ); 
  },
	'RemoveFranchiseDetails':function(_id){
		FranchiseDetailsMaster.remove({"_id":_id});
	},

	'allFranchise':function(){
		 return FranchiseDetailsMaster.find({},{sort: {createdAt: -1}}).fetch();

	},
	
	'SearchFranchise':function(studName){
		return FranchiseDetailsMaster.find({$or:[{'franchiseName':studName},{'contactNo':studName},{'firstName':studName},{'mail': studName}]}).fetch();

	},

	
	

});