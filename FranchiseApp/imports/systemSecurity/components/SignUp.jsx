import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';

import ConfirmOtpModal from './ConfirmOtpModal.jsx';
import {Session} from 'meteor/session';
import InputMask from 'react-input-mask';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';

 class SignUp extends TrackerReact(Component) {
    constructor(props){
        super(props);
        this.state={
            roletype : '',
            termsCondition:'',
            subscription      : {
                // "TermsandConditionsStudent" : Meteor.subscribe("TermsandConditionsStudent"),
                "TermsandConditionsFranchise" : Meteor.subscribe("TermsandConditionsFranchise"),
            }
        }
        // this.handleChange = this.handleChange.bind(this);
        
    }
    // handleChange(event){
    //     const target = event.target;
    //     // const value  = target.type === 'checkbox' ? target.checked : (target.type === 'radio' ?  !this.state.roletype :  target.value);
    //         const name = target.name;
    //     // console.log("value",value);
    //         this.setState({
    //          [name] : event.target.value,
    //         });
    //     if(event.target.value=="Student"){
    //         this.setState({
    //             termsCondition:  InstructionMaster.findOne({"instructionFor":"Terms & Conditions For Student"}),
    //         });
    //     }else if(event.target.value=="Franchise"){
    //         this.setState({
    //             termsCondition:  InstructionMaster.findOne({"instructionFor":"Terms & Conditions For Franchise"}),
    //         });
    //     }

    // }

    componentDidMount(){

         Meteor.call('getFranchiseTerms', (error,result)=>{
             if(error){
             console.log(error);
              }else{ 
                if(result){
                     this.setState({
                        termsCondition:  result,
                    });
                }
              }
        });

        // this.setState({
        //         termsCondition:  InstructionMaster.findOne({"instructionFor":"Terms & Conditions For Franchise"}),
        //     });

    }
        
    usersignup(event){
        event.preventDefault();
        // if(this.state.roletype){
            document.getElementById("signUpBtn").value = 'We are processing. Please Wait...';            
            var formValues = {
            'firstname' : this.refs.firstname.value,
            'lastname' : this.refs.lastname.value,
            'signupEmail' : this.refs.signupEmail.value,
            'mobNumber' : this.refs.mobNumber.value,
            'signupPassword' : this.refs.signupPassword.value,
            'roletype' :      'Franchise',
            // 'roletype' :      this.state.roletype,
            }
        var firstname                = this.refs.firstname.value;
        var passwordVar              = this.refs.signupPassword.value;
        var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;
        var mobile                   = this.refs.mobNumber.value;
        var email                    = this.refs.signupEmail.value;
            

        //Check password is at least 6 chars long
        var isValidPassword = function(passwordVar, signupConfirmPasswordVar) {
            if (passwordVar === signupConfirmPasswordVar) {
                return passwordVar.length >= 6 ? true : 
                document.getElementById("signUpBtn").value = 'Sign Up';
                swal({
                title : "Password should be at least 6 Characters Long",
                text  : "Please try again or create an Account",
                // timer: 1700,

                showConfirmButton: true,
            // type  : "error"
                });
            } else {
                document.getElementById("signUpBtn").value = 'Sign Up';
                return swal({
                title  : 'Passwords does not match',
                text   : 'Please Try Again',
                showConfirmButton: true,
                type   : 'error'
                }); //End of error swal
            } //End of else
        }

        if (isValidPassword(passwordVar, signupConfirmPasswordVar)) {
            var curMobileNum = $('#mobNumber').val();
            Meteor.call("checkMobileExistorNot",curMobileNum,(err,res)=>{
                if(err){
                    console.log(err);
                }else{
                     if(res=="MobileNoExist"){
                        document.getElementById("signUpBtn").value = 'Sign Up';
                return swal({
                    title  : 'Contact number already exists.',
                    text   : 'Please Try Another Number',
                    showConfirmButton: true,
                });
               
            }else if(res=="MobileNoNotExist"){
                Meteor.call('userCreateAccount', formValues ,(error,result) => {
                 if(error){
                    document.getElementById("signUpBtn").value = 'Sign Up';
                    swal(error.reason);
                }else{
    //---------- CLEAR ALL FIELDS ----------------//
                     this.refs.firstname.value = '';
                     this.refs.lastname.value = '';
                     this.refs.signupEmail.value = '';
                     this.refs.mobNumber.value = '';
                     this.refs.signupPassword.value = '';
                    var emailotp = Math.floor(100000 + Math.random() * 900000);

                     // ADD USER ROLE
                     var newID = result;
                     // Meteor.call("addRoles",newID,"Student");
                     Meteor.call('addOTP', newID , emailotp, function(error,result){
                         if(error){
                         console.log(error);
                          }else{
                            FlowRouter.go('/otpFirstVarification/'+newID);
                            //SEND SMS for Verification

                            Meteor.call("sendSMSMsg",firstname,mobile,emailotp);
                            var tosignupEmail    = formValues.signupEmail;
                            var fromEmailId = 'support@maats.in';
                            var subject     = 'Abacus Online Exam Registration';
                            var body        = 'Hello '+formValues.firstname+'\n'+"Congratulations!!!"+'\n'+'\n'+""+formValues.firstname+' '+formValues.lastname+' has been registered for Abacus Online Exam Successfully.'+'\n'+'Please login using username: ' +tosignupEmail+ ' and password which you have set while registering.' +'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
                            Meteor.call('RegistrationEmail',tosignupEmail,fromEmailId,subject,body);

                          }
                    });
                } //end else
                        
            });    
          }
                } 
            })
           
          }
        // }else{
        //     swal("Please select franchise","","warning");
        // }
        return 0;   

    }


    showSignPass(){
        $('.rrnShowPass').toggleClass('rrnShowPass1');
        $('.rrnHidePass').toggleClass('rrnHidePass1');
        return $('.oesSignUpFormPass').attr('type', 'text');
     }
     hideSignPass(){
        $('.rrnShowPass').toggleClass('rrnShowPass1');
        $('.rrnHidePass').toggleClass('rrnHidePass1');
        return $('.oesSignUpFormPass').attr('type', 'password');
     }

  acceptcondition(e){
    var conditionaccept=e.target.value;
    // console.log("condition",$("#idacceptcondition").is("checked"));
    if(conditionaccept=="acceptedconditions"){
        $(".acceptinput").removeAttr('disabled');
        if(this.state.roletype=="Student"){
            document.getElementById("lastname").removeAttribute("required");
        }else{
            null;
        }
    } else{
        $(".acceptinput").addAttr('disabled');
    }


    
  }
  showModal(){
        // if(this.state.roletype=="Franchise"){
        //     $(".modalbg").css("display","block");
        // }else{
        //      swal("Please select student or franchise","","warning");
        // }
         $(".modalbg").css("display","block");
    }
    hideModal(){
        $(".modalbg").css("display","none");
    }


    validateText(e) {
        var invalidcharacters = /[^a-z]/gi
        var fnm = document.getElementById('firstname');
        if (invalidcharacters.test(fnm.value)) {
        newstring = fnm.value.replace(invalidcharacters, "");
        fnm.value = newstring
        // console.log('val phn', phn.value);
        } 
    }
    validateText1(e) {
        var invalidcharacters = /[^a-z]/gi
        var lnm = document.getElementById('lastname');
        if (invalidcharacters.test(lnm.value)) {
        newstring = lnm.value.replace(invalidcharacters, "");
        lnm.value = newstring
        // console.log('val phn', phn.value);
        } 
    }
	render(){
		Meteor.logout();
		var winHeight = $(window).height();;
        var divHeight = winHeight/4.5+'px';
        var MyDivHeight = $('#divHeghtIN').height();
        console.log("termsCondition",this.state.termsCondition);
		return(
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 signUpWrapper">
				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpLeftWrap"  style={{"height": winHeight}}>
					<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
						<img src="/images/maatslogo.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 logoImg"/>
					<div className="OESSubTitle2">Abacus Online Exam System</div>

					</div>
					{/*<img src="/images/signUpBanner.gif" className="signUpBanner col-lg-9 col-md-9"/>*/}
				</div>
				<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 signUpRighttWrap"  style={{"height": winHeight}}>
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
				<div className="col-lg-6 col-lg-offset-2 col-md-6 col-sm-12 formbg1 signupPadding signUpFormWrap loginOesWrap loginforms1" style={{"height": winHeight}}>

						{/*<img src="/images/formbg.png" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 formbg"/>*/}
						  <div className="divLoginInWrap">
					
					<form id="signUpUser" onSubmit={this.usersignup.bind(this)}>
                    <h3 className="signUpNameTitle2"><span className="bordbt">SIGN UP</span></h3>
					<div className="col-lg-12 col-md-12 signUpInnerWrapperOES signupfrm">
	
						<div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd">
						   		<span className="blocking-span">
								   <input type="text" title="Only alphabets are allowed!" onKeyUp={this.validateText.bind(this)} className="form-control spotylTextbox oesSignUpForm" id="firstname" ref="firstname" name="firstname" pattern="[a-zA-Z]+"  required/>
						    		<span className="floating-label">
						    		<i className="fa fa-user-circle-o signupIconFont" aria-hidden="true"/> 
						    		First Name
						    		</span>					   			
								</span>
						</div>

					   <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent textpd1">
							<span className="blocking-span">   
							   <input type="text" title="Please enter alphabets only!" onKeyUp={this.validateText1.bind(this)} className="form-control spotylTextbox oesSignUpForm" id="lastname" ref="lastname" name="lastname" pattern="[a-zA-Z]+"  required/>
					    	<span className="floating-label1 lbfloatpass">
					    		<i className="fa fa-user-circle-o signupIconFont" aria-hidden="true"/> 
					    		Last Name
					    	</span>					   			
						</span>
					    </div>
					    <div className="form-group form-group1 col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
							<span className="blocking-span">   
							   <InputMask mask="9999-999-999" maskChar=" " pattern="^(0|[0-9-+\s]*)$" title="Please enter numbers!" className="form-control  spotylTextbox oesSignUpForm" ref="mobNumber" name="mobNumber" id="mobNumber" required/>
							   <span className="floating-label">
							   <i className="fa fa-mobile signupIconFont" aria-hidden="true"></i>Mobile Number</span>					   			
						    </span>
					    
					    </div>
				   		<div className="form-group form-group1 col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
							<span className="blocking-span">   
							  <input type="email" title="Please match email format!" className="form-control signupsetting  spotylTextbox oesSignUpForm" ref="signupEmail" name="signupEmail" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$" required/>
					    		<span className="floating-label"><i className="fa fa-envelope-o signupIconFont" aria-hidden="true"></i>Email ID</span>					   			
							</span>
					    </div>
				   		<div className="form-group form-group1 col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent textpd">
				   			<span className="blocking-span">
							   <input type="password" className="form-control Pass   oesSignUpForm confirmbtm" ref="signupPassword" name="signupPassword" required/>
							<span className="floating-label"><i className="fa fa-lock" aria-hidden="true"></i> Password {/*(min 6 char)*/}</span>					   			
						</span>
					    </div>

				   		<div className="form-group form-group1 col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent textpd1">
				   			<span className="blocking-span">

							   <input type="password" className="form-control Pass   oesSignUpForm confirmbtm" ref="signupConfirmPassword" name="signupConfirmPassword" required/>
							<span className="floating-label1 lbfloatpass"><i className="fa fa-lock" aria-hidden="true"></i> Confirm Password</span>					   			
						</span>

					    </div>
                        {/*<div className="form-group form-group1 col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent textpd hideStud">
                            <span className="blocking-span">
                                <div className="  Pass   oesSignUpForm ">
                                <label className="radiolabel">
                                    <input className="radiobtnstyle" type="radio" name="roletype" ref="roletype "checked={this.state.roletype === 'Student'} onChange={this.handleChange} value="Student" /> 
                                      <span className="rdolb"> Student </span> 
                                      <div className="check"></div>                       
                               
                                </label>
                            </div>
                                   
                            </span>
                        </div>
                        <div className="form-group form-group1 col-lg-6 col-md-6 col-xs-12 col-sm-12 inputContent textpd ">
                            <span className="blocking-span">
                                <div className="  Pass   oesSignUpForm ">
                                <label className="radiolabel">
                                    <input className="radiobtnstyle"  type="radio" name="roletype" ref="roletype" checked={this.state.roletype === 'Franchise'} onChange={this.handleChange} value="Franchise" />
                                        <span className="rdolb"> Franchise </span>
                                </label>
                            </div>
                            </span>
                        </div>*/}
					   {/* <div className="form-group form-group2 form-group1 col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
					    <div className="col-lg-6 col-md-6 col-xs-12 col-sm-12">
                            <div className="col-lg-12 form-control Pass  spotylTextbox oesSignUpForm">
    							<label>
    								<input type="radio" name="roletype" ref="roletype "checked={this.state.roletype === 'Student'} onChange={this.handleChange} value="Student" />    Student                         
                                {/* <Input type="radio" validations={[required]} name="status" value="Blocked" ref="status" onChange={this.handleChange} checked={this.state.status === 'Blocked'} className="option-input radio"/>  
    							</label>
                            </div>
						</div>
						<div className="col-lg-6 col-md-6 col-xs-12 col-sm-12 leftpaddingzero">
                            <div className="col-lg-12 form-control Pass  spotylTextbox oesSignUpForm">
    							<label>
    								<input type="radio" name="roletype" ref="roletype" checked={this.state.roletype === 'Franchise'} onChange={this.handleChange} value="Franchise" /> Franchise
    							</label>
                            </div>
						</div> 
						</div>*/}
					    <div className="form-group form-group1 col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent termspad">
					    
			                    <input  id="idacceptcondition" type="checkbox"  value="acceptedconditions" onClick={this.acceptcondition.bind(this)}/><a href="#openModal" className="form-checkbox UMGrey modalbutton fontbold terms1" onClick={this.showModal.bind(this)}>&nbsp;I agree to the<span className="under"> terms & conditions</span><label className="requiredsign">*</label></a>
			                      <span className="checkmark1"></span>
			            </div>
                        <div id="openModal" className="modalbg">
                            <div className="dialog">
                                <a href="#close" title="Close" onClick={this.hideModal.bind(this)}className="modalclose">X</a>
                                <h2 className="modaltext">Terms & Conditions</h2>
                                <p className="modaltext modalpara modalparascroll">{this.state.termsCondition?this.state.termsCondition.instruction:null}</p>
                            </div>
                        </div>
				   		{/*<div className="form-group col-lg-12 col-md-12 col-xs-12 col-sm-12">
						   	<span className="termsNConditions UMIHaveRead "> I have read 
						   	</span>
					   		<a href='#'>
					   			<span className="btn-link termsClass">Terms and Conditions.</span>
					   		</a>
						   	<input type="checkbox" name="terms" ref="terms" className="checkbox_check checkbox option-input option-input2 pull-left"/>
						   	<br/>
					    </div>*/}


						<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 form-group1 rrnRegisterBtn">

					    	<input id="signUpBtn" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 acceptinput UMloginbutton UMloginbutton1 hvr-sweep-to-right" type="submit" value="Sign Up" disabled/>

					   </div>		   

				    	<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pdcls">
					    	<a href="/" className="UMGrey signInbtn1 col-lg-12 col-md-12 col-sm-12 col-xs-12 mrleftsign">Sign In</a> 	
				    	</div>

					  </div> 
				  	</form>
				  	</div>
					</div>
				</div>
			);
	}
}
export default SignUpContainer = withTracker(props =>{
    const postHandle = Meteor.subscribe('TermsandConditions');
    const loading    = !postHandle.ready();

    var Terms_ConditionData = InstructionMaster.findOne({"instructionFor":"Terms & Conditions"});
    // console.log("Terms_ConditionData-->",Terms_ConditionData);
    
    return{
        loading,
        Terms_ConditionData,
        
    } 
})(SignUp);