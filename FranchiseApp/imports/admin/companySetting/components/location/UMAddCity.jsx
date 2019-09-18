import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {CitySettings} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAddCity extends TrackerReact(Component) {
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

	addCity(event){
		  event.preventDefault();
	      var cityName   = $("input[name=cityName]").val();
	      var cityId    = $("input[name=cityName]").attr("id");
	      if (cityName.length < 4){
	      	swal("City Not Added correctly",'error');
	      }
	      else{
	      Meteor.call('addCity',cityName,
	                function(error, result) { 
	                    if (error) {
	                      
	                        swal("City Not Added Successfully",'error');
	                    } 
	                    else {
	                         swal('"'+cityName+'"',"CityAdded Successfully");
	                    }
	                }
	        );
	      $("input[name=cityName]").val('');	
	  }
	}

	render(){
       return(       			
       		<div>
		    	<form id="addroles" className="paddingLeftz noLRPad" onSubmit={this.addCity.bind(this)} >
					<div className="form-group col-lg-12 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad addRolDiV">
						<span className="blocking-span">
							<input type="text" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" name="cityName" required/>
								<span className="floating-label">Enter City </span>
						</span>
					</div>
				    {/*<div className="form-group col-lg-6 col-md-4 col-xs-4 col-sm-4 addrolesBtn1 ">
						<button type="button"   className="btn btn-primary submit  addrolesBtnaddroll col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1" data-dismiss="modal">Add City</button>
					</div>*/}
				</form>											
			</div>
	    );
	} 

}