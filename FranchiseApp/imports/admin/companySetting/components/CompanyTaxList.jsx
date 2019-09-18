import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class CompanyTaxList extends TrackerReact(Component) {
    

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
        $(".applicableTax").val(this.props.companyTaxDataVales.applicableTax);
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
					<td> {this.props.companyTaxDataVales.applicableTax}</td>			
					<td> {this.props.companyTaxDataVales.effectiveFrom}</td>			
					<td> {this.props.companyTaxDataVales.effectiveTo}</td>			
					<td> 
						<button onClick={this.editTax.bind(this)} id={this.props.companyTaxDataVales.index} className="editTax fa fa-pencil-square-o"></button>	
						<button className= "taxDelete fa fa-trash delIcon detailsCenter" data-toggle="modal" data-target={`#del-${this.props.companyTaxDataVales.taxType}`}></button>

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