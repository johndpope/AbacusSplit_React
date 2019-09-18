
import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import Webcam from 'react-webcam';

import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {ExamMaster} from '/imports/studentMainExam/api/examMaster.js';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';
import {MyExamMaster} from '/imports/student/api/myExamMaster.js';
import {StudentMaster} from '/imports/student/api/studentMaster.js';
import CompetitionDetailsforPayment from '/imports/student/components/CompetitionDetailsforPayment.jsx'; 
import {CompetitionRegisterOrder} from '/imports/student/api/competitionRegisterOrder.js';

class IAgreeAndStartExam extends TrackerReact(Component)  {
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
		if($('.mainExamCheckbox').is(':checked')){
		event.preventDefault();
		$('.startExamBtn').css('display','none');
		$('.wrProcessing').css('display','block');
		navigator.getMedia = ( 
		// navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
		navigator.getMedia({video: true}, function() {
		  // console.log("webcam is available");
		  Meteor.call("StartExamCategoryWise",FlowRouter.getParam('competitionId'),(error,result)=>{
			if(error){
				swal(error);
			}else{
				var id = result;
				// console.log("id",id);
				if(id){
					// Meteor.call("updateMyExamFee",id); 
					// location.reload();
					FlowRouter.go('/startExam/'+id);
				}else{
					$('.startExamBtn').css('display','block');
					$('.wrProcessing').css('display','none');
					swal("Please start exam again","This is happened due to bad internet connection","warning");
				}
			}
		});

		}, function() {
			$('.startExamBtn').css('display','Block');
			$('.wrProcessing').css('display','none');
		    swal("As per company's rule, Student will be not allowed to attempt the final exam without camera","","warning");
		});
	}else{
		swal("Please select I have read the instructions","","warning");
	}
		
	}

	gotoPreviousMainExam(event){
		var id = $(event.target).attr('id');
		navigator.getMedia = ( 
		// navigator.getUserMedia || // use the proper vendor prefix
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
		navigator.getMedia({video: true}, function() {
		  // console.log("webcam is available");
		  FlowRouter.go("/startExam/"+id);
		  }, function() {
		  	FlowRouter.go('/iAgreeAndStartExam');
		    swal("As per our rule, you will be not allowed to attempt exam without camera","","warning");
		});
		// FlowRouter.go("/startExam/"+id);
	}

	MainExamComplete(event){
		var id = $(event.target).attr('id');
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
		
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
		if(this.state.showstartbtn){
		if(!this.props.loadingCRO && !this.props.loading && !this.props.loadingMyExam){

		return(
			
			<div>
			<div className="CountIncrement">0</div>
			<div className="CountDecreBackArrow">0</div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		           
		            	<h1>Start Main Exam </h1> 
		            	
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		            	{
		            		<div className="box-header with-border boxMinHeight">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ExamInstructionWrap ">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Instructions for Practice Test:</div> 
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 instructionList instructionWrap">
										{this.props.competitionData?this.props.competitionData.termsCondition:null}
										{/*{this.props.ME_Instruction.instruction}*/}
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 bginstruction">

									</div>
									<form>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 IagreeExamWrap">
											<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
												<div className="checkbox checkbox-success">
							                        <input type="checkbox" className="seleectQueInput mainExamCheckbox" name="seleectQueInput"/>
							                        <label className="clrinstruc">
							                            I have read the instructions.
							                        </label>
							                    </div>
											</div>
											
										</div>
										
									</form>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 startExamBtnnn">
										<button type="submit" className="btn btn-primary startExamBtn" onClick={this.startExam.bind(this)}>Start Exam </button>
										<button type="button" className="btn btn-primary wrProcessing">We are processing... </button>
										
									</div>
								</div>
							</div>														
								
						}

						</div>
					  </div>
					</div>
				  </section>
				</div>
			</div>
			);}
			else{
				return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <img className=" loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
				</div>);
			}

			}else{
				return(
					<div>
				        {/* Content Wrapper. Contains page content */}
				        <div className="content-wrapper">
				          {/* Content Header (Page header) */}
				          <section className="content-header">
				            
				            	<h1 className="stud">Start Main Exam</h1>
				            
				          </section>
				          {/* Main content */}
				          <section className="content viewContent">
				            <div className="row">
				              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
				                <div className="box">
								<div className="box-header with-border boxMinHeight  studDataNotExist">
								    <div className="examLoadingTimeDiv">
										{/*this.tryLoadingAgainforBtn()*/}
										Loading please wait... 
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

			 }else if (this.state.facilityPermission == false ){
			  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className=" loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
		}


	}
}
export default IAgreeAndStartExamContainer = withTracker(props=>{
	clearInterval(Session.get("MainExaminterval"));
	var PostHandle      = Meteor.subscribe("singleCompetition",FlowRouter.getParam('competitionId'));
	var loading         = !PostHandle.ready();
	var competitionData = ExamMaster.findOne({"_id":FlowRouter.getParam('competitionId')})||{};
	var PostHandleCROrder = Meteor.subscribe("latestCRONewSingle",competitionData._id);
	var loadingCRO        = !PostHandleCROrder.ready();
	var isStudentRegisterForComp = CompetitionRegisterOrder.findOne({"studentId":Meteor.userId(),"competitionId":competitionData._id,"status":"paid"},{sort:{"paymentDate":-1}})||{};
	if(isStudentRegisterForComp){
		var PostHandleMyExam = Meteor.subscribe("showSinglePaperNewStudentwise",isStudentRegisterForComp.competitionId);
		var loadingMyExam    = !PostHandleMyExam.ready();
	}
	return {
		loadingCRO,
		loadingMyExam,
		// LoadingTest,
		// loadingTest2,
		competitionData,
		loading,
	}

})(IAgreeAndStartExam);
