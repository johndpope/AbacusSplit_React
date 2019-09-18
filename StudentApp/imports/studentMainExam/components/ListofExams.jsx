
import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {ExamMaster} from '/imports/studentMainExam/api/examMaster.js';
// import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';


class ListOfExams extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
			categoryName  : 'A',
			subCategory: 'A1',
			competitionDetails : '',
			competitionExams : [],
			compId : '',
			facilityPermission : 'waitingforResult',  	
			subscription:{
				categoryData : Meteor.subscribe("allCategory"),
				examMasterData : Meteor.subscribe("showAllExam"),
			} 
		}
		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","ListOfCometitions",(err,res)=>{
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

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
			[name] : event.target.value,
		});
	}

	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}

  	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
		});
		
	}

  	SubCategoryName(event){
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

	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}

	showAllExam(){
		var allExam = ExamMaster.find({"category":this.state.categoryName,"subCategory":this.state.subCategory},{sort:{'examDate':-1}}).fetch();
		if(allExam){
			return allExam;
		}else{
			return 0;
		}
	}

	removeExam(event){
		var _id = $(event.target).attr('id');		
		swal({
		  title              : 'Are you sure,Do you want to Delete?',
		  text               : 'You will not be able to recover this Record!',
		  type               : 'warning',
		  showCancelButton   : true,
		  confirmButtonColor : '#dd6b55',
		  cancelButtonColor  : '#d44',
		  confirmButtonText  : 'Yes, Delete it!',
		  cancelButtonText   : 'No, Keep it',
		  closeOnConfirm     : false
		}, function() {
			Meteor.call("removeExam",_id,(error,result)=>{
				if(error){

				}else{
					if(result=="regForCompetiton"){
						swal(
						    'You can not delete this competition',
						    'Student has been registered for this competition',
						    'warning'
						  );	
					}else{
					swal(
				    'Competition has been deleted',
				    '',
				    'success'
				  );
				}
			}
		  });
  			
  		});

	}

	// update exam status Assigned or UnAssigned
	updateExamStatus(event){
		var _id = $(event.target).attr('id');
		Meteor.call("ExamStatus",_id);
	}

	componentDidUpdate(){
		var postHandle = Meteor.subscribe("showAllExam").ready();
		var examAllData = ExamMaster.find({"status":"Assigned"}).fetch();
		if(examAllData){
			for(var i=0; i<examAllData.length; i++){
				$('#'+examAllData[i]._id).attr('checked',true);
			}
		}
	}

	startStopExam(event){
		var examId = $(event.target).attr('name');
		Meteor.call('examYettoStart',examId,(error,result)=>{
			if(error){

			}else{
				var result = result;
				if(result == "dateisnotTodaysDate"){
					swal("Competition Date must be todays date","","warning");
				} else if(result== "changeExamStatus"){
					swal("Competition has been stoped","","success");
				}
			}
		});
	}

	declareExamResult(e){
		var examId = e.target.getAttribute('data-id');
		Meteor.call("declaredExamResult",examId,(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res=="Declared"){
					swal("Result Declared successfully","","success");
				}else{
					swal("Result Undeclared successfully","","success");
				}
			}
		}); 
	}

