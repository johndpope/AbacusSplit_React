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
import Chart from 'chart.js';

export default class CompetitionwiseRegistrationsGraph extends TrackerReact(Component){
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
    
    
    Meteor.call("getCompetitionwiseRegistrationCnt",(err,res)=>{
      if(err){}else{
        console.log("res --------> ",res);
        this.setState({
          CompetitionwiseReg: res,
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

      var competitionRegChart = document.getElementById("competitionRegChart").getContext('2d');
      var myChart = new Chart(competitionRegChart, {
          type: 'bar',
          data: {
              // labels: this.state.CompetitionwiseReg.map(function(label,index){return label.competitionName.substring(0,5)}),
              labels: this.state.CompetitionwiseReg.map(function(label,index){return label.competitionName}),
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
  }
  render(){


    return(
      <div> 
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 graphWrapper">
          <div className="col-lg-12 col-md-12 col-sm-12 innerGraphWrap">
          <h4>Competition wise Registrations</h4>
          <canvas id="competitionRegChart" width="400" height="170"></canvas>
          </div>
        </div>               
      </div>
    );
  }
}

