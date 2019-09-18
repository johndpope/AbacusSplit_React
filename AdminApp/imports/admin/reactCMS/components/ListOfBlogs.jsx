import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {BlogPages} from '../api/BlogPages';
import {TempBlogImages} from '../api/BlogPages';
import { createContainer } from 'meteor/react-meteor-data';
import YoutubeEmbedVideo from "youtube-embed-video";
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

const getVideoId = require('get-video-id');

export default class ListOfBlogs extends TrackerReact(Component) {
	constructor(props) {
    super(props); 
    this.state = {
    	blogPages       : [],
      "subscription"  : {
        "blogPages" : Meteor.subscribe("blogPages"),
        "projectSettingsPublish" : Meteor.subscribe("projectSettingsPublish"),
        "tempBlogImages" : Meteor.subscribe("tempBlogImages"),
      }  
    }; 
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
  componentWillUnmount(){
    $("script[src='/js/adminLte.js']").remove(); 
     // $("link[href='/css/dashboard.css']").remove(); 
    if(this.blogPageTracker){
      this.blogPageTracker.stop();
    }
    if(this.tempBlogImageTracker){
      this.tempBlogImageTracker.stop();
    }
  }
  renderTableRow(){
    return this.state.blogPages.map((blogPages,index) =>{
      var text= blogPages.blogPageBody;
      var regex = new RegExp("</p><p>", 'g');
      text = text.replace(regex, '\n');
      var strippedText = $("<div/>").html(text).text();

      return <tr key={index}>
              <td> {blogPages.blogPageName} </td>
              <td> {strippedText} </td> 
              <td>
                { blogPages.blogMediaType ==  "youTubeVideo" ?
                  <YoutubeEmbedVideo suggestions={false}  width={120} height={120} controls videoId={getVideoId(blogPages.youTubeVideoLink).id} suggestions={false} />
                 : 
                  blogPages.blogMediaType ==  "localImage" ?
                  <img src={blogPages.blogImageFile} className="img-responsive serviceLogo" />

                 : <video width="120" height="120" controls className="">
                     <source src={blogPages.blogLocalVideo} type="video/mp4" />
                  </video>   
                }
                </td>
              <td>
                <a href={'/admin/EditBlog/'+blogPages._id} className="editButton" title="Edit">
                  <i className = "fa fa-pencil"> </i>
                </a>
             
                <a href="#" id={blogPages._id} onClick={this.delete.bind(this)} className="deleteButton" title="Delete">
                  <i className="fa fa-trash-o"></i>  
                </a>
              </td>
            </tr>;
      });
  }
  
  delete(e){
    e.preventDefault();
    var id = $(e.currentTarget).attr("id");
    // var getBlogPages = BlogPages.findOne({"_id": id});
    // if (getBlogPages) {
      // var getblogImage = getBlogPages.blogImage;
      swal({
        title: "Are you sure?",
        text: "You want to delete this blog!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false,
        html: false
      }, function(){
        Meteor.call("deleteBlogPage",id,function(error,result){
            if(error){
                console.log(error.reason);
            }else{
                // Bert.alert("Successfully Deleted..!!");
                swal("Done","Your page has been deleted!.", "success");
            }
        });
      });
    // }
  }
  
  render() {
   return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1> Blog Management </h1>
        <ol className="breadcrumb">
          <li>
            <a href="#"><i className="fa fa-files-o"/> Blog Management</a></li>
          <li className="active">List Of Blogs</li>
        </ol>
      </section>
       <section className="content">
         <div className="row">
           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
             <div className="box box-primary">
                <div className="box-header with-border">
                 <h2 className="box-title">List Of Blogs</h2>  
                </div>
                <div className="box-body">  
                  <div className="dataTable tableBasicPage col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <table className="display table table-bordered servicesTable" width="100%" cellSpacing="0">
                      <thead>
                          <tr>
                              <th>Blog Page</th>
                              <th>Blog Description</th>
                              <th>Video/Image</th>
                              <th>Actions</th>
                          </tr>
                      </thead>
                       
                      <tbody>
                        {this.renderTableRow()}
                      </tbody>
                    </table>
                  </div>
                </div>
             </div>
            </div>
         </div>
       </section>
    </div>
    );
  } 
}