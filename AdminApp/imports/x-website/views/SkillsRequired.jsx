import React, { Component }  from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Skills from '../forms/Skills.jsx';
import { UserProfile } from '../forms/api/userProfile.js';

export default class SkillsRequired extends TrackerReact(Component){
	constructor(props){
    super(props); 
    this.state ={
      "subscription" : {
        // "userData" : Meteor.subscribe('userprofile',Meteor.userId()),    
        // "userProfileData" : Meteor.subscribe("userProfileData"),
      } 
    }
  }
  deleteSkills(event){
    event.preventDefault();
    var skillIndex = parseInt($(event.currentTarget).attr('id'));
    // console.log("skillIndex",typeof(skillIndex));
    var userId  = this.props.userId;
    // console.log("userId",userId);
    Meteor.call('deleteSkills',skillIndex,userId,function(error,result) {
        if (error) {
          console.log(error.reason);
        }else{
          // swal("Done","Skill Deleted successfully!");   
        }
     })
  }

  render() {
  	// console.log("userId",this.props.userId);
    return (
    	<div>
	    	<div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12">
	    	 { this.props.skillData ?
	            this.props.skillData.map((skillsDetails,index)=>{
	              return(
	                <div className="nopadLeft col-lg-4 col-md-6 col-sm-6 col-xs-6" key={index}>
	                 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 outerSkills">
	                   <span className="col-lg-9 col-md-10 col-sm-10 col-xs-10 skillName">
	                   {skillsDetails.skillName}</span>
	                   <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 skillDelete"><i className="fa fa-times" id={index} onClick={this.deleteSkills.bind(this)}></i></span>
	                 </div>
	               </div>
	              );
	            })
	           :
	           <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12">No Skills Added!</span>
	         }
	      </div>
	       
      </div>
    );  
  }
}