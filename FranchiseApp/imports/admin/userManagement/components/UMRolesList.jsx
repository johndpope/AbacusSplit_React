import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import UMaddRoles from './UMaddRoles.jsx';
import UMadd_role from './UMadd_role.jsx';

export default class UMRolesList extends TrackerReact(Component) {

	constructor(){
		super();
		this.state = {
			roles : [],
		}
	}

	componentWillMount(){
		Meteor.call("getRoles",(err,res)=>{
			if(err){

			}else{
				this.setState({
					roles : res,
				});
			}
		})
	}

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  

	render(){

       return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            {/*<h1> CREATE USER</h1>*/}
		          </section>
		          {/* Main content */}

		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			            <div className="with-border">
			            	<h3 className="contentTitle">Add Role</h3>
			            </div>
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">

					       	<section className="NotificationContent">
					                  
					            <div className="box-body">
									<div className="col-lg-8 col-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 addRolesInWrap">
									<UMaddRoles/>


									<table className="table-responsive table table-striped table-hover myTable dataTable no-footer">
										<thead className="table-head umtblhdr ">
											<tr className="hrTableHeader tableHeader">
												<th className="umHeader"> Role </th>
												<th className="umHeader"> Action </th>
											</tr>
										</thead>
										<tbody>
											{ this.state.roles.map( (rolesData)=>{
												return <UMadd_role key={rolesData._id} roleDataVales={rolesData}/>
											  }) 
											}						
										</tbody>
									</table>
									</div>
								</div>
							</section>
						  </div>
						</div>
					  </div>
					</div>
				</section>
			</div>
		</div>


       		
	    );

	} 

}