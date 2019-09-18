import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import { CategoryMaster } from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 
// import { MyExamMaster } from '/imports/admin/forms/student/api/myExamMaster.js';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class AnualPaymentDetails extends TrackerReact(Component) {

	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameCWT:'',
			franchiseId:'',

			allCategoryWiseStudent:[],
			"subscription" : {
				// "StudentCollection" : Meteor.subscribe("showAllStudent"),
				"CategoryCollection" : Meteor.subscribe("allCategory"),
				// "MyExamMasterCollection" : Meteor.subscribe("showAllAnswer"),
				"FranchiseCollection" : Meteor.subscribe("companyData"),
			}
		}
	}

	componentDidMount(){
		this.StuWiseAnnualData();
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
	getFranchiseId(event){
		var franchiseName = $(event.target).val();
		var companyFranchiseData=FranchiseDetails.findOne({"franchiseName":franchiseName});
		if(companyFranchiseData){
			this.setState({
			franchiseId : companyFranchiseData.companyId,
		},()=>{this.StuWiseAnnualData()});
		}
	}

	showFranchise(){
		return FranchiseDetails.find({}).fetch();	
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
		},()=>{this.StuWiseAnnualData()});
		
		
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
		this.StuWiseAnnualData();

	}

	nextYear(event){
		event.preventDefault();
		var selectedYear = $("input#yearlyValue").val();
		var newYear = moment(selectedYear).add(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);
		this.StuWiseAnnualData();
	}

	StuWiseAnnualData(){
		var yearFromSess = Session.get("selectedYear");

	    var thisYear = yearFromSess;
	    var yearDateStart = new Date("1/1/" + thisYear);
	    var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);

		/*if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		var ID=this.state.franchiseId;
	  		// console.log("Id",ID);
			if(!this.state.studentNameCWTM){
				// var allCategoryWiseStudent = MyExamMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'examDateFormat':{$gte: monthDateStart,$lt: monthDateToSess}},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				Meteor.call("getCategoryWiseSWTT",ID,this.state.categoryName,yearDateStart,yearDateEnd,(err,res)=>{
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
				// var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'fullName':this.state.studentNameCWTM,'examDateFormat':{$gte: monthDateStart,$lt: monthDateToSess}}]},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				Meteor.call("getCategoryWiseSWTTSearch",this.state.categoryName,this.state.subCategory,yearDateStart,yearDateEnd,this.state.studentNameCWTM,(err,res)=>{
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
			}
		}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
			var ID=Meteor.userId();
				if(!this.state.studentNameCWTM){
				// var allCategoryWiseStudent = MyExamMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'examDateFormat':{$gte: monthDateStart,$lt: monthDateToSess}},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				Meteor.call("getCategoryWiseSWTTFranchise",ID,this.state.categoryName,yearDateStart,yearDateEnd,(err,res)=>{
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
				// var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'fullName':this.state.studentNameCWTM,'examDateFormat':{$gte: monthDateStart,$lt: monthDateToSess}}]},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				Meteor.call("getCategoryWiseSWTTSearchFranchise",this.state.categoryName,this.state.subCategory,yearDateStart,yearDateEnd,this.state.studentNameCWTM,(err,res)=>{
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
			}

		}*/

	}

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getSWTATextValue(event){
		var studentName= $('.SearchStudentCWTName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameCWT : RegExpBuildValue,
			},()=>{this.StuWiseAnnualData()});
		}else{
			this.setState({
				studentNameCWT: '',
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
		{Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
		<div><div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero">
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
				<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
						<span className="blocking-span"> 
							<select type="text" name="franchiseId" ref="franchiseId" value={this.state.franchiseId} onClick={this.getFranchiseId.bind(this)} className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} required>
								<option value="">-- Select Franchise --</option>
								
								{this.showFranchise().map((franchise,index)=>{
									return <option key={index}>{franchise.franchiseName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Franchise</span>					   			
						</span>
					</div>
					<div className="col-lg-4 col-md-4 col-xs-4 col-sm-4">
						<div className="input-group yearlySalesInput">
							<div className="input-group-addon HRMSAddon" id="previousYear" onClick={this.previousYear.bind(this)}>
								<span className="fa fa-caret-left nextarrow"></span>
							</div>
							<input type="text" className="form-control yearlyValue" name="yearlyValue" id="yearlyValue" onChange={this.handleChange.bind(this)} value={this.currentyear()}/>
							<div className="input-group-addon HRMSAddon nextAddon" id="nextYear" onClick={this.nextYear.bind(this)}>
								<span className="fa fa-caret-right nextarrow"></span>
							</div>
				 		</div>
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
						<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)}className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange.bind(this)} required>
							<option value="">-- Select Sub Category --</option>
							{this.SubCategoryName()}
						</select>
						<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
					</span>
				</div>*/}
			</div>
			<div className="col-lg-12 col-md-12 searchboxreport">
	       		<span className="blocking-span">
	           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentCWTName inputTextSearch" onInput={this.getSWTATextValue.bind(this)} required/>
	           		<span className="floating-label">Search Student Name</span>
	       		</span>
	        </div>
	        </div>
		:
			<div className="col-lg-12   col-md-12  col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero">
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
				<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6">
						<div className="input-group yearlySalesInput">
							<div className="input-group-addon HRMSAddon" id="previousYear" onClick={this.previousYear.bind(this)}>
								<span className="fa fa-caret-left nextarrow"></span>
							</div>
							<input type="text" className="form-control yearlyValue" name="yearlyValue" id="yearlyValue" onChange={this.handleChange.bind(this)} value={this.currentyear()}/>
							<div className="input-group-addon HRMSAddon nextAddon" id="nextYear" onClick={this.nextYear.bind(this)}>
								<span className="fa fa-caret-right nextarrow"></span>
							</div>
				 		</div>
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
						<select type="text" name="subCategory" ref="subCategory" value={this.state.subCategory} onClick={this.getSubCategoryName.bind(this)}className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange.bind(this)} required>
							<option value="">-- Select Sub Category --</option>
							{this.SubCategoryName()}
						</select>
						<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
					</span>
				</div>*/}
				<div className="col-lg-6 col-md-6 ">
	       		<span className="blocking-span">
	           		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchStudentCWTName inputTextSearch" onInput={this.getSWTATextValue.bind(this)} required/>
	           		<span className="floating-label">Search Student Name</span>
	       		</span>
	        </div>
			</div>
			
	    }
			<h4 className="col-lg-12 col-md-12 reportTitle text-center">{/*<u> Annual Report </u>*/}
			{ this.state.allCategoryWiseStudent.length != 0 ?
	         	<ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                    table="yearlyStudWiseTest"
                    filename="YearlyStudWiseTest"
                    sheet="tablexls"
                    buttonText=""/>
               :
                <div className="pull-right"></div>
        	}
			</h4>
			<form className="todaysSalesReport">
				<div>
					<div className="break col-lg-12 col-md-12"></div>
						{ this.state.allCategoryWiseStudent.length != 0 ?
						<div className="table-responsive col-lg-12">
						<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudWiseTest">
							<thead>
								<tr className="tableHeader">
									<th className="tab-Table">Sr. No</th>
									<th> Student Name </th>
									<th>Category </th>
									<th className="tab-Table">Sub Category</th>
									<th className="tab-Table">Payment Date</th>
									<th className="tab-Table">Amount</th>
								</tr>
							</thead>
							<tbody className="myTableData myAllTable">
								{this.state.allCategoryWiseStudent.map((allStudent,index)=>{
								})}
							</tbody>
						</table>
						</div>
						:
						<div className="table-responsive col-lg-12">
							<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudWiseTest">
								<thead>
									<tr className="tableHeader myAllTable">
										<th className="tab-Table">Sr. No</th>
										<th> Student Name </th>
										<th>Category </th>
										<th className="tab-Table">Sub Category</th>
										<th className="tab-Table">Payment Date</th>
										<th className="tab-Table">Amount</th>
									</tr>
								</thead>
								<tbody>
									<tr><td colSpan="6" className="tab-Table">Nothing to display.</td></tr>
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