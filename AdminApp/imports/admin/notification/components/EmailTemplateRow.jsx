import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';



export default class EmailTemplateRow extends TrackerReact(Component){

	deleteEmailTemplate(event){
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

			var text= this.props.emailtemplateValues.content;
			var regex = new RegExp("</p><p>", 'g');
			text = text.replace(regex, '\n');
			var strippedText = $("<div/>").html(text).text();
			// var getId = this.props.emailtemplateValues._id;
	       return (
	    <div className="contentBox">
	      <div className="pull-right actionBtn">
					<span className="col-xs-2 editTemp"><a href={`/admin/createTemplate/${this.props.emailtemplateValues._id}`}><i className="fa fa-pencil" aria-hidden="true" id={this.props.emailtemplateValues._id}></i></a></span>
					<span onClick={this.deleteEmailTemplate.bind(this)} className="col-xs-2"><i className="fa fa-trash" aria-hidden="true" id={this.props.emailtemplateValues._id}></i></span>
				</div>
				<div className="row inputrow">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						<div className="form-group">
						 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Subject<span className="astrick">*</span>:</label>     						
					        <input type="text" ref="subject" name="subject" className="subject noBorderBox col-lg-12 col-md-12 col-sm-12 col-xs-12" value={this.props.emailtemplateValues.subject} />
						</div>	
					</div>
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