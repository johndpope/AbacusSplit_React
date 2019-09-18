/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will add categories. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {QuestionMaster} from '/imports/admin/forms/addQuestions/api/questionMaster.js';
import ReactTable from "react-table";
// import "react-table/react-table.css";

class AddQuestionInPaper extends TrackerReact(Component)  {
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
			queCountarray : '',
			subcription:{
				'data': Meteor.subscribe("singleQuestionPaper",FlowRouter.getParam("id")),
			}
		}
	}
	
	// gategoryWiseQuestion(){
	// 	var quesMaster = Meteor.subscribe('categorywiseQuestion',this.props.params.category).ready();
	// 	return QuestionMaster.find({"categoryName":this.props.params.category}).fetch();	
	// }
	
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
		$('.rt-tr-group .seleectQueInput').filter(':visible').prop('checked',true);
		console.log("length = ",$('.rt-tr-group .seleectQueInput').filter(':visible').length);
		// if($('.questWrapReactTable .-btn').is(':disabled')){
		// 	alert("woww");
		// }
		var checkboxValue = $('.rt-tr-group .seleectQueInput');
		//get select all questions id  
		    var selectAllQuesArray = [];
		    selectAllQuesArray = $.map(checkboxValue, function(el){
		        if(el.checked) { return el.id };
		    });
		    console.log("selectAllQuesArray-----> ",selectAllQuesArray);

		    var queCountFun = this.getSelectedQuesCount();
			var maxQuestion = queCountFun[0];
			var queCountarray = queCountFun[1];
			console.log("queCountarray count ",queCountarray);
				if(queCountarray + selectAllQuesArray.length <=maxQuestion){
					 Meteor.call("addMultipleQuestionToPaper",selectAllQuesArray,FlowRouter.getParam("id"),(err,res)=>{
				    	if(err){
				    		console.log(err);
				    	}else{
				    		swal("Added "+selectAllQuesArray.length+" questions","","success");
				    	}
				   	 });
				}else{
				swal({
					  title: "Can't select more than " +'"'+maxQuestion+'"'+" Questions",
  					  text: '',
  					  type: 'warning',
					
				});

			}		   
	}

	// selectAllQuestion(event){
	// 	var count = $('.rt-tr-group .seleectQueInput').filter(':visible').length;
	// 	console.log("count = ",count);
	// }

	getSelectedQuesCount(){
		var handle = this.state.subcription.data.ready();
		var examPaperData = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id")});
		if(examPaperData){
			var maxQuestion = examPaperData.noOfQuestion; 
			var quesArray = examPaperData.questionsArray;
			if(maxQuestion==quesArray.length){
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
			if(quesArray){
				return [maxQuestion,quesArray.length];
			}
		}
	}
	componentDidUpdate(event){
		var handle = this.state.subcription.data.ready();

		var examPaperData = QuestionPaperMaster.findOne({"_id":FlowRouter.getParam("id")});
		if(examPaperData){
			var quesArray = examPaperData.questionsArray;
			if(quesArray){
				for(var i=0; i<quesArray.length; i++){
					// $('.rt-tr-group .seleectQueInput').attr('checked',false);
					$('#'+quesArray[i].questionId).attr('checked',true);
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
		var id = FlowRouter.getParam("id");
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


	render(){
		var queCount = this.getSelectedQuesCount();
		if(queCount){
			var queCount = queCount[1];
		}

		var questionArray = [];
		this.props.QuestionMasterData.map((questionData, index)=>{
			questionArray.push({
				"Select All"  : <div className="checkbox checkbox-table checkbox-success">
									<input type="checkbox" className={"seleectQueInput seleectQueInput"+index} id={questionData._id} name="seleectQueInput" onClick={this.addQuestionToPaper.bind(this)}/>
									<label></label>
								</div>			,
				// "Select All"  : 
				// 					<input type="checkbox" className={"seleectQueInput" +index} id={questionData._id} name="seleectQueInput" onClick={this.addQuestionToPaper.bind(this)}/>
				// 								,
				// "serialNumber": index + 1,
				"question"    : questionData.question,
			});
		});

		var headers = [
						// {Header:<div className="checkbox checkbox-table checkbox-success"> <input type="checkbox" className="seleectQueInput" name="seleectQueInput"/><label></label></div>		, accessor: 'Select All',sortable: false,filterable: false,},
						{Header:<div className="checkbox checkbox-table checkbox-success"> <input type="checkbox" className="seleectQueInput" name="seleectQueInput" onClick={this.selectAllQuestion.bind(this)} title="Select all questions in this page"/><label></label></div>		, accessor: 'Select All',sortable: false},
						// {Header: "Sr. No", accessor: 'serialNumber' },
						{Header: "Question", accessor: 'question'},
						
					  ];
		
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
								
									{/*<div className="col-lg-12 col-lg-12 examPagetitle">
										<div>{this.props.questionPaperData.quePaperTitle}</div>
									</div>
									<div className="col-lg-2 col-lg-2">
										<div className="fieldTitle">Exam Type</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.examType}</div>
									</div>
									<div className="col-lg-1 col-lg-1">
										<div className="fieldTitle">Category</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.category}</div>
									</div>
									
									<div className="col-lg-3 col-lg-2">
										<div className="fieldTitle">Total Questions</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.noOfQuestion}</div>
									</div>
									<div className="col-lg-3 col-lg-3">
										<div className="fieldTitle">Marks per Question</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.marksPerQues}</div>
									</div>
									<div className="col-lg-2 col-lg-2">
										<div className="fieldTitle">Total Marks</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.totalMarks}</div>
									</div>
									<div className="col-lg-2 col-lg-2">
										<div className="fieldTitle">Exam Time</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.examTime}</div>
									</div>*/}
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
							
							<div className="pull-right selectedQuesWrap">
								<span>Selected Questions </span>
								<input type="text" className="quesCntInput" value={queCount} disabled />
							</div>
								<div className="col-lg-12 col-md-12 questWrapReactTable">
									<ReactTable data={questionArray} columns={headers} filterable={true} />
								</div>
							{/*<div>
							{this.props.QuestionMasterData ?
								<div className="col-lg-12 col-md-12 selectQuestWrap">
									{this.props.QuestionMasterData.map((quesData,index)=>{
									return <div key={index} className="col-lg-4 col-md-4">
												<div className="col-lg-12 col-md-12 quesSection">
													<div className="checkbox checkbox-success">
								                        <input type="checkbox" className="seleectQueInput" id={quesData._id} name="seleectQueInput" onClick={this.addQuestionToPaper.bind(this)} />
								                        <label>
								                            {quesData.question}
								                        </label>
								                    </div>
												</div>
										   </div>
									})}
								</div>
							:
								<div className="col-lg-12 col-md-12 loadingPageWrap">
									<h3>Questions are Loading... Please Wait</h3>
								</div>
							}
							</div>*/}

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
	const postHandle      = Meteor.subscribe('singleQuestionPaper',id);
	const loadingTest     = !postHandle.ready();
	var questionPaperData = QuestionPaperMaster.findOne({"_id":id})||{};
	var questionArray     = questionPaperData.questionsArray;
	const  quesMaster     = Meteor.subscribe('categorywiseQuestion',props.params.category).ready();
	var QuestionMasterData=  QuestionMaster.find({"categoryName":props.params.category,"subCategory":questionPaperData.subCategory}).fetch();
	
	return{
		questionPaperData,
		questionArray,
		QuestionMasterData,
	}
})(AddQuestionInPaper);