import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';

export default class MonthlyRegistrationReport extends TrackerReact(Component) {

	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameMonthly : '',
			franchiseId:'',
			franchise:'',
			getCatWiseMonthStudRegRep : [],
			allFranchiseData :[],
			"subscription" : {
				categoryData : Meteor.subscribe("allCategory"),

			}
		}

		this.handleChange = this.handleChange.bind(this);
		this.getFranchiseId = this.getFranchiseId.bind(this);
	}

	componentWillMount(){
		Meteor.call("allFranchiseData",(err,res)=>{
			if(err){

			}else{
				this.setState({
					allFranchiseData : res,
				});	
			}
		})
	}
	componentDidMount() {
		this.setState({
			categoryName : 'A',
		},()=>{
			this.studRegistrationMonthlyData();
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
		var franchiseId = $('#SelectFranchiseIdM option:selected').attr('value');
			this.setState({
			franchiseId : franchiseId,
		},()=>{this.studRegistrationMonthlyData()});
	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			categoryName : categorySubName,
		},()=>{this.studRegistrationMonthlyData()});
	}

	
	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
		},()=>{this.studRegistrationMonthlyData()});	
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
		this.studRegistrationMonthlyData();
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
		this.studRegistrationMonthlyData();
	}

	studRegistrationMonthlyData(){
		var monthDateFromSess = Session.get("selectedMonth");
		// console.log(monthDateFromSess);
	  	var monthDateStart = new Date(moment(monthDateFromSess).month("YYYY-MM"));//Find out first day of month with selectedMonth
	  	var monthDateToSess = new Date(moment(monthDateFromSess).add(1,"M"));
	  	if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		var ID=this.state.franchiseId;
		}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
			var ID=Meteor.userId();
		}	

		// console.log("ID,",ID);
		// console.log("this.state.categoryName,",this.state.categoryName);
		// console.log("mondayInWeekDt,",monthDateStart);
		// console.log("sundayOfWeekDt,",monthDateToSess);
		if(!this.state.studentNameMonthly){
			// var examArr = StudentMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'createdAt':{$gte: monthDateStart,$lt: monthDateToSess}},{sort:{'createdAt':-1}}).fetch();
			Meteor.call("getCategoryWiseTodayStudReg",ID,this.state.categoryName,monthDateStart,monthDateToSess,(err,res)=>{
				if(err){
					console.log(err);
				}else{
					if(res){
						this.setState({
							getCatWiseMonthStudRegRep : res,
						});
					}else{
						$('.addLoadinginRepo').html("Reports are loading please wait...")
					}
				}
			});
		}else{
			// var examArr = StudentMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'studentFullName':this.state.studentNameMonthly,'createdAt':{$gte: monthDateStart,$lt: monthDateToSess}}]},{sort:{'createdAt':-1}}).fetch();
			Meteor.call("getCategoryWiseTodaySearchStudReg",ID,this.state.categoryName,monthDateStart,monthDateToSess,this.state.studentNameMonthly,(err,res)=>{
				if(err){
					console.log(err);
				}else{
					if(res){
						this.setState({
							getCatWiseMonthStudRegRep : res,
						});
					}else{
						$('.addLoadinginRepo').html("Reports are loading please wait...")
					}
				}
			});
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

	getMonthlyTextValue(event){
		var studentName= $('#SearchStudentNameMonthly').val();
		// console.log(studentName);
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameMonthly : RegExpBuildValue,
			},()=>{this.studRegistrationMonthlyData()});
		}else{
			this.setState({
				studentNameMonthly : '',
			});
		}
	}

	render() {

       return (

       	<section className="Content">
		<div className="row">
		<div className="col-lg-12 col-md-12">
			{ Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin']) ?
       		<div className="">
				<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 selectCatSubCatListt userListdropDownList franReport">

					<div className="col-lg-5 col-md-5 col-sm-5 col-xs-6 paddingleftzero">

						<span className="blocking-span"> 
							<select type="text" onClick={this.getFranchiseId.bind(this)} id="SelectFranchiseIdM" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 " onChange={this.handleChange} required>
								<option value="">-- Select Franchise --</option>
								{this.state.allFranchiseData.map((franchise,index)=>{
									return <option key={index} value={franchise.franchiseCodeForCompanyId}>{franchise.franchiseName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Franchise</span>					   			
						</span>
					</div>

					<div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
						<span className="blocking-span"> 
							<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange.bind(this)} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 " autoComplete="off" title="Please select Category" required>
								<option disabled value="">-- Select Category --</option>
								{this.showCategories().map((categories,index)=>{
									return <option key={index}>{categories.categoryName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Category</span>					   								   			
						</span>
					</div>
					
					<div className="col-lg-4 col-md-4 col-xs-12 col-sm-12 paddingrightzero">
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
				<div className="col-lg-12 col-md-12  col-sm-12 col-xs-3 pdcls">	
					<div className="col-lg-5 col-md-5 searchTableBoxAlignSETReport">

			       		<span className="blocking-span">
			           		<input type="text" name="search" id="SearchStudentNameMonthly" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" placeholder="Search Student Name" onInput={this.getMonthlyTextValue.bind(this)} required/>
			       		</span>
			        </div>
			        {this.state.franchiseId && this.state.getCatWiseMonthStudRegRep ?
				        <div className="col-lg-7 col-md-7 frachiseNMWrap">
				        
				        	<label>Franchise Name </label> : <span>{this.state.getCatWiseMonthStudRegRep.length>0 ? this.state.getCatWiseMonthStudRegRep[0].franchiseName : null}</span>
				        
				        </div>
				        :
				        	null
			        }
			    </div>    
	        </div>
	   	:


	   		<div className="col-lg-12  col-md-12  col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero tablebottomspace">


				<div className="">
					<div className="col-lg-4  col-md-4 col-sm-4 col-xs-4">
						<span className="blocking-span"> 
							<select type="text" name="categoryName" ref="categoryName" value={this.state.categoryName} onClick={this.getCategoryName.bind(this)} onChange={this.handleChange.bind(this)} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 " autoComplete="off" title="Please select Category" required>
								<option disabled value="">-- Select Category --</option>
								{this.showCategories().map((categories,index)=>{
									return <option key={index}>{categories.categoryName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Category</span>					   								   			
						</span>
					</div>
					<div className="col-lg-4 col-md-4 col-xs-4 col-sm-4 ">
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
					<div className="col-lg-4 col-md-4  col-sm-4 col-xs-4 paddingleftzero">
					<div className="col-lg-12 col-md-12 ">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  id="SearchStudentNameMonthly" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" onInput={this.getMonthlyTextValue.bind(this)} required/>
			           		<span className="floating-label">Search Student Name</span>
			       		</span>
		       		</div>
		       		</div>
				</div>

				
			</div>
				


	   	}
			<h4 className="col-lg-12 col-md-12 reportTitle text-center downloadBtnRep">{/*<u> Monthly Report </u>*/}
			{ this.state.getCatWiseMonthStudRegRep.length != 0 ?
	         <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="pull-right dwnldAsExcel searchlbl1 fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                    table="monthlyStudRegReporttab"
                    filename="MonthlyStudRegReport"
                    sheet="tablexls"
                    buttonText=""/>

                    :

                ''
        	}
			</h4>
			<form className="todaysSalesReport">
				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
					
					{/*<div className="break col-lg-12 col-md-12"></div>*/}
						<div className="table-responsive col-lg-12 col-md-12 tablealignzero">
						<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudRegReporttab">
							{this.state.franchiseId && this.state.getCatWiseMonthStudRegRep ?
						        <div className="col-lg-12 col-md-12 frachiseNMWrapRep">
						        
						        	<label>Franchise Name </label> : <span>{this.state.getCatWiseMonthStudRegRep.length>0 ? this.state.getCatWiseMonthStudRegRep[0].franchiseName : null}</span>
						        
						        </div>
						        :
						        	null
					        }
							<thead>
								<tr className="tableHeader">
									<th className="tab-Table">Sr. No</th>
									<th> Student Name </th>
									<th> Email </th>
									<th> Mobile Number </th>
									<th> Category </th>
									{/*<th> Franchise Name </th>*/}
									
									{/*<th className="tab-Table"> Status </th>
									<th> Action </th>*/}
								</tr>
							</thead>
							{ this.state.getCatWiseMonthStudRegRep.length != 0 ?
								<tbody className="myAllTable">
								{this.state.getCatWiseMonthStudRegRep.map((todaysRegs, index)=>{
								return <tr key={index}>
											<td className="tab-Table"></td>

											{
												Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
												<td><a href={'/StudentInformations/'+todaysRegs.studentId} className="userInfoLink">{todaysRegs.studentFirstName} {todaysRegs.studentLastName}</a></td>
												:
												<td><a href={'/Franchise/StudentInformations/'+todaysRegs.studentId} className="userInfoLink">{todaysRegs.studentFirstName} {todaysRegs.studentLastName}</a></td>
											}
											<td>{todaysRegs.studentEmail}</td>
											<td>{todaysRegs.mobileNumber}</td>
											<td>{todaysRegs.category}</td>

											{/*{
												Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
												<td><a href={'/Admin/profile/'+todaysRegs.franchiseId} className="userInfoLink">{todaysRegs.franchiseName}</a></td>
												:
												<td><a href={'/franchise/profile/'+todaysRegs.franchiseId} className="userInfoLink">{todaysRegs.franchiseName}</a></td>
											}*/}

											{/*<td className="tab-Table">{todaysRegs.status}</td>*/}
										</tr>
							})}
							</tbody>
							:
								<tbody >
								<tr>
									<td colSpan="6" className="tab-Table"> Nothing to display</td>
								</tr>
							</tbody>
						}
						</table>
						</div>
					</div>
			</form>
		</div>
		</div>
		</section>	
	    );

	} 

}