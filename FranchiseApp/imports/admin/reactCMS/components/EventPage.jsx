import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {Events} from '../api/Events';
import {TempEventImages} from '../api/Events';

class EventPage extends TrackerReact (Component){
  constructor(props) {
	  super(props);
    var metaContext = {id: Meteor.userId(), dir: "images" , name: "eventImage"};
    var uploader = new Slingshot.Upload("myFileUploads" ,metaContext);
	  this.state = {
	    eventName       : this.props.events,
      eventVenue      : this.props.events,
      eventTime       : this.props.events,
      eventVideo      : this.props.eventVideo,
	    eventBody       : this.props.events,
      id              : this.props.events._id,
      events          : [],
      upload          : uploader,
      isUploading     : false,
      progressValue   : "0%",
      tempEventImages : [],
      edit            : false,
	  };
  this.handleChange = this.handleChange.bind(this);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.events){
         this.setState({
             eventName     : nextProps.events.eventName,
             eventVenue    : nextProps.events.eventVenue,
             eventTime     : nextProps.events.eventTime,
             eventVideo    : nextProps.events.eventVideo,
             eventBody     : nextProps.events.eventBody,
             id              : nextProps.events._id,
         });
      }
    }

    this.handleChange = this.handleChange.bind(this);
  }
  calculateProgress(){
    this.uploadComputation = Tracker.autorun(() => {
         const uploadProgress = Math.round(this.state.upload.progress() * 100);
         if (!isNaN(uploadProgress)) this.setState({progressValue: uploadProgress +"%" });
    });
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
    this.eventTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("events");
      const events = Events.find().fetch();
      this.setState({events});
    });
    this.tempEventImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempEventImages');
      const tempEventImages = TempEventImages.find().fetch();
      this.setState({tempEventImages});
    });
    // $(".image-box").css({'background-image':'url('+  $(".image-box").attr('data-image')+')','background-size': 'cover'});
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    const tempEventImages = TempEventImages.find().fetch();
    for(i=0;i<tempEventImages.length;i++){
      if(!tempEventImages[i].submitted)
        Meteor.call('removeS3Data',tempEventImages[i].amazonUrl);
    }
    Meteor.call('removeEventUnsubmitImages',Meteor.userId());
    console.log('unmounted');
    if(this.eventTracker)
      this.eventTracker.stop();
    if(this.tempEventImageTracker)
      this.tempEventImageTracker.stop();
  }
  handleClose(e){
    e.preventDefault();
    console.log('deleting ' + e.target.getAttribute('id'));
    if(FlowRouter.getParam("id")&&this.state.edit){
      Meteor.call('removeS3Data',e.target.getAttribute('id'));
      Meteor.call('updateEditEvent',e.target.getAttribute('id'));
    }
    Meteor.call('removeEventUrlImages',e.target.getAttribute('id'));
    Meteor.call('removeS3Data',e.target.getAttribute('id'));
  }
  renderImageData(){
    if(FlowRouter.getParam("id") && this.state.edit){
      const events = Events.find({'_id': FlowRouter.getParam("id")}).fetch();
      var imageArray =[];
      for(i=0;i<events.length;i++){
        for(j=0;j<events[i].s3.length; j++){
          if(events[i].s3[j].amazonUrl != ''){
            imageArray.push(
            <div key={j} data-image={events[i].s3[j].amazonUrl} className="image-box">
              <img src={events[i].s3[j].amazonUrl} alt=""/><button id={events[i].s3[j].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>);
          }
        }
      }
      const tempEventImages = TempEventImages.find().fetch();
      for(k=0;k<tempEventImages.length;k++){
        if(tempEventImages[k].amazonUrl != ''&& !tempEventImages[k].submitted)
          imageArray.push(
            <div data-image={tempEventImages[k].amazonUrl} className="image-box">
              <img src={tempEventImages[k].amazonUrl} alt=""/><button id={tempEventImages[k].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>
          );
      }
      return imageArray;
  }else{
      const tempEventImages = TempEventImages.find().fetch();
      return tempEventImages.map((tempEventImage)=>{
        if(tempEventImage.amazonUrl != ''&& !tempEventImage.submitted)
          return <div data-image={tempEventImage.amazonUrl} className="image-box">
            <img src={tempEventImage.amazonUrl} alt=""/><button id={tempEventImage.amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>;
      });
    }
}
  handleUpload(e) {
      let id = Meteor.userId();
      e.preventDefault();
      this.setState({isUploading: true});
      this.calculateProgress();
      var comp = this;
      // console.log(comp);
      this.state.upload.send(document.getElementById('s3file').files[0], function (error, downloadUrl) {
        if (error) {
          // Log event detailed response.
          console.error('Error uploading' + downloadUrl + error.reason);
          console.error (error);
        }
        else {
          comp.setState({progressValue:"0%"});
          comp.setState({isUploading:false});
          comp.uploadComputation.stop();
          console.log("Success file uploaded! " + downloadUrl);
          // Meteor.users.update(Meteor.userId(), {$set: {"profile.image": downloadUrl}});
          Meteor.call('uploadTempEventImages',id,downloadUrl,new Date(), function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
        }
      });
    }
  handleUpdate(e){
    e.preventDefault();
    this.setState({edit:true});
    const tempEventImages  = TempEventImages.find().fetch();
    let pageName      = this.refs.eventName.value;
    let pageVenue     = this.refs.eventVenue.value;
    let pageTime      = this.refs.eventTime.value;
    let pageVideo     = this.refs.eventVideo.value;
    let pageBody      = $('#messageContent').summernote('code');
    let userId        = Meteor.userId();
    let lastModified  = new Date();
    let id            = e.target.getAttribute('id');
    let amazons3      = [];
    for(i=0;i<tempEventImages.length;i++){
      if(!tempEventImages[i].submitted){
        amazons3.push({
          'amazonUrl': tempEventImages[i].amazonUrl,
          'uploadTime': tempEventImages[i].uploadTime,
        });
      }
      Meteor.call('updateTempEventImages',tempEventImages[i]._id,true);
    }
    Meteor.call('updateEvent',id,pageName,pageVenue,pageTime,pageVideo,pageBody,userId,lastModified,function(error,result){
        if(error){
            console.log(error.reason);
        }else if(result){
            Bert.alert("Successfully Updated..!!");
        }
    });
    for(j=0;j<tempEventImages.length;j++){
      if(!tempEventImages[j].submitted){
        Meteor.call('updateEventAmazonUrl',tempEventImages[j].amazonUrl,tempEventImages[j].uploadTime,id,function(error,result){
            if(error){
                console.log(error.reason);
            }else if(result){
                Bert.alert("Successfully Updated..!!");
            }
        });
      }
    }

    Meteor.call('removeTempEventImages',Meteor.userId());
    swal("Done",
    "Your page has been Updated!.",
    "success");
    $(".newTemplateForm").css({display:'none'});
  }
  handleSubmit(e){
      e.preventDefault();
      const tempEventImages = TempEventImages.find().fetch();
      let pageName          = this.refs.eventName.value;
      let pageVenue         = this.refs.eventVenue.value;
      let pageTime          = this.refs.eventTime.value;
      let pageVideo         = this.refs.eventVideo.value;
      let pageBody          = $('#messageContent').summernote('code');
      let userId            = Meteor.userId();
      let lastModified      = "";
      let pageNameExist     = Events.findOne({'eventName': pageName});
      let amazons3          = [];
      for(i=0;i<tempEventImages.length;i++){
        if(!tempEventImages[i].submitted)
          amazons3.push({
            'amazonUrl': tempEventImages[i].amazonUrl,
            'uploadTime': tempEventImages[i].uploadTime,
          });
        Meteor.call('updateTempEventImages',tempEventImages[i]._id,true);
      }
      if(pageNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else{
          Meteor.call('createEvent',pageName,pageVenue,pageTime,pageVideo,pageBody,amazons3,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
      }
      Meteor.call('removeTempEventImages',Meteor.userId());
      swal("Done",
      "Your page has been Created!.",
      "success");
        $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    this.setState({'edit': true});
    const events = Events.find({_id: FlowRouter.getParam("id")}).fetch();
    events.map((event)=>{
      $("#eventName").val(event.eventName);
      $("#eventVenue").val(event.eventVenue);
      $("#eventTime").val(event.eventTime);
      $("#eventVideo").val(event.eventVideo);
      $('.note-editable').html(event.eventBody);
      $('.updatebtn').attr("id",event._id);
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
      title: "Are you sure?",
      text: "You want to delete this page!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false,
      html: false
    }, function(){
      Meteor.call("deleteEvent",id,function(error,result){
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
    return this.state.events.map((event) =>{
      return <tr>
              <td> {event.eventName} </td>
              <td>
                <a href={'/manageevent/' +event._id} onClick={this.edit.bind(this)}>
                  <i className = "fa fa-pencil" > </i>
                  Edit
                </a>
              </td>
              <td>
                <a href="#" id={event._id} onClick={this.delete.bind(this)}>
                  <i className="fa fa-trash-o"></i>
                  Delete
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
              <li className="active">Event Page</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Manage Events
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
                					<h1 className="reportTitleName">Manage Events</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Event Name<span className="astrick">*</span>:</label>
                								        <input type="text" ref="eventName" id="eventName" name="eventName" value={this.state.eventName}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Event Venue<span className="astrick">*</span>:</label>
                								        <input type="text" ref="eventVenue" id="eventVenue" name="eventVenue" value={this.state.eventVenue} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Event Time<span className="astrick">*</span>:</label>
                								        <input type="text" ref="eventTime" id="eventTime" name="eventTime" value={this.state.eventTime} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Event Video<span className="astrick">*</span>:</label>
                								        <input type="text" ref="eventVideo" id="eventVideo" name="eventVideo" value={this.state.eventVideo} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Description<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="eventBody"
                                                        ref = "eventBody"
                                                            ></div>
                									 </div>
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Image Upload<span className="astrick">*</span>:</label>
                								        <input type="file" ref="blogImageFile" id="s3file" name="blogImageFile"  onChange={this.handleUpload.bind(this)}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                          {this.state.isUploading?
                                            <div><div className="progress progress-sm">
                                              <div className="progress-bar progress-bar-yellow" role="progressbar" data-width={this.state.progressValue} aria-valuemin="0" aria-valuemax="100" style={{width:this.state.progressValue} } >
                                                  <span className="sr-only">{this.state.progressValue}% Complete
                                                  </span>
                                                </div>
                                              </div>
                                            </div>: <div></div>}
                									</div>
                								</div>
                              </div>
                              <div className="row inputrow subjectRow">
                                <div className="imageContainer">
                                  {this.renderImageData()}
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
                                          <th>Event Title</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Event Title</th>
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

    const postHandle = Meteor.subscribe('events');
	  // var editEvents   = FlowRouter.getParam("id");
    // console.log("Param" +editEvents);
    const events = Events.find().fetch()|| {};
    console.log(events);
    const loading = !postHandle.ready();

    return {
        loading,
        events,
    };
}, EventPage);

export default EditPageContainer;
