import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class SMSTemplateRow extends TrackerReact(Component){

	getsmsTemplate(event){
		event.preventDefault();
		$('.defaultMsg').css({'display':'none'});
		$('.inputrow').css({'display':'none'});
		$('.actionBtn').css({'display':'none'});
		
		if($(window).width() > 780){
			$('.tempCategory').removeClass('tempactive');
			$(event.target).addClass('tempactive');
		}

		var id = $(event.target).attr('id');
		Session.set("smstemplateId",id);
		
		if($(window).width() < 780){
			$('.showTemplate').css({'display':'none'});
			if ($(".templateLibraryHeader").text("Hide Template Library")){			
		      $(".templateLibraryHeader").text("Expand Template Library");
		    }
		}
	}

	render() {
		
	       return (

	       		<li onClick={this.getsmsTemplate.bind(this)} className="tempCategory" id={this.props.smstemplateValues._id}>{this.props.smstemplateValues.templateName}</li>

		    );


	} 

}