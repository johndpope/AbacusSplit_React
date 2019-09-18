import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { TempProofDocs } from "./api/userProfile.js";
import { UserProfile } from "./api/userProfile.js";

class AddressForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={
      'line1'           : '',
      'line2'           : '',
      'line3'           : '',
      'landmark'        : '',
      'city'            : '',
      'state'           : '', 
      'country'         : '',
      'pincode'         : '',
      'residingFrom'    : '',  
      'residingTo'      : '',
      'tempLine1'       : '',
      'tempLine2'       : '',
      'tempLine3'       : '',
      'tempLandmark'    : '',
      'tempCity'        : '',
      'tempState'       : '',
      'tempCountry'     : '',
      'tempPincode'     : '',
      'tempresidingFrom': '',
      'tempresidingTo'  : '',
      // "proofData"       : {},
      "subscription" : {
        "userProfileData" : Meteor.subscribe("userProfileData"),
        // "LatestTempProofDocs" : Meteor.subscribe("LatestTempProofDocs"),
        // "userData" : Meteor.subscribe("userData",Meteor.userId()),
      }
    };
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
  
  currentAddress(event){
    if($('input[name="sameAsPermanent"]').is(':checked')){
      $('input[name="sameAsPermanent"]').attr('checked', true);
      $('#tempLine1').attr('value',this.refs.line1.value);
      $('#tempLine2').attr('value',this.refs.line2.value);
      $('#tempLine3').attr('value',this.refs.line3.value);
      $('#tempLandmark').attr('value',this.refs.landmark.value);
      $('#tempCity').attr('value',this.refs.city.value);
      $('#tempState').attr('value',this.refs.state.value);
      $('#tempCountry').attr('value',this.refs.country.value);
      $('#tempPincode').attr('value',this.refs.pincode.value);
      $('#tempresidingFrom').attr('value',this.refs.residingFrom.value);
      $('#tempresidingTo').attr('value',this.refs.residingTo.value);
      var residingTo = $('input[name=residingToDate]:checked').val();
      if(this.refs.residingTo.value != ''){
        $('#tempResidingToDate').css('display','block');
        $('input[name=tempResidingToDate]').parent().parent().parent().css('display','none');       
      }else{
        if(residingTo == 'stillLivingHere'){
          $('input[name=tempResidingToDate]:first').attr('checked', true);        
        }
      }
      if(this.props.proofObj.imageLink){
        var imgLink = this.props.proofObj.imageLink;
        var imgName = this.props.proofObj.name;
        var imgExt = this.props.proofObj.ext;
        // console.log(imgLink + '||' + imgName + '||' + imgExt);
        Meteor.call("addCurrentAddressTempDocs",imgLink,imgName,imgExt,(error, result)=>{
          if (error) {
             console.log(error.reason);
          }else{
          }
        });
      }
      if(this.refs.tempLine1.value !=''){
        $('#tempLine1').addClass('has-content');
      } 
      if(this.refs.tempLine2.value !=''){
        $('#tempLine2').addClass('has-content');
      }
      if(this.refs.tempLine3.value !=''){
        $('#tempLine3').addClass('has-content');
      }
      if(this.refs.tempLandmark.value !=''){
        $('#tempLandmark').addClass('has-content');
      }
      if(this.refs.tempCity.value !=''){
        $('#tempCity').addClass('has-content');
      }
      if(this.refs.tempState.value !=''){
        $('#tempState').addClass('has-content');
      }
      if(this.refs.tempCountry.value !=''){
        $('#tempCountry').addClass('has-content');
      }
      if(this.refs.tempPincode.value !=''){
        $('#tempPincode').addClass('has-content');
      }
      if(this.refs.tempresidingFrom.value !=''){
        $('#tempresidingFrom').addClass('has-content');
      }
      if(this.refs.tempresidingTo.value !=''){
        $('#tempresidingTo').addClass('has-content');
      }
    }else{
      $('input[name="sameAsPermanent"]').attr('checked', false);
      $('#tempLine1').attr('value','');
      $('#tempLine2').attr('value','');
      $('#tempLine3').attr('value','');
      $('#tempLandmark').attr('value','');
      $('#tempCity').attr('value','');
      $('#tempState').attr('value','');
      $('#tempCountry').attr('value','');
      $('#tempPincode').attr('value','');
      $('#tempresidingFrom').attr('value','');
      $('#tempresidingTo').attr('value','');
      $('.currentAddrContent').find('input.effect-21').removeClass('has-content');
      $('input[name=tempResidingToDate]').attr('checked', false);
      $('#tempResidingToDate').css('display','none');
      $('input[name=tempResidingToDate]').parent().parent().parent().css('display','block');
      var imgLink = this.props.proofData._id;
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
    }
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
  residingToChange(event){
    event.preventDefault();
    // console.log($(event.target));
    if($(event.target).hasClass('residingToChangeLabel')){
      $('#residingToDate').css('display','none');
      $('input[name=residingToDate]').parent().parent().parent().css('display','block'); 
    }else{
      $('#residingToDate').css('display','block');
      $('input[name=residingToDate]').parent().parent().parent().css('display','none');       
    }
  }
  tempResidingToChange(event){
    event.preventDefault();
    // console.log($(event.target));
    if($(event.target).hasClass('tempResidingToChangeLabel')){
      $('#tempResidingToDate').css('display','none');
      $('input[name=tempResidingToDate]').parent().parent().parent().css('display','block'); 
    }else{
      $('#tempResidingToDate').css('display','block');
      $('input[name=tempResidingToDate]').parent().parent().parent().css('display','none');       
    }
  }
  componentDidMount(){    
    $.validator.addMethod("regxA1", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Name should only contain letters & space.");

    $.validator.addMethod("regxA2", function(value, element, regexpr) {          
      return regexpr.test(value);
    }, "Please enter a valid pincode.");
          
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
  
    $("#addressForm").validate({
      rules: {
        city: {
          regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
        },
        state: {
          regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
        },
        country: {
          regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
        },
        pincode: {
          regxA2: /^[1-9][0-9]{5}$|^$/,
        },
        tempCity: {
          regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
        },
        tempState: {
          regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
        },
        tempCountry: {
          regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
        },
        tempPincode: {
          regxA2: /^[1-9][0-9]{5}$|^$/,
        }
      }
    });
  }
  submitPermanantAddress(event){
    event.preventDefault();
    if(this.props.proofObj){
      if(this.props.proofObj.proofSubtype == 'permanentAddress'){
        var imgLink = this.props.proofObj.imageLink;
        var fileName = this.props.proofObj.name;
        var fileExt = this.props.proofObj.ext;
      }
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }

    if(this.refs.residingTo.value){
      var residingToDate = this.refs.residingTo.value;
    }else{
      var residingToDate = "Present";
    } 
    if($('#addressForm').valid()){
      var id   = Meteor.userId();
      var addressObj = UserProfile.findOne({}, {sort: {'permanentAddress.permanentAddressId': -1}});
      // console.log("addressObj",addressObj);
      if(addressObj){
        if (addressObj.permanentAddress) {
          if (addressObj.permanentAddress.length > 0) {
             var lastelem           = _.last(addressObj.permanentAddress);
             var permanentAddressId =  parseInt(lastelem.permanentAddressId) + 1;
          }else{
            var permanentAddressId =  1;
          }
        }
        else{
          var permanentAddressId =  1;
        }
      }
      var permanentAddress = {
        "permanentAddressId": permanentAddressId,
        "line1"          : this.refs.line1.value,
        "line2"          : this.refs.line2.value,
        "line3"          : this.refs.line3.value,
        "landmark"       : this.refs.landmark.value,
        "city"           : this.refs.city.value,
        "state"          : this.refs.state.value,
        "country"        : this.refs.country.value,
        "pincode"        : this.refs.pincode.value,
        "residingFrom"   : this.refs.residingFrom.value,
        "residingTo"     : residingToDate,
        "createdAt"      : new Date(),
        "proofOfPermanentAddr"         : imgLink,
        "perAddrFileName"              : fileName,
        "perAddrFileExt"               : fileExt,
        "verifiedStatus" : "Not Verified",
        "editStatus"     : "Open"
      }
      Meteor.call('insertPermanantAddress',id,permanentAddress,function (error,result) {
       if(error){
          console.log(error.reason);
        }else{
          // swal("Done","Permanent Address added successfully!","success");   
          $("#line1").val("");  
          $("#line2").val("");
          $("#line3").val("");  
          $("#landmark").val("");  
          $("#city").val("");  
          $("#state").val("");  
          $("#country").val("");  
          $("#pincode").val("");  
          $("#residingFrom").val("");  
          $("#residingTo").val("");  
        }
      });
      var imgId = this.props.proofObj._id;
      Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{  
        }
      }); 
    }else{
      // console.log('false');
      $(event.target).parent().parent().find('.effect-21.error:first').focus();
      $(event.target).parent().parent().find('.effect-21.error').addClass('has-content');
    }
  }
  submitTemporaryAddress(event){
    event.preventDefault(); 
    if(this.props.proofData){
      if(this.props.proofData.proofSubtype == 'currentAddress'){
        var imgLink = this.props.proofData.imageLink;
        var fileName = this.props.proofData.name;
        var fileExt = this.props.proofData.ext;
      }
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }
    if(this.refs.tempresidingTo.value){
      var tempResidingToDate = this.refs.tempresidingTo.value;
    }else{
      var tempResidingToDate = "Present";
    } 
    // console.log('tempResidingToDate: ',tempResidingToDate);
    var id   = Meteor.userId();
    var addressObj = UserProfile.findOne({}, {sort: {'currentAddress.currentAddressId': -1}});
    // console.log("addressObj",addressObj);
    if(addressObj){
      if (addressObj.currentAddress) {
        if (addressObj.currentAddress.length > 0) {
          var lastelem           = _.last(addressObj.currentAddress);
          var currentAddressId =  parseInt(lastelem.currentAddressId) + 1;
        }else{
          var currentAddressId =  1;
        }
      }
      else{
        var currentAddressId =  1;
      }
    }
    var currentAddress = {
      "currentAddressId"   : currentAddressId,
      "tempLine1"          : this.refs.tempLine1.value,
      "tempLine2"          : this.refs.tempLine2.value,
      "tempLine3"          : this.refs.tempLine3.value,
      "tempLandmark"       : this.refs.tempLandmark.value,
      "tempCity"           : this.refs.tempCity.value,
      "tempState"          : this.refs.tempState.value,
      "tempCountry"        : this.refs.tempCountry.value,
      "tempPincode"        : this.refs.tempPincode.value,
      "tempresidingFrom"   : this.refs.tempresidingFrom.value,
      "tempresidingTo"     : tempResidingToDate,
      "createdAt"          : new Date(),
      "proofOfCurrentAddr" : imgLink,
      "currAddrFileName"   : fileName,
      "currAddrFileExt"    : fileExt,
      "verifiedStatus"     : "Not Verified",
      "editStatus"         : "Open"
    }
    Meteor.call('insertTemporaryAddress',id,currentAddress,function (error,result) {
     if(error){
        console.log(error.reason);
      }else{
        // swal("Done","Current Address added successfully!","success");
        $('html, body').animate({
          'scrollTop' : $(".profileBody").position().top
        });
        $('#menu1').removeClass('in active');
        $('.menu1').removeClass('active');
        $('#menu2').addClass('in active');
        $('.menu2').addClass('active'); 
        $("#tempLine1").val("");  
        $("#tempLine2").val("");
        $("#tempLine3").val("");
        $("#tempLandmark").val("");  
        $("#tempCity").val("");  
        $("#tempState").val("");  
        $("#tempCountry").val("");  
        $("#tempPincode").val("");  
        $("#tempresidingFrom").val("");  
        $("#tempresidingTo").val("");   
      }
    });
    var imgId = this.props.proofData._id;
    Meteor.call("removeTempProofDocs",imgId,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
      }
    }); 
  }
  inputFileChange(event){
    event.preventDefault();
    $(event.target).siblings('.inputFiles').click();
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
        var prooftype = "address";
        var ext = fileName.split('.').pop();
        if(proofSubtype == "permanentAddress"){
          $(event.target).parent().parent().find('.perAddrselWidth').css({'marginTop':'-2px','fontSize':'13px','marginBottom':'0px'});
          $(event.target).parent().parent().find('.perAddrselWidth').find('label').css('fontWeight','100');
          $(event.target).parent().siblings('.perAddrfileName').css({'display':'block','marginTop':'1px','marginBottom':'0px','fontSize':'13px','fontWeight':'100',});
          $(event.target).parent().siblings('.perAddrfileName').siblings('.nopadLeft').css('marginTop','0px');
          $(event.target).parent().siblings('.perAddrfileName').find('label').html(file.name);
        }else{
          $(event.target).parent().parent().find('.currAddrselWidth').css({'marginTop':'-2px','fontSize':'13px','marginBottom':'0px'});
          $(event.target).parent().parent().find('.currAddrselWidth').find('label').css('fontWeight','100');
          $(event.target).parent().siblings('.currAddrfileName').css({'display':'block','marginTop':'1px','marginBottom':'0px','fontSize':'13px','fontWeight':'100',});
          $(event.target).parent().siblings('.currAddrfileName').siblings('.nopadLeft').css('marginTop','0px');
          $(event.target).parent().siblings('.currAddrfileName').find('label').html(file.name);
        }
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){ 
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);   
            if(proofSubtype == "permanentAddress"){
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').removeClass('error');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('');
              $(event.target).parent().siblings('.perAddrfileName').css('border','0px');
              $(event.target).parent().parent().find('.perAddrselWidth').css('marginTop','10px');
            }else{
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').removeClass('error');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').html('');
              $(event.target).parent().siblings('.currAddrfileName').css('border','0px');
              $(event.target).parent().parent().find('.currAddrselWidth').css('marginTop','10px');
            }  
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
          }else{
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
            if(proofSubtype == "permanentAddress"){
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').addClass('error');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('<p>Document size should not exceed file size limit 2MB.</p>');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
            }else{
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').addClass('error');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').html('<p>Document size should not exceed file size limit 2MB.</p>');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
            }
          } 
        }else{
          $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
          if(proofSubtype == "permanentAddress"){
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').addClass('error');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('<p>Only jpg, png, pdf format is supported.</p>');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
          }else{
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').addClass('error');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').html('<p>Only jpg, png, pdf format is supported.</p>');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#currAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
          }
        }
      }
    }
  }
  removeProofDocs(event){
    event.preventDefault();
    var imgLink = $(event.target).attr('data-value');
    // console.log("imgLink",imgLink);
    var proofSubtype = $(event.target).attr('data-subtype');
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
        if(proofSubtype == "permanentAddress"){
          $(event.target).parent().parent().parent().find('.perAddrselWidth').find('label').css({'marginTop':'15px','fontSize':'14px','fontWeight':'700'});
        }else{
          $(event.target).parent().parent().parent().find('.currAddrselWidth').find('label').css({'marginTop':'15px','fontSize':'14px','fontWeight':'700'});
        }
      }
    });
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
  render(){
    return(
      <form className="addressForm basicForm" id="addressForm">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userAddress">
          <p>
            Permanent Address
          </p>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs required" id="line1" name="line1" ref="line1" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line1</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="line2" name="line2" ref="line2" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line2</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="line3" name="line3" ref="line3" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line3</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="landmark" name="landmark" ref="landmark" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Landmark</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs has-content" id="country" name="country" ref="country" value="India" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Country</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="state" name="state" ref="state" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>State</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="city" name="city" ref="city" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>City</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="pincode" name="pincode" ref="pincode" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Pincode</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div> 
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className="effect-21 form-control loginInputs required" id="residingFrom" name="residingFrom" ref="residingFrom" onChange={this.handleChange}/>
              <label className="">Residing From</label>
              <span className="focus-border"><i></i></span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <label className="residingDateSelect">Residing To</label>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 residingToRadio">
              <label className="radio"><input checked="checked" type="radio" name="residingToDate" onChange={this.handleChange} value="stillLivingHere" ref="" />Still living here</label>
              <label className="radio"><input type="radio" name="residingToDate" value="selectToDate" onChange={this.handleChange}  ref="" onClick={this.residingToChange.bind(this)}/>Select to date</label>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" id="residingToDate">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className="effect-21 form-control loginInputs required" id="residingTo" name="residingTo" ref="residingTo" onChange={this.handleChange}/>
              <label className="">Residing To</label>
              <span className="focus-border"><i></i></span>
            </div>
            <span className="residingToChangeLabel pull-right fa fa-angle-double-left fa-lg" onClick={this.residingToChange.bind(this)}></span>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
            {
              !this.props.proofObj.imageLink ?
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 perAddrselWidth">
                  <div className="input-effect input-group">
                    <label className="" style={{fontSize : "14" + "px"}}>Proof of Permanent Address</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 perAddrfileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft perAddrBrowseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="permanentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                  <div id="perAddrErrorProof"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
              :
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                { 
                  this.props.proofObj.imageLink ?
                    this.props.proofObj.ext == 'jpg' || this.props.proofObj.ext == 'png' || this.props.proofObj.ext == 'jpeg' ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                        <a href="" data-toggle="modal" data-target="#perAddrProofModals"><img src={this.props.proofObj.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="permanentAddress"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                      <a href="" data-toggle="modal" data-target="#perAddrProofModals"><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="permanentAddress"></i>
                    </div>
                  :
                  ""
                }
              </div>
            }
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">   
          </div> 
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <button type="submit" className="btn btn-info  pull-right" onClick={this.submitPermanantAddress.bind(this)} >Save</button>
        </div>
        {/*<hr className="col-lg-11 col-md-12 col-sm-12 col-xs-12"/>*/}
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 userAddress">
          <p>
            Current Address 
            <span>
              <input type="checkbox" name="sameAsPermanent" value="" onChange={this.currentAddress.bind(this)}/> &nbsp; Same as permanent address
            </span>
          </p>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 currentAddrContent">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempLine1" name="tempLine1" ref="tempLine1"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line1</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempLine2" name="tempLine2" ref="tempLine2"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line2</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempLine3" name="tempLine3" ref="tempLine3"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line3</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempLandmark" name="tempLandmark" ref="tempLandmark" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Landmark</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempCountry" name="tempCountry" ref="tempCountry" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Country</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempState" name="tempState" ref="tempState" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>State</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempCity" name="tempCity" ref="tempCity"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>City</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control loginInputs" id="tempPincode" name="tempPincode" ref="tempPincode" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Pincode</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className="effect-21 form-control loginInputs" id="tempresidingFrom" name="tempresidingFrom" ref="tempresidingFrom" onChange={this.handleChange} />
              <label className="">Residing From</label>
              <span className="focus-border"><i></i></span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <label className="residingDateSelect">Residing To</label>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 residingToRadio">
              <label className="radio"><input checked="checked" type="radio" name="tempResidingToDate" value="stillLivingHere" onChange={this.handleChange} ref="" />Still living here</label>
              <label className="radio"><input type="radio" name="tempResidingToDate" value="selectToDate" onChange={this.handleChange} ref="" onClick={this.tempResidingToChange.bind(this)}/>Select to date</label>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" id="tempResidingToDate">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className="effect-21 form-control loginInputs" id="tempresidingTo" name="tempresidingTo" ref="tempresidingTo" onChange={this.handleChange} />
              <label className="">Residing To</label>
              <span className="focus-border"><i></i></span>
            </div>
            <span className="tempResidingToChangeLabel pull-right fa fa-angle-double-left fa-lg" onClick={this.tempResidingToChange.bind(this)}></span>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
            {
              !this.props.proofData.imageLink ?
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 currAddrselWidth">
                  <div className="input-effect input-group">
                    <label className="" style={{fontSize : "14" + "px"}}>Proof of Current Address</label>&nbsp;&nbsp;
                  </div>
                </div>
                <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 currAddrfileName" style={{display: "none"}}>
                  <div className="input-effect input-group">
                    <label></label>
                  </div>
                </div>
                <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 nopadLeft perAddrBrowseButton">
                  <input type="file" className="btn btn-info inputFiles" data-subtype="currentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                  <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                  <div id="currAddrErrorProof"></div>
                  {this.getUploadImagePercentage()}
                </div>
              </div>
              :
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                { 
                  this.props.proofData.imageLink ?
                    this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                        <a href="" data-toggle="modal" data-target="#perAddrProofModals"><img src={this.props.proofData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="currentAddress"></i>
                      </div>
                    : 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                      <a href="" data-toggle="modal" data-target="#perAddrProofModals"><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                      <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="currentAddress"></i>
                    </div>
                  :
                  ""
                }
              </div>
            }
          </div> 
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <button type="submit" className="btn btn-info pull-right"  onClick={this.submitTemporaryAddress.bind(this)}>Save</button>
        </div>
        <div className="modal fade" id="perAddrProofModals" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  { 
                    this.props.proofData.imageLink ?
                      this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <img src={this.props.proofData.imageLink} style={{width: "100"+"%"}} />
                        </div>
                      :
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <iframe src={this.props.proofData.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
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
AddAddressContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
    var _id = Meteor.userId();
    const proofObj  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
    // console.log("proofObj" ,proofObj);
    const proofData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
    // console.log("proofData" ,proofData);
    const loading       = !postHandle.ready();
    return {
      loading,
      proofObj,
      proofData,
    };
})(AddressForm);

export default AddAddressContainer;