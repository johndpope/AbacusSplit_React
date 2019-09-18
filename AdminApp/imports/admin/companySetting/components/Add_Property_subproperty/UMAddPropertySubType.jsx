import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {PropertySubTypeSettings} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAddPropertySubType extends TrackerReact(Component) {
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

	addPropertySubType(event){
		  event.preventDefault();
	      var propertysubTypeName   = $("input[name=propertysubTypeName]").val();
	      var propertySubTypeNameId    = $("input[name=propertysubTypeName]").attr("id");
	      // console.log('roleName : ' + roleName);
	      // console.log('inputId : ' + inputId);
	      if (propertysubTypeName.length < 4){
	      	swal("Propert Sub Type Not Added correctly",'error');
	      }
	      else{
	      Meteor.call('addPropertySubType', propertysubTypeName,
	                function(error, result) { 
	                    if (error) {
	                       
	                        swal("Property Sub Type Not Added Successfully",'error');
	                    } //info about what went wrong 
	                    else {
	                         swal('"'+propertysubTypeName+'"',"Property Sub Type Added Successfully");
	                    }//the _id of new object if successful
	                }


	        );
	      $("input[name=propertysubTypeName]").val('');	
	  }

	}

	render(){
       return(
       			
       		<div>
		    	<form id="addroles" className="paddingLeftz noLRPad" onSubmit={this.addPropertySubType.bind(this)}>
					<div className="form-group col-lg-12 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad addRolDiV">
						<span className="blocking-span">
							<input type="text" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" name="propertysubTypeName" required/>
								<span className="floating-label">Enter Property Sub Type </span>
						</span>
					</div>
				    {/*<div className="form-group col-lg-6 col-md-4 col-xs-4 col-sm-4 addrolesBtn1 ">
						<button type="button"    className="btn btn-primary submit  addrolesBtnaddroll col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1" data-dismiss="modal">Add Property Sub Type</button>
					</div>*/}
				</form>											
			</div>
	    );
	} 

}