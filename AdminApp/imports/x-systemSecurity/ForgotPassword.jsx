import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class ForgotPassword extends TrackerReact(Component){
  constructor(){
    super();
    this.state ={
      "subscription" : { 
        user             : Meteor.subscribe("userfunction"),  
      }
    }
  }
  componentDidMount() {
    $("#forgotPassword").validate();
  }
  forgotpassword(event){
    event.preventDefault();
    var mobile = this.refs.forgotNumber.value;
    var email = this.refs.forgotEmail.value;
    // console.log("email: ",email);
    var userOtp = Meteor.users.findOne({"username":email});
    // console.log("userOtp: ",userOtp);
    
    if(userOtp){
      var mobileotp = Math.floor(1000 + Math.random() * 9000);
      var emailotp = Math.floor(100000 + Math.random() * 900000);
      Session.set('mobotp',mobileotp);
      Session.set('mailotp',emailotp);
      var newID = userOtp._id;
      Session.set('newID',newID);

      Meteor.call('addOTP', newID , mobileotp, emailotp, function(error,result){
        if(error){
          Bert.alert(error);
        }else{

        }
      });
     
      //Send OTP     
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
                            
      // SEND EMAIL VERIFICATION LINK
      Meteor.call('sendVerificationLinkToUser', newID, function(error,result){
        if(error){
          Bert.alert(error);
        }else{  
          // swal('Successfully sent the OTP to your email address.');                   
        } //end else
      }); // send verification mail ends
          
      $('.modalContent').removeClass('addModalHeight');
      $('#ForgotBlock').hide();
      $('#OtpBlock').show();
      $('#OTPMobMail').addClass('newPassword'); 
    }else{
      swal('Either email address or mobile number is incorrect');                   
    }
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
      <div className="">
        <div className="outerOTPWRapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
         {/*<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#OtpModal">Open OTP Modal</button>*/}

          {/*<div id="OtpModal" className="modal fade" role="dialog">
            <div className="modal-dialog">

              <div className="modal-content">
                <div className="modal-body text-center">*/}

                  <div className="row" id="ForgotBlock">
                    <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
                      <img src="../images/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/> 
                      <h2>Forgot Password</h2>
                    </div>
                    <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form id="forgotPassword" onSubmit={this.forgotpassword.bind(this)}>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                            <input type="email" className="effect-21 form-control loginInputs" ref="forgotEmail" name="forgotEmail" onBlur={this.inputEffect.bind(this)} aria-label="Email Id" aria-describedby="basic-addon1" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" title="Please add '.' and enter only 2 or 3 characters following '.'!" required/>
                            <label>Email Id</label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div> 
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                            <input type="text" className="effect-21 form-control loginInputs" ref="forgotNumber" name="forgotNumber" onBlur={this.inputEffect.bind(this)} aria-label="Mobile No" aria-describedby="basic-addon1" pattern="^(7|8|9)\d{9}$" title="Please enter 10 digit valid mobile number!" required/>
                            <label>Mobile No</label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div> 
                        <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                          <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn">Send OTP</button>
                        </div>
                      </form>
                    </div>
                  </div>

                {/*</div>
              </div>

            </div>
          </div>*/}
        </div>
      </div>
    );
  }
}
