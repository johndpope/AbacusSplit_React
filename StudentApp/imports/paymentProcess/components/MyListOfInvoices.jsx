import React,{Component}  from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import {PackageOrderMaster} from '/imports/paymentProcess/api/packageOrderMaster.js';
class MyListOfInvoices extends Component{
	
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
	            <h1>My Invoices</h1>
	          </section>
	          {/* Main content */}
	          <section className="content viewContent">
	            <div className="row">
	              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
	                <div className="box">
	                  <div className="box-header with-border boxMinHeight">
	                  	{ this.props.myInvoiceData.length > 0 ?	
						<div className="table-responsive col-lg-12">
						<table className="table table-striped table-hover myTable table-bordered reportTables" id="dailyStudRegReportTab">
							<thead>
								<tr className="tableHeader">
									<th className="tab-Table">Sr. No</th>
									<th> Receipt </th>
									<th className="tab-Table"> Date </th>
									
									<th className="tab-Table"> Status </th>
								</tr>
							</thead>
							<tbody className="myAllTable">
							{this.props.myInvoiceData.map((invoiceData, index)=>{
								return <tr key={index}>
											<td className="tab-Table"></td>
											<td> <a href={`/MyInvoice/${invoiceData._id}`}>Receipt {index+1}</a></td>
											<td className="tab-Table">{moment(invoiceData.CreateAt).format("DD-MM-YYYY")}</td>
											
											<td className="tab-Table">{invoiceData.status}</td>
										</tr>
							})}
							</tbody>
						</table>
						</div>
					:
						<div className="nopadLeft text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 noEarning MarginBottom20 noDataInvoiceList">Nothing to display.</div>
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

export default MyListOfInvoicesContainer = withTracker(props=>{
	var postHandle = Meteor.subscribe("showLoginStuddntInvoices");
	var loading = !postHandle.ready();
	var myInvoiceData = PackageOrderMaster.find({"buyerId":Meteor.userId()}).fetch()||{};
	return{
		loading,
		myInvoiceData,
	}
})(MyListOfInvoices);