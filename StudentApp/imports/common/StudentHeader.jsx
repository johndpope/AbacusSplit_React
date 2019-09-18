import React,{Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import {StudentMaster} from '/imports/student/api/studentMaster.js';
// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import SystemWarning    from '/imports/common/SystemWarning.jsx';
import { withTracker } from 'meteor/react-meteor-data';



 class Header extends TrackerReact(Component){
  constructor(props) {
   super(props);
    this.state = {
      subscription :{
        "userData" : Meteor.subscribe("userData",Meteor.userId()), 
        "studentData" : Meteor.subscribe("singleStudent",Meteor.userId()), 
      }
    }
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

  
  handleClick(e) {
      e.preventDefault();
       Meteor.call("updateStudentNotificationStatus",(err,res)=>{
          if(err){
          }else{
            
          }
        });
      Meteor.logout();
       FlowRouter.go('/');
 }

 currentUser(){
    var studentInfo= StudentMaster.findOne({"studentId":Meteor.userId()});
    
    if(studentInfo && studentInfo._id){
      return studentInfo.studentFirstName
    }else{
      var LoginUserData = Meteor.users.findOne({"_id":Meteor.userId()});
        if(LoginUserData){
          var profile = LoginUserData.profile;
          if(profile){
            var firstName = profile.firstname;
            if(firstName){
              return firstName;
            }else{
              return 'Student';
            }
          }
        
      }
    }

    }

  studentLogin(){
    if(Roles.userIsInRole(Meteor.userId(), ['Student'])) {
        return 
    }else{
      return 
              {/*<li>
                <a href="/admin/company-info" data-toggle="control-sidebar">
                  <i className="fa fa-gears" />
                </a>
              </li>*/}
    }
  }

  studentLoginPhoto(){
      var userData = Meteor.users.findOne({"_id":Meteor.userId()});
      if(userData){
        var profileData = userData.profile;
        if(profileData){
          if(profileData.userProfile){
            return profileData.userProfile;
          }else{
            return '/images/user.png';
          }
        }
      } else{
        return '/images/user.png';
      }
  }

  getUploadImgPercentagee(){
    var uploadProgressPercent = Session.get("imageprogresss");
    // console.log('uploadProgressPercent :',uploadProgressPercent);
    if(uploadProgressPercent){
        var percentVal = parseInt(uploadProgressPercent);
        if(percentVal){
            
            var styleC = {
                display:"inline-block",
            }
            var styleCBar = {
                display:"inline-block",
            }
        }
        if(!percentVal){
            var percentVal = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
            }
            var styleCBar = {
                display:"none",
            }
            
        }
        if(percentVal == 100){
            var percentVal = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
                height:"8px",
            }
            var styleCBar = {
                display:"none",
                marginTop:117,
                height:"8px",
            }
           
        }
  
        return (
          
                <span style={styleCBar}>
                  <img src='/images/loading.gif' className="img-circle progressDashboard" style= {styleC}/>  
                </span>  
        );
      }
  }

  myProfile(){
    if(Roles.userIsInRole(Meteor.userId(), ['Student'])){
      return <a href="/studentRegistration" className="btn btn-default btn-flat">My Registration</a>
    }else{
      {/*<a href={`/admin/editProfile/${Meteor.userId()}`} className="btn btn-default btn-flat">My Profile</a>*/}
      return '';
    }
  }

  

  uploadStudentImage(event){
      event.preventDefault();
      let self = this;
      if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];

        if (file) {
          addStudentImgsToS3Function(file,self);
        }
      }
    }

  render(){
    return(
    <div>
      <header className="main-header">
          {/* Logo */}
          <a href="javascript:void(0)" className="logo navbar-fixed-top">
            {/* mini logo for sidebar mini 50x50 pixels */}
            <span className="logo-mini">
              <img src="/images/maatslogoSmall.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardLogoOESSmall" />
            </span>
            {/* logo for regular state and mobile devices */}
            <a href="/Student/Profiles">
              <span className="logo-lg">
                  <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 dashboardLogoOES" />
              </span>
            </a>

          </a>
          {/* Header Navbar: style can be found in header.less */}
          <nav className="navbar navbar-static-top bgnavbar nav1 studentnavbar navbar-fixed-top">
            {/* Sidebar toggle button*/}
            <a href="javascript:void(0)" className="sidebar-toggle" data-toggle="push-menu" role="button">
              <span className="sr-only">
                Toggle navigation
              </span>
            </a>
            <img src="/images/2.png" className="cloud col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
            {/* Navbar Right Menu */}
            <div className="navbar-custom-menu">
              
              <ul className="nav navbar-nav">
                
                {/* Notifications: style can be found in dropdown.less */}
                {/*<li className="dropdown notifications-menu">
                  <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-bell-o" />
                    <span className="label label-warning">0</span>
                  </a>
                  <ul className="dropdown-menu">
                    <li className="header">You have 10 notifications</li>
                    <li>
                      {/* inner menu: contains the actual data 
                      <ul className="menu">
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-users text-aqua" /> welcome
                          </a>
                        </li>*/}
                        {/*<li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-warning text-yellow" /> Very long description here that may not fit into the
                            page and may cause design problems
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-users text-red" /> 5 new members joined
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-shopping-cart text-green" /> 25 sales made
                          </a>
                        </li>
                        <li>
                          <a href="javascript:void(0)">
                            <i className="fa fa-user text-red" /> You changed your username
                          </a>
                        </li>*/}
                      {/*</ul>
                    </li>
                    <li className="footer">
                      <a href="javascript:void(0)">View all</a>
                    </li>
                  </ul>
                </li>*/}
                {/* Tasks: style can be found in dropdown.less */}
                
                {/* User Account: style can be found in dropdown.less */}
              {/*  <li>
                  {
                  this.props.browserStatus == 'InValidBrowser'?
                  <SystemWarning />
                  :
                  null
                }

                </li>*/}
                <li className="dropdown user user-menu">
                  <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown">
                    <img src={this.studentLoginPhoto()} className="user-image"  />
                    <span className="hidden-xs"> {this.currentUser()} </span>
                  </a>
                  <ul className="dropdown-menu">
                    {/* User image */}
                    <li className="user-header">
                      <img src={this.studentLoginPhoto()} className="img-circle" />
                      {this.getUploadImgPercentagee()}
                      <span>
                      <a href="javascript:void(0)">
                      <span className="changeimgwrap">Change</span></a>
                        <input type="file" className="chooseImgArap" accept="file/*" onChange={this.uploadStudentImage.bind(this)}/>
                      </span>
                      
                      <p>
                        {this.currentUser()}
                      </p>
                    </li>
                    {/* Menu Body */}
                    
                    {/* Menu Footer*/}
                    <li className="user-footer">
                      <div className="pull-left">
                        {this.myProfile()}
                      </div>
                      <div className="pull-right">
                        <a href="javascript:void(0)" className="btn btn-default btn-flat" onClick={this.handleClick.bind(this)}>
                          Sign out
                        </a>
                      </div>
                    </li>
                  </ul>
                </li>
                {/* Control Sidebar Toggle Button */}
                {this.studentLogin()}
              </ul>
            </div>
          </nav>
           <div id="SustemInfoModal" className="modal fade" role="dialog">
            <div className="modal-dialog">           
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                  <h3 className="modal-title">Minimum System Requirements for the best performance : </h3>
                </div>
                <div className="modal-body">
                  <p><h4>You are using System : </h4><span className="greyText">&nbsp;{this.props.platformInfo}</span></p>
                   <p><h4>You are using Browser :</h4><span className="greyText">&nbsp;{this.props.browserNameAndVersion.length>1?this.props.browserNameAndVersion:"IE/Safari"}</span></p>
                    <p><h4>For smoothly performance of this application Minimum System Requirement is as follows :</h4> 
                      <ol>
                        <li><h4>System :</h4> <span className="greyText">Windows(Version More than 8)/ Linux/ Mac </span></li>
                        <li><h4>Browser : </h4><span className="greyText">Google Chrome (Version More than 51)/ Linux/ Mac </span></li>
                      </ol>

                    </p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                </div>
              </div>

            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default withTracker(props => {
  // console.log("navigator.appName------>",navigator.appName);
    // console.log("navigator.appCodeName------>",navigator.appCodeName);
    var SystemInfo = window.navigator;
    if(SystemInfo){
      SystemInfoApp = SystemInfo.appVersion;
      userAgentInfoApp = SystemInfo.userAgent;
      platformInfo = SystemInfo.platform;
       var  otherIndex = userAgentInfoApp.indexOf('Firefox');
    console.log("SystemInfoApp------>",userAgentInfoApp);
    // console.log("System------>",SystemInfo);

      if(SystemInfoApp){
        var  index = SystemInfoApp.indexOf('Chrome');       
       
        if(otherIndex==-1){
            if(index){
            var browserInfo = SystemInfoApp.slice(index);
            if(browserInfo){
              var browserData = browserInfo.split('.');
              var browserNameAndVersion = browserData[0].split('/');
              if(browserNameAndVersion){
                browserName = browserNameAndVersion[0];
                browserVersion = parseInt(browserNameAndVersion[1]);
                if(browserName=='Chrome' && browserVersion>51){
                  var browserStatus = 'ValidBrowser';
                }else{
                  var browserStatus = 'InValidBrowser';
                }
              }
            }
          }
        }
        else{
          
            console.log("otherIndex---->",otherIndex);
            if(otherIndex){
              var browserInfo = userAgentInfoApp.slice(otherIndex);
               if(browserInfo){
                // var browserData = browserInfo.split('.');
                var browserNameAndVersion = browserInfo;
                var browserStatus = 'InValidBrowser';
               }
            }
        }
       
      }
    }
    console.log("browserStatus in tracker ------>",browserNameAndVersion);
    // console.log("browserVersion-->",browserVersion);
    // const login    = Meteor.userId();
    // if(login){      
    //   var loggingIn = true;
    // }else{
    //   var loggingIn = false;
    // }
    return {
          // loggingIn,
          browserStatus,
          browserNameAndVersion,
          platformInfo,
            // isAdmin
    }; 
})(Header);
