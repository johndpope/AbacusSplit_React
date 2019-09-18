import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import UMAddContactStatus from './UMAddContactStatus.jsx';
import UMAdd_ContactStatus from './UMAdd_ContactStatus.jsx';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


 class AddContactStatus extends Component {

	statusListData(){
		var statusdata=FranchiseDetails.findOne({});
		var status= [];
		if(statusdata){
			status = statusdata.contactStatus;
		}		
		return status;
	}

	constructor(){
		super();
		this.state = {
			subscription : {
				"statusData" : Meteor.subscribe('statusData'),
			}
		}
	}

	componentDidMount() {

		this.statusListData();
		
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
					            <h3 className="box-title1">ADD CONTACT STATUS</h3>
					            </div>
					            <div className="box-body tablebdy">
					            	<div className="col-lg-10 col-lg-offset-1 col-md-8  col-md-offset-8 col-sm-12 col-xs-12 addRolWrap">
										<UMAddContactStatus/>
										<hr/>
										<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
											<thead className="table-head umtblhdr tableHeader">
												<tr className="hrTableHeader">
													<th className="umHeader"> Contact Status </th>
													<th className="umHeader"> Action </th>
												</tr>
											</thead>
											<tbody className="addRoleTbody">
												{/*	{ this.statusListData() && this.statusListData().length > 0?
														this.statusListData().map( (StatusData,index)=>{
														return <UMAdd_ContactStatus key={index} StatusDataValues={StatusData} dataindex={index}/>
													  }) 
													:
		                        					null
													}	*/}
													{ 
														this.props.allStatuses.length > 0 ?
															this.props.allStatuses.map((contactStatusesData,index)=>{ 

																return (
																	<tr key={index}>

																		{
																			contactStatusesData.contactStatus  && contactStatusesData.contactStatus.length > 0 ?
																				<td>
																					{
																						contactStatusesData.contactStatus.map((data,ind)=>{
																						return(
																							<UMAdd_ContactStatus  key={ind} StatusDataValues={data.statusName}/>
																							)
																						})
																					}
																				</td>
																				:
																				<td>
																				</td>
																		}

																		<td>
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

export default EditCompanyStatus = withTracker((props)=>{

    /*const postHandle = Meteor.subscribe('companyData');
    const post       = FranchiseDetails.findOne({})||{};
    const loading    = !postHandle.ready();
  
    return {
      loading,
      post,     
    };*/

 	const postHandle = Meteor.subscribe('companyData');
    var userId = Meteor.userId();
    var allStatuses = [];
    if(userId){
  

    	var userDetails = Meteor.users.findOne({"_id":userId});
  		
    	if(userDetails){
    		var companyId  = userDetails.profile.companyId;
    		
    		var cdSuperAdmin = FranchiseDetails.findOne({'companyId': 1});
	    	var agentComapnyDetails = FranchiseDetails.findOne({'companyId':companyId});
	    	

	    	if(cdSuperAdmin && agentComapnyDetails){
		    	allStatuses = [cdSuperAdmin,agentComapnyDetails];
		    	
	    	}
    	}

    	


    }
    const loading    = !postHandle.ready();
  
    return {
      loading,
      // post,     
      allStatuses
    };
}) (AddContactStatus);
