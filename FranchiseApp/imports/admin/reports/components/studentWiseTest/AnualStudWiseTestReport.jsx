import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import { CategoryMaster } from '/imports/admin/forms/addCategory/api/categoryMaster.js'; 
// import { MyExamMaster } from '/imports/admin/forms/student/api/myExamMaster.js';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';


export default class AnualStudWiseTestReport extends TrackerReact(Component) {

	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameCWTM:'',
			franchiseId:'',
			franchise:'',
			allCompetitions : [],
			allFranchiseData : [],
			allCategoryWiseStudent:[],
			"subscription" : {
				"CategoryCollection" : Meteor.subscribe("allCategory"),
			}
		}
		this.handleChange = this.handleChange.bind(this);
		// this.getFranchiseId = this.getFranchiseId.bind(this);
		this.getSWTATextValue = this.getSWTATextValue.bind(this);
	}

	componentDidMount(){
		this.StuWiseAnnualData();
		Meteor.call("allCompetitions",(err,res)=>{
	 		this.setState({
	 			allCompetitions : res,
	 		});
		});

		Meteor.call("allFranchiseData",(err,res)=>{
	 		this.setState({
	 			allFranchiseData : res,
	 		});
		});
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
		var franchiseId = $("#franchiseId option:selected").attr('id');
			this.setState({
				franchiseId : franchiseId,
		},()=>{this.StuWiseAnnualData()});
	}

	getCompetitionId(event){
		var competitionId = $("#competitionId option:selected").attr("id");
		this.setState({
			competitionId : competitionId,
		},()=>{this.StuWiseAnnualData()})
	}
	
  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			categoryName : categorySubName,
		},()=>{this.StuWiseAnnualData()});
		
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

			// if(!this.state.studentNameCWT){
			// 	var allCategoryWiseStudent = MyExamMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'examDateFormat':{$gte: yearDateStart,$lt: yearDateEnd}},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
			// }else{
			// 	var allCategoryWiseStudent = MyExamMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'fullName':this.state.studentNameCWT,'examDateFormat':{$gte: yearDateStart,$lt: yearDateEnd}}]},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
			// }
// 			if(allCategoryWiseStudent){
// // 				
				 
