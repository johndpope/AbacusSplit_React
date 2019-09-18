import React,{Component} from 'react';
import {render} from 'react-dom';
import InputMask from 'react-input-mask';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class VerifyMobileAOS extends Component{
  constructor(){
    super();
    this.state ={
      "subscription" : {
        user             : Meteor.subscribe("userfunction"), 
      }
    }
  }

  VerifyMobileAOS(event){
    event.preventDefault();
    var mobileVerifyAOS = this.refs.mobileVerifyAOS.value;
     Meteor.call('addVerifyOTP', mobileVerifyAOS, function(error,result){
        if(error){
          swal(error);
        }else{
          var result = result;
          if(result =="alreadyVerified"){
            swal("Your account already verified","","warning");
            FlowRouter.go("/");
          }else if(result != "MobNumNotExists"){
            if(result){
              var profileData = result.profile;
              var userId = result._id;
              var emailotp = Math.floor(100000 + Math.random() * 900000);
               Meteor.call('addOTP', userId , emailotp, function(error,result){
                      if(error){
                        console.log(error);
                      }else{
                        
                        FlowRouter.go('/otpFirstVarification/'+userId);
                      Meteor.call("sendSMSMsg",profileData.firstname,mobileVerifyAOS,emailotp); //Send otp through sms
                    }
              });
              }
            }else{
              swal("Wrong Mobile Number" ,"Enter mobile number that you used for creating Account","warning");
            }
        
        }
      });
  }


  inputEffect(event){
    event.preventDefault();
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
        <div className="col-lg-6 col-lg-offset-2 col-md-6 col-sm-12 formbg1 forgetpassFormWrap emailVerifyPage" style={{"height": winHeight}}>
              {/*<img src="/images/formbg.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formbg"/>*/}
          <div className="divLoginInWrap col-lg-6 col-lg-offset-5">
          {/*<div className="col-lg-12">
            <div className="col-lg-12 col-md-12 OEXLogoWrap">
              <img src="/images/maatslogo.png" className="oesLogoImg col-lg-offset-2 col-lg-8 col-md-8 col-md-offset-2"/>
            </div>
          </div>*/}
          {/*<div className="OESSubTitle2">Abacus Online Exam System</div>*/}
         <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 forgotpwd verifypd">
            <form id="OTPMobMail" onSubmit={this.VerifyMobileAOS.bind(this)}>
               <h3 className="signInNameTitle"><span className="bordbt">VERIFY ACCOUNT</span></h3>
              <div className="text-center col-lg-12 col-md-12 col-sm-12 col-xs-12 otpHeader">
                  <span>Enter Mobile Number that you used for creating Account </span>
              </div>
              <div className="form-group col-lg-12 col-md-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr veribtm">
                <div className="input-effect input-group">
                  
                  {/*<input type="email" className="effect-21 form-control loginInputs" ref="emailVerifyTMS" name="emailVerifyTMS" onBlur={this.inputEffect.bind(this)} aria-describedby="basic-addon1" title="Please enter Email id!"  required/>*/}
                  <InputMask mask="9999-999-999" maskChar=" " name="mobileVerifyAOS" ref="mobileVerifyAOS" onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText"  pattern="^(0|[0-9-+]*)$" title="Enter Mobile Numbers!" autoComplete="off" required/>
                   <span className="input-group-addon glyphi-custommm"><i className="fa fa-phone-square" aria-hidden="true"></i></span>
                  <span className="focus-border">
                    <i></i>
                  </span>
                </div>
              </div>
              <div className="submitButtonWrapper col-lg-12 col-md-12 col-sm-12 col-xs-12 pdleftclr">
                <button type="submit" className="btn btn-info submitBtn col-lg-12 col-md-12 col-sm-12 col-xs-12 UMloginbutton">Submit</button>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pdcls">
                <a href="/" className="UMGrey signInbtn pdleftclr col-lg-12 col-md-12 col-sm-12 col-xs-12">Sign In</a>   
              </div>
            </form>
          </div>
          </div>
        </div>
    </div>
    );
  }
}