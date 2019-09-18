import React, {Component} from 'react';
import {Meteor} 		  from 'meteor/meteor';
import {Mongo} 			  from 'meteor/mongo';
import {render} 		  from 'react-dom';
import { FlowRouter }     from 'meteor/ostrio:flow-router-extra';
import {withTracker} 	  from 'meteor/react-meteor-data';
import TrackerReact 	  from 'meteor/ultimatejs:tracker-react';
import {CategoryMaster}   from '/imports/admin/forms/addCategory/api/categoryMaster.js';
// import {StudentMaster} 	  from '/imports/admin/forms/student/api/studentMaster.js';
import {StudentMaster} 	  from '/imports/student/api/studentMaster.js';
import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';
import {TempImage} 		  from '/imports/s3/api/ClientImageCall.js';
import InputMask 		  from 'react-input-mask';
import {Session} 		  from 'meteor/session';
import ProfilePic         from './ProfilePic.jsx';
class CreateStudentRegistration extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
				_id              : '',
				studentFirstName : '',
				studentMiddleName: '',
				studentLastName  : '',
	  			mobileNumber     : '',
	  			studentDOB       : '',
	  			schoolName       : '',
	  			franchiseName    : '',
	  			franchiseCode:'',
	  			franchiseMobileNumber : '',
	  			franchiseId      : '',
	  			franchise_Id:'',
	  			studentAddress   : '',
	  			studentCountry   : '',
	  			studentState     : '',
	  			studentCity      : '',
	  			pincode          : '',
	  			category         : '',
	  			categoryDisabled : '',
	  			studentEmail     : '',
	  			genderType       : '',
	  			profileEditStatus: false,
	  			facilityPermission : 'waitingforResult',
	  			franchiseName           : '',
	  			franchiseUserId        : '',
	  			gender       : true,
	  			companyId:'',
	  			"subscription"   :{
			        "TempImages" : Meteor.subscribe("loginImgTempImages"),
			      }
		}
		this.handleChange = this.handleChange.bind(this);
		this.getFranchiseId = this.getFranchiseId.bind(this);
	}

	componentDidMount() {

      if ( !$('body').hasClass('adminLte')) {
          var adminLte = document.createElement("script");
          adminLte.type = "text/javascript";
          adminLte.src = "/js/adminLte.js";
          adminLte.setAttribute('id','adminLte');
          $("body").append(adminLte);
        }
     
       // $(function() {
       //      $( "#my-datepicker" ).datepicker({
       //         changeMonth:true,
       //         changeYear:true,
       //         numberOfMonths:[2,2]
       //      });
       //   });
     var date = new Date();
      date.setDate(date.getDate());
      $('#my-datepicker').datepicker({ 
          startDate: date
      });

    $('.gender').click(function() {
    $(this).find('.btn').toggleClass('active');  
    if ($(this).find('.btn-primary').length>0) {
    	$(this).find('.btn').toggleClass('btn-primary');
    }
    	$(this).find('.btn').toggleClass('btn-default');
	});

$('form').submit(function(){
	// alert($(this["options"]).val());
    return false;
});
// console.log("in didi mount",Meteor.userId());
		// $('.updateaccess').addAttr('disabled');
		// $(".updateaccess").attr("disabled", true);
		Meteor.call("getUpdateStatus",Meteor.userId(),(err,res)=>{
		   if(err){

		   }else{ 	
		  	if(res){
		  		// console.log("res.profileEditStatus",res.profileEditStatus);
			  	if(res.profileEditStatus=="Active"){
					this.setState({profileEditStatus : false});
				}else if(res.profileEditStatus=="Blocked"){
					this.setState({profileEditStatus : true});
				}else if(res.profileEditStatus==""){
					this.setState({profileEditStatus : true});
				}
			}


		   }
		});


  	}

  	componentWillMount(){
  		 Meteor.call("isAuthenticated","MyAccount","RegistrationForm",(err,res)=>{
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
    	// Meteor.call("DontAllowStudentProfileUpdate",Meteor.userId(),(err,res)=>{
     //      if(err){

     //      }else{
          	
     //      }
     //    });
	}
  	
	/*
		show Categories 
	*/
	showCategories(){
		var categorryHandle = Meteor.subscribe("allCategory").ready();
			return CategoryMaster.find({}).fetch();	
	}

  	studentRegistration(event){
  		event.preventDefault();
  		// if(this.state.profileEditStatus==false){

  		if(this.state.gender=true){
  			if($("input[name='genderType']:checked").val() == 'on'){
	          var genderType = 'Female';
	        }else{
	          var genderType = 'Male';
	        }
  		}else{
  			if($("input[name='genderType']:checked").val() == 'on'){
	          var genderType = 'Male';
	        }else{
	          var genderType = 'Female';
	        }
  		}
  		studFormValues={
  			_id                		: this.refs._id.value.trim(),
  			studentFirstName   		: this.refs.studentFirstName.value.trim(),
  			studentMiddleName  		: this.refs.studentMiddleName.value.trim(),
  			studentLastName    		: this.refs.studentLastName.value.trim(),
  			mobileNumber       		: this.refs.mobileNumber.value.trim(),
  			studentDOB         		: this.refs.studentDOB.value.trim(),
  			schoolName         		: this.refs.schoolName.value.trim(),
  			franchiseUserId       	: this.state.franchiseUserId,
  			companyId   	   		: this.refs.franchiseId.value.trim(),
  			franchiseName      		: this.refs.franchiseName.value,
  			franchiseMobileNumber   : this.refs.franchiseMobileNumber.value,
  			studentAddress 			: this.refs.studentAddress.value.trim(),
  			studentCountry 			: this.refs.studentCountry.value.trim(),
  			studentState   			: this.refs.studentState.value.trim(),
  			studentCity    			: this.refs.studentCity.value.trim(),
  			pincode        			: this.refs.pincode.value.trim(),
  			category       			: this.refs.category.value.trim(),
  			studentEmail   			: this.refs.studentEmail.value.trim(),
          	genderType              : this.state.genderType,  			
  			// genderType     : $("input[name='genderType']:checked").val(),
  		}
  		console.log("studFormValues = ",studFormValues);
  		Meteor.call("getProfilePic",studFormValues._id,(err,res)=>{
		  if(err){
		  }else{  
		  	// console.log("exist pic",res);
		  	if(res=="ImgFound"){
		  		if(studFormValues.franchiseName && studFormValues.franchiseMobileNumber ){
		  		var dateofBirth = new Date(studFormValues.studentDOB); 
				var today = new Date;
				var age = Math.floor((today-dateofBirth)/(365.25*24*60*60*1000));
				if(age>0){
					if(studFormValues._id){
						Meteor.call("addStudentRegistration",studFormValues,age,Meteor.userId(),(error,result)=>{
				  			if(error){
				  				console.log("error student insert",error);
				  			}else{
				  				if(result=="franchiseUserIdNotFound"){
			  					swal("Some Network issue. Please submit one more time","","warning");
			  				}else{
			  					swal("Profile Updated Successfully","","success");

			  					Meteor.call("updateUserCredential",Meteor.userId(),studFormValues,(err,res)=>{
						          if(err){

						          }else{
						          	// console.log("User updated Successfully");
						          	
						          }
						        });
			  					Meteor.call("DontAllowStudentProfileUpdate",Meteor.userId(),(err,res)=>{
						          if(err){

						          }else{
						          	
						          }
						        });
			  					FlowRouter.go('/myProfile');
			  					}
			  				}
		  				});
					}else{
					swal({
					  title             : 'Are you sure?',
					  text              : 'You will not be able to change franchise after registration!',
					  // text              : 'You will not be able to change exam category & franchise after registration!',
					  type              : 'warning',
					  showCancelButton  : true,
					  closeOnConfirm    : false,
					  confirmButtonColor: '#dd6b55',
					  cancelButtonColor : '#d44',
					  confirmButtonText : 'Yes, Continue!',
					  cancelButtonText  : 'No',
					  closeOnConfirm    : false
					}, function() {


					Meteor.call("credentialExists",studFormValues,(err,res)=>{
					      if(err){

					      }else{
					      	// console.log("exist res",res);
					      	if(res){
					      		if(res=='Not Exists'){
					      				Meteor.call("addStudentRegistration",studFormValues,age,Meteor.userId(),(error,result)=>{
								  			if(error){
								  				console.log("error student",error);
								  			}else{
								  				if(result=="franchiseUserIdNotFound"){
								  					swal("Some Network issue. Please submit one more time","","warning");
								  				}else{
								  					Meteor.call("updateUserCredential",Meteor.userId(),studFormValues,(err,res)=>{
											          if(err){

											          }else{
											          	// console.log("User updated Successfully");
											          	
											          }
											        });
											         Meteor.call("DontAllowStudentProfileUpdate",Meteor.userId(),(err,res)=>{
								                          if(err){

								                          }else{
								                            
								                          }
								                        });
								  					swal("Your Profile Registered Successfully",
								  						"",
								  						"success");
								  					FlowRouter.go('/myProfile');
								  					var toEmailId   = studFormValues.studentEmail;
													var fromEmailId = 'support@maats.in';
													var subject     = 'Abacus Online Exam Registration';
													var body        = 'Hello '+studFormValues.studentFirstName+'\n'+"Congratulations!!!"+'\n'+'\n'+"Student "+studFormValues.studentFirstName+' '+ studFormValues.studentMiddleName+' '+studFormValues.studentLastName+' has been registered for Abacus Online Exam Successfully.'+'\n'+'Please login using username: ' +toEmailId+ ' and password which you have set while registering.' +'\n'+'\n'+'Thanks and Regards'+'\n'+'Abacus Online Exam';
													Meteor.call('RegistrationEmail',toEmailId,fromEmailId,subject,body);
												}
								  			}
								  		});


					      		}else{
					      			swal("This Email Id or Mobile number already exists.");
					      		}
					      	}
					      	
					      }
					});

			  	  });
				}
			  	}else{
			  		swal("Your age must be 1 year old","","warning");	
			  	}
			  }else{
			  	Bert.alert("Franchise name and franchise mobile number required","danger");
			  }
	  }	else{
	  	swal("Please upload profile Image");
		  }
	  }
		});




  	}

  	componentWillReceiveProps(nextProps){
  		if(nextProps){  
  				
  			if(nextProps.studentData.genderType=="Female"){
  				this.setState({gender:false});
  			}else{
  				null
  			}
  			// $("input[name=nextProps.studentData.genderType]:checked") == 'on');
  			
  			if(!nextProps.studentData._id){
  				this.setState({
  				_id               : nextProps.studentData._id,
  				studentFirstName  : nextProps.profileData.firstname,
  				studentMiddleName : nextProps.studentData.studentMiddleName,
  				studentLastName   : nextProps.profileData.lastname,
	  			// StudParentName : nextProps.studentData.StudParentName,
	  			mobileNumber   	  : nextProps.profileData.mobNumber,
	  			studentDOB        : nextProps.studentData.studentDOB,
	  			schoolName        : nextProps.studentData.schoolName,
	  			franchiseName     : nextProps.studentData.franchiseName,
	  			franchiseId       : nextProps.studentData.companyId,
	  			franchiseMobileNumber  : nextProps.studentData.franchiseMobileNumber,
	  			// teacherName     : nextProps.studentData.teacherName,
	  			studentAddress : nextProps.studentData.studentAddress,
	  			studentCountry : nextProps.studentData.studentCountry,
	  			studentState   : nextProps.studentData.studentState,
	  			studentCity    : nextProps.studentData.studentCity,
	  			pincode        : nextProps.studentData.pincode,
	  			category       : nextProps.studentData.category,
	  			categoryDisabled : 'disabled',
	  			studentEmail   : nextProps.profileData.emailId,
	  			genderType     : nextProps.studentData.genderType,
	  			gender 		   : true,

  			});

  			}else{
  				this.setState({
  				_id               : nextProps.studentData._id,
  				studentFirstName  : nextProps.studentData.studentFirstName,
  				studentMiddleName : nextProps.studentData.studentMiddleName,
  				studentLastName   : nextProps.studentData.studentLastName,
	  			// StudParentName : nextProps.studentData.StudParentName,
	  			mobileNumber   	  : nextProps.studentData.mobileNumber,
	  			studentDOB        : nextProps.studentData.studentDOB,
	  			schoolName        : nextProps.studentData.schoolName,
	  			franchiseName     : nextProps.studentData.franchiseName,
	  			franchiseId       : nextProps.studentData.companyId,
	  			franchiseMobileNumber  : nextProps.studentData.franchiseMobileNumber,
	  			// teacherName     : nextProps.studentData.teacherName,
	  			studentAddress : nextProps.studentData.studentAddress,
	  			studentCountry : nextProps.studentData.studentCountry,
	  			studentState   : nextProps.studentData.studentState,
	  			studentCity    : nextProps.studentData.studentCity,
	  			pincode        : nextProps.studentData.pincode,
	  			category       : nextProps.studentData.category,
	  			categoryDisabled : 'disabled',
	  			studentEmail   : nextProps.studentData.studentEmail,
	  			genderType     : nextProps.studentData.genderType,
	  			gender 		   : true,

  			});

  			}
  			
  			
  		
		this.handleChange = this.handleChange.bind(this);
		this.getFranchiseId = this.getFranchiseId.bind(this);

		if(nextProps.updateProfilePermission=="Active"){

			this.setState({profileEditStatus : false});

		}else if(nextProps.updateProfilePermission=="Blocked"){
			this.setState({profileEditStatus : true});

		}else{
			this.setState({profileEditStatus : false});
		}
		

  		}
  	}

  	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
		
  	}

  	getFranchiseId(e){
  		var companyID= $('#franchiseId').val();
  		this.setState({FranchiseId : companyID});
  		if(companyID){
	  		Meteor.call("searchFranchiseData",parseInt(companyID),(err,res)=>{
	  			if(err){
	  				swal("somthing went wrong","","warning");
	  			}else{
	  				if(res=="franchiseNotFound"){
				 		Bert.alert("Franchise does not exist. please enter correct franchise id","danger");
				 		this.setState({
		  					franchiseName       : '',
		  					franchiseMobileNumber     : '',
		  					franchiseUserId : '',
		  				});
	  				}else{
		  				this.setState({
		  					franchiseUserId : res.franchiseCodeForCompanyId,
		  					franchiseName               : res.franchiseName,
		  					franchiseMobileNumber     : res.contactNo,
		  				});
	  				}
	  			}
	  		});
  		}else{
  			getFranchiseId();
  		}
  	}
  	
  	uploadStudentImage(event){
	    // event.preventDefault();
	    let self = this;
	    if (event.currentTarget.files && event.currentTarget.files[0]) {
		    var file = event.currentTarget.files[0];
		      	if (file) {
		      	   var fileName  = file.name; 
		      	 	console.log("fileName--------------->",fileName);
		      	     var ext       = fileName.split('.').pop();  
	                  	if(ext=="jpg" || ext=="png" || ext=="jpeg"){    
	                        if (file) {   
		        				addStudentProfileImage(file,self);
			     			}else{           
			             			 swal("File not uploaded","Something went wrong","error");  
			                     }     
	                   	}else{ 
	                       swal("Please upload file","Only Upload  images format (jpg,png,jpeg)","error");   
	                    } 
		    	}

	    }
	  }

	StudentImage(){
		var TempIamge = TempImage.findOne({"userId": Meteor.userId()});
		console.log("TempIamge =",TempIamge);
		if(TempIamge){

			console.log("TempIamge.tempPath",TempIamge.tempPath);
			return TempIamge.tempPath;
			// return TempIamge.imagePath;
		}else{
			 var userData = Meteor.users.findOne({"_id":Meteor.userId()});
		console.log("userData =========",userData);

		      if(userData){
		        var profileData = userData.profile;
		        if(profileData){
		          if(profileData.userProfile){
		            return profileData.userProfile;
		          }else{
		            return '../images/addLogo1.png';
		          }
		        }
		      } else{
		        return '../images/addLogo1.png';
		      }
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
			}, ()=> {
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
    if(uploadProgressPercent){
        var percentVal = parseInt(uploadProgressPercent);
        if(percentVal){            
            var styleC = {
                width:percentVal + "%",
                display:"block",
                height:"8px",
            }
            var styleCBar = {
                display:"block",
                marginTop:117,
                height:"8px",
            }
        }
        if(!percentVal){
            var percentVal = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
                height:"8px",
            }
            var styleCBar = {
                display:"none",
                marginTop:117,
                height:"8px",
            }
            
        }
        if(percentVal == 100){
            var percentVal = 0;

            var styleC = {
                width:0 + "%",
                display:"none",
                height:"8px",
            }
            var styleCBar = {
                display:"none",
                marginTop:117,
                height:"8px",
            }
           
        }
        return (
            <div>
                <div className="progress col-lg-12"  style= {styleCBar}>
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

	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
			
			 if(this.state.studentDOB){
		        var studentBirthDate = moment(this.state.studentDOB).format("MM/DD/YYYY");
		      }
		      
	
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
								<div className="col-lg-12 col-md-12 col-sm-12">
									<div className="col-lg-12 col-md-12 col-sm-12 studHeadingWrappp">
										<span className="studHeadingWrap col-lg-6 col-md-6 col-xs-6 col-sm-6"> Instructions</span>
										<span className="studHeadingWrap col-lg-6 col-md-6 col-xs-6 col-sm-6 imageUploadLabel">
											<span className="col-lg-12 col-md-12 col-sm-12 col-xs-12"> Upload Profile Picture</span>
											<span className="col-lg-12 col-md-12 col-sm-12 col-xs-12 imageSize imagetype"> (Image Size :700 KB - jpg/png/jpeg)</span>
										</span>
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 instructionWrap">
										{this.props.studInstruction.instruction}
									</div>
									<div className="col-lg-6 col-md-6 col-sm-6 imageSize1">
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-3 pull-right">
											
										    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 photoWrapper1 custPhotoWrap1addstud">
										    {this.StudentImage() ==='../images/addLogo1.png'? <i className="" aria-hidden="true" title="First Add Photo"/>
										    :
										    <i className="fa fa-times removeprofPhoto" aria-hidden="true" title="Remove Photo" onClick={this.removeStudProfPhoto.bind(this)}></i>
											}
										      <div className="col-lg-12 col-md-12 col-sm-12 ClientImgWrap1 displayBlockOne img-responsive">
										      	{
										      	this.StudentImage() ==='../images/addLogo1.png' ?  <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2 col-md-2 col-sm-2   styleUpload" title="Add Profile Photo">
										      		<input type="file"  className="col-lg-1 col-md-1 col-sm-1 col-xs-12 browseDoc" accept="image/x-png,image/jpeg,image/pdf,image/jpg" onChange={this.uploadStudentImage.bind(this)}/> </i>
										        :
										        <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2  styleUpload" title="Change Profile Photo">
										          <input type="file"  className="col-lg-1 col-md-1 col-sm-1 col-xs-1 browseDoc" accept="image/x-png,image/jpeg,image/pdf,image/jpg" onChange={this.uploadStudentImage.bind(this)}/>
										        </i>
										    	}
										      </div>
										      
										      <img className="col-lg-12 col-md-12 col-sm-12 ClientImgWrap1 displayLogoOne" src={this.StudentImage()?this.StudentImage() :"../images/loading.gif"}/>
										      {this.getUploadServicesPercentage()}
										   
										    </div>

										</div>
									</div>
									{/*<ProfilePic img={this.StudentImage()}/>*/}
								</div>
				
								<div className="col-lg-12 col-md-12 col-sm-12">
								<div className="col-lg-12 col-md-12 col-sm-12 studPerInfoWrap studHeadingWrap">Personal Information</div>
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="blocking-span"> 
											<input type="text" name="studentFirstName" ref="studentFirstName" value={this.state.studentFirstName} onChange={this.handleChange}  className={this.state.studentFirstName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content updateaccess" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z]+" title="Only Alphabets Are Allowed!" autoComplete="off" required/>
											<span className="floating-label">First Name<label className="requiredsign">*</label></span>					   			
										</span>
										<input type="hidden" name="_id" ref="_id" value={this.state._id}/>
									</div>
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="blocking-span"> 
											<input type="text" name="studentMiddleName" ref="studentMiddleName" value={this.state.studentMiddleName} onChange={this.handleChange}  className={this.state.studentMiddleName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z]+" title="Only Alphabets Are Allowed!" autoComplete="off"/>
											<span className="floating-label">Middle Name</span>					   			
										</span>
									</div>
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="blocking-span"> 
											<input type="text" name="studentLastName" ref="studentLastName" value={this.state.studentLastName} onChange={this.handleChange}  className={this.state.studentLastName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z]+" title="Only Alphabets Are Allowed!" autoComplete="off" />
											<span className=" floating-label">Last Name{/*<label className="requiredsign">*</label>*/}</span>					   			
										</span>
									</div>
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="blocking-span"> 
										<span className="defaultLabelOes defaultLabelOesE ">Date of Birth<label className="requiredsign">*</label></span>	
											{/*<input type="text" name="studentDOB" ref="studentDOB" value={this.state.studentDOB}  onChange={this.handleChange} id="my-datepicker" className={this.state.studentDOB ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} autoComplete="off" readOnly required/>*/}
											<input type="text" name="studentDOB" ref="studentDOB" value={studentBirthDate} onChange={this.handleChange} id="my-datepicker"   data-provide="datepicker" className={this.state.studentDOB ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText  has-content" : "form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText "} required/>                 
														   			
										</span>
									</div>
									
								</div>
								
								<div className="col-lg-12 col-md-12 col-sm-12">

									<div className="col-lg-9 col-md-9 col-sm-9 col-xs-12">
										<span className="blocking-span"> 
											<input type="text" name="schoolName" ref="schoolName" value={this.state.schoolName} onChange={this.handleChange} title="Enter School Name"  className={this.state.schoolName ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} autoComplete="off" required/>
											<span className="floating-label">School Name <label className="requiredsign">*</label></span>					   			
										</span>
									</div>
									{
									this.state.gender==true?
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 examTypeBtn">
									<span className="defaultLabelOes defaultLabelOesE genderLabel">Gender <label className="requiredsign">*</label></span>	
									    <div className="col-lg-12 col-md-12 col-sm-6 col-xs-12">
							

											<div className="switch-field ">
										      <input type="radio"  id="switch_left" name="genderType" value="Female" checked={this.state.genderType === 'Female'} onChange={this.handleChange.bind(this)} />
										      <label htmlFor="switch_left">Female</label>
										      <input type="radio"  id="switch_right" name="genderType" value="Male" checked={this.state.genderType === 'Male'} onChange={this.handleChange.bind(this)} />
										      <label htmlFor="switch_right">Male</label>
										    </div>
								        </div>
									</div>
									:
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12 examTypeBtn ">
										<span className="defaultLabelOes defaultLabelOesE genderLabel">Gender<label className="requiredsign">*</label></span>
										    <div className="col-lg-12 col-md-12 col-sm-6 col-xs-12">
									          

												<div className="switch-field ">
											      <input type="radio"  id="switch_left" name="genderType" value="Female" checked={this.state.genderType === 'Female'} onChange={this.handleChange.bind(this)} />
											      <label htmlFor="switch_left">Female</label>
											      <input type="radio"  id="switch_right" name="genderType" value="Male" checked={this.state.genderType === 'Male'} onChange={this.handleChange.bind(this)} />
											      <label htmlFor="switch_right">Male</label>
											    </div>
									        </div>
									</div>
								}	
								</div>

								<div className="col-lg-12 col-ms-12 col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12 col-sm-12 studPerInfoWrap studHeadingWrap">Contact Details</div>
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="blocking-span"> 
											<InputMask mask="9999-999-999" maskChar=" " disabled={this.state.profileEditStatus} name="mobileNumber" ref="mobileNumber" value={this.state.mobileNumber} onChange={this.handleChange} className={this.state.mobileNumber ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="^(0|[0-9-+]*)$" title="Enter Numbers!" autoComplete="off" required/>
											<span className=" floating-label col-lg-12 col-ms-12 col-sm-12 col-xs-12 pdcls">Mobile Number<label className="requiredsign">*</label></span>					   			
										</span>
									</div>

									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="defaultLabelOes defaultLabelOesE col-lg-12 col-ms-12 col-sm-12 col-xs-12 pdcls">Email</span>	
										<span className="blocking-span"> 
											<input type="email" name="studentEmail" disabled={this.state.profileEditStatus} ref="studentEmail" value={this.state.studentEmail} onChange={this.handleChange} className={this.state.studentEmail ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"}  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}$"  required/>
															   			
										</span>
									</div>

									<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
										<span className="blocking-span"> 
											<input type="text" name="studentAddress"  ref="studentAddress" value={this.state.studentAddress} onChange={this.handleChange} title="Enter Address" className={this.state.studentAddress ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} autoComplete="off" required/>
											<span className="floating-label">Student Address<label className="requiredsign">*</label></span>					   			
										</span>
									</div>

									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="blocking-span"> 
											<input type="text" name="studentCountry"  ref="studentCountry" value={this.state.studentCountry} onChange={this.handleChange} className={this.state.studentCountry ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"}pattern="[a-zA-Z][a-zA-Z ]+" title="Only Alphabets Are Allowed!" autoComplete="off" required/>
											<span className="floating-label">Country<label className="requiredsign">*</label></span>					   			
										</span>
									</div>

									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-12">
										<span className="blocking-span"> 
											<input type="text" name="studentState"  ref="studentState" value={this.state.studentState} onChange={this.handleChange} className={this.state.studentState ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z][a-zA-Z ]+" title="Select State" autoComplete="off" required/>
											<span className="floating-label">State<label className="requiredsign">*</label></span>					   			
										</span>
									</div>


									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
										<span className="blocking-span"> 
											<input type="text" name="studentCity"  ref="studentCity" value={this.state.studentCity} onChange={this.handleChange} className={this.state.studentCity ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} pattern="[a-zA-Z][a-zA-Z ]+" title="Only Alphabets Are Allowed!" autoComplete="off" required/>
											<span className="floating-label">City<label className="requiredsign">*</label></span>					   			
										</span>
									</div>
									<div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
										<span className="blocking-span"> 
											<InputMask mask="999-999"  maskChar=" " name="pincode" ref="pincode" value={this.state.pincode} onChange={this.handleChange} className={this.state.pincode ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"}  pattern="^(0|[0-9-]*)$" title="Enter Numbers!" autoComplete="off" required/>
											<span className="floating-label">Pincode<label className="requiredsign">*</label></span>					   			
										</span>
									</div>
								

								</div>
								
								<div className="col-lg-12 col-md-12 col-sm-12">			
									<div className="col-lg-12 col-md-12 col-sm-12 studPerInfoWrap studHeadingWrap">Exam Category & Franchise Details</div>
									
									<div className="col-lg-4 col-md-4 col-sm-4 col-xs-6">


											<span className="defaultLabelOes defaultLabelOesE col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls excat">Exam Category</span>	



										<span className="helpSecSR" title="Help" onClick={this.showhideCatDetails.bind(this)}><i className="fa fa-question-circle"></i></span>
											<div className="categoryListDataStud">
												<label>A</label> : Without formulae & without Instrument<br/>
												<label>B</label> : 34 formulae & without Instrument<br/>
												<label>C</label> : All formulae & without Instrument<br/>
												<label>D</label> : Without Instrument & Multiplication Sum<br/>
											</div>					   			
										<span className="blocking-span"> 
										 
											<select type="text" disabled={this.state.profileEditStatus} name="category" ref="category" value={this.state.category} className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" title="Select Category"  value={this.state.category} onChange={this.handleChange} autoComplete="off" required>
												<option value='' disabled>-- Select Exam Category --</option>
												{this.showCategories().map((categories,index)=>{
													return <option key={index}>{categories.categoryName}</option>
												  })
												}
											</select>		   			

										</span>
									</div>

									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examCatWrap">
									{!this.props.studentData.companyId ? 
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
											<span className="blocking-span"> 
												<input type="text" name="franchiseId" ref="franchiseId" id="franchiseId" value={this.state.franchiseId} onBlur={this.getFranchiseId}  title="Enter FranchiseId" onChange={this.handleChange}  className={this.state.franchiseId ? "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1 has-content" : "form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1"} autoComplete="off" required/>
												<span className="col-lg-12 col-md-12 col-sm-12 floating-label pdcls">Franchise Id</span>					   			
											</span>
										</div>
										:
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
											<span className="defaultLabelOes defaultLabelOesE">Franchise Id<label className="requiredsign">*</label></span>	
											<span className="blocking-span"> 
												{<input type="text" name="franchiseId" ref="franchiseId" id="franchiseId" value={this.state.franchiseId}  onChange={this.handleChange} title="can't change franchise Id"  className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" readOnly required/>}
															   			
											</span>
										</div>
										
									}
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
											<span className="defaultLabelOes defaultLabelOesE col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">Franchise Name</span>	
											<span className="blocking-span"> 
												{<input type="text" name="franchiseName" ref="franchiseName" value={this.state.franchiseName}  onChange={this.handleChange}  title="You can't change franchise name" className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" readOnly required/>}
												
											</span>
										</div>
										<div className="col-lg-4 col-md-4 col-sm-4 col-xs-12">
											<span className="defaultLabelOes defaultLabelOesE col-lg-12 col-md-12 col-sm-12 col-xs-12 pdcls">Franchise Mobile</span>	
											<span className="blocking-span"> 
												{<input type="text" name="franchiseMobileNumber" ref="franchiseMobileNumber" value={this.state.franchiseMobileNumber}  title="You can't change franchise mobile no." onChange={this.handleChange}  className="form-control formcntrl col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" autoComplete="off" readOnly required/>}
															   			
											</span>
										</div>
									
									</div>
									<div className="col-lg-3 col-lg-offset-5 col-md-6 col-sm-6 col-xs-6">
										<button className="btn studRegister">Confirm & Register</button>
									</div>
									<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
											{/*<h4 className="adminContact">Please contact Admin on +91-8983318508 to allow profile update </h4>*/}
										<h4 className="adminContact">If you willing to update Category, Email or Mobile Number please contact Admin on support@maats.in to allow update </h4>
									</div>
									{/*{
										this.state.profileEditStatus==false?
										<div className="col-lg-3 col-lg-offset-5 col-md-6 col-sm-6 col-xs-6">
											<button className="btn studRegister">Confirm & Register</button>
										</div>
										:
										<div className="col-lg-10 col-md-10 col-sm-10 col-xs-10">
											{/*<h4 className="adminContact">Please contact Admin on +91-8983318508 to allow profile update </h4>
											<h4 className="adminContact">Please contact Admin on support@maats.in to allow profile update </h4>
										</div>
									}*/}
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
						  	return (<div>{FlowRouter.go('/noAccesss')}</div>);
					  }else if(this.state.facilityPermission == "waitingforResult"){
					  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
						   <img className=" loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
						</div>);
					  }else{ 
					  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
					}

	}
}
export default CreateStudentContainer = withTracker(props=>{
	// Meteor.logout();
	var studId         = Meteor.userId();
	const postHandle   = Meteor.subscribe('singleStudent');
	const loadingTest  = !postHandle.ready();
	var studentData    = StudentMaster.findOne({"studentId":studId})||{};	
	var userData       = Meteor.users.findOne({"_id":studId})||{};
	var profileData    = userData.profile;
	const postHandle2   = Meteor.subscribe("instruction_Stud");
	const loadingTest2  = !postHandle2.ready();
	var studInstruction = InstructionMaster.findOne({"instructionFor" : "Student Registration"})||{};
	if(studentData){
		$('.studRegister').html('Confirm & Update');
	}else{
		$('.studRegister').html('Confirm & Register');
	}
	if(studentData){
		var updateProfilePermission=studentData.profileEditStatus;
	}
	// console.log("updateProfilePermission",updateProfilePermission);
	return{
		studentData,
		profileData,
	 	studInstruction,
	 	updateProfilePermission
	}
	
	
})(CreateStudentRegistration);