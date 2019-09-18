import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAdd_City extends TrackerReact(Component) {
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
	editCity(event){
	  event.preventDefault();
      var cityId    = event.target.id;  
      var cityName  = $("input[name="+cityId+"-Namecity]").val();

      Meteor.call('updateCity', this.state.cityName, cityName,
                function(error, result) { 
                    if (error) {
                       
                        swal("Oops....","City Not Updated !!!",'error');
                    } 
                    else {
                    	swal("City Updated Successfully!!!",'success');
                    }
                }
        );	

	}

	delCity(event){
	  event.preventDefault();
	  Meteor.call('deleteCity', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    }  
                    
                });	
	}

	handleCityChange(event){
	    this.setState({value: event.target.value});
	}

	 handleCitySubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    cityName: this.props.CityDataValues.cityName,
	  };

    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleCitySubmit = this.handleCitySubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td className="rolelst"> {this.props.CityDataValues.cityName}</td>			
					<td className="roletbl"> 
						<button className="editrole fa fa-pencil-square-o editbtns"  data-toggle="modal" data-target={`#editcity-${this.props.dataindex}`} ></button>						
						<div id={`editcity-${this.props.dataindex}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button"  className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit City</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>City Name*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.dataindex}-Namecity`} defaultValue={`${this.state.cityName}`} onChange={this.handleCityChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editCity.bind(this)} id={this.props.dataindex} className="btn btn-primary submit" data-dismiss="modal">Edit City</button>
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
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter editbtns btn-danger" data-toggle="modal" data-target={`#delcity-${this.props.dataindex}`}></button>

						 <div className="modal fade" id={`delcity-${this.props.dataindex}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete City</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The City will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delCity.bind(this)} id={this.props.dataindex} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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