import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class ResetPassword extends TrackerReact(React.Component){
  constructor(){
    super();
    this.state ={
      "subscription" : { 
        user             : Meteor.subscribe("userfunction"),  
      }
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }
  componentDidMount() {
    $("#resetPassword").validate();
  }
  'changepassword'(event) {
    event.preventDefault();
    var password        = this.refs.resetPassword.value;
    var passwordConfirm = this.refs.resetPasswordConfirm.value;
    var newID = Session.get('newID');
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
          title: "Password should be at least 6 characters long",
          text: "Please try again",
          timer: 1700,
          showConfirmButton: false,
          type: "error"
        });
      }else{
        return swal({
          title: "Password doesn't match",
          text: 'Please try again',
          showConfirmButton: true,
          type: 'error'
        }); //End of error swal
      } //End of else
    }

    if (isValidPassword(password, passwordConfirm)) { 
      Meteor.call("resetPasswordUsingotp", resetPassword, password, function(err) {
        if (err) {
          console.log('We are sorry but something went wrong.');
        }else {
          Meteor.logout();
          // FlowRouter.go('/userlogin');
          $('#ResetBlock').hide();
          $('#outerLoginWrapper').show();
          swal("Password has been changed successfully!!");
        }
      });
    }
    return false;
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
      <div className="" id="ResetBlock">
        <div className="row">
          <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
            <img src="../images/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/> 
            <h2>Reset Password</h2>
          </div>
          <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <form id="resetPassword" onSubmit={this.changepassword.bind(this)}>
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                  <input type="password" className="effect-21 form-control loginInputs" ref="resetPassword" onBlur={this.inputEffect.bind(this)} name="resetPassword" aria-label="Password" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                  <label>Password</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div> 
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="input-effect input-group">
                  <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-lock" aria-hidden="true"></i></span>
                  <input type="password" className="effect-21 form-control loginInputs" ref="resetPasswordConfirm" onBlur={this.inputEffect.bind(this)} name="resetPasswordConfirm" aria-label="Confirm Password" aria-describedby="basic-addon1" title="Password should be at least 6 characters long!" pattern=".{6,}" required/>
                  <label>Confirm Password</label>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div> 
              <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
