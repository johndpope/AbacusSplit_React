import React,{Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
// import {StudentMaster} from '/imports/student/api/studentMaster.js';
// import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class SystemWarning extends TrackerReact(Component){
  
  constructor(props) {
   super(props);
    this.state = {
      subscription :{
        "userData" : Meteor.subscribe("userData",Meteor.userId()), 
        "studentData" : Meteor.subscribe("singleStudent",Meteor.userId()), 
      }
    }
    this.hideShadow=this.hideShadow.bind(this);
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

 //  handleClick(e) {
 //      e.preventDefault();
 //      Meteor.logout();
 //      FlowRouter.go('/');
 // } 

 // myprofileClick(e) {
 //    var id = $(e.currentTarget).attr('id');
 //    FlowRouter.go('/franchise/profile/'+id);
 // }


 hideShadow(){
   $('.modal-backdrop').hide();
 }


 
       

  render(){
    return(
     
        <div className="warningBx"> 
        <label data-toggle="modal" data-target="#SustemInfoModal" onClick={this.hideShadow.bind(this)}><blink>Warning</blink></label>
       
    
         </div>
     
    );
  }
}



