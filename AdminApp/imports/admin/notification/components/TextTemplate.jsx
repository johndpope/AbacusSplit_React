
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { WebApp } from 'meteor/webapp';

export default class TextTemplate extends TrackerReact(Component){

	constructor(){
		super();
		this.state = {
			subscription : {
				"userfunction" : Meteor.subscribe('userfunction'),
				"notificationTemplate" : Meteor.subscribe('notificationTemplate'),
			}
		}
	}

	textClick(event){
		// event.preventDefault();


		var msgvariable = {
							'[username]' 	: 'John Doe',
		   				   	'[orderNo]' 	: '12345',
		                   	'[orderDate]'	: '06-08-2017'
		               	  };

		
		var inputObj = {
			from         : 'dXphvadmmNwPFn9bL',
            to           : 'dXphvadmmNwPFn9bL',
            templateName : 'User Registered',
            variables    : msgvariable,
        }

        sendMailNotification(inputObj); 
  
 
	}

	render(){
		return(
		<div >
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div className="form-group">
					<button onClick={this.textClick.bind(this)} className="btn btn-primary">Click</button>
				</div>	
			</div>
		</div>
		);
	}
}