import React, { Component }     from 'react';
import { render }               from 'react-dom';
import TrackerReact             from 'meteor/ultimatejs:tracker-react';
import {withTracker}            from 'meteor/react-meteor-data';
import Validation               from 'react-validation';
import validator                from 'validator';
import { FranchiseDetails }      from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import {createContainer}        from 'meteor/react-meteor-data';
// import {HSN} from '../../masterData/api/addHsn.js/imports/admin/companySetting/api';

import CompanyTaxList           from '/imports/admin/companySetting/components/Company_bank_details/CompanyTaxList.jsx';
import CompanySettingIndicators from '/imports/admin/companySetting/components/CompanyInformation_setting/companySettingIndicators.jsx';

class CompanyTaxDetails extends Component{

  componentDidMount(){
    $('.companyTaxDetails').addClass('divActive');
    if (!$("#adminLte").length>0 && !$('body').hasClass('adminLte')) {
        // console.log("I am appended!");
        var adminLte = document.createElement("script");
        adminLte.type = "text/javascript";
        adminLte.src = "/js/adminLte.js";
        adminLte.setAttribute('id','adminLte');
        $("body").append(adminLte);
      }

  }

  handleChange(event){
	  const target = event.target;
	  const name   = target.name;
	  this.setState({
	  	[name]: event.target.value,
	  });
	}

	constructor(props) {
    // console.log("props",props);
	  super(props);
    if(props){
      this.state = {
        taxType        : '',
        hsn            : '',
        sgst           : '',
        cgst           : '',
        igst           : '',
        effectiveFrom  : '',

        subscription : {
            "companyData" : Meteor.subscribe('companyData'),
          }
      }
    }
	 this.handleChange = this.handleChange.bind(this);
	}

  componentWillReceiveProps(nextProps) {
    if(nextProps){
      this.setState({
        taxType       : nextProps.taxDetails.taxType,
        hsn           : nextProps.taxDetails.hsn,
        sgst          : nextProps.taxDetails.sgst,
        cgst          : nextProps.taxDetails.cgst,
        igst          : nextProps.taxDetails.igst,
        effectiveFrom : nextProps.taxDetails.effectiveFrom,
      })
    }
    this.handleChange = this.handleChange.bind(this);

    }

