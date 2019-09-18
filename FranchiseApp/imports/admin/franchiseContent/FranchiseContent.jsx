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
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';
import Chart from 'chart.js';

class FranchiseContent extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      allUserData : [],
      monthwiseRegistration :[],
      CompetitionwiseReg: [],
      latestTweentyReg :[],
      userCount: 0,
    };
  }

  componentWillMount(){
      $('.sidebar').css({display:'block',background: '#222d32'});
   }

  componentWillMount(){
    $('.sidebar').css({display:'block',background: '#222d32'});
    Meteor.call("getFranchiseMonthWiseRegistrationCount",(err,res)=>{
      if(err){}else{
        this.setState({
          monthwiseRegistration: res,
        });
      }
    }); 

    Meteor.call("getFranchisewiseCompetitionwiseRegistrationCnt",(err,res)=>{
      if(err){}else{
        this.setState({
          CompetitionwiseReg: res,
        });
      }
    });

  //----- Latest 10 registration -----------------//

    Meteor.call("getLatestTweentyFranchStudRegistration",(err,res)=>{
      if(err){}else{
        // console.log("getLatestTweentyFranchStudRegistration ============>",res);
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
      // console.log("this.props.allCompetitions",this.props.allCompetitions);
      var myChart = new Chart(competitionRegChart, {
          type: 'bar',
          data: {
              labels: this.props.allCompetitions.map(function(label,index){return (label).substring(0,7)+"..."}),
              // labels: this.props.allCompetitions,
              datasets: [{
                  label: 'All Competitions',
                  data: this.state.CompetitionwiseReg,
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
  

  

  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }
  allUserCount(){
    return this.state.allUserData.length;
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
            <div className="col-lg-12 col-md-12 boxWrapDashboard">
            <div className="col-lg-8 col-md-8 col-sm-8 boxWrapDashboard">
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
             
                <div className="info-box">
                  <span className="info-box-icon bg-aqua">
                    <i className="fa fa-users" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Total Users
                    </span>
                    <span className="info-box-number">{this.props.franchiseUsersCount}<small></small></span>
                      <span className="rightArrowSign col-lg-12 col-md-12">
                      <a href="/franchise/UMListofStaff_Student">
                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                      </a>
                      </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
               
                {/* /.info-box */}
              </div>

              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-green">
                    <i className="fa fa-registered" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Student Registrations
                    </span>
                    <span className="info-box-number">{this.props.paidStudData}<small></small></span>
                   
                     {/* <span className="rightArrowSign col-lg-12 col-md-12">
                         <a href="/Admin/Reports">
                          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </a>
                      </span>*/}
                  </div>
                  {/* /.info-box-content */}
                </div>
                
                {/* /.info-box */}
              </div>

              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-red">
                    <img src="/images/Icons/High_score.png" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      highest Score
                    </span>
                    <span className="info-box-number">{this.props.maxScore}<small></small></span>
                  
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>

              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-yellow">
                    <img src="/images/Icons/average-score.png" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Average Score
                    </span>
                    <span className="info-box-number">{this.props.avgSum}<small></small></span>
                    
                  </div>
                  {/* /.info-box-content */}
                </div>
                {/* /.info-box */}
              </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                  <h4>Monthly Student Registration</h4>
                  <canvas id="myChart" width="400" height="270"></canvas>
                </div>
              </div>
            </div>
              <div className="col-lg-8 col-md-8 col-sm-8 franchiseTableWrap">
                <h4 >Latest 10 Registrations</h4>
                <table className="table table-striped  table-hover myTable table-bordered todaysSalesReportForpdf reportTables" id="yearlyStudRegReport">
                <thead>
                  <tr className="tableHeader">
                    <th> Student Name </th>
                    <th> Catg/Sub-Catg </th>
                    <th> Competition  </th>
                    <th> Pay Date </th>
                    
                    <th className="tab-Table"> Status </th>
                    {/*<th> Action </th>*/}
                  </tr>
                </thead>
                {this.state.latestTweentyReg.length >0 ?
                <tbody className="myTableData">
                 {this.state.latestTweentyReg.map((latestReg, index)=>{
                  return <tr key={index}>
                        <td>{latestReg.studentFullName}</td>
                        <td>{latestReg.category}/{latestReg.subCategory}</td>
                        <td>{latestReg.competitionName}</td>
                        <td>{moment(latestReg.paymentDate).format("DD/MM/YYYY")}</td>
                        <td className="tab-Table">{latestReg.status}</td>
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
          
            <div className="col-lg-4 col-md-4">
               <div className="row">
              
              
             <div className="col-lg-12 col-md-12 col-sm-12 dashboardDivider"></div>
              <div className="col-md-12 col-md-12 col-sm-6 col-xs-12 graphWrapper">
                <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
                <h4>Competition wise Registrations</h4>
                <canvas id="competitionRegChart" width="400" height="270"></canvas>
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
  var compHandle = Meteor.subscribe("latestCompetition");
  var compLoading = !compHandle.ready();
  var competitionData = ExamMaster.findOne({},{sort:{"competitionDateFormat":-1}})||{};
  //------------ franchise Users Count ------------//
  var userHandleData = Meteor.subscribe("franchiseUsersCount");
  var loadingUerData = !userHandleData.ready();
   var franchiseUsersCount = Counts.get("franchiseUsersCount");
  //------------ Franchise wise All Paid Student Count ------------//

  var paidHandleData  = Meteor.subscribe("franchiseStudentRegistration");
  var loadingPaidData = !paidHandleData.ready();
  var paidStudData    = Counts.get("franchiseStudentRegistration");

  var postHandleHS = Meteor.subscribe("franchisewiseStudHS",competitionData._id);
  var loadingHS    = !postHandleHS.ready();
  var myExamMasterData  = MyExamMaster.find({"franchise_id":Meteor.userId(),"competitionId" : competitionData._id}).fetch();
  if(myExamMasterData.length>0){
    var maxScore = Math.max.apply(Math,myExamMasterData.map(maxScore => maxScore.totalScore));         //max score from exam
    var minScore = Math.min.apply(Math,myExamMasterData.map(minScore => minScore.totalScore));        // min score from exam
    var avgSum   = myExamMasterData.reduce((arrObjSum, arrObj) => arrObjSum + arrObj.totalScore,0)/myExamMasterData.length; //average score from exam
    var avgSum   = avgSum.toFixed(2);
  }else{
    maxScore = 0;
    minScore = 0;
    avgSum   = 0;
  }
  //---------------------- get all competition ----------------- //
  var examHandle = Meteor.subscribe('showAllExam');
  var examLoading = !examHandle.ready();
  var allCompetitions = ExamMaster.find({},{sort:{"createdAt":1}}).fetch(); 
  if(allCompetitions){
    var allCompetitions = allCompetitions.map((allComp, index)=>{
      return allComp.competitionName;
    })
  } 


  return {
    franchiseUsersCount,
    paidStudData,
    maxScore,
    minScore,
    avgSum,
    allCompetitions

  }
})(FranchiseContent);
