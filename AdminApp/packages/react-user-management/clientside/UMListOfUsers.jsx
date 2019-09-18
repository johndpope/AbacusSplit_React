import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import UMeditRoles from './UMeditRoles.jsx';
import UMAddRolRow from './UMAddRolRow.jsx';
import UMDelRolRow from './UMDelRolRow.jsx';
import UMSelectRoleUsers from './UMSelectRoleUsers.jsx';
import UMUsers from './UMUsers.jsx';

export default class UMListOfUsers extends TrackerReact(Component) {

    'adminUserActions'(event) {
			event.preventDefault();

			var selectedValue        = this.refs.userListDropdown.value;
			var keywordSelectedValue = selectedValue.split('$')[0];
			var role                 = selectedValue.split('$')[1];
			var checkedUsersList     = [];


			$('input[name=userCheckbox]:checked').each(function() {
				checkedUsersList.push(this.value);
			});



			switch(keywordSelectedValue){
			  case '-':
			    console.log('selectedValue:' + selectedValue);
			    break;

			  case 'block_selected':
			    Meteor.call('blockSelectedUser', checkedUsersList);
			    break;

			  case 'active_selected':
			    Meteor.call('activeSelectedUser', checkedUsersList);
			    break;

			  case 'cancel_selected':
			    var confirmDelete = window.confirm("Are you sure you want to remove this record?"+ Meteor.users.find({'_id' : checkedUsersList}));
			    if(confirmDelete) {
			      Meteor.call('deleteSelectedUser', checkedUsersList);
			    }
			    break;

			  case 'add':
			    Meteor.call('addRoleToUser', role, checkedUsersList);
			    break;

			  case 'remove':
			    Meteor.call('removeRoleFromUser', role, checkedUsersList);
			    break;

			}

	}

	rolesListData(){
		return Meteor.roles.find({}).fetch();
	}


	usersListData(){
	    var roleSetArray    = [];
	    var roleSetVar      = Session.get('roleSet');
	    var activeBlockSetVar = Session.get('activeBlockSet');

	      if(roleSetVar || activeBlockSetVar){ 

	        if((roleSetVar == "all" && !activeBlockSetVar)       || 
	           (roleSetVar == "all" && activeBlockSetVar == '-') || 
	           (!roleSetVar && activeBlockSetVar == '-')         ||
	           (roleSetVar == '-' && activeBlockSetVar == '-'))
	        {
	          return Meteor.users.find({"roles":{ $nin: ["superAdmin"] } });
	        }else if((roleSetVar == "all" && activeBlockSetVar) || 
	                 (roleSetVar == "-" && activeBlockSetVar)   || 
	                 (!roleSetVar && activeBlockSetVar))
	        {
	          return Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin"] } });
	        }else if((roleSetVar && activeBlockSetVar == '-') || 
	                 (roleSetVar && !activeBlockSetVar))
	        {
	          return Meteor.users.find({"roles":{ $nin: ["superAdmin"], $in: [roleSetVar]} });
	        }else if(roleSetVar && activeBlockSetVar){
	          return Meteor.users.find({"profile.status": activeBlockSetVar,"roles":{ $nin: ["superAdmin"], $in: [roleSetVar]} });
	        }else{
	          return Meteor.users.find({"roles":{ $nin: ["superAdmin"] } });
	        }
	           
	      }else{
	        return Meteor.users.find({"roles":{ $nin: ["superAdmin"] } });
	      }
	}

	constructor(){
		super();
		this.state = {
			subscription : {
				"rolesData" : Meteor.subscribe('rolefunction'),
				"usersData" : Meteor.subscribe('userfunction'),
			}
		}
	}

	'roleFilter'(event) {
	    event.preventDefault(); 
	    var selectedValue = this.refs.roleListDropdown.value;
	    Session.set("roleSet", selectedValue);
	}

	'activeBlockRoles'(event) {
	    event.preventDefault();
	    var selectedValue = this.refs.blockActive.value;
	    Session.set("activeBlockSet", selectedValue);
	}
	

	render(){
       return(
				<section className="Content">
					<div className="eportWrapper">
						<div className="col-md-10 col-lg-12 col-sm-12 col-xs-12 noLRPad">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
							<h1 className="reportTitleName tableTitle">LIST OF USERS</h1>
							<hr/>
								<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12 noLRPad">
									
									<label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Action</label>
									<select className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userListDropdown actionSelect noLRPad" ref="userListDropdown" name="userListDropdown" onChange={this.adminUserActions.bind(this)}>
										<option value="-" name="userListDDOption" selected>-- Select --</option>	
										<option value="block_selected" name="userListDDOption">Block Selected</option>	
										<option value="active_selected" name="userListDDOption">Active Selected</option>
										<option value="cancel_selected" name="userListDDOption">Cancel Selected Acccounts</option>	
										{ this.rolesListData().map( (rolesData)=>{
											return <UMAddRolRow key={rolesData._id} roleDataVales={rolesData}/>
										  }) 
										}	
										{ this.rolesListData().map( (rolesData)=>{
											return <UMDelRolRow key={rolesData._id} roleDataVales={rolesData}/>
										  }) 
										}
									</select>
								</div>

								<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12 noLRPad">
									
									<label className="col-md-10 col-lg-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Role</label>
									<select className="col-md-10 col-lg-12 col-sm-12 col-xs-12 userListDropdown roleFilter noLRPad" ref="roleListDropdown" name="roleListDropdown" onChange={this.roleFilter.bind(this)}>
										<option value="-" name="roleListDDOption" selected>-- Select --</option>
										<option value="all" name="roleListDDOption">Show All</option>		
										{ this.rolesListData().map( (rolesData)=>{
											return <UMSelectRoleUsers key={rolesData._id} roleDataVales={rolesData}/>
										  }) 
										}	
									</select>
								</div>

								<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12 noLRPad">
									
									<label className="col-md-10 col-lg-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Block & Active Roles</label>
									<select className="col-md-10 col-lg-12 col-sm-12 col-xs-12 userListDropdown activeBlockRoles noLRPad" ref="blockActive" name="blockActive" onChange={this.activeBlockRoles.bind(this)}>
										<option value="-" name="roleListDDOption" selected>-- Select --</option>	
										<option value="Blocked" name="roleListDDOption">Blocked</option>	
										<option value="Active" name="roleListDDOption">Active </option>	
									</select>
								</div>

							  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive noLRPad">
									<table className="table table-bordered table-striped table-hover myTable dataTable no-footer">
										<thead className="table-head umtblhdr">
										<tr className="hrTableHeader info">
											<th className="umHeader"> <input type="checkbox" id="" className="allSelector" name="allSelector" value=""/> </th>
											<th className="umHeader"> Username </th>
											<th className="umHeader"> Status </th>
											<th className="umHeader"> Roles </th>
											<th className="umHeader"> Member for </th>
											<th className="umHeader"> Last Access </th>
											<th className="umHeader"> Operations </th>
										</tr>
										</thead>
										<tbody>
											{ this.usersListData().map( (usersData)=>{
												return <UMUsers key={usersData._id} usersDataValues={usersData}/>
											  }) 
											}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</section>
	    );

	} 

}