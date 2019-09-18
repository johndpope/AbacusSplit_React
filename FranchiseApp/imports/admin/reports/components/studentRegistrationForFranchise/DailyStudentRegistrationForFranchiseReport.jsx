import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Link} from 'react-router';

import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} 		 from 'meteor/react-meteor-data';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
// import { BusinessMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 

export default class DailyStudentRegistrationForFranchiseReport extends TrackerReact(Component) {
	componentDidMount() {
	 	// renderFunction();
	}

	constructor(props){
		super(props);
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			'studentName' : '',
			"subscription" : {
				categoryData : Meteor.subscribe("allCategory"),
				"StudentCollection" : Meteor.subscribe("showAllStudent"),
				
			}
		}
	}

	handleChange(event) {
	    const target = event.target;
	    console.log("target",target);
	    const name = target.name;
	    console.log("value",value);
	    console.log("target.value",target.value);
	    this.setState({
	      [name]: value
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

	studRegistrationDailyData(){
		var selectedDate = Session.get('newDate');
		var franchiseLoginId = Meteor.userId();
		
		var id = FlowRouter.getParam("companyId");
		var companyID = parseInt(id);	

		if(selectedDate){
			var newDate  = selectedDate;
		}else{
			var newDate  = new Date();
		}
		var startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
		var endDate = new Date(startDate.getTime() + (24*60*60*1000) ); // next day at 0:0:0
		if(!this.state.studentName){
			var examArr = StudentMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'createdAt':{$gte : startDate, $lt : endDate }}, {sort: {'createdAt': -1}}).fetch();
		}else{

			var examArr = StudentMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{"studentFullName":this.state.studentName,'createdAt':{$gte : startDate, $lt : endDate }}]}, {sort: {'createdAt': -1}}).fetch();
		}
		var examArray = [];
		if(examArr.length > 0){
			for (var j = 0; j < examArr.length; j++) {
				examArray.push(
					<tr key={j}>
						<td className="tab-Table"></td>
						<td>{examArr[j].studentFirstName} {examArr[j].studentLastName}</td>
						<td>{examArr[j].studentEmail}</td>
						<td>{examArr[j].mobileNumber}</td>
						{/*<td>{examArr[j].category}</td>*/}
						<td className="tab-Table">{examArr[j].status}</td>
						{/*<td className="text-center">
							<Link to={'/admin/viewTransactionDetails/'+examArr[j]._id}>
                              <button className="btn blue-btn">
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              </button>
                            </Link>
						</td>*/}
					</tr>
				);
			}
		}
		return examArray;
	}

	// Exam search by exam name

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getTextValue(event){
		var studentName= $('.SearchStudentName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentName   : RegExpBuildValue,
			});
		}else{
			this.setState({
				studentName   : '',
			});
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
						<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
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
						<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)}className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} required>
							<option value="">-- Select Sub Category --</option>
							{this.SubCategoryName()}
						</select>
						<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
					</span>
				</div>
			</div>
			<div className="col-lg-12 col-md-12 searchTableBoxAlignSETReport">
	       		<span className="blocking-span">
	           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentName inputTextSearch" onInput={this.getTextValue.bind(this)} required/>
	           		<span className="floating-label">Search Student Name</span>
	       		</span>
	        </div>
			<h4 className="col-lg-12 col-md-12 reportTitle text-center"> <u>Daily Report</u> 

			{ this.studRegistrationDailyData().length > 0 ? 
		    <ReactHTMLTableToExcel
	        id="test-table-xls-button"
	        className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	        table="dailyStudRegReportTab"
	        filename="DailyStudentRegistrationReport"
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
					{ this.studRegistrationDailyData().length != 0 ?	
						<div className="table-responsive col-lg-12">
						<table className="table table-striped table-hover myTable table-bordered reportTables" id="dailyStudRegReportTab">
							<thead>
								<tr className="tableHeader">
									<th className="tab-Table">Sr. No</th>
									<th> Student Name </th>
									<th> Email </th>
									<th> Mobile Number </th>
									{/*<th> Category </th>*/}
									<th className="tab-Table"> Status </th>
									{/*<th> Action </th>*/}
								</tr>
							</thead>
							<tbody className="myAllTable">
								{this.studRegistrationDailyData()}
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