import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAddContactStatus extends TrackerReact(Component) {
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

	addContactStatus(event){
		  event.preventDefault();
	      var statusName   = $("input[name=statusName]").val();
	      var inputStatusId    = $("input[name=statusName]").attr("id");
	      // console.log('roleName : ' + roleName);
	      // console.log('inputId : ' + inputId);
	      if (statusName.length < 4){
	      	swal("Contact Status Not Added correctly",'error');
	      }
	      else{
	      Meteor.call('addStatus', statusName,
	                function(error, result) { 
	                    if (error) {

	                       
	                        swal("Contact status Not Added Successfully",'error');
	                    } //info about what went wrong 
	                    else {
	                    	 console.log("insdie else");
	                         swal('"'+statusName+'"',"Contact Status Added Successfully");
	                    }//the _id of new object if successful
	                }


	        );
	      $("input[name=statusName]").val('');	
	  }

	}

	render(){
       return(
       			
       		<div>
		    	<form id="addroles" className="paddingLeftz noLRPad" onSubmit={this.addContactStatus.bind(this)}>
					<div className="form-group col-lg-12 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad addRolDiV">
						<span className="blocking-span">
							<input type="text" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" name="statusName" required/>
								<span className="floating-label">Enter Contact Status </span>
						</span>
					</div>
				    {/*<div className="form-group col-lg-6 col-md-4 col-xs-4 col-sm-4 addrolesBtn1 ">
						<button type="button"    className="btn btn-primary submit  addrolesBtnaddroll col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1" data-dismiss="modal">Add Contact Status</button>
					</div>*/}
				</form>											
			</div>
	    );
	} 

}