import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class ResetPassword extends TrackerReact(Component) {

	  'changepassword'(event) {
	    event.preventDefault();

	    var resetPassword = FlowRouter.getParam("id");

	    var password        = this.refs.resetPasswordPassword.value;
	    var passwordConfirm = this.refs.resetPasswordPasswordConfirm.value;
	    console.log(resetPassword + password + passwordConfirm);

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
	            title: 'Passwords dont match',
	            text: 'Please try again',
	            showConfirmButton: true,
	            type: 'error'
	         }); //End of error swal
	       } //End of else
	     }

	   if (isValidPassword(password, passwordConfirm)) { 

	      Meteor.call("resetPasswordUsingotp",resetPassword, password, function(err) {
	        if (err) {
	          console.log('We are sorry but something went wrong.');
	        } else {
	          // Meteor.logout();
	          swal( "Password has been changed successfully",'', 'success');
	        }
	      });

	    }

	    return false;
	  }

	render() {
	 
       return (
       		<div>
	        {/* Content Wrapper. Contains page content */}
	        <div className="content-wrapper">
	          {/* Content Header (Page header) */}
	          <section className="content-header">
	            <h1>User Management</h1>
	          </section>
	          {/* Main content */}
	          <section className="content viewContent">
	            <div className="row">
	              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
	                <div className="box">
	                  <div className="box-header with-border boxMinHeight">
	                  	<div className="box-header with-border">
			            <h3 className="box-title">Change Password</h3>
			            </div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 onlineExamWrap">
							    <form onSubmit={this.changepassword.bind(this)} id="resetPasswordForm" method="post" className="resetpasswordWrapper col-lg-12 col-md-12 col-xs-12 col-sm-12">
							    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 resetPassTitle"></div>
							        <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
									   <div className="input-group">
										   <input type="password" className="form-control UMname" ref="resetPasswordPassword" name="password" id="resetPasswordPassword" placeholder="New Password" required/>
										   <span className="input-group-addon glyphi-custom"><i className="fa fa-unlock" aria-hidden="true"></i></span>
									   </div>
								    </div>

								    <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
									   <div className="input-group">
										   <input type="password" className="form-control UMname" ref="resetPasswordPasswordConfirm" name="password" id="resetPasswordPasswordConfirm" placeholder="Confirm New password" required/>
										   <span className="input-group-addon glyphi-custom"><i className="fa fa-unlock" aria-hidden="true"></i></span>
									   </div>
								    </div>

							       <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
								    	<button  className="col-lg-12 col-md-4 col-xs-12 col-sm-12  col-xs-12 btn-submit resetpassBtn UMloginbutton hvr-sweep-to-right" type="submit" value="Change Password"> Change Password &nbsp; 
								    	<span><i className="fa fa-rocket" aria-hidden="true"></i></span> 
								    	</button>
						   			</div>	
							    </form>
							</div>
						</div>
					  </div>
				    </div>
			      </div>
			    </div>
			  </section>
			</div>
			</div>
	    );



	} 

}