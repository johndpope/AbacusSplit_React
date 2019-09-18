import React,{Component} from 'react';
import { render } from 'react-dom';

export default class Sidebar extends Component{
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
                {/*<a href="javascript:void(0)"><i className="fa fa-circle text-success" /> Online</a>*/}
              </div>
            </div>
            {/* search form
            <form action="javascript:void(0)" method="get" className="sidebar-form">
              <div className="input-group">
                <input type="text" name="q"className="form-control" placeholder="Search..." />
                <span className="input-group-btn">
                  <button type="submit" name="search" id="search-btn" className="btn btn-flat">
                    <i className="fa fa-search" />
                  </button>
                </span>
              </div>
            </form>
             /.search form */}
            {/* sidebar menu: : style can be found in sidebar.less */}
            <ul className="sidebar-menu" data-widget="tree">
              <li className="">
                <a href="/admin/dashboard" activeClassName="active">
                {/*<a href to="/admin/dashboard" className="active">*/}
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
                  <li>
                    <a href="/addCategory">
                      <i className="fa fa-circle-o" /> Add Categories
                    </a>
                  </li>
                  <li>
                    <a href="/addQuestion">
                      <i className="fa fa-circle-o" /> Add Questions
                    </a>
                  </li>
                  <li>
                    <a href="/uploadQuestion">
                      <i className="fa fa-circle-o" /> Upload Questions
                    </a>
                  </li> 
                  <li>
                    <a href="/questionCategoryTab">
                      <i className="fa fa-circle-o" /> Category wise Questions
                    </a>
                  </li>
                  <li>
                    <a href="/admin/instructions">
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
                  <li>
                    <a href="/admin/CreateQuestionPaper">
                      <i className="fa fa-circle-o" /> Create Question Paper
                    </a>
                  </li>
                  <li>
                    <a href="/admin/practiceQuestionPaper">
                      <i className="fa fa-circle-o" /> Practice Question Papers
                    </a>
                  </li>
                  <li>
                    <a href="/admin/finalQuestionPaper">
                      <i className="fa fa-circle-o" /> Main Question Papers
                    </a>
                  </li>
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-book" />
                  <span> Main Exam</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/createExam">
                      <i className="fa fa-circle-o" /> Create Main Exam
                    </a>
                  </li>
                  <li>
                    <a href="/admin/ListofExams">
                      <i className="fa fa-circle-o" /> Assign Main Exam
                    </a>
                  </li>
                  {/*<li>
                    <a href="/iAgreeAndStartExam">
                      <i className="fa fa-circle-o" /> Start Exam 
                    </a>
                  </li>*/}
                </ul>
              </li>             
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-user" />
                  <span> Student Area</span>
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
                    <a href="/admin/listOfStudent">
                      <i className="fa fa-circle-o" /> Payment Status
                    </a>
                  </li>
                  <li>
                    <a href="/admin/franchiseWiseStudents">
                      <i className="fa fa-circle-o" /> Franchise / Teacher Wise 
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
                 {/* <li>
                    <a href="/studentRegistration">
                      <i className="fa fa-circle-o" /> Student Registration
                    </a>
                  </li>*/}
                  
                  {/*<li>
                    <a href="/admin/reports">
                      <i className="fa fa-circle-o" /> Registration Reports
                    </a>
                  </li>*/}
                  <li>
                    <a href="/admin/category-reports">
                      <i className="fa fa-circle-o" /> Category wise Reports
                    </a>
                  </li>
                  <li>
                    <a href="/admin/studentWiseTestTaken-reports">
                      <i className="fa fa-circle-o" /> Student wise Test Taken
                    </a>
                  </li>
                </ul>
              </li>           

              {/*<li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-archive" />
                  <span> Package Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/CreatePackage">
                      <i className="fa fa-circle-o" /> Create Package
                    </a>
                  </li>
                  <li>
                    <a href="/admin/UMListOfPackage">
                      <i className="fa fa-circle-o" />  List Of Packages
                    </a>
                  </li>
                </ul>
              </li>          */ }
              {/*<li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-bell" />
                  <span> Notifications</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/CreateTemplate">
                      <i className="fa fa-circle-o" /> Create New Template
                    </a>
                  </li>
                  <li>
                    <a href="/admin/ViewTemplates">
                      <i className="fa fa-circle-o" /> View All Templates
                    </a>
                  </li>
                </ul>
              </li> */}
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-users" />
                  <span>User Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/admin/createUser">
                      <i className="fa fa-circle-o" /> Add New User
                    </a>
                  </li>
                  {/*<li>
                    <a href="/admin/UMRolesList">
                      <i className="fa fa-circle-o" /> Add Role
                    </a>
                  </li>*/}
                  <li>
                    <a href="/admin/UMListOfUsers">
                      <i className="fa fa-circle-o" /> List of Users
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
                <Link to="javascript:void(0)">
                  <i className="fa fa-universal-access" />
                  <span>Access Management</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </Link>
                <ul className="treeview-menu">
                  <li>
                    <Link to="/admin/addFacilities/id">
                      <i className="fa fa-circle-o" /> Add Module Facility
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/AssignPermissionstoModules">
                      <i className="fa fa-circle-o" /> Assign Permissions 
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </section>
          {/* /.sidebar */}
        </aside>
    );
  }
}
