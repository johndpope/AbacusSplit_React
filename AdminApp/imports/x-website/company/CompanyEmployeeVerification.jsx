import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import ManualEmployeeVerification from './ManualEmployeeVerification.jsx';
import BulkEmployeeVerification from './BulkEmployeeVerification.jsx';

class CompanyEmployeeVerification extends TrackerReact(React.Component) {
  constructor(){
    super(); 
    this.state ={ 
      "userprofileData" : {},
      "subscription" : {
      } 
    }
  }
  componentDidMount() {
  }
  render() {
    if(Meteor.userId())
    return (
      <div>
        {!this.props.loading ?
          this.props.usersDetails.profile.loginAs == 'company' ?
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerProfileBlock">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visitedHeight">
                <h3 className="text-center">Employee Verification</h3>
                <br/>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImgOuter landingBlocks noProfilePadding">
                  <ul className="nav nav-pills empVerification col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <li className="active col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding"><a data-toggle="pill" href="#manual">Manual</a></li>
                    <li className="col-lg-6 col-md-6 col-sm-6 col-xs-12 noProfilePadding"><a data-toggle="pill" href="#bulk">Bulk Upload</a></li>
                  </ul>
                  <div className="tab-content empVerifContent">
                    <div id="manual" className="tab-pane fade in active">
                      <ManualEmployeeVerification />
                    </div>
                    <div id="bulk" className="tab-pane fade">
                      <BulkEmployeeVerification />
                    </div>
                  </div>
                </div>      
              </div>
            </div>
            :
            ""
          :
          <span>Loading..</span>
        }
      </div> 
    );
  }
}
UserDataContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe('userData',Meteor.userId());
    const loading       = !postHandle.ready();

    var _id = Meteor.userId();
    const usersDetails   = Meteor.users.findOne({"_id":_id})||{};
    // console.log("usersDetails",usersDetails);
   
    return {
        loading,
        usersDetails,
    };
})(CompanyEmployeeVerification);
export default UserDataContainer;