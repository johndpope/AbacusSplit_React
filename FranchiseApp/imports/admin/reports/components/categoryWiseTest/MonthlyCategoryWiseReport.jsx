import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Session} from 'meteor/session';
import { ExamMaster } from '/imports/admin/forms/exam/api/examMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';

export default class MonthlyRegistrationReport extends TrackerReact(Component) {

	
	constructor(props){
		super(props);
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			CWTMName:'',
			"subscription" : {
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
		//Construct the WeekNumber string as 'YYYY-MM'
		var yearNum=moment(newMonthDt).format("YYYY");
		var newMonth = yearNum+"-"+newMonthNumber;

		Session.set('selectedMonth', newMonth);
	}

	CategoryMonthlyData(){
		var monthDateFromSess = Session.get("selectedMonth");
		// console.log(monthDateFromSess);
	 		
	  	var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));//Find out first day of month with selectedMonth
	  	var monthDateToSess = new Date(moment(monthDateFromSess).add(1,"M"));
		if(!this.state.CWTMName){
			var examArr = ExamMaster.find({$and:[{'category':this.state.categoryName,'subCategory':this.state.subCategory},{'examDateFormat':{$gte: monthDateStart,$lt: monthDateToSess}}]},{sort:{'examDate':-1}}).fetch();
		}else{
			var examArr = ExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'examName':this.state.CWTMName,'examDateFormat':{$gte: monthDateStart,$lt: monthDateToSess}}]},{sort:{'examDate':-1}}).fetch();
		}
		// console.log(examArr);
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

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getCWTMTextValue(event){
		var studentName= $('.SearchCWTMName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				CWTMName   : RegExpBuildValue,
			});
		}else{
			this.setState({
				CWTMName   : '',
			});
		}
	}

	render() {

       return (

       	<section className="Content">
		<div className="row">
		<div className="col-lg-12 col-md-12">
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  selectCatSubCatListt paddingleftzero">
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
				<div className="col-lg-4 col-md-4 col-xs-6 col-sm-6 ">
						<div className="input-group inputFieldSales">
							<div className="input-group-addon HRMSAddon" id="previousMonth" onClick={this.previousMonth.bind(this)}>
								<span className="fa fa-caret-left nextarrow"></span>
							</div>
							<input type="month" className="form-control HRMSTextbox dateClass" name="monthlyValue" id="monthlyValue" onChange={this.handleChange.bind(this)} value={this.currentMonth()}/>
							<div className="input-group-addon HRMSAddon nextAddon" id="nextMonth" onClick={this.nextMonth.bind(this)}>
								<span className="fa fa-caret-right nextarrow"></span>
							</div>
				 		</div>
					</div>
			</div>
			<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 paddingleftzero">
				<div className="col-lg-4 col-lg-offset-8 col-md-12 searchTableBoxAlignSETReport">
		       		<span className="blocking-span">
		           		<input type="text" name="search"  className="col-lg-12 col-sm-12 SearchExam SearchCWTMName inputTextSearch" onInput={this.getCWTMTextValue.bind(this)} required/>
		           		<span className="floating-label">Search Exam Name</span>
		       		</span>
		        </div>
		    </div>
			<h4 className="col-lg-12 col-md-12 reportTitle text-center">{/*<u> Monthly Report </u>*/}
			{ this.CategoryMonthlyData().length != 0 ?
	         <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                    table="monthlyCategoryWiseTestTaken"
                    filename="MonthlyCategoryWiseTestTaken"
                    sheet="tablexls"
                    buttonText=""/>

                    :

                <div className="pull-right"></div>
        	}
			</h4>
			<form className="todaysSalesReport">
				<div className="">
					<div className="break col-lg-12 col-md-12"></div>
						{ this.CategoryMonthlyData().length != 0 ?
						<div className="table-responsive col-lg-12">
						<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyCategoryWiseTestTaken">
							<thead>
								<tr className="tableHeader myAllTable">
									<th className="tab-Table">Sr. No</th>
									<th> Exam Name </th>
									<th className="tab-Table"> Exam Date </th>
									<th className="tab-Table"> Status </th>
									<th className="tab-Table"> Exam </th>
									{/*<th> Action </th>*/}
								</tr>
							</thead>
							<tbody className="myAllTable">
								{this.CategoryMonthlyData()}
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