import React, { Component } from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class CompanySignUp extends TrackerReact(React.Component) {
  componentDidMount() {
    $("#signUpH2 ").css('marginTop','0px');  
  }
	showSignIn(event){
		event.preventDefault();
		$('#CompanySignUpWrapper').hide();
    $('#outerLoginWrapper').show();
    $('.modalContent').removeClass('addModalHeight');
	}
  showSignUp(event){
    event.preventDefault();
    $('#CompanySignUpWrapper').hide();
    $('#outerSignUpWrapper').show();
    // $('.modalContent').removeClass('addModalHeight');
  }
	// showOTP(event){
	// 	event.preventDefault();
 //    $('#outerSignUpWrapper').hide();
 //    $('#OtpBlock').show();
 //    $('.modalContent').removeClass('addModalHeight');
	// }
  usersignup(event){
    event.preventDefault();
    if ($('input.checkbox_check').is(':checked')) {
      var formValues = {
        'name'             : this.refs.name.value,
        'signupEmail'      : this.refs.signupEmail.value,
        'mobNumber'        : this.refs.mobNumber.value,
        'signupPassword'   : this.refs.signupPassword.value,
      }   
      
      var passwordVar              = this.refs.signupPassword.value;
      var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;
      var mobileNo                 = this.refs.mobNumber.value;

      // console.log("formValues: ",formValues);

      //Check password is at least 6 chars long
      var isValidPassword = function(passwordVar, signupConfirmPasswordVar) {
        if (passwordVar === signupConfirmPasswordVar) {
          return passwordVar.length >= 6 ? true : swal({
              title : "password should be at least 6 characters long",
              text  : "Please try again or create an account",
              // timer: 1700,
              showConfirmButton: true,
              type  : "error"
          });
        } else {
          return swal({
            title  : "Passwords doesn't match",
            text   : 'Please try again',
            showConfirmButton: true,
            type   : 'error'
          }); //End of error swal
        } //End of else
      }

      if (isValidPassword(passwordVar, signupConfirmPasswordVar)) {
        Meteor.call('companyCreateAccount', formValues ,(error,result) => {
          if(error){
            swal(error.reason);
          }else{      
            // CLEAR ALL FIELDS
            // this.refs.name.value                  = '';
            // this.refs.signupEmail.value           = '';
            // this.refs.mobNumber.value             = '';
            // this.refs.signupPassword.value        = '';   
            // this.refs.signupConfirmPassword.value = '';  

            // var basicformValues = {
            //   "firstName"       : this.refs.firstname.value,
            //   "fatherFirstName" : '',
            //   "fatherLastName"  : '',
            //   "motherFirstName" : '',
            //   "motherLastName"  : '',
            //   "spouseFirstName" : '',
            //   "spouseLastName"  : '',
            //   "gender"          : 'female',
            //   "dateOfBirth"     : '',
            //   "mobileNo"        : this.refs.mobNumber.value,
            //   "altMobileNo"     : '',
            //   "emailId"         : this.refs.signupEmail.value,
            //   "altEmailId"      : '',
            // }
            // var proofDocumentLink = '';
            // Meteor.call("insertBasicData", basicformValues,proofDocumentLink, function(error,result){
            //   if(error){
            //     console.log(error.reason);
            //   }else{
            //     Meteor.logout();
            //   }
            // });
        
            var mobile = mobileNo;
            var mobileotp = Math.floor(1000 + Math.random() * 9000);
            var emailotp = Math.floor(100000 + Math.random() * 900000);
            Session.set('mobotp',mobileotp);
            Session.set('mailotp',emailotp);

            // ADD USER ROLE 
            var newID = result;
            Session.set('newID',newID);
            
            Meteor.call('addOTP', newID , mobileotp, emailotp, function(error,result){
              if(error){
                Bert.alert(error);
              }else{

              }
            });

            var Role  = "user";
            Meteor.call('addRoles', newID , Role, function(error,result){
              if(error){
                Bert.alert(error);
              }else{
                                    
              }
            }); // add role

            //Send OTP  
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
            
            $('.modalContent').removeClass('addModalHeight');
            $('#CompanySignUpWrapper').hide();
            $('#OtpBlock').show();
          } //end else
        });
      }
    }else{
      swal({
        title: "Terms and Conditions!",
        text: "Please accept terms and conditions!",
        // timer: 1700,
        showConfirmButton: true,
        type: "error"
      });
    }
    return 0;   
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

	render() {
    return (
    	<div>
    	  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerSignUpWrapper" id="CompanySignUpWrapper" >
          <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
            <img src="../images/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/>
            <h2 id="signUpH2">Company SignUp</h2>
          </div>
          <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="signUpUsers" onSubmit={this.usersignup.bind(this)}>
              <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-user" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" ref="name" name="name" onBlur={this.inputEffect.bind(this)} aria-label="First Name" aria-describedby="basic-addon1" pattern="[a-zA-Z][a-zA-Z ]+" title="Only alphabets are allowed!" required/>
                  <label>Company Name</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                  <input type="email" className="effect-21 form-control loginInputs" ref="signupEmail" name="signupEmail" onBlur={this.inputEffect.bind(this)} aria-label="Email Id" aria-describedby="basic-addon1" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" title="Please add '.' and enter only 2 or 3 characters following '.'!" required/>
                  <label>Email Id</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                  <input type="text" className="effect-21 form-control loginInputs" ref="mobNumber" name="mobNumber" onBlur={this.inputEffect.bind(this)} aria-label="Mobile No" aria-describedby="basic-addon1" pattern="^(7|8|9)\d{9}$" title="Please enter 10 digit valid mobile number!" required/>
                  <label>Mobile No</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div> 
              <div className="form-group col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                  <input type="password" className="effect-21 form-control loginInputs" ref="signupPassword" name="signupPassword" onBlur={this.inputEffect.bind(this)} aria-label="Username" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                  <label>Password</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-6 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                  <input type="password" className="effect-21 form-control loginInputs" ref="signupConfirmPassword" name="signupConfirmPassword" onBlur={this.inputEffect.bind(this)} aria-label="Confirm Password" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                  <label>Confirm Password</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>   

             <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
               <input type="checkbox" name="" value="" className="checkbox_check" /> I agree to the <a className="signTerms" target="_blank" href="/termsandcondition">terms and conditions</a>
             </div>
             <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
               <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn" data-toggle="modal" data-target="#Hello">Sign Up</button>  
             </div>
            </form>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="text-left col-lg-6 col-md-6 col-sm-6 col-xs-6 nopadLeft bottomLiksOuter">
                {/*<a href="#" className="bottomLinks" onClick={this.showOTP.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i> Sign In</a>*/}
                <a href="#" className="bottomLinks" onClick={this.showSignIn.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i> Sign In</a>
              </div>
              <div className="text-left nopadRight col-lg-6 col-md-6 col-sm-6 col-xs-6 nopadLeft bottomLiksOuter">
                <a href="#" className="pull-right bottomLinks" onClick={this.showSignUp.bind(this)}>Sign Up</a>
              </div>
            </div>
          </div>
        </div>
    	</div>
    );
  }
}
