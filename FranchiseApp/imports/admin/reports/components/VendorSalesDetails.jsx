import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { CustomerCollection } from '../../../react-native/api/CustomerBill.js'; 
import { BusinessMaster } from '../../../react-native/api/BusinessMaster.js';

export default class VendorSalesDetails extends TrackerReact(Component) {
    constructor(){
		super();
		this.state ={
			"subscription" : {
				"customerCollection" : Meteor.subscribe("customerCollection"),
				"businessDetails" : Meteor.subscribe("businessDetails"),
			}
		}
	}

    componentDidMount() {
	 	$("html,body").scrollTop(0);
	}

	parkingDataBody(){
		var currentLocation = browserHistory.getCurrentLocation();
  		var splitUrl = currentLocation.pathname.split('/');
  		console.log(splitUrl[3]);
		
		var parkingArray = [];
		var parkingData = CustomerCollection.find({'businessId' : splitUrl[3]}).fetch();			
		// console.log(parkingData);
		if(parkingData.length > 0){
			for(var i=0;i<parkingData.length;i++){
				var customerData = Meteor.users.findOne({'_id':parkingData[i].customerId});
				if(customerData){
					if(customerData.profile){
						console.log('true');
						var customerName = customerData.profile.firstName+' '+customerData.profile.lastName;
						var customerArea = customerData.profile.areaName;
						var customerCity = customerData.profile.townName;
					}
				}

				var businessData = BusinessMaster.findOne({"_id":parkingData[i].businessId});
				if(businessData){
					var service = businessData.businessType;
					var businessName = businessData.businessName;
					var vendorName = businessData.vendorName;
				}

				parkingArray.push(
					<tr key={parkingData[i]._id}>
						<td>{customerName}</td>
						<td>{service}</td>
						<td>{customerArea}</td>
						<td>{customerCity}</td>
						<td>{vendorName}</td>
						<td>{businessName}</td>
						<td>{moment(parkingData[i].createdAt).format('DD/MM/YYYY')}</td>
						<td className="text-center">{parkingData[i].collectedBill}</td>
					</tr>
				);
			}//i
		}
			
		return parkingArray;
	}
	
  render() {
    return (
    	<div>
	        {/* Content Wrapper. Contains page content */}
	        <div className="content-wrapper vendor-wrapper">
	          <section className="content">
	            <div className="row">
	              <div className="col-md-12">
	                <div className="box">
	                  <div className="box-header with-border">
	                    <div className="admin-title-wrapper row">
	                      <div className="admin-page-title col-lg-12 col-md-12 col-sm-12 col-xs-12">Vendor Sales Details</div>
	                    </div>

	                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                      <div className="reportWrapper">
	                        <div className="table-responsive col-lg-12">
								<table className="table table-striped table-hover myTable table-bordered" id="dailyTransactionParking">
									<thead>
										<tr className="tableHeader">
											<th> Customer Name </th>
											<th> Service </th>
											<th> Area </th>
											<th> City </th>
											<th> Business Name </th>
											<th> Vendor Name </th>
											<th> Date </th>
											<th> Amount </th>
										</tr>
									</thead>
									<tbody>
										{this.parkingDataBody()}
									</tbody>
								</table>
							</div>
	                      </div>
	                    </div>
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