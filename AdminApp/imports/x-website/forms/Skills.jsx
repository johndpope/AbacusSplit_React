import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import SkillsRequired from '../views/SkillsRequired.jsx';
import { UserProfile } from "./api/userProfile.js";
import  SkillsForm from './SkillsForm.jsx';

class Skills extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={
      "skill"   : '', 
      "subscription" : { 
      } 
    };
  }
  
  render(){
    if (!this.props.loading) {
       return(
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
           <SkillsForm />
           <SkillsRequired userId={this.props.userData.userId} skillData={this.props.userData.skills}/>
         </div>
      );
     }else{
      return(
        <span>Loading</span>
        );
     }
   

  } 
}
skillsContainer = withTracker(props => {
    const postHandle = Meteor.subscribe('userprofile',props.userId);
    var userData = UserProfile.findOne({"userId": props.userId}) || {};
    // console.log("userData:",userData);
    const loading   = !postHandle.ready();
    return {
      loading,
      userData,
    };
})(Skills);
export default skillsContainer;