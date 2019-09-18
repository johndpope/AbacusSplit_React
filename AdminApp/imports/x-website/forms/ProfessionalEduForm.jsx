import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { UserProfile } from "./api/userProfile.js";
import { TempProofDocs } from "./api/userProfile.js";

class ProfessionalEduForm extends TrackerReact(React.Component){
  constructor(props){
    super(props);
    if(this.props.professionalAcademicsValues){
      this.state ={ 
       "professionalEducationId"    : this.props.professionalAcademicsValues.professionalEducationId,
       "professionalQualification"  : this.props.professionalAcademicsValues.professionalQualification,
       "registrationNo"             : this.props.professionalAcademicsValues.registrationNo,
       "dateOfQualification"        : this.props.professionalAcademicsValues.dateOfQualification,
       "qualifyingBodyNm"           : this.props.professionalAcademicsValues.qualifyingBodyNm,
       "professionalRollNo"         : this.props.professionalAcademicsValues.professionalRollNo,
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
      this.state ={
        "professionalEducationId"  : '',
       "professionalQualification" : '',
       "registrationNo"            : '', 
       "dateOfQualification"       : '',
       "qualifyingBodyNm"          : '',
       "professionalRollNo"        : '',
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
  editProfessionalAcademics(event){
    event.preventDefault(); 
    var id      = Meteor.userId();
    var index   = $(event.target).attr('data-index');
    var professionalEducationId = this.state.professionalEducationId;
    if(this.props.professionalAcademicsValues){
      if(this.props.professionalAcademicsValues.proofOfEducation){
        var imgLink = this.props.professionalAcademicsValues.proofOfEducation;
        var fileName = this.props.professionalAcademicsValues.eduFileName;
        var fileExt = this.props.professionalAcademicsValues.eduFileExt;
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
    }else if(this.props.proofData){
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
      "professionalEducationId"   : professionalEducationId,
      "professionalQualification" : this.refs.professionalQualification.value,
      "registrationNo"            : this.refs.registrationNo.value,
      "dateOfQualification"       : this.refs.dateOfQualification.value,
      "qualifyingBodyNm"          : this.refs.qualifyingBodyNm.value,
      "professionalRollNo"        : this.refs.professionalRollNo.value,
      "proofOfEducation"          : imgLink,
      "eduFileName"               : fileName,
      "eduFileExt"                : fileExt,
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open"     
    }
    Meteor.call('updateProfessionalEducation',id,education,index,function (error,result) {
     if(error){
        console.log(error.reason);
      }else{
        // swal("Done","Professional Education Details updated successfully!","success"); 
        $("#editprofessionalacadamicinfo-"+index).modal('hide');            
        $("#editProfessionalAcadamicInfo-"+index).modal('hide');            
        Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
          if (error) {
           console.log(error.reason);
          }else{  
          }
        });            
      }
    });
  }
  submitProfessionalInfo(event){
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
    var professionalEducationObj = UserProfile.findOne({}, {sort: {'professionalEducation.professionalEducationId': -1}});
      // console.log("addressObj",addressObj);
    if(professionalEducationObj){
      if (professionalEducationObj.professionalEducation ) {
        if (professionalEducationObj.professionalEducation.length > 0 ) {
          var lastelem    = _.last(professionalEducationObj.professionalEducation);
          var professionalEducationId = parseInt(lastelem.professionalEducationId) + 1;
        }else{
          var professionalEducationId =  1;
        }
      }
      else{
        var professionalEducationId =  1;
      }
    }
    var education = {
      "professionalEducationId"   : professionalEducationId,
      "professionalQualification" : this.refs.professionalQualification.value,
      "registrationNo"            : this.refs.registrationNo.value,
      "dateOfQualification"       : this.refs.dateOfQualification.value,
      "qualifyingBodyNm"          : this.refs.qualifyingBodyNm.value,
      "professionalRollNo"        : this.refs.professionalRollNo.value,
      "proofOfEducation"          : imgLink,
      "eduFileName"               : fileName,
      "eduFileExt"                : fileExt,
      "verifiedStatus"            : "Not Verified",
      "editStatus"                : "Open"   
    }
    Meteor.call('insertProfessionalEducation',id,education,function (error,result) {
     if(error){
        console.log(error.reason);
      }else{
        // swal("Done","Professional Education Details added successfully!","success"); 
        $(event.target).parent().find('.effect-21').removeClass('has-content');
        if($('#menu2').hasClass('in active')){
          $('html, body').animate({
            'scrollTop' : $(".profileBody").position().top
          });
          $('#menu2').removeClass('in active');
          $('.menu2').removeClass('active');
          $('#menu3').addClass('in active');
          $('.menu3').addClass('active'); 
        }else{
          $('#acadamicinfo').modal('hide');
        } 
         $('#professionalQualification').val('');
         $('#registrationNo').val('');
         $('#dateOfQualification').val('');
         $('#qualifyingBodyNm').val('');
         $('#professionalRollNo').val('');
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
        $(event.target).parent().parent().find('.selectWidthProEdu').css({'fontSize':'13px','marginBottom':'0px'});
        $(event.target).parent().parent().find('.selectWidthProEdu').find('label').css({'fontSize':'13px','fontWeight':'100'});
        $(event.target).parent().siblings('.proEduFileName').css({'display':'block','marginTop':'1px','marginBottom':'0px','fontSize':'13px','fontWeight':'100',});
        $(event.target).parent().siblings('.proEduFileName').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.proEduFileName').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').removeClass('error');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').html('');
            $(event.target).parent().siblings('.proEduFileName').css('border','0px');
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);
            // $('.selectWidthEmp').css('marginTop','10px');
            $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
          }else{
            $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').addClass('error');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').html('<p>Document size should not exceed file size limit 2MB.</p>');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').css({'color':'#e40b0b','fontSize':'13px'});
          } 
        }else{
          $(event.target).parent().siblings('.educationProgressDiv').css('display','block');
          $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').addClass('error');
          $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').html('<p>Only jpg, png, pdf format is supported.</p>');
          $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').css({'color':'#e40b0b','fontSize':'13px'});
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
    $('#editprofessionalacadamicinfo-'+index).animate({
      'scrollTop' : 0
    });
    $('#acadamicinfo').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#proEduProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#proEduProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#proEduProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#proEduProofModals').css('display','block');
    }
  }
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#proEduProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#proEduProofModals').css('display','none');
  }

