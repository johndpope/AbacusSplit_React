import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Session} from 'meteor/session';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import { CategoryMaster } from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 
import { MyExamMaster } from '/imports/admin/forms/student/api/myExamMaster.js'; 

export default class DailyStudWiseTestReport extends TrackerReact(Component) {
	componentDidMount() {
	 	// renderFunction();
	}

	constructor(props){
		super(props);
		this.state ={
			"subscription" : {
				"StudentCollection" : Meteor.subscribe("showAllStudent"),
				"CategoryCollection" : Meteor.subscribe("allCategory"),
				"MyExamMasterCollection" : Meteor.subscribe("showAllAnswer"),
				
			}
		}
	}

	handleChange(event) {
	    const target = event.target;
	    const name = target.name;

	    this.setState({
	      [name]: value
	    });		
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
	}
	nextDate(event){
		event.preventDefault();
		var selectedDate1 = $("input#reportDate").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
		Session.set('newDate', newDate2);
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
		
		var allStudent = StudentMaster.find({}).fetch();
		if(allStudent){
			studentIdArray = [];
			for(var i=0; i<allStudent.length;i++){
				var studentId = allStudent[i].studentId;
				var studentName = allStudent[i].studentName;
				studentIdArray.push({
					'studentIds' : studentId,
					});
			}

			var distinctStudentIdArray = _.pluck(studentIdArray,'studentIds');
			var disctinctStudentId     = _.uniq(distinctStudentIdArray);
			var studentArray = [];
			for(var j=0; j<disctinctStudentId.length; j++){
				var allStudent = MyExamMaster.findOne({"StudentId": disctinctStudentId[j],'examDateFormat':{$gte : startDate, $lt : endDate }});
				if(allStudent){
					studentArray.push(
						<tr key={j}>
							<td>{studentNames(allStudent.StudentId)}</td>
							<td>{category_A(allStudent.StudentId,"A")}</td>
							<td>{category_B(allStudent.StudentId,"B")}</td>
							<td>{category_C(allStudent.StudentId,"C")}</td>
							<td>{category_B(allStudent.StudentId,"D")}</td>
							<td>{TotalExamCount(allStudent.StudentId)}</td>
							<td>{examFee(allStudent.StudentId)}</td>
						</tr>
						);
				}else{

				}
			}
			return studentArray;
		}

		function studentNames(studentId){
			var studData =  StudentMaster.findOne({"studentId":studentId});
			if(studData){
					var studName = studData.studentFirstName+' '+studData.studentLastName
					return studName;
			}
		}
		function category_A(studentId,A){
		return MyExamMaster.find({"StudentId":studentId, "category":A ,	'examDateFormat':{$gte : startDate, $lt : endDate }}).count();
		}
		function category_B(studentId,B){
			return  MyExamMaster.find({"StudentId":studentId,"category":B,'examDateFormat':{$gte : startDate, $lt : endDate }}).count();
		}
		function category_C(studentId,C){
			return  MyExamMaster.find({"StudentId":studentId,"category":C,'examDateFormat':{$gte : startDate, $lt : endDate }}).count();
		}
		function category_D(studentId,D){
			return MyExamMaster.find({"StudentId":studentId,"category":D,'examDateFormat':{$gte : startDate, $lt : endDate }}).count();
		}
		function TotalExamCount(studentId){
			return MyExamMaster.find({"StudentId":studentId,'examDateFormat':{$gte : startDate, $lt : endDate }}).count();
		}
		function examFee(studentId){
			var examData = MyExamMaster.find({"StudentId":studentId,'examDateFormat':{$gte : startDate, $lt : endDate }}).fetch();
			if(examData){
				var amount = 0;
				for(var i=0; i<examData.length;i++){
					var amount = amount + examData[i].examFees;
				}
				return amount;
			}
		}

	
	}

	

	// categoryWiseTH(){
	// 	var categoryMasterData = CategoryMaster.find({}).fetch();
	// 	if(categoryMasterData){
	// 		categoryTHArray =[];
	// 		for(var j=0; j<categoryMasterData.length;j++){
	// 			categoryTHArray.push(
	// 				<th className={"catNameReport"+j}>{categoryMasterData[j].categoryName}</th>
	// 				)
	// 		}
	// 		return categoryTHArray;

	// 	}
	// }
	

	render() {
       return (
       	<section className="Content">
		<div className="row">
		<div className="col-lg-12 col-md-12">
			<h4 className="reportTitle text-center"> <u>Daily Report</u> 

			{ this.studentDataBody().length > 0 ? 
		    <ReactHTMLTableToExcel
	        id="test-table-xls-button"
	        className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	        table="dailyTransactionParking"
	        filename="DailySalesReport"
	        sheet="tablexls"
	        buttonText=""/>
	        : 
	        ""
	    	}

			</h4>

			<form className="todaysParkingReport">
				<div className="">
					<div className="MarginTop20 col-lg-4 col-lg-offset-4">		
						<div className="input-group dateinputstyle">
							<div className="input-group-addon HRMSAddon" id="previousDate" onClick={this.previousDate.bind(this)}>
								<span className="fa fa-caret-left nextarrow"></span>
							</div>					
							<input type="date" className="form-control todaysdate dateClass" name="reportDate" onChange={this.handleChange} id="reportDate" value={this.currentDate()}/>

							<div className="input-group-addon HRMSAddon nextAddon" id="nextDate" onClick={this.nextDate.bind(this)}>
								<span className="fa fa-caret-right nextarrow"></span>
							</div>
						</div>
				 		
					</div>
					<div className="break col-lg-12 col-md-12"></div>
					{ this.studentDataBody().length != 0 ?	
						<div className="table-responsive col-lg-12">
						<table className="table table-striped table-hover myTable table-bordered reportTables" id="dailyTransactionParking">
							<thead>
								<tr className="tableHeader myAllTable">
									<th> Student Name </th>
									{/*{this.categoryWiseTH()}*/}
									<th>A</th>
									<th>B</th>
									<th>C</th>
									<th>D</th>
									<th>Total Exam</th>
									<th>Total Fees Paid</th>
								</tr>
							</thead>
							<tbody>
								{this.studentDataBody()}
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