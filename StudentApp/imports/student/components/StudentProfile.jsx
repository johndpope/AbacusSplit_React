import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';


import {StudentMaster} from '/imports/student/api/studentMaster.js';
import {MyExamMaster} from '/imports/student/api/myExamMaster.js';
import StudentRegistrationforCompetition from '/imports/student/components/StudentRegistrationforCompetition.jsx';
import PracticeStartExamForDashboard from '/imports/studentMainExam/components/PracticeStartExamForDashboard';
// import PracticeStartExamForDashboard from '/imports/admin/forms/exam/PracticeStartExamForDashboard';
import {PackageManagementMaster} from '/imports/admin/packageManagement/api/packageManagementMaster.js';
import {PackageOrderMaster} from '/imports/paymentProcess/api/packageOrderMaster.js';
import {PackageQuestionPaperMaster} from '/imports/paymentProcess/api/packageQuestionPaperMaster.js';
import {NotificationMaster} from '/imports/admin/notification/apiNotificationMaster.js';
import { SiteDowntime }   from '/imports/admin/notification/apiNotificationMaster.js';
import TimeAgo from 'react-timeago';
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';
import  renderHTML from 'react-render-html';
import  { Quill, Mixin, Toolbar } from 'react-quill'; 


class StudentProfile extends Component{

	constructor(){
	  super();
	    this.state = {
	        content         : '',
	        loginTime       : '',
	    }
	    this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event){
	    const target = event.target;
	    const name   = target.name;
	    this.setState({
	      [name]: event.target.value,
	    });
  	}

	componentWillMount(){
    	$('.sidebar').css({display:'block',background: '#222d32'});
 	 }

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		var studData = StudentMaster.findOne({"studentId":Meteor.userId()});


		// console.log("navigator.appName------>",navigator.appName);
		// console.log("navigator.appCodeName------>",navigator.appCodeName);
		// console.log("navigator.platform------>",navigator.platform);

		// console.log("navigator.window------>",window.navigator);
		// Meteor.setTimeout(function() {
		// 				    $('#showNotice').modal('show');
		// 					}, 300);

		 Meteor.call("getNotificationStatus",(err,res)=>{
          if(err){ 
          }else{ 
          	var resArray=res;        	
          
          	if(resArray.length>0 && resArray[0]._id){

          		if(studData){
				if(studData.notificationStatus=="Unread"){
					Meteor.setTimeout(function() {
				    $('#showstatus').modal('show');
					}, 300);
				}else{
					Meteor.setTimeout(function() {
				    $('#showstatus').modal('hide');
					}, 300);
				}
			}	

          	}
          	else{
					Meteor.setTimeout(function() {
				    	$('#showstatus').modal('hide');
					}, 300);

				}
            
          }
        });	

