/*  
	COMPONENT:  Add Module  
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will add Modules. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import {Link} from 'react-router';
import {browserHistory } from 'react-router';
import {withTracker} from 'meteor/react-meteor-data';
import {AccessManagementMaster} from '../api/accessManagementMaster.js';

class ModuleRegistration extends Component  {

	constructor(props){
		super(props);
		this.state={
			moduleName : '',
		}
		this.handleChange = this.handleChange.bind(this);
	}

	
	componentWillReceiveProps(nextProps){
		this.setState({
			moduleName : nextProps.accessManagementData.moduleName,
		});
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
  	}

	
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

  	addModule(e){
  		e.preventDefault();
  		var moduleName = this.refs.moduleName.value.trim();
  		Meteor.call("addModuleName",moduleName,this.props.params.id,(err,res)=>{
  			if(err){
  				console.log("somthing went wrong");
  			}else{
  				console.log(res);
  				swal("Module added successfully","","success");
  				browserHistory.replace('/admin/addFacilities/'+res);
  			}
  		})
  	}

	render(){
		
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>ACCESS MANAGEMENT</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                   <div className="box-header with-border">
				            <h3 className="box-title">Add Module</h3>
				            </div>
							<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 AM-WrapMain">
								<form onSubmit={this.addModule.bind(this)}>
									<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-9">
										<span className="blocking-span"> 
											<input type="text" name="moduleName" ref="moduleName" value={this.state.moduleName} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" pattern="^([a-zA-Z][a-zA-Z0-9-\s]*)$" title="Enter Module" required/>
											<span className="floating-label">Module Name</span>					   			
										</span>
										<input type="hidden" name="_id" ref="_id" value={this.state._id}/>
									</div>
									<div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-8 col-sm-offset-2 col-xs-9 AM-btn-Wrap">
										<button type="submit" className="btn btn-primary AMF-Btn"> Submit </button>
									</div>
								</form>
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

export default AddModuleContainer = withTracker(props =>{
	var id = props.params.id;
	var postHandle = Meteor.subscribe("getSingleModule",id);
	var loading = !postHandle.ready();
	var accessManagementData = AccessManagementMaster.findOne({"_id":id})||{};
	if(accessManagementData._id){
		$('.AMF-Btn').html("Update");

	}else{
		$('.AMF-Btn').html("Submit");
	}
	return{
		accessManagementData
	} 
})(ModuleRegistration);