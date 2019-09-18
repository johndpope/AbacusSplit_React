
import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { render } from 'react-dom';
import {withTracker} 		 from 'meteor/react-meteor-data';
import { StudentMaster }  from '/imports/admin/forms/student/api/studentMaster.js';
import { FranchiseDetails }  from '/imports/admin/companySetting/api/CompanySettingMaster.js';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class UMUsers extends Component {

  'deleteUserConfirm'(event){
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
				Meteor.call("deleteUser",uid,(error,result)=>{
					if(error){

					}else{
						swal(
					    'Deleted Successfully',
					    '',
					    'success'
					  );
						location.reload();
				}
			});
  			
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

	lastLogin(){
		
		if(this.props.usersDataValues.status){
			// console.log(this.props.usersDataValues.status);
	  	if(this.props.usersDataValues.status.lastLogin){
	  		// console.log(this.props.usersDataValues.status.lastLogin.date);
	  		if(this.props.usersDataValues.status.lastLogin.date){
	  			return (<TimeAgo date={this.props.usersDataValues.status.lastLogin.date} />);
	  		}else{
	  			return(<span>-</span>);
	  		}
	  	}else{
	  		return(<span>-</span>);
	  	}
		}else{
			return(<span>-</span>);
		}
	}

	onlineStatus(){
		if(this.props.usersDataValues.profile.status == 'Active'){
			return(<div className="activeStat"></div>);
		}else{
			return(<div className="inactiveStat"></div>);
		}
	}

	// getfranchiseCount(id){
	// 	var postHandle = Meteor.subscribe("showFranchiseStudent",id).ready();
	// 	if(postHandle){
	// 		var franchiseCount = StudentMaster.find({"companyId":id}).count();
	// 		return franchiseCount;
	// 	 }
	// 	//else{
	// 	// 	var franchiseCount = StudentMaster.find({"companyId":id}).count();
	// 	// 	return franchiseCount;
	// 	// }
	// }
	 myprof(e) {
    	var id = Meteor.userId();
    	var franchiseprofiles   = FranchiseDetails.findOne({"companyId" :id})||{};
		return franchiseprofiles;
 }

	render(){
       return(
			<tr>		
					<td>{parseInt(Session.get('pageUMNumber')- 1) * (200) + (parseInt(this.props.serialNum) + 1)}</td>	
					<td>
					<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox col-lg-1 col-md-1 col-sm-1 col-xs-1" value={this.props.usersDataValues._id} /> 
						<div className="um-username"> 
							
							<div className="col-lg-11 col-md-11 col-sm-11 col-xs-11 userEmailIds noLRPad">
							{Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
								this.props.usersDataValues.roles=='Student' ?  
								<a href={'/StudentInformations/'+this.props.usersDataValues._id} title="Click to view student profile">
									{this.props.usersDataValues.profile.firstname} {this.props.usersDataValues.profile.lastname}
								</a>
								:
									this.props.usersDataValues.profile.firstname+' '+this.props.usersDataValues.profile.lastname
								:
									Roles.userIsInRole(Meteor.userId(), ['Franchise']) && this.props.usersDataValues.roles=='Student' ?
										<a href={'/Franchise/StudentInformations/'+this.props.usersDataValues._id} title="Click to view student profile">
											{this.props.usersDataValues.profile.firstname} {this.props.usersDataValues.profile.lastname}

										</a>
									:
									<a href={`/FranchiseSide/userProfile/${this.props.usersDataValues._id}`}> {this.props.usersDataValues.profile.firstname} {this.props.usersDataValues.profile.lastname} </a>
								}
							
							</div>	
						</div>
					</td>	
					<td className="col-lg-2 col-md-4 col-sm-6 col-xs-6"> 
						{this.props.usersDataValues.username}
					</td>		
					<td className="col-lg-2 col-md-4 col-sm-6 col-xs-6"> 
						{this.props.usersDataValues.profile.mobNumber}
					</td>	
					<td className="col-lg-1 col-md-1 hidden-xs hidden-sm"> {this.props.usersDataValues.profile.status} </td>		
					<td className="col-lg-1 col-md-1 col-sm-1 col-xs-2"> 
						{ this.props.usersDataValues.roles.map( (rolesData,index)=>{
							if(rolesData == 'Admin'){rolesData = 'admin';}
							if(rolesData == 'user'){rolesData = 'User';}
							return (<span key={index}>{rolesData}<br/></span>)
						  }) 
						}	
					</td>
					{/*
						this.props.roleFranchise == 'true' ? 
						<td className="col-lg-1 col-md-1 col-sm-1 col-xs-2 submembersnum"> 
							<div className="submembers">
							
								<a href={"/Admin/listofstudentusers/"+ this.props.usersDataValues.profile.companyId}>
									<span className="center">{this.getfranchiseCount(this.props.usersDataValues.profile.companyId)}</span>
								</a>
							</div>
						</td>	
						:
						null
					*/}				
					<td className="col-lg-2 col-md-2 hidden-xs hidden-sm"> <TimeAgo date={this.props.usersDataValues.createdAt} /> </td>	
					<td className="col-lg-2 col-md-2 hidden-xs hidden-sm"> {this.lastLogin()} </td>	
							
					<td className="col-lg-3 col-md-3 col-sm-3 col-xs-1 tab-Table actions"> 
						<div className="col-lg-12 col-md-2 col-sm-12 col-xs-12 actions ">
							<div className="col-lg-12 col-md-12 col-sm-1 col-xs-1 iconWrapper">

								{Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
									<a href={"/Admin/ResetPasswords/"+this.props.usersDataValues._id}> <i className="fa fa-key editIcon" aria-hidden="true" title="Change Password "></i></a>
									:
									<a href={"/Franchise/ResetPasswords/"+this.props.usersDataValues._id}> <i className="fa fa-key editIcon" aria-hidden="true" title="Change Password "></i></a>

								}

								
								{Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
									this.props.usersDataValues.roles=='Student' ?
										<a href={'/StudentInformations/'+this.props.usersDataValues._id} title="Click to view student profile">
											<i className="fa fa-user userProf" title="View Profile" aria-hidden="true"></i>
										</a>
									:
										<a href={`/Admin/profile/${this.props.usersDataValues._id}`}><i className="fa fa-user userProf" title="View Profile" aria-hidden="true"></i> </a>
								:

									Roles.userIsInRole(Meteor.userId(), ['Franchise']) && this.props.usersDataValues.roles=='Student' ?
										<a href={'/Franchise/StudentInformations/'+this.props.usersDataValues._id} title="Click to view student profile">
											<i className="fa fa-user userProf" title="View Profile" aria-hidden="true"></i>
										</a>
									:
									<a href={`/FranchiseSide/userProfile/${this.props.usersDataValues._id}`}><i className="fa fa-user userProf" title="View Profile" aria-hidden="true"></i> </a>

								}

							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 actions">
								{Roles.userIsInRole(Meteor.userId(), ['superAdmin','Admin'])?
								<a href={`/EditProfiles/${this.props.usersDataValues._id}`}><i className="fa fa-edit editIcon" title="Edit User"></i> </a> 
								:
								<a href={`/Franchise/EditProfiles/${this.props.usersDataValues._id}`}><i className="fa fa-edit editIcon" title="Edit User"></i> </a> 
							}
								<i className="fa fa-trash deleteIcon" onClick={this.deleteUserConfirm.bind(this)} id={this.props.usersDataValues._id} title="Delete User"/>
							</div>
						</div>


					</td>		
				</tr>	    
	);

	} 

}
// export default studentlist = withTracker((props)=>{
//   const postHandle		 = Meteor.subscribe('showAllStudent');
//   const franchiseCount   = StudentMaster.find({}).count();
//   const loading   		 = !postHandle.ready();

//     const postHandle1 = Meteor.subscribe('companyData');
//     const post       = FranchiseDetails.findOne({})||{};
//     const loading2    = !postHandle1.ready();

//     var userprofiles         = Meteor.userId();
//     var userData   = FranchiseDetails.findOne({"companyId" :userprofiles})||{};
//     // console.log("userprofiles==>>",userprofiles);

//     // var userData       = Meteor.users.findOne({"_id" : userprofiles})||{};
//     // console.log("userData==>>",userData);
    
//     var profileData    = userData.profile;
//     // console.log("userprofiles==>>",userprofiles);
    
//     var userData     = Meteor.user();
//     const loading1    = !postHandle.ready();

//     // if (userData) {
//     //   if (userData.profile) {
//     //     var companyId = userData.profile.companyId;
//     //     var companyData = FranchiseDetails.findOne({"companyId" : companyId});
//     //   }
//     // }



//   return {
// 	  loading,
// 	  franchiseCount,
// 	    loading1,
//         // loading,
//         loading2,
//         post,
//         userData,
//         userprofiles,
//         profileData,
//         // companyData,
//   };
// })(UMUsers);




// import React, { Component } from 'react';
// import TimeAgo from 'react-timeago';
// import { render } from 'react-dom';
// import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
// import TrackerReact from 'meteor/ultimatejs:tracker-react';

// export default class UMUsers extends TrackerReact(Component) {

//   'deleteUserConfirm'(event){
//     event.preventDefault();
//     var uid = event.target.id;
// 		swal({
// 			  title              : 'Are you sure?',
// 			  text               : 'You will not be able to recover this Record!',
// 			  type               : 'warning',
// 			  showCancelButton   : true,
// 			  confirmButtonColor : '#dd6b55',
// 			  cancelButtonColor  : '#d44',
// 			  confirmButtonText  : 'Yes, Delete it!',
// 			  cancelButtonText   : 'No, Keep it',
// 			  closeOnConfirm     : false
// 			}, function() {
// 				Meteor.call("deleteUser",uid,(error,result)=>{
// 					if(error){

// 					}else{
// 						swal(
// 					    'Deleted Successfully',
// 					    '',
// 					    'success'
// 					  );
// 				}
// 			});
  			
//   		});
  			
//   }
//   updateStudentExamStatus(event){
//     var uid = event.target.id;
//     Meteor.call("updateStudExamStatusfromAdmin",uid,(err,res)=>{
//     	if(err){
//     		console.log(err);
//     	}else{
//     		swal('status updated successfully','','success');
//     	}
//     });

//   }

// 	lastLogin(){
		
// 		if(this.props.usersDataValues.status){
// 			// console.log(this.props.usersDataValues.status);
// 	  	if(this.props.usersDataValues.status.lastLogin){
// 	  		// console.log(this.props.usersDataValues.status.lastLogin.date);
// 	  		if(this.props.usersDataValues.status.lastLogin.date){
// 	  			return (<TimeAgo date={this.props.usersDataValues.status.lastLogin.date} />);
// 	  		}else{
// 	  			return(<span>-</span>);
// 	  		}
// 	  	}else{
// 	  		return(<span>-</span>);
// 	  	}
// 		}else{
// 			return(<span>-</span>);
// 		}
// 	}

// 	onlineStatus(){
// 		if(this.props.usersDataValues.profile.status == 'Active'){
// 			return(<div className="activeStat"></div>);
// 		}else{
// 			return(<div className="inactiveStat"></div>);
// 		}
// 	}

// 	render(){
//        return(
// 				<tr className="">
// {/*					<td className="col-lg-1 col-md-1 col-sm-1 col-xs-1"> 
// 					<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" value={this.props.usersDataValues._id} /> 
// 					</td>*/}		
// 					<td>{parseInt(Session.get('pageUMNumber')- 1) * (20) + (parseInt(this.props.serialNum) + 1)}</td>	
// 					<td>
// 					<input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox col-lg-1 col-md-1 col-sm-1 col-xs-1" value={this.props.usersDataValues._id} /> 
// 						<div className="um-username"> 
// 							<div className="activeStatusIcon">{this.onlineStatus()}</div>
// 							<div className="col-lg-9 col-md-9 col-sm-9 col-xs-9 userEmailIds noLRPad">
// 							{Roles.userIsInRole(this.props.usersDataValues._id, ['Student']) ?  
// 							<a href={'/studentInformation/'+this.props.usersDataValues._id} title="Click to view student profile">
// 								{this.props.usersDataValues.profile.firstname} {this.props.usersDataValues.profile.lastname}
// 							</a>
// 							:
// 								this.props.usersDataValues.profile.firstname+' '+this.props.usersDataValues.profile.lastname
// 							}
							
// 							</div>	
// 						</div>
// 					</td>	
// 					<td className="col-lg-4 col-md-4 col-sm-6 col-xs-6"> 
						
// 							{this.props.usersDataValues.username}					
						
// 					</td>		
// 					<td className="col-lg-1 col-md-1 hidden-xs hidden-sm"> {this.props.usersDataValues.profile.status} </td>		
// 					<td className="col-lg-1 col-md-1 col-sm-1 col-xs-2"> 
						
// 						{ this.props.usersDataValues.roles.map( (rolesData,index)=>{
// 							if(rolesData == 'Admin'){rolesData = 'admin';}
// 							if(rolesData == 'user'){rolesData = 'User';}
// 							return (<span key={index}>{rolesData}<br/></span>)
// 						  }) 
// 						}	
// 					</td>	
// 					{/* <td> {this.props.usersDataValues.createdAt.toString()} </td>*/}
// 					<td className="col-lg-2 col-md-2 hidden-xs hidden-sm"> <TimeAgo date={this.props.usersDataValues.createdAt} /> </td>	
// 					<td className="col-lg-2 col-md-2 hidden-xs hidden-sm"> {this.lastLogin()} </td>	
							
// 					<td className="col-lg-2 col-md-2 col-sm-1 col-xs-1 tab-Table"> 
// 						{/*{Roles.userIsInRole(this.props.usersDataValues._id, ['Admin','admin']) ?*/}
// 							<div>
// 								<a href={"/admin/resetPassword/"+this.props.usersDataValues._id}> <i className="fa fa-key" aria-hidden="true" title="Change Password "></i></a>
// 								<i className="fa fa-star-o startupdatestatus" onClick={this.updateStudentExamStatus.bind(this)} id={this.props.usersDataValues._id} title="Change main exam status"/>
// 							</div>
// 						{/*:<span></span>
// 						}*/}
// 						<a href={`/editProfile/${this.props.usersDataValues._id}`}><i className="fa fa-edit editIcon" title="Edit User"></i> </a> 



// 						<i className="fa fa-trash deleteIcon" onClick={this.deleteUserConfirm.bind(this)} id={this.props.usersDataValues._id} title="Delete User"/>
						 

// 					</td>		
// 				</tr>	    
// 	);

// 	} 

// }

