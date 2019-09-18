import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import { CategoryMaster } from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';

export default class CompetitionResultReport extends TrackerReact(Component) {

	
	constructor(){
		super();
		this.state ={
			compStudDataCount : 0,
			competitionDeclared : '',
			dataRange : 100,
			limitRange : 100,
			startRange:0,
			counter: 1,
			competitionId : '',
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameCWTM :'',
			franchiseId:'',
			franchise:'',
			allCategoryWiseStudent: [],
			allCompetitions  : [],
			allFranchiseData : [],
			paginationArray  : [],
			// subscription:{
			// 	getCategory : 
			// }
		}
		this.handleChange = this.handleChange.bind(this);
		this.getFranchiseId = this.getFranchiseId.bind(this);
		this.getSWTMTextValue = this.getSWTMTextValue.bind(this);
	}

	componentWillMount(){
		// this.paginationFunction();
	}

	componentDidMount(){
		this.studWiseTestMonthlyData();
		Meteor.call("allCompetitions",(err,res)=>{
	 		this.setState({
	 			allCompetitions : res,
	 		});
		});

		Meteor.call("allFranchiseData",(err,res)=>{
	 		this.setState({
	 			allFranchiseData : res,
	 		});
		});
	}


	handleChange(event) {
	    const target = event.target;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	    });		
	}

	showCategories(){
		var categorryHandle = Meteor.subscribe("allCategory").ready();
		return CategoryMaster.find({}).fetch();	
	}

	getFranchiseId(event){
		var franchiseId = $("#franchiseId option:selected").attr('id');
			this.setState({
				franchiseId : franchiseId,
		},()=>{this.studWiseTestMonthlyData()});
	}

	getCompetitionId(event){
		Session.set('pageNumber',this.state.counter);
		var competitionId = $("#competitionId option:selected").attr("id");
		Meteor.call("getCompetitionDeclareStatus",competitionId,
			(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res){
					if(res.result=="Declared"){
						this.setState({
							competitionDeclared : true
						})

					}else{
						this.setState({
							competitionDeclared : false
						})
					}

				}				
			}
		});
		this.setState({
			competitionId : competitionId,
		},()=>{this.studWiseTestMonthlyData()});

	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			categoryName : categorySubName,
		},()=>{this.studWiseTestMonthlyData()});
		
	}

	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
			startRange:0,
			counter: 1,
		},()=>{this.studWiseTestMonthlyData()});		
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

	currentMonth(){
		var monthSession = Session.get('selectedMonth');
		if(monthSession){
			var currentMonth = monthSession;
		}else{
			var today = moment().startOf('month');
			var yyyy = moment(today).format("YYYY");
		    var monthNum = moment(today).format("MM");
		    var currentMonth = yyyy+"-"+monthNum;
			Session.set("selectedMonth",currentMonth);
			}
		return currentMonth;
	}

	previousMonth(event){
		event.preventDefault();
		var selectedMonth = $("input#monthlyValue").val();
		var newMonthDt = moment(selectedMonth).subtract(1, 'months').format("YYYY-MM-DD");
		var newMonthNumber = moment(newMonthDt).format("MM");
		//Construct the WeekNumber string as 'YYYY-MM'
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;

		Session.set('selectedMonth', newMonth);
		this.studWiseTestMonthlyData();
	}

	nextMonth(event){
		event.preventDefault();
		var selectedMonth = $("input#monthlyValue").val();
		var newMonthDt = moment(selectedMonth).add(1, 'months').format("YYYY-MM-DD");
		var newMonthNumber = moment(newMonthDt).format("MM");
		//Construct the WeekNumber string as 'YYYY-MM'
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;
		Session.set('selectedMonth', newMonth);
		this.studWiseTestMonthlyData();
	}

	studWiseTestMonthlyData(){
		Session.set('pageNumber',this.state.counter);
		this.paginationFunction();
		var monthDateFromSess = Session.get("selectedMonth");			
	  	var monthDateStart  = new Date(moment(monthDateFromSess).month("YYYY-MM"));//Find out first day of month with selectedMonth
	  	var monthDateToSess = new Date(moment(monthDateFromSess).add(1,"M"));
			if(!this.state.studentNameCWTM){
				Meteor.call("getCategoryWiseSWTT",this.state.categoryName,this.state.subCategory,this.state.competitionId,this.state.startRange,this.state.dataRange,
					(err,res)=>{
					if(err){
						console.log(err);
					}else{
						if(res){
							this.setState({
								allCategoryWiseStudent : res,
							});
					}else{
							$('.addLoadinginRepo').html("Reports are loading please wait...")
						}
					}
				});
			}else{
				Meteor.call("getCategoryWiseSWTTSearch",this.state.categoryName,this.state.studentNameCWTM,this.state.competitionId,
					(err,res)=>{
						if(err){
							console.log(err);
						}else{
							if(res){
								this.setState({
									allCategoryWiseStudent : res,
								});
							}else{
								$('.addLoadinginRepo').html("Reports are loading please wait...")
							}
						}
					});
			}
	}

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getSWTMTextValue(event){
		var studentName= $('.SearchStudentCWTMName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameCWTM : RegExpBuildValue,
			},()=>{this.studWiseTestMonthlyData()});
		}else{
			this.setState({
				studentNameCWTM : '',
			},()=>{this.studWiseTestMonthlyData()});
		}
	}

	getFranchiseName(studentId){
		var postHandle = Meteor.subscribe("LoginInStudent",studentId).ready();
		if(postHandle){
			var studData = StudentMaster.findOne({"studentId":studentId});	
			if(studData){		
				return studData.franchiseName;
			}
		}	
	}

	//----------- pagination number click function  --------------------//
	getQuestionStartEndNum(event){
		var limitRange = $(event.target).attr('id');
		// console.log("limitRange ----> ",limitRange);
		limitRange     = parseInt(limitRange);
		var startRange = limitRange - this.state.dataRange;
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
		},()=>{this.studWiseTestMonthlyData()});
		
			
	}

