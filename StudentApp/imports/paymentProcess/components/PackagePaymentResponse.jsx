import React, {Component} from 'react';
import {render} from 'react-dom';

import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';

import {CompetitionRegisterOrder} from '/imports/student/api/competitionRegisterOrder.js';
// import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';
import {PackageOrderMaster} from '/imports/paymentProcess/api/packageOrderMaster.js';
	
class PackagePaymentResponse extends Component{

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}

		if(FlowRouter.getQueryParam('status') == 'paid'){
			Meteor.call("updatePackagePaymentStatus",FlowRouter.getParam('orderId'),FlowRouter.getQueryParam('status'),FlowRouter.getQueryParam('id'),FlowRouter.getQueryParam('billnumbers'),(err,res)=>{
				if(err){
					console.log(err);
				}else{
					// Meteor.call("createQuestionPaperMasterAccordingtoPackages",FlowRouter.getParam('orderId'));
					FlowRouter.go("/packagePayment-success/"+FlowRouter.getParam('orderId'));
				}
			});
		}else{
			FlowRouter.go("/payment-failure");
				// Meteor.call("createQuestionPaperMasterAccordingtoPackages",FlowRouter.getParam('orderId'));
		}
  	}

  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  	
  	constructor(){
		super();
		this.state ={
	    
		}
	}

	

	render(){
		return(
		
		<div>
		        <div className="content-wrapper">
		            <section className="content-header">
		                <h1> Payment Receipt</h1>
		            </section>
		            <section className="content viewContent">
		                <div className="row">
		                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                		<div className="box">
		                  			<div className="box-header with-border boxMinHeight">
					                  

								       	<section className="NotificationContent">
									            <div className="box-body">
													<div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 borderdetails ">
														<div className="col-lg-12 status ">
															<div className="box-header box-title paymentthnx">
																<h3>Thank You! </h3><br />
																	Your Payment has been successfully received with the following details.
																	Please quote your transaction Id for
																	any queries relating to this request.
															</div>
															<div className="col-lg-6 status box-headerpayment">
																<h4>Status :</h4>
															</div>
															<div className="col-lg-6 box-headerrec ">
																<h4>{this.props.packageOrderData.status}</h4>
															</div>
														</div>
														<div className="col-lg-12 box-header box-title">
															
															<div className="col-lg-6 box-headerpayment examdetailsubtitles">
																<h4>Amount Paid :</h4>
															</div>
															<div className="col-lg-6 box-headerrec ">
																<h4>{this.props.packageOrderData.amount}</h4>
															</div>
														</div>
														<div className="col-lg-12 status">
															
															<div className="col-lg-6 box-headerpayment examdetailsubtitles">
																<h4>Tansaction ID :</h4>
															</div>
															<div className="col-lg-6 box-headerrec ">
																<h4>{this.props.packageOrderData.transactionId} </h4>
															</div>
														</div>
														<div className="col-lg-12 status">
															<div className="col-lg-6 box-headerpayment examdetailsubtitles">
																<h4>Bill Number : </h4>
															</div>
															<div className="col-lg-6 box-headerrec">
																<h4>{this.props.packageOrderData.billnumbers}  </h4>
															</div>
														</div>
														<div className="col-lg-12 status">
														

															<div className="col-lg-6 box-headerpayment examdetailsubtitles">
																<h4>Payment Date & Time : </h4>
															</div>
															<div className="col-lg-6 box-headerrec ">
																<h4>{moment(this.props.packageOrderData.paymentDate).format('DD/MM/YYYY')}  </h4>
															</div>
														</div>
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
			
			
		)
	}
}


export default PackagePaymentResponse = withTracker(props=>{
	  var id 					  = 	FlowRouter.getParam("orderId");
	const postHandle1             = 	Meteor.subscribe('singleOrder',id);
	const loading1                = 	!postHandle1.ready();
	// console.log(loading1);
    const packageOrderData     = 	PackageOrderMaster.findOne({"_id": id,"buyerId":Meteor.userId()})||{};
	// console.log("packageOrderData==>>",packageOrderData);



	return{
		packageOrderData,
		loading1,
	}
})(PackagePaymentResponse);