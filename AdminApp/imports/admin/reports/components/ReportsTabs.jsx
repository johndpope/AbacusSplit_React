import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import DailyRegistrationReport from './DailyRegistrationReport.jsx';
import WeeklyRegistrationReport from './WeeklyRegistrationReport.jsx';
import MonthlyRegistrationReport from './MonthlyRegistrationReport.jsx';
import AnualRegistrationReport from './AnualRegistrationReport.jsx';

export default class ReportsTabs extends TrackerReact(Component) {
   
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
	                <div className="box">
	                  <div className="box-header with-border boxMinHeight">
	                    <div className="box-header with-border">
				           	<h3 className="box-title">Student Registration Reports</h3>
				        </div>

	                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                      <div className="reportWrapper">
	                        <div id="parkingreport" className="ReportTabs col-lg-10 col-lg-offset-2">
	                          <ul className="nav nav-pills">
	                            <li className="active transactionTab col-lg-2 col-md-2 col-sm-12 col-xs-12">
							    	<a data-toggle="pill" href="#todaysReport" className=""> 
							    		Today 
							    	</a>
							    </li>
							    <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab">
							    	<a data-toggle="pill" href="#weeklyReport">
							    		This Week
							    	</a>
							    </li>
							    <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab">
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
	                            <div id="todaysReport" className="tab-pane fade in active">
								  <DailyRegistrationReport />
								</div>
								<div id="weeklyReport" className="tab-pane fade">
								  <WeeklyRegistrationReport />
								</div>
								<div id="monthlyReport" className="tab-pane fade">
								  <MonthlyRegistrationReport />
								</div>
								<div id="yearlyReport" className="tab-pane fade">
								  <AnualRegistrationReport />
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
	);
  } 
}