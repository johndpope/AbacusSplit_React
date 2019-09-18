import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import {Tracker} from 'meteor/tracker';

import {BlogPages} from '../api/BlogPages';
import {TempBlogImages} from '../api/BlogPages';

export default class CreateBlogPage extends TrackerReact (Component){
  constructor(props) {
	  super(props);
	  this.state = {
	    blogPageName      : '',
	    blogPageBody      : '',
      id                : '',
      blogPages         : [],
      blogMediaType     : 'localVideo',
      youTubeVideoLink  : '',
      blogImageFile     : '',
      blogLocalVideo    : '',
      tempBlogImages    : [],
	  }; 
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
      $("html,body").scrollTop(0);
   if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
    this.blogPageTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("blogPages");
      const blogPages = BlogPages.find().fetch();
      this.setState({blogPages: blogPages});
    });
    this.tempBlogImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempBlogImages');
      const tempBlogImages = TempBlogImages.find().fetch();
      this.setState({tempBlogImages});
    });
    // $(".image-box").css({'background-image':'url('+  $(".image-box").attr('data-image')+')','background-size': 'cover'});
  }
  componentWillMount() {
   
    // if (!!!$("link[href='/css/dashboard.css']").length > 0) {
    //   var dashboardCss = document.createElement("link");
    //   dashboardCss.type = "text/css"; 
    //   dashboardCss.rel = "stylesheet";
    //   dashboardCss.href = "/css/dashboard.css"; 
    //   document.head.append(dashboardCss);
    // }
  }
  componentWillUnmount() {
     $("script[src='/js/adminLte.js']").remove(); 
   // $("link[href='/css/dashboard.css']").remove(); 
    if(this.blogPageTracker){
      this.blogPageTracker.stop();
    }
    if(this.tempBlogImageTracker){
      this.tempBlogImageTracker.stop();
    }
  }
 
  handleUpload(event){
    event.preventDefault(); 
    let self = this;
     this.setState({isUploading: true});
     //  this.calculateProgress();
    // if (event.currentTarget.files && event.currentTarget.files[0]) {
    //     var file = event.currentTarget.files[0];
    //     if (file) {
    //         addServicesImgsToS3Function(file,self);
    //     }
    // }
    if (event.currentTarget.files && event.currentTarget.files[0]) {  
      var dataImg =event.currentTarget.files[0];   
       if(dataImg.type == "image/jpeg" || dataImg.type == "image/png"){       
         var reader = new FileReader();        reader.onload = function (e) {           
           $('.uploadedImageFromLocl').attr('src', e.target.result);       
         };        
         reader.readAsDataURL(event.currentTarget.files[0]);       
         var file = event.currentTarget.files[0];        
          if (file) {          
            addBlogImagesToS3Function(file,self,"image");        
          }    
       } else {  
        swal({     
           position: 'top-right',      
           type: 'error',     
           title: 'Please select image',        
           showConfirmButton: false,       
           timer: 1500       
         });    
      }
    }
  }
  handleVideoUpload(event){
    event.preventDefault();
    let self = this;
    if (event.currentTarget.files && event.currentTarget.files[0]) {  
      var dataImg =event.currentTarget.files[0];   
       if(dataImg.type == "video/mp4"){       
         var reader = new FileReader();        
          reader.onload = function (e) {           
           // $('.uploadedImageFromLocl').attr('src', e.target.result);       
         };        
         reader.readAsDataURL(event.currentTarget.files[0]);       
         var file = event.currentTarget.files[0];       
          if (file) {          
            addBlogImagesToS3Function(file,self,"video");        
          }    
       } else {  
        swal({     
           position: 'top-right',      
           type: 'error',     
           title: 'Please select Video',        
           showConfirmButton: false,       
           timer: 1500       
         });    
      }
    }
  }
  mediaCheck(event){
    event.preventDefault();
    var getMediaType = $(event.currentTarget).attr('data-videoType');
    this.setState({
      "blogMediaType" : getMediaType,
    });
  }
  
  handleSubmit(e){ 
      e.preventDefault();
      var pageName         = this.refs.blogPageName.value;
      var youTubeVideoLink = this.refs.youTubeVideoLink.value;
      var pageBody         = this.refs.blogPageBody.value;
      var blogMediaType    = this.state.blogMediaType;
      var userId           = Meteor.userId();
      var lastModified     = "";
      var pageNameExist    = BlogPages.findOne({'blogPageName': pageName});
      
      if(pageNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else{
          Meteor.call('createBlogPage',pageName,blogMediaType,youTubeVideoLink,pageBody,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else{
                   swal("Done","Your page has been Created!.","success");
                   $('.uploadedImageFromLocl').attr('src', "");
                   $('.blogPageName').val("");
                   $('.youTubeVideoLink').val("");
                   $('.blogPageBody').val("");
              }
          });
      }
  }
  

  render(){
    return(
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1> Blog Management </h1>
            <ol className="breadcrumb">
              <li>
                <a href="#"><i className="fa fa-files-o" /> Blog Management</a></li>
              <li className="active">Add Blogs</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box box-primary">
                  <div className="box-header with-border">
                   <h3 className="box-title">
                      Add Blogs 
                    </h3>
                     {/*<div className="box-tools pull-right">
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
                    </div>*/}
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div className="notifWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">   
                             <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Blog Name</label>
                								        <input type="text" ref="blogPageName" id="blogPageName" name="blogPageName" onChange={this.handleChange} className="templateName blogPageName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required/>
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Blog Body</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                     <textarea  name="blogPageBody" ref ="blogPageBody" onChange={this.handleChange} className="form-control blogPageBody col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="10" required></textarea>
                									 	 {/*<div id="messageContent" name="blogPageBody"
                                                        ref = "blogPageBody"
                                                            ></div>*/}
                									 </div>
                									</div>
                								</div> 
                							</div>
                              <div className="row inputrow subjectRow">
                                <div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <label className=" floating-label">Video Upload</label>
                                  <div className="input-group">
                                    <input type="file" ref="blogLocalVideo" id="s3file" name="blogLocalVideo"  onChange={this.handleVideoUpload.bind(this)}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                    <span className={this.state.blogMediaType=="localVideo" ? "input-group-addon selectedVideoType videoCheck" : "input-group-addon unSelectedVideoType videoCheck"} onClick={this.mediaCheck.bind(this)} data-videoType="localVideo"><i className="fa fa-check" aria-hidden="true"></i></span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                <p>OR</p>
                              </div>

                              <div className="row inputrow subjectRow">
                								<div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                 <label className="floating-label">YouTube Video Link</label>
                									<div className="input-group">
                								      <input type="text" ref="youTubeVideoLink" id="youTubeVideoLink" name="youTubeVideoLink" onChange={this.handleChange}  className="subject youTubeVideoLink col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required/>
                                      <span className={this.state.blogMediaType=="youTubeVideo" ? "input-group-addon selectedVideoType videoCheck" : "input-group-addon unSelectedVideoType videoCheck"} onClick={this.mediaCheck.bind(this)} data-videoType="youTubeVideo"><i className="fa fa-check" aria-hidden="true"></i></span>
                									</div>
                								</div>
                							</div>
                               <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center">
                                <p>OR</p>
                              </div>
                              <div className="row inputrow subjectRow">
                								<div className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 uploadedImageFromLocl1">
                                    <label className="floating-label">Image Upload</label>
                  									<div className="input-group">
                  								      <input type="file" ref="blogImageFile" id="s3file" name="blogImageFile"  onChange={this.handleUpload.bind(this)}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid"/>  
                                        <span className={this.state.blogMediaType=="localImage" ? "input-group-addon selectedVideoType videoCheck" : "input-group-addon unSelectedVideoType videoCheck"} onClick={this.mediaCheck.bind(this)} data-videoType="localImage"><i className="fa fa-check" aria-hidden="true"></i></span>
                  									</div>
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 uploadedImageFromLocl2">     
                                      <div className="uploadedImageFromLocl3">        
                                          <img src="" alt="" className="img-responsive uploadedImageFromLocl"/>    
                                      </div>
                                  </div>
                								</div>
                              </div> 
                              
                							<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
                								<button onClick={this.handleSubmit.bind(this)} type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">ADD</button>
                							</div>
                						</form>
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

