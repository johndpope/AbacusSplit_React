import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {createContainer} from 'meteor/react-meteor-data';

import Aboutusvideo from './Aboutusvideo.jsx';

import { About } from '/imports/admin/reactCMS/api/aboutus.js';

class AboutUsIntro extends TrackerReact(Component) {
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
  handleScroll() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {  
     console.log('hello');
    } else {
      console.log('inside else');
    }
  }
  componentWillUpdate(){
    $(window).scroll(function() {
        if ($(document).scrollTop() > 300) {
          $('.boldOne').each(function () {
            $(this).prop('Counter',0).animate({
                Counter: $(this).text()
            }, {
                duration: 4000,
                easing: 'swing',
                step: function (now) {
                    $(this).text(Math.ceil(now));
                }
            });

            $('.count').removeClass('count').addClass('counted');
      
          });

        } 
    });
  }
  render(){
    return(
      <div>
        <div className="services">
          <div className="servicePage">
            <div className="head">
              <div className="color-overlay"></div>
              <div className="headContent col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <h1 className="">About Us</h1>
              </div>
            </div>

            <div className="aboutImgTop">
              <div id="about-content">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 aboutBottom">
                  <div className="aboutContent aboutDiv aboutContentone col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <div id="about-intro">
                      <div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBTM">
                          <h4>We are creative</h4>
                          <p className="aboutP">
                            Lorem adipipsum idolor sit iamet, iconsectetur aisicing elit. Necessitatibus illo vel dolorum soluta consectetur doloribus sit. Delectus non tenetur odit dicta vitae debitis suscipitaut voluptas quaerat consectetur.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="aboutUS-Img col-lg-4 col-md-4 col-sm-4 col-xs-12">
                    <img src="/images/assureid/center_image.jpg" alt="aboutUs"/>
                  </div>
                   
                  <div className="aboutContent aboutDiv col-lg-4 col-md-4 col-sm-4 col-xs-12">
                   <div id="about-intro">
                      <div>
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 marginBTM" >
                          <h4>We are awesome</h4>
                          <p className="aboutP">
                            Lorem adipipsum idolor sit iamet, iconsectetur aisicing elit. Necessitatibus illo vel dolorum soluta consectetur doloribus sit. Delectus non tenetur odit dicta vitae debitis suscipitaut voluptas quaerat consectetur.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Aboutusvideo />

              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 page-sectionOne">
                <div id="contact-link" className="p-110-cont grey-light-bg">
                  <div className="container">
                    <div className="row">
                    
                      <div className="col-md-3 col-sm-3 col-xs-3 col-lg-3">
                        <div className="cis-cont">
                          <div className="font-Size col-lg-12 counter">
                            <h3 id="numberCount"><span className="boldOne hello">75</span></h3>
                            <p>AWARDS WINNING</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-xs-3  col-lg-3">
                        <div className="cis-cont">
                          <div className="cis-text font-Size col-lg-12">
                            <h3><span className="boldOne">450</span></h3>
                            <p>HAPPY CLIENTS</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-xs-3 col-lg-3">
                        <div className="cis-cont">
                          <div className="cis-text font-Size col-lg-12">
                            <h3><span className="boldOne">151</span></h3>
                            <p>PROJECTS DONE</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 col-sm-3 col-xs-3 col-lg-3">
                        <div className="cis-cont">
                          <div className="cis-text font-Size col-lg-12">
                            <h3><span className="boldOne">768</span></h3>
                            <p>HOURS OF CODE</p>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </div>        
                </div>
              </div>                          
            </div>
          </div>
        </div>
          
      </div>
    );
  }
}

aboutusconainer = createContainer((props)=>{
    const postHandle = Meteor.subscribe('about');
    const post       = About.findOne({})||{};
    const loading    = !postHandle.ready();
    // console.log('post',post);
     return {
        loading,
        post,
    };
  },AboutUsIntro);

export default aboutusconainer;