import React,{Component} from 'react';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { render } from 'react-dom';
import {Meteor } from 'meteor/meteor';
import {Tracker} from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';
import {Mongo} from 'meteor/mongo';


export default class StudentContent extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state = {
      allUserData : [],
      userCount: 0,
    };
  }
  componentDidMount() {
    const handle = Meteor.subscribe("allUserData");
    this.allUserDataTracker = Tracker.autorun(() => {
      const allUserData = Meteor.users.find().fetch();
      if(handle.ready()){
        this.setState({allUserData});
          if ( !$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type = "text/javascript";
          adminLte.src = "/js/adminLte.js";
          adminLte.setAttribute('id','adminLte');
          $("body").append(adminLte);
        }
      }
    });

  }

  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();
    this.allUserDataTracker.stop();
  }
  allUserCount(){
    return this.state.allUserData.length;
  }
  render(){
    return(
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>Dashboard
            </h1>
            <ol className="breadcrumb">
              <li>
                <Link to="#"><i className="fa fa-dashboard" /> Home</Link></li>
              <li className="active">Dashboard</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            {/* Info boxes */}
            <div className="row">
             
            </div>
            {/* /.row */}
            <div className="row">
           </div>
            {/* /.row */}
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>
    );
  }
}
