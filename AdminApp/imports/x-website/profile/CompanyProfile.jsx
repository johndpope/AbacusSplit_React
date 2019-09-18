import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import CompanyProfileData from './CompanyProfileData.jsx';
import LatestUpdates from './LatestUpdates.jsx';
import Viewers from './Viewers.jsx';
import CompanyServices from './CompanyServices.jsx';
import Placeholder from './Placeholder.jsx';

import { UserProfile } from '/imports/x-website/forms/api/userProfile.js';

class CompanyProfile extends TrackerReact(React.Component) {
  constructor(){
    super(); 
    this.state ={ 
      "userprofileData" : {},
      "subscription" : {
        "userprofile" : Meteor.subscribe("userprofile"),      
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
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visitedHeight noProfilePadding">
                <CompanyProfileData userValues={this.props.usersDetails} key={this.props.usersDetails._id + 'company'}/>
                <LatestUpdates />
                <Viewers />
              </div>

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 newsVerBlock noProfilePadding landingBlocks text-center">
                    <h5><b>News Feed</b></h5>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proNewsBlock">
                      <NewsFeed />
                    </div>
                  </div>
                </div>
                <CompanyServices />
                <Placeholder />
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
    // const postHandle1   = Meteor.subscribe('userprofile',Meteor.userId());
    const loading       = !postHandle.ready();
    // const loading1      = !postHandle1.ready();

    var _id = Meteor.userId();
    const usersDetails   = Meteor.users.findOne({"_id":_id})||{};
    // console.log("usersDetails",usersDetails);
    // const userprofileObj = UserProfile.findOne({'userId': _id}) || {} ;
    // console.log("userprofileObj",userprofileObj);
   
    // if(_id){
      return {
          loading,
          // loading1,
          usersDetails,
          // userprofileObj,
      };
    // }
})(CompanyProfile);
export default UserDataContainer;