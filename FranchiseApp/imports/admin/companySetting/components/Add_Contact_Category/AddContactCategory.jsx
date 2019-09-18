import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import UMAddContactCategory from './UMAddContactCategory.jsx';
import UMAdd_ContactCategory from './UMAdd_ContactCategory.jsx';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';

class AddContactCategory extends Component {
	// categoryListData(){
	// this.allUserDataTracker = Tracker.autorun(() => {		
 //      const data = FranchiseDetails.findOne({});
 //      var category= [];
	// 	if(data){
	// 		category = data.contactCategory;
	// 	}
	// 	return category;
 //      if(handle.ready()&&handleDisplay.ready()&&handleShop.ready()&&handleOrder.ready()&&handleQuote.ready()){
 //        this.setState({data});
 //        // jQuery code here!
 //        if (!$('body').hasClass('adminLte')) {
 //          var adminLte = document.createElement("script");
 //          adminLte.type = "text/javascript";
 //          adminLte.src = "/js/adminLte.js";
 //          adminLte.setAttribute('id','adminLte');
 //          $("body").append(adminLte);
 //        }
 //        }
 //    })}

	allCategories(){
		var data=FranchiseDetails.findOne({});
	
		var category= [];
		if(data){
			category = data.contactCategory;
		}
		
		return category;
	}

	constructor(){
		super();
		this.state = {
			subscription : {
				"categoryData" : Meteor.subscribe('companyData'),
			}
		}
	}

	componentDidMount() {
		
		this.allCategories();

		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}

		if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
	      // console.log("I am appended!");
	      var adminLte = document.createElement("script");
	      adminLte.type = "text/javascript";
	      adminLte.src = "/js/adminLte.js";
	      adminLte.setAttribute('id','adminLte');
	      $("body").append(adminLte);
	    }
 	}



	render(){
 		

       	return(
			<div>	       
				<section className="NotificationContent">
			        <div className="row">
			            <div className="col-lg-11 col-lg-offset-0 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 ">
			                <div className="box box-default companysettingbox">
					            <div className="box-header with-border">
					            <h3 className="box-title1">ADD CONTACT CATEGORY</h3>
					            </div>
					            <div className="box-body tablebdy">
					            	<div className="col-lg-10 col-lg-offset-1 col-md-8  col-md-offset-8 col-sm-12 col-xs-12 addRolWrap">
										<UMAddContactCategory/>
										<hr/>
										<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
											<thead className="table-head umtblhdr tableHeader">
												<tr className="hrTableHeader">
													<th className="umHeader"> Contact Category </th>
													<th className="umHeader actionth"> Action </th>
												</tr>
											</thead>
											<tbody className="addRoleTbody">
					


													{ 
														this.props.allCategories.length > 0 ?
															this.props.allCategories.map((contactCategoryData,index)=>{ 

																return (



																	<tr className="tbltdfortr" key={index}>

																		{
																			contactCategoryData.contactCategory && contactCategoryData.contactCategory.length > 0 ?
																				<td>
																					{
																						contactCategoryData.contactCategory.map((data,ind)=>{
																						return(
																							<UMAdd_ContactCategory  key={ind} CategoryDataValues={data.categoryName}/>
																							)
																						})
																					}
																				</td>
																				:
																				null
																		}


																		
																   		<td className="actiondata">  

																		</td>


																	</tr>
																);


														    }) 
														:
														null
													}							
											</tbody>
										</table>
									</div>				            
					    		</div>
			    		    </div>
			    	    </div>
			    	</div>		    
			    </section>
	        </div>
	    );

	} 

}

export default EditCompanyDetails = withTracker((props)=>{

   
 	const postHandle = Meteor.subscribe('companyData');
    var userId = Meteor.userId();
    var allCategories = [];
    if(userId){
  

    	var userDetails = Meteor.users.findOne({"_id":userId});
  		
    	if(userDetails){

    		var companyId  = userDetails.profile.companyId;
    		
    		var cdSuperAdmin = FranchiseDetails.findOne({'companyId': 1});

	    	var agentComapnyDetails = FranchiseDetails.findOne({'companyId':companyId});

	    	if(cdSuperAdmin && agentComapnyDetails){
		    	allCategories = [cdSuperAdmin,agentComapnyDetails];

		    	
	    	}
    	}

    	


    }
    const loading    = !postHandle.ready();
  
    return {
      loading,
      // post,     
      allCategories
    };
}) (AddContactCategory);
