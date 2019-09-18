import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { TempProofDocs } from "./api/userProfile.js";
import { UserProfile } from "./api/userProfile.js";

class PermanentAddress extends TrackerReact(Component){
  constructor(props){
    super(props);
     if(this.props.permanentAddressValues){
      this.state ={ 
          'permanentAddressId' : this.props.permanentAddressValues.permanentAddressId,
          'line1'           : this.props.permanentAddressValues.line1,
          'line2'           : this.props.permanentAddressValues.line2,
          'line3'           : this.props.permanentAddressValues.line3,
          'landmark'        : this.props.permanentAddressValues.landmark, 
          'city'            : this.props.permanentAddressValues.city,
          'state'           : this.props.permanentAddressValues.state, 
          'country'         : this.props.permanentAddressValues.country,
          'pincode'         : this.props.permanentAddressValues.pincode,
          'residingFrom'    : this.props.permanentAddressValues.residingFrom,  
          'residingTo'      : this.props.permanentAddressValues.residingTo,
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
    this.state ={
          'permanentAddressId' : '',
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
      if($('.effect-21').hasClass('error')){
        $(event.target).find('.effect-21.error').addClass('has-content');  
      }else{
        $(event.target).removeClass("has-content");
      }
    }
  }
  residingToChange(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    // console.log($(event.target));
    if($(event.target).hasClass('residingToChangeLabel')){
      $('#residingToOfAddress'+index).css('display','none');
      $('#residingToDate'+index).css('display','none');
      $('input[name=residingToDate]').parent().parent().parent().css('display','block'); 
    }else{
      $('#residingToOfAddress'+index).css('display','block');
      $('#residingToDate'+index).css('display','block');
      $('input[name=residingToDate]').parent().parent().parent().css('display','none');       
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
  
    $("#addPermanentAddressForm").validate({
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
        }
      }
    });
    $("#permanentAddressForm-"+this.props.indexVal).validate({
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
        }
      }
    });
  }
  editPermanantAddress(event){
    event.preventDefault(); 
    // console.log("residingTo",residingTo);
    var id                = this.props.id;
    var permAddressId     = $(event.currentTarget).attr('id');  
    var index             = $(event.currentTarget).attr('data-index');
    if($('#permanentAddressForm-'+index).valid()){
      if(this.props.permanentAddressValues.proofOfPermanentAddr){
        var imgLink = this.props.permanentAddressValues.proofOfPermanentAddr;
        var fileName = this.props.permanentAddressValues.perAddrFileName;
        var fileExt = this.props.permanentAddressValues.perAddrFileExt;
      }else if(this.props.proofPerAddrData.imageLink){
        var imgLink = this.props.proofPerAddrData.imageLink;
        var fileName = this.props.proofPerAddrData.name;
        var fileExt = this.props.proofPerAddrData.ext;
      }else{
        var imgLink = '';
        var fileName = '';
        var fileExt = '';
      }
      if(this.refs.residingTo.value){
        var residingTo = this.refs.residingTo.value;
      }else{
        var residingTo = "Present";
      }
      
      var selectedAddress = {
        "permanentAddressId" : permAddressId,
        "line1"          : this.refs.line1.value,
        "line2"          : this.refs.line2.value,
        "line3"          : this.refs.line3.value,
        "landmark"       : this.refs.landmark.value,
        "city"           : this.refs.city.value, 
        "state"          : this.refs.state.value,
        "country"        : this.refs.country.value,
        "pincode"        : this.refs.pincode.value,
        "residingFrom"   : this.refs.residingFrom.value,
        "residingTo"     : residingTo,
        "createdAt"      : new Date(),
        "proofOfPermanentAddr"         : imgLink,
        "perAddrFileName"              : fileName,
        "perAddrFileExt"               : fileExt,
      }
      // console.log("id",id);
      // console.log("permAddressId",permAddressId);
      // console.log("selectedAddress",selectedAddress);
      Meteor.call('editPermanantAddress',id,permAddressId,selectedAddress,function (error,result) {
       if(error){
          console.log(error.reason);
        }else{
          swal("Done","Permanent Address edited successfully!","success");   
          $('#permAddressModal-'+index).modal('hide');
          $('#permAddrModal-'+index).modal('hide');
          // $("#line1").val("");  
          // $("#line2").val("");
          // $("#line3").val("");  
          // $("#city").val("");  
          // $("#state").val("");  
          // $("#country").val("");  
          // $("#pincode").val("");  
          // $("#residingFrom").val("");  
          // $("#residingTo").val("");  
        }
      });
      var imgId = this.props.proofPerAddrData._id;
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
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#perAddrProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#perAddrProofModals').css('display','none');
  }
  submitPermanantAddress(event){
    event.preventDefault();
    if(this.props.proofPerAddrData){
      if(this.props.proofPerAddrData.proofSubtype == 'permanentAddress'){
        var imgLink = this.props.proofPerAddrData.imageLink;
        var fileName = this.props.proofPerAddrData.name;
        var fileExt = this.props.proofPerAddrData.ext;
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
    if($('#addPermanentAddressForm').valid()){
      var id   = Meteor.userId();
      var addressObj = UserProfile.findOne({}, {sort: {'permanentAddress.permanentAddressId': -1}});
      // console.log("addressObj",addressObj);
      if(addressObj){
        if (addressObj.permanentAddress) {
          var lastelem           = _.last(addressObj.permanentAddress);
          var permanentAddressId =  parseInt(lastelem.permanentAddressId) + 1;
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
          swal("Done","Permanent Address added successfully!","success");   
          $("#line1").val("");  
          $("#line2").val("");
          $("#line3").val("");  
          $("#city").val("");  
          $("#state").val("");  
          $("#country").val("");  
          $("#pincode").val("");  
          $("#residingFrom").val("");  
          $("#residingTo").val("");  
          $('#permaddAddressModal').modal('hide');
        }
      });
      var imgId = this.props.proofPerAddrData._id;
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
          $(event.target).parent().parent().find('.perAddrselWidth').css({'marginTop':'-2px','fontSize':'13px','marginBottom':'0px'});
          $(event.target).parent().parent().find('.perAddrselWidth').find('label').css('fontWeight','100');
          $(event.target).parent().siblings('.perAddrfileName').css({'display':'block','marginTop':'1px','marginBottom':'0px','fontSize':'13px','fontWeight':'100',});
          $(event.target).parent().siblings('.perAddrfileName').siblings('.nopadLeft').css('marginTop','0px');
          $(event.target).parent().siblings('.perAddrfileName').find('label').html(file.name);
        if(ext=="pdf" || ext=="jpg" || ext=="png" || ext=="jpeg"){
          if(fileSize < size){ 
            addProofToS3Function(userId,file,prooftype,proofSubtype,self);   
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').removeClass('error');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('');
              $(event.target).parent().siblings('.perAddrfileName').css('border','0px');
              $(event.target).parent().parent().find('.perAddrselWidth').css('marginTop','10px');  
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
          }else{
            $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').addClass('error');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('<p>Document size should not exceed file size limit 2MB.</p>');
              $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
            
          } 
        }else{
          $(event.target).parent().siblings('.perAddrProgressDiv').css('display','block');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').addClass('error');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').html('<p>Only jpg, png, pdf format is supported.</p>');
            $(event.target).parent().siblings('.perAddrProgressDiv').children('#perAddrErrorProof').css({'color':'#e40b0b','fontSize':'13px'});
        }
      }
    }
  }
   removeProofDocs(event){
    event.preventDefault();
    var imgLink = $(event.target).attr('data-value');
    // console.log("imgLink",imgLink);
    var proofSubtype = $(event.target).attr('data-subtype');
    var index = ($(event.target).attr('data-index')-1);
    if(index >= 0){
      var fileName = $(event.target).attr('data-name');
      var fileExt = $(event.target).attr('data-ext');
      // console.log(fileName + '||' + fileExt + '||' + index);
      Meteor.call("removeTempDocProofs",imgLink,fileName,fileExt,index,proofSubtype,(error, result)=>{
        if (error) {
         console.log(error.reason);
        }else{
          swal({
            position: 'top-right',
            type: 'success',
            title: 'Deleted Successfully',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }else{
      // console.log('true');
      Meteor.call("removeTempProofDocs",imgLink,(error, result)=>{
        if (error) {
           console.log(error.reason);
        }else{
          swal({
            position: 'top-right',
            type: 'success',
            title: 'Deleted Successfully',
            showConfirmButton: false,
            timer: 1500
          });
          if(proofSubtype == "editPermanentAddress"){
            $(event.target).parent().parent().parent().find('.perAddrselWidth').find('label').css({'marginTop':'15px','fontSize':'14px','fontWeight':'700'});
          }else{
            $(event.target).parent().parent().parent().find('.currAddrselWidth').find('label').css({'marginTop':'15px','fontSize':'14px','fontWeight':'700'});
          }
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
  perAddrModal(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    $('#permAddressModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#permAddrModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#permaddAddressModal').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#perAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#perAddrProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#perAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#perAddrProofModals').css('display','block');
    }
  }

  render() {
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.line1 ? "effect-21 form-control has-content loginInputs required" :"effect-21 form-control loginInputs required"} value={this.state.line1} id="line1" name="line1" ref="line1" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line1</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.line2 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.line2}  id="line2" name="line2" ref="line2" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line2</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.line3 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.line3} id="line3" name="line3" ref="line3" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line3</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.landmark ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.landmark} id="landmark" name="landmark" ref="landmark" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Landmark</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className="effect-21 form-control has-content loginInputs" id="country" name="country" ref="country" value="India" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Country</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.state ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.state} id="state" name="state" ref="state" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>State</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.city ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.city} id="city" name="city" ref="city" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>City</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.pincode ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.pincode} id="pincode" name="pincode" ref="pincode" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Pincode</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div> 
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className={this.state.residingFrom ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.residingFrom} id="residingFrom" name="residingFrom" ref="residingFrom" onChange={this.handleChange}/>
              <label className="">Residing From</label>
              <span className="focus-border"><i></i></span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" style={{display: this.state.residingTo != '' ? this.state.residingTo == "Present" ? "block" : "none" : 'block' }}>
            <label className="residingDateSelect">Residing To</label>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 residingToRadio">
              <label className="radio"><input checked="checked" type="radio" name="residingToDate" value="stillLivingHere" ref="" />Still living here</label>
              <label className="radio"><input type="radio" name="residingToDate" value="selectToDate"  ref="" onClick={this.residingToChange.bind(this)} data-index={this.props.indexVal}/>Select to date</label>
            </div>
          </div>
          <div style={{display: this.state.residingTo != '' ? this.state.residingTo == "Present" ? "none" : "block" : 'none' }} className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" id={this.state.residingTo != '' ? this.state.residingTo != 'Present' ? "residingToOfAddress" + this.props.indexVal: "residingToDate" + this.props.indexVal: "residingToDate" + this.props.indexVal}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className="effect-21 form-control loginInputs required" id="residingTo" name="residingTo" ref="residingTo" onChange={this.handleChange} value={this.state.residingTo}/>
              <label className="">Residing To</label>
              <span className="focus-border"><i></i></span>
            </div>
            <span className="residingToChangeLabel pull-right fa fa-angle-double-left fa-lg" onClick={this.residingToChange.bind(this)} data-index={this.props.indexVal}></span>
          </div>          
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
             {
              !this.props.proofPerAddrData.imageLink && !this.props.permanentAddressValues ?
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
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
                this.props.permanentAddressValues ?
                 this.props.permanentAddressValues.proofOfPermanentAddr ?
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                    { 
                      this.props.permanentAddressValues.proofOfPermanentAddr ?
                        this.props.permanentAddressValues.perAddrFileExt == 'jpg' || this.props.permanentAddressValues.perAddrFileExt == 'png' || this.props.permanentAddressValues.perAddrFileExt == 'jpeg' ?
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                            <a href=""><img src={this.props.permanentAddressValues.proofOfPermanentAddr} className="img" data-index={this.props.indexVal} onClick={this.perAddrModal.bind(this)}  style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                            <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.permanentAddressValues.proofOfPermanentAddr} data-ext={this.props.permanentAddressValues.perAddrFileExt} data-index={this.props.permanentAddressValues.permanentAddressId} data-name={this.props.permanentAddressValues.perAddrFileName} data-subtype="editPermanentAddress"></i>
                          </div>
                        : 
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                          <a href="" onClick={this.perAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.permanentAddressValues.perAddrFileName}</a>
                          <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.permanentAddressValues.proofOfPermanentAddr} data-ext={this.props.permanentAddressValues.perAddrFileExt} data-index={this.props.permanentAddressValues.permanentAddressId} data-name={this.props.permanentAddressId.perAddrFileName} data-subtype="editPermanentAddress"></i>
                        </div>
                      :
                      ""
                    }
                  </div>
                  :
                    this.props.proofObj.imageLink ?
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                      { 
                        this.props.proofObj.imageLink ?
                          this.props.proofObj.ext == 'jpg' || this.props.proofObj.ext == 'png' || this.props.proofObj.ext == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                              <a href=""><img src={this.props.proofObj.imageLink} className="img" data-index={this.props.indexVal} onClick={this.perAddrModal.bind(this)} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                              <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editPermanentAddress"></i>
                            </div>
                          : 
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                            <a href="" data-index={this.props.indexVal} onClick={this.perAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofObj.name}</a>
                            <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofObj._id} data-subtype="editPermanentAddress"></i>
                          </div>
                        :
                        ""
                      }
                    </div> 
                    :
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
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
                        <input type="file" className="btn btn-info inputFiles" data-subtype="editPermanentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                        <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                        <div id="perAddrErrorProof"></div>
                        {this.getUploadImagePercentage()}
                      </div>
                    </div>
                 :
                 this.props.proofPerAddrData.imageLink ?
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                  { 
                    this.props.proofPerAddrData.imageLink ?
                      this.props.proofPerAddrData.ext == 'jpg' || this.props.proofPerAddrData.ext == 'png' || this.props.proofPerAddrData.ext == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                          <a href=""><img className="img" onClick={this.perAddrModal.bind(this)} src={this.props.proofPerAddrData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                          <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofPerAddrData._id} data-subtype="permanentAddress"></i>
                        </div>
                      : 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                        <a href="" onClick={this.perAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofPerAddrData.name}</a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofPerAddrData._id} data-subtype="permanentAddress"></i>
                      </div>
                    :
                    ""
                  }
                </div>
                :
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup currAddrselWidth">
                    <div className="input-effect input-group">
                      <label className="" style={{fontSize : "14" + "px"}}>Proof of Permanent Address</label>&nbsp;&nbsp;
                    </div>
                  </div>
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup currAddrfileName" style={{display: "none"}}>
                    <div className="input-effect input-group">
                      <label></label>
                    </div>
                  </div>
                  <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 formGroup nopadLeft perAddrBrowseButton">
                    <input type="file" className="btn btn-info inputFiles" data-subtype="permanentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                    <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                    <div id="currAddrErrorProof"></div>
                    {this.getUploadImagePercentage()}
                  </div>
                </div>
              }
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">   
          </div> 
          <div className="modal fade" id="perAddrProofModals" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <button type="button" className="close" onClick={this.closeProofModals.bind(this)}>&times;</button>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        { this.props.permanentAddressValues ?
                          this.props.permanentAddressValues.proofOfPermanentAddr?
                             this.props.permanentAddressValues.perAddrFileExt == 'jpg' || this.props.permanentAddressValues.perAddrFileExt == 'png' || this.props.permanentAddressValues.perAddrFileExt == 'jpeg' ?
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <img src={this.props.permanentAddressValues.proofOfPermanentAddr} style={{width: "100"+"%"}} />
                              </div>
                            :
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <iframe src={this.props.permanentAddressValues.proofOfPermanentAddr} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
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
                        this.props.proofPerAddrData ?
                          this.props.proofPerAddrData.ext == 'jpg' || this.props.proofPerAddrData.ext == 'png' || this.props.proofPerAddrData.ext == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <img src={this.props.proofPerAddrData.imageLink} style={{width: "100"+"%"}} />
                            </div>
                          :
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <iframe src={this.props.proofPerAddrData.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                          </div>
                        :  
                        ""
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <button type="submit" className="btn btn-info  pull-right" data-index={this.props.indexVal} id={this.state.permanentAddressId} onClick={this.props.permanentAddressValues ? this.editPermanantAddress.bind(this) : this.submitPermanantAddress.bind(this)} >Save</button>
        </div>
         
      </div>
    );
  }
}
PermanentAddressContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
    var _id = Meteor.userId();
    const proofPerAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
    // console.log("proofPerAddrData" ,proofPerAddrData);
    const proofObj  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'editPermanentAddress'})|| {};
    // console.log("proofPerAddrData" ,proofPerAddrData);
    const loading       = !postHandle.ready();
    return {
      loading,
      proofPerAddrData,
      proofObj,
    };
})(PermanentAddress);

export default PermanentAddressContainer;