import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} 		 from 'meteor/react-meteor-data';
import { StudentMaster }  from '/imports/admin/forms/student/api/studentMaster.js';

 class Liststudent extends Component {

  constructor(props) {
    super(props);
    this.state = {
	// 'studentFullName'   		:this.props.listofstudentValues.studentFirstName+' '+this.props.listofstudentValues.studentMiddleName+ ' '+this.props.listofstudentValues.studentLastName,
                  
    };
  }
  // 'deletestudentConfirm'(event){
  //   event.preventDefault();
  //   var uid = event.target.id;
		// swal({
		// 	  title              : 'Are you sure, Do you want to Delete?',
		// 	  text               : 'You will not be able to recover this Record!',
		// 	  type               : 'warning',
		// 	  showCancelButton   : true,
		// 	  confirmButtonColor : '#dd6b55',
		// 	  cancelButtonColor  : '#d44',
		// 	  confirmButtonText  : 'Yes, Delete it!',
		// 	  cancelButtonText   : 'No, Keep it',
		// 	  closeOnConfirm     : false
		// 	}, function() {
		// 		Meteor.call("deletestudent",id,(error,result)=>{
		// 			if(error){

		// 			}else{
		// 				swal(
		// 			    'Deleted Successfully',
		// 			    '',
		// 			    'success'
		// 			  );
		// 		}
		// 	});
  			
  // 		});
  			
  // }

	deletestudentConfirm(event) {
		var studentId = $(event.target).attr('id');
		// console.log("event.target.id==>>", studentId);

		Meteor.call("deleteStudent",studentId,(error,result)=>{
			if (error) {
				console.log(error);
			}else{
				swal(
				    'Deleted Successfully',
				    '',
				    'success'
				);
			}

		});

	}
	

  updateStudentExamStatus(event){
    var uid = event.target.id;
    Meteor.call("updateStudExamStatusfromAdmin",uid,(err,res)=>{
    	if(err){
    		console.log(err);
    	}else{
    		swal('status updated successfully','','success');
    	}
    });

  }





	render(){
       return(
				<tr className="">
{/*					<td className="col-lg-1 col-md-1 col-sm-1 col-xs-1"> 
					<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" value={this.props.usersDataValues._id} /> 
					</td>*/}		
					<td>{parseInt(Session.get('pageUMNumber')- 1) * (20) + (parseInt(this.props.serialNum) + 1)}</td>	
					<td>
					<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox col-lg-1 col-md-1 col-sm-1 col-xs-1"  /> 
					
                       
                    {this.props.listofstudentValues.studentFirstName +" "+this.props.listofstudentValues.studentLastName}
					</td>	
					<td className="tableLeftAlign col-lg-2 col-md-4 col-sm-6 col-xs-6">
						 {this.props.listofstudentValues.mobileNumber }
					</td>
                    <td className="tableLeftAlign col-lg-2 col-md-4 col-sm-6 col-xs-6">
						 {this.props.listofstudentValues.franchiseName }
					</td>
                    <td className="tableLeftAlign col-lg-2 col-md-4 col-sm-6 col-xs-6">
						 {this.props.listofstudentValues.schoolName }
					</td>	
                    <td className="tableLeftAlign col-lg-2 col-md-4 col-sm-6 col-xs-6">
						 {this.props.listofstudentValues.studentAddress }
					</td>			
                    
						
					<td className="col-lg-3 col-md-2 col-sm-1 col-xs-1 tab-Table"> 
							{/* <div>
								<a href={"/Admin/ResetPasswords/"+this.props.usersDataValues._id}> <i className="fa fa-key" aria-hidden="true" title="Change Password "></i></a>
							</div> */}
						
						{/* <a href={`/EditProfiles/${this.props.usersDataValues._id}`}><i className="fa fa-edit editIcon" title="Edit User"></i> </a>  */}


						<a href={"/franchise/editStudentByFranchise/"+this.props.listofstudentValues._id}><i className="fa fa-pencil-square-o editbtns editbtns1" title="Edit Student"></i> </a>
						
						<i className="fa fa-trash deleteIcon" onClick={this.deletestudentConfirm.bind(this)} title="Delete Student" id={this.props.listofstudentValues._id}/>
						 

					</td>		
				</tr>	    
	);

	} 

}



export default UMstudentlist = withTracker((props)=>{

 
  const postHandle		 = Meteor.subscribe('showAllStudent');
  const studentlistshow   = StudentMaster.find({}).fetch({});
  const loading   		 = !postHandle.ready();

  // console.log("studentlistshow==>>",studentlistshow);
  
  return {
	  

	  loading,
	  studentlistshow,
   

  };
})(Liststudent);