import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Router, Route, browserHistory} from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { UserProfile } from '../forms/api/userProfile.js';
import BasicForm from '../forms/BasicForm.jsx';

export default class BasicInfoRequired extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={
      "subscription" : {
        // "userData" : Meteor.subscribe('userprofile',Meteor.userId()),    
        "userProfileData" : Meteor.subscribe("userProfileData"),
      } 
    }
  }
  render() {
    // if (!this.props.loading) {
      return (  
        <div>
	        {
	        	this.props.userData ?
	        	<div>
	        	 <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 basicInfoOuter">
			          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
			            <h5>Name</h5>
			            <p>{this.props.userData.firstName} {this.props.userData.lastName}</p>
			          </div>  
			          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
			            <h5>Date Of Birth</h5>
			            <p>{this.props.userData.dateOfBirth ? moment(this.props.userData.dateOfBirth).format("DD/MM/YYYY") : ""}</p>
			          </div>   
			          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
			            <h5>Alternate Phone Number</h5>
			            <p>{this.props.userData.altMobileNo}</p>
			          </div>  
			        </div>
		          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 basicInfoOuter">
		            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
			            <h5>Gender</h5>
			            <p>{this.props.userData.gender}</p>
			          </div>  
			          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
			            <h5>Phone Number</h5>
			            <p>{this.props.userData.mobileNo}</p>
			          </div> 
			          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicInfoInner noProfilePadding">
			            <h5>Email Id</h5>
			            <p>{this.props.userData.emailId}</p>
			          </div>  
			        </div>
		        </div>
	        	:
	        	<span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 basicinfospan">Please add your Basic Information</span>
	        }
         
        </div>
      );
    }
} 