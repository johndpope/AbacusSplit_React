import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import UMaddRoles from './UMaddRoles.jsx';
import UMadd_role from './UMadd_role.jsx';

export default class UMRolesList extends TrackerReact(Component) {

	rolesListData(){
		return Meteor.roles.find({"name":{ $nin: ["superAdmin"]},"insertedFrom":"portal" }).fetch();
	}

	constructor(){
		super();
		this.state = {
			subscription : {
				"rolesData" : Meteor.subscribe('rolefunction'),
			}
		}
	}

	componentDidMount(){
		// renderFunction();
		if (!!!$("link[href='/css/dashboard.css']").length > 0) {
      var dashboardCss = document.createElement("link");
      dashboardCss.type = "text/css";
      dashboardCss.rel = "stylesheet";
      dashboardCss.href = "/css/dashboard.css";
      document.head.append(dashboardCss);
    }
	}
	componentWillUnmount(){
    $("link[href='/css/dashboard.css']").remove();
  }

	render(){

       return(
    
			<section className="content-wrapper">
			  <div className="content">

	        <div className="row">
	          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
	            <div className="box box-primary">
		            <div className="box-header with-border">
		            <h3 className="box-title">LIST OF ROLES</h3>
		            </div>

					<hr/>	
					<div className="box-body">			
						<UMaddRoles/>

						<div className="table-responsive col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-12">
						<table className="table table-bordered table-striped table-hover myTable dataTable no-footer">
							<thead className="table-head umtblhdr">
								<tr className="tableHeader">
									<th className="umHeader"> Role </th>
									<th className="umHeader"> Action </th>
								</tr>
							</thead>
							<tbody>
								{ this.rolesListData().map( (rolesData)=>{
									return <UMadd_role key={rolesData._id} roleDataVales={rolesData}/>
								  }) 
								}						
							</tbody>
						</table>
						</div>
					</div>

				</div>
			  </div>
			  </div>
			</div>
			</section>

       		
	    );

	} 

}