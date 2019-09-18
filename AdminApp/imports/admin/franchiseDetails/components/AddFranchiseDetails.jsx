
import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Link} from 'react-router';
import {browserHistory } from 'react-router';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
// import { TempLogoImage } from '../api/TempLogoImage.js';
import {TempImage} from '/imports/s3/api/ClientImageCall.js';
import {TempDocumentsImage} from '/imports/s3/api/ClientImageCall.js';
import {FranchiseDetailsMaster} from '../api/FranchiseDetailsMaster.js';
import validator from 'validator';
import {Session} from 'meteor/session';
import ReactTable from "react-table";
 var documentArrayVar=[];
var IPAddress='';
class AddFranchiseDetails extends TrackerReact(Component)  {

	constructor(props){
		super(props);
		this.state={
			'companyId'				  :'',
			'firstName'               : '',
			"middleName"              : '',
			"lastName"                : '',
			'contactNo'               : '',
			'alternateContactNo'      : '',
			'addressLine1'            : '',
			'addressLine2'            : '',
			'city'                    : '',
			'state'                   : '',
			'country'                 : '',
			'pincode'                 : '',
			'mail'                    : '',
			'dob'                     : '',
			'franchiseName'           : '',
			'documentArray'           : [],
			'allFranchiseData'           : [],
			'document'                : '',
			'documentAttachedStatus'  : '',
			'FranchiseName'  : '',
			'franchiseCode'  : '',
			'searchText'  : '',
			'fID'  : '',
			
		}
		this.handleChange = this.handleChange.bind(this);
		this.removeFranchiseDetails = this.removeFranchiseDetails.bind(this);
	}
	addFranchiseDetails(event){
		event.preventDefault();
	 	var self = this;
	 	window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;//compatibility for Firefox and chrome
		var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};      
		pc.createDataChannel('');//create a bogus data channel
		pc.createOffer(pc.setLocalDescription.bind(pc), noop);// create offer and set local description
		pc.onicecandidate = function(ice)
		{
		 if (ice && ice.candidate && ice.candidate.candidate)
		 {
		  var IP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
		  
		  pc.onicecandidate = noop;
		  IPAddress=IP;
		 }
		
		Franchiseid =  FlowRouter.getParam("id");
		if(Franchiseid){
			var franchiseData  = FranchiseDetailsMaster.findOne({"_id":Franchiseid});
			
			var franchiseCode = franchiseData.franchiseCode;
		}else{
		var franchiseMasterData  = FranchiseDetailsMaster.find({}).fetch();
		  if(franchiseMasterData.length>0){
		    var maxScore      = Math.max.apply(Math,franchiseMasterData.map(maxScore => franchiseMasterData.length));  
		       
		    var franchiseCode ="0000"+parseInt(maxScore+1);
		  }else{
		   franchiseCode = "00001";
		   
		  }
		}
		var userID = Meteor.userId();

		
		var formvalues={
			// "fID"		         : FlowRouter.getParam("id"),
			"firstName"          : self.state.firstName.trim(),
			"middleName"         : self.state.middleName.trim(),
			"lastName"           : self.state.lastName.trim(),
			"contactNo"          : self.state.contactNo.trim(),
			"alternateContactNo" : self.state.alternateContactNo.trim(),
			"addressLine1"       : self.state.addressLine1.trim(),
			"addressLine2"       : self.state.addressLine2.trim(),
			"city"               : self.state.city.trim(),
			"state"              : self.state.state.trim(),
			"country"            : self.state.country.trim(),
			"pincode"            : self.state.pincode.trim(),
			"mail"               : self.state.mail.trim(),
			"dob"                : self.state.dob.trim(),
			"franchiseName"      : self.state.franchiseName.trim(),
			"franchiseCode"		 : franchiseCode,


			'signupPassword'   : "franchise123",
  			'firstname'        : self.state.firstName.trim(),
            'lastname'         : self.state.lastName.trim(),
            'signupEmail'      : self.state.mail.trim(),
            'mobNumber'        : self.state.contactNo.trim(),
		}
		var _id =  FlowRouter.getParam("id");
		var findFranchiseDetails = FranchiseDetailsMaster.findOne({"_id":_id});
		var dateofBirth = new Date(formvalues.dob); 
		var today = new Date;
		var age = Math.floor((today-dateofBirth)/(365.25*24*60*60*1000));
			if(findFranchiseDetails){
				if(_id){
					if(age>0){
						
						Meteor.call("addFranchiseDetails",formvalues,_id,IPAddress,(error,result)=>{
							if(error){
							}else{
								swal("Franchise Details Updated Successfully");
								$('.addCategoryBtn').html("Submit");
								if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
									FlowRouter.go('/admin/FranchiseDetails');
								}else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
									FlowRouter.go('/franchise/FranchiseDetails');
								}
								
								self.state.firstName  = '';	
								self.state.middleName  = '';	
								self.state.lastName  = '';	
								self.state.contactNo  = '';	
								self.state.alternateContactNo  = '';
								self.state.addressLine1 = '';
								self.state.addressLine2 = '';
								self.state.city = '';
								self.state.state = '';
								self.state.country = '';
								self.state.pincode = '';
								self.state.mail = '';
								self.state.dob = '';
								self.state.franchiseName = '';	
								self.state.document = '';	
								$("#attachfile").val('');
								
								Meteor.call("updateuserid" , result, Meteor.userId(),function(error,result){
									if(error){
									  console.log(error.reason);
									}else{
									  // console.log('updated');
									  if (Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])) {
										FlowRouter.go('/admin/FranchiseDetails');
										
									  }else  if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
										FlowRouter.go('/franchise/FranchiseDetails');
									
									  }
									  
									}
								  })

							}
						});
					}else{
				  		swal("Your age must be 1 year old","","warning");	
				  	}
				}else{
					self.refs.firstName.value  = '';
					swal("Franchise Details Already Exist");
				}
			}else{
				if(age>0){
				Meteor.call('userCreateAccountByAdmin', formvalues ,(error,result) => {
				  if(error){
				    swal("Email Id already exist","","warning");
				  }else{ 
				  	var newID = result;
				    Meteor.call('addRoles', newID , "Franchise", function(error,result){
				      if(error){
				        swal(error);
				      }else{              	
						swal('Congratulations!! Account Created...',"","success");
				      }
				    });
				  
				   	Meteor.call("addFranchiseDetails",formvalues,'',IPAddress,result,(error,result)=>{
					if(error){
					}else{
						swal("Franchise Details added Successfully");
						
							self.state.firstName = '';	
							self.state.middleName  = '';	
							self.state.lastName  = '';	
							self.state.contactNo = '';	
							self.state.alternateContactNo  = '';
							self.state.addressLine1 = '';
							self.state.addressLine2 = '';
							self.state.city = '';
							self.state.state = '';
							self.state.country = '';
							self.state.pincode = '';
							self.state.mail = '';
							self.state.dob = '';
							self.state.franchiseName = '';	
							self.state.document = '';	
							$("#attachfile").val('');
					}
				});
				  } 
				});
			}else{
		  		swal("Your age must be 1 year old","","warning");	
		  	}

				
			}
		};	
	}
	// getAllFranchiseDetails(franchiseName){
	// 	if(franchiseName){
	// 		var FranchiseDetailsHandle = Meteor.subscribe("allFranchise").ready();	
	// 		var FranchiseDetails = FranchiseDetailsMaster.findOne({"franchiseName":franchiseName});
	// 		if(FranchiseDetails){
	// 			return FranchiseDetails;
	// 		}else{
	// 			return 0;
	// 		}
	// 	}else{
	// 	var FranchiseDetailsHandle = Meteor.subscribe("allFranchise").ready();	
	// 		var FranchiseDetails = FranchiseDetailsMaster.find({},{sort: {createdAt: -1}}).fetch();
	// 		if(FranchiseDetails){
	// 			return FranchiseDetails;
	// 		}else{
	// 			return 0;
	// 		}
	// 	}
	// }
	// componentWillReceiveProps(nextProps) {
	// 	this.setState({});
	// }
	getAllFranchiseDetails(){
			if(!this.state.searchText){
				
				Meteor.call("allFranchise",(err,res)=>{
					if(err){
						// console.log(error);
					}else{
						
						this.setState({'allFranchiseData':res});
					}
				})

			}else{
		
				Meteor.call("SearchFranchise",this.state.searchText,(err,res)=>{
					if(err){
						// console.log(error);
					}else{
						this.setState({'allFranchiseData':res});
					}
				})
			}
		
	}

  	componentDidMount() {
		
	 	$("html,body").scrollTop(0); 
	 	if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		this.getAllFranchiseDetails();
	}
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
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
		var searchName= $('.SearchFranchise').val();
		if(searchName){
			var RegExpBuildValue = this.buildRegExp(searchName);
			this.setState({
				searchText   : RegExpBuildValue,
				
			},()=>{this.getAllFranchiseDetails()});
		}else{
			this.setState({
				searchText   : '',
				
				
			},()=>{this.getAllFranchiseDetails()});
		}
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.FranchiseDetailsData){
			this.setState({
				'firstName': nextProps.FranchiseDetailsData.firstName,
				'middleName': nextProps.FranchiseDetailsData.middleName,
				'lastName': nextProps.FranchiseDetailsData.lastName,
				'contactNo': nextProps.FranchiseDetailsData.contactNo,
				'alternateContactNo': nextProps.FranchiseDetailsData.alternateContactNo,
				'addressLine1': nextProps.FranchiseDetailsData.addressLine1,
				'addressLine2': nextProps.FranchiseDetailsData.addressLine2,
				'city': nextProps.FranchiseDetailsData.city,
				'state': nextProps.FranchiseDetailsData.state,
				'country': nextProps.FranchiseDetailsData.country,
				'pincode': nextProps.FranchiseDetailsData.pincode,
				'mail': nextProps.FranchiseDetailsData.mail,
				'dob': nextProps.FranchiseDetailsData.dob,
				'franchiseName': nextProps.FranchiseDetailsData.franchiseName,
				// 'allFranchiseData':nextProps.postFranchiseData,
				
			});
			this.handleChange = this.handleChange.bind(this);
			this.removeFranchiseDetails = this.removeFranchiseDetails.bind(this);
		}
	}

	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
		if(name=="document"){
			this.setState({
						  	document : event.target.value,
						});
		}
  	}

  	imgBrowse(e){
      	e.preventDefault();
        e.stopPropagation();
        let self=this;      
        if(e.currentTarget.files){
	        var file=e.currentTarget.files[0];
	       // console.log("addedfile1----->",file);
	        if(file){
	          addProductImgsToS3Function(file,self);
	        }
        }
        return false;       
    }
    imgBrowse1(event){
        event.preventDefault();
        event.stopPropagation();
	       // console.log("addedfile2----->",file);

        let self=this;      
        if(event.currentTarget.files){
        var file=event.currentTarget.files[0];
        var documentType=this.state.document;
        if(file){
          addProductDocumentImgsToS3Function(file,self,documentType);
        }
      } 
    }
    addDocumentList(event){
    	event.preventDefault();
    	var TempImg = TempDocumentsImage.find({"userId":Meteor.userId()}).fetch();

    }
    removeCompanyImage(event){
	    event.preventDefault();
	    var id=this.props.post._id;
	    var link = $(event.target).attr('data-link');
	    Meteor.call("removeCompanyImage",link,id,(error, result)=>{
	    });
  	}
	removeStudProfPhoto(){
		swal({
		    title             : 'Are you sure?',
		    text              : 'You will not be able to recover this profile photo.',
		    type              : 'warning',
		    showCancelButton  : true,
		    closeOnConfirm    : false,
		    confirmButtonColor: '#dd6b55',
		    cancelButtonColor : '#d44',
		    confirmButtonText : 'Yes, Delete it!',
		    cancelButtonText  : 'No, Keep it',
		    closeOnConfirm    : false
		},function(){
			Meteor.call("removeprofPhoto",Meteor.userId(),(error,result)=>{
				if(error){

				}else{

					swal(
				    'Profile image has been Deleted',
				   
				  );
				}
			});
	  			
	  	});
			
	}
	removeStudProfPhoto1(){
		swal({
			  title             : 'Are you sure?',
			  text              : 'You will not be able to recover this profile photo!',
			  type              : 'warning',
			  showCancelButton  : true,
			  closeOnConfirm    : false,
			  confirmButtonColor: '#dd6b55',
			  cancelButtonColor : '#d44',
			  confirmButtonText : 'Yes, Delete it!',
			  cancelButtonText  : 'No, Keep it',
			  closeOnConfirm    : false
		},function(){
			Meteor.call("removeprofDocumentPhoto",Meteor.userId(),(error,result)=>{
				if(error){

				}else{

					swal(
				    'Profile photo has been Deleted',
				    
				  );
				}
			});
  			
  		});
	}
	
  	removeFranchiseDetails(event){
  // 		var _id = $(event.target).attr('id');
  // 		swal({
		// 	  title             : 'Are you sure?',
		// 	  text              : 'You will not be able to recover this Record!',
		// 	  type              : 'warning',
		// 	  showCancelButton  : true,
		// 	  closeOnConfirm    : false,
		// 	  confirmButtonColor: '#dd6b55',
		// 	  cancelButtonColor : '#d44',
		// 	  confirmButtonText : 'Yes, Delete it!',
		// 	  cancelButtonText  : 'No, Keep it',
		// 	  closeOnConfirm    : false
		// },function(){
		// 	Meteor.call("RemoveFranchiseDetails",_id,(error,result)=>{
		// 		if(error){

		// 		}else{
		// 			swal(
		// 		    'Franchise Details has been Deleted',
		// 		    '',
		// 		    'success'
		// 		  );
		// 			// this.getAllFranchiseDetails();/admin/FranchiseDetails
		// 			// FlowRouter.go('/admin/FranchiseDetails');
		// 		}
		// 	});
  // 		});
  		
  		event.preventDefault();
	    var id = $(event.target).attr('id');
	    var franchiseUser=FranchiseDetailsMaster.findOne({"_id":id});
	    var franchiseID=franchiseUser.franchiseID;
	   // console.log("studentID",studentID);
	    Meteor.call("deleteUser",	franchiseID,(error, result)=>{
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
			Meteor.call("RemoveFranchiseDetails",id,(error,result)=>{
				if(error){

				}else{
					swal(
				    	'Franchise Record has been Deleted',
				 	);
				}
			});
  		});
  	}

  	StudentImage(){
		var TempImg = TempImage.findOne({"userId":Meteor.userId()});
		if(TempImg){
			return TempImg.imagePath;
		}else{
		    return '/images/addLogo1.png';
		}
	}
	StudentImage1(){
		Meteor.subscribe("TempDocumentsImages");
		var TempImg = TempDocumentsImage.find({"userId":Meteor.userId()}).fetch();
		if(TempImg){
			return TempImg;
		}else{
		    return '/images/attachment.png';
		}
	}
	removeLi(e){
		event.preventDefault();
		var documentID=e.target.id;
		swal({
			  title             : 'Are you sure?',
			  text              : 'You will not be able to recover this document image!',
			  type              : 'warning',
			  showCancelButton  : true,
			  closeOnConfirm    : false,
			  confirmButtonColor: '#dd6b55',
			  cancelButtonColor : '#d44',
			  confirmButtonText : 'Yes, Delete it!',
			  cancelButtonText  : 'No, Keep it',
			  closeOnConfirm    : false
		},function(){
			Meteor.call("removeprofDocumentPhoto",Meteor.userId(),documentID,(error,result)=>{
				if(error){
					}else{
						swal(
					    'Document image has been Deleted.'
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

	render(){
		var urlPath = location.pathname;
		var _id = (urlPath.split('/')).pop();
		$('.addCategoryBtn').html("Update");
		if(urlPath=="/admin/FranchiseDetails" || urlPath=="/franchise/FranchiseDetails"){
			var _id = ''; 
			$('.addCategoryBtn').html("Submit");
		}
		var data1 = this.state.allFranchiseData;
		var data2 = [];
		// console.log("Meteor.userId()",Meteor.userId());
		for(i=0; i<data1.length; i++){
			if(Roles.userIsInRole(Meteor.userId(), ['Admin','superAdmin'])){
				var linktoeditfranchisedetails =
				<div>
     				<a href={`/admin/editFranchiseDetails/${data1[i]._id}`}>
     				 	<i className="fa fa-edit editIcon" ></i>
     				</a>
     				<i className="fa fa-trash deleteIcon"  id={data1[i]._id} onClick={this.removeFranchiseDetails.bind(this)}></i>

     			</div>
			    }else if(Roles.userIsInRole(Meteor.userId(), ['Franchise'])){
	     			var linktoeditfranchisedetails = 
	     			<div>
	     				<a href={`/franchise/editFranchiseDetails/${data1[i]._id}`}>
	     				 	<i className="fa fa-edit editIcon" ></i>
	     				</a>
	     				<i className="fa fa-trash deleteIcon"  id={data1[i]._id} onClick={this.removeFranchiseDetails.bind(this)}></i>

	     			</div>
			     		}
		data2[i] = {
		"_id" : data1[i]._id,
		"serialNumber" : i+1,
		"franchiseName" : data1[i].franchiseName,
		"fullName" : data1[i].firstName,
		"contactNo" : data1[i].contactNo,
		"address" : data1[i].addressLine1,
		"mail" : data1[i].mail,
		"FranchisePhoto" : <div><img src={data1[i].franchisePhoto} className="commonLogo commonLogoicon displayLogo img-responsive img-rounded"/></div>,
		"ActionToPerform" :linktoeditfranchisedetails
							
			     		

		};     
		}
		// console.log(data2);

		var headers = [
		{Header: "Sr. No.", accessor: 'serialNumber' },
		{Header: "Franchise Name", accessor: 'franchiseName' },
		{Header: "First Name", accessor: 'fullName'},
		{Header: "Contact No. ", accessor: 'contactNo' },
		{Header: "Address", accessor: 'address' },
		{Header: "E-mail", accessor: 'mail' },
		{Header: "Photo", accessor: 'FranchisePhoto' },
		{Header: "Action",accessor:'ActionToPerform' },
		];

		// console.log("allFranchiseData---->",this.state.allFranchiseData);
		return(
			<div>
		        <div className="content-wrapper">
		            <section className="content-header">
		            <h1>Franchise Details</h1>
		            </section>
		            <section className="content viewContent">
		            	<div className="row">
		              		<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		               			<div className="box">
		                 			<div className="box-header with-border boxMinHeight">
					                    <div className="box-header with-border ">
							            <h3 className="box-title">Add Franchise Details</h3>
							            </div>
										<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 bordercolor topPadding onlineSXWrap">
											<form id="FranchiseForm" onSubmit={this.addFranchiseDetails.bind(this)}>
												<div className="franchisePhoto col-lg-3 col-lg-offset-9 col-md-6 col-sm-6">
													<div className="col-lg-12 col-md-4 col-sm-4 col-xs-3 custPhotoWrap1 pull-right">
														
													    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 photoWrapper1">
													    {this.StudentImage() ==='/images/addLogo1.png'? <i className="" aria-hidden="true" title="First Add Photo"/>
													    :
													    <i className="fa fa-times removeprofPhoto" aria-hidden="true" title="Remove Photo" onClick={this.removeStudProfPhoto.bind(this)}></i>
														}
													      <div className="col-lg-12 col-md-12 col-sm-12ClientImgWrap1 displayBlockOne">
													      	{this.StudentImage() ==='/images/addLogo1.png' ?  <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2 col-md-2 col-sm-2   styleUpload" title="Add Profile Photo">
													      		<input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-12 browseDoc" accept="file/*" onChange={this.imgBrowse.bind(this)}/> </i>
													        :<i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2  styleUpload" title="Change Profile Photo">
													    	
													          <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 browseDoc" accept="file/*" onChange={this.imgBrowse.bind(this)}/>
													        </i>
													    	}
													      </div>

													      {<img className="col-lg-12 col-md-12 col-sm-12 ClientImgWrap1 displayLogoOne" src={this.StudentImage()?this.StudentImage() :"/images/loading.gif"}/>}
													      {this.getUploadServicesPercentage()}
													   
													    </div>

													</div>
												</div>
												<div className="col-lg-12 col-md-3 col-sm-3 col-xs-3 formWrapFD">
													<span className="blocking-span"> 
														<input type="text" name="franchiseName" ref="franchiseName" value={this.state.franchiseName} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter Franchise Name" required/>
														<span className="floating-label">Franchise Name<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3 ">
													<span className="blocking-span"> 
														<input type="text" name="firstName" ref="firstName" pattern="[a-zA-Z][a-zA-Z ]+" value={this.state.firstName} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter First Name (Nos. are not allowed)" required/>
														<span className="floating-label">First Name<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="middleName" ref="middleName" pattern="[a-zA-Z][a-zA-Z ]+" value={this.state.middleName} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter Middle Name (Nos. are not allowed)" required/>
														<span className="floating-label">Middle Name<label className="requiredsign">*</label></span>					   			
													</span>
												</div>

												
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="lastName" ref="lastName" pattern="[a-zA-Z][a-zA-Z ]+" value={this.state.lastName} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter Last Name (Nos. are not allowed)" required/>
														<span className="floating-label">Last Name<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="contactNo" ref="contactNo" pattern="^(0|[0-9-+]*)$" value={this.state.contactNo} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter Contact No. (Letters are not allowed)" required/>
														<span className="floating-label">Contact Number<label className="requiredsign">*</label></span>					   			
													</span>
												</div> 
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="alternateContactNo" ref="alternateContactNo" pattern="^(0|[0-9-+]*)$" value={this.state.alternateContactNo} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12  inputText1 inputText2" title="Enter Alternate Contact No.(Letters are not allowed)" />
														<span className="floating-label11">Alternate Contact Number (Mob)</span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="mail" ref="mail" value={this.state.mail} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Check Email-Format" required/>
														<span className="floating-label">Email Address<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="addressLine1" ref="addressLine1" value={this.state.addressLine1} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter Address Line1" required/>
														<span className="floating-label">Address Line 1 <label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="addressLine2" ref="addressLine2" value={this.state.addressLine2} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText2 inputText1" title="Enter Address Line2" />
														<span className="floating-label11">Address Line 2</span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="city" ref="city" pattern="[a-zA-Z][a-zA-Z]+" value={this.state.city} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter City Name (Nos. are not allowed)" required/>
														<span className="floating-label">City<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="pincode" ref="pincode" pattern="[0-9]{6}" value={this.state.pincode} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter 6 digit Pincode " required/>
														<span className="floating-label">Pin Code<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="state" ref="state" pattern="[a-zA-Z][a-zA-Z ]+" value={this.state.state} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter State Name (Nos. are not allowed)" required/>
														<span className="floating-label">State<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="text" name="country" ref="country" pattern="[a-zA-Z][a-zA-Z ]+" value={this.state.country} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter Country Name (Nos. are not allowed)" required/>
														<span className="floating-label">Country<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												
												
												<div className="col-lg-4 col-md-3 col-sm-3 col-xs-3">
													<span className="blocking-span"> 
														<input type="date" name="dob" ref="dob" value={this.state.dob} onChange={this.handleChange} className="form-control  col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputText1" title="Enter Date of Birth" required/>
														<span className="floating-label">Date of Birth<label className="requiredsign">*</label></span>					   			
													</span>
												</div>
												
												<div className="form-group col-lg-12 col-md-4 col-xs-6 col-sm-6 inputContent villageinput listbox">
													<div className="form-group col-lg-4 col-md-4 col-xs-6 col-sm-6 inputContent paddingleftzero villageinput">
														<span className="blocking-span">
															<label className="">Documents to attach<label className="requiredsign">*</label></label>							
												    		<select className="stateselection  form-control"  id="document" value={this.state.document}  ref="document" name="document" onChange={this.handleChange.bind(this)} required>
															    <option value="">-Select-</option>
															    <option value="Adhar Card">Adhar Card</option>
															    <option value="Pan Card">Pan Card</option>
															    <option value="Bank Passbook">Bank Passbook (front)</option>

															    {/*{this.props.postIrrigationCategory.map((IrrigationCategorydata, index)=>{
						                        					return(												      
																      <option  key={index}>{IrrigationCategorydata.value}</option>											 
																      );
					                    					    })}*/}
														    </select>
														</span>
													</div>
													{/*<div className="franchisePhoto col-lg-2  col-md-6 col-sm-6">*/}
														{/*<div className="col-lg-12 col-md-4 col-sm-4 col-xs-3 custPhotoWrap1 pull-right">
															
														    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 photoWrapper1">
														    {this.StudentImage1() ==='/images/attachment.png'? <i className="" aria-hidden="true" title="First Add Photo"/>
														    :
														    <i className="fa fa-times removeprofPhoto" aria-hidden="true" title="Remove Photo" onClick={this.removeStudProfPhoto1.bind(this)}></i>
															}
														      <div className="col-lg-12 col-md-12 col-sm-12ClientImgWrap1 displayBlockOne">
														      	{this.StudentImage1() ==='/images/attachment.png' ?  <i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2 col-md-2 col-sm-2   styleUpload" title="Add Profile Photo">
														      		<input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-12 browseDoc" accept="file/*" onChange={this.imgBrowse1.bind(this)}/> </i>
														        :<i className="fa fa-camera fa-2x paddingNoImageUpload col-lg-2  styleUpload" title="Change Profile Photo">
														    	
														          <input type="file" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 browseDoc" accept="file/*" onChange={this.imgBrowse1.bind(this)}/>
														        </i>
														    	}
														      </div>

														      {<img className="col-lg-12 col-md-12 col-sm-12 ClientImgWrap1 displayLogoOne" src={this.StudentImage1()?this.StudentImage1() :"/images/loading.gif"}/>}
														      {this.getUploadServicesPercentage()}
														   
														    </div>
														   
														    

														</div>*/}
													{/*</div>*/}
													<div className="form-group col-lg-4 col-md-4 col-xs-6 col-sm-6 inputContent villageinput attachdocument">
														<input type="file" accept="file_extension" onChange={this.imgBrowse1.bind(this)} placeholder="Upload Your document*" id="attachfile" aria-describedby="sizing-addon1"/>	    	
													</div>
													
													{/*<button className="btn btn-primary" onClick={this.addDocumentList.bind(this)}>Attach Document</button>*/}
													{
														this.props.FranchiseDetailsData?
														<div className="col-lg-4">
														<label className="col-lg-12">Attached Documents</label>
														{this.props.FranchiseDetailsData.Documents.map( (element,index)=>{
														return(
															<div className="listarraybox1 col-lg-6" key={index}>
																
																<span className="blocking-span col-lg-10 attachedImagetitle">
																   <img src={element.ImgSource} className="commonLogo commonLogoicon displayLogo img-responsive img-rounded"/>
																</span>
																<span className="blocking-span col-lg-12 attachedImagetitle">
																	<label>{element.DocumentType}</label>
																</span>
																
															</div>
															 );
														})
													}	
													</div>
														:null
													}
													{this.StudentImage1().length>0?
														<div className="col-lg-12">
														<label className="col-lg-12">Recently Attached Documents</label>
														{this.StudentImage1().map( (element,index)=>{
															return(
																<div className="listarraybox1 col-lg-2" key={index}>

																	<span className="blocking-span col-lg-10 attachedImagetitle">
																	   <img src={element.imagePath} className="commonLogo commonLogoicon displayLogo img-responsive img-rounded"/>
																		</span>
																		<span className="blocking-span col-lg-12 attachedImagetitle">
																			<label>{element.documentType}</label>
																		</span>
																		<div className="form-group col-lg-2 col-md-2 col-sm-2 col-xs-2">
															         		<i onClick={this.removeLi.bind(this)} id={element._id} className="fa fa-times" aria-hidden="true"></i>
															        	</div>
																	</div>
																	 );
																})
															}	
														</div>
														:null
													}
				
												</div>
									             
												<div className="col-lg-2 col-lg-offset-10 col-md-2 col-sm-3 col-xs-3">
													<button type="submit" className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-primary addCategoryBtn">Submit</button>
												</div>
											</form>
											<div className="col-lg-12 col-md-12 searchTableBoxAlignSETT searchTableBoxAlignSETT1">
												<span className="blocking-span">
													<input type="text" name="search"  className="col-lg-6 col-sm-4 SearchExam SearchFranchise inputTextSearch" onInput={this.getTextValue.bind(this)} required/>
													<span className="floating-label">Search by Franchise Name/ Name/ Mobile No./ Email-ID </span>
												</span>
											</div>
											{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
							              		<table className="table table-responsive table-striped formTable tab-Table">
												    <thead className="tableHeader">
												        <tr>
												            <th className="col-lg-1">Sr.No.</th>
												            <th className="col-lg-3">Franchise Name</th>
												            <th className="col-lg-3">Full Name </th>
												            <th className="col-lg-3">Contact No. </th>
												            <th className="col-lg-3">Address </th>
												            <th className="col-lg-3">E-mail </th>
												            <th className="col-lg-3">Photo</th>
												            <th className="col-lg-3"> Action </th>
												        </tr>
												    </thead>
												    {this.state.allFranchiseData != 0 ?
													    <tbody className="myAllTable">
													     	{this.state.allFranchiseData.map((FranchiseDetailsData,index)=>{
													     	return <tr key={index}>
													     			<td></td>
													     			<td>{FranchiseDetailsData.franchiseName}</td>
													     			<td>{FranchiseDetailsData.firstName} {FranchiseDetailsData.middleName} {FranchiseDetailsData.lastName}
													     			</td>
													     			<td>{FranchiseDetailsData.contactNo}</td>
													     			<td>{FranchiseDetailsData.addressLine1} {FranchiseDetailsData.addressLine2} {FranchiseDetailsData.city} {FranchiseDetailsData.state} {FranchiseDetailsData.country} {FranchiseDetailsData.pincode}</td>
													     			
													     			<td>{FranchiseDetailsData.mail}</td>
													     			
													     			
													     			<td><img src={FranchiseDetailsData.franchisePhoto} className="commonLogo commonLogoicon displayLogo img-responsive img-rounded"/></td>
													     			
													     			<td>
													     				<a href={`/editFranchiseDetails/${FranchiseDetailsData._id}`}>
													     				 	<i className="fa fa-edit editIcon" ></i>
													     				</a>
													     				<i className="fa fa-trash deleteIcon"  id={FranchiseDetailsData._id} onClick={this.removeFranchiseDetails.bind(this)}></i>
													
													     			</td>
													     		</tr>
													     		})
													     }
													    </tbody>
												    :
												    	<tbody className="OESDataNotAvailable">
											    			<tr>
											    				<td colSpan="5">"Franchise Details not yet added"</td>
											    			</tr>
											    		</tbody>
										    		}
												</table>
											</div>*/}
											<div className="col-lg-12 col-md-12  col-sm-12 col-xs-12 addRolWrap addcountrylist questWrapReactTable" id="contactlistview">
												<ReactTable data={data2} columns={headers} filterable={true} />
											</div>
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

export default FranchiseDetailsContainer = withTracker(props =>{
	var _id = FlowRouter.getParam("id");
	var FranchiseDetailsData = FranchiseDetailsMaster.findOne({"_id":_id});
	const postHandle = Meteor.subscribe('allFranchise');
    const post       = FranchiseDetailsMaster.findOne({})||{};
    const loading    = !postHandle.ready();
    const postHandle2   = Meteor.subscribe("TempImages");
	const loadingTest2  = !postHandle2.ready();

	const postHandle1             = Meteor.subscribe('allFranchise');
    const postFranchiseData       = FranchiseDetailsMaster.find({}).fetch()||{};
	const loading1                = !postHandle1.ready();
	
	
	return{
		FranchiseDetailsData,
		post,
		postFranchiseData,
		loading,
		loading1,
		loadingTest2,
	} 
})(AddFranchiseDetails);