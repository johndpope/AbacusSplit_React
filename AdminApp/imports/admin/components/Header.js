import React,{Component} from 'react';
import { render } from 'react-dom';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
export default class Header extends Component{
  
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
    $("a[href='/css/dashboard.css']").remove();
  }

  constructor(props) {
   super(props);
    this.state = {
      subscription :{
        "userData" : Meteor.subscribe("userData",Meteor.userId()), 
        "studentData" : Meteor.subscribe("singleStudent",Meteor.userId()), 
      }
    }
  }
  handleClick(e) {
      e.preventDefault();
      Meteor.logout();
 } 

 currentUser(){
    var LoginUserData = Meteor.users.findOne({"_id":Meteor.userId()});
      if(LoginUserData){
        var profile = LoginUserData.profile;
        if(profile){
          var firstName = profile.firstname;
          if(firstName){
            return firstName;
          }else{
            return 'Admin';
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
    console.log('uploadProgressPercent :',uploadProgressPercent);
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
      return <a href="/student/profile" className="btn btn-default btn-flat">My Profile</a>
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
          <a href="javascript:void(0)" className="logo">
            {/* mini logo for sidebar mini 50x50 pixels */}
            <span className="logo-mini">
              <img src="/images/maatslogoSmall.png" className="col-lg-12 col-md-12 dashboardLogoOESSmall" />
            </span>
            {/* logo for regular state and mobile devices */}
            <a href="/admin/Dashboard">
              <span className="logo-lg">
                  {/*<b>Online Exam System</b>*/}
                  <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 dashboardLogoOES" />
              </span>
            </a>

          </a>
          {/* Header Navbar: style can be found in header.less */}
          <nav className="navbar navbar-static-top">
            {/* Sidebar toggle button*/}
            <a href="javascript:void(0)" className="sidebar-toggle" data-toggle="push-menu" role="button">
              <span className="sr-only">
                Toggle navigation
              </span>
            </a>
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
                      <span className="hidechgImg">
                      <a href="javascript:void(0)">
                      <span className="changeimgwrap">Change</span></a>
                        {/*<input type="file" className="chooseImgArap" accept="file/*" onChange={this.uploadStudentImage.bind(this)}/>*/}
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
        </header>
      </div>
    );
  }
}
