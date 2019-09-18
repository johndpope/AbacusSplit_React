import React, {Component} from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {createContainer} from 'meteor/react-meteor-data';


class Aboutusvideo extends TrackerReact(Component) {
  
  render(){
    return(
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headOne">
          <div className="color-overlay-one"></div>
          <div className="container aboutVideoContainer col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5">
              <span className="videoHeadOne pull-right">CLICK TO PLAY<br/>VIDEO</span>
            </div>
            <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 text-center">
              <i className="fa fa-play page-sectionThree" aria-hidden="true" href="#myModal" data-toggle="modal"></i>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-5 col-xs-5 aboutPadLeft">
              <span className="videoHeadTwo">UNDERSTAND WHY YOU SHOULD <br/> HAVE YOUR OWN <br/> ASSUREID</span>
            </div>
          </div>
          <div id="myModal" className="modal fade ">
            <div className="modal-dialog modal-lg">
            <button type="button" className="close videoBtnPosition" data-dismiss="modal" aria-hidden="true">&times;</button>
              <iframe className="videoMmodal" width="560" height="315" src="https://www.youtube.com/embed/7wtfhZwyrcc" frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>
        </div>
    );
  }
}

aboutusvideoconainer = createContainer((props)=>{
/*    const postHandle = Meteor.subscribe('about');
    const post       = About.findOne({})||{};
    const loading    = !postHandle.ready();*/
    // console.log('post',post);
     return {
       /* loading,
        post,*/
    };
  },Aboutusvideo);

export default aboutusvideoconainer;