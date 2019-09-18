
import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

// import ConfirmOtpModal from './ConfirmOtpModal.jsx';
import {Session} from 'meteor/session';
import InputMask from 'react-input-mask';
import {withTracker} from 'meteor/react-meteor-data';
import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';

import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';


export default class CreateUser extends TrackerReact(Component) {

    constructor(props) {
        super(props);
        this.state = {
          firstname   : "",
          lastname    : "",
          signupEmail : "",
          lastname    : "",
        'facilityPermission' : 'waitingforResult',            
        };
        this.handleChange = this.handleChange.bind(this);
      }

      componentWillMount(){
         Meteor.call("isAuthenticated","UserManagement","AddUser",(err,res)=>{
        if(err){
          console.log(err);
        }else{
          this.setState({
            // facilityPermission : access("Add Questions","Master Data"),
             facilityPermission : res,
          });
        }
      });
    }

    componentDidMount() {
        if ( !$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type="text/javascript";
          adminLte.src = "/js/adminLte.js";
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

      
    componentWillUnmount(){
        $("script[src='/js/adminLte.js']").remove();
        $("link[href='/css/dashboard.css']").remove();
    }

    createUser(event){
        event.preventDefault();
         
            var formValues = {
                          'firstname'        : this.refs.firstname.value,
                          'lastname'         : this.refs.lastname.value,
                          'signupEmail'      : this.refs.signupEmail.value,
                          'mobNumber'        : this.refs.mobNumber.value,
                          'role'             : $("input[name='roleName']:checked").val(),
                          'signupPassword'   : $("input[name='roleName']:checked").val()+'123',
                          // 'role'             : $("input[name='roleName']:checked").val(),
                        }   

          if(formValues.role){
               Meteor.call('userCreateAccountByAdmin', formValues ,(error,result) => {
                    if(error){
                      // swal(error.reason);
                      swal("Email already exists.","","warning");
                    }else{ 
                      if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){   
                        swal(formValues.role + " Created Successfully","","success");
                    }else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
                        swal("Staff Created Successfully","","success");

                    }
                      // CLEAR ALL FIELDS
                      this.refs.firstname.value      = '';
                      this.refs.lastname.value       = '';
                      this.refs.signupEmail.value    = '';
                      $('#mobNumberUser').val('');


                      // ADD USER ROLE 
                      var newID = result;
                              
                    } //end else
                  });
              return 0; 
            }else{
              swal("Please select User role.");
            }
       

    }

    render() {
      if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
      $('.sidebar').css({display:'block',background: '#222d32'});
      if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
        var showBtn =<div>

                    <label className="examTypecontainer rdbtnlf">
                    <input type="radio"  name="roleName" ref="roleName" value="Admin" onChange={this.handleChange} />
                      <span className="checkmark"></span>
                      <span>Admin</span>
                    </label>

                    <label className="examTypecontainer rdbtnlf">
                      <input type="radio" name="roleName" ref="roleName" value="Franchise" checked onChange={this.handleChange} />
                      <span className="checkmark"></span>
                      <span>Franchise</span>
                    </label>
                                                  
                     </div>
      }else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
        var showBtn = <label className="examTypecontainer rdbtnlf radiobtnnon">
                        <input type="radio" name="roleName" ref="roleName" value="Staff" checked onChange={this.handleChange} />
                        <span className="checkmark"></span>
                        <span>Staff</span>
                      </label>
      }
       return (
            <div>
                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                  {/* Content Header (Page header) */}
                  <section className="content-header">
                    <h1> User Management</h1>
                  </section>
                  {/* Main content */}
                  <section className="content viewContent">
                    <div className="row">
                      <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                        <div className="box">
                         
                          <div className="box-header with-border boxMinHeight">
                            <div className="box-header with-border">
                              {
                                Roles.userIsInRole(Meteor.userId(), ['Franchise'])?
                                <h3 className="box-title">Add New Staff</h3>
                                :
                                <h3 className="box-title">Add New User</h3>
                              }
                            </div>
                            <section className="NotificationContent"><div className="box-body">
                                <div className="col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-10 col-md-offset-1 createUserWrapp userCreateWrap">
                                  <form id="signUpUser" onSubmit={this.createUser.bind(this)}>
                                      <div className="signuppp col-lg-12 col-md-12 col-sm-12 col-xs-12">

                                       <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                            <span className="CSExam">First Name</span>
                                            <span className="blocking-span">
                                                <input type="text" title="Only alphabets are allowed!" onChange={this.handleChange} className={this.state.firstname ? "form-control UMname inputText tmsUserAccForm has-content" : "form-control UMname inputText tmsUserAccForm"} ref="firstname" name="firstname" pattern="[a-zA-Z][a-zA-Z ]+" required />
                                                
                                            </span>
                                        </div>

                                       <div className=" col-lg-6 col-md-6 col-xs-6 col-sm-6 inputContent">
                                            <span className="CSExam">Last Name</span>
                                            <span className="blocking-span">
                                               <input type="text" title="Please enter alphabets only!" onChange={this.handleChange} className={this.state.lastname ? "form-control UMname inputText tmsUserAccForm has-content" : "form-control UMname inputText tmsUserAccForm"} ref="lastname" name="lastname" pattern="[A-Za-z]+" required />
                                               
                                            </span>
                                        </div>

                                        <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 inputContent">
                                            <span className="CSExam">Email ID</span>
                                            <span className="blocking-span">
                                               <input type="email" title="Please match email format e.g. abc@xyz.com" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$" onChange={this.handleChange} className={this.state.signupEmail ? "form-control UMname inputText tmsUserAccForm has-content" : "form-control UMname inputText tmsUserAccForm"} ref="signupEmail" name="signupEmail" required />
                                               
                                            </span>
                                        </div>

                                        <div className=" col-lg-6 col-md-6 col-xs-12 col-sm-6 inputContent">
                                            <span className="CSExam">Mobile Number</span>
                                            <span className="blocking-span">
                                               <InputMask mask="9999-999-999" maskChar=" " pattern="^(0|[1-9][0-9-]*)$" title="Please enter numbers only!" onChange={this.handleChange} className={this.state.mobNumber ? "form-control UMname inputText tmsUserAccForm has-content" : "form-control UMname inputText tmsUserAccForm"} ref="mobNumber" name="mobNumber" id="mobNumberUser" required />
                                               
                                            </span>
                                        </div>
                                        
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 examTypeBtn examTypeBtn1">

                                         {showBtn}
                                          
                                        </div>

                                        <div className=" col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
                                            <input className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn btn-primary pull-right nextForm" type="submit" value="REGISTER"/>
                                       </div>   

                                      </div> 
                                  </form>
                                </div>  
                            </div>
                                
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
        );
      }else if (this.state.facilityPermission == false ){
          return(<div>{FlowRouter.go('/noAccesss')}</div>);
        }else if(this.state.facilityPermission == "waitingforResult"){
          return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
           <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
        </div>);
        }else{ 
        return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
            <h3>You dont have access.</h3>
           </div>);
      }

    } 

}


// export default CreateUser = withTracker(props =>{
//     const postHandle = Meteor.subscribe('TermsandConditions');
//     const loading    = !postHandle.ready();
   
//     // var Terms_ConditionData = InstructionMaster.findOne({"instructionFor":"Terms & Conditions"});
    
//      const postHandle1 = Meteor.subscribe('companyData');
//     const post       = FranchiseDetails.findOne({})||{};
//     const loading1    = !postHandle1.ready();

//     console.log("post-->",post);
//     return{
//         loading,
//         loading1,
//         // Terms_ConditionData,
//         post,
        
//     } 
// })(CreateUser);