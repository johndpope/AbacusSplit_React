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
	                         swal('"'+roleName+'"'+ "Role Added Successfully","","success")
	                    }//the _id of new object if successful
	                }


	        );
	      $("input[name=roleName]").val('');	

	}

	render(){
       return(
       			<div>
					<form id="addroles" className="paddingLeftz noLRPad">
						<div className="form-group col-lg-8 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad">
							<span className="blocking-span">
								<input type="text" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" name="roleName" required/>
								<span className="floating-label">Enter Role </span>
							</span>
						</div>
						<div className="form-group col-lg-4 col-md-4 col-xs-4 col-sm-4 ">
							<label>&nbsp;&nbsp;&nbsp;</label>
						    <button type="button"  onClick={this.addRole.bind(this)} className="btn btn-primary submit addrolesBtn" data-dismiss="modal">Add Role</button>
						</div>
					</form>
				</div>
								

	    );
	} 

}