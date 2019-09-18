import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {StatusSettings} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAdd_ContactStatus extends TrackerReact(Component) {
	componentDidMount(){
		
		if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
	      // console.log("I am appended!");
	      var adminLte = document.createElement("script");
	      adminLte.type = "text/javascript";
	      adminLte.src = "/js/adminLte.js";
	      adminLte.setAttribute('id','adminLte');
	      $("body").append(adminLte);
	    }
	}
	editStatus(event){
	  event.preventDefault();
      var statusId    = event.target.id;  
      var statusName  = $("input[name="+statusId+"-Namestatus]").val();

      Meteor.call('updateStatus', this.state.statusName, statusName,
                function(error, result) { 
                    if (error) {                      
                        swal("Oops....","Status Not Updated !!!",'error');
                    } 
                    else {
                    	swal("Status Updated Successfully!!!",'success');
                    }
                }


        );	

	}

	delStatus(event){
	  event.preventDefault();
	  Meteor.call('deleteStatus', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    }  
                    
                });	
	}

	handlestatusChange(event){
	    this.setState({value: event.target.value});
	}

	 handlestatusSubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    statusName: this.props.StatusDataValues,
	  };

    this.handlestatusChange = this.handlestatusChange.bind(this);
    this.handlestatusSubmit = this.handlestatusSubmit.bind(this);
	}

	render(){
       return(
				<tr>
					<td className="rolelst rolelst1"> {this.props.StatusDataValues}</td>			
					<td className="roletbl roletble1"> 
						{/*<button className="editrole fa fa-pencil-square-o editbtns editbtnshvr editbtns1"  data-toggle="modal" data-target={`#editstatus-${this.props.dataindex}`} ></button>						
						<div id={`editstatus-${this.props.dataindex}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button"  className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit Status</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>Status Name*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-Namestatus`} defaultValue={`${this.state.statusName}`} onChange={this.handlestatusChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editStatus.bind(this)} id={this.props.dataindex} className="btn btn-primary submit" data-dismiss="modal">Edit Status</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						        <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
						      </div>
						    </div>

						  </div>
						</div>*/}
						&nbsp;&nbsp;
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#delt-${this.props.dataindex}`}></button>
						 <div className="modal fade" id={`delt-${this.props.dataindex}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete Status</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The status will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delStatus.bind(this)} id={this.props.dataindex} type="button" data-categoryname={this.props.StatusDataValues.statusName} data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
				    			  <button type="button" data-dismiss="modal" className="btn btn-primary ">Cancel</button>
						        </div>
						      </div>
						    </div>
						  </div>
					</td>		
				</tr>
	    );

	} 

}