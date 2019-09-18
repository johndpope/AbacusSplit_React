

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {MyTempQuestionPaperMaster} from '/imports/admin/forms/student/api/myTempQuestionPaperMaster.js';
import {MyPracticeExamMaster} from '/imports/admin/forms/student/api/myPracticeExamMaster.js';
import {Session} from 'meteor/session';

class StartPracticeExam extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
			'questionArrayFromTC': [],
			'noOfQuestion'       : '',
			'totalMarks'         : '',
			'examTime'           : '',
			'examName'           : '',
			'myIndex'            : '',
			'backarraowcnt'      : '',
			'defaultTime'  : '00:30',
 			'subscription':{
				postHandle1 : Meteor.subscribe('showSinglePracticePaper',FlowRouter.getParam("id")),
			 	postHandle :  Meteor.subscribe('showSingleAnsPaper',FlowRouter.getParam("id")),
			 	// postHandle2 :  Meteor.subscribe('showSingleTempQPaper'),
			}
		}
		this.getTimefunction = this.getTimefunction.bind(this);	
	}

	componentWillMount(){

		Meteor.call("getPracticeExamTimeData",FlowRouter.getParam("id"),Meteor.userId(),(err,res)=>{
			if(err){

			}else{
				if(res[0]=="practiceData"){
					this.getTimefunction(res[1],FlowRouter.getParam("id"));					
				}
			}
		});

		// if(this.props.examTime){
		// 	this.getTimefunction(this.props.examTime,FlowRouter.getParam("id"));
		// }else{
		// 	var getUrl = location.pathname;
		// 	if(getUrl=="/practiceExam/"+FlowRouter.getParam("id")){
		// 		FlowRouter.go('/startPracticeExam');
		// 	}else{

		// 	}
			
		// }
	}

	componentDidMount(){				
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		// // to get all question from tempquestion master this will execute once
		Meteor.call("getExamQuestions",FlowRouter.getParam('id'),(err,res)=>{
			if(err){
				console.log(err);
			}else{
				// console.log(res);
				if(res){
					this.setState({
							noOfQuestion : res.noOfQuestion,
							totalMarks : res.totalMarks,
							questionArrayFromTC : res.questionArrayFromTC,
							examTime : res.examTime,
							examName : res.examName,
							
						});
				}
			}
		});
  
	}
	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

	getPracticeAnswerbyStud(event){
		var getqNum = event.target.getAttribute('data-qNum');
		var studAnswer = event.target.getAttribute('id');
		var examTime = $('.countdownWrap').text();
		var examId = FlowRouter.getParam("id");
		$('.carousel-control-right').click();
		Meteor.call("updatePracticeExamTimeAndStudenAnswer",examId,getqNum,studAnswer,examTime,(err,res)=>{
			if(err){
			}else{
				if(res==1){
					this.fillcolorwhenanswer(getqNum,studAnswer);
					this.clickRightLeftArraow();
				}else{
					Bert.alert( 'Please check internet connection. Previous question was not solved', 'danger');
				}
			}
		});		
	}

	// after question solve question number will get filled by green color

	fillcolorwhenanswer(getqNum,studAnswer){
		$('#'+getqNum).addClass("greenClor");
	}

	componentDidUpdate(){
		$('.Yes').addClass("greenClor");

// -------------------- Left Right carousel show hide ----------------//

		$('.carousel').carousel({
		  wrap: false
		}).on('slid.bs.carousel', function () {
			curSlide = $('.active');
		  if(curSlide.is( ':first-child' )) {
			 $('.left').hide();
			 return;
		  } else {
			 $('.left').show();	  
		  }
		  if (curSlide.is( ':last-child' )) {
			 $('.right').hide();
			 return;
		  } else {
		  	$('.showNextWindowButtow').show();
			 $('.right').show();	  
		  }
		});

	}

	clickRightLeftArraow(){
		var getIndex = $('.active').attr('id');
		var answerData =  MyPracticeExamMaster.findOne({"_id":FlowRouter.getParam("id")});
		if(answerData){
			var answerDataArray = answerData.answerArray[getIndex];	
			if(answerDataArray){
				
				$('.'+answerDataArray.studentAnswer+"-"+getIndex).attr("checked",true);
			}
		}
	}

	endExam(){
			// clearInterval(Session.get("interval"));
			Meteor.call("finishExamBtnClick",(error,result)=>{
				if(error){
					console.log(error);
				}else{
					Meteor.call("updateQuestionPaperMasterAccordingtoPackages",FlowRouter.getParam("id"),this.props.packageID,this.props.indx,(error,result)=>{
						if(error){
							console.log(error);
						}else{
							
						}
					});
					if(result =="returnTrue"){
						FlowRouter.go("/practiceExamResult/"+FlowRouter.getParam("id"));
					}else{
						FlowRouter.go("/practiceExam/"+FlowRouter.getParam("id"));
					}					
					
					

				}
			});
			
	}
	getTimefunction(examTime,id){
		
		if(examTime && id){
			clearInterval(interval);
			var interval = setInterval(function() {
			Session.set("interval",interval);
			  var timer = examTime.split(':');
			  var minutes = parseInt(timer[0], 10);
			  var seconds = parseInt(timer[1], 10);
			  --seconds;
			  minutes = (seconds < 0) ? --minutes : minutes;
			  if (minutes < 0){
			  		clearInterval(interval);
				  	location.reload();
				  	FlowRouter.go("/practiceExamResult/"+id);
			  }else{
				  seconds = (seconds < 0) ? 59 : seconds;
				  seconds = (seconds < 10) ? '0' + seconds : seconds;
				  minutes = (minutes < 10) ?  minutes : minutes;
				  $('.countdown').html(minutes + ':' + seconds);
				  examTime = minutes + ':' + seconds;
				}
			}, 1000);
		}else{
			$('.countdown').html("No Internet");
		}

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

	
	render(){
		// if(this.props.examTime){
		// 	this.getTimefunction(this.props.examTime,FlowRouter.getParam("id"));
		// }else{
		// 	var getUrl = location.pathname;
		// 	if(getUrl=="/practiceExam/"+FlowRouter.getParam("id")){
		// 		FlowRouter.go('/startPracticeExam');
		// 	}else{

		// 	}
			
		// }
		if(this.state.questionArrayFromTC.length>1){	
			// console.log("params",this.props.packageID,FlowRouter.getParam("id"),this.props.indx);
		return(
				<div>
		        <div className="content-wrapper content-wrapperexampaper content-wrapperexampaperstudent">
		        
		          <section className="content viewContent">
		            <div className="row">
		                <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		            <div>
		              

		            <div><br/>

						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colpadding">
							<div className="col-lg-12 col-md-12 examDetailsWrap marginAuto">
							    <div className="col-lg-3 col-md-3"></div>
								<div className="col-lg-3 col-md-3 col-sm-3 examDetailsWrap1">{this.state.examName}</div>
								<div className="col-lg-3 col-md-3 col-sm-3 examDetailsWrap2">Total Questions : {this.state.noOfQuestion}</div>
								<div className="col-lg-3 col-md-3 col-sm-3 examDetailsWrap3">Total Marks :  {this.state.totalMarks}</div>
								<div className="col-lg-1 col-md-1 col-sm-1 countdownWrapDiv">
									<span className=" countdown countdownWrap"></span>
								</div>

							</div>		
						</div>
		              	<div>
		              	<div className="CountIncrement">0</div>
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 colpadding paddingTopBoard">
							<div className="col-md-2 colpadding paddingTop">
								<img src="/images/leftboy.png" className="examstdHeight"/>

							</div>
							<div id="mySlideShow" className="col-lg-8 col-md-8 col-sm-8 carousel mySlideShowbg1 slide  " data-ride="carousel" data-interval="false">
							{/*<div id="mySlideShow" className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 carousel slide" data-ride="carousel" data-interval="false">*/}
                            

				  
								<ol className="carousel-indicators oesCarouselIndicator">
										{ this.state.questionArrayFromTC.map( (slides,index)=>{
											if(index == 0){
												var activeStatus = 'active';
											}else{
												var activeStatus = '';
												var hideSlideDetail = "hideSlidDetails";
											}
											if(index <this.state.questionArrayFromTC.length-1){
											return (
													<li data-target="#mySlideShow" key={index} data-slide-to={index} name={index} className={activeStatus, "A-"+index, slides.attempted} id={slides.questionNumber} onClick={this.clickRightLeftArraow.bind(this)}>{index+1}</li>
												);
											}else{
												return (
													<li data-target="#mySlideShow" key={index} data-slide-to={index} name={index} className="examFinishBtnnn">Finish</li>
													);
											}
										  }) 
										}
									</ol>

								<div className="carousel-inner">
									{ this.state.questionArrayFromTC.map( (slides,index)=>{
										if(index == 0){
											var activeStatus = 'active';
										}else{
											var activeStatus = '';
											var hideSlideDetail = "hideSlidDetails";
										}
										
										if(index < this.state.questionArrayFromTC.length-1){
											
										//--------- align question verrtical  -------------//
											var questionArr = slides.question;
											// console.log("questionArr------> ",questionArr);
											// var questionArr = questionArr.split(/[^0-9\.]+/);
											// console.log('splitVar-------> ', questionArr);

											if(questionArr){
												var questionArray =[];
												for(var i=0; i<questionArr.length; i++){
													if((questionArr[i]%1)===0) {

														questionArray.push(
															<span className="quesDig" key={i}>{questionArr[i]} </span>
														);
													}else{
														questionArray.push(
																<span className="arithmeticOpe" key={i}>{questionArr[i]} <br/></span>
															);
														}
												}

											}
										//--------- align question verrtical  -------------//
										return (
												
											     <div className={"item "+ activeStatus} key={index}>
												      
												      <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 sliderTitles">
												      	<div className="col-lg-6 col-md-offset-2 col-sm-9 col-md-9 questionTitWrapp">Question No. <span className="questionTitsubWrap">{index+1} :</span> </div>
														<div className="col-lg-3 col-md-3 col-sm-3 questionTitsubWrap">{questionArray}</div>
												      <div className="col-lg-12 col-md-12 col-sm-12  questionAnsWrapp2">
												      	Answers : 
												      </div>
												      	<div className="col-lg-12 col-md-12 col-sm-12 answerWrapSlide">
												      	<div className="col-lg-12 col-md-12 col-sm-12 answerOption">
													      <div className="col-lg-3 col-md-3 col-sm-3 answerBottom">
													      	{/*<span className="ABCD col-lg-1 col-md-1 col-sm-1"> A</span>*/}
													      	
													      	<label className="col-lg-8 col-md-8 col-sm-8 containerr">
															  <input type="radio" name="questionOption" id="A" className={"A-"+index} data-qNum={slides.questionNumber} onClick={this.getPracticeAnswerbyStud.bind(this)} />
															  <span className="checkmarkk"></span>
															  <span className=" quesAnswerOpt">{slides.A}</span>
															</label>
													      	
													   	   </div>
													   	   
													      
													      <div className="col-lg-3 col-md-3 col-sm-3 answerBottom">
													      	{/*<span className="ABCD col-lg-1 col-md-1 col-sm-1"> B</span>*/}
													      	
													      	<label className="col-lg-8 col-md-8 col-sm-8 containerr">
															  <input type="radio" name="questionOption" id="B" className={"B-"+index} data-qNum={slides.questionNumber} onClick={this.getPracticeAnswerbyStud.bind(this)} />
															  <span className="checkmarkk"></span>
															  <span className=" quesAnswerOpt">{slides.B}</span>
															</label>
													      	 
													      </div>
												      
													      <div className="col-lg-3 col-md-3 col-sm-3 answerBottom">
													      	{/*<span className="ABCD col-lg-1 col-md-1 col-sm-1"> C</span>*/}
													      	
													      	<label className="col-lg-8 col-md-8 col-sm-8 containerr">
															  <input type="radio" name="questionOption" id="C" className={"C-"+index} data-qNum={slides.questionNumber} onClick={this.getPracticeAnswerbyStud.bind(this)} />
															  <span className="checkmarkk"></span>
															  <span className=" quesAnswerOpt">{slides.C}</span>
															</label>
													      	 
													      </div>
													      <div className="col-lg-3 col-md-3 col-sm-3 answerBottom">
													      	{/*<span className="ABCD col-lg-1 col-md-1 col-sm-1"> D</span>*/}
													      	
													      	<label className="col-lg-8 col-md-8 col-sm-8 containerr">
															  <input type="radio" name="questionOption" id="D" className={"D-"+index} data-qNum={slides.questionNumber} onClick={this.getPracticeAnswerbyStud.bind(this)} />
															  <span className="checkmarkk"></span>
															  <span className=" quesAnswerOpt">{slides.D}</span>
															</label>
													      
													      </div>
											   		  </div> 
													  </div>    

									      			</div>
												  </div>
											   
											);
										}else{
											
											return (<div className={"item "+ activeStatus} key={index}>
											      	
											      <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 sliderTitles finishSlideWrap">
													<div className="col-lg-12 col-md-12 col-sm-12 ">
													      <div className="col-lg-12 col-md-12 col-sm-12 finishText">
													      	{slides.finishText}
													      </div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 ">
													      <div className="col-lg-12 col-md-12 col-sm-12 answerBottom finishsubText">
													      	{slides.finishSubtext}
													      </div>
													</div>
													<div className="col-lg-12 col-md-12 col-sm-12 ">
													    <div className="col-lg-12 col-md-12 col-sm-12 finishBttn">
															<button className="showNextWindowButtow btn btn-primary" onClick={this.endExam.bind(this)}>{slides.finish_button}</button>
														</div>
													</div>
												  </div>
												</div>
											);
											
										}
									  }) 
									}
								</div>  
								<a className="left carousel-control controlRL" href="#mySlideShow" data-slide="prev" onClick={this.clickRightLeftArraow.bind(this)}>
								    <span className="glyphicon glyphicon-chevron-left"></span>
								    <span className="sr-only">Previous</span>
								</a>
								<a className="right carousel-control carousel-control-right controlRL" href="#mySlideShow" data-slide="next" onClick={this.clickRightLeftArraow.bind(this)}>
								    <span className="glyphicon glyphicon-chevron-right"></span>
								    <span className="sr-only">Next</span>
								</a>
							</div>
							<div className="col-md-2 colpadding paddingTop">
							<img src="/images/rightgal.png" className="examstdHeight"/>
							</div>

						</div>
						
						<div className="col-lg-12 col-md-12 col-sm-12 showNextButtonWrap">
						</div>
					  </div>
					</div>
					  </div>
					</div>
				  </div>
					{/*	</div>*/}
				</section>
				</div>
			</div>
			);
		}else{
			return (
				<div>
			
		        <div className="content-wrapper">
		          <section className="content-header">
		            <h1>Answer Sheet</h1>
		          </section>
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight  loadingImgWrap">
							 <h3 className="examFinishedStatus examLoadingTimeDiv"> {this.tryLoadingAgain()} </h3>
							 {/*<img src="/images/preloader.gif"/>*/}
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
export default statrtPracticeExamContainer = withTracker(props=>{
	var id = FlowRouter.getParam("id");
	// FlowRouter.getParam("id"),FlowRouter.getParam("urlPackageId"),FlowRouter.getParam("BtnIndex"),
	var packageID = FlowRouter.getParam("urlPackageId");
	var indx = FlowRouter.getParam("BtnIndex");
	// console.log("packageID,indx",packageID,indx);
	const postHandle1     =  Meteor.subscribe('showSinglePracticePaper',id);
	const loadingTest1    = !postHandle1.ready();

	const postHandle2      =  Meteor.subscribe('showSingleTempQPaper');
	const loadingTest2     = !postHandle2.ready();

	var practiceExamData  = MyPracticeExamMaster.findOne({"_id":id})||{};
	console.log("practiceExamData ---->",practiceExamData);
	if(practiceExamData){
			var examName ="Practice Exam";
			var examTime = practiceExamData.examTime; //-------------get updated exam time
		// console.log("examTime",examTime);

		return{
			examName,
			examTime,
			postHandle1,
			id,
			packageID,
			indx

		}
	}
})(StartPracticeExam);