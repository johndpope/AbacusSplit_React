
import React, {Component}   from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Header 		from '/imports/common/Header.jsx';
import Footer 		from '/imports/common/Footer.jsx';
import FranchiseSidebar from '/imports/common/FranchiseSidebar.jsx';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import Login        from '/imports/systemSecurity/components/UMLogin.jsx';

 FranchiseLayouts = ({loggingIn, isAdmin, content})=>(
	<div>
	{ loggingIn === true ?
	  	<div className="hold-transition skin-blue sidebar-mini">
	  		{/*{ isAdmin === true ?*/}
	      <div className="wrapper">
	        <Header/>
	        <div className="container-fluid">
	          <div className="row">
	            <FranchiseSidebar/>
	            <div className="container-fluid main-container">
	              <div className="row">
	                {content}
	                <Footer/>
	              </div>
	            </div>
	          </div>
	        </div>
	        </div>	       
	    </div>
	: 
	/*<Login/>*/
	FlowRouter.go("/")
	}
  </div>
);


export default withTracker(props => {
    const login    = Meteor.userId();
    if(login){
    	var loggingIn = true;
    }else{
    	var loggingIn = false;
    }
    return {
       		loggingIn,
            // isAdmin
    }; 
})(FranchiseLayouts);







