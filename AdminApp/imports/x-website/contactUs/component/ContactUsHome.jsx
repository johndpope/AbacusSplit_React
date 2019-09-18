import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';

import { CompanySettings } from '/imports/admin/companySetting/api/CompanySettingMaster.js'; 
import  ContactUsMap from './contactUsMap.js';

export default class ContactUsHome extends TrackerReact(Component) {
  constructor(props){ 
    super(props);
    this.state ={
      // "subscription" : {
      // }
      "companyData" : {},
      "companyInfo" : [],
    }
  }

  componentWillMount(){
  }
  componentWillUnmount(){
  }

  componentDidMount(){
    this.companysettingsTracker = Tracker.autorun(()=>{
      var handle = Meteor.subscribe('companyData');
      if(handle.ready()){
        var companyObj = CompanySettings.findOne({});
        // console.log(companyObj);
        if(companyObj){
          this.setState({
              'companyData': companyObj,
              'companyInfo': companyObj.companyLocationsInfo,
          });
        }
      }
    });
  }

  render() {
    return (
      <div className="contactUs contactOuterWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <h1 className="chooseUsHead text-center">
           Feel Free To Drop Us A Line
          </h1>
          <h6 className="chooseUsSubhead text-center">
           WE ARE HAPPY TO LISTEN
          </h6>
          <div>  
            <span className="lineChooseUs"/>
          </div>
        </div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contactusOutWrapper ">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <h4 className="contactTitle">Feel free to drop us a line!</h4>
                <input type="text" name="your-name"placeholder="Your Name" className="col-lg-11 contactTextbox"/>
                <input type="email" name="your-email"placeholder="Email Address" className="col-lg-11 contactTextbox "/>
                <textarea name="yourmessage" cols="40" rows="10" aria-required="true" aria-invalid="false" placeholder="Type your message here" className="col-lg-11 contactTextbox"/>
                <button className="col-lg-12 col-md-12 col-sm-12 col-xs-12 contactSubmit">Give Us A Shout</button>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <h4 className="contactTitle">Find us on google map</h4>
              <div className="contactUsMapOuter">
                <ContactUsMap />
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h5 className="addressHeading">Office Address</h5>
                <address className="addressDetails">
                  {
                    this.state.companyInfo.map((locInfo,index)=>{
                      return(
                        <span key={index}>
                          {
                            index == 0 ?
                            <span>{locInfo.companyAddress} <br/>
                            {locInfo.companyCity} – {locInfo.companyPincode} <br/>
                            {locInfo.companyCountry}</span>
                            :
                            ""
                          }
                        </span>
                      )
                    })
                  }
                </address>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                <h5 className="addressHeading">Contact Information</h5>
                <div className="addressDetails">
                  Local: {this.state.companyData.companyContactNumber}<br />
                  Mobile: +91 {this.state.companyData.companyMobileNumber}<br />
                  {this.state.companyData.companyEmail}
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }
}