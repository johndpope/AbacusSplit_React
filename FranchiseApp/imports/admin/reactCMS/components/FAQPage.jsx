import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { createContainer } from 'meteor/react-meteor-data';
import Validation from 'react-validation';
import validator from 'validator';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { FAQS } from '../api/FAQS';


class FAQPage extends TrackerReact (Component){
  constructor(props) {
	  super(props);
	  this.state = {
	    FAQQuestion    : this.props.faqs.FAQQuestion,
	    FAQAnswer    : this.props.faqs.FAQAnswer,
      id               : this.props.faqs._id,
      faqs       : [],
	  };
    this.handleChange = this.handleChange.bind(this);
	}
  componentWillReceiveProps(nextProps) {
    if(!nextProps.loading){
      if(nextProps.faqs){
         this.setState({
             FAQQuestion     : nextProps.faqs.FAQQuestion,
             FAQAnswer     : nextProps.faqs.FAQAnswer,
             id                : nextProps.faqs._id,
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
    this.FAQSTracker = Tracker.autorun( ()=> {
      Meteor.subscribe("faqs");
      const faqs = FAQS.find().fetch();
      this.setState({faqs: faqs});
    });
    // console.log(FAQ);
  }
  componentWillUnmount() {
    $("body").find("script[src='/js/adminLte.js']").remove();
    if(this.FAQSTracker)
      this.FAQSTracker.stop();
  }
  handleUpdate(e){
    e.preventDefault();
    console.log("i am in update");
    let FAQquestion      = this.refs.FAQQuestion.value;
    let FAQanswer      = $('#messageContent').summernote('code');
    let userId        = Meteor.userId();
    let lastModified  = new Date();
    let id            = e.target.getAttribute('id');
    Meteor.call('updateFAQ',id,FAQquestion,FAQanswer,userId,lastModified,function(error,result){
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
      let FAQquestion      = this.refs.FAQQuestion.value;
      let FAQanswer      = $('#messageContent').summernote('code');
      let userId        = Meteor.userId();
      let lastModified  = "";
      let FAQquestionExist = FAQS.findOne({'FAQQuestion': FAQquestion});

      if(FAQquestionExist){
          swal("Oops...!","This page name is already taken!","error");
      }else{
          Meteor.call('createFAQ',FAQquestion,FAQanswer,userId,lastModified,function(error,result){
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
    const faqs = FAQS.find({_id: FlowRouter.getParam("id")}).fetch();
    faqs.map((FAQ)=>{
      $("#FAQQuestion").val(FAQ.FAQQuestion);
      $('.note-editable').html(FAQ.FAQAnswer);
      $('.updatebtn').attr("id",FAQ._id);
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
      Meteor.call("deleteFAQ",id,function(error,result){
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
    return this.state.faqs.map((FAQ) =>{
      return <tr>
                <td>{FAQ.FAQQuestion}</td>
                <td>
                  <a href={'/managefaq/' +FAQ._id} onClick={this.edit.bind(this)}>
                    <i className="fa fa-pencil"></i>Edit
                  </a>
                </td>
                <td>
                  <a href="#" id={FAQ._id} onClick={this.delete.bind(this)}>
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
              <li className="active">FAQ Page</li>
            </ol>
          </section>
          {/* Main content */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="box">
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      FAQ
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
                					<h1 className="reportTitleName">FAQ</h1>
                					<hr/>
                					<div className="create-email-template-wrapper col-lg-12 col-md-12 col-sm-12 col-xs-12">
                						<form className="newTemplateForm">    <div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Questions<span className="astrick">*</span>:</label>
                								        <input type="text" ref="FAQQuestion" id="FAQQuestion" name="FAQQuestion" value={this.state.FAQQuestion}  onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
                									</div>
                								</div>
                							</div>
                							<div className="row inputrow">
                								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                									<div className="form-group">
                									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Answers<span className="astrick">*</span>:</label>
                									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                									 	<div id="messageContent" name="FAQAnswer"
                                                        ref = "FAQAnswer"
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
                                          <th>Question</th>
                                          <th></th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tfoot>
                                      <tr>
                                        <th>Question</th>
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

    const postHandle = Meteor.subscribe('faqs');
	  // var editFAQS   = FlowRouter.getParam("id");
    // console.log("Param" +editFAQS);
    const faqs = FAQS.find().fetch()|| {};
    console.log(faqs);
    const loading = !postHandle.ready();

    return {
        loading,
        faqs,
    };
}, FAQPage);

export default EditPageContainer;
