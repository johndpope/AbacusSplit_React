import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import UMSignup from '../components/UMSignup.jsx';
import UMSignup from '/imports/login/components/UMSignup.jsx';



export default class Signup extends TrackerReact(Component) {


	render() {

       return (
			<div className="col-lg-6  col-lg-offset-3
							col-md-6  col-md-offset-3
							col-sm-12 
							col-xs-12 rrnSignUp">

	       		<div className="loadingGIF"></div>
				<UMSignup />	

			</div>
	    );

	} 

}