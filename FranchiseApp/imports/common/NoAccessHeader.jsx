import React,{Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class NoAccessHeader extends TrackerReact(Component){
  
  constructor(props) {
   super(props);
    this.state = {
      // subscription :{
      //   "userData" : Meteor.subscribe("userData",Meteor.userId()), 
      //   "studentData" : Meteor.subscribe("singleStudent",Meteor.userId()), 
      // }
    }
  }
   
  componentDidMount(){
    if ( !$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
  }
    
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }

  handleClick(e) {
      e.preventDefault();
      Meteor.logout();
      FlowRouter.go('/');
 } 

 // myprofileClick(e) {
 //    var id = $(e.currentTarget).attr('id');
 //    FlowRouter.go('/franchise/profile/'+id);
 // }

 // currentUser(){
 //    var FranchiseInfo=FranchiseDetails.findOne({"franchiseCodeForCompanyId":Meteor.userId()});
    
 //    var LoginUserData = Meteor.users.findOne({"_id":Meteor.userId()});
 //      if(FranchiseInfo){
 //          var firstName = FranchiseInfo.firstName;         
 //          return firstName;
 //      }else if(LoginUserData){
 //        var profile = LoginUserData.profile;
 //        if(profile){
 //          var firstName = profile.firstname;
 //          if(firstName){
 //            return firstName;
 //          }else{
 //            return 'Admin';
 //          }
 //        }
        
 //      }

 //    }

  // studentLogin(){
  //   if(Roles.userIsInRole(Meteor.userId(), ['Student'])) {
  //       return 
  //   }else{
  //     return 
  //             {<li>
  //               <a href="/admin/company-info" data-toggle="control-sidebar">
  //                 <i className="fa fa-gears" />
  //               </a>
  //             </li>}
  //   }
  // }

  // studentLoginPhoto(){
  //   if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])) {
  //     var postHandle = Meteor.subscribe("LoginInFranchiseData",Meteor.userId()).ready();
  //     if(postHandle){
  //      var franchiseData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":Meteor.userId()});
  //       if(franchiseData){
  //           return franchiseData.franchisePhoto;
  //       }else{
  //             return '/images/addLogo1.png';
  //         }
  //     }
  //   }else{
  //     var userData = Meteor.users.findOne({"_id":Meteor.userId()});
  //     if(userData){
  //       var profileData = userData.profile;
  //       if(profileData){
  //         if(profileData.userProfile){
  //           return profileData.userProfile;
  //         }else{
  //           return '/images/user.png';
  //         }
  //       }
  //     } else{
  //       return '/images/user.png';
  //     }
  //   }
  // }

  // getUploadImgPercentagee(){
  //   var uploadProgressPercent = Session.get("imageprogresss");
  //   if(uploadProgressPercent){
  //       var percentVal = parseInt(uploadProgressPercent);
  //       if(percentVal){
            
  //           var styleC = {
  //               display:"inline-block",
  //           }
  //           var styleCBar = {
  //               display:"inline-block",
  //           }
  //       }
  //       if(!percentVal){
  //           var percentVal = 0;

  //           var styleC = {
  //               width:0 + "%",
  //               display:"none",
  //           }
  //           var styleCBar = {
  //               display:"none",
  //           }
            
  //       }
  //       if(percentVal == 100){
  //           var percentVal = 0;

  //           var styleC = {
  //               width:0 + "%",
  //               display:"none",
  //               height:"8px",
  //           }
  //           var styleCBar = {
  //               display:"none",
  //               marginTop:117,
  //               height:"8px",
  //           }
           
  //       }
  
  //       return (
          
  //               <span style={styleCBar}>
  //                 <img src='/images/loading.gif' className="img-circle progressDashboard" style= {styleC}/>  
  //               </span>  
  //       );
  //     }
  // }

  // myProfile(){
  //   if(Roles.userIsInRole(Meteor.userId(), ['Student'])){
  //     return <a href="/Student/Profiles" className="btn btn-default btn-flat">My Profile</a>
  //   }else{
  //     {/*<a href={`/admin/editProfile/${Meteor.userId()}`} className="btn btn-default btn-flat">My Profile</a>*/}
  //     return '';
  //   }
  // }

  

  // uploadStudentImage(event){
  //     event.preventDefault();
  //     let self = this;
  //     if (event.currentTarget.files && event.currentTarget.files[0]) {
  //     var file = event.currentTarget.files[0];

  //       if (file) {
  //         addStudentImgsToS3Function(file,self);
  //       }
  //     }
  //   }
  goToLogin(){
    FlowRouter.go('/');
  }

  render(){
    return(
    <div>
      <header className="main-header">
          {/* Logo */}
          <a href="javascript:void(0)" className="logo navbar-fixed-top">
            {/* mini logo for sidebar mini 50x50 pixels */}
            <span className="logo-mini">
              <img src="/images/maatslogoSmall.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardLogoOESSmall" />
            </span>
            {/* logo for regular state and mobile devices */}
           {/* <a href="/adminDashboard">
              <span className="logo-lg">
                 
                  <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardLogoOES" />
              </span>
            </a>*/}
           
                <a href="">
                  <span className="logo-lg">
                      {/*<b>Online Exam System</b>*/}
                      <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardLogoOES" />
                  </span>
                </a>
              
          </a>
          {/* Header Navbar: style can be found in header.less */}
          <nav className="navbar navbar-static-top headerColor navbar-fixed-top">
            {/* Sidebar toggle button*/}
            <a href="javascript:void(0)" className="sidebar-toggle" data-toggle="push-menu" role="button">
              <span className="sr-only">
                Toggle navigation
              </span>
            </a>
            {/* Navbar Right Menu */}
            <div className="navbar-custom-menu">
              <span className="bcktolgn col-lg-12" onClick={this.goToLogin.bind(this)}> Back to Login page</span>
            </div>
          </nav>
        </header>
      </div>
    );
  }
}
