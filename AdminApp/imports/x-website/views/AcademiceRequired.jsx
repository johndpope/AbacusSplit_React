import React, { Component }  from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Router, Route, browserHistory} from 'react-router';
import { withTracker } from 'meteor/react-meteor-data';

import { UserProfile } from '../forms/api/userProfile.js';

import ProfessionalEduForm from '../forms/ProfessionalEduForm.jsx';
import EducationForm from '../forms/EducationForm.jsx';

export default class AcademiceRequired extends TrackerReact(Component) {
	constructor(props){
		super(props); 
		this.state ={ 
		  "subscription" : {
		  } 
		}
	}
	editAcademics(event){
		event.preventDefault();
		var idVal= $(event.target).attr('data-target');
		$('#'+idVal).modal('show');
	}
	editProfessionalAcademics(event){
		event.preventDefault();
		var idVal= $(event.target).attr('data-target');
		$('#'+idVal).modal('show');
	}

    render() {
	    return ( 
	     <div>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
				  	<i className="fa fa-graduation-cap col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
				  	<span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 viewTitle">Academics Information</span>
					<div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
					  <i className="fa fa-plus add-plus pull-right" data-toggle="modal" data-target="#acadamicinfo"></i>
					</div> 
				</div>
	            {this.props.academicsData ?
		            this.props.academicsData.map((academicsDetails, index)=>{
		            	return(
				            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}> 
				               { browserHistory.getCurrentLocation().pathname == "/profileForms" 
	                        ?
	                         ""
	                        : 
					              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
		                      <input type="checkbox" name="academicsCheck" id={academicsDetails.chkid} value={"Academics : "+academicsDetails.educationId}/>
		                    </div>
		                  }   
				              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
				                <div className="edu-box ">
				                  <img src="/images/assureid/college.png" className="college-img"/>
				                </div>
				              </div>
				              <div className={ browserHistory.getCurrentLocation().pathname == "/profileForms" ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : "edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8" }>
				                <span className="university-name">{academicsDetails.university}</span><br />
	                  		<span className="degree">{academicsDetails.educationQualification}{academicsDetails.specialization ? ' - ' + academicsDetails.specialization : ""}</span><br />
	                  		<span className="year">{academicsDetails.dateAttendedFrom ? moment(academicsDetails.dateAttendedFrom).format('MMMM YYYY') : ""}{academicsDetails.dateAttendedTo ? ' - ' + moment(academicsDetails.dateAttendedTo).format('MMMM YYYY') : ""}</span>                
				              </div>
				              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                       { academicsDetails.editStatus == "Open" ?
                           <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
					                  <i className="fa fa-pencil edit-pencil pull-right" data-toggle="modal" onClick={this.editAcademics.bind(this)} 
					                  data-target={"editacadamicinfo-"+index}></i>
					                </div>
					                :
					                ""
                       }
				               
				              </div>
				                <div className="modal fade" id={"editacadamicinfo-"+index} role="dialog">
					              <div className="modal-dialog">
					                <div className="modal-content">
					                  <div className="modal-header">
					                    <button type="button" className="close" data-dismiss="modal">&times;</button>
					                    <h4 className="modal-title">Edit Your Acadamics Information</h4>
					                  </div>
					                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
					                    <EducationForm key={index + '-academics'} academicsValues={academicsDetails} indexVal={index} />
					                  </div>
					                  <div className="modal-footer">
					                  </div>
					                </div>  
					              </div>
					            </div>
				            </div> 
				        );
		            })
		            :
		            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 acadamicinfoOuter">Please add your Acadamics Information</span>
	            }

	            {this.props.professionalData ? 
		            this.props.professionalData.map((professionalsDetails, index)=>{
		            	return(
				           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index}> 
		                { browserHistory.getCurrentLocation().pathname == "/profileForms" 
                      ?
                       ""
                      : 
				              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
	                      <input type="checkbox" name="professionalsCheck" id={professionalsDetails.chkid} value={"Professionals Academics : "+professionalsDetails.professionalEducationId}/>
	                    </div> 
	                  }
				              <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding"> 
				                <div className="edu-box ">
				                  <img src="/images/assureid/college.png" className="college-img"/>
				                </div>
				              </div>
				              <div className={ browserHistory.getCurrentLocation().pathname == "/profileForms" ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : "edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8" }>
				                <span className="university-name">{professionalsDetails.professionalQualification}</span><br />
		                        <span className="degree">{professionalsDetails.qualifyingBodyNm}</span><br />
        	                    <span className="year">{professionalsDetails.dateOfQualification ? moment(professionalsDetails.dateOfQualification).format('MMMM YYYY') : ""}</span>                
				              </div>
				              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
				               { professionalsDetails.editStatus == "Open" ?
					               	<div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
					                  <i className="fa fa-pencil edit-pencil pull-right" onClick={this.editProfessionalAcademics.bind(this)} data-toggle="modal" data-target={"editprofessionalacadamicinfo-"+index}></i>
					                </div>
					                :
					                ""
				               }
				                
				              </div>
				               <div className="modal fade" id={"editprofessionalacadamicinfo-"+index} role="dialog">
						            <div className="modal-dialog">
						                <div className="modal-content"> 
						                  <div className="modal-header">
						                    <button type="button" className="close" data-dismiss="modal">&times;</button>
						                    <h4 className="modal-title">Edit Your Professional Acadamics Information</h4>
						                  </div>
						                  <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
						                    <ProfessionalEduForm key={index + '-professionalAcademics'} professionalAcademicsValues={professionalsDetails} indexVal={index} />
						                  </div>
						                  <div className="modal-footer">
						                  </div> 
						                </div> 
						            </div>
					            </div>
				            </div>
				        );
		            })
		            :
		            <span></span>
	            }
		         
	            <div className="modal fade" id="acadamicinfo" role="dialog">
	              <div className="modal-dialog">
	                <div className="modal-content">
	                    <div className="modal-header">
	                    	<button type="button" className="close" data-dismiss="modal">&times;</button>
	                    	<h4 className="modal-title">Add Your Acadamics Information</h4>
	                    </div>
	                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<EducationForm />	
							<h4 className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Professional Qualification Information [Only in case of IIT, CA, ICWAI, CS, MBBS etc]</h4>
							<ProfessionalEduForm />	
						</div>
	                  <div className="modal-footer">
	                  </div> 
	                </div> 
	              </div> 
	            </div> 
	        </div>
	    );
    }
}