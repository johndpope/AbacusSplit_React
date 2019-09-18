import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Services} from '../api/Services';
import {TempServiceImages} from '../api/Services';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


export default class ListOfServices extends TrackerReact(Component) {
	constructor(props) {
    super(props); 
    this.state = {
    	services          : [],
      "subscription"  : {
        "singleServices" : Meteor.subscribe("singleServices"),
        "projectSettingsPublish" : Meteor.subscribe("projectSettingsPublish"),
        "tempServiceImages" : Meteor.subscribe("tempServiceImages"),
      }  
    }; 
  }
	componentDidMount() {
    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
    this.serviceTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("services");
      const services = Services.find().fetch();
      this.setState({services: services});
    });
    this.tempServiceImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempServiceImages');
      const tempServiceImages = TempServiceImages.find().fetch();
      this.setState({tempServiceImages});
    });
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
    if (this.serviceTracker) {
    this.serviceTracker.stop();
    }
    if (this.tempServiceImageTracker) {
      this.tempServiceImageTracker.stop();
    }
  }
  
  renderTableRow(){
    return this.state.services.map((service,index) =>{
      // var text= service.servicesDescription;
      // var regex = new RegExp("</p><p>", 'g');
      // text = text.replace(regex, '\n');
      return <tr key={index}>
              <td><img src={service.image} className="img-responsive serviceLogo" /></td>
              <td> {service.serviceFor} </td>
              <td> {service.serviceName} </td>
              <td> {service.serviceRate} </td>
              <td>{service.serviceDayNumbers} {service.serviceDuration} </td>
              <td>
                <a href={'/admin/EditService/'+service._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
             
                <a href="#" id={service._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
                  <i className="fa fa-trash-o"></i>  
                </a>
              </td>
            </tr>;
      });
  }
  
  delete(e){
    e.preventDefault();
    let id = $(e.currentTarget).attr("id");
    swal({
      title: "Are you sure?",
      text: "You want to delete this page!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false,
      html: false
    }, function(){
      Meteor.call("deleteService",id,function(error,result){
          if(error){
              console.log(error.reason);
          }else{
              // Bert.alert("Successfully Deleted..!!");
              swal("Done","Your page has been deleted!.", "success");
          }
      });

    });
  }

  render() {
       return (
        <div className="content-wrapper">
          <section className="content-header">
            <h1> Service Management </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-briefcase" />Service Management</a></li>
              <li className="active">List Of Services</li>
            </ol>
          </section>
           <section className="content">
             <div className="row">
               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                 <div className="box box-primary">
                    <div className="box-header with-border">
                     <h2 className="box-title">List Of Services</h2>  
                    </div>
                    <div className="box-body ">  
                      <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                          <thead>
                              <tr>
                                  <th>Logo</th>
                                  <th>Service For</th>
                                  <th>Service Name</th>
                                  <th>Service Rate</th>
                                  <th>Service Duration</th>
                                  <th>Actions</th>
                              </tr>
                          </thead>
                           
                          <tbody>
                                 {this.renderTableRow()}
                          </tbody>
                        </table>
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
