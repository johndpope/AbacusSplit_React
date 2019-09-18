import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAdd_ContactLeadSource extends TrackerReact(Component) {
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
	editLeadSource(event){
	  event.preventDefault();
      var leadsourceId    = event.target.id;  
      var leadsourceName  = $("input[name="+leadsourceId+"-Nameleadsource]").val();

      Meteor.call('updateLeadSource', this.state.leadsourceName, leadsourceName,
                function(error, result) { 
                    if (error) {                      
                        swal("Oops....","Lead Source Not Updated !!!",'error');
                    } 
                    else {
                    	swal("Lead Source Updated Successfully!!!",'success');
                    }
                }


        );	

	}

	delLeadSource(event){
	  event.preventDefault();
	  Meteor.call('deleteLeadSource', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    }  
                    
                });	
	}

	handleleadsourceChange(event){
	    this.setState({value: event.target.value});
	}

	 handleleadsourceSubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    leadsourceName: this.props.LeadSourceDataValues,
	  };

    this.handleleadsourceChange = this.handleleadsourceChange.bind(this);
    this.handleleadsourceSubmit = this.handleleadsourceSubmit.bind(this);
	}

	render(){
       return(
				<tr>
					<td className="rolelst rolelst1"> {this.props.LeadSourceDataValues}</td>			
					<td className="roletbl roletble1"> 
						{/*<button className="editrole fa fa-pencil-square-o editbtns editbtnshvr editbtns1"  data-toggle="modal" data-target={`#editlead-${this.props.dataindex}`} ></button>
						<div id={`editlead-${this.props.dataindex}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button"  className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit Lead Source</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>Lead Source Name*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-Nameleadsource`} defaultValue={`${this.state.leadsourceName}`} onChange={this.handleleadsourceChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editLeadSource.bind(this)} id={this.props.dataindex} className="btn btn-primary submit" data-dismiss="modal">Edit Lead Source</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						        <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
						      </div>
						    </div>

						  </div>
						</div>
*/}						&nbsp;&nbsp;
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#delsrc-${this.props.dataindex}`}></button>

						 <div className="modal fade" id={`delsrc-${this.props.dataindex}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete Lead Source</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The lead source will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delLeadSource.bind(this)} id={this.props.dataindex} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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