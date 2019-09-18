import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAdd_State extends TrackerReact(Component) {
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
	editState(event){
	  event.preventDefault();
      var stateId    = event.target.id;  
      var stateName  = $("input[name="+stateId+"-Namestate]").val();

      Meteor.call('updateState', this.state.stateName, stateName,
                function(error, result) { 
                    if (error) {
                        swal("Oops....","State Not Updated !!!",'error');
                    } 
                    else {
                    	swal("State Updated Successfully!!!",'success');
                    }
                }


        );	

	}

	delState(event){
	  event.preventDefault();
	  Meteor.call('deleteState', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    }  
                    
                });	
	}

	handleStateChange(event){
	    this.setState({value: event.target.value});
	}

	 handleStateSubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    stateName: this.props.StateDataValues.stateName,
	  };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleStateSubmit = this.handleStateSubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td className="rolelst"> {this.props.StateDataValues.stateName}</td>			
					<td className="roletbl"> 
						<button className="editrole fa fa-pencil-square-o editbtns"  data-toggle="modal" data-target={`#editstate-${this.props.dataindex}`} ></button>						
						<div id={`editstate-${this.props.dataindex}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button"  className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit State</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>State Name*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-Namestate`} defaultValue={`${this.state.stateName}`} onChange={this.handleStateChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editState.bind(this)} id={this.props.dataindex} className="btn btn-primary submit" data-dismiss="modal">Edit State</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						        <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
						      </div>
						    </div>

						  </div>
						</div>
						&nbsp;&nbsp;
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger" data-toggle="modal" data-target={`#delstate-${this.props.dataindex}`}></button>

						 <div className="modal fade" id={`delstate-${this.props.dataindex}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete State</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The State will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delState.bind(this)} id={this.props.dataindex} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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