        // this.countdownTimeStart();	
        // this.setState({
        // 	loginTime:new Date().getTime(),
        // },()=>{this.countdownTimeStart()})	;		
			
  	}

 //  	countdownTimeStart(){
	// 	var countDownDate = this.state.loginTime;
	// 	var countdwn=0;
	// 	var x = setInterval(function() {
	// 	    // Get todays date and time
	// 	    var now = new Date().getMinutes();
	// 	    var distance = countDownDate - now;	
	// 	    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	// 	    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	// 	    var seconds = Math.floor((distance % (1000 * 60)) / 1000);   
		 
	// 	    countdwn=countdwn+1;
	// 	    if(countdwn==10){
	// 	        clearInterval(x);		    	
	// 	    	Meteor.logout();
	// 	    	FlowRouter.go("/");
	// 	    }
	// 	}, 60000);
	// }

  	updateStudentNotifctn(){
  		 Meteor.call("updateStudentNotificationStatusToRead",(err,res)=>{
          if(err){
          }else{            
          }
        });
  	}

  	updateStudentTimeStatus(){
  		 Meteor.call("updateStudentDownTimeStatusStatusToRead",(err,res)=>{
          if(err){
          }else{            
          }
        });
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

	render(){
		 window.scroll(0,0);
		if(!this.props.loadingTest){
			if(this.props.studentData.studentId){
				var bgimg = 'bgmyprofile'}else{ var bgimg=''}
				if(this.props.downtimestatus._id && this.props.studentData.downTimeStatus=="Unread"){
					Meteor.setTimeout(function() {
				    $('#showNotice').modal('show');
					}, 300);
				}else{
					
					Meteor.setTimeout(function() {
				    $('#showNotice').modal('hide');
					}, 300);
				}
				
		return(
			<div>
		        <div className="content-wrapper">
				  <section className="content-header1">
				    {/*<h1>Start Purchased Practice Exam</h1>*/}
				  </section>
		          <section className={"content viewContent "+bgimg}>
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls">
		                <div className="box boxprof">
		                {this.props.studentData.studentId ?
		                  <div className="box-header with-border boxMinHeight pdcls">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
							{ this.props.packageOrderData.length>0?

								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 profileSection12">									
									<div className="col-lg-10 col-lg-offset-1 zeropadding">
										<div className="col-lg-10 col-lg-offset-1 ">
											<div className="examlinks1 col-lg-12 pckgtitle1">
												<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 nullPadding">Package Purchased</div> 											
												<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 nullPadding"><blink><a href="/PackageList" className="testtitle examlinks col-lg-12 col-md-12 col-xs-12 col-sm-12 pdcls" title="Click here to buy more packages">&nbsp; Buy New Packages</a></blink></div>											
											</div>
										</div>
										<div className="col-lg-10 col-lg-offset-1 scrollbar">
												{this.props.packageOrderData.map((data1,index)=>{
													return (
														<div key={index}>
															{

																data1.packages?
																data1.packages.map((data2,index2)=>{
																	return (<div className="col-lg-6 col-md-6 col-sm-12 outerboxpadding" key={index2}><div className="smallboxpckg1" > 
																		    	<div className="col-lg-12 col-md-12 smallfont paddingnone">{data2.packageName}</div>
																		    		<a className="startlink" title="Click here to start exam" href={`/startPurchasedPracticeExam/${data2.packageId}`}>Start</a>
																				</div>
																	    	</div>
																	    	);
																	})
																	:
																	<div>Packages Not Available</div>
															
														}
													    </div>);
												})}
										</div>
									</div>
									
								</div>
								:
								this.props.packageData.length>0?
								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 profileSection12">
									<div className="col-lg-10 col-lg-offset-1 ">
										<div className="examlinks1 col-lg-12 pckgtitle1 boldfont"><div className="col-lg-6 col-md-6 col-xs-6 col-sm-6 nullPadding">Total Packages Available : {this.props.totalPackagesCount?this.props.totalPackagesCount:null}</div>
											<div className="col-lg-6 col-md-6 col-xs-6 col-sm-6 nullPadding"><a href="/PackageList" className="testtitle examlinks col-lg-12 col-md-12 col-xs-12 col-sm-12 " title="Click here to purchase packages"><blink>&nbsp; View & Buy Packages</blink></a></div>
										</div>
									</div>
									<div className="col-lg-10 col-lg-offset-1 zeropadding">
										<div className="col-lg-12 boxlistpadding">
												{	
													this.props.packageData.map((data,index)=>{
										    		return data? 
										    				<div className="col-lg-6 col-md-6 col-sm-12 outerboxpadding" key={index}>
											    				<div className="col-lg-12 col-md-12 col-sm-12 smallboxpckg" > 
															    		<div className=" smallfont">{data.packageName}</div>
															    		
															    		<div className=" smallfont"> Attempt  : {data.AttemptOfPracticeTest}</div>
															    		<div className=" smallfont"> Rs. :  {data.PackagePrice}</div>
															    		<div className=" smallfont"> Practice Test :  {data.NoOfPracticeTest}</div>
															    		<div className="smallfont">
																	        <label title="Click here to see description" className="docLabel docLabelhover" data-toggle="modal" data-target={'#'+index}>Description</label>
																	     </div>
														    	</div>
														    	 <div id={index} className="modal fade" role="dialog">
															        <div className="modal-dialog">
															          <div className="modal-content documentModal dashboardPckgDesc">
															            <div className="modal-header">
															              <button type="button" className="close" data-dismiss="modal">&times;</button>
															                <h4 className="modal-title">Package Name : {data.packageName}</h4>
															            </div>
															            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
															              <div className=" modalbodyHeight col-lg-12 col-md-12 col-sm-12 col-xs-12">
															                <h5 className="modal-title">Description :</h5>
															                 {data.Description.length>0?
															                  <p className="docImageView packageDescPara">{data.Description}</p>
															                  :
															                  <p className="docImageView packageDescParaRed">Description not added for this package.</p>
															                }
															              </div>
															            </div>  
															            <div className="modal-footer">
															            </div>
															          </div>
															        </div>
															       </div>
													    	</div>
													    	:null
										    	})
											}
										</div>
									</div>
								</div>
								: 
								<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 profileSection12">
									<div className="col-lg-10 col-lg-offset-1 ">
										<div className="examlinks1 col-lg-12 pckgtitle1 boldfont">Packages Not Added
										</div>
									</div>
								</div>
						

							}
								

								<div className="col-lg-5 col-md-4 col-sm-12 col-xs-12 profileSection22 studentdashboardtoppadding">
									
									<StudentRegistrationforCompetition/>
									<PracticeStartExamForDashboard/>
								</div>
								<div className="col-lg-3 col-md-4 col-sm-12 col-xs-12 ">
								<div className="profileSection3"></div>
								<div className="bgmonkey bgmonkeyspace">
									<div className="col-lg-12 col-md-12 studProfileTit3">Reports</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
						              		<table className="table table-striped formTable formtabml">
											    <thead className="tableHeader1">
											        <tr>
											            <th className="col-lg-5 pdhead ">Exam Name </th>
											            <th className="col-lg-1 tab-Table pdhead"> Catg </th>
											            <th className="col-lg-1 tab-Table pdhead">  Marks </th>
											        </tr>
											    </thead>
											{this.props.mainExamReport!=0 ?
											    <tbody className="myAllTableReport reportbdscroll">
											     	{this.props.mainExamReport.map((Exams,index)=>{
											     	return <tr key={index}>
											     			<td className="col-lg-5 pdhead tabletxtwrap">{Exams.competitionName}</td>
											     			<td className="col-lg-1 tab-Table pdhead">{Exams.category}</td>
											     			<td className="col-lg-1 tab-Table pdhead">{Exams.totalScore}</td>
											     		</tr>
											     		})
											     }
											    </tbody>
											:
										    	<tbody className="OESDataNotAvailable reportbdscroll">
									    			<tr>
									    				<td colSpan="9">"Reports are Not Yet Available."</td>
									    			</tr>
									    		</tbody>
								    		}
											</table>
										</div>
									</div>

								</div>
								
						    </div>
						   </div>  
						  :
						  <div >
							<div  className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
								<div className="box-header with-border boxMinHeight  studDataNotExist whitebackground">

								 	Please Fill Registration Form <a href="/studentRegistration"> Click Here </a> to Register.
								</div>
							</div>
						
						</div>
						
					  }
					  
						</div>
					  </div>
					        <div className="modal fade modalHide" id="showstatus" role="dialog">
                                <div className="modal-dialog modal-lg" role="document">
                                  <div className="modal-content modalContent col-lg-12 nopad">
                                    <div className="modal-header userHeader notesheader">
		                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.updateStudentNotifctn.bind(this)}>
		                                  <span aria-hidden="true">&times;</span>
		                                </button>
                               			<h4 className="modal-title" id="exampleModalLabel">Important Notice</h4>
                              		</div>

                                    <div className="modal-body">
                                        <form className="newTemplateForm" >
                               
                                      <div className="row rowPadding">
                                        <div className="">
                                          <div className="form-group">
                                          {!this.props.loading1 ?
                                           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
                                           
                                        	{
                                        		this.props.Notificationstatus.map((notemsg,index)=>{  
                                        			var textcontent = renderHTML(notemsg.content);
                                        		  /*var textcontent = notemsg.content;                              
					                              var regex = new RegExp(/(<([^>]+)>)/ig);
					                              var textcontent = notemsg.content.replace(regex, '');
					                               textcontent   = textcontent.replace(/\&nbsp;/g, '');*/				                           

                                        			return(<ul className="" key={index}>

									                  <li>
									                  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									                  		<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 createdatnotice">
									                    		<TimeAgo date={notemsg.createdAt} />
									                    	</div>
									                  		<div className="col-lg-8 col-md-8 col-sm-12 col-xs-12 createdatnotice notificationWrap">
																{textcontent}
									                    	</div>
									                    </div>

									                  </li>
									                 
									                </ul>)
                                        		})
											}
                                           </div>
                                           :
                                           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
                                           		Loading...
                                           </div>
                                       }             
                                          </div>  
                                        </div>
                                      </div>

                                    </form>

                                      </div>
                                  	  <div className="modal-footer footerpadding ">
								        	<button type="button" className="btn btn-default col-lg-1 col-lg-offset-10" data-dismiss="modal" onClick={this.updateStudentNotifctn.bind(this)}>Got it</button>
								      </div>
                                  </div>
	                                
                                </div>
                            </div>

                            <div className="modal fade modalHide" id="showNotice" role="dialog">
                                <div className="modal-dialog modal-lg" role="document">
                                  <div className="modal-content modalContent col-lg-12 nopad showNoticeTop">
                                    <div className="modal-header userHeader notesheader">
		                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.updateStudentTimeStatus.bind(this)}>
		                                  <span aria-hidden="true">&times;</span>
		                                </button>
                               			<h4 className="modal-title" id="exampleModalLabel">Important Notice</h4>
                              		</div>

                                    <div className="modal-body">
                                        <form className="newTemplateForm" >
                               
                                      <div className="row rowPadding">
                                        <div className="">
                                          <div className="form-group">
                                          {!this.props.loading2 ?
                                           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                        			<ul className="">

									                  <li>
									                  	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									                  		<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 createdatnotice">
									                    		{this.props.downtimestatus.text} 
									                    	</div>
									                  		
									                    	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 createdatnotice">
																On : {this.props.downtimestatus.date}
									                    	</div>
									                    	<div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 createdatnotice">
																From :{this.props.downtimestatus.startTime} to {this.props.downtimestatus.endTime}
									                    	</div>
									                    </div>

									                  </li>
									                 
									                </ul>
                                        		
											
                                           </div>
                                           :
                                           <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">  
                                           		Loading...
                                           </div>
                                       }             
                                          </div>  
                                        </div>
                                      </div>

                                    </form>

                                      </div>
                                  	  <div className="modal-footer footerpadding ">
								        	<button type="button" className="btn btn-default col-lg-1 col-lg-offset-10" data-dismiss="modal" onClick={this.updateStudentTimeStatus.bind(this)}>Got it</button>
								      </div>
                                  </div>
	                                
                                </div>
                            </div>
                           
					</div>

                        
				  </section>
				</div>
			</div>
			);
		}else{
			return (
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
							<div className="col-lg-12 boxMinHeight  studDataNotExist">
								<div>
								 	Loading Please Wait...
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
}
export default StudentProfileContainer = withTracker(props=>{
	var id = Meteor.userId();
	const postHandle              = Meteor.subscribe('LoginInStudent',id);
	const loadingTest             = !postHandle.ready();
	var studentData               = StudentMaster.findOne({"studentId":id})||{};

	var myExamHandle              = Meteor.subscribe("showAllStudExams",Meteor.userId());
	var loadingTestExam           = !myExamHandle.ready();
	var mainExamReport            = MyExamMaster.find({"StudentId":Meteor.userId()},{fields:{"competitionName":1,"category":1,"totalScore":1}}).fetch()||{};	

	const postPackageHandle       = Meteor.subscribe('packageManagementData');
    const packageloading          = !postPackageHandle.ready();
    const packageData             = PackageManagementMaster.find({},{sort: {createdAt: 1}}).fetch();
	
	const postPackageOrderHandle  = Meteor.subscribe('showLoginStuddntOrders');
    const packageloading1         = !postPackageOrderHandle.ready();
    const packageOrderData        = PackageOrderMaster.find({"buyerId":Meteor.userId(),"status":"paid"},{sort: {paymentDate: -1},fields:{"packages":1}}).fetch()||{};

	const postHandle1             = Meteor.subscribe('NotificationMasterstatus');
	const loading1                = !postHandle1.ready();
	const Notificationstatus      = NotificationMaster.find({}).fetch();
	
	const postHandle2             = Meteor.subscribe('SiteDowntimeInfo');
	const loading2                = !postHandle2.ready();
	const downtimestatus     	  =  SiteDowntime.findOne({"timeStatus":"Broadcasted"})||{};
	
    if(packageData){
    	var totalPackagesCount    = packageData.length;
    	// var totalPackagesCount    = packageData.length;
    }

 	return{
		studentData,
		mainExamReport,
		loadingTest,
		totalPackagesCount,
		packageData,
		packageOrderData,
		Notificationstatus,
		loading1,
		loading2,
		downtimestatus
		
	}
})(StudentProfile);