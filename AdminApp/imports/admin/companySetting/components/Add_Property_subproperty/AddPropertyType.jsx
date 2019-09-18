import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} from 'meteor/react-meteor-data';
import UMAddPropertyType from './UMAddPropertyType.jsx';
import UMAdd_PropertyType from './UMAdd_PropertyType.jsx';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


class AddPropertyType extends Component {

	propertyTypeListData(){		
		var data=FranchiseDetails.findOne({});
		var property= [];
		if(data){
			property = data.property;
		}
	
		return property;
	}

	constructor(){
		super();
		this.state = {
			subscription : {
				"propertyType" : Meteor.subscribe('propertyType'),
			}
		}
	}

	componentDidMount() {
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
					            <h3 className="box-title1">ADD PROPERTY TYPE</h3>
					            </div>
					            <div className="box-body tablebdy">
					            	<div className="col-lg-10 col-lg-offset-1 col-md-8  col-md-offset-8 col-sm-12 col-xs-12 addRolWrap">
										<UMAddPropertyType/>
										<hr/>
										<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
											<thead className="table-head umtblhdr tableHeader">
												<tr className="hrTableHeader">
													<th className="umHeader"> Property Type </th>
													<th className="umHeader"> Action </th>
												</tr>
											</thead>
											<tbody className="addRoleTbody">
													{ this.propertyTypeListData() && this.propertyTypeListData().length > 0? 
														this.propertyTypeListData().map( (PropertyTypeListData,index)=>{
														return <UMAdd_PropertyType key={index} PropertyTypeDataValues={PropertyTypeListData} dataindex={index}/>
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

export default EditPropertyType = withTracker((props)=>{

    const postHandle = Meteor.subscribe('companyData');
    const post       = FranchiseDetails.findOne({})||{};
    const loading    = !postHandle.ready();
  
    return {
      loading,
      post,     
    };
}) (AddPropertyType);

