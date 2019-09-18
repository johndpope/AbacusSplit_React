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
import {QuestionMaster} from '/imports/admin/forms/addQuestions/api/questionMaster.js';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
class Content extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      allUserData : [],
      userCount: 0,
    };
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
    // this.allUserDataTracker.stop();
  }
  allUserCount(){
    return this.state.allUserData.length;
  }
  render(){
    return(
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
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
            <h3 className="dashboardSecTit"></h3>
            <div className="row">
              <div className="col-md-4 col-sm-12  col-xs-12">
             
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
                      <Link to="/admin/UMListOfUsers">
                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                      </Link>
                      </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
               
                {/* /.info-box */}
              </div>

              <div className="col-md-4 col-sm-12 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-red">
                    <i className="fa fa-money" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Paid / UnPaid Students
                    </span>
                    <span className="info-box-number">{this.props.paidStudData} / {this.props.unPaidStudData}<small></small></span>
                    
                      <span className="rightArrowSign col-lg-12 col-md-12">
                        <Link to="/admin/listOfStudent">
                          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </Link>
                      </span>
                    
                  </div>
                  {/* /.info-box-content */}
                </div>
              
                {/* /.info-box */}
              </div>

              <div className="col-md-4 col-sm-12 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-green">
                    <i className="fa fa-registered" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Student Registrations
                    </span>
                    <span className="info-box-number">{this.props.TRStudData}<small></small></span>
                   
                      <span className="rightArrowSign col-lg-12 col-md-12">
                         <Link to="/admin/reports">
                          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </Link>
                      </span>
                  </div>
                  {/* /.info-box-content */}
                </div>
                
                {/* /.info-box */}
              </div>

            </div>
            {/* /.row */}
            {/*<h3 className="dashboardSecTit">Abacus Framework</h3>*/}
            <h3 className="dashboardSecTit"></h3>
            <div className="row">
              <div className="col-md-4 col-sm-12 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-aqua">
                    <i className="fa fa-question-circle" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Total Questions 
                    </span>
                    <span className="info-box-number">{this.props.allQCount}<small></small></span>
                    
                      <span className="rightArrowSign col-lg-12 col-md-12">
                        <Link to="/questionCategoryTab">
                         <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                         </Link>
                      </span>
                    
                  </div>
                  {/* /.info-box-content */}
                </div>
                
                {/* /.info-box */}
              </div>

              <div className="col-md-4 col-sm-6 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-red">
                    {/*<i className="fa fa-puzzle-piece" />*/}
                    <img src="/images/Icons/category.png" />

                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Total Categories
                    </span>
                    <span className="info-box-number">{this.props.allCatCount}<small></small></span>
                    
                      <span className="rightArrowSign col-lg-12 col-md-12">
                        <Link to="/addCategory">
                          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </Link>
                      </span>
                    
                  </div>
                  {/* /.info-box-content */}
                </div>
                
                {/* /.info-box */}
              </div>

              <div className="col-md-4 col-sm-6 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-green">
                    <i className="fa fa-question-circle" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Question Papers
                    </span>
                    <span className="info-box-number">{this.props.allQPCount}<small></small></span>
                    
                      <span className="rightArrowSign col-lg-12 col-md-12">
                        <Link to="/admin/finalQuestionPaper">
                          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </Link>
                      </span>
                    
                  </div>
                  {/* /.info-box-content */}
                </div>
              
                {/* /.info-box */}
              </div>
              
              
           </div>
           {/*<h3 className="dashboardSecTit">Abacus Exam</h3>*/}
           <h3 className="dashboardSecTit"></h3>
           <div className="row">
              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
              
                <div className="info-box">
                  <span className="info-box-icon bg-aqua">
                    <img src="/images/Icons/Exam.png" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Total Main Exams
                    </span>
                    <span className="info-box-number">{this.props.allEPCount}<small></small></span>
                    
                      <span className="rightArrowSign col-lg-12 col-md-12">
                        <Link to="/admin/ListofExams">
                        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </Link>
                      </span>
            
                  </div>
                  {/* /.info-box-content */}
                </div>
              
                {/* /.info-box */}
              </div>
              

              <div className="col-md-4 col-sm-12 col-xs-12">
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

              {/*<div className="col-md-4 col-sm-6 col-xs-12">
                <div className="info-box">
                  <span className="info-box-icon bg-green">
                    <img src="/images/Icons/Lowest_score.png" />
                  </span>
                  <div className="info-box-content">
                    <span className="info-box-text">
                      Lowest Score
                    </span>
                    <span className="info-box-number">{this.props.minScore}<small></small></span>
                    
                  </div>
                  
                </div>
                
              </div>*/}

              <div className="col-md-4 col-sm-12 col-xs-12">
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
  //------------ All Questions Count ------------//

  var quesHandleData = Meteor.subscribe("allQuestionCount");
  var loadingQData = !quesHandleData.ready();
  var allQCount = Counts.get('allQuestionCount');

  //------------ All Users Count ------------//
  var userHandleData = Meteor.subscribe("usersCount");
  var loadingUerData = !userHandleData.ready();
   var userCount = Counts.get("usersCount");
  //------------ All Paid Student Count ------------//

  var paidHandleData = Meteor.subscribe("allPaidStudCount");
  var loadingPaidData = !paidHandleData.ready();
  var paidStudData = Counts.get("allPaidStudCount");

  //------------ All UnPiad Student Count ------------//

  var UnPaidHandleData = Meteor.subscribe("allUnPaidStudCount");
  var loadingPaidData = !UnPaidHandleData.ready();
  var unPaidStudData = Counts.get("allUnPaidStudCount"); 

  //------------ All Student Registration Count ------------//

  var todaysRegisterHandleData = Meteor.subscribe("todaysStudRegistraion");
  var loadingPaidData = !paidHandleData.ready();
  var TRStudData = Counts.get("todaysStudRegistraion"); 
  
  //------------ All Category Count ------------//

  var catHandleData = Meteor.subscribe("allCategory");
  var loadingCatData = !catHandleData.ready();
  var allCatCount = CategoryMaster.find({}).count();

  //------------ All Question Paper Count ------------//

  var QPHandleData = Meteor.subscribe("allQuestionPaperCount");
  var loadingQPData = !QPHandleData.ready();
  var allQPCount = Counts.get("allQuestionPaperCount");

  //------------ All Main Exam Count ------------//

  var EMHandleData = Meteor.subscribe("allExamCount");
  var loadingEmData = !EMHandleData.ready();
  var allEPCount = Counts.get("allExamCount");

  var MyExHandleData = Meteor.subscribe("showAllAnswer");
  var loadingEmData = !MyExHandleData.ready();

  var myExamMasterData  = MyExamMaster.find({}).fetch();
  if(myExamMasterData.length>0){
    var maxScore = Math.max.apply(Math,myExamMasterData.map(maxScore => maxScore.totalScore));         //max score from exam
    var minScore = Math.min.apply(Math,myExamMasterData.map(minScore => minScore.totalScore));        // min score from exam
    var avgSum = myExamMasterData.reduce((arrObjSum, arrObj) => arrObjSum + arrObj.totalScore,0)/myExamMasterData.length; //average score from exam
    var avgSum = avgSum.toFixed(2);
   
  }else{
   maxScore = 0;
   minScore = 0;
   avgSum = 0;
  }


  return {
    userCount,
    paidStudData,
    unPaidStudData,
    TRStudData,
    allQCount,
    allCatCount,
    allQPCount,
    allEPCount,
    maxScore,
    minScore,
    avgSum,
  }
})(Content);
