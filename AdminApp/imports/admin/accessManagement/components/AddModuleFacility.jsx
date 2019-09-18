/*  
	COMPONENT:  Add Module  
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will add Modules. 

*/
import React, { Component } from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import {AccessManagementMaster} from '../api/accessManagementMaster.js';
import ModuleRegistration from './ModuleRegistration.jsx';

class AddModuleFacility extends Component  {

	constructor(props){
		super(props);
		this.state={
			moduleFacilityName : '',
			moduleName         : '',
			facilityPermission : 'waitingforResult',
		}
		this.handleChange = this.handleChange.bind(this);
		// this.handleChangeFacility = this.handleChangeFacility.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","AccessManagement","AddModuleFacility",(err,res)=>{
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
		var moduleName = this.refs.moduleName.value;
		if(moduleName){
			var id =  $(event.target).find('option:selected').attr('id');
			FlowRouter.go('/admin/addFacilities/'+id);
		}
		const target = event.target;
		const name   = target.name;
		
		this.setState({
		  [name]: event.target.value,
		  moduleName : moduleName,
		});

		if(moduleName == '+ Add New Module'){
   			$('#myModal').modal('show');
		}
		
  	}

  	openModuleInModal(event){
   		var id = $(event.target).attr('id');
   		FlowRouter.go('/admin/addFacilities/'+id);
   		$('#myModal').modal('show');
   		
   	}
   	addModule(){
   		FlowRouter.go('/admin/addFacilities/');
   		$('#myModal').modal('show');
   		$('#moduleName').val();
   	}

  	addModuleFacilityName(e){
  		e.preventDefault();
  		var moduleFacilityName = this.refs.moduleFacilityName.value.trim();
  		if(moduleFacilityName){
	  		Meteor.call("addModuleFacilityName",moduleFacilityName,FlowRouter.getParam('id'),(err,res)=>{
	  			if(err){
	  				swal("Somthing went wrong","","warning");
	  			}else{
	  				this.refs.moduleFacilityName.value = '';

	  				swal("Facility Added successfully","","success");

	  			}
	  		});
  		}
  	}

  	removeModule(event){
  		event.preventDefault();
  		var removeModuleId = $(event.target).attr('id');
  		swal({
			  title              : 'Are you sure?',
			  text               : 'You will not be able to recover this Record!',
			  type               : 'warning',
			  showCancelButton   : true,
			  confirmButtonColor : '#dd6b55',
			  cancelButtonColor  : '#d44',
			  confirmButtonText  : 'Yes, Delete it!',
			  cancelButtonText   : 'No, Keep it',
			  closeOnConfirm     : false
			}, function() {
				Meteor.call("removeModule",removeModuleId,(error,result)=>{
					if(error){

					}else{
						swal(
					    'Module has been Deleted',
					    '',
					    'success'
					  );
					
					}
			});
  			
  		});
   	}

