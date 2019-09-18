import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Link} from 'react-router';
import {withTracker} from 'meteor/react-meteor-data';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js';
import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';



 class ExamWisePaidReport extends TrackerReact(Component) {
	
	componentDidMount() {
	 	// renderFunction();
	}

	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			examName:'',
			exam:'',
			examId:'',
			studentNameMonthly : '',
			"subscription" : {
				categoryData : Meteor.subscribe("allCategory"),
				"showAllExam" : Meteor.subscribe("showAllExam"),
				"showAllCompRegOrder" : Meteor.subscribe("showAllCompRegOrder"),
			}
		}
		this.handleChange = this.handleChange.bind(this);
		this.getExamName = this.getExamName.bind(this);
	}


	handleChange(event) {
	    const target = event.target;
	    const name = target.name;
	    this.setState({
	      [name]: target.value
	    });

	    // if(name=="categoryName"){
	    // 	FlowRouter.go("/franchise/ListOfPaidStudents/"+target.value);
	    // }
	}

	showExams(){
		return ExamMaster.find({}).fetch();	
	}
	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}
	getCategoryName(event){
		var categorySubName = $(event.target).val();
		FlowRouter.go("/franchise/ListOfPaidStudents/"+this.state.examId+'/'+categorySubName);
		this.setState({
			categoryName : categorySubName,
		});
		if(categorySubName=="All"){
			this.setState({
			categoryName : 'All',
		});
		}
		
	}
	
  	getExamName(event){
		var ExamName = $(event.target).val();
		var examData = ExamMaster.findOne({"competitionName":ExamName});
		var id       = examData._id;
		if(id){
			this.setState({
			examId : id,
		});
		}
		FlowRouter.go("/franchise/ListOfPaidStudents/"+id+'/'+"A");
		
	}
	currentMonth(){
		var monthSession = Session.get('selectedMonth');
		if(monthSession){
			var currentMonth = monthSession;
		}	else{
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
	}

	nextMonth(event){
		event.preventDefault();
		var selectedMonth = $("input#monthlyValue").val();
		var newMonthDt = moment(selectedMonth).add(1, 'months').format("YYYY-MM-DD");
		var newMonthNumber = moment(newMonthDt).format("MM");
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;
		Session.set('selectedMonth', newMonth);
	}

	studPaidData(){
	  	var franchiseLoginId=Meteor.userId();
	  	var category=this.state.categoryName;
	  
			if(!this.state.studentNameMonthly){

				var examArr = CompetitionRegisterOrder.find({'competitionId':this.state.examId,'franchiseId':franchiseLoginId,'status':'paid'}).fetch();
		}else{
				var examArr = CompetitionRegisterOrder.find({$and:[{$or:[{'franchiseId':franchiseLoginId,'competitionId':this.state.examId,'status':'paid'}]},{'studentFullName':this.state.studentNameMonthly}]}).fetch();
			}
		var examArray = [];
		if(examArr){	  	
			if(examArr.length > 0){
				for (var j = 0; j < examArr.length; j++) {
					var exampaymentdate = moment(examArr[j].createdAt).format('MMM Do YYYY');
					if(category=="All"){
						var studentData=StudentMaster.findOne({"studentId":examArr[j].studentId});
					}else{
						var studentData=StudentMaster.findOne({"studentId":examArr[j].studentId,"category":category});
					}
					
	                if(studentData){
					examArray.push(
							<tr key={j}>
								<td className="tab-Table">{j+1}</td>
								<td>{studentData.studentFirstName} {studentData.studentLastName}</td>
								<td>{studentData.category}</td>
								<td>{studentData.subCategory}</td>
								<td>{exampaymentdate}</td>
								<td>{examArr[j].competitionFees}</td>
								<td>{examArr[j].maatsShare}</td>
								<td>{examArr[j].franchiseShare}</td>
							
							</tr>
					);
					}
				}
			}
		}
	
		return examArray;
	}

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getMonthlyTextValue(event){
		var studentName= $('.SearchStudentMonthlyName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameMonthly : RegExpBuildValue,
			});
		}else{
			this.setState({
				studentNameMonthly : '',
			});
		}
	}

	render() {
       return (

       	<section className="Content">
			<div className="row">
			<div className="col-lg-12 col-md-12">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 paddingleftzero">
						<span className="blocking-span"> 
							<select type="text" name="exam" ref="exam" value={this.state.exam} onClick={this.getExamName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Exam Name" required>
								<option disabled value="">-- Select Exam --</option>
								{this.showExams().map((exams,index)=>{
									return <option key={index}>{exams.competitionName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Exam</span>					   								   			
						</span>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<span className="blocking-span"> 
							<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
								<option disabled value="">-- Select Category --</option>
								{this.showCategories().map((categories,index)=>{
									return <option key={index}>{categories.categoryName}</option>
								  })
								}
								<option value="All">All Category</option>
							</select>
							<span className="floating-label floating-label-Date">Select Category</span>					   								   			
						</span>
					</div>
					
				</div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt">
					<div className="col-lg-6 col-lg-offset-6 col-md-12 searchbox1">
				       		<span className="blocking-span">
				           		<input type="text" name="search"  className="col-lg-12 col-sm-12 SearchExam SearchStudentMonthlyName inputTextSearch" onInput={this.getMonthlyTextValue.bind(this)} required/>
				           		<span className="floating-label">Search Student Name</span>
				       		</span>
			       	</div>
		       	</div>
				{ this.studPaidData().length != 0 ?
		         <ReactHTMLTableToExcel
	                    id="test-table-xls-button"
	                    // className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	                    table="monthlyStudRegReporttab"
	                    filename="MonthlyStudRegReport"
	                    sheet="tablexls"
	                    buttonText=""/>
	                    :
	                <div className="pull-right"></div>
	        	}
				
				<form className="todaysSalesReport">
					<div className="">
						<div className="break col-lg-12 col-md-12"></div>
							{ this.studPaidData().length != 0 ?
							<div className="table-responsive col-lg-12">
							<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudRegReporttab">
								<thead>
									<tr className="tableHeader">
										<th className="tab-Table">Sr. No</th>
										<th> Student Name </th>
										<th> Category </th>
										<th> Sub Category </th>
										<th> Payment Date </th>
										<th> Payment Amount (Rs)</th>
										<th> MAAT'S Share (Rs) </th>
										<th> Franchise's Share (Rs) </th>
									</tr>
								</thead>
								<tbody>
									{this.studPaidData()}
									<tr>
										<td colSpan="5" className="tab-Table totalamount">Total</td>
										<td className="totalamount">{this.props.totalCompetitionAmount}</td>
										<td className="totalamount">{this.props.totalMaatsShareAmount}</td>
										<td className="totalamount">{this.props.totalFranchiseShareAmount}</td>										
									</tr>
								</tbody>
							</table>
							</div>

							:
								<div className="table-responsive col-lg-12">
							<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
								<thead>
									<tr className="tableHeader myAllTable">
										<th className="tab-Table">Sr. No</th>
										<th> Student Name </th>
										<th> Category </th>
										<th> Sub Category </th>
										<th> Payment Date </th>
										<th> Payment Amount </th>
										
										<th> MAAT'S Share </th>
										<th> Franchise's Share  </th>
									</tr>
								</thead>
								<tbody >
								<tr>
								    <td colSpan="8" className="tab-Table">Nothing to display.</td>
								</tr>
									
								</tbody>
							</table>
							</div>
							}
						</div>
				</form>
			</div>
			</div>
		</section>	
	    );

	} 

}

export default CompetitionRegisterContainer = withTracker(props=>{
	const postHandle = Meteor.subscribe("showAllCompRegOrder");
	const LoadingTest = !postHandle.ready();
	var totalCompetitionAmount=0;
	var totalFranchiseShareAmount=0;
	var totalMaatsShareAmount=0;
	var selectedCategory = FlowRouter.getParam("category");
	var selectedExamId = FlowRouter.getParam("examId");
	// console.log("selectedExamId",selectedExamId);
	if(selectedCategory=="All"){
		var competitionData = CompetitionRegisterOrder.find({'status': 'paid',"competitionId":selectedExamId}).fetch()||{};
	}else{
		var competitionData = CompetitionRegisterOrder.find({'status': 'paid','category':selectedCategory,"competitionId":selectedExamId}).fetch()||{};
	}

	if(competitionData){
		for(i=0;i<competitionData.length;i++){
			totalCompetitionAmount=totalCompetitionAmount+parseInt(competitionData[i].competitionFees);
			totalFranchiseShareAmount=totalFranchiseShareAmount+parseInt(competitionData[i].franchiseShare);
			totalMaatsShareAmount=totalMaatsShareAmount+parseInt(competitionData[i].maatsShare);
		}
	}
	return {
		competitionData,
		totalCompetitionAmount,
		totalFranchiseShareAmount,
		totalMaatsShareAmount
	}

})(ExamWisePaidReport);
