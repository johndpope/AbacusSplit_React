

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import  CompanyList         from '/imports/admin/companySetting/components/Company_list/CompanyList.jsx';
import {TempDocumentsImage} from '/imports/s3/api/ClientImageCall.js';
import {TempImage}          from '/imports/s3/api/ClientImageCall.js';
import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';

import CompanyInformation      from '/imports/admin/companySetting/components/CompanyInformation_setting/CompanyInformation.jsx';
import CompanyBankDetails      from  '/imports/admin/companySetting/components/Company_bank_details/CompanyBankDetails.jsx';
import DocumentAttachment      from  '/imports/admin/companySetting/components/CompanyInformation_setting/DocumentAttachment.jsx';

class FranchiseProfile extends Component  {
     constructor(props) {
    super(props);

    // console.log("porps==>>>",this.props.companyData);
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
      country                   : "",


      // accHolderName  : this.props.accHolderName,
      // accNickName    : this.props.accNickName,
      // accType        : this.props.accType,
      // bankName       : this.props.bankName,
      // branchName     : this.props.branchName,
      // accNumber      : this.props.accNumber,
      // ifscCode       : this.props.ifscCode,

      // subscription : {
      //   "companyData" : Meteor.subscribe('companyData'),
      // }

      subscription : {
        "tempLogoImage" : Meteor.subscribe('tempLogoImage'),
        "companyData" : Meteor.subscribe('companyData'),
        "TempImages" : Meteor.subscribe('TempImages'),
      }
    };
    this.handleChange = this.handleChange.bind(this);
    
  }
   componentWillReceiveProps(nextProps) {
    // console.log("nextProps",nextProps);
      if(!nextProps.loading){
        if(nextProps.companyData){            
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
               states                : nextProps.companyData.franchiseLocations[0].State,
               country              : nextProps.companyData.franchiseLocations[0].country,
           });
              if(nextProps.bankData){
                // console.log("BankDetails outside",nextProps.bankData);
                var BankDetails = nextProps.bankData;
                // console.log("BankDetails Inside",BankDetails);
                // for(i=0;i<BankDetails.length;i++){
                  // console.log("BankDetails[0].accHolderName",BankDetails[0].accHolderName);
                  this.setState({
                    accHolderName : BankDetails[0].accHolderName,
                    accNickName   : BankDetails[0].accNickName,
                    accType       : BankDetails[0].accType,
                    bankName      : BankDetails[0].bankName,
                    branchName    : BankDetails[0].branchName,
                    accNumber     : BankDetails[0].accNumber,
                    ifscCode      : BankDetails[0].ifscCode,
                  }) 
              }
        }
      }

      this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount(){
      if ( !$('body').hasClass('adminLte')) {
        var adminLte = document.createElement("script");
        adminLte.type="text/javascript";
        adminLte.src = "/js/adminLte.js";
        $("body").append(adminLte);
      }

    }

    componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
    } 
 
  imgBrowse(e){
        e.preventDefault();
        e.stopPropagation();
        let self=this;      
        if(e.currentTarget.files){
          var file=e.currentTarget.files[0];
         // console.log("addedfile1----->",file);
          if(file){
            addProductImgsToS3Function(file,self);
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
      firstName                 : this.refs.firstName.value,
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

    }//close array
      Meteor.call('insertFranchiseInfo',companyInfoFormValue,
        function(error, result){
          if(error){
            swal('Oops...', 'Something went wrong!', 'error');
          
          }else{
              // Meteor.call('tempLogoImageDelete', logoid,);
            swal('Company information submitted successfully!','', 'success');
            
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
           Meteor.call("updateFranchiseCompanyId" , result, Meteor.userId(),function(error,result){
            // console.log("CompanyID",Meteor.userId());

              if(error){
                console.log(error.reason);
              }else{
            
                if (Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])) {
                  FlowRouter.go('/admin/FranchiseDetails');
                }else  if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
                 // FlowRouter.go("/franchise/profile");
                  
                  }
                  // console.log("in else updated franchise");
              }
            })
            
            
          }
        }
      );
      $(event.target).find('input').removeClass('companyError');
    
  }
  StudentImage(){
    var TempImg = TempImage.findOne({"userId":Meteor.userId()});
    // console.log("TempImg",TempImg);
    if(TempImg){
      return TempImg.imagePath;
    }else{
    // console.log("Else",TempImg);

        return '/images/addLogo1.png';
    }
  }

  addDocumentList(event){
    event.preventDefault();
    var TempImg = TempDocumentsImage.find({"userId":Meteor.userId()}).fetch();

  }

  getButton(){
    var companyData = FranchiseDetails.findOne({});
    if(companyData){
     return ( <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Update</button>);
    }else{
      return (<button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Submit</button>);
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

          swal(
            'Profile image has been Deleted',
           
          );
        }
      });
          
      });
      
  }


  //   componentWillReceiveProps(nextProps) {
  //   if(!nextProps.loading){
  //     if(nextProps.post.bankDetails){
  //       this.setState({
    
  //       })
  //     }
  //   }
  //   this.handleChange = this.handleChange.bind(this);
  //   // this.handleSubmit = this.handleSubmit.bind(this);
  // }

  submitBankDetail(event){
    event.preventDefault();
    var sessionVar = Session.get('bankDetail');

    if($('#bankDetailForm')){
      if(sessionVar){
        var companyBankDetailsFormValue ={

          accHolderName  : $(".accHolderName").val(),
          accNickName    : $(".accNickName").val(),
          accType        : $(".accType").val(),
          bankName       : $(".bankName").val(),
          branchName     : $(".branchName").val(),
          accNumber      : $(".accNumber").val(),
          ifscCode       : $(".ifscCode").val(),

        }//close array

        Meteor.call('updateBankDetails', companyBankDetailsFormValue,
          function(error, result){
            if(error){
              console.log(error);
              swal('Oops...', 'Something went wrong!', 'error');
            }else{

              // console.log("companyBankDetailsFormValue===>>>",companyBankDetailsFormValue);
              swal('Bank Details Updated Successfully!');
            }
          }
        );

      }else{
        
        var companyBankDetailsFormValue ={

          accHolderName  : $(".accHolderName").val(),
          accNickName    : $(".accNickName").val(),
          accType        : $(".accType").val(),
          bankName       : $(".bankName").val(),
          branchName     : $(".branchName").val(),
          accNumber      : $(".accNumber").val(),
          ifscCode       : $(".ifscCode").val(),

       }//close array


        Meteor.call('insertCompanyBankDetails', companyBankDetailsFormValue,
          function(error, result){
            if(error){
              console.log(error);
              swal('Oops...', 'Something went wrong!', 'error');
            }else{
             
              swal('Bank Details Added Successfully!');
              $(".accHolderName").val('');
              $(".accNickName").val('');
              $(".accType").val('Enter Account Type');
              $(".bankName").val('');
              $(".branchName").val('');
              $(".accNumber").val('');
              $(".ifscCode").val('');
            }
          }
        );
      }
    }else{
      $(event.target).parent().parent().find('input.error').addClass('companyError');
      $(event.target).parent().parent().find('select.error').addClass('companyError');
    }
  }

   imgBrowse1(event){
        event.preventDefault();
        event.stopPropagation();
         // console.log("addedfile2----->",file);

        let self=this;      
        if(event.currentTarget.files){
        var file=event.currentTarget.files[0];
        var documentType=this.state.document;
        if(file){
          addProductDocumentImgsToS3Function(file,self,documentType);
        }
      } 
    }

     StudentImage1(){
    Meteor.subscribe("TempDocumentsImages");
    var TempImg = TempDocumentsImage.find({"userId":Meteor.userId()}).fetch();
    if(TempImg){
      return TempImg;
    }else{
        return '/images/attachment.png';
    }
  }



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
    if(this.props.userRole=="Staff"){
          return(
          <div>
            <div className="content-wrapper">
              <section className="content-header">
                <h1> Staff Details</h1>
              </section>
              <section className="content viewContent">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <div className="box">
                      <div className="box-header with-border boxMinHeight">
                        <section className="NotificationContent">
                          <div className="box-body">
                             <div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 createUserWrapp staffInfo">
                                  <form >
                                      <div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                       <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                            <span className="CSExam">First Name</span>
                                            <span className="blocking-span">
                                                <input type="text" placeholder={this.props.userProfile.firstname} className="form-control UMname inputText tmsUserAccForm has-content staffInfo1" disabled/>
                                            </span>
{/*                                            <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.userProfile.firstname}</span> 
*/}                                        </div>

                                       <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                            <span className="CSExam">Last Name</span>
                                            <span className="blocking-span">
                                              <input type="text"  placeholder={this.props.userProfile.lastname} className="form-control UMname inputText tmsUserAccForm has-content staffInfo1" disabled/>
                                            </span>
{/*                                            <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.userProfile.lastname}</span> 
*/}                                        </div>
                                        <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent">
                                            <span className="CSExam">Mobile Number</span>
                                            <span className="blocking-span">
                                               <input type="text"  placeholder={this.props.userProfile.mobNumber} className="form-control UMname inputText tmsUserAccForm has-content staffInfo1" disabled/>
                                             </span>
{/*                                            <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.userProfile.mobNumber}</span> 
*/}                                        </div>

                                        <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent">
                                            <span className="CSExam">Role</span>
                                            <span className="blocking-span">
                                               <input type="text" placeholder={this.props.userRole} className="form-control UMname inputText tmsUserAccForm has-content staffInfo1" disabled/>
                                             </span>
{/*                                             <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.userRole}</span> 
*/}                                        </div>
                                         <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
                                            <span className="CSExam">Email ID</span>
                                            <span className="blocking-span">
                                              <input type="text" placeholder={this.props.userProfile.emailId} className="form-control UMname inputText tmsUserAccForm staffInfo1 has-content" disabled/>
                                            </span>
{/*                                            <span className="floating-label col-lg-12 col-md-12 col-sm-12 col-xs-12">{this.props.userProfile.emailId}</span> 
*/}                                        </div>

                                      </div> 
                                  </form>
                                </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                  </div>
                </section>
              </div>
          </div>
          );
    }else if(!this.props.loading){
      var userInfo=Meteor.users.findOne({"_id":FlowRouter.getParam("id")});
        if(userInfo){
          var userRole=userInfo.roles[0];

        }
        return(
          <div>
            <div className="content-wrapper">
              <section className="content-header">
              {Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
                
                  (this.props.urlLink=="/admin/companyinfo" || userRole=="superAdmin" || userRole=="Admin")?
                  <h1> Owner Details</h1>
                  :
                  <h1> Franchise Details</h1>              
                
                :
                 <h1> Franchise Details</h1>
              }

              </section>
              <section className="content viewContent">
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                      <div className="box">
                      <div className="box-header with-border boxMinHeight">
                        <section className="NotificationContent">
                          <div className="box-body">
                           <CompanyInformation/>
                            <CompanyBankDetails/>
                            <DocumentAttachment />
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                  </div>
                </section>
              </div>
          </div>
          );
        }else{
          return( 
            <div>
              <div className="content-wrapper">
                <section className="content viewContent">
                  <div className="row">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <div className="box">
                        <div className="box-header with-border boxMinHeight">
                          <section className="NotificationContent">
                            <div className="box-body">
                              <div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 text-center">
                                <h1 className=" loadingTitleTop ">Loading.... please wait</h1>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                    </div>
                  </section>
                </div>
            </div>
            )


        }
  
  }
}
export default FranchiseProfileContainer = withTracker(props=>{
    if(Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])){
    var id         = FlowRouter.getParam("id");

    const userpostHandle2 = Meteor.subscribe('userData',id);
    const userloading    = !userpostHandle2.ready();
    if(id){
      var userInfo = Meteor.users.findOne({"_id":id});
    }
    if(userInfo){
      var userRole = userInfo.roles;
      var userProfile = userInfo.profile;
    }
  }else{

    var id         = Meteor.userId();
    var staffId    = FlowRouter.getParam("id");

    const userpostHandle2 = Meteor.subscribe('userData',staffId);
    const userloading    = !userpostHandle2.ready();
    if(staffId){
      var userInfo = Meteor.users.findOne({"_id":staffId});
    }
    if(userInfo){
      var userRole = userInfo.roles;
      var userProfile = userInfo.profile;
    }


  }    

    // var id = Meteor.userId();
    const postHandle2 = Meteor.subscribe('franchiseData');
    const loading    = !postHandle2.ready();
    var franchiseData    = FranchiseDetails.findOne({"franchiseCodeForCompanyId":id})||{};  
     var userData     = Meteor.user();
    const loading1    = !postHandle2.ready();

    if (userData) {
      if (userData.profile) {
        var companyId = userData.profile.companyId;
        var companyData = FranchiseDetails.findOne({"companyId" : companyId});
      }
    }
     if(companyData){
     var bankData = companyData.bankDetails;
   }
    var post = '';
    // console.log("staffId",staffId,userRole,userProfile);
    var urlLink=location.pathname;
    return{
      franchiseData,
       loading1,
        loading,
        post,
        companyData,
        bankData,
        userRole,
        userProfile,
        urlLink
    }
})(FranchiseProfile);