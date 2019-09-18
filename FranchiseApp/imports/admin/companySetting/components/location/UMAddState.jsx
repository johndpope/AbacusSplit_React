import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {StateSettings} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAddState extends TrackerReact(Component) {
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

	addState(event){
		  event.preventDefault();
	      var stateName   = $("input[name=stateName]").val();
	      var stateId    = $("input[name=stateName]").attr("id");
	      // console.log('roleName : ' + roleName);
	      // console.log('inputId : ' + inputId);
	      if (stateName.length < 4){
	      	swal("State Not Added correctly",'error');
	      }
	      else{
	      Meteor.call('addState', stateName,
	                function(error, result) { 
	                    if (error) {
	                        
	                        swal("State Not Added Successfully",'error');
	                    } //info about what went wrong 
	                    else {
	                         swal('"'+stateName+'"',"State Added Successfully");
	                    }//the _id of new object if successful
	                }


	        );
	      $("input[name=stateName]").val('');	
	  }

	}

	render(){
       return(
       			
       		<div>
		    	<form id="addroles" className="paddingLeftz noLRPad" onSubmit={this.addState.bind(this)}>
					<div className="form-group col-lg-12 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad addRolDiV">
						<span className="blocking-span">
							<input type="text" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" name="stateName" required/>
								<span className="floating-label">Enter State </span>
						</span>
					</div>
				    {/*<div className="form-group col-lg-6 col-md-4 col-xs-4 col-sm-4 addrolesBtn1 ">
						<button type="button"    className="btn btn-primary submit  addrolesBtnaddroll col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1" data-dismiss="modal">Add State</button>
					</div>*/}
				</form>											
			</div>
	    );
	} 

}