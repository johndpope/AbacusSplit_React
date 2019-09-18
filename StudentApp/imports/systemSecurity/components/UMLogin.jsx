
import React, { Component } from 'react';
import { render } from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import ConfirmOtpModal from './ConfirmOtpModal.jsx';
import NewForgotPassword from './NewForgotPassword.jsx';
import NewResetPassword from './NewResetPassword.jsx';
import {StudentMaster} from '/imports/student/api/studentMaster.js';
// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMLogin extends Component{
constructor(props) {
    super(props);
    this.state = {
        'showLoginBrn': true,
        loginusername:"",
        loginPassword:"",
        'defaultLoginBtnTime': '02:00',
        'subscription': {
            studData: Meteor.subscribe('singleStudent', Meteor.userId()),
            "firstFranchiseData" : Meteor.subscribe("firstFranchiseData",1),
            "franchiseData" : Meteor.subscribe("franchiseData"),

        }
    }
    this.handleChange = this.handleChange.bind(this);
}


componentDidMount(){
      if ($('body').hasClass('adminLte')) {
        $("script[src='/js/adminLte.js']").remove();
            $("link[href='/css/dashboard.css']").remove();
            $('body').removeClass('adminLte');
      }
      // console.log("in login page abacus student");
  }
  

  handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }


