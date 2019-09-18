import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import { NotificationTemplate } from '../api/NotificationTemplate.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


class CreateTemplate extends TrackerReact(Component) {
   

	componentDidMount(){
		// renderFunction();
    $("html,body").scrollTop(0);
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
     var adminLte = document.createElement("script");  
     adminLte.type="text/javascript";  
     adminLte.src = "/js/adminLte.js";  
     $("body").append(adminLte);  
    }
		$(document).ready(function() {

		  // $('#messageContent').summernote({
	   //      height: 190,
	   //      maxHeight:190,
	   //      minHeight:175,
	   //  	});
		});

		var getId     = FlowRouter.getParam("id");
		if(getId){
			var notifContent = NotificationTemplate.findOne({'_id':getId});
			if(notifContent){
				var content = notifContent.content;
				$('.note-editable').html(content);
				if(!notifContent.subject){
					$('.subjectDiv').css({'display':'none'});
				}//subject
			}//notifContent
			$('.sendtxtmsgbtn').css({'display':'none'});
			$('.updatebtn').css({'display':'block'});
			if ($(".reportTitleName").text("CREATE TEMPLATE"))
	      	{			
	        	$(".reportTitleName").html("UPDATE TEMPLATE");
	      	}
		}//getId		

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
   }
	handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    templateType    : this.props.templateType,
	    templateName    : this.props.templateName,
	    subject         : this.props.subject,
	    content         : this.props.content,
	   
	  };

	    this.handleChange = this.handleChange.bind(this);
	}

  componentWillReceiveProps(nextProps) {
      this.setState({
          templateType     : nextProps.post.templateType,
          templateName     : nextProps.post.templateName,
          subject      	   : nextProps.post.subject,
          content   		   : nextProps.post.content,     
      })

      this.handleChange = this.handleChange.bind(this);
      /*this.handleSubmit = this.handleSubmit.bind(this);*/
    }

	submitTemplate(event){
		event.preventDefault();
		var templateType     = this.refs.templateType.value;
		var templateName     = this.refs.templateName.value;
		var subject          = this.refs.subject.value;
		// var emailContent     = $('#messageContent').summernote('code');
    var emailContent     = this.refs.content.value;

		var NotificationData = NotificationTemplate.findOne({'templateType':templateType,'templateName':templateName});
		if(NotificationData){
			swal("Template Name Already Exist");
		}else if(templateType == 'Notification' || templateType == 'SMS'){
			if(templateName.length == 0){
				swal("Please fill in all the required fields");
			}else{
				Meteor.call('insertTemplate',templateType,templateName,emailContent,function(error,result){
		        	if(error){
		        		console.log(error.reason);
		        	}else{
		        		swal("Successfully Inserted..!!");
		        	}
		        });	
			}

	        this.refs.templateName.value  = '';
	        this.refs.content.value  = '';

	        // $('#messageContent').summernote('code','');
		}else{
			if(templateName.length == 0 || subject.length == 0){
				swal("Please fill in all the required fields");
			}else{
				Meteor.call('insertNewTemplate',templateType,templateName,subject,emailContent,function(error,result){
		        	if(error){
		        		console.log(error.reason);
		        	}else{
		        		swal("Successfully Inserted..!!");
		        	}
		        });	
			}

	        this.refs.templateName.value  = '';
	        this.refs.subject.value       = '';
	        this.refs.content.value  = '';

	        // $('#messageContent').summernote('code','');
		}

        
	}

	updateTemplate(event){
		event.preventDefault();
		// var id = FlowRouter.getParam("id");
		var id               = FlowRouter.getParam("id");
		console.log("id",id);
		var templateType     = this.refs.templateType.value;
		var templateName     = this.refs.templateName.value;
		var subject          = this.refs.subject.value;
		// var emailContent     = $('#messageContent').summernote('code');
		var emailContent     = this.refs.content.value;

		if(templateType == 'Notification' || templateType == 'SMS'){
			console.log("in if");
			Meteor.call('updateTemplate',id,templateName,emailContent,function(error,result){
	        	if(error){
	        		console.log(error.reason);
	        	}else{
	        		swal("Updated Successfully..!!");
	        		var path = "/admin/ViewTemplates";
               FlowRouter.go(path);
	        	}
	        });	

	        this.refs.templateName.value  = '';
	        this.refs.content.value  = '';
	        // $('#messageContent').summernote('code','');
		}else{
			console.log("in else");
			Meteor.call('updateNewTemplate',id,templateName,subject,emailContent,function(error,result){
	        	if(error){
	        		console.log(error.reason);
	        	}else{
	        		swal("Updated Successfully..!!");
	        		var path = "/admin/ViewTemplates";
                FlowRouter.go(path);
	        	}
	        });	

	        this.refs.templateName.value  = '';
	        this.refs.subject.value       = '';
	        this.refs.content.value  = '';
	        // $('#messageContent').summernote('code','');
		}
		// FlowRouter.go('/viewAllTemplates');
		
	}

	selectType(event){
		event.preventDefault();
		// const target = event.target;
	 //  const name   = target.name;
	 //  this.setState({
	 //  	[name]: event.target.value,
	 //  });
		if(this.refs.templateType.value  == 'Notification' || this.refs.templateType.value  == 'SMS' ){
			$('.subjectRow').css({'display':'none'});
		}else if(this.refs.templateType.value  == 'Email'){
			$('.subjectRow').css({'display':'block'});
		}
	}

	render(){
     return(
    <div className="content-wrapper">
      <section className="content NotificationContent">
        <div className="row">
          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
            <div className="box box-primary">
	            <div className="box-header with-border">
	            <h3 className="box-title">CREATE TEMPLATE</h3>
	            </div>
					<div className="box-body">
						<form className="newTemplateForm">
							<div className="row">
								<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<div className="form-group">
									 <label className="col-lg-6 label-category">Template Type<span className="astrick">*</span>:</label>     						
								        <select className="form-control templateType" name="templateType" ref="templateType" onChange={this.selectType.bind(this)} value={this.state.templateType}>
								      	<option> -- Select --</option>
													<option> Email </option>
													<option> Notification </option>
													<option> SMS </option>
								       </select> 
    						
									</div>	
								</div>
							</div>
							<div className="row inputrow">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="form-group">
									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Template Name<span className="astrick">*</span>:</label>     						
								        <input type="text" ref="templateName" name="templateName" value={this.state.templateName} onChange={this.handleChange} className="templateName col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid " required />
									</div>	
								</div>
							</div>
							<div className="row inputrow subjectRow">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="form-group subjectDiv">
									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Subject<span className="astrick">*</span>:</label>     						
								        <input type="text" ref="subject" name="subject" value={this.state.subject} onChange={this.handleChange} className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required/>
									</div>	
								</div>
							</div>
							<div className="row inputrow">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="form-group">
									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label> 
									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"> 
									 	{/*<div id="messageContent" name="content" onChange={this.handleChange}></div>*/}  
									 	<textarea name="content" ref="content" value={this.state.content}  className="templateName  col-lg-12 col-md-12 col-sm-12 col-xs-12" rows="10" onChange={this.handleChange}></textarea>
									 </div> 						
									</div>	
								</div>
							</div>
							<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
								<button onClick={this.submitTemplate.bind(this)} type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">Save Template</button>
								<button onClick={this.updateTemplate.bind(this)} type="submit" className="btn btn-primary pull-right updatebtn col-lg-2 col-md-3 col-sm-6 col-xs-12">Update Template</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		</section>
   </div>
     	);
    }
}

EditTemplate = withTracker(({params})=>{

    const postHandle = Meteor.subscribe('notificationTemplate');
    // var Id           = FlowRouter.getParam("id");
    var Id           = FlowRouter.getParams("id");
    // var Id           = params.id;
   //  if (Id) {
   //    $('.sendtxtmsgbtn').css({'display':'none'});
			// $('.updatebtn').css({'display':'block'});
   //  }
    const post       = NotificationTemplate.findOne({'_id':Id})||{};
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    }; 
})(CreateTemplate);

export default EditTemplate;

