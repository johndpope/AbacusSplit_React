import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class ResetPassword extends TrackerReact(Component) {

	  'changepassword'(event) {
	    event.preventDefault();

	    var resetPassword = FlowRouter.getParam('token');

	    var password        = this.refs.resetPasswordPassword.value;
	    var passwordConfirm = this.refs.resetPasswordPasswordConfirm.value;
	    console.log(resetPassword + password + passwordConfirm);

	    //Check password is at least 6 chars long
	    var isValidPassword = function(password, passwordConfirm) {
	       if (password === passwordConfirm) {
	         return password.length >= 6 ? true : swal({
												            title: "password should be at least 6 characters long",
												            text: "Please try again",
												            timer: 1700,
												            showConfirmButton: false,
												            type: "error"
												        });
	       }else{
	         return swal({
	            title: 'Passwords dont match',
	            text: 'Please try again',
	            showConfirmButton: true,
	            type: 'error'
	         }); //End of error swal
	       } //End of else
	     }

	   if (isValidPassword(password, passwordConfirm)) { 

	      Accounts.resetPassword(resetPassword, password, function(err) {
	        if (err) {
	          console.log('We are sorry but something went wrong.');
	        } else {
	          Meteor.logout();
	          Bert.alert( "Your password has been changed successfully. Welcome back!", 'success', 'growl-top-right' );
	          Session.set('resetPassword', null);
	          FlowRouter.go('/UMLogin');
	        }
	      });

	    }

	    return false;
	  }


	'checkForResetToken'(event){
	  console.log('in checkForResetToken');
	  if (Accounts._resetPasswordToken) {
	    Session.set('resetPassword', Accounts._resetPasswordToken);
	  }	
	}

   resetPassword(){
    var resetPassword = FlowRouter.getParam('token');
    return resetPassword;
   }

	render() {
	   let loginToken = this.resetPassword();
	   if(loginToken)
		       return (
					    <form action="/reset-password"  id="resetPasswordForm" method="post" className="resetpasswordWrapper col-lg-12 col-md-12 col-xs-12 col-sm-12">
					    	{ this.resetPassword() }
					    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 resetPassTitle">Reset Your Password</div>
					        <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
							   <div className="input-group">
								   <input type="password" className="form-control UMname" ref="resetPasswordPassword" name="password" id="resetPasswordPassword" placeholder="Password" required/>
								   <span className="input-group-addon glyphi-custom"><i className="fa fa-unlock" aria-hidden="true"></i></span>
							   </div>
						    </div>

						    <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
							   <div className="input-group">
								   <input type="password" className="form-control UMname" ref="resetPasswordPasswordConfirm" name="password" id="resetPasswordPasswordConfirm" placeholder="Confirm password" required/>
								   <span className="input-group-addon glyphi-custom"><i className="fa fa-unlock" aria-hidden="true"></i></span>
							   </div>
						    </div>

					       <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
						    	<button onClick={this.changepassword.bind(this)} className="col-lg-12 col-md-4 col-xs-12 col-sm-12  col-xs-12 btn-submit resetpassBtn UMloginbutton hvr-sweep-to-right" type="submit" value="Reset Password"> Reset Password &nbsp; 
						    	<span><i className="fa fa-rocket" aria-hidden="true"></i></span> 
						    	</button>
				   			</div>	
					    </form>	
			    );
	   	else{
	   		return (<span>No Login Token!</span>);
	   	}


	} 

}