// 				return allCategoryWiseStudent;
// 			}

		if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		var ID=this.state.franchiseId;
	  		// console.log("Id",ID);
			if(!this.state.studentNameCWTM){
				// var allCategoryWiseStudent = MyExamMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'examDateFormat':{$gte: monthDateStart,$lt: monthDateToSess}},{sort:{"totalScore":-1,"examSolvedTime":1}}).fetch();
				Meteor.call("getCategoryWiseSWTT",this.state.franchiseId,this.state.categoryName,this.state.subCategory,this.state.competitionId,yearDateStart,yearDateEnd,(err,res)=>{
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
				Meteor.call("getCategoryWiseSWTTSearch",this.state.categoryName,yearDateStart,yearDateEnd,this.state.studentNameCWTM,(err,res)=>{
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
				Meteor.call("getCategoryWiseSWTTSearchFranchise",this.state.categoryName,yearDateStart,yearDateEnd,this.state.studentNameCWTM,(err,res)=>{
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

		}

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
				studentNameCWTM : RegExpBuildValue,
			},()=>{this.StuWiseAnnualData()});
		}else{
			this.setState({
				studentNameCWTM: '',
			},()=>{this.StuWiseAnnualData()});
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
		<div>
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero">
					<div className="col-lg-4  col-md-4 col-sm-4 col-xs-12">
						<span className="blocking-span"> 
							<select type="text" name="competitionId" ref="competitionId"  id="competitionId" onClick={this.getCompetitionId.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
								<option value="">-- Select Competition --</option>
								{this.state.allCompetitions.map((competition,index)=>{
									return <option key={index} id={competition._id}>{competition.competitionName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Competition</span>					   								   			
						</span>
					</div>
					{Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
					<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
							<span className="blocking-span"> 
								<select type="text" name="franchise" ref="franchise" id="franchiseId" value={this.state.franchise} onClick={this.getFranchiseId.bind(this)} className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.handleChange} required>
									<option value="">-- Select Franchise --</option>
									<option value="all" id="all">ALL</option>
									{this.state.allFranchiseData.map((franchise,index)=>{
										return <option key={index} id={franchise.franchiseCodeForCompanyId}>{franchise.franchiseName}</option>
									  })
									}
								</select>
								<span className="floating-label floating-label-Date">Select Franchise</span>					   			
							</span>
						</div>
					: null }

					<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
						<span className="blocking-span"> 
							<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" title="Please select Category" required>
								<option disabled value="">-- Select Category --</option>
								<option value="all" id="all">ALL</option>
								{this.showCategories().map((categories,index)=>{
									return <option key={index}>{categories.categoryName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Category</span>					   								   			
						</span>
					</div>

					<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6">
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
								<option value="all" id="all">ALL</option>
								{this.SubCategoryName()}
							</select>
							<span className="floating-label floating-label-Date">Select Sub Category</span>					   			
						</span>
					</div>

					<div className="col-lg-4 col-md-4 col-xs-4 col-sm-4 ">
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

					<div className="col-lg-4 col-md-4 col-sm-4">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  className="col-lg-12 col-sm-12 SearchExam SearchStudentCWTMName inputTextSearch" onInput={this.getSWTATextValue.bind(this)} required/>
			           		<span className="floating-label">Search Student Name</span>
			       		</span>
			        </div>
				</div>
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
				<div >
					<div className="break col-lg-12 col-md-12"></div>
						<div className="table-responsive col-lg-12">
						<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudWiseTest">
							<thead>
								<tr className="tableHeader">
									<th className="tab-Table">Sr. No</th>
									<th> Student Name </th>
									<th> Competition Name </th>
									<th className="tab-Table">Total Questions</th>
									<th className="tab-Table">Attempted</th>
									{/*<th className="tab-Table">Correct Ques</th>*/}
									{/*<th className="tab-Table">Wrong Ques </th>*/}
									{ this.state.allCategoryWiseStudent.length != 0 ?
										<th className="tab-Table">Marks out of({this.state.allCategoryWiseStudent[0].totalMarks})</th>
									:
										<th className="tab-Table">Marks out of</th>
									}
									<th className="tab-Table">Time (mm:ss) </th>
									<th className="tab-Table">Status</th>
									<th className="tab-Table">Rank</th>
								</tr>
							</thead>
							{ this.state.allCategoryWiseStudent.length != 0 ?
								<tbody className="myTableData myAllTable">
									{/*{this.parkingAnnualData()}*/}
									{this.state.allCategoryWiseStudent.map((allStudent,index)=>{
									return <tr key={index} className={"rank"+allStudent.rank}>
										<td className="tab-Table"></td>
										<td><a href={/StudentInformations/+allStudent.StudentId}>{allStudent.firstName} {allStudent.lastName}</a>
											<div className="franchName">{this.getFranchiseName(allStudent.StudentId)}</div>

										</td>
										<td>{allStudent.competitionName}</td>
										<td className="tab-Table">{allStudent.totalQuestion}</td>
										<td className="tab-Table">{allStudent.attemptedQues}</td>
										{/*<td className="tab-Table">{allStudent.correctAnswer}</td>*/}
										{/*<td className="tab-Table">{allStudent.wrongAnswer}</td>*/}
										<td className="tab-Table">{allStudent.totalScore}</td>
										<td className="tab-Table"> {allStudent.examSolvedTime}  </td>
										<td className="tab-Table">{allStudent.status}</td>
										<td className="tab-Table">{allStudent.rank !="Consolation" && (allStudent.rank=='1st' || allStudent.rank=='2nd' || allStudent.rank=='3rd')  ? <span>{allStudent.rank}  <i className ={"fa fa-trophy trofy" +allStudent.rank} aria-hidden="true"></i></span> : <span>{allStudent.rank}</span>}</td>
										
									</tr>
									})}
								</tbody>
							:
								<tbody >
									<tr>
										<td colSpan="9" className="tab-Table">Nothing to display.</td>
									</tr>
								</tbody>
							
							}
						</table>
					</div>
				</div>
			</form>
		</div>
		</div>
		</div>
		</section>	
	    );
	} 
}