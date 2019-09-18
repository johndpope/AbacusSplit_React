import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
// import UMeditRoles from './UMeditRoles.jsx';

export default class UMadd_role extends TrackerReact(Component) {

	editRole(event){
	  event.preventDefault();
      var roleId    = event.target.id;
      var roleName  = $("input[name="+roleId+"-Namerole]").val();

      Meteor.call('updaterole', roleId, roleName,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    else {
                    }//the _id of new object if successful
                }

// 
        );	

	}

	delRole(event){
	  event.preventDefault();
	  Meteor.call('deleteRole', event.currentTarget.id,
                function(error, result) { 
                    if (error) {
                        console.log ( error ); 
                    } //info about what went wrong 
                    
                });	

	}

	handleChange(event){
	    this.setState({value: event.target.value});
	}

	 handleSubmit(event) {
	    event.preventDefault();
	}

	constructor(props) {
	  super(props);
	  this.state = {
	    roleName: this.props.roleDataVales.name,
	  };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
	}

	render(){

       return(
				<tr>
					<td> {this.props.roleDataVales.name}</td>			
					<td> 
						<button className="editrole fa fa-pencil-square-o" data-toggle="modal" data-target={`#edit-${this.props.roleDataVales._id}`} ></button>

						
						<div id={`edit-${this.props.roleDataVales._id}`} className="modal fade" role="dialog">
						  <div className="modal-dialog">

						    
						    <div className="modal-content reportWrapper">
						      <div className="modal-header">
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						        <h4 className="modal-title">Edit Role</h4>
						      </div>
						      <div className="modal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<form className="editroles">
										<div className="form-group col-lg-5 col-md-4 col-xs-12 col-sm-12 paddingLeftz">
											<label>Role Name*</label>
											<input type="text" ref="roleName" className="form-control rolesField" name={`${this.props.roleDataVales._id}-Namerole`} defaultValue={`${this.state.roleName}`} onChange={this.handleChange.bind(this)} required/>
										</div>
										<div className="form-group col-lg-1 col-md-4 col-xs-12 col-sm-12 ">
											<label>&nbsp;</label>
										    <button type="button" onClick={this.editRole.bind(this)} id={this.props.roleDataVales._id} className="btn btn-primary submit" data-dismiss="modal">Edit Role</button>
										</div>
									</form>
						      </div>
						      <div className="modal-footer">
						        <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
						      </div>
						    </div>

						  </div>
						</div>
						&nbsp;&nbsp;
						
						<button className= "roleDelete fa fa-trash delIcon detailsCenter" data-toggle="modal" data-target={`#del-${this.props.roleDataVales._id}`}></button>

						 <div className="modal fade" id={`del-${this.props.roleDataVales._id}`} role="dialog">
						    <div className="modal-dialog modal-sm">
						      <div className="modal-content">
						        <div className="modal-header">
						          <button type="button" className="close" data-dismiss="modal">&times;</button>
						          <h4 className="modal-title">Delete Role</h4>
						        </div>
						        <div className="modal-body">
						          <p><b>The role will be deleted. Are you sure you want to continue?.</b></p>
						        </div>
						        <div className="modal-footer">
						          <button  onClick={this.delRole.bind(this)} id={this.props.roleDataVales._id} type="button" data-dismiss="modal" className="btn btn-danger deleteRole" >Delete</button>
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