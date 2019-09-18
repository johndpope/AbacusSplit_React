import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DoHaveProfile from './DoHaveProfile.jsx';
import ResetPassword from './ResetPassword.jsx';

export default class OTPModal extends React.Component{
  constructor(){
    super();
    this.state ={
      "subscription" : { 
        user             : Meteor.subscribe("userfunction"),  
      }
    }
  }
  componentDidMount() {
    $("#OTPMobMail").validate();
  }
  showWelcome(event){
    event.preventDefault();
    $('#OtpBlock').hide();
    $('#DoHaveProfile').show();
  }
  confirmOTP(event){
    event.preventDefault();   
    var sessionValue1 = Session.get('mobotp');
    var sessionValue2 = Session.get('mailotp');
    if(sessionValue1 && sessionValue2){
      var mobotp = sessionValue1;
      var mailotp = sessionValue2;
      var newID = Session.get('newID');
      // console.log("newID: ",newID);
      // console.log("mobotp: ",mobotp+" mailotp: ",mailotp);
    }else{
      var username = $('input[name="loginusername"]').val();
      var userOtp = Meteor.users.findOne({"username":username});
      if(userOtp){
        var mobotp = userOtp.profile.sentMobileOTP;
        var mailotp = userOtp.profile.sentEmailOTP;
        var usercode = userOtp.profile.userCode.split("").reverse().join("");
        var newID = userOtp._id;
      }
      // console.log("mobotp: ",mobotp+" mailotp: ",mailotp);
    }
    var emailotp = this.refs.emailotp.value;
    var mobileotp = this.refs.mobileotp.value;
    // console.log("mobotp: ",emailotp+" mailotp: ",mobileotp);

    if(mailotp == emailotp && mobotp == mobileotp){
      Meteor.call('createUserByAdminSetEmailToTrue',newID,
      function(error,result){
        if(error){
          console.log(error.reason,"danger","growl-top-right");
        }else{
          if($('#OTPMobMail').hasClass('newPassword')){
            
          }else{
            
            if($('input[name="signupEmail"]').val() != '' && $('input[name="signupPassword"]').val() != ''){
              var email = $('input[name="signupEmail"]').val();
              var passwordVar = $('input[name="signupPassword"]').val();
            }else{
              var email = username;
              var passwordVar = usercode;
            } 

            // console.log("email: ",email);
            // console.log("password: ",passwordVar);  

            Meteor.loginWithPassword(email, passwordVar, function(error) {
              if (error) {
                console.log('error: ',error);
              } else {
                // swal({
                //   title: "Congratulations!!!",
                //   text: "Account Created Successfully!",
                //   // timer: 1700,
                //   showConfirmButton: true,
                // });
              }
            }); 
          }   
        }
      });

      Meteor.call('updateOTP', newID , mobotp, mailotp , function(error,result){
        if(error){
          Bert.alert(error);
        }else{

        }
      });

      if($('#OTPMobMail').hasClass('newPassword')){
        $('#OtpBlock').hide();
        $('#ResetBlock').show();
        // console.log("mobotp: ",mobotp+" mailotp: ",mailotp);
      }else{
        $('#OtpBlock').hide();
        $('#DoHaveProfile').show();
        // console.log("Else");
      }    
    }else{
      swal('Either email OTP or mobile OTP is incorrect');
    }
  }
  resendOTP(event){
    event.preventDefault();
    var sessionValue = Session.get('newID');
    if(sessionValue){
      var newID = sessionValue;
      // console.log("newID: ",newID);
      var userData = Meteor.users.findOne({"_id":newID});
      if(userData){
        var mobile = userData.profile.mobNumber;
        var username = userData.username;   
      }
    }else{
      var username = $('input[name="loginusername"]').val();   
      // console.log("username: ",username);
      var userData = Meteor.users.findOne({"username":username});
      if(userData){
        var mobile = userData.profile.mobNumber;
        var newID = userData._id;
      }
    }
    Session.set('newID',newID);
    
    var mobileotp = Math.floor(1000 + Math.random() * 9000);
    var emailotp = Math.floor(100000 + Math.random() * 900000);
    Session.set('mobotp',mobileotp);
    Session.set('mailotp',emailotp);

    Meteor.call('addOTP', newID , mobileotp, emailotp, function(error,result){
      if(error){
        Bert.alert(error);
      }else{

      }
    });

    //Send Mobile OTP  
    if(mobile != ""){
      var mobileotpStr = mobileotp.toString();
      var smsBody = "Enter "+mobileotpStr+" to verify your account on ASSUREiD.";
      Meteor.call('SEND_SMS',mobile,smsBody,
      function(error,result){
        if(error){
          console.log(error.reason);
        }else{
          // console.log(result.content);
          // swal('Successfully sent the OTP to your mobile number');
        }
      }); 
    }else{
      swal('Your mobile number is not found. Please enter valid mobile number.');
    }    

    // SEND EMAIL VERIFICATION LINK
    Meteor.call('sendVerificationLinkToUser', newID, function(error,result){
      if(error){
        Bert.alert(error);
      }else{  
        // swal('Successfully sent the OTP to your email address.');                   
      } //end else
    }); // send verification mail ends
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

  render(){
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
        <div className="outerOTPWRapper col-lg-12 col-md-12 col-sm-12 col-xs-12" id="OtpBlock">
         {/*<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#OtpModal">Open OTP Modal</button>*/}

          {/*<div id="OtpModal" className="modal fade" role="dialog">
            <div className="modal-dialog">

              <div className="modal-content">
                <div className="modal-body text-center">*/}

                  <div className="row">
                     <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
                        <img src="../images/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/> 
                      </div>
                    <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12">
                      <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                        <span>We have sent you an OTP<br/>
                        to your registered email Id and mobile no.<br />
                        Enter your OTP below.</span>
                      </div>
                      <form id="OTPMobMail" onSubmit={this.confirmOTP.bind(this)}>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-key" aria-hidden="true"></i></span>
                            <input type="text" className="effect-21 form-control loginInputs" ref="emailotp" name="emailotp" onBlur={this.inputEffect.bind(this)} aria-describedby="basic-addon1" title="Please enter numbers only!" maxLength="6" pattern="^[0-9]*$" required/>
                            <label>6 digits OTP sent on email Id</label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-key" aria-hidden="true"></i></span>
                            <input type="text" className="effect-21 form-control loginInputs" ref="mobileotp" name="mobileotp" onBlur={this.inputEffect.bind(this)} aria-describedby="basic-addon1" title="Please enter numbers only!" maxLength="4" pattern="^[0-9]*$" required/>
                            <label>4 digits OTP sent on mobile no.</label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>  
                        <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                          {/*<button type="button" className="btn btn-info submitBtn col-lg-12 col-md-12 col-sm-12 col-xs-12" onClick={this.showWelcome.bind(this)}>Submit</button>*/}
                          <button type="submit" className="btn btn-info submitBtn col-lg-12 col-md-12 col-sm-12 col-xs-12">Submit</button>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <p className="pull-right resendOTP" onClick={this.resendOTP.bind(this)}><b>RESEND OTP</b></p>
                        </div>
                      </form>
                    </div>
                  </div>

                {/*</div>
              </div>

            </div>
          </div>*/}
        </div>
        <DoHaveProfile />
        <ResetPassword />
      </div>
    );
  }
}
