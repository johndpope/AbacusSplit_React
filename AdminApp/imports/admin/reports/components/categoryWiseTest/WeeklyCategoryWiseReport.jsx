import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Session} from 'meteor/session';
import { ExamMaster } from '/imports/admin/forms/exam/api/examMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';


export default class WeeklySalesReport extends TrackerReact(Component) {
	constructor(props){
		super(props);
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			CWTWName : '',
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
	}

	CategoryWeeklyData(){
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

			// console.log('mondayInWeekDt: ',mondayInWeekDt);
			// console.log('sundayOfWeekDt: ',sundayOfWeekDt);
			if(!this.state.CWTWName){
				var examArr = ExamMaster.find({$and:[{'category':this.state.categoryName,'subCategory':this.state.subCategory},{'examDateFormat':{$gte: mondayInWeekDt, $lt: sundayOfWeekDt}}]},{sort:{'examDate':-1}}).fetch();
			}else{
				var examArr = ExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'examName':this.state.CWTWName,'examDateFormat':{$gte: mondayInWeekDt, $lt: sundayOfWeekDt}}]},{sort:{'examDate':-1}}).fetch();
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

	getCWTWTextValue(event){
		var studentName= $('.SearchCWTWtName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				CWTWName   : RegExpBuildValue,
			});
		}else{
			this.setState({
				CWTWName   : '',
			});
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
				<div className="col-lg-4 col-md-4 col-xs-4 col-sm-4 ">
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
			</div>
			<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 paddingleftzero">
				<div className="col-lg-4 col-lg-offset-8 col-md-12 searchTableBoxAlignSETReport">
		       		<span className="blocking-span">
		           		<input type="text" name="search"  className="col-lg-12 col-sm-12 SearchExam SearchCWTWtName inputTextSearch" onInput={this.getCWTWTextValue.bind(this)} required/>
		           		<span className="floating-label">Search Exam Name</span>
		       		</span>
		        </div>
		    </div>
			<h4 className="col-lg-12 col-md-12 reportTitle text-center">{/*<u> Weekly Report </u>*/}

			{ this.CategoryWeeklyData().length > 0 ? 
		    <ReactHTMLTableToExcel
	        id="test-table-xls-button"
	        className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	        table="weeklyCategoryWiseTestTaken"
	        filename="WeeklyCategoryWiseTestTaken"
	        sheet="tablexls"
	        buttonText=""/>
	        : ''}

			</h4>
			<form className="todaysSalesReport">
				<div className="">
					<div className="break col-lg-12 col-md-12"></div>
					{ this.CategoryWeeklyData().length > 0 ? 
						<div className="table-responsive col-lg-12">
						<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="weeklyCategoryWiseTestTaken">
							<thead>
								<tr className="tableHeader myAllTable">
									<th className="tab-Table">Sr. No</th>
									<th> Exam Name </th>
									<th className="tab-Table"> Exam Date </th>
									<th className="tab-Table"> Status </th>
									<th className="tab-Table"> Exam </th>
									
								</tr>
							</thead>
							<tbody className="myAllTable">
								{this.CategoryWeeklyData()}
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