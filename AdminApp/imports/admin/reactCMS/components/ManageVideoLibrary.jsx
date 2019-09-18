import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import { VideoLibrary } from '../api/VideoLibrary';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


class ManageVideoLibrary extends TrackerReact (Component){
  constructor(props) {
	  super(props);
	  this.state = {
	    videoLibraryName     : this.props.videoLibrary.videoLibraryName,
	    videoLibraryUrl      : this.props.videoLibrary.videoLibraryUrl,
	    videoLibraryBody     : this.props.videoLibrary.videoLibraryBody,
      videoLibraryCategory : this.props.videoLibrary.videoLibraryCategory,
      youtubeVideoLink     : this.props.videoLibrary.youtubeVideoLink,
      id                   : this.props.videoLibrary._id,
      videoLibrary         : [],
	  };
    this.handleChange = this.handleChange.bind(this);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.videoLibrary){
         this.setState({
             videoLibraryName     : nextProps.videoLibrary.videoLibraryName,
             videoLibraryUrl      : nextProps.videoLibrary.videoLibraryUrl,
             videoLibraryBody     : nextProps.videoLibrary.videoLibraryBody,
             videoLibraryCategory : nextProps.videoLibrary.videoLibraryCategory,
             youtubeVideoLink     : nextProps.videoLibrary.youtubeVideoLink,
             id                   : nextProps.videoLibrary._id,
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
    this.videoLibraryTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("videoLibrary");
      const videoLibrary = VideoLibrary.find().fetch();
      this.setState({videoLibrary: videoLibrary});
    });
    // console.log(videoLibrary);
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    if(this.videoLibraryTracker)
      this.videoLibraryTracker.stop();
  }
  handleUpdate(e){
    e.preventDefault();
    console.log("i am in update");
    let libraryName      = this.refs.videoLibraryName.value;
    let libraryUrl       = this.refs.videoLibraryUrl.value;
    let libraryCategory  = this.refs.videoLibraryCategory.value;
    let youtubeVideoLink = this.refs.youtubeVideoLink.value;
    let libraryBody      = $('#messageContent').summernote('code');
    let userId           = Meteor.userId();
    let lastModified     = new Date();
    let id               = e.target.getAttribute('id');
    Meteor.call('updateVideoLibrary',id,libraryName,libraryUrl,libraryCategory,youtubeVideoLink,libraryBody,userId,lastModified,function(error,result){
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
      let libraryName      = this.refs.videoLibraryName.value;
      let libraryUrl       = this.refs.videoLibraryUrl.value;
      let libraryCategory  = this.refs.videoLibraryCategory.value;
      let youtubeVideoLink = this.refs.youtubeVideoLink.value;
      let libraryBody      = $('#messageContent').summernote('code');
      let userId           = Meteor.userId();
      let lastModified     = "";
      let libraryNameExist = VideoLibrary.findOne({'videoLibraryName': libraryName});
      let libraryUrlExist  = VideoLibrary.findOne({'videoLibraryUrl': libraryUrl});

      if(libraryNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else if(libraryUrlExist){
          swal("Oops...!","This page url is already taken!","error");
      }else{
          Meteor.call('createVideoLibrary',libraryName,libraryUrl,libraryCategory,youtubeVideoLink,libraryBody,userId,lastModified,function(error,result){
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
    const videoLibrary = VideoLibrary.find({_id: FlowRouter.getParam("id")}).fetch();
    videoLibrary.map((videoLibrary)=>{
      $("#videoLibraryName").val(videoLibrary.videoLibraryName);
      $("#videoLibraryUrl").val(videoLibrary.videoLibraryUrl);
      $("#videoLibraryCategory").val(videoLibrary.videoLibraryCategory);
      $("#youtubeVideoLink").val(videoLibrary.youtubeVideoLink);
      $('.note-editable').html(videoLibrary.videoLibraryBody);
      $('.updatebtn').attr("id",videoLibrary._id);
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
      Meteor.call("deleteVideoLibrary",id,function(error,result){
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
    return this.state.videoLibrary.map((videoLibrary) =>{
      return <tr>
                <td>{videoLibrary.videoLibraryName}</td>
                <td>
                  <a href={'/manageVideoLibrary/' +videoLibrary._id} onClick={this.edit.bind(this)}>
                    <i className="fa fa-pencil"></i>Edit
                  </a>
                </td>
                <td>
                  <a href="#" id={videoLibrary._id} onClick={this.delete.bind(this)}>
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
              <li className="active">Video Library</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Manage Video Library
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
                					<h1 className="reportTitleName">Manage Video Library</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Library Name<span className="astrick">*</span>:</label>
                								        <input type="text" ref="videoLibraryName" id="videoLibraryName" name="videoLibraryName" value={this.state.videoLibraryName}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Library Url<span className="astrick">*</span>:</label>
                								        <input type="text" ref="videoLibraryUrl" id="videoLibraryUrl" name="videoLibraryUrl" value={this.state.videoLibraryUrl} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Library Category<span className="astrick">*</span>:</label>
                								        <input type="text" ref="videoLibraryCategory" id="videoLibraryCategory" name="videoLibraryCategory" value={this.state.videoLibraryCategory} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Youtube Video Link<span className="astrick">*</span>:</label>
                								        <input type="text" ref="youtubeVideoLink" id="youtubeVideoLink" name="youtubeVideoLink" value={this.state.youtubeVideoLink} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Library Description<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="videoLibraryBody"
                                                        ref = "videoLibraryBody"
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
                                          <th>Video Library Name</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Video Library Name</th>
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

    const postHandle = Meteor.subscribe('videoLibrary');
	  // var editVideoLibrary   = FlowRouter.getParam("id");
    // console.log("Param" +editVideoLibrary);
    const videoLibrary = VideoLibrary.find().fetch()|| {};
    console.log(videoLibrary);
    const loading = !postHandle.ready();

    return {
        loading,
        videoLibrary,
    };
}, ManageVideoLibrary);

export default EditPageContainer;
