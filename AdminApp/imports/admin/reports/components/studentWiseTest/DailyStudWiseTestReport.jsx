import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Session} from 'meteor/session';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import { CategoryMaster } from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 
// import { MyExamMaster } from '/imports/admin/forms/student/api/myExamMaster.js'; 

export default class DailyStudWiseTestReport extends TrackerReact(Component) {
	constructor(props){
		super(props);
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameCWTD: '',
			allCategoryWiseStudent : [],
			"subscription" : {
				// "StudentCollection" : Meteor.subscribe("showAllStudent"),
				"CategoryCollection" : Meteor.subscribe("allCategory"),
				// "MyExamMasterCollection" : Meteor.subscribe("showAllAnswer"),
			}
		}
	}
	componentDidMount(){
		this.studentDataBody();
	}

	handleChange(event) {
	    const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
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
		},()=>{this.studentDataBody()});
		
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

	currentDate(){
		var setDate = Session.get('newDate');

		if(setDate){
			var today = new Date(setDate);
		}else{
			var today = new Date();
		}
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		}
		if(mm<10){
		    mm='0'+mm;
		}
		var today = yyyy+'-'+mm+'-'+dd;

		return today;
	}
	previousDate(event){
		event.preventDefault();
		var selectedDate1 = $("input#reportDate").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() - (24*60*60*1000) );
		Session.set('newDate', newDate2);

		this.studentDataBody(); //call this beacause we call server side to get the data of selected date
	}
	nextDate(event){
		event.preventDefault();
		var selectedDate1 = $("input#reportDate").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
		Session.set('newDate', newDate2);
		this.studentDataBody(); //call this beacause we call server side to get the data of selected date
	}

	studentDataBody(){
		var selectedDate = Session.get('newDate');
		if(selectedDate){
			var newDate  = selectedDate;
		}else{
			var newDate  = new Date();
		}
		var startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
		var endDate = new Date(startDate.getTime() + (24*60*60*1000) ); // next day at 0:0:0
			if(!this.state.studentNameCWTD){
				// var allCategoryWiseStudent = MyExamMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'examDateFormat':{$gte : startDate, $lt : endDate }},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				// console.log('allCategoryWiseStudent------->',allCategoryWiseStudent);
				Meteor.call("getCategoryWiseSWTT",this.state.categoryName,this.state.subCategory,startDate,endDate,(err,res)=>{
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
				// var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'fullName':this.state.studentNameCWTD,'examDateFormat':{$gte : startDate, $lt : endDate }}]},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();

				Meteor.call("getCategoryWiseSWTTSearch",this.state.categoryName,this.state.subCategory,startDate,endDate,this.state.studentNameCWTD,(err,res)=>{
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
			// 	// return allCategoryWiseStudent;
			// }
	
	}

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getSWTDTextValue(event){
		var studentName= $('.SearchStudentCWTDName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameCWTD : RegExpBuildValue,
			},()=>{this.studentDataBody()});
		}else{
			this.setState({
				studentNameCWTD: '',
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
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero">
				<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
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
				<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
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
				<div className="col-lg-4 col-md-4">		
						<div className="input-group dateinputstyle">
							<div className="input-group-addon HRMSAddon" id="previousDate" onClick={this.previousDate.bind(this)}>
								<span className="fa fa-caret-left nextarrow"></span>
							</div>					
							<input type="date" className="form-control todaysdate dateClass" name="reportDate" onChange={this.handleChange.bind(this)} id="reportDate" value={this.currentDate()}/>

							<div className="input-group-addon HRMSAddon nextAddon" id="nextDate" onClick={this.nextDate.bind(this)}>
								<span className="fa fa-caret-right nextarrow"></span>
							</div>
						</div>
					</div>
			</div>
			<div className="col-lg-12 col-md-12 searchTableBoxAlignSETReport">
	       		<span className="blocking-span">
	           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentCWTDName inputTextSearch" onInput={this.getSWTDTextValue.bind(this)} required/>
	           		<span className="floating-label">Search Student Name</span>
	       		</span>
	        </div>
			<h4 className="col-lg-12 col-md-12 reportTitle text-center"> <u>Daily Report</u> 

			{ this.state.allCategoryWiseStudent.length > 0 ? 
		    <ReactHTMLTableToExcel
	        id="test-table-xls-button"
	        className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	        table="dailyStudWiseTest"
	        filename="DailyStudWiseTest"
	        sheet="tablexls"
	        buttonText=""/>
	        : 
	        ""
	    	}

			</h4>

			<form className="todaysParkingReport">
				<div >
					<div className="break col-lg-12 col-md-12"></div>
					{ this.state.allCategoryWiseStudent.length >0 ?	
						<div className="table-responsive col-lg-12">
						<table className="table table-striped table-hover myTable table-bordered reportTables" id="dailyStudWiseTest">
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
								{/*{this.studentDataBody()}*/}
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
									<td className="tab-Table">{allStudent.status}</td>
									<td className="tab-Table">{allStudent.rank !="Consolation" && (allStudent.rank=='1st' || allStudent.rank=='2nd' || allStudent.rank=='3rd') ? <span>{allStudent.rank}  <i className ={"fa fa-trophy trofy" +allStudent.rank} aria-hidden="true"></i></span> : <span>{allStudent.rank}</span>}</td>
								</tr>
								})}
							</tbody>
						</table>
						</div>
					:
						<div className="nopadLeft text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 noEarning MarginBottom20 addLoadinginRepo">Nothing to display.</div>
					}
				</div>
			</form>
		</div>
		</div>
		</section>	
	    );

	} 

}