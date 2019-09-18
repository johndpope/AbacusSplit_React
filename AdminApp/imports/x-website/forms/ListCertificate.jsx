import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import Certificate from '../forms/Certificate.jsx';

export default class ListCertificate extends TrackerReact(Component){
  constructor(props){
    super(props);
    this.state ={
      "subscription" : {
      }
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }

  editCertificate(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
  }
  deleteCertificate(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeCertificateData",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#deleteCertificateInfo-'+index).modal('hide');
      }
    });
  }

  render(){
    return(
      <div>
        {this.props.certificateData ?
          <div>
            <hr className="listAcademicsHR col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <i className="fa fa-certificate col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                <span className="col-lg-10 col-md-10 col-sm-10 col-xs-10 viewTitle">Certification Information</span>
              </div>
              <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" >
                {this.props.certificateData ?
                  this.props.certificateData.map((certificateDetails, index)=>{
                    return (   
                     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"  key={index}>             
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                          <div className="edu-box">
                          <img src="/images/assureid/certificate.png" className="college-img"/>
                          </div>
                        </div>
                        <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                          <span className="university-name">{certificateDetails.certificateName}</span><br />
                          <span className="company-name">{certificateDetails.issuedBy}</span><br />
                          <span className="year">{certificateDetails.certificatedOn ? moment(certificateDetails.certificatedOn).format('MMMM YYYY') : ""}</span>                
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                         <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight">
                          <i onClick={this.editCertificate.bind(this)} className="fa fa-pencil edit-pencil pull-right" data-toggle="modal" data-target={"editcertificateinfo-"+index}></i>
                         </div>
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                          <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <i className="fa fa-trash edit-pencil pull-right" data-toggle="modal" onClick={this.editCertificate.bind(this)} data-target={"deleteCertificateInfo-"+index}></i>
                          </div>
                        </div>
                        <div className="modal fade" id={"deleteCertificateInfo-"+index} role="dialog">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <p className="">Do you want to delete this data?</p>
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.deleteCertificate.bind(this)} data-index={index}>Yes</button>
                                  &nbsp;&nbsp;
                                  <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                                </div>
                              </div>
                              <div className="modal-footer">
                              </div>
                            </div>  
                          </div>
                        </div>
                        <div className="modal fade" id={"editcertificateinfo-"+index} role="dialog">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-body">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <div className="row">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <h4 className="text-center">Edit Certificate Information</h4>
                                    <br/>
                                   <Certificate key={index + '-certificate'} certificateValues={certificateDetails} indexValue={index} certificateForm='editCertificateForm'/>
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
                  ""
                }
              </div>
            </div>
          </div>
          :
          ""
        }
      </div>
    );
  }
}