import {Mongo} from 'meteor/mongo';
import {Meteor} from 'meteor/meteor';

export const UserProfile = new Mongo.Collection("userProfile");
// export const UserProfile = new Mongo.Collection("userprofiles");
export const TempProofDocs = new Mongo.Collection("tempProofDocs");
// export const TempProofDocs = new Mongo.Collection("tempproofdocs");

if(Meteor.isServer){
  import { ProofDocuments } from "../UploadToServer/ProofUploadServer.js";
  Meteor.publish('userProfileData',(userProfileData)=>{
    var data = UserProfile.find({});
    // console.log("data: ",data);
    return data;
  }); 
  Meteor.publish('TempProofDocs',(_id)=>{
    return TempProofDocs.find({"userId": _id});
  });
  Meteor.publish('LatestTempProofDocs',()=>{
    return TempProofDocs.find({}, {sort: {createdAt: -1, limit: 1}});
  });
  Meteor.publish('userprofile',(_id)=>{
    // console.log(UserProfile.find({}).fetch());
    return UserProfile.find({"userId": _id});
  });
  Meteor.publish('userprofilePerCls',(_id)=>{
    var fields:{"profilePercent":1,"profileBasicClass":1,"profileIdentityClass":1}
    return UserProfile.find({"userId" : _id},{fields});
  });
 
  Meteor.methods({
    "updateUserProfile": function(userId,imageLink) {
      UserProfile.update(
        {'userId': userId },
        {
          $set:{
            "userProfile" :  imageLink,
          } //End of set
        }
      );
    },
    "addNewTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      // console.log('data:',data);
      // console.log('prooftype:',prooftype);
      var imageLink = data.link();
      UserProfile.update({"userId" : userId},
        {
          $set:{
            ['identity.'+proofSubtype] :  imageLink,
            ['identity.'+proofSubtype+"ext"] :data.ext,
            ['identity.'+proofSubtype+"name"] :data.name,
          } //End of set
        },(error, result)=>{
      });
    },
    "addCertTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      // console.log('data:',data);
      // console.log('prooftype:',prooftype);
      var imageLink = data.link();
      var certificateProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'certificates',"proofSubtype":'certificate'});
      var certProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'certificates',"proofSubtype":'editCertificate'});
      if(proofSubtype == "certificate"){
        if(certificateProof){
          TempProofDocs.update({"_id" : employementProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
      if(proofSubtype == "editCertificate"){
        if(certProof){
          TempProofDocs.update({"_id" : empProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
    }, 
    "addEmpTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      // console.log('data:',data);
      // console.log('prooftype:',prooftype);
      var imageLink = data.link();
      // UserProfile.update({"userId" : userId},
      //   {
      //     $push: 
      //       {
      //         "employement" : {
      //           'proofOfEmployement' :imageLink,
      //           'empFileExt'  :data.ext,
      //           'empFileName' :data.name,
      //         }
      //       }
          
      //   },(error, result)=>{
      // });
      var employementProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'employement',"proofSubtype":'employementDetails'});
      var empProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'employement',"proofSubtype":'editEmployementDetails'});
      if(proofSubtype == "employementDetails"){
        if(employementProof){
          TempProofDocs.update({"_id" : employementProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
      if(proofSubtype == "editEmployementDetails"){
        if(empProof){
          TempProofDocs.update({"_id" : empProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        } 
      }
    },
    "addCurrentAddressTempDocs": function(imgLink,imgName,imgExt){
      var prooftype = 'address';
      var proofSubtype = 'currentAddress';
      var userId = Meteor.userId();
      var currentAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'currentAddress'});
      if(currentAddrProof){
        TempProofDocs.update({"_id" : currentAddrProof._id},
          {
            $set:{
              "userId": userId,
              "imageLink":imgLink,
              "ext":imgExt,
              "name":imgName,
              "prooftype": prooftype,
              "proofSubtype":proofSubtype,
              "createdAt":new Date(),
            } //End of set
          },(error, result)=>{
        });  
      }else{
        TempProofDocs.insert({
          "userId": userId,
          "imageLink":imgLink,
          "ext":imgExt,
          "name":imgName,
          "prooftype": prooftype,
          "proofSubtype":proofSubtype,
          "createdAt":new Date(),
          },(error, result)=>{
        });
      }
    },
    "addAddrTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      // console.log('data:',data);
      // console.log('prooftype:',prooftype);
      var imageLink = data.link();
      var permanentAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'permanentAddress'});
      var currentAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'currentAddress'});
      var perAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'editPermanentAddress'});
      var currAddrProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'editCurrentAddress'});
      if(proofSubtype == "permanentAddress"){
        if(permanentAddrProof){
          TempProofDocs.update({"_id" : permanentAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "currentAddress"){
        if(currentAddrProof){
          TempProofDocs.update({"_id" : currentAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editPermanentAddress"){
        if(perAddrProof){
          TempProofDocs.update({"_id" : perAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editCurrentAddress"){
        if(currAddrProof){
          TempProofDocs.update({"_id" : currAddrProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
    },
    "addEduTempProofDocs": function (id,userId,prooftype,proofSubtype) {
      var data = ProofDocuments.findOne({"_id" : id});
      // console.log('data:',data);
      // console.log('prooftype:',prooftype);
      var imageLink = data.link();
      var basicEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'education',"proofSubtype": 'basicEducation'});
      var proEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'professionalEducation'});
      var basEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'education',"proofSubtype": 'editBasicEducation'});
      var profEduProof = TempProofDocs.findOne({"userId": userId,"prooftype": 'address',"proofSubtype": 'editProfessionalEducation'});
      if(proofSubtype == "basicEducation"){
        if(basicEduProof){
          TempProofDocs.update({"_id" : basicEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "professionalEducation"){
        if(proEduProof){
          TempProofDocs.update({"_id" : proEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editBasicEducation"){
        if(basEduProof){
          TempProofDocs.update({"_id" : basEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
      if(proofSubtype == "editProfessionalEducation"){
        if(profEduProof){
          TempProofDocs.update({"_id" : profEduProof._id},
            {
              $set:{
                "userId": userId,
                "imageLink":imageLink,
                "ext":data.ext,
                "name":data.name,
                "prooftype": prooftype,
                "proofSubtype":proofSubtype,
                "createdAt":new Date(),
              } //End of set
            },(error, result)=>{
          });  
        }else{
          TempProofDocs.insert({
            "userId": userId,
            "imageLink":imageLink,
            "ext":data.ext,
            "name":data.name,
            "prooftype": prooftype,
            "proofSubtype":proofSubtype,
            "createdAt":new Date(),
            },(error, result)=>{
          });
        }
      } 
    }, 
    "insertBasicData": function (formValues,proofDocumentLink) {
        // console.log("formValues: ",formValues);
        if(formValues.firstName != '' && formValues.lastName != '' && formValues.fatherFirstName != '' &&
        formValues.fatherLastName != '' && formValues.motherFirstName != '' && formValues.motherLastName != '' &&
        formValues.gender != '' && formValues.dateOfBirth != '' && formValues.mobileNo != '' && 
        formValues.emailId != '' && proofDocumentLink != ''){
          var profileClass = '';
          var profilePercent = 15;
        }
        else if(formValues.firstName != '' && formValues.lastName != '' &&
         formValues.gender != '' && formValues.dateOfBirth != '' && 
         formValues.mobileNo != '' && formValues.emailId != ''){
          var profileClass = 'halfcompleteDetails';
          var profilePercent = 8;
        }else{
          var profileClass = 'halfcompleteDetails';
          var profilePercent = 8;
        }
        var profileBasicPercent = profilePercent;
        var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
        if(userData){
          if(userData.profileBasicPercent && userData.profilePercent){
            var newProfilePercent = userData.profilePercent - userData.profileBasicPercent;
            var updatedProfilePercent = newProfilePercent + profileBasicPercent;
          }else{
            var updatedProfilePercent = profileBasicPercent;
          }
        }
        UserProfile.insert({
          "userId"          : formValues.userId,
          "firstName"       : formValues.firstName,
          "lastName"        : formValues.lastName,
          "fatherFirstName" : formValues.fatherFirstName,
          "fatherLastName"  : formValues.fatherLastName,
          "motherFirstName" : formValues.motherFirstName,
          "motherLastName"  : formValues.motherLastName,
          "spouseFirstName" : formValues.spouseFirstName,
          "spouseLastName"  : formValues.spouseLastName,
          "gender"          : formValues.gender,
          "dateOfBirth"     : formValues.dateOfBirth,
          "mobileNo"        : formValues.mobileNo,
          "altMobileNo"     : formValues.altMobileNo,
          "emailId"         : formValues.emailId,
          "altEmailId"      : formValues.altEmailId,
          "createdAt"       : new Date(),
          "profilePercent"  : profilePercent,
          "profileBasicPercent" : profileBasicPercent,
          "profileBasicClass"    : profileClass,
          "profileIdentityClass" : "incompleteDetails",
          "profileAddressClass" : "incompleteDetails",
          "profileAcademicsClass" : "incompleteDetails",
          "profileEmploymentClass" : "incompleteDetails",
          "profileOtherInfoClass" : "incompleteDetails",
          "profileSkillsCertClass" : "incompleteDetails",
        },(error, result)=>{   
      });
      Meteor.call('updateUserData',formValues.userId,formValues.firstName,formValues.lastName,formValues.gender,formValues.dateOfBirth);
    }, 
    "updateBasicData" : function(getuserId,formValues,proofDocumentLink) {
        if(formValues.firstName != '' && formValues.lastName != '' && formValues.fatherFirstName != '' &&
        formValues.fatherLastName != '' && formValues.motherFirstName != '' && formValues.motherLastName != '' &&
        formValues.gender != '' && formValues.dateOfBirth != '' && formValues.mobileNo != '' && 
        formValues.emailId != ''){
          var profileClass = '';
          var profilePercent = 15;
        }
        else if(formValues.firstName != '' && formValues.lastName != '' &&
         formValues.gender != '' && formValues.dateOfBirth != '' && 
         formValues.mobileNo != '' && formValues.emailId != ''){
          var profileClass = 'halfcompleteDetails';
          var profilePercent = 8;
        }else{
          var profileClass = 'halfcompleteDetails';
          var profilePercent = 8;
        }
        var profileBasicPercent = profilePercent;
        var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
        if(userData){
          if(userData.profileBasicPercent && userData.profilePercent){
            var newProfilePercent = userData.profilePercent - userData.profileBasicPercent;
            var updatedProfilePercent = newProfilePercent + profileBasicPercent;
          }else{
            var updatedProfilePercent = userData.profilePercent + profileBasicPercent;
          }
        }

        UserProfile.update({"userId":getuserId},{
        $set : {
          "firstName"       : formValues.firstName,
          "lastName"        : formValues.lastName,
          "fatherFirstName" : formValues.fatherFirstName,
          "fatherLastName"  : formValues.fatherLastName,
          "motherFirstName" : formValues.motherFirstName,
          "motherLastName"  : formValues.motherLastName,
          "spouseFirstName" : formValues.spouseFirstName,
          "spouseLastName"  : formValues.spouseLastName,
          "gender"          : formValues.gender,
          "dateOfBirth"     : formValues.dateOfBirth,
          "mobileNo"        : formValues.mobileNo,
          "altMobileNo"     : formValues.altMobileNo,
          "emailId"         : formValues.emailId,
          "altEmailId"      : formValues.altEmailId,
          "profileBasicClass"  : profileClass,
          "profilePercent"  : updatedProfilePercent,
          "profileBasicPercent" : profileBasicPercent,
        }
      });
      Meteor.call('updateUserData',getuserId,formValues.firstName,formValues.lastName,formValues.gender,formValues.dateOfBirth);
    },
    'insertStatutory':function(id,adharCardNo,panCardNo,drivingCardNo,votingCardNo,rationCardNo,passportNo) {
      // if(adharCardNo != '' && panCardNo != '' && 
      //   adharCardProof1 != null && adharCardProof2 != null &&
      //   panCardProof1 != null && panCardProof2 != null){
      //   var profileClass = 'halfcompleteDetails';
      //   var profilePercent = 7;
      // }else 
      // if(adharCardNo != '' || panCardNo != '' || drivingCardNo != '' || 
      //   votingCardNo != '' || rationCardNo  != '' || passportNo != '' ||
      //   adharCardProof1 != null || adharCardProof2 != null || panCardProof1 != null || 
      //   panCardProof2 != null || drivingCardProof1 != null || drivingCardProof2 != null || 
      //   votingCardProof1 != null || votingCardProof2 != null || rationCardProof1 != null ||
      //   rationCardProof2 != null || passportProof1 != null || passportProof2 != null)
      if(adharCardNo != '' || panCardNo != '' || drivingCardNo != '' || 
        votingCardNo != '' || rationCardNo  != '' || passportNo != ''){
        var profileClass = '';
        var profilePercent = 15;
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileIdentityPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileIdentityPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileIdentityPercent;
          var updatedProfilePercent = newProfilePercent + profileIdentityPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileIdentityPercent;
        }
      }
      
      UserProfile.update({"userId" : id},
        {$set : 
          {
          "profileIdentityClass"    : profileClass,
          "profilePercent"  : updatedProfilePercent,
          "profileIdentityPercent" : profileIdentityPercent,
          "identity.adharCardNo"        :  adharCardNo,
          "identity.panCardNo"          :  panCardNo,
          "identity.drivingCardNo"      :  drivingCardNo,
          "identity.votingCardNo"       :  votingCardNo,
          "identity.rationCardNo"       :  rationCardNo,
          "identity.passportNo"         :  passportNo,
        }
      });
      // TempProofDocs.remove({'_id':getImage._id});
    },
    'insertPermanantAddress':function(id,permanentAddress) {
      // if(permanentAddress.line1 != '' && permanentAddress.landmark != '' && 
      //  permanentAddress.city != '' && permanentAddress.state != '' && permanentAddress.country != '' && 
      //  permanentAddress.pincode != '' && permanentAddress.residingFrom != '' && 
      //  permanentAddress.residingTo != ''){
    
      if(permanentAddress.line1 != '' || permanentAddress.line2 != '' || permanentAddress.line3 != '' || 
       permanentAddress.landmark != '' || permanentAddress.city != '' || permanentAddress.state != '' || 
       permanentAddress.pincode != '' || permanentAddress.residingFrom != '' || 
       permanentAddress.residingTo != ''){
        var profilePercent = 7;
        var profileClass = 'halfcompleteDetails';
      }else{
        var profilePercent = 0;
        var profileClass = 'incompleteDetails';
      }

      var profilePermanentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profilePermanentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profilePermanentPercent;
          var updatedProfilePercent = newProfilePercent + profilePermanentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profilePermanentPercent;
        }

        if(userData.profileCurrentPercent){
          if(profilePermanentPercent + userData.profileCurrentPercent == 14){
            var profileClass = '';
          } 
        }
      }          

      UserProfile.update({"userId" : id},
      {$push : 
          {
            "permanentAddress" : permanentAddress,
         }
      });

      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profilePermanentPercent"  : profilePermanentPercent,
          "profileAddressClass"      : profileClass,
          "profilePercent"           : updatedProfilePercent,
        }
      });
    },
   'editPermanantAddress':function (id,permAddressId,selectedAddress) {
      if(selectedAddress.line1 != '' || selectedAddress.line2 != '' || selectedAddress.line3 != '' || 
       selectedAddress.landmark != '' || selectedAddress.city != '' || selectedAddress.state != '' || 
       selectedAddress.pincode != '' || selectedAddress.residingFrom != '' || 
       selectedAddress.residingTo != ''){
        var profilePercent = 7;
        var profileClass = 'halfcompleteDetails';
      }else{
        var profilePercent = 0;
        var profileClass = 'incompleteDetails';
      }
      var profilePermanentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profilePermanentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profilePermanentPercent;
          var updatedProfilePercent = newProfilePercent + profilePermanentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profilePermanentPercent;
        }

        if(userData.profileCurrentPercent){
          if(profilePermanentPercent + userData.profileCurrentPercent == 14){
            var profileClass = '';
          } 
        }
      }    
      UserProfile.update({"_id" : id, "permanentAddress.permanentAddressId" : parseInt(permAddressId)},
        {$set : 
            {
                "permanentAddress.$.line1"          : selectedAddress.line1,
                "permanentAddress.$.line2"          : selectedAddress.line2,
                "permanentAddress.$.line3"          : selectedAddress.line3,
                "permanentAddress.$.landmark"       : selectedAddress.landmark,
                "permanentAddress.$.city"           : selectedAddress.city,
                "permanentAddress.$.state"          : selectedAddress.state,
                "permanentAddress.$.country"        : selectedAddress.country,
                "permanentAddress.$.pincode"        : selectedAddress.pincode,
                "permanentAddress.$.residingFrom"   : selectedAddress.residingFrom,
                "permanentAddress.$.residingTo"     : selectedAddress.residingTo,
                "permanentAddress.$.createdAt"      : new Date(),
                "permanentAddress.$.proofOfPermanentAddr"   : selectedAddress.proofOfPermanentAddr,
                "permanentAddress.$.perAddrFileName"     : selectedAddress.perAddrFileName,
                "permanentAddress.$.perAddrFileExt"   : selectedAddress.perAddrFileExt,
                "permanentAddress.$.verifiedStatus"   : selectedAddress.verifiedStatus,
                "permanentAddress.$.editStatus"   : selectedAddress.editStatus,
              }
       });
       UserProfile.update({"userId" : id},
        {$set : 
          {
            "profilePermanentPercent"  : profilePermanentPercent,
            "profileAddressClass"      : profileClass,
            "profilePercent"           : updatedProfilePercent,
          }
        });   
   },
   'editCurrentAddress':function (id,currentAddressId,selectedAddress) {
      if(selectedAddress.tempLine1 != '' || selectedAddress.tempLine2 != '' || selectedAddress.tempLine3 != '' || 
       selectedAddress.tempLandmark != '' || selectedAddress.tempCity != '' || selectedAddress.tempState != '' || 
       selectedAddress.tempPincode != '' || selectedAddress.tempresidingFrom != '' || 
       selectedAddress.tempresidingTo != ''){
        var profilePercent = 7;
        var profileClass = 'halfcompleteDetails';
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileCurrentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileCurrentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileCurrentPercent;
          var updatedProfilePercent = newProfilePercent + profileCurrentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileCurrentPercent;
        }

        if(userData.profilePermanentPercent){
          if(userData.profilePermanentPercent + profileCurrentPercent == 14){
            var profileClass = '';
          }
        }
      }
      UserProfile.update({"_id" : id, "currentAddress.currentAddressId" : parseInt(currentAddressId)},
          {$set : 
              {
                  "currentAddress.$.tempLine1"          : selectedAddress.tempLine1,
                  "currentAddress.$.tempLine2"          : selectedAddress.tempLine2,
                  "currentAddress.$.tempLine3"          : selectedAddress.tempLine3,
                  "currentAddress.$.tempLandmark"       : selectedAddress.tempLandmark,
                  "currentAddress.$.tempCity"           : selectedAddress.tempCity,
                  "currentAddress.$.tempState"          : selectedAddress.tempState,
                  "currentAddress.$.tempCountry"        : selectedAddress.tempCountry,
                  "currentAddress.$.tempPincode"        : selectedAddress.tempPincode,
                  "currentAddress.$.tempresidingFrom"   : selectedAddress.tempresidingFrom,
                  "currentAddress.$.tempresidingTo"     : selectedAddress.tempresidingTo,
                  "currentAddress.$.currentAddressProof" : "",
                  "currentAddress.$.createdAt"           : new Date(),
                  "currentAddress.$.proofOfCurrentAddr"   : selectedAddress.proofOfCurrentAddr,
                  "currentAddress.$.currAddrFileName"     : selectedAddress.currAddrFileName,
                  "currentAddress.$.currAddrFileExt"   : selectedAddress.currAddrFileExt,
                  "currentAddress.$.verifiedStatus"   : selectedAddress.verifiedStatus,
                  "currentAddress.$.editStatus"   : selectedAddress.editStatus,
                }
         });
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileAddressClass"     : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileCurrentPercent"   : profileCurrentPercent,
        }
      }); 
   },
   'insertTemporaryAddress':function(id,currentAddress) {
      // if(temporaryAddress.tempLine1 != '' && temporaryAddress.tempLandmark != '' && 
      //  temporaryAddress.tempCity != '' && temporaryAddress.tempState != '' && temporaryAddress.tempCountry != '' && 
      //  temporaryAddress.tempPincode != '' && temporaryAddress.tempresidingFrom != '' && 
      //  temporaryAddress.tempresidingTo != ''){

      if(currentAddress.tempLine1 != '' || currentAddress.tempLine2 != '' || currentAddress.tempLine3 != '' || 
       currentAddress.tempLandmark != '' || currentAddress.tempCity != '' || currentAddress.tempState != '' || 
       currentAddress.tempPincode != '' || currentAddress.tempresidingFrom != '' || 
       currentAddress.tempresidingTo != ''){
        var profilePercent = 7;
        var profileClass = 'halfcompleteDetails';
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileCurrentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileCurrentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileCurrentPercent;
          var updatedProfilePercent = newProfilePercent + profileCurrentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileCurrentPercent;
        }

        if(userData.profilePermanentPercent){
          // console.log('userData.profilePermanentPercent + profileCurrentPercent: ',userData.profilePermanentPercent + profileCurrentPercent);
          if(userData.profilePermanentPercent + profileCurrentPercent == 14){
            // console.log('result: ',userData.profilePermanentPercent + profileCurrentPercent);
            var profileClass = '';
          }
        }
      }

      UserProfile.update({"userId" : id},
      {$push : {
          "currentAddress" : currentAddress,
        }
      });

      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileAddressClass"     : profileClass,
          "profilePercent"          : updatedProfilePercent,
          "profileCurrentPercent"   : profileCurrentPercent,
        }
      });
    },
    'addCurrentAddress':function (getId,selectedAddress) {
      var addressObj = UserProfile.findOne({"_id" : getId}, {sort: {'currentAddress.currentAddressId': -1}});
      // console.log("addressObj",addressObj);
        if(addressObj){
          if (addressObj.currentAddress) {
            var lastelem           = _.last(addressObj.currentAddress);
            var currentAddressId =  parseInt(lastelem.currentAddressId) + 1;
          }
          else{
            var currentAddressId =  1;
          }
        }
      UserProfile.update({"_id" : getId},
      {$push : {
          "currentAddress" : {
            "currentAddressId"   : currentAddressId,
            "tempLine1"          : selectedAddress.tempLine1,
            "tempLine2"          : selectedAddress.tempLine2,
            "tempLine3"          : selectedAddress.tempLine3,
            "tempLandmark"       : selectedAddress.tempLandmark,
            "tempCity"           : selectedAddress.tempCity,
            "tempState"          : selectedAddress.tempState,
            "tempCountry"        : selectedAddress.tempCountry,
            "tempPincode"        : selectedAddress.tempPincode,
            "tempresidingFrom"   : selectedAddress.tempresidingFrom,
            "tempresidingTo"     : selectedAddress.tempresidingTo,
            "currentAddressProof": "",
            "createdAt"          : new Date(),
          },
        }
      });  
    },
    'insertEducation':function(id,education) {
      // if(education.educationLevel != '' && education.educationQualification != '' && 
      //   education.educationMode != '' && education.dateAttendedFrom != '' && 
      //   education.dateAttendedTo != '' && education.collegeName != '' && 
      //   education.university != '' && education.rollNo != ''){

      if(education.educationLevel != '' || education.educationQualification != '' || 
        education.educationMode != '' || education.dateAttendedFrom != '' || education.dateAttendedTo != '' || 
        education.collegeName != '' || education.university != '' || education.collegeAddress != '' || 
        education.rollNo != '' || education.specialization != '' || education.grades != ''){
        var profilePercent = 14;
        var profileClass = '';
      }else{
        var profilePercent = 0;
        var profileClass = 'incompleteDetails';
      }

      var profileEducationPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEducationPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEducationPercent;
          var updatedProfilePercent = newProfilePercent + profileEducationPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEducationPercent;
        }
      }    

      UserProfile.update({"userId" : id},
      {$push : {
          "education" : education,
        }
      });
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEducationPercent" : profileEducationPercent,
          "profileAcademicsClass"    : profileClass,
          "profilePercent"  : updatedProfilePercent,
        }
      });
    },
    'updateEducation':function(id,education,index) {
      if(education.educationLevel != '' || education.educationQualification != '' || 
        education.educationMode != '' || education.dateAttendedFrom != '' || education.dateAttendedTo != '' || 
        education.collegeName != '' || education.university != '' || education.collegeAddress != '' || 
        education.rollNo != '' || education.specialization != '' || education.grades != ''){
        var profilePercent = 14;
        var profileClass = '';
      }else{
        var profilePercent = 0;
        var profileClass = 'incompleteDetails';
      }

      var profileEducationPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEducationPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEducationPercent;
          var updatedProfilePercent = newProfilePercent + profileEducationPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEducationPercent;
        }
      }    

      UserProfile.update( {"userId" : id},
        {$set: 
            {
              ['education.'+index] : education , 
            }
        }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEducationPercent" : profileEducationPercent,
          "profileAcademicsClass"    : profileClass,
          "profilePercent"  : updatedProfilePercent,
        }
      });
    },
    'insertProfessionalEducation':function(id,education) {
      UserProfile.update({"userId" : id},
      {$push : {
          "professionalEducation" : education,
        }
      });
    },
    'updateProfessionalEducation':function(id,education,index) {
      UserProfile.update ({"userId" : id},
        {$set: 
            {
              ['professionalEducation.'+index] : education , 
            }
        });
    },
    'insertEmployement':function(id,employement) {
      // if(employement.nameOfEmployer != '' && employement.employerAddress != '' && 
      //   employement.contactNo != '' && employement.employeeCode != '' && employement.designation != '' &&
      //   employement.department != '' && employement.employmentFrom != '' && employement.employmentTo != '' &&
      //   employement.typeOfEmployement != ''){

      if(employement.nameOfEmployer != '' || employement.employerAddress != '' || 
        employement.contactNo != '' || employement.employeeCode != '' || employement.designation != '' ||
        employement.department != '' || employement.employmentFrom != '' || employement.employmentTo != '' ||
        employement.lastSalaryDrawn != '' || employement.typeOfEmployement != '' || 
        employement.detailOfAgency != '' || employement.reasonOfLeaving != '' || employement.dutiesAndResponsibilites != '' || 
        employement.reportingManagerNm != '' || employement.prevDesignation != ''
        || employement.contactDetails != ''){
        var profileClass = '';
        var profilePercent = 14;
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileEmploymentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEmploymentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEmploymentPercent;
          var updatedProfilePercent = newProfilePercent + profileEmploymentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEmploymentPercent;
        }
      } 

      UserProfile.update({"userId" : id},
      {$push : {
          "employement" : employement,
        }
      });
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEmploymentPercent"  : profileEmploymentPercent,
          "profileEmploymentClass"    : profileClass,
          "profilePercent"  : updatedProfilePercent,
        }
      });
    },
    'updateEmployement':function(id,employement,index) {
      if(employement.nameOfEmployer != '' || employement.employerAddress != '' || 
        employement.contactNo != '' || employement.employeeCode != '' || employement.designation != '' ||
        employement.department != '' || employement.employmentFrom != '' || employement.employmentTo != '' ||
        employement.lastSalaryDrawn != '' || employement.typeOfEmployement != '' || 
        employement.detailOfAgency != '' || employement.reasonOfLeaving != '' || employement.dutiesAndResponsibilites != '' || 
        employement.reportingManagerNm != '' || employement.prevDesignation != ''
        || employement.contactDetails != ''){
        var profileClass = '';
        var profilePercent = 14;
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileEmploymentPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileEmploymentPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileEmploymentPercent;
          var updatedProfilePercent = newProfilePercent + profileEmploymentPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileEmploymentPercent;
        }
      } 

      UserProfile.update(
        {"userId" : id},
        {$set: 
            {
              ['employement.'+index] : employement , 
            }
        }
      ); 
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileEmploymentPercent"  : profileEmploymentPercent,
          "profileEmploymentClass"    : profileClass,
          "profilePercent"  : updatedProfilePercent,
        }
      });
    },
    'insertOtherInformation':function(id,otherInformation) {
      var profileClass = '';
      var profilePercent = 14;
      var profileOtherInfoPercent = profilePercent;

      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileOtherInfoPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileOtherInfoPercent;
          var updatedProfilePercent = newProfilePercent + profileOtherInfoPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileOtherInfoPercent;
        }
      }

      UserProfile.update({"userId" : id},
        {$set : {
          "otherBusinessInvolving" :  otherInformation.otherBusinessInvolving,
          "dismissedFromService"   :  otherInformation.dismissedFromService,
          "criminalOffence"        :  otherInformation.criminalOffence,
          "civilJudgments"         :  otherInformation.civilJudgments,
          "profileOtherInfoClass"  : profileClass,
          "profilePercent"  : updatedProfilePercent,
        }
      });
    },
    'insertBasicProof':function(id){
      var data = ProofDocuments.findOne({"_id" : id});
      // console.log('data:',data);
      UserProfile.update({"userId" : Meteor.userId()},
        {$set : {
          proofOfDOB : data.link(),
          basicExt : data.ext,
          basicfileName : data.name,
        }
      });
    },
    'removeBasicProof':function(imageLink,filename,fileext,){
      // console.log("imageLink: ",imageLink);
      UserProfile.update({"userId" : Meteor.userId()},
        {$unset : {
          proofOfDOB : imageLink,
          basicExt : fileext,
          basicfileName : filename,
        }
      });
      UserProfile.update({"userId" : Meteor.userId()},
        {$pull : {
          proofOfDOB : imageLink,
          basicExt : fileext,
          basicfileName : filename,
        }
      });
    },
    'removeTempProofDocs':function(imgLink){
      TempProofDocs.remove({'_id':imgLink});
    },
    'removeTempDocProofs':function(imgLinkName,imgName,extName,index,subtype){
      // console.log('files: ',imgName + '||' +  extName + "||" + index);
      if(subtype == 'employementDetails'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['employement.'+index+'.proofOfEmployement'] : imgLinkName , 
                ['employement.'+index+'.empFileName'] : imgName , 
                ['employement.'+index+'.empFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['employement.'+index+'.proofOfEmployement'] : imgLinkName , 
                ['employement.'+index+'.empFileName'] : imgName , 
                ['employement.'+index+'.empFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'editEmployementDetails'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['employement.'+index+'.proofOfEmployement'] : imgLinkName , 
                ['employement.'+index+'.empFileName'] : imgName , 
                ['employement.'+index+'.empFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['employement.'+index+'.proofOfEmployement'] : imgLinkName , 
                ['employement.'+index+'.empFileName'] : imgName , 
                ['employement.'+index+'.empFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'basicEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['education.'+index+'.proofOfEducation'] : imgLinkName , 
                ['education.'+index+'.eduFileName'] : imgName , 
                ['education.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['education.'+index+'.proofOfEducation'] : imgLinkName , 
                ['education.'+index+'.eduFileName'] : imgName , 
                ['education.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'editBasicEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['education.'+index+'.proofOfEducation'] : imgLinkName , 
                ['education.'+index+'.eduFileName'] : imgName , 
                ['education.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['education.'+index+'.proofOfEducation'] : imgLinkName , 
                ['education.'+index+'.eduFileName'] : imgName , 
                ['education.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'professionalEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['professionalEducation.'+index+'.proofOfEducation'] : imgLinkName , 
                ['professionalEducation.'+index+'.eduFileName'] : imgName , 
                ['professionalEducation.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['professionalEducation.'+index+'.proofOfEducation'] : imgLinkName , 
                ['professionalEducation.'+index+'.eduFileName'] : imgName , 
                ['professionalEducation.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'editProfessionalEducation'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['professionalEducation.'+index+'.proofOfEducation'] : imgLinkName , 
                ['professionalEducation.'+index+'.eduFileName'] : imgName , 
                ['professionalEducation.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['professionalEducation.'+index+'.proofOfEducation'] : imgLinkName , 
                ['professionalEducation.'+index+'.eduFileName'] : imgName , 
                ['professionalEducation.'+index+'.eduFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'permanentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['permanentAddress.'+index+'.proofOfPermanentAddr'] : imgLinkName , 
                ['permanentAddress.'+index+'.perAddrFileName'] : imgName , 
                ['permanentAddress.'+index+'.perAddrFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['permanentAddress.'+index+'.proofOfPermanentAddr'] : imgLinkName , 
                ['permanentAddress.'+index+'.perAddrFileName'] : imgName , 
                ['permanentAddress.'+index+'.perAddrFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'editPermanentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['permanentAddress.'+index+'.proofOfPermanentAddr'] : imgLinkName , 
                ['permanentAddress.'+index+'.perAddrFileName'] : imgName , 
                ['permanentAddress.'+index+'.perAddrFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['permanentAddress.'+index+'.proofOfPermanentAddr'] : imgLinkName , 
                ['permanentAddress.'+index+'.perAddrFileName'] : imgName , 
                ['permanentAddress.'+index+'.perAddrFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'currentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['currentAddress.'+index+'.proofOfCurrentAddr'] : imgLinkName , 
                ['currentAddress.'+index+'.currAddrFileName'] : imgName , 
                ['currentAddress.'+index+'.currAddrFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['currentAddress.'+index+'.proofOfCurrentAddr'] : imgLinkName , 
                ['currentAddress.'+index+'.currAddrFileName'] : imgName , 
                ['currentAddress.'+index+'.currAddrFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'editCurrentAddress'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['currentAddress.'+index+'.proofOfCurrentAddr'] : imgLinkName , 
                ['currentAddress.'+index+'.currAddrFileName'] : imgName , 
                ['currentAddress.'+index+'.currAddrFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['currentAddress.'+index+'.proofOfCurrentAddr'] : imgLinkName , 
                ['currentAddress.'+index+'.currAddrFileName'] : imgName , 
                ['currentAddress.'+index+'.currAddrFileExt'] : extName , 
              }
          }
        ); 
      }else if(subtype == 'certificate'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['certificates.'+index+'.proofOfCertificate'] : imgLinkName , 
                ['certificates.'+index+'.certFileName'] : imgName , 
                ['certificates.'+index+'.certFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['certificates.'+index+'.proofOfCertificate'] : imgLinkName , 
                ['certificates.'+index+'.certFileName'] : imgName , 
                ['certificates.'+index+'.certFileExt'] : extName ,  
              }
          }
        ); 
      }else if(subtype == 'editCertificate'){
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$unset: 
              {
                ['certificates.'+index+'.proofOfCertificate'] : imgLinkName , 
                ['certificates.'+index+'.certFileName'] : imgName , 
                ['certificates.'+index+'.certFileExt'] : extName , 
              }
          }
        ); 
        UserProfile.update(
          {"userId" : Meteor.userId()},
          {$pull: 
              {
                ['certificates.'+index+'.proofOfCertificate'] : imgLinkName , 
                ['certificates.'+index+'.certFileName'] : imgName , 
                ['certificates.'+index+'.certFileExt'] : extName , 
              }
          }
        ); 
      }
    },
    'removeIdentityProofDocs':function(imgLink,subtype,imgname,imgext){
      UserProfile.update({"userId" : Meteor.userId()},
        {
          $unset:{
            ["identity."+subtype] :  imgLink,
            ["identity."+subtype+'name'] :  imgname,
            ["identity."+subtype+'ext'] :  imgext,
          } //End of set
        },(error, result)=>{
      });     
      UserProfile.update({"userId" : Meteor.userId()},
        {
          $pull:{
            ["identity."+subtype] :  imgLink,
            ["identity."+subtype+'name'] :  imgname,
            ["identity."+subtype+'ext'] :  imgext,
          } //End of set
        },(error, result)=>{
      });        
    },
    'removeBasicEducation':function(index){
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['education.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['education'] : null ,
            }
        }
      ); 
    },
    'removeProfessionalEducation':function(index){
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['professionalEducation.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['professionalEducation'] : null ,
            }
        }
      ); 
    },
    'removeEmploymentData':function(index){
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['employement.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['employement'] : null ,
            }
        }
      ); 
    },
    'removeCertificateData':function(index){
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['certificates.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['certificates'] : null ,
            }
        }
      ); 
    },
    'removePermanentAddress':function(index){
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['permanentAddress.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['permanentAddress'] : null ,
            }
        }
      ); 
    },
    'removeCurrentAddress':function(index){
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$unset: 
            {
              ['currentAddress.'+index] : 1 ,  
            }
        }
      ); 
      UserProfile.update(
        {"userId" : Meteor.userId()},
        {$pull: 
            {
              ['currentAddress'] : null ,
            }
        }
      ); 
    },
    "addSkills" : function (id,skills) {
      var skillObj = UserProfile.findOne({"userId" : id}, {sort: {'skills.skillsId': -1}});
      // console.log("skillObj",skillObj);
      // console.log("skillObj",skills.skillName);
      if(skills.skillName != ''){
        var profileClass = '';
        var profilePercent = 14;
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileSkillsCertPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileSkillsCertPercent;
          var updatedProfilePercent = newProfilePercent + profileSkillsCertPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileSkillsCertPercent;
        }
        if(userData.certificates){
          if(userData.certificates.length > 0){
            var profileClass = '';
          }
        }
      } 
        if(skillObj){
          if (skillObj.skills) {
            if (skillObj.skills.length > 0) {
              var lastelem = _.last(skillObj.skills);
              var skillsId =  parseInt(lastelem.skillsId) + 1;
            }
          }          
          else{
            var skillsId =  1;
          }
        }
       UserProfile.update({"userId" : id},
        {$push : {
          "skills" : {
            "skillsId" : skillsId,
            "skillName" : skills.skillName,
          },
         }
       }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileSkillsCertClass"  : profileClass,
          "profileSkillsCertPercent"    : profileSkillsCertPercent,
          "profilePercent"  : updatedProfilePercent,
        }
      }); 
    },
    "deleteSkills" :function (skillIndex,userId){
      UserProfile.update({"userId" : userId}, 
        {$unset : {
          ['skills.'+skillIndex] : 1
        }
      });
      UserProfile.update({'userId': userId}, {$pull : {'skills' : null}});  
    },
    "addCertificates":function (id,certificates) {
      if(certificates.certificateName != ''){
        var profileClass = '';
        var profilePercent = 14;
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileSkillsCertPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileSkillsCertPercent;
          var updatedProfilePercent = newProfilePercent + profileSkillsCertPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileSkillsCertPercent;
        }
        if(userData.skills){
          if(userData.skills.length > 0){
            var profileClass = '';
          }
        }
      } 

      UserProfile.update({"userId" : id},
        {$push : {
          "certificates" : certificates,
         }
       }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileSkillsCertClass"  : profileClass,
          "profileSkillsCertPercent"    : profileSkillsCertPercent,
          "profilePercent"  : updatedProfilePercent,
        }
      }); 
    },
    "updateCertificate":function (id,certificates,index) {
      if(certificates.certificateName != ''){
        var profileClass = '';
        var profilePercent = 14;
      }else{
        var profileClass = 'incompleteDetails';
        var profilePercent = 0;
      }

      var profileSkillsCertPercent = profilePercent;
      var userData  = UserProfile.findOne({"userId" : Meteor.userId()});
      if(userData){
        if(userData.profileSkillsCertPercent && userData.profilePercent){
          var newProfilePercent = userData.profilePercent - userData.profileSkillsCertPercent;
          var updatedProfilePercent = newProfilePercent + profileSkillsCertPercent;
        }else{
          var updatedProfilePercent = userData.profilePercent + profileSkillsCertPercent;
        }
        if(userData.skills){
          if(userData.skills.length > 0){
            var profileClass = '';
          }
        }
      } 

      UserProfile.update(
        {"userId" : id},
        {$set: 
            {
              ['certificates.'+index] : certificates , 
            }
        }
      );
      UserProfile.update({"userId" : id},
      {$set : 
        {
          "profileSkillsCertClass"  : profileClass,
          "profileSkillsCertPercent"    : profileSkillsCertPercent,
          "profilePercent"  : updatedProfilePercent,
        }
      });  
    },
  });
}
