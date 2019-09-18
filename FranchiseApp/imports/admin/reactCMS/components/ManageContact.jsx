import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { ManageContacts } from '../api/ManageContacts';


class ManageContact extends TrackerReact (Component){
  constructor(props) {
	  super(props);
	  this.state = {
      manageContactName       : this.props.manageContacts.manageContactName,
	    manageContactAddress    : this.props.manageContacts.manageContactAddress,
	    manageContactEmail      : this.props.manageContacts.manageContactEmail,
	    manageContactPhone      : this.props.manageContacts.manageContactPhone,
      manageContactSubject    : this.props.manageContacts.manageContactSubject,
      manageContactMessage    : this.props.manageContacts.manageContactMessage,
      id                      : this.props.manageContacts._id,
      manageContacts          : [],
	  };
    this.handleChange = this.handleChange.bind(this);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.manageContacts){
         this.setState({
             manageContactName       : nextProps.manageContacts.manageContactName,
             manageContactAddress    : nextProps.manageContacts.manageContactAddress,
             manageContactEmail      : this.props.manageContacts.manageContactEmail,
       	     manageContactPhone      : this.props.manageContacts.manageContactPhone,
             manageContactSubject    : this.props.manageContacts.manageContactSubject,
             manageContactMessage    : this.props.manageContacts.manageContactMessage,
             id                      : nextProps.manageContacts._id,
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
    if(!$("link[href='/css/dashboard.css']").length > 0){
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
    this.manageContactTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("manageContacts");
      const manageContacts = ManageContacts.find().fetch();
      this.setState({manageContacts: manageContacts});
    });
    // console.log(manageContact);
  }
  componentWillUnmount() {
    console.log('unmounted!');
    $("body").find("script[src='/js/adminLte.js']").remove();
    if(this.manageContactTracker)
      this.manageContactTracker.stop();
  }
  handleUpdate(e){
    e.preventDefault();
    console.log("i am in update");
    let contactName         = this.refs.manageContactName.value;
    let contactAddress      = this.refs.manageContactAddress.value;
    let contactPhone        = this.refs.manageContactPhone.value;
    let contactEmail        = this.refs.manageContactEmail.value;
    let contactSubject      = this.refs.manageContactSubject.value;
    let contactMessage      = $('#messageContent').summernote('code');
    let userId              = Meteor.userId();
    let lastModified        = new Date();
    let id                  = e.target.getAttribute('id');
    Meteor.call('updateManageContact',id,contactName,contactAddress,contactPhone,contactEmail,contactSubject,contactMessage,userId,lastModified,function(error,result){
        if(error){
            console.log(error.reason);
        }else if(result){
            Bert.alert("Successfully Inserted..!!");
        }
    });
    swal("Done",
    "Your contact has been Updated!.",
    "success");
    $(".newTemplateForm").css({display:'none'});
  }
  handleSubmit(e){
      e.preventDefault();
      let contactName         = this.refs.manageContactName.value;
      let contactAddress      = this.refs.manageContactAddress.value;
      let contactPhone        = this.refs.manageContactPhone.value;
      let contactEmail        = this.refs.manageContactEmail.value;
      let contactSubject      = this.refs.manageContactSubject.value;
      let contactMessage      = $('#messageContent').summernote('code');
      let userId              = Meteor.userId();
      let lastModified        = "";
      let contactNameExist    = ManageContacts.findOne({'manageContactName': contactName});
      if(contactNameExist){
          swal("Oops...!","This contact name is already taken!","error");
      }else{
          Meteor.call('createManageContact',contactName,contactAddress,contactPhone,contactEmail,contactSubject,contactMessage,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
      }
      swal("Done",
      "Your contact has been Created!.",
      "success");
      $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    const manageContacts = ManageContacts.find({_id: FlowRouter.getParam("id")}).fetch();
    manageContacts.map((manageContact)=>{
      $("#manageContactName").val(manageContact.manageContactName);
      $("#manageContactAddress").val(manageContact.manageContactAddress);
      $("#manageContactPhone").val(manageContact.manageContactPhone);
      $("#manageContactEmail").val(manageContact.manageContactEmail);
      $("#manageContactSubject").val(manageContact.manageContactSubject);
      $('.note-editable').html(manageContact.manageContactMessage);
      $('.updatebtn').attr("id",manageContact._id);
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
      text              : "You want to delete this contact!",
      type              : "warning",
      showCancelButton  : true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText : "Yes, delete it!",
      closeOnConfirm    : false,
      html              : false
    }, function(){
      Meteor.call("deleteManageContact",id,function(error,result){
          if(error){
              console.log(error.reason);
          }else if(result){
              Bert.alert("Successfully Deleted..!!");
          }
      });
      swal("Done",
      "Your contact has been deleted!.",
      "success");
    });
      $(".newTemplateForm").css({display:'none'});
  }
  renderTableRow(){
    return this.state.manageContacts.map((manageContact) =>{
      return <tr>
                <td>{manageContact.manageContactName}</td>
                <td>
                  <a href={'/managecontact/' +manageContact._id} onClick={this.edit.bind(this)}>
                    <i className="fa fa-pencil"></i>Edit
                  </a>
                </td>
                <td>
                  <a href="#" id={manageContact._id} onClick={this.delete.bind(this)}>
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
              <li className="active">Manage Contact</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Manage Contact
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
                					<h1 className="reportTitleName">Manage Contact</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Head Quarter<span className="astrick">*</span>:</label>
                                        <input type="text" ref="manageContactName" id="manageContactName" name="manageContactName" value={this.state.manageContactName}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Address<span className="astrick">*</span>:</label>
                								        <input type="text" ref="manageContactAddress" id="manageContactAddress" name="manageContactAddress" value={this.state.manageContactAddress}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Contact Phone<span className="astrick">*</span>:</label>
                								        <input type="text" ref="manageContactPhone" id="manageContactPhone" name="manageContactPhone" value={this.state.manageContactPhone} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Contact Email<span className="astrick">*</span>:</label>
                								        <input type="text" ref="manageContactEmail" id="manageContactEmail" name="manageContactEmail" value={this.state.manageContactEmail} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Contact Subject<span className="astrick">*</span>:</label>
                								        <input type="text" ref="manageContactSubject" id="manageContactSubject" name="manageContactSubject" value={this.state.manageContactSubject} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="manageContactMessage"
                                                        ref = "manageContactMessage"
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

    const postHandle = Meteor.subscribe('manageContacts');
	  // var editManageContacts   = FlowRouter.getParam("id");
    // console.log("Param" +editManageContacts);
    const manageContacts = ManageContacts.find().fetch()|| {};
    const loading = !postHandle.ready();

    return {
        loading,
        manageContacts,
    };
}, ManageContact);

export default EditPageContainer;
