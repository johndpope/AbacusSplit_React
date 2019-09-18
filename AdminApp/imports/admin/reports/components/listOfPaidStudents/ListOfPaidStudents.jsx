import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';

import ExamWisePaidReport from './ExamWisePaidReport.jsx';
import ExamWiseUnPaidReport from './ExamWiseUnPaidReport.jsx';
import {Session} from 'meteor/session';

export default class ListOfPaidStudents extends TrackerReact(Component) {
   
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
		           <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                    <div className="box-header with-border">
					           	<h3 className="box-title">Student Wise Payment Report</h3>
					        </div>
		                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                      <div className="reportWrapper">
		                        <div id="parkingreport" className="ReportTabs col-lg-8 col-lg-offset-4">
		                          <ul className="nav nav-pills nav-pillss">		                           
								    <li className="col-lg-4 col-md-4col-sm-12 col-xs-12 active transactionTab hidepill">
								    	<a data-toggle="pill" href="#paidReport">
								    		Paid Students
								    	</a>
								    </li>
								   {/* <li className="col-lg-2 col-md-2 col-sm-12 col-xs-12 transactionTab">
								    	<a data-toggle="pill" href="#unPaidReport">
								    		UnPaid
								    	</a>
								    </li>*/}
		                          </ul>
		                        </div>
		                        <div className="MarginTop20 col-lg-12 col-md-12"></div>
		                        <div className="tab-content">
									<div id="paidReport" className="tab-pane fade in active">
									  <ExamWisePaidReport />
									</div>
									<div id="unPaidReport" className="tab-pane fade ">
									  <ExamWiseUnPaidReport />
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