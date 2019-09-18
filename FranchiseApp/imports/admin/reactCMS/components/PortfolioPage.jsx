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

import {Portfolios} from '../api/Portfolios';
import {TempPortfolioImages} from '../api/Portfolios';
import {TempPortfolioLogoImages} from '../api/Portfolios';

class PortfolioPage extends TrackerReact (Component){
  constructor(props) {
	  super(props);
    var metaContext = {id: Meteor.userId(), dir: "images" , name: "portfolioImage"};
    var uploader = new Slingshot.Upload("myFileUploads" ,metaContext);
	  this.state = {
	    portfolioPageTitle      : this.props.portfolios,
	    portfolioPageName       : this.props.portfolios,
	    portfolioPageBody       : this.props.portfolios,
      id                      : this.props.portfolios._id,
      portfolios              : [],
      portfolioVideoLink      : this.props.portfolios,
      upload                  : uploader,
      isUploading             : false,
      isLogoUploading         : false,
      logoProgressValue       : "0%",
      progressValue           : "0%",
      tempPortfolioImages     : [],
      tempPortfolioLogoImages : [],
      edit                    : false,
	  };
  this.handleChange = this.handleChange.bind(this);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.portfolios){
         this.setState({
             portfolioPageTitle    : nextProps.portfolios.portfolioPageTitle,
             portfolioPageName     : nextProps.portfolios.portfolioPageName,
             portfolioPageBody     : nextProps.portfolios.portfolioPageBody,
             portfolioVideoLink    : nextProps.portfolios.portfolioVideoLink,
             id                    : nextProps.portfolios._id,
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
    this.portfolioPageTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("portfolios");
      const portfolios = Portfolios.find().fetch();
      this.setState({portfolios: portfolios});
    });
    this.tempPortfolioImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempPortfolioImages');
      const tempPortfolioImages = TempPortfolioImages.find().fetch();
      this.setState({tempPortfolioImages});
    });
    this.tempPortfolioLogoImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempPortfolioLogoImages');
      const tempPortfolioLogoImages = TempPortfolioLogoImages.find().fetch();
      this.setState({tempPortfolioLogoImages});
    });
    // $(".image-box").css({'background-image':'url('+  $(".image-box").attr('data-image')+')','background-size': 'cover'});
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    const tempPortfolioImages = TempPortfolioImages.find().fetch();
    for(i=0;i<tempPortfolioImages.length;i++){
      if(!tempPortfolioImages[i].submitted)
        Meteor.call('removeS3Data',tempPortfolioImages[i].amazonUrl);
    }
    const tempPortfolioLogoImages = TempPortfolioLogoImages.find().fetch();
    for(i=0;i<tempPortfolioLogoImages.length;i++){
      if(!tempPortfolioLogoImages[i].submitted)
        Meteor.call('removeS3Data',tempPortfolioLogoImages[i].logoAmazonUrl);
    }
    Meteor.call('removePortfolioUnsubmitImages',Meteor.userId());
    Meteor.call('removePortfolioLogoUnsubmitImages',Meteor.userId());
    console.log('unmounted');
    if(this.portfolioPageTracker)
      this.portfolioPageTracker.stop();
    if(this.tempPortfolioImageTracker)
      this.tempPortfolioImageTracker.stop();
    if(this.tempPortfolioLogoImageTracker)
      this.tempPortfolioLogoImageTracker.stop();
  }
  handleClose(e){
    e.preventDefault();
    console.log('deleting ' + e.target.getAttribute('id'));
    if(FlowRouter.getParam("id") &&this.state.edit){
      Meteor.call('removeS3Data',e.target.getAttribute('id'));
      Meteor.call('updateEditPortfolioPage',e.target.getAttribute('id'));
    }
    Meteor.call('removePortfolioUrlImages',e.target.getAttribute('id'));
    Meteor.call('removeS3Data',e.target.getAttribute('id'));
  }
  handleLogoClose(e){
    e.preventDefault();
    console.log('deleting ' + e.target.getAttribute('id'));
    if(FlowRouter.getParam("id") &&this.state.edit){
      Meteor.call('removeS3Data',e.target.getAttribute('id'));
      Meteor.call('updateEditPortfolioLogoPage',e.target.getAttribute('id'));
    }
    Meteor.call('removePortfolioLogoUrlImages',e.target.getAttribute('id'));
    Meteor.call('removeS3Data',e.target.getAttribute('id'));
  }
  renderImageData(){
    if(FlowRouter.getParam("id") && this.state.edit){
      console.log("I have Id");
      const portfolios = Portfolios.find({'_id': FlowRouter.getParam("id")}).fetch();
      var imageArray =[];
      for(i=0;i<portfolios.length;i++){
        for(j=0;j<portfolios[i].s3.length; j++){
          if(portfolios[i].s3[j].amazonUrl != ''){
            imageArray.push(
            <div key={j} data-image={portfolios[i].s3[j].amazonUrl} className="image-box">
              <img src={portfolios[i].s3[j].amazonUrl} alt=""/><button id={portfolios[i].s3[j].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>);
          }
        }
      }
      const tempPortfolioImages = TempPortfolioImages.find().fetch();
      for(k=0;k<tempPortfolioImages.length;k++){
        if(tempPortfolioImages[k].amazonUrl != ''&& !tempPortfolioImages[k].submitted)
          imageArray.push(
            <div data-image={tempPortfolioImages[k].amazonUrl} className="image-box">
              <img src={tempPortfolioImages[k].amazonUrl} alt=""/><button id={tempPortfolioImages[k].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>
          );
      }
      return imageArray;
  }else{
      const tempPortfolioImages = TempPortfolioImages.find().fetch();
      return tempPortfolioImages.map((tempPortfolioImage)=>{
        if(tempPortfolioImage.amazonUrl != ''&& !tempPortfolioImage.submitted)
          return <div data-image={tempPortfolioImage.amazonUrl} className="image-box">
            <img src={tempPortfolioImage.amazonUrl} alt=""/><button id={tempPortfolioImage.amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>;
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
          // Log service detailed response.
          console.error('Error uploading' + downloadUrl + error.reason);
          console.error (error);
        }
        else {
          comp.setState({progressValue:"0%"});
          comp.setState({isUploading:false});
          comp.uploadComputation.stop();
          console.log("Success file uploaded! " + downloadUrl);
          // Meteor.users.update(Meteor.userId(), {$set: {"profile.image": downloadUrl}});
          Meteor.call('uploadTempPortfolioImages',id,downloadUrl,new Date(), function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
        }
      });
    }
    renderLogoImageData(){
      if(FlowRouter.getParam("id") && this.state.edit){
        const portfolios = Portfolios.find({'_id': FlowRouter.getParam("id")}).fetch();
        var imageArray =[];
        for(i=0;i<portfolios.length;i++){
          for(j=0;j<portfolios[i].logoS3.length; j++){
            if(portfolios[i].logoS3[j].logoAmazonUrl != ''){
              imageArray.push(
              <div key={j} data-image={portfolios[i].logoS3[j].logoAmazonUrl} className="image-box">
                <img src={portfolios[i].logoS3[j].logoAmazonUrl} alt=""/><button id={portfolios[i].logoS3[j].logoAmazonUrl} className="close" onClick={this.handleLogoClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>);
            }
          }
        }
        const tempPortfolioLogoImages = TempPortfolioLogoImages.find().fetch();
        for(k=0;k<tempPortfolioLogoImages.length;k++){
          if(tempPortfolioLogoImages[k].logoAmazonUrl != ''&& !tempPortfolioLogoImages[k].submitted)
            imageArray.push(
              <div data-image={tempPortfolioLogoImages[k].logoAmazonUrl} className="image-box">
                <img src={tempPortfolioLogoImages[k].logoAmazonUrl} alt=""/><button id={tempPortfolioLogoImages[k].logoAmazonUrl} className="close" onClick={this.handleLogoClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>
            );
        }
        return imageArray;
    }else{
        const tempPortfolioLogoImages = TempPortfolioLogoImages.find().fetch();
        return tempPortfolioLogoImages.map((tempPortfolioLogoImage)=>{
          if(tempPortfolioLogoImage.logoAmazonUrl != ''&& !tempPortfolioLogoImage.submitted)
            return <div data-image={tempPortfolioLogoImage.logoAmazonUrl} className="image-box">
              <img src={tempPortfolioLogoImage.logoAmazonUrl} alt=""/><button id={tempPortfolioLogoImage.logoAmazonUrl} className="close" onClick={this.handleLogoClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>;
        });
      }
  }
    calculateLogoProgress(){
      this.uploadLogoComputation = Tracker.autorun(() => {
           const logoUploadProgress = Math.round(this.state.upload.progress() * 100);
           if (!isNaN(logoUploadProgress)) this.setState({logoProgressValue: logoUploadProgress +"%" });
      });
    }
    handleLogoUpload(e) {
        let id = Meteor.userId();
        e.preventDefault();
        this.setState({isLogoUploading: true});
        this.calculateLogoProgress();
        var comp = this;
        // console.log(comp);
        this.state.upload.send(document.getElementById('s3fileLogo').files[0], function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading '  + error.reason);
            console.error (error);
          }
          else {
            comp.setState({logoProgressValue:"0%"});
            comp.setState({isLogoUploading:false});
            comp.uploadLogoComputation.stop();
            console.log("Success file uploaded! " + downloadUrl);
            // Meteor.users.update(Meteor.userId(), {$set: {"profile.image": downloadUrl}});
            Meteor.call('uploadTempPortfolioLogoImages',id,downloadUrl,new Date(), function(error,result){
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
    const tempPortfolioImages  = TempPortfolioImages.find().fetch();
    const tempPortfolioLogoImages  = TempPortfolioLogoImages.find().fetch();
    let pageName      = this.refs.portfolioPageTitle.value;
    let pageUrl       = this.refs.portfolioPageName.value;
    let pageVideoLink = this.refs.portfolioVideoLink.value;
    let pageBody      = $('#messageContent').summernote('code');
    let userId        = Meteor.userId();
    let lastModified  = new Date();
    let id            = e.target.getAttribute('id');
    let amazons3      = [];
    let logoAmazons3  = [];
    for(i=0;i<tempPortfolioImages.length;i++){
      if(!tempPortfolioImages[i].submitted){
        amazons3.push({
          'amazonUrl': tempPortfolioImages[i].amazonUrl,
          'uploadTime': tempPortfolioImages[i].uploadTime,
        });
      }
      Meteor.call('updateTempPortfolioImages',tempPortfolioImages[i]._id,true);
    }
    for(i=0;i<tempPortfolioLogoImages.length;i++){
      if(!tempPortfolioLogoImages[i].submitted){
        amazons3.push({
          'amazonUrl': tempPortfolioLogoImages[i].logoAmazonUrl,
          'uploadTime': tempPortfolioLogoImages[i].uploadTime,
        });
      }
      Meteor.call('updateTempPortfolioLogoImages',tempPortfolioLogoImages[i]._id,true);
    }
    Meteor.call('updatePortfolioPage',id,pageName,pageUrl,pageVideoLink,pageBody,userId,lastModified,function(error,result){
        if(error){
            console.log(error.reason);
        }else if(result){
            Bert.alert("Successfully Updated..!!");
        }
    });
    for(j=0;j<tempPortfolioImages.length;j++){
      if(!tempPortfolioImages[j].submitted){
        Meteor.call('updatePortfolioAmazonUrl',tempPortfolioImages[j].amazonUrl,tempPortfolioImages[j].uploadTime,id,function(error,result){
            if(error){
                console.log(error.reason);
            }else if(result){
                Bert.alert("Successfully Updated..!!");
            }
        });
      }
    }
    for(j=0;j<tempPortfolioLogoImages.length;j++){
      if(!tempPortfolioLogoImages[j].submitted){
        Meteor.call('updatePortfolioLogoAmazonUrl',tempPortfolioLogoImages[j].logoAmazonUrl,tempPortfolioLogoImages[j].uploadTime,id,function(error,result){
            if(error){
                console.log(error.reason);
            }else if(result){
                Bert.alert("Successfully Updated..!!");
            }
        });
      }
    }
    Meteor.call('removeTempPortfolioImages',Meteor.userId());
    Meteor.call('removeTempPortfolioLogoImages',Meteor.userId());
    swal("Done",
    "Your page has been Updated!.",
    "success");
    $(".newTemplateForm").css({display:'none'});
  }
  handleSubmit(e){
      e.preventDefault();
      const tempPortfolioImages = TempPortfolioImages.find().fetch();
      const tempPortfolioLogoImages = TempPortfolioLogoImages.find().fetch();
      let pageName = this.refs.portfolioPageTitle.value;
      let pageUrl = this.refs.portfolioPageName.value;
      let pageVideoLink = this.refs.portfolioVideoLink.value;
      let pageBody = $('#messageContent').summernote('code');
      let userId = Meteor.userId();
      let lastModified = "";
      let pageNameExist = Portfolios.findOne({'portfolioPageTitle': pageName});
      let pageUrlExist = Portfolios.findOne({'portfolioPageName': pageUrl});
      let amazons3 = [];
      let logoAmazons3 = [];
      for(i=0;i<tempPortfolioImages.length;i++){
        if(!tempPortfolioImages[i].submitted)
          amazons3.push({
            'amazonUrl': tempPortfolioImages[i].amazonUrl,
            'uploadTime': tempPortfolioImages[i].uploadTime,
          });
        Meteor.call('updateTempPortfolioImages',tempPortfolioImages[i]._id,true);
      }
      for(i=0;i<tempPortfolioLogoImages.length;i++){
        if(!tempPortfolioLogoImages[i].submitted)
          logoAmazons3.push({
            'logoAmazonUrl': tempPortfolioLogoImages[i].logoAmazonUrl,
            'uploadTime': tempPortfolioLogoImages[i].uploadTime,
          });
        Meteor.call('updateTempPortfolioLogoImages',tempPortfolioLogoImages[i]._id,true);
      }
      if(pageNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else if(pageUrlExist){
          swal("Oops...!","This page url is already taken!","error");
      }else{
          Meteor.call('createPortfolioPage',pageName,pageUrl,pageVideoLink,pageBody,amazons3,logoAmazons3,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
      }
      Meteor.call('removeTempPortfolioImages',Meteor.userId());
      Meteor.call('removeTempPortfolioLogoImages',Meteor.userId());
      swal("Done",
      "Your page has been Created!.",
      "success");
        $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    this.setState({'edit': true});
    const portfolios = Portfolios.find({_id: FlowRouter.getParam("id")}).fetch();
    portfolios.map((portfolioPage)=>{
      $("#portfolioPageTitle").val(portfolioPage.portfolioPageTitle);
      $("#portfolioPageName").val(portfolioPage.portfolioPageName);
      $("#portfolioVideoLink").val(portfolioPage.portfolioVideoLink);
      $('.note-editable').html(portfolioPage.portfolioPageBody);
      $('.updatebtn').attr("id",portfolioPage._id);
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
      Meteor.call("deletePortfolioPage",id,function(error,result){
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
    return this.state.portfolios.map((portfolioPage) =>{
      return <tr><td>{portfolioPage.portfolioPageTitle}</td> <td><a href={'/portfolio/' +portfolioPage._id} onClick={this.edit.bind(this)}>
        <i className="fa fa-pencil"></i>Edit
      </a></td><td><a href="#" id={portfolioPage._id} onClick={this.delete.bind(this)}>
        <i className="fa fa-trash-o"></i> Delete
      </a></td></tr>;
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
              <li className="active">Portfolio Page</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Portfolio Page
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
                					<h1 className="reportTitleName">Portfolio PAGE</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Case Title<span className="astrick">*</span>:</label>
                								        <input type="text" ref="portfolioPageTitle" id="portfolioPageTitle" name="portfolioPageTitle" value={this.state.portfolioPageTitle}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Client Name<span className="astrick">*</span>:</label>
                								        <input type="text" ref="portfolioPageName" id="portfolioPageName" name="portfolioPageName" value={this.state.portfolioPageName} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Project Description<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="portfolioPageBody"
                                                        ref = "portfolioPageBody"
                                                            ></div>
                									 </div>
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Video Link<span className="astrick">*</span>:</label>
                								        <input type="text" ref="portfolioVideoLink" id="portfolioVideoLink" name="portfolioVideoLink" value={this.state.portfolioVideoLink} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Image Upload<span className="astrick">*</span>:</label>
                								        <input type="file" ref="blogImageFile" id="s3file" name="blogImageFile"  onChange={this.handleUpload.bind(this)}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                          {this.state.isUploading?
                                            <div><div className="progress-sm">
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
                              <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group subjectDiv">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Logo Image Upload<span className="astrick">*</span>:</label>
                                        <input type="file" ref="blogImageFile" id="s3fileLogo" name="blogImageFile"  onChange={this.handleLogoUpload.bind(this)}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                          {this.state.isLogoUploading?
                                            <div><div className="progress-sm">
                                              <div className="progress-bar progress-bar-yellow" role="progressbar" data-width={this.state.logoProgressValue} aria-valuemin="0" aria-valuemax="100" style={{width:this.state.logoProgressValue} } >
                                                  <span className="sr-only">{this.state.logoProgressValue}% Complete
                                                  </span>
                                                </div>
                                              </div>
                                            </div>: <div></div>}

                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow subjectRow">
                                <div className="imageContainer">
                                  {this.renderLogoImageData()}
                                </div>
                              </div>

                							<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12">
                								<button onClick={this.handleSubmit.bind(this)} type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">Submit Page</button>
                								<button  onClick={this.handleUpdate.bind(this)} type="submit" className="btn btn-primary pull-right updatebtn col-lg-2 col-md-3 col-sm-6 col-xs-12">Update Page</button>
                							</div>
                						</form>
                					</div>
                          <div className="dataTable tableBasicPage">
                              <table className="heavyTable"  className="display" width="100%" cellSpacing="0">
                                  <thead>
                                      <tr>
                                          <th>Case Title</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Case Title</th>
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

    const postHandle = Meteor.subscribe('portfolios');
	  // var editPortfolios   = FlowRouter.getParam("id");
    // console.log("Param" +editPortfolios);
    const portfolios = Portfolios.find().fetch()|| {};
    console.log(portfolios);
    const loading = !postHandle.ready();

    return {
        loading,
        portfolios,
    };
}, PortfolioPage);

export default EditPageContainer;
