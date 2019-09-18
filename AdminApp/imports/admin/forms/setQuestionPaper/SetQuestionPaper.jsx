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
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import TimeInput from 'react-time-input';


class SetQuestionPaper extends TrackerReact(Component)  {

	constructor(props){
		super(props);
			this.state={
				 _id           : '',
				 examType      : 'Practice Exam',
				 quePaperTitle : '',
				 category      : '',
				 subCategory   : '',
				 noOfQuestion  : '',
				 marksPerQues  : '',
				 totalMarks    : '',
				 examTime      : '',
				facilityPermission : 'waitingforResult',  	
				 // categoryName  : '', 
				 'subscription':{
				 	 questionPaper: Meteor.subscribe("ShowQuestionPaper"),
				 	 categoryMaster : Meteor.subscribe("allCategory"),
				 }
			}
			this.handleChange = this.handleChange.bind(this);
			this.handleChangeRadio = this.handleChangeRadio.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","SetQuestionPaper",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				this.setState({
					// facilityPermission : access("Add Questions","Master Data"),
					 facilityPermission : res,
				});
			}
		});
  	}

	componentWillReceiveProps(nextProps){
		if(nextProps){
			this.setState({
			 _id           : nextProps.questionPaperData._id,
			 examType      : nextProps.questionPaperData.examType,
			 quePaperTitle : nextProps.questionPaperData.quePaperTitle,
			 category      : nextProps.questionPaperData.category,
			 subCategory   : nextProps.questionPaperData.subCategory,
			 noOfQuestion  : nextProps.questionPaperData.noOfQuestion,
			 marksPerQues  : nextProps.questionPaperData.marksPerQues,
			 totalMarks    : nextProps.questionPaperData.totalMarks,
			 examTime      : nextProps.questionPaperData.examTime,
			});
			
		}
		this.handleChange = this.handleChange.bind(this);
	}
	/*
		show Categories 
	*/
	showCategories(){
			return CategoryMaster.find({}).fetch();	
	}

	getSubCategoryName(event){
		var category = $(event.target).val();
		if(category){
			var categoryData = CategoryMaster.findOne({'categoryName':category});
			if(categoryData){
				var marks = categoryData.categoryMarks;
				var questions = categoryData.NoofQuestion;
				this.setState({
					noOfQuestion : questions,
					marksPerQues : marks,
				});
			}
			var totalMarks = parseInt(marks*questions);
			this.setState({
				totalMarks : totalMarks,
				category : category,
			});
		}
		
	}

	SubCategoryName(){
		var categoryName = this.state.category;
		var	signleCategory = CategoryMaster.findOne({"categoryName":categoryName});
		if(signleCategory){
			var subCategoryarray = signleCategory.levels;
			var subCatarray =[];
			for(var i=0; i<subCategoryarray.length;i++){
				var subCat = categoryName+''+parseInt(i+1);
				var subCat = String(subCat);
				subCatarray.push(
					<option key={i} value={subCat}>{subCat}</option>
					);
			}
			return subCatarray;
		}else{
			return [];
		}
	}
	
	/*
		Add Question paper into questionPaper Master
	*/
	createQuestionPaper(event){
		event.preventDefault();
		formValues = {
			 examType      : $('input[name=examType]:checked').val(),
			 quePaperTitle : this.refs.quePaperTitle.value.trim(),
			 category      : this.refs.category.value,
			 subCategory   : this.refs.subCategory.value,
			 noOfQuestion  : this.refs.noOfQuestion.value.trim(),
			 marksPerQues  : this.refs.marksPerQues.value.trim(),
			 totalMarks    : this.refs.totalMarks.value,
			 examTime      : $('.examTime').val(),
			 _id           : this.refs._id.value,

		}
		// var QPHandle =).ready();
		console.log("examTime",formValues.examTime);
		if(formValues.examTime!=("00:00")){
			if(formValues.noOfQuestion>0){
				if(formValues.marksPerQues >0){
					if(formValues._id){
						Meteor.call("createQuestionPaper",formValues,(error,result)=>{
							if(error){
								swal("somthing went wrong");
							}else{
									swal('"'+formValues.quePaperTitle+'"'+ " Updated Successfully","","success");
									FlowRouter.go('/CreateQuestionPapers/'+formValues.category+'/'+formValues.subCategory+'/'+formValues._id);	
							}
						});				 
					}else{
						var QuestionPaperMasterData = QuestionPaperMaster.findOne({"quePaperTitle":formValues.quePaperTitle});
						if(QuestionPaperMasterData){
							swal('Question Paper Title Already Exist',
							    '',
							    'warning');
						}else{
							Meteor.call("createQuestionPaper",formValues,(error,result)=>{
									if(error){
										swal("somthing went wrong");
									}else{
										var id = result;
										swal('"'+formValues.quePaperTitle+'"'+ " Created Successfully","","success");
										FlowRouter.go('/CreateQuestionPapers/'+formValues.category+'/'+formValues.subCategory+'/'+id);
									}
							});
						}
				
					}
				}else{
					swal('Marks per Question must be grater than zero',
				    '',
				    'warning');
				}	
			}else{
				swal('Number of Questions must be grater than zero',
				    '',
				    'warning');
			}

		}else{
			swal("Exam time cannot be zero");
		}






	}
	calculateTotalMarks(event){
		var noOfQuestion = $('.noOfQuestion').val();
		var marksPerQues = $('.marksPerQues').val();
		var totalMarks = parseInt(noOfQuestion*marksPerQues);
		this.setState({
			totalMarks : totalMarks
		});
		// $('.totalMarks').val(totalMarks);
	}

	handleChange(event){
	
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name] : event.target.value,
		})
	}

	handleChangeRadio(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name] : event.target.value,
		})
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

  	componentDidUpdate(){
  		var id = FlowRouter.getParam("id");
		if(id){
			$('.addCategoryBtn').html('Update Question Paper');
		}else{
			$('.addCategoryBtn').html('Create Question Paper');
		}


  	}

  	oesTimeFun(){

	        $(this).val(function(i, val) {
	            var timeParts = val.split(':'),
	                totalSeconds = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10),
	                minutes = Math.floor(totalSeconds / 60),
	                seconds = totalSeconds - (minutes * 60);
	    	    return [minutes < 10 ? 0 : '', minutes, ':', seconds < 10 ? 0 : '', seconds].join('');
	        });
	  
  	}
  	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}
	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
		if(this.props.questionPaperData){
			var id = FlowRouter.getParam("id");
			return(
				<div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1>Set Questions Paper</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">
			                  <div className="box-header with-border">
					            <h3 className="box-title">Create Question Paper</h3>
					            </div>
								<div className="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 onlineSXWrap">
									<form onSubmit={this.createQuestionPaper.bind(this)}>
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
											<span className="blocking-span"> 

												<input type="text" name="quePaperTitle" ref="quePaperTitle" value={this.state.quePaperTitle} onChange={this.handleChange} className={this.state.quePaperTitle ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="^([a-zA-Z][a-zA-Z0-9-\s]*)$" required/>

												<span className="floating-label">Question Paper Title</span>
												<input type="hidden" name="_id" ref="_id" value={this.state._id}/>					   			
											</span>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 examRadioBtnWrap" >
											<div className="col-lg-6 col-md-3 col-sm-4 col-xs-12 examTypeBtn examTypeBtnn">
												<label className="examTypecontainer">
												  <input type="radio" checked="checked" name="examType" ref="examType" value="Practice Exam" checked={this.state.examType==='Practice Exam'} onClick={this.handleChangeRadio} checked/>
												  <span className="checkmark"></span>
												  <span className="examTitlePaper">Practice Exam</span>
												</label>
											</div>
											<div className="col-lg-6 col-md-3 col-sm-4 col-xs-12 examTypeBtn">
												<label className="examTypecontainer">
												  <input type="radio" name="examType" ref="examType" value="Final Exam" checked={this.state.examType==='Final Exam'} onClick={this.handleChangeRadio}/>
												  <span className="checkmark"></span>
												  <span className="examTitlePaper">Final Exam</span>
												</label>
											</div>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 setPeperCatIn">
											<span className="blocking-span"> 
												<select type="text" name="category" ref="category" value={this.state.category} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onClick={this.getSubCategoryName.bind(this)} onChange={this.handleChange} required>
													<option value="">-- Select Category --</option>
													{this.showCategories().map((categories,index)=>{
														return <option key={index}>{categories.categoryName}</option>
													  })
													}
												</select>
												<span className="floating-label floating-label-Date">Select Category</span>					   			
											</span>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 subCatListData">
											<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>
											<div className="categoryListDataStud">
												<label>A1/B1/C1/D1</label> : Below 7 year<br/>
												<label>A2/B2/C2/D2</label> : 7-9 year<br/>
												<label>A3/B3/C3/D3</label> : 9-11 year<br/>
												<label>A4/B4/C4/D4</label> : 11-14 year<br/>
											</div>
											<span className="blocking-span"> 
												<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} required>
													<option value="">-- Select Sub Category --</option>
													{this.SubCategoryName()}
												</select>
												<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
											</span>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<span className="blocking-span"> 
												<span className="defaultLabelOes">Number of Questions</span>
												<input type="number" name="noOfQuestion" ref="noOfQuestion" value={this.state.noOfQuestion} onInput={this.calculateTotalMarks.bind(this)} onChange={this.handleChange} maxLength="3" className="noOfQuestion form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextt" pattern="^(0|[0-9]*)$" disabled/>
												   			
											</span>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<span className="blocking-span"> 
												<span className="defaultLabelOes">Marks per Question</span>
												<input type="number" name="marksPerQues" ref="marksPerQues" value={this.state.marksPerQues} onInput={this.calculateTotalMarks.bind(this)} maxLength="2" onChange={this.handleChange} className="marksPerQues form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextt" pattern="^(0|[0-9]*)$" disabled/>					   			
											</span>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<span className="blocking-span"> 
												<span className="defaultLabelOes">Total Marks</span>	
												<input type="text" name="totalMarks" ref="totalMarks" value={this.state.totalMarks} onChange={this.handleChange} className="totalMarks form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" disabled/>
											</span>
										</div>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<span className="blocking-span"> 
												<span className="defaultLabelOes">Exam Duration ( Time format  mm:ss )</span>
												 
												{/*<TimeInput initTime={this.state.examTime} name="examTime" ref="examTime" value={this.state.examTime} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText examTime" required/>					*/}
												<input type="text" id="myTime" placeholder="mm:ss" name="examTime" ref="examTime" value={this.state.examTime} onChange={this.handleChange} size="12" pattern="\d{2}:\d{2}([ap]m)?" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText examTime" required/>
												
											</span>
										</div>									
										
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-6">
											<button type="submit" className="col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8 col-sm-12 col-xs-12 btn btn-primary addCategoryBtn"></button>
										</div>
									
									</form>	
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
			 return (
			 	<div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1>Question Paper</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">
				                  <div className="box-header with-border">
						            <h3 className="box-title">Set Question Paper</h3>
						          </div>
								  <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 onlineSXWrap loadingPageWrap">
									 	<div className="col-lg-12 col-md-12">
											<img src="/images/pageLoading.gif"/>
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
		}else if (this.state.facilityPermission == false ){
				  	return(<h1>{FlowRouter.go('/noAccesss')}</h1>);
			  }else if(this.state.facilityPermission == "waitingforResult"){
			  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
				</div>);
			  }else{ 
			  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/ShowAll">click here </a> to assign permission</h3>
				</div>);
		}
	}
}
export default SetQuestionPaperContainer = withTracker(props=>{
	var id = FlowRouter.getParam("id");
	var postHandle = Meteor.subscribe("singleQuestionPaper",id).ready();
	var questionPaperData = QuestionPaperMaster.findOne({"_id":id})||{};
	
	return{
		questionPaperData,
	}
})(SetQuestionPaper);