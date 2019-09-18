import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Session} from 'meteor/session';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';


export default class NewForgotPassword extends React.Component{
  constructor(){
    super();
    this.state ={
      "emailMobileOtp" : '',
      "subscription" : {
        user             : Meteor.subscribe("userfunction"), 
      }
    }
  }
  
  forgotpassword(event){
    event.preventDefault();
    // var mobile = this.refs.forgotNumber.value;
    var email = this.refs.forgotEmail.value;
    // console.log("email: ",email);
   this.setState({
    emailMobileOtp : "Email Id",
   });
    var userOtp = Meteor.users.findOne({"username":email});
    // console.log("userOtp: ",userOtp);
   
    if(userOtp){
      // var mobileotp = Math.floor(1000 + Math.random() * 9000);
      var emailotp = Math.floor(100000 + Math.random() * 900000);
      // Session.set('mobotp',mobileotp);
///////////////
      // Session.set('mailotp',emailotp);
      
      var newID = userOtp._id;

///////////////

      // Session.set('newID',newID);

      Meteor.call('addOTP', newID , emailotp, function(error,result){
        if(error){
          Bert.alert(error);
        }else{

        }
      });
    
      // //Send OTP    
      // Meteor.call('sendOtp',mobile,mobileotp,
      // function(error,result){
      //   if(error){
      //     console.log(error.reason);
      //   }else{
      //     swal('Successfully sent the OTP to your mobile number');
      //   }
      // });
                           
      // SEND EMAIL VERIFICATION LINK
      Meteor.call('sendVerificationLinkToUser', email, function(error,result){
        if(error){
          Bert.alert(error);
        }else{ 
          swal({text:'Successfully sent the OTP to your Email Address.', showConfirmButton: true,type     : 'success'});                  
        } //end else
      }); // send verification mail ends
         FlowRouter.go('/forgotOTPVarification/'+newID);
      // $('.confirnModalWrap').addClass('newPassword');
      // $('.NewForgotPasswordWrap').css('display','none');

    }else{
      swal('Email Address not found',"Please enter valid Email Id","warning");                  
    }
  }

  inputEffect(event){
    event.preventDefault();
    // alert('hi');
    if($(event.target).val() != ""){
      $(event.target).addClass("has-content");
    }else{
      $(event.target).removeClass("has-content");
    }
  }

  render(){
    var winHeight = $(window).height();;
    var divHeight = winHeight/4.5+'px';
    var MyDivHeight = $('#divHeghtIN').height();
    return(
     <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpLeftWrap" style={{"height": winHeight}}>
          {/*<img src="/images/signUpBanner.gif" className="signUpBanner col-lg-9 col-md-9"/>*/}
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
            <img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 logoImg"/>
          <div className="OESSubTitle2">Abacus Online Exam System</div>

          </div>
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpRighttWrap" style={{"height": winHeight}}>
          <div className="div1 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div2 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div3 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div4 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div5 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div6 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div7 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div8 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div1 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
          <div className="div2 col-lg-12 col-md-12 col-sm-12 col-xs-12" style={{"height": divHeight}}>
          </div>
        </div>
        <div className="col-lg-6 col-lg-offset-2 col-md-6 col-sm-12 formbg1 forgetpassFormWrap loginOesWrap" style={{"height": winHeight}}>
              {/*<img src="/images/formbg.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formbg"/>*/}
          <div className="divLoginInWrap col-lg-6 col-lg-offset-5">
              
          {/*<div className="col-lg-12">
            <div className="col-lg-12 col-md-12 OEXLogoWrap">
              <img src="/images/maatslogo.png" className="oesLogoImg col-lg-offset-2 col-lg-8 col-md-8 col-md-offset-2"/>
            </div>
          </div>*/}
          {/*<div className="OESSubTitle2">Abacus Online Exam System</div>*/}
          
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 forgotpwd verifypd">
          <h3 className="signInNameTitle"><span className="bordbt">VERIFY EMAIL</span> </h3>
            <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                <span>Enter Email Id that you used for creating Account </span>
            </div>
              <div className="FormWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 forPassWrap">
                      <form id="forgotPassword" onSubmit={this.forgotpassword.bind(this)}>
                        <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr veribtm">
                          <div className="input-effect input-group col-lg-12">
                            
                            <input type="email" className="effect-21  form-control loginInputs" ref="forgotEmail" name="forgotEmail" onBlur={this.inputEffect.bind(this)} aria-label="Email Id" aria-describedby="basic-addon1" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" title="Please add '.' and enter only 2 or 3 characters following '.'!" required/>
                             <span className="input-group-addon glyphi-custommm"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>
                        {/*<div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <div className="input-effect input-group">
                            <span className="input-group-addon addons" id="basic-addon1"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                            <input type="text" className="effect-21 form-control loginInputs" ref="forgotNumber" name="forgotNumber" onBlur={this.inputEffect.bind(this)} aria-label="Mobile No" aria-describedby="basic-addon1" pattern="^(7|8|9)\d{9}$" title="Please enter 10 digit valid mobile number!" required/>
                            <label>Mobile No</label>
                            <span className="focus-border">
                              <i></i>
                            </span>
                          </div>
                        </div>*/}
                        <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr">
                          <button type="submit" className="btn col-lg-12 col-md-12 col-sm-12 col-xs-12 submitBtn UMloginbutton">Send Verification Code</button>
                        </div>
                        {/*<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8">
                          <a href="/" className="UMGrey signInbtn">Sign In</a>  
                        </div>*/}
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pdcls">
                          <a href="/" className="UMGrey signInbtn col-lg-12 col-md-12 col-sm-12 col-xs-12">Sign In</a>   
                        </div>
                      </form>
                      </div>
                    </div>
              </div>
        </div>
    </div>       
                 
    );
  }
}
