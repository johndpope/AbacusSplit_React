import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import SpotylUserHeaderContainer from './SpotylUserHeader.jsx';
import SpaceProviderHeaderContainer from './SpotylSpaceProviderHeader.jsx';
import AdminTempHeader from '../admin/adminDashboard/components/AdminTempHeader.jsx';

class SpotylHeader extends Component{

	menuBarRender(){

		var user = Meteor.users.findOne({"_id":Meteor.userId()});

		if(user){
			// console.log(user);
			if (Roles.userIsInRole(Meteor.userId(), ['spaceOwner'])) {
				// console.log('space');
				return (<SpaceProviderHeaderContainer/>);
			}else if (Roles.userIsInRole(Meteor.userId(), ['admin','superAdmin'])){
				// console.log('client');
				return (<AdminTempHeader/>);
			}else{
				// console.log('client');
				return (<SpotylUserHeaderContainer/>);
			}
		}
	}

	render(){
		return(
				<div>
					{this.menuBarRender()}
				</div>
			);
	}
}

MenuBarContainer = createContainer((props)=>{

    const postHandle = Meteor.subscribe('currentUserfunction');;
    const post       = Meteor.users.findOne({"_id":Meteor.userId()})||{};
    // console.log(post);
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    };
}, SpotylHeader);

export default MenuBarContainer;
