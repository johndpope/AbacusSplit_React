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
import { About } from '../api/aboutus.js';


class AboutUs extends TrackerReact (Component){
   constructor(props) {
    super(props);
    if(!this.props.loading){
      // console.log(Object.keys(this.props.about).length);
      // console.log('in post');
      this.state = {
        // aboutTitle      : this.props.about.aboutTitle,
        // aboutSubTitle   : this.props.about.aboutSubTitle,
        // aboutContent    : this.props.about.aboutContent,
        // aboutOwner      : this.props.about.aboutOwner,
        // aboutVisionOne    : this.props.about.aboutVisionOne,
        // aboutVisionTwo    : this.props.about.aboutVisionTwo,
        // aboutVisionThree  : this.props.about.aboutVisionThree,
        // basicPageUrl     : this.props.about.basicPageUrl,
        // basicPageBody    : this.props.about.basicPageBody,
        // id               : this.props.about._id,
        about       : [],
      };
    }else{
      // console.log('in no post');
      this.state = {
        // aboutTitle      : '',
        // aboutSubTitle   : '',
        // aboutContent    : '',
        // aboutOwner      : '',
        // aboutVisionOne    : '',
        // aboutVisionTwo    : '',
        // aboutVisionThree  : '',
        // basicPageUrl     : '',
        // basicPageBody    : '',
        // id               : '',
        about       : [],
      };
    }

    this.handleChange = this.handleChange.bind(this);
    // console.log("id " + this.state.id);
    // console.log("basicPageName " + this.state.aboutTitle);
  }
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      // if(nextProps.about){
        // console.log('in post');
         this.setState({
             // aboutTitle         : nextProps.about.aboutTitle,
             // aboutSubTitle      : nextProps.about.aboutSubTitle,
             // aboutContent       : nextProps.about.aboutContent,
             // aboutOwner         : nextProps.about.aboutOwner,
             // aboutVisionOne     : nextProps.about.aboutVisionOne,
             // aboutVisionTwo     : nextProps.about.aboutVisionTwo,
             // aboutVisionThree   : nextProps.about.aboutVisionThree,
             // basicPageUrl       : nextProps.about.basicPageUrl,
             // basicPageBody      : nextProps.about.basicPageBody,
             // id                 : nextProps.about._id,
             about              : nextProps.about,
         });
      // }
    }else{
      // console.log('in no post');
      this.state = {
        // aboutTitle      : '',
        // aboutSubTitle   : '',
        // aboutContent    : '',
        // aboutOwner      : '',
        // aboutVisionOne    : '',
        // aboutVisionTwo    : '',
        // aboutVisionThree    : '',
        // basicPageUrl     : '',
        // basicPageBody    : '',
        // id               : '',
        about       : [],
      };
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
      // console.log("I am appended!");
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
    this.basicPageTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("about");
      const about = About.find().fetch();
      this.setState({about: about});
    });
    // console.log(about);
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    if(this.basicPageTracker)
      this.basicPageTracker.stop();
  }
  handleUpdate(e){
    e.preventDefault();
    // console.log("i am in update");
    let title         = this.refs.aboutTitle.value;
    let subtitle      = this.refs.aboutSubTitle.value;
    let content       = this.refs.aboutContent.value;
    let owner         = this.refs.aboutOwner.value;
    let visionOne     = this.refs.aboutVisionOne.value;
    let visionTwo     = this.refs.aboutVisionTwo.value;
    let visionThree   = this.refs.aboutVisionThree.value;
    let visionFour   = this.refs.aboutVisionFour.value;
    let pageUrl       = this.refs.basicPageUrl.value;
    let pageBody      = $('#messageContent').summernote('code');
    let userId        = Meteor.userId();
    let lastModified  = new Date();
    let id            = e.target.getAttribute('id');
    // console.log(pageBody + pageUrl + title);
    Meteor.call('updateAbout',id,title,subtitle,content,owner,visionOne,visionTwo,visionThree,visionFour,pageUrl,pageBody,userId,lastModified,function(error,result){
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
      let title         = this.refs.aboutTitle.value;
      let subtitle      = this.refs.aboutSubTitle.value;
      let content      = this.refs.aboutContent.value;
      let owner      = this.refs.aboutOwner.value;
      let visionOne      = this.refs.aboutVisionOne.value;
      let visionTwo      = this.refs.aboutVisionTwo.value;
      let visionThree      = this.refs.aboutVisionThree.value;
      let visionFour      = this.refs.aboutVisionFour.value;
      let pageUrl       = this.refs.basicPageUrl.value;
      let pageBody      = $('#messageContent').summernote('code');
      let userId        = Meteor.userId();
      let lastModified  = "";
      let pageNameExist = About.findOne({'aboutSubTitle': subtitle});
      let pageUrlExist  = About.findOne({'basicPageUrl': pageUrl});

      if(pageNameExist){
          swal("Oops...!","This page name is already taken!","error");
      }else if(pageUrlExist){
          swal("Oops...!","This page url is already taken!","error");
      }else{
        // console.log('createAbout');
          Meteor.call('createAbout',title,subtitle,content,owner,visionOne,visionTwo,visionThree,visionFour,pageUrl,pageBody,userId,lastModified,function(error,result){
              if(error){
                  console.log(error.reason);
              }else if(result){
                  Bert.alert("Successfully Inserted..!!");
              }
          });

      swal("Done",
      "Your page has been Created!.",
      "success");
      }

        $(".newTemplateForm").css({display:'none'});
  }
  edit(e){
    e.preventDefault();
    const about = About.find({_id: FlowRouter.getParam("id")});
    about.map((about)=>{
      $("#aboutTitle").val(about.aboutTitle);
      $("#aboutSubTitle").val(about.aboutSubTitle);
      $("#aboutContent").val(about.aboutContent);
      $("#aboutOwner").val(about.aboutOwner);
      $("#aboutVisionOne").val(about.aboutVisionOne);
      $("#aboutVisionTwo").val(about.aboutVisionTwo);
      $("#aboutVisionThree").val(about.aboutVisionThree);
      $("#aboutVisionFour").val(about.aboutVisionFour);
      $("#basicPageUrl").val(about.basicPageUrl);
      // $('.note-editable').html(about.basicPageBody);
      $('.updatebtn').attr("id",about._id);
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
      Meteor.call("deleteAbout",id,function(error,result){
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
    return this.state.about.map((about,index) =>{
      return <tr key={index}>
                <td>{about.aboutTitle}</td>
                <td>
                  <a href={'/AboutUs/' +about._id} onClick={this.edit.bind(this)}>
                    <i className="fa fa-pencil"></i>Edit
                  </a>
                </td>
                <td>
                  <a href="#" id={about._id} onClick={this.delete.bind(this)}>
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
                      About Us
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
                          <h1 className="reportTitleName">About Us</h1>
                          <hr/>
                          <div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <form className="newTemplateForm">
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Title<span className="astrick">*</span>:</label>
                                        <input type="text" ref="aboutTitle" id="aboutTitle" name="aboutTitle" className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Sub Title<span className="astrick">*</span>:</label>
                                        <input type="text" ref="aboutSubTitle" id="aboutSubTitle" name="aboutSubTitle"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Content 1<span className="astrick">*</span>:</label>
                                        <input type="text" ref="aboutContent" id="aboutContent" name="aboutContent"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row inputrow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Content 2<span className="astrick">*</span>:</label>
                                        <input type="text" ref="aboutOwner" id="aboutOwner" name="aboutOwner"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <h3>Office</h3>
                                <div className="inputrow">
                                  <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                     <label className="col-lg-4 col-md-12 col-sm-12 col-xs-12 label-category">Office 1<span className="astrick">*</span>:</label>
                                          <input type="text" ref="aboutVisionOne" id="aboutVisionOne" name="aboutVisionOne"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                    </div>
                                  </div>
                                </div>
                                <div className="inputrow">
                                  <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                     <label className="col-lg-4 col-md-12 col-sm-12 col-xs-12 label-category">Office 2<span className="astrick">*</span>:</label>
                                          <input type="text" ref="aboutVisionTwo" id="aboutVisionTwo" name="aboutVisionTwo"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                    </div>
                                  </div>
                                </div>
                                <div className="inputrow">
                                  <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                     <label className="col-lg-4 col-md-12 col-sm-12 col-xs-12 label-category">Office 3<span className="astrick">*</span>:</label>
                                          <input type="text" ref="aboutVisionThree" id="aboutVisionThree" name="aboutVisionThree"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                    </div>
                                  </div>
                                </div>
                                <div className="inputrow">
                                  <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                     <label className="col-lg-4 col-md-12 col-sm-12 col-xs-12 label-category">Office 4<span className="astrick">*</span>:</label>
                                          <input type="text" ref="aboutVisionFour" id="aboutVisionFour" name="aboutVisionFour"  className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                                    </div>
                                  </div>
                                </div>

                              </div>

                              <div className="row inputrow subjectRow">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                  <div className="form-group subjectDiv">
                                   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Partners<span className="astrick">*</span>:</label>
                                        <input type="text" ref="basicPageUrl" id="basicPageUrl" name="basicPageUrl"  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
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
                                <button onClick={this.handleUpdate.bind(this)} type="submit" className="btn btn-primary pull-right updatebtn col-lg-2 col-md-3 col-sm-6 col-xs-12">Update Page</button>
                              </div>
                            </form>
                          </div>
                          <div className="dataTable tableBasicPage">
                              <table className="heavyTable"  className="display" width="100%" cellSpacing="0">
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

    const postHandle = Meteor.subscribe('about');
    // var editBasicPages   = this.props.match.params.id;
    // console.log("Param" +editBasicPages);
    const about = About.find().fetch()|| {};
    // console.log(about);
    const loading = !postHandle.ready();

    return {
        loading,
        about,
    };
}, AboutUs);

export default EditPageContainer;
