import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class NotificationTemplateRow extends TrackerReact(Component){

	getnotifTemplate(event){
		event.preventDefault();
		$('.defaultMsg').css({'display':'none'});
		$('.inputrow').css({'display':'block'});
		$('.actionBtn').css({'display':'block'});

		if($(window).width() > 780){
			$('.tempCategory').removeClass('tempactive');
			$(event.target).addClass('tempactive');
		}

		var id = $(event.target).attr('id');
		Session.set("notiftemplateId",id);
		
		if($(window).width() < 780){
			$('.showTemplate').css({'display':'none'});
			if ($(".templateLibraryHeader").text("Hide Template Library")){			
		      $(".templateLibraryHeader").text("Expand Template Library");
		    }
		}
	}

	render() {
		
	       return (

	       		<li onClick={this.getnotifTemplate.bind(this)} className="tempCategory" id={this.props.templateValues._id}>{this.props.templateValues.templateName}</li>

		    );


	} 

}