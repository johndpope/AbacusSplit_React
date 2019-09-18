import React, { Component }     from 'react';
import { render }               from 'react-dom';
import TrackerReact             from 'meteor/ultimatejs:tracker-react';
import {withTracker}            from 'meteor/react-meteor-data';
import Validation               from 'react-validation';
import validator                from 'validator';
import { FlowRouter }       from 'meteor/ostrio:flow-router-extra';
import { FranchiseDetails }      from '/imports/admin/companySetting/api/CompanySettingMaster.js';

import CompanyBankList          from '/imports/admin/companySetting/components/Company_bank_details/CompanyBankList.jsx';
import CompanySettingIndicators from '/imports/admin/companySetting/components/CompanyInformation_setting/companySettingIndicators.jsx';


class CompanyBankDetails extends Component{
  constructor(props) {

    super(props);
    this.state = {
      accHolderName  : "",
      accNickName    : "",
      accType        : "",
      bankName       : "",
      branchName     : "",
      accNumber      : "",
      ifscCode       : "",
      infoData       :"",

      subscription : {
        "LoginInFranchiseData" : Meteor.subscribe('LoginInFranchiseData'),
      }
    };
    this.handleChange = this.handleChange.bind(this);
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
      // $('input:text').attr("disabled", 'disabled');
      this.setState({
        infoData :"infoView"
      })
     
    }
  }

  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps){
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
    }else{
      this.setState({
            accHolderName : '',
            accNickName   : '',
            accType       : '',
            bankName      : '',
            branchName    : '',
            accNumber     : '',
            ifscCode      : '',
          })
    }
    this.handleChange = this.handleChange.bind(this);
  }
  

  handleChange(event){
    const target = event.target;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }



  submitBankDetail(event){
    event.preventDefault();
      if(this.props.companyData.bankDetails){
        var companyBankDetailsFormValue ={
          accHolderName  :  this.refs.accHolderName.value,
          accNickName    :  this.refs.accNickName.value,
          accType        :  this.refs.accType.value,
          bankName       :  this.refs.bankName.value,
          branchName     :  this.refs.branchName.value,
          accNumber      :  this.refs.accNumber.value,
          ifscCode       :  this.refs.ifscCode.value,

        }//close array
              // console.log("companyBankDetailsFormValue===>>>",companyBankDetailsFormValue);

        Meteor.call('updateBankDetails', companyBankDetailsFormValue,
          function(error, result){
            if(error){
              console.log(error);
              swal('Oops...', 'Something went wrong!', 'error');
            }else{
              swal('Bank Details Updated Successfully!');
            }
          }
        );

      }else{        
        var companyBankDetailsFormValue ={

          accHolderName  : this.refs.accHolderName.value,
          accNickName    : this.refs.accNickName.value,
          accType        : this.refs.accType.value,
          bankName       :  this.refs.bankName.value,
          branchName     : this.refs.branchName.value,
          accNumber      : this.refs.accNumber.value,
          ifscCode       :  this.refs.ifscCode.value,

       }//close array


        Meteor.call('insertCompanyBankDetails', companyBankDetailsFormValue,
          function(error, result){
            if(error){
              console.log(error);
              swal('Oops...', 'Something went wrong!', 'error');
            }else{
             
              swal('Bank Details Added Successfully!','','success');
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
  }
   getButtonforbank(){
    if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
      if(this.props.companyData && this.props.companyData.bankDetails){
       return ( <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Update</button>);
      }else{
        return (<button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Submit</button>);
      }
    }else{

      if(this.state.infoData=="infoView"){
        null
      }else{
        return ( <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right">Save</button>);

      }   

    }
    
  }
  render(){
    if(!this.props.loading){
    return(
      <section className="NotificationContent">
        <div className="row">

          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="box box-default companysettingbox">
            <div className="box-header with-border franchiseBoxheader">
              <h3 className="box-title1 bnktitle">Bank Details</h3>
            </div>

            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  onlineSXWrapfranchise">
              <form id="bankDetailForm" className="bankDetailForm" onSubmit={this.submitBankDetail.bind(this)}>
                   
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">

                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 " id="bankdetail1">
                      <span className="blocking-span"> 
                        {
                          this.state.infoData=="infoView"?
                          <input id="bnkdetail" value={this.state.accHolderName}  title="Please enter only alphabates"  pattern="[a-zA-Z]+" ref="accHolderName" onChange={this.handleChange} type="text" name="accHolderName" className={this.state.accHolderName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} disabled />
                          :
                          <input id="bnkdetail" value={this.state.accHolderName}  title="Please enter only alphabates"  pattern="[a-zA-Z]+" ref="accHolderName" onChange={this.handleChange} type="text" name="accHolderName" className={this.state.accHolderName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} required />

                        }
                        <span className="floating-label">Account Holder Name<label className="requiredsign">*</label></span>                 
                      </span>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6" id="bankdetail1">
                      <span className="blocking-span"> 
                       {
                          this.state.infoData=="infoView"?
                       <input value={this.state.accNickName}  title="Please enter only alphabates"  pattern="[a-zA-Z]+" ref="accNickName" onChange={this.handleChange} type="text"  name="accNickName" className={this.state.accNickName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} disabled />
                       :
                       <input value={this.state.accNickName}  title="Please enter only alphabates"  pattern="[a-zA-Z]+" ref="accNickName" onChange={this.handleChange} type="text"  name="accNickName" className={this.state.accNickName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} />

                     }
                        <span className="floating-label">Account Nick Name<label className="requiredsign"></label></span>                 
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">


                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 franchiseidbox" id="bankdetail1">
                        <span className="">Select Account Type<label className="requiredsign"></label></span>                 
                      {
                          this.state.infoData=="infoView"?  
                      <span className="blocking-span"> 
                       <select value={this.state.accType} name="accType" ref="accType" onChange={this.handleChange} className={this.state.accType ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} disabled>
                        
                        <option value="Current">Current</option>
                        <option value="Saving">Saving</option>
                       </select>
                      </span>
                      :
                        <span className="blocking-span"> 
                       <select value={this.state.accType} name="accType" ref="accType" onChange={this.handleChange} className={this.state.accType ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"}>
                        
                        <option value="Current">Current</option>
                        <option value="Saving">Saving</option>
                       </select>
                      </span>
                    }
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 " id="bankdetail1">
                      <span className="blocking-span">
                      {
                          this.state.infoData=="infoView"? 
                       <input value={this.state.bankName} title="Please enter only alphabates" pattern="[a-zA-Z]+" ref="bankName" onChange={this.handleChange} type="text"  name="bankName" className={this.state.bankName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} disabled />
                      :
                       <input value={this.state.bankName} title="Please enter only alphabates" pattern="[a-zA-Z]+" ref="bankName" onChange={this.handleChange} type="text"  name="bankName" className={this.state.bankName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} required />
                      }

                        <span className="floating-label">Enter Bank Name<label className="requiredsign">*</label></span>                 
                      </span>
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">

                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 " id="bankdetail1">
                      <span className="blocking-span"> 
                       {
                          this.state.infoData=="infoView"? 
                       <input value={this.state.accNumber} maxLength="16" ref="accNumber" onChange={this.handleChange} type="text"  name="accNumber" pattern="^([0-9]).{10,16}" title="Please enter from 11 to 16 digits number only" className={this.state.accNumber ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} disabled />
                       :
                       <input value={this.state.accNumber} maxLength="16" ref="accNumber" onChange={this.handleChange} type="text"  name="accNumber" pattern="^([0-9]).{10,16}" title="Please enter from 11 to 16 digits number only" className={this.state.accNumber ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} required />
                     }
                        <span className="floating-label">Enter Account Number<label className="requiredsign">*</label></span>                 
                      </span>
                    </div>
                    
                    <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 " id="bankdetail1">
                      <span className="blocking-span">
                       {
                          this.state.infoData=="infoView"? 
                       <input value={this.state.branchName}  title="Please enter only alphabates" pattern="[a-zA-Z]+" ref="branchName" onChange={this.handleChange} type="text"  name="branchName" className={this.state.branchName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} disabled />
                       :
                        <input value={this.state.branchName}  title="Please enter only alphabates" pattern="[a-zA-Z]+" ref="branchName" onChange={this.handleChange} type="text"  name="branchName" className={this.state.branchName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} required />

                     }

                        <span className="floating-label">Enter Branch Name<label className="requiredsign">*</label></span>                 
                      </span>
                    </div>
                  </div>
                   
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formWrapFD">

                      <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 " id="bankdetail1">
                        <span className="blocking-span"> 
                        {
                          this.state.infoData=="infoView"? 
                         <input value={this.state.ifscCode} title="Enter IFSC Code e.g : SBIN0001565" pattern="[A-Z|a-z]{4}[0-9]{7}" maxLength="11" ref="ifscCode" onChange={this.handleChange} type="text"  name="ifscCode" className={this.state.ifscCode ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} disabled />
                         :
                          <input value={this.state.ifscCode} title="Enter IFSC Code e.g : SBIN0001565" pattern="[A-Z|a-z]{4}[0-9]{7}" maxLength="11" ref="ifscCode" onChange={this.handleChange} type="text"  name="ifscCode" className={this.state.ifscCode ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content " : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} required />

                        }
                          <span className="floating-label">Enter IFSC Code<label className="requiredsign">*</label></span>                 
                        </span>
                      </div>
                    </div>


                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    {this.getButtonforbank()}
                  </div>
                  </div>
              </form>
            </div>
          </div>
          </div>
        </div>
      </section>
      );
  }else{
    return(<h1>Loading.... please wait</h1>)
  }
  }

 }

export default EditBankDetails = withTracker((props)=>{

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
    const postHandle = Meteor.subscribe('LoginInFranchiseData',franchId);
    const loading    = !postHandle.ready();
    const companyData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":franchId})||{};
   if(companyData){
     var bankData = companyData.bankDetails;
   }
    // console.log("bankData==",franchId,bankData);

    return {
        loading,       
        companyData,
        bankData

    };
}) (CompanyBankDetails);