  companyTaxData(){
  	var companyData = FranchiseDetails.findOne({"companyId" : 1});
  	var companyarray = [];
  	if(companyData){
  		if(companyData.taxSettings){
  			for(i=0;i<companyData.taxSettings.length;i++){
  				companyarray.push({
  					'taxType'        : companyData.taxSettings[i].taxType,
            'hsn'            : companyData.taxSettings[i].hsn,
            'sgst'           : companyData.taxSettings[i].sgst,
            'cgst'           : companyData.taxSettings[i].cgst,
            'igst'           : companyData.taxSettings[i].igst,
            'effectiveFrom'  : companyData.taxSettings[i].effectiveFrom,
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
      hsn           : $(".hsn").val(),
      sgst          : $(".sgst").val(),
      cgst          : $(".cgst").val(),
      igst          : $(".igst").val(),
      effectiveFrom : $(".effectiveFrom").val(),

    }//close array

    // if($('#companyTaxForm').valid()){
      if(taxSettingsFormValue.taxType && taxSettingsFormValue.effectiveFrom && taxSettingsFormValue.sgst>0 && taxSettingsFormValue.cgst>0 && taxSettingsFormValue.igst>0){
      if(sessionVar){
        Meteor.call('updatetaxSettings', taxSettingsFormValue,targetedID,
          function(error, result){
            if(error){
              console.log(error);
              swal('Tax details not added successfuly', 'Please try again!', 'error');
            }else{
              swal('Tax Detail Updated!');
              $(".taxType").val('');
              $(".hsn").val('0');
              $(".sgst").val('');
              $(".cgst").val('');
              $(".igst").val('');
              $(".effectiveFrom").val('');
            }
          }
        );
       }else{
  	    Meteor.call('insertTaxSettings', taxSettingsFormValue,
          function(error, result){
            if(error){
              console.log(error);
              swal('Tax details not added successfuly', 'Please try again!', 'error');
            }else{
              swal('Tax Detail Added!');
              $(".taxType").val('');
              $(".hsn").val('0');
              $(".sgst").val('');
              $(".cgst").val('');
              $(".igst").val('');
              $(".effectiveFrom").val('');
            }
          }
  	    );
      }
    }else{
      swal("Either you have not filled all the values or selected percentage is less than zero","Please fill all the values correctly","error");
    }
    // }else{
    //   $(event.target).parent().parent().find('input.error').addClass('companyError');
    //   $(event.target).parent().parent().find('select.error').addClass('companyError');
    // }
  }
  selectHSN(event){
    event.preventDefault();
    var value = $(event.target).attr('value');
    var hsnObj = HSN.findOne({'hsn':value});
    if(hsnObj){
      this.setState({
        "sgst": hsnObj.sgst,
        "cgst": hsnObj.cgst,
        "igst": hsnObj.igst,
      });
    }
  }

  render(){

  	return(

  		<section className="NotificationContent">
        <div className="row">
          <div className="col-lg-11 col-lg-offset-0 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 ">
            <div className="box box-default companysettingbox">
            <div className="box-header with-border">
            <h3 className="box-title1">Tax Settings</h3>
            </div>
            <div className="box-body tablebdy">
            <form id="companyTaxForm" className="companyTaxForm">
              <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
              <label>GST Number</label>
                <div className="input-group" id="taxTypeID">
                 <span className="input-group-addon ipAddons"><i className="fa fa-inr facompanyinfo" aria-hidden="true"></i></span>
                 <input value={this.state.taxType} onChange={this.handleChange} type="text" pattern="[0-9A-Za-z]" placeholder="Enter GST Number*" name="taxType" className="form-control taxType inputValid required" />
                </div>
              </div>
              {/*<div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <div className="input-group">
                 <span className="input-group-addon ipAddons"><i className="fa fa-info facompanyinfo" aria-hidden="true"></i></span>
                 <select value={this.state.hsn} onChange={this.handleChange} className="form-control inputValid hsn required" onClick={this.selectHSN.bind(this)}>
                  <option value="0" disabled="disabled" selected="true">-- Select --</option>
                    { 
                      this.props.hsnData.length > 0 ? 
                        this.props.hsnData.map((language,index)=>{
                          return( 
                            <option value={language.hsn} key={language._id+index}> {language.hsn} </option>                
                          );
                        })
                      :
                      <option></option>                
                    }
                 </select>
                </div>
              </div>*/}
              <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <label>SGST</label>
                <div className="input-group" id="sgstID">
                 <span className="input-group-addon ipAddons"><i className="fa fa-percent facompanyinfo" aria-hidden="true"></i></span>
                 <input value={this.state.sgst} onChange={this.handleChange} type="number" placeholder="Enter SGST*" name="sgst" className="form-control sgst inputValid required" />
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <label>CGST</label>
                <div className="input-group" id="cgstID">
                 <span className="input-group-addon ipAddons"><i className="fa fa-percent facompanyinfo" aria-hidden="true"></i></span>
                 <input value={this.state.cgst} onChange={this.handleChange} type="number" placeholder="Enter CGST*" name="cgst" className="form-control cgst inputValid required" />
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <label>IGST</label>
                <div className="input-group" id="igstID">
                 <span className="input-group-addon ipAddons"><i className="fa fa-percent facompanyinfo" aria-hidden="true"></i></span>
                 <input value={this.state.igst} onChange={this.handleChange} type="number" placeholder="Enter IGST*" name="igst" className="form-control igst inputValid required" />
                </div>
              </div>
              <div className="form-group col-lg-6 col-md-4 col-sm-12 col-xs-12">
                <label>Effective From</label>
                <div className="input-group">
    	             <span className="input-group-addon ipAddons"><i className="fa fa-calendar facompanyinfo" aria-hidden="true"></i></span>
                   <input value={this.state.effectiveFrom} onChange={this.handleChange} type="date"  name="effectiveFrom" className="form-control effectiveFrom inputValid" required/>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <button className="col-lg-3 col-md-4 col-sm-6 col-xs-12  btn btn-primary pull-right companyTaxSubmit" onClick={this.submitCompanyTax.bind(this)}>Save</button>
              </div>
            </form>
            <div className="table-responsive tblrsp">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr className="tableHeader">
                    <th> GST Number </th>
                    <th> HSN </th>
                    <th> SGST </th>
                    <th> CGST </th>
                    <th> IGST </th>
                    <th> Effective From </th>
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
            </div>
            </div>
          </div>
  		  </div>

  		  



		    {/*<div className="emptyDiv"></div>*/}
      </section>

  		);
  }

 }


export default  EditCompanyTaxDetails = withTracker((props)=>{

    const postHandle = Meteor.subscribe('companyData');
    const post       = FranchiseDetails.findOne({})||{};
    const loading    = !postHandle.ready();

    const postHandle2  = Meteor.subscribe('hsnData');
    const loading2 = !postHandle2.ready();
    if(!loading2){
      var hsnData = HSN.find({}).fetch();  
    }else{
      var hsnData = [];
    }
    if(post){
      var taxSettings=post.taxSettings;
      if(taxSettings){
        for(i=0;i<=taxSettings.length;i++){
          var taxDetails=taxSettings[taxSettings.length-1];
        }
      }else{
        var taxDetails='';
      }
    }
   


    return {
      loading,
      post,
      hsnData,
      taxDetails
    };
}) (CompanyTaxDetails);
