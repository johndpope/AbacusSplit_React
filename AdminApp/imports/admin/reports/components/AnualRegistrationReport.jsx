import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { StudentMaster } from '/imports/admin/forms/student/api/studentMaster.js'; 

export default class AnualRegistrationReport extends TrackerReact(Component) {

	
	componentDidMount() {
	 	// renderFunction();
	}

	constructor(){
		super();
		this.state ={
			"subscription" : {
				"customerCollection" : Meteor.subscribe("customerCollection"),
				"businessDetails" : Meteor.subscribe("businessDetails"),
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

	parkingAnnualData(){
		var yearFromSess = Session.get("selectedYear");

	    var thisYear = yearFromSess;
	    var yearDateStart = new Date("1/1/" + thisYear);
	    var yearDateEnd = new Date (yearDateStart.getFullYear(), 11, 31);

		var businessArr = StudentMaster.find({'createdAt':{$gte: yearDateStart,$lt: yearDateEnd}}).fetch();
		// console.log(businessArr);
		var parkingArray = [];
		if(businessArr.length > 0){
			for (var j = 0; j < businessArr.length; j++) {
				parkingArray.push(
					<tr key={businessArr[j]._id}>
						<td>{businessArr[j].studentName}</td>
						<td>{businessArr[j].studentEmail}</td>
						<td>{businessArr[j].mobileNumber}</td>
						<td>{businessArr[j].category}</td>
						<td className="text-center">{businessArr[j].status}</td>
						<td className="text-center">
							<a href={'/admin/viewTransactionDetails/'+businessArr[j]._id}>
                              <button className="btn blue-btn">
                                <i className="fa fa-eye" aria-hidden="true"></i>
                              </button>
                            </a>
						</td>
					</tr>
				);
				
			}
		}	    
		return parkingArray;
	}

	render() {

       return (

       	<section className="Content">
		<div className="row">
		<div className="col-lg-12 col-md-12">
			<h4 className="reportTitle text-center"><u> Annual Report </u>
			{ this.parkingAnnualData().length != 0 ?
	         	<ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="pull-right dwnldAsExcel fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                    table="yearlyEarnings"
                    filename="YearlySalesReport"
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
						{ this.parkingAnnualData().length != 0 ?
						<div className="table-responsive col-lg-12">
						<table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf" id="yearlyEarnings">
							<thead>
								<tr className="tableHeader">
									<th> Student Name </th>
									<th> Email </th>
									<th> Mobile Number </th>
									<th> Category </th>
									<th> Status </th>
									<th> Action </th>
								</tr>
							</thead>
							<tbody className="myTableData">
								{this.parkingAnnualData()}
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