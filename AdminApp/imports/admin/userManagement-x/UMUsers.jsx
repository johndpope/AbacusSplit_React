import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
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

	lastLogin(){
		
		if(this.props.usersDataValues.status){
			// console.log(this.props.usersDataValues.status);
	  	if(this.props.usersDataValues.status.lastLogin){
	  		console.log(this.props.usersDataValues.status.lastLogin.date);
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

	render(){
       return(
				<tr className="">
					<td className="col-lg-1 col-md-1 col-sm-1 col-xs-1"> <input type="checkbox" ref="userCheckbox" name="userCheckbox" className="userCheckbox" value={this.props.usersDataValues._id} /> </td>		
							
					<td className="col-lg-4 col-md-4 col-sm-6 col-xs-6"> 
						<div className="um-username"> 
							<div className="col-sm-1 col-xs-1">{this.onlineStatus()}</div>
							<div className="col-sm-9 col-xs-9 userEmailIds noLRPad">{this.props.usersDataValues.username}</div>						
						</div>
					</td>		
					<td className="col-lg-2 col-md-2 hidden-xs hidden-sm"> {this.props.usersDataValues.profile.status} </td>		
					<td className="col-lg-2 col-md-2 col-sm-2 col-xs-2"> 
						
						{ this.props.usersDataValues.roles.map( (rolesData,index)=>{
							return (<span key={index}>{rolesData}<br/></span>)
						  }) 
						}	
					</td>	
					{/* <td> {this.props.usersDataValues.createdAt.toString()} </td>*/}
					<td className="col-lg-1 col-md-1 hidden-xs hidden-sm"> <TimeAgo date={this.props.usersDataValues.createdAt} /> </td>	
					<td className="col-lg-1 col-md-1 hidden-xs hidden-sm"> {this.lastLogin()} </td>	
							
					<td className="col-lg-1 col-md-1"> 
						<a href={`/admin/editProfile/${this.props.usersDataValues._id}`}><button type="button" className="fa fa-pencil-square-o editUser"> </button> </a> 



						<button className= "fa fa-trash userDel" data-toggle="modal" data-target={`#${this.props.usersDataValues._id}-id`} />
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
