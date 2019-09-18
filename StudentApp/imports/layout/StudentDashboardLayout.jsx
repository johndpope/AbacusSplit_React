
import React, {Component}   from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import StudentHeader 		from '/imports/common/StudentHeader.jsx';
// import SystemWarning 		from '/imports/common/SystemWarning.jsx';
import Footer 		from '/imports/common/Footer.jsx';
import StudentSidebar from '/imports/common/StudentSidebar.jsx';
import Login        from '/imports/systemSecurity/components/UMLogin.jsx';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


StudentLayouts = ({loggingIn,content})=>(
	
	
	<div>
	{ 
		loggingIn === true ?
	  	<div className="hold-transition skin-blue sidebar-mini">
	      <div className="wrapper">
	        <StudentHeader/>
	       { /*{
	        	browserStatus == 'ValidBrowser'?
	        	<SystemWarning />
	        	:
	        	null
	        }*/}
	        
	        <div className="container-fluid">
	          <div className="row">
	            <StudentSidebar/>
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
	// console.log("navigator.appName------>",navigator.appName);
		// console.log("navigator.appCodeName------>",navigator.appCodeName);
		// console.log("navigator.platform------>",navigator.platform);
		// var SystemInfo = window.navigator;
		// if(SystemInfo){
		// 	SystemInfoApp = SystemInfo.appVersion;
		// 	if(SystemInfoApp){
		// 		var  index = SystemInfoApp.indexOf('Chrome');
		// 		if(index){
		// 			var browserInfo = SystemInfoApp.slice(index);
		// 			if(browserInfo){
		// 				var browserData = browserInfo.split('.');
		// 				var browserNameAndVersion = browserData[0].split('/');
		// 				if(browserNameAndVersion){
		// 					browserName = browserNameAndVersion[0];
		// 					browserVersion = parseInt(browserNameAndVersion[1]);
		// 					if(browserName=='Chrome' && browserVersion>51){
		// 						var browserStatus = 'ValidBrowser';
		// 					}else{
		// 						var browserStatus = 'InValidBrowser';
		// 					}

		// 				}

		// 			}
		// 		}
		// 	}
		// }
		// console.log("browserStatus in tracker ------>",browserStatus);
		// console.log("browserVersion-->",browserVersion);
    const login    = Meteor.userId();
    if(login){    	
    	var loggingIn = true;
    }else{
    	var loggingIn = false;
    }
    return {
       		loggingIn,
       		// browserStatus,
            // isAdmin
    }; 
})(StudentLayouts);





