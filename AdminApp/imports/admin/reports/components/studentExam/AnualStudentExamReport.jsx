import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Link} from 'react-router';

import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {MyPracticeExamMaster} from '/imports/admin/forms/student/api/myPracticeExamMaster.js';
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';

export default class AnualPracticeTestReport extends TrackerReact(Component) {

	
	componentDidMount() {
	 	// renderFunction();
	}

	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameYearly:'',
			franchiseId:'',
			"subscription" : {
				categoryData : Meteor.subscribe("allCategory"),
				"StudentCollection" : Meteor.subscribe("showAllStudent"),
				"practiceTestCollection" : Meteor.subscribe("showAllPracticeAnswer"),
				"MainTestCollection" : Meteor.subscribe("showAllAnswer"),
				"FranchiseCollection" : Meteor.subscribe("companyData"),
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
	showFranchise(){
		return FranchiseDetails.find({}).fetch();	
	}
	getFranchiseName(event){
		var franchiseName = $(event.target).val();
		var companyFranchiseData=FranchiseDetails.findOne({"franchiseName":franchiseName});
		if(companyFranchiseData){
			this.setState({
			franchiseId : companyFranchiseData.companyId,
		});
		}
	}


	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
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

	studRegistrationAnnualData(){
		var yearFromSess = Session.get("selectedYear");
		// var franchiseLoginId=Meteor.userId();
	    var thisYear = yearFromSess;
	    var yearDateStart = new Date("1/1/" + thisYear);
	    var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);
	    if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		var franchiseLoginId=this.state.franchiseId;
	  		if(!this.state.studentNameYearly){
			var examArr = StudentMaster.find({'companyId':franchiseLoginId,'category':this.state.categoryName,'createdAt':{$gte: yearDateStart,$lt: yearDateEnd}},{sort:{'createdAt':-1}}).fetch();
		}else{
			var examArr = StudentMaster.find({$and:[{$or:[{'companyId':franchiseLoginId,'category':this.state.categoryName}]},{'studentFullName':this.state.studentNameYearly,'createdAt':{$gte: yearDateStart,$lt: yearDateEnd}}]},{sort:{'createdAt':-1}}).fetch();
		}
	  	}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
	  		var franchiseLoginId=Meteor.userId();
			 if(!this.state.studentNameYearly){
			var examArr = StudentMaster.find({'franchise_id':franchiseLoginId,'category':this.state.categoryName,'createdAt':{$gte: yearDateStart,$lt: yearDateEnd}},{sort:{'createdAt':-1}}).fetch();
		}else{
			var examArr = StudentMaster.find({$and:[{$or:[{'franchise_id':franchiseLoginId,'category':this.state.categoryName}]},{'studentFullName':this.state.studentNameYearly,'createdAt':{$gte: yearDateStart,$lt: yearDateEnd}}]},{sort:{'createdAt':-1}}).fetch();
		}
	  	}

	    
		var examArray = [];
		if(examArr){
		if(examArr.length > 0){
			for (var j = 0; j < examArr.length; j++) {
				var finalExamData=MyExamMaster.findOne({"StudentId":examArr[j].studentId});
                if(finalExamData){
                	var Score=finalExamData.totalMarks;
                	var examTime=finalExamData.examSolvedTime;
                }
				examArray.push(
					<tr key={j}>
						<td className="tab-Table"></td>
						<td>{examArr[j].studentFirstName} {examArr[j].studentLastName}</td>
						<td>{examArr[j].category}</td>
						<td>{examArr[j].subCategory}</td>
						{/*<td>{examArr[j].category}</td>*/}
						<td className="tab-Table">{Score}</td>
						<td className="tab-Table">{examTime}</td>
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
			{Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
				<div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt">
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
					{/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
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
					</div>*/}
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<span className="blocking-span"> 
							<select type="text" name="franchiseId" ref="franchiseId" value={this.state.franchiseId} onClick={this.getFranchiseName.bind(this)} className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} required>
								<option value="">-- Select Franchise --</option>
								
								{this.showFranchise().map((franchise,index)=>{
									return <option key={index}>{franchise.franchiseName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
						</span>
					</div>
					
				</div>
				<div className="col-lg-12 col-md-12 ">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentYearlyName inputTextSearch" onInput={this.getYearlyTextValue.bind(this)} required/>
			           		<span className="floating-label">Search Student Name</span>
			       		</span>
			        </div>
			        </div>
				:
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt">
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
					{/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
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
					</div>*/}
					<div className="col-lg-6 col-md-6 ">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentYearlyName inputTextSearch" onInput={this.getYearlyTextValue.bind(this)} required/>
			           		<span className="floating-label">Search Student Name</span>
			       		</span>
			        </div>
				</div>
			}
				<h4 className="col-lg-12 col-md-12 reportTitle text-center"><u> Annual Report </u>
				{ this.studRegistrationAnnualData().length != 0 ?
		         	<ReactHTMLTableToExcel
	                    id="test-table-xls-button"
	                    className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	                    table="yearlyStudRegReport"
	                    filename="YearlyStudentRegistrationReport"
	                    sheet="tablexls"
	                    buttonText=""/>
	               :
	                <div className="pull-right"></div>
	        	}
				</h4>
				<form className="todaysSalesReport">
					<div className="">
						<div className="MarginTop20 col-lg-4 col-lg-offset-4 ">
							
							<div className="input-group yearlySalesInput">
								<div className="input-group-addon HRMSAddon" id="previousYear" onClick={this.previousYear.bind(this)}>
									<span className="fa fa-caret-left nextarrow"></span>
								</div>
								<input type="text" className="form-control yearlyValue" name="yearlyValue" id="yearlyValue" onChange={this.handleChange} value={this.currentyear()}/>
								<div className="input-group-addon HRMSAddon nextAddon" id="nextYear" onClick={this.nextYear.bind(this)}>
									<span className="fa fa-caret-right nextarrow"></span>
								</div>
					 		</div>
					 		
						</div>
						<div className="break col-lg-12 col-md-12"></div>
							{ this.studRegistrationAnnualData().length != 0 ?
							<div className="table-responsive col-lg-12">
							<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
								<thead>
									<tr className="tableHeader myAllTable">
										<th className="tab-Table">Sr. No</th>
										<th> Student Name </th>
										<th> Category </th>
										<th> Sub Category </th>
										{/*<th> Category </th>*/}
										<th> Score </th>
										<th> Time </th>
										<th> Result </th>
										{/*<th> Action </th>*/}
									</tr>
								</thead>
								<tbody className="myTableData myAllTable">
									{this.studRegistrationAnnualData()}
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