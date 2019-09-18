import React,{Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import {Session} from 'meteor/session';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class ConfirmOtpModal extends Component{
  constructor(props){
    super(props);
    this.state ={
      "subscription" : {
        user             : Meteor.subscribe("userfunction"), 
      }
    }
  }
  confirmOTP(event){
    console.log('confirm otp');
    event.preventDefault();
    var checkUserExist = FlowRouter.getParam("mailId");
    var userData = Meteor.users.findOne({"_id":checkUserExist});
    if(userData){
      var userProfile = userData.profile;    
      var roles = userData.roles;

      if(userProfile){
        var sessionValue2 = userProfile.sentEmailOTP;

      }
    }

    if(sessionValue2){
      
      var mailotp = sessionValue2;
      var newID = userData._id;
      var userData = Meteor.users.findOne({"_id":newID});
      if(userData){

        var userEmail = userData.username;
        var profile = userData.profile;
        if(profile){
          if(profile.userCode){
          var password = profile.userCode.split("").reverse().join(""); 
          }
        }
      }
    }else{

      var username = $('input[name="loginusername"]').val();
      var userOtp = Meteor.users.findOne({"username":username});
      if(userOtp){
        var mailotp = userOtp.profile.sentEmailOTP;
        if(userOtp.profile.userCode){
          var usercode = userOtp.profile.userCode.split("").reverse().join("");
          var newID = userOtp._id;

        }
      }
    }
    var emailotp = this.refs.emailotp.value;
    if(mailotp == emailotp){
      Meteor.call('createUserByAdminSetEmailToTrue',newID,
      function(error,result){
        if(error){
          // console.log(error.reason,"danger","growl-top-right");
        }else{
          if($('#OTPMobMail').hasClass('newPassword')){
           
          }else{
           
            if(userEmail && password){
              var email = userEmail;
              var passwordVar = password;
            }else{
              var email = username;
              var passwordVar = usercode;
            }
          }  
        }
      });

      Meteor.call('updateOTP', newID , mailotp ,roles, function(error,result){
        if(error){
          swal("error");
        }else{
          var curUrl = location.pathname;
          var urlArray = curUrl.split('/');
          var isFirstOTPurl = urlArray[1];
          if(isFirstOTPurl != 'otpFirstVarification'){
          FlowRouter.go('/resetPassword/'+newID);
          }else{
            
               Meteor.logout();
               swal("OTP Verified Successfully",
                    // 'Please complete your registration process by completing your profile after login. ',
                    'To continue filling registration form please contact admin first to make your account active.',
                  'success');
                  FlowRouter.go('/');
             
          }
        }
      });
    }else{
      swal('OTP is Incorrect',
            '',
            'warning');
    }
  // $('#assureIDModal').show();
  }



  inputEffect(event){
    event.preventDefault();
    // alert('hi');
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      $(event.target).removeClass("has-content");
    }
  }

  resendOtp(event){
    event.preventDefault();
    var element = document.getElementById("resendOtpBtn");
    element.classList.add("btn-success");
    element.classList.remove("resendOtpColor");
    var checkUserExist = FlowRouter.getParam("mailId");
    var userData = Meteor.users.findOne({"_id":checkUserExist});
    if(userData){
      var userProfile = userData.profile;    
      if(userProfile){
        var sessionValue2 = userProfile.sentEmailOTP;
        var mobNumber = userProfile.mobNumber;
        var firstName  = userProfile.firstname;

      }
       var emailotp = Math.floor(100000 + Math.random() * 900000);

      Meteor.call('addOTP', userData._id, emailotp, function(error,result){
        if(error){
          console.log(error);
        }else{

          Meteor.call("sendSMSMsg",firstName,mobNumber,emailotp,(error,result)=>{
            if(error){

            }else{
              swal("We have sent OTP to your registered mobile number","","success");
                 $("input[name=emailotp]").val('');   
              element.classList.add("resendOtpColor");
              element.classList.remove("btn-success");
            }
          });
        }
      });
    }else{
      swal("You are not registered","","warning");
    }

  }

  render(){
    if(location.pathname=='/forgotOTPVarification/'+FlowRouter.getParam("mailId")){
       var mobileEmail = 'Email Id';
       // var resendOtp ='';
    }else{
      var resendOtpWrap = "resendOtpWrap resendOtpWrapcss";
       var mobileEmail = 'Mobile Number';
       var resendOtp = <span onClick={this.resendOtp.bind(this)}>Resend OTP</span>;
    }
    var winHeight = $(window).height();;
    var divHeight = winHeight/4.5+'px';
    var MyDivHeight = $('#divHeghtIN').height();
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpLeftWrap" style={{"height": winHeight}}>
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
        <div className="col-lg-6 col-lg-offset-2 col-md-6 col-sm-12 formbg1 confirmModalFormWrap" style={{"height": winHeight}}>
          
          {/*<div className="col-lg-12">
            <div className="col-lg-12 col-md-12 OEXLogoWrap">
              <img src="/images/maatslogo.png" className="signUpBanner col-lg-offset-2 col-lg-8 col-md-8 col-md-offset-2"/>
            </div>
          </div>*/}
          {/*<div className="OESSubTitle2 OESSubTitleee">Abacus Online Exam System</div>*/}
            <div className="divLoginInWrap col-lg-6 col-lg-offset-5">

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" className="firstverification">
                <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                  <span>We have sent you a Verification Code to your registered <b>{mobileEmail}</b>.<br/>
                  Enter six digit verification code below.</span>
                </div>
                <form id="OTPMobMail" onSubmit={this.confirmOTP.bind(this)}>
                  <div className="col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 veriemail">

                    <div className="input-effect input-group veribtm">
                  
                      <input type="text" className="effect-21 form-control loginInputs " ref="emailotp" name="emailotp"  onBlur={this.inputEffect.bind(this)} aria-describedby="basic-addon1" title="Please enter numbers only!" maxLength="6" pattern="^[0-9]*$" required/>
                       <span className="input-group-addon glyphi-custommm"><i className="fa fa-key" aria-hidden="true"></i></span>
                      <span className="focus-border">
                        <i></i>
                      </span>
                    </div>
                  </div>
                  <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 veriemail">
                    <button type="submit" className="btn btn-info submitBtn col-lg-12 col-md-12 col-sm-12 col-xs-12 UMloginbutton">Submit</button>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pdcls">
                    <a href="/" className="UMGrey signInbtn veriemailmr veriemail col-lg-12">Sign In</a>  
                  </div>
                   <div id="resendOtpBtn" className={"col-lg-4 col-md-4 col-sm-4 col-xs-4 resendOtpColor "+resendOtpWrap}>
                    {resendOtp}
                   </div>
                </form>
                </div>
              </div>
          </div>
      </div>
    );
  }
}