  render(){
    return(
      <form className="educationForm basicForm">
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.professionalQualification != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="professionalQualification" name="professionalQualification" ref="professionalQualification" value={this.state.professionalQualification} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Qualification / Membersip</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group"> 
           <span className="input-group-addon addons " id="basic-addon1"><i className="fa fa-calendar" aria-hidden="true"></i></span>
            <input type="date" className={this.state.dateOfQualification != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="dateOfQualification" name="dateOfQualification" ref="dateOfQualification" value={moment(this.state.dateOfQualification).format('YYYY-MM-DD')} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label className="">Date of Qualification (MM/YYYY)</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.registrationNo != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="registrationNo" name="registrationNo" ref="registrationNo" value={this.state.registrationNo} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Registration No.</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.qualifyingBodyNm != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="qualifyingBodyNm" name="qualifyingBodyNm" ref="qualifyingBodyNm" value={this.state.qualifyingBodyNm} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Name of Qualifying Body</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-file-o" aria-hidden="true"></i></span>
            <input type="text" className={this.state.professionalRollNo != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs"} id="professionalRollNo" name="professionalRollNo" ref="professionalRollNo" value={this.state.professionalRollNo} onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
            <label>Regn No. / Roll No. / Seat No.</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          {
            !this.props.proofData.imageLink && !this.props.professionalAcademicsValues ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthProEdu">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Professional Education</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 proEduFileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="professionalEducation" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                  <div id="errorProofProEdu"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            : 
            this.props.professionalAcademicsValues ?
              this.props.professionalAcademicsValues.proofOfEducation ?
              <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                {
                  this.props.professionalAcademicsValues.eduFileExt == 'jpg' || this.props.professionalAcademicsValues.eduFileExt == 'png' || this.props.professionalAcademicsValues.eduFileExt == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} src={this.props.professionalAcademicsValues.proofOfEducation} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.professionalAcademicsValues.proofOfEducation} data-name={this.props.professionalAcademicsValues.eduFileName} data-ext={this.props.professionalAcademicsValues.eduFileExt} data-index={this.props.indexValue} data-subtype="editProfessionalEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.professionalAcademicsValues.eduFileName}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.professionalAcademicsValues.proofOfEducation} data-name={this.props.professionalAcademicsValues.eduFileName} data-ext={this.props.professionalAcademicsValues.eduFileExt} data-index={this.props.indexValue} data-subtype="editProfessionalEducation"></i>
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
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editProfessionalEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editProfessionalEducation"></i>
                  </div>
                }   
              </div>  
            :
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthProEdu">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Professional Education</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 proEduFileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="editProfessionalEducation" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                  <div id="errorProofProEdu"></div>
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
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="professionalEducation"></i>
                    </div>
                  : 
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="professionalEducation"></i>
                  </div>
                }   
              </div>  
            :
            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthProEdu">
                <div className="input-effect input-group">
                  <label className="empLabelMarTop">Proof of Professional Education</label>&nbsp;&nbsp;
                </div>
              </div>
              <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 proEduFileName" style={{display: "none"}}>
                <div className="input-effect input-group">
                  <label></label>
                </div>
              </div>
              <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft">
                <input type="file" className="btn btn-info inputFiles" data-subtype="professionalEducation" onChange={this.uploadProofDocs.bind(this)}/>
                <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                <div id="errorProofProEdu"></div>
                {this.getUploadImagePercentage()}
              </div>
            </div>
          }
        </div>
        <div className="modal fade" id="proEduProofModals" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  { 
                    this.props.professionalAcademicsValues ?
                      this.props.professionalAcademicsValues.proofOfEducation ?
                        this.props.professionalAcademicsValues.eduFileExt == 'jpg' || this.props.professionalAcademicsValues.eduFileExt == 'png' || this.props.professionalAcademicsValues.eduFileExt == 'jpeg' ?
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <img src={this.props.professionalAcademicsValues.proofOfEducation} style={{width: "100"+"%"}} />
                          </div>
                        :
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <iframe src={this.props.professionalAcademicsValues.proofOfEducation} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
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
        <button type="submit" className="btn btn-info pull-right" onClick={this.props.professionalAcademicsValues ? this.editProfessionalAcademics.bind(this) : this.submitProfessionalInfo.bind(this)} data-index={this.props.indexVal}>Save</button>
      </form>
    );
  }
}
EditPageContainer = withTracker(({props}) => {
    var _id          = Meteor.userId();
    const postHandle = Meteor.subscribe('TempProofDocs',_id);
    var proofData = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'education','proofSubtype':'professionalEducation'}) || {};
    var proofObj = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'education','proofSubtype':'editProfessionalEducation'}) || {};
    // console.log("session proof obj:",proofData);
    const loading   = !postHandle.ready();
    return {
      loading,
      proofData,
      proofObj,
    };
})(ProfessionalEduForm);
export default EditPageContainer;