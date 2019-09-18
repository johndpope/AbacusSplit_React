/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will create student profile. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {StudentMaster} from '/imports/student/api/studentMaster.js';
import {MyExamMaster} from '/imports/student/api/myExamMaster.js';
// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
// import {MyExamMaster} from '/imports/admin/forms/student/api/myExamMaster.js';

class StudentDetails extends TrackerReact(Component)  {
	constructor(props) {
	    super(props);    
	    this.allowStudentProfileUpdate = this.allowStudentProfileUpdate.bind(this);    
	    this.notAllowStudentProfileUpdate = this.notAllowStudentProfileUpdate.bind(this);    
	}
	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  	allowStudentProfileUpdate(event){
  		event.preventDefault();
    	var studId = $(event.target).attr('id');
    	if(studId){
    		// console.log("studId--------->",studId);
	    	 Meteor.call("AllowStudentProfileUpdate",studId,(err,res)=>{
	          if(err){

	          }else{
	            swal("Student profile activated for updates");
	          }
	        });
    	}
  	}
  	notAllowStudentProfileUpdate(event){
  		event.preventDefault();
    	var studId = $(event.target).attr('id');
    	if(studId){
    		// console.log("studId--------->",studId);
	    	 Meteor.call("DontAllowStudentProfileUpdate",studId,(err,res)=>{
	          if(err){

	          }else{
	            swal("Student profile blocked for updates");
	          }
	        });
    	}
  	}

