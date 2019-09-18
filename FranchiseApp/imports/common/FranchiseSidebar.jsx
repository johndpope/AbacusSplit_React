import React,{Component} from 'react';
import {Link} from 'react-router';
// import {browserHistory} from 'react-router';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import { FlowRouter }       from 'meteor/ostrio:flow-router-extra';
import {withTracker}        from 'meteor/react-meteor-data';

export default class FranchiseSidebar extends Component{
  constructor() {
   super();
    this.state = {
      subscription :{
        "userData" : Meteor.subscribe("userData",Meteor.userId()), 
      }
    }
  }

  removePersistantSessions(){
      UserSession.delete("progressbarSession", Meteor.userId());
      UserSession.delete("allProgressbarSession", Meteor.userId());
  }

 componentDidMount(){
  if ( !$('body').hasClass('adminLte')) {
    var adminLte = document.createElement("script");
    adminLte.type="text/javascript";
    adminLte.src = "/js/adminLte.js";
    $("body").append(adminLte);
  }
}

componentWillUnmount(){
  $("script[src='/js/adminLte.js']").remove();
  $("link[href='/css/dashboard.css']").remove();
}
 

  render(){
    return(

        <aside className="main-sidebar" onClick={this.removePersistantSessions.bind(this)}>
          {/* sidebar: style can be found in sidebar.less */}
          <section className="sidebar">
            {/* Sidebar user panel */}
            <div className="user-panel">
              <div className="pull-left image">
                {/*<img src={this.currentUser()} className="img-circle" />*/}
                <p></p>
              </div>
              <div className="pull-left info">
                {/*<p> {this.currentUser()}</p>*/}
                <p></p>
                {/*<a to="javascript:void(0)"><i className="fa fa-circle text-success" /> Online</a>*/}
              </div>
            </div>
            <ul className="sidebar-menu" data-widget="tree">
              <li className="">
                <a href="/franchiseDashboard" activeClassName="active">
                  <i className="fa fa-dashboard" />
                    <span>Dashboard</span>
                </a>
              </li>
                <li className="treeview">
                  <a href="javascript:void(0)">
                    <i className="fa fa-graduation-cap" aria-hidden="true"/>
                    <span>Franchise Management</span>
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right" />
                    </span>
                  </a>
                 <ul className="treeview-menu">
                    {/*<li>
                      <a href="/franchise/addStudentByFranchise">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Add Student
                      </a>
                    </li>*/}
                    <li>
                      <a href="/franchise/addStudentByFranchise">
                        <i className="fa fa-circle-o" aria-hidden="true"/> Add Student
                      </a>
                    </li>
                    <li className="">
                      <a href="/franchise/CreateUsers">
                        <i className="fa fa-circle-o" /> Add New Staff
                      </a>
                    </li>

                    <li className="">
                      <a href="/franchise/UMListofStaff_Student">
                        <i className="fa fa-circle-o" /> List of Users
                      </a>
                    </li>
                   {/* <li>
                      <a href="/franchise/listOfStudentsbyfranchise">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> List Of Student
                      </a>
                    </li>*/}
                  </ul>
                </li>
             <li className="treeview">
                  <a href="javascript:void(0)">
                    <i className="fa fa-book" aria-hidden="true"/>
                    <span>Package List</span>
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right" />
                    </span>
                  </a>
                 <ul className="treeview-menu">
                   {/* <li>
                      <a href="/franchise/FranchiseDetails">
                        <i className="fa fa-university" aria-hidden="true"/> Add Franchise Details
                      </a>
                    </li>*/}
                    <li>
                      <a href="/franchise/PackageList">
                        <i className="fa fa-book" aria-hidden="true"/> Package List
                      </a>
                    </li>
                  </ul>
                </li>
             <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-user" />
                  <span> Reports</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/franchise/Reports">
                      <i className="fa fa-circle-o" /> Student Registration 
                    </a>
                  </li>
                  <li>
                    <a href="/franchise/PracticeTestTaken">
                      <i className="fa fa-circle-o" /> Practice Test Taken
                    </a>
                  </li>
                  {/*<li>
                    <a href="/franchise/studentPayment">
                      <i className="fa fa-circle-o" /> Student Wise Payment Details
                    </a>
<<<<<<< Updated upstream
                  </li>*/}

                   <li className="">
                    <a href="/franchise/StudentWiseFinalExamTaken-Reports">
                      <i className="fa fa-circle-o" /> Competition wise Result
                    </a>
                  </li>

                  {/* <li className="">
                    <a href="/competitionView">
                      <i className="fa fa-circle-o" /> Competition Result View
                    </a>
                  </li>*/}
                  {/*<li className="">
                    <a href="/franchise/ListOfPaidStudents">

                      <i className="fa fa-circle-o" /> Student Wise Payment Report

                    </a>
                  </li>*/}
                  <li className="">
                    <a href="/Franchise/FranchiseCompetitionPaymentSummary">
                      <i className="fa fa-circle-o" /> Competitions pay  Summary
                    </a>
                  </li>

                  {/*// ===============================================================*/}
                </ul>
              </li>          
               <li className="treeview">
                  <a href="javascript:void(0)">
                    <i className="fa fa-university" aria-hidden="true"/>
                    <span>Franchise Settings</span>
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right" />
                    </span>
                  </a>
                 <ul className="treeview-menu">
                   {/* <li>
                      <a href="/franchise/FranchiseDetails">
                        <i className="fa fa-university" aria-hidden="true"/> Add Franchise Details
                      </a>
                    </li>*/}
                  {/*  <li>
                      <a href="/franchise/companyinfo">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Franchise Details
                      </a>
                    </li>*/}
                     <li>
                      <a href={"/franchise/profile/"+Meteor.userId()}>
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Franchise Details
                      </a>
                    </li>
                  </ul>
                </li>

            

                {/* <li className="treeview">
                  <a href="javascript:void(0)">
                    <i className="fa fa-graduation-cap" aria-hidden="true"/>
                    <span>Staff Management</span>
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right" />
                    </span>
                  </a>
                 <ul className="treeview-menu">
                    
                    
                  
                 <li className="">
                    <a href="/franchise/UMListOfStaff">
                      <i className="fa fa-circle-o" /> List of Staff
                    </a>
                  </li>
                  </ul>
                </li>*/}

                
                    
            </ul>
          </section>
          {/* /.sidebar */}
        </aside>
    );
  }
}
