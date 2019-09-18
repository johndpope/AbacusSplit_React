import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import WorkForm from './WorkForm.jsx';

export default class ListEmploymentInfo extends TrackerReact(Component){
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
  editExperience(event){
    event.preventDefault();
    var idVal= $(event.target).attr('data-target'); 
    $('#'+idVal).modal('show');
  }
  deleteExperience(event){
    event.preventDefault();
    var index = $(event.target).attr('data-index');
    Meteor.call("removeEmploymentData",index,(error, result)=>{
      if (error) {
       console.log(error.reason);
      }else{  
        $('#deleteExperienceInfo-'+index).modal('hide');
      }
    });
  }

  render(){
    return(
      <div>
        {this.props.employeeData ?
          <div>
            <hr className="listAcademicsHR col-lg-11 col-md-12 col-sm-12 col-xs-12"/>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <i className="fa fa-briefcase col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
                <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 viewTitle">Experience Information</span>
              </div>
              <div className="Experience-info col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" >   
                {this.props.employeeData.map((employmentDetails, index)=>{
                  return (
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding" key={index + '-' + 'employment'}>             
                      <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2 noProfilePadding">
                        <div className="edu-box">
                        <img src="/images/assureid/company.png" className="college-img"/>
                        </div>
                      </div>
                      <div className="edu-university col-lg-8 col-md-8 col-sm-8 col-xs-8">
                        <span className="university-name">{employmentDetails.designation}</span><br />
                        <span className="company-name">{employmentDetails.nameOfEmployer}</span><br />
                        <span className="year">{employmentDetails.employmentFrom ? moment(employmentDetails.employmentFrom).format('MMMM YYYY') + ' - ' : ""}{employmentDetails.employmentTo ? employmentDetails.employmentTo == 'Present' ? employmentDetails.employmentTo : moment(employmentDetails.employmentTo).format('MMMM YYYY') : ""}</span>                
                      </div>
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                        <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <i onClick={this.editExperience.bind(this)} className="fa fa-pencil edit-pencil pull-right" data-toggle="modal" data-target={"editExperienceInfo-"+index}></i>
                        </div>
                      </div>
                      <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 NOpadding">
                        <div className="add-btn col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <i className="fa fa-trash edit-pencil pull-right" data-toggle="modal" onClick={this.editExperience.bind(this)} data-target={"deleteExperienceInfo-"+index}></i>
                        </div>
                      </div>
                      <div className="modal fade" id={"deleteExperienceInfo-"+index} role="dialog">
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12 deleteModal">
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nopadRight">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                              </div>
                              <p className="">Do you want to delete this data?</p>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 yesDelete" onClick={this.deleteExperience.bind(this)} data-index={index}>Yes</button>
                                &nbsp;&nbsp;
                                <button type="button" className="pull-right btn btn-default col-lg-3 col-md-3 col-sm-3 col-xs-3 noDelete" data-dismiss="modal">No</button>
                              </div>
                            </div>
                            <div className="modal-footer">
                            </div>
                          </div>  
                        </div>
                      </div>
                      <div className="modal fade" id={"editExperienceInfo-"+index} role="dialog">
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
