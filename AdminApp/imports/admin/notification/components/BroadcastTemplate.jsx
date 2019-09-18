import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {createContainer} from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { NotificationTemplate } from '../api/NotificationTemplate.js';

export default class BroadcastTemplate extends TrackerReact(Component) {

	componentDidMount(){

		renderFunction();

		$(document).ready(function() {

		  $('#sendmessageContent').summernote({
	        height: 190,
	        maxHeight:190,
	        minHeight:175,
	    	});
		});		

	}

	constructor() {
	  super();
	  this.state = {
	    subscription: {
	      "userfunction": Meteor.subscribe("userfunction")
	    }
	  }
	}

	sendTemplate(event){
		event.preventDefault();
		var templateType     = this.refs.templateType.value;
		var subject          = this.refs.subject.value;
		var body             = $('#sendmessageContent').summernote('code');
		var toVar            = $('.sendTo').val();
		var fromuser  = 'support@spotyl.com';
		var splitTo = toVar.split(',');
		for(i=0 ; i<splitTo.length ; i++){
			var to = splitTo[i];
			if(templateType == 'Email'){
				Meteor.call('sendEmailnNotification',to , fromuser, subject ,body);
			}else if(templateType == 'SMS'){
				Meteor.call('sendSMS',to,body);
			}else{
				Meteor.call('insertNotification',"","",to,body);
			}
		}//i	
		
		$('.sendTo').val('');
		$('.subject').val('');
		$('#sendmessageContent').val('');
		

        
	}


	selectType(event){
		event.preventDefault();
		if(this.refs.templateType.value  == 'Notification'){
			$('.subjectRow').css({'display':'none'});
			var userData = Meteor.users.find({}).fetch();
			var idArray = [];
			if(userData){
				for(var i=0 ; i<userData.length ; i++){
					var id = userData[i]._id;
					idArray.push(id);
					var value = idArray.join();
					$('.sendTo').val(value);
				}//i
			}//userData

		}else if(this.refs.templateType.value  == 'SMS'){
			$('.subjectRow').css({'display':'none'});
			var userData = Meteor.users.find({}).fetch();
			var numberArray = [];
			if(userData){
				for(var i=0 ; i<userData.length ; i++){
					if(userData[i].profile){
						var mobileno = userData[i].profile.mobNumber;
						numberArray.push(mobileno);
						var value = numberArray.join();
						$('.sendTo').val(value);
					}
				}//i
			}//userData
		}else{
			$('.subjectRow').css({'display':'block'});
			var userData = Meteor.users.find({}).fetch();
			var emailArray = [];
			if(userData){
				for(var i=0 ; i<userData.length ; i++){
					var email = userData[i].emails[0].address;
					emailArray.push(email);
					var value = emailArray.join();
					$('.sendTo').val(value);
				}//i
			}//userData
		}

	}

	render(){
     return(

		<section className="NotificationContent">
        <div className="row">
          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
            <div className="box box-primary">
	            <div className="box-header with-border">
	            <h3 className="box-title">BROADCAST TEMPLATE</h3>
	            </div>
					<div className="box-body">
						<form className="newTemplateForm">
							<div className="row">
								<div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
									<div className="form-group">
									 <label className="col-lg-6 label-category">Template Type<span className="astrick">*</span>:</label>     						
								        <select className="form-control templateType" name="templateType" ref="templateType" onChange={this.selectType.bind(this)}>
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
									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Send To<span className="astrick">*</span>:</label>     						
								        <input type="text" ref="sendTo" name="sendTo" className="sendTo col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
									</div>	
								</div>
							</div>
							<div className="row inputrow subjectRow">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="form-group subjectDiv">
									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Subject<span className="astrick">*</span>:</label>     						
								        <input type="text" ref="subject" name="subject" className="subject col-lg-12 col-md-12 col-sm-12 col-xs-12 inputValid" />
									</div>	
								</div>
							</div>
							<div className="row inputrow">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="form-group">
									 <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 label-category">Message<span className="astrick">*</span>:</label> 
									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding"> 
									 	<div id="sendmessageContent" name="content"></div>  
									 </div> 						
									</div>	
								</div>
							</div>
							<div className="savetemp col-lg-12 col-md-12 col-sm-12 col-xs-12"> 
								<button onClick={this.sendTemplate.bind(this)} type="submit" className="col-lg-2 col-md-3 col-sm-6 col-xs-12 btn btn-primary pull-right sendtxtmsgbtn">Send</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
		</section>

     	);
    }
}

