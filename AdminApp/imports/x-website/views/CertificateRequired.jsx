import React, { Component }  from 'react';
import {render} from 'react-dom';
import { Meteor } from 'meteor/meteor';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import Certificate from '../forms/Certificate.jsx';
import { UserProfile } from '../forms/api/userProfile.js';
import {browserHistory} from 'react-router';

export default class CertificateRequired extends TrackerReact(Component){
	constructor(props){
    super(props); 
    this.state ={
      "subscription" : {
        // "userData" : Meteor.subscribe('userprofile',Meteor.userId()),    
        // "userProfileData" : Meteor.subscribe("userProfileData"),
      } 
    }
  }
  editCertificate(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
    // Session.set('editExp','editexperienceinfo');
  }
  render() {
  	// console.log("certificateData",this.props.certificateData);
    return ( 
      <div>
       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
          <i className="fa fa-certificate col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
          <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 viewTitle">Certification Information</span>
          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 add-btn">
            <i className="fa fa-plus add-plus pull-right" data-toggle="modal" data-target="#certificateinfo"></i>
          </div>
        </div>
        <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" >
          {this.props.certificateData ?
            this.props.certificateData.map((certificateDetails, index)=>{
              return (   
		           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"  key={index}>             
			           { browserHistory.getCurrentLocation().pathname == "/profileForms" 
                    ?
                     ""
                    : 
                    <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                      <input type="checkbox" name="certificateCheck" id={certificateDetails.chkid} value={"Certificate Details : "+certificateDetails.certificateId}/>
                    </div> 
                 }
                  <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
			              <div className="edu-box">
			              <img src="/images/assureid/certificate.png" className="college-img"/>
			              </div>
			            </div>
			            <div className={ browserHistory.getCurrentLocation().pathname == "/profileForms" ? "edu-university col-lg-9 col-md-9 col-sm-9 col-xs-9" : "edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8" }>
			              <span className="university-name">{certificateDetails.certificateName}</span><br />
			              <span className="company-name">{certificateDetails.issuedBy}</span><br />
			              <span className="year">{certificateDetails.certificatedOn ? moment(certificateDetails.certificatedOn).format('MMMM YYYY') : ""}</span>                
			            </div>
		              <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                    { certificateDetails.editStatus == "Open" ?
    		               <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
    		                 <i onClick={this.editCertificate.bind(this)} className="fa fa-pencil edit-pencil pull-right" data-toggle="modal" data-target={"editCertificateInfo-"+index}></i>
    		               </div>
                       :
                       ""
                     }
		              </div>
		            <div className="modal fade" id={"editCertificateInfo-"+index} role="dialog">
		                <div className="modal-dialog">
		                  <div className="modal-content">
		                    <div className="modal-body">
		                      <button type="button" className="close" data-dismiss="modal">&times;</button>
		                      <div className="row">
		                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                          <h4 className="text-center">Edit Certificate Information</h4>
		                          <br/>
		                         <Certificate key={index + '-certificate'} certificateValues={certificateDetails} indexValue={index}/>
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
            <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12">Please add your Certificate Information</span>
          }
        </div>
        <div className="modal fade" id="certificateinfo" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <h4 className="text-center">Add Certificate Information</h4>
                    <br/>
                    <Certificate />
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