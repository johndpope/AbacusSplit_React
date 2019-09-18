import React,{Component} from 'react';
import {withTracker} from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';


class StudentSidebar extends Component{
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
            <ul className="sidebar-menu" data-widget="tree">
              <li className="">
                <a href="/student/profile" activeClassName="active">
                  <i className="fa fa-dashboard" />
                    <span>Dashboard</span>
                </a>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-sticky-note-o" />
                  <span> My Exams</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/iAgreeAndStartExam">
                      <i className="fa fa-circle-o" /> Start Main Exam 
                    </a>
                  </li>
                  <li>
                    <a href="/startPracticeExam">
                      <i className="fa fa-circle-o" /> Start Practice Exam 
                    </a>
                  </li>
                  <li>
                    <a href="/pastExamReports">
                      <i className="fa fa-circle-o" /> Main Exam Reports 
                    </a>
                  </li>
                  <li>
                    <a href="/PracticeExamReports">
                      <i className="fa fa-circle-o" /> Practice Exam Reports 
                    </a>
                  </li>
                </ul>
              </li>
              <li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-user" />
                  <span> My Account</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href={`/myChnagePassword/${Meteor.userId()}`}>
                      <i className="fa fa-circle-o" />  Change Password 
                    </a>
                  </li>
                  <li className="regFormHide">

                    {/*<a href="/studentRegistration" >
                      <i className="fa fa-circle-o" />  Registration Form
                    </a>*/}
                  </li>
                  
                  {/*<li>
                    <a href="/myProfile">
                      <i className="fa fa-circle-o" /> My Profile
                    </a>
                  </li>*/}
                </ul>
              </li>          
              {/*<li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-archive" />
                  <span> Packages</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
                <ul className="treeview-menu">
                  <li>
                    <a href="/PackageList">
                      <i className="fa fa-circle-o" />  Package List
                    </a>
                  </li>
                </ul>
              </li>*/ } 
              {/*<li className="treeview">
                <a href="javascript:void(0)">
                  <i className="fa fa-certificate" />
                  <span>Certificate</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right" />
                  </span>
                </a>
               <ul className="treeview-menu">
                  <li>
                  {this.props.examData ?
                    <a href="/Certificate">
                      <i className="fa fa-certificate" /> Certificate 
                    </a>
                    :
                    null
                  }
                  </li>
                  
                  <li>
                    <a href="/ParticipationCertificate">
                      <i className="fa fa-certificate" /> Participation Certificate 
                    </a>
                  </li>
                </ul>
              </li>         */ } 
            </ul>
          </section>
          {/* /.sidebar */}
        </aside>
    );
  }
}

export default StudentSidebar = withTracker(props=>{
  const postHandle   = Meteor.subscribe('showAllStudExams',Meteor.userId());
  const loading      = !postHandle.ready();

  var examData       = MyExamMaster.findOne({$or:[{"rank":"1st"},{"rank":"2nd"},{"rank":"3rd"},{"rank":"Consolation"}]})||{};
  // console.log("examData",examData);
  return{
    examData,
  }
})(StudentSidebar);