   	removeModuleFacility(event){
   		event.preventDefault();
  		var removeFacilityId = $(event.target).attr('id');
  		var removeFacilityIndex = $(event.target).attr('name');
  		swal({
					  title              : 'Are you sure?',
					  text               : 'You will not be able to recover this Record!',
					  type               : 'warning',
					  showCancelButton   : true,
					  confirmButtonColor : '#dd6b55',
					  cancelButtonColor  : '#d44',
					  confirmButtonText  : 'Yes, Delete it!',
					  cancelButtonText   : 'No, Keep it',
					  closeOnConfirm     : false
					}, function() {
						Meteor.call("removeModuleFacility",removeFacilityId,removeFacilityIndex,(error,result)=>{
							if(error){

							}else{
								swal(
							    'Module Facility has been Deleted',
							    '',
							    'success'
							  );
							
							}
					});
  			
  		});
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
				            <h3 className="box-title">Add Module Facility</h3>
				            </div>
				            
			            	<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 moduleNMWrap">
								<label>Module Name : </label> <span className="moduleNameAM">{this.props.accessManagementCurData.moduleName}</span>
							</div>
							<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 AMWrap">

								<form onSubmit={this.addModuleFacilityName.bind(this)}>
									<div className="col-lg-5 col-lg-offset-1 col-md-5 col-md-offset-1 col-sm-5 col-sm-offset-1 col-xs-9">
										{/*<i className="fa fa-plus-circle addModuleIcon" title="Click to add more modules" data-toggle="modal" data-target="#myModal" aria-hidden="true"></i>*/}
										<i className="fa fa-plus-circle addModuleIcon" title="Click to add more modules" onClick={this.addModule.bind(this)} aria-hidden="true"></i>
										<span className="blocking-span"> 
											<select type="text" name="moduleName" ref="moduleName"  id="moduleName" onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText selectAMDropDown"  title="Select Module" required>
												<option disabled value="">-- Select Module --</option>
												{this.props.accessManagementData.map((AMData,index)=>{
													return <option key={index} id={AMData._id}>{AMData.moduleName}</option>
												  })}
												{/*<option className="addModuleOption">+ Add New Module</option>*/}
											</select>
											<span className="floating-label floating-label-Date">Select Module</span>					   								   			
										</span>
										
									</div>
									<div id="myModal" className="modal fade" role="dialog">
										  <div className="modal-dialog">

										   
										    <div className="modal-content">
										      <div className="modal-header">
										        <button type="button" className="close" data-dismiss="modal">&times;</button>
										        <h4 className="modal-title">Add Module</h4>
										      </div>
										      <div className="modal-body AM-modal-body">
										        <ModuleRegistration id={FlowRouter.getParam('id')}/>
										      </div>
										    </div>

										  </div>
										</div>
									<div className="col-lg-5  col-md-5 col-sm-5 col-xs-9 ">
										<span className="blocking-span"> 
											<input type="text" name="moduleFacilityName" ref="moduleFacilityName" value={this.state.handleChange} onChange={this.handleChangeFacilityZ} placeholder="Module Facility Name" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" pattern="^([a-zA-Z][a-zA-Z0-9-\s]*)$" title="Enter Module" required/>
											{/*<span className="floating-label">Module Facility Name</span>					   			*/}
										</span>
										
									</div>
									<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-9 AM-btn-Wrap">
										<button type="submit" className="btn btn-primary"> Submit </button>
									</div>
								</form>
							</div>
							<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 AMFTable">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable AMFTable">
				              		<table className="table table-striped formTable tab-Table">
									    <thead className="tableHeader">
									        <tr>
									            <th className="col-lg-1">Sr.No</th>
									            <th className="col-lg-3">Module Name </th>
									            <th className="col-lg-3">Facility Name </th>
									            <th className="col-lg-3"> Action </th>
									            
									        </tr>
									    </thead>
									    {this.props.accessManagementData.length > 0 ?
										    <tbody>

										     	{this.props.accessManagementData.map((facility,index)=>{
										     	return <tr key={index}>
										     			<td className="moduleName-AMF">{index + 1}</td>
										     			<td className="moduleName-AMF">{facility.moduleName}</td>
									     				
									     					 <td className="AMFTableTD">
									     					 {facility.facilities.map((facilityArrayVal,indexxx)=>{
									     								return <table className="nestedTable" key={indexxx}>
										     								<tr>
										     						   			<td className="facilityInnerTD col-lg-10 col-md-10 col-sm-10">
										     						   				{facilityArrayVal.facilityName} 
										     						   			</td>
										     						   			<td className="F-DeleteBtn"> 
										     						   				<i className="fa fa-trash deleteIcon" title="Delete Facility" id={facility._id} name={indexxx} onClick={this.removeModuleFacility.bind(this)}></i>
										     						   			</td>
										     						   		</tr>
									     						   		</table>
									     						   		})}
									     					       </td>
									     				
										     			{/*<td>{moment(facility.createdAt).format("DD/MM/YYYY")}</td>*/}
										     			<td className="moduleName-AMF">
										     				
										     				<i className="fa fa-edit editIcon" title="Edit Module Name" id={facility._id} onClick={this.openModuleInModal.bind(this)}></i>
										     				
										     				<i className="fa fa-trash deleteIcon" title="Delete Module" id={facility._id} onClick={this.removeModule.bind(this)}></i>
										
										     			</td>
										     		</tr>
										     		})
										     }
										    </tbody>
									    :
									    	<tbody className="OESDataNotAvailable">
								    			<tr>
								    				<td colSpan="4">"Facilities not yet added"</td>
								    			</tr>
								    		</tbody>
							    		}
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
			  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access.</h3>
		  		 </div>
		  	);
		}
	}
}

export default AddModuleFacilityContainer = withTracker (props=>{
	var MRId = FlowRouter.getParam('id');
	var postHandle = Meteor.subscribe("allAccessManagement");
	var loading = !postHandle.ready();
	var accessManagementCurData = AccessManagementMaster.findOne({"_id":MRId})||{};
	var accessManagementData = AccessManagementMaster.find({},{sort:{'createdAt':-1}}).fetch();
	$('.selectAMDropDown').val(accessManagementCurData.moduleName);
	if(accessManagementData){
		return{
			accessManagementData,
			accessManagementCurData,
		};
	}else{
		var accessManagementData = [];
		var accessManagementCurData  = '-';
		return{
			loading,
			accessManagementData,
			accessManagementCurData,
		};
	}
})(AddModuleFacility);