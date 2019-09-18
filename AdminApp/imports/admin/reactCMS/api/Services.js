import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const Services = new Mongo.Collection("services");
// export const Services = new Mongo.Collection("services");
export const TempServiceImages = new Mongo.Collection("TempServiceImages");
// export const TempServiceImages = new Mongo.Collection("tempserviceimages");

if(Meteor.isServer){
import { ServiceImage } from "../UploadToServer/UploadServiceImgsServer.js";
    Meteor.publish('services',()=>{
        return Services.find({});
    });
    Meteor.publish('tempServiceImages',()=>{
        return TempServiceImages.find({});
    });
    Meteor.publish('singleServices',(_id)=>{
        return Services.find({"_id":_id});   
    });

    Meteor.methods({
      "addNewTemporaryServiceImage": function (id) {
        var data = ServiceImage.findOne({"_id" : id});
        var imageLink = data.link();
          TempServiceImages.insert({
          "userId": Meteor.userId(),
          "imageLink":imageLink,
          "createdAt":new Date(),
          },(error, result)=>{

        });
      }, 
     //  'uploadTempServiceImages':function(id,amazonUrl,uploadTime){
    	// 	TempServiceImages.insert({
    	// 		'id'             : id,
    	// 		'amazonUrl'      : amazonUrl,
    	// 		'uploadTime'     : new Date(),
     //      'authorUserId'   : id,
     //      'submitted'      : false,
    	// 	});
    	// },
     //  'updateTempServiceImages':function(_id,boolean){
    	// 	TempServiceImages.update({
    	// 		'_id'           : _id},
     //      {$set:{
    	// 		'submitted'      : boolean,
    	// 	}}); 
    	// },
      // 'removeTempServiceImages':function(id){
      //   TempServiceImages.remove({'_id':id,'submitted':true});
      // },
      // 'removeServiceUnsubmitImages':function(id){
      //   TempServiceImages.remove({'id':id,'submitted':false});
      // },
      // 'removeServiceUrlImages':function(url){
      //   TempServiceImages.remove({'amazonUrl':url});
      // },
    	'createService':function(ProfileForms,StatutoryForm,AddressForm,EducationForm,WorkForm,SkillsCertificate,OtherInfoForm,serviceName,serviceRate,serviceDuration,servicesDescription,userId,lastModified,serviceFor,fieldChecklist,serviceDayNumbers){
        // var tempServiceImages = 
        // console.log(s3);
        var getImage              = TempServiceImages.findOne({}, {sort: {createdAt: -1, limit: 1}});
        if(getImage){
          var image               = getImage.imageLink;
        }else{
          var image               = "/images/assureid/noImage.png";
        }

    		Services.insert({
          'ProfileForms'          : ProfileForms,
          'StatutoryForm'         : StatutoryForm,
          'AddressForm'           : AddressForm,
          'EducationForm'         : EducationForm,
          'serviceDayNumbers'     : serviceDayNumbers,
          'WorkForm'              : WorkForm,
          'SkillsCertificate'     : SkillsCertificate,
          'OtherInfoForm'         : OtherInfoForm,
          'serviceName'           : serviceName,
    			'serviceRate'           : serviceRate,
          'serviceDuration'       : serviceDuration,
    			'servicesDescription'   : servicesDescription,
          'image'                 : image,
    			'createdAt'     : new Date(),
          'authorUserId'  : userId,
          'lastModified'  : lastModified,
          'serviceFor'    : serviceFor,
          'fieldChecklist' : fieldChecklist,
    		}); 
        TempServiceImages.remove({});
     	},
      'updateService':function(id,ProfileForms,StatutoryForm,AddressForm,EducationForm,WorkForm,SkillsCertificate,OtherInfoForm,serviceName,serviceRate,serviceDuration,servicesDescription,userId,lastModified,serviceDayNumbers,serviceFor,fieldChecklist){
    		   var data = TempServiceImages.findOne({"userId":Meteor.userId()});
            if(data){
                var imageLink     = data.imageLink;
            }else{
                var oldImgData    = Services.findOne({"_id":id},{sort:{"createdAt":-1}});
                if(oldImgData){
                    var imageLink = oldImgData.image;
                }
            }
             
        Services.update(
    			{ '_id': id },
    	        {
    	          $set:{
                  'ProfileForms'          : ProfileForms,
                  'StatutoryForm'         : StatutoryForm,
                  'AddressForm'           : AddressForm,
                  'EducationForm'         : EducationForm,
                  'serviceDayNumbers'     : serviceDayNumbers,
                  'WorkForm'              : WorkForm,
                  'SkillsCertificate'     : SkillsCertificate,
                  'OtherInfoForm'         : OtherInfoForm,
                  'serviceName'           : serviceName,
                  'serviceRate'           : serviceRate,
                  'serviceDayNumbers'     : serviceDayNumbers,
                  'serviceDuration'       : serviceDuration,
                  'servicesDescription'   : servicesDescription,
                  'image'                 : imageLink,
                  'authorUserId'          : userId,
                  'lastModified'          : lastModified,
                  'serviceFor'            : serviceFor,
                  'fieldChecklist'        : fieldChecklist,
    	        } //End of set
    	      }
    		);
        TempServiceImages.remove({});

    	},
     //  'updateEditService':function(amazonUrl){
    	// 	Services.update(
    	// 		{ "s3.amazonUrl": amazonUrl },
    	//         {
    	//           $set:{
     //              's3.$.amazonUrl'   : "",
     //              's3.$.uploadTime'  : "",
    	//         } //End of set
    	//       }
    	// 	);
    	// },
     //  'updateServiceAmazonUrl':function(amazonUrl,uploadTime,id){
    	// 	Services.update(
    	// 		   { '_id': id },
    	//         {
    	//           $push:{
     //                's3':
     //                {
     //                  'amazonUrl': amazonUrl,
     //                  'uploadTime':uploadTime,
     //                }
    	//         }
    	//       }
    	// 	);
    	// },
      'deleteService':function(id){
     		 Services.remove({'_id': id});
    	},
    });
}
