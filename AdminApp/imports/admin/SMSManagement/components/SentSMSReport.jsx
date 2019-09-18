

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {CategoryMaster} from '/imports/admin/forms/addCategory/api/categoryMaster.js';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';
import { Session } from 'meteor/session';
import TimeInput from 'react-time-input';


class SentSMSReport extends TrackerReact(Component)  {
	constructor(){
		super();
		this.state ={
			allSMSData:'',
			facilityPermission : 'waitingforResult',  
		}		
	}

	componentWillMount(){
		Meteor.call("isAuthenticated","SMSManagement","SMSReport",(err,res)=>{
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

	componentDidMount(){
		Meteor.call("getSMSData",(err,res)=>{
	 		this.setState({
	 			allSMSData : res,
	 		});
		});
	}

	
	render(){
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});	
			
			return(
				<div>
			        {/* Content Wrapper. Contains page content */}
			        <div className="content-wrapper">
			          {/* Content Header (Page header) */}
			          <section className="content-header">
			            <h1>Sent SMS Report</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">
			                  <div className="box-header with-border">
					           {/* <h3 className="box-title">Send SMS</h3>*/}
					            </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  text-center onlineSXWrap">
									 <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable">
										<table className="table table-striped formTable tab-Table">
									    <thead className="tableHeader">
									        <tr>
									            <th className="col-lg-1">Sr. No</th>
									            <th className="col-lg-5">SMS Content </th>
									            <th className="col-lg-3"> Successfully delivered to </th>
									            <th className="col-lg-3"> Failed to deliver </th>
									            <th className="col-lg-3"> Sent Date </th>
									        </tr>
									    </thead>
									   	

									    {this.state.allSMSData.length !=0 ?	    	
										    <tbody className="myAllTabler">
										    	{this.state.allSMSData.map((SMSData, index)=>{
										    		return <tr key={index}>
										    			<td>{index+1}</td>
										    			<td className="leftalignedText">{SMSData.smsText}</td>
										    			{SMSData.SuccessContactNo.length>0?
											    			<td>
												    		{/*	{SMSData.SuccessContactNo.map((SMSDataSuccessNo, index1)=>{
																	return (<div key={index1}>

																				<div>{SMSDataSuccessNo.SuccessContactNo}</div>

																			</div>)
																})}*/}
																 <label title="Click here to see description" className="docLabel viewnum docLabelhover" data-toggle="modal" data-target={'#'+index}>View Numbers</label>
																 <div id={index} className="modal fade" role="dialog">
															        <div className="modal-dialog">
															          <div className="modal-content documentModal dashboardPckgDesc">
															            <div className="modal-header">
															              <button type="button" className="close" data-dismiss="modal">&times;</button>
															                <h4 className="modal-title">Successfully delivered to</h4>
															            </div>
															            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
															              <div className=" modalbodyHeight modalbodyHeightsms scrolltomodal col-lg-12 col-md-12 col-sm-12 col-xs-12">
															                <h5 className="modal-title">Contact Nos. :</h5>
															                	{/*{SMSData.SuccessContactNo.map((SMSDataSuccessNo, index1)=>{
																					return (<span key={index1}>
																								<span>{SMSDataSuccessNo.SuccessContactNo}</span>,&nbsp;&nbsp;
																							</span>)
																				})}*/}
																				<table className="table table-striped formTable tab-Table">
																				    <thead className="tableHeader">
																				        <tr>
																				            <th className="col-lg-1">Sr. No</th>
																				            <th className="col-lg-1 ">Mobile No.</th>									            
																				        </tr>
																				    </thead>
																				    {
																				    	SMSData.SuccessContactNo.length !=0 ?	    	
																					    <tbody className="myAllTabler">
																					    	{SMSData.SuccessContactNo.map((SMSDataSuccessNo, index1)=>{
																					    		return <tr key={index1}>
																					    			<td>{index1+1}</td>
																					    			<td>{SMSDataSuccessNo.SuccessContactNo}</td>
																					    		</tr>
																					    	})}
																					    </tbody>
																						:
																				    	<tbody className="OESDataNotAvailable">
																							<tr> 
																								<td colSpan="2">Nothing to display</td>
																							</tr>
																				    	</tbody>
																				    }
																				</table>



															              </div>
															            </div>  
															            <div className="modal-footer">
															            </div>
															          </div>
															        </div>
															       </div>
															</td>
															:
															<td>{"-----"}</td>
														}
														{SMSData.FailureContactNo.length>0?
															<td>
												    			{/*{SMSData.FailureContactNo.map((SMSDataFailureNo, index1)=>{
																	return (<div key={index1}>
																				<div>{SMSDataFailureNo.FailureContactNo}</div>		    				    			
																			</div>)
																})}
*/}

																 <label title="Click here to see description" className="docLabel docLabelhover" data-toggle="modal" data-target={'#'+index+"f"}>View Numbers</label>
																 <div id={index+"f"} className="modal fade" role="dialog">
															        <div className="modal-dialog">
															          <div className="modal-content documentModal dashboardPckgDesc">
															            <div className="modal-header">
															              <button type="button" className="close" data-dismiss="modal">&times;</button>
															                <h4 className="modal-title">Failed to deliver</h4>
															            </div>
															            <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
															              <div className=" modalbodyHeight scrolltomodal col-lg-12 col-md-12 col-sm-12 col-xs-12">
															                <h5 className="modal-title">Contact Nos. :</h5>
															                	{SMSData.FailureContactNo.map((SMSDataFailureNo, index1)=>{
																					return (<span key={index1}>
																								<span>{SMSDataFailureNo.FailureContactNo}</span>,&nbsp;&nbsp;
																							</span>)
																				})}
															              </div>
															            </div>  
															            <div className="modal-footer">
															            </div>
															          </div>
															        </div>
															       </div>








															</td>
															:
															<td>{"-----"}</td>
														}

														<td>{moment(SMSData.SMSSentAt).format('L')}</td>

										    				
										    		</tr>
										    	})}
										    </tbody>
										:
								    	<tbody className="OESDataNotAvailable">
											<tr> 
												<td colSpan="5">Nothing to display</td>
											</tr>
								    	</tbody>

										
								    }
									</table>
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
		// }else{
		// 	 return (
		// 	 	<div>
		// 	        {/* Content Wrapper. Contains page content */}
		// 	        <div className="content-wrapper">
		// 	          {/* Content Header (Page header) */}
		// 	          <section className="content-header">
		// 	            <h1>Question Paper</h1>
		// 	          </section>
		// 	          {/* Main content */}
		// 	          <section className="content viewContent">
		// 	            <div className="row">
		// 	              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		// 	                <div className="box">
		// 	                  <div className="box-header with-border boxMinHeight">
		// 		                  <div className="box-header with-border">
		// 				            <h3 className="box-title">Set Question Paper</h3>
		// 				          </div>
		// 						  <div className="col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-12 col-xs-12 onlineSXWrap loadingPageWrap">
		// 							 	<div className="col-lg-12 col-md-12">
		// 									<img src="/images/pageLoading.gif"/>
		// 						        </div>
		// 						   </div>
		// 					  </div>
		// 				    </div>
		// 				  </div>
		// 				</div>
		// 			  </section>
		// 			</div>
		// 		</div>

		// 	);
		// }



		}else if (this.state.facilityPermission == false ){
				  	return(<h1>{FlowRouter.go('/noAccesss')}</h1>);
			  }else if(this.state.facilityPermission == "waitingforResult"){
			  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
				</div>);
			  }else{ 
			  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
				   <h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/ShowAll">click here </a> to assign permission</h3>
				</div>);
		}
	}
}
export default SendSMSReport = withTracker(props=>{
	// var id = FlowRouter.getParam("id");
	// var postHandle = Meteor.subscribe("singleQuestionPaper",id).ready();
	// var questionPaperData = QuestionPaperMaster.findOne({"_id":id})||{};
	// var getPercernt = UserSession.get("progressbarSessionContact",Meteor.userId());
 //    var allPercernt = UserSession.get("allProgressbarSessionContact",Meteor.userId());
 //    var total = (getPercernt/allPercernt)*100;
	
	return{
		// questionPaperData,
		// 'getPercernt' : getPercernt,
  //   	'allPercernt' : allPercernt,
  //   	'total' : total,
	}
})(SentSMSReport);