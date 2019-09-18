import React, { Component} from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import ProfileCandidateForm from './ProfileCandidateForm.jsx';
// import { createContainer } from 'meteor/react-meteor-data';

export default class App extends TrackerReact(Component) {

	constructor(){
		super();
		this.state = {
			subscription : {
				"usersData" : Meteor.subscribe('userfunction')
			}
		}
	}

  'editProfile'(event){
    event.preventDefault();
    var doc = {
	            username   : this.refs.username.value,
             }

    console.log(doc);
  }

	userData(){
		var userId  = Meteor.userId();
		return Meteor.users.find({'_id': userId}).fetch();
	}


	render(){
	   console.log(this.userData());	
       return(
			  <form id="edit" onSubmit={this.editProfile.bind(this)}>

					{ this.userData().map( (usersData)=>{
						return <ProfileCandidateForm key={usersData._id} user={usersData}/>
					  }) 
					}
					 
				   <div className="form-group col-lg-12 col-md-4 col-xs-12 col-sm-12 noPadLR">
					    <input type="submit" value="Update" className="btn btn-primary col-lg-4 col-lg-offset-4"/>
				    </div>
 
			  </form>	    
	   );

	} 

}


