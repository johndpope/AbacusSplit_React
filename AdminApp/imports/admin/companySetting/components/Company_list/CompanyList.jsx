import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';

export default class CompanyList extends TrackerReact(Component) {
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
    delcompany(event){
    	event.preventDefault();    	
		var targetedcompanyID = event.currentTarget.id;
		// console.log("companyId=",targetedcompanyID);
       	
       	Meteor.call('removeCompany', targetedcompanyID);
    }

  //   editLocation(event){
  //   	event.preventDefault();
  //   	$(".CLcompanyLocation").val(this.props.companyLocationDataVales.companyLocation);
  //       $(".CLcompanyAddress").val(this.props.companyLocationDataVales.companyAddress);
  //       $(".CLcompanyAddress2").val(this.props.companyLocationDataVales.companyAddress2);
  //       $(".CLcompanyPincode").val(this.props.companyLocationDataVales.companyPincode);
  //       $(".CLcompanyCity").val(this.props.companyLocationDataVales.companyCity);
  //       $(".CLcompanyState").val(this.props.companyLocationDataVales.companyState);
  //       $(".CLcompanyCountry").val(this.props.companyLocationDataVales.companyCountry);  
  //       $(".companyMail").val(this.props.companyLocationDataVales.companyMail);  
  //       $(".companyNo").val(this.props.companyLocationDataVales.companyNumber);  
  //       $(".companyAltNo").val(this.props.companyLocationDataVales.companyAltNumber);  
  //       if ($(".compLocation").text("Submit"))
  //     	{			
  //       	$(".compLocation").html("Update");
  //     	}
  //     	// $('.CLcompanyAddress').prop('disabled', true);
  //     	Session.set('location',this.props.companyLocationDataVales.companyLocation);
  //   }

	render(){

       return(
			<tr>
				<td className="branchtd"> {this.props.companyDataVales.companyName}</td>			
				<td className="branchtd"> {this.props.companyDataVales.companyEmail}</td>			
				<td className="branchtd"> {this.props.companyDataVales.companyContactNumber}</td>			
				<td className="branchtd"> 
					{/*<button onClick={this.editLocation.bind(this)} className="btn-primary editInfo fa fa-pencil-square-o editbtns2" title="Edit Branch Details"></button>&nbsp;	*/}
					<button className= "btn-danger locationDelete fa fa-trash delIcon detailsCenter editbtns2" data-toggle="modal" data-target={`#delcompanylst-${this.props.companyDataVales.companyName}`} title="Delete Branch Details"></button>	
					<div className="modal fade" id={`delcompanylst-${this.props.companyDataVales.companyName}`} role="dialog">
					    <div className="modal-dialog modal-sm">
					      <div className="modal-content">
					        <div className="modal-header">
					          <button type="button" className="close" data-dismiss="modal">&times;</button>
					          <h4 className="modal-title">Delete Company Info</h4>
					        </div>
					        <div className="modal-body">
					          <p><b>Are you sure you want to continue?.</b></p>
					        </div>
					        <div className="modal-footer">
					          <button  onClick={this.delcompany.bind(this)} id={this.props.companyDataVales._id} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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