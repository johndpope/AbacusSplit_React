import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import {withTracker}                from 'meteor/react-meteor-data';
import {Meteor}                     from 'meteor/meteor';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import CompanyInformation           from  '/imports/admin/companySetting/components/CompanyInformation_setting/CompanyInformation.jsx';
import CompanyLocation              from  '/imports/admin/companySetting/components/location//CompanyLocation.jsx';
import CompanyBankDetails           from  '/imports/admin/companySetting/components/Company_bank_details/CompanyBankDetails.jsx';
import DocumentAttachment           from  '/imports/admin/companySetting/components/CompanyInformation_setting/DocumentAttachment.jsx';
import CompanyTaxDetails            from  '/imports/admin/companySetting/components/Company_bank_details/CompanyTaxDetails.jsx';
import CompanyCommissionCharges     from  '/imports/admin/companySetting/components/Company_bank_details/CompanyCommissionCharges.jsx';
import AddContactCategory           from  '/imports/admin/companySetting/components/Add_Contact_Category/AddContactCategory.jsx';
import AddContactStatus             from  '/imports/admin/companySetting/components/Add_Contact_Status/AddContactStatus.jsx';
import AddContactLeadSource         from  '/imports/admin/companySetting/components/Add_Contact_Leadsource/AddContactLeadSource.jsx';
import AddPropertyType              from  '/imports/admin/companySetting/components/Add_Property_subproperty/AddPropertyType.jsx';
import AddPropertySubType           from  '/imports/admin/companySetting/components/Add_Property_subproperty/AddPropertySubType.jsx';

export default class FranchiseCompanySettingTabs extends Component{
  
  constructor(){
      super();
        this.state = {
           facilityPermission : 'waitingforResult',
        }
    }

    componentWillMount(){
      $('.sidebar').css({display:'block',background: '#222d32'});
       Meteor.call("isAuthenticated","FranchiseSettings","FranchiseDetails",(err,res)=>{
      if(err){
        console.log(err);
      }else{
        if(res==true){
          this.setState({
             facilityPermission : res,
          });
        }else if(res==false){
          this.setState({
             facilityPermission : res,
          });
        }
      }
    });
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
  

  render() {
     if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
      $('.sidebar').css({display:'block',background: '#222d32'});
    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="">
          {/* Content Header (Page header) */}
        
          {/* /.row */}
          <section className="content">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
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
                            <div id="parkingreport" className="ReportTabs col-lg-2 col-md-2 col-sm-12 col-xs-12">
                              <ul className="nav nav-pills sidetabs">
                                <li className="active transactionTab CStabl col-lg-12 col-md-12 col-sm-4 col-xs-12">
                                  <a data-toggle="pill" href="#companyInformation" className="CStablst">
                                    Franchise Details
                                  </a>
                                </li>
                                <li className=" transactionTab CStabl col-lg-12 col-md-12 col-sm-3 col-xs-12">
                                  <a data-toggle="pill" href="#CompanyBankDetails" className="CStablst">
                                    Bank Details
                                  </a>
                                </li>
                               
                                    

                                   
                                      
                              
                                  {
                                    Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])

                                    ?
                                      <li className="transactionTab CStabl  col-lg-12 col-md-12 col-sm-3 col-xs-12 transactionTab CStabl">
                                          <a data-toggle="pill" href="#CompanyTaxDetails" className="CStablst">
                                            Tax Settings
                                          </a>
                                      </li>
                                    :
                                    null
                                   }
                                   <li className=" transactionTab CStabl col-lg-12 col-md-12 col-sm-4 col-xs-12">
                                      <a data-toggle="pill" href="#DocumentAttachment" className="CStablst">
                                        Document Attachment
                                      </a>
                                    </li>
                                {/*  {
                                    Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin','Franchise'])

                                    ?
                                      <li className="transactionTab CStabl  col-lg-12 col-md-3 col-sm-12 col-xs-12 transactionTab CStabl">
                                          <a data-toggle="pill" href="#CompanyFranchiseShare" className="CStablst">
                                            Franchise Share
                                          </a>
                                      </li>
                                    :
                                    null
                                   }*/}
                        
                             
                              
                              </ul>
                            </div>
                            
                            <div className="tab-content col-lg-10 col-md-10 col-sm-12 col-xs-12">
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
