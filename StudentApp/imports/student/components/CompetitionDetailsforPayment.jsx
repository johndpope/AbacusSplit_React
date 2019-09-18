import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import {ExamMaster} from '/imports/studentMainExam/api/examMaster.js';
// import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {StudentMaster} from '/imports/student/api/studentMaster.js';
// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';

class CompetitionDetailsforPayment extends Component{

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

  	confirmPayment(event){
  		event.preventDefault();
  		var competitionFees = this.refs.competitionFees.value;
  		var comp_id 		= this.refs.comp_id.value;
  		var QPId 			= this.refs.QPId.value;
  		Meteor.call("paymentGatewayforCompetition",competitionFees,comp_id,QPId,
  					(err,rslt)=>{
  						if(err){
  							// console.log(err);
  						}else{
  							if(rslt){
  							console.log(rslt);

                                window.location = rslt;
  							}
  						}
  					}
  		);
  	}

	render(){
		if(!this.props.loading && !this.props.loadingComp) {
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Competition Details</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                  	{this.props.CompetitionExamData ?
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerexambox">
								<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 rfoac">
		       						<h2 className="abacustitle">Registration for Online Abacus Competition</h2>
			       				</div>
		       					<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 outerbox">
									<div className="col-lg-12 col-md-3 col-sm-6 col-xs-12 imgLogoWrapReg">
				       						<img src="/images/maatslogo.png" className="img-responsive"/>
				       				</div>
								
			       					<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
										
				       					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 rfoac">
				       						{/*<img src="/images/logo.png" className="img-responsive examlogo" />*/}
				       						<h4 className="abacussubtitle blue">{this.props.competitionData.competitionName}</h4>
				       					</div>

			       					</div>
			       					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  examdetailbox">
										
										<div className="col-lg-12 col-md-12 col-sm- col-xs-12">
											<div className="col-lg-offset-3 col-md-offset-3 col-lg-9 col-md-9 col-sm- col-xs-12 examdetailsubtitles examtitles">Exam Date &nbsp;&nbsp;&nbsp;: &nbsp;{this.props.dateformat}</div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm- col-xs-12">
											<div className="col-lg-offset-3 col-md-offset-3 col-lg-9 col-md-9 col-sm- col-xs-12 examdetailsubtitles examtitles">Exam Time &nbsp;&nbsp;&nbsp;: &nbsp;{this.props.competitionData.startTime} TO &nbsp;
										{this.props.competitionData.endTime}</div>
										</div>
										<div className="col-lg-12 col-md-12 col-sm- col-xs-12">
											<div className="col-lg-offset-3 col-md-offset-3 col-lg-9 col-md-9 col-sm- col-xs-12 examdetailsubtitles1 examtitles">Category &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;{this.props.CompetitionExamData.category}</div>
											
										</div>
										<div className="col-lg-12 col-md-12 col-sm- col-xs-12">
											<div className="col-lg-offset-3 col-md-offset-3 col-lg-9 col-md-9 col-sm- col-xs-12 examdetailsubtitles1 examtitles">Exam Duration &nbsp;:&nbsp;{this.props.CompetitionExamData.examDuration} (Minutes)</div>
											
										</div>
										
										
										<div className="col-lg-12 col-md-12 col-sm- col-xs-12">
											<div className="col-lg-offset-3 col-md-offset-3 col-lg-9 col-md-9 col-sm- col-xs-12 examdetailsubtitles1 green">Competition Fees :&nbsp; <i className="fa fa-inr" aria-hidden="true"></i>&nbsp;{this.props.competitionData.competitionFees}</div>
						
											<input type="hidden" ref="competitionFees" name="competitionFees" value={this.props.competitionData.competitionFees}/>
											<input type="hidden" ref="comp_id" name="comp_id" value={this.props.competitionData._id}/>
											<input type="hidden" ref="QPId" name="QPId" value={this.props.CompetitionExamData.questionPaperId}/>
										</div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 rfoac">
										<button className="btn btn-primary paybtn"  onClick={this.confirmPayment.bind(this)}>Pay &nbsp; <i className="fa fa-inr" aria-hidden="true"></i>&nbsp;{this.props.competitionData.competitionFees} to Register</button>
									</div>
									</div>
								</div>
							:
								<div className="nopadLeft text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 noEarning MarginBottom20 noDataInvoiceList">Competition not created for your category({this.props.studentMasterData.category}/{this.props.studentMasterData.subCategory}).</div>

							}
						 </div>
						
						</div>
					   </div>
					  </div>
					</div>
				  </section>
				</div>
			</div>
			);
		}else{
			return(
				<div>Loading... Please wait</div>
			);
		}
	}
}
export default CompetitionDetailsContainer = withTracker(props=>{
	const postHandle 	= Meteor.subscribe("LoginInStudent",Meteor.userId());
	const loading 		= !postHandle.ready();
	var studentMasterData = StudentMaster.findOne({"studentId":Meteor.userId()});
	

	var compId 			= FlowRouter.getParam('compId');
	var postHandleComp 	= Meteor.subscribe("singleCompetition",compId);
	var loadingComp    	= !postHandleComp.ready();
	var competitionData = ExamMaster.findOne({"_id":compId})||{};

	
	var dateformat = moment(competitionData.competitionDate).format('MMM Do YYYY');
	if(competitionData){
		var CompetitionExamData = competitionData.competitionExams;
		// console.log("CompetitionExamData",CompetitionExamData);
		}
		if(CompetitionExamData){
			var arrIndex = CompetitionExamData.findIndex(function(object,index){ return object.category == studentMasterData.category && object.subCategory == studentMasterData.subCategory});
			 CompetitionExamData = competitionData.competitionExams[arrIndex];

	}
	return{
		loading,
		competitionData,
		CompetitionExamData,
		dateformat,
		studentMasterData
	}
})(CompetitionDetailsforPayment);