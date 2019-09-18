import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class CreateUser extends TrackerReact(Component) {

	createUser(event){
		event.preventDefault();

        var formValues = {
                          'firstname'        : this.refs.firstname.value,
                          'lastname'         : this.refs.lastname.value,
                          'signupEmail'      : this.refs.signupEmail.value,
                          'mobNumber'        : this.refs.mobNumber.value,
                          'signupPassword'   : "user123",
                        }   


        Meteor.call('userCreateAccount', formValues ,(error,result) => {
          if(error){ 
            swal(error.reason);
          }else{      

          	// CLEAR ALL FIELDS
            this.refs.firstname.value      = '';
            this.refs.lastname.value       = '';
            this.refs.signupEmail.value    = '';
            this.refs.mobNumber.value      = '';


            // ADD USER ROLE 
            var newID = result;
            Meteor.call('addRoles', newID , "user", function(error,result){
              if(error){
                swal(error);
              }else{              	
				swal('Congratulations!! Account Created...');
              }
            }); // add role
		            
          } //end else
        });

    return 0;  	

	}

	 componentDidMount() {
	 	// $("#signUpUser").validate();
	 	    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
	 }
   componentWillMount() {
    // if (!!!$("link[href='/css/dashboard.css']").length > 0) {
    //   var dashboardCss = document.createElement("link");
    //   dashboardCss.type = "text/css"; 
    //   dashboardCss.rel = "stylesheet";
    //   dashboardCss.href = "/css/dashboard.css"; 
    //   document.head.append(dashboardCss);
    // }
  }
   componentWillUnmount(){  
     $("script[src='/js/adminLte.js']").remove(); 
     // $("link[href='/css/dashboard.css']").remove(); 
   }


	render() {

       return (

       	<section className="content-wrapper">
        <div className="content">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="box box-primary">
              <div className="box-header with-border">
               <h2 className="box-title">CREATE USER</h2>
              </div>
           
	            <div className="box-body ">
								<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
								  <form id="signUpUser" onSubmit={this.createUser.bind(this)}>
									  <div className="signupBody col-lg-12 col-md-8 col-sm-12 col-xs-12">

									   <div className="form-group col-lg-6 col-md-4 col-xs-6 col-sm-6 inputContent">
									   		<span className="blocking-span">
									   		  <label className="floating-label">First Name</label>
											   	<input type="text" title="Only alphabets are allowed!" className="form-control inputText" ref="firstname" name="firstname" pattern="[a-zA-Z][a-zA-Z ]+" required />

											</span>
									    </div>

									   <div className="form-group col-lg-6 col-md-4 col-xs-6 col-sm-6 inputContent">
									   		<span className="blocking-span">
										   		 <label className="floating-label">Last Name</label>
												   <input type="text" title="Please enter alphabets only!" className="form-control inputText" ref="lastname" name="lastname" pattern="[A-Za-z]+" required />
												</span>
									    </div>

								   		<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
								   			<span className="blocking-span">
								   			  <label className="floating-label">Email ID</label>
											    <input type="email" title="Please match email format!" className="form-control signupsetting inputText" ref="signupEmail" name="signupEmail" required />
											</span>
									    </div>

								   		<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
								   			<span className="blocking-span">
								   			  <label className="floating-label">Phone Number</label>
											    <input type="text" pattern="^(0|[1-9][0-9]*)$" title="Please enter numbers only!" className="form-control inputText" ref="mobNumber" name="mobNumber" required />
											</span>
									    </div>

										<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
									    	<input className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right" type="submit" value="REGISTER"/>
									   </div>	

									  </div> 
								  </form>
						 	 	</div>	
				 	</div>
			 	</div>
			 </div>
		 </div>
		 </section>
	    );

	} 

}