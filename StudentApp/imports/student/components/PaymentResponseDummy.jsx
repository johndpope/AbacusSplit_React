import React, {Component} from 'react';
import {render} from 'react-dom';

import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import '/imports/student/api/competitionRegisterOrder.js';

class PaymentResponse extends Component{


  	constructor(){
		super();
		this.state = {
		    status      : FlowRouter.getQueryParam('status'),
		    billnumbers : FlowRouter.getQueryParam('billnumbers'),
		    checksum    : FlowRouter.getQueryParam('checksum'),
			id 			: FlowRouter.getQueryParam('id'),
		}

		


	}

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		if(FlowRouter.getQueryParam('status') == 'paid'){
			// console.log("in response");
          	Meteor.call("updateOnlineDetailsToOrder",Meteor.userId(),FlowRouter.getParam('compId'),this.state.status,this.state.id,this.state.billnumbers,
			          		(err,result)=>{
			          			// console.log("in update function");
				                if(result){

				                    console.log("payment result",result);
				                    FlowRouter.go("/payment-success/"+FlowRouter.getParam('compId'));
				              	}else{
				                    FlowRouter.go("/payment-success/"+FlowRouter.getParam('compId'));

				              	}
			        		}
        			   );
	    }else{
	    	FlowRouter.go("/payment-failure");
	    }
  	}

  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
 
	

	render(){
		return(
			<div>
			</div>
			
		)
	}
}


export default withTracker(props=>{

	  	

	return{
		'post' : 1
	}
})(PaymentResponse);