userlogin(event){
event.preventDefault();
document.getElementById("logInBtn").value = 'We are processing. Please Wait...';
// this.setState({
// showLoginBrn : false,
// });
var email       = this.refs.loginusername.value;
var passwordVar = this.refs.loginPassword.value; 

    Meteor.call('checkEmailVerification', email, function(error,data){
      if (data == "verified"){
      // alert('verified');
        Meteor.call('checkBlockedUser', email, function(error,data){
          if (data == "Active"){
          // alert('active');
            Meteor.loginWithPassword(email, passwordVar, function(error) {
            // alert('in login loginWithPassword');
                    if (error) {
                        // return
                        console.log("error-->",error.reason);
                        swal("Either Email or Password is Incorrect","","warning");
                        document.getElementById("logInBtn").value = 'Login';
                        // swal({
                        //     title: "Email or password Incorrect",
                        //     text: "Please try again or create an account",
                        //     timer: 1700,
                        //     showConfirmButton: false,
                        //     type: "error"
                        // });
                    } else {
                      if(Roles.userIsInRole(Meteor.userId(), ['superAdmin'])) {
                        // FlowRouter.go('/adminDashboard');
                        swal("Only student can login, Please use admin URL to login");
                        document.getElementById("logInBtn").value = 'Login';
                          $('#loginusername').val('');
                          $('#loginPassword').val(''); 
                          FlowRouter.go('/noAccesssPage');

                      }else if(Roles.userIsInRole(Meteor.userId(), ['Student'])) {
                       
                        var studentData    = StudentMaster.findOne({"studentId":Meteor.userId()});
                        if(studentData){
                        FlowRouter.go('/Student/Profiles');
                        // Meteor.call("AddStudentProfileUpdate",Meteor.userId(),(err,res)=>{
                        //   if(err){

                        //   }else{
                            
                        //   }
                        // });
                        Meteor.call("updateStudentNotificationStatus",(err,res)=>{
                          if(err){
                          }else{
                            
                          }
                        });
                        Meteor.call("updateStudentNotificationDownTimeStatus",(err,res)=>{
                          if(err){
                          }else{
                            
                          }
                        });
                       
                        }else{
                        FlowRouter.go('/Student/Profiles');
                        }
                   
                    }else if(Roles.userIsInRole(Meteor.userId(), ['admin','Admin'])) {
                      var AdminExist = FranchiseDetails.findOne({"companyId":1});
                      // console.log("AdminExist",AdminExist);
                      if(AdminExist){
                        // FlowRouter.go('/adminDashboard');
                        swal("Only student can login, Please use admin URL to login");                       
                        document.getElementById("logInBtn").value = 'Login';
                          $('#loginusername').val('');
                          $('#loginPassword').val(''); 
                          FlowRouter.go('/noAccesssPage');


                       }else{
                        // FlowRouter.go('/initial-company-setting/'+Meteor.userId());
                        swal("Only student can login, Please use admin URL to login");                       
                        document.getElementById("logInBtn").value = 'Login';
                          $('#loginusername').val('');
                          $('#loginPassword').val(''); 
                          FlowRouter.go('/noAccesssPage');


                       }
                     // if(Meteor.user().profile.companyId == '' ){                          
                     //      FlowRouter.go('/initial-company-setting/'+Meteor.userId());
                     //    }else{

                     //      FlowRouter.go('/adminDashboard'); 

                     //    }
                      // FlowRouter.go('/initial-company-setting/'+Meteor.userId());
                   
                    }else if (Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
                        // if(Meteor.user().profile.companyId == '' ){                         
                        //   FlowRouter.go('/initial-company-setting/'+Meteor.userId());
                        // }else{

                        //   var franchiseData=FranchiseDetails.findOne({"franchiseCodeForCompanyId":Meteor.userId()});                         
                         
                        //   if(franchiseData){
                        //     var verifyStatus=franchiseData.verificationStatus;
                        //   }
                        //   if(verifyStatus=="Verified"){
                        //     FlowRouter.go('/franchiseDashboard');
                        //   }else {
                        //     FlowRouter.go('/initial-company-setting/'+Meteor.userId());
                        //     // swal("Your Account is not verified. Please contact us on support@maats.in or call us on +91-8983318508.");
                        //     swal("Your Account is not verified. Please contact us on support@maats.in or call us on +91-8983318508.");
                        //     document.getElementById("logInBtn").value = 'Login';
                        //   } 
                        // }
                        swal("Only student can login, Please use franchise URL to login");                       
                        document.getElementById("logInBtn").value = 'Login';
                          $('#loginusername').val('');
                          $('#loginPassword').val(''); 
                          FlowRouter.go('/noAccesssPage');


                      }else if(Roles.userIsInRole(Meteor.userId(), ['Staff'])) {
                          // FlowRouter.go('/staffDashboard');
                        swal("Only student can login");                       
                        document.getElementById("logInBtn").value = 'Login';
                          $('#loginusername').val('');
                          $('#loginPassword').val(''); 
                          FlowRouter.go('/noAccesssPage');
                                            
                       }
                    }
                });

            }else if(data == "Blocked"){
                swal("Your Account is not verified. Please contact us on support@maats.in or call us on +91-8983318508.");
                document.getElementById("logInBtn").value = 'Login';
            }else{
                swal("Either Email or Password is Incorrect");
                document.getElementById("logInBtn").value = 'Login';
            }
          });
     
      }else if(data == "unverified"){
          swal({title:"Check your Email for a Verification Link",});
          document.getElementById("logInBtn").value = 'Login';
      }else{
          swal("Either Email or Password is Incorrect");
          document.getElementById("logInBtn").value = 'Login';
      }
    });


    return false;    


}
sendForgotPasswordOTP(event) {
    event.preventDefault();
    var mobile = $('.mobile').val();
    Session.set("getMobileNumber", mobile);
    var otp = Math.floor(1000 + Math.random() * 9000);
    Session.set('FPotp', otp);
    if (mobile != "") {
        Meteor.call('sendOtp', mobile, otp,
            function(error, result) {
                if (error) {
                    console.log(error.reason, "danger", "growl-top-right");
                } else {

                    $('#forgotpass').hide();
                    $('.modal-backdrop').hide();

                    $('#otpForgotPasswordModal').modal({
                        show: true
                    });
                }
            });

    } else {
        swal('Your Mobile Number is not Found. Please Enter Valid Mobile Number.');
    }
}

confirmOTP(event) {
    event.preventDefault();
    var userId = Meteor.userId();
    var sessionValue = Session.get('FPotp');
    var otp = this.refs.otp.value;
    if (sessionValue == otp) {
        $('.modal-backdrop').hide();
        FlowRouter.go('/ForgotPassword');
    } else {
        swal('Please Check your Mobile for Valid OTP');
    }

}


