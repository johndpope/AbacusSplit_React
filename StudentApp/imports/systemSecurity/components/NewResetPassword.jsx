import React,{Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class NewResetPassword extends React.Component{
  constructor(){
    super();
    this.state ={
      "subscription" : {
        user             : Meteor.subscribe("userfunction"), 
      }
    }
  }
  'changepassword'(event) {
    event.preventDefault();
    var password        = this.refs.resetPassword.value;
    var passwordConfirm = this.refs.resetPasswordConfirm.value;
    // var newID = Session.get('newID');
    var newID = FlowRouter.getParam("id");
    if(newID){
      var resetPassword = newID;
    }else{
      var username = $('input[name="forgotEmail"]').val();
      var userOtp = Meteor.users.findOne({"username":username});
      if(userOtp){
        var resetPassword = userOtp._id;
      }
    }
    // console.log(resetPassword + password + passwordConfirm);

    //Check password is at least 6 chars long
    var isValidPassword = function(password, passwordConfirm) {
      if (password === passwordConfirm) {
        return password.length >= 6 ? true : swal({
          title: "Password should be at least 6 Characters Long",
          text: "Please try again",
          timer: 1700,
          showConfirmButton: false,
          type: "error"
        });
      }else{
        return swal({
          title: "Password doesn't Match",
          text: 'Please try Again',
          showConfirmButton: true,
          type: 'error'
        }); //End of error swal
      } //End of else
    }

    if (isValidPassword(password, passwordConfirm)) {
      Meteor.call("resetPasswordUsingotp", resetPassword, password, function(err) {
        if (err) {
          console.log('We are sorry but something went Wrong.');
        }else {
          Meteor.logout();
          // FlowRouter.go('/userlogin');
          // $('.resetModalClose').click();
          // $('#ResetBlock').hide();
          // $('#outerLoginWrapper').show();
          Meteor.logout();
          FlowRouter.go('/');
          swal("Password has been Changed Successfully!!");
        }
      });
    }
    return false;
  }

  render(){
    var winHeight = $(window).height();;
    var divHeight = winHeight/4.5+'px';
    var MyDivHeight = $('#divHeghtIN').height();
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpLeftWrap"  style={{"height": winHeight}}>
          {/*<img src="/images/signUpBanner.gif" className="signUpBanner col-lg-9 col-md-9"/>*/}
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 logoImg"/>
          {/*<div className="OESSubTitle2">Abacus Online Exam System</div>*/}
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
        <div className="col-lg-6 col-lg-offset-2 col-md-6 col-sm-12 signupPadding formbg1 signUpFormWrap resetPassWrap" style={{"height": winHeight}}>
              {/*<img src="/images/formbg.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formbg"/>*/}
          {/*<div className="col-lg-12">
            <div className="col-lg-12 col-md-12 OEXLogoWrap">
              <img src="/images/maatslogo.png" className="signUpBanner col-lg-offset-2 col-lg-8 col-md-8 col-md-offset-2"/>
            </div>
          </div>*/}
          {/*<div className="OESSubTitle2">Abacus Online Exam System</div>*/}
          <div className="divLoginInWrap col-lg-6 col-lg-offset-5">
          <h3 className="resetpwdNameTitle"> <span className="bordbt">RESET PASSWORD</span></h3>
          <div className="FormWrapper1 col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="resetPassword" onSubmit={this.changepassword.bind(this)}>
              <div className="form-group loginFormGroup pdleftclr veribtm col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-group">
                  
                  <input type="password" className="form-control loginInputs" ref="resetPassword" name="resetPassword" placeholder="New Password" aria-label="Password" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                  <span className="input-group-addon addons glyphi-custommm" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                </div>
              </div>
              <div className="form-group loginFormGroup pdleftclr veribtm col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-group">
                  
                  <input type="password" className="form-control loginInputs" ref="resetPasswordConfirm" name="resetPasswordConfirm" placeholder="Confirm New Password" aria-label="Confirm Password" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                  <span className="input-group-addon addons glyphi-custommm" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                </div>
              </div>
              <div className="submitButtonWrapper pdleftclr col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn UMloginbutton">Reset Password</button>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pdcls">
                <a href="/" className="UMGrey signInbtn col-lg-12 col-md-12 col-sm-12 col-xs-12">Sign In</a>   
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>
      
    );
  }
}