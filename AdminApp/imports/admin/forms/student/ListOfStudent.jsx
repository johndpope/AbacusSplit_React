/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will show final question papers. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import InputMask from 'react-input-mask';
import { FranchiseDetails } from '/imports/admin/companySetting/api/CompanySettingMaster.js';

import PackageList from '/imports/admin/packageList/components/PackageList.jsx';

import {PackageManagementMaster} from '/imports/admin/packageManagement/api/packageManagementMaster.js';
import {PackageOrderMaster} from '/imports/admin/forms/invoice/api/packageOrderMaster.js';
import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';

class ListOfStudent extends TrackerReact(Component)  {
	
	constructor(props){
		super(props);
		this.state={
			studentName : '',
			paidStudent :'',
			unPaidStudent :'',
			orderId :'',
			studentId :'',
			packageTotal :'',
			'allStudentData':[],
			allCompetitions : [],
			allPackageData  :[],
			orderMasterData  :[],
		}
		this.AllPackageData = this.AllPackageData.bind(this);
		// this.addPackages = this.addPackages.bind(this);
		this.getStudentId = this.getStudentId.bind(this);
	}

	componentWillMount(){
		
	}

	componentDidMount(){
		Meteor.call("allCompetitions",(err,res)=>{
	 		this.setState({
	 			allCompetitions : res,
	 		});
	 	});
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		this.showAllStudent();
		this.AllPackageData();
	}
	
	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

  	getCompetitionId(s){

	}

	AllPackageData(){
			if(!this.state.SearchText){
				
				Meteor.call("allPackage",(err,res)=>{
					if(err){
						
					}else{
						
						this.setState({'allPackageData':res});
					}
				})

			}else{
		
				Meteor.call("SearchPackage",this.state.SearchText,(err,res)=>{
					if(err){
						// console.log(error);
					}else{
						this.setState({'allPackageData':res});
					}
				})
			}
		
	}
  	
  	addPaymentDetails(event){
		event.preventDefault();
		var paymentFormValues={
			competitionId:$("#selectCompetitionId"+$(event.target).attr('id')+ " option:selected").attr("id"),
			competitionName:$("#selectCompetitionId"+$(event.target).attr('id')+ " option:selected").attr("value"),
			paymentReceived : $("#paymentReceived"+$(event.target).attr('id')).val(),
			franchiseShare : $("#franchiseShare"+$(event.target).attr('id')).val(),
			studentId : $(event.target).attr('id'),
		}
		if(paymentFormValues.paymentReceived >=0 && paymentFormValues.franchiseShare>=0){
			Meteor.call("addCompPayDetails",paymentFormValues,(err,res)=>{
				if(err){

				}else{
					if(res=="alreadyPaid"){
						$(".cashPayModalSec").modal('hide');
						swal("Student already paid ","","warning");
					}else{
						Meteor.call("setCompetitionPaymentStatusManually",paymentFormValues.studentId,(err,res)=>{
						  if(err){
						  }else{
						   
						  }
						});
						$(".cashPayModalSec").modal('hide');
						swal("Payment SuccessFully","","success");

					}
				}
			});
		}else{
			swal("Amount must be greater than zero","","warning");
		}
	}

	showAllStudent(){
		if(!this.state.studentName){
			Meteor.call("allStudentCategoryWiseListOfFranchise",FlowRouter.getParam('fId'),(err,res)=>{
				if(err){
					console.log(error);
				}else{
					this.setState({'allStudentData':res});
				}
			})

		}else{
	
			Meteor.call("SearchStudentCategoryWiseListOfFranchise",FlowRouter.getParam('fId'),this.state.studentName,(err,res)=>{
				if(err){
					console.log(error);
				}else{
					this.setState({'allStudentData':res});
				}
			})
		}
	}

	// Exam search by exam name

	buildRegExp(searchText) {
	   var words = searchText.trim().split(/[ \-\:]+/);
	   var exps = _.map(words, function(word) {
	      return "(?=.*" + word + ")";
	   });

	   var fullExp = exps.join('') + ".+";
	   return new RegExp(fullExp, "i");
	}

