/*  
	COMPONENT:  Exam Result 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will show final paper. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Session} from 'meteor/session';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';

import {ExamMaster} from '/imports/studentMainExam/api/examMaster.js';
// import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';

import {MyExamMaster} from '/imports/student/api/myExamMaster.js';
// import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';

class ExamResult extends TrackerReact(Component)  {
	
	constructor(props){
		super(props);
		this.state={
			'myIndex'     : '',
			'backarraowcnt':'',
		}
	}

	componentDidMount(){	
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		Meteor.call("updateStudExamStatus",Meteor.userId());
	}

	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
	
	render(){
		if(!this.props.loadingTest){
		return(
			
			<div>
				<div className="CountIncrement">0</div>
					<div className="CountDecreBackArrow">0</div>
		        		<div className="content-wrapper content-wrapperexampaper">
		        		<section className="content-header1"></section>
		          		<section className="content viewContent">
		            	<div className="row">
		              	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
	                	<div className="box">
	                   		<div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12 col-lg-offset-3 col-md-offset-3 examDetailsWrap">
										<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap1">{this.props.answerData.competitionName}</div>
										<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap2">Total Questions : {this.props.answerData.totalQuestion}</div>
										<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap3">Total Marks :  {this.props.answerData.totalMarks}</div>
										<div className="col-lg-3 col-md-3 col-sm-3"></div>
									</div>
								</div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colpadding paddingTopBoard">
							<div className="col-lg-2 col-md-2 colpadding resultscreen">
								<img src="/images/leftsideimg.png" />
							</div>
							<div id="mySlideShowStartExam" className="col-lg-8 col-md-8 col-sm-8 carousel slide " data-ride="carousel" data-interval="false">
								<div className="carousel-inner">
									<div className="col-lg-12 col-md-12">
										{this.props.percentage >= 75 && this.props.percentage <=100 ?
											<h2 className="congrats">Excellent Work! </h2>
											:
											this.props.percentage >= 50 && this.props.percentage <=75 ?
												<h2 className="congrats">Good Job Done!</h2>
											:
											this.props.percentage >= 25 && this.props.percentage <=50 ?
												<h2 className="congrats">Need More Practice! </h2>
											:
											this.props.percentage >= 0 && this.props.percentage <=25 ?
												<span>
												<h2 className="congrats poorSec"> Sorry... Poor Job!! </h2>
												<h4 className="congrats">Best wishes for next exam! </h4>
												</span>
											:
												null
									    }
							        </div>
									<div className="col-lg-12 col-md-12 col-sm-12 examresultWrap">{moment().format('MMMM DD, YYYY')} - {this.props.answerData.examType} Results</div>
										<div className="col-lg-2 col-md-2 col-sm-2 congratsImgWrap congrats nopadding">
										{/*<img src="/images/congrats.gif" className="congratsImg"/>*/}
										{this.props.percentage >= 75 && this.props.percentage <=100 ?
												<img src="/images/congrats.gif" className="congratsImg"/>
												:
												this.props.percentage >= 50 && this.props.percentage <=75 ?
													<img src="/images/congrats.gif" className="congratsImg"/>
												:
												this.props.percentage >= 25 && this.props.percentage <=50 ?
													<img src="/images/needImprovement.gif" className="congratsImg"/>
												:
												this.props.percentage >= 0 && this.props.percentage <=25 ?
													<img src="/images/zeroMark.gif" className="congratsImg"/>
												:
													null
									    		}
										</div>
							        <div className="col-lg-8 col-md-8 col-sm-8 resultSecWrap">
										<div className="col-lg-12 col-md-12 col-sm-12">
											<div className="col-lg-12 col-md-12 totalScore">
												Total Score : {this.props.answerData.totalScore}
											</div>
									   	</div>
										<div className="col-lg-12 col-md-12 col-sm-12 markksWrap">
										</div>
									</div>
									<div className="col-lg-2 col-md-2 col-sm-2 congratsImgWrap congrats nopadding">
										{/*<img src="/images/congrats.gif" className="congratsImg"/>*/}
										{this.props.percentage >= 75 && this.props.percentage <=100 ?
											<img src="/images/congrats.gif" className="congratsImg"/>
											:
											this.props.percentage >= 50 && this.props.percentage <=75 ?
												<img src="/images/congrats.gif" className="congratsImg"/>
											:
											this.props.percentage >= 25 && this.props.percentage <=50 ?
												<img src="/images/needImprovement.gif" className="congratsImg"/>
											:
											this.props.percentage >= 0 && this.props.percentage <=25 ?
												<img src="/images/zeroMark.gif" className="congratsImg"/>
											:
												null
								    		}

									</div>
										<div className="col-lg-12 col-md-12">
											<div className="col-lg-3 col-md-3 col-sm-3 studmarksSec">
												<div className="marksNameSec">Total Questions</div>
												<span className="marksSec1">{this.props.answerData.totalQuestion}</span>
											</div>
											<div className="col-lg-3 col-md-3 col-sm-3 studmarksSec">
												<div className="marksNameSec">Attempted Questions</div>
												<span className="marksSec2">{this.props.answerData.attemptedQues}</span>
											</div>
											<div className="col-lg-3 col-md-3 col-sm-3 studmarksSec">
												<div className="marksNameSec">Correct Answers</div>
												<span className="marksSec3">{this.props.answerData.correctAnswer}</span>
											</div>
											<div className="col-lg-3 col-md-3 col-sm-3 studmarksSec">
												<div className="marksNameSec">Wrong Answers</div>
												<span className="marksSec4">{this.props.answerData.wrongAnswer}</span>
											</div>
							        	</div>
								</div>
							</div>
							<div className="col-lg-2 col-md-2 colpadding">
								<img src="/images/rightsideimg.png"/>
							</div>
						</div>
							<div className="col-lg-2 col-md-2 col-sm-2 examDetailsWrap4 pull-right">{moment().format('hh:mm a')} <br/>{moment().format("DD-MM-YYYY")}</div>
								<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3">
									{this.props.studImages ? this.props.studImages.map((images, index)=>{
									return <div key={index} className="col-lg-4 col-md-4 col-sm-4 imageWraper">
										<img src={images.studentImage} className="col-lg-12 col-md-12 img-thumbnail" />
									</div>
									}) : null}
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
			
			<div>
				<div className="CountIncrement">0</div>
				<div className="CountDecreBackArrow">0</div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1>Exam Page</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight ">
			                  	<h1 className="col-lg-12 col-md-12 col-sm-12 examFinishedStatus">Loading... Please Wait </h1> 
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
}
export default ExamResultContainer = withTracker(props=>{
	var id = FlowRouter.getParam("id");
	clearInterval(Session.get("MainExaminterval"));
	// Meteor.call("updateStudExamStatus",Meteor.userId());
	const postHandle1     =  Meteor.subscribe('showSingleAnsPaper',id);
	const loadingTest     = !postHandle1.ready();
	var answerData        = MyExamMaster.findOne({"_id":id})||{};
	// console.log("answerData",answerData);
	if(answerData){
		var studImages = answerData.studentImageArray;
		var percentage = (parseInt(answerData.totalScore)/parseInt(answerData.totalMarks))*100;
		// console.log(percentage);
	}else{
		var studImages = [];
	}
	
	return{
		answerData,
		studImages,
		loadingTest,
		percentage
	}
})(ExamResult);