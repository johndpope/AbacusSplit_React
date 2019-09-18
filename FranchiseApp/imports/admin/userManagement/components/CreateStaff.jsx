
// import React, { Component } from 'react';
// import { render } from 'react-dom';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

// import InputMask from 'react-input-mask';
// export default class CreateStaff extends TrackerReact(Component) {

// 	componentDidMount() {
// 		if ( !$('body').hasClass('adminLte')) {
// 		  var adminLte = document.createElement("script");
// 		  adminLte.type="text/javascript";
// 		  adminLte.src = "/js/adminLte.js";
// 		  $("body").append(adminLte);
// 		}
// 		// if(!$("link[href='/css/dashboard.css']").length > 0){
// 		//   var dashboardCss = document.createElement("link");
// 		//   dashboardCss.type="text/css";
// 		//   dashboardCss.rel ="stylesheet";
// 		//   dashboardCss.href="/css/dashboard.css";
// 		//   $('head').append(dashboardCss);
// 		// }	
//  	}
 	
//  	componentWillUnmount(){
//     	$("script[src='/js/adminLte.js']").remove();
//     	$("link[href='/css/dashboard.css']").remove();
//   	}

// 	createStaff(event){
// 		event.preventDefault();

//         var formValues = {
//                           'firstname'        : this.refs.firstname.value,
//                           'lastname'         : this.refs.lastname.value,
//                           'signupEmail'      : this.refs.signupEmail.value,
//                           'mobNumber'        : this.refs.mobNumber.value,
//                           'signupPassword'   : "user123",
//                         }   


//         Meteor.call('userCreateAccountStaffByFranchise', formValues ,(error,result) => {
//           if(error){
//             // swal(error.reason);
//             swal("Email Id already exist","","warning");
//           }else{      

//           	// CLEAR ALL FIELDS
//             this.refs.firstname.value      = '';
//             this.refs.lastname.value       = '';
//             this.refs.signupEmail.value    = '';
//             $('#mobNumberUser').val('');


//             // ADD USER ROLE 
//             var newID = result;
//             Meteor.call('addRoles', newID , "Staff", function(error,result){
//               if(error){
//                 swal(error);
//               }else{              	
// 				swal('Congratulations!! Account Created...',"","success");
//               }
//             }); // add role
		            
//           } //end else
//         });

//     return 0;  	

// 	}

// 	 // componentDidMount() {
// 	 // 	$("#signUpUser").validate();
// 	 // 	renderFunction();
// 	 // 	$("html,body").scrollTop(0); 
// 	 // }


// 	render() {

//        return (
//        		<div>
// 		        {/* Content Wrapper. Contains page content */}
// 		        <div className="content-wrapper">
// 		          {/* Content Header (Page header) */}
// 		          <section className="content-header">
// 		            <h1> User Staff</h1>
// 		          </section>
// 		          {/* Main content */}
// 		          <section className="content viewContent">
// 		            <div className="row">
// 		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
// 		                <div className="box">
		                 
// 		                  <div className="box-header with-border boxMinHeight">
// 		                  	<div className="box-header with-border">
// 				            	<h3 className="box-title">Add New Staff</h3>
// 				            </div>
// 					       	<section className="NotificationContent">
					        
					             
					              
					           
// 						            <div className="box-body">
// 										<div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 createUserWrapp">
// 										  <form id="signUpUser" onSubmit={this.createStaff.bind(this)}>
// 											  <div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12">

// 											   <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
// 											   		<span className="blocking-span">
// 													   	<input type="text" title="Only alphabets are allowed!" className="form-control UMname inputText tmsUserAccForm" ref="firstname" name="firstname" pattern="[a-zA-Z][a-zA-Z ]+" required />
// 											   			<span className="floating-label">First Name</span>
// 													</span>
// 											    </div>

// 											   <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
// 											   		<span className="blocking-span">
// 													   <input type="text" title="Please enter alphabets only!" className="form-control UMname inputText tmsUserAccForm" ref="lastname" name="lastname" pattern="[A-Za-z]+" required />
// 											    	   <span className="floating-label">Last Name</span>
// 													</span>
// 											    </div>

// 										   		<div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
// 										   			<span className="blocking-span">
// 													   <input type="email" title="Please match email format!" className="form-control signupsetting UMname inputText tmsUserAccForm" ref="signupEmail" name="signupEmail" required />
// 											    	   <span className="floating-label">Email ID</span>
// 													</span>
// 											    </div>

// 										   		<div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
// 										   			<span className="blocking-span">
// 													   <InputMask mask="9999-999-999" maskChar=" " pattern="^(0|[1-9][0-9-]*)$" title="Please enter numbers only!" className="form-control UMname inputText tmsUserAccForm" ref="mobNumber" name="mobNumber" id="mobNumberUser" required />
// 													   <span className="floating-label">Mobile Number</span>
// 													</span>
// 											    </div>

// 												<div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
// 											    	<input className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right nextForm" type="submit" value="REGISTER"/>
// 											   </div>	

// 											  </div> 
// 										  </form>
// 								 	 	</div>	
// 								 	</div>
							 	
// 						  </section>
// 						</div>
// 					  </div>
// 					</div>
// 				  </div>
// 				</section>
// 			  </div>
// 			</div>
// 	    );

// 	} 

// }
