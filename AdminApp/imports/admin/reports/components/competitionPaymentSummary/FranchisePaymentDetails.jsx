import React, { Component } from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { ExamMaster } from '/imports/admin/forms/exam/api/examMaster.js'; 
import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';
class FranchisePaymentDetails extends Component {
	constructor(props){
		super(props);
		this.state={
			FranchisewiseDataSummary : [],
			allCompetitions  : [],
		}
	}

	componentDidMount() {
	 // 	Meteor.call("getFranchiseWiseStudent",FlowRouter.getParam('compId'),FlowRouter.getParam('franchId'),(err,res)=>{
		// 	if(err){swal(err)}else{
		// 		
		// 		this.setState({
		// 			FranchisewiseDataSummary : res,
		// 		});
		// 	}
		// });

		Meteor.call("getStudentDoB",FlowRouter.getParam('compId'),FlowRouter.getParam('franchId'),(err,res)=>{
			if(err){
				swal(err)
			}else{
				
				this.setState({
					FranchisewiseDataSummary : res,
				});
			}
		});
	}

	// getCompetitionId(s){
	// 	var competitionId = $("#selectId option:selected").attr("id");
	// 	Meteor.call("getCompetitionWiseFranchise",FlowRouter.getParam('compId'),FlowRouter.getParam('franchId'),(err,res)=>{
	// 		if(err){swal(err)}else{
	// 			this.setState({
	// 				allFranchiseDataSummary : res,
	// 			});
	// 		}
	// 	});
	// }

	render(){
		// console.log("FranchisewiseDataSummary",this.state.FranchisewiseDataSummary);
		console.log("res =",this.state.FranchisewiseDataSummary);

		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1 >Student Wise Payment Details</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	<div className="box-header with-border">
				            <h3 className="box-title">PAYMENT REPORT</h3>
				            </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 comFranchTit">
								<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
									<label>Competition Name</label> : {this.props.compFranchiseData.competitionName}
								</div>
								<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
									<label>Franchise Name</label> : {this.props.compFranchiseData.franchiseName}
								</div>
							</div>
								{/*<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 competitionSelect">
										<span className="blocking-span"> 
											<select type="text" name="competitionId" ref="competitionId"  id="selectId" onClick={this.getCompetitionId.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
												<option disabled value="">-- Select Category --</option>
												{this.state.allCompetitions.map((competition,index)=>{
													return <option key={index} id={competition._id}>{competition.competitionName}</option>
												  })
												}
											</select>
											<span className="floating-label floating-label-Date">Select Competition</span>					   								   			
										</span>
								</div>*/}
								{ this.state.FranchisewiseDataSummary.length != 0 ?
						         	<ReactHTMLTableToExcel
					                    id="test-table-xls-button"
					                    className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
					                    table="yearlyStudRegReport"
					                    filename="YearlyStudentRegistrationReport"
					                    sheet="tablexls"
					                    buttonText=""/>
					               :
					                <div className="pull-right"></div>
					        	}
								<form className="todaysSalesReport">
									<div>
										<div className="franchCompRepTab col-lg-12 col-md-12"></div>
											{ this.state.FranchisewiseDataSummary.length != 0 ?
											<div className="table-responsive col-lg-12">
											<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
												<thead>
													<tr className="tableHeader myAllTable">
														<th className="tab-Table">Sr. No</th>
														<th className="textAlignCenterC"> Student Name </th>
														<th className="textAlignCenterC"> Category &<br/> Sub-Category </th>
														<th className="textAlignCenterC"> Date of Birth</th>
														<th className="textAlignCenterC"> Amount</th>
														<th className="textAlignCenterC"> Maats Share </th>
														<th className="textAlignCenterC"> Franchise Share </th>
														<th className="textAlignCenterC"> Payment Date/Time </th>
													</tr>
												</thead>
												<tbody className="myTableData ">
													{this.state.FranchisewiseDataSummary.map((franchise, index)=>{
														return <tr key={index}>
																	<td className="tab-Table">{index + 1}</td>
																	<td><a className="studentbluelabel" href={/StudentInformations/+franchise.studentId}>{franchise.studentFullName}</a></td>
																	<td className="tab-Table">{franchise.category} / {franchise.subCategory} </td>
																	<td className="tab-Table">{franchise.dob} </td>
																	<td className="tab-Table">{franchise.competitionFees.toLocaleString('en-IN')}</td>
																	<td className="tab-Table">{franchise.competitionFees - franchise.franchiseShare}</td>
																	<td className="tab-Table">{franchise.franchiseShare.toLocaleString('en-IN')}</td>																	
																	<td className="tab-Table">{moment(franchise.paymentDate).format("DD-MM-YYYY")}/{moment(franchise.paymentDate).format("LT")}</td>
																</tr>														
													})}
													<tr className="FWSPreport">
														<td colSpan="4" className="tab-Table">Total</td>					
														<td className="tab-Table">{this.state.FranchisewiseDataSummary.reduce((sum, objVal)=> sum + parseInt(objVal.competitionFees),0).toLocaleString('en-IN')}/-</td>
														<td className="tab-Table">{this.state.FranchisewiseDataSummary.reduce((sum, objVal)=> sum + parseInt((objVal.competitionFees)-(objVal.franchiseShare)),0).toLocaleString('en-IN')}/-</td>
														<td className="tab-Table">{this.state.FranchisewiseDataSummary.reduce((sum, objVal)=> sum + parseInt(objVal.franchiseShare),0).toLocaleString('en-IN')}/-</td>
														<td className="tab-Table"></td>
													</tr>
				
												</tbody>
											</table>
											</div>
											:
												<div className="nopadLeft text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 noEarning MarginBottom20">Nothing to display. </div>
											}
										
										</div>
								</form>
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
export default franchPaymentSummaryContainer = withTracker(props=>{
	var compId = FlowRouter.getParam("compId");
	var franchId = FlowRouter.getParam("franchId");
	var postHandle = Meteor.subscribe("competionfranchisePayReport",compId,franchId);
	var loading = !postHandle.ready();
	var compFranchiseData = CompetitionRegisterOrder.findOne({"competitionId":compId,"franchiseId":franchId},{fields:{"competitionName":1,"franchiseName":1}})||{};
	// console.log("compFranchiseData",compFranchiseData);
	return{
		loading,
		compFranchiseData
	}
})(FranchisePaymentDetails);