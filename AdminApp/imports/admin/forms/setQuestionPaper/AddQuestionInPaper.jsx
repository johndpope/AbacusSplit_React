/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will add questions in question paper. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {QuestionMaster} from '/imports/admin/forms/addQuestions/api/questionMaster.js';
import ReactTable from "react-table";

class AddQuestionInPaper extends TrackerReact(Component)  {

	constructor(props){
		super(props);
		this.state={
			queCountarray : '',
			questionLimit : 25, 
			startRange:0,
			counter: 1,
			QuestionMasterData : [],	
			subcription:{
				'data': Meteor.subscribe("singleQuestionPaper",FlowRouter.getParam("id")),
			}
		}
		this.handleChange = this.handleChange.bind(this);
	}
	componentWillMount(){
		Session.set('pageNumber',1);
		$('.sidebar').css({display:'block',background: '#222d32'});
	}

	componentDidMount(){
		this.CategoryAndSubCatQuestion();
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		if(FlowRouter.getParam('id')){
			$('.-next').click(function(){
				$(".seleectQueInput").prop("checked", false);
			});
			this.callFunction();
		}else{
			$('.-next').click(function(){
				$(".seleectQueInput").prop("checked", false);
			});
		}
		$('.-previous').click(function(){
			this.callFunction();
		});
	}

	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  
	
	/*
		Add Question to Question Paper
	*/
	addQuestionToPaper(event){
		var id = FlowRouter.getParam("id");			
		var questionId = $(event.target).attr('id');		
		var questionExist = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id"),'questionsArray.questionId':questionId});
		if(questionExist){
			Meteor.call("removeSelectedQuestion",id,questionId);
			var queCountFun = this.getSelectedQuesCount();
		}else{
			var queCountFun = this.getSelectedQuesCount();
			var maxQuestion = queCountFun[0];
			var queCountarray = queCountFun[1]+1;
			if(queCountarray <=maxQuestion){
			Meteor.call("addQuestioToPaper",questionId,id,(error,result)=>{
				if(error){
					swal("Question Not Added");
				}else{
				}
			});
			}else{
				$('#'+questionId).attr('checked',false);
				swal({
					  title: "Can't select more than " +'"'+maxQuestion+'"'+" Questions",
  					  text: '',
  					  type: 'warning',
				});

			}
		}
	}

//select all question in and add to collection

	selectAllQuestion(event){
		var getQuestionPaperData = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id")});
		if(getQuestionPaperData){
		var selectLimit = this.state.questionLimit;
		// console.log("selectLimit = ",selectLimit);
		for(var i=0; i<selectLimit && i<getQuestionPaperData.noOfQuestion;i++){
			$('.seleectQueInput'+(parseInt(Session.get('pageNumber')- 1) * (this.state.questionLimit) + parseInt(i + 1))).prop('checked',true);
		}
		// $('.seleectQueInput').filter(':visible').prop('checked',true);
		// console.log("length = ",$('.seleectQueInput').filter(':visible').length);
		
		var checkboxValue = $('.seleectQueInput');
		//get select all questions id  
		    var selectAllQuesArray = [];
		    selectAllQuesArray = $.map(checkboxValue, function(el){
		        if(el.checked) { return el.id };
		    });
		    console.log("selectAllQuesArray ----> ",selectAllQuesArray.length);
		 //    var queCountFun = this.getSelectedQuesCount();
			// var maxQuestion = queCountFun[0];
			// var queCountarray = queCountFun[1];
				// if(queCountarray + selectAllQuesArray.length <=maxQuestion ){
					 Meteor.call("addMultipleQuestionToPaper",selectAllQuesArray,FlowRouter.getParam("id"),(err,res)=>{
				    	if(err){
				    		console.log(err);
				    	}else{
							// $('.seleectQueInput').prop('checked',false);
							// console.log('res -------->',res);
							var removedQuesArray = res[2];
							var extraQuestion = res[3];
							if(removedQuesArray){
								var removedQuesArrayLen = removedQuesArray.length;
								for(var i=0; i<removedQuesArrayLen;i++){
									$('#'+removedQuesArray[i]).prop('checked',false);
								}
							}
							if(extraQuestion && res[0] && res[1]){
				    			swal("Added "+ res[0]	+" questions And "+res[1]+" removed which are already added, "+extraQuestion+ " We could not added because you exceed question limit " ,"","success");
				    		}else if(res[0] && res[1]){
				    			swal("Added "+ res[0]	+" questions and Removed "+ res[1]	+" questions" ,"","success");
				    			$('#selectAllQuestion').attr('checked',false);
				    		}else if(res[0] && extraQuestion){
				    			swal("Removed "+ res[1]	+" questions but We could not add "+extraQuestion+ " Questions because you exceed limit" ,"","success");
				    			$('#selectAllQuestion').attr('checked',false);
				    		}else if(res[1] && extraQuestion){
				    			swal(" questions and Removed "+ res[1]	+" questions but We could not add "+extraQuestion+ " Questions because you exceed limit","","warning");
				    		}else if(extraQuestion){
				    			swal(" We could not add "+extraQuestion+ " Questions because you exceed limit","","warning");
				    			$('#selectAllQuestion').attr('checked',false);
				    		}else if(res[0]){
				    			swal("Added "+ res[0]	+" questions","","success");
				    		}else if(res[1]){
				    			swal("Removed "+ res[1]	+" questions","","success");
				    			$('#selectAllQuestion').attr('checked',false);
				    		}
				    	}
				   	 });
			// 	}else{
			// 	swal({
			// 		  title: "Can't select more than " +'"'+maxQuestion+'"'+" Questions",
  	// 				  text: '',
  	// 				  type: 'warning',
					
			// 	});

			// }
			// this.callFunction();
			}		   
	}

