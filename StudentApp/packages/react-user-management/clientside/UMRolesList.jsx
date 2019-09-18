import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import UMaddRoles from './UMaddRoles.jsx';
import UMadd_role from './UMadd_role.jsx';

export default class UMRolesList extends TrackerReact(Component) {

	rolesListData(){
		return Meteor.roles.find({}).fetch();
	}

	constructor(){
		super();
		this.state = {
			subscription : {
				"rolesData" : Meteor.subscribe('rolefunction'),
			}
		}
	}

	render(){

       return(

				<section className="Content">
					<div className="reportWrapper">
						<div className="col-md-10 col-lg-12 col-sm-12 col-xs-12 noLRPad">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noLRPad">
							<h1 className="reportTitleName tableTitle">LIST OF ROLES</h1>
							<hr/>				
								<UMaddRoles/>


								<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
									<thead className="table-head umtblhdr">
										<tr className="hrTableHeader">
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
				</section>
       		
	    );

	} 

}