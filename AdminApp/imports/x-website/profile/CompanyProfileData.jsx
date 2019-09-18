import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';
import { Tracker } from 'meteor/tracker';

export default class CompanyProfileData extends TrackerReact(React.Component) {
  constructor(props){
    super(props); 
    this.state ={ 
      "subscription" : {
      } 
    }
  }
  componentDidMount() {
  }

	render() {
    // if(!this.props.loadingVal){
      return (
        <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileImgOuter noProfilePadding landingBlocks text-center">
            <h5><b>My Profile</b></h5>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userImg"> 
              { this.props.userValues.profile.userProfile ? 
                <img src={this.props.userValues.profile.userProfile} className="img-rounded profileImg" />
                :
                <img src="../images/assureid/userIcon.png" className="img-rounded profileImg" />
              }
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userInfo">
              <h5 className=""><b>{this.props.userValues.profile.name}</b></h5>
              {/*<p>AssureID  MHP1234567IN</p>
              <h5>Profile Completion Status</h5>*/}
              {/*!this.props.loading1?*/
                <div>
                  <div className="progress">
                    <div className="progress-bar progress-bar-striped" role="progressbar"
                    aria-valuenow={this.props.userValues ? this.props.userValues.profilePercent : 0} aria-valuemin="0" aria-valuemax="100" style={{width: this.props.userValues.profilePercent ? this.props.userValues.profilePercent : 0 +'%'}}>
                    </div>
                  </div>
                  <h3>{this.props.userValues.profilePercent ? this.props.userValues.profilePercent : 0}%</h3>
                </div>
                /*:
                <div></div>*/
              }
              <p>{this.props.userValues._id}</p>
            </div>
          </div>
        </div>
      );
    // }else{
    //   return(<span>Loading..</span>);
    // }
  }
}