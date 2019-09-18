import React, { Component }     from 'react';
import { render }               from 'react-dom';
import TrackerReact             from 'meteor/ultimatejs:tracker-react';
import {withTracker}            from 'meteor/react-meteor-data';
import Validation               from 'react-validation';
import validator                from 'validator';
import { FranchiseDetails }      from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import {createContainer}        from 'meteor/react-meteor-data';
// import {HSN} from '../../masterData/api/addHsn.js/imports/admin/companySetting/api';

// import CompanyTaxList           from '/imports/admin/companySetting/components/Company_bank_details/CompanyTaxList.jsx';
// import CompanySettingIndicators from '/imports/admin/companySetting/components/CompanyInformation_setting/companySettingIndicators.jsx';

export default class FranchiseShare extends Component{

  componentDidMount(){
    $('.companyTaxDetails').addClass('divActive');
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
        // console.log("I am appended!");
        var adminLte = document.createElement("script");
        adminLte.type = "text/javascript";
        adminLte.src = "/js/adminLte.js";
        adminLte.setAttribute('id','adminLte');
        $("body").append(adminLte);
      }
  }

  
	constructor(props) {
	  super(props);
	 
	}
  render(){
  	return(
  		<section className="NotificationContent">
        <div className="row">
          <div className="col-lg-11 col-lg-offset-0 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 ">
            <div className="box box-default companysettingbox">
            
            <div className="box-body tablebdy col-lg-offset-4"> 
              <h3>Coming Soon...</h3> 
     
            </div>
            </div>
          </div>
  		  </div>

  		  



		    {/*<div className="emptyDiv"></div>*/}
      </section>

  		);
  }

 }

