import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

// import { Link } from 'react-router';


export default class AllNotificationTemplateRow extends TrackerReact(Component){


	deleteTemplate(event){
		event.preventDefault();
		var tempId = $(event.target).attr('id');
		Meteor.call('removeTemplate',tempId,function(error,result){
			if(error){
				console.log(error);
			}else{
			   swal('Deleted Successfully !!');
			}
		})
	}

	render() {
		
			var text= this.props.notificationtemplateValues.content;
			var regex = new RegExp("</p><p>", 'g');
			text = text.replace(regex, '\n');
			var strippedText = $("<div/>").html(text).text();
	       return (
	       		<div className="contentBox">
	       		<div className="pull-right actionBtn">
					<span className="col-xs-2 editTemp"><a href={`/admin/createTemplate/${this.props.notificationtemplateValues._id}`}><i className="fa fa-pencil" aria-hidden="true" id={this.props.notificationtemplateValues._id}></i></a></span>
					<span onClick={this.deleteTemplate.bind(this)} className="col-xs-2"><i className="fa fa-trash" aria-hidden="true" id={this.props.notificationtemplateValues._id}></i></span>
				</div>
				
				<div className="row inputrow">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="form-group">
						 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label>     						
						 <textarea className="form-control noBorderBox" rows="5" value={strippedText}></textarea>
						</div>	
					</div>
				</div>
				</div>
		    );


	} 

}