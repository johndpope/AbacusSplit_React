import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

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
			    // var confirmDelete = window.confirm("Are you sure you want to remove this record?"+ Meteor.users.find({'_id' : checkedUsersList}));
			    // if(confirmDelete) {
			    //   Meteor.call('deleteSelectedUser', checkedUsersList);
			    // }

			    var users = Meteor.users.find({"_id":{ $in: checkedUsersList } }).fetch();

			    if(users){
			    	var userNames = '';
			    	// console.log(JSON.stringify(users,null,4));
			    	for(var k=0;k<users.length;k++){
			    		userNames += users[k].profile.firstname +' '+ users[k].profile.lastname + '\n';
			    	}

					swal({
					            title             : 'Are you sure? You will not be able to recover below users again!',
					            // text              : 'You will not be able to recover this users again!',
					            html              : userNames,
					            type              : 'warning',
					            showCancelButton  : true,
					            confirmButtonColor: '#dd6b55',
					            cancelButtonColor : '#999',
					            confirmButtonText : 'Yes!',
					            cancelButtonText  : 'No',
					            closeOnConfirm    : false
					        }, function() { 
					        				Meteor.call('deleteSelectedUser', checkedUsersList);
					        				swal.closeModal();
					        			  }
					    );

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
		var roleSetArray = [];
		var roles =  Meteor.roles.find({"name":{ $nin: ["superAdmin"] } }).fetch();
		if(roles){
			return roles;
		}else{
			return roleSetArray;
		}
	}

	adminRolesListData(){
		var roleSetArray = [];
		var roles =  Meteor.roles.find({"name":{ $in: ["admin"] } }).fetch();
		if(roles){
			return roles;
		}else{
			return roleSetArray;
		}
	}


	usersListData(){
	    var roleSetArray      = [];
	    var roleSetVar        = Session.get('roleSet');
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
	componentDidMount() {
	 	// $("#signUpUser").validate();
	 	// renderFunction();
	 	if (!!!$("link[href='/css/dashboard.css']").length > 0) {
      var dashboardCss = document.createElement("link");
      dashboardCss.type = "text/css";
      dashboardCss.rel = "stylesheet";
      dashboardCss.href = "/css/dashboard.css";
      document.head.append(dashboardCss);
    }
	 }
  componentWillUnmount(){
    $("link[href='/css/dashboard.css']").remove();
  }
	

    checkAll(event) {
      // event.preventDefault();
      if(event.target.checked){
        $('.userCheckbox').prop('checked',true);
      }else{
        $('.userCheckbox').prop('checked',false);
      }
    }

	render(){
       return(
			<section className="content-wrapper">
	        <div className="content">
	          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
	            <div className="box box-primary">
		            <div className="box-header with-border">
		            <h3 className="box-title">ALL USERS</h3>
		            </div>
		            <div className="box-body"> 
					<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
						
						<label className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 selectTitle noLRPad">Select Action</label>
						<select className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 userListDropdown actionSelect" ref="userListDropdown" name="userListDropdown" onChange={this.adminUserActions.bind(this)}>
							<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="-" name="userListDDOption">-- Select --</option>	
							<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="block_selected" name="userListDDOption">Block Selected</option>	
							<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="active_selected" name="userListDDOption">Active Selected</option>
							<option className="col-lg-12 col-md-12 col-sm-12 col-xs-12" data-limit='37' value="cancel_selected" name="userListDDOption">Cancel Selected Acccounts</option>	
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

					<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
						
						<label className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 selectTitle noLRPad">Select Role</label>
						<select className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 userListDropdown roleFilter noLRPad" ref="roleListDropdown" name="roleListDropdown" onChange={this.roleFilter.bind(this)}>
							<option value="-" name="roleListDDOption">-- Select --</option>
							<option value="all" name="roleListDDOption">Show All</option>		
							{ this.rolesListData().map( (rolesData)=>{
								return <UMSelectRoleUsers key={rolesData._id} roleDataVales={rolesData}/>
							  }) 
							}	
						</select>
					</div>

					<div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12">
						
						<label className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 selectTitle noLRPad">Select Block & Active Roles</label>
						<select className="col-md-10 col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 userListDropdown activeBlockRoles noLRPad" ref="blockActive" name="blockActive" onChange={this.activeBlockRoles.bind(this)}>
							<option value="-" name="roleListDDOption">-- Select --</option>	
							<option value="Blocked" name="roleListDDOption">Blocked</option>	
							<option value="Active" name="roleListDDOption">Active </option>	
						</select>
					</div>


				  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive noLRPad">
						<table className="table table-bordered table-striped table-hover myTable dataTable no-footer col-lg-10 col-md-10 col-sm-10 col-xs-12">
							<thead className="table-head umtblhdr">
							<tr className="hrTableHeader info">

								<th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1 "> <input type="checkbox" className="allSelector" name="allSelector" onChange={this.checkAll.bind(this)}/> </th>
								<th className="umHeader col-lg-4 col-md-4 col-sm-6 col-xs-6"> Username </th>
								<th className="umHeader col-lg-2 col-md-2 hidden-xs hidden-sm"> Status </th>
								<th className="umHeader col-lg-2 col-md-2 col-sm-2 col-xs-2"> Roles </th>
								<th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Member for </th>
								<th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Last Access </th>
								<th className="umHeader col-lg-1 col-md-1 col-sm-3 col-xs-3"> Operations </th>
							</tr>
							</thead>
							<tbody className="noLRPad">
								{ this.usersListData().map( (usersData)=>{
									return <UMUsers key={usersData._id} usersDataValues={usersData} id={FlowRouter.getParam("id")}/>
								  }) 
								}
							</tbody>
						</table>
					</div>
					</div>
				</div>
			  </div>
			</div>

			</section>


	    );

	} 

}