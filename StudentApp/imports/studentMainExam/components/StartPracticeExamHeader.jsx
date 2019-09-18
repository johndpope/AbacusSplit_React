

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';

import StartPracticeExam from './StartPracticeExam.jsx';
import {Session} from 'meteor/session';

import {MyPracticeExamMaster} from '/imports/student/api/myPracticeExamMaster.js';

class StartPracticeExamHeader extends TrackerReact(Component)  {
	componentDidMount(){
		
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
	// clearInterval(Session.get("interval"));

	}
	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}	
	render(){		
		return(
			
			<div>
			
			{/*<div className="CountDecreBackArrow">0</div>*/}
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header stud">
		            <h1>Answer Sheet</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight ">
		                  	
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 examDetailsWrap">
									<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap1">{this.props.examName}</div>
									<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap2">Total Questions : {this.props.quesPaperData.noOfQuestion}</div>
									<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap3">Total Marks :  {this.props.quesPaperData.totalMarks}</div>
									<div className="col-lg-3 col-md-1 col-sm-1"></div>
									<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap4">{moment().format('hh:mm a')} <br/>{moment().format("DD-MM-YYYY")}</div>
									<div className="col-lg-2 col-md-1 col-sm-1 countdownWrapDiv">
										<span className=" countdown countdownWrap"></span>
									</div>
									
								</div>
								<StartPracticeExam id={FlowRouter.getParam("id")}/>

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
export default StartPracticeExamHeaderContainer = withTracker(props=>{
	var id = FlowRouter.getParam("id");
	const postHandle1     =  Meteor.subscribe('showSinglePracticePaper',id);
	const loadingTest1    = !postHandle1.ready();
	var practiceExamData  = MyPracticeExamMaster.findOne({"_id":id})||{};
	const postHandle      =  Meteor.subscribe('singleQuestionPaper',practiceExamData.examPaperId);
	const loadingTest     = !postHandle.ready();
	if(practiceExamData){
		var quesPaperData =  QuestionPaperMaster.findOne({"_id":practiceExamData.examPaperId})||{};
		

	}
	var examName ="Practice Exam";

	const examTime = practiceExamData.examTime; //-------------get updated exam time
	if(examTime){	
//--------------- execute function after 1 seconds. -------------------
		if(Session.get('loadingTestPractice')){
			var interval = setInterval(function() {
			Session.set("interval",interval);
			if(examTime){
				// var examTim1 = $('.countdownWrap').text();
				// Meteor.call("updateExamTime",examTim1,FlowRouter.getParam("id")); //update exam time after every 1 second.
			  var timer = examTime.split(':');
			  var minutes = parseInt(timer[0], 10);
			  var seconds = parseInt(timer[1], 10);
			  --seconds;
			  minutes = (seconds < 0) ? --minutes : minutes;
			  if (minutes < 0){
			  		location.reload();
			  		clearInterval(interval);
				  	FlowRouter.go("/practiceExamResult/"+id);
				  	
			  }else{
				  seconds = (seconds < 0) ? 59 : seconds;
				  seconds = (seconds < 10) ? '0' + seconds : seconds;

				  minutes = (minutes < 10) ?  minutes : minutes;
				  $('.countdown').html(minutes + ':' + seconds);
				  examTime = minutes + ':' + seconds;
				}
			}

			}, 1000);
			clearInterval(Session.get("interval"));
		}else{
			
		}
	}

	return{
		examName,
		quesPaperData,
		examTime,
	}
})(StartPracticeExamHeader);