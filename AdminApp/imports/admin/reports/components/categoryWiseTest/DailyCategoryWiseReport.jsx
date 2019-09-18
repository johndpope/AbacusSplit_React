import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import {Session} from 'meteor/session';
import { ExamMaster } from '/imports/admin/forms/exam/api/examMaster.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 
// import { BusinessMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 

export default class DailyRegistrationReport extends TrackerReact(Component) {
	componentDidMount() {
	 	// renderFunction();
	}

	constructor(props){
		super(props);
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			CWTName : '',
			"subscription" : {
				categoryData : Meteor.subscribe("allCategory"),
				"examCollection" : Meteor.subscribe("showAllExam"),
				
			}
		}
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

	CategoryDailyData(){
		var selectedDate = Session.get('newDate');
		if(selectedDate){
			var newDate  = selectedDate;
		}else{
			var newDate  = new Date();
		}
		var startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
		var endDate = new Date(startDate.getTime() + (24*60*60*1000) ); // next day at 0:0:0
		/*console.log("Session.get(categoryNMAdmin)",Session.get("categoryNMAdmin"));*/
		// var examArr = ExamMaster.find({$and:[{"category":Session.get("categoryNMAdmin")},{'createdAt':{$gte : startDate, $lt : endDate }}, {sort: {'createdAt': -1}}]}).fetch();
		if(!this.state.CWTName){
			var examArr = ExamMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'examDateFormat':{$gte : startDate, $lt : endDate }}, {sort: {'examDateFormat': -1}}).fetch();
		}else{
			var examArr = ExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'examName':this.state.CWTName,'examDateFormat':{$gte : startDate, $lt : endDate }}]}, {sort: {'examDateFormat': -1}}).fetch();
		}
		var examArray = [];
		if(examArr.length > 0){
			
			for (var j = 0; j < examArr.length; j++) {
				examArray.push(
					<tr key={j}>
						<td className="tab-Table"></td>
						<td>{examArr[j].examName}</td>
						<td className="tab-Table">{moment(examArr[j].examDate).format("DD/MM/YYYY")}</td>
						<td className="tab-Table">{examArr[j].status}</td>
						<td className="tab-Table">{examArr[j].examStatus}</td>
						{/*<td className="text-center">{examArr[j].status}</td>*/}
						{/*<td className="text-center">
							<a href={'/admin/viewTransactionDetails/'+examArr[j]._id}>
                              <button className="btn blue-btn">
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              </button>
                            </a>
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

	getCWTTextValue(event){
		var studentName= $('.SearchCWTtName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				CWTName   : RegExpBuildValue,
			});
		}else{
			this.setState({
				CWTName   : '',
			});
		}
	}

	render() {
       return (
       	<section className="Content">
		<div className="row">
		<div className="col-lg-12 col-md-12">
			<div className="col-lg-12  col-md-12  col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero">
				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
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
				<div className="col-lg-4 col-md-4 col-xs-4 col-sm-4">		
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
			<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 paddingleftzero">
				<div className="col-lg-4 col-lg-offset-8 col-md-12 searchTableBoxAlignSETReport">
		       		<span className="blocking-span">
		           		<input type="text" name="search"  className="col-lg-12 col-sm-12 SearchExam SearchCWTtName inputTextSearch" onInput={this.getCWTTextValue.bind(this)} required/>
		           		<span className="floating-label">Search Exam Name</span>
		       		</span>
		        </div>
		    </div>
			<h4 className="col-lg-12 col-md-12 reportTitle text-center"> {/*<u>Daily Report</u> */}

			{ this.CategoryDailyData().length > 0 ? 
		    <ReactHTMLTableToExcel
	        id="test-table-xls-button"
	        className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	        table="dailyCategoryWiseTestTaken"
	        filename="DailyCategoryWiseTestTaken"
	        sheet="tablexls"
	        buttonText=""/>
	        : 
	        ""
	    	}

			</h4>

			<form className="todaysParkingReport">
				<div className="">
					<div className="break col-lg-12 col-md-12"></div>
					{ this.CategoryDailyData().length != 0 ?	
						<div className="table-responsive col-lg-12">
							<table className="table table-striped table-hover myTable table-bordered reportTables" id="dailyCategoryWiseTestTaken">
								<thead>
									<tr className="tableHeader myAllTable">
										<th className="tab-Table">Sr. No</th>
										<th> Exam Name </th>
										<th className="tab-Table"> Exam Date </th>
										<th className="tab-Table"> Status </th>
										<th className="tab-Table"> Exam  </th>
										{/*<th> Action </th>*/}
									</tr>
								</thead>
								<tbody className="myAllTable">
									{this.CategoryDailyData()}
								</tbody>
							</table>
						</div>
					:

					<div className="table-responsive col-lg-12">
							<table className="table table-striped table-hover myTable table-bordered reportTables" id="dailyCategoryWiseTestTaken">
								<thead>
									<tr className="tableHeader myAllTable">
										<th className="tab-Table">Sr. No</th>
										<th> Exam Name </th>
										<th className="tab-Table"> Exam Date </th>
										<th className="tab-Table"> Status </th>
										<th className="tab-Table"> Exam  </th>
										{/*<th> Action </th>*/}
									</tr>
								</thead>
								<tbody className="">
									<tr><td colSpan="5" className="tab-Table">Nothing to display.</td></tr>
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