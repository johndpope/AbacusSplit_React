import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMeditRoles extends TrackerReact(Component) {

	// rolesListData(){
	// 	return Meteor.roles.find({}).fetch();
	// }

	// constructor(){
	// 	super();
	// 	this.state = {
	// 		subscription : {
	// 			"rolesData" : Meteor.subscribe('rolefunction'),
	// 		}
	// 	}
	// }

	editRole(event){
	  event.preventDefault();
      // var roleId    = $("input[name=Namerole]").attr("id");
      var roleId    = event.target.id;
      console.log("roleId : " + roleId);
      var roleName  = $("input[name="+roleId+"-Namerole]").val();
      // console.log("roleName : " + roleName);

      Meteor.call('updaterole', roleId, roleName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                         // FlowRouter.go("/UMroles");
                    }//the _id of new object if successful
                }

// 
        );	

	}
	
    handleChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

	constructor(props) {
	  super(props);
	  this.state = {
	    firstName: props.firstName,
	  };
	}

	render(){

       return(
			<form className="editroles">
				<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
					<label>Role Name*</label>
					<input type="text" className="form-control rolesField" name={`${this.props.roleDataVales._id}-Namerole`} value={this.props.roleDataVales.name} onChange={this.handleChange} required/>
				</div>
				<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
					<label>&nbsp;</label>
				    <button type="button" onClick={this.editRole.bind(this)} id={this.props.roleDataVales._id} className="btn btn-primary submit" data-dismiss="modal">Edit Role</button>
				</div>
			</form>
	    );

	} 

}