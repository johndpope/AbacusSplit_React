import React, { Component } from 'react';

import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class UMUsers extends TrackerReact(Component) {

  'deleteUserConfirm'(event){
    event.preventDefault();
    var uid = event.target.id;
    Meteor.call('deleteUser', uid,
                (err, res) => {
                if (err) {
                    alert('Some error occured while deleting this record. Please contact System Admin!');
                } else {
                    $('.modal-backdrop').hide();           
                }
        });

  }

	render(){
       return(
				<tr className="">
					<td> <input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" value={this.props.usersDataValues._id} /> </td>		
							
					<td> {this.props.usersDataValues.username} </td>		
					<td> {this.props.usersDataValues.profile.status} </td>		
					<td> {this.props.usersDataValues.roles} </td>	
					{/* <td> {this.props.usersDataValues.createdAt.toString()} </td>*/}
					<td> <timeago key={this.props.usersDataValues._id} datetimenow={this.props.usersDataValues.createdAt} />  </td>	
					<td> {/*{this.props.usersDataValues.status.lastLogin.date.toString()}*/} 1Sec</td>	
							
					<td> 
						<a href={`/UMeditUserProfile/${this.props.usersDataValues._id}`}><button type="button" className="fa fa-pencil-square-o editUser"> </button> </a> 



						<button className= "fa fa-trash userDel" data-toggle="modal" data-target={`#${this.props.usersDataValues._id}-id`} />				 // 
						 <div className="modal fade" id={`${this.props.usersDataValues._id}-id`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete User</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The item will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button onClick={this.deleteUserConfirm.bind(this)} id={this.props.usersDataValues._id} type="button" data-dismiss="modal" className="btn btn-danger deleteUserConfirm" >Delete</button>
				    			  <button type="button" data-dismiss="modal" className="btn btn-primary ">Cancel</button>
						        </div>
						      </div>
						    </div>
						  </div>

					</td>		
				</tr>	    
	);

	} 

}

const timeago = (props)=>{
	console.log(props);
	return (moment(datetimenow).fromNow());
}