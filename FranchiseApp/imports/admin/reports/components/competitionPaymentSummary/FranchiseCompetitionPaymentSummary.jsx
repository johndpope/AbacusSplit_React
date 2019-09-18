import React, { Component } from 'react';
import { render } from 'react-dom';
import { Meteor } from 'meteor/meteor';
import {withTracker} from 'meteor/react-meteor-data';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { ExamMaster } from '/imports/admin/forms/exam/api/examMaster.js';
import FranchisePaymentDetails from './FranchisePaymentDetails.jsx'; 
import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';


class FranchiseCompetitionPaymentSummary extends Component {
	constructor(props){
		super(props);
		this.state={
			allFranchiseDataSummary : [],
			paidStudentDataSummary : [],
			paidDataSummary : [],
			allCompetitions  : [],
			facilityPermission : 'waitingforResult',
			"competitionID":'',
		}
		// this.goToPaymentDetails=this.goToPaymentDetails..bind(this);
	}
	
	componentWillMount(){
  		 Meteor.call("isAuthenticated","Report","FranchiseCompetitionPaySummary",(err,res)=>{
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
	 	});
	}

	getCompetitionId(s){
		var competitionId = $("#selectId option:selected").attr("id");
		this.setState({
					competitionID:competitionId
				},()=>{
			this.getPaymentSummary();
		});
		
		// Meteor.call("getFranchiseWiseCompetitionPaidStudent",competitionId,Meteor.userId(),(err,res)=>{
		// 	if(err){swal(err)}else{
		// 		this.setState({
		// 			paidStudentDataSummary : res,
		// 			competitionID:competitionId
		// 		});
		// 	}
		// });

		Meteor.call("getFranchiseWiseStudentDOB",competitionId,Meteor.userId(),(err,res)=>{
			if(err){swal(err)}else{
				console.log("Result",res);
				this.setState({
					paidStudentDataSummary : res,
					competitionID:competitionId
				});
			}
		});

		// FlowRouter.go("/Franchise/franchisewisePaymentDetails/"+competitionId+'/'+Meteor.userId());		
	}

	getPaymentSummary(){
		var compId= this.state.competitionID;
		// console.log("competitionId",compId);
		Meteor.call("getSummaryCompetitionPaidStudent",compId,Meteor.userId(),(err,res)=>{
			if(err){swal(err)}else{
				this.setState({
					paidDataSummary : res,
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
								{ this.state.paidStudentDataSummary.length != 0 ?
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
											{ 
											this.state.paidStudentDataSummary.length != 0 ?
											<div className="table-responsive col-lg-12">
												<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
													<thead>
														<tr className="tableHeader myAllTable">
															<th className="tab-Table textAlignCenterC">Sr. No</th>
															<th className="textAlignCenterC"> Student Name </th>
															<th className="textAlignCenterC"> Category &<br/> Sub-Category </th>
															<th className="textAlignCenterC"> Date of Birth</th>
															<th className="textAlignCenterC"> Amount</th>
															<th className="textAlignCenterC"> Maats Share </th>
															<th className="textAlignCenterC"> Franchise Share </th>
															<th className="textAlignCenterC"> Payment Date/Time </th>
														</tr>
													</thead>
													{this.state.paidStudentDataSummary.length>0?
													<tbody className="myTableData ">
														{this.state.paidStudentDataSummary.map((franchise, index)=>{
															return <tr key={index}>
																		<td className="tab-Table">{index + 1}</td>
																		<td><a className="studentbluelabel" href={"/Franchise/StudentInformations/"+franchise.studentId}>{franchise.studentFullName}</a></td>
																		<td className="tab-Table">{franchise.category} / {franchise.subCategory} </td>
																		<td className="tab-Table">{franchise.dob}</td>
																		<td className="tab-Table">{franchise.competitionFees}</td>
																		<td className="tab-Table">{franchise.competitionFees - franchise.franchiseShare}</td>
																		<td className="tab-Table">{franchise.franchiseShare}</td>
																		<td className="tab-Table">{moment(franchise.paymentDate).format("DD-MM-YYYY")}/{moment(franchise.paymentDate).format("LT")}</td>
																	</tr>														
														})}
														{this.state.paidDataSummary.map((paidData, paidIndex)=>{
															return <tr  className="FWSPreport" key={paidIndex}>
																		<td colSpan="4" className="tab-Table">Total</td>
																		<td className="tab-Table">{paidData.totalReceivedAmount}/-</td>
																		<td className="tab-Table">{paidData.totalReceivedAmount-paidData.totalFranchiseShare}/-</td>
																		<td className="tab-Table">{paidData.totalFranchiseShare}/-</td>
																	</tr>														
														})}
					
													</tbody>
													:null

												}
												</table>
											</div>
											:
											<div className="table-responsive col-lg-12">
												<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
													<thead>
														<tr className="tableHeader myAllTable">
															<th className="tab-Table">Sr. No</th>
															<th> Student Name </th>
															<th> Category & Sub-Category </th>
															<th> Amount</th>
															<th> Maats Share </th>
															<th> Franchise Share </th>
															<th> Payment Date/Time </th>
														</tr>
													</thead>
													<tbody className="myTableData ">
														<tr  className="FWSPreport">
															<td colSpan="7" className="tab-Table">Nothing to display. </td>
														</tr>
													</tbody>
												</table>
											</div>
												
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

		}else if (this.state.facilityPermission == false ){
			  	return(<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{
		   return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);

		}
	}
}
export default franchiseCompPaymentSummaryContainer = withTracker(props=>{
	var postHandle = Meteor.subscribe("AllFranchise");
	var loading = !postHandle.ready();
	var allFranchise = Meteor.users.find({"roles":["Franchise"]}).fetch();
	
	return{
		allFranchise
	}
})(FranchiseCompetitionPaymentSummary);

