import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

class SpotylUserHeader extends Component{

	logoutSpotyl(event){
		event.preventDefault();
		Meteor.logout();
		FlowRouter.go('/userlogin');
	}
	
	render(){
		return(
				<header>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainMenu noPadLR">
						<nav className="navbar navbar-inverse navBar spotylTopMenuBar">
						  <div className="container-fluid">
						    <div className="navbar-header">
						      <button type="button" className="navbar-toggle collapsed navBarToggle pull-left" data-toggle="collapse" data-target="#myNavbar">
						        <span className="icon-bar top-bar"></span>
						        <span className="icon-bar middle-bar"></span>
						        <span className="icon-bar bottom-bar"></span> 
						      </button>
						      <a className="col-xs-7 col-sm-7 navbar-brand spotylBrand" href="/">SPOTYL</a>
						      <div className="col-xs-3 col-sm-3"><img src="/images/carIcon1.png" className="img-responsive"/></div>						    
						    </div>
						    <div className="collapse navbar-collapse navBarCollapse" id="myNavbar">
						      <ul className="nav navbar-nav navBarNav">
						        <li className="myProfilePicDataBkgrd noLRPad col-lg-12 col-md-12 col-sm-12 col-xs-12">
						        	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
						        		<div className="col-sm-3 col-xs-3 myPic noLRPad">
						        			<img src="/images/userIcon.png" className="profilePic img-responsive"/>
						        		</div>
						        		<div className="col-sm-9 col-xs-9 myprofileInfo">
						        			{this.props.post.profile.firstname} {this.props.post.profile.lastname}<br/>
						        			CA, USA
						        		</div>
						        	</div>
						        </li>
						        <li>
						        	<a className="smoth-scroll" href="/map">
						        		Home
						        	</a>
						        </li>
						        <li>
						        	<a className="smoth-scroll" href="/map">
						        		Find/Search Parking
						        	</a>
						        </li>
						        <li>
						        	<a className="smoth-scroll" href="/parkingHistory">
						        		Parking History
						        	</a>
						        </li> 
						        <li>
							        <a className="smoth-scroll" href="/map">
							        	Contact Us
							        </a>
						        </li>
						        <li>
							        <a className="smoth-scroll" href="/userProfile">
							        	My Profile
							        </a>
						        </li> 
						        <li>
							        <a onClick={this.logoutSpotyl.bind(this)} className="logoutSpotyl smoth-scroll">
							        	Logout
							        </a>
						        </li> 
						      </ul>     
						    </div>
						  </div>
						</nav>
					</div>
				</header>				
			);
	}
}

SpotylUserHeaderContainer = createContainer((props)=>{

    const postHandle = Meteor.subscribe('currentUserfunction');;
    const post       = Meteor.users.findOne({"_id":Meteor.userId()})||{};
    // console.log(post);
    const loading    = !postHandle.ready();

    return {
        loading,
        post,
    };
}, SpotylUserHeader);

export default SpotylUserHeaderContainer;