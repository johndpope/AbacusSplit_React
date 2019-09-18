import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class UMAddContactCategory extends TrackerReact(Component) {
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

	addContactCategory(event){
		  event.preventDefault();
	      var categoryName   = $("input[name=categoryName]").val();
	      var inputCategoryId    = $("input[name=categoryName]").attr("id");
	      if (categoryName.length < 4){
	      	swal("Contact category Not Added correct",'error');
	      }
	      else{
	      
	      Meteor.call('addContactCategory', categoryName,
	                function(error, result) { 
	                    if (error) {
	                     
	                        swal("Contact category Not Added Successfully",'error');
	                    } //info about what went wrong 
	                    else {
	                         swal('"'+categoryName+'"',"Contact category Added Successfully");
	                    }//the _id of new object if successful
	                }


	        );
	      $("input[name=categoryName]").val('');	
	  }

	}

	render(){
       return(
       			
       		<div>
		    	<form id="addroles" className="paddingLeftz noLRPad" onSubmit={this.addContactCategory.bind(this)}>
					<div className="form-group col-lg-12 col-md-8 col-xs-8 col-sm-8 paddingLeftz noLRPad addRolDiV">
						<span className="blocking-span">
							<input type="text" id= "" className="rolesField form-control UMname inputText tmsUserAccForm" name="categoryName" required/>
								<span className="floating-label">Enter Contact Category </span>
						</span>
					</div>
				</form>											
			</div>
				    
	    );
	} 

}