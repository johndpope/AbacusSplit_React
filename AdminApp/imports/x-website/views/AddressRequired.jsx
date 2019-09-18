import React, {Component} from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { withTracker } from 'meteor/react-meteor-data';
import {browserHistory} from 'react-router';
import { UserProfile } from '../forms/api/userProfile.js';
import { TempProofDocs } from "../forms/api/userProfile.js";
import PermanentAddress from "../forms/PermanentAddress.jsx";
import CurrentAddress from "../forms/CurrentAddress.jsx";

class AddressRequired extends TrackerReact(Component){
   constructor(props){
    super(props);
    this.state ={
      'permanentAddressId' : '', 
      'line1'           : '',
      'line2'           : '',
      'line3'           : '',
      'landmark'        : '',
      'city'            : '',
      'state'           : '',
      'country'         : '',
      'pincode'         : '',
      'residingFrom'    : '',  
      'residingTo'      : '',
      'tempLine1'       : '',
      'tempLine2'       : '',
      'tempLine3'       : '',
      'tempLandmark'    : '',
      'tempCity'        : '',
      'tempState'       : '',
      'tempCountry'     : '',
      'tempPincode'     : '',
      'tempresidingFrom': '',
      'tempresidingTo'  : '',
      'residingToDateOfAddress' : 'stillLivingHere',
      'currentResidingToDate'   : 'stillLivingHere',
      "proofData"       : {},
      "subscription" : {
        "userData" : Meteor.subscribe("userData",Meteor.userId()),
        "userProfileData" : Meteor.subscribe("userProfileData"),
        "LatestTempProofDocs" : Meteor.subscribe("LatestTempProofDocs"),
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount(){
    // $.validator.addMethod("regxA1", function(value, element, regexpr) {          
    //   return regexpr.test(value);
    // }, "Name should only contain letters & space.");

    // $.validator.addMethod("regxA2", function(value, element, regexpr) {          
    //   return regexpr.test(value);
    // }, "Please enter a valid pincode.");
          
    // jQuery.validator.setDefaults({
    //   debug: true,
    //   success: "valid"
    // });
  
    // $("#addressForm").validate({
    //   rules: {
    //     city: {
    //       regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
    //     },
    //     state: {
    //       regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
    //     },
    //     country: {
    //       regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
    //     },
    //     pincode: {
    //       regxA2: /^[1-9][0-9]{5}$|^$/,
    //     },
    //     tempCity: {
    //       regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
    //     },
    //     tempState: {
    //       regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
    //     },
    //     tempCountry: {
    //       regxA1: /^[A-za-z']+( [A-Za-z']+)*$|^$/,
    //     },
    //     tempPincode: {
    //       regxA2: /^[1-9][0-9]{5}$|^$/,
    //     }
    //   }
    // }); 
  }
  handleChange(event){
    const target = event.target;
    const value  = target.type === 'checkbox' ? target.checked : target.value;
    const name   = target.name;
    // console.log("target",target);
    // console.log("name",event.target.value);
    this.setState({
      [name]: event.target.value,
    });
  }  
  editPermanaantAddress(event){
    var idVal= $(event.target).attr('data-target');
    console.log("idVal",idVal);
    $('#'+idVal).modal('show');
  }
  editCurrentAddress(event){
    var idVal= $(event.target).attr('data-target');
    $('#'+idVal).modal('show');
  }
  newaddPermAddressModal(event){
   event.preventDefault(); 
   $('#permaddAddressModal').modal('show');
  }
  newAddCurrentAddressModal(event){
   $('#currentaddAddressModal').modal('show');
  }

  requiredAddressInformation(){ 
      return(
        <div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
            <i className="fa fa-id-card col-lg-1 col-md-1 col-sm-1 col-xs-1 viewlogo"></i> 
            <span className="col-lg-11 col-md-11 col-sm-11 col-xs-11 viewTitle">Address Information</span>
          </div> 
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoOuter">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <h5 className="pull-left">Permanent Address</h5>
                <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newaddPermAddressModal.bind(this)}></i>              
              </div>  
              { this.props.permanentAddress ?
                this.props.permanentAddress.map((permAddress,index)=>{
                  return(
                    <div  key={index}> 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress">
                        { browserHistory.getCurrentLocation().pathname == "/profileForms" 
                          ?
                           ""
                          : 
                          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                            <input type="checkbox" name="permanentAddressCheck" id ={permAddress.chkid} value={"Permanent Address : "+permAddress.permanentAddressId}/>
                          </div>

                        }
                        <div className={ browserHistory.getCurrentLocation().pathname == "/profileForms" ? "col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding" :"col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding"}>
                             <span className="pull-left"> {permAddress.line1}, {permAddress.line2}, {permAddress.line3},{permAddress.landmark}, {permAddress.city}, {permAddress.state}, {permAddress.country} {permAddress.pincode}</span>           
                        </div>
                         <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                         { permAddress.editStatus == "Open" ?
                             <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"permAddressModal-"+index} id={permAddress.permanentAddressId} onClick={this.editPermanaantAddress.bind(this)}></i>
                             :
                             ""
                          }
                        </div>
                      </div> 
                      <div className="modal fade" id={"permAddressModal-"+index} role="dialog">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  <h4 className="modal-title">Edit Permanent Address</h4>                 
                              </div>
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id={"permanentAddressForm-" + index}>
                                 <PermanentAddress  id={this.props.userprofile._id} permanentAddressValues={permAddress} indexVal={index} />
                                </form>
                              </div> 
                              <div className="modal-footer">
                              </div>
                            </div> 
                          </div>
                      </div> 
                    </div>
                  );                   
                })
                :
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                       <span>Please Add Your Permanent Address</span>
                  </div>
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                  </div>
              </div> 
              }
                        
            </div> 
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressInfoInner requiredAddress noProfilePadding">
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                <h5 className="pull-left">Current Address</h5>
                <i className="fa fa-plus pull-right add-btn" title="Add Address" onClick={this.newAddCurrentAddressModal.bind(this)}></i>              
              </div>  
              { this.props.currentAddress ?
                this.props.currentAddress.map((currentAddress,index)=>{
                  return(
                    <div key={index}> 
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding outerPermanentAddress">
                        { browserHistory.getCurrentLocation().pathname == "/profileForms" 
                          ?
                           ""
                          :   
                          <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                            <input type="checkbox" name="permanentAddressCheck" id ={currentAddress.chkid} value={"Current Address : "+currentAddress.currentAddressId}/>
                          </div>
                        }
                        <div className={ browserHistory.getCurrentLocation().pathname == "/profileForms"  ? "col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding" : "col-lg-10 col-md-10 col-sm-10 col-xs-10 noProfilePadding"}>
                             <span className="pull-left"> {currentAddress.tempLine1}, {currentAddress.tempLine2}, {currentAddress.tempLine3},{currentAddress.tempLandmark}, {currentAddress.tempCity}, {currentAddress.tempState}, {currentAddress.tempCountry} {currentAddress.tempPincode}</span>           
                        </div>
                        <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding"> 
                         { currentAddress.editStatus == "Open" ?
                             <i className="fa fa-pencil pull-right add-btn" title="Edit Address" data-toggle="modal" data-target={"currentAddressModal-"+index} id={currentAddress.currentAddressId} onClick={this.editCurrentAddress.bind(this)}></i>
                             :
                             ""
                          }
                        </div>
                      </div> 
                       <div className="modal fade" id={"currentAddressModal-"+index} role="dialog">
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  <h4 className="modal-title">Edit Current Address</h4>                 
                              </div>
                              <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <form className="basicForm col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm" id={"currentAddressForm-"+index}>
                                 <CurrentAddress  id={this.props.userprofile._id} currentAddressValues={currentAddress} indexVal={index} />
                                </form>
                              </div> 
                              <div className="modal-footer">
                              </div>
                            </div> 
                          </div>
                      </div>
                    </div>

                  );                   
                })
                :
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noProfilePadding">
                  <div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 noProfilePadding">
                       <span>Please Add Your Current Address</span>
                  </div>
                  <div className="col-lg-1 col-md-1 col-sm-1 col-xs-1 noProfilePadding">
                  </div>
              </div> 
              }
                        
            </div> 

            
           <div className="modal fade" id="permaddAddressModal" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Add Permanent Address</h4>                 
                    </div>
                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm basicForm" id="addPermanentAddressForm">
                        <PermanentAddress key={this.props.proofPerAddrData._id + 'editPermanentAddr'} proofPerAddrData={this.props.proofPerAddrData}/>
                      </form>
                    </div> 
                    <div className="modal-footer">
                    </div>
                  </div> 
                </div>
           </div> 
            <div className="modal fade" id="currentaddAddressModal" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Add Current Address</h4>                 
                    </div>
                    <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <form className="col-lg-12 col-md-12 col-sm-12 col-xs-12 addressForm basicForm" id="addCurrentAddressForm">
                        <CurrentAddress key={this.props.proofCurrAddrData._id + 'editCurrentAddr'} proofCurrAddrData={this.props.proofCurrAddrData}/>
                      </form>
                    </div> 
                    <div className="modal-footer">
                    </div>
                  </div> 
                </div>
            </div> 
          </div> 
       </div>
      );  
  }
  render(){
    // console.log(this.props.profileId);
    if (!this.props.loading1) {
     return (
        <div>
          {this.requiredAddressInformation()}
        </div>
      );  
    }else{
      return(
        <span></span>
      );
    }
  }
}
addrRequiredContainer = withTracker(props => {
  // console.log('props: ',this.props);
    var _id = props.profileId;
    var id = Meteor.userId();
    // console.log("_id",_id);
    const postHandle1      = Meteor.subscribe('userprofile',Meteor.userId());
    const postHandle = Meteor.subscribe('TempProofDocs',Meteor.userId());
    // var editServices   = this.props.params.id;
    // console.log("permanentAddress",props.permanentAddress);
    // console.log("currentAddress",props.currentAddress);
    // // var reqPermnentAddress = {};
    // var reqCurrentAddress  = {};
    var permanentAddress = props.permanentAddress;
    var currentAddress   = props.currentAddress;
    const userprofile      = UserProfile.findOne({"_id" : _id});
    // // console.log("userprofile",userprofile); 
    // if (userprofile) {
    //   if (userprofile.permanentAddress) {
    //       permanentAddress  = userprofile.permanentAddress;
    //     }
       
    //    if (userprofile.currentAddress) {
    //       currentAddress  = userprofile.currentAddress;
    //    }
    // }
    const loading  = !postHandle.ready();
    const loading1 = !postHandle1.ready();
    const proofPerAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'permanentAddress'})|| {};
    // console.log("proofObj" ,proofObj);
    const proofCurrAddrData  = TempProofDocs.findOne({"userId":_id,"prooftype":"address","proofSubtype": 'currentAddress'})|| {};
    // console.log("proofData" ,proofData);
    // if(_id){
      // console.log("permanentAddress",permanentAddress);
      return {
          loading1 : loading1,
          userprofile : userprofile,
          // reqPermnentAddress : reqPermnentAddress,
          // reqCurrentAddress  : reqCurrentAddress,
          permanentAddress  : permanentAddress,
          currentAddress  : currentAddress,
          proofPerAddrData,
          proofCurrAddrData,
          loading,
      };
    // }
})(AddressRequired);
export default addrRequiredContainer;
