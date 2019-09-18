import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';

export default class Viewers extends TrackerReact(React.Component) {
	render() {
    return (
    	 <div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding companyOuter landingBlocks">
          <h5 className="text-center"><b>Who viewed your profile</b></h5>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 visitedBlock">
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <img src="../images/assureid/reliance.gif" />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <img src="../images/assureid/ibm.png" />
            </div>
            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              <img src="../images/assureid/infosys.png" />
            </div>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 viewedBlock">
            <div>25</div>
            <p>Companies viewed your profile</p>
            <div>108</div>
            <p>Individuals viewed your profile</p>
          </div>
          <h6 className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"><a href="#">view more</a></h6>
        </div>
      </div>
    );
  }
}
