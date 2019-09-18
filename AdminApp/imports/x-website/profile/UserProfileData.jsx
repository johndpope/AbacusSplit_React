import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';
import { UserProfile } from '/imports/x-website/forms/api/userProfile.js';

class UserProfileData extends TrackerReact(React.Component) {
  constructor(){
    super(); 
    this.state ={ 
      "subscription" : {
        "userData" : Meteor.subscribe("userData",Meteor.userId()),  
        "userprofile" : Meteor.subscribe("userprofile",Meteor.userId()),    
      } 
    }
  }
  componentDidMount() {

  }

	render() {
    if(!this.props.loading){
      return (
        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding landingBlocks profileImgOuter text-center">
            <h5><b>My Profile</b></h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userImg"> 
              { this.props.usersDetails.profile.userProfile ? 
                <img src={this.props.usersDetails.profile.userProfile} className="img-rounded profileImg" />
                :
                <img src="../images/assureid/userIcon.png" className="img-rounded profileImg" />
              }
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userInfo">
              <h5 className=""><b>{this.props.usersDetails.profile.firstname} {this.props.usersDetails.profile.lastname}</b></h5>
              <p>AssureID  MHP1234567IN</p>
              <h5>Profile Completion Status</h5>
              {!this.props.loading1?
                <div>
                  <div className="progress">
                    <div className="progress-bar progress-bar-striped" role="progressbar"
                    aria-valuenow={this.props.userprofileObj ? this.props.userprofileObj.profilePercent : 0} aria-valuemin="0" aria-valuemax="100" style={{width: this.props.userprofileObj.profilePercent +'%'}}>
                    </div>
                  </div>
                  <h3>{this.props.userprofileObj ? this.props.userprofileObj.profilePercent : 0}%</h3>
                </div>
                :
                <div></div>
              }
            </div>
          </div>
        </div>
      );
    }else{
      return(<span>Loading..</span>);
    }
  }
}
UserDataContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe('userData',Meteor.userId());
    const postHandle1   = Meteor.subscribe('userprofile',Meteor.userId());
    const loading       = !postHandle.ready();
    const loading1      = !postHandle1.ready();

    var _id = Meteor.userId();
    const usersDetails   = Meteor.users.findOne({"_id":_id})||{};
    // console.log("usersDetails",usersDetails);
    const userprofileObj = UserProfile.findOne({'userId': _id}) || {} ;
    // console.log("userprofileObj",userprofileObj);
   
    // if(_id){
      return {
          loading,
          loading1,
          usersDetails,
          userprofileObj,
      };
    // }
})(UserProfileData);

export default UserDataContainer;
