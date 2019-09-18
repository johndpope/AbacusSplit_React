

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';

class CreateExam extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
			examPaper : [],
			competitionName  : '',
			competitionDate  : '',
			category  : '',
			subCategory : '',
			paperTitle  : '',
			_id         : '',
			startTime   : '',
			endTime     : '',
			competitionFees : '',
			franchiseShare : '',
			termsCondition : '',
			facilityPermission : 'waitingforResult',  	
			subscription :{
				// mydata      : Meteor.subscribe("ShowQuestionPaper"),
				mydata      : Meteor.subscribe("CreateExamShowQuestionPaper"),
				// ExamHandle  : Meteor.subscribe("showAllExam"),
				allCategory : Meteor.subscribe("allCategory"),
			}
		}
		this.handleChange = this.handleChange.bind(this);
		this.showCategorywiseQuePaper = this.showCategorywiseQuePaper.bind(this);
		
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","CreateCompetition",(err,res)=>{
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
		var date = new Date();
		date.setDate(date.getDate()-1);

		$('#date').datepicker({ 
		    startDate: date
		});


  	}

  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  	
	/*
		show Categories 
	*/
	showCategories(){
		// var categorryHandle = Meteor.subscribe("allCategory").ready();
			var categoryData =  CategoryMaster.find({}).fetch();
			if(categoryData){
				var categoryArray = [];
				for(var i=0; i<categoryData.length; i++){
					var ExamMasterCatExist = ExamMaster.findOne({"category":categoryData[i].categoryName,"subCategory":this.state.subCategory,"examStatus":"Not Finish"});
					if(!ExamMasterCatExist){
						categoryArray.push({"categoryName":categoryData[i].categoryName});
					}else{
						if(moment().format("YYYY-MM-DD")>ExamMasterCatExist.examDate){
							Meteor.call("examFinished",ExamMasterCatExist._id);
						}else{
							var ExamAlreadySet = categoryData[i].categoryName; 
							categoryArray.push({"categoryName": ExamAlreadySet});
						}
					}
				}
				return categoryArray;
			}	
			
	}

	addExamPaperInCompetition(e){
		var examId = e.target.getAttribute('id');
		Meteor.call("addQPInCompetition",examId,FlowRouter.getParam("examId"),(err,res)=>{
			if(err){}else{}
		});
	}

	createExam(event){
		event.preventDefault();
		var valid = true;
		var todayDate=new Date();
		var currentDate,currentMonth,currentYear,compDate,compMonth,compYear;
		var frmtToday = moment(todayDate).format('L');
		var splitedToday = frmtToday.split('/');
		if(splitedToday){
			currentMonth  = parseInt(splitedToday[0]);
			currentDate = parseInt(splitedToday[1]);
			currentYear = parseInt(splitedToday[2]);
		}
		// var todayDateGetTime = todayDate.getTime();
		// console.log("todayDateGetTime",todayDateGetTime);
		var compDate = this.refs.competitionDate.value.trim();
		var frmtcompDate= compDate.split('/');
		if(frmtcompDate){
			compMonth = parseInt(frmtcompDate[0]);
			compDate  = parseInt(frmtcompDate[1]);
			compYear = parseInt(frmtcompDate[2]);
		}
		
		// console.log("dtt------- > >",splitedToday,frmtcompDate,currentDate,currentMonth,currentYear,compDate,compMonth,compYear);

		if(currentYear==compYear){
			if(currentMonth==compMonth){
				if(compDate<currentDate){
					valid = false;
					// console.log("invalid");
				}else{
					// console.log("valid");
					valid = true;
				}
			}else if(compMonth<currentMonth){
				valid = false;
					// console.log("invalid");
			}	else{
				// console.log("valid");
					valid = true;

			}		
		}else if(compYear<currentYear){
			valid = false;
			// console.log("invalid");
		}else if(compYear>currentYear){	
			valid = true;		
			// console.log("valid");
		}

		var competitionFormValues = {
			competitionName  : this.refs.competitionName.value.trim(),
			competitionDate  : this.refs.competitionDate.value.trim(),
			_id           : this.refs._id.value,
			startTime     : this.refs.startTime.value.trim(),
			endTime       : this.refs.endTime.value.trim(),
			competitionFees : this.refs.competitionFees.value,
			franchiseShare  :  this.refs.franchiseShare.value,
			termsCondition  : this.refs.termsCondition.value,
			competition_id  : FlowRouter.getParam("examId"),
		}
		var sTime=moment(competitionFormValues.startTime, 'h:mma');
		var eTime=moment(competitionFormValues.endTime, 'h:mma');		
		if(valid==true){
			if(competitionFormValues.startTime && competitionFormValues.endTime){
				if(sTime<eTime){
				if(competitionFormValues.competitionFees>=0 && competitionFormValues.franchiseShare>=0){
				// if(timedifference==="accept"){				
				if(parseInt(competitionFormValues.competitionFees)>parseInt(competitionFormValues.franchiseShare)){
					Meteor.call("addCompetitionMoreDetails",competitionFormValues,(error,result)=>{
						if(error){
							swal("Not Added");
						}else{
							if(result=="competitionStarted"){
								swal("You cannot update details while competition is started","","warning");

							}else if(result=="sameDateNotAllowed"){
								swal("competition is already created for date : "+moment(new Date(competitionFormValues.competitionDate)).format('DD/MM/YYYY'),"","warning");
							}else if(FlowRouter.getParam('examId')){
								swal("Competition details updated successfully",
								"","success");
								FlowRouter.go('/Admin/ListofExams');

							}else{
								swal("Competition details added successfully",
								"Add Exams in competition",
								"success");
								FlowRouter.go('/Admin/CreateExams/'+result);
							}
						}
					});
				}else{
					swal("Competition fees should be greater than franchise fees","","warning");
				}
			}else{
					swal("Competition fees or franchise fees must be greater than zero","","warning");
			}
		}else{
			swal("Competition start time should be less than endTime","","warning");
		}




	}else{
			swal("Please select time","","warning");
	}

}else{
	swal("Please select valid date for competition","","warning");
}





	}

	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}

  	getCategoryName(event){
		var categoryName = $(event.target).val();	
		this.setState({
			category : categoryName,
		});
	}

	getSubCategoryName(event){
		var subCategoryName = $(event.target).val();	
		// console.log(subCategoryName);
		this.setState({
			subCategory : subCategoryName,
		});
		this.showCategorywiseQuePaper(subCategoryName);
		
	}

  	SubCategoryName(){
		var category = this.state.category;
		var	signleCategory = CategoryMaster.findOne({"categoryName":category});
		if(signleCategory){
			var subCategoryarray = signleCategory.levels;
			var subCatarray =[];
			for(var i=0; i<subCategoryarray.length;i++){
				var subCat = category+''+parseInt(i+1);
				var subCat = String(subCat);
				var ExamMasterCatExist = ExamMaster.findOne({"category":category,"subCategory":subCat,"examStatus":"Not Finish"});
				if(ExamMasterCatExist){
					subCatarray.push(
						<option key={i} className="alreadySetExam" value={subCat}>{subCat}</option>
						);
				}else{
					subCatarray.push(
					<option key={i} value={subCat}>{subCat}</option>
					);
				}
			}
			return subCatarray;
		}else{
			return [];
		}
	}



	// getCategory(){

	// 	var categoryName = this.refs.category.value;
	// 	
	// }

	componentWillReceiveProps(nextProps){
		if(nextProps){
			this.setState({
				competitionName  : nextProps.examData.competitionName,
				competitionDate  : nextProps.examData.competitionDate,
				startTime    : nextProps.examData.startTime,
				endTime      : nextProps.examData.endTime,
				competitionFees : nextProps.examData.competitionFees,
				franchiseShare  : nextProps.examData.franchiseShare,
				termsCondition  : nextProps.examData.termsCondition,
				_id          : nextProps.examData._id,
			}, () => {
				if(this.props._id){
					this.showCategorywiseQuePaper(this.state.subCategory);
				}
			});
		}
		this.handleChange = this.handleChange.bind(this);
		this.showCategorywiseQuePaper = this.showCategorywiseQuePaper.bind(this);
	}

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
  	}

 	showCategorywiseQuePaper(subCategoryName){
		// console.log('subCategoryName: ',subCategoryName);
		 var examPaper = QuestionPaperMaster.find({$and:[{"category":this.state.category,"subCategory":subCategoryName},{"examType":"Final Exam","isDraft":""}]}).fetch();
			this.setState({
				examPaper : examPaper,
			})
	}

 	categorywiseQuesPapers(){
		var examPaper = QuestionPaperMaster.find({"examType":"Final Exam","isDraft" : ""},{$sort: {category:1,subCategory:1} }).fetch();
			examPaper = examPaper.sort();
		return examPaper;		
	}

	componentDidUpdate(){
		var _id = FlowRouter.getParam("examId");
		var postHandle = Meteor.subscribe("singleCompetition",_id);
		var loading = !postHandle.ready();
		var examData = ExamMaster.findOne({"_id":_id})||{};
		if(examData){
			var competitionExams = examData.competitionExams;
			if(competitionExams){
				competitionExams.map((competionObj,index)=>{
					$("#"+competionObj.questionPaperId).attr('checked',true);
				});
			}
		}
		$('#startTimeID').datetimepicker({format: 'LT'});
		$('#endTimeID').datetimepicker({format: 'LT'});
		$('.startTimeIDPick').datetimepicker({format: 'LT'});
		$('.endTimeIDPick').datetimepicker({format: 'LT'});
	}

	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
			if(this.state.competitionDate){
				var competitionDate = moment(this.state.competitionDate).format("MM/DD/YYYY");
			}
			var id = FlowRouter.getParam("examId");
			if(id){
				var examPageTitle = "Update Competition";
			}else{
				var examPageTitle = "Create Competition";
			}
			if(!this.props.loading){
			  return(
				
				<div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1 >Main Exam</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">
			                  	<div className="box-header with-border">
					            <h3 className="box-title">{examPageTitle}</h3>
					            </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 onlineExamWrap1 createExamWrapp">
									<form onSubmit={this.createExam.bind(this)}>
										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<span className="CSExam">Competition Name</span>
											<span className="blocking-span"> 
												<input type="text" name="competitionName" ref="competitionName" value={this.state.competitionName} onChange={this.handleChange}  className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required/>					   			
									
												<input type="hidden" name="_id" ref="_id" value={this.state._id} />
						
											</span>
										</div>

										<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
											<span className="CSExam">Competition Date</span>
											<span className="blocking-span"> 
												<input name="competitionDate" ref="competitionDate" value={competitionDate} onChange={this.handleChange} id="date" data-provide="datepicker" className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required/>					   			
											</span>
										</div>

										<div className='col-lg-3 col-md-3 col-sm-3 col-xs-3'>
											<span className="CSExam">Start Time </span>
								            <div className="form-group">
								                <div className='input-group date' id="startTimeID">
								                    <input type='text' className="form-control startTimeIDPick" name="startTime" ref="startTime" value={this.state.startTime} onChange={this.handleChange} required/>
								                    <span className="input-group-addon">
								                        <span className="glyphicon glyphicon-time"></span>
								                    </span>
								                </div>
								            </div>
								        </div>

								        <div className='col-lg-3 col-md-3 col-sm-3 col-xs-3'>
								        	<span className="CSExam">End Time  </span>
								                <div className="form-group">
								                <div className='input-group date' id='endTimeID'>
								                    <input type='text' className="form-control endTimeIDPick" name="endTime" ref="endTime" value={this.state.endTime} onChange={this.handleChange} required/>
								                    <span className="input-group-addon">
								                        <span className="glyphicon glyphicon-time"></span>
								                    </span>
								                </div>
								            </div>
								        </div>
								        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
								        <span className="CSExam">Competition Fees</span>
											<span className="blocking-span"> 
												{/*<span className="examDateWrap">Exam Name</span>*/}
												<input type="number" name="competitionFees" ref="competitionFees" value={this.state.competitionFees} onChange={this.handleChange}  className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required/>					   			
											</span>
										</div>
										<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
											<span className="CSExam">Franchise Share In Rs.</span>
											<span className="blocking-span"> 
												{/*<span className="examDateWrap">Exam Name</span>*/}
												<input type="number" name="franchiseShare" ref="franchiseShare" value={this.state.franchiseShare} onChange={this.handleChange}  className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText " required/>					   			
											</span>
										</div>

										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<span className="CSExam">Terms And Conditions</span>
											<span className="blocking-span"> 
												{/*<span className="examDateWrap">Exam Name</span>*/}
												<textarea name="termsCondition" ref="termsCondition" value={this.state.termsCondition} onChange={this.handleChange}  className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required></textarea>					   			
											</span>
										</div>
										{FlowRouter.getParam('examId')?
												null :
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<button type="submit" className="col-lg-3 col-md-3 btn btn-primary craeteExamBtn pull-right"> Create Competition</button>
											</div>
										}
									</form>	
										{FlowRouter.getParam('examId')?
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addRolDiV">
												<h4>Add below exams in " {this.state.competitionName} " competition.</h4>
											</div>
						              		<table className="table table-striped formTable" id="ExamListTable">
												<thead className="tableHeader">
													<tr>
														<th>Select Exam</th>
														<th> Category </th>
														<th> Sub-Category </th>
														<th> Question Paper</th>
													</tr>
												</thead>
												{this.categorywiseQuesPapers().length>0 ? 
												<tbody>
													{
														this.categorywiseQuesPapers().map(
															(row, index)=>{
																return(
																	<tr key={index}>
																		<td> <div className="checkbox checkbox-success">
				 								                        		<input type="checkbox" className="seleectQueInput" id={row._id} name="compMainExam" ref="compMainExam" onClick={this.addExamPaperInCompetition.bind(this)} />
				 								                        		<label></label>
			 								                    			</div>
			 								                    		</td>
																		<td> {row.category} </td>
																		<td> {row.subCategory} </td>
																		<td> {row.quePaperTitle} </td>
																		
																	</tr>
																);
															}
														)
													}

												</tbody>
												:
												<tbody>
													<tr>
														<td colSpan="4" className="tab-Table">Please add category wise main Exam <a href="/Admin/FinalQuestionPapers">Click here</a> to add.</td>
													</tr>
												</tbody>
											}
											</table>
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addRolDiV">
												<button type="submit" className="col-lg-3 col-md-3 btn btn-primary craeteExamBtn pull-right" onClick={this.createExam.bind(this)}> Update Competition</button>
											</div>
										</div>
										
										:
										null
									}
								
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
			}else{
				return(<h3>Loading Please wait.</h3>);
			}
		}else if (this.state.facilityPermission == false ){
			  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
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
export default CreateExamContainer = withTracker(props =>{
	var _id = FlowRouter.getParam("examId");
	var postHandle = Meteor.subscribe("singleCompetition",_id);
	var loading = !postHandle.ready();
	var examData = ExamMaster.findOne({"_id":_id})||{};
	return{
		loading,
		examData,
		_id
	} 
})(CreateExam);