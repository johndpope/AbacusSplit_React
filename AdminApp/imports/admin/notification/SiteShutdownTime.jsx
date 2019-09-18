

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import { SiteDowntime }   from '/imports/admin/notification/api/ShutdownTime.js';
import { NotificationMaster }   from '/imports/admin/notification/apiNotificationMaster.js';
import { SiteDowntime }   from '/imports/admin/notification/apiNotificationMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';


class SiteShutdownTime extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
			
			startTime   : '',
			endTime     : '',
			statusId    :'',
			date        :'',
			downtimeDate:'',
			subscription :{
				mydata      : Meteor.subscribe("SiteDowntimeInfo"),
				
			}
			
			// text:'Site will be shutdown for :',			
		}
		this.handleChange = this.handleChange.bind(this);
		
	}

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		// if(this.state.statusId==''){
		// 	FlowRouter.go("/admin/siteShutdownTime");
		// }else{			
		// 	FlowRouter.go("/admin/siteShutdownTime/"+this.state.statusId);
		// }	

  	}

  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  	
	

	createDowntime(event){
		event.preventDefault();
		var downTimeValues = {
			
			startTime     : this.refs.startTime.value.trim(),
			endTime       : this.refs.endTime.value.trim(),
			date          : moment(this.refs.date.value).format('LL'),
			downtimeDate  : this.refs.date.value,
			// text : this.state.text,
			// id:FlowRouter.getParam("Id"),
			
		}
		
		var today           = new Date();
		var currentTime     = moment(today).format('LT');		
		var todayDate = moment(today).format('LL');
		var sTime=moment(downTimeValues.startTime, 'h:mma');
		var eTime=moment(downTimeValues.endTime, 'h:mma');	
		var cTime=moment(currentTime, 'h:mma');	

		
		if(downTimeValues.date==todayDate){
			if(downTimeValues.startTime && downTimeValues.endTime){
				if(sTime>cTime){
					if(sTime<eTime){				
						Meteor.call("insertSiteDownTime",downTimeValues,(error,result)=>{
							if(error){
							}else{
								 Meteor.call("updateAllStudentReadStatus",(err,res)=>{
		                          if(err){
		                          }else{
		                            
		                          }
		                        });
								 Meteor.call("getdownTimeStatus",result,(err,res)=>{
							          if(err){ 
							          }else{ 
							          	
							        }})
								FlowRouter.go("/admin/siteShutdownTime/"+result);
								swal("Notice broadcasted successfully!!!");
							}
						});			
					}else{
						swal("Service Down start time should be less than endTime","","warning");
					}

			}else{
				swal("Service Down start time should be greater than current time","","warning");
			}
			}
			else{
					swal("Please select time","","warning");
			}
}
	else if(downTimeValues.date>todayDate){
		// swal("Please do not select past date","","warning");
		if(downTimeValues.startTime && downTimeValues.endTime){
				// if(downTimeValues.endTime>currentTime){
					if(sTime<eTime){				
						Meteor.call("insertSiteDownTime",downTimeValues,(error,result)=>{
							if(error){
							}else{
								 Meteor.call("updateAllStudentReadStatus",(err,res)=>{
		                          if(err){
		                          }else{
		                            
		                          }
		                        });
								 Meteor.call("getdownTimeStatus",result,(err,res)=>{
							          if(err){ 
							          }else{ 
							          	
							        }})
								FlowRouter.go("/admin/siteShutdownTime/"+result);
								swal("Notice broadcasted successfully!!!");
							}
						});			
					}else{
						swal("Service Down start time should be less than endTime","","warning");
					}

			// }else{
			// 	swal("Service Down end time should be greater than current time","","warning");
			// }
			}
			else{
					swal("Please select time","","warning");
			}


	}else{
		swal("Please do not select past date","","warning");

	}


	}

	
	componentWillReceiveProps(nextProps){
		if(nextProps &&  nextProps.SiteDowntimeData){
			// console.log("nextProps.SiteDowntimeData",nextProps.SiteDowntimeData);
			this.setState({				
				startTime    : nextProps.SiteDowntimeData.startTime,
				endTime      : nextProps.SiteDowntimeData.endTime,	
				statusId:		 nextProps.SiteDowntimeData._id,
				date:		 nextProps.SiteDowntimeData.downtimeDate,
			});
		}else{
			this.setState({				
				startTime    : '',
				endTime      : '',	
				statusId     :'',		
				downtimeDate :'',		
			});

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

 	
	componentDidUpdate(){		
		$('#startTimeID1').datetimepicker({format: 'LT'});
		$('#endTimeID1').datetimepicker({format: 'LT'});
		$('.startTimeIDPick1').datetimepicker({format: 'LT'});
		$('.endTimeIDPick1').datetimepicker({format: 'LT'});
	}
	deleteDowntime(){
		Meteor.call("DeleteDowntime",FlowRouter.getParam("Id"),(err,res)=>{
          if(err){ 
          }else{ 
          	swal("Broadcast stopped.");
          	FlowRouter.go("/admin/siteShutdownTime");
          	
        }})

	}

	render(){			
			var id = FlowRouter.getParam("Id");
			if(id){
				var btnTitle = "Update";
			}else{
				var btnTitle = "Submit";
			}
			if(!this.props.loading){
				if(this.state.statusId){
					FlowRouter.go("/admin/siteShutdownTime/"+this.state.statusId);
				}else{			
					FlowRouter.go("/admin/siteShutdownTime");
				}
			  return(				
				<div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1 >Service Downtime</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">			                  
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 onlineExamWrap1 createExamWrapp">
									
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<span className="CSExam">Service should be down from :</span>											
										</div>
										<div className='col-lg-4 col-md-4 col-sm-12 col-xs-12'>
											<span className="CSExam">Date </span>
								            <div className="form-group">
								                <div className='input-group date'>
								                    <input type='date' className="form-control" name="date" ref="date" value={this.state.date} onChange={this.handleChange} required/>
								                    <span className="input-group-addon">
								                        <span className="glyphicon glyphicon-calendar"></span>
								                    </span>
								                </div>
								            </div>
								        </div>
										<div className='col-lg-4 col-md-4 col-sm-4 col-xs-4'>
											<span className="CSExam">Start Time </span>
								            <div className="form-group">
								                <div className='input-group date' id="startTimeID1">
								                    <input type='text' className="form-control startTimeIDPick1" name="startTime" ref="startTime" value={this.state.startTime} onChange={this.handleChange} required/>
								                    <span className="input-group-addon">
								                        <span className="glyphicon glyphicon-time"></span>
								                    </span>
								                </div>
								            </div>
								        </div>

								        <div className='col-lg-4 col-md-4 col-sm-4 col-xs-4'>
								        	<span className="CSExam">End Time  </span>
								                <div className="form-group">
								                <div className='input-group date' id='endTimeID1'>
								                    <input type='text' className="form-control endTimeIDPick1" name="endTime" ref="endTime" value={this.state.endTime} onChange={this.handleChange} required/>
								                    <span className="input-group-addon">
								                        <span className="glyphicon glyphicon-time"></span>
								                    </span>
								                </div>
								            </div>
								        </div>											
										
											 {
                                          FlowRouter.getParam("Id")?                                          
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<button type="submit"  id={this.props.SiteDowntimeData._id} value="cancel" title="Click to cancel notice" onClick={this.deleteDowntime.bind(this)} type="submit" className="col-lg-3 col-md-3 btn btn-primary craeteExamBtn pull-right"> Cancel</button>
											</div>	
                                          
											:
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
												<button value="Broadcast" title="Click to broadcast notice" onClick={this.createDowntime.bind(this)} type="submit" className="col-lg-3 col-md-3 btn btn-primary craeteExamBtn pull-right"> Broadcast</button>
											</div>                           

                                        }								
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
			}else{
				return(<h3>Loading Please wait.</h3>);
			}
		
	}
}
export default CreateDownTimeContainer = withTracker(props =>{
	var _id = FlowRouter.getParam("Id");
	const postHandleSiteDowntimeInfo             = Meteor.subscribe('SiteDowntimeInfo');
	const loadingSiteDowntimeInfo                = !postHandleSiteDowntimeInfo.ready();
	const SiteDowntimeData                  	  =  SiteDowntime.findOne({"timeStatus":"Broadcasted"})||{};
	if(SiteDowntimeData){
		var statusId=SiteDowntimeData._id;
	}
	return{
		loadingSiteDowntimeInfo,
		SiteDowntimeData,
		statusId
		// _id
	} 
})(SiteShutdownTime);