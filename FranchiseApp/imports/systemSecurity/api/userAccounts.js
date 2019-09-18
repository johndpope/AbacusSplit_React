import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import {TempImage} from '/imports/s3/api/ClientImageCall.js';


if (Meteor.isServer) {
  // Meteor.publish('signUpConfig', function() {
  //     this.unblock();
  //     return CheckedField.find({});
  // });

  Meteor.publish('userfunction', function(){
      // this.unblock();
      return Meteor.users.find({});
  });

  Meteor.publish('currentUserfunction', function(){
      // this.unblock();
      return Meteor.users.find({"_id":this.userId});
  });

  Meteor.publish('userData', function(id){
      return Meteor.users.find({ '_id' : id });
  });

  Meteor.publish('spaceOwnerUserData', function(){
      return Meteor.users.find({"roles": "spaceOwner"});
  });

  Meteor.publish('clientUserData', function(){
      return Meteor.users.find({"roles": "user"});
  });

   Meteor.publish('AllFranchise', function(){
      return Meteor.users.find({"roles": "Franchise"});
  });

  Meteor.publish('rolefunction', function(){
      // this.unblock();
      return Meteor.roles.find({});
  });

  Meteor.publish("usersCount",function(){
    Counts.publish(this,"usersCount", Meteor.users.find({"roles":{$nin:['superAdmin']}}));
  });

  Meteor.publish("franchiseUsersCount",function(){
    Counts.publish(this,"franchiseUsersCount", Meteor.users.find({"profile.franchise_id":Meteor.userId()}));
  });

  Meteor.publish('userRole', function(id){
      return Meteor.roles.find({"_id":id});
  });

  Meteor.publish('allUsersCount', function() {
       Counts.publish(this, 'allUsersCount', Meteor.users.find());
  });

  Meteor.publish("UsersCountbyRole",function(roleName){
    // console.log("roleName",roleName,);
    if(roleName=="All"){
      Counts.publish(this, 'UsersCountbyRole',Meteor.users.find());
    }else{
      Counts.publish(this, 'UsersCountbyRole',Meteor.users.find());
    }
  });

  Meteor.publish("onlineStudentStatus", function() {
     Counts.publish(this,"onlineStudentStatus",Meteor.users.find({ "status.online": true ,"roles":{$in:['Student']}}));
  });

  Meteor.publish("allStudentCount", function() {
     Counts.publish(this,"allStudentCount",Meteor.users.find({"roles":{$in:['Student']}}));
  });

  Meteor.publish("onlineFranchiseStatus", function() {
     Counts.publish(this,"onlineFranchiseStatus",Meteor.users.find({ "status.online": true ,"roles":{$in:['Franchise']}}));
  });

  Meteor.publish("allFranchiseCount", function() {
     Counts.publish(this,"allFranchiseCount",Meteor.users.find({"roles":{$in:['Franchise']}}));
  });

  Meteor.publish("onlineStaffStatus", function() {
     Counts.publish(this,"onlineStaffStatus",Meteor.users.find({ "status.online": true ,"roles":{$in:['Staff']}}));
  });

  Meteor.publish("allStaffCount", function() {
     Counts.publish(this,"allStaffCount",Meteor.users.find({"roles":{$in:['Staff']}}));
  });

}

