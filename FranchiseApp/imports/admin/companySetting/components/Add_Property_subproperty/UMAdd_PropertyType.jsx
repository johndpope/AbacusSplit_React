import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAdd_PropertyType extends TrackerReact(Component) {
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
	editPropertyType(event){
	  event.preventDefault();
      var propertyTypeId    = event.target.id;  
      var propertytypeName  = $("input[name="+propertyTypeId+"-NamepropertyType]").val();
      Meteor.call('updatePropertyType', this.state.propertytypeName, propertytypeName,
                function(error, result) { 
                    if (error) {                        
                        swal("Oops....","Property Type Not Updated !!!",'error');
                    } 
                    else {
                    	swal("Property Type Updated Successfully!!!",'success');
                    }
                }


        );	

	}

	delPropertyType(event){
	  event.preventDefault();
	  Meteor.call('deletePropertyType', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    }  
                    
                });	
	}

	handlePropertyTypeChange(event){
	    this.setState({value: event.target.value});
	}

	 handlePropertyTypeSubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    propertytypeName: this.props.PropertyTypeDataValues.propertytypeName,
	  };

    this.handlePropertyTypeChange = this.handlePropertyTypeChange.bind(this);
    this.handlePropertyTypeSubmit = this.handlePropertyTypeSubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td className="rolelst"> {this.props.PropertyTypeDataValues.propertytypeName}</td>			
					<td className="roletbl"> 
						<button className="editrole fa fa-pencil-square-o editbtns editbtnshvr editbtns1"  data-toggle="modal" data-target={`#editproperty-${this.props.dataindex}`} ></button>

						
						<div id={`editproperty-${this.props.dataindex}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">

						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button"  className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit Property Type</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>Property Type Name*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-NamepropertyType`} defaultValue={`${this.state.propertytypeName}`} onChange={this.handlePropertyTypeChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editPropertyType.bind(this)} id={this.props.dataindex} className="btn btn-primary submit" data-dismiss="modal">Edit Property Type</button>
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
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger editbtns1 editbtnred" data-toggle="modal" data-target={`#delproperty-${this.props.dataindex}`}></button>

						 <div className="modal fade" id={`delproperty-${this.props.dataindex}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete Property Type</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The property type will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delPropertyType.bind(this)} id={this.props.dataindex} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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