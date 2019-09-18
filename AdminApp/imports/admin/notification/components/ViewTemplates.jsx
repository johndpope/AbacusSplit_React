import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import TemplateRow from './TemplateRow.jsx';
import EmailTemplateRow from './EmailTemplateRow.jsx';
import NotificationTemplateRow from './NotificationTemplateRow.jsx';
import AllNotificationTemplateRow from './AllNotificationTemplateRow.jsx';
import AllSMSTemplateRow from './AllSMSTemplateRow.jsx';
import SMSTemplateRow from './SMSTemplateRow.jsx';

import { NotificationTemplate } from '../api/NotificationTemplate.js';

export default class ViewTemplates extends TrackerReact(Component) {

	componentDidMount(){
    $("html,body").scrollTop(0);
		// renderFunction();
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
		$('.inputrow').css({'display':'none'});
		$('.actionBtn').css({'display':'none'});
	}
  componentWillMount() {
    // if (!!!$("link[href='/css/dashboard.css']").length > 0) {
    //   var dashboardCss = document.createElement("link");
    //   dashboardCss.type = "text/css"; 
    //   dashboardCss.rel = "stylesheet";
    //   dashboardCss.href = "/css/dashboard.css"; 
    //   document.head.append(dashboardCss);
    // }
  }
   componentWillUnmount(){  
     $("script[src='/js/adminLte.js']").remove(); 
     // $("link[href='/css/dashboard.css']").remove(); 
   }
	constructor(){
		super();
		this.state = {
			subscription : {
				"notificationTemplate" : Meteor.subscribe('notificationTemplate'),
			}
		}
	}

	AllTemplates(){
		var getEmailTemplate = NotificationTemplate.find({"templateType" : "Email"}).fetch();
		// console.log("getEmailTemplate",getEmailTemplate);
		if (getEmailTemplate) {
			return getEmailTemplate;
		}
		// return NotificationTemplate.find({"templateType" : "Email"}).fetch();

	}

	notificationTemplates(){
		return NotificationTemplate.find({"templateType" : "Notification"}).fetch();
	}

	smsTemplates(){
		return NotificationTemplate.find({"templateType" : "SMS"}).fetch();
	}

	AllEmailTemplates(){
		var id = Session.get("templateId");
		// console.log("id",id);
		return NotificationTemplate.find({"_id" : id}).fetch(); 
	}

	AllNotificationTemplates(){
		var id = Session.get("notiftemplateId");
		return NotificationTemplate.find({"_id" : id}).fetch();
	}

	AllsmsTemplates(){
		var id = Session.get("smstemplateId");
		return NotificationTemplate.find({"_id" : id}).fetch();
	}


	render(){
     return(
   <div className="content-wrapper ">
		<section className="content NotificationContent">
        <div className="row">
          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
            <div className="box box-primary">
	            <div className="box-header with-border">
	            <h3 className="box-title">ALL TEMPLATES</h3>
	            </div>
					<div className="box-body">
						<div className="notifTabs col-lg-10 col-lg-offset-3 col-md-10 col-md-offset-3 col-sm-12 col-xs-12">
						  	 <ul className="nav nav-pills">
							    <li className="active notifTab col-lg-2 col-md-2 col-sm-4 col-xs-4">
							    	<a data-toggle="pill" href="#emailTemplates" > Email 
							    	</a>
							    </li>
							    <li className="col-lg-2 col-md-2 col-sm-4 col-xs-4 notifTab">
							    	<a data-toggle="pill" href="#notificationTemplates">
							    		Notification
							    	</a>
							    </li>
							    <li className="col-lg-2 col-md-2 col-sm-3 col-xs-3 notifTab">
							    	<a data-toggle="pill" href="#smsTemplates">
							    		SMS
							    	</a>
							    </li>
							</ul>
						</div>
						<div className="tab-content tabContentStyle">
							<div id="emailTemplates" className="tab-pane fade in active">
							  <div className="">
							  	<div className="sidertemplatebar col-lg-3 col-md-3 col-xs-12 col-sm-12">
							  		<div className="row">
									<ul className="templateLibrary">
									    <div className="templateLibraryHeader">Template Library</div>
									    <div className="showTemplate">
										{ this.AllTemplates().map( (templateData)=>{
											return (<TemplateRow key={templateData._id} templateValues={templateData}/>);
										  }) 
										}
										</div>	

									</ul>
									</div>
								</div>
								<div className="saveTemplateWrapper col-lg-9 col-md-9 col-xs-12 col-sm-12">
									<div className="defaultMsg">
										<h1>Please Select The Template</h1>
										<i className="fa fa-hand-o-left" aria-hidden="true"></i>
									</div>
									{ this.AllEmailTemplates().map( (emailtemplateData)=>{
										return <EmailTemplateRow key={emailtemplateData._id} emailtemplateValues={emailtemplateData}/>
									  }) 
									}
								</div> 
							  </div>
							</div>
							<div id="notificationTemplates" className="tab-pane fade">
							  <div className="">
							  	<div className="sidertemplatebar col-lg-3 col-md-3 col-xs-12 col-sm-12">
							  		<div className="row">
									<ul className="templateLibrary">
									    <div className="templateLibraryHeader">Template Library</div>
									    <div className="showTemplate">
										{ this.notificationTemplates().map( (templateData)=>{
											return <NotificationTemplateRow key={templateData._id} templateValues={templateData}/>
										  }) 
										}	
										</div>
									</ul>
									</div>
								</div>
								<div className="saveTemplateWrapper col-lg-9 col-md-9 col-xs-12 col-sm-12">
									<div className="defaultMsg">
										<h1>Please Select The Template</h1>
										<i className="fa fa-hand-o-left" aria-hidden="true"></i>
									</div>
									{ this.AllNotificationTemplates().map( (notificationtemplateData)=>{
										return <AllNotificationTemplateRow key={notificationtemplateData._id} notificationtemplateValues={notificationtemplateData}/>
									  }) 
									}
								</div>
							  </div>
							</div>
							<div id="smsTemplates" className="tab-pane fade">
							    <div className="">
							  	<div className="sidertemplatebar col-lg-3 col-md-3 col-xs-12 col-sm-12">
							  		<div className="row">
									<ul className="templateLibrary">
									    <div className="templateLibraryHeader">Template Library</div>
									    <div className="showTemplate">

										{ this.smsTemplates().map( (smstemplateData)=>{
											return <SMSTemplateRow key={smstemplateData._id} smstemplateValues={smstemplateData}/>
										  }) 
										}

										</div>	

									</ul>
									</div>
								</div>
								<div className="saveTemplateWrapper col-lg-9 col-md-9 col-xs-12 col-sm-12">
									<div className="defaultMsg">
										<h1>Please Select The Template</h1>
										<i className="fa fa-hand-o-left" aria-hidden="true"></i>
									</div>
									{ this.AllsmsTemplates().map( (smstemplateData)=>{
										return <AllSMSTemplateRow key={smstemplateData._id} smstemplateValues={smstemplateData}/>
									  }) 
									}
								</div>
							  </div>
							</div>
							
						</div>
					</div>
				</div>
			</div>
		</div>
		</section>	
	  </div>
     	);
    }

}
