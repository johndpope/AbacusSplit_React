/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will show question papers. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
class QuestionPaper extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
			subscription:{
				mydata: Meteor.subscribe('singleQuestionPaper',FlowRouter.getParam("id")),
			}
		}
	}

	getQuestionPaperData = ()=> {
		var currentId = FlowRouter.getParam("id");
		var questionData =  QuestionPaperMaster.findOne({"_id":currentId});
		if(questionData){
			var questionsArray = questionData.questionsArray;
			if(questionsArray){
				return questionsArray;
			}
			else{
				return [];
			}
		}else{
			return [];
		}
	
	}

	removeQuestion(event){
		var questionId = $(event.target).attr('id');
		var id = FlowRouter.getParam("id");
		// console.log(id);
		// console.log(questionId);
		swal({
			  title              : 'Are you sure?',
			  text               : 'You will not be able to recover this Record!',
			  type               : 'warning',
			  showCancelButton   : true,
			  confirmButtonColor : '#dd6b55',
			  cancelButtonColor  : '#d44',
			  confirmButtonText  : 'Yes, Delete it!',
			  cancelButtonText   : 'No, Keep it',
			  closeOnConfirm     : false
			}, function() {
				Meteor.call("removeSelectedQuestion",id,questionId,(error,result)=>{
							if(error){

							}else{
								swal(
							    'Question has been Deleted from Question Paper',
							    '',
							    'success'
							  );
						}
					});
		
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
  	
	render(){
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>{this.props.questionPaperData.quePaperTitle}</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 searchTableBoxAlign">
								{/*<div className="col-lg-12 col-md-12 swingimage">
									<div className="col-lg-2 col-lg-2">
										<div className="fieldTitle">Exam Type</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.examType}</div>
									</div>
									<div className="col-lg-1 col-lg-1">
										<div className="fieldTitle">Category</div>
										<div className="fieldSubTitle">{this.props.questionPaperData.category}</div>
									</div>
									<div className="col-lg-2 col-lg-2">
										<div className="fieldTitle">Total Question</div>
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
									</div>
								</div>*/}
								<div className="col-lg-12 col-md-12" >
									<div className="col-lg-12 col-md-12 quesPaperTitCent">{this.props.questionPaperData.quePaperTitle}</div>
									<table className="table table-striped formTable quesFormTable" id="ExamListTable">
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
									<h1 className="col-lg-12 col-md-12 profileDivider"></h1>
								</div>	
								<div className="col-lg-12 col-md-12 quesPaperTitCentt">Exam Questions </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable ">
										    <thead className="tableHeader">
										        <tr>
										            <th className="col-lg-1">Sr. No</th>
										            <th className="col-lg-4">Question </th>
										            <th className="col-lg-1"> A </th>
										            <th className="col-lg-1"> B </th>
										            <th className="col-lg-1"> C </th>
										            <th className="col-lg-1"> D </th>
										            <th className="col-lg-2"> Correct Answer </th>
										            <th className="col-lg-1"> Action </th>
										            
										        </tr>
										    </thead>
										    {this.getQuestionPaperData().length != 0 ?
											    <tbody className="myAllTable">
											    	{this.getQuestionPaperData().map((quesData, index)=>{
											    		return <tr key={index}>
											    			<td></td>
											    			<td>{quesData.question}</td>
											    			<td>{quesData.A}</td>
											    			<td>{quesData.B}</td>
											    			<td>{quesData.C}</td>
											    			<td>{quesData.D}</td>
											    			<td>{quesData.correctAnswer}</td>
											    			<td className="tab-Table">
											    				{/*<a href={`/admin/showEditQuestion/${FlowRouter.getParam("id")}/${quesData.questionId}`}>
											    					<i className="fa fa-edit editIcon"></i>
											    				</a>	*/}
											    				<i className="fa fa-trash deleteIcon" title="delete question from question paper" id={quesData.questionId} onClick={this.removeQuestion.bind(this)}></i>
									
											    			</td>
											  
											    		</tr>
											    	})}
											    </tbody>
										    : 
											    <tbody className="OESDataNotAvailable">
									    			<tr>
									    				<td colSpan="9">"Please add questions <a href={`/CreateQuestionPapers/${this.props.questionPaperData.category}/${this.props.questionPaperData._id}`}>click here</a> to add questions for this Exam"</td>
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
	}
}

export default QuestionPaperPaperContainer = withTracker(props=>{
	var id = FlowRouter.getParam("id");
	const postHandle      = Meteor.subscribe('singleQuestionPaper',id);
	const loadingTest     = !postHandle.ready();
	var questionPaperData = QuestionPaperMaster.findOne({"_id":id})||{};	
	return{
		questionPaperData,
	}
})(QuestionPaper);