import React, {Component} from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
// import SkillsRequired from '../views/SkillsRequired.jsx';
import { UserProfile } from "./api/userProfile.js";

export default class SkillsForm extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={
      "skill"   : '', 
      "subscription" : { 
      } 
    };
   this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event){
   event.preventDefault();
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
  inputEffect(event){
    event.preventDefault();
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      if($('.effect-21').hasClass('error')){
        $(event.target).find('.effect-21.error').addClass('has-content');  
      }else{
        $(event.target).removeClass("has-content");
      }
    }
  }

  skillForm(event){
    event.preventDefault();
    var id    = Meteor.userId();
    var skillName = this.refs.skill.value;
    var skills = {
      skillName,
    }
    // console.log("skills",skills);
    Meteor.call('addSkills',id,skills,function (error,result) {
      if (error) {
        console.log(error.reason);
      }else{
        console.log("Added Successfully!");
        $('#skill').val('');
      }
    }); 
  }
  
  render(){
    // console.log("userId",this.props.userId);
   
       return(
         <form id="skillForm" className="basicForm" onSubmit={this.skillForm.bind(this)}> 
           <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="input-effect input-group">
                <span className="input-group-addon addons"><i className="fa fa-certificate" aria-hidden="true"></i></span>
                <input type="text" className="effect-21 form-control loginInputs" id="skill" name="skill" ref="skill"  onChange={this.handleChange} onBlur={this.inputEffect.bind(this)}/>
                <label>Skills</label>
                <span className="focus-border">
                  <i></i>
                </span> 
              </div>
            </div>
         </form>
      );

  }
}
// skillsContainer = withTracker(props => {
//     const postHandle = Meteor.subscribe('userprofile',props.userId);
//     var userData = UserProfile.findOne({"userId": props.userId}) || {};
//     console.log("userData:",userData);
//     const loading   = !postHandle.ready();
//     return {
//       loading,
//       userData,
//     };
// })(Skills);
// export default skillsContainer;