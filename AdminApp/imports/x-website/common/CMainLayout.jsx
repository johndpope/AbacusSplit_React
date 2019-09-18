import {createContainer} from 'meteor/react-meteor-data';
import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';


import AboutUs from '../aboutUs/AboutUs.jsx';
import ContactUsHome from '../contactUs/component/ContactUsHome.jsx';

import { About } from '/imports/admin/reactCMS/api/aboutus.js';

class CMainLayout extends TrackerReact(Component) {
  constructor(props){
    super(props);
    this.state ={
      // aboutData : [],
      "subscription" : {
        about             : Meteor.subscribe("about"),
      }
    }
  }
  aboutDatabase(){
    var aboutdatas = About.findOne({});
    if(aboutdatas){
      console.log('hi this is about data:',aboutdatas);
      return aboutdatas;     
    }

  }
  componentDidMount() {
    
  }
  render(){
    return(
      <div className="website-wrapper">
        {/*<HeaderSec />*/}
        {/*<Carousel />*/}
        {/*<WelcomeToCompany />
        <StudyPlan />
        <AboutUs /> 
        <WhyChooseUs />
        <DoYouKnow />
        <Feature />
        <OurExpertise />
        <HowItWorks />
        <ExcitedBlog />       
        <AssurePricingPlan /> 
        <Testimonial />
        <Blog />
        <Clients />
        <ContactUsHome />
        <FooterSec />*/}
      </div>
    );
  }
}
Layoutconainer = createContainer((props)=>{
    const postHandle = Meteor.subscribe('about');
    const post       = About.findOne({})||{};
    const loading    = !postHandle.ready();
    // console.log('post',post);
     return {
        loading,
        post,
    };
  },CMainLayout);

export default Layoutconainer;

       
       