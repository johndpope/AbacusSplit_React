import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} 		 from 'meteor/react-meteor-data';

import { StudentMaster }  from '/imports/admin/forms/student/api/studentMaster.js';


export default class UMListofStudentusers extends TrackerReact(Component) {

  'deletestudentConfirm'(event){
    event.preventDefault();
    var uid = event.target.id;
		swal({
			  title              : 'Are you sure,Do you want to Delete?',
			  text               : 'You will not be able to recover this Record!',
			  type               : 'warning',
			  showCancelButton   : true,
			  confirmButtonColor : '#dd6b55',
			  cancelButtonColor  : '#d44',
			  confirmButtonText  : 'Yes, Delete it!',
			  cancelButtonText   : 'No, Keep it',
			  closeOnConfirm     : false
			}, function() {
				Meteor.call("deletestudent",(error,result)=>{
					if(error){

					}else{
						swal(
					    'Deleted Successfully',
					    '',
					    'success'
					  );
				}
			});
  			
  		});
  			
  }

	render(){
       return(
				<tr className="">
{/*					<td className="col-lg-1 col-md-1 col-sm-1 col-xs-1"> 
					<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" value={this.props.usersDataValues._id} /> 
					</td>*/}		
					<td>{this.props.serialNum + 1}</td>	
					<td>
					{/*<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox col-lg-1 col-md-1 col-sm-1 col-xs-1"  />*/}
                    {this.props.listofstudentValues.studentFirstName +" "+this.props.listofstudentValues.studentLastName}
					</td>	
					<td className="tableLeftAlign col-lg-4 col-md-4 col-sm-6 col-xs-6">
						 {this.props.listofstudentValues.mobileNumber }
					</td>
                    <td className="tableLeftAlign col-lg-4 col-md-4 col-sm-6 col-xs-6">
						 {this.props.listofstudentValues.franchiseName }
					</td>						
					<td className="col-lg-2 col-md-2 col-sm-1 col-xs-1 tab-Table"> 
							{/* <div>
								<a href={"/Admin/ResetPasswords/"+this.props.usersDataValues._id}> <i className="fa fa-key" aria-hidden="true" title="Change Password "></i></a>
							</div> */}
						
{/*					<a href={"/franchise/editStudentByFranchise/"+this.props.listofstudentValues._id}><i className="fa fa-pencil-square-o editbtns editbtns1" title="Edit User"></i> </a>
<a className="editrole fa fa-pencil-square-o editbtns editbtns1 editbtnshvr" href={"/cm/edit-contact/"+this.props.contactDataValues._id} ></a>*/}
						
					<i className="fa fa-trash deleteIcon" onClick={this.deletestudentConfirm.bind(this)} title="Delete Student"/>
						 

					</td>		
				</tr>	    
	);

	} 

}
