
import React, { Component } from 'react';
import { render } from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import ConfirmOtpModal from './ConfirmOtpModal.jsx';
import NewForgotPassword from './NewForgotPassword.jsx';
import NewResetPassword from './NewResetPassword.jsx';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


export default class UMLogin extends Component{
	constructor(props){
		super(props);
		this.state={
			'showLoginBrn' : true,
			'defaultLoginBtnTime': '02:00',
			loginusername:"",
        	loginPassword:"",	
			'subscription':{
				 studData : Meteor.subscribe('singleStudent',Meteor.userId()),
			}
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }


	userlogin(event){
		event.preventDefault();
		// alert("working");
		this.setState({
			showLoginBrn : false,
		});
		var email       = this.refs.loginusername.value;
		var passwordVar = this.refs.loginPassword.value;  

	    Meteor.call('checkEmailVerification', email, function(error,data){
	      if (data == "verified"){
	      	// alert('verified');
	        Meteor.call('checkBlockedUser', email, function(error,data){
	          if (data == "Active"){
	          	// alert('active');
	            Meteor.loginWithPassword(email, passwordVar, function(error) {
	            	// alert('in login loginWithPassword');
	                    if (error) {
	                        // return 
	                        	swal("Either Email or Password is Incorrect","","warning");
	                        // swal({
	                        //     title: "Email or password Incorrect",
	                        //     text: "Please try again or create an account",
	                        //     timer: 1700,
	                        //     showConfirmButton: false,
	                        //     type: "error"
	                        // });
	                    } else {
	                    	if(Roles.userIsInRole(Meteor.userId(), ['Student'])) {
								var studentData    = StudentMaster.findOne({"studentId":Meteor.userId()});
								if(studentData){
									FlowRouter.go('/Student/Profiles');
								}else{
									FlowRouter.go('/Student/Profiles');
								}
	                    		
	                    	}else if(Roles.userIsInRole(Meteor.userId(), ['admin','superAdmin'])) {
	                    		FlowRouter.go('/adminDashboard');

	                    		
	                    	}else if (Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
    								// console.log("Meteor.userId()==>>",Meteor.userId());
								if(Meteor.user().profile.companyId == ''  ){
									console.log("Meteor.userId()",Meteor.userId());
									FlowRouter.go('/initial-company-setting');

								}else{
									

										FlowRouter.go('/franchiseDashboard');	
								}
							}
	                    }
	                });

	            }else if(data == "Blocked"){
	                swal("You're profile is Blocked. Please Contact Admin.");
	            }else{
	                swal("Either Email or Password is Incorrect");
	            }
	          });
	      
	      }else if(data == "unverified"){
	          swal({title:"Check your Email for a Verification Link",	        
	      		});	 
	      }else{
	          	swal("Either Email or Password is Incorrect");
	      }
	    });


    return false;	    	


	}
	sendForgotPasswordOTP(event){
	 	event.preventDefault();
	 	var mobile = $('.mobile').val();
	 	Session.set("getMobileNumber",mobile);
		var otp = Math.floor(1000 + Math.random() * 9000);
		Session.set('FPotp',otp);
	 	if(mobile != ""){
			Meteor.call('sendOtp',mobile,otp,
			function(error,result){
				if(error){
					console.log(error.reason,"danger","growl-top-right");
				}else{
					
					$('#forgotpass').hide();
					$('.modal-backdrop').hide();

					$('#otpForgotPasswordModal').modal({
						show:true
					});
				}
			});
			
		}else{
			swal('Your Mobile Number is not Found. Please Enter Valid Mobile Number.');
		}
	 }

	 confirmOTP(event){
	 	event.preventDefault();
		var userId = Meteor.userId();
		var sessionValue = Session.get('FPotp');
		var otp = this.refs.otp.value;
		if(sessionValue == otp){
			$('.modal-backdrop').hide();
      		FlowRouter.go('/ForgotPassword');
		}else{
			swal('Please Check your Mobile for Valid OTP');
		}

	 }

	 showPass(){
	 	$('.rrnShowPass').toggleClass('rrnShowPass1');
	 	$('.rrnHidePass').toggleClass('rrnHidePass1');
	 	return $('.oesSignUpFormPass').attr('type', 'text');
	 }

	 hidePass(){
	 	$('.rrnShowPass').toggleClass('rrnShowPass1');
	 	$('.rrnHidePass').toggleClass('rrnHidePass1');
	 	return $('.oesSignUpFormPass').attr('type', 'password');
	 }

  	 componentDidMount(){
		if ($('body').hasClass('adminLte')) {
		  $("script[src='/js/adminLte.js']").remove();
    	  $("link[href='/css/dashboard.css']").remove();
    	  $('body').removeClass('adminLte');
		}
  	}

  // this function is assuming due to bab internet or internet is not available this function will execute
	tryLoadingAgainforLoginBtn(){
		 examTime = this.state.defaultLoginBtnTime;
		var LoadingInterval = setInterval(function() {
		
		if(examTime){
		  var timer = examTime.split(':');
		  var minutes = parseInt(timer[0], 10);
		  var seconds = parseInt(timer[1], 10);
		  --seconds;
		  minutes = (seconds < 0) ? --minutes : minutes;
		  if (minutes < 0){
			$('.loginLoadingTimeDiv').val("Please check your internet or refresh window");
		  }else{
		  	 seconds = (seconds < 0) ? 59 : seconds;
			  seconds = (seconds < 10) ? '0' + seconds : seconds;

			  minutes = (minutes < 10) ?  minutes : minutes;
			 $('.loginLoadingTimeDiv').val("We are processing... please wait");
			  examTime = minutes + ':' + seconds;
			}
		}

		}, 1000);
		
	}


	render() {
		// if(!Meteor.userId()){
  		var winHeight = $(window).height();;
        var divHeight = winHeight/4.5+'px';
        var MyDivHeight = $('#divHeghtIN').height();    
        return ( 
           <div>
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">
		      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpLeftWrap" style={{"height": winHeight}}>
		       {/*<img src="/images/signUpBanner.gif" className="signUpBanner col-lg-9 col-md-9"/>*/}
		       <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
		        <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 logoImg"/>
		       <div className="OESSubTitle2">Abacus Online Exam System</div>

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
		      </div>
		      <div className="col-lg-6 col-lg-offset-2 col-md-5 col-md-offset-6 col-xs-4 col-sm-5 col-sm-offset-6 signUpFormWrap loginOesWrap" id="divHeghtIN" style={{"height": winHeight}}>
		     
		       <img src="/images/formbg.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formbg"/>
		      
		        <div className="divLoginInWrap col-lg-6 col-lg-offset-5">
		       
		       {/*<div className="col-lg-12">
		        <div className="col-lg-12 col-md-12 OEXLogoWrap">
		         <img src="/images/maatslogo.png" className="oesLogoImg col-lg-offset-2 col-lg-8 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2"/>
		        </div>
		       </div>*/}
		       {/*<div className="OESSubTitle2">Abacus Online Exam System</div>*/}
		       <h3 className="signInNameTitle"><span className="bordbt">SIGN IN</span></h3>
		       <form id="login" onSubmit={this.userlogin.bind(this)} className="mrleft">
		           <div className="col-lg-12 col-md-12 col-sm-12 "> 
		            <div className="inputContent">
		            <span className="blocking-span">
		            <input type="email"  className={this.state.loginusername?"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox has-content":"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox"} onChange={this.handleChange} ref="loginusername" name="loginusername" placeholder="" required/>
		         <span className="floating-label"><i className="fa fa-envelope signupIconFont" aria-hidden="true"/>Email</span>           
		         </span>
		            </div>
		        </div>
		        <div className="col-lg-12 col-md-12 col-sm-12"> 
		           <div className="inputContent ">
		             <span className="blocking-span">
		              <input type="password" className={this.state.loginusername?"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox has-content":"col-lg-12 col-md-12 col-sm-12 oesSignUpForm tmsLoginTextBox"} onChange={this.handleChange} ref="loginPassword" name="loginPassword" required/>
		           <span className="floating-label"><i className="fa fa-lock signupIconFont" aria-hidden="true"/> Password</span>           
		         </span>

		         <div className="rrnShowHideDiv">
		             
		            </div>
		            </div>
		           </div>
		            <div className="col-lg-12 col-md-12 col-sm-12">
		            <input type="submit" className="col-lg-12 col-md-12 col-xs-12 col-sm-12 UMloginbutton hvr-sweep-to-right" value="Login"/>
		            
		          </div>
		          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		            <div className="col-lg-5 col-md-6 col-sm-6 UMcreateacc">
		             <a href="/signUp" className="UMGreyy"> Sign Up</a>
		            </div>
		        
		        <div className="col-lg-6 col-md-6 col-sm-6 col-lg-offset-1 UMcreateacc">
		         <a href="/ForgotPassword" className="UMGreyy">
		           Forgot Password?
		         </a>
		        </div>

		        </div>
		        <div className="col-lg-12 col-md-12 col-sm-12">
		         <div className="col-lg-12 col-md-12 col-sm-12 forgotpass emailverify">
		          <a href="/verifyAccount" className="UMGreyy">
		            OTP Verification
		          </a>
		         </div>
		        </div>

		       </form>  
		      </div>
		       </div>
		      {/*<img src="/images/underMaintenance.gif" className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 maintenanceClass"/>
		      <h2 className="col-lg-12 col-md-12 col-sm-12 pVText">Please visit <a href="http://exam.maats.in"> exam.maats.in</a></h2>*/}
		     </div>
		    </div>
		     
		   );
	
	} 

}