import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {QuickWalletMaster} from '/imports/admin/configuration/api/quickWalletMaster.js';

class QuikWalletSettings extends TrackerReact(Component) {

	constructor(props) {
	  super(props);
		  this.state = {
		    sandboxKey     : '',
		    sandboxSecret  : '',
		    prodKey        : '',
		    prodSecret     : '',
		    environment    : '',
		    prodAPI        : '',
		    sandboxAPI     : '',
		  };	  	
	    this.handleChange = this.handleChange.bind(this);
	}

    componentWillReceiveProps(nextProps) {
	
	if( Object.keys(nextProps.post).length != 0 ){
        this.setState({
            sandboxKey    : nextProps.post.sandboxKey,
            sandboxSecret : nextProps.post.sandboxSecret,
            prodKey       : nextProps.post.prodKey,
            prodSecret    : nextProps.post.prodSecret,
            environment   : nextProps.post.environment,
            prodAPI       : nextProps.post.prodAPI,
            sandboxAPI    : nextProps.post.sandboxAPI,
        });
    }

        this.handleChange = this.handleChange.bind(this);
    }

	handleChange(event){
	    const val = event.target.value;
	    // console.log('val: ',val);
	    var stateName = event.target.name;
	    // console.log('stateName: ',stateName);

		this.setState({
		  	[stateName] : val,
	    }); 
	}

	submit(event){
		event.preventDefault();
		var formvalues = {
							"environment"   : $("input[name='environment']:checked").val(),
						    "prodAPI"       : this.refs.prodAPI.value,
						    "sandboxAPI"    : this.refs.sandboxAPI.value,
						    "prodKey"       : this.refs.prodKey.value,
						    "prodSecret"    : this.refs.prodSecret.value,
						    "sandboxKey"    : this.refs.sandboxKey.value,
						    "sandboxSecret" : this.refs.sandboxSecret.value,
		                 }

		// console.log('formvalues: ',formvalues);
	    Meteor.call('saveQWSetting', formvalues, (error,result)=>{
	    	if(error){
	    		console.log("error"+error);
	    	}else{		
	    		swal('Quik Wallet Settings submitted successfully.');
	    	}
	    });
	}

	render() {
		       return(
						<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
	    					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 checkOutSettingWrapper">

	    						<form onSubmit={this.submit.bind(this)}>
	    						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 checkoutTitle">Please Select Quik Wallet Environment </div>
	    						<div className="col-lg-5 col-md-4 col-sm-4 col-xs-4 form-group envtSettings">
	    					   	  <input type="radio" onChange={this.handleChange.bind(this)} ref="environment" name="environment" checked={this.state.environment == 'sandbox' ? true : false } value="sandbox" required/><br/>Sandbox<br/><hr/>
	    					   	  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 envLabel">API</label>
	    					   	  <input type="text" onChange={this.handleChange.bind(this)} name="sandboxAPI" ref="sandboxAPI" value={this.state.sandboxAPI} placeholder="Sandbox API" className="form-control" required/><br/>
	    					   	   <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 envLabel">Key</label>
	    					   	  <input type="text" onChange={this.handleChange.bind(this)} name="sandboxKey" ref="sandboxKey" value={this.state.sandboxKey} placeholder="Sandbox Key" className="form-control" required/><br/>
	    					   	  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 envLabel">Secret</label>
	    					   	  <input type="text" onChange={this.handleChange.bind(this)} name="sandboxSecret" ref="sandboxSecret" value={this.state.sandboxSecret} placeholder="Sandbox Secret" className="form-control" required/><br/>
	    					   	</div>
	    						<div className="col-lg-5 col-lg-offset-1 col-lg-offset-1 col-md-4 col-sm-4 col-xs-4 form-group envtSettings">
	    					   	  <input type="radio" onChange={this.handleChange.bind(this)} ref="environment"  name="environment" checked={this.state.environment == 'production' ? true : false } value="production" required/><br/>Production<br/><hr/>
	    					   	  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 envLabel">API</label>
	    					   	  <input type="text" onChange={this.handleChange.bind(this)} name="prodAPI" ref="prodAPI" value={this.state.prodAPI} placeholder="Production API" className="form-control" required/><br/>
	    					   	  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 envLabel">Key</label>
	    					   	  <input type="text" onChange={this.handleChange.bind(this)} name="prodKey" ref="prodKey" value={this.state.prodKey} placeholder="Production Key" className="form-control" required/><br/>
	    					   	  <label className="col-lg-12 col-md-12 col-sm-12 col-xs-12 envLabel">Secret</label>
	    					   	  <input type="text" onChange={this.handleChange.bind(this)} name="prodSecret" ref="prodSecret" value={this.state.prodSecret} placeholder="Production Secret" className="form-control" required/><br/>
	    					   	</div>	    					   	
	    					   	<br/>
	    					   	<input type="submit" value="SUBMIT" className="btn btn-primary col-lg-6 col-lg-offset-3 col-md-3 col-md-offset-1 col-sm-6 col-sm-offset-1 col-xs-6 col-xs-offset-1"/>
	    					   	</form>
	    					</div>
					  </div>
			    );

	} 

}


QuikWalletSettings = withTracker(props => {

	const postHandle = Meteor.subscribe("getQWDetails");
  	const loading    = !postHandle.ready();
    const post       = QuickWalletMaster.findOne({})||{};
    
    var x = '';
	    return {
	        post
	    };  
})(QuikWalletSettings);

export default QuikWalletSettings;