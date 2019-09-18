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
import {Products} from '../api/Products';
import {TempProductImages} from '../api/Products';

class ProductPage extends TrackerReact (Component){
  constructor(props) {
	  super(props);
    var metaContext = {id: Meteor.userId(), dir: "images" , name: "productImage"};
    var uploader = new Slingshot.Upload("myFileUploads" ,metaContext);
	  this.state = {
	    productName       : this.props.products,
	    productBody       : this.props.products,
      id                : this.props.products._id,
      products          : [],
      upload            : uploader,
      isUploading       : false,
      progressValue     : "0%",
      tempProductImages : [],
      edit              : false,
	  };
  this.handleChange = this.handleChange.bind(this);
  console.log("id " + this.state.id);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.products){
         this.setState({
             productName     : nextProps.products.productName,
             productBody     : nextProps.products.productBody,
             id              : nextProps.products._id,
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
    console.log('product mounted');
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
    this.productTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("products");
      const products = Products.find().fetch();
      this.setState({products: products});
    });
    this.tempProductImageTracker = Tracker.autorun(()=>{
      Meteor.subscribe('tempProductImages');
      const tempProductImages = TempProductImages.find().fetch();
      this.setState({tempProductImages});
    });
    // $(".image-box").css({'background-image':'url('+  $(".image-box").attr('data-image')+')','background-size': 'cover'});
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    const tempProductImages = TempProductImages.find().fetch();
    for(i=0;i<tempProductImages.length;i++){
      if(!tempProductImages[i].submitted)
        Meteor.call('removeS3Data',tempProductImages[i].amazonUrl);
    }
    Meteor.call('removeProductUnsubmitImages',Meteor.userId());
    console.log('unmounted');
    if(this.productTracker)
      this.productTracker.stop();
    if(this.tempProductImageTracker)
      this.tempProductImageTracker.stop();
  }
  handleClose(e){
    e.preventDefault();
    console.log('deleting ' + e.target.getAttribute('id'));
    if(FlowRouter.getParam("id") &&this.state.edit){
      Meteor.call('removeS3Data',e.target.getAttribute('id'));
      Meteor.call('updateEditProduct',e.target.getAttribute('id'));
    }
    Meteor.call('removeProductUrlImages',e.target.getAttribute('id'));
    Meteor.call('removeS3Data',e.target.getAttribute('id'));
  }
  renderImageData(){
    if(FlowRouter.getParam("id") && this.state.edit){
      const products = Products.find({'_id': FlowRouter.getParam("id")}).fetch();
      var imageArray =[];
      for(i=0;i<products.length;i++){
        for(j=0;j<products[i].s3.length; j++){
          if(products[i].s3[j].amazonUrl != ''){
            imageArray.push(
            <div key={j} data-image={products[i].s3[j].amazonUrl} className="image-box">
              <img src={products[i].s3[j].amazonUrl} alt=""/><button id={products[i].s3[j].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>);
          }
        }
      }
      const tempProductImages = TempProductImages.find().fetch();
      for(k=0;k<tempProductImages.length;k++){
        if(tempProductImages[k].amazonUrl != ''&& !tempProductImages[k].submitted)
          imageArray.push(
            <div data-image={tempProductImages[k].amazonUrl} className="image-box">
              <img src={tempProductImages[k].amazonUrl} alt=""/><button id={tempProductImages[k].amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>
          );
      }
      return imageArray;
  }else{
      const tempProductImages = TempProductImages.find().fetch();
      return tempProductImages.map((tempProductImage)=>{
        if(tempProductImage.amazonUrl != ''&& !tempProductImage.submitted)
          return <div data-image={tempProductImage.amazonUrl} className="image-box">
            <img src={tempProductImage.amazonUrl} alt=""/><button id={tempProductImage.amazonUrl} className="close" onClick={this.handleClose.bind(this)}><i className="ion ion-close-circled"></i></button></div>;
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
          // Log product detailed response.
          console.error('Error uploading' + downloadUrl + error.reason);
          console.error (error);
        }
        else {
          comp.setState({progressValue:"0%"});
          comp.setState({isUploading:false});
          comp.uploadComputation.stop();
          console.log("Success file uploaded! " + downloadUrl);
          // Meteor.users.update(Meteor.userId(), {$set: {"profile.image": downloadUrl}});
          Meteor.call('uploadTempProductImages',id,downloadUrl,new Date(), function(error,result){
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
    const tempProductImages  = TempProductImages.find().fetch();
    let pageName      = this.refs.productName.value;
    let pageBody      = $('#messageContent').summernote('code');
    let userId        = Meteor.userId();
    let lastModified  = new Date();
    let id            = e.target.getAttribute('id');
    let amazons3      = [];
    for(i=0;i<tempProductImages.length;i++){
      if(!tempProductImages[i].submitted){
        amazons3.push({
          'amazonUrl': tempProductImages[i].amazonUrl,
          'uploadTime': tempProductImages[i].uploadTime,
        });
      }
      Meteor.call('updateTempProductImages',tempProductImages[i]._id,true);
    }
    Meteor.call('updateProduct',id,pageName,pageBody,userId,lastModified,function(error,result){
        if(error){
            console.log(error.reason);
        }else if(result){
            Bert.alert("Successfully Updated..!!");
        }
    });
    for(j=0;j<tempProductImages.length;j++){
      if(!tempProductImages[j].submitted){
        Meteor.call('updateProductAmazonUrl',tempProductImages[j].amazonUrl,tempProductImages[j].uploadTime,id,function(error,result){
            if(error){
                console.log(error.reason);
            }else if(result){
                Bert.alert("Successfully Updated..!!");
            }
        });
      }
    }

    Meteor.call('removeTempProductImages',Meteor.userId());
    swal("Done",
    "Your page has been Updated!.",
    "success");
    $(".newTemplateForm").css({display:'none'});
  }
  handleSubmit(e){
      e.preventDefault();
      const tempProductImages = TempProductImages.find().fetch();
      let pageName = this.refs.productName.value;
      let pageBody = $('#messageContent').summernote('code');
      let userId = Meteor.userId();
      let lastModified = "";
      let pageNameExist = Products.findOne({'productName': pageName});
      let amazons3 = [];
      console.log(tempProductImages.length);
      for(i=0;i<tempProductImages.length;i++){
        if(!tempProductImages[i].submitted)
          amazons3.push({
            'amazonUrl': tempProductImages[i].amazonUrl,
            'uploadTime': tempProductImages[i].uploadTime,
          });
        Meteor.call('updateTempProductImages',tempProductImages[i]._id,true);
      }
      if(pageNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else{
          Meteor.call('createProduct',pageName,pageBody,amazons3,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });
      }
      Meteor.call('removeTempProductImages',Meteor.userId());
      swal("Done",
      "Your page has been Created!.",
      "success");
        $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    this.setState({'edit': true});
    const products = Products.find({_id: FlowRouter.getParam("id")}).fetch();
    products.map((product)=>{
      $("#productName").val(product.productName);
      $('.note-editable').html(product.productBody);
      $('.updatebtn').attr("id",product._id);
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
      Meteor.call("deleteProduct",id,function(error,result){
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
    return this.state.products.map((product) =>{
      return <tr>
              <td> {product.productName} </td>
              <td>
                <a href={'/manageproduct/' +product._id} onClick={this.edit.bind(this)}>
                  <i className = "fa fa-pencil" > </i>
                  Edit
                </a>
              </td>
              <td>
                <a href="#" id={product._id} onClick={this.delete.bind(this)}>
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
              <li className="active">Product Page</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Manage Products
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
                					<h1 className="reportTitleName">Manage Products</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Product Name<span className="astrick">*</span>:</label>
                								        <input type="text" ref="productName" id="productName" name="productName" value={this.state.productName}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Description<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="productBody"
                                                        ref = "productBody"
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
                                          <th>Product Title</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Product Title</th>
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

    const postHandle = Meteor.subscribe('products');
	  // var editProducts   = FlowRouter.getParam("id");
    // console.log("Param" +editProducts);
    const products = Products.find().fetch()|| {};
    console.log(products);
    const loading = !postHandle.ready();

    return {
        loading,
        products,
    };
}, ProductPage);

export default EditPageContainer;
