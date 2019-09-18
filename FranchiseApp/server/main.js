import {Meteor} from 'meteor/meteor';
import {Accounts} from 'meteor/accounts-base';
import {WebApp} from 'meteor/webapp';
import { HTTP } from 'meteor/http';
import { Email } from 'meteor/email';
import {Session} from 'meteor/session';

// import './slingshot.js';
// import '../imports/admin/reactCMS/api/users.js';
// import '../imports/admin/reactCMS/api/aboutus.js';
// import '../imports/admin/reactCMS/api/BasicPages.js';
// import '../imports/admin/reactCMS/api/Blocks.js';
// import '../imports/admin/reactCMS/api/BlogPages.js';
// import '../imports/admin/reactCMS/api/CareerPages.js';
// import '../imports/admin/reactCMS/api/Events.js';
// import '../imports/admin/reactCMS/api/FAQS.js';
// import '../imports/admin/reactCMS/api/JobApps.js';
// import '../imports/admin/reactCMS/api/ManageContacts.js';
// import '../imports/admin/reactCMS/api/PhotoGallery.js';
// import '../imports/admin/reactCMS/api/Portfolios.js';
// import '../imports/admin/reactCMS/api/Products.js';
// import '../imports/admin/reactCMS/api/Services.js';


import '/imports/admin/notification/api/NotificationTemplate.js';
import '/imports/admin/notification/api/Notification.js';
import '/imports/admin/notification/apiNotificationMaster.js';

import '/imports/systemSecurity/api/userAccounts.js';

//====== forms api =========

import '/imports/admin/forms/addCategory/api/categoryMaster.js';
import '/imports/admin/forms/addQuestions/api/questionMaster.js';
import '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';

import '/imports/admin/forms/student/api/studentMaster.js';
import '/imports/admin/forms/student/api/myExamMaster.js';
import '/imports/admin/forms/student/api/myPracticeExamMaster.js';
import '/imports/admin/forms/student/api/myTempQuestionPaperMaster.js';
import '/imports/admin/forms/student/api/competitionRegisterOrder.js';
import '/imports/admin/forms/exam/api/examMaster.js';

import '/imports/admin/forms/instructions/api/instructionMaster.js';

import '/imports/admin/forms/invoice/api/packageOrderMaster.js';
import '/imports/admin/configuration/api/quickWalletMaster.js';
import '/imports/admin/accessManagement/api/accessPermissionManagement.js';

import '/imports/admin/forms/invoice/api/packageQuestionPaperMaster.js';

// import '/imports/admin/notification/apiNotificationMaster.js';




//========== s3 ============
import '/imports/s3/api/ClientImageCall.js';
import {ProjectSettings} from '/imports/s3/api/projectSettings.js';
import {ProductImage} from '/imports/s3/api/ProductImage.js';
import {FranchiseDetails} from '../imports/admin/companySetting/api/CompanySettingMaster.js';
import {StudentMaster} from '../imports/admin/forms/student/api/studentMaster.js';
import {SMSReportMaster} from '../imports/admin/SMSManagement/api/sendSMS.js';
// import {Session} from 'meteor/session';
import { check} from 'meteor/check';
var contactArray=[];

// import { CategoryImage } from '../imports/admin/product/addNewProduct/api/CategoryImage.js';
// Meteor.publish('categoryImagePublish', function() {
//     return CategoryImage.find().cursor;
// });

Meteor.startup(() => {
  // code to run on server at startup examabacus@gmail.com   abacus123
  // process.env.MAIL_URL = "smtp://examabacus:abacus123@smtp.googlemail.com:587";
  process.env.MAIL_URL='smtp://support%40maats.in:' + encodeURIComponent("maats@maats777") + '@smtp.gmail.com:587';
  // process.env.MAIL_URL='smtps://support%40maats.in:maats@098@smtp.gmail.com/?pool=true';
  // Accounts.emailTemplates.resetPassword.from = () => 'rightnxt <rightnxt123@gmail.com>';
  Accounts.emailTemplates.siteName = "Abacus";
  Accounts.emailTemplates.from = 'Abacus Online Exam <support@maats.in>';
  
  WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });


});

