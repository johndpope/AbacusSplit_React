import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';

// import { BusinessMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 

export default class DailyRegistrationReport extends TrackerReact(Component) {

	constructor(props){
		super(props);
		this.state ={
			categoryName  : 'A',
			subCategory: 'A1',
			'studentName' : '',
			franchiseId:'',
			franchise:'',
			'getCategoryWiseStudRegRep': [],
			'allFranchiseData':[],
			"subscription" : {
				categoryData : Meteor.subscribe("allCategory"),
			}
		}

		this.handleChange = this.handleChange.bind(this);
		this.getFranchiseId = this.getFranchiseId.bind(this);
		this.getTextValue = this.getTextValue.bind(this);
		this.studRegistrationDailyData = this.studRegistrationDailyData.bind(this);
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
			this.studRegistrationDailyData();
		});
	 	// this.studRegistrationDailyData();
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
		var franchiseId = $('#SelectFranchiseId option:selected').attr('value');
			this.setState({
			franchiseId : franchiseId,
		},()=>{this.studRegistrationDailyData()});
	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		// console.log('categorySubName: ',categorySubName);
		this.setState({
			categoryName : categorySubName,
		},()=>{this.studRegistrationDailyData()});
					
		
	}


	getSubCategoryName(event){
		var categorySubName = $(event.target).val();
		this.setState({
			subCategory : categorySubName,
		},()=>{this.studRegistrationDailyData()});
		
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
		this.studRegistrationDailyData();
	}
	nextDate(event){
		event.preventDefault();
		var selectedDate1 = $("input#reportDate").val();
		var selectedDate = selectedDate1.replace(/-/g, '\/');

		var newDate1 = new Date(selectedDate);
		var newDate2 = new Date(newDate1.getTime() + (24*60*60*1000) );
		Session.set('newDate', newDate2);
		this.studRegistrationDailyData();
	}

	studRegistrationDailyData(){
		// console.log("Student Name",this.state.studentName);
		var selectedDate = Session.get('newDate');
		if(selectedDate){
			var newDate  = selectedDate;
		}else{
			var newDate  = new Date();
		}
		if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		var ID=this.state.franchiseId;

	  		// console.log("ID----",ID);
		}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
			var ID=Meteor.userId();
		}
		var startDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 0, 0, 0); //current day at 0:0:0
		var endDate = new Date(startDate.getTime() + (24*60*60*1000) ); // next day at 0:0:0
		if(!this.state.studentName){
			// var examArr = StudentMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'createdAt':{$gte : startDate, $lt : endDate }}, {sort: {'createdAt': -1}}).fetch();
			Meteor.call("getCategoryWiseTodayStudReg",ID,this.state.categoryName,startDate,endDate,(err,res)=>{
					if(err){
						console.log(err);
					}else{
						if(res){
							this.setState({
								getCategoryWiseStudRegRep : res,
							});
						}else{
							$('.addLoadinginRepo').html("Reports are loading please wait...")
						}
					}
					
				});
		}else{

			// var examArr = StudentMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{"studentFullName":this.state.studentName,'createdAt':{$gte : startDate, $lt : endDate }}]}, {sort: {'createdAt': -1}}).fetch();
			Meteor.call("getCategoryWiseTodaySearchStudReg",ID,this.state.categoryName,startDate,endDate,this.state.studentName,(err,res)=>{
					if(err){
						console.log(err);
					}else{
						if(res){
							this.setState({
								getCategoryWiseStudRegRep : res,
							});
						}else{
							$('.addLoadinginRepo').html("Reports are loading please wait...")
						}
					}
				});
		}
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
		var student= $('#SearchStudentNameDaily').val();
		if(student){
			var RegExpBuildValue = this.buildRegExp(student);
			this.setState({
				studentName   : RegExpBuildValue,
			},()=>{this.studRegistrationDailyData()});
		}else{
			this.setState({
				studentName   : '',
			},()=>{this.studRegistrationDailyData()});
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
							<select type="text" name="franchise" ref="franchise" value={this.state.franchise} onClick={this.getFranchiseId.bind(this)} id="SelectFranchiseId" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 " onChange={this.handleChange} required>
								<option value="">-- Select Franchise --</option>
								{this.state.allFranchiseData.map((franchise,index)=>{
									return <option key={index} value={franchise.franchiseCodeForCompanyId}>{franchise.franchiseName}</option>
								  })
								}
							</select>
							<span className="floating-label floating-label-Date">Select Franchise</span>					   			
						</span>
					</div>
					<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
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
					
					<div className=" col-lg-4 col-md-4 col-xs-12 col-sm-12 ">		
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

				<div className="col-lg-12 col-md-12  col-sm-12 col-xs-3 userListdropDownList">
					<div className="col-lg-5 col-md-5 searchTableBoxAlignSETReport ">
			       		<span className="blocking-span">
			           		<input type="text" name="search"  id="SearchStudentNameDaily" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" placeholder="Search Student Name" onInput={this.getTextValue.bind(this)} required/>
			       		</span>
			        </div>
					 {this.state.franchiseId && this.state.getCategoryWiseStudRegRep ?
				        <div className="col-lg-7 col-md-7 frachiseNMWrap">
				        
				        	<label>Franchise Name </label> : <span>{this.state.getCategoryWiseStudRegRep.length>0 ? this.state.getCategoryWiseStudRegRep[0].franchiseName : null}</span>
				        
				        </div>
				        :
				        	null
			        }
		        </div>
	        </div>
	   	:
	   		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 selectCatSubCatListt paddingleftzero tablebottomspace">
       			<div>
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
					<div className=" col-lg-4 col-md-4 col-xs-4 col-sm-4">		
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
					<div className="col-lg-4 col-md-4  col-sm-4 col-xs-4 paddingleftzero">	
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				       		<span className="blocking-span">
				           		<input type="text" name="search"  id="SearchStudentNameDaily" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" placeholder="Search Student Name" onInput={this.getTextValue.bind(this)} required/>
				       		</span>
			       		</div>
	
			        </div>
				</div>

				
			</div>
				


	   	}
			<h4 className="col-lg-12 col-md-12 reportTitle text-center downloadBtnRep"> {/*<u>Daily Report</u> */}

			{ this.state.getCategoryWiseStudRegRep.length > 0 ? 
		    <ReactHTMLTableToExcel
	        id="test-table-xls-button"
	        className="pull-right dwnldAsExcel searchlbl1 fa fa-download download-table-xls-button btn report-list-downloadXLXS"
	        table="dailyStudRegReportTab"
	        filename="DailyStudentRegistrationReport"
	        sheet="tablexls"
	        buttonText=""/>
	        : 
	        ""
	    	}

			</h4>

			<form className="todaysParkingReport">
				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">	
						<div className="table-responsive col-lg-12 paddingleftzero paddingrightzero rightspacezero">
						<table className="table table-striped table-hover myTable table-bordered reportTables" id="dailyStudRegReportTab">
							 {this.state.franchiseId ?
						        <div className="col-lg-12 col-md-12 frachiseNMWrapRep">
						        
						        	<label>Franchise Name </label> : <span>{this.state.getCategoryWiseStudRegRep.length>0 ? this.state.getCategoryWiseStudRegRep[0].franchiseName : null}</span>
						        
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
									{/*{
										Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])?
										<th> Franchise Name </th>
										:null
									}*/}

								</tr>
							</thead>
							{ this.state.getCategoryWiseStudRegRep.length != 0 ?
							<tbody className="myAllTable">
							{this.state.getCategoryWiseStudRegRep.map((todaysRegs, index)=>{
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