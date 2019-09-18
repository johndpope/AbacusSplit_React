import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMaddRoles extends TrackerReact(Component) {

	addRole(event){
		  event.preventDefault();
	      var roleName   = $("input[name=roleName]").val();
	      var inputId    = $("input[name=roleName]").attr("id");
	      // console.log('roleName : ' + roleName);
	      // console.log('inputId : ' + inputId);
	      Meteor.call('addrole', roleName,
	                function(error, result) { 
	                    if (error) {
	                        console.log ( error ); 
	                    } //info about what went wrong 
	                    else {
	                         // FlowRouter.go("/UMroles");
	                    }//the _id of new object if successful
	                }


	        );
	      $("input[name=roleName]").val('');	

	}

	render(){

       return(
			<form id="addroles" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingLeftz noLRPad">
				<div className="form-group col-lg-5 col-md-4 col-xs-7 col-sm-12 paddingLeftz noLRPad">
					<label>Role Name*</label>
					<input type="text" id= "" className="form-control rolesField" name="roleName" required/>
				</div>
				<div className="form-group col-lg-1 col-md-4 col-xs-5 col-sm-12 ">
					<label>&nbsp;&nbsp;&nbsp;</label>
				    <button type="button"  onClick={this.addRole.bind(this)} className="btn btn-primary submit addrolesBtn" data-dismiss="modal">Add Role</button>
				</div>
			</form>
	    );

	} 

}