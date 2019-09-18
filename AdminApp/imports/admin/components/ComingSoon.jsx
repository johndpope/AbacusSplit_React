import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';

export default class ComingSoon extends TrackerReact(Component) {
	componentDidMount(){
		$('html, body').scrollTop(0);
    if(!!!$("link[href='/css/dashboard.css']").length > 0){
      var dashboardCss = document.createElement("link");
      dashboardCss.type="text/css";
      dashboardCss.rel ="stylesheet";
      dashboardCss.href="/css/dashboard.css";
      document.head.append(dashboardCss);
    }
  }
	componentWillUnmount(){
	    $("link[href='/css/dashboard.css']").remove();
	}

   render(){
    return(
      <div>
        <div className="content-wrapper">
          <section className="content">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box box-primary">
                   <div className="box-body comingSoonBoxBody">
                     <div className="row">
	                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	                         <div className="comingsoonImage col-lg-offset-2 col-lg-8"></div>
	                      </div>
	                    </div>
	                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}