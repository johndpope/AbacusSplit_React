import React, { Component }       from 'react';
import { render } 				  from 'react-dom';
import { FlowRouter }   		  from 'meteor/ostrio:flow-router-extra';
import {withTracker} 			  from 'meteor/react-meteor-data';
import TrackerReact 			  from 'meteor/ultimatejs:tracker-react';
import CKEditor 				  from "react-ckeditor-component";
// import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import { NotificationMaster }   from '/imports/admin/notification/apiNotificationMaster.js';

class EditNotificationModal extends TrackerReact(Component){

	constructor(props){
		super(props);
		this.state = {
	   
	    subject         : '',
	    content         : '',
	   
	  };

	    this.handleChange = this.handleChange.bind(this);
	    // this.updateEmailNotification = this.updateEmailNotification.bind(this);
	}

	 componentWillReceiveProps(nextProps) {
        this.setState({
          
          "subject"        :nextProps.post.subject,
		  "content"        :nextProps.post.content,
        })
     }


	handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}

	
	updateNotification(props){

		var notifId 		 = this.props.post._id;
		
		var subject          = this.state.subject;
		var cketext          = result;
		console.log("cketext--->",cketext);	
			Meteor.call('updatenotification',notifId,templateName,cketext,function(error,result){
	        	if(error){
	        		console.log(error.reason);
	        	}else{
	        		swal({
		                title: 'Modified successfully!',
		                text: "",
		                type: 'success',
		                showCancelButton: false,
		                confirmButtonColor: '#666',
		                confirmButtonText: 'Ok'});
	        		
	        		var id = "editNotifyModal-"+notifId
	        		$('#'+id).modal('hide');
	        		
	        	}
	        });	

	}

	updateContent(newContent) {
        this.setState({
            content: newContent
        })
    }
    onChange(evt){
     
      var newContent = evt.editor.getData();      
     
	  result = newContent;     
    }

	render() {

	        return (
					<div className="modal fade modalHide" id={"editNotifyModal-"+this.props.emailNot} role="dialog">
					  	<div className="modal-dialog modal-lg" role="document">
					    	<div className="modal-content modalContent col-lg-12">
					      		<div className="modal-header notifyHeader ">
					        		<h4 className="" id="exampleModalLabel">Edit Template</h4>
							        <button type="button" className="close modalCloseBtn" data-dismiss="modal" aria-label="Close">
							          <span aria-hidden="true">&times;</span>
							        </button>
					      		</div>

					     		<div className="modal-body">
							        <form className="newTemplateForm" >
							       
										<div className="row rowPadding subjectRow">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Subject<span className="astrick">*</span>:</label>     						
											        <input type="text" ref="subject" name="subject" value={this.state.subject} onChange={this.handleChange} className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" required/>
												</div>	
											</div>
										</div>
										<div className="row rowPadding">
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<div className="form-group">
												 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label> 
												 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
												 {/*
												 */}
												 <CKEditor activeClass="p15" id="editor"  className="templateName" content={this.state.content} events={{"change": this.onChange}}/>
												 </div> 						
												</div>	
											</div>
										</div>
									</form>
					      		</div>
							    <div className="modal-footer paddingtop-down">
				       				<button type="submit"  className="btn pull-right col-lg-3 col-md-3 col-sm-6 col-xs-12 btnUpdate updateBTNModal"  onClick={this.updateNotification.bind(this)}>Update Template</button>
							   	</div>
					   		</div>
					  	</div>
					</div>

				
	
		    );


	} 

}
export default withTracker((props)=>{
	// const emailNot 		 = props.emailNot;
	// console.log('emailNot ===>',emailNot);
    const postHandle = Meteor.subscribe('NotificationMasternotes');
    const loading    = !postHandle.ready();
    const post       = NotificationMaster.find({"_id":id}).fetch();
    // console.log('post :',post);
    // console.log('post:',post);
    
    return {
      loading,
      post,     
    };
}) (EditNotificationModal);