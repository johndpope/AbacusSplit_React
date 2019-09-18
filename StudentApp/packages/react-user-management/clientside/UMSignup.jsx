import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMSignup extends TrackerReact(Component) {

	usersignup(event){
		event.preventDefault();

        var formValues = {
                          'fullname'         : this.refs.fullname.value,
                          'signupEmail'      : this.refs.signupEmail.value,
                          'mobNumber'        : this.refs.mobNumber.value,
                          'signupPassword'   : this.refs.signupPassword.value,
                        }   

        Meteor.call('userSignUp', formValues ,(error,result) => {
          if(error){
            Bert.alert(error.reason);
          }else{               
            this.refs.fullname.value       = '';
            this.refs.signupEmail.value    = '';
            this.refs.mobNumber.value      = '';
            this.refs.signupPassword.value = '';           
            Meteor.logout();
            var newID = result;
            var Role  = 'Member';

            Meteor.call('addRoles', newID , Role, function(error,result){
              if(error){
                Bert.alert(error);
              }
            }); // add role


             Meteor.call('sendVerificationLink', newID, function(error,result){
                if(error){
                  Bert.alert(error);
                }else{                        
                  Bert.alert("Check your email for verification");
                } //end else
             }); // send verification mail ends

          } //end else
        });

    return false;  	

	}

	render() {

       return (
			<div className="loginwrapper col-lg-12 col-sm-12 col-xs-12 col-md-12">
				<div className="col-lg-2"></div>
			    <div className="UMsignup col-lg-12 col-md-12 col-sm-12 col-xs-12">
				  <form>
					  <div className="signup col-lg-12 col-md-8 col-sm-12 col-xs-12">

				    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					    	<h5 className="signupTitle UMuppercase col-lg-12">Sign Up</h5>
				    	</div>

					   <div className="form-group col-lg-12 col-md-4 col-xs-12 col-sm-12 ">
						   <div className="input-group">
							   <input type="text" className="form-control UMname" ref="fullname"name="fullname" placeholder="Full Name" pattern="[A-Za-z]+" required />
							   <span className="input-group-addon glyphi-custom"><i className="fa fa-user" aria-hidden="true"></i></span>
						   </div>
					    </div>

				   		<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
						   <div className="input-group">
							   <input type="email" className="form-control signupsetting UMname " ref="signupEmail" name="signupEmail" placeholder="Email" required />
							   <span className="input-group-addon glyphi-custom"><i className="fa fa-envelope" aria-hidden="true"></i></span>
						   </div>
					    </div>

				   		<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
						   <div className="input-group">
							   <input type="number" className="form-control UMname" ref="mobNumber" name="mobNumber" placeholder="Mobile Number" required />
							   <span className="input-group-addon glyphi-custom"><i className="fa fa-mobile" aria-hidden="true"></i></span>
						   </div>
					    </div>


				   		<div className="form-group col-lg-12 col-md-4 col-xs-12 col-sm-12 ">
						   <div className="input-group">
							   <input type="password" className="form-control UMname" ref="signupPassword" name="signupPassword" placeholder="Password" required />
							   <span className="input-group-addon glyphi-custom"><i className="fa fa-unlock" aria-hidden="true"></i></span>
						   </div>
					    </div>


						<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
					    	<button onClick={this.usersignup.bind(this)} className="col-lg-12 col-md-4 col-xs-12 col-sm-12  col-xs-12 UMloginbutton hvr-sweep-to-right" type="submit" value="Register"> Sign Up &nbsp; 
					    	<span><i className="fa fa-rocket" aria-hidden="true"></i></span> 
					    	</button>
					   </div>		   

				    	<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 col-lg-offset-2 col-md-offset-2 col-sm-offset-2 col-xs-12">
					    	<span className="lableTitle">Already have an account!</span>
					    	<a href="/UMLogin" className="UMred UMright"> Login here</a> 	
				    	</div>

					  </div> 
				  </form>
		  		</div>
		 	 </div>	
	    );

	} 

}