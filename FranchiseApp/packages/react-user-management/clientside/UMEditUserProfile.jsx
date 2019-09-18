import React, { Component} from 'react';
import { render } from 'react-dom';
// import ReactDOM from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import { createContainer } from 'meteor/react-meteor-data';

import UMEditFields from './UMEditFields.jsx';

export default class UMEditUserProfile extends TrackerReact(Component) {

  'editProfile'(event){
    event.preventDefault();

	if(!window.fileData1){fileData1 = '';}

    var doc = {

	    salutationVar1   : this.refs.salutation1.value,
	    lastNameVar1     : this.refs.lastName1.value,
	    firstNameVar1    : this.refs.firstName1.value,
	    emailVar1        : this.refs.signupEmail1.value,
	    userNameVar1     : this.refs.userName1.value,
	    signGenderVar1   : this.refs.signGender1.value,
	    homeAddVar1      : this.refs.homeAdd1.value,
	    cityVar1         : this.refs.city1.value,
	    stateVar1        : this.refs.state1.value,
	    zipVar1          : this.refs.zip1.value,
	    countryVar1      : this.refs.country1.value,
	    mobNumberVar1    : this.refs.mobNumber1.value,
	    alterNumberVar1  : this.refs.alterNumber1.value,
	    displayPicture1  : fileData1

   }

   console.log(doc);

  }

	constructor(){
		super();
		this.state = {
			subscription : {
				"rolesData" : Meteor.subscribe('rolefunction'),
				"usersData" : Meteor.subscribe('userfunction'),
			}
		}
	}


	rolesListData(){
		return Meteor.roles.find({}).fetch();
	}

	usersListData(){
		var userId = FlowRouter.getParam('userid');
		userDataObj = Meteor.users.findOne({'_id': userId}) ;
		return userDataObj;
	}


    mixins: [ReactMeteorData]

	render(){
       return(
			  <form id="edit" onSubmit={this.editProfile.bind(this)}>
				  <div className="signup col-lg-12 col-md-12 col-sm-12 col-xs-12">
				  	<h1 className="reportTitleName tableTitle">Edit Name's Profile</h1>
				  	<hr/>
				    <div className="form-group col-lg-2 col-md-2 col-xs-2 col-sm-2 ">
					   <label className="signupLabel control-label">Title*</label>
					   <select className="form-control" name="salutation1" ref="salutation1">
							<option>Mr</option>
							<option>Mrs</option>
							<option>Ms</option>
						</select>
				    </div>

				   <div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">First Name*</label>
					   <input type="text" className="form-control" ref="firstName1" name="firstName1" placeholder="" pattern="[A-Za-z]+" defaultValue={this.usersListData().username} />
				    </div>

				    <div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Last Name*</label>
					   <input type="text" className="form-control" ref="lastName1" name="lastName1" pattern="[A-Za-z]+" placeholder="" defaultValue='' />
				    </div>

				   <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Email address*</label>
					   <input type="email" className="form-control" ref="signupEmail1" name="signupEmail1" placeholder="" defaultValue='' />
				    </div>

				    
				    {/*<UMEditFields publication={this.props.usersListData}/>*/}

				   <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Username*</label>
					   <input type="text" className="form-control required" ref="userName1" name="userName1" placeholder="" defaultValue='' />
				    </div>

				   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
				   			<label className="signupLabel control-label col-lg-12 noPadLR">Gender*</label>
					   		<label className="radio-inline"><input type="radio" ref="signGender1" name="signGender1" value="Male"/>Male</label>
					   		<label className="radio-inline"><input type="radio" ref="signGender1" name="signGender1" value="Female"/>Female</label>
					   		<label className="radio-inline"><input type="radio" ref="signGender1" name="signGender1" value="Transgen"/>Transgen</label>
				    </div>

				   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Picture</label>
				    	<input className="dataURI js-browseImg1 umprofilepic col-xs-12" id="my-file-selector" type="file" ref="displayPicture1" name="displayPicture1" />
					</div>

				   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Home Address</label>
					   <textarea className="form-control" rows="2" id="comment" ref="homeAdd1" name="homeAdd1" defaultValue='' ></textarea>
				    </div>

				   <div className="form-group col-lg-3 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">City</label>
					   <input type="text" className="form-control" ref="city1" name="city1" placeholder="" defaultValue='' />
				    </div>

				   <div className="form-group col-lg-3 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">State</label>
					  <input type="text" className="form-control" ref="state1" name="state1" placeholder="" defaultValue=''/>
				    </div>

				   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 clear ">
					   <label className="signupLabel control-label">Pin/Zip Code</label>
					  <input type="text" className="form-control" ref="zip1" name="zip1" placeholder="" defaultValue=''/>
				    </div>

				   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Country*</label>
					  <input type="text" className="form-control required" ref="country1" name="country1" placeholder="" defaultValue=''  />
				    </div>

				   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Mobile Number*</label>
					  <input type="number" className="form-control" ref="mobNumber1" name="mobNumber1" placeholder="" defaultValue='' />
				    </div>

				   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Alternate Number</label>
					  <input type="number" className="form-control" ref="alterNumber1" name="alterNumber1" placeholder="" defaultValue=''/>
				    </div>

					  

						   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
							   <label className="signupLabel control-label">Reset Password</label>
							   <input type="password" className="form-control" ref="signupPassword1" name="signupPassword1" placeholder="" />
						    </div>	  

					 

						   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
							   <label className="signupLabel control-label">Current Password</label>
							   <input type="password" className="form-control" ref="currentPassword" name="currentPassword" placeholder="" />
						    </div>

						   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
							   <label className="signupLabel control-label">Password</label>
							   <input type="password" className="form-control" ref="signupPassword1" name="signupPassword1" placeholder="" />
						    </div>

						   <div className="form-group col-lg-6 col-md-4 col-xs-12 col-sm-12 ">
							   <label className="signupLabel control-label">Confirm Password</label>
							   <input type="password" className="form-control" ref="signupConfirmPassword1" name="signupConfirmPassword1" placeholder="" />
						    </div>
					 



				   <div className="form-group col-lg-12 col-md-4 col-xs-12 col-sm-12 noPadLR">
					    <input type="submit" value="Update" className="btn btn-primary col-lg-4 col-lg-offset-4"/>
				    </div>

				  </div>  
			  </form>	    
	   );

	} 

}