//------------------------ this function call when click on next arrow --------------//
	nextPagee(event){
		// console.log("this.state.counter",this.state.counter);
		var counter = this.state.counter;
		counter++;
		// console.log('counter ---> ',counter);
		var questionCount = Session.get("questionCount");

		if(questionCount>=counter){
			Session.set('pageNumber',counter);
			$('.page-link').removeClass('active');
			$(".pagination"+ counter).addClass("active");
			var limitRange = $('.active').attr('id');
			// console.log("limitRange",limitRange);
			var startRange =  parseInt(limitRange)- this.state.dataRange;
			if(startRange){
			this.setState({
				counter    : counter,
				startRange : startRange,
				// questionLimit: limitRange,
			},()=>{this.studWiseTestMonthlyData()});
		}
		}else if(questionCount==counter){
			// this.CategoryAndSubCatQuestion();
			$(".liNext").attr("disabled", true);
		}
		
	}

	previousPage(){		
		var counter = this.state.counter;
		counter--;
		// console.log('counter ---> ',counter);
		var questionCount = Session.get("questionCount");

		// if(questionCount>=counter){
			Session.set('pageNumber',counter);
			$('.page-link').removeClass('active');
			$(".pagination"+counter).addClass("active");
			var limitRange = $('.active').attr('id');
			var startRange =  parseInt(limitRange)- this.state.dataRange;
			if(startRange){
			this.setState({
				counter    : counter,
				startRange : startRange,
				// questionLimit: limitRange,
			},()=>{this.studWiseTestMonthlyData()});
		}
		// }else if(questionCount==counter){
			// this.CategoryAndSubCatQuestion();
			// $(".liNext").attr("disabled", true);
		// }
	}
