import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import {browserHistory} from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { Services } from '/imports/admin/reactCMS/api/Services.js';

class CompanyServices extends TrackerReact(Component) {
  constructor(props) {
    super(props); 
    this.state = {
      "subscription"  : {
      }    
    };   
  }
  componentDidMount() {
  }
  componentWillUnmount() {
  }  
  linkToServiceInfo(event){
    event.preventDefault();
    var id = $(event.currentTarget).attr('id');
    // console.log("id",id);
    var path = "/ServiceInfo/"+id;
    // console.log("path",path);
    browserHistory.replace(path);
    $('html,body').scrollTop(0);
  }

  services(){
    return this.props.services.map((services,index)  => {
      return(
        <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6" key={index}>
          {services.serviceFor == 'company' ?
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationBlock" id={services._id} onClick={this.linkToServiceInfo.bind(this)}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 iconOuterBlock">
                <img src={services.image}  className="profileServiceImage"/>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationName">
                <p>{services.serviceName}</p> 
              </div>
            </div>
            :
            ""
          }
        </div>
      );
    });
  }

	render() {  
    return (
  	  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 verSerBlock landingBlocks noProfilePadding">
          <h5 className="text-center"><b>Our Services</b></h5>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          {!this.props.loading ? 
            this.services()
            :
            <span>Loading..</span>
          }
          </div>
      </div>
    );
  }
}
UserDataContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe("services");
    const loading       = !postHandle.ready();

    var _id = Meteor.userId();
    const services   = Services.find().fetch()||[];
    // console.log("services",services);
   
    return {
      loading,
      services,
    };
})(CompanyServices);
export default UserDataContainer;