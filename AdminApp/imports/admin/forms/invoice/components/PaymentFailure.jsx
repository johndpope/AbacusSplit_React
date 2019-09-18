import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';

export default class PaymentFailure extends TrackerReact(Component) {

	constructor(props) {
	super(props);
	}
	render() {
       return (
       		<div>
		        <div className="content-wrapper">
		            <section className="content viewContent">
		                <div className="row">
		                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                		<div className="box">
		                 			<div className="box-header with-border boxMinHeight">
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noCertificateMsg">Oops! Something went wrong during payment<a href="/Student/Profiles" className="buypckg">&nbsp;Click Here</a> to go to previous page</div>
							       	</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>					

	    );

	} 

}

 
