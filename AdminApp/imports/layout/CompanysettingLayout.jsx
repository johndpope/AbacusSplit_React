import React, {Component}   from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import Header 		from '/imports/common/Headerforcompanysettinglayout.jsx';
import Footer1 		from '/imports/common/Footer1.jsx';
// import FranchiseSidebar from '/imports/common/FranchiseSidebar.jsx';
import Login        from '/imports/systemSecurity/components/UMLogin.jsx';


const CompanysettingLayout = ({loggingIn, content})=>(


  <div>
  { loggingIn ?
    <div className="hold-transition skin-blue sidebar-mini">
        <div className="">
          <Header/>
          <div className="container-fluid">
            <div className="row">
              {/* <FranchiseSidebar/> */}
              <div className="container-fluid main-container">
                <div className="row">
                  {content}
                  <Footer1/>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>


  : <UMLogin/>
  }
  </div>

); 

CompanysettingLayout.propTypes = {
  loggingIn : PropTypes.bool
};

export default InitialLayout = withTracker(props => {

    const login    = Meteor.userId();
    const loginUser    = Meteor.user();

    if(login && loginUser){ var loggingIn = true; }
    else{ var loggingIn = false;}

    return {
        loggingIn
    }

})(CompanysettingLayout);

