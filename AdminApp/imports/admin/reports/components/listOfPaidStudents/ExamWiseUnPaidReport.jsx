import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Link} from 'react-router';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';

export default class ExamWiseUnPaidReport extends TrackerReact(Component) {

	
	componentDidMount() {
	 	// renderFunction();
	}

	constructor(){
		super();
		this.state ={
			examName:'',
			exam:'',
			studentNameYearly:'',
			examId:'',
			
			"subscription" : {
				categoryData : Meteor.subscribe("allCategory"),
				"StudentCollection" : Meteor.subscribe("showAllStudent"),
				"practiceTestCollection" : Meteor.subscribe("showAllPracticeAnswer"),
				"MainTestCollection" : Meteor.subscribe("showAllAnswer"),
				"MainExamCollection" : Meteor.subscribe("showAllExam"),
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
	}

	showExams(){
		return ExamMaster.find({}).fetch();	
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
	}
	



	currentyear(){
		var yearSession = Session.get('selectedYear');
		if(yearSession){
			var currentYear = yearSession;
		}else{
			var today = new Date();
	    var currentYear = today.getFullYear();
			Session.set("selectedYear",currentYear);
		}

		return currentYear;
	}

	previousYear(event){
		event.preventDefault();
		var selectedYear = $("input#yearlyValue").val();
		var newYear = moment(selectedYear).subtract(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);
	}

	nextYear(event){
		event.preventDefault();
		var selectedYear = $("input#yearlyValue").val();
		var newYear = moment(selectedYear).add(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);

	}

	studPaidData(){
	  	var franchiseLoginId=Meteor.userId();
			if(!this.state.studentNameYearly){
			var examArr = CompetitionRegisterOrder.find({'examId':this.state.examId,'franchiseId':franchiseLoginId,'status':'UnPaid'}).fetch();
		}else{
			var examArr = CompetitionRegisterOrder.find({$and:[{$or:[{'franchiseId':franchiseLoginId,'examId':this.state.examId,'status':'UnPaid'}]},{'studentFullName':this.state.studentNameYearly}]}).fetch();
		}
		var examArray = [];
		if(examArr){
		if(examArr.length > 0){
			for (var j = 0; j < examArr.length; j++) {
				var studentData=StudentMaster.findOne({"studentId":examArr[j].studentId});
				var exampaymentdate = moment(examArr[j].createdAt).format('MMM Do YYYY');
                if(studentData){
                	// var practiceTestCount=studentData.length;
					examArray.push(
						<tr key={j}>
							<td className="tab-Table"></td>
							<td>{studentData.studentFirstName} {studentData.studentLastName}</td>
							<td>{studentData.category}</td>
							<td>{studentData.subCategory}</td>
							
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

	getYearlyTextValue(event){
		var studentName= $('.SearchStudentYearlyName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameYearly : RegExpBuildValue,
			});
		}else{
			this.setState({
				studentNameYearly : '',
			});
		}
	}

	render() {

       return (

       	<section className="Content">
			<div className="row">
			<div className="col-lg-12 col-md-12">
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt">
					<div className="col-lg-4 col-md-4 col-lg-offset-3 col-md-offset-3 col-sm-6 col-xs-6 paddingleftzero">
						<span className="blocking-span"> 
							<select type="text" name="examName" ref="examName" value={this.state.examName} onClick={this.getExamName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
								<option disabled value="">-- Select Exam --</option>
								{this.showExams().map((exams,index)=>{
									return <option key={index}>{exams.competitionName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Exam</span>					   								   			
						</span>
					</div>
				</div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt">
					<div className="col-lg-12 col-md-12 searchbox paddingleftzero">
				       		<span className="blocking-span">
				           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentYearlyName inputTextSearch" onInput={this.getYearlyTextValue.bind(this)} required/>
				           		<span className="floating-label">Search Student Name</span>
				       		</span>
				    </div>
				</div>
				{ this.studPaidData().length != 0 ?
		         	<ReactHTMLTableToExcel
	                    id="test-table-xls-button"
	                    // className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	                    table="yearlyStudRegReport"
	                    filename="YearlyStudentRegistrationReport"
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
							<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
								<thead>
									<tr className="tableHeader myAllTable">
										<th className="tab-Table">Sr. No</th>
										<th> Student Name </th>
										<th> Category </th>
										<th> Sub Category </th>
										
									</tr>
								</thead>
								<tbody className="myTableData myAllTable">
									{this.studPaidData()}
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
										
									</tr>
								</thead>
								<tbody className="myTableData myAllTable">
								<tr>
								    <td colSpan="6" className="nopadLeft text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 noEarning MarginBottom20">Nothing to display.</td>
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