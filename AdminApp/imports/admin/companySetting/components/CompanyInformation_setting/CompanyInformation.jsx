import React, { Component } from 'react';
import { render }           from 'react-dom';
import TrackerReact         from 'meteor/ultimatejs:tracker-react';
import {withTracker}        from 'meteor/react-meteor-data';
import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import  CompanyList         from '/imports/admin/companySetting/components/Company_list/CompanyList.jsx';
import {TempDocumentsImage} from '/imports/s3/api/ClientImageCall.js';
import {TempImage}          from '/imports/s3/api/ClientImageCall.js';
import { FlowRouter }       from 'meteor/ostrio:flow-router-extra';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';

import InputMask from 'react-input-mask';


class CompanyInformation extends TrackerReact(Component) {
   constructor(props) {
    super(props);
    this.state = {
      companyId                 : "",
      franchiseName             : "",
      firstName                 : "",
      middleName                : "",
      lastName                  : "",
      contactNo                 : "",
      alternateContactNo        : "",
      mail                      : "",
      addressLine1              : "",
      addressLine2              : "",
      city                      : "",
      pincode                   : "",
      states                    : "",
      country                   : "India",
      infoDataBtn               :"",


      subscription : {
        "tempLogoImage" : Meteor.subscribe('tempLogoImage'),
        // "companyData" : Meteor.subscribe('companyData'),
        "TempImages" : Meteor.subscribe('TempImages'),
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount(){
      $('.sidebar').css({display:'block',background: '#222d32'});
       Meteor.call("isAuthenticated","CompanySettings","CompanyDetails",(err,res)=>{
      if(err){
        console.log(err);
      }else{
        this.setState({
           facilityPermission : res,
        });
      }
    });
  }
  componentDidMount(){
    if ( !$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
    var franchiseURL=location.pathname;
    if(franchiseURL=="/Admin/profile/"+FlowRouter.getParam("id")){    
    $('input:text').attr("disabled", 'disabled');
    this.setState({
        infoDataBtn :"btnView"
      })
    }      
  }

  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }

   componentWillReceiveProps(nextProps) {
        if(nextProps.profileData){
           this.setState({
                               
               firstName            : nextProps.profileData.firstname,
               lastName             : nextProps.profileData.lastname,
               contactNo            : nextProps.profileData.mobNumber,
               mail                 : nextProps.profileData.emailId,
           });
        } 
        if(nextProps.companyData)
        {
           this.setState({
               franchiseName        : nextProps.companyData.franchiseName,
               companyId            : nextProps.companyData.companyId,
               firstName            : nextProps.companyData.firstName,
               middleName           : nextProps.companyData.middleName,
               lastName             : nextProps.companyData.lastName,
               contactNo            : nextProps.companyData.contactNo,
               alternateContactNo   : nextProps.companyData.alternateContactNo,
               mail                 : nextProps.companyData.mail,
               addressLine1         : nextProps.companyData.franchiseLocations[0].addressLine1,
               addressLine2         : nextProps.companyData.franchiseLocations[0].addressLine2,
               city                 : nextProps.companyData.franchiseLocations[0].city,
               pincode              : nextProps.companyData.franchiseLocations[0].pincode,
               states               : nextProps.companyData.franchiseLocations[0].State,
               country              : nextProps.companyData.franchiseLocations[0].country,
            });
        }
      this.handleChange = this.handleChange.bind(this);
    }
 

  imgBrowse(e){
        e.preventDefault();
        e.stopPropagation();
        let self=this;      
        if(e.currentTarget.files){
          var file=e.currentTarget.files[0];
         // console.log("addedfile1----->",file);
          if(file){
           
                 var fileName  = file.name; 
                 var ext       = fileName.split('.').pop();  
                      if(ext=="jpg" || ext=="png" || ext=="jpeg"){    
                          if (file) {   
                              addProductImgsToS3Function(file,self);
                          }else{           
                         swal("File not uploaded","Something went wrong","error");  
                           }     
                      }else{ 
                         swal("Please upload file","Only Upload  images format (jpg,png,jpeg)","error");   
                      } 
          }
        }
        return false;       
    }
  handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }


  submitCompanyInformation(event){
    event.preventDefault();
    var userID = Meteor.userId();
    var companyInfoFormValue = {
      // companyId               : companyId,
      franchiseName             : this.refs.franchiseName.value,
      firstName                : this.refs.firstName.value,

      middleName                : this.refs.middleName.value,
      lastName                  : this.refs.lastName.value,
      contactNo                 : this.refs.contactNo.value,
      alternateContactNo        : this.refs.alternateContactNo.value,
      mail                      : this.refs.mail.value,
      addressLine1              : this.refs.addressLine1.value,
      addressLine2              : this.refs.addressLine2.value,
      city                      : this.refs.city.value,
      pincode                   : this.refs.pincode.value,
      state                     : this.refs.states.value,
      country                   : this.refs.country.value,
      // _id                       : FlowRouter.getParam('id'),

    }//close array

     if(this.refs.contactNo.value==this.refs.alternateContactNo.value){
      
      swal("Entered alternate number is same as contact number"," Please enter another number","warning");      
      }else{
        if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
        document.getElementById("savebtn").disabled = true;
      }else{
        document.getElementById("franchiseSubmitBtn").disabled = true;
        // document.getElementById("franchiseUpdateBtn").disabled = true;
      }
      var indexOfSpace=companyInfoFormValue.franchiseName.indexOf(' ');     
      if(indexOfSpace==0){
       swal("Name should not start with space","","warning");
       if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
          document.getElementById("savebtn").disabled = false;
        }else{
          document.getElementById("franchiseSubmitBtn").disabled = false;
          // document.getElementById("franchiseUpdateBtn").disabled = false;
        }
      }else{
         Meteor.call('insertFranchiseInfo',companyInfoFormValue,
            function(error, result){
              if(error){
                swal('Franchise details not submitted successfully!', 'Please try again', 'error');
              }else{
                  // Meteor.call('tempLogoImageDelete', logoid,);
                  if(result=="franchiseInfoUpdated"){
                    swal('Franchise details information updated successfully!','','success');
                   
                   if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
                      document.getElementById("savebtn").disabled = false;
                    }else{
                      document.getElementById("franchiseSubmitBtn").disabled = false;
                      // document.getElementById("franchiseUpdateBtn").disabled = false;
                    }

                  }else if(result=="insertFrachise"){
                    swal('Franchise details information submitted successfully!','','success');
                      
                    if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
                      document.getElementById("savebtn").disabled = false;
                    }else{
                      document.getElementById("franchiseSubmitBtn").disabled = false;
                      // document.getElementById("franchiseUpdateBtn").disabled = false;
                    }

                  }
                // var companyid=result;
                $(".franchiseName").val('');
                $("input[name=firstName]").val('');     
                $("input[name=lastName]").val('');  
                $(".lastName").val(''); 
                $(".contactNo").val('');
                $(".alternateContactNo").val('');
                $(".mail").val('');
                $(".addressLine1").val('');
                $(".addressLine2").val('');
                $(".city").val('');
                $(".pincode").val('');
                $(".states").val('');
                $(".country").val('');
                // console.log('result: ',result);          
                
              }
            }
          );
          $(event.target).find('input').removeClass('companyError');
      }




      }
    
  }
  franchiseImage(){
      if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
        var curUrl = location.pathname;
        if(curUrl=='/initial-company-setting' || curUrl=='/admin/companyinfo'){
          var id         = Meteor.userId();
        }else{
        var id         = FlowRouter.getParam("id");
        }

      }else{
        var id         = Meteor.userId();
      }
      if(id){
         var TempIamge = TempImage.findOne({"userId":id});
          if(TempIamge){
            return TempIamge.imagePath;
          }else{
            var postHandle = Meteor.subscribe("LoginInFranchiseData",id).ready();
            if(postHandle){
              var franchiseData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":id});
                 if(franchiseData){
                    if(franchiseData.franchisePhoto){
                        return franchiseData.franchisePhoto;
                    }else{
                          return '/images/addLogo1.png';
                    }
                }
            }
          }
    }
  }

  addDocumentList(event){
    event.preventDefault();
    var TempImg = TempDocumentsImage.find({"userId":Meteor.userId()}).fetch();

  }

  getButton(){
        if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
        var companyData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":Meteor.userId()});
        if(companyData){
         return ( <button  id="franchiseSubmitBtn" className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Update</button>);
        }else{
          return (<button id="franchiseSubmitBtn" className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Submit</button>);
        }

     }else{
        if(this.state.infoDataBtn=="btnView"){ 
        null     
       }else{
        return (<button id="savebtn" className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Save</button>);

       }
        
       }
  }

  removeCompanyImage(event){
    event.preventDefault();
    var link = $(event.target).attr('data-link');
    // console.log("link=",link);
    Meteor.call("removeCompanyImage",link,(error, result)=>{});
  }
 

  companyData(){
    var companyData = FranchiseDetails.find({});
    return companyData;
  }

  removeStudProfPhoto(){
    swal({
        title             : 'Are you sure?',
        text              : 'You will not be able to recover this profile photo.',
        type              : 'warning',
        showCancelButton  : true,
        closeOnConfirm    : false,
        confirmButtonColor: '#dd6b55',
        cancelButtonColor : '#d44',
        confirmButtonText : 'Yes, Delete it!',
        cancelButtonText  : 'No, Keep it',
        closeOnConfirm    : false
    },function(){
      Meteor.call("removeprofPhoto",Meteor.userId(),(error,result)=>{
        if(error){

        }else{
           Meteor.call("removeFranchiseProfilePhoto",Meteor.userId(),(error,result)=>{
            if(error){
            }else{              
            }
          });
          swal(
            'Profile image has been Deleted',

           
          );
        }
      });
          
      });
      
  }

  // inputeffect(event){
  //   event.preventDefault();
  //   if (event.currentTarget.value == "") {
  //      $(event.currentTarget).siblings('span').css({ 
  //       "position": "absolute",
  //       "pointer-events": "none",
  //       "left": "20px",
  //       "top": "8px",
  //       "color": "#555",
  //       "font-weight": "600",
  //       "font-size": "13px",
  //       "transition": "0.2s ease all"});
  //   }else{
  //     $(event.currentTarget).siblings('span').css({ 
  //       "top": "-22px",
  //       "font-size": "15px",
  //       "color": "#333333",
  //       "left": "17px",
  //       "font-weight": "bold",
  //       "display": "block",
  //       "padding": "0px",
  //       "overflow": "hidden",
  //       "text-overflow": "ellipsis",
  //       "white-space": "nowrap",
  //       "display": "inline-block",
  //       "width": "85%"});
  //   }
  // }
  
  getUploadServicesPercentage(){
    var uploadProgressPercent = Session.get("imageprogress");
    if(uploadProgressPercent){
        var percentVal = parseInt(uploadProgressPercent);
        if(percentVal){
            var styleC = {
                width:percentVal + "%",
                display:"block",
                height:"8px",
            }
            var styleCBar = {
                display:"block",
                marginTop:117,
                height:"8px",
            }
        }
        if(!percentVal){
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
            <div>
                <div className="progress col-lg-12"  style= {styleCBar}>
                    <div className="progress-bar progress-bar-striped active" role="progressbar"
                  aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
                    </div>
                </div>
            </div>
        );
      }
  }

  render(){
    // if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
    //   $('.sidebar').css({display:'block',background: '#222d32'});
      // console.log("franchiseImage()",this.franchiseImage());
      // console.log("Meteor.userId()()",Meteor.userId());
    if(location.pathname == "/franchise/companyinfo"){
      var ffpic = "col-lg-6 col-md-6 ";
    }else if(location.pathname == "/Admin/profile/"+FlowRouter.getParam("id")){
      var ffpic = "col-lg-4 col-md-4 ";
    }else if(location.pathname =="/admin/companyinfo"){
      var ffpic = "col-lg-5 col-md-5 ";
    }else{
      var ffpic = "col-lg-4 col-md-4 ";
    }
    var userInfo=Meteor.users.findOne({"_id":FlowRouter.getParam("id")});
    if(userInfo){
      var userRole=userInfo.roles[0];

    }
              
    return(

      <section className="NotificationContent">
        <div className="row">


          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="box box-default companysettingboxinfo">
            <div className="box-header with-border franchiseBoxheader">
            { Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
              this.props.urlLink=="/Admin/profile/"+FlowRouter.getParam("id")?
              userRole=="superAdmin" || userRole=="Admin"?
                <h3 className="box-title1">Owner Details
                  {/*{this.props.verificationStatus=="Verified"?
                  <h4  className="box-title1 verificationLbl verifiedTxt">Franchise details verified</h4>
                  :
                   <h4  className="box-title1 verificationLbl notVerifiedTxt">Franchise details not verified.</h4>
                  }*/}

                </h3>
              :
               <h3 className="box-title1">Franchise Details
                {this.props.verificationStatus=="Verified"?
                <h4  className="box-title1 verificationLbl verifiedTxt">Franchise details verified</h4>
                :
                 <h4  className="box-title1 verificationLbl notVerifiedTxt">Franchise details not verified.</h4>
                }

              </h3>

              :
              <h3 className="box-title1">Owner Details</h3>
              :
              
               <h3 className="box-title1">Franchise Details
                 {this.props.verificationStatus=="Verified"?
                 <div className="dashboradBtnFranch">
                  <span  className="box-title1 verificationLbl verifiedTxt">Your details has been verified</span> 
                  <blink className="dashboardblink"><a href="/franchiseDashboard" title="Click to go to dashboard">Dashboard</a></blink>
                </div>
                :
                 <div>
                  <span  className="box-title1 verificationLbl notVerifiedTxt">Your details and documents are not yet verified. Please contact us on support@maats.in or call us on <span>+91-8983318508</span>.</span>
                 </div>
                }

               </h3>
            }
          
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  onlineSXWrapfranchise">

                <form id="FranchiseForm" onSubmit={this.submitCompanyInformation.bind(this)}>
                 
                  <div className="col-lg-12 col-md-12 col-sm-12 studHeadingWrappp">
                    <span className="studHeadingWrap col-lg-6 col-md-6 col-xs-6 col-sm-6"> Instructions</span>
                    <span className="studHeadingWrap col-lg-6 col-md-6 col-xs-6 col-sm-6 imageUploadLabel">
                      <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> Upload Profile Picture</span>
                      <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageSize imagetype"> (Image Size :700 KB - jpg/jpeg/png)</span>
                    </span>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 instructionWrap">
                    <span className="col-lg-12 col-md-12 col-xs-12 col-sm-12">{this.props.franchiseInstruction.instruction}</span>
                  </div>
                        {/*<div className="col-lg-6 col-md-6 col-sm-6 instructionWrap "> </div>*/}
                        <div className="col-lg-6 col-md-6 col-sm-6 imageSize1 instructionWrap1">
                          <div className={ffpic+ " col-sm-4 col-xs-3  pull-right"}>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 photoWrapper1 custPhotoWrap1addstud">
                              {this.franchiseImage() ==='/images/addLogo1.png'? 
                              <i className="" aria-hidden="true" title="First Add Photo"/>
                              :
                              <i className="fa fa-times removeprofPhoto" aria-hidden="true" title="Remove Photo" onClick={this.removeStudProfPhoto.bind(this)}></i>
                            }
                                <div className="col-lg-12 col-md-12 col-sm-12ClientImgWrap1 displayBlockOne">
                                  {this.franchiseImage() ==='/images/addLogo1.png' ?  
                                    Roles.userIsInRole(Meteor.userId(), ['Franchise']) ?
                                    <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2 col-md-2 col-sm-2   styleUpload" title="Add Profile Photo">
                                    <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-12 browseDoc" accept="image/x-png,image/jpeg,image/jpg"  onChange={this.imgBrowse.bind(this)}/> </i>
                                    :
                                    <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2 col-md-2 col-sm-2   styleUpload" title="Add Profile Photo">
                                    <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-12 browseDoc" accept="image/x-png,image/jpeg,image/jpg"  onChange={this.imgBrowse.bind(this)}/> </i>
                                   
                                  :
                                   Roles.userIsInRole(Meteor.userId(), ['Franchise']) ?
                                  <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2  styleUpload" title="Change Profile Photo">
                                
                                    <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 browseDoc" accept="image/x-png,image/jpeg,image/jpg"  onChange={this.imgBrowse.bind(this)}/>
                                  </i>
                                  :
                                  <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2  styleUpload" title="Change Profile Photo">
                                
                                    <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 browseDoc" accept="image/x-png,image/jpeg,image/jpg"  onChange={this.imgBrowse.bind(this)}/>
                                  </i>
                                }
                                </div>

                                {<img className="col-lg-12 col-md-12 col-sm-12 ClientImgWrap1 displayLogoOne" src={this.franchiseImage()?this.franchiseImage() :"/images/addLogo1.png"}/>}
                                {this.getUploadServicesPercentage()}
                              
                              </div>

                          </div>                        
                      </div>
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">
                        
                          <div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 ">
                            <span className="blocking-span"> 
                              <input type="text" name="franchiseName"  pattern="[a-zA-Z0-9\s]+" ref="franchiseName" value={this.state.franchiseName} onChange={this.handleChange} className={this.state.franchiseName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter Franchise Name(Only alphabates & no space allowed)" autoComplete="off" required/>
                              <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingleftzero">Franchise Name<label className="requiredsign">*</label></span>                 
                            </span>
                          </div>
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12 franchiseidbox">
                                  <span className="col-lg-12 col-md-12 col-sm-12 paddingleftzero franchiseid">Franchise ID</span>                             
                              <span className="blocking-span">
                                  <input type="text" name="companyId" ref="companyId" value={this.state.companyId} onChange={this.handleChange} title="Franchise ID" className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" disabled/>
                              </span>
                            </div>
                        </div>

                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">

                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                              <span className="blocking-span"> 
                                <input type="text" name="firstName" ref="firstName" pattern="[a-zA-Z]+" value={this.state.firstName} onChange={this.handleChange}  className={this.state.firstName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter First Name (Numbers. are not allowed)" autoComplete="off" required/>
                                <span className="floating-label" >First Name<label className="requiredsign">*</label></span>                  
                              </span>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                              <span className="blocking-span"> 
                                <input type="text" name="middleName" ref="middleName" pattern="[a-zA-Z]+" value={this.state.middleName} onChange={this.handleChange} className={this.state.middleName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter Middle Name (Numbers. are not allowed)" autoComplete="off"/>
                                <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingleftzero">Middle Name</span>                  
                              </span>
                            </div>

                        
                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                              <span className="blocking-span"> 
                                <input type="text" name="lastName" ref="lastName" pattern="[a-zA-Z]+" value={this.state.lastName} onChange={this.handleChange} className={this.state.lastName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter Last Name (Numbers. are not allowed)" autoComplete="off" required/>
                                <span className="floating-label">Last Name<label className="requiredsign">*</label></span>                  
                              </span>
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">


                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                              <span className="blocking-span">
                                <InputMask mask="9999-999-999" maskChar=" " name="contactNo" ref="contactNo" value={this.state.contactNo} onChange={this.handleChange} className={this.state.contactNo ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="^(0|[0-9-+]*)$" title="Enter 10 digit Number!" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label paddingleftzero">Contact Number</span>                
                              </span>
                            </div>

                            <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                              <span className="blocking-span">
                                <InputMask mask="9999-999-999" maskChar=" " name="alternateContactNo" ref="alternateContactNo" value={this.state.alternateContactNo} onChange={this.handleChange} className={this.state.alternateContactNo ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="^(0|[0-9-+]*)$" title="Enter 10 digit Number!" autoComplete="off" />
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label paddingleftzero">Alternate Number</span>                
                              </span>
                            </div>

                          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-3">
                            <span className="blocking-span"> 
                              <input type="text" name="mail" ref="mail" value={this.state.mail} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" onChange={this.handleChange} className={this.state.mail ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter email in standard format" autoComplete="off" required/>
                              <span className="floating-label">Email Address<label className="requiredsign">*</label></span>                  
                            </span>
                          </div>
                        </div>
            

                      <div className="basicinfocmpset">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">
                        
                          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <span className="blocking-span"> 
                              <input type="text" name="addressLine1" ref="addressLine1" value={this.state.addressLine1} onChange={this.handleChange} className={this.state.addressLine1 ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter Address Line1" autoComplete="off" required/>
                              <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingleftzero">Address Line 1 <label className="requiredsign">*</label></span>                  
                            </span>
                          </div>
                          
                           <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <span className="blocking-span"> 
                              <input type="text" name="addressLine2" ref="addressLine2" value={this.state.addressLine2} onChange={this.handleChange} className={this.state.addressLine2 ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter Address Line2" autoComplete="off" />
                              <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingleftzero">Address Line 2 <label className="requiredsign"></label></span>                  
                            </span>
                          </div>

                          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <span className="blocking-span"> 
                              <input type="text" name="city" ref="city" pattern="[a-zA-Z][a-zA-Z]+" value={this.state.city} onChange={this.handleChange} className={this.state.city ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter City Name (Nos. are not allowed)" autoComplete="off" required/>
                              <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingleftzero">City<label className="requiredsign">*</label></span>                 
                            </span>
                          </div>
                        </div>
                        
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">

                          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <span className="blocking-span">
                              <InputMask mask="999-999" maskChar=" " name="pincode" ref="pincode" value={this.state.pincode} onChange={this.handleChange} className={this.state.pincode ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"}  pattern="^(0|[0-9-]*)$" title="Enter 6 digit Number!" autoComplete="off" required/>
                              <span className="col-lg-12 col-md-12 col-sm-12 floating-label paddingleftzero">Pincode</span>                
                            </span>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <span className="blocking-span"> 
                              <input type="text" name="states" ref="states" pattern="[a-zA-Z][a-zA-Z ]+" value={this.state.states} onChange={this.handleChange} className={this.state.states ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter State Name (Nos. are not allowed)" autoComplete="off" required/>
                              <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingleftzero">State<label className="requiredsign">*</label></span>                  
                            </span>
                          </div>
                          <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                            <span className="blocking-span"> 
                              <input type="text" name="country" ref="country" pattern="[a-zA-Z][a-zA-Z ]+" value={this.state.country} onChange={this.handleChange} className={this.state.country ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content franchiseUrl" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} title="Enter Country Name (Nos. are not allowed)" autoComplete="off" required/>
                              <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12 paddingleftzero">Country<label className="requiredsign">*</label></span>                  
                            </span>
                          </div>
                        </div>
  
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">
                    {this.getButton()}
                  </div>
                  </div>
                </div>
            </form>
            </div>
      


              </div>

            </div>
            
          </div>
    
        </div>

      </section>


      );
  // }else if (this.state.facilityPermission == false ){
  //         return (<div>{FlowRouter.go('/noAccesss')}</div>);
  //     }else if(this.state.facilityPermission == "waitingforResult"){
  //       return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
  //        <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
  //     </div>);
  //     }else{ 
  //     return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
  //           <h3>You dont have access.</h3>
  //          </div>
  //       );
  //   }
  }

 }

 

export default EditCompanyInformation = withTracker((props)=>{
  if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
    var curUrl = location.pathname;
    if(curUrl=='/admin/companyinfo'){
      var franchId         = Meteor.userId();
    }else{
      var franchId         = FlowRouter.getParam("id");
    }
  }else{
    var franchId         = Meteor.userId();
  }    

    const postHandleUser = Meteor.subscribe('userData');
    const loading    = !postHandleUser.ready();
    var userData         = Meteor.users.findOne({"_id":franchId})||{};
    const postHandleFranchise = Meteor.subscribe('franchiseData');
    const loading1       = !postHandleFranchise.ready();
    var urlLink=location.pathname;

    const postHandle2   = Meteor.subscribe("instruction_Franchise");
    const loadingTest2  = !postHandle2.ready();
    var franchiseInstruction = InstructionMaster.findOne({"instructionFor" : "Franchise Instruction"})||{};

     var profileData    = userData.profile;

    
    // if (userData) {
    //   if (userData.profile) {
    //     var companyId = userData.profile.companyId;
        var companyData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":franchId});
        if(companyData){
          var verificationStatus=companyData.verificationStatus;
        }

      
    //   }
    // }
    // var profileData = '';
    
    return {
        loading1,
        loading,
        profileData,
        companyData,
        urlLink,
        franchiseInstruction,
        verificationStatus
    };
})(CompanyInformation);