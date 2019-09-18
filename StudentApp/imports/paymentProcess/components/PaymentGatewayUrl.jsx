import React,{Component}  from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import { withTracker } from 'meteor/react-meteor-data';

export default class PaymentGatewayUrl extends Component{

  render(){
      return(
      	<div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h1>My Invoice</h1>
          </section>
          {/* Main content */}
          <section className="content viewContent">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <div className="box">
                  <div className="box-header with-border boxMinHeight">
		        <div className="outerServiceBlock col-lg-12 col-md-12 col-sm-12 col-xs-1" >
		          <div className="servieInnerBlock col-lg-12 col-md-12 col-sm-12 col-xs-12" id="outerInvoiceBlock">
		            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" >
		            	Great 
		            	<button>Proceed</button>
		           </div>
		          </div>
		        </div>
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
