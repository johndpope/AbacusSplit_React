import React, {Component} from 'react';
import {render} from 'react-dom';

import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';

	

export default class PaymentFailure extends Component{

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
  	}

  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  	
  	constructor(){
		super();
		this.state ={
	    
		}
	}

	

	render(){
		return(
		<div>
		        <div className="content-wrapper">
		            <section className="content-header">
		                <h1> Payment Failure</h1>
		            </section>
		            <section className="content viewContent">
		                <div className="row">
		                    <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                		<div className="box">
		                  			<div className="box-header with-border boxMinHeight">
					                  	<div className="box-header with-border textboxborder">
							            	<h3 className="box-title"></h3>
							            </div>

							            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 box-header box-title paymentfail">
							            	Something went wrong during payment.<br /> Your payment is failed. 
											Please <a href="/Student/Profiles">click here</a>  to try again. Or Go to<a href="/Student/Profiles">Dashboard.</a> 
							            </div>
									</div>
					  			</div>
							</div>
				  		</div>
					</section>
			  	</div>
		</div>
			
		)
	}
}