// show competition exams
	getCometitionId(event){
			var compId = event.target.getAttribute('id');
			// this.setState({
			// 	compId : compId,
			// });
			{this.categorywiseExams(compId)}
	}

	categorywiseExams(compId){

		var ExamMasterData = ExamMaster.findOne({"_id":compId});
		if(ExamMasterData){
		var competitionExams = ExamMasterData.competitionExams;
		  	if(competitionExams){
			  	var data =  _.sortBy(competitionExams, function(exams){ return exams.category && exams.subCategory; });
			  	if(data){
				$('#modal'+compId).modal('show');
			  		this.setState({
						competitionExams : data,
						competitionDetails : ExamMasterData,
					});
			  }
		  	}
		}
	}
	
	startStopCompExamStatus(event){
		var compId = event.target.getAttribute('name');
		var arrayIndex = event.target.getAttribute('data-Index');
		Meteor.call("updateExamStatusStartStop",compId,arrayIndex,(err,res)=>{
			if(err){}else{
				// if(res = 'startCompetitionFirst'){
				// 	swal("start competition first!","","warning");
				// 	this.categorywiseExams(compId);
				// }
				if(res == "start"){
					swal("Exam has been Started!","","success");
					this.categorywiseExams(compId);
				}
				else{
					swal("Exam has been Stopped!","","success");
					this.categorywiseExams(compId);
				}
			}	
		});
	}
  	
	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Competition Exam</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                   <div className="box-header with-border">
				            <h3 className="box-title">List of Competition Exams</h3>
				            </div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
					              		<table className="table table-striped formTable" id="ExamListTable">
										    <thead className="tableHeader">
										        <tr>
										            <th className="tab-Table">Sr.No</th>
										            <th className="col-lg-4">Competition Name </th>
										            <th className="col-lg-2 tab-Table"> Competition Date  </th>
										            <th className="col-lg-3 tab-Table"> Start/End Time  </th>
										            {/*<th className="col-lg-2 tab-Table"> Status </th>*/}
										            <th>Start/Stop</th>
										            <th>Competition Result</th>
										            <th className="col-lg-1 tab-Table">Action</th>
										            
										        </tr>
										    </thead>
										    <tbody>
										    	{this.props.showexams.map((allExam, index)=>{
										    		return <tr key={index}>
										    			<td className="tab-Table">{index + 1}</td>
										    			<td className="aCategoryWiseExam"><a id={allExam._id} onClick={this.getCometitionId.bind(this)} title="Click to show category wise exam">{allExam.competitionName}</a></td>
										    			<td className="tab-Table">{moment(allExam.competitionDate).format("DD/MM/YYYY")}</td>
										    			<td className="tab-Table">{allExam.startTime}/{allExam.endTime}</td>
										    		
										    			{/*<td className="paidUnpaidWrap tab-Table">
										    				
												    		{allExam.status=="Assigned" ?
												    			<button className='AssigendExam btn btn-default' onClick={this.updateExamStatus.bind(this)} id={allExam._id} title="Click to UnAssigned this competition" >
												    				{allExam.status}
												    			</button>
												    		:
												    			<button className='NotAssigendExam btn btn-default' onClick={this.updateExamStatus.bind(this)} id={allExam._id} title="Click to Assigned this competition">
												    				{allExam.status}
												    			</button>
												    		}
										    			</td>*/}
										    			<td className="switchBTnLabel">
										    			{allExam.competitionStatus=="start" ?
										    				<label className="switch" title="Click to stop this competition">
										    					<input type="checkbox" id="togBtn" name={allExam._id} onClick={this.startStopExam.bind(this)} checked="checked" />
										    					<div className="slider round">
										    						<span className="on">Start</span><span className="off">Stop</span>
										    					</div>
										    				</label>
										    				:
										    				<label className="switch" title="Click to start this competition">
										    					<input type="checkbox" id="togBtn" name={allExam._id} onClick={this.startStopExam.bind(this)} checked={this.state.competitionStatus==='start'} />
										    					<div className="slider round">
										    						<span className="on">Start</span><span className="off">Stop</span>
										    					</div>
										    				</label>
										    			}
										    			</td>
										    			<td className="switchBTnLabel">
										    				{allExam.competitionStatus=="start" ?
										    					null
										    				:
										    				<button className="btn btn-primary resultBtnExam" title="Click to declare competition result publicly" data-id={allExam._id} onClick={this.declareExamResult.bind(this)}>{allExam.result =="Declared" ? "Declared" : "Not Declared"} </button>
										    			}
										    			</td> 
										    			<td className="tab-Table tdlastColmn">
										    				<i className="fa fa-eye editIcon aCategoryWiseExam"  title="Click to show category wise exams" id={allExam._id} onClick={this.getCometitionId.bind(this)} ></i>

										    				<a href={`/Admin/CreateExams/${allExam._id}`}>
										    					<i className="fa fa-edit editIcon" title="Edit Competition"></i>
										    				</a>	
										    				<i className="fa fa-trash deleteIcon" title="Delete Competition" id={allExam._id} onClick={this.removeExam.bind(this)} ></i>
															
															{/*Exams Modal */}
															<div id={'modal'+allExam._id} className="modal fade" role="dialog">
															  <div className="modal-dialog modalExamContent">
															    <div className="modal-content">
															      <div className="modal-header">
															        <button type="button" className="close" data-dismiss="modal">&times;</button>
															        <h4 className="modal-title">{this.state.competitionDetails.competitionName}</h4>
															      </div>
															      <div className="modal-body">
															        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
													              		<table className="table table-striped formTable" id="ExamListTable">
																		    <thead className="tableHeader">
																		        <tr>
																		            <th className="tab-Table">Sr.No</th>
																		            <th className="col-lg-4">Exam Name </th>
																		            <th className="col-lg-3 tab-Table"> Category  </th>
																		            <th className="col-lg-3 tab-Table"> Sub-Category  </th>
																		            <th>Start/Stop</th>
																		        </tr>
																		    </thead>
																		    {this.state.competitionExams.length > 0 ?
																		    <tbody className="myAllTable">
																		    	{this.state.competitionExams.map((competitionExam, indexx)=>{
																		    		return <tr key={indexx}>
																		    			<td className="tab-Table"></td>
																		    			<td>{competitionExam.paperTitle}</td>
																		    			<td className="tab-Table">{competitionExam.category}</td>
																		    			<td className="tab-Table">{competitionExam.subCategory}</td>
																		    			<td className="switchBTnLabel">
																		    			{competitionExam.examStatus=="start" ?
																		    			
																		    				<label className="switch" title="Click to stop this competition">
																		    					<input type="checkbox" id="togBtn1" name={allExam._id} data-Index={competitionExam.questionPaperId} onClick={this.startStopCompExamStatus.bind(this)} checked="checked" />
																		    					<div className="slider round">
																		    						<span className="on">Start</span><span className="off">Stop</span>
																		    					</div>
																		    					
																		    				</label>
																		    				:
																		    				<label className="switch" title="Click to start this competition">
																		    					<input type="checkbox" id="togBtn1" name={allExam._id} data-Index={competitionExam.questionPaperId} onClick={this.startStopCompExamStatus.bind(this)} checked={competitionExam.examStatus==='start'} />
																		    					<div className="slider round">
																		    						<span className="on">Start</span><span className="off">Stop</span>
																		    					</div>
																		    				</label>
																		    			}
																		    			</td>
																		    			</tr>
																		    		})}
																		    	</tbody>
																		    	:
																		    	<tbody>
																					<tr>
																						<td colSpan="5" className="tab-Table">Please add category wise main Exam <a href="/Admin/FinalQuestionPapers">Click here</a> to add.</td>
																					</tr>
																				</tbody>
																		    }
																		    </table>
																		</div>
															        </div>
															      <div className="modal-footer">
															        {/*<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>*/}
															      </div>
															    </div>

															  </div>
															</div>

										    			</td>
										    		</tr>
										    	})}
										    </tbody>
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
export default ListOfExamContainer = withTracker(props=>{
  	const postHandle = Meteor.subscribe('showAllExam');
    const showexams  = ExamMaster.find({}).fetch({})||[];
	  return{
	  	showexams,
	  }
})(ListOfExams);