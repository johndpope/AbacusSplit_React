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

import {Blocks} from '../api/Blocks';
import {TempBlockImages} from '../api/Blocks';

class BlocksPage extends TrackerReact (Component){
  constructor(props) {
    super(props);
    var metaContext = {id: Meteor.userId(), dir: "images" , name: "blockImage"};
    var uploader = new Slingshot.Upload("myFileUploads" ,metaContext);
    this.state = {
      blockName       : this.props.blocks,
      blockBody       : this.props.blocks,
      id                : this.props.blocks._id,
      blocks          : [],
      upload            : uploader,
      isUploading       : false,
      progressValue     : "0%",
      tempBlockImages : [],
      edit              : false,
    };
  this.handleChange = this.handleChange.bind(this);
  console.log("id " + this.state.id);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.blocks){
         this.setState({
             blockName     : nextProps.blocks.blockName,
             blockBody     : nextProps.blocks.blockBody,
             id               : nextProps.blocks._id,
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
    this.blockTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("blocks");
      const blocks = Blocks.find().fetch();
      this.setState({blocks: blocks});
    });
    this.tempBlockImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempBlockImages');
      const tempBlockImages = TempBlockImages.find().fetch();
      this.setState({tempBlockImages});
    });
    // $(".image-box").css({'background-image':'url('+  $(".image-box").attr('data-image')+')','background-size': 'cover'});
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    const tempBlockImages = TempBlockImages.find().fetch();
    for(i=0;i<tempBlockImages.length;i++){
      if(!tempBlockImages[i].submitted)
        Meteor.call('removeS3Data',tempBlockImages[i].amazonUrl);
    }
    Meteor.call('removeBlockUnsubmitImages',Meteor.userId());
    console.log('unmounted');
    if(this.blockTracker)
      this.blockTracker.stop();
    if(this.tempBlockImageTracker)
      this.tempBlockImageTracker.stop();
  }
  handleClose(e){
    e.preventDefault();
    console.log('deleting ' + e.target.getAttribute('id'));
    if(FlowRouter.getParam("id") && this.state.edit){
      Meteor.call('removeS3Data',e.target.getAttribute('id'));
      Meteor.call('updateEditBlock',e.target.getAttribute('id'));
    }
    Meteor.call('removeBlockUrlImages',e.target.getAttribute('id'));
    Meteor.call('removeS3Data',e.target.getAttribute('id'));
  }
  renderImageData(){
    if(FlowRouter.getParam("id") && this.state.edit){
      const blocks = Blocks.find({'_id': FlowRouter.getParam("id")}).fetch();
      var imageArray =[];
      for(i=0;i<blocks.length;i++){
        for(j=0;j<blocks[i].s3.length; j++){
          if(blocks[i].s3[j].amazonUrl != ''){
            imageArray.push(
            <div key={j} data-image={blocks[i].s3[j].amazonUrl} className="image-box">
              <img src={blocks[i].s3[j].amazonUrl} alt=""/><button id={blocks[i].s3[j].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>);
          }
        }
      }
      const tempBlockImages = TempBlockImages.find().fetch();
      for(k=0;k<tempBlockImages.length;k++){
        if(tempBlockImages[k].amazonUrl != ''&& !tempBlockImages[k].submitted)
          imageArray.push(
            <div data-image={tempBlockImages[k].amazonUrl} className="image-box">
              <img src={tempBlockImages[k].amazonUrl} alt=""/><button id={tempBlockImages[k].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>
          );
      }
      return imageArray;
  }else{
      const tempBlockImages = TempBlockImages.find().fetch();
      return tempBlockImages.map((tempBlockImage)=>{
        if(tempBlockImage.amazonUrl != ''&& !tempBlockImage.submitted)
          return <div data-image={tempBlockImage.amazonUrl} className="image-box">
            <img src={tempBlockImage.amazonUrl} alt=""/><button id={tempBlockImage.amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>;
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
          // Log block detailed response.
          console.error('Error uploading' + downloadUrl + error.reason);
          console.error (error);
        }
        else {
          comp.setState({progressValue:"0%"});
          comp.setState({isUploading:false});
          comp.uploadComputation.stop();
          console.log("Success file uploaded! " + downloadUrl);
          // Meteor.users.update(Meteor.userId(), {$set: {"profile.image": downloadUrl}});
          Meteor.call('uploadTempBlockImages',id,downloadUrl,new Date(), function(error,result){
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
    const tempBlockImages  = TempBlockImages.find().fetch();
    let pageName      = this.refs.blockName.value;
    let pageBody      = $('#messageContent').summernote('code');
    let userId        = Meteor.userId();
    let lastModified  = new Date();
    let id            = e.target.getAttribute('id');
    let amazons3      = [];
    for(i=0;i<tempBlockImages.length;i++){
      if(!tempBlockImages[i].submitted){
        amazons3.push({
          'amazonUrl': tempBlockImages[i].amazonUrl,
          'uploadTime': tempBlockImages[i].uploadTime,
        });
      }
      Meteor.call('updateTempBlockImages',tempBlockImages[i]._id,true);
    }
    Meteor.call('updateBlock',id,pageName,pageBody,userId,lastModified,function(error,result){
        if(error){
            console.log(error.reason);
        }else if(result){
            Bert.alert("Successfully Updated..!!");
        }
    });
    for(j=0;j<tempBlockImages.length;j++){
      if(!tempBlockImages[j].submitted){
        Meteor.call('updateBlockAmazonUrl',tempBlockImages[j].amazonUrl,tempBlockImages[j].uploadTime,id,function(error,result){
            if(error){
                console.log(error.reason);
            }else if(result){
                Bert.alert("Successfully Updated..!!");
            }
        });
      }
    }

    Meteor.call('removeTempBlockImages',Meteor.userId());
    swal("Done",
    "Your page has been Updated!.",
    "success");
    $(".newTemplateForm").css({display:'none'});
  }
  handleSubmit(e){
      e.preventDefault();
      const tempBlockImages = TempBlockImages.find().fetch();
      let pageName = this.refs.blockName.value;
      let pageBody = $('#messageContent').summernote('code');
      let userId = Meteor.userId();
      let lastModified = "";
      let pageNameExist = Blocks.findOne({'blockName': pageName});
      let amazons3 = [];
      console.log(tempBlockImages.length);
      for(i=0;i<tempBlockImages.length;i++){
        if(!tempBlockImages[i].submitted)
          amazons3.push({
            'amazonUrl': tempBlockImages[i].amazonUrl,
            'uploadTime': tempBlockImages[i].uploadTime,
          });
        Meteor.call('updateTempBlockImages',tempBlockImages[i]._id,true);
      }
      if(pageNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else{
          Meteor.call('createBlock',pageName,pageBody,amazons3,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
      }
      Meteor.call('removeTempBlockImages',Meteor.userId());
      swal("Done",
      "Your page has been Created!.",
      "success");
        $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    this.setState({'edit': true});
    const blocks = Blocks.find({_id: FlowRouter.getParam("id")}).fetch();
    blocks.map((block)=>{
      $("#blockName").val(block.blockName);
      $('.note-editable').html(block.blockBody);
      $('.updatebtn').attr("id",block._id);
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
      Meteor.call("deleteBlock",id,function(error,result){
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
    return this.state.blocks.map((block) =>{
      return <tr>
              <td> {block.blockName} </td>
              <td>
                <a href={'/manageblock/' +block._id} onClick={this.edit.bind(this)}>
                  <i className = "fa fa-pencil" > </i>
                  Edit
                </a>
              </td>
              <td>
                <a href="#" id={block._id} onClick={this.delete.bind(this)}>
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
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="box box-primary">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Manage Blocks
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
                            <form className="newTemplateForm">    <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Block Title<span className="astrick">*</span>:</label>
                                        <input type="text" ref="blockName" id="blockName" name="blockName" value={this.state.blockName}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Description<span className="astrick">*</span>:</label>
                                   <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                    <div id="messageContent" name="blockBody"
                                                        ref = "blockBody"
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
                                  </div>
                                </div>
                                {this.state.isUploading?
                                  <div><div className="progress-sm">
                                    <div className="progress-bar progress-bar-yellow" role="progressbar" data-width={this.state.progressValue} aria-valuemin="0" aria-valuemax="100" style={{width:this.state.progressValue} } >
                                        <span className="sr-only">{this.state.progressValue}% Complete
                                        </span>
                                      </div>
                                    </div>
                                  </div>: <div></div>}
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
                                          <th>Block Title</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Block Title</th>
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

    const postHandle = Meteor.subscribe('blocks');
    // var editBlocks   = FlowRouter.getParam("id");
    // console.log("Param" +editBlocks);
    const blocks = Blocks.find().fetch()|| {};
    console.log(blocks);
    const loading = !postHandle.ready();

    return {
        loading,
        blocks,
    };
}, BlocksPage);

export default EditPageContainer;
