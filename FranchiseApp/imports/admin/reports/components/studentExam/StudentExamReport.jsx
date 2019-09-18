import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';


import MonthlyStudentExamReport from './MonthlyStudentExamReport.jsx';
import AnualStudentExamReport from './AnualStudentExamReport.jsx';
import {Session} from 'meteor/session';

export default class FinalExamReport extends TrackerReact(Component) {
   
	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		$("html,body").scrollTop(0);
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

// Show category from categoryMaster collection
  	/*showCategories(){
		var categorryHandle = Meteor.subscribe("allCategory").ready();
			return CategoryMaster.find({}).fetch();	
	}*/

	/*admin_getCategory(){
		var categoryName = this.refs.category.value;
		Session.set("categoryNMAdmin",categoryName);
	}*/
	
  render() {
    return (

    	<div>
	        {/* Content Wrapper. Contains page content */}
	        <div className="content-wrapper vendor-wrapper">
	          <section className="content">
	            <div className="row">
	              <div className="col-md-12">
	               <section className="content-header">
		            <h1>Reports</h1>
		           </section>
		           <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                    <div className="box-header with-border">
					           	<h3 className="box-title">Student Registration For Franchise Report</h3>
					        </div>
					        {/*<div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-6 col-xs-6 categoryTabAdmin">
								<span className="blocking-span"> 
									<select type="text" name="category" ref="category" className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" onChange={this.admin_getCategory.bind(this)} title="select Category" required>
										<option>-- Select Category --</option>
										{this.showCategories().map((categories,index)=>{
											return <option key={index}>{categories.categoryName}</option>
										  })
										}
									</select>
									<span className="floating-label floating-label-Date">Exam Category</span>					   			
								</span>
							</div>*/}
		                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                      <div className="reportWrapper">
		                        <div id="parkingreport" className="ReportTabs col-lg-10 col-lg-offset-2">
		                          <ul className="nav nav-pills nav-pillss">
		                            {/*<li className="active transactionTab col-lg-2 col-md-2 col-sm-12 col-xs-12">
								    	<a data-toggle="pill" href="#todaysReport" className=""> Today 
								    	</a>
								    </li>
								    <li className="col-lg-2 col-md-2 col-sm-2 col-xs-12 transactionTab">
								    	<a data-toggle="pill" href="#weeklyReport">
								    		This Week
								    	</a>
								    </li>*/}
								    <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 active transactionTab">
								    	<a data-toggle="pill" href="#monthlyReport">
								    		This Month
								    	</a>
								    </li>
								    <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab">
								    	<a data-toggle="pill" href="#yearlyReport">
								    		This Year
								    	</a>
								    </li>
		                          </ul>
		                        </div>
		                        <div className="MarginTop20 col-lg-12 col-md-12"></div>
		                        <div className="tab-content">
		                            {/*<div id="todaysReport" className="tab-pane fade in active">
{									  <DailyPracticeTestReport />
}									</div>
									<div id="weeklyReport" className="tab-pane fade">
									  <WeeklyPracticeTestReport />
									</div>*/}
									<div id="monthlyReport" className="tab-pane fade in active">
									  <MonthlyStudentExamReport />
									</div>
									<div id="yearlyReport" className="tab-pane fade">
									  <AnualStudentExamReport />
									</div>
		                        </div>
		                      </div>
		                    </div>
	                  	  </div>
	                	</div>
	                  </div>
	                </div>
	               </section>
	              </div>
	            </div>
	          </section>
	        </div>
	    </div>
	);
  } 
}