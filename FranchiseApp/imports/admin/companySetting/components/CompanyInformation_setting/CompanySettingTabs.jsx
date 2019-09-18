import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import TrackerReact                 from 'meteor/ultimatejs:tracker-react';
import {withTracker}                from 'meteor/react-meteor-data';
import {Meteor}                     from 'meteor/meteor';
import {Link}                       from 'react-router';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import {FranchiseDetails}           from '/imports/admin/companySetting/api/CompanySettingMaster.js'; 
import CompanyInformation           from  '/imports/admin/companySetting/components/CompanyInformation_setting/CompanyInformation.jsx';
import CompanyLocation              from  '/imports/admin/companySetting/components/location//CompanyLocation.jsx';
import CompanyBankDetails           from  '/imports/admin/companySetting/components/Company_bank_details/CompanyBankDetails.jsx';
import DocumentAttachment           from  '/imports/admin/companySetting/components/CompanyInformation_setting/DocumentAttachment.jsx';
import CompanyTaxDetails            from  '/imports/admin/companySetting/components/Company_bank_details/CompanyTaxDetails.jsx';
import FranchiseShare               from  '/imports/admin/companySetting/components/Company_bank_details/FranchiseShare.jsx';
import CompanyCommissionCharges     from  '/imports/admin/companySetting/components/Company_bank_details/CompanyCommissionCharges.jsx';
import AddContactCategory           from  '/imports/admin/companySetting/components/Add_Contact_Category/AddContactCategory.jsx';
import AddContactStatus             from  '/imports/admin/companySetting/components/Add_Contact_Status/AddContactStatus.jsx';
import AddContactLeadSource         from  '/imports/admin/companySetting/components/Add_Contact_Leadsource/AddContactLeadSource.jsx';
import AddPropertyType              from  '/imports/admin/companySetting/components/Add_Property_subproperty/AddPropertyType.jsx';
import AddPropertySubType           from  '/imports/admin/companySetting/components/Add_Property_subproperty/AddPropertySubType.jsx';

class CompanySettingTabs extends Component{

  constructor(){
      super();
        this.state = {
           facilityPermission : 'waitingforResult',
        }
    }

  componentDidMount() {
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

  componentWillMount(){
      $('.sidebar').css({display:'block',background: '#222d32'});
       Meteor.call("isAuthenticated","FranchiseSettings","FranchiseDetails",(err,res)=>{
      if(err){
        console.log(err);
      }else{
        this.setState({
           facilityPermission : res,
        });
      }
    });
  }
     componentWillReceiveProps(nextProps) {
    // console.log(nextProps.companyData);

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
              
              // accHolderName : nextProps.post.accHolderName,
              // accNickName   : nextProps.post.accNickName,
              // accType       : nextProps.post.accType,
              // bankName      : nextProps.post.bankName,
              // branchName    : nextProps.post.branchName,
              // accNumber     : nextProps.post.accNumber,
              // ifscCode      : nextProps.post.ifscCode,
   
           });
              if(nextProps.bankData){
                // console.log("BankDetails outside",nextProps.bankData);
                var BankDetails = nextProps.bankData;
                // console.log("BankDetails Inside",BankDetails);
                // for(i=0;i<BankDetails.length;i++){
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

      // this.handleChange = this.handleChange.bind(this);
    }
  render() {
    if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
      $('.sidebar').css({display:'block',background: '#222d32'});
       if(!this.props.loading){
    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
         
          <section className="content-header">
            {Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
            <h1> Owner Details </h1>
            :
            <h1> Franchise Details </h1>
          }        
            
           
          </section>
          {/* /.row */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    {/* <h3 className="box-title">
                      Company Settings
                    </h3> */}
        
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <section className="Content">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="reportWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div id="parkingreport" className="ReportTabs col-lg-2">
                              <ul className="nav nav-pills sidetabs">
                                <li className="active transactionTab CStabl col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                { Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
                                  <a data-toggle="pill" href="#companyInformation" className="CStablst">
                                    Owner Details
                                  </a>
                                  :
                                  <a data-toggle="pill" href="#companyInformation" className="CStablst">
                                    Franchise Details
                                  </a>
                                }
                                </li>
                                <li className=" transactionTab CStabl col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <a data-toggle="pill" href="#CompanyBankDetails" className="CStablst">
                                    Bank Details
                                  </a>
                                </li>
                                {
                                 Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
                                 null
                                 :
                                  <li className=" transactionTab CStabl col-lg-12 col-md-3 col-sm-12 col-xs-12">
                                    <a data-toggle="pill" href="#DocumentAttachment" className="CStablst">
                                      Document Attachment
                                    </a>
                                  </li>
                                }
                            
                                   {
                                    Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])

                                    ?
                                      <li className="transactionTab CStabl col-lg-12 col-md-3 col-sm-12 col-xs-12 transactionTab CStabl">
                                          <a data-toggle="pill" href="#CompanyTaxDetails" className="CStablst">
                                            Tax Settings
                                          </a>
                                      </li>
                                    :
                                    null
                                   }

                                 {/* {
                                    Roles.userIsInRole(Meteor.userId(), ['superAdmin'])

                                    ?
                                      <li className="transactionTab CStabl col-lg-12 col-md-3 col-sm-12 col-xs-12 transactionTab CStabl">
                                          <a data-toggle="pill" href="#CompanyFranchiseShare" className="CStablst">
                                            Franchise Share
                                          </a>
                                      </li>
                                    :
                                    null
                                   }*/}
                                
                              </ul>
                            </div>
                            
                            <div className="tab-content col-lg-10">
                              <div id="companyInformation" className="tab-pane fade in active">
                                <CompanyInformation/>
                              </div>
                              <div id="CompanyLocation" className="tab-pane fade">
                                <CompanyLocation/>
                              </div>
                              <div id="CompanyBankDetails" className="tab-pane fade">
                                <CompanyBankDetails/>
                              </div>

                              <div id="CompanyTaxDetails" className="tab-pane fade">
                                <CompanyTaxDetails/>
                              </div>

                               <div id="CompanyFranchiseShare" className="tab-pane fade">
                                <FranchiseShare/>
                              </div>
                                 
                              <div id="CompanyCommissionCharges" className="tab-pane fade">
                                <CompanyCommissionCharges/>
                              </div>
                             <div id="ContactCategory" className="tab-pane fade">
                                <AddContactCategory/>
                              </div>
                              <div id="ContactStatus" className="tab-pane fade">
                                <AddContactStatus/>
                              </div>
                               <div id="ContactLeadSource" className="tab-pane fade">
                                <AddContactLeadSource/>
                              </div>
                              <div id="PropertyType" className="tab-pane fade">
                                <AddPropertyType/>
                              </div>
                              <div id="PropertySubType" className="tab-pane fade">
                                <AddPropertySubType/>
                              </div>
                              <div id="DocumentAttachment" className="tab-pane fade">
                                <DocumentAttachment/>
                              </div>
                          
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                  {/* ./box-body */}
                </div>
                {/* /.box */}
              </div>
              {/* /.col */}
            </div>
            {/* /.row */}
          </section>
        </div>
        {/* /.content */}
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
      </div>)
  }

}else if (this.state.facilityPermission == false ){
          return (<div>{FlowRouter.go('/noAccesss')}</div>);
      }else if(this.state.facilityPermission == "waitingforResult"){
        return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
         <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
      </div>);
      }else{ 
      return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
    }

  }

}

export default FranchiseContainer = withTracker(props=>{
    var id = Meteor.userId();
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
    return{
      franchiseData,
       loading1,
        loading,
        post,
        companyData,
        bankData
    }
})(CompanySettingTabs);
