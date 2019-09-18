import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';

import {ProductImage} from './ProductImage.js';
export const TempImage = new Mongo.Collection('tempImage');
export const TempImageNetSpeed = new Mongo.Collection('tempImageNetSpeed');
export const TempDocumentsImage = new Mongo.Collection('tempDocumentsImage');
export const StudentExamAppearingImage = new Mongo.Collection('studentExamAppearingImage');
// export const TempImagee = new Mongo.Collection('tempImagees');
// export const TempImage = new Mongo.Collection('tempimages');
// export const TempImageNetSpeed = new Mongo.Collection('tempimagenetspeeds');
// export const TempDocumentsImage = new Mongo.Collection('tempdocumentsimages');
// export const StudentExamAppearingImage = new Mongo.Collection('studentexamappearingimages');

if(Meteor.isServer){
	
	Meteor.publish("TempImages",function(){
		return TempImage.find({});
	});

	Meteor.publish("loginImgTempImages",function(){
		return TempImage.find({"userId":Meteor.userId()});
	});
	Meteor.publish("TempDocumentsImages",function(){
		return TempDocumentsImage.find({});
	});

	Meteor.publish("loginImgTempImagesNetSpeed",function(){
		return TempImageNetSpeed.find({"userId":Meteor.userId()});
	});

	import {ProductImage} from './ProductImage.js';


	Meteor.methods({
		
		"addProductImages": function(productId){

		    // var link = ProductImage.findOne({_id:productId}).link();
		    //  TempImage.remove({'userId':Meteor.userId()});

		    //        TempImage.insert({ 
		    //             'userId'      : Meteor.userId(),
		    //              'imagePath'   : link,   
		    //         }); 
		    var imgPath = ProductImage.findOne({_id:productId}).path;

		     var link1 = ProductImage.findOne({_id:productId});
		    // console.log("link-------->",link);
		    if(link1){
		    // console.log("link1",link1.path);

		    	var ext=(link1.path).split(".");
			    if(ext){
			    	var ImgExt=ext[1]

			    }
		    }	
		     var tempImgPath = ProductImage.findOne({_id:productId}).link();


		    var imgPath = ProductImage.findOne({_id:productId}).path;
		    if(imgPath){
		    	 // var link = "https://s3.ap-south-1.amazonaws.com/onlineabacus/"+imgPath;
		    	 var link = "https://s3.ap-south-1.amazonaws.com/onlineexamabacus/"+imgPath;
		    	 if(link){
		    	 	TempImage.remove({'userId':Meteor.userId()});
		           	TempImage.insert({ 
		                'userId'      : Meteor.userId(),
		                'imagePath'   : link, 
		                'tempPath'    :  tempImgPath+"."+ImgExt,   
		            });
		    	 }
		    }
		     
		},
		"addProductImagesNetSpeed": function(productId){

		    var link = ProductImage.findOne({_id:productId}).link();
		    TempImageNetSpeed.remove({'userId':Meteor.userId()});
		           TempImageNetSpeed.insert({ 
		                'userId'      : Meteor.userId(),
		                 'imagePath'   : link,   
		            });   
		},
		'CountOfImagesNetSpeed':function(){
			return TempImageNetSpeed.findOne({});
		},
		"addProductDocumentImages": function(productId,documentType){

		    // var link = ProductImage.findOne({_id:productId}).link();
		    //        TempDocumentsImage.insert({ 
		    //             'userId'      : Meteor.userId(),
		    //              'imagePath'   : link,   
		    //              'documentType'   : documentType,   
		    //         });  

		           
		    var docImgPath = ProductImage.findOne({_id:productId}).path;
		    if(docImgPath){
		     // var link = "https://s3.ap-south-1.amazonaws.com/onlineabacus/"+docImgPath;
		     var link = "https://s3.ap-south-1.amazonaws.com/onlineexamabacus/"+docImgPath;
		     if(link){

		     	TempDocumentsImage.insert({ 
		                'userId'      : Meteor.userId(),
		                 'imagePath'   : link,   
		                 'documentType'   : documentType,   
		            });

		     }
		    }


		},

		"addStusentExamAppearingImages": function(fileObjId,examId){

	    var link = ProductImage.findOne({_id:fileObjId}).link();
	    // TempDocumentsImage.remove({'userId':Meteor.userId()});

	           // StudentExamAppearingImage.insert({ 
	           //      'userId'      : Meteor.userId(),
	           //       'imagePath'   : link,  
	           //       'examId'       :  documentType
	           //       // 'documentType'   : documentType,   
	           //  });
	            Meteor.call('addStudentImagesToMaster',examId,link,function(error,result){
			    if(error){
			    // console.log(error.reason);
			    }else{
			    console.log('result');
			    }
			    });
				   
		},
		// remove if you ant to delete photo and add new.

		"removeprofPhoto":function(userId){
			var isExist = TempImage.remove({"userId":userId});
			if(!isExist){
				StudentMaster.update({"studentId":userId},
				{
					$set:{
						'imgSrc': '',
					}
				});
				Meteor.users.update({"_id":userId},
				{
					$set:{
						'profile.userProfile': '',
					}
				});
			}
		},
		"removeprofDocumentPhoto":function(userId,documentID){
			var isExist = TempDocumentsImage.findOne({"userId":userId});
			if(isExist){
				TempDocumentsImage.remove({'_id': documentID});
			}
		},


	});
}