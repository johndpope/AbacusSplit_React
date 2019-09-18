import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';

export default class Placeholder extends TrackerReact(React.Component) {
	render() {
    return (
    	<div className="col-lg-3 col-md-4 col-sm-12 col-xs-12">
	      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding landingBlocks placeholderVerBlock">
	        <h5 className="text-center"><b>Placeholder</b></h5>
	      </div>
	    </div>
    );
  }
}
