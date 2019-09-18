
import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {MyPracticeExamMaster} from '/imports/student/api/myPracticeExamMaster.js';
// import {MyPracticeExamMaster} from '/imports/admin/forms/student/api/myPracticeExamMaster.js';

class PracticeExamReports extends TrackerReact(Component)  {
	constructor(){
		  super();
		    this.state = {
		       facilityPermission : 'waitingforResult',
		    }
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

  	componentWillMount(){
  		 Meteor.call("isAuthenticated","PracticeExam","PracticeExamReports",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				this.setState({
					 facilityPermission : res,
				});
			}
		});
  	}


	
	examSolvingTime(start, end) {
	    var m1 = start;
		var m2 = end;
		if(m1 && m2){
			var min1 = m1.split(":");
			var min2 = m2.split(":");
			if(min1[1]=="00"){
				min1[0]-=1;
			}
			var res1 = min1[0]-min2[0];
			var res2 = (min1[1]=="00") ? 60-min2[1] : min1[1]-min2[1];
			if(res2==60){res1+=1;res2=0;}
			return res1+":"+res2;
		}else{
			return "01:00";
		}
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
		            <h1>My Exams</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	<div className="box-header with-border">
					            <h3 className="box-title">Practice Exam Reports</h3>
					        </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ExamReportTable">
				              		<table className="table table-striped formTable table-responsive " id="example">
									    <thead className="tableHeader">
									        <tr>
									            <th className="col-lg-1 tab-Table">Sr.No</th>
									            <th className="col-lg-5 col-md-3 col-sm-3">Exam Name </th>
									            <th className="col-lg-2 col-md-1 col-sm-1"> Date </th>
									            <th className="col-lg-1 col-md-1 col-sm-1 tab-Table"> Category </th>
									            <th className="col-lg-2 col-md-2 col-sm-2 tab-Table"> Total Questions  </th>
									            <th className="col-lg-3 col-md-1 col-sm-1 tab-Table"> Attempted Questions </th>
									            <th className="col-lg-3 col-md-1 col-sm-1 tab-Table"> Correct Answers </th>
									            <th className="col-lg-3 col-md-1 col-lg-1 tab-Table">  Wrong Answers</th>
									            <th className="col-lg-3 col-md-1 col-lg-1 tab-Table">  Time (mm:ss) </th>
									            <th className="col-lg-3 col-md-1 col-sm-1 tab-Table">  Total Score </th>
									            
									        </tr>
									    </thead>
									{this.props.practiceExamReport.length!=0 ?
									    <tbody className="myAllTable">
									     	{this.props.practiceExamReport.map((Exams,index)=>{
									     	return <tr key={index}>
									     			<td className="tab-Table"></td>
									     			<td>{Exams.examName}</td>
									     			<td>{Exams.date}</td>
									     			{/*<td>{moment(Exams.createdAt).format('DD/MM/YYYY')}</td>*/}
									     			<td className="tab-Table">{Exams.category}</td>
									     			<td className="tab-Table">{Exams.totalQuestion}</td>
									     			<td className="tab-Table">{Exams.attemptedQues}</td>
									     			<td className="tab-Table">{Exams.correctAnswer}</td>
									     			<td className="tab-Table">{Exams.wrongAnswer}</td>
									     			<td className="tab-Table">{this.examSolvingTime(Exams.originalTime,Exams.examTime)}</td>
									     			<td className="tab-Table">{Exams.totalScore}</td>
									     		</tr>
									     		})
									     }
									    </tbody>
									:
								    	<tbody className="OESDataNotAvailable">
							    			<tr>
							    				<td colSpan="9">"Reports are Not Yet Available."</td>
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
export default PracticeExamReportsContainer = withTracker(props=>{
	// var myExamHandle = Meteor.subscribe("showAllStudPracticeExams",Meteor.userId());
	var myExamHandle = Meteor.subscribe("showAllStudPracticeExamsSingle",Meteor.userId());
	var loadingData = !myExamHandle.ready();	
	var practiceExamReport = MyPracticeExamMaster.find({"StudentId":Meteor.userId(),"examStatus":"Completed"},{sort:{'createdAt':-1},fields:{"examName":1,"date":1,"category":1,"totalQuestion":1,"attemptedQues":1,"correctAnswer":1,"wrongAnswer":1,"originalTime":1,"totalScore":1,"examTime":1}}).fetch();
	
	return {
		loadingData,
		practiceExamReport
	}
})(PracticeExamReports);
