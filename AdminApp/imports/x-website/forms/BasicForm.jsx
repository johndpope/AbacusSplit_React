import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { UserProfile } from "./api/userProfile.js";

export default class BasicForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={ 
      "firstName"        : this.props.basicValues.firstName,
      "lastName"         : this.props.basicValues.lastName,
      "fatherFirstName"  : this.props.basicValues.fatherFirstName,
      "fatherLastName"   : this.props.basicValues.fatherLastName,
      "motherFirstName"  : this.props.basicValues.motherFirstName,
      "motherLastName"   : this.props.basicValues.motherLastName,
      "spouseFirstName"  : this.props.basicValues.spouseFirstName,
      "spouseLastName"   : this.props.basicValues.spouseLastName,
      "gender"           : this.props.basicValues.gender,
      "dateofbirth"      : this.props.basicValues.dateOfBirth,
      "mobileNo"         : this.props.basicValues.mobileNo,
      "altMobileNo"      : this.props.basicValues.altMobileNo,
      "emailId"          : this.props.basicValues.emailId,
      "altEmailId"       : this.props.basicValues.altEmailId,
      // "proofOfDOB"       : this.props.basicValues.proofOfDOB,
      // "basicExt"         : this.props.basicValues.basicExt,
      // "basicfileName"    : this.props.basicValues.basicfileName,
      "subscription" : { 
      } 
    };
   this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps() {
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
  currentGender(event){
   // console.log($(event.target));
   if($(event.target).is(':checked')){
      var inputVal = $(event.target).val();
      this.setState({'gender':inputVal});
      // console.log('statedata: ',this.state.gender);
    }
  }
  componentDidMount(){
    $.validator.addMethod("regx1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "It should only contain letters.");
    $.validator.addMethod("regx2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $.validator.addMethod("regx3", function(value, element, regexpr) {          
        return regexpr.test(value);
    }, "Please enter a valid mobile number.");
    $.validator.addMethod("regx4", function(value, element, regexpr) {
      // console.log('value: ',value + element);          
      return regexpr.test(value);
    }, "Please enter a valid phone number.");
    jQuery.validator.addMethod("notEqual", function(value, element, param) {
      return this.optional(element) || value != param;
    }, "Please specify a different value");
       
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
  
    $("#basicForm").validate({
      // debug: true,
      rules: {
        firstName: {
          required: true,
          regx1: /^[A-za-z']*$/,
        },
        lastName: {
          required: true,
          regx1: /^[A-za-z']*$/,
        },
        fatherFirstName: {
          regx1: /^[A-za-z']*$/,
        },
        fatherLastName: {
          regx1: /^[A-za-z']*$/,
        },
        motherFirstName: {
          regx1: /^[A-za-z']*$/,
        },
        motherLastName: {
          regx1: /^[A-za-z']*$/,
        },
        spouseFirstName: {
          regx1: /^[A-za-z']*$/,
        },
        spouseLastName: {
          regx1: /^[A-za-z']*$/,
        },
        mobileNo: {
          required: true,
          regx3: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
        },
        altMobileNo: {
          notEqual: $('#mobileNo').val(),
          regx4: /^\d{5}([- ]*)\d{6}$|^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$|^$/,
        },
        emailId: {
          required: true,
          regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
        },
        altEmailId: {
          notEqual: $('#emailId').val(),
          regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^$/, 
        }
      }
    });      
  }
  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      if($('.effect-21').hasClass('error')){
        $(event.target).find('.effect-21.error').addClass('has-content');  
      }else{
        $(event.target).removeClass("has-content");
      }
    }
  }
  basicForm(event){
    event.preventDefault();
    var proofDocumentLink = this.props.basicValues.proofOfDOB;
    var userId = Meteor.userId();
    if($('#basicForm').valid()){
      var formValues = {
        "userId"          : userId,
        "firstName"       : this.refs.firstName.value,
        "lastName"        : this.refs.lastName.value,
        "fatherFirstName" : this.refs.fatherFirstName.value,
        "fatherLastName"  : this.refs.fatherLastName.value,
        "motherFirstName" : this.refs.motherFirstName.value,
        "motherLastName"  : this.refs.motherLastName.value,
        "spouseFirstName" : this.refs.spouseFirstName.value,
        "spouseLastName"  : this.refs.spouseLastName.value,
        "gender"          : $('input[name=gender]:checked', '#basicForm').val(),
        "dateOfBirth"     : this.refs.dateofbirth.value,
        "mobileNo"        : this.refs.mobileNo.value,
        "altMobileNo"     : this.refs.altMobileNo.value,
        "emailId"         : this.refs.emailId.value,
        "altEmailId"      : this.refs.altEmailId.value,
      }
      // console.log("formValues",formValues);
      
      var getuserProfileData = UserProfile.find({}).fetch();
      if (getuserProfileData) {
        var getuserProfileCount = getuserProfileData.length;
        if (getuserProfileCount == 0) {
          Meteor.call("insertBasicData", formValues,proofDocumentLink, function(error,result){
            if(error){
              console.log(error.reason);
            }else{
              // swal("Done","Basic Information inserted successfully!"); 
            }
          });  
        }else{
          var userProfileObj = UserProfile.findOne({"userId" : Meteor.userId()});
          if (userProfileObj) {
            var getuserId = userProfileObj.userId;
            Meteor.call("updateBasicData",getuserId,formValues,proofDocumentLink, function(error,result){
              if(error){
                console.log(error.reason);
              }else{
                // swal("Done","Basic Information updated successfully!");   
              }
            });  
          }
        }
        if (this.props.basicValues) {
          if($('#home').hasClass('in active')){
            $('html, body').animate({
              'scrollTop' : $(".profileBody").position().top
            });
            $('#home').removeClass('in active');
            $('.home').removeClass('active');
            $('#menu4').addClass('in active');
            $('.menu4').addClass('active');
          }
        }else{
          $('#basicinfo').modal('hide');
        }   
      }
    }else{
      // console.log("false");
      $(event.target).find('.effect-21.error').addClass('has-content');
    }
  }
  inputFileChange(event){
    event.preventDefault();
    $(event.target).siblings('.inputFiles').click();
  }
  uploadProofDocs(event){
    event.preventDefault();
    var proofSubtype = '';
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
        var prooftype = "basic";
        var ext = fileName.split('.').pop();
        $(event.target).parent().siblings('.selectWidth').css({'marginTop':'-20px','fontSize':'13px','marginBottom':'0px'});
        $(event.target).parent().siblings('.selectWidth').find('label').css('fontWeight','100');
        $(event.target).parent().siblings('.fileNameDiv').css({'display':'block','marginTop':'1px','marginBottom':'0px'});
        $(event.target).parent().siblings('.fileNameDiv').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.fileNameDiv').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.basicProgressDiv').css('display','block');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').removeClass('error');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').html('');
            $(event.target).parent().siblings('.fileNameDiv').css('border','0px');
            addProofToS3Function(userId,file,prooftype,proofSubtype,self); 
            $(event.target).parent().siblings('.selectWidth').css('marginTop','10px');
          }else{
            $(event.target).parent().siblings('.basicProgressDiv').css('display','block');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').addClass('error');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').html('<p>Document size should not exceed file size limit 2MB.</p>');
            $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').css({'color':'#e40b0b','fontSize':'13px'});
          } 
        }else{
          $(event.target).parent().siblings('.basicProgressDiv').css('display','block');
          $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').addClass('error');
          $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').html('<p>Only jpg, png, pdf format is supported.</p>');
          $(event.target).parent().siblings('.proofDocsProgress').children('#errorProofList').css({'color':'#e40b0b','fontSize':'13px'});
        }
      }
    }
  }
  removeProofDocs(event){
    event.preventDefault();
    if(this.props.basicValues){
      var imgLink = $(event.target).attr('data-value');
      var filename = this.props.basicValues.basicfileName;
      var fileext = this.props.basicValues.basicExt;
      Meteor.call("removeBasicProof",imgLink,filename,fileext,(error, result)=>{
        // swal({
        //   position: 'top-right',
        //   type: 'success',
        //   title: 'Deleted Successfully',
        //   showConfirmButton: false,
        //   timer: 1500
        // });
        $('.selectWidth').find('label').css({'fontSize':'14px','marginTop':'15px'});
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
  proofModals(event){
    event.preventDefault();
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#proofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#proofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#proofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#proofModals').css('display','block');
    }
  }
  proofInfoModal(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent().siblings('#proofInfoModal').addClass('in');
    $(event.target).parent().parent().parent().parent().siblings('#proofInfoModal').css('display','block');
  }
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#proofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#proofModals').css('display','none');
  }
  closeProofInfoModal(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#proofInfoModal').removeClass('in');
    $(event.target).parent().parent().parent().parent('#proofInfoModal').css('display','none');
  }

  render(){
    return (
      <form className="basicForm" id="basicForm" onSubmit={this.basicForm.bind(this)}>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.firstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="firstName" name="firstName" ref="firstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.firstName}/>
            <label>First Name*</label>
            <span className="focus-border">
              <i></i>
            </span> 
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.lastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="lastName" name="lastName" ref="lastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.lastName}/>
            <label>Last Name*</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.fatherFirstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="fatherFirstName" name="fatherFirstName" ref="fatherFirstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.fatherFirstName}/>
            <label>Father's First Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.fatherLastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="fatherLastName" name="fatherLastName" ref="fatherLastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.fatherLastName}/>
            <label>Father's Last Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.motherFirstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="motherFirstName" name="motherFirstName" ref="motherFirstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.motherFirstName}/>
            <label>Mother's First Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.motherLastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="motherLastName" name="motherLastName" ref="motherLastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.motherLastName}/>
            <label>Mother's Maiden Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.spouseFirstName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="spouseFirstName" name="spouseFirstName" ref="spouseFirstName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.spouseFirstName}/>
            <label>Spouse's First Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>
            <input type="text" className={this.state.spouseLastName =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="spouseLastName" name="spouseLastName" ref="spouseLastName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.spouseLastName}/>
            <label>Spouse's Last Name</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-group">
              {/*<span className="input-group-addon addons"><i className="fa fa-user" aria-hidden="true"></i></span>*/}
              <label style={{marginRight: "15"+"px"}}>Gender*</label>
              <label className="radio-inline"><input type="radio" name="gender" value="female" ref="gender" checked={this.state.gender === 'female'} onChange={this.handleChange} />Female</label>
              <label className="radio-inline"><input type="radio" name="gender" value="male" ref="gender" checked={this.state.gender === 'male'} onChange={this.handleChange} />Male</label>
              <label className="radio-inline"><input type="radio" name="gender" value="other" ref="gender" checked={this.state.gender === 'other'} onChange={this.handleChange} />Other</label>
            </div>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className={this.state.dateofbirth == '' ? "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs has-content required"} id="dateofbirth" name="dateofbirth"  ref="dateofbirth"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.dateofbirth}/>
              <label className="">Date of Birth*</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          { 
            !this.props.basicValues.proofOfDOB ?
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidth">
                  <div className="input-effect input-group">
                    <label className="">Proof of Date of Birth</label>&nbsp;&nbsp;
                    <i className="fa fa-question-circle-o proQuestion" aria-hidden="true" onClick={this.proofInfoModal.bind(this)}></i>
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 fileNameDiv" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft BrowseButton">
                  <input type="file" className="btn btn-info inputFiles" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress basicProgressDiv" style={{display: "none"}}>
                  <div id="errorProofList"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            :
            <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
              { 
                this.props.basicValues.proofOfDOB ?
                  this.props.basicValues.basicExt == 'jpg' || this.props.basicValues.basicExt == 'png' || this.props.basicValues.basicExt == 'jpeg' ?
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{height: "200"+"px"}}>
                      <a href=""><img className="img" src={this.props.basicValues.proofOfDOB} onClick={this.proofModals.bind(this)} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.basicValues.proofOfDOB}></i>
                    </div>
                  :
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <a href="" onClick={this.proofModals.bind(this)}><i className="fa fa-file"></i> {this.props.basicValues.basicfileName}</a>
                    <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.basicValues.proofOfDOB}></i>
                  </div>
                :
                ""
              }
            </div>
          }
          
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
            <input type="text" className={this.state.mobileNo =='' ? "effect-21 form-control loginInputs required" : "effect-21 form-control loginInputs has-content required"} id="mobileNo" name="mobileNo" ref="mobileNo" onBlur={this.inputEffect.bind(this)} value={this.state.mobileNo}/>
            <label>Phone No.*</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
          <div className="input-effect input-group">
            <span className="input-group-addon addons"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
            <input type="text" className={this.state.altMobileNo =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="altMobileNo" name="altMobileNo" ref="altMobileNo" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.altMobileNo}/>
            <label>Alternate Phone No.</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
            <input type="email" className={this.state.emailId =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="emailId" name="emailId" ref="emailId" aria-label="Email Id" onBlur={this.inputEffect.bind(this)} value={this.state.emailId} />
            <label>Email Id*</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <div className="form-group col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div className="input-effect input-group">
            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-envelope" aria-hidden="true"></i></span>
            <input type="email" className={this.state.altEmailId =='' ? "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs has-content"} id="altEmailId" name="altEmailId" ref="altEmailId" aria-label="Email Id" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.altEmailId}/>
            <label>Alternate Email Id</label>
            <span className="focus-border">
              <i></i>
            </span>
          </div>
        </div>
        <button type="submit" className="btn btn-info pull-right">Save</button>
        
        <div className="modal fade proofInfoModals" id="proofInfoModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" onClick={this.closeProofInfoModal.bind(this)}>&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="logoWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center noProfilePadding">
                    <img src="../images/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h5><b>What are applicable proof for Date of Birth? Use any one.</b></h5>
                    <ul>
                      <li><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;<span>Birth Certificate</span></li>
                      <li><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;<span>Aadhar Card</span></li>
                      <li><i className="fa fa-check-circle" aria-hidden="true"></i>&nbsp;&nbsp;<span>School Leaving Certificate</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="proofModals" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  { 
                    this.props.basicValues.proofOfDOB ?
                      this.props.basicValues.basicExt == 'jpg' || this.props.basicValues.basicExt == 'png' || this.props.basicValues.basicExt == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.basicValues.proofOfDOB} style={{width: "100"+"%"}} />
                        </div>
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <iframe src={this.props.basicValues.proofOfDOB} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                      </div>
                    :
                    ""
                  }
                </div>
              </div>
            </div>
          </div>
        </div>     
      </form>
    );
  }
}