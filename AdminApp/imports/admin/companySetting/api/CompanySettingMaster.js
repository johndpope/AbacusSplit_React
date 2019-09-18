import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
// import {TempLogoImage} from './TempLogoImage.js';

import {TempImage} from '/imports/s3/api/ClientImageCall.js';
import {TempDocumentsImage} from '/imports/s3/api/ClientImageCall.js';

export const FranchiseDetails = new Mongo.Collection('franchiseDetails');
// export const FranchiseDetails = new Mongo.Collection('franchisedetails');

generateRandomCompanyId=function(id){
      var newCompanyId=Math.floor(1000 + Math.random() * 9000);
      if(newCompanyId===id){
        generateRandomCompanyId(newCompanyId);
      }else{
      var newCompanyId;
    }
    return newCompanyId;
}

if(Meteor.isServer){
  Meteor.publish('companyData',function companyData(){
      return FranchiseDetails.find({});
  });
  Meteor.publish('franchiseData',function(){
      return FranchiseDetails.find({"franchiseCodeForCompanyId":Meteor.userId()});
  }); 
  Meteor.publish('franchiseDetailsforstudent',function franchiseDetailsforstudent(){
    return FranchiseDetails.find({});
  });  
  Meteor.publish("LoginInFranchiseData",function(id){
    return FranchiseDetails.find({"franchiseCodeForCompanyId":id});  
  });
  Meteor.publish("singleFranchiseData",function(id){
    return FranchiseDetails.find({"franchiseCodeForCompanyId":id});  
  });
  Meteor.publish("firstFranchiseData",function(id){
    return FranchiseDetails.find({"companyId":id});  
  });

   Meteor.publish("firstFranchiseName",function(name){
    return FranchiseDetails.find({"franchiseName":name});  
  });


Meteor.methods({

  'insertFranchiseInfo':function(companyInfoFormValue){
    // console.log("server side ");
    // console.log("companyInfoFormValue",companyInfoFormValue);
    var companyExists = FranchiseDetails.findOne({'createdBy':Meteor.userId()});    
    var TempImg = TempImage.findOne({"userId":Meteor.userId()});
    if(TempImg){
      var imgSrc = TempImg.imagePath;
    
      TempImage.remove({'userId':Meteor.userId()});
    }
    if(companyExists){ 
      if(TempImg){
        var imgSrc = TempImg.imagePath;
      }else{
        var franchiseData=FranchiseDetails.findOne({"createdBy":Meteor.userId()});
        if(franchiseData){
          var imgSrc = franchiseData.franchisePhoto;
        }        
      }   
      var id = FranchiseDetails.update(
        {"createdBy"    : Meteor.userId() },
          {$set:
            {
              "franchiseName"           : companyInfoFormValue.franchiseName,
              "firstName"               : companyInfoFormValue.firstName,
              "middleName"              : companyInfoFormValue.middleName,
              "lastName"                : companyInfoFormValue.lastName,
              "contactNo"               : companyInfoFormValue.contactNo,
              "alternateContactNo"      : companyInfoFormValue.alternateContactNo,
              "mail"                    : companyInfoFormValue.mail,
              "lastModifiedAt"          : new Date(),
              "franchisePhoto"          : imgSrc,

              "franchiseLocations"    : [{
                                            "mainLocation"          : "Headoffice",
                                            "addressLine1"          : companyInfoFormValue.addressLine1,
                                            "addressLine2"          : companyInfoFormValue.addressLine2,
                                            "city"                  : companyInfoFormValue.city,
                                            "pincode"               : companyInfoFormValue.pincode,
                                            "State"                 : companyInfoFormValue.state,
                                            "country"               : companyInfoFormValue.country,
                                          }],
            }
          }

      );
      return 'franchiseInfoUpdated';
    }else{

    //Insert into collection 
    var latestCompany = FranchiseDetails.findOne({},{sort:{'createdAt': -1}});
    if(latestCompany){ 
        // if(latestCompany.companyId == 1){
        //   var newCompanyId =  101;
        // }else{
        //   var newCompanyId =  parseInt(latestCompany.companyId) + 1;  
        // }
        var newId=Math.floor(1000 + Math.random() * 9000);
        var franchiseDetail=FranchiseDetails.findOne({"companyId":newId});
        if(franchiseDetail){ 
          var GenCompanyId = generateRandomCompanyId(newId);          
        }else{
          var newCompanyId=newId;
        }  

    }else {
      var newCompanyId =  1;
    } 
    var toEmailId   = companyInfoFormValue.mail;
    var fromEmailId = 'support@maats.in';
    var subject     = 'Abacus Online Exam Frachise Registration';
    var body        = 'Hello '+companyInfoFormValue.firstName+' '+companyInfoFormValue.lastName+'\n'+"Congratulations!!!"+'\n'+'\n'+"Franchise "+companyInfoFormValue.franchiseName+' has been registered for Abacus Online Exam Successfully.'+'\n'+'Your FranchiseId :'+newCompanyId+'.'+'\n'+'Please login using username: ' +toEmailId+ ' and password which you have set while registering.' +'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
    Meteor.call('RegistrationEmail',toEmailId,fromEmailId,subject,body);
    Meteor.call("updateFranchiseCompanyId" , newCompanyId, Meteor.userId());
     var id =  FranchiseDetails.insert({ 
        "companyId"               : newCompanyId,
        "franchiseCodeForCompanyId" : Meteor.userId(),
        "franchiseName"           : companyInfoFormValue.franchiseName,
        "firstName"               : companyInfoFormValue.firstName,
        "middleName"              : companyInfoFormValue.middleName,
        "lastName"                : companyInfoFormValue.lastName,
        "contactNo"               : companyInfoFormValue.contactNo,
        "alternateContactNo"      : companyInfoFormValue.alternateContactNo,
        "mail"                    : companyInfoFormValue.mail,
        // "lastModifiedAt"          : new Date(),
        "franchisePhoto"          : imgSrc,
        "createdBy"               : Meteor.userId(),
        "createdAt"               : new Date(),

        "franchiseLocations"    : [{
                                      "mainLocation"          : "Headoffice",
                                      "addressLine1"          : companyInfoFormValue.addressLine1,
                                      "addressLine2"          : companyInfoFormValue.addressLine2,
                                      "city"                  : companyInfoFormValue.city,
                                      "pincode"               : companyInfoFormValue.pincode,
                                      "State"                 : companyInfoFormValue.state,
                                      "country"               : companyInfoFormValue.country,
                                    }],
      })
    }
    return 'insertFrachise';
  },

  'updateFranchiseUserInfo':function(stud_id,formValues){

    var userInfo=Meteor.users.findOne({"franchiseCodeForCompanyId":stud_id}); 
    if(userInfo){
      var userProfileInfo=userInfo.profile;
      if(userProfileInfo){
        var imgSrcLink=userProfileInfo.userProfile;
      }
    }
    
      FranchiseDetails.update({"franchiseCodeForCompanyId":stud_id},
      {
        $set:{
          'firstName': formValues.firstname,
          'lastName':formValues.lastname ,       
          'contactNo': formValues.mobNumber,
          'updatedAt' : new Date(), 
          'franchisePhoto':imgSrcLink ,   
        }
      });
    },

    'updateFranchiseDocumentVerification':function(franchiseId){
      var franchiseData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":franchiseId});
      if(franchiseData){
      var bankDetails = franchiseData.bankDetails;
      var Documents = franchiseData.Documents;
      if(bankDetails){
        if(Documents){
        bankDetailsLen = bankDetails.length;
        DocumentsLen = Documents.length;
        if(bankDetailsLen>0){
          FranchiseDetails.update({"franchiseCodeForCompanyId":franchiseId},
            {
              $set:{
                'verificationStatus': "Verified",            
              }
            });
          return 'verified';
          }
        }else{
          return 'documentssNotAdded';
        }
        }else{
          return 'bankDetailsNotAdded';
        }
      }
      
    },



  'updateDocumentFranchiseInfo':function(){

    var companyExists = FranchiseDetails.findOne({'createdBy':Meteor.userId()});
    var documentType = ["Aadhar Card", "Pan Card","Bank Passbook"];
    var adharDoc = '';
    var panDoc = '';
    var bankDoc = '';
    var Document=[];
    for(var i=0;i<documentType.length;i++){
      var docFound = TempDocumentsImage.findOne({"userId":Meteor.userId() , "documentType" : documentType[i]});
      if(docFound && docFound.documentType && docFound.imagePath){
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
    // console.log(Document.length,Document);

    if(companyExists && Document.length>0){
      var id = FranchiseDetails.update(
        {"createdBy"    : Meteor.userId() },
      {$set:
        {
         "Documents"       : Document,
        }
      }

    );
    }
    else{

      var id="DocNotAttached";
    }
    return id;
  },

  'removeCompany':function(companyID){
    FranchiseDetails.remove({'_id': companyID});    
  },

  "removeFranchiseProfilePhoto":function(userid){
      FranchiseDetails.update({"franchiseCodeForCompanyId" : userid},{
        $set:{
          "franchisePhoto"          : '',
        }
      });
  },

    "updateVerificationStatus":function(){
      FranchiseDetails.update({"franchiseCodeForCompanyId" : Meteor.userId()},{
        $set:{
          "verificationStatus" : 'Not Verified',
        }
      });
  },

  'insertCompanyLocations':function(companyLocationFormValue){
    var userId = FranchiseDetails.findOne({"companyId" : companyID});
    if(userId){     
      FranchiseDetails.update({"companyId" : companyID},
        {$push:{ companyLocationsInfo : {
            contactNo           : companyLocationFormValue.contactNo,
            alternateContactNo  : companyLocationFormValue.alternateContactNo,
            mail                : companyLocationFormValue.mail,
            franchiseLocations  : companyLocationFormValue.franchiseLocations,
            addressLine1        : companyLocationFormValue.addressLine1,
            country             : companyLocationFormValue.country,
            State               : companyLocationFormValue.State,
            addressLine2        : companyLocationFormValue.addressLine2,
            city                : companyLocationFormValue.city,
            pincode             : companyLocationFormValue.pincode,
                      
            }
          }
      });
    }
  },
  removeCompanyLocation: function(targetedID){
      FranchiseDetails.update({'companyId':  userData.profile.companyId}, {$unset : {['companyLocationsInfo.'+targetedID] : 1}});
      FranchiseDetails.update({'companyId':  userData.profile.companyId}, {$pull : {'companyLocationsInfo' : null}});
      
  },

  'updateCompanyLocations':function(companyLocationFormValue){
    var companyData = FranchiseDetails.findOne({"companyId" :  userData.profile.companyId});
    
    if(companyData){
      FranchiseDetails.update({'_id' : companyData._id, 'companyLocationsInfo.companyAddress':companyLocationFormValue.companyAddress },
          {$set: {
              'companyLocationsInfo.$.companyNumber'    : companyLocationFormValue.companyNumber,
              'companyLocationsInfo.$.companyAltNumber' : companyLocationFormValue.companyAltNumber,
              'companyLocationsInfo.$.companyMail'      : companyLocationFormValue.companyMail,
              'companyLocationsInfo.$.companyLocation'  : companyLocationFormValue.companyLocation,
              'companyLocationsInfo.$.companyAddress'   : companyLocationFormValue.companyAddress,
              'companyLocationsInfo.$.companyCountry'   : companyLocationFormValue.companyCountry,
              'companyLocationsInfo.$.companyState'     : companyLocationFormValue.companyState,
              'companyLocationsInfo.$.companyDist'      : companyLocationFormValue.companyDist,
              'companyLocationsInfo.$.companyCity'      : companyLocationFormValue.companyCity,
              'companyLocationsInfo.$.companyPincode'   : companyLocationFormValue.companyPincode,
              // 'companyLocationsInfo.$.companyAddress2'  : companyLocationFormValue.companyAddress2,
              
              }
            }
        );

    }
    

  },

  'updateBankDetails':function(companyBankDetailsFormValue){
    // console.log("bankupdate");
    if(companyBankDetailsFormValue.accType == 0){
      var accType = '';
    }else{
      var accType = companyBankDetailsFormValue.accType;
    }
    var userId = Meteor.userId();
    var userData = Meteor.users.findOne({'_id':userId});
    var companyData = FranchiseDetails.findOne({'companyId': userData.profile.companyId});
    if(companyData){
      
      FranchiseDetails.update({'_id': companyData._id,'bankDetails.ifscCode':companyBankDetailsFormValue.ifscCode},
        {$set:{ 
          'bankDetails.$.accHolderName': companyBankDetailsFormValue.accHolderName,
          'bankDetails.$.accNickName'  : companyBankDetailsFormValue.accNickName,
          'bankDetails.$.accType'      : accType,
          'bankDetails.$.bankName'     : companyBankDetailsFormValue.bankName,
          'bankDetails.$.branchName'   : companyBankDetailsFormValue.branchName,
          'bankDetails.$.accNumber'    : companyBankDetailsFormValue.accNumber,
          'bankDetails.$.ifscCode'     : companyBankDetailsFormValue.ifscCode, 
          }
        });
    } //end of if companyData
  },

  removeBankDetails: function(targetedID){
      FranchiseDetails.update({'companyId': userData.profile.companyId}, {$unset : {['bankDetails.'+targetedID] : 1}});
      FranchiseDetails.update({'companyId': userData.profile.companyId}, {$pull : {'bankDetails' : null}});
      
    },
  

  'insertCompanyBankDetails':function(companyBankDetailsFormValue){
    // console.log('companyBankDetailsFormValue===');
    // console.log(companyBankDetailsFormValue);
    if(companyBankDetailsFormValue.accType == 0){
      var accType = '';
    }else{
      var accType = companyBankDetailsFormValue.accType;
    }
    var userId = Meteor.userId();
    var userData = Meteor.users.findOne({'_id':userId});
    if(userData){
    var companyData = FranchiseDetails.findOne({"companyId" : userData.profile.companyId});
    if(companyData){
        FranchiseDetails.update({'_id': companyData._id},
          {$push:{ bankDetails : {
              accHolderName : companyBankDetailsFormValue.accHolderName,
              accNickName   : companyBankDetailsFormValue.accNickName,
              accType       : accType,
              bankName      : companyBankDetailsFormValue.bankName,
              branchName    : companyBankDetailsFormValue.branchName,
              accNumber     : companyBankDetailsFormValue.accNumber,
              ifscCode      : companyBankDetailsFormValue.ifscCode,
              
              }
            }
          });

    } //end of if companyData
  }
  },
  // 'updateCompanyInfo':function(companyid,_id){
  //   // console.log("companyid,_id",companyid,_id);
  //   FranchiseDetails.update(
  //     {"_id":_id},
  //     {$set: 
  //         {
  //           'companyId' : companyid,  
  //         }
  //     }
  //   ); 
   
  // },


  'addStatus' : function(statusName) {   
    

    if(statusName.accType == 0){
      var accType = '';
    }else{
      var accType = statusName.accType;
    }
    var userId = Meteor.userId();
    var userData = Meteor.users.findOne({'_id':userId});
    if(userData){
    var companyData = FranchiseDetails.findOne({"companyId" : userData.profile.companyId});
    if(companyData){
        FranchiseDetails.update({'_id': companyData._id},
           {$push :{contactStatus:
                    {                      
                      statusName : statusName
                    }
          }
          });
    } //end of if companyData
  }
  },
  deleteStatus: function(index,statusName){
       FranchiseDetails.update({"contactStatus.statusName": statusName},{$unset:{["contactStatus."+index]:1}},{'multi':true});
  FranchiseDetails.update({"companyId":userData.profile.companyId},{$pull:{"contactStatus":null}},{'multi':true});
  },

  
  updateStatus: function (statusoldName, statusName) {
    FranchiseDetails.update({'contactStatus.statusName' : statusoldName},
                          {$set :{
                                  'contactStatus.$.statusName' : statusName                                  
                          } //End of set
                        });
  },
  'addLeadSource' : function(leadsourceName) {       

    if(leadsourceName.accType == 0){
      var accType = '';
    }else{
      var accType = leadsourceName.accType;
    }
    var userId = Meteor.userId();
    var userData = Meteor.users.findOne({'_id':userId});
    if(userData){
    var companyData = FranchiseDetails.findOne({"companyId" : userData.profile.companyId});
    if(companyData){
        FranchiseDetails.update({'_id': companyData._id},
           {$push :{leadSource:
                    {                      
                      leadsourceName : leadsourceName
                    }
          }
          });
    } //end of if companyData
  }
                                                               
  },
  deleteLeadSource: function(index,leadsourceName){
    FranchiseDetails.update({"leadSource.leadsourceName": leadsourceName},{$unset:{["leadSource."+index]:1}},{'multi':true});
    FranchiseDetails.update({"companyId":userData.profile.companyId},{$pull:{"leadSource":null}},{'multi':true});
  },

  
  updateLeadSource: function (leadsourceoldName, leadsourceName) {
     FranchiseDetails.update({'leadSource.leadsourceName' : leadsourceoldName},
                          {$set :{
                                  'leadSource.$.leadsourceName' : leadsourceName                                  
                          } //End of set
                        });
  },

   'addContactCategory' : function(categoryName) {

    if(categoryName.accType == 0){
      var accType = '';
    }else{
      var accType = categoryName.accType;
    }
    var userId = Meteor.userId();
    var userData = Meteor.users.findOne({'_id':userId});
    if(userData){
    var companyData = FranchiseDetails.findOne({"companyId" : userData.profile.companyId});
    if(companyData){
        FranchiseDetails.update({'_id': companyData._id},
          {$push :{contactCategory:
                    {                      
                      categoryName : categoryName
                    }
          }
          });
    } //end of if companyData
  }
                                                               
  },
  deleteCategory: function(index,categoryName){
      // Roles.deleteRole('super-admin');
  FranchiseDetails.update({"contactCategory.categoryName": categoryName},{$unset:{["contactCategory."+index]:1}},{'multi':true});
  FranchiseDetails.update({"companyId":userData.profile.companyId},{$pull:{"contactCategory":null}},{'multi':true});
  },
  
  updatecategory: function (oldName, categoryName) {
 
      FranchiseDetails.update({'contactCategory.categoryName' : oldName},
                          {$set :{
                                  'contactCategory.$.categoryName' : categoryName                                  
                          } //End of set
                        });
  },

  'insertTaxSettings':function(taxSettingsFormValue){
    
    
    // Refer http://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off

    //First find previous day of FromDate. 
    //Update Previous Record for same TaxType. Put ToDate = 1 Day prior to FromDate
    var userId = FranchiseDetails.findOne({"companyId" : 1});
    if(userId){
      var fromDate1 = taxSettingsFormValue.effectiveFrom.replace(/-/g, '\/');
      var toDateForPreviousRecordISOFormat = new Date(new Date(fromDate1) - (24*60*60*1000) );
      var formateddate = new Date(toDateForPreviousRecordISOFormat);
      
      //Convert ISO Date in to only date format 2016-06-11
      var toDateForPreviousRecord = formateddate.getFullYear()+'-' + (formateddate.getMonth()+1) + '-'+formateddate.getDate();
      var queryResult = FranchiseDetails.find({'_id': userId._id, 
            'taxSettings.taxType'     : taxSettingsFormValue.taxType , 
            'taxSettings.effectiveTo' : '',}).count();  
      
      
        if(queryResult){
        FranchiseDetails.update({'taxSettings':
                      {
                        $elemMatch:
                        { 
                          'taxType' : taxSettingsFormValue.taxType , 
                            'effectiveTo' : "",
                          }
                    }
          },
          {$set:{ 
              'taxSettings.$.effectiveTo' : toDateForPreviousRecord,
              
              }
          },
        );

        FranchiseDetails.update({'_id': userId._id},
          {$push:{ taxSettings :{
              taxType       : taxSettingsFormValue.taxType,
              hsn           : taxSettingsFormValue.hsn,
              cgst          : taxSettingsFormValue.cgst,
              sgst          : taxSettingsFormValue.sgst,
              igst          : taxSettingsFormValue.igst,
              effectiveFrom : taxSettingsFormValue.effectiveFrom,
              createdAt     : new Date(),
            }
          }
        },
        );

      }else{
        
        FranchiseDetails.update({'_id': userId._id},
          {$push:{ taxSettings :{
              taxType       : taxSettingsFormValue.taxType,
              hsn           : taxSettingsFormValue.hsn,
              cgst          : taxSettingsFormValue.cgst,
              sgst          : taxSettingsFormValue.sgst,
              igst          : taxSettingsFormValue.igst,
              effectiveFrom : taxSettingsFormValue.effectiveFrom,
              createdAt     : new Date(),
            }
          }
        },
        );
      }
      }
    },
    
    'removeTaxDetails': function(targetedID){
         FranchiseDetails.update({'companyId': 1}, {$unset : {['taxSettings.'+targetedID] : 1}});
         FranchiseDetails.update({'companyId': 1}, {$pull : {'taxSettings' : null}});
      
      },
  

    'updatetaxSettings':function(taxSettingsFormValue,targetedID){
  
      var companyData = FranchiseDetails.findOne({"companyId" : 1});
      if(companyData){
        var fromDate1 = taxSettingsFormValue.effectiveFrom.replace(/-/g, '\/');
        var toDateForPreviousRecordISOFormat = new Date(new Date(fromDate1) - (24*60*60*1000) );
        var formateddate = new Date(toDateForPreviousRecordISOFormat);
      
        var toDateForPreviousRecord = formateddate.getFullYear()+'-' + (formateddate.getMonth()+1) + '-'+formateddate.getDate();
        var queryResult = FranchiseDetails.find({'_id': companyData._id, 
              'taxSettings.taxType' : taxSettingsFormValue.taxType }).count();  
    
      
        FranchiseDetails.update({"companyId" : 1, 'taxSettings.taxType':taxSettingsFormValue.taxType},
          {$set:{
              ['taxSettings.'+targetedID+'.taxType']       :taxSettingsFormValue.taxType,
              ['taxSettings.'+targetedID+'.hsn']           :taxSettingsFormValue.hsn,
              ['taxSettings.'+targetedID+'.sgst']          :taxSettingsFormValue.sgst,
              ['taxSettings.'+targetedID+'.cgst']          :taxSettingsFormValue.cgst,
              ['taxSettings.'+targetedID+'.igst']          :taxSettingsFormValue.igst,
              ['taxSettings.'+targetedID+'.effectiveFrom'] :taxSettingsFormValue.effectiveFrom,            
          }
        },
        );

      }
  },
  // 'removeCompanyImage':function(imgLink){
  //   FranchiseDetails.update(
  //     {"companyId" : userData.profile.companyId},
  //     {$unset: 
  //         {
  //           'companyLogo' : imgLink,  
  //         }
  //     }
  //   ); 
  //   FranchiseDetails.update(
  //     {"companyId" : userData.profile.companyId},
  //     {$pull: 
  //         {
  //           'companyLogo' : null,
  //         }
  //     }
  //   ); 
  //   TempLogoImage.remove({"tempLogoImg":imgLink});
  // },



'addPropertyType' : function(propertytypeName) {    

    if(propertytypeName.accType == 0){
      var accType = '';
    }else{
      var accType = propertytypeName.accType;
    }
    var userId = Meteor.userId();
    var userData = Meteor.users.findOne({'_id':userId});
    if(userData){
    var companyData = FranchiseDetails.findOne({"companyId" : userData.profile.companyId});
    if(companyData){
        FranchiseDetails.update({'_id': companyData._id},
           {$push :{property:
                    {                      
                      propertytypeName : propertytypeName
                    }
          }
          });
    } //end of if companyData
  }
                                                               
  },
  deletePropertyType: function(index,propertytypeName){
     
    FranchiseDetails.update({"property.propertytypeName": propertytypeName},{$unset:{["property."+index]:1}},{'multi':true});
    FranchiseDetails.update({"companyId":userData.profile.companyId},{$pull:{"property":null}},{'multi':true});
  },

  
  updatePropertyType: function (propertytypeoldName,propertytypeName) {
   
      FranchiseDetails.update({'property.propertytypeName' : propertytypeoldName},
                          {$set :{
                                  'property.$.propertytypeName' : propertytypeName                                  
                          } 
                        });
  },

  'addPropertySubType' : function(propertysubtypeName) {
      
      /* FranchiseDetails.update(
          {'companyId' : userData.profile.companyId},
          {$push :{propertySubType:
                    {                      
                      propertysubtypeName : propertysubtypeName
                    }
          }
        });*/
    if(propertysubtypeName.accType == 0){
      var accType = '';
    }else{
      var accType = propertysubtypeName.accType;
    }
    var userId = Meteor.userId();
    var userData = Meteor.users.findOne({'_id':userId});
    if(userData){
    var companyData = FranchiseDetails.findOne({"companyId" : userData.profile.companyId});
    if(companyData){
        FranchiseDetails.update({'_id': companyData._id},
          {$push :{propertySubType:
                    {                      
                      propertysubtypeName : propertysubtypeName
                    }
          }
          });
    } //end of if companyData
  }

                                                               
  },
  deletePropertySubType: function(index,propertysubtypeName){
    FranchiseDetails.update({"propertySubType.propertysubtypeName": propertysubtypeName},{$unset:{["propertySubType."+index]:1}},{'multi':true});
    FranchiseDetails.update({"companyId":userData.profile.companyId},{$pull:{"propertySubType":null}},{'multi':true});
  },

  
  updatePropertySubType: function (propertysubtypeoldName, propertysubtypeName) {
   FranchiseDetails.update({'propertySubType.propertysubtypeName' : propertysubtypeoldName},
                          {$set :{
                                  'propertySubType.$.propertysubtypeName' : propertysubtypeName                                  
                          } 
                        });
  },

'addState' : function(stateName) {
      FranchiseDetails.update(
          {'companyId' : userData.profile.companyId},
          {$push :{state:
                    {                      
                      stateName : stateName
                    }
          }
        });                                                    
  },
  deleteState: function(index,stateName){
    FranchiseDetails.update({"state.stateName": stateName},{$unset:{["state."+index]:1}},{'multi':true});
    FranchiseDetails.update({"companyId":userData.profile.companyId},{$pull:{"state":null}},{'multi':true});
  },

  
  updateState: function (stateoldName, stateName) {
    FranchiseDetails.update({'state.stateName' : stateoldName},
                          {$set :{
                                  'state.$.stateName' : stateName                                  
                          } 
                        });
  },

  'addCity' : function(cityName) {
       FranchiseDetails.update(
          {'companyId' : userData.profile.companyId},
          {$push :{city:
                    {                      
                      cityName : cityName
                    }
          }
        });                                                       
  },
  deleteCity: function(index,cityName){
    FranchiseDetails.update({"city.cityName": cityName},{$unset:{["city."+index]:1}},{'multi':true});
    FranchiseDetails.update({"companyId":userData.profile.companyId},{$pull:{"city":null}},{'multi':true});
  },

  
  updateCity: function (cityoldName, cityName) {
    FranchiseDetails.update({'city.cityName' : cityoldName},
                          {$set :{
                                  'city.$.cityName' : cityName                                  
                          } 
                        });
  },

  'allFranchiseData':function(){
    return FranchiseDetails.find({},{$sort:{"createdAt":-1}}).fetch();
  },
  'allFranchiseDataAdmin':function(){
    return FranchiseDetails.find({},{$sort:{"createdAt":-1},fields:{"companyId":1,"contactNo":1,"firstName":1,"lastName":1,"franchiseName":1,"franchiseCodeForCompanyId":1}}).fetch();
  },

   'allFranchiseDataSelected':function(){
    return FranchiseDetails.find({},{$sort:{"createdAt":-1},fields:{"franchiseCodeForCompanyId":1,"franchiseName":1}}).fetch();
  },

  'searchFranchise':function(franchiseName){
    return FranchiseDetails.find({$or:[{"firstName":franchiseName},{"lastName":franchiseName},{"franchiseName":franchiseName},{"companyId":franchiseName}]}).fetch();
  },
  'searchFranchiseAdminside':function(franchiseName){
    return FranchiseDetails.find({$or:[{"firstName":franchiseName},{"lastName":franchiseName},{"franchiseName":franchiseName},{"companyId":franchiseName}]},{fields:{"companyId":1,"contactNo":1,"firstName":1,"lastName":1,"franchiseName":1,"franchiseCodeForCompanyId":1}}).fetch();
  },


  'searchFranchiseData':function(companyId){
    var franchiseData = FranchiseDetails.findOne({'companyId':companyId, "verificationStatus" : "Verified"});
      if(franchiseData){
        return franchiseData;
      }else{
        return 'franchiseNotFound';
      }
  },

  'searchwhenPageLoadFranchiseData':function(companyId){
     return FranchiseDetails.findOne({'companyId':companyId});
    
  },

  
  'getAllFranchiseNames':function(){
     return FranchiseDetails.find({}).fetch();
    
  },
  

    'getSingleFranchiseName':function(name){
     return FranchiseDetails.findOne({"franchiseName":name});
    
  },

  // 'addAreaPincode' : function(locationValues) {      
  //      FranchiseDetails.update(
  //         {'companyId' : userData.profile.companyId},
  //         {$push :{areaPincode:
  //                   {                      
  //                     areaName : locationValues.areaName,
  //                     pincode: locationValues.pincode
  //                   }
  //         }
  //       });
                                                               
  // },
  // deleteAreaPincode: function(index,areaName,pincode){
  //   FranchiseDetails.update({"areaPincode.areaName": areaName,"areaPincode.pincode": pincode},{$unset:{["areaPincode."+index]:1}},{'multi':true});
  //   FranchiseDetails.update({"companyId":1},{$pull:{"areaPincode":null}},{'multi':true});
  // },

  
  // updateAreaPincode: function (areaoldName,oldpincode, areaName,pincode) {
  //   FranchiseDetails.update({'areaPincode.areaName' : areaoldName,'areaPincode.pincode' : oldpincode,},
  //                         {$set :{
  //                                 'areaPincode.$.areaName' : areaName,                                  
  //                                 'areaPincode.$.pincode' : pincode,                                  
                                                                   
  //                         } 
  //                       });
  // },



  // 'addLocation' : function(locationValues) {      
  //      FranchiseDetails.update(
  //         {'companyId' : 1},
  //         {$push :{location:
  //                   {  
  //                     countryCode     :locationValues.countryCode,
  //                     countryName     :locationValues.countryName ,     
  //                     stateCode       :locationValues.stateCode,     
  //                     stateName       :locationValues.stateName,     
  //                     district        :locationValues.district,      
  //                     block           :locationValues.block,     
  //                     city            :locationValues.city,      
  //                     area            :locationValues.area,      
  //                     pinCode         :locationValues.pinCode,     
  //                     lattitude       :locationValues.lattitude,     
  //                     longitude       :locationValues.longitude, 
  //                     "createdAt"     : new Date(),
  //                     "changed"       :{
  //                         "changedAt"     : new Date(),
  //                         "changedBy"     : Meteor.userId(),

  //                     }
                      
  //                   }
                    
  //         }
  //       });
                                                               
  // },
  // deleteLocation: function(index,countryCode,countryName,stateCode,stateName,district,block,city,area,pinCode,lattitude,longitude){
  //   FranchiseDetails.update({
  //     "location.countryCode"      : countryCode,
  //     "location.countryName"      : countryName,
  //     "location.stateCode"        : stateCode,
  //     "location.stateName"        : stateName,
  //     "location.district"         : district,
  //     "location.block"            : block,
  //     "location.city"             : city,
  //     "location.area"             : area,
  //     "location.pinCode"          : pinCode,
  //     "location.lattitude"        : lattitude,
  //     "location.longitude"        : longitude,


  //   },{$unset:{["location."+index]:1}},{'multi':true});
  //   FranchiseDetails.update({"companyId":1},{$pull:{"location":null}},{'multi':true});
  // },

  
  // updateLocation: function (countryCodeoldName,oldcountryName,oldstateCode,oldstateName,olddistrict,oldblock,oldcity,oldarea,oldpinCode,oldlattitude,oldlongitude,countryCode,countryName,stateCode,stateName,district,block,city,area,pinCode,lattitude,longitude) {
  //   FranchiseDetails.update({
  //                             'location.countryCode' : countryCodeoldName,
  //                             'location.countryName' : oldcountryName,
  //                             'location.stateCode'   : oldstateCode,
  //                             'location.stateName'   : oldstateName,
  //                             'location.district'    : olddistrict,
  //                             'location.block'       : oldblock,
  //                             'location.city'        : oldcity,
  //                             'location.area'        : oldarea,
  //                             'location.pinCode'     : oldpinCode,
  //                             'location.lattitude'   : oldlattitude,
  //                             'location.longitude'   : oldlongitude,
  //                           },
  //                           {$set :{
  //                                   'location.$.countryCode' : countryCode,                                  
  //                                   'location.$.countryName' : countryName,                                  
  //                                   'location.$.stateCode'   : stateCode,                                  
  //                                   'location.$.stateName'   : stateName,                                  
  //                                   'location.$.district'    : district,                                  
  //                                   'location.$.block'       : block,                                  
  //                                   'location.$.city'        : city,                                  
  //                                   'location.$.area'        : area,                                  
  //                                   'location.$.pinCode'     : pinCode,                                  
  //                                   'location.$.lattitude'   : lattitude,                                  
  //                                   'location.$.longitude'   : longitude,  
  //                                  // 'UpdatedBy'               :{ UpdatedBy : Meteor.userId()} 
                                     
  //                                 } 
  //                           },   

  //                           {$push:
  //                             {"changed":{
  //                                     "changedAt"     : new Date(),
  //                                     "changedBy"     : Meteor.userId(),
  //                               }
                                
  //                             }

  //                           }                         
  //                         );
  //                       },

 });
}


  