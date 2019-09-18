

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {PackageOrderMaster} from '/imports/admin/forms/invoice/api/packageOrderMaster.js';
import ReactTable from "react-table";

class MyPackages extends TrackerReact(Component)  {

	constructor(props) {
		super(props);
		this.state = {
			PackageData	: [],
		};
		// this.deletePackageOrder=this.deletePackageOrder.bind(this);
	}
	componentWillReceiveProps(nextProps){
		if(!nextProps.loading){	
		    if(nextProps.packageReport){
		    	this.setState({
		            PackageData          : nextProps.packageReport.packages,
		        })
		}   
		
	}
	// this.deletePackageOrder=this.deletePackageOrder.bind(this);
}
	componentDidMount(){
		
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		this.deletePackageOrder=this.deletePackageOrder.bind(this);
	}
	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  	// deletePackageOrder(event){
  	// 	event.preventDefault();
  	// 	var pckgId=event.target.id;
  	// 	var pckgData=this.state.PackageData;
  	// 	var indexofpackage= pckgData.findIndex(x=>x.packageId==pckgId);
  	// 	// console.log("indexofpackage",indexofpackage);
  	// 	// console.log("Meteor.userId()",Meteor.userId());
  	// 	Meteor.call("removePackageOrderFromList",Meteor.userId(),pckgId,indexofpackage,(error,result)=>{
			// 			if(error){

			// 			}else{
			// 				swal(
			// 			    'Deleted Successfully',
			// 			    '',
			// 			    'success'
			// 			  );
			// 				// this.props.usersDataValues;
			// 		}
			// 	});

  	// }


	render(){

		var data1 = this.state.PackageData;
		console.log("this.state.PackageData================",this.state.PackageData)
		console.log("this.state.PackageData================",data1)
		var data2 = [];
		for(i=0; i<data1.length; i++){
		data2[i] = {
		// "_id" : data1[i]._id,
		"serialNumber" : i+1,
		"PackageName" : data1[i].packageName,
		"Category" : data1[i].category,
		"SubCategory" : data1[i].subCategory,
		"price" : data1[i].packagePrice,
		"NoOfPracticeTest" : data1[i].NoOfPracticeTest,
		/*"ActionToPerform" :<td className="tab-Table"><i className="fa fa-trash deleteIcon" onClick={this.deletePackageOrder.bind(this)} id={data1[i].packageId}/></td>*/
							
			     		

		};     
		}
		// console.log(data2);

		var headers = [
		{Header: "Sr. No.", accessor: 'serialNumber' },
		{Header: "Package Name", accessor: 'PackageName' },
		{Header: "Category", accessor: 'Category'},
		{Header: "Sub Category ", accessor: 'SubCategory' },
		{Header: "Price", accessor: 'price' },
		{Header: "No of Practice Test", accessor: 'NoOfPracticeTest' },
		/*{Header: "Action",accessor:'ActionToPerform' },*/
		];
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>My Packages</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	{/*<div className="box-header with-border">
					            <h3 className="box-title">My Packages</h3>
					        </div>*/}
					        {
					        	this.props.packageReport?
					        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ExamReportTable">
				              	
									<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 addRolWrap addcountrylist questWrapReactTable" id="contactlistview">
										<ReactTable data={data2} columns={headers} filterable={true} />
									</div>
						
								</div>
							</div>:
							<div className="box-header with-border boxMinHeight  studDataNotExist">
			                	<div>
								 	Packages Not Purchased.
								</div>
			            </div>
					        }
							
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
export default PracticeExamReportsContainer = withTracker(props=>{
	var buyerID = Meteor.userId();
	var myPackageHandle = Meteor.subscribe("allPackageOrder");
	var loadingData     = !myPackageHandle.ready();	
	var packageReport  = PackageOrderMaster.findOne({"buyerId":buyerID,"status":"paid"});
	// console.log("packageReport",packageReport);
	return {
		loadingData,
		packageReport,
	}
})(MyPackages);