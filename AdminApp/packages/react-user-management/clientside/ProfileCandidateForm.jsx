import React, { Component} from 'react';
import { Meteor } from 'meteor/meteor';

export default class ProfileCandidateForm extends Component {

  render() {
    return (
		    <div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 ">
			   <label className="signupLabel control-label">User Name*</label>
			   <input type="text" className="form-control" ref="username" defaultValue={this.props.user.username} />
		    </div>
    );
  }
}