Meteor.methods({
  
  'checkMobileExistorNot':function(mobileNum){
    var userData = Meteor.users.findOne({'profile.mobNumber':mobileNum});
    if(userData){
      return 'MobileNoExist';
     }else{
      return 'MobileNoNotExist';
    }
  },

  'uploadUserProfile' : function(imgId) {
     var profileObj = TempImage.findOne({'userId':Meteor.userId()});
      if(profileObj){
        var imgLink = profileObj.imagePath;
        // console.log("imgLink----> ",imgLink);
        TempImage.remove({'userId':Meteor.userId()});
        Meteor.users.update(
          { '_id': Meteor.userId() },
          {
            $set:{
                "profile.userProfile"   : imgLink,
          } //End of set
        });        
      }
  },


  'uploadUserProfileByAdmin' : function(imgId,userId) {
      var profileObj = TempImage.findOne({'userId':Meteor.userId()});
      if(profileObj){
        var imgLink = profileObj.imagePath;
        // console.log("imgLink----> ",imgLink);
        TempImage.remove({'userId':Meteor.userId()});
        Meteor.users.update(
          { '_id': userId },
          {
            $set:{
                "profile.userProfile"   : imgLink,
          } //End of set
        });        
      }
  },

  'editMyProfileData' : function(formValues,id) {

      var userFound = Meteor.users.findOne({'_id': id});
      if(userFound){

            Meteor.users.update(
              { '_id': id },
              {
                $set:{
                    "profile.firstname"     : formValues.firstname,
                    "profile.lastname"      : formValues.lastname,
                    "profile.mobNumber"     : formValues.mobNumber,
              } //End of set
            }
            );            

      }


  },

  "AddIdCompnySettig":function(newId){

    var usersObj = users.findOne({},{sort:{'createdAt': -1}});

      if(usersObj){ 

          var companyId =  parseInt(usersObj.companyId) + 1;
          
      }else{
       
          var companyId =  101;
      } 
       
    users.insert({"companyId" : companyId, "userId" : newId, "createdAt" : new Date()});     
},

'updateFranchiseCompanyId':function(newcompanyid,userID){

 Meteor.users.update(
            { '_id': userID },
            {

              $set:{
                "profile.companyId"    : newcompanyid,
                "profile.franchiseDocVerify":false,
            } 
          }
          );  
},
'updateUserCredential':function(userId,formValues){
  if(userId && formValues){
    Meteor.users.update(
        { '_id': userId },
          {
            $set:{

              "profile.emailId"    : formValues.studentEmail,
              "emails.0.address"   : formValues.studentEmail,
              "username"           : formValues.studentEmail,
              "profile.mobNumber"  : formValues.mobileNumber,
          } 
      }
    ); 
  } 

},

  'userCreateAccount' : function(formValues) {
    newUserId = Accounts.createUser({
                                username    : formValues.signupEmail,
                                email       : formValues.signupEmail,
                                password    : formValues.signupPassword,
                                
                                profile     : {   
                                          companyId     : '',
                                          firstname     : formValues.firstname,
                                          lastname      : formValues.lastname,
                                          fullName      : formValues.firstname+' '+formValues.lastname,
                                          emailId       : formValues.signupEmail,
                                          mobNumber     : formValues.mobNumber,
                                          status        : 'Blocked',
                                          // company       : formValues.company,
                                          
                                          createdOn     : new Date(),
                                          userCode      : formValues.signupPassword.split("").reverse().join(""),
                                        },
                 
                                
                                    });
                                    
                                   
    if(newUserId){
      var role = formValues.roletype;
      
      Meteor.call("addRoles",newUserId,role);
    }
    return newUserId;
  },

  'userCreateAccountByAdmin' : function(formValues) {
    if(formValues.role=="Staff" || formValues.role=="staff") {
      var franchise_id =  Meteor.userId();
    }else{
      var franchise_id = '';
    }
    var newUserId = Accounts.createUser({
                                username    : formValues.signupEmail,
                                email       : formValues.signupEmail,
                                password    : formValues.signupPassword,
                                profile     : {   
                                          
                                          companyId     : '',
                                          franchise_id  : franchise_id,
                                          firstname     : formValues.firstname,
                                          lastname      : formValues.lastname,
                                          fullName      : formValues.firstname+' '+formValues.lastname,
                                          emailId       : formValues.signupEmail,
                                          mobNumber     : formValues.mobNumber,
                                          status        : 'Active',
                                          company       : formValues.company,
                                          createdOn     : new Date(),
                                          userCode      : formValues.signupPassword.split("").reverse().join(""),
                                        }
                    });
    


        Meteor.users.update(
        {'_id': newUserId },
        {
          $set:{
              "emails.0.verified" : true,
        } //End of set
      }

      ); //end of update
    Meteor.call('addRoles', newUserId , formValues.role,(err,res)=>{
      if(err){

      }else{
        var tosignupEmail = formValues.signupEmail;
        var fromEmailId   = 'support@maats.in';
        var subject       = 'Abacus Online Exam Registration';
        var body          = 'Hello '+formValues.firstname+'\n'+"Congratulations!!!"+'\n'+'\n'+""+formValues.firstname+' '+formValues.lastname+' Your account has been created Successfully by Abacus Admin as '+formValues.role +' .'+'\n'+'Please login using  username: ' +tosignupEmail+ ' and password : '+formValues.role+'123' +'\n'+'\n'+ 'Click on this link to continue : http://exam.maats.in/'  +'\n'+'\n'+ 'Thanks and Regards'+'\n'+'Abacus Online Exam';
        Meteor.call('RegistrationEmail',tosignupEmail,fromEmailId,subject,body);
      }
    });

      
    return newUserId;
  },

  'userCreateAccountStaffByFranchise' : function(formValues) {
    var newUserId = Accounts.createUser({
                                username    : formValues.signupEmail,
                                email       : formValues.signupEmail,
                                password    : formValues.signupPassword,
                                profile     : {    
                                          companyId    : '',
                                          franchise_idForCompanyId : Meteor.userId(),
                                          firstname     : formValues.firstname,
                                          lastname      : formValues.lastname,
                                          fullName      : formValues.firstname+' '+formValues.lastname,
                                          emailId       : formValues.signupEmail,
                                          mobNumber     : formValues.mobNumber,
                                          status        : 'Active',
                                          company       : formValues.company,
                                          createdOn     : new Date(),
                                          userCode      : formValues.signupPassword.split("").reverse().join(""),
                                        }
                    });
    


        Meteor.users.update(
        {'_id': newUserId },
        {
          $set:{
              "emails.0.verified" : true,
        } //End of set
      }
      ); //end of update
      // console.log("newUserId :",newUserId)
    return newUserId;
  },


'userUpdateAccountByAdmin' : function(formValues) {
    var updateUserId=  Meteor.users.update(
      {'_id': updateUserId },
      {
        $set:{
          emailId       : formValues.signupEmail,
          mobNumber     : formValues.mobNumber,
        } //End of set
      },
    );
    return updateUserId;
  },

//add otp
  
  'addOTP' : function(newID,emailotp) {
   var result=  Meteor.users.update(
      {'_id': newID },
      {
        $set:{
          "profile.sentEmailOTP"  :  emailotp,
        } //End of set
      },function(error,result){
        if(error){

        }else if(result){

        }
      }
    );
    return result;
  },

  //add otp when verify email from login page
  
  'addVerifyOTP' : function(mobileNum) {
    var id = Meteor.users.findOne({'profile.mobNumber': mobileNum });
    if(id){
      if(id.emails[0].verified== true){
        return 'alreadyVerified';
      }else{
        return id;
      }
    }else{
      return "MobNumNotExists";
    }

      
  },



// update otp

  'updateOTP' : function(newID,mailotp,roles) {
    
    if (roles == 'Franchise'){

      var newUserId = Meteor.users.update(
        {'_id': newID },
        {
          $set:{  
            "profile.sentEmailOTP"            :  0,
            "profile.receivedEmailOTP"        :  mailotp,
            "profile.status"                  : 'Blocked',
          } //End of set
        }
      );
      
    }else if (roles == 'Student'){
    // console.log("inside update Student otp");
      
      var newUserId = Meteor.users.update(
        {'_id': newID },
        {
          $set:{  
            "profile.sentEmailOTP"            :  0,
            "profile.receivedEmailOTP"        :  mailotp,
            "profile.status"                  : 'Active',
          } //End of set
        }
      );
      
    }

    Meteor.users.update(
        {'_id': newUserId },
        {
          $set:{
              "emails.0.verified" : true,
        } //End of set
      }
      ); //end of update
    return newUserId;
  },


// Update Company name, New Company to Admin Actual Company name

  'UpdateComapnyName':function(id,companyId,companyName){
      Meteor.users.update({"_id":id},{
        $set:{
          'profile.company': companyName,
          'profile.companyId': companyId,
        }
      })
  },
  

  'sendVerificationLinkToUser' : function(emailId) {
   
     this.unblock();
     // let userId = newID;
     let userId = emailId;
    if ( userId ) {
      var user = Meteor.users.findOne({'profile.emailId' : userId});
      if(user){
        var myUserId = user._id;
        // console.log("myUserId",myUserId);
        // console.log("Email send successfully");
        return Accounts.sendVerificationEmail( myUserId ,user.emails[0].address);
      }  
    }else{
      throw new Meteor.Error(402, 'no user login');
    }
  },


  'createUserByAdminSetEmailToTrue' : function(newID) {
      Meteor.users.update(
        {'_id': newID },
        {
          $set:{
              "emails.0.verified" : true,
        } //End of set
      }
      ); //end of update
  },

  'createUserByAdmin' : function(formValues) {
    // console.log(formValues.email);
    var users = Meteor.users.findOne({'emails.0.address' : formValues.email});
    // console.log(users);
    if(users){
      // console.log( "Email Address already taken");
      return 'emailIdExist';
    }else{
      // console.log('in else');
      var newUser = Accounts.createUser(formValues);
      return newUser;
    }
     
  },

  checkEmailVerification: function(email) {
    found_user = Meteor.users.findOne({ 'emails.address' : email })
    if(found_user){
        if(found_user.emails[0].verified == true){
            return "verified";
        }else{
            return "unverified";
        }
    }else{
        return "notfound";
    }
  },

  checkBlockedUser: function(email) {
    found_user = Meteor.users.findOne({ 'emails.address' : email })
    if(found_user){
        if(found_user.profile.status == "Active"){
            return "Active";
        }else{
            return "Blocked";
        }
    }else{
        return "notfound";
    }
  },

  checkcurrentPassword: function(digest, urlUID) {
    check(digest, String);

    if (urlUID) {
      var user = Meteor.user();
      var password = {digest: digest, algorithm: 'sha-256'};
      var result = Accounts._checkPassword(user, password);
      return result.error == null;
    } else {
      return false;
    }
  },


  updateUserByAdmin: function (urlUID, doc , passwordVar1) {
      Meteor.users.update(
        {'_id': urlUID },
        {
          $set:{
              "emails.0.address"     : doc.emailVar1,
              "profile.firstName"    : doc.firstNameVar1 ,
              "username"             : doc.userNameVar1,
              "profile.signGender"   : doc.signGenderVar1,
              "profile.homeAdd"      : doc.homeAddVar1,
              "profile.city"         : doc.cityVar1,
              "profile.state"        : doc.stateVar1,
              "profile.zip"          : doc.zipVar1,
              "profile.country"      : doc.countryVar1, 
              "profile.mobNumber"    : doc.mobNumberVar1,
              "profile.alterNumber"  : doc.alterNumberVar1,
              "profile.salutation"   : doc.salutationVar1,
              "profile.lastName"     : doc.lastNameVar1,
              "profile.displayPicture":  doc.displayPicture1,
              "profile.status"       :  'Active',
              "profile.createdOn"    :  new Date(),

        } //End of set
      }
      );

    Accounts.setPassword(urlUID, passwordVar1);
  },

  updateUserByUser: function (urlUID, doc , userFormValues) {
      Meteor.users.update(
        {'_id': urlUID },
        {
          $set:{
              "emails.0.address" : doc.emailVar1,
              "profile.firstName": doc.firstNameVar1 ,
              "profile.userName": doc.userNameVar1,
              "profile.signGender": doc.signGenderVar1,
              "profile.homeAdd": doc.homeAddVar1,
              "profile.city": doc.cityVar1,
              "profile.state": doc.stateVar1,
              "profile.zip": doc.zipVar1,
              "profile.country": doc.countryVar1, 
              "profile.mobNumber": doc.mobNumberVar1,
              "profile.alterNumber": doc.alterNumberVar1,
              "profile.salutation": doc.salutationVar1,
              "profile.lastName": doc.lastNameVar1,
              "profile.displayPicture":  doc.displayPicture1,
              "profile.signupConfirmPassword":  userFormValues.signupConfirmPasswordVar1,
              "profile.status"      :  'Active',
              "profile.createdOn" :  new Date(),

        } //End of set
      }
      );

    Accounts.setPassword(urlUID, userFormValues.passwordVar1);
  },

  updaterole: function (roleId, roleName) {
    // console.log(roleId);
    // console.log(roleName);
      Meteor.roles.update({'_id': roleId },
                          {
                            $set:{
                                    "name": roleName,
                          } //End of set
                        });
  },

  addrole: function (roleName) {
      Roles.createRole(roleName);
  },

  deleteUser: function(userId){
        Meteor.users.remove({'_id': userId});
  },

  deleteRole: function(roleID){
        Meteor.roles.remove({'_id': roleID});
  },

    addRoles: function(newID , defaultRoleconfig){
    // console.log('addRoles'+ newID);
    Roles.addUsersToRoles(newID, defaultRoleconfig);

  },

    'addRoleToUser': function(role, checkedUsersList){
    // console.log('role : ' + role);
    var addRoles = [role];
    // console.log(checkedUsersList.length);
    for (var i=0; i<checkedUsersList.length; i++) {
      // console.log(checkedUsersList[i]);
      var userId = checkedUsersList[i];
      if(checkedUsersList[i] != null){
        Roles.addUsersToRoles(userId, addRoles);
      }
      
    }
  },

    removeRoleFromUser: function(role, checkedUsersList){
    var rmRoles = [role];
    for (var i=0; i<checkedUsersList.length; i++) {
      Roles.removeUsersFromRoles(checkedUsersList[i], rmRoles);
    }

  },

    blockSelectedUser: function(checkedUsersList){
    // console.log('Serverside-Checked checkboxes:'+ array);
    for (var i=0; i<checkedUsersList.length; i++) {
        // console.log('value: ' + checkedUsersList[i]);

      Meteor.users.update(
        {'_id': checkedUsersList[i] },
        {
          $set:{
              "profile.status": 'Blocked' ,
        } //End of set
      }
      ); //end of update
    } //End of for loop

  }, //end of blockuser function

    activeSelectedUser: function(checkedUsersList){
    // console.log('Serverside-Checked checkboxes:'+ array);
    for (var i=0; i<checkedUsersList.length; i++) {
        // console.log('value: ' + checkedUsersList[i]);

      Meteor.users.update(
        {'_id': checkedUsersList[i] },
        {
          $set:{
              "profile.status": 'Active' ,
        } //End of set
      }
      ); //end of update
    } //End of for loop

  }, //end of Active function

    deleteSelectedUser: function(checkedUsersList){
    // console.log('Serverside-Checked checkboxes:'+ array);
    for (var i=0; i<checkedUsersList.length; i++) {
        // console.log('value: ' + array[i]);
      Meteor.users.remove({'_id': checkedUsersList[i]}); //end of update
    } //End of for loop

  }, //end of Deleteuser function


  sendEmail1: function (to , from, subject ,body) {
    check([to, from, subject, body], [String]);
    
    this.unblock();
    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: body
    });
  }, //End of Send Email Function

  'sendEmailnNotification': function (to , from, subject ,body) {
      Email.send({
        to: to,
        from: from,
        subject: subject,
        html: body
      });
  }, //End of Send Email Function

  'resetPasswordUsingotp': function(id, password){
    Accounts.setPassword(id, password);
  },
   'changeUserPassword' : function(password) {
       Accounts.setPassword(Meteor.userId(), password);
    },

