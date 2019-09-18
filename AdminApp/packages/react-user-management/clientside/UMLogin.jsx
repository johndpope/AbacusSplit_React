import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import UMForgotPassword from './UMForgotPassword.jsx';

export default class UMLogin extends TrackerReact(Component){

	userlogin(event){
		event.preventDefault();

		var email       = this.refs.loginusername.value;
		var passwordVar = this.refs.loginPassword.value;  

	    Meteor.call('checkEmailVerification', email, function(error,data){
	      if (data == "verified"){

	        Meteor.call('checkBlockedUser', email, function(error,data){
	          if (data == "Active"){

	            Meteor.loginWithPassword(email, passwordVar, function(error) {
	                    if (error) {
	                        return swal({
	                            title: "Email or password Incorrect",
	                            text: "Please try again or create an account",
	                            timer: 1700,
	                            showConfirmButton: false,
	                            type: "error"
	                        });
	                    } else {
	                        Bert.alert("Login Successful!");
	                        var loggedInUser = Meteor.userId();
			                var user = Meteor.users.findOne({'_id' : loggedInUser });
			                if(user){
		                        if (Roles.userIsInRole(loggedInUser, ['admin','Staff'])) {
	                            	FlowRouter.go('/adminDashboard');
	                        	}else{
	                        		FlowRouter.go('/');
	                        	}
	                        }
                            

	                    }
	                });

	            }else if(data == "Blocked"){
	                Bert.alert("You're profile is blocked. Please contact Admin.");
	            }else{
	                Bert.alert("Either email or password is incorrect");
	            }
	          });
	      
	      }else if(data == "unverified"){
	          Bert.alert("Check your email for a verification link");
	      }else{
	          Bert.alert("Either email or password is incorrect");
	      }
	    });


    return false;	    	


	}


	render() {

       return (
				<div className="loginwrapper col-lg-12 col-sm-12 col-xs-12 col-md-12">
					<div className="col-lg-4"></div>
				    <div className="UMlogin col-lg-12 col-md-12 col-sm-12 col-xs-12">
				      <form id="login">
					    	<div className="col-lg-12">
						    	<h5 className="formTitle loginTitle UMuppercase col-lg-12">Log in</h5>
					    	</div>

						   <div className="form-group col-lg-12 col-md-4 col-xs-12 col-sm-12 ">
							   <div className="input-group">
								   <input type="text" className="form-control UMname" ref="loginusername" name="loginusername" placeholder="Email ID"/>
								   <span className="input-group-addon glyphi-custom"><i className="fa fa-user" aria-hidden="true"></i></span>
							   </div>
						    </div>

						   <div className="form-group col-lg-12 col-md-4 col-xs-12 col-sm-12 ">
							   	<div className="input-group">
								   	<input type="password" className="form-control UMname UMpass" ref="loginPassword" name="loginPassword" placeholder="Password"/>
								   	<span className="input-group-addon glyphi-custom"><i className="fa fa-lock" aria-hidden="true"></i></span>
							   	</div>
						    </div>
						    
						   <div className="form-group col-lg-12 col-md-4 col-xs-12 col-sm-12 ">
						    	<button onClick={this.userlogin.bind(this)} className="col-lg-12 col-md-4 col-xs-12 col-sm-12 UMloginbutton hvr-sweep-to-right" type="submit" value="Login">
						    	<span><i className="fa fa-key" aria-hidden="true"></i></span> Login
						    	</button>
						   </div>

			   				 <div className="col-lg-6 col-sm-6 col-xs-6 UMcreateacc"><a href="/UMSignup" className="UMred"> Create an account</a></div>
							<div className="col-lg-6 col-sm-6 col-xs-6 forgotpass" data-toggle="modal" data-target="#forgotpass">Forgot Password ?</div>



							<div id="forgotpass" className="modal fade" role="dialog">
							  <div className="modal-dialog">


							    <div className="modal-content col-lg-8">
							      <div className="modal-header forgetHeader">
							        <button type="button" className="close" data-dismiss="modal">&times;</button>
							        <h4 className="modal-title col-lg-12">Forgot Password</h4>
							        <div className="forgetpassDes col-lg-12">Enter your email address and we'll email you a link to reset your password.</div>
							      </div>
							      <div className="modal-body col-lg-12">
									   <UMForgotPassword/>
							      </div>
							      <div className="modal-footer">
							        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
							      </div>
							    </div>

							  </div>
							</div>

					    </form>
				    </div>
				</div>	
	    );

	} 

}