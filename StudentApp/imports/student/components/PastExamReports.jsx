

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {MyExamMaster} from '/imports/student/api/myExamMaster.js';
// import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';

export default class PastExamReports extends TrackerReact(Component)  {
	constructor(){
		  super();
		    this.state = {
		       facilityPermission : 'waitingforResult',
		       getAllExamReport   : '',
		    }
		}

	componentWillMount(){
  		Meteor.call("isAuthenticated","MainExam","MainExamReports",(err,res)=>{
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
	componentDidMount(){
		
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}

		Meteor.call("getStudentMainExamReport",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res){					
					this.setState({
						getAllExamReport:res,
					});
				}
				
				
			}
		});
	}
	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

	// getAllExamReport(){
	// 	var myExamHandle = Meteor.subscribe("showAllStudExams",Meteor.userId()).ready();
	// 	var mainExamReport = MyExamMaster.find({"StudentId":Meteor.userId(),"examStatus":"Completed",},{fields:{"competitionName":1,"examDate":1,"category":1,"totalQuestion":1,"attemptedQues":1,"correctAnswer":1,"wrongAnswer":1,"examSolvedTime":1,"totalScore":1}}).fetch();
	// 	// console.log("mainExamReport",mainExamReport);
	// 	if(mainExamReport){
	// 		return mainExamReport;
	// 	}else{
	// 		return 0;
	// 	}
	// }

	// getAllExamReport(){
	// 	Meteor.call("getStudentMainExamReport",(err,res)=>{
	// 		if(err){
	// 			console.log(err);
	// 		}else{
	// 			if(res){
	// 				console.log("res===================>",res);
	// 				this.setState({
	// 					getAllExamReport:res,
	// 				});
	// 			}
				
				
	// 		}
	// 	});
	// }

	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
			
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>My Exams</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                   <div className="box-header with-border">
					            <h3 className="box-title">Main Exam Reports</h3>
					        </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ExamReportTable">
				              		<table className="table table-striped formTable">
									    <thead className="tableHeader">
									        <tr>
									            <th className="col-lg-1 tab-Table">Sr.No</th>
									            <th className="col-lg-5">Exam Name </th>
									            <th className="col-lg-2"> Exam Date </th>
									            <th className="col-lg-1 tab-Table"> Category </th>
									            <th className="col-lg-2 tab-Table"> Total Ques  </th>
									            <th className="col-lg-3 tab-Table"> Attempted Ques </th>
									            <th className="col-lg-3 tab-Table"> Correct Ans </th>
									            <th className="col-lg-3 tab-Table">  Wrong Ans</th>
									            <th className="col-lg-3 tab-Table">  Time (mm:ss)</th>
									            <th className="col-lg-3 tab-Table">  Total Score </th>
									            
									        </tr>
									    </thead>
								{/*	{this.getAllExamReport()!=0 ?
									    <tbody className="myAllTable">
									     	{this.getAllExamReport().map((Exams,index)=>{
									     	return <tr key={index}>
									     			<td className="tab-Table"></td>
									     			<td>{Exams.competitionName}</td>
									     			<td>{moment(Exams.examDate).format('DD/MM/YYYY')}</td>
									     			<td className="tab-Table">{Exams.category}</td>
									     			<td className="tab-Table">{Exams.totalQuestion}</td>
									     			<td className="tab-Table">{Exams.attemptedQues}</td>
									     			<td className="tab-Table">{Exams.correctAnswer}</td>
									     			<td className="tab-Table">{Exams.wrongAnswer}</td>
									     			<td className="tab-Table">{Exams.examSolvedTime}</td>
									     			<td className="tab-Table">{Exams.totalScore}</td>
									     			
									     			
									     		</tr>
									     		})
									     }
									    </tbody>
									:
								    	<tbody className="OESDataNotAvailable">
							    			<tr>
							    				<td colSpan="10">"Reports are Not Yet Available."</td>
							    			</tr>
							    		</tbody>
						    		}*/}

						    			{this.state.getAllExamReport!=0 ?
									    <tbody className="myAllTable">
									     	{this.state.getAllExamReport.map((Exams,index)=>{
									     	return <tr key={index}>
									     			<td className="tab-Table"></td>
									     			<td>{Exams.competitionName}</td>
									     			<td>{moment(Exams.examDate).format('DD/MM/YYYY')}</td>
									     			<td className="tab-Table">{Exams.category}</td>
									     			<td className="tab-Table">{Exams.totalQuestion}</td>
									     			<td className="tab-Table">{Exams.attemptedQues}</td>
									     			<td className="tab-Table">{Exams.correctAnswer}</td>
									     			<td className="tab-Table">{Exams.wrongAnswer}</td>
									     			<td className="tab-Table">{Exams.examSolvedTime}</td>
									     			<td className="tab-Table">{Exams.totalScore}</td>
									     			
									     			
									     		</tr>
									     		})
									     }
									    </tbody>
									:
								    	<tbody className="OESDataNotAvailable">
							    			<tr>
							    				<td colSpan="10">"Reports are Not Yet Available."</td>
							    			</tr>
							    		</tbody>
						    		}
									</table>
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
		
			 }else if (this.state.facilityPermission == false ){
			  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		 return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
		}
	}
}