/*  
	COMPONENT:  Assign Modules & Facilities  
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will Modules & Facilities. 

*/
import {Meteor} from 'meteor/meteor';
import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import {Session} from 'meteor/meteor';
import {AccessManagementMaster} from '../api/accessManagementMaster.js';
import {AccessPermissionManagement} from '../api/accessPermissionManagement.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

class AssignPermissionToModules extends Component  {

	constructor(props){
		super(props);
		this.state={
			roleType : '',
			roleName : '',
			facilityPermission : 'waitingforResult',
			'subscription': {
				allPermission : Meteor.subscribe('allAccessPermission'),
			}
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","AccessManagement","AssignPermissions",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res==true){
		          this.setState({
		             facilityPermission : res,
		          });
		        }else if(res==false){
		          this.setState({
		             facilityPermission : res,
		          });
		        }
			}
		});
  	}

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

  	handleChange(event){
		var target = event.target;
		var name = target.name;
		this.setState({
			[name]: event.target.value,
		});
	}

  	getRole(event){
  		var roleName = this.refs.roleName.value;
  		// console.log("role name",roleName);
  		this.setState({
  			roleName : roleName
  		});
  		FlowRouter.go('/admin/AssignPermissionstoModules/'+roleName);
  		
  		
  	}
  	componentDidUpdate(){
		var accessPermissions = AccessPermissionManagement.find({}).fetch();
		if(accessPermissions){
			accessPermissions.map((allAcceessPermission,index)=>{
				allAcceessPermission.moduleFacilityPermission.map((moduleFacilities, facIndex)=>{
						if(moduleFacilities.rolepermissionId!='')
						$('.'+moduleFacilities.rolepermissionId).attr('checked',true);
					
				});
			});
		}
  	}

  	showwhenClick(){
  		var accessPermissions = AccessPermissionManagement.find({}).fetch();
			if(accessPermissions){
				accessPermissions.map((allAcceessPermission,index)=>{
					allAcceessPermission.moduleFacilityPermission.map((moduleFacilities, facIndex)=>{
						if(moduleFacilities.rolepermissionId!=''){
							$('.'+moduleFacilities.rolepermissionId).attr('checked',true);
						}
					});
				});
			}
  	}

  	getAMcheckboxId(event){
  		var uniqVal  = event.target.getAttribute('class');
  		var facilityName = event.target.getAttribute('id');
  		var moduleId     = event.target.getAttribute('data-id'); 
  		Meteor.call("addRolesAccessPermission",moduleId,facilityName,uniqVal,(err,res)=>{
  			if(err){
  				console.log(err);
  			}else{
  			this.showwhenClick();
  			location.reload();

  			}
  		});
  		
  	}

  	addRemoveAccessPermission(event){
  		var uniqVal = $(event.target).attr('class');
  		var sameId = $(event.target).attr('data-Idval');
  		var idArrayIndex = sameId.split('-');
  		var id = idArrayIndex[0];
  		var facilityIndex = idArrayIndex[1];
  		var facilityName = $(event.target).attr('id');
  		roleName = $(event.target).attr('name');

  		Meteor.call("addRemoveRolePermission",id,facilityName,roleName,facilityIndex,uniqVal);
  	}

	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Access Management</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                   <div className="box-header with-border">
				            <h3 className="box-title">Assign Permissions to Modules & Facilities</h3>
				            </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-5 col-lg-offset-7 col-md-5 col-md-offset-7 col-sm-5 col-sm-offset-7 col-xs-12 rolesList-AM">								
									<select type="text" name="roleName" ref="roleName" onChange={this.getRole.bind(this)} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 AMRoleSelect" title="Select Role">
													<option value=''>-- Select Role --</option>
													<option>Show All</option>
													{this.props.allRoles.map((roles,index)=>{
														return <option key={index}>{roles.name}</option>
													  })
													}
									</select>
								</div>
								<div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable AMFTable">
				              		<table className="table table-striped formTable " id="AM-Table">
									    <thead className="tableHeader tableHeader-AM">
									        <tr>
									            <th className="col-lg-1">Sr.No</th>
									            <th className="col-lg-4"> List of Modules & Facilities </th>
									            {this.props.defaultRoles.map((defaultRole,index)=>{
									            	return  <th className="col-lg-1" key={index}> {defaultRole.name}</th>
									            })}
									           
									        </tr>
									    </thead>
									    <tbody>
									    	{this.props.AMData.map((allAMData ,index)=>{
								    		return <tr key={index}>
								    					<td className="srNoAMTable">{index + 1}</td>
											    		<td className="AMTableTd">
											    			{allAMData.moduleName}
											    			{allAMData.facilities.map((facility, indexx)=>{
										    				return <table className="nestedTable nestedTable-AMTable" key={indexx}>
										     							<tr key={indexx}>
										     								<td className="col-lg-1">{index + 1 }.{indexx}</td>
										     								<td>{facility.facilityName}</td>
										     							</tr>
								     								</table>
											    			})}
											    		</td>
											    		{this.props.defaultRoles.map((defaultRole, index)=>{
											    			return <td className="srNoAMTable" key={index}>

													    			<input type="checkbox" className="hiddenCheckbox-AM" disabled/>

													    			{allAMData.facilities.map((facility, indexx)=>{
												    					return <table className="nestedTable nestedTable-AMTable" key={indexx}>
												    							{index == 0  ?
												     							<tr key={indexx}>
												     									<div className="checkbox AMCheckbox checkbox-success">
							 								                        		<input type="checkbox"/>
							 								                        		<label></label>
						 								                    			</div>
												     								
												     							</tr>
												     							: 
													     							index == 1 ? 
														     							<tr key={indexx}>
														     								<div className="checkbox AMCheckbox checkbox-success">
								 								                        		<input type="checkbox" className={allAMData._id+'-'+index+'-'+indexx} data-id={allAMData._id} id={facility.facilityName} onClick={this.getAMcheckboxId.bind(this)}/>
								 								                        		<label></label>
						 								                    				</div>
														     								
														     							</tr>
													     							:
														     							<tr key={indexx}>
													     									<div className="checkbox AMCheckbox checkbox-success">
							 								                        			<input type="checkbox" className={allAMData._id+'-'+index+'-'+indexx} id={facility.facilityName} name={index + 1} data-Idval={allAMData._id+'-'+indexx} data-Id={allAMData._id+'-'+(index + 1)} onClick={this.addRemoveAccessPermission.bind(this)}/>
							 								                        			<label></label>
						 								                    				</div>
														     							</tr>
													     							
												     							}
										     								</table>
													    			})}
											    					</td>
											    		})}

											    	</tr>
									    	})}
									    	
									    </tbody>
									</table>
								</div>
							</div>
						  </div>
					    </div>	
				      </div>		
					</div>
				  </section>
				</div>
			</div>
			);
		}else if (this.state.facilityPermission == false ){
			  	FlowRouter.go('/noAccesss')
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/Show%20All">click here </a>to assign permission</h3>
		  		 </div>
		  	);
		}
	}
}
export default AssignPermissionToModulesContainer = withTracker(props=>{
	var roleType = FlowRouter.getParam('roleType');

	var postHandle = Meteor.subscribe('rolefunction');
	var loading = !postHandle.ready();
	var allRoles = Meteor.roles.find({name:{$nin:['superAdmin','Anonymous User','Authenticated User','Admin']}}).fetch();
	if(roleType=="Show All"){
		var defaultRoles = Meteor.roles.find({name:{$nin:['superAdmin']}}).fetch();
	}else{
		var defaultRoles = Meteor.roles.find({name:{$in:['Anonymous User','Authenticated User','Admin',roleType]}}).fetch();
	}
	var AMHandle = Meteor.subscribe("allAccessManagement");
	var AMLoading = !AMHandle.ready();
	var AMData = AccessManagementMaster.find({}).fetch();
	return {
		allRoles,
		AMData,
		defaultRoles
	}
})(AssignPermissionToModules);