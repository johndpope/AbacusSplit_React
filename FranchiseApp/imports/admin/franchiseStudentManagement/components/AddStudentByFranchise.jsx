import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {render} from 'react-dom';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';
// import {FranchiseDetailsMaster} from '/imports/admin/franchiseDetails/api/FranchiseDetailsMaster.js';
import {TempImage} from '/imports/s3/api/ClientImageCall.js';
import InputMask from 'react-input-mask';
import { FranchiseDetails } from '/imports/admin/companySetting/api/CompanySettingMaster.js';

import {Session} from 'meteor/session';
import ReactTable from "react-table";


class AddStudentByFranchise extends TrackerReact(Component) {
  
  constructor(props){
        super(props);
        this.state={
                franchiseName   :'',
                companyId       :'',
                _id              : '',
                studentFirstName : '',
                studentMiddleName: '',
                studentLastName  : '',
                mobileNumber     : '',
                studentDOB       : '',
                schoolName       : '',
                franchiseName    : '',
                franchiseMobileNumber    : '',
                teacherName      : '',
                studentAddress   : '',
                studentCountry   : 'India',
                studentState     : '',
                studentCity      : '',
                pincode          : '',
                category         : '',
                studentEmail     : '',
                genderType       : '',
                franchiseId      : '',
                franchiseCode    : '',
                franchiseUserId:'',
                searchText       : '',
                franchiseIdForReport : '',
                facilityPermission : 'waitingforResult',
                allStudentData   : [],
                "subscription" :{
                   "TempImages"     : Meteor.subscribe("loginImgTempImages"),
                   "allFranchise"   : Meteor.subscribe("allFranchise"),
                  }
        }
        this.handleChange = this.handleChange.bind(this);
    }

  componentDidMount() {

      if ( !$('body').hasClass('adminLte')) {
      // console.log("adminLte.js appended!");
      var adminLte = document.createElement("script");
      adminLte.type = "text/javascript";
      adminLte.src = "/js/adminLte.js";
      adminLte.setAttribute('id','adminLte');
      $("body").append(adminLte);
      }
     
      // $(function() {
      //   $( "#datepicker" ).datepicker({
      //   changeMonth:true,
      //   changeYear:true,
      //   numberOfMonths:[2,2]
      //   });
      // });

      var date = new Date();
      date.setDate(date.getDate());
      $('#my-datepicker').datepicker({ 
          startDate: date
      });
     
      this.getAllStudentDetails();
  }
  
  componentWillMount(){
       Meteor.call("isAuthenticated","FranchiseManagement","AddStudent",(err,res)=>{
      if(err){
        console.log(err);
      }else{
            if(res==true){
              this.setState({
                 facilityPermission : res,
              });
            }else if(res==false){
              this.setState({
                 facilityPermission : res,
              });
            }
      }
    });
    }

  componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
  }

  showCategories(){
      var categorryHandle = Meteor.subscribe("allCategory").ready();
          return CategoryMaster.find({}).fetch();
  }

  studentRegistration(event){
      event.preventDefault();
        // var _id =  FlowRouter.getParam("id");
        if($("input[name='genderType']:checked").val() == 'on'){
          var genderType = 'Male';
        }else{
          var genderType = 'Female';
        }
       
      var studFormValues={
          _id                     : FlowRouter.getParam("id"),
          studentFirstName        : this.refs.studentFirstName.value.trim(),
          studentMiddleName       : this.refs.studentMiddleName.value.trim(),
          studentLastName         : this.refs.studentLastName.value.trim(),
          mobileNumber            : this.refs.mobileNumber.value.trim(),
          studentDOB              : this.refs.studentDOB.value.trim(),
          schoolName              : this.refs.schoolName.value.trim(),
          franchiseName           : this.state.franchiseName,
          franchiseUserId         :  Meteor.userId(),
          companyId               : this.state.companyId,
          franchiseMobileNumber   : this.refs.franchiseMobileNumber.value.trim(),
          studentAddress          : this.refs.studentAddress.value.trim(),
          studentCountry          : this.refs.studentCountry.value.trim(),
          studentState            : this.refs.studentState.value.trim(),
          studentCity             : this.refs.studentCity.value.trim(),
          pincode                 : this.refs.pincode.value.trim(),
          category                : this.refs.category.value.trim(),
          studentEmail            : this.refs.studentEmail.value.trim(),
          // genderType              : $("input[name='genderType']:checked").val(),
          genderType              : this.state.genderType,
          'signupPassword'        : "student123",
          'firstname'             : this.refs.studentFirstName.value.trim(),
          'lastname'              : this.refs.studentLastName.value.trim(),
          'signupEmail'           : this.refs.studentEmail.value.trim(),
          'mobNumber'             : this.refs.mobileNumber.value.trim(),
      }
      Meteor.call("getProfilePic",studFormValues._id,(err,res)=>{
      if(err){
      }else{  
      // console.log("exist pic",res);
        if(res=="ImgFound"){
                var dateofBirth = new Date(studFormValues.studentDOB);
                  var today = new Date;
                  var age = Math.floor((today-dateofBirth)/(365.25*24*60*60*1000));
                  if(age>0){
                          // console.log("Formvalues.companyid==>>",studFormValues);
                      Meteor.call('userCreateAccountByAdmin',studFormValues,(error,result) => {
                            if(error){
                              console.log("error ",error);
                              swal("Email Id already exist","","warning");  
                            }else{
                              var newID = result;
                              if(newID){
                                Meteor.call('addRoles', newID , "Student", function(error,result){
                                    if(error){
                                      swal(error);
                                    }else{               
                                      swal('Congratulations!! Account Created...',"","success");
                                    }
                                });
                                Meteor.call("addStudentRegistration",studFormValues,age,newID,(error,result)=>{
                                  if(error){

                                  }else{
                                      if(studFormValues._id){
                                          swal("Profile Updated Successfully","","success");
                                          // FlowRouter.go('/Admin/ListOfStudents');
                                          if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){

                                              FlowRouter.go('/admin/addStudentByFranchise');

                                          }else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){

                                              FlowRouter.go('/franchise/addStudentByFranchise');
                                          }
                                                    // FloRouter.go('/admin/addStudentByFranchise');
                                      }else{
                                        swal("Your Profile Registered Successfully","","success");
                                            if(Roles.userIsInRole(Meteor.userId(), ['admin','superAdmin'])){

                                                FlowRouter.go('/admin/addStudentByFranchise/:id');

                                            }else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){

                                                FlowRouter.go('/franchise/addStudentByFranchise');
                                            }
                                           
                                            var toEmailId   = studFormValues.studentEmail;
                                            var fromEmailId = 'support@maats.in';
                                            var subject     = 'Abacus Online Exam Registration';
                                            var body        = 'Hello '+studFormValues.studentFirstName+'\n'+"Congratulations!!!"+'\n'+'\n'+"Student "+studFormValues.studentFirstName+' '+ studFormValues.studentMiddleName+' '+studFormValues.studentLastName+' has been registered for Abacus Online Exam Successfully.'+'\n'+'Please login using username: ' +toEmailId+ ' and your password is : student123 .' +'\n'+'Click on this link to continue : http://exam.maats.in/ ' +'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
            	                            	Meteor.call('RegistrationEmail',toEmailId,fromEmailId,subject,body);
                                              $("input[name=studentFirstName]").val('');    
                                              $("input[name=studentMiddleName]").val('');     
                                              $("input[name=studentLastName]").val('');     
                                              $("input[name=studentDOB]").val('');     
                                              $("input[name=schoolName]").val('');      
                                              
                                              // $("input[name=genderType]").val('');     
                                              $("input[name=mobileNumber]").val('');      
                                              $("input[name=studentEmail]").val('');     
                                              $("input[name=studentAddress]").val('');      
                                              
                                              $("input[name=studentCountry]").val('');      
                                              $("input[name=city]").val('');      
                                              $("input[name=state]").val('');     
                                              $("input[name=zipCode]").val('');     
                                              $("input[name=countryname]").val('');     
                                              
                                              $("input[name=studentCity]").val('');     
                                              $("input[name=pincode]").val('');     
                                              $("input[name=category]").val(''); 
                                        }
                                      }
                                  });
                                }//newID if
                              }
                            });
                     
                  }else{
                      swal("Your age must be 1 year old","","warning");  
                  }

                  }else{
                swal("Please upload profile Image");
              }
            }
          });


  }

  componentWillReceiveProps(nextProps){
      if(nextProps.FranchiseStudentData){
          this.setState({
              // _id               : nextProps.studentData._id,
              studentFirstName  : nextProps.FranchiseStudentData.studentFirstName,
              studentMiddleName : nextProps.FranchiseStudentData.studentMiddleName,
              studentLastName   : nextProps.FranchiseStudentData.studentLastName,
              mobileNumber   : nextProps.FranchiseStudentData.mobileNumber,
              studentDOB     : nextProps.FranchiseStudentData.studentDOB,
              schoolName     : nextProps.FranchiseStudentData.schoolName,
              franchiseName  : nextProps.FranchiseStudentData.franchiseName,
              studentAddress : nextProps.FranchiseStudentData.studentAddress,
              studentCountry : nextProps.FranchiseStudentData.studentCountry,
              studentState   : nextProps.FranchiseStudentData.studentState,
              studentCity    : nextProps.FranchiseStudentData.studentCity,
              pincode        : nextProps.FranchiseStudentData.pincode,
              category       : nextProps.FranchiseStudentData.category,
              studentEmail   : nextProps.FranchiseStudentData.studentEmail,
              genderType     : nextProps.FranchiseStudentData.genderType,
               

               
               
         });
          // this.handleChange = this.handleChange.bind(this);

        }
       if(nextProps.franchisedetailsdata){
          this.setState({
              franchiseName               :   nextProps.franchisedetailsdata.franchiseName,
              companyId                   :   nextProps.franchisedetailsdata.companyId,
              franchiseMobileNumber       :   nextProps.franchisedetailsdata.contactNo,
         
           });
      }

       this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event){
    const target = event.target;
    const name = target.name;
    this.setState({
     [name]: event.target.value,
    });
    if(name=="franchiseName"){
        var franchiseID=event.target.value;
        
        var selectedFranchiseData=FranchiseDetails.findOne({"franchiseName":franchiseID});
       

        this.setState({
          franchiseId            :selectedFranchiseData._id,
          franchiseName          :selectedFranchiseData.franchiseName,
          franchiseUserId        :selectedFranchiseData.franchiseCodeForCompanyId
      });
    }
  }
  

  uploadStudentImage(event){
     event.preventDefault();
     let self = this;
     if (event.currentTarget.files && event.currentTarget.files[0]) {
     var file = event.currentTarget.files[0];
     if (file) {
     addProductImgsToS3Function(file,self);
          }
        }
      }

    // gendertyp(){
    //     var gender =;
    //     if(TempIamge){
    //         return TempIamge.imagePath;
    //     }else{
    //        return '/images/addLogo1.png';
    //     }
    // }
    StudentImage(){
        var TempIamge = TempImage.findOne({"userId": Meteor.userId()});
        if(TempIamge){
            return TempIamge.tempPath;
            // return TempIamge.imagePath;
        }else{
           return '/images/addLogo1.png';
        }
    }

    removeStudProfPhoto(){
        swal({
             title             : 'Are you sure?',
             text              : 'You will not be able to recover this Profile Photo!',
             type              : 'warning',
             showCancelButton  : true,
             closeOnConfirm    : false,
             confirmButtonColor: '#dd6b55',
             cancelButtonColor : '#d44',
             confirmButtonText : 'Yes, Delete it!',
             cancelButtonText  : 'No, Keep it',
             closeOnConfirm    : false
            }, function() {
                Meteor.call("removeprofPhoto",Meteor.userId(),(error,result)=>{
                    if(error){

                    }else{

                        swal(
                     'Profile Photo has been Deleted',
                     '',
                     'success'
                      );
                    }
                });
         
      });
       
    }

    getUploadServicesPercentage(){
      var uploadProgressPercent = Session.get("imageprogress");
      if (uploadProgressPercent) {
          var percentVal = parseInt(uploadProgressPercent);
          if (percentVal) {

              var styleC = {
                  width: percentVal + "%",
                  display: "block",
                  height: "8px",
              }
              var styleCBar = {
                  display: "block",
                  marginTop: 117,
                  height: "8px",
              }
          }
          if (!percentVal) {
            var percentVal = 0;

            var styleC = {
                width: 0 + "%",
                display: "none",
                height: "8px",
            }
            var styleCBar = {
                display: "none",
                marginTop: 117,
                height: "8px",
            }
          }

          if (percentVal == 100) {
            var percentVal = 0;

            var styleC = {
                width: 0 + "%",
                display: "none",
                height: "8px",
            }
            var styleCBar = {
                display: "none",
                marginTop: 117,
                height: "8px",
            }
  }
  return (
    <div>
      <div className="progress col-lg-12" style= {styleCBar}>
        <div className="progress-bar progress-bar-striped active" role="progressbar"
          aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style= {styleC}>
        </div>
      </div>
    </div>
    );
  }
    }

    showhideCatDetails(event){
        $('.categoryListDataStud').toggleClass('categoryListDataStudshow');
    }
  
    removeStudentDetails(event){
      event.preventDefault();
     var id = $(event.target).attr('id');
     var studentUser=StudentMaster.findOne({"_id":id});
     var studentID=studentUser.studentId;
     Meteor.call("deleteUser",   studentID,(error, result)=>{
      });
     swal({
             title             : 'Are you sure?',
             text              : 'You will not be able to recover this Record!',
             type              : 'warning',
             showCancelButton  : true,
             closeOnConfirm    : false,
             confirmButtonColor: '#dd6b55',
             cancelButtonColor : '#d44',
             confirmButtonText : 'Yes, Delete it!',
             cancelButtonText  : 'No, Keep it',
             closeOnConfirm    : false
        },function(){
            Meteor.call("removeStudent",id,(error,result)=>{
                if(error){

                }else{
                    swal(
                     'Student Record has been Deleted',"","success"
               
                  );
                   
                }
            });
      });
    }

    buildRegExp(searchText) {
     var words = searchText.trim().split(/[ \-\:]+/);
     var exps = _.map(words, function(word) {
     return "(?=.*" + word + ")";
       });

     var fullExp = exps.join('') + ".+";
     return new RegExp(fullExp, "i");
    }

    getTextValue(event){
        var searchName= $('.SearchStudent').val();
        if(searchName){
            var RegExpBuildValue = this.buildRegExp(searchName);
            this.setState({
                searchText   : RegExpBuildValue,
            },()=>{this.getAllStudentDetails()});
        }else{
            this.setState({
                searchText   : '',
            },()=>{this.getAllStudentDetails()});
        }
    }
    getAllStudentDetails(){
            if(!this.state.searchText){               
                Meteor.call("allStudent",(err,res)=>{
                    if(err){
                        // console.log(error);
                    }else{
                       
                        this.setState({'allStudentData':res});
                    }
                })

            }else{
       
                Meteor.call("SearchStudent",this.state.searchText,(err,res)=>{
                    if(err){
                        // console.log(error);
                    }else{
                        this.setState({'allStudentData':res});
                    }
                })
            }
       
    }

  render(){
    if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
      $('.sidebar').css({display:'block',background: '#222d32'});
      if(this.state.studentDOB){
        var studentBirthDate = moment(this.state.studentDOB).format("MM/DD/YYYY");
      }
     // $(function() {
     //    $( "#my-datepicker" ).datepicker({
     //       changeMonth:true,
     //       changeYear:true,
     //       numberOfMonths:[2,2]
     //    });
     // });

    return(
      <div>
            {/* Content Wrapper. Contains page content */}
            <div className="content-wrapper">
              {/* Content Header (Page header) */}
              <section className="content-header">
                <h1 className="stud">Student Registration Form</h1>
              </section>
              {/* Main content */}
              <section className="content viewContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    <div className="box">
                      <div className="box-header with-border boxMinHeight">
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                          <form onSubmit={this.studentRegistration.bind(this)}>
                         {/* <div className="col-lg-12 col-md-12 col-sm-12">
                            <div className="col-lg-6 col-md-6 col-sm-12 studHeadingWrappp"><span className="studHeadingWrap"> Instructions</span></div>
                           
                           
                             <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12 ">
                             <span className="studHeadingWrap col-lg-12  col-md-12  col-xs-6 col-sm-6 imageUploadLabel">
                              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> Upload Profile Picture</span>
                              <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageSize imagetype"> (Image Size :700 KB - jpg/png/jpeg)</span>
                            </span>*/}

                            <div className="col-lg-12 col-md-12 col-sm-12 studHeadingWrappp">
                              <span className="studHeadingWrap col-lg-6 col-md-6 col-xs-6 col-sm-6"> Instructions</span>
                              <span className="studHeadingWrap col-lg-6 col-md-6 col-xs-6 col-sm-6 imageUploadLabel">
                                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> Upload Profile Picture</span>
                                <span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageSize imagetype"> (Image Size :700 KB - jpg/jpeg/png)</span>
                              </span>
                            </div>
                         
                            <div className="col-lg-6 col-md-6 col-sm-6 instructionWrap">
                              {this.props.studInstruction.instruction}
                            </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 imageSize1 instructionWrap1">
                              <div className="col-lg-4 col-md-4 col-sm-4 col-xs-3 pull-right">
                               
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 photoWrapper1 custPhotoWrap1addstud">
                                  {this.StudentImage() ==='/images/addLogo1.png'? <i className="" aria-hidden="true" title="First Add Photo"/>
                                  :
                                  <i className="fa fa-times removeprofPhoto" aria-hidden="true" title="Remove Photo" onClick={this.removeStudProfPhoto.bind(this)}></i>
                                }
                                    <div className="col-lg-12 col-md-12 col-sm-12ClientImgWrap1 displayBlockOne">
                                      {this.StudentImage() ==='/images/addLogo1.png' ?  <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2 col-md-2 col-sm-2   styleUpload" title="Add Profile Photo">
                                        <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-12 browseDoc" accept="image/x-png,image/jpeg,image/pdf,image/jpg" onChange={this.uploadStudentImage.bind(this)}/> </i>
                                      :<i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2  styleUpload" title="Change Profile Photo">
                                   
                                        <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 browseDoc" accept="image/x-png,image/jpeg,image/pdf,image/jpg" onChange={this.uploadStudentImage.bind(this)}/>
                                      </i>
                                    }
                                    </div>

                                    {<img className="col-lg-12 col-md-12 col-sm-12 ClientImgWrap1 displayLogoOne" src={this.StudentImage()?this.StudentImage() :"/images/loading.gif"}/>}
                                    {this.getUploadServicesPercentage()}
                                
                                  </div>

                              </div>
                              </div>
                            
                          
                 
                          <div className="col-lg-12 col-md-12 col-sm-12">
                          <div className="col-lg-12 col-md-12 col-sm-12 studPerInfoWrap studHeadingWrap">Personal Information</div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                                <input type="text" name="studentFirstName" ref="studentFirstName" value={this.state.studentFirstName} onChange={this.handleChange} className={this.state.studentFirstName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z]+" title="Enter First Name (Numbers. are not allowed)" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">First Name<label className="requiredsign">*</label></span>                 
                              </span>
                              <input type="hidden" name="_id" ref="_id" value={this.state._id}/>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                                <input type="text" name="studentMiddleName" ref="studentMiddleName" value={this.state.studentMiddleName} onChange={this.handleChange} className={this.state.studentMiddleName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z]+" title="Enter Middle Name (Nos. are not allowed)" autoComplete="off"/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">Middle Name</span>                
                              </span>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                                <input type="text" name="studentLastName" ref="studentLastName" value={this.state.studentLastName} onChange={this.handleChange} className={this.state.studentLastName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z]+" title="Enter Last Name (Numbers. are not allowed)"  autoComplete="off" />
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">Last Name{/*<label className="requiredsign">*</label>*/}</span>                
                              </span>
                            </div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                            <span className="defaultLabelOes defaultLabelOesE">Date of Birth<label className="requiredsign">*</label></span>
{/*                               <input type="text" name="studentDOB" ref="studentDOB" value={this.state.studentDOB}  onChange={this.handleChange} id="my-datepicker" data-provide="datepicker" className={this.state.studentDOB ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} autoComplete="off" readOnly required/>
*/}
                              <input type="text" name="studentDOB" ref="studentDOB" value={studentBirthDate} onChange={this.handleChange} id="my-datepicker" data-provide="datepicker" className={this.state.studentDOB ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText "} required/>                 
                              </span>
                            </div>
                          
                          </div>
                         
                          <div className="col-lg-12 col-md-12 col-sm-12">

                            <div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">
                              <span className="blocking-span">
                                <input type="text" name="schoolName" ref="schoolName" value={this.state.schoolName} onChange={this.handleChange} title="Enter School Name" className={this.state.schoolName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">School Name<label className="requiredsign">*</label></span>                
                              </span>
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 examTypeBtn  ">

                              <div className="col-lg-12 col-md-12 col-sm-6 col-xs-12">
                                {/*<label className="switch3">
                                  <input className="switch-input" ref="genderType" name="genderType" onChange={this.handleChange.bind(this)} type="checkbox" />
                                  <span className="switch-label" data-on="Male" data-off="Female "></span> 
                                  <span className="switch-handle"></span> 
                               </label>
                               <label className="switchyes">
                                <input className="switch-input" ref="genderType" name="genderType" onChange={this.handleChange.bind(this)} type="checkbox"/>
                                  <div className="slideryes roundyes">
                                    <span className="yes">Female</span>
                                    <span className="no">Male</span>
                                  </div>
                              </label>*/}

                              <div className="switch-field ">
                                <input type="radio" id="switch_left" name="genderType" value="Female" checked={this.state.genderType === 'Female'} onChange={this.handleChange.bind(this)} />
                                <label htmlFor="switch_left">Female</label>
                                <input type="radio" id="switch_right" name="genderType" value="Male" checked={this.state.genderType === 'Male'} onChange={this.handleChange.bind(this)} />
                                <label htmlFor="switch_right">Male</label>
                              </div>
                            </div>                             
                            </div>
                           
                          </div>

                          <div className="col-lg-12 col-ms-12 col-sm-12 col-xs-12">
                            <div className="col-lg-12 col-md-12 col-sm-12 studPerInfoWrap studHeadingWrap">Contact Details</div>
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                                <InputMask mask="9999-999-999" maskChar=" " name="mobileNumber" ref="mobileNumber" value={this.state.mobileNumber} onChange={this.handleChange} className={this.state.mobileNumber ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="^(0|[0-9-+]*)$" title="Enter Numbers!" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">Mobile Number<label className="requiredsign">*</label></span>                
                              </span>
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                                <input type="email" name="studentEmail" ref="studentEmail" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" value={this.state.studentEmail} onChange={this.handleChange} className={this.state.studentEmail ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"}  title="Enter Email!" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">Email<label className="requiredsign">*</label></span>                
                              </span>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                              <span className="blocking-span">
                                <input type="text" name="studentAddress" ref="studentAddress" value={this.state.studentAddress} onChange={this.handleChange} title="Enter Address" className={this.state.studentAddress ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 col-lg-12 col-md-12 col-sm-12 floating-label">Student Address<label className="requiredsign">*</label></span>                
                              </span>
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                                <input type="text" name="studentCountry" ref="studentCountry" value={this.state.studentCountry} onChange={this.handleChange} className={this.state.studentCountry ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z]+" title="Only Alphabets Are Allowed!" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 col-lg-12 col-md-12 col-sm-12 floating-label">Country<label className="requiredsign">*</label></span>                
                              </span>
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
                              <span className="blocking-span">
                             
                                <input type="text" name="studentState" ref="studentState" value={this.state.studentState} onChange={this.handleChange} className={this.state.studentState ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z][a-zA-Z ]+" title="Only Alphabets Are Allowed!" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 col-lg-12 col-md-12 col-sm-12 floating-label">State<label className="requiredsign">*</label></span>                
                                             
                              </span>
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                              <span className="blocking-span">
                                <input type="text" name="studentCity" ref="studentCity" value={this.state.studentCity} onChange={this.handleChange} className={this.state.studentCity ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z][a-zA-Z ]+" title="Only Alphabets Are Allowed!" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">City<label className="requiredsign">*</label></span>                 
                              </span>
                            </div>

                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                              <span className="blocking-span">
                                <InputMask mask="999-999" maskChar=" " name="pincode" ref="pincode" value={this.state.pincode} onChange={this.handleChange} className={this.state.pincode ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"}  pattern="^(0|[0-9-]*)$" title="Enter Numbers!" autoComplete="off" required/>
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label">Pincode<label className="requiredsign">*</label></span>                
                              </span>
                            </div>
                          </div>
                         
                          <div className="col-lg-12 col-md-12 col-sm-12">    
                            <div className="col-lg-12 col-md-12 col-sm-12 studPerInfoWrap studHeadingWrap">Exam</div>
                           
                            <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
                              <span className="helpSecSR" title="Help" onClick={this.showhideCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>
                                <div className="categoryListDataStud">
                                  <label>A</label> : Without formulae & without Instrument<br/>
                                  <label>B</label> : 34 formulae & without Instrument<br/>
                                  <label>C</label> : All formulae & without Instrument<br/>
                                  <label>D</label> : Without Instrument & Multiplication Sum<br/>
                                </div>                  
                              <span className="blocking-span"> 
                              {/*{this.state.category ? */}
                                <select type="text" name="category" ref="category" value={this.state.category} className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" title="Select Category"  value={this.state.category} onChange={this.handleChange} autoComplete="off" required>
                                  <option value='' disabled>-- Select Exam Category --</option>
                                  {this.showCategories().map((categories,index)=>{
                                    return <option key={index}>{categories.categoryName}</option>
                                    })
                                  }
                                </select>
                             
                                <span className="col-lg-12 col-md-12 col-sm-12 floating-label col-lg-12 col-md-12 col-sm-12 floating-label-Date">Exam Category</span>
                              </span>
                            </div>

                            <div className="col-lg-12 col-md-12 col-sm-12 franchdetailscol">

                                <div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                                    <span className="blocking-span">
                                        <span className="col-lg-12 col-md-12 col-sm-12  franchisedis ">Franchise ID</span>                             
                                        <input type="text" name="companyId" ref="companyId" value={this.state.companyId} onChange={this.handleChange} title="Enter Address" className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" disabled required/>
                                    </span>
                                </div>
                                <div className="col-lg-4 col-md-5 col-sm-5 col-xs-12">
                                      <span className="blocking-span">
                                            <span className="col-lg-12 col-md-12 col-sm-12  franchisedis ">Franchise Name</span>                               
                                            <input type="text" name="franchiseName" ref="franchiseName" value={this.state.franchiseName} onChange={this.handleChange} title="Enter Address" className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" disabled required/>
                                      </span>
                                </div>
                                <div className="col-lg-4 col-md-3 col-sm-3 col-xs-6">
                                    <span className="blocking-span">
                                        <span className="col-lg-12 col-md-12 col-sm-12 franchisedis ">Franchise Mobile </span>                            
                                        <InputMask mask="9999-999-999" maskChar=" " name="franchiseMobileNumber" ref="franchiseMobileNumber" value={this.state.franchiseMobileNumber} onChange={this.handleChange} className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" pattern="^(0|[0-9-+]*)$" title="Enter Franchise Numbers!" autoComplete="off" disabled required/>
                                    </span>
                                </div>
                                            
                            </div>
                            <div className="col-lg-3 col-lg-offset-5 col-md-6 col-sm-6 col-xs-6">
                              <button className="btn studRegister">Confirm & Register</button>
                            </div>
                 
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

 }else if (this.state.facilityPermission == false ){
          FlowRouter.go('/noAccesss')
      }else if(this.state.facilityPermission == "waitingforResult"){
        return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
         <img className=" loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
      </div>);
      }else{ 
      return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
        <h3>You don't have access. Please contact admin.</h3></div>);
    }
  }
}
export default CreateStudentContainer = withTracker(props=>{
    var _id = FlowRouter.getParam("id");
    var FranchiseStudentData = StudentMaster.findOne({"_id":_id});
    // console.log("FranchiseStudentData",FranchiseStudentData);
    const postHandle2   = Meteor.subscribe("instruction_Stud");
    const loadingTest2  = !postHandle2.ready();
    var studInstruction = InstructionMaster.findOne({"instructionFor" : "Student Registration"})||{};
    const franchisedatadetils1    = Meteor.subscribe("LoginInFranchiseData",Meteor.userId());
    const loadingfranchisedetails = !franchisedatadetils1.ready();
    var franchisedetailsdata      = FranchiseDetails.findOne({"franchiseCodeForCompanyId":Meteor.userId()});

    if(FranchiseStudentData){
        $('.studRegister').html('Confirm & Update');
    }else{
        $('.studRegister').html('Confirm & Register');
    }
    return{
        FranchiseStudentData,
        studInstruction,
        loadingfranchisedetails,
        franchisedetailsdata,
    }  
})(AddStudentByFranchise);