Meteor.methods({
  
  'sendSMSMsg':function(firstname,toNumber,otp){
      var toNum = '91'+toNumber.replace(/-/g, '');
      var text = "Dear "+firstname+','+'\n'+"To verify your account on Abacus Online System, Enter the verification code : "+otp; // Your SMS Text Message - English;
      return Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text);
      

      // console.log("to number----> ", toNum);
      // console.log("text----> ", text);

      // var plivo = Plivo.RestAPI({
      //     authId: 'MAMZU2MWNHNGYWY2I2MZ',
      //       authToken: 'MWM1MDc4NzVkYzA0ZmE0NzRjMzU2ZTRkNTRjOTcz'
      //   });

      // var params = {
      //   'src'  : '9923393733', // Sender's phone number with country code
      //   'dst'  : toNum.toString(), // Receiver's phone Number with country code
      //   'text' : "Dear "+firstname+','+'\n'+"To verify your account on Abacus Online System, Enter the verification code : "+otp, // Your SMS Text Message - English
      //   'type' : "sms",
      // };

      //  // console.log(params);

      //   plivo.send_message(params, function (status, response) {
      //   });
      
      // var settings = {
      //     "async": true,
      //     "crossDomain": true,
      //     "url": "http://api.msg91.com/api/sendhttp.php?sender="+toNumber+"authkey='218126Ah3sKTCFpXF5b0fbf06'&message=Hello!"+otp,
      //     "method": "GET",
      //     "headers": {}
      //   }

        // $.ajax(settings).done(function (response) {
        //   console.log(response);
        // });
      //   HTTP.call('POST', "http://api.msg91.com/api/sendhttp.php?sender="+toNumber+"authkey='218126Ah3sKTCFpXF5b0fbf06'&message=Hello!"+otp, {
      //   data: { some: 'json', stuff: 1 }
      // }, (error, result) => {
      //   // if (!error) {
      //   //   Session.set('twizzled', true);
      //   // }
      // });

      // return Meteor.http.call("GET", "http://mahasurvey.in/WebService/MahaSurveyWbSrvce.asmx/SEND_SMS?MOBNO="+toNumber+"&TEXT_MSG="+smsBody);
     
    },

  'userExistEmailUsername': function(username,email){
    // console.log('username :',username);
    // console.log('userExists : ',Meteor.users.find({'username':username}).fetch().length != 0);
    // console.log('userExists : ',Meteor.users.find({'emails.0.address':email}).fetch().length != 0);
    // console.log('userExists : ',Meteor.users.find({username}).fetch().length != 0 || Meteor.users.find({'emails.0.address':email}).fetch().length != 0);
    if(Meteor.users.find({username}).fetch().length != 0 || Meteor.users.find({'emails.0.address':email}).fetch().length != 0)
      return true;
      return false;
  },

  RegistrationEmail(to, from, subject, text,body) {
    // this.unblock();
    Email.send({ to      : to,
                 from    : from,
                 subject : subject,
                 text    : text,
                 html    : body,
                 });
    
  },

    'sendSMSToAllFranchise':function(smsText){
      var allFranchise = FranchiseDetails.find({},{fields:{"contactNo":1,"franchiseName":1}}).fetch({});
      var SuccessContactNo=[];
      var FailureContactNo=[];
      if(allFranchise.length>0){
          console.log("allFranchise",allFranchise);
          var dataLength=allFranchise.length;
          // console.log("dataLength",dataLength);
          for(i=0;i<dataLength;i++){
            var userName = allFranchise[i].franchiseName;
            var contactNum = allFranchise[i].contactNo;
            var toNum = '91'+contactNum.replace(/-/g, '');
            var text = "Dear "+userName+','+'\n'+smsText;
            var smsSentReport=Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text);
            console.log("all franchise smsSentReport--->",i,smsSentReport);

            if(smsSentReport.statusCode==200){
              SuccessContactNo.push({SuccessContactNo: allFranchise[i].contactNo});
            }else{
              FailureContactNo.push({FailureContactNo:allFranchise[i].contactNo}) 
            }
            if(i+1==dataLength){
              Meteor.call("addSMSReport",smsText,SuccessContactNo,FailureContactNo,(err,res)=>{
                if(err){
                  console.log(err);
                }else{        
                  
                }
              });
            }
            
          }
       }
      
      },

    'sendSMSToSingleFranchise':function(id,smsText){
         
        // console.log("id n txt",id,smsText)
         var SuccessContactNo=[];
         var FailureContactNo=[];
          var singleFranchise = FranchiseDetails.findOne({"franchiseCodeForCompanyId":id},{fields:{"contactNo":1,"franchiseName":1}});
       
        if(singleFranchise){
           var userName = singleFranchise.franchiseName;
           var contactNum    = singleFranchise.contactNo;
        
       
        var toNum = '91'+contactNum.replace(/-/g, '');
        var text = "Dear "+userName+','+'\n'+smsText;
         var smsSentReport= Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text);
       
        
       if(smsSentReport.statusCode==200){
              SuccessContactNo.push({SuccessContactNo: contactNum});
            }else{
              FailureContactNo.push({FailureContactNo: contactNum}) 
            }

            Meteor.call("addSMSReport",smsText,SuccessContactNo,FailureContactNo,(err,res)=>{
                if(err){
                  console.log(err);
                }else{        
                  
                }
              });
        }
      },

      'sendSMSToStudents':function(franchiseID,category,subCategory,smsText){
         

        if(franchiseID=="All"){
          if(category=="All"){
              var studentData=StudentMaster.find({},{fields:{"studentFullName":1,"mobileNumber":1}}).fetch();
          }else{          
            if(subCategory=="All"){
              var studentData=StudentMaster.find({"category":category},{fields:{"studentFullName":1,"mobileNumber":1}}).fetch();

            }else{
              var studentData=StudentMaster.find({"category":category,"subCategory":subCategory},{fields:{"studentFullName":1,"mobileNumber":1}}).fetch();
            }
          }

        }else{
       

          if(category=="All"){
              var studentData=StudentMaster.find({"franchiseId":franchiseID},{fields:{"studentFullName":1,"mobileNumber":1}}).fetch();
          }else{          
            if(subCategory=="All"){
              var studentData=StudentMaster.find({"franchiseId":franchiseID,"category":category},{fields:{"studentFullName":1,"mobileNumber":1}}).fetch();

            }else{
              var studentData=StudentMaster.find({"franchiseId":franchiseID,"category":category,"subCategory":subCategory},{fields:{"studentFullName":1,"mobileNumber":1}}).fetch();
            }
          }
        }
          



        var SuccessContactNo=[];
        var FailureContactNo=[];
        if(studentData.length>0){
            
            var dataLength=studentData.length;
            // console.log("dataLength",dataLength);

            for(i=0;i<dataLength;i++){
              var userName = studentData[i].studentFullName;
              var contactNum = studentData[i].mobileNumber; 
              var toNum = '91'+contactNum.replace(/-/g, '');
              var text = "Dear "+userName+','+'\n'+smsText;
              var smsSentReport=Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text);
            

              if(smsSentReport.statusCode==200){
                SuccessContactNo.push({SuccessContactNo: studentData[i].mobileNumber});
              }else{
                FailureContactNo.push({FailureContactNo:studentData[i].mobileNumber}) 
              }
              if(i+1==dataLength){
                Meteor.call("addSMSReport",smsText,SuccessContactNo,FailureContactNo,(err,res)=>{
                  if(err){
                    console.log(err);
                  }else{        
                    
                  }
                });
              }
              
            }
         }
      },
      'sendSMSToallFranchiseAndStudent':function(franchise,smsText){
         

        if(franchise=="All"){
        var allFranchiseAndStudent = Meteor.users.find({"roles":{ $in: ["Student","Franchise"] }},{fields:{"profile":1}}).fetch({});
        var SuccessContactNo=[];
        var FailureContactNo=[];
        if(allFranchiseAndStudent.length>0){
           
            var dataLength=allFranchiseAndStudent.length;
            // console.log("dataLength",dataLength);
            for(i=0;i<dataLength;i++){
              var userName = allFranchiseAndStudent[i].profile.fullName;
              var contactNum = allFranchiseAndStudent[i].profile.mobNumber;
              var toNum = '91'+contactNum.replace(/-/g, '');
              // console.log("toNum",toNum);
              var text = "Dear "+userName+','+'\n'+smsText;
              var smsSentReport=Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text);
            


              if(smsSentReport.statusCode==200){
                SuccessContactNo.push({SuccessContactNo: allFranchiseAndStudent[i].profile.mobNumber});
              }else{
                FailureContactNo.push({FailureContactNo:allFranchiseAndStudent[i].profile.mobNumber}) 
              }
              if(i+1==dataLength){
                Meteor.call("addSMSReport",smsText,SuccessContactNo,FailureContactNo,(err,res)=>{
                  if(err){
                    console.log(err);
                  }else{        
                    
                  }
                });
              }
            }
         }
       }else{
         var studentData = StudentMaster.find({"franchiseId":franchise},{fields:{"studentFullName":1,"mobileNumber":1,"franchiseMobileNumber":1,"franchiseName":1}}).fetch();
       

          var SuccessContactNo=[];
          var FailureContactNo=[];
          

          if(studentData.length>0){

              var franchisecontactNum = studentData[0].franchiseMobileNumber;
              var toFranchiseNum = '91'+franchisecontactNum.replace(/-/g, '');
              var FranchiseName= studentData[0].franchiseName;
              var text1 = "Dear "+FranchiseName+','+'\n'+smsText;
              var smsSentReport1=Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toFranchiseNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text1);
              
        

              if(smsSentReport1.statusCode==200){
                      SuccessContactNo.push({SuccessContactNo: studentData[0].franchiseMobileNumber});
                    }else{
                      FailureContactNo.push({FailureContactNo:studentData[0].franchiseMobileNumber}) 
                    }
              
              var dataLength=studentData.length;
              for(i=0;i<dataLength;i++){
                var userName = studentData[i].studentFullName;
                var contactNum = studentData[i].mobileNumber; 
               
                var toNum = '91'+contactNum.replace(/-/g, '');
               
                var text = "Dear "+userName+','+'\n'+smsText;
                var smsSentReport=Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text);
        

                if(smsSentReport.statusCode==200){
                  SuccessContactNo.push({SuccessContactNo: studentData[i].mobileNumber});
                }else{
                  FailureContactNo.push({FailureContactNo:studentData[i].mobileNumber}) 
                }
                if(i+1==dataLength){
                  Meteor.call("addSMSReport",smsText,SuccessContactNo,FailureContactNo,(err,res)=>{
                    if(err){
                      console.log(err);
                    }else{        
                      
                    }
                  });
                }
                
              }
           }



       }
      
      },
      'BulkContactCSVUpload': function(csvObject){
        check( csvObject, Array);
        var test = [];
        if(csvObject){
          UserSession.set("allProgressbarSessionContact", csvObject.length-2, Meteor.userId());
          
          var arrayLength=csvObject.length-1;
          for(i=0;i<arrayLength;i++){
            var uploadQuestion = csvObject[i];
            contactArray.push({'userName'  : csvObject[i].userName,'contactNum'  : csvObject[i].contactNum,})
            if(test[i]){
              UserSession.set("progressbarSessionContact", i, Meteor.userId());
            }

          }// EOF i
            // console.log("---->",contactArray);
            // console.log("-UserSession--->",UserSession.get("allProgressbarSession"));

            return contactArray


          
        }
      },
      'sendSMSToOthers':function(smsText){
       // console.log("---->",contactArray);
       if(contactArray){
         var contactArrayLen=contactArray.length;
       }
      
         

          var SuccessContactNo=[];
          var FailureContactNo=[];
            for(i=0;i<contactArrayLen;i++){
                  var userName = contactArray[i].userName;
                  var contactNum = contactArray[i].contactNum;
                  var toNum = '91'+contactNum;
                  var text = "Dear "+userName+','+'\n'+smsText;
                  var smsSentReport=Meteor.http.call("GET", "http://api.msg91.com/api/sendhttp.php?sender=MSGIND&route=4&mobiles="+toNum+"&authkey=218126Ah3sKTCFpXF5b0fbf06&country=91&message="+text);
            
                  if(smsSentReport.statusCode==200){

                    SuccessContactNo.push({SuccessContactNo: contactArray[i].contactNum});
                    
                  }else{

                    FailureContactNo.push({FailureContactNo:contactArray[i].contactNum})

                  }
                  if(i+1==contactArrayLen){
                    Meteor.call("addSMSReport",smsText,SuccessContactNo,FailureContactNo,(err,res)=>{
                      if(err){
                        console.log(err);
                      }else{        
                        
                      }
                    });
                  }
                }
                contactArray=[];
        },



});  


