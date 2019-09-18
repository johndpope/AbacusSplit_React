import React, { Component }  from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import BasicForm from './BasicForm.jsx';
import AddressForm from './AddressForm.jsx';
import EducationForm from './EducationForm.jsx';
import ProfessionalEduForm from './ProfessionalEduForm.jsx';
import WorkForm from './WorkForm.jsx';
import StatutoryForm from './StatutoryForm.jsx';
import OtherInfoForm from './OtherInfoForm.jsx';
import ProfileView from '../views/ProfileView.jsx';
import Skills from './Skills.jsx';
import Certificate from './Certificate.jsx';
import ListAcademics from './ListAcademics.jsx';
import ListEmploymentInfo from './ListEmploymentInfo.jsx';
import ListCertificate from './ListCertificate.jsx';
import ListAddress from './ListAddress.jsx';
// import AcademiceRequired from '../views/AcademiceRequired.jsx';
// import EmploymentRequired from '../views/EmploymentRequired.jsx';

import { UserProfile } from './api/userProfile.js';

class ProfileForms extends TrackerReact(Component){
  constructor(){
    super(); 
    this.state ={ 
      "subscription" : {     
      } 
    }
  }
  inputFileChange(event){
    // console.log($(event.target));
    event.preventDefault();
    $(event.target).parent().parent().find('.inputFiles').click();
  } 
  uploadProfileImg(event){
    event.preventDefault();
    let self = this; 
    this.setState({isUploading: true});
    //  this.calculateProgress();
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      // console.log("file",file);
      var userId = Meteor.userId();
      // console.log("userId",userId);
      if (file) {
        addUserToS3Function(userId,file,self);
      }
    }
  }

  homeActive(event){
    event.preventDefault();
    if(this.props.currentLocation.pathname != '/profileForms'){
      browserHistory.replace('/profileForms');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#home').addClass('in active');
    $('.home').addClass('active');
    $('#menu6').removeClass('in active');
  }
  menu4Active(event){
    event.preventDefault();
    if(this.props.currentLocation.pathname != '/profileForms'){
      browserHistory.replace('/profileForms');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu4').addClass('in active');
    $('.menu4').addClass('active');
    $('#menu6').removeClass('in active');
  }
  menu1Active(event){
    event.preventDefault();
    if(this.props.currentLocation.pathname != '/profileForms'){
      browserHistory.replace('/profileForms');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu1').addClass('in active');
    $('.menu1').addClass('active');
    $('#menu6').removeClass('in active');
  }
  menu2Active(event){
    event.preventDefault();
    if(this.props.currentLocation.pathname != '/profileForms'){
      browserHistory.replace('/profileForms');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu2').addClass('in active');
    $('.menu2').addClass('active');
    $('#menu6').removeClass('in active');
  }
  menu3Active(event){
    event.preventDefault();
    if(this.props.currentLocation.pathname != '/profileForms'){
      browserHistory.replace('/profileForms');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu3').addClass('in active');
    $('.menu3').addClass('active');
    $('#menu6').removeClass('in active');
  }
  nocontentActive(event){
    event.preventDefault();
    if(this.props.currentLocation.pathname != '/profileForms'){
      browserHistory.replace('/profileForms');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#nocontent').addClass('in active');
    $('.nocontent').addClass('active');
    $('#menu6').removeClass('in active');
  } 
  menu5Active(event){
    event.preventDefault();
    if(this.props.currentLocation.pathname != '/profileForms'){
      browserHistory.replace('/profileForms');
    }
    $('.pillsContent').find('.active').removeClass('in active');
    $('#menu5').addClass('in active');
    $('.menu5').addClass('active');
    $('#menu6').removeClass('in active');
  }
  slideProfEducation(event){
    event.preventDefault();
    // console.log('event: ',$(event.target));
    if($(event.target).hasClass('angleSlide')){
      $(event.target).siblings('i').addClass('fa-angle-up');
      $(event.target).siblings('i').removeClass('fa-angle-down');
      $(event.target).removeClass('angleSlide');
      $('#profEduCollapse').slideDown();
    }else if($(event.target).hasClass('fa-angle-down')){
      $(event.target).removeClass('fa-angle-down');
      $(event.target).addClass('fa-angle-up');
      $('#profEduCollapse').slideDown();
    }else{
      $(event.target).siblings('i').addClass('fa-angle-down');
      $(event.target).siblings('i').removeClass('fa-angle-up');
      $(event.target).addClass('angleSlide');
      $('.fa-angle-up').addClass('fa-angle-down');
      $('.fa-angle-down').removeClass('fa-angle-up');
      $('#profEduCollapse').slideUp();
    }
  }
  
  render(){ 
    if(!this.props.loading && !this.props.loading1){
      return(
        <div>
          {this.props.usersDetails.profile.loginAs == 'user' ?
            <div className="profileForms">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileFormsHead">
                <div className="profileHead">
                  <div className="color-overlay"></div>
                  <div className="proHeadContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    { this.props.usersDetails.profile.userProfile ? 
                      <div>
                        <input type="file" className="btn btn-info inputFiles" onChange={this.uploadProfileImg.bind(this)}/>  
                        {/*<div className="color-overlay"> 
                          <div><i className="fa fa-times-circle"></i> Remove</div>
                        </div>*/}
                        <div className="addUserImage addUserImage1" onClick={this.inputFileChange.bind(this)}>
                          <img src={this.props.usersDetails.profile.userProfile} className="img-circle userPrfileImg inputFileSpan" />
                        </div>
                      </div>               
                      :          
                      <div>
                        <input type="file" onChange={this.uploadProfileImg.bind(this)} className="btn btn-info inputFiles"/>  
                        <div className="addUserImage" onClick={this.inputFileChange.bind(this)}>
                          <i className="fa fa-plus-circle fa-lg inputFileSpan"></i><br/>Add Photo
                        </div>
                      </div>
                    }
                    <h4 className=""><b>{this.props.usersDetails.firstname} {this.props.usersDetails.lastname}</b></h4>
                    <h5>AssureID MHP1234567IN</h5>
                    <div className="proheadNavTitle col-lg-6 col-md-6 col-sm-12 col-xs-12">
                      <ul>
                        <li><a><h5 className="fancy_title1">
                          <span className="charBas1">B</span>
                          <span className="charBas2">a</span>  
                          <span className="charBas3">s</span>
                          <span className="charBas4">i</span>
                          <span className="charBas5">c</span>
                        </h5></a></li>
                        <li><a><h5 className="fancy_title2">
                          <span className="charIdn1">I</span>
                          <span className="charIdn2">d</span>
                          <span className="charIdn3">e</span>
                          <span className="charIdn4">n</span>
                          <span className="charIdn5">t</span>
                          <span className="charIdn6">i</span>
                          <span className="charIdn7">t</span>
                          <span className="charIdn8">y</span>
                        </h5></a></li>
                        <li><a><h5 className="fancy_title3">
                          <span className="charAdd1">A</span>
                          <span className="charAdd2">d</span>
                          <span className="charAdd3">d</span>
                          <span className="charAdd4">r</span>
                          <span className="charAdd5">e</span>
                          <span className="charAdd6">s</span>
                          <span className="charAdd7">s</span>
                        </h5></a></li>
                        <li><a><h5 className="fancy_title4">
                          <span className="charAca1">A</span>
                          <span className="charAca2">c</span>
                          <span className="charAca3">a</span>
                          <span className="charAca4">d</span>
                          <span className="charAca5">e</span>
                          <span className="charAca6">m</span>
                          <span className="charAca7">i</span>
                          <span className="charAca8">c</span>
                        </h5></a></li>
                        <li><a><h5 className="fancy_title5">
                          <span className="charEmp1">E</span>
                          <span className="charEmp2">m</span>
                          <span className="charEmp3">p</span>
                          <span className="charEmp4">l</span>
                          <span className="charEmp5">o</span>
                          <span className="charEmp6">y</span>
                          <span className="charEmp7">m</span>
                          <span className="charEmp8">e</span>
                          <span className="charEmp9">n</span>
                          <span className="charEmp10">t</span>
                        </h5></a></li>
                        <li><a><h5 className="fancy_title6">
                          <span className="charCer1">C</span>
                          <span className="charCer2">e</span>
                          <span className="charCer3">r</span>
                          <span className="charCer4">t</span>
                          <span className="charCer5">i</span>
                          <span className="charCer6">f</span>
                          <span className="charCer7">i</span>
                          <span className="charCer8">c</span>
                          <span className="charCer9">a</span>
                          <span className="charCer10">t</span>
                          <span className="charCer11">i</span>
                          <span className="charCer12">o</span>
                          <span className="charCer13">n</span>
                        </h5></a></li>
                        <li><a><h5 className="fancy_title7">
                          <span className="charOth1">O</span>
                          <span className="charOth2">t</span>
                          <span className="charOth3">h</span>
                          <span className="charOth4">e</span>
                          <span className="charOth5">r</span>
                        </h5></a></li>
                      </ul>
                    </div>
                    <div className="proheadNav col-lg-6 col-md-12 col-sm-12 col-xs-12">
                      {/*<hr/>*/}
                      <div className="progress">
                        <div className="progress-bar progress-bar-striped" role="progressbar"
                        aria-valuenow={this.props.userprofileObj.profilePercent} aria-valuemin="0" aria-valuemax="100" 
                        style={{width: this.props.userprofileObj.profilePercent +'%'}}>
                        </div>
                      </div>
                      <ul className="nav nav-pills pillsContent">
                        <li className="home" onClick={this.homeActive.bind(this)}><a data-toggle="pill" href="#home" className={this.props.userprofileObj.profileBasicClass + " smallFaPills"}><i className="fa fa-user"></i></a></li>
                        <li className="menu4" onClick={this.menu4Active.bind(this)}><a data-toggle="pill" href="#menu4" className={this.props.userprofileObj.profileIdentityClass + " largeFaPills"}><i className="fa fa-id-card"></i></a></li>
                        <li className="menu1" onClick={this.menu1Active.bind(this)}><a data-toggle="pill" href="#menu1" className={this.props.userprofileObj.profileAddressClass + " smallFaPills"}><i className="fa fa-map-marker"></i></a></li>
                        {/*<li><a data-toggle="pill" href="#menu1" className="halfcompleteDetails"><i className="fa fa-map-marker"></i></a></li>*/}
                        <li className="menu2" onClick={this.menu2Active.bind(this)}><a data-toggle="pill" href="#menu2" className={this.props.userprofileObj.profileAcademicsClass + " largeFaPills"}><i className="fa fa-graduation-cap"></i></a></li>
                        <li className="menu3" onClick={this.menu3Active.bind(this)}><a data-toggle="pill" href="#menu3" className={this.props.userprofileObj.profileEmploymentClass + " mediumFaPills"}><i className="fa fa-briefcase"></i></a></li>
                        <li className="nocontent" onClick={this.nocontentActive.bind(this)}><a data-toggle="pill" href="#nocontent" className={this.props.userprofileObj.profileSkillsCertClass + " mediumFaPills"}><i className="fa fa-certificate"></i></a></li>
                        <li className="menu5" onClick={this.menu5Active.bind(this)}><a data-toggle="pill" href="#menu5" className={this.props.userprofileObj.profileOtherInfoClass + " mediumFaPills"}><i className="fa fa-file-o"></i></a></li>
                      </ul>
                    </div>
                    <div className="col-lg-4 headProgressNav">
                      <h5>Your profile is {this.props.userprofileObj.profilePercent}% completed</h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBody"> 
                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyMenu">
                    <h4 className="">Menu</h4>
                    <hr className="profileMenuHR" style={{width: 21+'%'}}/>
                    <ul className="nav nav-pills pillsContent">
                      <li className="active col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight home" onClick={this.homeActive.bind(this)}>
                        <a data-toggle="pill" href="#home" className="noProfilePadding">
                          <i className="fa fa-user col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Basic Information
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>
                      <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu4" onClick={this.menu4Active.bind(this)}>
                        <a data-toggle="pill" href="#menu4" className="noProfilePadding">
                          <i className="fa fa-id-card col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Identity Information
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>
                      <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu1" onClick={this.menu1Active.bind(this)}>
                        <a data-toggle="pill" href="#menu1" className="noProfilePadding">
                          <i className="fa fa-map-marker col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Address Information
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>
                      <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu2" onClick={this.menu2Active.bind(this)}>
                        <a data-toggle="pill" href="#menu2" className="noProfilePadding">
                          <i className="fa fa-graduation-cap col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Academic Information
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>
                      <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu3" onClick={this.menu3Active.bind(this)}>
                        <a data-toggle="pill" href="#menu3" className="noProfilePadding">
                          <i className="fa fa-briefcase col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Employment Information
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>
                      <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight nocontent" onClick={this.nocontentActive.bind(this)}>
                        <a data-toggle="pill" href="#nocontent" className="noProfilePadding">
                          <i className="fa fa-certificate col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Skills & Certification Information
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>
                      <li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu5" onClick={this.menu5Active.bind(this)}>
                        <a data-toggle="pill" href="#menu5" className="noProfilePadding">
                          <i className="fa fa-file-o col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">Other Information
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>
                      {/*<li className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight menu6">
                        <a data-toggle="pill" href="#menu6" className="noProfilePadding">
                          <i className="fa fa-file-o col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"></i>
                          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding">View
                            <hr className="col-lg-12 col-md-12 col-sm-12 col-xs-12"/>
                          </span>
                        </a>
                      </li>*/}
                    </ul>
                  </div>
                </div>       
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyContent">
                    <div className="tab-content">
                      <div id="home" className={this.props.currentLocation.pathname != '/profileForms' ? "tab-pane fade" : "tab-pane fade in active"}>
                        <h4 className="">Basic Information</h4>
                        <hr className="profileMenuHR"/>
                        <BasicForm key={this.props.userprofileObj._id +'-basic'} basicValues={this.props.userprofileObj} />
                      </div>
                      <div id="menu4" className="tab-pane fade">
                        <h4 className="">Identity Information</h4>
                        <hr className="profileMenuHR"/>
                        <StatutoryForm key={this.props.userprofileObj._id +'-identity'} identityValues={this.props.userprofileObj.identity} />
                      </div>
                      <div id="menu1" className="tab-pane fade">
                        <h4 className="">Address Information</h4>
                        <hr className="profileMenuHR"/>
                        <AddressForm />
                        <ListAddress key={this.props.userprofileObj._id +'-address'} profileId={this.props.userprofileObj._id} permanentAddress={this.props.userprofileObj.permanentAddress} currentAddress={this.props.userprofileObj.currentAddress} />
                      </div>
                      <div id="menu2" className="tab-pane fade">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <h4 className="">Academic Information</h4>
                          <hr className="profileMenuHR"/>
                          <EducationForm key={this.props.userprofileObj._id + '-educationForm'} />
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <a href="" onClick={this.slideProfEducation.bind(this)} style={{color : '#'+'333'}}>
                            <h4 className="col-lg-11 col-md-11 col-sm-11 col-xs-11 angleSlide">Professional Qualification Information [Only in case of IIT, CA, ICWAI, CS, MBBS etc]</h4>
                            <i className="col-lg-1 col-md-1 col-sm-1 col-xs-1 fa fa-2x fa-angle-down" style={{marginTop : '12'+'px'}}></i>
                          </a>
                          {/*<hr className="profileMenuHR"/>*/}
                          <div id="profEduCollapse">
                            <ProfessionalEduForm />
                          </div>
                        </div>
                        {/*<AcademiceRequired/>*/}
                        <ListAcademics key={this.props.userprofileObj._id + '-academics'} academicsData={this.props.userprofileObj.education} professionalData={this.props.userprofileObj.professionalEducation}/>
                      </div>
                      <div id="menu3" className="tab-pane fade">
                        <h4 className="">Employment Information</h4>
                        <hr className="profileMenuHR"/>
                        <WorkForm />  
                        {/*<EmploymentRequired/>*/}
                        <ListEmploymentInfo key={this.props.userprofileObj._id + '-employement'} employeeData={this.props.userprofileObj.employement}/>
                      </div>
                      <div id="nocontent" className="tab-pane fade">       
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <h4 className="">Skills</h4>
                          <hr className="profileMenuHR"/>
                          <Skills userId={this.props.userprofileObj.userId} />                    
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                          <h4 className="">Certification Information</h4>
                          <hr className="profileMenuHR"/>
                          <Certificate />
                          <ListCertificate key={this.props.userprofileObj._id + '-certificate'} certificateData={this.props.userprofileObj.certificates} certificateForm="editCertificateForm" />
                        </div>
                      </div>
                      <div id="menu5" className="tab-pane fade">
                        <h4 className="">Other Information</h4>
                        <hr className="profileMenuHR"/>
                        <OtherInfoForm key={this.props.userprofileObj._id +'-other'} basicValues={this.props.userprofileObj}/>
                      </div>
                      <div id="menu6" className={this.props.currentLocation.pathname != '/profileForms' ? "tab-pane fade in active" : "tab-pane fade"}>
                        <h4 className="">Background</h4>
                        <hr className="profileMenuHR"/>
                        <ProfileView/>
                      </div>  
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileBodyNews">
                    <h4 className="">News Feed</h4>
                    <hr className="profileMenuHR" style={{width: 38+'%'}}/>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proNewsBlock">
                      <NewsFeed />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            :
            ""
          }
        </div>
      );
    }else{
      return(<span>Loading..</span>);
    }   
  }
}
EditPageContainer = withTracker(({props}) => {
  const postHandle = Meteor.subscribe('userData',Meteor.userId());
  const postHandle1   = Meteor.subscribe('userprofile',Meteor.userId());
  const loading       = !postHandle.ready();
  const loading1      = !postHandle1.ready();
  var _id = Meteor.userId();
  const usersDetails  = Meteor.users.findOne({"_id":_id})|| {};
  const userprofileObj = UserProfile.findOne({'userId': _id}) || {} ;
  // console.log("userprofileObj",userprofileObj);
  var currentLocation = browserHistory.getCurrentLocation();
  // console.log('currentLocation: ',currentLocation);
  return {
    loading,
    usersDetails,
    userprofileObj,
    loading1,
    currentLocation,
  };
})(ProfileForms);

export default EditPageContainer;