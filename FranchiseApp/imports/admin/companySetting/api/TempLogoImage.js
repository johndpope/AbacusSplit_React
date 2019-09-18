import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const TempLogoImage = new Mongo.Collection('tempLogoImage');
// export const TempLogoImage = new Mongo.Collection('templogoimages');
import { FranchiseDetails } from './CompanySettingMaster.js';

if(Meteor.isServer){
  Meteor.publish('tempLogoImage',function tempLogoImage(){
      return TempLogoImage.find({});
  });
  
}

Meteor.methods({
 'tempLogoImageUpload':function(fileName, fileData){
    var image = TempLogoImage.findOne({});
    if(image){
      TempLogoImage.update({"_id" : image._id},
        {
          $set:{
          'createdAt'     : new Date(),
          'logoFilename'  : fileName,
          'tempLogoImg'   : fileData, 
          } //End of set
        },(error, result)=>{ 
      });
    }else{
      TempLogoImage.insert(
        {
          'createdAt'     : new Date(),
          'logoFilename'  : fileName,
          'tempLogoImg'   : fileData, 
        }, function(error,result){
          // console.log(error,result);
          if(error) {
              return error;
          } else {
              return result;
          }
        }
      );
    }
  },

  'tempLogoImageDelete':function(imgId){
    // TempLogoImage.remove(
    //     {
    //         'logoFilename'  : fileName,
    //     }, function(error,result){
    //               // console.log(error,result);
    //               if(error) {
    //                   return error;
    //               } else {
    //                   return result;
    //               }
    //           }
    //     );
     TempLogoImage.remove({'_id': imgId});
  },
  
});