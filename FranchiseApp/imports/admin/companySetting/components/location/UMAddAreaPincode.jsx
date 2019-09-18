import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {AreaPincodeSettings} from '/imports/admin/companySetting/api/CompanySettingMaster.js';

export default class UMAddAreaPincode extends TrackerReact(Component) {
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

	addAreaPincode(event){
		  event.preventDefault();
		 
		  var locationValues = {
			"areaName" 		: $("input[name=areaName]").val(),
			"pincode" 		: $("input[name=pincode]").val(),			
		}		
	      if (locationValues.length < 4){
	      	swal("Area & pincode Not Added correctly",'error');
	      }
	      else{
	      Meteor.call('addAreaPincode',locationValues,
	                function(error, result) { 
	                    if (error) {
	                      
	                        swal("Area & pincode Not Added Successfully",'error');
	                    } 
	                    else {
	                         swal("Area & pincode Added Successfully");
	                    }
	                }


	        );
	      $("input[name=areaName]").val('');	
	      $("input[name=pincode]").val('');	
	  }

	}

	render(){
       return(       			
       		<div>
		    	<form id="areapin" className="paddingLeftz noLRPad" onSubmit={this.addAreaPincode.bind(this)} >
					<div className="form-group col-lg-6 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad addRolDiV">
						<span className="blocking-span">
							<input type="text" id= ""  className="rolesField form-control UMname inputText tmsUserAccForm" name="areaName" required/>
								<span className="floating-label">Enter Area </span>
						</span>
					</div>
					<div className="form-group col-lg-6 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad addRolDiV">
						<span className="blocking-span">
							<input type="text submit" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" name="pincode" required/>
								<span className="floating-label">Enter Pincode </span>
						</span>
					</div>
					
				    <div className="form-group col-lg-6 col-md-4 col-xs-4 col-sm-4 addrolesBtn1 ">
{/*						<button type="button" className="btn btn-primary submit  addrolesBtnaddroll col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1" data-dismiss="modal">Add Area & Pincode</button>
*/}					
				<input type="submit" value="submit" className=" hidden-lg  hidden-sm  hidden-xs  hidden-md"/>
				</div>
				</form>											
			</div>
	    );
	} 

}