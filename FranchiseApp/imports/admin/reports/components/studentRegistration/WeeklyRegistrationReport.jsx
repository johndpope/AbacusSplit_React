import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';


export default class WeeklySalesReport extends TrackerReact(Component) {
	constructor(){
		super();
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			studentNameWeekly:'',
			franchiseId:'',
			franchise:'',
			getCatWiseStudWeeklyRegRep : [],
			'allFranchiseData':[],
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
		});
	}

	componentDidMount() {
		this.setState({
			categoryName : 'A',
		},()=>{
			this.studRegistrationWeeklyData();
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
		var franchiseId = $('#SelectFranchiseIdW option:selected').attr('value');
		// console.log("franchiseId",franchiseId);
			this.setState({
			franchiseId : franchiseId,
		},()=>{this.studRegistrationWeeklyData()});
	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		// console.log('categorySubName: ',categorySubName);
		this.setState({
			categoryName : categorySubName,
		},()=>{this.studRegistrationWeeklyData()});
					
		
	}
	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
		},()=>{this.studRegistrationWeeklyData()});
		
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
		this.studRegistrationWeeklyData();
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
		this.studRegistrationWeeklyData();
	}

	studRegistrationWeeklyData(){
		var examArray    = [];
		var weekNumFromSess = Session.get("selectedWeek");
		// console.log("weekNumFromSess==>>",weekNumFromSess);
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

		if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		// console.log("inside Role weekly");
	  		var ID=this.state.franchiseId;
	  		// console.log('id: ',ID);
			
		}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
			var ID=Meteor.userId();
		}	
			if(!this.state.studentNameWeekly){
			// 	var examArr = StudentMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'createdAt':{$gte: mondayInWeekDt, $lt: sundayOfWeekDt}},{sort: {'createdAt': -1}}).fetch();
			Meteor.call("getCategoryWiseTodayStudReg",ID,this.state.categoryName,mondayInWeekDt,sundayOfWeekDt,(err,res)=>{
					if(err){
						console.log(err);
					}else{
						if(res){
							// console.log('res --->',res);
							this.setState({
								getCatWiseStudWeeklyRegRep : res,
								// getCatWiseStudWeeklyRegRep : [],
							});
						}else{
							$('.addLoadinginRepo').html("Reports are loading please wait...")
						}
					}
				});
			}else{

			// 	var examArr = StudentMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{"studentFullName":this.state.studentNameWeekly,'createdAt':{$gte: mondayInWeekDt, $lt: sundayOfWeekDt}}]}).fetch();
				Meteor.call("getCategoryWiseTodaySearchStudReg",ID,this.state.categoryName,mondayInWeekDt,sundayOfWeekDt,this.state.studentNameWeekly,(err,res)=>{
					if(err){
						console.log(err);
					}else{
						if(res){
							// console.log('res',res);

							this.setState({
								getCatWiseStudWeeklyRegRep : res,
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

	getWeeklyTextValue(event){
		var studentName= $('#SearchStudentNameWeekly').val();
		// console.log("studentName",studentName);
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameWeekly : RegExpBuildValue,
			},()=>{this.studRegistrationWeeklyData()});
		}else{
			this.setState({
				studentNameWeekly : '',
			},()=>{this.studRegistrationWeeklyData()});
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

					<div className="col-lg-5 col-md-5 col-sm-5 col-xs-6">

						<span className="blocking-span"> 
							<select type="text" name="franchise" ref="franchise" value={this.state.franchise} onClick={this.getFranchiseId.bind(this)} id="SelectFranchiseIdW" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 " onChange={this.handleChange} required>
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
					
					<div className="col-lg-4 col-md-4 col-xs-12 col-sm-12 paddingleftnull">
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
				<div className="col-lg-12 col-md-12  col-sm-12 col-xs-3 userListdropDownList">
					<div className="col-lg-5  col-md-5 searchTableBoxAlignSETReport ">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  id="SearchStudentNameWeekly" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" placeholder="Search Student Name" onInput={this.getWeeklyTextValue.bind(this)} required/>
			       		</span>
			        </div>
			        {this.state.franchiseId && this.state.getCatWiseStudWeeklyRegRep?
				        <div className="col-lg-7 col-md-7 frachiseNMWrap">
				        	<label>Franchise Name </label> : <span>{this.state.getCatWiseStudWeeklyRegRep.length>0 ? this.state.getCatWiseStudWeeklyRegRep[0].franchiseName : null}</span>
				        </div>
				        :
				        	null
				    }
			    </div>
	        </div>
	   	:
	   		<div className="col-lg-12   col-md-12  col-sm-12 col-xs-12 selectCatSubCatListt tablebottomspace paddingrightzero paddingleftzero">
					<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
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
					<div className="col-lg-4 col-md-4 col-xs-12 col-sm-12 ">
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
					<div className="col-lg-4 col-md-4 col-sm-12 col-xs-4">
					<div className="col-lg-12 col-md-12 paddingrightzero">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  id="SearchStudentNameWeekly" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" placeholder="Search Student Name" onInput={this.getWeeklyTextValue.bind(this)} required/>
			       		</span>
		       		</div>
		       		</div>
				
			</div>
				


	   	}

			<h4 className="col-lg-12 col-md-12 reportTitle text-center downloadBtnRep">{/*<u> Weekly Report </u>*/}

				{ this.state.getCatWiseStudWeeklyRegRep.length > 0 ? 
			    <ReactHTMLTableToExcel
		        id="test-table-xls-button"
		        className="pull-right dwnldAsExcel searchlbl1 fa fa-download download-table-xls-button btn report-list-downloadXLXS"
		        table="weeklyStudRegReporttab"
		        filename="WeeklStudRegReport"
		        sheet="tablexls"
		        buttonText=""/>
		        : ''}

			</h4>
			<form className="todaysSalesReport">
				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 tableSpace">
					{/*<div className="break col-lg-12 col-md-12"></div>*/
						<div className="table-responsive col-lg-12 userListdropDownList">
							<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="weeklyStudRegReporttab">
								{this.state.franchiseId && this.state.getCatWiseStudWeeklyRegRep ?
						        <div className="col-lg-12 col-md-12 frachiseNMWrapRep">
						        
						        	<label>Franchise Name </label> : <span>{this.state.getCatWiseStudWeeklyRegRep.length>0 ? this.state.getCatWiseStudWeeklyRegRep[0].franchiseName : null}</span>
						        
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
										

										{/*<th className="tab-Table"> Status </th>
										<th> Action </th>*/}
									</tr>
								</thead>
								{ this.state.getCatWiseStudWeeklyRegRep.length > 0 ? 
									<tbody className="myAllTable">
										{this.state.getCatWiseStudWeeklyRegRep.map((todaysRegs, index)=>{
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
					}
						
					</div>
			</form>
		</div>
		</div>
		</section>	
	    );

	} 

}