	getTextValue(event){
		var studentName= $('.SearchFranchise').val();
		if(studentName){
			var RegExpBuildValue = this.buildRegExp(studentName);
			this.setState({
				studentName   : RegExpBuildValue,
				paidStudent   : RegExpBuildValue,
				unPaidStudent : RegExpBuildValue,
			},()=>{this.showAllStudent()});
		}else{
			this.setState({
				studentName   : '',
				paidStudent   : '',
				unPaidStudent : '',
			},()=>{this.showAllStudent()});
		}
	}

	updatePaidUnpaidStatus(event){
		var _id = $(event.target).attr('id');
		Meteor.call("paidUnpaidStudent",_id);
		Meteor.call("updateExamFee",_id);
		this.showAllStudent();
	}

	showhideSubCatDetails(event){
		$('.categoryListDataStud').toggleClass('categoryListDataStudshow');
	}

	  // addPackages(event){
   //      var packageId = event.target.getAttribute('id');
   //      Meteor.call('addPackagesPurchase',packageId,FlowRouter.getParam("orderId"),this.state.studentId,(err,res)=>{
   //        if(err){
   //          console.log("Something went wrong");
   //        }else{
   //          var orderId = res;
   //          if(orderId){
   //          this.setState({
   //          	orderId : orderId,
   //          })

   //            FlowRouter.go('/Admin/ListOfStudents/'+FlowRouter.getParam("fId")+'/'+orderId);
   //          }
   //        }
   //      });
   //    }

   //      buyPackages(){
	  //       Meteor.call("checkPackagesAdded",FlowRouter.getParam('orderId'),(err,res)=>{
	  //         if(err){
	  //           console.log(err);
	  //         }else{
	  //       // console.log("res",res);

	  //           if(res){
	  //           	if(res.packages){
			// 			var packageTotal = res.packages.reduce((addprice,elem)=>{
			// 				return  addprice + elem.packagePrice;
			// 			},0);
			// 		}
	            	
   //          console.log("res, packageTotal",res, packageTotal);


	  //        //    	this.setState({
			//       	// 	orderMasterData : res,
			//       	// 	packageTotal    : packageTotal,
			//       	// })
	  //               FlowRouter.go("/MyInvoice/"+FlowRouter.getParam("orderId"));
	                
	  //               $('.modal-backdrop').hide();
	  //               $('#packageCashPayModal'+this.state.studentId).modal('hide');	               
	                
	  //             }else if(res=="notAdded"){
	  //               swal("Please Select Package","","warning");
	  //             }else{
	  //               swal("Please Select Package","","warning");
	  //             }
	  //           }
	  //       });
   //    }

      getStudentId(e){
      	e.preventDefault();
      	this.setState({
      		studentId : $(e.target).attr('data-id'),
      	})
      	FlowRouter.go('/PackageList/'+FlowRouter.getParam('fId')+'/'+$(e.target).attr('data-id'));
      
      }

        cancdlinvoice(event){
		    event.preventDefault();
		    // var path = "/ServiceRequiredData/"+this.props.invoice.serviceId+"-"+this.props.invoice.serviceName+"-"+this.props.order._id;
		    // // 
		    // FlowRouter.go(path);
		  }



		confirm(event){ 
	    	event.preventDefault();
			// Meteor.call('paymentGatewayforPackageBuy',FlowRouter.getParam('id'),(error,result)=>{
			// if(error){
			// console.log('error');
			// }else{
			// 	window.location = result;
			// 	}
			// });
		}

		closeModal(e){
			e.preventDefault();
			FlowRouter.go('/Admin/ListOfStudents/'+FlowRouter.getParam('fId'));
		}

		


