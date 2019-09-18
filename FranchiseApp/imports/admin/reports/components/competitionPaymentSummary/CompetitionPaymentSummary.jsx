import React, { Component } from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { ExamMaster } from '/imports/admin/forms/exam/api/examMaster.js'; 

class CompetitionPaymentSummary extends Component {
	constructor(props){
		super(props);
		this.state={
			allFranchiseDataSummary : [],
			allCompetitions  : [],
			facilityPermission : 'waitingforResult',  	
		}
	}
	
	componentWillMount(){
  		 Meteor.call("isAuthenticated","Report","CompetitionPaymentSummary",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res==true){
		          this.setState({
		             facilityPermission : res,
		          });
		        }else if(res==false){
		          this.setState({
		             facilityPermission : res,
		          });
		        }
			}
		});
  	}

	componentDidMount() {
	 	Meteor.call("allCompetitions",(err,res)=>{
	 		this.setState({
	 			allCompetitions : res,
	 		});
	 	// 	FlowRouter.go("/Admin/competitionWisePaymentSummary/"+FlowRouter.getParam("compId"));
			// Meteor.call("getCompetitionWiseFranchise",FlowRouter.getParam("compId"),(err,res)=>{
			// 	if(err){swal(err)}else{
			// 		this.setState({
			// 			allFranchiseDataSummary : res,
			// 		});
			// 	}
			// });
	 	});
	}

	getCompetitionId(s){
		var competitionId = $("#selectId option:selected").attr("id");
		Meteor.call("getCompetitionWiseFranchise",competitionId,(err,res)=>{
			if(err){swal(err)}else{
				this.setState({
					allFranchiseDataSummary : res,
				});
			}
		});
	}

	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
			
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section>
		          <div className="row">
		          <div className="col-md-12">
		          <section className="content-header">
		            <h1 >Reports</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	<div className="box-header with-border">
				            <h3 className="box-title">Competitions Pay Summary</h3>
				            </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12 competitionSelect">
										<span className="blocking-span"> 
											<select type="text" name="competitionId" ref="competitionId"  id="selectId" onClick={this.getCompetitionId.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextReportTabel" autoComplete="off" title="Please select Category" required>
												<option value="">-- Select Competition --</option>
												{this.state.allCompetitions.map((competition,index)=>{
													return <option key={index} id={competition._id}>{competition.competitionName}</option>
												  })
												}
											</select>
											<span className="floating-label floating-label-Date">Select Competition</span>					   								   			
										</span>
								</div>
								{ this.state.allFranchiseDataSummary.length != 0 ?
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
										<div className="break col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
											{ this.state.allFranchiseDataSummary.length != 0 ?
											<div className="table-responsive col-lg-12">
											<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
												<thead>
													<tr className="tableHeader myAllTable">
														<th className="tab-Table">Sr. No</th>
														<th> Franchise Name </th>
														<th> Number of Students </th>
														<th> Amount Received (Rs) </th>
														<th> Maats Share (Rs)</th>
														<th> Franchise Share (Rs)</th>
														<th> Action </th>
													</tr>
												</thead>
												<tbody className="myTableData ">
													{this.state.allFranchiseDataSummary.map((franchises, index)=>{
														if(index < this.state.allFranchiseDataSummary.length-1){
														return <tr key={index}>
																	<td className="tab-Table">{index + 1}</td>
																	<td>{franchises.franchiseName}</td>
																	<td className="tab-Table">{franchises.studCountbyFranchise.toLocaleString('en-IN')}</td>
																	<td className="tab-Table">{franchises.ReceivedAmount.toLocaleString('en-IN')}</td>
																	<td className="tab-Table">{franchises.maatsShare.toLocaleString('en-IN')}</td>
																	<td className="tab-Table">{franchises.franchiseShare.toLocaleString('en-IN')}</td>
																	
																	<td className="tab-Table"><a className="studentbluelabel" href={`franchisewisePaymentDetails/${franchises.competitionId}/${franchises.franchiseId}`} title="Click to view payment details">View Details</a></td>
																</tr>
														}else{
														return <tr key={index} className="FWSPreport">
																	<td colSpan="2" className="tab-Table">Total</td>
																	<td className="tab-Table">{franchises.totalStudent.toLocaleString('en-IN')}</td>
																	<td className="tab-Table">{franchises.totalReceivedAmount.toLocaleString('en-IN')}/-</td>
																	<td className="tab-Table">{franchises.totalMaatsShare.toLocaleString('en-IN')}/-</td>
																	<td className="tab-Table">{franchises.totalFranchiseShare.toLocaleString('en-IN')}/-</td>
																	<td className="tab-Table"></td>
																</tr>
														}
													})}
													 
												</tbody>
											</table>
											</div>
											:
											<div className="table-responsive col-lg-12">
											<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
												<thead>
													<tr className="tableHeader myAllTable">
														<th className="tab-Table">Sr. No</th>
														<th> Franchise Name </th>
														<th> Number of Students </th>
														<th> Amount Received  </th>
														<th> Maats Share </th>
														<th> Franchise Share </th>
														<th> Action </th>
													</tr>
												</thead>
												<tbody >
													<tr>
														<td colSpan="7" className="tab-Table">Please select competition to get payment summary</td>

													</tr>
												</tbody>
											</table>
											</div>
												/*<div className="nopadLeft text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 noEarning MarginBottom20">Please select competition to get payment summary</div>*/
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
					</section>
				  </div>
				</div>
			);
		}else if (this.state.facilityPermission == false ){
			  	return(<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className=" loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access.</h3>
		  		 </div>);
		}
	}
}
export default compPaymentSummaryContainer = withTracker(props=>{
	var postHandle = Meteor.subscribe("AllFranchise");
	var loading = !postHandle.ready();
	var allFranchise = Meteor.users.find({"roles":["Franchise"]}).fetch();
	
	return{
		allFranchise
	}
})(CompetitionPaymentSummary);