	getSelectedQuesCount(){
		var handle = this.state.subcription.data.ready();
		var examPaperData = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id")});
		if(examPaperData){
			var maxQuestion = examPaperData.noOfQuestion; 
			var quesArray = examPaperData.questionsArray;
			if(quesArray){
				var quesArrayLen = quesArray.length;
				if(maxQuestion==quesArrayLen){
					$('.addCategoryBtn').addClass('quesPaperSubb');
					$('.saveDraftbtn').addClass('quesPaperSubbb');
					Meteor.call("saveQuestionPaper",FlowRouter.getParam("id"));

				}else{
					$('.addCategoryBtn').removeClass('quesPaperSubb');
					$('.addCategoryBtn').addClass('quesPaperSub');
					$('.saveDraftbtn').removeClass('quesPaperSubbb');
					$('.saveDraftbtn').addClass('quesPaperSubbbb');
					Meteor.call("saveDraft",FlowRouter.getParam("id"));
				}
			}
				if(quesArray){
					return [maxQuestion,quesArrayLen];
				}else{
					return [maxQuestion,0];
				}
			
		}
	}


	componentDidUpdate(event){
		$('.pagination'+this.state.counter).addClass("active");
    	Session.set('pageUMNumber',this.state.counter);
		var handle = this.state.subcription.data.ready();
		var examPaperData = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id")});
		if(examPaperData){
			var quesArray = examPaperData.questionsArray;
			if(quesArray){
				$('.seleectQueInput').attr('checked',false);
				for(var i=0; i<quesArray.length; i++){
					
					$('.checkedQ'+quesArray[i].questionId).attr('checked',true);
				}
			}
		}
		
	}


	callFunction(){
	 	// var handle = this.state.subcription.data.ready();
		var examPaperData = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id")});
		// console.log("examPaperData",examPaperData);
		if(examPaperData){
			var quesArray = examPaperData.questionsArray;
			if(quesArray){
				for(var i=0; i<quesArray.length; i++){
					$('.rt-tr-group .seleectQueInput').attr('checked',false);
					$('.checkedQ'+quesArray[i].questionId).attr('checked',true);
				}
			}
		}
	}

	saveDraftQuestionPaper(event){
		var examtype = $(event.target).attr('id');
		if(examtype=='Practice Exam'){
			examtype = 'Practice Question Papers';
		}else{
			examtype = 'Main Question Papers';
		}
		var id = FlowRouter.getParam("id")
		swal({
			  title             : 'Are you sure?',
			  text              : 'This Question paper will save in '+'"'+examtype+'"'+ '. You will be able to recover this Question Paper!',
			  type              : 'warning',
			  showCancelButton  : true,
			  closeOnConfirm    : false,
			  confirmButtonColor: '#dd6b55',
			  cancelButtonColor : '#d44',
			  confirmButtonText : 'Yes',
			  cancelButtonText  : 'No',
			  closeOnConfirm    : false
			}, function() {
				Meteor.call("saveDraft",id,(error,result)=>{
					if(error){

					}else{
						swal(
					    'Successfully saved as Draft',
					    '',
					    'success'
					  );
						FlowRouter.go("/Admin/CreateQuestionPapers");
					}
				});
  			
  		});
		
	}

