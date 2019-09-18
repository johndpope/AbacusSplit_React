import React, { Component }       from 'react';
import { render } 				  from 'react-dom';
import { FlowRouter }   		  from 'meteor/ostrio:flow-router-extra';
import {withTracker} 			  from 'meteor/react-meteor-data';
import TrackerReact 			  from 'meteor/ultimatejs:tracker-react';
// import CKEditor 				  from "react-ckeditor-component";
import { NotificationMaster }   from '/imports/admin/notification/apiNotificationMaster.js';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import  renderHTML from 'react-render-html';
import  { Quill, Mixin, Toolbar } from 'react-quill'; 

class NotificationManagement extends TrackerReact(Component){

	constructor(props){
		super(props);
		this.state = {
	    
	    subject         : '',
	    content         : '',
	  
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

	deleteEmailTemplate(event){
		event.preventDefault();
		var tempId = $(event.target).attr('id');
		// console.log('tempId: ',tempId);
		Meteor.call('removeTemplate',tempId,function(error,result){
			if(error){
				console.log(error);
			}else{
			   swal({
	                title: 'Deleted successfully!',
	                text: "",
	                type: 'success',
	                showCancelButton: false,
	                confirmButtonColor: '#666',
	                confirmButtonText: 'Ok'});
			}
		})
	}

	submitTemplate(event){
		event.preventDefault();
		var subject          = this.state.subject;		
    	var cketext          = this.state.content;    
    	// var cketext          = result;
		Meteor.call('insertnotification',subject,cketext,function(error,result){
        	if(error){
        		console.log(error.reason);
        	}else{
        		swal({
		                title: 'Added successfully!',
		                text: "",
		                type: 'success',
		                showCancelButton: false,
		                confirmButtonColor: '#666',
		                confirmButtonText: 'Ok'});
        		
        	}
        });				
		this.state.subject = "";
		this.state.content ="";
	}
        
	ComponentDidMount(){}
	
	
	updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }
   //  onChange(evt){
     
   //    var newContent = evt.editor.getData();      
     
	  // result = newContent;     
   //  }
    quillText(e){
    	this.setState({
    		content:e
    	})    	
    }

	render() {
		return (
			<div className="content-wrapper">
              	<section className="content-header">
                	<h1 className="stud">Notification</h1>
              	</section>
				<section className="content viewContent">              
                  	<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
	                    <div className="box">
			                <div className="box-header with-border boxMinHeight">
			                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 maincontaintnotification">
								        <form className="newTemplateForm" >
								
											<div className="">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 maincontaintnotification">
													<div className="form-group">
													 <label className="">Subject<span className="astrick">*</span>:</label>     						
	                   		 							<input type="text" name="subject" ref="subject" value={this.state.subject} onChange={this.handleChange}  className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" title="Enter Subject" autoComplete="off" required/>
												    </div>	
												</div>
											</div>
											<div className="row rowPadding">
												<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
													<div className="form-group">
													 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label> 
													 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
{/*														 <CKEditor activeClass="p15" id="editor" name="content"  className="templateName"  content={this.state.content} events={{"change": this.onChange}} title="Enter message" required />
*/}													 	<ReactQuill modules={App} formats={AppFormat} value={this.state.content} onChange={this.quillText.bind(this)} />

													</div> 						
													</div>	
												</div>
											</div>
										</form>
						      		</div>										    
									<div className="col-lg-4 col-lg-offset-8 col-md-6 col-sm-6 col-xs-6">
                    					<button type="submit"  className="btn pull-right col-lg-4 col-md-3 col-sm-6 col-xs-12" onClick={this.submitTemplate.bind(this)}>Submit</button>
						   			</div>
						   		</div>
						</div>
					</div>				
              	</section>
			</div>
		    );
	} 

}

var App={
	toolbar:[
		[{"header":'1'},{"header":'2'},{"font":[]},{ 'color': [] }, { 'background': [] }],
		[{"size":[]}],
		['bold','italic','underline','strike','blockquote'],
		[{'list':'ordered'},{"list":'bullet'}],
		["link"
		// "image","video"
		],
		["clean"],
	]
};

var AppFormat=[
	'header','color','font','background','size','bold','italic','underline','strike','blockquote','list','bullet','link',
	// 'image','video',
	'code-block'
]
export default withTracker((props)=>{
	const emailNot 		 = props.emailNot;
    const postHandle = Meteor.subscribe('NotificationMaster');
    const post       = NotificationMaster.find({}).fetch();
    const loading    = !postHandle.ready();
    
    return {
      loading,
      post,     
    };
}) (NotificationManagement);