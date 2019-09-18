import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


export default class StudentResetPassword extends TrackerReact(Component) {
	constructor(){
		  super();
		    this.state = {
		    	 oldPassword   : "",
		    	 resetPasswordPassword : "",
		    	 resetPasswordPasswordConfirm : "",
		       facilityPermission : 'waitingforResult',
		    }
		    this.handleChange = this.handleChange.bind(this);
		}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MyAccount","ChangePassword",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res==true){
		          this.setState({
		             facilityPermission : res,
		          });
		        }else if(res==false){
		          this.setState({
		             facilityPermission : res,
		          });
		        }
			}
		});
  	}
	'changepassword'(event) {
	    event.preventDefault();
	    var resetPassword   = FlowRouter.getParam("id");
	    var oldPassword     = this.refs.oldPassword.value;
	    var password        = this.refs.resetPasswordPassword.value;
	    var passwordConfirm = this.refs.resetPasswordPasswordConfirm.value;
	   	
       if (password === passwordConfirm) {

        if(password.length >= 6){  
         	  //End of else
	       Accounts.changePassword(oldPassword, password, (error, result)=>{ 
	        if(error){ 
	            swal("Invalid current password.","","warning");
	            this.refs.oldPassword.value = '';
	        }else{
	            // this.props.navigate('DisplayCustomerProfile');
	        	swal("Your password has been updated!","","success"); 
	        	this.refs.resetPasswordPassword.value = '';
	    	    this.refs.resetPasswordPasswordConfirm.value = '';
	   	         
	    	}        
    	  });
        }else{	
          	swal({
	            title: "password should be at least 6 characters long",
	            text: "Please try again",
	            timer: 1700,
	            showConfirmButton: false,
	            type: "error"
	        });
      	}
       	}else{
         swal({
            title: 'Passwords does not match',
            text: 'Please try again',
            showConfirmButton: true,
            type: 'error'
         }); //End of error swal
       }
   }
	 
		
	

   handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }

    
	render() {
	 	if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
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
							<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 onlineCPExamWrap">
							    <form onSubmit={this.changepassword.bind(this)} id="resetPasswordForm" method="post" className="resetpasswordWrapper col-lg-12 col-md-12 col-xs-12 col-sm-12">
							    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 resetPassTitle"></div>
							    	<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
									   <span className="blocking-span">
									   
										   <input type="password" className={this.state.oldPassword ? "UMnameOEs inputText col-lg-12 col-md-12 col-sm-12 has-content" : "UMnameOEs inputText col-lg-12 col-md-12 col-sm-12"} ref="oldPassword" name="oldPassword" onChange={this.handleChange} id="oldPassword"  required/>
										   
										   <span className="floating-label" >Current Password</span>
									   
									   </span>
								    </div>
							        <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
									   	 <span className="blocking-span">
									   
										   <input type="password" className={this.state.resetPasswordPassword ? "UMnameOEs inputText col-lg-12 col-md-12 col-sm-12 has-content" : "UMnameOEs inputText col-lg-12 col-md-12 col-sm-12"} ref="resetPasswordPassword" onChange={this.handleChange} name="resetPasswordPassword" id="resetPasswordPassword"  required/>
										   
										    <span className="floating-label">New Password</span>
									  
									    </span>
								    </div>

								    <div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12">
									    <span className="blocking-span">
									   
										   <input type="password" className={this.state.resetPasswordPasswordConfirm ? "UMnameOEs inputText col-lg-12 col-md-12 col-sm-12 has-content" : "UMnameOEs inputText col-lg-12 col-md-12 col-sm-12"} ref="resetPasswordPasswordConfirm" onChange={this.handleChange} name="resetPasswordPasswordConfirm" id="resetPasswordPasswordConfirm"  required/>
										   
										   <span className="floating-label">Confirm New password</span>
									  
									   </span>
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

        }else if (this.state.facilityPermission == false ){
			  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
		}

	} 

}