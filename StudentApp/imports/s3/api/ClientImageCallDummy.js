import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';

import {ProductImage} from './ProductImage.js';
export const TempImage = new Mongo.Collection('tempImage');
// export const TempImage = new Mongo.Collection('tempimages');

if(Meteor.isServer){
	
	Meteor.publish("TempImages",function(){
		return TempImage.find({});
	});

	import {ProductImage} from './ProductImage.js';


	Meteor.methods({
		
		"addProductImages": function(productId){

		    var link = ProductImage.findOne({_id:productId}).link();
		        // link = link.replace('tms.iassureit.com','tms.adrekusa.com'); 
		    // console.log("product link = ",link);  
		    TempImage.remove({'userId':Meteor.userId()});
		           TempImage.insert({ 
		                'userId'      : Meteor.userId(),
		                 // 'type'        : 'Product', 
		                 'imagePath'   : link,   
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
				})
			}
		}
	});
}