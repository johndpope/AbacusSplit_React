import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { BasicPages } from '../api/BasicPages';


class CreateBasicPage extends TrackerReact (Component){
  constructor(props) {
	  super(props);
	  this.state = {
	    basicPageName    : this.props.basicPages.basicPageName,
	    basicPageUrl     : this.props.basicPages.basicPageUrl,
	    basicPageBody    : this.props.basicPages.basicPageBody,
      id               : this.props.basicPages._id,
      basicPages       : [],
	  };
    this.handleChange = this.handleChange.bind(this);
    // console.log("id " + this.state.id);
    // console.log("basicPageName " + this.state.basicPageName);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.basicPages){
         this.setState({
             basicPageName     : nextProps.basicPages.basicPageName,
             basicPageUrl      : nextProps.basicPages.basicPageUrl,
             basicPageBody     : nextProps.basicPages.basicPageBody,
             id                : nextProps.basicPages._id,
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
    this.basicPageTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("basicPages");
      const basicPages = BasicPages.find().fetch();
      this.setState({basicPages: basicPages});
    });
    // console.log(basicPage);
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    if (this.basicPageTracker) {
    this.basicPageTracker.stop();
    }
  }
  handleUpdate(e){
    e.preventDefault();
    console.log("i am in update");
    let pageName      = this.refs.basicPageName.value;
    let pageUrl       = this.refs.basicPageUrl.value;
    let pageBody      = $('#messageContent').summernote('code');
    let userId        = Meteor.userId();
    let lastModified  = new Date();
    let id            = e.target.getAttribute('id');
    console.log(pageBody + pageUrl + pageName);
    Meteor.call('updateBasicPage',id,pageName,pageUrl,pageBody,userId,lastModified,function(error,result){
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
      let pageName      = this.refs.basicPageName.value;
      let pageUrl       = this.refs.basicPageUrl.value;
      let pageBody      = $('#messageContent').summernote('code');
      let userId        = Meteor.userId();
      let lastModified  = "";
      let pageNameExist = BasicPages.findOne({'basicPageName': pageName});
      let pageUrlExist  = BasicPages.findOne({'basicPageUrl': pageUrl});

      if(pageNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else if(pageUrlExist){
          swal("Oops...!","This page url is already taken!","error");
      }else{
          Meteor.call('createBasicPage',pageName,pageUrl,pageBody,userId,lastModified,function(error,result){
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
    const basicPages = BasicPages.find({_id: FlowRouter.getParam("id")}).fetch();
    basicPages.map((basicPage)=>{
      $("#basicPageName").val(basicPage.basicPageName);
      $("#basicPageUrl").val(basicPage.basicPageUrl);
      $('.note-editable').html(basicPage.basicPageBody);
      $('.updatebtn').attr("id",basicPage._id);
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
      Meteor.call("deleteBasicPage",id,function(error,result){
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
    return this.state.basicPages.map((basicPage) =>{
      return <tr>
                <td>{basicPage.basicPageName}</td>
                <td>
                  <a href={'/createBasicPage/' +basicPage._id} onClick={this.edit.bind(this)}>
                    <i className="fa fa-pencil"></i>Edit
                  </a>
                </td>
                <td>
                  <a href="#" id={basicPage._id} onClick={this.delete.bind(this)}>
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
              <li className="active">Create Basic Page</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Create Basic Page
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
                      <button type="button" className="btn btn-box-tool btn-minus" data-widget="remove">
                        <i className="fa fa-times" />
                      </button>
                    </div>
                  </div>
                  {/* /.box-header */}
                  <div className="box-body">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="notifWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                					<h1 className="reportTitleName">CREATE BASIC PAGE</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Page Name<span className="astrick">*</span>:</label>
                								        <input type="text" ref="basicPageName" id="basicPageName" name="basicPageName" value={this.state.basicPageName}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow subjectRow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group subjectDiv">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Page Url<span className="astrick">*</span>:</label>
                								        <input type="text" ref="basicPageUrl" id="basicPageUrl" name="basicPageUrl" value={this.state.basicPageUrl} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Page Body<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="basicPageBody"
                                                        ref = "basicPageBody"
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

        </div>
        {/* /.content-wrapper */}
      </div>

    );
  }
}
EditPageContainer = createContainer( props => {

    const postHandle = Meteor.subscribe('basicPages');
	  // var editBasicPages   = FlowRouter.getParam("id");
    // console.log("Param" +editBasicPages);
    const basicPages = BasicPages.find().fetch()|| {};
    // console.log(basicPages);
    const loading = !postHandle.ready();

    return {
        loading,
        basicPages,
    };
}, CreateBasicPage);

export default EditPageContainer;