	render(){

		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>Student Profile</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                {!this.props.loadingTest ?
		                this.props.studentData.studentId ?
		                  <div className="box-header with-border boxMinHeight">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12 studProfileTit studProfileTitSec">
										<i className="fa fa-user-circle-o studProfileIcon" aria-hidden="true"></i>
										Student Profile 
									</div>
									<img src={this.props.studentData.imgSrc ? this.props.studentData.imgSrc:"/images/addLogo1.png"} className="studImage col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4"/>
									<h4 className="studProfName col-lg-12 col-md-12">
										{this.props.studentData.studentFirstName} {this.props.studentData.studentMiddleName} {this.props.studentData.studentLastName}
									</h4>
									<div className="studProfName col-lg-12 col-md-12">
										{this.props.studentData.studentEmail}
									</div>
									<div className="studProfName col-lg-12 col-md-12">
										{this.props.studentData.mobileNumber}
									</div>
									<h1 className="col-lg-12 col-md-12 profileDividerr"></h1>
									<div className="col-lg-12 col-md-12 studProfileTit studProfileTitSec">
										<i className="fa fa-university studProfileIcon" aria-hidden="true"></i> 
										School
									</div>
									<div className="studProfName col-lg-12 col-md-12">
										{this.props.studentData.schoolName}
									</div>
									<div className="col-lg-12 col-md-12 studProfileTit studProfileTitSec">
										<i className="fa fa-university studProfileIcon" aria-hidden="true"></i> 
										Franchise Name
									</div>
									<br/>
									<div className="studFrancName col-lg-12 col-md-12">
										<div className="col-lg-12 col-md-12">
											{this.props.studentData.franchiseName}
										</div>
									</div>
									
								</div>
								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12 studProfileTit studProfileTitSec"><i className="fa fa-address-card-o studProfileIcon" aria-hidden="true"></i>Personal Information</div> 
									<div className="col-lg-12 col-md-12 studProfSubTitProf"><i className="fa fa-user-circle-o studProfileIcon" aria-hidden="true"></i>  Parent Name</div>
									<div className="col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1 studContentWrap">{this.props.studentData.studentMiddleName} {this.props.studentData.studentLastName}</div>
									<div className="col-lg-12 col-md-12 studProfSubTitProf"><i className="fa fa-calendar studProfileIcon" aria-hidden="true"></i> Date of Birth</div>
									<div className="col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1 studContentWrap">{moment(this.props.studentData.studentDOB).format("DD/MM/YYYY")}</div>
									<div className="col-lg-12 col-md-12 studProfSubTitProf"><i className="fa fa-map-marker studProfileIcon" aria-hidden="true"></i> Address</div>
									<div className="col-lg-11 col-lg-offset-1 col-md-11 col-md-offset-1 studContentWrap">
										{this.props.studentData.studentAddress}
										<div>{this.props.studentData.studentCountry}, {this.props.studentData.studentState}, {this.props.studentData.studentCity}, {this.props.studentData.pincode}</div>
									</div>
									<h1 className="col-lg-12 col-md-12 profileDividerr"></h1>

									<div className="col-lg-12 col-md-12 studProfileTit studProfileTitSec"><i className="fa fa-puzzle-piece studProfileIcon" aria-hidden="true"></i>Category</div>
										<div className="col-lg-12 col-md-12">
											<div className="col-lg-12 col-md-12 studProfSubTitProf"> Exam category</div>
											<div className="col-lg-12 col-md-12"> {this.props.studentData.category} </div>
										</div>
										{/*<div className="col-lg-12 col-md-12 studProfileTit studProfileTitSec">
											<i className="fa fa-user-circle-o studProfileIcon" aria-hidden="true"></i> 
											Teacher Name
										</div>
										<div className="studTecherName col-lg-12 col-md-12">
											<div className="col-lg-12 col-md-12">
												{this.props.studentData.teacherName}
											</div>
										</div>*/}
								</div>
								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
									<div className="col-lg-12 col-md-12 studProfileTit studProfileTitSec"><i className="fa fa-puzzle-piece studProfileIcon" aria-hidden="true"></i>Reports</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
					              		<table className="table table-striped formTable">
										    <thead className="tableHeader">
										        <tr>
										            <th className="col-lg-5">Exam Name </th>
										            <th className="col-lg-1 tab-Table"> Catg </th>
										            <th className="col-lg-1 tab-Table">  Marks </th>
										        </tr>
										    </thead>
										{this.props.mainExamReport!=0 ?
										    <tbody className="myAllTableReport">
										     	{this.props.mainExamReport.map((Exams,index)=>{
										     	return <tr key={index}>
										     			<td>{Exams.competitionName}</td>
										     			<td className="tab-Table">{Exams.category}</td>
										     			<td className="tab-Table">{Exams.totalScore}</td>
										     		</tr>
										     		})
										     }
										    </tbody>
										:
									    	<tbody className="OESDataNotAvailable">
								    			<tr>
								    				<td colSpan="9">"Reports are Not Yet Available."</td>
								    			</tr>
								    		</tbody>
							    		}
										</table>
									</div>
								</div>
						    </div>
						    {Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
							    <div>
							    	{this.props.profileEdit=="Blocked"?
							    	<button className="col-lg-2 btn btn-primary studentblck" id={FlowRouter.getParam("id")} onClick={this.allowStudentProfileUpdate.bind(this)}>Allow profile update</button>
							    	:
							    	<button className="col-lg-2 btn btn-primary studentblck" id={FlowRouter.getParam("id")} onClick={this.notAllowStudentProfileUpdate.bind(this)}>Block profile update</button>

							    	}
							    </div>
							    :
							    null
							}
						   </div> 
						  :
						  <div className="col-lg-12 boxMinHeight  studDataNotExist">
							Student not yet registered.
						  </div>
						  :
						  <div className="col-lg-12 boxMinHeight  studDataNotExist"> Loading... Please wait.</div> 
						
					  }
					  
						</div>
					  </div>
					</div>
				  </section>
				</div>
			</div>
			);
	}
}
export default StudentDetailsContainer = withTracker(props=>{
		var id = FlowRouter.getParam("id");
		const postHandle   = Meteor.subscribe('LoginInStudent',id);
		const loadingTest  = !postHandle.ready();
		var studentData    = StudentMaster.findOne({"studentId":id})||{};
		var myExamHandle = Meteor.subscribe("showAllAnswer");
		var loadingTestExam = !myExamHandle.ready();
		var mainExamReport = MyExamMaster.find({"StudentId":studentData.studentId}).fetch()||{};
		if(studentData){
			var studStatus=studentData.profileEditStatus;
			if(studStatus=="Active"){
				var profileEdit="Active";
			}else{
				var profileEdit="Blocked";
			}

		}

		// console.log("studStatus--->",studStatus);

		return{
			studentData,
			mainExamReport,
			loadingTest,
			profileEdit
		}
})(StudentDetails);