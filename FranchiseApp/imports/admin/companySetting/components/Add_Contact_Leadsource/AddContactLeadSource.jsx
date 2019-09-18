import React, { Component } from 'react';
import { render } from 'react-dom';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import UMAddContactLeadSource from './UMAddContactLeadSource.jsx';
import UMAdd_ContactLeadSource from './UMAdd_ContactLeadSource.jsx';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


class AddContactLeadSource extends Component {

	leadSourceData(){
		var data=FranchiseDetails.findOne({});
		var leadsource= [];
		if(data){
			leadsource = data.leadSource;
		}
		return leadsource;
	}

	constructor(){
		super();
		this.state = {
			subscription : {
				"leadSourceData" : Meteor.subscribe('leadSourceData'),
			}
		}
	}

	componentDidMount() {
		this.leadSourceData();
		
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
					            <h3 className="box-title1">ADD CONTACT LEAD SOURCE</h3>
					            </div>
					            <div className="box-body tablebdy">
					            	<div className="col-lg-10 col-lg-offset-1 col-md-8  col-md-offset-8 col-sm-12 col-xs-12 addRolWrap">
										<UMAddContactLeadSource/>
										<hr/>
										<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
											<thead className="table-head umtblhdr tableHeader">
												<tr className="hrTableHeader">
													<th className="umHeader"> Contact Lead Source </th>
													<th className="umHeader actionth"> Action </th>
												</tr>
											</thead>
											<tbody className="addRoleTbody">
											{/*		{ this.leadSourceData() && this.leadSourceData().length > 0? 
														this.leadSourceData().map( (LeadSourceData,index)=>{
														return <UMAdd_ContactLeadSource key={index} LeadSourceDataValues={LeadSourceData} dataindex={index}/>
													  }) 
													:
		                        					null
													}	*/}	
													{ 
														this.props.allLeadsource.length > 0 ?
															this.props.allLeadsource.map((leadSourcesData,index)=>{ 

																return (
																	<tr key={index}>

																		{
																			leadSourcesData.leadSource && leadSourcesData.leadSource.length > 0 ?
																				<td>
																					{
																						leadSourcesData.leadSource.map((data,ind)=>{
																							return(
																								<UMAdd_ContactLeadSource key={ind} LeadSourceDataValues={data.leadsourceName} />
																							)
																						})
																					}
																				</td>
																				:
																				<td>
																				</td>
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
export default EditLeadSource = withTracker((props)=>{

   /* const postHandle = Meteor.subscribe('companyData');
    const post       = FranchiseDetails.findOne({})||{};
    const loading    = !postHandle.ready();
  
    return {
      loading,
      post,     
    };*/

const postHandle = Meteor.subscribe('companyData');
    var userId = Meteor.userId();
    var allLeadsource = [];
    if(userId){
  

    	var userDetails = Meteor.users.findOne({"_id":userId});
    
    	if(userDetails){
    		var companyId  = userDetails.profile.companyId;
    		var cdSuperAdmin = FranchiseDetails.findOne({'companyId': 1});
	    	var agentComapnyDetails = FranchiseDetails.findOne({'companyId':companyId});
	    	

	    	if(cdSuperAdmin && agentComapnyDetails){
		    	allLeadsource = [cdSuperAdmin,agentComapnyDetails];
	    	}
    	}

    	


    }
    // const post       = FranchiseDetails.findOne({})||{};
    const loading    = !postHandle.ready();
  
    return {
      loading,
      // post,     
      allLeadsource
    };

}) (AddContactLeadSource);
