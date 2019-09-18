import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
export default class AnualRegistrationReport extends TrackerReact(Component) {

	
	

	constructor(){
		super();
		this.state ={
			categoryName  : '',
			subCategory: '',
			studentNameYearly:'',
			franchiseId:'',
			franchise:'',
			getCatWiseStudAnnualRegRep: [],
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
		})
	}
	componentDidMount() {
	 	this.setState({
			categoryName : 'A',
		},()=>{
			this.studRegistrationAnnualData();
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
		var franchiseId = $('#SelectFranchiseIdY option:selected').attr('value');
			this.setState({
			franchiseId : franchiseId,
		},()=>{this.studRegistrationAnnualData()});
	}

  	getCategoryName(event){
		var categorySubName = $(event.target).val();
		// console.log('categorySubName: ',categorySubName);
		this.setState({
			categoryName : categorySubName,
		},()=>{this.studRegistrationAnnualData()});
					
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
		this.studRegistrationAnnualData();
	}

	nextYear(event){
		event.preventDefault();
		var selectedYear = $("input#yearlyValue").val();
		var newYear = moment(selectedYear).add(1,'years').format('YYYY');
		Session.set('selectedYear', newYear);
		this.studRegistrationAnnualData();
	}

	studRegistrationAnnualData(){
		var yearFromSess = Session.get("selectedYear");

	    var thisYear = yearFromSess;
	    var yearDateStart = new Date("1/1/" + thisYear);
	    var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);
	    if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
	  		// console.log("inside Role weekly");
	  		var ID=this.state.franchiseId;
	  		// console.log('id: ',ID);
			
		}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
			var ID=Meteor.userId();
	  		// console.log("inside Role franchise");

		}
	    if(!this.state.studentNameYearly){
			// var examArr = StudentMaster.find({'category':this.state.categoryName,'subCategory':this.state.subCategory,'createdAt':{$gte: yearDateStart,$lt: yearDateEnd}},{sort:{'createdAt':-1}}).fetch();
			Meteor.call("getCategoryWiseTodayStudReg",ID,this.state.categoryName,yearDateStart,yearDateEnd,(err,res)=>{
					if(err){
						console.log(err);
					}else{
						if(res){
							this.setState({
								getCatWiseStudAnnualRegRep : res,
							});
						}else{
							$('.addLoadinginRepo').html("Reports are loading please wait...")
						}
					}
				});
		}else{
			// var examArr = StudentMaster.find({$and:[{$or:[{'category':this.state.categoryName},{'subCategory':this.state.subCategory}]},{'studentFullName':this.state.studentNameYearly,'createdAt':{$gte: yearDateStart,$lt: yearDateEnd}}]},{sort:{'createdAt':-1}}).fetch();
			Meteor.call("getCategoryWiseTodaySearchStudReg",ID,this.state.categoryName,yearDateStart,yearDateEnd,this.state.studentNameYearly,(err,res)=>{
					if(err){
						console.log(err);
					}else{
						if(res){
							this.setState({
								getCatWiseStudAnnualRegRep : res,
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

	getYearlyTextValue(event){
		var studentName= $('#SearchStudentNameAnual').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentNameYearly : RegExpBuildValue,
			},()=>{this.studRegistrationAnnualData()});
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
			{ Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin']) ?
       		<div className="">
				<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 selectCatSubCatListt userListdropDownList franReport">

					<div className="col-lg-5 col-md-5 col-sm-5 col-xs-6">

						<span className="blocking-span"> 
							<select type="text" name="franchise" ref="franchise" value={this.state.franchise} onClick={this.getFranchiseId.bind(this)} id="SelectFranchiseIdY" className="form-control subCatTab col-lg-12 col-md-12 col-sm-12 col-xs-12 " onChange={this.handleChange} required>
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
					

					<div className="col-lg-4 col-md-4 col-xs-4 col-sm-12">

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
				</div>

				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userListdropDownList">	

					<div className="col-lg-5 col-md-5 searchTableBoxAlignSETReport">
			       		<span className="blocking-span">
			           		<input type="text" name="search" id="SearchStudentNameAnual" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" placeholder="Search Student Name" onInput={this.getYearlyTextValue.bind(this)} required/>
			       		</span>
			        </div>
			        {this.state.franchiseId && this.state.getCatWiseStudAnnualRegRep ?
				        <div className="col-lg-7 col-md-7 frachiseNMWrap">
				        	<label>Franchise Name </label> : <span>{this.state.getCatWiseStudAnnualRegRep.length>0 ? this.state.getCatWiseStudAnnualRegRep[0].franchiseName : null}</span>
				        </div>
				        :
				        	null
				        }
			    </div>
	        </div>
	   	:
	   		<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 userListdropDownList tablebottomspace">
				<div >

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
					<div className="col-lg-4 col-md-4  col-sm-4 col-xs-4 paddingleftzero">
						<div className="col-lg-12 col-md-12 ">
				       		<span className="blocking-span">
				           		<input type="text" name="search"  id="SearchStudentNameAnual" className="col-lg-12 col-sm-12 SearchExam SearchStudentName inputTextSearch" onInput={this.getYearlyTextValue.bind(this)} required/>
				           		<span className="floating-label">Search Student Name</span>
				       		</span>
			       		</div>
		       		</div>
		       	</div>
				
			</div>
				


	   	}
			<h4 className="col-lg-12 col-md-12 reportTitle text-center downloadBtnRep">{/*<u> Annual Report </u>*/}
			{ this.state.getCatWiseStudAnnualRegRep.length != 0 ?
	         	<ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="pull-right dwnldAsExcel searchlbl1 fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                    table="yearlyStudRegReport"
                    filename="YearlyStudentRegistrationReport"
                    sheet="tablexls"
                    buttonText=""/>
               :
                <div className="pull-right"></div>
        	}
			</h4>
			<form className="todaysSalesReport">
				<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
					{/*<div className="break col-lg-12 col-md-12"></div>*/}
						<div className="table-responsive col-lg-12 paddingleftzero paddingrightzero rightspacezero">
						<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
							<thead>
								<tr className="tableHeader myAllTable">
									<th className="tab-Table">Sr. No</th>
									<th> Student Name </th>
									<th> Email </th>
									<th> Mobile Number </th>
									<th> Category </th>
									
									{/*{/*<th className="tab-Table"> Status </th>
									<th> Action </th>*/}
								</tr>
							</thead>	
						{ this.state.getCatWiseStudAnnualRegRep.length != 0 ?
							<tbody className="myTableData myAllTable">
								{this.state.getCatWiseStudAnnualRegRep.map((todaysRegs, index)=>{
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