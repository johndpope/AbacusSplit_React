import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class TemplateRow extends TrackerReact(Component){

	getTemplate(event){
		event.preventDefault();
		$('.defaultMsg').css({'display':'none'});
		$('.inputrow').css({'display':'block'});
		$('.actionBtn').css({'display':'block'});

		if($(window).width() > 780){
			$('.tempCategory').removeClass('tempactive');
			$(event.target).addClass('tempactive');
		}

		var id = $(event.target).attr('id');
		Session.set("templateId",id);
		
		if($(window).width() < 780){
			$('.showTemplate').css({'display':'none'});
			if ($(".templateLibraryHeader").text("Hide Template Library")){			
		      $(".templateLibraryHeader").text("Expand Template Library");
		    }
		}
	}

	render() {
		console.log(this.props.templateValues._id);
	       return (
	       		<li onClick={this.getTemplate.bind(this)} className="tempCategory" id={this.props.templateValues._id}>{this.props.templateValues.templateName}</li>

		    );


	} 

}