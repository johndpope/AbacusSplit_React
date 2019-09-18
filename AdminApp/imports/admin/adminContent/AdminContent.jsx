import React,{Component} from 'react';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import {Meteor } from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import {withTracker} from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import {Mongo} from 'meteor/mongo';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';

// import MonthlyStudentRegistrationGraph from '/imports/admin/adminContent/MonthlyStudentRegistrationGraph.jsx';
// import CompetitionwiseRegistrationsGraph from '/imports/admin/adminContent/CompetitionwiseRegistrationsGraph.jsx';
// import PackagewiseSaleGraph from '/imports/admin/adminContent/PackagewiseSaleGraph.jsx';

import Chart from 'chart.js';

class AdminContent extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      allUserData : [],
      monthwiseRegistration :[],
      CompetitionwiseReg : [],
      allPackages: [],
      PackagesPurchaseCnt: [],
      latestTweentyReg:[],
      userCount: 0,
    };
  }

  componentWillMount(){
    $('.sidebar').css({display:'block',background: '#222d32'});
    Meteor.call("getMonthWiseRegistrationCount",(err,res)=>{
      if(err){}else{
        this.setState({
          monthwiseRegistration: res,
        });
      }
    }); 
    
    Meteor.call("getCompetitionwiseRegistrationCnt",(err,res)=>{
      if(err){}else{
        this.setState({
          CompetitionwiseReg: res,
        });
      }
    });

    Meteor.call("allPackages",(err,res)=>{
      if(err){}else{
        this.setState({
          allPackages: res,
        });
      }
    });

    Meteor.call("packagePurchageCnt",(err,res)=>{
      if(err){}else{
        this.setState({
          PackagesPurchaseCnt: res,
        });
      }
    });

    Meteor.call("getLatestTweentyRegistration",(err,res)=>{
      if(err){}else{
        this.setState({
          latestTweentyReg: res,
        });
      }
    });

  }

  componentDidMount() {
    if ( !$('body').hasClass('adminLte')) {
      // console.log("adminLte.js appended!");
      var adminLte = document.createElement("script");
      adminLte.type = "text/javascript";
      adminLte.src = "/js/adminLte.js";
      adminLte.setAttribute('id','adminLte');
      $("body").append(adminLte);
    }
  }

  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
    console.log('wow');
  }

  allUserCount(){
    return this.state.allUserData.length;
  }

  componentDidUpdate(){
      var ctx = document.getElementById("myChart").getContext('2d');
      var myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "June","July","Aug","Sept","Oct","Nov","Dec"],
              datasets: [{
                  label: 'Number of Registrations',
                  data: this.state.monthwiseRegistration,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });

      var competitionRegChart = document.getElementById("competitionRegChart").getContext('2d');
      var myChart = new Chart(competitionRegChart, {
          type: 'bar',
          data: {
              // labels: this.state.CompetitionwiseReg.map(function(label,index){return label.competitionName.substring(0,5)}),
              labels: this.state.CompetitionwiseReg.map(function(label,index){return (label.competitionName).substring(0,7)+"..."}),
              // labels: this.state.CompetitionwiseReg.map(function(label,index){return (label.competitionName).split(/\s+/).slice(0,2).join(" ")+"..."}),
              datasets: [{
                  label: 'Competition registrations',
                  data: this.state.CompetitionwiseReg.map(function(compCnt,index){return compCnt.competitionRegCnt}),
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });

      var packagePurchageChart = document.getElementById("packagePurchageChart").getContext('2d');
      var myChart = new Chart(packagePurchageChart, {
          type: 'bar',
          data: {
              labels: this.state.allPackages.map(function(label,index){return (label).substring(0,5)+"..."}),
              // labels: this.state.allPackages,
                 

              datasets: [{
                  label: 'All Packages',
                  data: this.state.PackagesPurchaseCnt,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              }
          }
      });
  }
  render(){


    return(
      <div>
        <div className="content-wrapper">
          <section className="content-header">
            <h1>Dashboard
            </h1>
            <ol className="breadcrumb">
              
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            {/* Info boxes */}
            {/*<h3 className="dashboardSecTit">User Section</h3>*/}
            {/*<h3 className="dashboardSecTit"></h3>*/}
            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
             
                <div className="info-box">
                  <span className="info-box-icon bg-aqua">
                    <i className="fa fa-users" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Total Users
                    </span>
                    <span className="info-box-number">{this.props.userCount}<small></small></span>
                      <span className="rightArrowSign col-lg-12 col-md-12">
                      <a href="/Admin/UMListOfUsers">
                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                      </a>
                      </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
               
                {/* /.info-box */}
              </div>
              <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-red">
                    <i className="fa fa-question-circle" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Question Papers
                    </span>
                    <span className="info-box-number">{this.props.allQPCount}<small></small></span>
                    
                      <span className="rightArrowSign col-lg-12 col-md-12">
                        <a href="/Admin/FinalQuestionPapers">
                          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </a>
                      </span>
                    
                  </div>
                  {/* /.info-box-content */}
                </div>
              
                {/* /.info-box */}
              </div>

              <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-green">
                    <i className="fa fa-archive"></i>
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      total Packages
                    </span>
                    <span className="info-box-number">{this.props.allPackagesCount}<small></small></span>
                    
                      <span className="rightArrowSign col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <a href="/Admin/UMListOfPackages">
                          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </a>
                      </span>
                    
                  </div>
                  {/* /.info-box-content */}
                </div>
              
                {/* /.info-box */}
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
             
                <div className="info-box">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS">
                      Total Students  
                    </span>
                    <span className="subBoxTitleOS"> : {this.props.allstudentCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGreen">
                      Online Students 
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGreen"> : {this.props.onlineStudentCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGray">
                      Offline Students  
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {parseInt(this.props.allstudentCount)-parseInt(this.props.onlineStudentCount)}</span>
                  </div>
                  {/* /.info-box-content */}
                </div>
               
                {/* /.info-box */}
              </div>

              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
             
                <div className="info-box">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS">
                      Total Franchises  
                    </span>
                    <span className="subBoxTitleOS"> : {this.props.allFranchiseCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGreen">
                      Online Franchises
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGreen"> : {this.props.onlineFranchiseCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGray">
                      Offline Franchises  
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {parseInt(this.props.allFranchiseCount)-parseInt(this.props.onlineFranchiseCount)}</span>
                  </div>
                  {/* /.info-box-content */}
                </div>
               
                {/* /.info-box */}
              </div>

             {/* <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
             
                <div className="info-box">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS">
                      Total Staff
                    </span>
                    <span className="subBoxTitleOS"> : {this.props.allStaffCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGreen">
                      Online Staff 
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGreen"> : {this.props.onlineStaffCount}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-8 col-md-8 col-sm-8 boxTitleOS boxTitleOSGray">
                      Offline Staff  
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {parseInt(this.props.allStaffCount)-parseInt(this.props.onlineStaffCount)}</span>
                  </div>
                </div>
              </div>*/}

              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
             
                <div className="info-box">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    {/*<span className="col-lg-5 col-md-5 col-sm-5 boxTitleOS">
                      Competition
                    </span>*/}
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <i className="fa fa-trophy compTrofy"></i>
                      <span className="subBoxTitleOSs">{this.props.startCompetitionData._id ? <span><label className="greenCol"  title="This competition is started"></label> <span className="startCompNm">{this.props.startCompetitionData.competitionName}</span></span> : <span>Currently no competition is running</span>}</span>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12 comStartText">
                    <span className="col-lg-9 col-md-9 col-sm-9 boxTitleOS boxTitleOSGray">
                      Total StudentS   
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {this.props.CompStudentCnt}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-">
                    <span className="col-lg-9 col-md-9 col-sm-9 boxTitleOS boxTitleOSGreen">
                      Appearing Students 
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGreen"> : {this.props.appearingStudent}</span>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-sx-12">
                    <span className="col-lg-9 col-md-9 col-sm-9 boxTitleOS boxTitleOSGray">
                      Attempted Students   
                    </span>
                    <span className="subBoxTitleOS boxTitleOSGray"> : {parseInt(this.props.attemptedStudent)}</span>
                  </div>
                  {/* /.info-box-content */}
                </div>
               
                {/* /.info-box */}
              </div>

            </div>

            <div className="row">
              
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 graphWrapper">
              <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                <h4>Monthly Student Registration</h4>
                <canvas id="myChart" width="400" height="170"></canvas>
              </div>
              </div>

              <div className="col-lg-6 col-md-6 boxWrapDashboard graphWrapperTab">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap innerGraphWraptbl">
                  <h4 >Latest 20 Registrations</h4>
                  <table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
                  <thead>
                    <tr className="tableHeader tableHeader20">
                      <th> Student Name </th>
                      <th> Franchise Name </th>
                      <th> Catg/Sub-Catg </th>
                      <th> Competition  </th>
                      <th> Pay Date </th>
                    </tr>
                  </thead>
                  {this.state.latestTweentyReg.length>0 ?
                  <tbody className="myTableData tableHeader20">
                   {this.state.latestTweentyReg.map((latestReg, index)=>{
                    return <tr key={index}>
                          <td>{latestReg.studentFullName}</td>
                          <td>{latestReg.franchiseName}</td>
                          <td>{latestReg.category}/{latestReg.subCategory}</td>
                          <td>{latestReg.competitionName}</td>
                          <td>{moment(latestReg.paymentDate).format("DD/MM/YYYY")}</td>
                        </tr>
                  })}
                  </tbody>
                  :
                  <tbody>
                    <tr>
                      <td colSpan="5" className="tableNoData">Nothing to display.</td>
                    </tr>
                 </tbody>
                }
                </table>
              </div>
            </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardDivider"></div>
            <div className="row">
              
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                <h4>Competition wise Registrations</h4>
                <canvas id="competitionRegChart" width="400" height="170"></canvas>
                </div>
              </div>
              
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 boxWrapDashboardPack graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                  <div className="pckgBarChart">
                    <h4>Package wise Sale</h4>
                    <canvas id="packagePurchageChart" width="400" height="170"></canvas>
                  </div>
               </div>
              </div>
            </div>
            {/* /.row */}
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}

export default ContentContainer = withTracker(props=>{
  // Meteor.logout();
//------------------ all login student count --------------------//
  var onlineStudentHandle = Meteor.subscribe('onlineStudentStatus');
  var onlineSLoading      = !onlineStudentHandle.ready();
  var onlineStudentCount  = Counts.get("onlineStudentStatus");
  // console.log("onlineStudentCount",onlineStudentCount);

//------------------ all student count --------------------//
  var allStudentHandle = Meteor.subscribe('allStudentCount');
  var allSLoading      = !allStudentHandle.ready();
  var allstudentCount  = Counts.get("allStudentCount");
  // console.log("allstudentCount",allstudentCount);
  // console.log("allstudentCount",allstudentCount);

  //------------------ all login Franchise count --------------------//
  var onlineFranchiseHandle = Meteor.subscribe('onlineFranchiseStatus');
  var onlineFLoading        = !onlineFranchiseHandle.ready();
  var onlineFranchiseCount  = Counts.get("onlineFranchiseStatus");
  // console.log("onlineFranchiseCount",onlineFranchiseCount);

//------------------ all Staff count --------------------//
  var allStaffHandle  = Meteor.subscribe('allStaffCount');
  var allSTLoading    = !allStaffHandle.ready();
  var allStaffCount   = Counts.get("allStaffCount");
  // console.log("allStaffCount",allStaffCount);

   //------------------ all login Staff count --------------------//
  var onlineStaffHandle = Meteor.subscribe('onlineStaffStatus');
  var onlineSTLoading1  = !onlineStaffHandle.ready();
  var onlineStaffCount  = Counts.get("onlineStaffStatus");
  // console.log("onlineStaffCount",onlineStaffCount);

//------------------ all Staff count --------------------//
  var allFranchiseHandle = Meteor.subscribe('allFranchiseCount');
  var allSLoading        = !allFranchiseHandle.ready();
  var allFranchiseCount  = Counts.get("allFranchiseCount");
  // console.log("allFranchiseCount",allstudentCount);

  //------------ All Users Count ------------//
  var userHandleData = Meteor.subscribe("usersCount");
  var loadingUerData = !userHandleData.ready();

  // var userCount = Meteor.users.find({}).count();
   var userCount = Counts.get("usersCount");
  //------------ All Question Paper Count ------------//

  var QPHandleData = Meteor.subscribe("allQuestionPaperCount");
  var loadingQPData = !QPHandleData.ready();
  var allQPCount = Counts.get("allQuestionPaperCount");
  //------------ All packages Count ------------//

  var EMHandleData = Meteor.subscribe("allPackagesCount");
  var loadingEmData = !EMHandleData.ready();
  var allPackagesCount = Counts.get("allPackagesCount");
  
  var OCHandleData = Meteor.subscribe("startCompetition");
  var loadingOCData = !OCHandleData.ready();
  var startCompetitionData = ExamMaster.findOne({"competitionStatus" : "start"},{fields:{competitionName:1}})||{};
  if(startCompetitionData){
  //------------start competition, Appearing Students count ------------//

    var ASHandleData = Meteor.subscribe("appearingStuCount",startCompetitionData._id);
    var loadingASData = !ASHandleData.ready();
    var appearingStudent = Counts.get("appearingStuCount");
  
  //------------start competition, Attempted Students count ------------//

    var AASHandleData = Meteor.subscribe("attemptedStuCount",startCompetitionData._id);
    var loadingAASData = !AASHandleData.ready();
    var attemptedStudent = Counts.get("attemptedStuCount");

//------------start competition, Attempted Students count ------------//

    var ASCHandleData = Meteor.subscribe("competitionStudentCnt",startCompetitionData._id);
    var loadingASCData = !ASCHandleData.ready();
    var CompStudentCnt = Counts.get("competitionStudentCnt");

}
  // var compHandle = Meteor.subscribe("latestCompetition");
  // var compLoading = !compHandle.ready();
  // var competitionData = ExamMaster.findOne({},{sort:{"competitionDateFormat":-1}})||{};

   //------------- latest 10 cometition registrations ----------------//

  // var postHandle = Meteor.subscribe("latestTweentyRegistration");
  // var loadingReg = !postHandle.ready();
  // var latestTweentyRegData = CompetitionRegisterOrder.find({"status":"paid"},{sort:{"paymentDate":-1}},{skip:0,limit:20}).fetch();
  // console.log("latestTweentyRegData ---->",latestTweentyRegData);
  //---------------------- get all competition ----------------- //
  // var examHandle = Meteor.subscribe('showAllExam');
  // var examLoading = !examHandle.ready();
  // var allCompetitionData = ExamMaster.find({},{sort:{"createdAt":1}}).fetch(); 
  // if(allCompetitionData){
  //   var allCompetitions = allCompetitionData.map((allComp, index)=>{
  //     return allComp.competitionName;
  //   })
  // } 
  return {
    onlineStaffCount,
    allStaffCount,
    onlineStudentCount,
    allstudentCount,
    onlineFranchiseCount,
    allFranchiseCount,
    userCount,
    allQPCount,
    allPackagesCount,
    startCompetitionData,
    appearingStudent,
    attemptedStudent,
    CompStudentCnt,
    // latestTweentyRegData,
    // allCompetitions
  }
})(AdminContent);
