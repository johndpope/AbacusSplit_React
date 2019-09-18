import React, { Component }  from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import WorkForm from '../forms/WorkForm.jsx';
import { UserProfile } from '../forms/api/userProfile.js';
import {browserHistory} from 'react-router';
export default class EmploymentRequired extends TrackerReact(Component) {
  constructor(props){
    super(props); 
    this.state ={
      "subscription" : {
      } 
    }
  }
  componentDidMount() {
  } 
  editExperience(event){
    event.preventDefault(); 
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
  }
 
  render() {
    return ( 
      <div>
        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-briefcase col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 viewTitle">Experience Information</span>
          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
            <i className="fa fa-plus add-plus pull-right" data-toggle="modal" data-target="#experienceinfo"></i>
          </div>
        </div>
        <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" >   
          {this.props.employeeData ?
            this.props.employeeData.map((employmentDetails, index)=>{
              return (
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index + '-' + 'employment'}> 
                  { browserHistory.getCurrentLocation().pathname == "/profileForms" 
                    ?
                     ""
                    : 
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                      <input type="checkbox" name="employementCheck" id={employmentDetails.chkid} value={"Employment : "+employmentDetails.employementId}/>
                    </div> 
                   }
                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                    <div className="edu-box">
                    <img src="/images/assureid/company.png" className="college-img"/>
                    </div>
                  </div>
                  <div className={ browserHistory.getCurrentLocation().pathname == "/profileForms" ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : "edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8" }>
                    <span className="university-name">{employmentDetails.designation}</span><br />
                      <span className="company-name">{employmentDetails.nameOfEmployer}</span><br />
                      <span className="year">{employmentDetails.employmentFrom ? moment(employmentDetails.employmentFrom).format('MMMM YYYY') + ' - ' : ""}{employmentDetails.employmentTo ? employmentDetails.employmentTo == 'Present' ? employmentDetails.employmentTo : moment(employmentDetails.employmentTo).format('MMMM YYYY') : ""}</span>                 
                  </div>
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                    { employmentDetails.editStatus == "Open" ?
                      <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                       <i onClick={this.editExperience.bind(this)} className="fa fa-pencil edit-pencil pull-right" data-toggle="modal" data-target={"editexperienceinfo-"+index}></i>
                      </div>
                      :
                      ""
                    }
                    
                  </div>
                  <div className="modal fade" id={"editexperienceinfo-"+index} role="dialog">
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-body">
                          <button type="button" className="close" data-dismiss="modal">&times;</button>
                          <div className="row">
                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                              <h4 className="text-center">Edit Employment Information</h4>
                              <br/>
                              <WorkForm key={index + '-work'} workValues={employmentDetails} indexValue={index}/>
                            </div>
                          </div>
                        </div>
                      </div> 
                    </div>
                  </div> 
                </div>
              );
            })
            :
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Please add your Experience Information</span>
          }
        </div>
        <div className="modal fade" id="experienceinfo" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="text-center">Add Employment Information</h4>
                    <br/>
                    <WorkForm />
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