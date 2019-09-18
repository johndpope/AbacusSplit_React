import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';

export default class CompanyBankList extends TrackerReact(Component) {
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

    delBank(event){
    	event.preventDefault();
		var targetedID = event.currentTarget.id;
       	
       	Meteor.call('removeBankDetails', targetedID);
    }

    editBank(event){
    	event.preventDefault();
    	$(".accHolderName").val(this.props.companyBankDataVales.accHolderName);
    	$(".accNickName").val(this.props.companyBankDataVales.accNickName);
    	$(".accType").val(this.props.companyBankDataVales.accType);
        $(".bankName").val(this.props.companyBankDataVales.bankName);
        $(".branchName").val(this.props.companyBankDataVales.branchName);
        $(".accNumber").val(this.props.companyBankDataVales.accNumber);
        $(".ifscCode").val(this.props.companyBankDataVales.ifscCode);
      	$('.ifscCode').prop('disabled', true);
      	if ($(".bankDetails").text("Submit"))
      	{			
        	$(".bankDetails").html("Update");
      	}
      	Session.set('bankDetail',this.props.companyBankDataVales.ifscCode);
    }

	render(){

       return(
				<tr>
					<td> {this.props.companyBankDataVales.accHolderName}</td>			
					{/*<td> {this.props.companyBankDataVales.accNickName}</td>			
					<td> {this.props.companyBankDataVales.accType}</td>*/}			
					<td> {this.props.companyBankDataVales.bankName}</td>			
					<td> {this.props.companyBankDataVales.branchName}</td>			
					<td> {this.props.companyBankDataVales.accNumber}</td>			
					<td> {this.props.companyBankDataVales.ifscCode}</td>			
					<td> 
						<button onClick={this.editBank.bind(this)} className="editInfo fa fa-pencil-square-o btn-primary editbtns2"></button>&nbsp;	
						<button className= "locationDelete fa fa-trash delIcon detailsCenter btn-danger editbtns2" data-toggle="modal" data-target={`#del-${this.props.companyBankDataVales.ifscCode}`}></button>

						 <div className="modal fade" id={`del-${this.props.companyBankDataVales.ifscCode}`} role="dialog">
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
						          <button  onClick={this.delBank.bind(this)} id={this.props.companyBankDataVales.index} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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