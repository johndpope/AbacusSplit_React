import React,{Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import {withTracker}        from 'meteor/react-meteor-data';

export default class Sidebar extends TrackerReact(Component){
 constructor(props) {
   super(props);
    this.state = {
      loginuserRole : '',
      subscription :{
        "userData" : Meteor.subscribe("userData",Meteor.userId()), 
      }
    }

  }

  componentWillMount(){

  }
   componentDidMount(){
    Meteor.call("LoginUserRole",Meteor.userId(),(err,res)=>{
      if(err){
        console.log(err);
      }else{
        if(res[0]=="admin"){
          this.setState({
            loginuserRole : res[1]
          },()=>{this.getadminLTE()});
        }
      }
    });
  }

  getadminLTE(){
      if ($('body').hasClass('adminLte')) {
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

  removePersistantSessions(){
      UserSession.delete("progressbarSession", Meteor.userId());
      UserSession.delete("allProgressbarSession", Meteor.userId());
  }

  currentUser(){
    var LoginUserData = Meteor.users.findOne({"_id":Meteor.userId()});
    if(LoginUserData){
      var profile = LoginUserData.profile;
      if(profile){
        var firstName = profile.firstname;
      }
      return firstName;
    }

  }

  render(){
    if(this.state.loginuserRole=="superAdmin" || this.state.loginuserRole=="Admin" || this.state.loginuserRole=="admin"){
    return(
        
        <aside className="main-sidebar" onClick={this.removePersistantSessions.bind(this)}>
          <section className="sidebar">
            {/*<div className="user-panel">
              <div className="pull-left image">
                <p></p>
              </div>
              <div className="pull-left info">
                <p></p>
                
              </div>
            </div>*/}
            
            <ul className="sidebar-menu" data-widget="tree">
              <li className="">
                <a href="/adminDashboard" activeClassName="active">
                  <i className="fa fa-dashboard" />
                    <span>Dashboard</span>
                </a>
              </li>
              <li className="treeview">
                <a href="JavaScript:void(0);">
                  <i className="fa fa-user" />
                  <span>Master Data</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="">
                    <a href="/AddCategories">
                      <i className="fa fa-circle-o" /> Add Categories
                    </a>
                  </li>
                 <li className="">
                    <a href="/AddQuestions">
                      <i className="fa fa-circle-o" /> Add Questions
                    </a>
                  </li>
                  <li className="">
                    <a href="/UploadQuestions">
                      <i className="fa fa-circle-o" /> Upload Questions
                    </a>
                  </li> 
                  <li className="">
                    <a href="/QuestionCategoryTabs">
                      <i className="fa fa-circle-o" /> Category wise Questions
                    </a>
                  </li>
                  <li className="">
                    <a href="/Admin/AddInstructions">
                      <i className="fa fa-circle-o" /> Add Instructions
                    </a>
                  </li>
                </ul>
              </li>
             
             <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-question" />
                  <span> Set Question Paper</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="">
                    <a href="/Admin/CreateQuestionPapers">
                      <i className="fa fa-circle-o" /> Create Question Paper
                    </a>
                  </li>
                  <li className="">
                    <a href="/Admin/practiceQuestionPapers">
                      <i className="fa fa-circle-o" /> Practice Question Papers
                    </a>
                  </li>
                  <li className="">
                    <a href="/Admin/FinalQuestionPapers">
                      <i className="fa fa-circle-o" /> Main Question Papers
                    </a>
                  </li>
                </ul>
              </li>

               <li className="treeview">
                  <a href="javascript:void(0)">
                    <i className="fa fa-university" aria-hidden="true"/>
                    <span>Company Settings</span>
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
                      <a href="/admin/companyinfo">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Company Details
                      </a>
                    </li>
                  </ul>
                </li>

                 <li className="treeview">
                  <a href="javascript:void(0)">
                    <i className="fa fa-bell" aria-hidden="true"/>
                    <span>Notification</span>
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
                      <a href="/admin/notifiaction">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Notification Management
                      </a>
                    </li>
                    <li>
                      <a href="/admin/notificationList">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Notification List
                      </a>
                    </li>
                    <li>
                      <a href="/admin/siteShutdownTime">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Service Downtime
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="treeview">
                  <a href="javascript:void(0)">
                    <i className="fa fa-comments" aria-hidden="true"/>
                    <span>SMS Management</span>
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right" />
                    </span>
                  </a>
                 <ul className="treeview-menu">
                  
                    <li>
                      <a href="/Admin/SendSMS">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Send SMS
                      </a>
                    </li>
                    <li>
                      <a href="/Admin/sentSMSReport">
                        <i className="fa fa-graduation-cap" aria-hidden="true"/> Sent SMS Report
                      </a>
                    </li>
                   
                  </ul>
                </li>




               <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-book" />
                  <span> Competition Master </span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="">
                    <a href="/Admin/CreateExams">
                      <i className="fa fa-circle-o" /> Create Competition
                    </a>
                  </li>
                  <li className="">
                    <a href="/Admin/ListofExams">
                      <i className="fa fa-circle-o" /> Manage Competitions
                    </a>
                  </li>
                 
                </ul>
              </li>             
              {/*<li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-user" />
                  <span> Student Area</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                 
                  <li className="sidebarlist">
                    <a href="/Admin/ListOfStudents">
                      <i className="fa fa-circle-o" /> Payment Status
                    </a>
                  </li>
                 <li className="sidebarlist">
                    <a href="/Admin/FranchiseWiseStudents">
                      <i className="fa fa-circle-o" /> Franchise / Teacher Wise 
                    </a>
                  </li>
                </ul>
              </li> */}
             <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-file-text" />
                  <span> Reports</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                
                  <li className="">
                    <a href="/Admin/Reports">
                      <i className="fa fa-circle-o" /> Registration Reports
                    </a>
                  </li>
                {/* <li className="">
                    <a href="/Admin/Category-Reports">
                      <i className="fa fa-circle-o" /> Category wise Reports
                    </a>
                  </li>*/}
                  <li className="">
                    <a href="/Admin/StudentWiseTestTaken-Reports">
                      <i className="fa fa-circle-o" /> Competition wise Result
                    </a>
                  </li>

                  {/*<li className="">
                    <a href="/Admin/CompetitionWiseStudentPhotoVerify-Report">
                      <i className="fa fa-circle-o" /> Competition wise Photo Verification
                    </a>
                  </li>*/}

                   <li className="">
                    <a href="/Admin/franchisewiseCompetitionResult-Reports">
                      <i className="fa fa-circle-o" /> Franchise wise Result
                    </a>
                  </li>
                  <li className="">
                    <a href="/Admin/competitionWisePaymentSummary">
                      <i className="fa fa-circle-o" /> Competitions pay  Summary
                    </a>
                  </li>
                   <li>

               {/*     <a href="/franchise/studentWiseTestTaken-reports">
                      <i className="fa fa-circle-o" /> Student Registration 
                    </a>
*/}                  </li>

                    
                  <li>
                    <a href="/admin/PracticeTestTaken">
                      <i className="fa fa-circle-o" /> Practice Test Taken
                    </a>
                  </li>
                  {/*<li>
                    <a href="/admin/studentPayment">
                      <i className="fa fa-circle-o" /> Student Wise Payment Details
                    </a>
                  </li>*/}
                  {/*<li>
                    <a href="/admin/FinalTestTaken">
                      <i className="fa fa-circle-o" /> Student Exams
                    </a>
                  </li>*/}

                </ul>
              </li>           
 
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-archive" />
                  <span> Package Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li className="">
                    <a href="/Admin/CreatePackages">
                      <i className="fa fa-circle-o" /> Create Package
                    </a>
                  </li>
                  <li className="">
                    <a href="/Admin/UMListOfPackages">
                      <i className="fa fa-circle-o" />  List of Packages
                    </a>
                  </li>
                </ul>
              </li>  
              {/*<li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-users" />
                  <span>Franchise Details</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
               <ul className="treeview-menu">
                  <li>
                    <a href="/Admin/CreateUsers">
                      <i className="fa fa-circle-o" /> Add Franchise 
                    </a>
                  </li>
                </ul>
              </li>

              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-users" />
                  <span>Franchise Student Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
               <ul className="treeview-menu">
                  <li>
                    <a href="/admin/addStudentByFranchise">
                      <i className="fa fa-circle-o" /> Add Student By Franchise
                    </a>
                  </li>
                </ul>
              </li>  */}       
              
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-users" />
                  <span>User Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                 {/* <li className="">
                    <a href="/Admin/CreateAdmin">
                      <i className="fa fa-circle-o" /> Add New Admin
                    </a>
                  </li>*/}

                  <li className="">
                    <a href="/Admin/CreateUsers">
                      <i className="fa fa-circle-o" /> Add New User
                    </a>
                  </li>
                  
                 <li className="">
                    <a href="/Admin/UMListOfUsers">
                      <i className="fa fa-circle-o" /> List of Users
                    </a>
                  </li>

                  {/* <li className="">
                    <a href="/Admin/SAListOfUsers">
                      <i className="fa fa-circle-o" /> SuperAdmin List of Users
                    </a>
                  </li> */}
                  
                  
                </ul>
              </li>

              {/*<li>
                  <a href="/Admin/listofFranchise">
                    <i className="fa fa-circle-o" /> List Of Franchise
                  </a>
              </li>*/}

                <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-list-ul" />
                  <span> List of Franchise</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                 {/* <li>
                    <a href="/studentRegistration">
                      <i className="fa fa-circle-o" /> Student Registration
                    </a>
                  </li>*/}
                  
                  <li>
                  <a href="/Admin/listofFranchise">
                    <i className="fa fa-circle-o" /> List of Franchise
                  </a>
              </li>
                </ul>
              </li>
              
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-user" />
                  <span> Create Rank</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                 {/* <li>
                    <a href="/studentRegistration">
                      <i className="fa fa-circle-o" /> Student Registration
                    </a>
                  </li>*/}
                  
                  <li>
                    <a href="/admin/CreateRank">
                      <i className="fa fa-circle-o" /> Create Rank
                    </a>
                  </li>
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-universal-access" />
                  <span>Access Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/addFacilities">
                      <i className="fa fa-circle-o" /> Add Module Facility
                    </a>
                  </li>
                  <li>
                    <a href="/admin/AssignPermissionstoModules/Show%20All">
                      <i className="fa fa-circle-o" /> Assign Permissions 
                    </a>
                  </li>
                </ul>
              </li>

              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-universal-access" />
                  <span>Configuration</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/configuration">
                      <i className="fa fa-circle-o" /> Add Configurations
                    </a>
                  </li>
                  
                </ul>
              </li>

              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-universal-access" />
                  <span>Student Count</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/Admin/StudentCount">
                      <i className="fa fa-circle-o"/> Student Count
                    </a>
                  </li>                  
                </ul>
              </li>

            </ul>
          </section>
        </aside>
    );
  }else{
    return(
      <aside className="main-sidebar" onClick={this.removePersistantSessions.bind(this)}>
        <section className="sidebar">
          <ul className="sidebar-menu" data-widget="tree">
            <li className="">
            </li>
          </ul>
        </section>
      </aside>);
}
}
}