render() {
// if(!Meteor.userId()){
var winHeight = $(window).height();
var windowHeight = winHeight+'px';
var divHeight = winHeight/4.5+'px';
var MyDivHeight = $('#divHeghtIN').height();  

 // if(Meteor.logout()){ 

  return (
       <div>
       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpLeftWrap" style={{"height": winHeight}}>
        {/*<img src="/images/signUpBanner.gif" className="signUpBanner col-lg-9 col-md-9"/>*/}
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
        <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 logoImg"/>
        <div className="OESSubTitle2">Abacus Online Exam System</div>

        </div>

        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpRighttWrap" style={{"height": winHeight}}>
        <div className="div1 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div2 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div3 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div4 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div5 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div6 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div7 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div8 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div1 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        <div className="div2 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
        </div>
        </div>
        <div className="col-lg-6 col-lg-offset-2 col-md-5 col-md-offset-6 col-xs-4 col-sm-5 col-sm-offset-6 signUpFormWrap loginOesWrap formbg1 loginforms" id="divHeghtIN" style={{"height": winHeight}}>


        {/*<img src="/images/formbg1.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formbg"/>*/}

          <div className="divLoginInWrap">

        {/*<div className="col-lg-12">
        <div className="col-lg-12 col-md-12 OEXLogoWrap">
        <img src="/images/maatslogo.png" className="oesLogoImg col-lg-offset-2 col-lg-8 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2"/>
        </div>
        </div>*/}
        {/*<div className="OESSubTitle2">Abacus Online Exam System</div>*/}

        <form id="login" onSubmit={this.userlogin.bind(this)}>
            <h3 className="signInNameTitle"><span className="bordbt">SIGN IN</span></h3>
            <div className="col-lg-12 col-md-12 col-sm-12 ">
            <div className="inputContent">
            <span className="blocking-span">
           <input type="email"  className={this.state.loginusername?"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox has-content":"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox"} onChange={this.handleChange} ref="loginusername" id="loginusername" name="loginusername" placeholder="" required/>
        <span className="floating-label"><i className="fa fa-envelope signupIconFont" aria-hidden="true"/>Email</span>   
        </span>
            </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12">
           <div className="inputContent ">
           <span className="blocking-span">
           <input type="password" className={this.state.loginusername?"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox has-content":"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox"} onChange={this.handleChange} ref="loginPassword" id="loginPassword" name="loginPassword" required/>
        <span className="floating-label"><i className="fa fa-lock signupIconFont" aria-hidden="true"/> Password</span>   
        </span>

        <div className="rrnShowHideDiv">
           
            </div>
            </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
           
            <input id="logInBtn" type="submit" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 UMloginbutton hvr-sweep-to-right" value="Login"/>
           
           </div>
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">
             <div className="col-lg-5 col-md-6 col-sm-6 ">
             <a href="/signUp" className="UMGreyy UMcreateacc col-lg-12 col-md-12 col-xs-12 col-sm-12"> Sign Up</a>
             </div>

            <div className="col-lg-6 col-md-6 col-sm-6 col-lg-offset-1 ">
                <a href="/ForgotPassword" className="UMGreyy UMcreateacc col-lg-12 col-md-12 col-xs-12 col-sm-12">
                Forgot Password?
                </a>
            </div>

          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 pdcls">
            <div className="col-lg-12 col-md-12 col-sm-12 ">
              <a href="/verifyAccount" className="UMGreyy forgotpass emailverify col-lg-12 col-md-12 col-xs-12 col-sm-12">
                OTP Verification
              </a>
            </div>
          </div>

        </form>
        </div>
          </div>
        {/*<img src="/images/underMaintenance.gif" className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 maintenanceClass"/>
        <h2 className="col-lg-12 col-md-12 col-sm-12 pVText">Please visit <a href="http://exam.maats.in"> exam.maats.in</a></h2>*/}
        </div>
        </div>

        );
// {this.tryLoadingAgainforBtn();




      //   }else{
      //          return(
      //             <div className="col-lg-12 col-md-12 col-sm-12 backgroundErrImgMain" style={{"height": windowHeight}}>
      //               <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-2 backgroundErrImg" >
      //                 <h2>System is in under maintenance.</h2>
      //                 <h3> We will be live shortly.</h3>
      //               </div>
      //             </div>);
      //         {/*<img src="/images/underMaintenance.gif" className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 maintenanceClass"/>*/}
      //          {/*<h2 className="col-lg-12 col-md-12 col-sm-12 pVText">Please visit <a href="http://exam.maats.in"> exam.maats.in</a></h2>*/}
      // }




}

}