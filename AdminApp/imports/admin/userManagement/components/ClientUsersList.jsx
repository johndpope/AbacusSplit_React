import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

export default class ClientUsersList extends TrackerReact(Component) {

	constructor(){
		super();
		this.state = {
			subscription : {
				"clientUserData" : Meteor.subscribe('clientUserData'),
			}
		}
	}

	componentDidMount(){
		renderFunction();
	}

	dltUser(event){
		event.preventDefault();
		var dltId = event.target.id;
	    Meteor.call('dltUser',dltId, function(error,result){
	    	if(error){
	    		console.log("error"+error);
	    	}else{
	    		swal('User deleted Successfully!');
	    	}
	    });
	}

	editUserByAdmin(event){
		event.preventDefault();
		var editId = event.target.id;
		FlowRouter.go('/editMyProfile/'+editId);
	}

	clientsListData(){
		var usersList  = Meteor.users.find({"roles": "user"}).fetch();
		var usersArray = [];
		if(usersList){
			for(var i=0;i<usersList.length;i++){
			usersArray.push(	
				<div key={usersList[i]._id} className="col-lg-12 col-sm-12 col-xs-12 col-md-12 clientListWrap">
					<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12">
						<i className="fa fa-times pull-right" aria-hidden="true" data-toggle="modal" data-target={`#${usersList[i]._id}-modal`}></i>
						<i className="fa fa-pencil pull-right" aria-hidden="true" onClick={this.editUserByAdmin.bind(this)} id={usersList[i]._id}></i>	
					
						<div id={`${usersList[i]._id}-modal`} className="modal fade" role="dialog">
						  <div className="modal-dialog">

						   
						    <div className="modal-content modalCustm col-lg-12 col-sm-12 col-xs-12 col-md-12">
						      <div className="modal-header">
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Delete User</h4>
						      </div>
						      <div className="modal-body">
						      	<div className="deleteDataConfirm col-lg-10 col-lg-offset-1 col-md-10 col-sm-10 col-xs-10 col-xs-offset-1">Are you sure, you want to delete this user?</div>
						      	<button type="button" className="btn btn-default pull-left" data-dismiss="modal">Close</button>
						        <button key={usersList[i]._id} className="btn btn-danger pull-right" onClick={this.dltUser.bind(this)}>DELETE</button>
						      </div>		        
						    </div>

						  </div>
						</div>	

					</div>
					<div className="col-lg-2 col-sm-2 col-xs-2 col-md-2 noLRPad">
						<img src="/images/userIcon.png" className="img-responsive"/>
					</div>
					<div className="col-lg-10 col-sm-10 col-xs-10 col-md-10">
						<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 noLRPad">
							<div className="col-lg-4 col-sm-4 col-xs-4 col-md-4 noLRPad">
								Name<span className="pull-right">:</span>
							</div>
							<div className="col-lg-8 col-sm-8 col-xs-8 col-md-8 ">
								{usersList[i].profile.firstname} {usersList[i].profile.lastname}
							</div>
						</div>
						<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 noLRPad">
							<div className="col-lg-4 col-sm-4 col-xs-4 col-md-4 noLRPad">
								Contact No<span className="pull-right">:</span>
							</div>
							<div className="col-lg-8 col-sm-8 col-xs-8 col-md-8 ">
								{usersList[i].profile.mobNumber}
							</div>
						</div>
						<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 noLRPad">
							<div className="col-lg-4 col-sm-4 col-xs-4 col-md-4 noLRPad">
								Email ID<span className="pull-right">:</span>
							</div>
							<div className="col-lg-8 col-sm-8 col-xs-8 col-md-8 userEmailTrim">
								{usersList[i].emails[0].address}
							</div>
						</div>
						{/*<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 noLRPad">
							<div className="col-lg-4 col-sm-4 col-xs-4 col-md-4 noLRPad">
								Address<span className="pull-right">:</span>
							</div>
							<div className="col-lg-8 col-sm-8 col-xs-8 col-md-8 userEmailTrim">
								{usersList[i].profile.aptNo}, {usersList[i].profile.addr1}, {usersList[i].profile.addr2}, {usersList[i].profile.city}, {usersList[i].profile.state}, USA - {usersList[i].profile.zip}
							</div>
						</div>*/}
					</div>
				</div>

					);
				}	
			return usersArray;
		}
	}

	render(){
					
       return(

			<section className="Content">
		        <div className="row">
		          <div className="col-lg-12 col-md-10 col-sm-12 col-xs-12 ">
		            <div className="box box-primary">
			            <div className="box-header with-border">
			            <h3 className="box-title">LIST OF USERS</h3>
			            </div>

			            <div className="box-body">
						<div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 filterWrap">


							<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6">
								<select className="parkPaySelect col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-12 filterSelect">
								  <option value="volvo" selected>State</option>
								  <option value="saab">Alameda</option>
								  <option value="mercedes">Napa</option>
								  <option value="audi">Contra Costa</option>
								</select>
							</div>
							<div className="col-lg-6 col-sm-6 col-xs-6 col-md-6">
								<select className="parkPaySelect col-lg-10 col-lg-offset-1 col-sm-12 col-xs-12 col-md-12 filterSelect">
								  <option value="volvo" selected>City</option>
								  <option value="saab">Alameda</option>
								  <option value="mercedes">Albany</option>
								  <option value="audi">American Canyon</option>
								</select>
							</div>
						</div>

						{this.clientsListData()}
						</div>
					</div>
				  </div>
				</div>
			</section>
       		
	    );

	} 

}