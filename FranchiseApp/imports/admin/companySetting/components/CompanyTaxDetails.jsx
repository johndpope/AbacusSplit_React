import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Validation from 'react-validation';
import validator from 'validator';
import { FranchiseDetails } from '../api/CompanySettingMaster.js';
import {createContainer} from 'meteor/react-meteor-data';

import CompanyTaxList from './CompanyTaxList.jsx';
import CompanySettingIndicators from './companySettingIndicators.jsx';

class CompanyTaxDetails extends TrackerReact(Component){

  componentDidMount(){
    $('.companyTaxDetails').addClass('divActive');
  }

  handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    taxType        : this.props.taxType,
	    applicableTax  : this.props.applicableTax,
	    effectiveFrom  : this.props.effectiveFrom,

	    subscription : {
	        "companyData" : Meteor.subscribe('companyData'),
	      }

	  };

	    this.handleChange = this.handleChange.bind(this);
	}

  componentWillReceiveProps(nextProps) {
    this.setState({
        taxType       : nextProps.post.taxType,
        applicableTax : nextProps.post.applicableTax,
        effectiveFrom : nextProps.post.effectiveFrom,
    })

    this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    }

  companyTaxData(){
  	var companyData = FranchiseDetails.findOne({"companyId" : 1});
  	var companyarray = [];
  	if(companyData){
  		if(companyData.taxSettings){
  			for(i=0;i<companyData.taxSettings.length;i++){
  				companyarray.push({
  					'taxType'        : companyData.taxSettings[i].taxType,
  					'applicableTax'  : companyData.taxSettings[i].applicableTax,
            'effectiveFrom'  : companyData.taxSettings[i].effectiveFrom,
  					'effectiveTo'    : companyData.taxSettings[i].effectiveTo,
  					'index'			     : i,
  					'_id'			       : companyData._id,
  				})
  			}//i
  		}
  	}//companyData
  	return companyarray;
  }

  submitCompanyTax(event){
    event.preventDefault();
    var sessionVar = Session.get('taxType');
    var targetedID = Session.get('targetedID');

    var taxSettingsFormValue ={

    	taxType       : $(".taxType").val(),
      applicableTax : $(".applicableTax").val(),
      effectiveFrom : $(".effectiveFrom").val(),

     }//close array

     if(sessionVar){
        Meteor.call('updatetaxSettings', taxSettingsFormValue,targetedID,
              function(error, result){
                if(error){
                  console.log(error);
                }else{

                  swal('Tax Detail Updated!');
                  $(".taxType").val('');
                  $(".applicableTax").val('');
                  $(".effectiveFrom").val('');
                }
              }
        );
     }else{
	    Meteor.call('insertTaxSettings', taxSettingsFormValue,
	            function(error, result){
	              if(error){
	                console.log(error);
	              }else{

	                swal('Tax Detail Added!');
	                $(".taxType").val('');
                  $(".applicableTax").val('');
                  $(".effectiveFrom").val('');
	              }
	            }
	    );
     }
  }

  render(){

  	return(

  		<section className="NotificationContent">
        <div className="row">
          <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 ">
            <div className="box box-default">
            <div className="box-header with-border">
            <h3 className="box-title">Tax Settings</h3>
            </div>

            <div className="box-body">
            <form id="companyTaxForm" className="companyTaxForm">
              <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <div className="input-group">
                 <span className="input-group-addon ipAddons"><i className="fa fa-usd" aria-hidden="true"></i></span>
                 <input value={this.state.taxType} onChange={this.handleChange} type="text" placeholder="Enter Tax Type" name="taxType" className="form-control taxType inputValid" required/>
                </div>
              </div>

              <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <div className="input-group">
                  <span className="input-group-addon ipAddons"><i className="fa fa-money" aria-hidden="true"></i></span>
                  <input value={this.state.applicableTax} onChange={this.handleChange} type="number" placeholder="Enter Tax Rate(%)" name="applicableTax" className="form-control applicableTax inputValid" required />
                </div>
              </div>

               <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <div className="input-group">
    	             <span className="input-group-addon ipAddons"><i className="fa fa-calendar" aria-hidden="true"></i></span>
                   <input value={this.state.effectiveFrom} onChange={this.handleChange} type="date"  name="effectiveFrom" className="form-control effectiveFrom inputValid" required/>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right companyTaxSubmit marginBottomDiv" onClick={this.submitCompanyTax.bind(this)}>Submit</button>
              </div>
            </form>
            </div>
            </div>
          </div>
  		  </div>

  		  <div className="table-responsive">
    			<table className="table table-bordered table-striped table-hover">
    				<thead>
    					<tr className="tableHeader">
    						<th> Tax Type </th>
    						<th> Applicable Tax </th>
                <th> Effective From </th>
    						<th> Effective To </th>
    						<th> Action </th>
    					</tr>
    				</thead>
    				<tbody>
    					{ this.companyTaxData().map( (taxData)=>{
    						return <CompanyTaxList key={taxData.index} companyTaxDataVales={taxData}/>
    					  })
    					}
    				</tbody>
    			</table>
    		</div>



		    {/*<div className="emptyDiv"></div>*/}
      </section>

  		);
  }

 }

 EditCompanyTaxDetails = createContainer((props)=>{

    const postHandle = Meteor.subscribe('companyData');
    const post       = FranchiseDetails.findOne({})||{};
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    };
}, CompanyTaxDetails);

export default EditCompanyTaxDetails;