	render(){
		
		return(
			<div>
		        {/* Content Wrapper. Contains page content */}
		        <div className="content-wrapper">
		          {/* Content Header (Page header) */}
		          <section className="content-header">
		            <h1>List of Franchise</h1>
		          </section>
		          {/* Main content */}
		          <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                  	<div className="box-header with-border">
				            	<h3 className="box-title">Franchise Students List</h3>
				            </div>
				            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 comFranchTit">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<label>Franchise Name</label> : {this.props.franchiseData.franchiseName}
								</div>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div className="col-lg-12 col-md-12 searchTableBoxAlignSETT">
			                   		<span className="blocking-span">
				                   		<input type="text" name="search"  className="col-lg-4 col-sm-4 SearchExam SearchFranchise inputTextSearch" placeholder="Search by student name" onInput={this.getTextValue.bind(this)} required/>
			                   		</span>
			                    </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
					              		<table className="table table-striped formTable" id="ExamListTable">
										    <thead className="tableHeader">
										        <tr>
										            <th className="tab-Table">Sr. No</th>
										            <th className="col-lg-3">Student Name </th>
										            <th className="col-lg-2 tab-Table"> Mobile Number </th>
										            <th className="tab-Table">Category</th>
										            <th className="col-lg-2 tab-Table"> Cash Payment For Competition</th>
										            <th className="col-lg-1 tab-Table"> Cash Payment For Package </th>
										            
										            
										        </tr>
										    </thead> 
										    {this.state.allStudentData.length !=0 ? 
										    	!this.state.allStudentData ?
									    		<tbody className="OESDataNotAvailable">
										    		<tr> 
									    				<td colSpan="7">" Students are loading... Please wait "</td>
									    			</tr>
								    			</tbody>
								    		:
										    <tbody className="myAllTable">
										    	{this.state.allStudentData.map((allStudent, index)=>{
										    		return <tr key={index}>
										    			<td className="tab-Table"></td>
										    			<td className="studnameWraptable"><a href={`/StudentInformations/${allStudent.studentId}`} title="Click to view student profile">{allStudent.studentFullName}</a></td>
										    			<td className="tab-Table">{allStudent.mobileNumber}</td>
										    			<td className="tab-Table">{allStudent.category} - {allStudent.subCategory}</td>
										    			<td className="paidUnpaidWrap tab-Table">
										                   <button className="btn btn-success paymentBtnList" data-toggle="modal" data-target={"#cashPayModal"+allStudent._id}> Cash Payment For Competition</button>
										    			</td>

										    			<td className="paidUnpaidWrap tab-Table">
										                   <button className="btn btn-success paymentBtnList" data-toggle="modal"  data-id={allStudent.studentId} onClick={this.getStudentId.bind(this)}> Cash Payment For Package</button>
										    			</td>

														<div id={"cashPayModal"+allStudent._id} className="modal fade cashPayModalSec" role="dialog">
														  <div className="modal-dialog">
														    <div className="modal-content studentCashPaymentModal">
														      <div className="modal-header">
														        <button type="button" className="close" data-dismiss="modal">&times;</button>
														        <h4 className="modal-title"><label>Student Name : </label> {allStudent.studentFullName}</h4>
														      </div>
														      <div className="modal-body modalBodyPayRec">
														      <p>
														       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 payModalBody">
														       <form onSubmit={this.addPaymentDetails.bind(this)} id={allStudent.studentId}>
														       	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 competitionSelect payCompSelect">
														       		<span className="CSExam">Select Competition</span>
																	<span className="blocking-span"> 
																		<select type="text" name="competitionId" ref="competitionId"  id={"selectCompetitionId"+allStudent.studentId} onClick={this.getCompetitionId.bind(this)} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText inputTextReportTabel" autoComplete="off" title="Please select competition" required>
																			<option value="">-- Select Competition --</option>
																			{this.state.allCompetitions.map((competition,index)=>{
																				return <option key={index} id={competition._id} value={competition.competitionName}>{competition.competitionName}</option>
																			  })
																			}
																		</select>					   								   			
																	</span>
																</div>
																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
																	<span className="CSExam">Payment Received(Maats)</span>
																	<span className="blocking-span"> 
																		<input type="number" name="paymentReceived" id={"paymentReceived"+allStudent.studentId} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required/>					   		
																		<input type="hidden" name="studentId" value={allStudent.studentId} />
												
																	</span>
																</div>

																<div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
																	<span className="CSExam">Franchise Share</span>
																	<span className="blocking-span"> 
																		<input type="number" name="franchiseShare" id={"franchiseShare"+allStudent.studentId}  className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" required/>					   			
												
																	</span>
																</div>
																<div className="col-lg-12 col-md-12 col-sm-12 RCPBtn">
														      		<button type="submit" className="btn btn-success"> Received Cash Payment</button>
														        </div>
														        </form>
														       </div>
														       </p>
														      </div>

														    </div>

														  </div>
														</div>

													{/*	<div id={"packageCashPayModal"+allStudent._id} className="modal fade cashPayModalSec" role="dialog">
														  <div className="modal-dialog">
														    <div className="modal-content  studentCashPaymentModal">
														      <div className="modal-header">
														        <button type="button" className="close" onClick={this.closeModal.bind(this)} data-dismiss="modal">&times;</button>
														        <h4 className="modal-title"><label>Student Name : </label> {allStudent.studentFullName}</h4>
														      </div>
														      <div className="modal-body modalBodyPayRec">
														      <p>
														       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 payModalBody">
														  			
																	<div className="table-responsive col-lg-12 col-md-12 col-sm-12 col-xs-12 topMarginToTable">
																		<table className="table table-striped  table-hover table-bordered reportTables" id="monthlyStudRegReporttab">
																			<thead>
																				<tr className="tableHeader">
																					
																					<th> Package Name </th>
																					<th> Category </th>
																					<th> Sub Category</th>
																					<th> No. of Practice Test </th>
																					<th> No. of Attempt </th>
																					<th> Price (Rs) </th>
																					<th> Action </th>
																					
																					
																				</tr>
																			</thead>
																			<tbody className="myAllTable">
																				{this.state.allPackageData.map((packageData, index)=>{
																				return <tr key={index}>
																							
																							<td>{packageData.packageName}</td>
																							<td>{packageData.categoryName}</td>
																							<td>{packageData.subCategory}</td>
																							<td>{packageData.NoOfPracticeTest}</td>
																							<td>{packageData.AttemptOfPracticeTest}</td>
																							<td>{packageData.PackagePrice}</td>
																							<td className="col-lg-1 col-md-2 col-sm-1 col-xs-1 tab-Table textaligncenter">
																								<div className="checkbox checkbox-success pull-right">
													                                                <input type="checkbox" className="seleectQueInput" id={packageData._id} name="seleectQueInput" onClick={this.addPackages.bind(this)} />
													                                                <label></label>
													                                            </div>
																							</td>
																							
																						</tr>
																			})}
																			</tbody>
																		</table>

																		
																	</div>
																	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 bypackagebtnWrap">
									                                    <button className="btn bypackagebtn" onClick={this.buyPackages.bind(this)}>Buy Packages</button>
									                                  </div>

														       </div>
														       </p>
														      </div>

														    </div>

														  </div>
														</div>*/}


													{/*	<div id={"packageInvoiceModal"+this.state.sudentId} className="modal fade cashPayModalSec" role="dialog">
														  <div className="modal-dialog">
														    <div className="modal-content  studentCashPaymentModal">
														      {/*<div className="modal-header">
														        <button type="button" className="close" data-dismiss="modal">&times;</button>
														        <h4 className="modal-title"><label>Student Name : </label> {allStudent.studentFullName}</h4>
														      </div>
														      <div className="modal-body modalBodyPayRec">
														      <p>
														       <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 payModalBody">


														       			 <div>
															                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 headerinvoice">
															                    <span className="col-lg-5 col-lg-offset-1 col-md-5 col-md-offset-1 col-sm-6 col-xs-7 invoicetitle">INVOICE</span>
															                    <span className="col-lg-1 col-md-1 col-sm-1 col-xs-1 mailtitle"></span>
															                    <span className="col-lg-4 col-md-4 col-sm-4 col-xs-4 addresstitle"> <br /></span>
															                   
															                  </div>
															                  
															                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 invoicebill">
															                    <div className="col-lg-3 col-lg-offset-1 col-md-3 col-md-offset-1 col-sm-3 col-sm-offset-1 col-xs-12 clientbilled">
															                      <div className="billedto date">Billed To</div>
															                   
															                      <div className="clientdetails">
															                      </div>
															                    </div>
															                    <div className="col-lg-7 col-lg-offset-1 col-md-7 col-md-offset-1 col-sm-7 col-sm-offset-1 col-xs-12 clientaddress">
															                    	<div className="col-lg-6 col-md-6   textCenterInvoice">
																                      <div className="invoicenumber date">Invoice Number <br /></div>
																                      <div className="">{this.props.orderMasterData.invoiceId}</div>
															                        </div>
															                        <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 textCenterInvoice">            
																                      <div className="dateofissue date">Invoice Date <br /></div>
																                      <div className="">{moment(this.props.orderMasterData.createdAt).format("DD/MM/YYYY")}</div>
															                      </div>
															                    </div>
							
															                  </div>


															                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 dash dashFirst"></div>

															                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 col-xs-12 table1">
															                    <table>
															                      <thead className="">
															                        <tr className="tablehead1">
															                          <th className="col-lg-8 col-md-8 col-sm-8 col-xs-8 serviceNm">Package Name </th>
															                          <th className="col-lg-2 col-md-2 col-sm-2 col-xs-2 amtcount">Unit Cost </th>
															                          <th className="col-lg-2 col-md-2 col-sm-2 col-xs-2 invoiceQuantity">Qty </th>
															                          <th className="col-lg-3 col-md-3 col-sm-3 col-xs-3 amtcount">Amount </th>
															                        </tr>
															                      </thead>
															                      <tbody>
															                        {
															                          this.props.orderMasterData ? 
															                           this.props.orderMasterData.packages.map((packageData,index)=>{
															                            return(
															                              <tr key ={index} className="firstrow">
															                                <td className="col-lg-8 col-md-8 col-sm-8 col-xs-8">{packageData.packageName} <br />
															                                <span className="textCSN">Category: {packageData.category}, sub-Category: {packageData.subCategory} , Number of Paper: {packageData.NoOfPracticeTest}</span> 
															                              </td>
															                                <td className="col-lg-2 col-md-2 col-sm-2 col-xs-2 amtcount"><i className="fa fa-rupee"></i>{packageData.packagePrice}</td>
															                                <td className="col-lg-2 col-md-2 col-sm-2 col-xs-2 invoiceQuantity">1 </td>
															                            <td className="col-lg-2 col-md-2 col-sm-2 col-xs-2 invoiceQuantity"><i className="fa fa-rupee"></i>{packageData.packagePrice * 1} </td>
															                                
															                              </tr>
															                            )
															                           })
															                         
															                          :
															                          null
															                        }
															                      </tbody>
															                    </table>
															                   
															                    <hr className="hrhide"></hr>
															                 
															                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLeftRight">
															                    <div className="pull-right text-right noPadLeftRight col-lg-6 col-md-6 col-sm-6 col-xs-12">
															                      <span className="subtotal  text-right col-lg-7 col-md-7 col-sm-7 col-xs-12 noPadLeftRight">Invoice Total </span>
															                      <span className="subtotlecount  text-right col-lg-4 col-md-4 col-sm-4 col-xs-4 noPadLeftRight"><i className="fa fa-rupee"></i>{this.props.packageTotal}</span>
															                    
															                    </div>  
															                  </div>
															                 </div>
															                 
															                 
															                  <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-12 col-xs-12 outerButtonDiv">
															                    <a href="/PackageList">
															                    <button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-left" onClick={this.cancdlinvoice.bind(this)}>Cancel</button>
															                    </a>
															                    <button type="submit" className="col-lg-3 col-md-4 col-xs-12 col-sm-12 col-xs-12 btn ServiceProcessButtons pull-right" onClick={this.confirm.bind(this)}>Make Payment</button>
															                   </div>
															                
															                 
															              </div>
														  			
															

														       </div>
														       </p>
														      </div>

														    </div>

														  </div>
														</div>*/}
										    			
										    		</tr>
										    	})}	
										    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr>
									    				<td colSpan="6">" Students not yet Registered."</td>
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
	}
}
export default ListofStudentContainer = withTracker(props=>{
		var franchId = FlowRouter.getParam("fId");
		var postHandle = Meteor.subscribe('singleFranchiseData',franchId);
		var loading = !postHandle.ready();
		var franchiseData = FranchiseDetails.findOne({"franchiseCodeForCompanyId":franchId})||{};

		// var orderId = FlowRouter.getParam("orderId");
		// const postHandleInvoice  = Meteor.subscribe('singleOrder',orderId);
		// const loadingInvoice = !postHandleInvoice.ready();
		// var orderMasterData = PackageOrderMaster.findOne({"_id":orderId})||{}; 
		// if(orderMasterData.packages){
		// 		var packageTotal = orderMasterData.packages.reduce((addprice,elem)=>{
		// 			return  addprice + elem.packagePrice;
		// 		},0);
		// }


		return {
			franchiseData,
			// orderMasterData,
			// packageTotal,
		}

})(ListOfStudent);