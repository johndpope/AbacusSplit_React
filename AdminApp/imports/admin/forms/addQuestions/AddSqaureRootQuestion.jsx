

import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {CategoryMaster} from '../addCategory/api/categoryMaster.js';
import {QuestionMaster} from './api/questionMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import NoAccessLayout from '/imports/layout/NoAccessLayout.jsx';

class AddQuestion extends TrackerReact(Component)  {

	constructor(props){
		super(props);
		this.state={
			categoryName  : '',
			subCategory   : '',
			question      : '',
			option_A      : '',
			option_B      : '',
			option_C      : '',
			option_D      : '',
			correctAnswer : '',
			addSqrtSymbol : false,
			SqrtSymbol    : '',
			correctAnswer : '',
			categorySubName: '',
			facilityPermission : 'waitingforResult',
			// subscription: Meteor.subscribe("singleQuestion",_id),
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","AddQuestions",(err,res)=>{
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

	/*
		this method will add question
	*/

	addQuestion(event){
		event.preventDefault();
		// var urlPath = location.pathname;
		// var _id = (urlPath.split('/')).pop();
		// if(urlPath=="/AddQuestions"){
		// 	var _id = ''; 
		// }else{
		// 	var _id = FlowRouter.getParam("id"); 
		// }

		questionValues = {
			categoryName  : this.refs.categoryName.value,
			subCategory   : this.refs.subCategory.value,
			question      : this.refs.question.value.trim(),
			option_A      : this.refs.option_A.value.trim(),
			option_B      : this.refs.option_B.value.trim(),
			option_C      : this.refs.option_C.value.trim(),
			option_D      : this.refs.option_D.value.trim(),
			correctAnswer : this.refs.correctAnswer.value.trim(),
			_id           : FlowRouter.getParam("id"),
		}
		if((questionValues.option_A == questionValues.option_B)|| (questionValues.option_A == questionValues.option_C ) ||(questionValues.option_A == questionValues.option_D )
			||(questionValues.option_B == questionValues.option_C ) || (questionValues.option_B == questionValues.option_D )
			||(questionValues.option_C == questionValues.option_D )){
			swal("Duplicate Options Found","","warning");
		}else{
			Meteor.call("addQuestion",questionValues,(error,result)=>{
					if(error){
						swal("somthing went wrong");
					}else{
						var result = result;
						console.log("result",result);					
						if(FlowRouter.getParam("paperId")){
							swal("Question Updated Successfully");
							FlowRouter.go('/Admin/QuestionPapers/'+FlowRouter.getParam("paperId"));
						}
						else{
							if(questionValues._id){
								swal("Question Updated Successfully",
									"",
									"success");
								FlowRouter.go('/QuestionCategoryTabs');
								
							}else{
								if(result=="QExist"){
									swal("Duplicate Questions are not allowed",
										"",
										"warning");
								}else{
									swal("Question Added Successfully",
										"",
										"success");
									this.setState({
										categoryName  : '',
										subCategory   : '',
										question      : '',
										option_A      : '',
										option_B      : '',
										option_C      : '',
										option_D      : '',
										correctAnswer : '',
									});

								}
								
							}
							
						}
					}
			});
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps){
			if(nextProps.questionData){
				this.setState({
					categoryName  : nextProps.questionData.categoryName,
					subCategory   : nextProps.questionData.subCategory,
					question      : nextProps.questionData.question,
					option_A      : nextProps.questionData.A,
					option_B      : nextProps.questionData.B,
					option_C      : nextProps.questionData.C,
					option_D      : nextProps.questionData.D,
					correctAnswer : nextProps.questionData.correctAnswer,
				});
			}
		}else{
			this.setState({
					categoryName  : '',
					subCategory   : '',
					question      : '',
					option_A      : '',
					option_B      : '',
					option_C      : '',
					option_D      : '',
					correctAnswer : '',
				});
		}

	}

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
  	}

	showCategories(){
		var categorryHandle = Meteor.subscribe("allCategory").ready();
			return CategoryMaster.find({}).fetch();	
	}

  	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}

  	getSubCategoryName(event){
		var categoryName = $(event.target).val();
	
		this.setState({
			categorySubName : categoryName,
		});
		
	}

  	SubCategoryName(){

		var categoryName = this.state.categoryName;
		var	signleCategory = CategoryMaster.findOne({"categoryName":categoryName});
		if(signleCategory){
			var subCategoryarray = signleCategory.levels;
			var subCatarray =[];
			for(var i=0; i<subCategoryarray.length;i++){
				var subCat = categoryName+''+parseInt(i+1);
				var subCat = String(subCat);
				subCatarray.push(
					<option key={i}>{subCat}</option>
					);
			}
			return subCatarray;
		}else{
			return [];
		}
	}
	insertSqrtSymbol(){
		this.setState({
			SqrtSymbol : this.state.question+"&radic;",

		},()=>{this.addquestionsqrt()});
		
	 
	}
	addquestionsqrt(){
		console.log("in addqsqrt");
		this.setState({
			question   :  this.state.SqrtSymbol

		});
	}
	
	createMarkup() { return {__html: this.state.question}; };

