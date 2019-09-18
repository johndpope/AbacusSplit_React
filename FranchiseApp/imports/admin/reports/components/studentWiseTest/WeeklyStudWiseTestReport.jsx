import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Session} from 'meteor/session';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import { CategoryMaster } from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 
// import { MyExamMaster } from '/imports/admin/forms/student/api/myExamMaster.js'; 


export default class WeeklyStudWiseTestReport extends TrackerReact(Component) {
	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameCWTW :'',
			allCategoryWiseStudent : [],
			franchiseName:'',
			"subscription" : {
				// "StudentCollection" : Meteor.subscribe("showAllStudent"),
				"CategoryCollection" : Meteor.subscribe("allCategory"),
				// "MyExamMasterCollection" : Meteor.subscribe("showAllAnswer"),
			}
		}
	}

	componentDidMount(){
		this.studWiseTestWeeklyData();
	}


	handleChange(event) {
	    const target = event.target;
	    const name = target.name;

	    this.setState({
	      [name]: event.target.value
	    });		
	}

	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			categoryName : categorySubName,
		});
		
	}
	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
		},()=>{this.studWiseTestWeeklyData()});
		
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

	currentWeek(){
		var sessionWeek = Session.get('selectedWeek');//Expecting "2017-W01" type of format
		if(sessionWeek){
			var weekVal = sessionWeek;
		}else{
			var today = moment().format("MM-DD-YYYY");
		    var weeknumber = moment(today).week();
			if(weeknumber<=9){
				weeknumber="0"+weeknumber;
			}
			var yyyy = moment(today).format("YYYY");
			var weekVal = yyyy+"-W"+weeknumber;
			Session.set("selectedWeek",weekVal);
		}

		// console.log('weekVal: ',weekVal);
		return weekVal;
	}

	previousWeek(event){
		event.preventDefault();
		var selectedWeek  = $("input#weekpicker").val();
		var newWeekDt     = moment(selectedWeek).subtract(1, 'weeks').format("YYYY-MM-DD");
		var newWeekNumber = moment(newWeekDt).week();
		//Construct the WeekNumber string as '2017-W01'
		if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
		}else if(newWeekNumber == 53){
			newWeekNumber = 52;
		}
		var yearNum=moment(newWeekDt).format("YYYY");
		var newWeek = yearNum+"-W"+newWeekNumber;

		Session.set('selectedWeek', newWeek);
		this.studWiseTestWeeklyData();
	}

	nextWeek(event){
		event.preventDefault();
		var selectedWeek  = $("input#weekpicker").val();
		var newWeekDt     = moment(selectedWeek).add(1, 'weeks').format("YYYY-MM-DD");
		var newWeekNumber = moment(newWeekDt).week();
		//Construct the WeekNumber string as '2017-W01'
		if(newWeekNumber <= 9){
			newWeekNumber = '0'+newWeekNumber;
		}
		var yearNum = moment(newWeekDt).format("YYYY");
		var newWeek = yearNum+"-W"+newWeekNumber;

		Session.set('selectedWeek', newWeek);
		this.studWiseTestWeeklyData();
	}

	studWiseTestWeeklyData(){
		var examArray    = [];
		var weekNumFromSess = Session.get("selectedWeek");

		// console.log('weekNumFromSess: ',weekNumFromSess);
		if(weekNumFromSess){
			// Like 2017-W01 for Week #1 of 2017
			// First / Get monday of date using the Week#
			var mondayInWeek   = moment(weekNumFromSess).day("Monday").week(weekNumFromSess).format();
			var mondayInWeekDt = new Date(mondayInWeek);
			var sundayOfWeek   = moment(mondayInWeek).add(7,"days").format();
			var sundayOfWeekDt = new Date(sundayOfWeek);
			if(!this.state.studentNameCWTW){
				// var allCategoryWiseStudent = MyExamMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'examDateFormat':{$gte: mondayInWeekDt, $lt: sundayOfWeekDt }},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				Meteor.call("getCategoryWiseSWTT",this.state.categoryName,this.state.subCategory,mondayInWeekDt,sundayOfWeekDt,(err,res)=>{
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
				// var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'fullName':this.state.studentNameCWTW,'examDateFormat':{$gte: mondayInWeekDt, $lt: sundayOfWeekDt }}]},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				Meteor.call("getCategoryWiseSWTTSearch",this.state.categoryName,this.state.subCategory,mondayInWeekDt,sundayOfWeekDt,this.state.studentNameCWTW,(err,res)=>{
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
				})
			}
			// if(allCategoryWiseStudent){
			// 	// console.log('allCategoryWiseStudent-------> ',allCategoryWiseStudent);
			// 	return allCategoryWiseStudent;
			// }else{
			// 	return 0;
			// }
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

	getSWTWTextValue(event){
		var studentName= $('.SearchStudentCWTWName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameCWTW : RegExpBuildValue,
			},()=>{this.studWiseTestWeeklyData()});
		}else{
			this.setState({
				studentNameCWTW : '',
			});
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


	render() {
       return (
       	<section className="Content">
		<div className="row">
		<div className="col-lg-12 col-md-12">
			<div className="col-lg-8  col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 selectCatSubCatListt">
				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
					<span className="blocking-span"> 
						<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange.bind(this)} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
							<option disabled value="">-- Select Category --</option>
							{this.showCategories().map((categories,index)=>{
								return <option key={index}>{categories.categoryName}</option>
							  })
							}
						</select>
						<span className="floating-label floating-label-Date">Select Category</span>					   								   			
					</span>
				</div>
				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
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
							{this.SubCategoryName()}
						</select>
						<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
					</span>
				</div>
			</div>
			<div className="col-lg-12 col-md-12 searchTableBoxAlignSETReport">
	       		<span className="blocking-span">
	           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentCWTWName inputTextSearch" onInput={this.getSWTWTextValue.bind(this)} required/>
	           		<span className="floating-label">Search Student Name</span>
	       		</span>
	        </div>
			<h4 className="col-lg-12 col-md-12 reportTitle text-center"><u> Weekly Report </u>

			{ this.state.allCategoryWiseStudent != 0 ? 
		    <ReactHTMLTableToExcel
	        id="test-table-xls-button"
	        className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	        table="weeklyStudWiseTest"
	        filename="WeeklyStudWiseTest"
	        sheet="tablexls"
	        buttonText=""/>
	        : ''}

			</h4>
			<form className="todaysSalesReport">
				<div className="">
					<div className="MarginTop20 col-lg-4 col-lg-offset-4 ">
						
						<div className="input-group dateinputstyle">
							<div className="input-group-addon HRMSAddon" id="previousWeek" onClick={this.previousWeek.bind(this)}>
								<span className="fa fa-caret-left nextarrow"></span>
							</div>					
							<input type="week" className="form-control dateClass"  name="weekdays" id="weekpicker" onChange={this.handleChange.bind(this)} value={this.currentWeek()} />
							<div className="input-group-addon HRMSAddon nextAddon" id="nextWeek" onClick={this.nextWeek.bind(this)}>
								<span className="fa fa-caret-right nextarrow"></span>
							</div>
						</div>
				 		
					</div>
					<div className="break col-lg-12 col-md-12"></div>
					{ this.state.allCategoryWiseStudent.length > 0 ? 
						<div className="table-responsive col-lg-12">
						<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="weeklyStudWiseTest">
							<thead>
								<tr className="tableHeader myAllTable">
									<th className="tab-Table">Sr. No</th>
									<th> Student Name </th>
									<th> Exam Name </th>
									<th className="tab-Table">Total Questions</th>
									<th className="tab-Table">Attempted</th>
									{/*<th className="tab-Table">Correct Ques</th>*/}
									{/*<th className="tab-Table">Wrong Ques </th>*/}
									<th className="tab-Table">Marks out of({this.state.allCategoryWiseStudent[0].totalMarks})</th>
									<th className="tab-Table">Time (mm:ss) </th>
									<th className="tab-Table">Status</th>
									<th className="tab-Table">Rank</th>

								</tr>
							</thead>
							<tbody className="myAllTable">
								{/*{this.studWiseTestWeeklyData()}*/}

								{this.state.allCategoryWiseStudent.map((allStudent,index)=>{
								return <tr key={index} className={"rank"+allStudent.rank}>
									<td className="tab-Table"></td>
									<td><a href={/StudentInformations/+allStudent.StudentId}>{allStudent.firstName} {allStudent.lastName}</a><br/>
										<div className="franchName">{this.getFranchiseName(allStudent.StudentId)}</div>
									</td>
									<td>{allStudent.examName}</td>
									<td className="tab-Table">{allStudent.totalQuestion}</td>
									<td className="tab-Table">{allStudent.attemptedQues}</td>
									{/*<td className="tab-Table">{allStudent.correctAnswer}</td>*/}
									{/*<td className="tab-Table">{allStudent.wrongAnswer}</td>*/}
									<td className="tab-Table">{allStudent.totalScore}</td>
									<td className="tab-Table"> {allStudent.examSolvedTime}  </td>
									<td className="tab-Table">{allStudent.status ? allStudent.status : "Attempted"}</td>
									<td className="tab-Table">{allStudent.rank !="Consolation" && (allStudent.rank=='1st' || allStudent.rank=='2nd' || allStudent.rank=='3rd') ? <span>{allStudent.rank}  <i className ={"fa fa-trophy trofy" +allStudent.rank} aria-hidden="true"></i></span> : <span>{allStudent.rank}</span>}</td>
									
								</tr>
								})}
							</tbody>
							
						</table>
						</div>
						:
							<div className="nopadLeft text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 noEarning MarginBottom20">Nothing to display.</div>
						}
						
					</div>
			</form>
		</div>
		</div>
		</section>	
	    );

	} 

}