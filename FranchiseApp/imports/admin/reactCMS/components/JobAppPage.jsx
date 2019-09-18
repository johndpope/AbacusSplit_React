import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { CareerPages } from '../api/CareerPages';

class CareerPage extends TrackerReact (Component){
  constructor(props) {
	  super(props);
	  this.state = {
	    careerPageTitle          : this.props.careerPages.careerPageTitle,
	    careerPagePosition       : this.props.careerPages.careerPagePosition,
      careerPageSalary         : this.props.careerPages.careerPageSalary,
      careerPageLocation       : this.props.careerPages.careerPageLocation,
      careerPageValidUpTo      : this.props.careerPages.careerPageValidUpTo,
      careerPageSkills         : this.props.careerPages.careerPageSkills,
	    careerPageDescription    : this.props.careerPages.careerPageDescription,
      careerPageQualification  : this.props.careerPages.careerPageQualification,
      id                       : this.props.careerPages._id,
      careerPages              : [],
	  };
    this.handleChange = this.handleChange.bind(this);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.careerPages){
         this.setState({
           careerPageTitle          : nextProps.careerPages.careerPageTitle,
           careerPagePosition       : nextProps.careerPages.careerPagePosition,
           careerPageSalary         : nextProps.careerPages.careerPageSalary,
           careerPageLocation       : nextProps.careerPages.careerPageLocation,
           careerPageValidUpTo      : nextProps.careerPages.careerPageValidUpTo,
           careerPageSkills         : nextProps.careerPages.careerPageSkills,
           careerPageDescription    : nextProps.careerPages.careerPageDescription,
           careerPageQualification  : nextProps.careerPages.careerPageQualification,
           id                       : nextProps.careerPages._id,
         });
      }
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
   const target = event.target;
   const name   = target.name;
   this.setState({
    [name]: event.target.value,
   });
  }

  componentDidMount() {
    if(!!!$("link[href='/css/dashboard.css']").length > 0){
      var dashboardCss = document.createElement("link");
      dashboardCss.type="text/css";
      dashboardCss.rel ="stylesheet";
      dashboardCss.href="/css/dashboard.css";
      document.head.append(dashboardCss);
    }
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
      console.log("I am appended!");
      var adminLte = document.createElement("script");
      adminLte.type = "text/javascript";
      adminLte.src = "/js/adminLte.js";
      adminLte.setAttribute('id','adminLte');
      $("body").append(adminLte);
    }

    $('#messageContent').summernote({
        height: 190,
        maxHeight:190,
        minHeight:175,
      });
    $('#messageContent1').summernote({
        height: 190,
        maxHeight:190,
        minHeight:175,
      });
    this.careerPageTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("careerPages");
      const careerPages = CareerPages.find().fetch();
      this.setState({careerPages});
    });
    // console.log(careerPage);
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    if(this.careerPageTracker)
      this.careerPageTracker.stop();
  }
  handleUpdate(e){
    e.preventDefault();
    console.log("i am in update");
    let jobTitle         = this.refs.careerPageTitle.value;
    let jobPosition      = this.refs.careerPagePosition.value;
    let jobLocation      = this.refs.careerPageLocation.value;
    let jobSalary        = this.refs.careerPageSalary.value;
    let jobValidUpTo     = this.refs.careerPageValidUpTo.value;
    let jobSkills        = this.refs.careerPageSkills.value;
    let jobDescription   = $('#messageContent1').summernote('code');
    let jobQualification = $('#messageContent').summernote('code');
    let userId           = Meteor.userId();
    let lastModified     = new Date();
    let id               = e.target.getAttribute('id');
    Meteor.call('updateCareerPage',id,jobTitle,jobPosition,jobLocation,jobSkills,jobValidUpTo,jobSalary,jobQualification,jobDescription,userId,lastModified,function(error,result){
        if(error){
            console.log(error.reason);
        }else if(result){
            Bert.alert("Successfully Inserted..!!");
        }
    });
    swal("Done",
    "Your page has been Updated!.",
    "success");
    $(".newTemplateForm").css({display:'none'});
  }
  handleSubmit(e){
      e.preventDefault();
      let jobTitle         = this.refs.careerPageTitle.value;
      let jobPosition      = this.refs.careerPagePosition.value;
      let jobLocation      = this.refs.careerPageLocation.value;
      let jobSalary        = this.refs.careerPageSalary.value;
      let jobValidUpTo     = this.refs.careerPageValidUpTo.value;
      let jobSkills        = this.refs.careerPageSkills.value;
      let jobDescription   = $('#messageContent1').summernote('code');
      let jobQualification = $('#messageContent').summernote('code');
      let userId        = Meteor.userId();
      let lastModified  = "";
      let jobTitleExist = CareerPages.findOne({'careerPageTitle': jobTitle});
      if(jobTitleExist){
          swal("Oops...!","This job title is already taken!","error");
      }else{
          Meteor.call('createCareerPage',jobTitle,jobPosition,jobLocation,jobSkills,jobValidUpTo,jobSalary,jobQualification,jobDescription,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
      }
      swal("Done",
      "Your page has been Created!.",
      "success");
        $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    const careerPages = CareerPages.find({_id: FlowRouter.getParam("id")}).fetch();
    careerPages.map((careerPage)=>{
      $("#careerPageTitle").val(careerPage.careerPageTitle);
      $("#careerPagePosition").val(careerPage.careerPagePosition);
      $("#careerPageLocation").val(careerPage.careerPageLocation);
      $("#careerPageSalary").val(careerPage.careerPageSalary);
      $("#careerPageSkills").val(careerPage.careerPageSkills);
      $("#careerPageValidUpTo").val(careerPage.careerPageValidUpTo);
      $("#messageContent1").siblings(".note-editable").html(careerPage.careerPageDescription);
      $("#messageContent").siblings(".note-editable").html(careerPage.careerPageQualification);
      $('.updatebtn').attr("id",careerPage._id);
    });
    $(".updatebtn").css({display:'block'});
    $(".sendtxtmsgbtn").css({display:'none'});
    $(".newTemplateForm").css({display:'block'});
  }
  delete(e){
    e.preventDefault();
    // console.log(e.target.getAttribute('id'));
    let id = e.target.getAttribute('id');
    swal({
      title             : "Are you sure?",
      text              : "You want to delete this page!",
      type              : "warning",
      showCancelButton  : true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText : "Yes, delete it!",
      closeOnConfirm    : false,
      html              : false
    }, function(){
      Meteor.call("deleteCareerPage",id,function(error,result){
          if(error){
              console.log(error.reason);
          }else if(result){
              Bert.alert("Successfully Deleted..!!");
          }
      });
      swal("Done",
      "Your page has been deleted!.",
      "success");
    });
      $(".newTemplateForm").css({display:'none'});
  }
  renderTableRow(){
    return this.state.careerPages.map((careerPage) =>{
      return <tr>
                <td>{careerPage.careerPageTitle}</td>
                <td>
                  <a href={'/manageCareerPage/' +careerPage._id} onClick={this.edit.bind(this)}>
                    <i className="fa fa-pencil"></i>Edit
                  </a>
                </td>
                <td>
                  <a href="#" id={careerPage._id} onClick={this.delete.bind(this)}>
                    <i className="fa fa-trash-o"></i> Delete
                  </a>
                </td>
            </tr>;
      });
  }
  render(){
    return(
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>Dashboard
              <small>Version 3.0</small>
            </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-dashboard" /> Home</a></li>
              <li className="active">Career Page</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Manage Career Page
                    </h3>
                    <div className="box-tools pull-right">
                      <button type="button" className="btn btn-box-tool btn-minus" data-widget="collapse">
                        <i className="fa fa-minus" />
                      </button>
                      <div className="btn-group">
                        <button type="button" className="btn btn-box-tool dropdown-toggle" data-toggle="dropdown">
                          <i className="fa fa-wrench" /></button>
                        <ul className="dropdown-menu" role="menu">
                          <li>
                            <a href="#">Action</a>
                          </li>
                          <li>
                            <a href="#">Another action </a>
                          </li>
                          <li>
                            <a href="#">Something else here</a>
                          </li>
                          <li className="divider" />
                          <li>
                            <a href="#">
                            Separated link
                            </a>
                          </li>
                        </ul>
                      </div>
                      <button type="button" className="btn btn-box-tool" data-widget="remove">
                        <i className="fa fa-times" />
                      </button>
                    </div>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="notifWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                					<h1 className="reportTitleName">Manage Career Page</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Job Title<span className="astrick">*</span>:</label>
                								        <input type="text" ref="careerPageTitle" id="careerPageTitle" name="careerPageTitle" value={this.state.careerPageTitle}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Job Position<span className="astrick">*</span>:</label>
                								        <input type="text" ref="careerPagePosition" id="careerPagePosition" name="careerPagePosition" value={this.state.careerPagePosition} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Job Skills<span className="astrick">*</span>:</label>
                								        <input type="text" ref="careerPageSkills" id="careerPageSkills" name="careerPageSkills" value={this.state.careerPageSkills} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Job Location<span className="astrick">*</span>:</label>
                								        <input type="text" ref="careerPageLocation" id="careerPageLocation" name="careerPageLocation" value={this.state.careerPageLocation} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Salary<span className="astrick">*</span>:</label>
                								        <input type="text" ref="careerPageSalary" id="careerPageSalary" name="careerPageSalary" value={this.state.careerPageSalary} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Valid Upto<span className="astrick">*</span>:</label>
                								        <input type="text" ref="careerPageValidUpTo" id="careerPageValidUpTo" name="careerPageValidUpTo" value={this.state.careerPageValidUpTo} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Qualification<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="careerPageQualification"
                                                        ref = "careerPageQualification"
                                                            ></div>
                									 </div>
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Job Description<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent1" name="careerPageDescription"
                                                        ref = "careerPageDescription"
                                                            ></div>
                									 </div>
                									</div>
                								</div>
                							</div>
                							<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
                								<button onClick={this.handleSubmit.bind(this)} type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">Submit Page</button>
                								<button  onClick={this.handleUpdate.bind(this)} type="submit" className="btn btn-primary pull-right updatebtn col-lg-2 col-md-3 col-sm-6 col-xs-12">Update Page</button>
                							</div>
                						</form>
                					</div>
                          <div className="dataTable tableBasicPage">
                              <table className="heavyTable"  class="display" width="100%" cellspacing="0">
                                  <thead>
                                      <tr>
                                          <th>Basic Page Name</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Basic Page Name</th>
                                        <th></th>
                                        <th></th>
                                      </tr>
                                  </tfoot>
                                  <tbody>
                                          {this.renderTableRow()}
                                  </tbody>
                              </table>
                          </div>
                				</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* /.content */}
        </div>
        {/* /.content-wrapper */}
      </div>

    );
  }
}
EditPageContainer = createContainer( props => {

    const postHandle = Meteor.subscribe('careerPages');
	  // var editCareerPages   = FlowRouter.getParam("id");
    // console.log("Param" +editCareerPages);
    const careerPages = CareerPages.find().fetch()|| {};
    console.log(careerPages);
    const loading = !postHandle.ready();

    return {
        loading,
        careerPages,
    };
}, CareerPage);

export default EditPageContainer;
