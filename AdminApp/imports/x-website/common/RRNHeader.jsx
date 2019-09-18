import React, {Component} from 'react';

export default class RRNHeader extends Component{
	constructor(){
		super();
		this.state ={
			"subscription" : {
				"logedInUserData" : Meteor.subscribe("logedInUserData"),
			}
		}
	}
	render(){
		var logedinUser = Meteor.userId();
		if(logedinUser){
			var myProfileData = Meteor.users.findOne({'_id': logedinUser});
			if(myProfileData){
				var firstName = myProfileData.profile.fullname;
				var title     = myProfileData.profile.title;
				var city      = myProfileData.profile.city;
				var state     = myProfileData.profile.state;
				var country   = myProfileData.profile.country;
			}
		}
		return(
				<header>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mainMenu">
						<nav className="navbar navbar-inverse RRNHeader">
						  <div className="container-fluid">
						    <div className="navbar-header">
						      <button type="button" className="example1 navbar-toggle RRNCollapseBTN" data-toggle="collapse" data-target="#myNavbar">
						        <span className="icon-bar"></span>
						        <span className="icon-bar"></span>
						        <span className="icon-bar"></span> 
						      </button>
						      <a className="navbar-brand RRNBrand" href="/">SPOTYL</a>
						    </div>
						    <div className="collapse navbar-collapse" id="myNavbar">
						      <ul className="nav navbar-nav">
						        <li className="active myProfilePicDataBkgrd">
						        	<a className="col-sm-12 col-xs-12 myProfilePicData" href="/">
						        		<div className="col-sm-3 col-xs-3 myPic">
						        			<img src="/img/sachin.jpg"/>
						        		</div>
						        		<div className="col-sm-9 col-xs-9 myprofileInfo">
						        			{title}. {firstName}<br/>
						        			@{city}, {state}, {country}
						        		</div>
						        	</a>
						        </li>
						        <li>
						        	<a className="col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 smoth-scroll" href="/">
						        		<i className="fa fa-home menuFaIcon" aria-hidden="true"></i> Home
						        	</a>
						        </li>
						        <li>
						        	<a className="col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 smoth-scroll" href="/">
						        		<i className="fa fa-user menuFaIcon" aria-hidden="true"></i> Find/Search Parking
						        	</a>
						        </li>
						        <li>
						        	<a className="col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 smoth-scroll" href="/aboutBusiness">
						        		<i className="fa fa-handshake-o menuFaIcon" aria-hidden="true"></i> Parking History
						        	</a>
						        </li> 
						        <li>
							        <a className="col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 smoth-scroll" href="/referralDetails">
							        	<i className="fa fa-users menuFaIcon" aria-hidden="true"></i> Contact Us
							        </a>
						        </li>
						        <li>
							        <a className="col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 smoth-scroll" href="/refferal">
							        	<i className="fa fa-signal menuFaIcon" aria-hidden="true"></i> My Profile
							        </a>
						        </li> 
						        <li>
							        <a className="col-sm-10 col-sm-offset-1 col-xs-10 col-xs-offset-1 smoth-scroll" href="/refferal">
							        	<i className="fa fa-signal menuFaIcon" aria-hidden="true"></i> Logout
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