import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMAddRolRow extends TrackerReact(Component) {

	render(){

       return(
       		<option  value={`add$${this.props.roleDataVales.name}`} name="userListDDOption">Add {this.props.roleDataVales.name} Role to Selected </option>
	    );

	} 

}