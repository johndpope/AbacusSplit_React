import React, { Component } from 'react';
// import {createContainer} from 'meteor/react-meteor-data';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
// import {PropTypes} from 'prop-types';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import { ParkingSlots } from '../../../addressVerification/api/verificationAddress.js';
// import { UserAddress } from '../../../addressVerification/api/verificationAddress.js';

class EditUserProfile extends TrackerReact(Component){

	constructor(props) {
	  super(props);
	  var userId       =  this.props.post._id;
	  if(this.props.post){
		  if(this.props.post.profile){
			  this.state = {
			    firstname     : this.props.post.profile.firstname,
			    lastname      : this.props.post.profile.lastname,
			    username      : this.props.post.username,
			    mobNumber     : this.props.post.profile.mobNumber,
			    email         : this.props.post.email,
			    userProfile   : this.props.post.profile.userProfile,
			    subscription  : {
									"parkDataSlots" : Meteor.subscribe('parkDataSlots',userId),
									"userAddrData"  : Meteor.subscribe('userAddrData',userId),
									"userParkingSlotsData"  : Meteor.subscribe('userParkingSlotsData'),
									"userAddrData"  : Meteor.subscribe('userAddresses'),
								},
			  };
			}
	  }else{
		  this.state = {
		    data          : '',
		    firstname     : '',
		    lastname      : '',
		    username      : '',
		    mobNumber     : '',
		    email         : '',
		    userProfile   : '',
		  };	  	
	  }
	    this.handleChange = this.handleChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
	}

  componentWillReceiveProps(nextProps) {
  	if(!nextProps.loading){	
    	if(nextProps.post){	
	    	if(nextProps.post.profile){	
	            this.setState({
	                firstname  : nextProps.post.profile.firstname,
	                lastname   : nextProps.post.profile.lastname,
	                userProfile: nextProps.post.profile.userProfile,
	                username   : nextProps.post.username,
	                mobNumber  : nextProps.post.profile.mobNumber,
	                email      : nextProps.post.emails[0].address,
	            })
	        }
        }
      }

          this.handleChange = this.handleChange.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
  }


	handleSubmit(event) {
	    event.preventDefault();
	    var userId          = this.props.post._id;
	    // console.log("userId",userId);
	    if(userId){
	    	var id            = userId;
	    }else{
	    	var id            = Meteor.userId();
	    }


	    var formValues = {
                firstname  : this.refs.editFirstName.value,
                lastname   : this.refs.editLastName.value,
                mobNumber  : this.refs.editContactNum.value,
	    }


	    Meteor.call('editMyProfileData',formValues, id, function(error,result){
	    	if(error){
	    		console.log("error"+error);
	    	}else{
	    		swal('Profile updated Successfully!');
	    	}
	    });
	}

	handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}


	componentDidMount(){
    $("html,body").scrollTop(0);
		$('.uneditable').prop('disabled', true);
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

  onInput(event){
	  this.setState({firstname: event.target.value})
	}

	uploadProfileImg(event){
	    event.preventDefault();
	    let self = this;
	     this.setState({isUploading: true});
	     //  this.calculateProgress();
	    if (event.currentTarget.files && event.currentTarget.files[0]) {
	        var file = event.currentTarget.files[0];
	         console.log("file",file);
          var userId = this.props.post._id;
          console.log("userId",userId);
	        if (file) {
	            addUserToS3Function(userId,file,self);
	        }
	    }
	}

	uploadProfileClick(event){
		event.preventDefault();
		$('.useruploadImg').click();	
	}


	render() {
		   if(!this.props.loading){	
			   	if(this.props.post){       
				   	if(this.props.post.profile){       
					   	return (
						  	<section className="content-wrapper">
					        <div className="content">
					          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
					            <div className="box box-primary">
						            <div className="box-header with-border">
						            	<h4 className="box-title">EDIT PROFILE</h4>
						            </div>
												<div className="box-body">
													<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
														<div className="col-lg-10 col-sm-10 col-xs-10 col-md-10">
															<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
																 <span className="floating-label">First Name</span>
																	<span className="blocking-span">	
																		<input type="text" value={this.state.firstname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editFirstName" name="firstname"/>
																	</span>
																
															</div>
															<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															  <span className="floating-label">Last Name</span>
																<span className="blocking-span">
																	<input type="text" value={this.state.lastname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editLastName" name="lastname" />
																</span>
																							
															</div>
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">	
																<div className="disableLabel">Username/Email</div>
																{/*<span className="blocking-span">	*/}									
																	<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="disableInput inputMaterial form-control inputText" ref="editUsername" name="username"/>
																	{/*<span className="floating-label">Username/Email</span>*/}
																{/*</span>*/}
																
															</div>
															
															<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">
															  <span className="floating-label">Mobile Number</span>
																<span className="blocking-span">
																	<input type="text" value={this.state.mobNumber} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editContactNum" name="mobNumber"/>
																</span>
																								
															</div> 
															
														</div>

														<div className="col-lg-2 col-sm-2 col-xs-2 col-md-2">
															<img src={this.state.userProfile} className="img-responsive"/>
															<input name="userPic" ref="userPic" onChange={this.uploadProfileImg.bind(this)} className="useruploadImg" type="file" />
														{/*<button onClick={this.uploadProfileClick.bind(this)} className="uploaduserPic col-lg-12 col-md-12 btn btn-default">Update Photo</button>*/}
														</div>

											

														<br/>
													</div>
													<br/>
													<div className="col-lg-4 col-sm-12 col-xs-12 col-md-12 pull-right userProfileEditBtn">
														<button onClick={this.handleSubmit.bind(this)} className="btn btn-primary pull-right">Update Profile</button>
													</div>

												</div>	
								</div>
								</div>
							</div>
							</section>
					    );
					}
				}
			}else{
				return (<div className="col-sm-12 col-xs-12 loadingImg"><img src="images/loading.gif" alt="loading"/></div>);
			}


	} 

}

EditUserContainer = withTracker(({params})=>{
    var userId       = FlowRouter.getParam("id");
    if(userId){
    	var id       = userId;
    }else{
    	var id       = Meteor.userId();
    }
    const postHandle = Meteor.subscribe('userData',id);
    const post       = Meteor.users.findOne({ '_id': id })||{};
    if(post){
    	 const loading = !postHandle.ready();
	    return {
	        loading, 
	        post,
	    };   	
    }
  
})(EditUserProfile);

export default EditUserContainer;
