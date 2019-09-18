import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class LatestUpdates extends TrackerReact(React.Component) {
  constructor(props) {
    super(props); 
   
    this.state = {
      "subscription"  : {
      }  
    }; 
  }
	render() {
    if (!this.props.loading) {
      return (
      <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 noProfilePadding activityOuter landingBlocks">
        <h5 className="text-center"><b>Latest Updates</b></h5>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
          <div className="col-lg-1 col-md-1 col-sm-2 col-xs-12 noProfilePadding">
            <i className="fa fa-user-circle-o fa-2x"></i>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-8 col-xs-12">
            <p>Your Police Verification has been done on 15<sup>th</sup> December, 2017. People who do Ploice Verification has also got Character Verified.</p>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12 noProfilePadding">
            <a href="#">Learn More</a>
          </div>
        </div>
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
          <div className="col-lg-1 col-md-1 col-sm-2 col-xs-12 noProfilePadding">
            <i className="fa fa-file-text-o fa-2x"></i>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-8 col-xs-12">
            <p>Your Basic Verification will expire on 20<sup>th</sup> December, 2017. Renew now to stay updated.</p>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12 noProfilePadding">
            <a href="#">Renew Now</a>
          </div>
        </div>
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
          <div className="col-lg-1 col-md-1 col-sm-2 col-xs-12 noProfilePadding">
            <i className="fa fa-male fa-2x"></i>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-8 col-xs-12">
            <p>Your Employment Verification is in process. It will be verified by 17<sup>th</sup> December, 2017.</p>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12 noProfilePadding">
            <a href="#">Learn More</a>
          </div>
        </div>
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
          <div className="col-lg-1 col-md-1 col-sm-2 col-xs-12 noProfilePadding">
            <i className="fa fa-male fa-2x"></i>
          </div>
          <div className="col-lg-9 col-md-9 col-sm-8 col-xs-12">
            <p>80% people who have verified Basic Verification have also verified Academic Verification.</p>
          </div>
          <div className="col-lg-2 col-md-2 col-sm-2 col-xs-12 noProfilePadding">
            <a href="#">Learn More</a>
          </div>
        </div>
        <hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 activityBlock">
          <h5>Lasted Login: &nbsp;&nbsp;&nbsp;{moment(this.props.userData.status.lastLogin.date).format('dddd, Do MMMM YYYY, h:mm:ss a')}</h5>
        </div>
      </div>
      );
    }else{
      return(
        <span>Loading..</span>
        );
    }
    
  }
}
LatestUpdateContainer = withTracker(({props}) => {
    var _id          = Meteor.userId();
    const postHandle = Meteor.subscribe('userData',_id);
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    const userData  = Meteor.users.findOne({"_id" : _id})|| {};
    // console.log("userData",userData);
    const loading   = !postHandle.ready();
     
    // if(_id){
      return {
          loading,
          userData,
      };
    // }
})(LatestUpdates);

export default LatestUpdateContainer;
