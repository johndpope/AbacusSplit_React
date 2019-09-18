import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import { CompanySettings } from '/imports/admin/companySetting/api/CompanySettingMaster.js'; 
import  ContactUsMap from './contactUsMap.js';

export default class ContactUs extends TrackerReact(Component) {
  constructor(props){
    super(props);
    this.state ={
      // contactUsData:[],
      // "subscription" : {
      // }
      "companyData" : {},
      "companyInfo" : [],
    }
  }
  componentDidMount() {
    if(!$("link[href='/css/assureServices.css']").length > 0){
      var servicesCss = document.createElement("link");
      servicesCss.type="text/css";
      servicesCss.rel ="stylesheet";
      servicesCss.href="/css/assureServices.css";
      document.head.append(servicesCss);
    }
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
  componentWillUnmount() {
    $("link[href='/css/assureServices.css']").remove();
  }
  componentWillMount(){
  }

  render() {
    return (
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLR">
        <div className="servicesImageWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div className="color-overlay"></div>
          <div className="header-wrapper-inner col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h1>Contact Us</h1>
            </div>
          </div>
        </div>
        <div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 contactusOutWrapper1">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <h4 className="contactTitle">Get started today</h4>
              <p>Improve verification results with access to multiple databases. And leverage our industry best practice solution settings or configure the verification settings for your unique business needs. </p>

              <p>
                That's next-generation backround screening services from AssureID.
                <br/>
                To explore your requirements with us in more detail, and discover exactly how our
                online screening and verification solution can benefit your business,
                <br/>
                contact us on > {this.state.companyData.companyContactNumber}
                <br/>
                or email > {this.state.companyData.companyAltEmail}
              </p>
              <br/>

              <h4 className="contactTitle">Contact Us</h4>
              <p>
                Appointment with consultant
                <br/>
                Customer Support
                <br/>
                Media Kit
              </p>

              <p>
              "I've got AssureID" program
              <br/>
              By leveraging economies of scale, AssureID is able to deliver consistent results at prices below clients' in-house cost. Our goal is to protect our clients from employing fraudulent, dishonest, or otherwise unsuitable candidates and to assist each client to have a better understanding of who they are hiring into their organization. The "I've got AssureID" program lets our clients prove to you that they have selected safe, honest and reliable employees.
              <br/>
              AssureID operates PAN India through our operation centers located at NCR, Mumbai and Pune
              </p>
              <p>To find out more about AssureID go to: {/*<a>www.assureid.in</a>*/}www.assureid.in</p>

              <p>
                The information and specifications are current at time of publication of this material. AssureID reserves the right to change such
                information and specifications at any time without prior notice. All of the services referred to in this material are offered strictly
                subject to AssureID's full terms and conditions of sale for the particular services, a copy of which is available upon request.
              </p>

              <p>
                {this.state.companyData.companyName}
                <br/>
                Registered in India - Company Identification No: {this.state.companyData.companyUniqueID}
                <br/>
                India Sales: - +91 {this.state.companyData.companyMobileNumber}
              </p>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <h4 className="contactTitle">Feel free to drop us a line!</h4>
                <input type="text" name="your-name"placeholder="Your Name" className="col-lg-11 contactTextbox"/>
                <input type="email" name="your-email"placeholder="Email Address" className="col-lg-11 contactTextbox "/>
                <textarea name="yourmessage" cols="40" rows="10" aria-required="true" aria-invalid="false" placeholder="Type your message here" className="col-lg-11 contactTextbox"/>
                <button className="col-lg-12 contactSubmit">Give Us A Shout</button>
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
// className="contactInput"