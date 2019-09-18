import React, { Component } from 'react';

import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';


export default class UMEditFields extends TrackerReact(Component) {


	constructor(){
		super();
		this.state = {
			subscription : {
				"rolesData" : Meteor.subscribe('rolefunction'),
				"usersData" : Meteor.subscribe('userfunction'),
			}
		}
	}

	render(){

       return(
				   <div className="form-group col-lg-6 col-md-6 col-xs-12 col-sm-12 ">
					   <label className="signupLabel control-label">Email address*</label>
					   <input type="email" className="form-control" ref="signupEmail1" name="signupEmail1" placeholder="" defaultValue= "" />
				    </div>	    
	   );

	} 

}