import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMForgotPassword extends TrackerReact(Component) {

	  'sendForgotPasswordEmail'(e) {
	    e.preventDefault();


	    var email , trimInput ;

	    var emailVar = this.refs.email.value;
	    // console.log(emailVar);
	    
	    trimInput = function(val) {
	      return val.replace(/^\s*|\s*$/g, "");
	    }

	        emailtrim = trimInput(emailVar);
	        email = emailtrim.toLowerCase();


	      Accounts.forgotPassword({email: email}, function(err) {
	        if (err) {
	          if (err.message === 'User not found [403]') {
	            Bert.alert('This email does not exist.');
	          } else {
	            Bert.alert('We are sorry but something went wrong.');
	          }
	        } else {
	          console.log('Email Sent. Check your mailbox.');
	          Bert.alert( "Instructions sent! We've sent an email with instructions on how to reset your password.If you don't receive an email within a few minutes, check your spam and junk folders.", 'success', 'growl-top-right' );

	        }
	      });
	        
	    return false;
	  }

	render() {

       return (
				<div className="container-fluid">
					<form onSubmit={this.sendForgotPasswordEmail.bind(this)} id="forgotPasswordForm">
					  <input id="forgotPasswordEmail" type="text" ref="email" name="email" placeholder="Email Address" className="col-lg-12 form-control forgotEmail"/>
					  <input className="btn-submit btn-danger col-lg-12 form-control" type="submit" value="Send Instructions"  />
					</form>
				</div>	
	    );

	} 

}