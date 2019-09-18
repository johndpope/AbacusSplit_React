import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TempProofDocs } from "./api/userProfile.js";
import { UserProfile } from "./api/userProfile.js";

class Certificate extends TrackerReact(Component){
	constructor(props){
    super(props);
    if(this.props.certificateValues){
    	this.state ={
        "certificateId"   : this.props.certificateValues.certificateId,
	    	"certificateName" : this.props.certificateValues.certificateName, 
	      "issuedBy"        : this.props.certificateValues.issuedBy,
	      "validTill"       : this.props.certificateValues.validTill,
	      "certificatedOn"  : this.props.certificateValues.certificatedOn,
	      "subscription" : { 
	      } 
	    };
    }else{
    	this.state ={
        "certificateId"   : '',
	      "certificateName" : '', 
	      "issuedBy"        : '',
	      "validTill"       : '',
	      "certificatedOn"  : '',
	      "subscription" : { 
	      } 
	    };

    }
    
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
  componentDidMount(){
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
  
    $("#certificateForm").validate({
      // debug: true,
      rules: {
        certificateName: {
          required: true,
        },
        issuedBy: {
          required: true,
        },
        certificatedOn: {
          required: true,
        }
      }
    });
    $("#certificateForm"+this.props.indexValue).validate({
      // debug: true,
      rules: {
        certificateName: {
          required: true,
        },
        issuedBy: {
          required: true,
        },
        certificatedOn: {
          required: true,
        }
      }
    });  
    $('#editCertificateForm'+this.props.indexValue).validate({
      // debug: true,
      rules: {
        certificateName: {
          required: true,
        },
        issuedBy: {
          required: true,
        },
        certificatedOn: {
          required: true,
        }
      }
    });      
  }
  addCertificate(event){
  	event.preventDefault();
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
    var id  = Meteor.userId();
   var certificateObj = UserProfile.findOne({}, {sort: {'certificates.certificateId': -1}});
      // console.log("addressObj",addressObj);
    if(certificateObj){
     if (certificateObj.certificates) {
        if (certificateObj.certificates.length > 0 ) {
          var lastelem    = _.last(certificateObj.certificates);
          var certificateId =  parseInt(lastelem.certificateId) + 1;
        }else{
        var certificateId =  1;
        }
      }else{
        var certificateId =  1;
      }
    }
  	var certificates = {
        "certificateId"   : certificateId,
        "certificateName" : this.refs.certificateName.value,
        "issuedBy"        : this.refs.issuedBy.value,
        "certificatedOn"  : this.refs.certificatedOn.value,
        "validTill"       : this.refs.validTill.value,
        "proofOfCertificate"        : imgLink,
        "certFileName"              : fileName,
        "certFileExt"               : fileExt,
        "verifiedStatus"            : "Not Verified",
        "editStatus"                : "Open",
  	}
    if(this.refs.certificateName.value != ''){
      if($('#certificateForm').valid()){
        Meteor.call('addCertificates',id,certificates,function(error,result) {
          if (error) {
            console.log(error.reason);
          }else{
            // swal("Done","Certification details added!"); 
            $(event.target).parent().parent().find('.effect-21').removeClass('has-content');
            if($('#nocontent').hasClass('in active')){
              $('html, body').animate({
                'scrollTop' : $(".profileBody").position().top
              });
              $('#nocontent').removeClass('in active');
              $('.nocontent').removeClass('active');
              $('#menu5').addClass('in active');
              $('.menu5').addClass('active');  
            }else{
              $('#certificateinfo').modal('hide');
            }     
            $('#certificateName').val('');
            $('#issuedBy').val('');
            $('#certificatedOn').val('');
            $('#validTill').val('');
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
      }else{
        $(event.target).parent().parent().find('.effect-21.error:first').focus();
        $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
      }
    }else{
      Meteor.call('addCertificates',id,certificates,function(error,result) {
        if (error) {
          console.log(error.reason);
        }else{
          // swal("Done","Certification details added!");
          $(event.target).parent().parent().find('.effect-21').removeClass('has-content');
          if($('#nocontent').hasClass('in active')){
            $('html, body').animate({
              'scrollTop' : $(".profileBody").position().top
            });
            $('#nocontent').removeClass('in active');
            $('.nocontent').removeClass('active');
            $('#menu5').addClass('in active');
            $('.menu5').addClass('active');  
          }else{
            $('#certificateinfo').modal('hide');
          }   
          $('#certificateName').val('');
          $('#issuedBy').val('');
          $('#certificatedOn').val('');
          $('#validTill').val('');
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
  }
  editCertificate(event){
  	event.preventDefault();
  	var index   = $(event.target).attr('data-index');
    var id      = Meteor.userId();
    var certificateId = this.state.certificateId;
    if(this.props.certificateValues){
      if(this.props.certificateValues.proofOfCertificate){
        var imgLink = this.props.certificateValues.proofOfCertificate;
        var fileName = this.props.certificateValues.certFileName;
        var fileExt = this.props.certificateValues.certFileExt;
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
    var certificates = {
        "certificateId"    : certificateId,
        "certificateName" : this.refs.certificateName.value,
        "issuedBy"        : this.refs.issuedBy.value,
        "certificatedOn"  : this.refs.certificatedOn.value,
        "validTill"       : this.refs.validTill.value,
        "proofOfCertificate"        : imgLink,
        "certFileName"              : fileName,
        "certFileExt"               : fileExt,
        "verifiedStatus"            : "Not Verified",
        "editStatus"                : "Open",
  	}
    if(this.refs.certificateName.value != ''){
      if(this.props.certificateForm){
        if($('#editCertificateForm'+index).valid()){
          // console.log('true');
          Meteor.call('updateCertificate',id,certificates,index,function (error,result) {
            if(error){
                console.log(error.reason);
              }else{
                // swal("Done","Certificate updated successfully!","success");
                $('#editcertificateinfo-'+index).modal('hide');
                $('#editCertificateInfo-'+index).modal('hide');
                Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
                  if (error) {
                   console.log(error.reason);
                  }else{  
                  }
                });   
            }
          });  
        }else{
          $(event.target).parent().parent().find('.effect-21.error:first').focus();
          $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
        }
      }else if($('#certificateForm'+index).valid()){
        Meteor.call('updateCertificate',id,certificates,index,function (error,result) {
          if(error){
              console.log(error.reason);
            }else{
              // swal("Done","Certificate updated successfully!","success");
              $('#editcertificateinfo-'+index).modal('hide');
              $('#editCertificateInfo-'+index).modal('hide');
              Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
                if (error) {
                 console.log(error.reason);
                }else{  
                }
              });   
          }
        });
      }else{
        $(event.target).parent().parent().find('.effect-21.error:first').focus();
        $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
      }
    }else{
      Meteor.call('updateCertificate',id,certificates,index,function (error,result) {
       if(error){
          console.log(error.reason);
        }else{
          // swal("Done","Certificate updated successfully!","success");
          $('#editcertificateinfo-'+index).modal('hide');
          $('#editCertificateInfo-'+index).modal('hide');
          Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
            if (error) {
             console.log(error.reason);
            }else{  
            }
          });           
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
        var prooftype = "certificates";
        var ext = fileName.split('.').pop();
        $(event.target).parent().parent().find('.selectWidthProEdu').css({'fontSize':'13px','marginBottom':'0px'});
        $(event.target).parent().parent().find('.selectWidthProEdu').find('label').css({'fontSize':'13px','fontWeight':'100'});
        $(event.target).parent().siblings('.procertFileName').css({'display':'block','marginTop':'1px','marginBottom':'0px','fontSize':'13px','fontWeight':'100',});
        $(event.target).parent().siblings('.procertFileName').siblings('.nopadLeft').css('marginTop','0px');
        $(event.target).parent().siblings('.procertFileName').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').removeClass('error');
            $(event.target).parent().siblings('.educationProgressDiv').children('#errorProofProEdu').html('');
            $(event.target).parent().siblings('.procertFileName').css('border','0px');
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
    $('#editcertificateinfo-'+index).animate({
      'scrollTop' : 0
    });
    // $('#acadamicinfo').animate({
    //   'scrollTop' : 0
    // });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#certificateProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#certificateProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#certificateProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#certificateProofModals').css('display','block');
    }
  }
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#certificateProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#certificateProofModals').css('display','none');
  }

  render(){
    // console.log("userId",this.props.userId);
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
        <form className="basicForm" id={this.props.certificateForm ? "editCertificateForm" + this.props.indexValue : this.props.certificateValues ? "certificateForm" + this.props.indexValue : "certificateForm"}>
        	<div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
	          <div className="input-effect input-group">
	            <span className="input-group-addon addons"><i className="fa fa-certificate" aria-hidden="true"></i></span>
	            <input type="text" className={this.state.certificateName ? this.state.certificateName != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="certificateName" name="certificateName" ref="certificateName"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.certificateName}/>
	            <label>Certificate Name</label>
	            <span className="focus-border">
	              <i></i>
	            </span> 
	          </div>
	        </div>
	        <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
	          <div className="input-effect input-group">
	            <span className="input-group-addon addons"><i className="fa fa-university" aria-hidden="true"></i></span>
	            <input type="text" className={this.state.issuedBy ? this.state.issuedBy != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="issuedBy" name="issuedBy" ref="issuedBy"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.issuedBy}/>
	            <label>Issued By</label>
	            <span className="focus-border">
	              <i></i>
	            </span> 
	          </div>
	        </div>
	        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
	          <div className="input-effect input-group">
	            <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
	            <input type="date" className={this.state.certificatedOn ? this.state.certificatedOn != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="certificatedOn" name="certificatedOn" ref="certificatedOn"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.certificatedOn}/>
	            <label>Certificated On</label>
	            <span className="focus-border">
	              <i></i>
	            </span> 
	          </div>
	        </div>
	        <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
	          <div className="input-effect input-group">
	            <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
	            <input type="date" className={this.state.validTill ? this.state.validTill != '' ? "effect-21 form-control loginInputs has-content" : "effect-21 form-control loginInputs" : "effect-21 form-control loginInputs"} id="validTill" name="validTill" ref="validTill"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)} value={this.state.validTill}/>
	            <label>Valid Till</label>
	            <span className="focus-border">
	              <i></i>
	            </span> 
	          </div>
	        </div>
	        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            {
              !this.props.proofData.imageLink && !this.props.certificateValues ?
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthProEdu">
                    <div className="input-effect input-group">
                      <label className="empLabelMarTop">Proof of Certificate</label>&nbsp;&nbsp;
                    </div>
                  </div>
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 procertFileName" style={{display: "none"}}>
                    <div className="input-effect input-group">
                      <label></label>
                    </div>
                  </div>
                  <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft">
                    <input type="file" className="btn btn-info inputFiles" data-subtype="certificate" onChange={this.uploadProofDocs.bind(this)}/>
                    <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                    <div id="errorProofProEdu"></div>
                    {this.getUploadImagePercentage()}
                  </div>
                </div>
              : 
              this.props.certificateValues ?
                this.props.certificateValues.proofOfCertificate ?
                <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
                  {
                    this.props.certificateValues.certFileExt == 'jpg' || this.props.certificateValues.certFileExt == 'png' || this.props.certificateValues.certFileExt == 'jpeg' ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding" style={{height: "200"+"px"}}>
                        <a href=""><img className="img" data-index={this.props.indexValue} onClick={this.employementModal.bind(this)} src={this.props.certificateValues.proofOfCertificate} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.certificateValues.proofOfCertificate} data-name={this.props.certificateValues.certFileName} data-ext={this.props.certificateValues.certFileExt} data-index={this.props.indexValue} data-subtype="editCertificate"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                      <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.certificateValues.certFileName}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.certificateValues.proofOfCertificate} data-name={this.props.certificateValues.certFileName} data-ext={this.props.certificateValues.certFileExt} data-index={this.props.indexValue} data-subtype="editCertificate"></i>
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
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editCertificate"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                      <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editCertificate"></i>
                    </div>
                  }   
                </div>  
              :
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthProEdu">
                    <div className="input-effect input-group">
                      <label className="empLabelMarTop">Proof of Certificate</label>&nbsp;&nbsp;
                    </div>
                  </div>
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 procertFileName" style={{display: "none"}}>
                    <div className="input-effect input-group">
                      <label></label>
                    </div>
                  </div>
                  <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft">
                    <input type="file" className="btn btn-info inputFiles" data-subtype="editCertificate" onChange={this.uploadProofDocs.bind(this)}/>
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
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="certificate"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                      <a href="" onClick={this.employementModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="certificate"></i>
                    </div>
                  }   
                </div>  
              :
              <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 selectWidthProEdu">
                  <div className="input-effect input-group">
                    <label className="empLabelMarTop">Proof of Certificate</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 procertFileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="certificate" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton" onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress educationProgressDiv" style={{display: "none"}}>
                  <div id="errorProofProEdu"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
            }
          </div>
          <div className="modal fade" id="certificateProofModals" role="dialog">
            <div className="modal-dialog">
              <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                    { 
                      this.props.certificateValues ?
                        this.props.certificateValues.proofOfCertificate ?
                          this.props.certificateValues.certFileExt == 'jpg' || this.props.certificateValues.certFileExt == 'png' || this.props.certificateValues.certFileExt == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <img src={this.props.certificateValues.proofOfCertificate} style={{width: "100"+"%"}} />
                            </div>
                          :
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <iframe src={this.props.certificateValues.proofOfCertificate} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
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
	        <button type="submit" onClick={this.props.certificateValues ? this.editCertificate.bind(this) : this.addCertificate.bind(this)} data-index={this.props.indexValue} className="btn btn-info pull-right col-lg-4">Save</button>
        </form>
      </div>
    );
  }
}
EditPageContainer = withTracker(({props}) => {
  var _id          = Meteor.userId();
  const postHandle = Meteor.subscribe('TempProofDocs',_id);
  var proofData = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'certificates','proofSubtype':'certificate'}) || {};
  var proofObj = TempProofDocs.findOne({"userId":Meteor.userId(),"prooftype":'certificates','proofSubtype':'editCertificate'}) || {};
  // console.log("session proof obj:",proofData);
  const loading   = !postHandle.ready();
  return {
    loading,
    proofData,
    proofObj,
  };
})(Certificate);
export default EditPageContainer;