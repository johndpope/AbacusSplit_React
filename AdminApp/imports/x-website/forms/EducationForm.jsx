import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { UserProfile } from './api/userProfile.js';
import { TempProofDocs } from "./api/userProfile.js";

class EducationForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.academicsValues){
      this.state ={ 
       "educationId"              : this.props.academicsValues.educationId,
       "educationLevel"           : this.props.academicsValues.educationLevel,
       "educationQualification"   : this.props.academicsValues.educationQualification,
       "educationMode"            : this.props.academicsValues.educationMode,
       "dateAttendedFrom"         : this.props.academicsValues.dateAttendedFrom,
       "dateAttendedTo"           : this.props.academicsValues.dateAttendedTo,
       "collegeName"              : this.props.academicsValues.collegeName,
       "university"               : this.props.academicsValues.university,
       "collegeAddress"           : this.props.academicsValues.collegeAddress,
       "rollNo"                   : this.props.academicsValues.rollNo,
       "specialization"           : this.props.academicsValues.specialization,
       "grades"                   : this.props.academicsValues.grades,
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
      this.state ={
      "educationId"                : '',
       "educationLevel"            : '',
       "educationQualification"    : '',
       "educationMode"             : '',
       "dateAttendedFrom"          : '',
       "dateAttendedTo"            : '',
       "collegeName"               : '',
       "university"                : '',
       "collegeAddress"            : '',
       "rollNo"                    : '',
       "specialization"            : '',
       "grades"                    : '',
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   event.preventDefault();
   const target = event.target;
   const name   = target.name;
   this.setState({
    [name]: event.target.value,
   });
  }
  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      $(event.target).removeClass("has-content");
    }
  }
  editAcademics(event){
    event.preventDefault(); 
    var id      = Meteor.userId();
    var index   = $(event.target).attr('data-index');
    var educationId = this.state.educationId;
    // console.log("educationId",educationId);
    if(this.props.academicsValues){
      if(this.props.academicsValues.proofOfEducation){
        var imgLink = this.props.academicsValues.proofOfEducation;
        var fileName = this.props.academicsValues.eduFileName;
        var fileExt = this.props.academicsValues.eduFileExt;
      }else if(this.props.proofObj.imageLink){
        var imgLink = this.props.proofObj.imageLink;
        var fileName = this.props.proofObj.name;
        var fileExt = this.props.proofObj.ext;
        var imgId = this.props.proofObj._id;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
    }else if(this.props.proofData.imageLink){
      var imgLink = this.props.proofData.imageLink;
      var fileName = this.props.proofData.name;
      var fileExt = this.props.proofData.ext;
      var imgId = this.props.proofData._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }
    var education = {
      "educationId"               : educationId,
      "educationLevel"            : this.refs.educationLevel.value,
      "educationQualification"    : this.refs.educationQualification.value,
      "specialization"            : this.refs.specialization.value,
      "grades"                    : this.refs.grades.value,
      "educationMode"             : this.refs.educationMode.value,
      "dateAttendedFrom"          : this.refs.dateAttendedFrom.value,
      "dateAttendedTo"            : this.refs.dateAttendedTo.value,
      "collegeName"               : this.refs.collegeName.value,
      "university"                : this.refs.university.value,
      "collegeAddress"            : this.refs.collegeAddress.value,
      "rollNo"                    : this.refs.rollNo.value,
      "proofOfEducation"          : imgLink,
      "eduFileName"               : fileName,
      "eduFileExt"                : fileExt,
      "verifiedStatus"            : "Not Verified",
       "editStatus"               : "Open",
    }
    // console.log("education",education);
    Meteor.call('updateEducation',id,education,index,function (error,result) {
     if(error){
        console.log(error.reason);  
      }else{
        // swal("Done","Education Details update successfully!","success"); 
        $('#editacadamicinfo-'+index).modal('hide');
        $('#editAcadamicInfo-'+index).modal('hide');
        Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
          if (error) {
           console.log(error.reason);
          }else{  
          }
        });
      }
    });
  }
  submitAcademicInfo(event){ 
    event.preventDefault(); 
    var id   = Meteor.userId();
    if(this.props.proofData){
      var imgLink = this.props.proofData.imageLink;
      var fileName = this.props.proofData.name;
      var fileExt = this.props.proofData.ext;
      var imgId = this.props.proofData._id;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = ''; 
    }

    var educationObj = UserProfile.findOne({}, {sort: {'education.educationId': -1}});
      // console.log("addressObj",addressObj);
    if(educationObj){
     if (educationObj.education) {
        if (educationObj.education.length > 0 ) {
          var lastelem    = _.last(educationObj.education);
          var educationId =  parseInt(lastelem.educationId) + 1;
        }else{
        var educationId =  1;
        }
      }else{
        var educationId =  1;
      }
    }
    var education = {
      "educationId"               : educationId,
      "educationLevel"            : this.refs.educationLevel.value,
      "educationQualification"    : this.refs.educationQualification.value,
      "specialization"            : this.refs.specialization.value,
      "grades"                    : this.refs.grades.value,
      "educationMode"             : this.refs.educationMode.value,
      "dateAttendedFrom"          : this.refs.dateAttendedFrom.value,
      "dateAttendedTo"            : this.refs.dateAttendedTo.value,
      "collegeName"               : this.refs.collegeName.value,
      "university"                : this.refs.university.value,
      "collegeAddress"            : this.refs.collegeAddress.value,
      "rollNo"                    : this.refs.rollNo.value,
      "proofOfEducation"          : imgLink,
      "eduFileName"               : fileName,
      "eduFileExt"                : fileExt,
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open",
    }
    Meteor.call('insertEducation',id,education,function (error,result) {
     if(error){
        console.log(error.reason);
      }else{
        // swal("Done","Education Details added successfully!","success");   
       $(event.target).parent().find('.effect-21').removeClass('has-content');
       $('#educationLevel').val('');
       $('#educationQualification').val('');
       $('#specialization').val('');
       $('#grades').val('');
       $('#educationMode').val('');
       $('#dateAttendedFrom').val('');
       $('#dateAttendedTo').val('');
       $('#collegeName').val('');
       $('#university').val('');
       $('#collegeAddress').val('');
       $('#rollNo').val('');
      }
    });
    if(imgId != ''){
      Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{  
        }
      });   
    }
  }
  getUploadImagePercentage(){
    var uploadProgressPercent = Session.get("uploadProofDocProgressPercent");
    if(uploadProgressPercent){
      var percentVal = parseInt(uploadProgressPercent);
      if(percentVal){
          
          var styleC = {
              width:percentVal + "%",
              display:"block",
          }
          var styleCBar = {
              display:"block",
              marginTop:5,
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
              marginTop:5,
          }
      }

      return (
        <div className="progress"  style= {styleCBar}>
          <div className="progress-bar progress-bar-striped active" role="progressbar"
          aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
            {percentVal} %
          </div>
        </div>
      );
    }
  }
  uploadProofDocs(event){
    event.preventDefault();
    var proofSubtype = $(event.target).attr('data-subtype');
    let self = this;   
    Session.set("uploadProofDocProgressPercent","");
    if (event.currentTarget.files && event.currentTarget.files[0]) {
      var file = event.currentTarget.files[0];
      // console.log("file",file);
      var userId = Meteor.userId();
      // console.log("userId",userId);
      if (file) {
        var fileName = file.name;
        var fileSize = file.size;
        var size = 2000000;
        var prooftype = "education";
        var ext = fileName.split('.').pop();
        $(event.target).parent().parent().find('.selectWidthEdu').css({'fontSize':'13px','marginBottom':'0px'});
        $(event.target).parent().parent().find('.selectWidthEdu').find('label').css({'fontSize':'13px','fontWeight':'100'});
        $(event.target).parent().siblings('.eduFileName').css({'display':'block','marginTop':'1px','marginBottom':'0px','fontSize':'13px','fontWeight':'100',});
        $(event.target).parent().siblings('.eduFileName').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.eduFileName').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').removeClass('error');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').html('');
            $(event.target).parent().siblings('.eduFileName').css('border','0px');
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);
            // $('.selectWidthEmp').css('marginTop','10px');
            $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
          }else{
            $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').addClass('error');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').html('<p>Document size should not exceed file size limit 2MB.</p>');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').css({'color':'#e40b0b','fontSize':'13px'});
          } 
        }else{
          $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
          $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').addClass('error');
          $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').html('<p>Only jpg, png, pdf format is supported.</p>');
          $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofEdu').css({'color':'#e40b0b','fontSize':'13px'});
        }
      }
    }
  }
  inputFileChange(event){
    event.preventDefault();
    $(event.target).siblings('.inputFiles').click();
  }
  removeProofDocs(event){
    event.preventDefault();
    var imgLink = $(event.target).attr('data-value');
    
    if(this.props.proofData){
      Meteor.call("removeTempProofDocs",imgLink,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{
          // swal({
          //   position: 'top-right',
          //   type: 'success',
          //   title: 'Deleted Successfully',
          //   showConfirmButton: false,
          //   timer: 1500
          // });
        }
      });
    }else{
      var fileName = $(event.target).attr('data-name');
      var fileExt = $(event.target).attr('data-ext');
      var index = $(event.target).attr('data-index');
      var subtype = $(event.target).attr('data-subtype');

      Meteor.call("removeTempDocProofs",imgLink,fileName,fileExt,index,subtype,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{
          // swal({
          //   position: 'top-right',
          //   type: 'success',
          //   title: 'Deleted Successfully',
          //   showConfirmButton: false,
          //   timer: 1500
          // });
        }
      });
    }   
  }
  employementModal(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    // $('#editexperienceinfo-'+index).scrollTop(0);
    $('#editacadamicinfo-'+index).animate({
      'scrollTop' : 0
    });
    $('#acadamicinfo').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#eduProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#eduProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#eduProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#eduProofModals').css('display','block');
    }
  }
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#eduProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#eduProofModals').css('display','none');
  }

  render(){
    // console.log(this.props.academicsValues);
    return(
      <form className="educationForm basicForm"> 
        <div className="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <select className={this.state.educationLevel != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="educationLevel" name="educationLevel" ref="educationLevel" value={this.state.educationLevel} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}>
              <option disabled="disabled" selected="true">-- Select --</option>
              <option>Post Graduation</option>
              <option>Graduation</option>
              <option>Diploma</option>
              <option>HSC</option>
              <option>SSC</option>
              <option>Below Matriculation</option>
              <option>Others</option>
            </select>       
            <label>Qualification Level</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.educationQualification != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="educationQualification" name="educationQualification" ref="educationQualification" value={this.state.educationQualification} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Qualification</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-4 col-md-4 col-sm-4 col-xs-4">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.specialization != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="specialization" name="specialization" ref="specialization" value={this.state.specialization} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Specialization</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.grades != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="grades" name="grades" ref="grades"  value={this.state.grades} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Grades / Percentage</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <select className={this.state.educationMode != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="educationMode" name="educationMode" ref="educationMode" value={this.state.educationMode} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}>
              <option disabled="disabled" selected="true">-- Select --</option>
              <option>Full Time</option>
              <option>Part Time</option>
              <option>Distance</option>
            </select> 
            <label>Mode</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 "> 
          <label style={{marginTop: "10"+"px"}}>Dates Attended (MM/YYYY)</label>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group"> 
           <span className="input-group-addon addons " id="basic-addon1"><i className="fa fa-calendar" aria-hidden="true"></i></span>
            <input type="date" className={this.state.dateAttendedFrom != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="dateAttendedFrom" name="dateAttendedFrom" ref="dateAttendedFrom" value={this.state.dateAttendedFrom} onChange={this.handleChange}  onBlur={this.inputEffect.bind(this)}/>
            <label className="">From</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons " id="basic-addon1"><i className="fa fa-calendar" aria-hidden="true"></i></span>
            <input type="date" className={this.state.dateAttendedTo != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="dateAttendedTo" name="dateAttendedTo" ref="dateAttendedTo" value={this.state.dateAttendedTo} onChange={this.handleChange}  onBlur={this.inputEffect.bind(this)}/>
            <label className="">To</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons UniversityAddons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.university != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="university" name="university" ref="university" value={this.state.university} onChange={this.handleChange}   onBlur={this.inputEffect.bind(this)}/>
            <label>University</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons UniversityAddons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.collegeName != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="collegeName" name="collegeName" ref="collegeName" value={this.state.collegeName} onChange={this.handleChange}   onBlur={this.inputEffect.bind(this)}/>
            <label>College / Institute</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-building-o" aria-hidden="true"></i></span>
            <textarea className={this.state.collegeAddress != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} onBlur={this.inputEffect.bind(this)} id="collegeAddress" name="collegeAddress" ref="collegeAddress" onChange={this.handleChange} value={this.state.collegeAddress} ></textarea>
            <label>College Address</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
          <div className="input-effect input-group">
            <span className="input-group-addon addons UniversityAddons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.rollNo != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="rollNo" name="rollNo" ref="rollNo" onChange={this.handleChange} value={this.state.rollNo}  onBlur={this.inputEffect.bind(this)}/>
            <label>Regn No. / Roll No. / Seat No.</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          {
            !this.props.proofData.imageLink && !this.props.academicsValues ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthEdu">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Education</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 eduFileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButtonEdu">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="basicEducation" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                  <div id="errorProofEdu"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            this.props.academicsValues ?
              this.props.academicsValues.proofOfEducation ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                {
                  this.props.academicsValues.eduFileExt == 'jpg' || this.props.academicsValues.eduFileExt == 'png' || this.props.academicsValues.eduFileExt == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img src={this.props.academicsValues.proofOfEducation} className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.academicsValues.proofOfEducation} data-name={this.props.academicsValues.eduFileName} data-ext={this.props.academicsValues.eduFileExt} data-index={this.props.indexValue} data-subtype="editBasicEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.academicsValues.eduFileName}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.academicsValues.proofOfEducation} data-name={this.props.academicsValues.eduFileName} data-ext={this.props.academicsValues.eduFileExt} data-index={this.props.indexValue} data-subtype="editBasicEducation"></i>
                  </div>
                }   
              </div> 
              :
              this.props.proofObj.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                {
                  this.props.proofObj.ext == 'jpg' || this.props.proofObj.ext == 'png' || this.props.proofObj.ext == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} src={this.props.proofObj.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editBasicEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editBasicEducation"></i>
                  </div>
                }   
              </div> 
            : 
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthEdu">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Education</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 eduFileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButtonEdu">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="editBasicEducation" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                  <div id="errorProofEdu"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            this.props.proofData.imageLink ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                {
                  this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} src={this.props.proofData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="basicEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="basicEducation"></i>
                  </div>
                }   
              </div> 
            : 
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthEdu">
                <div className="input-effect input-group">
                  <label className="empLabelMarTop">Proof of Education</label>&nbsp;&nbsp;
                </div>
              </div>
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 eduFileName" style={{display: "none"}}>
                <div className="input-effect input-group">
                  <label></label>
                </div>
              </div>
              <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButtonEdu">
                <input type="file" className="btn btn-info inputFiles" data-subtype="basicEducation" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                <div id="errorProofEdu"></div>
                {this.getUploadImagePercentage()}
              </div>
            </div>
          }
        </div>
        <div className="modal fade" id="eduProofModals" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  { 
                    this.props.academicsValues ?
                      this.props.academicsValues.proofOfEducation ?
                        this.props.academicsValues.eduFileExt == 'jpg' || this.props.academicsValues.eduFileExt == 'png' || this.props.academicsValues.eduFileExt == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.academicsValues.proofOfEducation} style={{width: "100"+"%"}} />
                        </div>
                        :
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <iframe src={this.props.academicsValues.proofOfEducation} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                        </div>
                      :
                      this.props.proofObj.imageLink ?
                        this.props.proofObj.ext == 'jpg' || this.props.proofObj.ext == 'png' || this.props.proofObj.ext == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.proofObj.imageLink} style={{width: "100"+"%"}} />
                        </div>
                        :
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <iframe src={this.props.proofObj.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                        </div>
                      :
                      "" 
                    :
                    this.props.proofData ?
                      this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.proofData.imageLink} style={{width: "100"+"%"}} />
                        </div>
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <iframe src={this.props.proofData.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                      </div>
                    :  
                    ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div> 
        <button type="submit" className="btn btn-info pull-right" onClick={this.props.academicsValues ? this.editAcademics.bind(this) : this.submitAcademicInfo.bind(this)} data-index={this.props.indexVal}>Save</button>
      </form>
    );
  }
}
EditPageContainer = withTracker(({props}) => {
    var _id          = Meteor.userId();
    const postHandle = Meteor.subscribe('TempProofDocs',_id);
    var proofData = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'education','proofSubtype':'basicEducation'}) || {};
    var proofObj = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'education','proofSubtype':'editBasicEducation'}) || {};
    // console.log("session proof obj:",proofData);
    const loading   = !postHandle.ready();
    return {
      loading,
      proofData,
      proofObj,
    };
})(EducationForm);
export default EditPageContainer;