	render(){
		var id = FlowRouter.getParam("id");
		if(id){
			$('.addCategoryBtn').html("Update");
			$('.box-title').html("Update Question");
		}else{
			$('.addCategoryBtn').html("Submit");
			$('.box-title').html("Add Questions");
		}
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
			console.log("SqrtSymbol---->",this.state.SqrtSymbol);
			console.log("SqrtSymbol---->",this.state.question);
			// console.log("createMarkup()---->",<div dangerouslySetInnerHTML={this.createMarkup()} />);

			return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Master Data</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	<div className="box-header with-border">
				            	<h3 className="box-title">Add Questions</h3>
				            </div>
				            <form onSubmit={this.addQuestion.bind(this)}>
							<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 questionFormWrap">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<span className="blocking-span col-lg-10"> 
											<input type="text" name="question" ref="question" value={this.state.question} onChange={this.handleChange} pattern="^(0|[0-9-+&;*(){}[]=?%]*)$" title="Enter Digits & Arithmatic Operator" className={this.state.question?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} autoComplete="off" required/>
											<span className="floating-label">Enter Question</span>					   			
										</span>
										<span className="col-lg-2" onClick={this.insertSqrtSymbol.bind(this)}><i className="fa fa-plus-circle" aria-hidden="true"></i></span>
									</div>
									<div dangerouslySetInnerHTML={this.createMarkup()} />
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<span className="blocking-span"> 
											<input type="text" name="option_A" ref="option_A" value={this.state.option_A} pattern="^(0|[0-9]*)$" title="Enter Digits" onChange={this.handleChange} className={this.state.option_A?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} autoComplete="off" required/>
											<span className="floating-label">Enter Option A</span>					   			
										</span>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<span className="blocking-span"> 
											<input type="text" name="option_B" ref="option_B" value={this.state.option_B} pattern="^(0|[0-9]*)$" title="Enter Digits" onChange={this.handleChange} className={this.state.option_B?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} autoComplete="off" required/>
											<span className="floating-label">Enter Option B</span>					   			
										</span>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<span className="blocking-span"> 
											<input type="text" name="option_C" ref="option_C" value={this.state.option_C} pattern="^(0|[0-9]*)$" title="Enter Digits" onChange={this.handleChange} className={this.state.option_C?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} autoComplete="off" required/>
											<span className="floating-label">Enter Option C</span>					   			
										</span>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
										<span className="blocking-span"> 
											<input type="text" name="option_D" ref="option_D" value={this.state.option_D} pattern="^(0|[0-9]*)$" title="Enter Digits" onChange={this.handleChange} className={this.state.option_D?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} autoComplete="off" required/>
											<span className="floating-label">Enter Option D</span>					   			
										</span>
									</div>
									<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
										<div className="selectLabel">Select Correct Option</div>
										<span className="blocking-span"> 
											<select type="text" name="correctAnswer" ref="correctAnswer" value={this.state.correctAnswer} onChange={this.handleChange} className={this.state.correctAnswer?"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content":"form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"} autoComplete="off" title="Select Correct Option" required>
												<option disabled value="">Select Correct Option</option>					   			
												<option>A</option>					   			
												<option>B</option>					   			
												<option>C</option>					   			
												<option>D</option>
											</select>
											{/*<span className="floating-label floating-label-Date">Select Correct Option</span>*/}					   			
										</span>
									</div>
									<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
										<div className="selectLabel">Select Category</div>
										<span className="blocking-span"> 
											<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.SubCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Select Category" required>
												<option disabled value="">-- Select Category --</option>
												{this.showCategories().map((categories,index)=>{
													return <option key={index}>{categories.categoryName}</option>
												  })
												}
											</select>
											<span className="floating-label floating-label-Date">{/*Select Category*/}</span>					   								   			
										</span>
									</div>
									<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
										<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>
										<div className="categoryListDataStud categoryListDataStudshoww">
											<label>A1/B1/C1/D1</label> : Below 7 years<br/>
											<label>A2/B2/C2/D2</label> : 7-9 years<br/>
											<label>A3/B3/C3/D3</label> : 9-11 years<br/>
											<label>A4/B4/C4/D4</label> : 11-14 years<br/>
										</div>
										<div className="selectLabel">Select Sub Category</div>
										<span className="blocking-span"> 
											<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} title="Select Sub-Category" required>
												<option value="">-- Select Sub Category --</option>
												{this.SubCategoryName()}
											</select>
											<span className="floating-label floating-label-Date">{/*Select Sub Category*/}</span>					   			
										</span>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-6">
										<button type="submit" className="col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8 col-sm-12 col-xs-12 btn btn-primary addCategoryBtn">Submit</button>
									</div>								
								</div>
							</form>
							
						  </div>
						</div>
					  </div>
					</div>
				  </section>
				</div>
			</div>
			);
			 }else if (this.state.facilityPermission == false ){
				  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
			  }else if(this.state.facilityPermission == "waitingforResult"){
			  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
				</div>);
			  }else{ 
			  return (
			  	<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/ShowAll">click here </a> to assign permission</h3>
				</div>
			  	);
			}
		
	}

}
export default QuestionContainer = withTracker(props =>{
	var _id = FlowRouter.getParam("id");
	var postHandle = Meteor.subscribe("singleQuestion",_id).ready();
	var questionData = QuestionMaster.findOne({"_id":_id})||{};
	return{
		questionData,
	} 
})(AddQuestion);