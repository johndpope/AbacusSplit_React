import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import Webcam from 'react-webcam';

import {StudentMaster} from '/imports/student/api/studentMaster.js';
import {MyExamMaster} from '/imports/student/api/myExamMaster.js';
import CompetitionDetailsforPayment from '/imports/student/components/CompetitionDetailsforPayment.jsx'; 
import {CompetitionRegisterOrder} from '/imports/student/api/competitionRegisterOrder.js';

import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {ExamMaster} from '/imports/studentMainExam/api/examMaster.js';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';



class StudentRegistrationforCompetition extends Component  {
	
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

	constructor(props){
		super(props);
		this.state={
			'defaultTime':'00:15',
			'defaultBtnTime':'00:15',
			showButton:true,
			showstartbtn: true,
			facilityPermission : 'waitingforResult',
		}
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MainExam","StartMainExam",(err,res)=>{
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

	startExam(event){
		event.preventDefault();
		navigator.getMedia = ( 
		// navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
		navigator.getMedia({video: true}, function() {
		  // console.log("webcam is available");
		  Meteor.call("StartExamCategoryWise",(error,result)=>{
			if(error){
				swal(error);
			}else{
				var id = result;
				// console.log("id",id);
				if(id){
					FlowRouter.go('/startExam/'+id);
				}else{
					swal("Please start exam again","This is happened due to bad internet connection","warning");
				}
			}
		});

		}, function() {
		    swal("As per company's rule, Student will be not allowed to attempt the final exam without camera","","warning");
		});
		
	}

	gotoPreviousMainExam(event){
		var id = $(event.target).attr('id');
		var compId = $(event.target).attr('data-text');
		navigator.getMedia = ( 
		// navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
		navigator.getMedia({video: true}, function() {
		  // console.log("webcam is available");
		  FlowRouter.go("/startExam/"+id);
		  }, function() {
		  	FlowRouter.go('/iAgreeAndStartExam/'+compId);
		    swal("As per our rule, you will be not allowed to attempt exam without camera","","warning");
		});
		// FlowRouter.go("/startExam/"+id);
	}

	MainExamComplete(event){
		var id = $(event.target).attr('id');
		// console.log("id",id);
		swal({
			  title              : 'Are you sure?',
			  text               : 'You will not be able to attempt this exam!',
			  type               : 'warning',
			  showCancelButton   : true,
			  confirmButtonColor : '#dd6b55',
			  cancelButtonColor  : '#d44',
			  confirmButtonText  : 'Yes',
			  cancelButtonText   : 'No',
			  closeOnConfirm     : false
			}, function() {
			Meteor.call("ExamFinished",id,(error,result)=>{
				if(error){

				}else{
					FlowRouter.go("/iAgreeAndStartExam");
					Meteor.call("removeTempCurMEStudData");
				}
			});

		});
	}

	// this function is assuming due to bab internet or internet is not available this function will execute
	tryLoadingAgain(){
		 examTime = this.state.defaultTime;
		var LoadingInterval = setInterval(function() {
		
		if(examTime){
		  var timer = examTime.split(':');
		  var minutes = parseInt(timer[0], 10);
		  var seconds = parseInt(timer[1], 10);
		  --seconds;
		  minutes = (seconds < 0) ? --minutes : minutes;
		  if (minutes < 0){
		  	clearInterval(LoadingInterval);
			$('.examLoadingTimeDiv').html("Please check your internet connection or refresh your exam window");

		  }else{
		  	 seconds = (seconds < 0) ? 59 : seconds;
			  seconds = (seconds < 10) ? '0' + seconds : seconds;

			  minutes = (minutes < 10) ?  minutes : minutes;
			 $('.examLoadingTimeDiv').html("Exam is loading... Please Wait");
			  examTime = minutes + ':' + seconds;
			}
		}

		}, 1000);
		
	}

	// this function is assuming due to bab internet or internet is not available this function will execute
	tryLoadingAgainforBtn(){
		 examTime = this.state.defaultBtnTime;
		var LoadingInterval = setInterval(function() {
		
		if(examTime){
		  var timer = examTime.split(':');
		  var minutes = parseInt(timer[0], 10);
		  var seconds = parseInt(timer[1], 10);
		  --seconds;
		  minutes = (seconds < 0) ? --minutes : minutes;
		  if (minutes < 0){
		  	clearInterval(LoadingInterval);
			$('.examLoadingTimeDiv').html("Please check your internet connection or refresh your exam window");

		  }else{
		  	 seconds = (seconds < 0) ? 59 : seconds;
			  seconds = (seconds < 10) ? '0' + seconds : seconds;

			  minutes = (minutes < 10) ?  minutes : minutes;
			 $('.examLoadingTimeDiv').html("Exam is loading... Please Wait");
			  examTime = minutes + ':' + seconds;
			}
		}

		}, 1000);
		
	}

	
	render(){
		if(!this.props.loadingCRO && !this.props.loading && !this.props.loadingMyExam && !this.props.LoadingTest && !this.props.loadingTest3){
			return(
			<div className="col-lg-12 col-md-12 col-sm-12">
				<div  className="col-lg-12  col-md-12 col-sm-12 practicetesttitle text-center">
					<div className="col-lg-12  col-md-12 studProfileTit23">
						<div className="col-lg-12  col-md-12">
							<i className="fa fa-file-text-o" aria-hidden="true"></i>&nbsp; Competition Details
						</div>	
					</div>
						<div id="multiExamCarousel" className="carousel slide" data-ride="carousel">
						<a className="col-lg-12 col-md-12 allExamlink" href="/MultipleCompetition" title="Click here to register for competitions"><button className="btn startexambtn1 startmultiexambtn1"><blink>List of competitions</blink></button></a>
						<div className="crslDiv col-lg-10 col-lg-offset-1">
						<div className="carousel-inner">
								{this.props.competitionData.length>0 ?
									this.props.competitionData.map((competitionInfo,index)=>{										
										return(											
										<div className={index==0?"item active":"item"}  key={index}>
											<div className="fontstyle examtitlecolor">{competitionInfo.competitionName}</div>
											<div className="fontstyle">On</div>
											<div className="fontstyle">{competitionInfo.EXAMDate}</div>
											<div className="fontstyle">{competitionInfo.startTime} To {competitionInfo.endTime}</div>
											{competitionInfo.studentPaymentStatus=="paid"?												            				
												this.props.todayDate < competitionInfo.examDate ?
													<div className="fontstyle" >												
														<div className="fontstyle">You have Paid {competitionInfo.competitionFees} Rs.</div>												
													</div>
												:
												!competitionInfo.lastInCompExamIdStatus?
													competitionInfo.examDataStatus=="Completed"?
														<div className="fontstyle" >												
															<a href="/pastExamReports"> <button type="submit" className="btn startexambtn1 startmultiexambtn">Result</button></a>												
														</div>
													:
													competitionInfo.competitionStatus=="start"?
																competitionInfo.examStartStatus=="start"?
																	<div className="fontstyle" >
																		<a href={"/iAgreeAndStartExam/"+competitionInfo._id}> <button type="submit" onClick={this.startExam.bind(this)} className="btn startexambtn1 startmultiexambtn">Start Exam </button></a>
																	</div>
																	:	
																	<div className="fontstyle" >
																		<div className="fontstyle">Your exam not started yet.</div>															
																	</div>
															:
															this.props.todayDate>competitionInfo.examDate?
																competitionInfo.examDataStatus=="Completed"?
																	<div className="fontstyle" >												
																		<a href="/pastExamReports"> <button type="submit" className="btn startexambtn1 startmultiexambtn">Result</button></a>												
																	</div>
																	:
																	<div className="fontstyle" >												
																		<div className="fontstyle">You have Paid {competitionInfo.competitionFees} Rs.</div>												
																	</div>

																:
																<div className="fontstyle" >																	
																		<div className="fontstyle">Competition not started yet</div>																	
																</div>
												:

													competitionInfo.examDataStatus=="InComplete"?
																this.state.showButton ?
																<div className="fontstyle" >
																	<a> <button type="submit"  className="btn startexambtn1 startmultiexambtn" data-text={competitionInfo._id} id={competitionInfo.examId} onClick={this.gotoPreviousMainExam.bind(this)}>Continue Exam </button></a>
																	{/*<a> <button type="submit"  className="btn startexambtn1 startmultiexambtn" id={competitionInfo.examId} onClick={this.MainExamComplete.bind(this)}>Discontinue Exam </button></a>*/}
																</div> 

														:
														<div className="fontstyle" >
															<div className="fontstyle">Loading please wait...</div>
														</div>
													:
													<div className="fontstyle" >												
															<a href="/pastExamReports"> <button type="submit" className="btn startexambtn1 startmultiexambtn">Result</button></a>												
													</div>

											:
												competitionInfo.timeStatus=="valid" && competitionInfo.examYear=="NotAccept" ?
													<div className="fontstyle" >									
														<a href={`/competitionDetails/${competitionInfo._id}`} title="Click to register"><button className="btn startexambtn1 startmultiexambtn">Register for Competition</button></a>
													</div>
													:														            			
													competitionInfo.timeStatus=="invalid"  || competitionInfo.examYear=="NotAccept"?
														<div className="fontstyle" >
															<div className="fontstyle">Competition has finished</div>
														</div>
													:						            					            			
													<div className="fontstyle" >									
														<a href={`/competitionDetails/${competitionInfo._id}`} title="Click to register"><button className="btn startexambtn1 startmultiexambtn">Register for Competition</button></a>
													</div>
											}

										</div>)										
										})

									:
									<div className="fontstyle" >	
					    				<div>"Competition will coming soon"</div>
					    			</div>
								}
						</div>
						</div>
						<a className="left carousel-control multiExamLeft" href="#multiExamCarousel" data-slide="prev">
					      <span className="glyphicon glyphicon-chevron-left"></span>
					      <span className="sr-only">Pre</span>
					    </a>
					    <a className="right carousel-control multiExamLeft" href="#multiExamCarousel" data-slide="next">
					      <span className="glyphicon glyphicon-chevron-right"></span>
					      <span className="sr-only">Next</span>
					    </a>
					</div>
				</div>
			</div>
			);
		}else{
			return(
			<div className="col-lg-12 col-md-12 col-sm-12">
				<div  className="col-lg-12  col-md-12 col-sm-12 practicetesttitle">
					<div className="col-lg-12  col-md-12 studProfileTit23">
						<div className="col-lg-12  col-md-12">
							<i className="fa fa-file-text-o" aria-hidden="true"></i>&nbsp; Competition Details
						</div>	
						<div className="fontstyle" >	
							<div>"Loading please wait..."</div>
						</div>
					</div>						
				</div>
			</div>
			);

		}
				
	}
}
export default studRegforCompContainer = withTracker(props=>{
	clearInterval(Session.get("MainExaminterval"));
	const postHandle = Meteor.subscribe("LoginInStudent",Meteor.userId());
	const LoadingTest = !postHandle.ready();
	const postHandle3   = Meteor.subscribe("showLoginStudInCompleteExam");
	const loadingTest3  = !postHandle3.ready();
	
	var studentData = StudentMaster.findOne({"studentId":Meteor.userId()})||{};

	var PostHandle = Meteor.subscribe("latestCompetition");
	var loading = !PostHandle.ready();
	var today = new Date();
	var todayDate = moment(today).format('L');
	var currentTime = moment(today).format('LT');

	// var competitionData = ExamMaster.find({}).sort({"competitionDate": -1}).limit(1)

	var competitionData = ExamMaster.find({"competitionView":"Show"},{sort:{"competitionDate":-1}}).fetch()||{};
	// var competitionData = ExamMaster.find({"competitionView":{ $ne: "Hide" }},{sort:{"competitionDate":-1}}).fetch()||{};
	for(i=0;i<competitionData.length;i++){
		if(competitionData[i] && studentData){
			competitionData[i].examDate = moment(competitionData[i].competitionDate).format('L');
			competitionData[i].EXAMDate = moment(competitionData[i].examDate).format("DD/MM/YYYY");
			competitionData[i].EXAMDate = moment(competitionData[i].examDate).format("DD/MM/YYYY");
			// competitionInfo.competitionView
			// console.log("EXAMDate---->",competitionData[i].EXAMDate);

			var ExamStartTime = moment(currentTime, 'h:mma');
			var ExamEndTime   = moment(competitionData[i].endTime, 'h:mma');
			if(today.getTime()<(competitionData[i].competitionDate).getTime()){
				competitionData[i].examYear = "Accept";
			}else{
				competitionData[i].examYear = "NotAccept";
			}	

			if(todayDate>competitionData[i].examDate){
				competitionData[i].examTimeStatus = "OldExam";
			}else if(todayDate<=competitionData[i].examDate){
				competitionData[i].examTimeStatus = "NewExam";
			}
			if(todayDate==competitionData[i].examDate && ExamStartTime>ExamEndTime){
				competitionData[i].timeStatus = "invalid";
			}else if(todayDate == competitionData[i].examDate && ExamStartTime<ExamEndTime){
				competitionData[i].timeStatus = "valid";
			}else{
				competitionData[i].timeStatus = "nextCompetition";
			}

			var studentCategory = 	competitionData[i].competitionExams;
			if(todayDate<=competitionData[i].examDate){
					competitionData[i].nextExamStatus="Present"
				}else{
					competitionData[i].nextExamStatus = "Absent"
				}
		}
		competitionData[i].PayDate         = moment(competitionData[i].createdAt).format('MMM Do YYYY');
		competitionData[i].currentExamDate = moment(competitionData[i].examDate).format("DD/MM/YYYY");
		// console.log("studentCategory",studentCategory);
		if(studentCategory){
			var index = studentCategory.findIndex(data => data.subCategory == studentData.subCategory);
			var categoryWiseExamData = studentCategory[index];
			if(categoryWiseExamData){
				competitionData[i].examStartStatus = categoryWiseExamData.examStatus;
			}
		}
		var PostHandleCROrder        = Meteor.subscribe("latestCRO",competitionData[i]._id);
		var loadingCRO               = !PostHandleCROrder.ready();
		var isStudentRegisterForComp = CompetitionRegisterOrder.findOne({"studentId":Meteor.userId(),"competitionId":competitionData[i]._id,"status":"paid"})||{};
		// console.log("isStudentRegisterForComp",isStudentRegisterForComp);
		if(isStudentRegisterForComp && isStudentRegisterForComp._id){
			competitionData[i].studentPaymentStatus = "paid";
			var PostHandleMyExam = Meteor.subscribe("showSinglePaperNew",isStudentRegisterForComp.competitionId);
			var loadingMyExam    = !PostHandleMyExam.ready();
			var examData         = MyExamMaster.findOne({"competitionId":isStudentRegisterForComp.competitionId,"StudentId":Meteor.userId()})||{};
			// console.log("examData",examData);
			if(examData){
				competitionData[i].examDataStatus = examData.examStatus;
				competitionData[i].examId         = examData._id;
			}
		}else{
			competitionData[i].studentPaymentStatus ="unPaid";
		}
		// var ME_Instruction = InstructionMaster.findOne({"instructionFor" : "Main Exam"})||{};
		var LastIncompleteExam = MyExamMaster.findOne({"StudentId":Meteor.userId(),"competitionId":isStudentRegisterForComp.competitionId,"examStatus" : "InComplete"})||{};
		if(LastIncompleteExam){
			var lastInCompExamId                      = LastIncompleteExam._id;
			competitionData[i].lastInCompExamIdStatus = lastInCompExamId;
		}else{
			lastInCompExamId                          = '';
			competitionData[i].lastInCompExamIdStatus = '';
		}
	}
	
	return {
		lastInCompExamId,
		loadingCRO,
		loadingMyExam,
		LoadingTest,
		loadingTest3,
		isStudentRegisterForComp,
		competitionData,
		todayDate,
		currentTime,
		studentData,
		loading,
		categoryWiseExamData,
		examData,		
	}

})(StudentRegistrationforCompetition);