//-------------- Vikas added server side fetching  user management data -------------//

    'getUsersData':function(roleSetVar,activeBlockSetVar,startRange,limitRange,firstname){
      if(Roles.userIsInRole(Meteor.userId(), ["superAdmin", "Admin"])){
      if(roleSetVar || activeBlockSetVar){
          if(!firstname){
            if(roleSetVar=="all" && !activeBlockSetVar){
              return Meteor.users.find({"roles":{ $nin: ["superAdmin"] }},{sort:{'createdAt':-1}, skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(roleSetVar=="all" && activeBlockSetVar){
              return Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar},{sort:{'createdAt':-1}, skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(!roleSetVar && activeBlockSetVar){
              return Meteor.users.find({"roles":{ $nin: ["superAdmin"] },"profile.status": activeBlockSetVar},{sort:{'createdAt':-1}, skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(roleSetVar && activeBlockSetVar){
              return Meteor.users.find({"roles":{ $in: [roleSetVar] },"profile.status": activeBlockSetVar },{sort:{'createdAt':-1},skip:startRange,limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(roleSetVar){
             return Meteor.users.find({"roles":{ $in: [roleSetVar] } },{sort:{'createdAt':-1},skip:startRange,limit: limitRange,fields:{"emails":0,"services":0}}).fetch();            }
          }else{
            if(roleSetVar=='all'){
              return Meteor.users.find({$and:[
                                          {$or:[{"profile.fullName":firstname},{"profile.emailId":firstname},{"profile.mobNumber":firstname}]},
                                          {"roles":{ $nin: ["superAdmin"] }}]},
                                          {sort:{'createdAt':-1},skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else{
              return Meteor.users.find({$and:[
                                              {$or:[{"profile.fullName":firstname},{"profile.emailId":firstname},{"profile.mobNumber":firstname}]},
                                              {"roles":{$in: [roleSetVar]}}]},
                                              {sort:{'createdAt':-1},skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }
          }
             
        }else{
          if(!firstname){
              return Meteor.users.find({"roles":{ $in: ["Admin"] } },{sort:{'createdAt':-1},fields:{"emails":0,"services":0}}).fetch();
          }else{
            return Meteor.users.find({$or:[{"profile.fullName":firstname},{"profile.emailId":firstname},{"profile.mobNumber":firstname}]},{sort:{'createdAt':-1},skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
          }
        }
      }else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
        console.log("in userData",roleSetVar,activeBlockSetVar,startRange,limitRange,firstname);
           if(roleSetVar || activeBlockSetVar){
          if(!firstname){
            if(roleSetVar=="all" && !activeBlockSetVar){
              console.log("in 1");
              return Meteor.users.find({"profile.franchise_id":Meteor.userId()},{sort:{'createdAt':-1}, skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(roleSetVar=="all" && activeBlockSetVar){
              console.log("in 2");
              return Meteor.users.find({"profile.franchise_id":Meteor.userId(),"profile.status": activeBlockSetVar},{sort:{'createdAt':-1}, skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(!roleSetVar && activeBlockSetVar){
              console.log("in 3");
              return Meteor.users.find({"profile.franchise_id":Meteor.userId(),"profile.status": activeBlockSetVar},{sort:{'createdAt':-1}, skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(roleSetVar && activeBlockSetVar){
              console.log("in 4");
              return Meteor.users.find({"profile.franchise_id":Meteor.userId(),"roles":{ $in: [roleSetVar] },"profile.status": activeBlockSetVar },{sort:{'createdAt':-1},skip:startRange,limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else if(roleSetVar){
              console.log("in 5");
             return Meteor.users.find({"profile.franchise_id":Meteor.userId(),"roles":{ $in: [roleSetVar] }},{sort:{'createdAt':-1},skip:startRange,limit: limitRange,fields:{"emails":0,"services":0}}).fetch();            }
          }else{

            if(roleSetVar=='all'){
              console.log("in 6");
              return Meteor.users.find({$and:[
                                          {$or:[{"profile.fullName":firstname},{"profile.emailId":firstname},{"profile.mobNumber":firstname}]},
                                          {"profile.franchise_id":Meteor.userId()}]},
                                          {sort:{'createdAt':-1},skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }else{
              console.log("in 7");
              return Meteor.users.find({$and:[
                                              {$or:[{"profile.fullName":firstname},{"profile.emailId":firstname},{"profile.mobNumber":firstname}]},
                                              {"profile.franchise_id":Meteor.userId()}]},
                                              {sort:{'createdAt':-1},skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
            }
          }
             
        }else{
          if(!firstname){
            console.log("in 8");
              return Meteor.users.find({"profile.franchise_id":Meteor.userId()},{sort:{'createdAt':-1},fields:{"emails":0,"services":0}}).fetch();
          }else{
            console.log("in 9");
            return Meteor.users.find({$and:[
                                        {$or:[{"profile.fullName":firstname},{"profile.emailId":firstname},{"profile.mobNumber":firstname}]},
                                        {"profile.franchise_id":Meteor.userId()}]},{sort:{'createdAt':-1},skip:startRange, limit: limitRange,fields:{"emails":0,"services":0}}).fetch();
          }
        } 
      }else{
        return [];
      }
    },

//----------------- get count of selected role ---------------------//

    'getCountFunction':function(roleSetVar,activeBlockSetVar){
      if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
       if((roleSetVar == "all" && !activeBlockSetVar)       || 
          (roleSetVar == "all" && activeBlockSetVar == '-') || 
          (!roleSetVar && activeBlockSetVar == '-')         ||
          (roleSetVar == '-' && activeBlockSetVar == '-')){
          var questionMasterDataCount = Meteor.users.find({"roles":{$nin:["superAdmin"]}}).count();
        return questionMasterDataCount;
      }else{
        var questionMasterDataCount = Meteor.users.find({"roles":{$in:[roleSetVar]}}).count();
        return questionMasterDataCount;

      }
    }else{
      if((roleSetVar == "all" && !activeBlockSetVar)       || 
          (roleSetVar == "all" && activeBlockSetVar == '-') || 
          (!roleSetVar && activeBlockSetVar == '-')         ||
          (roleSetVar == '-' && activeBlockSetVar == '-')){
          var questionMasterDataCount = Meteor.users.find({"profile.franchise_id":Meteor.userId()}).count();
        return questionMasterDataCount;
      }else{
        var questionMasterDataCount = Meteor.users.find({"profile.franchise_id":Meteor.userId()}).count();
        return questionMasterDataCount;

      }
    }
    },

    'LoginUserRole':function(userId){
       var userData =  Meteor.users.findOne({"_id":userId});
       if(userData){
        var roles= userData.roles;
        if(roles){
          return ["admin",roles[0]];
        }
       }

    },

    //-------------- get all roles  ---------------//
    'getRoles':function(){
      return Meteor.roles.find({name:{$ne:'superAdmin'}}).fetch();
    }
});

Meteor.startup(() => {
  
    if ( !Meteor.users.findOne({username : 'superAdmin'})) {
    
    superUserId = Accounts.createUser({
              username : 'superAdmin',
              email    : 'superAdmin@maats.in',
              password : 'Maats@$$ql',
              profile  : { 'status' : 'Active','companyId':''},
          });

    Roles.addUsersToRoles(superUserId, "superAdmin");

    Meteor.call('createUserByAdminSetEmailToTrue', superUserId,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                        console.log ( "Admin email verified by default");
                    }//the _id of new object if successful
                });
    } // Create super admin
    
  Accounts.urls.resetPassword = function(token) {
    return Meteor.absoluteUrl('reset-password/' + token);
  }

  // Configures "verify email" email link
  Accounts.urls.verifyEmail = function(token){
      return Meteor.absoluteUrl("verify-email/" + token);
  };


  Accounts.emailTemplates.verifyEmail.subject = function(user) {
    return 'Verify Account with Abacus Online Exam System';
  };

  Accounts.emailTemplates.verifyEmail.html = function(user, url) {
    return 'Hello,<br><br>Thank You for Signing up on Abacus Online Exam System. Please verify your email address to continue the site use.<br><br>To verify your account, enter the <b>verification code : '+ user.profile.sentEmailOTP + ' </b><br><br>Regards,<br>Team, <br> Online Exam System';
  };


});