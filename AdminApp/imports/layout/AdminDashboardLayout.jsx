import React, {Component}   from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Header 		from '/imports/common/Header.jsx';
import Footer 		from '/imports/common/Footer.jsx';
import AdminSidebar from '/imports/common/AdminSidebar.jsx';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import Login        from '/imports/systemSecurity/components/UMLogin.jsx';

const BaseLayouts = ({ loggingIn, isAdmin, content })=>(
	<div>
	{ loggingIn == true ?
	  	<div className="hold-transition skin-blue sidebar-mini">
	  		
	      <div className="wrapper">
	        <Header/>
	        <div className="container-fluid">
	          <div className="row">
	            <AdminSidebar/>
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
	// <Login/>
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
})(BaseLayouts);



