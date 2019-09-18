/*  
	COMPONENT:  Add CATEGORY 
	PROGRAMMER: VIKAS JAGDALE 
	
	This component will show final question papers. 

*/

import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

import TrackerReact from 'meteor/ultimatejs:tracker-react';
import InputMask from 'react-input-mask';
import {InstructionMaster} from '../api/instructionMaster.js';

class Instructions extends TrackerReact(Component)  {
	
	constructor(props){
		super(props);
		this.state = {
			"instructionFor" : '',
			"instruction"    : '',
			"id"             : '',
			'facilityPermission' : 'waitingforResult',  	
			subscription :{
				instructionData : Meteor.subscribe("instructionData"),
			}
		}
		this.handleChange = this.handleChange.bind(this);
	}

	 componentWillMount(){
  		 Meteor.call("isAuthenticated","MasterData","AddInstructions",(err,res)=>{
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
  	
  	componentWillReceiveProps(nextProps){
  		this.setState({
  			"instructionFor" : nextProps.instructionData.instructionFor,
			"instruction"    : nextProps.instructionData.instruction,
			"id"             : nextProps.instructionData._id,
  		});
  		this.handleChange = this.handleChange.bind(this);
  	}

  	handleChange(event){
		const target = event.target;
		const name   = target.name;
		this.setState({
		  [name]: event.target.value,
		});
  	}

	showInstructions(){
	 var allInstruction =  InstructionMaster.find({},{sort:{'createdAt':-1}}).fetch();
	 if(allInstruction){
	 	return allInstruction;
	 }else{
	 	return 0;
	 }
	}

	removeInstruction(event){
		var _id = $(event.target).attr('id');
		
  				swal({
					  title              : 'Are you sure?',
					  text               : 'You will not be able to recover this Record!',
					  type               : 'warning',
					  showCancelButton   : true,
					  confirmButtonColor : '#dd6b55',
					  cancelButtonColor  : '#d44',
					  confirmButtonText  : 'Yes, Delete it!',
					  cancelButtonText   : 'No, Keep it',
					  closeOnConfirm     : false
					}, function() {
						Meteor.call("removeInstruction",_id,(error,result)=>{
							if(error){

							}else{
								swal(
							    'Instructions has been Deleted',
							    '',
							    'success'
							  );
						}
					});
  			
  		});

	}

	addInstruction(event){
		event.preventDefault();

		var instructionValue = {
			instructionFor : this.refs.instructionFor.value,
			instruction    : this.refs.instruction.value,
			id             : this.refs.id.value,
		}
	
		Meteor.call("addInstruction",instructionValue,(error,result)=>{
			if(error){
				swal("Somthing went wrong");
			}else{
				var result = result;
				console.log(result);
				if(result=="updated"){
					swal("Instructions Updated Successfully",
					 '',
					 "success");
					FlowRouter.go("/Admin/AddInstructions");
				}else{
					if(result=="NotUpdated"){
						swal("Instructions Already Exist",
							 'Please Edit to Update Instructions',
							 "warning");
					}else{
						swal("Instructions Added Successfully",
							 '',
							 "success");
						}
					}

					this.setState({
			  			"instructionFor" : '',
						"instruction"    : '',
						'id'             : '',
		  			});
				}
			
		});
	}
	instructionScrollTop(){
		window.scrollTo(0, 0);
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
			            <h1>Master Data</h1>
			          </section>
			          {/* Main content */}
			          <section className="content viewContent">
			            <div className="row">
			              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			                <div className="box">
			                  <div className="box-header with-border boxMinHeight">
			                  	<div className="box-header with-border">
					            	<h3 className="box-title">Add Instructions</h3>
					            </div>
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form onSubmit={this.addInstruction.bind(this)}>
									<div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 searchTableBoxAlign">
										<div className="col-lg-10 col-lg-offset-1 col-md-12">
											<span className="blocking-span"> 
												<select type="text" name="instructionFor" ref="instructionFor" value={this.state.instructionFor} onChange={this.handleChange} className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputText" placeholder="Please select Intruction Type " required>
													<option value="">-- Select Instruction for --</option>
													<option>Student Registration</option>
													<option>Franchise Registration</option>
													<option>Main Exam</option>
													<option>Practice Exam</option>
													<option>Franchise Instruction</option>
													<option>Terms & Conditions For Student</option>
													<option>Terms & Conditions For Franchise</option>
													{/*<option>Moderator</option>												*/}
												</select>					   			
												{/*<span className="floating-label floating-label-Date">Instructions For</span>*/}
											</span>
										</div>
										<div className="col-lg-10 col-lg-offset-1 col-md-12">
											<textarea name="instruction" ref="instruction" rows="5" className="col-lg-12 col-md-12 col-sm-12" value={this.state.instruction} onChange={this.handleChange} placeholder="Enter Instructions" required>
											</textarea>
											<input type="hidden" name="id" ref="id" value={this.state.id}/>
										</div>
										<div className="col-lg-10 col-lg-offset-1 col-md-12 col-sm-12 col-xs-12 instructionSubBtn">
											{FlowRouter.getParam("id") ?
												<button type="submit" className="col-lg-3 col-md-3 col-sm-12  btn btn-primary craeteExamBtn craeteInstrBtn pull-right">Update</button>
											:
												<button type="submit" className="col-lg-3 col-md-3 col-sm-12  btn btn-primary craeteExamBtn craeteInstrBtn pull-right">Save</button>
											}
										</div>
									</div>
									</form>
									{/*<div className="col-lg-12 col-md-12 searchTableBoxAlign">
				                   		
				                   		<input type="text" name="search" placeholder="Search Student Name..." className="col-lg-4 col-sm-4 SearchExam" onInput={this.FinalTableSearch.bind(this)}/>
				                   		
				                    </div>*/}
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable">
					              		<table className="table table-striped formTable" id="ExamListTable">
										    <thead className="tableHeader">
										        <tr>
										            <th className="tab-Table">Sr. No</th>
										            <th className="col-lg-2">Instruction For</th>
										            <th className="col-lg-8">Instructions </th>
										            <th className="col-lg-1 tab-Table"> Action </th>
										            
										        </tr>
										    </thead>
										    {this.showInstructions() !=0 ? 
											    <tbody className="myAllTable">

											    	{this.showInstructions().map((instructios,index)=>{
											    	return <tr key={index}>
												    		<td className="tab-Table"></td>	
												    		<td>{instructios.instructionFor}</td>	
												    		<td>{instructios.instruction}</td>	
												    		<td className="tab-Table">
												    			<a href={`/Admin/AddInstructions/${instructios._id}`} onClick={this.instructionScrollTop.bind(this)}>
											     				 	<i className="fa fa-edit editIcon" title="Edit Instruction"></i>
											     				</a>
											     				<i className="fa fa-trash deleteIcon" title="Delete Instruction" id={instructios._id} onClick={this.removeInstruction.bind(this)}></i>
												    		</td>	
											    		</tr>
											    	})}
											    </tbody>
										    :
										    	<tbody className="OESDataNotAvailable">
									    			<tr>
									    				<td colSpan="4">"Instructions not yet added"</td>
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
			}else if (this.state.facilityPermission == false ){
					  	FlowRouter.go('/noAccesss')
				  }else if(this.state.facilityPermission == "waitingforResult"){
				  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
					   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
					</div>);
				  }else{ 
				  return (<h1></h1>);
			}
	}
}
export default InstructionContainer = withTracker(props =>{
	var _id = FlowRouter.getParam("id");
	var instructionData = InstructionMaster.findOne({"_id":_id});
	return{
		instructionData,
	} 
})(Instructions);