import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import { TempProofDocs } from "./api/userProfile.js";
import { UserProfile } from "./api/userProfile.js";

class CurrentAddress extends TrackerReact(Component){
  constructor(props){
    super(props);
    if(this.props.currentAddressValues){
      this.state ={ 
          'currentAddressId' : this.props.currentAddressValues.currentAddressId,
          'tempLine1'           : this.props.currentAddressValues.tempLine1,
          'tempLine2'           : this.props.currentAddressValues.tempLine2,
          'tempLine3'           : this.props.currentAddressValues.tempLine3,
          'tempLandmark'        : this.props.currentAddressValues.tempLandmark, 
          'tempCity'            : this.props.currentAddressValues.tempCity,
          'tempState'           : this.props.currentAddressValues.tempState, 
          'tempCountry'         : this.props.currentAddressValues.tempCountry,
          'tempPincode'         : this.props.currentAddressValues.tempPincode,
          'tempresidingFrom'    : this.props.currentAddressValues.tempresidingFrom,  
          'tempresidingTo'      : this.props.currentAddressValues.tempresidingTo,
       "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }else{
    this.state ={
        'currentAddressId' : '',
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
        "subscription" : {
          "userProfileData" : Meteor.subscribe("userProfileData"),
        }
      };
    }
    this.handleChange = this.handleChange.bind(this);
  }
  currAddrModal(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    $('#currentAddressModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#currAddrModal-'+index).animate({
      'scrollTop' : 0
    });
    $('#currentaddAddressModal').animate({
      'scrollTop' : 0
    });
    if($(event.target).hasClass('img')){
      $(event.target).parent().parent().parent().parent().siblings('#currAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().parent().siblings('#currAddrProofModals').css('display','block');
    }else{ 
      $(event.target).parent().parent().parent().siblings('#currAddrProofModals').addClass('in');
      $(event.target).parent().parent().parent().siblings('#currAddrProofModals').css('display','block');
    }
  }
  closeProofModal(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#currAddrProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#currAddrProofModals').css('display','none');
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
  tempResidingToChange(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    // console.log($(event.target));
    if($(event.target).hasClass('tempResidingToChangeLabel')){
      $('#tempResidingToDate'+index).css('display','none');
      $('#tempResidingToOfAddress'+index).css('display','none');
      $('input[name=tempResidingToDate]').parent().parent().parent().css('display','block'); 
    }else{
     $('#tempResidingToOfAddress'+index).css('display','block');
      $('#tempResidingToDate'+index).css('display','block');
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
  
    $("#addCurrentAddressForm").validate({
      rules: {
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
  editTemporaryAddress(event){
    event.preventDefault(); 
    var id   = this.props.id;
    if(this.refs.tempresidingTo.value){
      var tempresidingTo = this.refs.tempresidingTo.value;
    }else{
      var tempresidingTo = "Present";
    } 
    if(this.props.currentAddressValues.proofOfCurrentAddr){
      var imgLink = this.props.currentAddressValues.proofOfCurrentAddr;
      var fileName = this.props.currentAddressValues.currAddrFileName;
      var fileExt = this.props.currentAddressValues.currAddrFileExt;
    }else if(this.props.proofData.imageLink){
      var imgLink = this.props.proofData.imageLink;
      var fileName = this.props.proofData.name;
      var fileExt = this.props.proofData.ext;
    }else{
      var imgLink = '';
      var fileName = '';
      var fileExt = '';
    }
    var currentAddressId     = $(event.currentTarget).attr('id');      
    var index                = $(event.currentTarget).attr('data-index');
    // console.log("index",index);
    var selectedAddress = {

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
      "tempresidingTo"     : tempresidingTo,
      "createdAt"          : new Date(),
      "proofOfCurrentAddr"            : imgLink,
      "currAddrFileName"              : fileName,
      "currAddrFileExt"               : fileExt,
    }
    // console.log("selectedAddress",selectedAddress);
    Meteor.call('editCurrentAddress',id,currentAddressId,selectedAddress,function (error,result) {
     if(error){
        console.log(error.reason);
      }else{
        swal("Done","Current Address updated successfully!","success"); 
        $('#currentAddressModal-'+index).modal('hide');
        $('#currAddrModal-'+index).modal('hide');
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
  submitTemporaryAddress(event){
    event.preventDefault(); 
    if(this.props.proofCurrAddrData){
      if(this.props.proofCurrAddrData.proofSubtype == 'currentAddress'){
        var imgLink = this.props.proofCurrAddrData.imageLink;
        var fileName = this.props.proofCurrAddrData.name;
        var fileExt = this.props.proofCurrAddrData.ext;
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
    if($('#addCurrentAddressForm').valid()){
	    var id   = Meteor.userId();
	    var addressObj = UserProfile.findOne({}, {sort: {'currentAddress.currentAddressId': -1}});
	    // console.log("addressObj",addressObj);
	    if(addressObj){
	      if (addressObj.currentAddress) {
	        var lastelem           = _.last(addressObj.currentAddress);
	        var currentAddressId =  parseInt(lastelem.currentAddressId) + 1;
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
	        swal("Done","Current Address added successfully!","success");
	        // $('html, body').animate({
	        //   'scrollTop' : $(".profileBody").position().top
	        // });
	        $('#menu1').removeClass('in active');
	        $('.menu1').removeClass('active');
	        $('#menu2').addClass('in active');
	        $('.menu2').addClass('active'); 
	        $("#tempLine1").val("");  
	        $("#tempLine2").val("");
	        $("#tempLine3").val("");  
	        $("#tempCity").val("");  
	        $("#tempState").val("");  
	        $("#tempCountry").val("");  
	        $("#tempPincode").val("");  
	        $("#tempresidingFrom").val("");  
	        $("#tempresidingTo").val("");   
	        $('#currentaddAddressModal').modal('hide');
	      }
	    });
	    var imgId = this.props.proofCurrAddrData._id;
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

  render() {
    return (
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 currentAddrContent">
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLine1 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempLine1} id="tempLine1" name="tempLine1" ref="tempLine1"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line1</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLine2 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempLine2} id="tempLine2" name="tempLine2" ref="tempLine2"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line2</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLine3 ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempLine3} id="tempLine3" name="tempLine3" ref="tempLine3"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Line3</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempLandmark ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempLandmark} id="tempLandmark" name="tempLandmark" ref="tempLandmark" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Landmark</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempCountry ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempCountry} id="tempCountry" name="tempCountry" ref="tempCountry" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Country</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempState ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempState} id="tempState" name="tempState" ref="tempState" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>State</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempCity ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempCity} id="tempCity" name="tempCity" ref="tempCity"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>City</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-12">
            <div className="input-effect input-group">  
              <span className="input-group-addon addons"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
              <input type="text" className={this.state.tempPincode ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempPincode} id="tempPincode" name="tempPincode" ref="tempPincode" onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
              <label>Pincode</label>
              <span className="focus-border">
                <i></i>
              </span>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className={this.state.tempresidingFrom ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempresidingFrom} id="tempresidingFrom" name="tempresidingFrom" ref="tempresidingFrom" onChange={this.handleChange} />
              <label className="">Residing From</label>
              <span className="focus-border"><i></i></span>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" style={{display: this.state.tempresidingTo != '' ? this.state.tempresidingTo == "Present" ? "block" : "none" : 'block' }}>
            <label className="residingDateSelect">Residing To</label>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 residingToRadio" >
              <label className="radio"><input checked="checked" type="radio" name="tempResidingToDate" value="stillLivingHere" ref="" />Still living here</label>
              <label className="radio"><input type="radio" name="tempResidingToDate" value="selectToDate"  ref="" onClick={this.tempResidingToChange.bind(this)} data-index={this.props.indexVal}/>Select to date</label>
            </div>
          </div>
          <div className="form-group col-lg-6 col-md-6 col-sm-6 col-xs-6" id="tempResidingToDate" style={{display: this.state.tempresidingTo != '' ? this.state.tempresidingTo == "Present" ? "none" : "block" : 'none' }} id={this.state.tempresidingTo != '' ? this.state.tempresidingTo != 'Present' ? "tempResidingToOfAddress" + this.props.indexVal: "tempResidingToDate" + this.props.indexVal: "tempResidingToDate" + this.props.indexVal}>
            <div className="input-effect input-group">
              <span className="input-group-addon addons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
              <input type="date" className={this.state.tempresidingTo ? "effect-21 form-control has-content loginInputs" :"effect-21 form-control loginInputs"} value={this.state.tempresidingTo} id="tempresidingTo" name="tempresidingTo" ref="tempresidingTo" onChange={this.handleChange} />
              <label className="">Residing To</label>
              <span className="focus-border"><i></i></span>
            </div>
            <span className="tempResidingToChangeLabel pull-right fa fa-angle-double-left fa-lg" onClick={this.tempResidingToChange.bind(this)} data-index={this.props.indexVal}></span>
          </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
             {
                !this.props.proofCurrAddrData.imageLink && !this.props.currentAddressValues ?
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 currAddrselWidth formGroup">
                    <div className="input-effect input-group">
                      <label className="" style={{fontSize : "14" + "px"}}>Proof of Current Address</label>&nbsp;&nbsp;
                    </div>
                  </div>
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup currAddrfileName" style={{display: "none"}}>
                    <div className="input-effect input-group">
                      <label></label>
                    </div>
                  </div>
                  <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 formGroup nopadLeft perAddrBrowseButton">
                    <input type="file" className="btn btn-info inputFiles" data-subtype="currentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                    <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                    <div id="currAddrErrorProof"></div>
                    {this.getUploadImagePercentage()}
                  </div>
                </div>
                :
                this.props.currentAddressValues ?
                  this.props.currentAddressValues.proofOfCurrentAddr ?
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                      { 
                        this.props.currentAddressValues.proofOfCurrentAddr ?
                          this.props.currentAddressValues.currAddrFileExt == 'jpg' || this.props.currentAddressValues.currAddrFileExt == 'png' || this.props.currentAddressValues.currAddrFileExt == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                              <a href=""><img className="img" data-index={this.props.indexVal} onClick={this.currAddrModal.bind(this)} src={this.props.currentAddressValues.proofOfCurrentAddr} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                              <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.currentAddressValues.proofOfCurrentAddr} data-ext={this.props.currentAddressValues.currAddrFileExt} data-index={this.props.currentAddressValues.currentAddressId} data-name={this.props.currentAddressValues.currAddrFileName} data-subtype="editCurrentAddress"></i>
                            </div>
                          : 
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                            <a href="" onClick={this.currAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.currentAddressValues.currAddrFileName}</a>
                            <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.currentAddressValues.proofOfCurrentAddr} data-ext={this.props.currentAddressValues.currAddrFileExt} data-index={this.props.currentAddressValues.currentAddressId} data-name={this.props.currentAddressValues.currAddrFileName} data-subtype="editCurrentAddress"></i>
                          </div>
                        :
                        ""
                      }
                    </div>
                  :
                  this.props.proofData.imageLink ?
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                    { 
                      this.props.proofData.imageLink ?
                        this.props.proofData.ext == 'jpg' || this.props.proofData.ext == 'png' || this.props.proofData.ext == 'jpeg' ?
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                            <a href=""><img className="img" data-index={this.props.indexVal}  onClick={this.currAddrModal.bind(this)} src={this.props.proofData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                            <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="editCurrentAddress"></i>
                          </div>
                        : 
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                          <a href="" onClick={this.currAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofData.name}</a>
                          <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofData._id} data-subtype="editCurrentAddress"></i>
                        </div>
                      :
                      ""
                    }
                  </div>
                  :
                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                    <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup currAddrselWidth">
                      <div className="input-effect input-group">
                        <label className="" style={{fontSize : "14" + "px"}}>Proof of Current Address</label>&nbsp;&nbsp;
                      </div>
                    </div>
                    <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup currAddrfileName" style={{display: "none"}}>
                      <div className="input-effect input-group">
                        <label></label>
                      </div>
                    </div>
                    <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 formGroup nopadLeft perAddrBrowseButton">
                      <input type="file" className="btn btn-info inputFiles" data-subtype="editCurrentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                      <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                      <div id="currAddrErrorProof"></div>
                      {this.getUploadImagePercentage()}
                    </div>
                  </div>
                :
                this.props.proofCurrAddrData.imageLink ?
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                  { 
                    this.props.proofCurrAddrData.imageLink ?
                      this.props.proofCurrAddrData.ext == 'jpg' || this.props.proofCurrAddrData.ext == 'png' || this.props.proofCurrAddrData.ext == 'jpeg' ?
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink" style={{height: "140"+"px"}}>
                          <a href=""><img className="img" data-index={this.props.indexVal}  onClick={this.currAddrModal.bind(this)} src={this.props.proofCurrAddrData.imageLink} style={{maxWidth: "100"+"%",maxHeight: "100"+"%"}} /></a>
                          <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofCurrAddrData._id} data-subtype="editCurrentAddress"></i>
                        </div>
                      : 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 hideimageLink">
                        <a href="" onClick={this.currAddrModal.bind(this)}><i className="fa fa-file"></i> {this.props.proofCurrAddrData.name}</a>
                        <i className="fa fa-times-circle timeCircle" onClick={this.removeProofDocs.bind(this)} data-value={this.props.proofCurrAddrData._id} data-subtype="editCurrentAddress"></i>
                      </div>
                    :
                    ""
                  }
                </div>
                :
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 noProfilePadding">
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup currAddrselWidth">
                    <div className="input-effect input-group">
                      <label className="" style={{fontSize : "14" + "px"}}>Proof of Current Address</label>&nbsp;&nbsp;
                    </div>
                  </div>
                  <div className="form-group col-lg-8 col-md-3 col-sm-4 col-xs-4 formGroup currAddrfileName" style={{display: "none"}}>
                    <div className="input-effect input-group">
                      <label></label>
                    </div>
                  </div>
                  <div className="form-group col-lg-4 col-md-3 col-sm-4 col-xs-4 formGroup nopadLeft perAddrBrowseButton">
                    <input type="file" className="btn btn-info inputFiles" data-subtype="currentAddress" onChange={this.uploadProofDocs.bind(this)}/>
                    <button type="button" className="btn btn-info col-lg-12 col-md-12 col-sm-12 col-xs-12 inputFileButton"  onClick={this.inputFileChange.bind(this)}>Browse</button>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 proofDocsProgress perAddrProgressDiv" style={{display: "none"}}>
                    <div id="currAddrErrorProof"></div>
                    {this.getUploadImagePercentage()}
                  </div>
                </div>
              }
          </div>
          <div className="modal fade" id="currAddrProofModals" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <button type="button" className="close" onClick={this.closeProofModal.bind(this)}>&times;</button>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                        { this.props.currentAddressValues  ?
                          this.props.currentAddressValues.proofOfCurrentAddr ?
                           this.props.currentAddressValues.currAddrFileExt == 'jpg' || this.props.currentAddressValues.currAddrFileExt == 'png' || this.props.currentAddressValues.currAddrFileExt == 'jpeg' ?
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <img src={this.props.currentAddressValues.proofOfCurrentAddr} style={{width: "100"+"%"}} />
                              </div>
                            :
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <iframe src={this.props.currentAddressValues.proofOfCurrentAddr} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
                            </div>
                          :
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
                          ""
                        :
                        this.props.proofCurrAddrData ?
                          this.props.proofCurrAddrData.ext == 'jpg' || this.props.proofCurrAddrData.ext == 'png' || this.props.proofCurrAddrData.ext == 'jpeg' ?
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <img src={this.props.proofCurrAddrData.imageLink} style={{width: "100"+"%"}} />
                            </div>
                          :
                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <iframe src={this.props.proofCurrAddrData.imageLink} style={{width: "100"+"%",height: "500"+"px"}}></iframe>
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
          <button type="submit" className="btn btn-info pull-right" data-index={this.props.indexVal} id={this.state.currentAddressId} onClick={this.props.currentAddressValues ? this.editTemporaryAddress.bind(this) :this.submitTemporaryAddress.bind(this)}>Save</button>
        </div>
      </div>
    );
  }
}
CurrentAddressContainer = withTracker(({props}) => {
    const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
    var _id = Meteor.userId();
    const proofCurrAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
    // console.log("proofCurrAddrData" ,proofCurrAddrData);
    const proofData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'editCurrentAddress'})|| {};
    // console.log("proofData" ,proofData);
    const loading       = !postHandle.ready();
    return {
      loading,
      proofCurrAddrData,
      proofData,
    };
})(CurrentAddress);

export default CurrentAddressContainer;