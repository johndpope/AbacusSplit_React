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
import {PhotoGallery} from '../api/PhotoGallery';
import {TempPhotoGallery} from '../api/PhotoGallery';

 class ManagePhotoGallery extends TrackerReact (Component){
  constructor(props) {
	  super(props);
    var metaContext = {id: Meteor.userId(), dir: "images" , name: "albumImage"};
    var uploader = new Slingshot.Upload("myFileUploads" ,metaContext);
	  this.state = {
	    albumName  : this.props.photoGallery,
	    altAttribute   : this.props.photoGallery,
	    photoGalleryBody  : this.props.photoGallery,
      id                : this.props.photoGallery._id,
      blogVideoLink     : this.props.photoGallery,
      upload            : uploader,
      progressValue     : "0%",
      isUploading       : false,
      edit              : false,
      tempPhotoGallery  : [],
      photoGallery      : [],
	  };
  this.handleChange = this.handleChange.bind(this);
  console.log("id " + this.state.id);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.photoGallery){
         this.setState({
             albumName : nextProps.photoGallery.albumName,
             altAttribute  : nextProps.photoGallery.altAttribute,
             photoGalleryBody : nextProps.photoGallery.photoGalleryBody,
             blogVideoLink    : nextProps.photoGallery.blogVideoLink,             id               : nextProps.photoGallery._id,
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
    this.photoGalleryTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("photoGallery");
      const photoGallery = PhotoGallery.find().fetch();
      this.setState({photoGallery: photoGallery});
    });
    this.tempImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempPhotoGallery');
      const tempPhotoGallery = TempPhotoGallery.find().fetch();
      this.setState({tempPhotoGallery});
    });
    // $(".image-box").css({'background-image':'url('+  $(".image-box").attr('data-image')+')','background-size': 'cover'});
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    const tempPhotoGallery = TempPhotoGallery.find().fetch();
    for(i=0;i<tempPhotoGallery.length;i++){
      if(!tempPhotoGallery[i].submitted)
        Meteor.call('removeS3Data',tempPhotoGallery[i].amazonUrl);
    }
    Meteor.call('removeUnsubmitImages',Meteor.userId());
    console.log('unmounted');
    if(this.photoGalleryTracker)
      this.photoGalleryTracker.stop();
    if(this.tempImageTracker)
      this.tempImageTracker.stop();
  }
  handleClose(e){
    e.preventDefault();
    console.log('deleting ' + e.target.getAttribute('id'));
    if(FlowRouter.getParam("id") &&this.state.edit){
      Meteor.call('removeS3Data',e.target.getAttribute('id'));
      Meteor.call('updateEditPhotoGallery',e.target.getAttribute('id'));
    }
    Meteor.call('removeUrlImages',e.target.getAttribute('id'));
    Meteor.call('removeS3Data',e.target.getAttribute('id'));

  }
  renderImageData(){
    if(FlowRouter.getParam("id") && this.state.edit){
      console.log("I have Id");
      const photoGallery = PhotoGallery.find({'_id': FlowRouter.getParam("id")}).fetch();
      var imageArray =[];
      for(i=0;i<photoGallery.length;i++){
        for(j=0;j<photoGallery[i].s3.length; j++){
          if(photoGallery[i].s3[j].amazonUrl != ''){
            imageArray.push(
            <div key={j} data-image={photoGallery[i].s3[j].amazonUrl} className="image-box">
              <img src={photoGallery[i].s3[j].amazonUrl} alt=""/><button id={photoGallery[i].s3[j].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>);
          }
        }
      }
      const tempPhotoGallery = TempPhotoGallery.find().fetch();
      for(k=0;k<tempPhotoGallery.length;k++){
        if(tempPhotoGallery[k].amazonUrl != ''&& !tempPhotoGallery[k].submitted)
          imageArray.push(
            <div data-image={tempPhotoGallery[k].amazonUrl} className="image-box">
              <img src={tempPhotoGallery[k].amazonUrl} alt=""/><button id={tempPhotoGallery[k].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>
          );
      }
      return imageArray;
  }else{
      const tempPhotoGallery = TempPhotoGallery.find().fetch();
      return tempPhotoGallery.map((tempImage)=>{
        if(tempImage.amazonUrl != ''&& !tempImage.submitted)
          return <div data-image={tempImage.amazonUrl} className="image-box">
            <img src={tempImage.amazonUrl} alt=""/><button id={tempImage.amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>;
      });
    }
}
  handleUpload(e) {
    let altAttribute = this.refs.altAttribute.value.trim();
    if(!altAttribute){
      swal("Oops..!","Please insert Image alt attribute first.","error");
    }else{
        let id = Meteor.userId();
        e.preventDefault();
        this.setState({isUploading: true});
        this.calculateProgress();
        var comp = this;
        // console.log(comp);
        this.state.upload.send(document.getElementById('s3file').files[0], function (error, downloadUrl) {
          if (error) {
            // Log service detailed response.
            console.error('Error uploading file '  + error.reason);
            console.error (error);
          }
          else {
            comp.setState({progressValue:"0%"});
            comp.setState({isUploading:false});
            comp.uploadComputation.stop();
            console.log("Success file uploaded! " + downloadUrl);
            Meteor.call('uploadTempPhotoGallery',id,downloadUrl,new Date(),altAttribute, function(error,result){
                if(error){
                    console.log(error.reason);
                }else if(result){
                    Bert.alert("Successfully Inserted..!!");
                }
            });
          }
        });
      }
    }
  handleUpdate(e){
    e.preventDefault();
    this.setState({edit:true});
    const tempPhotoGallery = TempPhotoGallery.find().fetch();
    let albumName = this.refs.albumName.value;
    let altAttribute = this.refs.altAttribute.value;
    let userId = Meteor.userId();
    let lastModified = new Date();
    let id = e.target.getAttribute('id');
    let amazons3 = [];
    for(i=0;i<tempPhotoGallery.length;i++){
      if(!tempPhotoGallery[i].submitted){
        amazons3.push({
          'amazonUrl'     : tempPhotoGallery[i].amazonUrl,
          'uploadTime'    : tempPhotoGallery[i].uploadTime,
          'altAttribute'  : tempPhotoGallery[i].altAttribute
        });
      }
      Meteor.call('updateTempPhotoGallery',tempPhotoGallery[i]._id,true);
    }
    Meteor.call('updatePhotoGallery',id,albumName,altAttribute,userId,lastModified,function(error,result){
        if(error){
            console.log(error.reason);
        }else if(result){
            Bert.alert("Successfully Updated..!!");
        }
    });
    for(j=0;j<tempPhotoGallery.length;j++){
      if(!tempPhotoGallery[j].submitted){
        Meteor.call('updateGalleryAmazonUrl',tempPhotoGallery[j].amazonUrl,tempPhotoGallery[j].uploadTime,altAttribute,id,function(error,result){
            if(error){
                console.log(error.reason);
            }else if(result){
                Bert.alert("Successfully Updated..!!");
            }
        });
      }
    }

    Meteor.call('removeTempPhotoGallery',Meteor.userId());
    swal("Done",
    "Your page has been Updated!.",
    "success");
    $(".newTemplateForm").css({display:'none'});
  }
  handleSubmit(e){
      e.preventDefault();
      const tempPhotoGallery  = TempPhotoGallery.find().fetch();
      let albumName           = this.refs.albumName.value;
      let altAttribute        = this.refs.altAttribute.value;
      let userId              = Meteor.userId();
      let lastModified        = "";
      let albumNameExist      = PhotoGallery.findOne({'albumName': albumName});
      let imageAltExist       = PhotoGallery.findOne({'imageAlt' :altAttribute});
      let amazons3            = [];
      for(i=0;i<tempPhotoGallery.length;i++){
        if(!tempPhotoGallery[i].submitted)
          amazons3.push({
            'amazonUrl'     : tempPhotoGallery[i].amazonUrl,
            'uploadTime'    : tempPhotoGallery[i].uploadTime,
            'altAttribute'  : tempPhotoGallery[i].altAttribute,
          });
        Meteor.call('updateTempPhotoGallery',tempPhotoGallery[i]._id,true);
      }
      if(albumNameExist){
          swal("Oops...!","This album name is already taken!","error");
      }else if(imageAltExist){
          swal("Oops...!","This image alt attrubute is already taken!","error");
      }else{
          Meteor.call('createPhotoGallery',albumName,altAttribute,amazons3,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
      }
      Meteor.call('removeTempPhotoGallery',Meteor.userId());
      swal("Done",
      "Your album has been Created!.",
      "success");
        $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    this.setState({'edit': true});
    const photoGallery = PhotoGallery.find({_id: FlowRouter.getParam("id")}).fetch();
    photoGallery.map((photoGallery)=>{
      $("#albumName").val(photoGallery.albumName);
      $("#altAttribute").val(photoGallery.altAttribute);
      $('.updatebtn').attr("id",photoGallery._id);
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
      text              : "You want to delete this album!",
      type              : "warning",
      showCancelButton  : true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText : "Yes, delete it!",
      closeOnConfirm    : false,
      html              : false
    }, function(){
      Meteor.call("deletePhotoGallery",id,function(error,result){
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
    return this.state.photoGallery.map((photoGallery) =>{
      return <tr>
              <td>{photoGallery.albumName}</td>
              <td>
                <a href={'/managephotogallery/' +photoGallery._id} onClick={this.edit.bind(this)}>
                  <i className="fa fa-pencil"></i>Edit
                </a>
              </td>
              <td>
                <a href="#" id={photoGallery._id} onClick={this.delete.bind(this)}>
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
              <li className="active">Photo Gallery</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Photo Gallery
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
                					<h1 className="reportTitleName">Photo Gallery</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Album  Name<span className="astrick">*</span>:</label>
                								        <input type="text" ref="albumName" id="albumName" name="albumName" value={this.state.albumName}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Image Alt Attribute<span className="astrick">*</span>:</label>
                								        <input type="text" ref="altAttribute" id="altAttribute" name="altAttribute" value={this.state.altAttribute} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                              <div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Image Upload<span className="astrick">*</span>:</label>
                								        <input type="file" ref="blogImageFile" id="s3file" name="blogImageFile"  onChange={this.handleUpload.bind(this)}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                        {                                                    this.state.isUploading
                                            ? <div>
                                                <div className="progress progress-sm">
                                                  <div className="progress-bar progress-bar-yellow" role="progressbar" data-width={this.state.progressValue} aria-valuemin="0" aria-valuemax="100" style={{
                                                    width: this.state.progressValue
                                                  }}>
                                                    <span className="sr-only">{this.state.progressValue}% Complete
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            :
                                            <div></div>
                                        }
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
                                          <th>Album Name</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Album Name</th>
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

    const postHandle = Meteor.subscribe('photoGallery');
	  // var editPhotoGallery   = FlowRouter.getParam("id");
    // console.log("Param" +editPhotoGallery);
    const photoGallery = PhotoGallery.find().fetch()|| {};
    // console.log(photoGallery);
    const loading = !postHandle.ready();

    return {
        loading,
        photoGallery,
    };
}, ManagePhotoGallery);

export default EditPageContainer;
