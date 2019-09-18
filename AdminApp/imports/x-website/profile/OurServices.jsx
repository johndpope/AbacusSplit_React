import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { Services } from '/imports/admin/reactCMS/api/Services.js';
import {browserHistory} from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

class OurServices extends TrackerReact(Component) {
   constructor(props) {
    super(props); 
    this.state = {
      services            : [],
      "subscription"  : {
        "services" : Meteor.subscribe("services"),    
      }    
    };   
  }
  componentDidMount() {
    // this.servicesTracker = Tracker.autorun( ()=> {
    //   Meteor.subscribe("services");
    //   const services = Services.find().fetch();
    //   // console.log("services",services);
    //   this.setState({services: services});
    // });
  }
  componentWillUnmount() {
     // if (this.servicesTracker) {
     //  this.servicesTracker.stop();
     //  }
  }  
  linkToServiceInfo(event){
    event.preventDefault();
    var id = $(event.currentTarget).attr('id');
    // console.log("id",id);
    var path = "/ServiceInfo/"+id;
    // console.log("path",path);
    browserHistory.replace(path);
  }

  services(){
    return this.props.services.map((services,index)  => {
      return(
         <div className="col-lg-4 col-md-4 col-sm-6 col-xs-6" key={index}>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationBlock" id={services._id} onClick={this.linkToServiceInfo.bind(this)}>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 iconOuterBlock">
                 <img src={services.image}  className="profileServiceImage"/>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 verificationName">
                  <p>{services.serviceName}</p> 
              </div>
            </div>
        </div>);
      });
  }

	render() {  
    return (
  	  <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 verSerBlock landingBlocks noProfilePadding">
          <h5 className="text-center"><b>Our Services</b></h5>
          {!this.props.loading ?
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                {this.services()}
              </div>
            :
            <span>Loading</span>
          }

      </div>
    );
  }
}
ServicesContainer = withTracker(({props}) => {
    const postHandle    = Meteor.subscribe("services");
    const loading       = !postHandle.ready();

    var _id = Meteor.userId();
    const services   = Services.find({"serviceFor" :'user'}).fetch()||[];
    console.log("services",services);
   
    return {
      loading,
      services,
    };
})(OurServices);
export default ServicesContainer;