	saveQuestionPaper(event){
		var examtype = $(event.target).attr('id');
		Meteor.call("saveQuestionPaper",FlowRouter.getParam("id"),(error,result)=>{
			if(error){

			}else{
				swal(
					    '"'+examtype+'"'+ ' Successfully Saved ',
					    '',
					    'success'
					  );
					if(examtype=='Practice Exam'){
							FlowRouter.go("/Admin/practiceQuestionPapers");
					}else{
						FlowRouter.go("/Admin/FinalQuestionPapers");
					}
			}
		});
	}

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name] : event.target.value,
		})
	}

//----------------- get question limit selected from drop down
	getQuestionLimit(event){
		var questionLimit = $('#SelectBoxId').val();
		Session.set('pageNumber',1);
		this.setState({
			questionLimit : parseInt(questionLimit),
			startRange    : 0,
		},()=>{this.CategoryAndSubCatQuestion()});
	}

//--------------- get question according to limit set ----------------// 
	CategoryAndSubCatQuestion(){
		Meteor.call("getQuestionDataaa",FlowRouter.getParam('category'),FlowRouter.getParam('subCategory'),this.state.startRange,this.state.questionLimit, (err,res)=>{
			if(err){
				console.log(err.reason);
			}else{
				this.setState({"QuestionMasterData":res});
				// return res;
			}
		});
	}

