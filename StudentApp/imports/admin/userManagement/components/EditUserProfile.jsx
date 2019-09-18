import React, { Component } from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import InputMask from 'react-input-mask';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


class EditUserProfile extends TrackerReact(Component){

	constructor(props) {
	  super(props);
	  var userId       = FlowRouter.getParam("id");
	  if(this.props.post){
		  if(this.props.post.profile){
			  this.state = {
			    firstname     : '',
			    lastname      : '',
			    username      : '',
			    mobNumber     : '',
			    email         : '',
			    userProfile   : '',
			    role          : '',
  			    subscription  : {
									"parkDataSlots" : Meteor.subscribe('parkDataSlots',userId),
									"userAddrData"  : Meteor.subscribe('userAddrData',userId),
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
		    role          : '',
		    userProfile   : '/images/userIcon.png',
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
		                role       : nextProps.post.roles[0],
		            })
		        }
	        }
        }
            this.handleChange = this.handleChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
    }


	handleSubmit(event) {
	    event.preventDefault();
	    var userId            = FlowRouter.getParam("id");
	    if(userId){
	    	var id            = userId;
	    }else{
	    	var id            = Meteor.userId();
	    }

	    var userData = Meteor.users.findOne({"_id":id});
	    if(userData){
	    	var userRole=userData.roles;
	    }
	    console.log("userRole",userRole);



	    var formValues = {
                firstname  : this.refs.editFirstName.value,
                lastname   : this.refs.editLastName.value,
                mobNumber  : this.refs.editContactNum.value,
                // username   : this.refs.username.value,    
                // role  : $("input[name='roleName']:checked").val(),
	    }

	    if(formValues.firstname !='' && formValues.lastname !='' && formValues.mobNumber !=''){
		    Meteor.call('editMyProfileData',formValues, id, function(error,result){
		    	if(error){
		    		console.log("error"+error);
		    	}else{
		    		if(userRole=="Student"){
		    			Meteor.call('updateStudentInfo',id,formValues,function(error,result){
					    	if(error){
					    		console.log("error",error);
					    	}else{
					    	}
					    });
		    		}else if(userRole=="Franchise" || userRole=="superAdmin" || userRole=="Admin" ){
		    			Meteor.call('updateFranchiseUserInfo',id,formValues,function(error,result){
					    	if(error){
					    		console.log("error",error);
					    	}else{
					    	}
					    });
		    		}

		    		Session.set('inputbox', 1);
		    		swal('Profile updated Successfully!','','success');
		    		if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
		    			FlowRouter.go('/Admin/UMListOfUsers');
		    		}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
		    			FlowRouter.go('/Franchise/UMListOfUsers');
		    		}
		    		

		    	}
		    });
		}else{
			swal("Please fill all fields","","warning");
		}


	    return false;	    	
	}

	handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}

	addNew(){
		var input      = [];
		var numOfBoxes = Session.get('inputbox');
		var count      = numOfBoxes+0;
		if(numOfBoxes){
			for(i=0; i<numOfBoxes; i++){
				input[i] = i;
			}
		}
		return input;
	}

	
		
	componentDidMount(){
		Session.set('inputbox', 1);
		$('.uneditable').prop('disabled', true);

		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
  	}
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

    addMore(event){
    	event.preventDefault();
    	var numOfBoxes = Session.get('inputbox');
    	
    	if(numOfBoxes){
    		numOfBoxes = numOfBoxes + 1;
    	}else{
    		numOfBoxes = 1;
    	}

    	Session.set('inputbox', numOfBoxes);
    }

    vehiclesList(){
		var x = this.state.vehicles;
		return x;
    }

    delAddrOfUser(event){
    	event.preventDefault();
    	var delId = event.target.id;
	    Meteor.call('deleteParkingSpace',delId, function(error,result){
	    	if(error){
	    		console.log("error"+error);
	    	}else{
	    		swal('Address deleted Successfully!');
	    		
	    	}
	    });
    }

    addressList(){
    	var addressList = [];
    	var userId      = FlowRouter.getParam("id");
			if(paringAddress.length != 0){
				// console.log(paringAddress);
				for(i=0;i<paringAddress.length;i++){
					addressList.push(
						<div key={paringAddress[i]._id} className="col-lg-12 col-sm-12 col-xs-12 col-md-12 addressRows">
							<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
									{paringAddress[i].street1},{paringAddress[i].street2}<br/>
									{paringAddress[i].city}, {paringAddress[i].state} - {paringAddress[i].zip}
							
							<div className="pull-right">
								<i className="fa fa-trash-o" aria-hidden="true" data-toggle="modal" data-target={`#${paringAddress[i]._id}-rm`}>&nbsp;Remove</i>
								
								<div id={`${paringAddress[i]._id}-rm`} className="modal fade" role="dialog">
								  <div className="modal-dialog">

								    
								    <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12 mdCont">
								      <div className="modal-header">
								        <button type="button" className="close" data-dismiss="modal">&times;</button>
								        <h4 className="modal-title">Delete Address</h4>
								      </div>
								      <div className="modal-body">
								        <p className="mdDetRemv">Are you sure you wants to delete this address?</p>
								        <button type="button" className="btn btn-default pull-left" data-dismiss="modal">&nbsp;Close</button>
								        <button onClick={this.delAddrOfUser.bind(this)} id={paringAddress[i]._id} type="button" className="fa fa-trash-o btn btn-danger pull-right" data-dismiss="modal">&nbsp;Delete</button>
								      </div>
								      
								    </div>

								  </div>
								</div>

							</div>
							</div>
						</div>
					);
				}
			}else{
				return(<h7>No Address Found!</h7>);
			}

		return addressList;
    }

    onInput(event){
	  this.setState({firstname: event.target.value})
	}

	uploadProfileImg(e){
	    e.preventDefault();
	   
	    let self = this;
	    Session.set('s3ImgObj','UserProfileImg');
	    if (e.currentTarget.files && e.currentTarget.files[0]){
	      var file = e.currentTarget.files[0];
	     /* if (file) {
	      	addImgsToS3Function(FlowRouter.getParam("id"),file,self);
	      }*/
	      	if (file) {
		      	   var fileName  = file.name; 
		      	     var ext       = fileName.split('.').pop();  
	                  	if(ext=="jpg" || ext=="png" || ext=="jpeg"){    
	                        if (file) {   
		        				addImgsToS3Function(FlowRouter.getParam("id"),file,self);
			     			}else{           
			             			 swal("File not uploaded","Something went wrong","error");  
			                     }     
	                   	}else{ 
	                       swal("Please upload file","Only Upload  images format (jpg,png,jpeg)","error");   
	                    } 
		    	}
	    }
	}

	uploadProfileClick(event){
		event.preventDefault();
		$('.useruploadImg').click();	
	}



	render() {
			var URL = Meteor.absoluteUrl();
		   if(!this.props.loading){	
			   	if(this.props.post){       
				   	if(this.props.post.profile){       
					   	return (
							<div>
					        {/* Content Wrapper. Contains page content */}
					        <div className="content-wrapper">
					          {/* Content Header (Page header) */}
					          <section className="content-header">
					            <h3 className="contentTitle">Edit User</h3>
					          </section>
					          {/* Main content */}
					          <section className="content viewContent">
					            <div className="row">
					              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					                <div className="box">
					                 
					                  <div className="box-header with-border boxMinHeight">
								            <div className="box-header with-border">
								            <h4 className="reportTitle">Edit User Data</h4>
								            </div>
										
											<div className="box-body">
												
												<div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 EditUserProfileWrap">
													<div className="col-lg-8 col-sm-10 col-xs-10 col-md-8">
														<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															<span className="defaultLabelOes">First Name</span>
															<span className="blocking-span">	
																<input type="text" value={this.state.firstname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editFirstName" name="firstname" required/>
															</span>
															
														</div>
														<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6 group inputContent">
															<span className="defaultLabelOes">Last Name</span>
															<span className="blocking-span">
																<input type="text" value={this.state.lastname} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editLastName" name="lastname" required/>
																
															</span>
																						
														</div>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">	
															<div className="defaultLabelOes">Username/Email</div>
																<input type="text" disabled value={this.state.username} onChange={this.handleChange} className="disableInput inputMaterial form-control inputText" ref="username" name="username" required/>
														</div>
														<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 group inputContent">	
															<div className="col-lg-6 col-sm-6 col-xs-12 col-md-6 profileupdatemob group inputContent">
																<span className="blocking-span">
																	<span className="defaultLabelOes">Mobile Number</span>
																	<InputMask mask="9999-999-999" maskChar=" " pattern="([0-9]|[0-9]|[0-9])" value={this.state.mobNumber} onChange={this.handleChange} className="inputMaterial form-control inputText" ref="editContactNum" name="mobNumber" required/>
																	
																</span>
																								
															</div>
															<div className="col-lg-4 col-sm-12 col-xs-12 col-md-12 updatebtnprofile pull-right userProfileEditBtn">
																<button onClick={this.handleSubmit.bind(this)} className="btn btn-primary pull-right">Update Profile</button>
															</div>
														</div>
													</div>

													<div className="col-lg-4 col-sm-2 col-xs-2 col-md-4 userEsitimg">
													  <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> Upload Profile Picture</span>
									                      <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageSize imagetype"> (Image Size :700 KB - jpg/jpeg/png)</span>
									                      
													{/*	<img src={this.state.userProfile} className="img-responsive"/>*/}
														<input name="userPic" ref="userPic" onChange={this.uploadProfileImg.bind(this)} className="useruploadImg" type="file" />
														<button onClick={this.uploadProfileClick.bind(this)} className="uploaduserPic col-lg-12 col-md-12 btn btn-default">Update Photo</button>
														{/*	<button onClick={this.uploadProfileClick.bind(this)} className="uploaduserPic col-lg-12 col-md-12 btn btn-default">Update Photo</button>*/}
						                               
													</div>
													<br/>
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
			}else{
				return (
						<div>
					        {/* Content Wrapper. Contains page content */}
					        <div className="content-wrapper">
					          {/* Content Header (Page header) */}
					          <section className="content-header">
					            <h3 className="contentTitle">Edit User</h3>
					          </section>
					          {/* Main content */}
					          <section className="content viewContent">
					            <div className="row">
					              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					                <div className="box">
					                 
					                  <div className="box-header with-border boxMinHeight">
								            <div className="box-header with-border">
								            <h4 className="reportTitle">Edit User Data</h4>
								            </div>
										
											<div className="box-body">
												{/*<div className="col-sm-12 col-xs-12 loadingImg"><img src={URL+"../images/loading.gif"} className="col-lg-12 col-md-12" alt="loading"/></div>*/}
												<div className="col-sm-12 col-xs-12 loadingImg loadingUserProfImg">
													Loading Please Wait...
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

}

export default EditUserContainer = withTracker(props => {
  // Do all your reactive data access in this method.
  // Note that this subscription will get cleaned up when your component is unmounted
    
    var userId       = FlowRouter.getParam("id");
    if(userId){
    	var id       = userId;
    }else{
    	var id       = Meteor.userId();
    }
    const postHandle = Meteor.subscribe('userData',id);
    // console.log('id: ',id);
    const post       = Meteor.users.findOne({ '_id': id })||{};
    // console.log(post);
    const loading = !postHandle.ready();
    // if(post){
	    return {
	        loading,
	        post,
	    };   	
    // }
})(EditUserProfile);


