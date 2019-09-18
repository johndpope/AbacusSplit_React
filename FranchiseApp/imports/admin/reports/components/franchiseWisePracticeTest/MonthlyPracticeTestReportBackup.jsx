import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import {Link} from 'react-router';

// import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {MyPracticeExamMaster} from '/imports/admin/forms/student/api/myPracticeExamMaster.js';
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';
import {FranchiseDetails} from '/imports/admin/companySetting/api/CompanySettingMaster.js';

export default class MonthlyPracticeTestReport extends TrackerReact(Component) {
	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			franchiseId:'',
			franchise:'',
			franchiseNamesInfo:[],
			studentNameMonthly : '',
			studPracticeTestMonthlyData:[],
			'selectedMonth' :'',
			"subscription" : {
			 categoryData : Meteor.subscribe("allCategory"),
			// "showAllStudent" : Meteor.subscribe("showAllStudent"),
			// "companyData" : Meteor.subscribe("companyData"),
			}
		}
		this.handleChange = this.handleChange.bind(this);
		this.getFranchiseName = this.getFranchiseName.bind(this);
		this.showTestData = this.showTestData.bind(this);
		this.studRegistrationMonthlyData = this.studRegistrationMonthlyData.bind(this);
	}

	componentDidMount() {
		this.setState({
			categoryName : 'A',
		},()=>{
			this.showTestData();
		});

		this.showFranchise();
	}


	handleChange(event) {
	    const target = event.target;
	    const name = target.name;
	    this.setState({
	      [name]: target.value
	    });	
	}


	showCategories(){
		return CategoryMaster.find({}).fetch();	
	}
	showFranchise(){
		// return FranchiseDetails.find({}).fetch();	
		
		   Meteor.call("getAllFranchiseNames",(err,res)=>{
		      if(err){
		        console.log(err);
		      }else{
		        this.setState({
		           franchiseNamesInfo : res,
		        });
		      }
		    });
	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();

		this.setState({
			categoryName : categorySubName,
		},()=>{
			this.showTestData();
		});
	}
	
	getFranchiseName(event){
		var franchiseName = $(event.target).val();
		// var companyFranchiseData=FranchiseDetails.findOne({"franchiseName":franchiseName});

		Meteor.call("getSingleFranchiseName",franchiseName,(err,res)=>{
		      if(err){
		        console.log(err);
		      }else{
		        // this.setState({
		        //    franchiseNamesInfo : res,
		        // });
		        if(res){
		        	companyFranchiseData=res,
			        // console.log("companyFranchiseData",companyFranchiseData);
			        if(companyFranchiseData){
						this.setState({
						companyId : companyFranchiseData.companyId,
					},()=>{
						this.showTestData();
						
					});
					}
		        }
		     

		      }
		    });




		// if(companyFranchiseData){
		// 	this.setState({
		// 	companyId : companyFranchiseData.companyId,
		// },()=>{
		// 	this.showTestData();
			
		// });
		// }
	}


	showTestData(){
		var monthDateFromSess = Session.get("selectedMonth");
	  	var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));//Find out first day of month with selectedMonth
	  	var monthDateToSess = new Date(moment(monthDateFromSess).add(1,"M"));
	  	if(!this.state.studentNameMonthly){
	  		var studentname='';
	  	}else{
	  		var studentname=this.state.studentNameMonthly;
	  	}
	  	if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		var franchiseLoginId=this.state.companyId;
	  	}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
	  		var franchiseLoginId=Meteor.userId();
	  	}

		Meteor.call("allStudentPracticeTestDataMonthly",franchiseLoginId,this.state.categoryName,monthDateStart,monthDateToSess,studentname,(err,res)=>{
	 		// console.log("res-->",res);
	 		this.setState({
	 			studPracticeTestMonthlyData : res,
	 		},()=>{
			this.studRegistrationMonthlyData();
			
		});
	 	})

	}

	deleteDummyPurchasedQP(event){
		var _id = $(event.target).attr('id');
		Meteor.call('deleteDummyPaper',_id,(err,res)=>{
			if(err){

			}else{
				swal("Deleted successfully","",'success');
			}
		})
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
			var monthSelect = Session.set("selectedMonth",currentMonth);
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
		this.showTestData();
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
		this.showTestData();
	}

	studRegistrationMonthlyData(){
		var examArray = [];
		var examArr = this.state.studPracticeTestMonthlyData;
		
		if(examArr){
		if(examArr.length > 0){
			for (var j = 0; j < examArr.length; j++) {
				var attemptStatus = examArr[j].noOfAttempts;
				var practiceTestCount=0;
				for(z=0;z<attemptStatus.length;z++){
					if(attemptStatus[z].status==true){
						practiceTestCount=practiceTestCount+1;
					}
				}				
				examArray.push(
					<tr key={j}>
						<td className="tab-Table"></td>
						<td><a className="studentbluelabel" href={/StudentInformations/+examArr[j].buyerId}>{examArr[j].studentFullName}</a></td>
						<td>{examArr[j].category}</td>
						<td>{examArr[j].subCategory}</td>
						<td>{examArr[j].packageName}</td>
						<td>{examArr[j]}</td>
						<td className="tab-Table">{practiceTestCount}</td>
						<td className="tab-Table">
							<i className="fa fa-trash deleteIcon" onClick={this.deleteDummyPurchasedQP.bind(this)} id={examArr[j]._id} title="Delete User"/>
						</td>
						
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

	getMonthlyTextValue(event){
		var studentName= $('.SearchStudentMonthlyName').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameMonthly : RegExpBuildValue,
			},()=>{
			this.showTestData();
			
		});
		}else{
			this.setState({
				studentNameMonthly : '',
			},()=>{
			this.showTestData();
			
		});
		}
	}

	render() {

	 return (
       	<section className="Content">
			<div className="row">
			<div className="col-lg-12 col-md-12">
			{Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
				<div>
				<div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 selectCatSubCatListt paddingleftzero">
					<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
						<span className="blocking-span"> 
							<select type="text" name="franchise" ref="franchise" value={this.state.franchise} onClick={this.getFranchiseName.bind(this)} className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 " onChange={this.handleChange} required>
								<option value="">-- Select Franchise --</option>
								
								{this.state.franchiseNamesInfo.map((franchise,index)=>{
									return <option key={index}>{franchise.franchiseName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Franchise</span>					   			
						</span>
					</div>
					<div className="col-lg-4 col-md-4 col-sm-6 col-xs-6">
						<span className="blocking-span"> 
							<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 " autoComplete="off" title="Please select Category" required>
								<option disabled value="">-- Select Category --</option>
								<option value="All">All</option>
								{this.showCategories().map((categories,index)=>{
									return <option key={index}>{categories.categoryName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Category</span>					   								   			
						</span>
					</div>
					
					<div className="col-lg-4 col-md-4 ">
							<div className="input-group inputFieldSales">
								<div className="input-group-addon HRMSAddon practiceTextBox" id="previousMonth" onClick={this.previousMonth.bind(this)}>
									<span className="fa fa-caret-left nextarrow"></span>
								</div>
								<input type="month" className="form-control HRMSTextbox dateClass" name="monthlyValue" id="monthlyValue" onChange={this.handleChange} value={this.currentMonth()}/>
								<div className="input-group-addon HRMSAddon nextAddon practiceTextBox" id="nextMonth" onClick={this.nextMonth.bind(this)}>
									<span className="fa fa-caret-right nextarrow"></span>
								</div>
					 		</div>
					</div>					
				</div>
				<div className="col-lg-3 col-md-3  col-sm-3 col-xs-3 paddingleftzero">
					<div className="col-lg-12  col-md-12 searchboxreport searchlbl1">
				       		<span className="blocking-span">
				           		<input type="text" name="search"  className="col-lg-12 col-sm-12 SearchExam SearchStudentMonthlyName inputTextSearch" onInput={this.getMonthlyTextValue.bind(this)} required/>
				           		<span className="floating-label">Search Student Name</span>
				       		</span>
			       	</div>
			    </div>
		       	</div>
				:
				<div>
				<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 selectCatSubCatListt paddingleftzero">
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<span className="blocking-span"> 
							<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextpractice" autoComplete="off" title="Please select Category" required>
								<option disabled value="">-- Select Category --</option>
								<option value="All">All</option>
								{this.showCategories().map((categories,index)=>{
									return <option key={index}>{categories.categoryName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Category</span>					   								   			
						</span>
					</div>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 ">
							<div className="input-group inputFieldSales">
								<div className="input-group-addon HRMSAddon" id="previousMonth" onClick={this.previousMonth.bind(this)}>
									<span className="fa fa-caret-left nextarrow"></span>
								</div>
								<input type="month" className="form-control HRMSTextbox dateClass" name="monthlyValue" id="monthlyValue" onChange={this.handleChange} value={this.currentMonth()}/>
								<div className="input-group-addon HRMSAddon nextAddon" id="nextMonth" onClick={this.nextMonth.bind(this)}>
									<span className="fa fa-caret-right nextarrow"></span>
								</div>
					 		</div>
					</div>
				
					
				</div>
				<div className="col-lg-4 col-md-4  col-sm-4 col-xs-4 paddingleftzero">
					<div className="col-lg-12 col-md-12 bottommargin searchbxtop">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  className="col-lg-12 col-sm-12 SearchExam SearchStudentMonthlyName inputTextSearch" onInput={this.getMonthlyTextValue.bind(this)} required/>
			           		<span className="floating-label">Search Student Name</span>
			       		</span>
			       	</div>
			    </div>
		       </div>
			}
				<h4 className="col-lg-12 col-md-12 reportTitle text-center">{/*<u> Monthly Report </u>*/}
				{ this.studRegistrationMonthlyData().length != 0 ?
		         <ReactHTMLTableToExcel
	                    id="test-table-xls-button"
	                    className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	                    table="monthlyStudRegReporttab"
	                    filename="MonthlyStudRegReport"
	                    sheet="tablexls"
	                    buttonText=""/>

	                    :

	                <div className="pull-right"></div>
	        	}
				</h4>
				<form className="todaysSalesReport">
					<div>
						<div className="break col-lg-12 col-md-12 col-sm-12 col-xs-12"></div>
							{ this.studRegistrationMonthlyData().length != 0 ?
							<div className="table-responsive col-lg-12">
							<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudRegReporttab">
								<thead>
									<tr className="tableHeader">
										<th className="tab-Table">Sr. No</th>
										<th> Student Name </th>
										<th> Category </th>
										<th> Sub Category </th>
										<th> Package Name </th>
										<th> Paper Name </th>
										{/*<th> Category </th>*/}
										<th className="tab-Table"> Purchased Pratice test (count) </th>
										<th className="tab-Table"> Action</th>
										{/*<th> Action </th>*/}
									</tr>
								</thead>
								<tbody className="myAllTable">
									{this.studRegistrationMonthlyData()}
								</tbody>
							</table>
							</div>

							:
							<div className="table-responsive col-lg-12">
								<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudRegReporttab">
									<thead>
										<tr className="tableHeader">
											<th className="tab-Table">Sr. No</th>
											<th> Student Name </th>
											<th> Category </th>
											<th> Sub Category </th>
											<th> Package Name </th>
											<th> Paper Name </th>
											{/*<th> Category </th>*/}
											<th className="tab-Table"> Purchased Pratice test (count) </th>
											<th className="tab-Table"> Action</th>
											{/*<th> Action </th>*/}
										</tr>
									</thead>
									<tbody>
										<tr>
											<td colSpan="7" className="tab-Table">Nothing to display.</td>
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