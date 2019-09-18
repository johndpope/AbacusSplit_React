import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';

export default class CompanyTaxList extends TrackerReact(Component) {
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

    delTax(event){
    	event.preventDefault();
    	var selectedTax = this;
		var targetedID = event.currentTarget.id;
       	
       	Meteor.call('removeTaxDetails', targetedID);
    }

    editTax(event){
    	event.preventDefault();
    	var targetedID = event.currentTarget.id;
    	$(".taxType").val(this.props.companyTaxDataVales.taxType);
    	$(".hsn").val(this.props.companyTaxDataVales.hsn);
    	$(".sgst").val(this.props.companyTaxDataVales.sgst);
    	$(".cgst").val(this.props.companyTaxDataVales.cgst);
    	$(".igst").val(this.props.companyTaxDataVales.igst);
        $(".effectiveFrom").val(this.props.companyTaxDataVales.effectiveFrom);
        if ($(".companyTaxSubmit").text("Submit"))
      	{			
        	$(".companyTaxSubmit").html("Update");
      	}
      	$('.taxType').prop('disabled', true);
      	Session.set('taxType',this.props.companyTaxDataVales.taxType);
      	Session.set('targetedID',targetedID);
    }

	render(){
        return(
			<tr>
				<td> {this.props.companyTaxDataVales.taxType}</td>			
				<td> {this.props.companyTaxDataVales.hsn}</td>			
				<td> {this.props.companyTaxDataVales.sgst}</td>			
				<td> {this.props.companyTaxDataVales.cgst}</td>			
				<td> {this.props.companyTaxDataVales.igst}</td>			
				<td> {this.props.companyTaxDataVales.effectiveFrom}</td>			
				<td> 
					<button onClick={this.editTax.bind(this)} id={this.props.companyTaxDataVales.index} className="editTax fa fa-pencil-square-o btn-primary editbtns2"></button>&nbsp;	
					<button className= "taxDelete fa fa-trash delIcon detailsCenter btn-danger editbtns2" data-toggle="modal" data-target={`#del-${this.props.companyTaxDataVales.taxType}`}></button>
					 <div className="modal fade" id={`del-${this.props.companyTaxDataVales.taxType}`} role="dialog">
					    <div className="modal-dialog modal-sm">
					      <div className="modal-content">
					        <div className="modal-header">
					          <button type="button" className="close" data-dismiss="modal">&times;</button>
					          <h4 className="modal-title">Delete Company Location</h4>
					        </div>
					        <div className="modal-body">
					          <p><b>Are you sure you want to continue?.</b></p>
					        </div>
					        <div className="modal-footer">
					          <button  onClick={this.delTax.bind(this)} id={this.props.companyTaxDataVales.index} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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