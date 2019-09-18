import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMDelRolRow extends TrackerReact(Component) {

	render(){

       return(
       		<option  value={`remove$${this.props.roleDataVales.name}`} name="userListDDOption">Remove {this.props.roleDataVales.name} Role to Selected </option>
	    );

	} 

}