//------- create pagination for table --------------// 
	paginationFunction(event){

		Meteor.call('getcompetitionwiseStudCount',this.state.competitionId,this.state.categoryName,this.state.subCategory,(err,res)=>{
			if(err){}else{
				
				if(res[0]=="getCount"){
					this.setState({
						compStudDataCount : res[1],
					});

					const maxRowsPerPage = this.state.limitRange;
					var compStudDataCount = this.state.compStudDataCount;
					// console.log("compStudDataCount",compStudDataCount);
					var paginationNum = parseInt(compStudDataCount)/maxRowsPerPage;
					var pageCount = Math.ceil(paginationNum);
					Session.set("questionCount",pageCount);
					paginationArray = [];
					// paginationArray.push(
					// 		<li  key={-1} className="page-item"><a className="page-link liNext" onClick={this.previousPage.bind(this)}><i className="fa fa-angle-double-left" aria-hidden="true"></i></a></li>
					// 	);
					for (var i=1; i<=pageCount;i++){
						var countNum = maxRowsPerPage * i;
						paginationArray.push(
							<li key={i} className="page-item" title={"Click to jump on "+i+ " page"}><a className={"page-link pagination"+i} id={countNum} onClick={this.getQuestionStartEndNum.bind(this)}>{i}</a></li>
						);
					}
					if(pageCount>=1){
						// paginationArray.push(
						// 	<li  key={-2} className="page-item"><a className="page-link liNext" onClick={this.nextPagee.bind(this)}><i className="fa fa-angle-double-right" aria-hidden="true"></i></a></li>
						// );
						this.setState({
							paginationArray : paginationArray,
						});
					}
				}
			}
		});
	}

	componentDidUpdate(){
		$('.page-link').removeClass("active");
		$('.pagination'+this.state.counter).addClass("active");
    	// Session.set('pageUMNumber',this.state.counter);
	}

	removeStudentFromCompetition(event){
	    var studentId     = event.target.id;
	    var competitionId = $(event.target).attr('name');
	    var dataRange     = this.state.dataRange;
	    var startRange    = this.state.startRange;
	    var categoryName  = this.state.categoryName;
	    var subCategory   = this.state.subCategory;
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
			},(rslt)=> {
		    Meteor.call("removeStudentFromSelectedCompetition",studentId,competitionId,(err,res)=>{
		    	if(err){
		    		console.log(err);
		    	}else{
		    		if(res=="studRemoved"){
		    			Meteor.call("getCategoryWiseSWTT",categoryName,subCategory,competitionId,startRange,dataRange,
							(err,res)=>{
							if(err){
								console.log(err);
							}else{
								if(res){
									this.setState(state=>({
										allCategoryWiseStudent : res,
									}));
							}else{
									$('.addLoadinginRepo').html("Reports are loading please wait...")
								}
							}
						});
		    			swal('Student deleted from competition successfully','','success');
		    			// this.studWiseTestMonthlyData();
		    		}
		    	}
		    });
		});
	}

	render() {
		// console.log("competitionDeclared in Old",this.state.competitionDeclared);
	       return (
	       	<section className="Content">
			<div className="row">
			<div className="col-lg-12 col-md-12">
			
				<div>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero tableAlignment">

						<div className="col-lg-4  col-md-4 col-sm-4 col-xs-12 paddingleftzero">

							<span className="blocking-span"> 
								<select type="text" name="competitionId" ref="competitionId"  id="competitionId" onClick={this.getCompetitionId.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
									<option value="">-- Select Competition --</option>
									{this.state.allCompetitions.map((competition,index)=>{
										return <option key={index} id={competition._id}>{competition.competitionName}</option>
									  })
									}
								</select>
								<span className="floating-label floating-label-Date">Select Competition</span>					   								   			
							</span>
						</div>


						<div className="col-lg-2 col-md-2 col-sm-2 col-xs-6">

							<span className="blocking-span"> 
								<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
									<option disabled value="">-- Select Category --</option>
									<option value="all" id="all">ALL</option>
									{this.showCategories().map((categories,index)=>{
										return <option key={index}>{categories.categoryName}</option>
									  })
									}
								</select>
								<span className="floating-label floating-label-Date">Select Category</span>					   								   			
							</span>
						</div>


						<div className="col-lg-2 col-md-2 col-sm-2 col-xs-6">

							<span className="helpSecSR" title="Help" onClick={this.showhideSubCatDetails.bind(this)} ><i className="fa fa-question-circle"></i></span>
							<div className="categoryListDataStud categoryListDataStudshoww">
								<label>A1/B1/C1/D1</label> : Below 7 year<br/>
								<label>A2/B2/C2/D2</label> : 7-9 year<br/>
								<label>A3/B3/C3/D3</label> : 9-11 year<br/>
								<label>A4/B4/C4/D4</label> : 11-14 year<br/>
							</div>
							<span className="blocking-span"> 
								<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)}className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange.bind(this)} required>
									<option value="">-- Select Sub Category --</option>
									<option value="all" id="all">ALL</option>
									{this.SubCategoryName()}
								</select>
								<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
							</span>
						</div>


						<div className="col-lg-4  col-md-4 col-sm-4 col-xs-12 bottomSpace paddingrightzero">

				       		<span className="blocking-span">
				           		<input type="text" name="search" placeholder="Search Student Name" className="col-lg-12 col-sm-12 SearchExam SearchStudentCWTMName inputTextSearch" onInput={this.getSWTMTextValue.bind(this)} required/>
				  
				       		</span>
				        </div>
					</div>
				</div>
		    </div>
				<h4 className="col-lg-12 col-md-12 reportTitle text-center">
				{ this.state.allCategoryWiseStudent.length != 0 ?
		         <ReactHTMLTableToExcel
	                    id="test-table-xls-button"
	                    className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	                    table="monthlyStudWiseTest"
	                    filename="MonthlyStudWiseTest"
	                    sheet="tablexls"
	                    buttonText=""/>

	                    :

	                <div className="pull-right"></div>
	        	}
				</h4>
				<form className="todaysSalesReport">
					<div>
						<div className="break col-lg-12 col-md-12"></div>
							
							<div className="table-responsive col-lg-12">
							<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudWiseTest">
								<thead>
									<tr className="tableHeader myAllTable">
										<th className="tab-Table">Sr. No</th>
										<th> Student Name </th>
										<th> Competition Name </th>
										<th className="tab-Table">Total Questions</th>
										<th className="tab-Table">Attempted</th>
										{/*<th className="tab-Table">Correct Ques</th>*/}
										{/*<th className="tab-Table">Wrong Ques </th>*/}
										{ this.state.allCategoryWiseStudent.length != 0 ?
												this.state.categoryName=="all" || this.state.subCategory=="all"?
												<th className="tab-Table">Marks</th>
												:												
												<th className="tab-Table">
													Marks out of({this.state.allCategoryWiseStudent[0].totalMarks})
												</th>
											:
											<th className="tab-Table">Marks</th>
										}
										<th className="tab-Table">Time (mm:ss) </th>
										<th className="tab-Table">Status</th>
										<th className="tab-Table">Rank</th>
										<th className="tab-Table">Action</th>
									</tr>
								</thead>
								{ this.state.allCategoryWiseStudent.length != 0 ?
								<tbody className="">
									{/*{this.studWiseTestMonthlyData()}*/}
									{this.state.allCategoryWiseStudent.map((allStudent,index)=>{
									return <tr key={index} className={this.state.competitionDeclared==true?"rank"+allStudent.rank:null}>
										<td className="tab-Table">{parseInt(Session.get('pageNumber')- 1) * (this.state.dataRange) + (index + 1)}</td>
										{/*<td><a href={/StudentInformations/+allStudent.StudentId}>{allStudent.firstName} {allStudent.lastName}</a>*/}
										{	Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
											<td><a className="studentbluelabel" href={/StudentInformations/+allStudent.StudentId}>{allStudent.firstName} {allStudent.lastName}</a>
												<div className="franchName">{this.getFranchiseName(allStudent.StudentId)}</div>
											</td>
											:
											<td><a className="studentbluelabel" href={"/Franchise/StudentInformations/"+allStudent.StudentId}>{allStudent.firstName} {allStudent.lastName}</a>
												<div className="franchName">{this.getFranchiseName(allStudent.StudentId)}</div>
											</td>

										}
										<td >{allStudent.competitionName}</td>
										<td className="tab-Table">{allStudent.totalQuestion}</td>
										<td className="tab-Table">{allStudent.attemptedQues}</td>
										{/*<td className="tab-Table">{allStudent.correctAnswer}</td>*/}
										{/*<td className="tab-Table">{allStudent.wrongAnswer}</td>*/}
										<td className="tab-Table">{allStudent.totalScore}</td>
										<td className="tab-Table"> {allStudent.examSolvedTime}  </td>
										<td className={allStudent.status=="Appearing"?"tab-Table appearingStatus":"tab-Table attemptedStatus"}>{allStudent.status}</td>

										{
											this.state.competitionDeclared==true?
											<td className="tab-Table">{allStudent.rank !="Consolation" && (allStudent.rank=='1st' || allStudent.rank=='2nd' || allStudent.rank=='3rd') ? <span>{allStudent.rank}  <i className ={"fa fa-trophy trofy" +allStudent.rank} aria-hidden="true"></i></span> : <span>{allStudent.rank}</span>}</td>
											:
											<td></td>
										}

										<td>
											<i className="fa fa-trash deleteIcon" onClick={this.removeStudentFromCompetition.bind(this)} id={allStudent.StudentId} name={this.state.competitionId} title="Remove from selected competition"/>
										</td>
										
									</tr>
									})}
								</tbody>
							:
								<tbody>
									<tr>
										<td colSpan="10" className="tab-Table">Nothing to display.</td>
									</tr>
								</tbody>
								
							}
							</table>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 paginationWrap">
									 <ul className="pagination paginationOES">
										  
										  {this.state.paginationArray}
										 
									 </ul>
								</div>
						</div>
				</form>
			</div>
			</section>	
		    );
		
	} 

}