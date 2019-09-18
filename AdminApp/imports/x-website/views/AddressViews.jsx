import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';

import { UserProfile } from '../forms/api/userProfile.js';
import { TempProofDocs } from "../forms/api/userProfile.js";
import PermanentAddress from "../forms/PermanentAddress.jsx";
import CurrentAddress from "../forms/CurrentAddress.jsx";

class AddressViews extends TrackerReact(Component){
   constructor(props){
    super(props);
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
      'residingToDateOfAddress' : 'stillLivingHere',
      'currentResidingToDate'   : 'stillLivingHere',
      "proofData"       : {},
      "subscription" : {
        "userData" : Meteor.subscribe("userData",Meteor.userId()),
        "userProfileData" : Meteor.subscribe("userProfileData"),
        "LatestTempProofDocs" : Meteor.subscribe("LatestTempProofDocs"),
      }
    };
    this.handleChange = this.handleChange.bind(this);
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
  handleChange(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    // console.log("target",target);
    // console.log("name",event.target.value);
    this.setState({
      [name]: event.target.value,
    });
  }
  editPermanaantAddress(event){
    var idVal= $(event.target).attr('data-target');
    $('#'+idVal).modal('show');
  }
  editCurrentAddress(event){
     var idVal= $(event.target).attr('data-target');
    $('#'+idVal).modal('show');
  }
  newaddPermAddressModal(event){
   event.preventDefault(); 
   $('#permaddAddressModal').modal('show');
  }
  newAddCurrentAddressModal(event){
   $('#currentaddAddressModal').modal('show');
  }
  inputFileChange(event){
    event.preventDefault();
    $(event.target).siblings('.inputFiles').click();
  }
  uploadProofDocs(event){
    event.preventDefault();
    var proofSubtype = $(event.target).attr('data-subtype');
    // console.log('proofSubtype: ',proofSubtype);
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
        if(proofSubtype == "editPermanentAddress"){
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
            if(proofSubtype == "editPermanentAddress"){
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
            if(proofSubtype == "editPermanentAddress"){
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
          if(proofSubtype == "editPermanentAddress"){
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
  perAddrModal(event){
    event.preventDefault();
    $('#permAddressModal').animate({
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
  closeProofModals(event){
    event.preventDefault();
    $(event.target).parent().parent().parent().parent('#perAddrProofModals').removeClass('in');
    $(event.target).parent().parent().parent().parent('#perAddrProofModals').css('display','none');
  }
  currAddrModal(event){
    event.preventDefault();
    $('#currentAddressModal').animate({
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
 
  requiredAddressInformation(){ 
    if (this.props.userprofile) {
      return(
        <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            <i className="fa fa-id-card col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 viewTitle">Address Information</span>
          </div> 
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoOuter">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <h5 className="pull-left">Permanent Address</h5>
                <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newaddPermAddressModal.bind(this)}></i>              
              </div>  
              { this.props.userprofile.permanentAddress ?
                this.props.permanentAddress.map((permAddress,index)=>{
                  return(
                    <div  key={index}> 
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress">
                      <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                           <span className="pull-left"> {permAddress.line1}, {permAddress.line2}, {permAddress.line3},{permAddress.landmark}, {permAddress.city}, {permAddress.state}, {permAddress.country} {permAddress.pincode}</span>           
                      </div>
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                       { permAddress.editStatus == "Open" ?
                           <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"permAddressModal-"+index} id={permAddress.permanentAddressId} onClick={this.editPermanaantAddress.bind(this)}></i>
                           :
                           ""
                        }
                      </div>
                    </div> 
                    <div className="modal fade" id={"permAddressModal-"+index} role="dialog">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title">Edit Permanent Address</h4>                 
                            </div>
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id="addressForm">
                               <PermanentAddress  id={this.props.userprofile._id} permanentAddressValues={permAddress} indexVal={index} />
                              </form>
                            </div> 
                            <div className="modal-footer">
                            </div>
                          </div> 
                        </div>
                    </div> 
                    </div>

                  );                   
                })
                :
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                       <span>Please Add Your Permanent Address</span>
                  </div>
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                  </div>
              </div> 
              }
                        
            </div> 
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <h5 className="pull-left">Current Address</h5>
                <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newAddCurrentAddressModal.bind(this)}></i>              
              </div>  
              { this.props.userprofile.currentAddress ?
                this.props.currentAddress.map((currentAddress,index)=>{
                  return(
                    <div key={index}> 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress">
                        <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                             <span className="pull-left"> {currentAddress.tempLine1}, {currentAddress.tempLine2}, {currentAddress.tempLine3},{currentAddress.tempLandmark}, {currentAddress.tempCity}, {currentAddress.tempState}, {currentAddress.tempCountry} {currentAddress.tempPincode}</span>           
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                         { currentAddress.editStatus == "Open" ?
                             <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"currentAddressModal-"+index} id={currentAddress.currentAddressId} onClick={this.editCurrentAddress.bind(this)}></i>
                             :
                             ""
                          }
                        </div>
                      </div> 
                       <div className="modal fade" id={"currentAddressModal-"+index} role="dialog">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  <h4 className="modal-title">Edit Current Address</h4>                 
                              </div>
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id="addressForm">
                                 <CurrentAddress  id={this.props.userprofile._id} currentAddressValues={currentAddress} indexVal={index} />
                                </form>
                              </div> 
                              <div className="modal-footer">
                              </div>
                            </div> 
                          </div>
                      </div>
                    </div>

                  );                   
                })
                :
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                       <span>Please Add Your Current Address</span>
                  </div>
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                  </div>
              </div> 
              }
                        
            </div> 

            
           <div className="modal fade" id="permaddAddressModal" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Add Permanent Address</h4>                 
                    </div>
                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm basicForm" id="addressForm">
                        <PermanentAddress key={this.props.proofPerAddrData._id + 'editPermanentAddr'} proofPerAddrData={this.props.proofPerAddrData}/>
                      </form>
                    </div> 
                    <div className="modal-footer">
                    </div>
                  </div> 
                </div>
           </div> 
            <div className="modal fade" id="currentaddAddressModal" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Add Current Address</h4>                 
                    </div>
                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm basicForm" id="addressForm">
                        <CurrentAddress key={this.props.proofCurrAddrData._id + 'editCurrentAddr'} proofCurrAddrData={this.props.proofCurrAddrData}/>
                      </form>
                    </div> 
                    <div className="modal-footer">
                    </div>
                  </div> 
                </div>
            </div> 

          </div> 
        </div>
      );  
    } 
  }
  render(){
    // console.log(this.props.profileId);
    if (!this.props.loading1) {
     return (
        <div>
          {this.requiredAddressInformation()}
        </div>
      );  
    }else{
      return(
        <span></span>
      );
    }
  }
}
addressViewsContainer = withTracker(props => {
  // console.log('props: ',this.props);
    var _id = props.profileId;
    var id = Meteor.userId();
    // console.log("_id",_id);
    const postHandle1      = Meteor.subscribe('userprofile',Meteor.userId());
    const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
    // var editServices   = this.props.params.id;
    // console.log("Param" +editServices);
    // var reqPermnentAddress = {};
    // var reqCurrentAddress  = {};
    var permanentAddress = [];
    var currentAddress   = [];
    const userprofile      = UserProfile.findOne({"_id" : _id});
    // console.log("userprofile",userprofile);
    if (userprofile) {
      if (userprofile.permanentAddress) {
          permanentAddress  = userprofile.permanentAddress;
        }
       
       if (userprofile.currentAddress) {
          currentAddress  = userprofile.currentAddress;
       }
    }
    const loading  = !postHandle.ready();
    const loading1 = !postHandle1.ready();
    const proofPerAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
    // console.log("proofObj" ,proofObj);
    const proofCurrAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
    // console.log("proofData" ,proofData);
    // if(_id){
      // console.log("permanentAddress",permanentAddress);
      return {
          loading1 : loading1,
          userprofile : userprofile,
          // reqPermnentAddress : reqPermnentAddress,
          // reqCurrentAddress  : reqCurrentAddress,
          permanentAddress  : permanentAddress,
          currentAddress  : currentAddress,
          proofPerAddrData,
          proofCurrAddrData,
          loading,
      };
    // }
})(AddressViews);
export default addressViewsContainer;

