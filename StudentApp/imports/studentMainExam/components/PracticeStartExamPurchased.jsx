
import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {PackageQuestionPaperMaster} from '/imports/paymentProcess/api/packageQuestionPaperMaster.js';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';

// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import {MyPracticeExamMaster} from '/imports/admin/forms/student/api/myPracticeExamMaster.js';
// import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';

import {StudentMaster} from '/imports/student/api/studentMaster.js';
import {MyPracticeExamMaster} from '/imports/student/api/myPracticeExamMaster.js';
import {CompetitionRegisterOrder} from '/imports/student/api/competitionRegisterOrder.js';


class PracticeStartExamPurchased extends Component {
	constructor(props){
		super(props);
		this.state = ({
			showButton:true,
			showstartExamBtn : true,
			'defaultBtnTime': '00:05',
		});
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
	startPracticeExam(event){
		event.preventDefault();
		this.setState({
					showButton:false,
					showstartExamBtn:false,
						});
		var practiceExamId = this.refs.PracticeExamName.value;
		Meteor.call("checkExamISsolveToday",practiceExamId,(error,result)=>{
			if(error){

			}else{
				if(result=="exist"){
					this.setState({showstartExamBtn: true});
					swal("Sorry !!!"+'\n'+"You have already attempted this exam.","Every exam has only one attempt in a day, You can attempt this exam on next day","warning");
				}else{
					Meteor.call("StartPracticeExam",practiceExamId,(error,result)=>{
						if(error){
							swal(error);
						}else{
							var id = result;
							if(id){ 
								FlowRouter.go('/practiceExam/'+id);							
							}
						}
					});
				}
			}

		});
		
	}

	gotoPreviousExam(event){
		var id = $(event.target).attr('id');
		FlowRouter.go("/practiceExam/"+id);
	}

	ExamComplete(event){
		var id = $(event.target).attr('id');
		Meteor.call("practiceExamFinished",id,(error,result)=>{
			if(error){

			}else{
				FlowRouter.go("/startPracticeExamPurchased");
			}
		});
	}

	// this function is assuming due to bab internet or internet is not available this function will execute
	tryPELoadingAgainforBtn(){
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
		 // if(!this.props.LoadingTest3){
		 if(this.state.showstartExamBtn){
		return(
			
			<div>
			<div className="CountIncrement">0</div>
			<div className="CountDecreBackArrow">0</div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		           	<h1>Start Practice Exam</h1> 
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                 {!this.props.LoadingTest3 ?

		                  this.props.status !=''?
		                  
		                  this.props.status =="paid" ?

		                  !this.props.loadingTest4 ?

		                  !this.props.lastExamId ? 
		                 
		                  this.props.practiceQPData.length !=0 ?
		                  <div className="box-header with-border boxMinHeight ">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ExamInstructionWrap ">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									Instructions for Practice Exam :
									</div> 
								</div>
								<div className="col-lg-12 col-md-11 col-sm-12 col-xs-12 instructionList instructionWrap">
									{this.props.PE_Instruction.instruction}
								</div>
								<form onSubmit={this.startPracticeExam.bind(this)}>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 IagreeExamWrap">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
								    	{this.props.practiceQPData.map((questionPaper,index)=>{
								    		return <div className="col-lg-6 col-md-6 col-sm-6 col-lg-offset-3 col-md-offset-3 qpRow" key={index}>  
											    		<div className="col-lg-9 col-md-9 qpTestTitle"> {questionPaper.quePaperTitle}</div>
											    		
											    		<div className="col-lg-3 col-md-3">
											    			<button type="submit" className="btn btn-primary startBtnPE" name="PracticeExamName" ref="PracticeExamName" value={questionPaper._id}>Start</button>
											    		</div>
										    		</div>
								    	})}
										</div>
									</div>
								</form>
							</div>
						  </div>
						  
						  :
						  	<div className=" box-header with-border boxMinHeight  studDataNotExist">
		                	<div>
							 	Practice Exam not yet scheduled.
							</div>
		                   </div>
		                  : this.state.showButton ? 
		                  	<div className=" box-header with-border boxMinHeight  studDataNotExist">
						  		<h3 className="col-lg-12 col-md-12 col-sm-12"> Oops! It seems that you didn't complete your last exam. Do you wish to continue ? </h3>
			                	<div>
								 	<button className="btn btn-primary yesContinueBtn col-lg-2 col-lg-offset-4 col-md-2 col-md-offset-4 col-lg-sm col-sm-offset-4 " id={this.props.lastExamId} onClick={this.gotoPreviousExam.bind(this)}>Yes, continue</button> &nbsp;&nbsp;&nbsp;&nbsp;
								 	<button className="btn btn-danger notContinueBtn col-lg-2 col-md-2  " id={this.props.lastExamId} onClick={this.ExamComplete.bind(this)}>No</button>
								</div>
		                   </div>
		                   : 
		                  	<div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
				            	<div>
								 	Loading please wait...!!! 
								</div>
							 	<img src="/images/preloader.gif"/>

				            </div>
						  	
						 	:
						 	<div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
				            	<div>
								 	Loading please wait...!!! 
								</div>
				            </div>
			                
						  : <div className=" box-header with-border boxMinHeight  studDataNotExist">
		                	<div>
							 	Payment not yet received.
							</div>
		                   </div>
						:
							<div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
				            	<div>
								 	Loading please wait...!!! 
								</div>
							 	<img src="/images/preloader.gif"/>

				            </div>
						}
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
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            {!this.props.examMasterData ? 
			            	<h1>Start Main Exam </h1> 
			            	: 
			            	<h1>Start Main Exam</h1>
			            }
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
							<div className="box-header with-border boxMinHeight  studDataNotExist">
							    <div className="examLoadingTimeDiv">
									{this.tryPELoadingAgainforBtn()}
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
}
export default PracticeStartExamPurchasedContainer = withTracker(props=>{
	var urlPackageId= FlowRouter.getParam("packageId");
	var Index= FlowRouter.getParam("BtnIndex");
	var QpId= FlowRouter.getParam("id");
	clearInterval(Session.get("interval"));
	// Meteor.call("removeTempCurStudData");
	const postHandle   = Meteor.subscribe("LoginInStudent",Meteor.userId());
	const LoadingTest  = !postHandle.ready();
	var studentData    = StudentMaster.findOne({"studentId":Meteor.userId()})||{};
	const postHandle2  = Meteor.subscribe("instruction_PE");
	const loadingTest2 = !postHandle2.ready();
	var postHandle3    = Meteor.subscribe("quesPaperPracticeExam");
	var LoadingTest3   = !postHandle.ready();
	const postHandle4     =  Meteor.subscribe('InCompletedExam');
	const loadingTest4    = !postHandle4.ready();
	const postHandle6     =  Meteor.subscribe('LoginStudTodaysExam',moment().format("DD/MM/YYYY"));
	const loadingTest6    = !postHandle6.ready();
	const postHandle5     =  Meteor.subscribe('loginUserPackageQP',Meteor.userId());
	const loadingTest5    = !postHandle5.ready();
	var PE_Instruction    = InstructionMaster.findOne({"instructionFor" : "Practice Exam"})||{};

	var PostHandleOrder = Meteor.subscribe("showAllCompRegOrder");
	var loadingOrder = !PostHandleOrder.ready();
	var isStudentRegisterForExam = CompetitionRegisterOrder.findOne({"studentId":Meteor.userId(),"status":"paid"})||{};

	if(studentData.studentEmail && isStudentRegisterForExam._id){
		var status = isStudentRegisterForExam.status;
		// var status = studentData.status;
		// if(status != "Paid"){
		// 	var status ="UnPaid";
		// }else{
			var practiceQPData =  QuestionPaperMaster.find({"category":studentData.category, "subCategory":studentData.subCategory, "examType" : "Practice Exam","isDraft":"","paperStatus" : "Assigned"}).fetch();
			var myPracticeExamMasterData = MyPracticeExamMaster.findOne({"StudentId":Meteor.userId(),"examStatus":"InCompleted"})||{};
			var myPEMSEStatus = MyPracticeExamMaster.find({"StudentId":Meteor.userId(),"date":moment().format("DD/MM/YYYY")}).fetch();
			
			var PackageQPMData = PackageQuestionPaperMaster.find({"buyerId":Meteor.userId()}).fetch();
			if(myPracticeExamMasterData){
				var lastExamId = myPracticeExamMasterData._id;
			}else{
				var lastExamId = '';
			}
		// }
	}else{
		var status = '';
		var practiceQPData = [];
	}
	
	return {
		LoadingTest,
		loadingTest2,
		LoadingTest3,
		loadingTest4,
		practiceQPData,
		status,
		PE_Instruction,
		lastExamId,
		PackageQPMData,
		myPEMSEStatus,
		urlPackageId,
		Index,
		QpId


	}

})(PracticeStartExamPurchased);