//------- create pagination for table --------------// 
	paginationFunction(event){
		var isReadyy = Meteor.subscribe("showCatWiseQuesforPagination",FlowRouter.getParam('category'),FlowRouter.getParam('subCategory')).ready();
		const maxRowsPerPage = this.state.questionLimit;
		if(isReadyy){
			var questionMasterDataCount = Counts.get('showCatWiseQuesforPagination');
			var paginationNum = parseInt(questionMasterDataCount)/maxRowsPerPage;
			var pageCount = Math.ceil(paginationNum);
			Session.set("questionCount",pageCount);
			paginationArray = [];
			paginationArray.push(
					<li  key={-1} className="page-item"><a className="page-link liNext" onClick={this.previousPage.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i></a></li>
				);
			for (var i=1; i<=pageCount;i++){
				var countNum = maxRowsPerPage * i;
				paginationArray.push(
					<li key={i} className="page-item" title={"Click to jump on "+i+ " page"}><a className={"page-link pagination"+i} id={countNum} onClick={this.getQuestionStartEndNum.bind(this)}>{i}</a></li>
				);
			}
			if(pageCount>=1){
				paginationArray.push(
					<li  key={-2} className="page-item"><a className="page-link liNext" onClick={this.nextPage.bind(this)}><i className="fa fa-angle-double-right" aria-hidden="true"></i></a></li>
				);
				return paginationArray;
			}
		}
	}

 //----------- pagination number click function  --------------------//
	getQuestionStartEndNum(event){
		// this.callFunction();
		var selectLimit = this.state.questionLimit;
		for(var i=0; i<selectLimit;i++){
			$('.seleectQueInput'+(parseInt(Session.get('pageNumber')- 1) * (this.state.questionLimit) + parseInt(i + 1))).prop('checked',false);
		}
		this.addedQueSelect();
		
		var limitRange = $(event.target).attr('id');
		limitRange     = parseInt(limitRange);
		var startRange = limitRange - this.state.questionLimit;
		$('.page-link').removeClass('active');
		var counter = $(event.target).text();
		Session.set('pageNumber',counter);

		$(".liNext").css("cursor","pointer");
			if(Session.get("questionCount")==counter){
			$(".liNext").css("cursor","not-allowed");
		}
		this.setState({
			startRange : startRange,
			counter    : counter,
		},()=>{this.CategoryAndSubCatQuestion()});
		this.setState({

		},()=>{this.addedQueSelect()});
		this.setState({

		},()=>{this.callFunction()});
			
	}

//------- only for added question selected ----- //

	addedQueSelect(){
		var handle = this.state.subcription.data.ready();
		var examPaperData = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id")});
		if(examPaperData){
			var quesArray = examPaperData.questionsArray;
			if(quesArray){
				for(var i=0; i<quesArray.length; i++){
					$('#'+quesArray[i].questionId).prop('checked',true);
				}
			}
		}
	}

//------------------------ this function call when click on next arrow --------------//
	nextPage(event){
		this.callFunction();
		var selectLimit = this.state.questionLimit;
		for(var i=0; i<selectLimit;i++){
			$('.seleectQueInput'+(parseInt(Session.get('pageNumber')- 1) * (this.state.questionLimit) + parseInt(i + 1))).prop('checked',false);
		}
		this.addedQueSelect();
		
		var counter = this.state.counter;
		console.log('counter ---> ',counter);
		counter++;
		var questionCount = Session.get("questionCount");

		if(questionCount>=counter){
			Session.set('pageNumber',counter);
			$('.page-link').removeClass('active');
			$(".pagination"+counter).addClass("active");
			var limitRange = $('.active').attr('id');
			console.log("limitRange",limitRange);
			var startRange =  parseInt(limitRange)- this.state.questionLimit;
			if(startRange){
			this.setState({
				counter    : counter,
				startRange : startRange,
				// questionLimit: limitRange,
			},()=>{this.CategoryAndSubCatQuestion()});
		}
		}else if(questionCount==counter){
			// this.CategoryAndSubCatQuestion();
			$(".liNext").attr("disabled", true);
		}
		
	}

	previousPage(){
		this.callFunction();
		var selectLimit = this.state.questionLimit;
		for(var i=0; i<selectLimit;i++){
			$('.seleectQueInput'+(parseInt(Session.get('pageNumber')- 1) * (this.state.questionLimit) + parseInt(i + 1))).prop('checked',false);
		}
		this.addedQueSelect();
		
		var counter = this.state.counter;
		counter--;
		console.log('counter ---> ',counter);
		var questionCount = Session.get("questionCount");

		// if(questionCount>=counter){
			Session.set('pageNumber',counter);
			$('.page-link').removeClass('active');
			$(".pagination"+counter).addClass("active");
			var limitRange = $('.active').attr('id');
			var startRange =  parseInt(limitRange)- this.state.questionLimit;
			if(startRange){
			this.setState({
				counter    : counter,
				startRange : startRange,
				// questionLimit: limitRange,
			},()=>{this.CategoryAndSubCatQuestion()});
		}
		// }else if(questionCount==counter){
			// this.CategoryAndSubCatQuestion();
			// $(".liNext").attr("disabled", true);
		// }
	}

	render(){
		var queCount = this.getSelectedQuesCount();
		if(queCount){
			var queCount = queCount[1];
		}		
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Add Questions to Question Paper</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 swingimage">
									<div className="col-lg-12 col-md-12 quesPaperTitInCent">{this.props.questionPaperData.quePaperTitle}</div>
									<table className="table table-striped formTable" id="ExamListTable">
										    <thead className="tableHeaderrr">
										        <tr>
										            <th>Exam Type</th>
										            <th>Category </th>
										            <th>Sub-Category </th>
										            <th> Total Questions </th>
										            <th> Marks per Question </th>
										            <th> Total Marks </th>
										            <th> Exam Time </th>
										            
										        </tr>
										    </thead>
										    <tbody className="myAllTablee">	
									    		<tr>
									    			<td>{this.props.questionPaperData.examType}</td>
									    			<td>{this.props.questionPaperData.category}</td>
									    			<td>{this.props.questionPaperData.subCategory}</td>
									    			<td>{this.props.questionPaperData.noOfQuestion}</td>
									    			<td>{this.props.questionPaperData.marksPerQues}</td>
									    			<td>{this.props.questionPaperData.totalMarks}</td>
									    			<td>{this.props.questionPaperData.examTime}</td>
									    		</tr>
											    	
											    	
										    </tbody>
									</table>
								</div>

							</div>
							<div className="col-lg-12 col-md-12 addQuesBordr">
								<h1 className="col-lg-12 col-md-12 profileDivider"></h1>
							</div>
							<div className="col-lg-12 col-md-12">
							<div className="col-lg-4 col-md-4 selectedQuesWrap">
									<button className="btn btn-danger saveDraftbtn saveDraftbtnn col-lg-5" id={this.props.questionPaperData.examType} onClick={this.saveDraftQuestionPaper.bind(this)}> Save Draft</button>
						
								<button className="btn btn-primary addCategoryBtn quesPaperSub  col-lg-5" id={this.props.questionPaperData.examType} onClick={this.saveQuestionPaper.bind(this)}> Submit</button>
								
							</div>
							<div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 queLabel">Questions/Page </div>
							<div className="col-lg-2 col-md-2 col-sm-2 col-xs-4 selectedQuesWrap">
								<span className="blocking-span"> 
									<select type="text" name="questionLimit" ref="questionLimit" value={this.state.questionLimit} onClick={this.getQuestionLimit.bind(this)} onChange={this.handleChange} id="SelectBoxId" className="col-lg-12 col-md-12 col-sm-12 col-xs-12" autoComplete="off" title="Please select limit" required>
										<option >5</option>
										<option >10</option>
										<option >25</option>
										<option >50</option>
										<option >75</option>
										<option >100</option>
										<option >150</option>
										<option >200</option>
									</select>
								</span>
							</div>

							<div className="pull-right selectedQuesWrap">
								<span>Selected Questions </span>
								<input type="text" className="quesCntInput" value={queCount} disabled />
							</div>
								<div className="col-lg-12 col-md-12 questWrapReactTable">
									<table className="table table-striped formTable tab-Table">
									    <thead className="tableHeader">
									        <tr>
									            <th>
									            	<div className="checkbox checkbox-table checkbox-success">
								    					<input type="checkbox" className="seleectQueInputx" name="seleectQueInputx" id="selectAllQuestion" onClick={this.selectAllQuestion.bind(this)} title="Select all questions in this page"/>
								    					<label>Select All</label>
								    				</div>
									            	 
												</th>
									            <th className="col-lg-4">Question </th>
									            <th className="col-lg-1"> A </th>
									            <th className="col-lg-1"> B </th>
									            <th className="col-lg-1"> C </th>
									            <th className="col-lg-1"> D </th>
									            <th className="col-lg-2"> Correct Answer </th>
									        </tr>
									    </thead>
									    {this.state.QuestionMasterData.length !=0 ?
										    <tbody className="myAllTabler">
										    	{this.state.QuestionMasterData.map((questionData, index)=>{
										    		return <tr key={index}>
										    			<td>
										    				<div className="checkbox checkbox-table checkbox-success">
																<input type="checkbox" 
																className={"seleectQueInput checkedQ"+questionData._id+" seleectQueInput"+(parseInt(Session.get('pageNumber')- 1) * (this.state.questionLimit) + parseInt(index + 1))} id={questionData._id} name="seleectQueInput" onClick={this.addQuestionToPaper.bind(this)}/>
																<label>{parseInt(Session.get('pageNumber')- 1) * (this.state.questionLimit) + (index + 1)}</label>
															</div>
										    			</td>
										    			<td>{questionData.question}</td>
										    			<td>{questionData.A}</td>
										    			<td>{questionData.B}</td>
										    			<td>{questionData.C}</td>
										    			<td>{questionData.D}</td>
										    			<td>{questionData.correctAnswer}</td>
										    		</tr>
										    	})}
										    </tbody>
							    		:
									    	<tbody className="OESDataNotAvailable">
								    			<tr> 
								    				<td colSpan="8">"Category Questions not added yet <a href="/AddQuestions">click here </a> to add "</td>
								    			</tr>
									    	</tbody>
									    }
									</table>
								</div>
								<div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
									 <ul className="pagination paginationOES">
										  
										  {this.paginationFunction()}
										 
									 </ul>
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
	}
}

export default QuestionInPaperContainer = withTracker(props=>{
	var id = FlowRouter.getParam("id");
	const postHandle       = Meteor.subscribe('singleQuestionPaper',id);
	const loadingTest      = !postHandle.ready();
	var questionPaperData  = QuestionPaperMaster.findOne({"_id":id})||{};
	var questionArray      = questionPaperData.questionsArray;
	const  quesMaster      = Meteor.subscribe('categorywiseQuestion',FlowRouter.getParam("category")).ready();
	var QuestionMasterData =  QuestionMaster.find({"categoryName":FlowRouter.getParam("category"),"subCategory":questionPaperData.subCategory}).fetch();
	return{
		questionPaperData,
		questionArray,
		// QuestionMasterData,
	}
})(AddQuestionInPaper);