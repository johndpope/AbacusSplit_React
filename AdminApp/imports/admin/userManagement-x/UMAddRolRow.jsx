import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMAddRolRow extends TrackerReact(Component) {

	render(){

       return(
       		<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" value={`add$${this.props.roleDataVales.name}`} name="userListDDOption">Add {this.props.roleDataVales.name} Role to Selected </option>
	    );

	} 

}