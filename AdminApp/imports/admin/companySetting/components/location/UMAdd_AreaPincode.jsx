import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAdd_AreaPincode extends TrackerReact(Component) {
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
	editAreaPincode(event){
	  event.preventDefault();
      var areaPincodeId    = event.target.id;  
      var areaName  = $("input[name="+areaPincodeId+"-Namearea]").val();
      var pincode  = $("input[name="+areaPincodeId+"-Namepincode]").val();
      // console.log("areapincode=",areaName,pincode);

      Meteor.call('updateAreaPincode', this.state.areaName,this.state.pincode, areaName,pincode,
                function(error, result) { 
                    if (error) {
                       
                        swal("Oops....","Area & pincode Not Updated !!!",'error');
                    } 
                    else {
                    	swal("Area & pincode Updated Successfully!!!",'success');
                    }
                }


        );	

	}

	delAreaPincode(event){
	  event.preventDefault();
	  Meteor.call('deleteAreaPincode', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    }  
                    
                });	
	}

	handleAreaPincodeChange(event){
	    this.setState({value: event.target.value});
	}

	 handleAreaPincodeSubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    areaName: this.props.AreaPincodeValues.areaName,
	    pincode: this.props.AreaPincodeValues.pincode,
	  };

    this.handleAreaPincodeChange = this.handleAreaPincodeChange.bind(this);
    this.handleAreaPincodeSubmit = this.handleAreaPincodeSubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td className="rolelst"> {this.props.AreaPincodeValues.areaName}</td>			
					<td className="rolelst"> {this.props.AreaPincodeValues.pincode}</td>			
					<td className="roletbl"> 
						<button className="editrole fa fa-pencil-square-o editbtns"  data-toggle="modal" data-target={`#editareapincode-${this.props.dataindex}`} ></button>						
						<div id={`editareapincode-${this.props.dataindex}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button"  className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit Area & Pincode</h4>
						      </div>
						      <div className="modal-body areapincodemodalbody col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>Area*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-Namearea`} defaultValue={`${this.state.areaName}`} onChange={this.handleAreaPincodeChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>Pincode*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-Namepincode`} defaultValue={`${this.state.pincode}`} onChange={this.handleAreaPincodeChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editAreaPincode.bind(this)} id={this.props.dataindex} className="btn btn-primary submit" data-dismiss="modal">Edit Area & Pincode</button>
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
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger" data-toggle="modal" data-target={`#delareapincode-${this.props.dataindex}`}></button>

						 <div className="modal fade" id={`delareapincode-${this.props.dataindex}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete Area & Pincode</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The area & pincode will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delAreaPincode.bind(this)} id={this.props.dataindex} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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