
import React, {Component}   from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Header 		from '/imports/common/Header.jsx';
import Footer 		from '/imports/common/Footer.jsx';
import FranchiseSidebar from '/imports/common/FranchiseSidebar.jsx';
import Login        from '/imports/systemSecurity/components/UMLogin.jsx';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


 StaffLayout = ({loggingIn, isAdmin, content})=>(
	<div>
	{ loggingIn === true ?
	  	<div className="hold-transition skin-blue sidebar-mini">
	  		{ isAdmin === true ?
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
	        :
	        <div className="col-lg-12 col-md-12 col-sm-12 notFoundClass">
	      		<img src="../images/pagenotfound.jpg"/>
	      </div>

	  }
	    </div>
	: 
	// <Login/>
	FlowRouter.go("/")
	}
  </div>
);
FranchiseLayouts.propTypes = {
  loggingIn : PropTypes.bool,
  isAdmin   : PropTypes.bool
};

export default withTracker(props => {
  // Do all your reactive data access in this method.
  // Note that this subscription will get cleaned up when your component is unmounted

    const login    = Meteor.userId();
    if(login && Roles.userIsInRole(login, ['Staff']) ){
    	var loggingIn = true;
        var isAdmin   = true;
    }else if(login && !Roles.userIsInRole(login, ['Staff'])){
    	var loggingIn = true;
        var isAdmin   = false;
    }else{
    	var loggingIn = false;
        var isAdmin   = false;
    }

    // console.log('loggingIn: ',loggingIn);
    return {
       		loggingIn,
            isAdmin
    }; 
})(FranchiseLayouts);







