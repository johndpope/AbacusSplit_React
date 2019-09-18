import React, {Component} from 'react';

export default class RRNProfileMenu extends Component{

	showSearchBox(event){
		event.preventDefault();
		$('.searchWrapper').addClass("displaySearchBox");
	}

	render(){
		return(
				<header>
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 RRNProfileMenu">
						<a href="/map">
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 profileMenuItem"> 
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuIcon"> 
								<i className="fa fa-map-marker" aria-hidden="true"></i>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuTit">
								Map View
							</div>
						</div>
						</a>
						
						<a href="/garageListView">
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 profileMenuItem"> 
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuIcon">
								<i className="fa fa-list" aria-hidden="true"></i>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuTit">
								List View
							</div>
						</div>
						</a>
						
						<a href="/map">
						<div onClick={this.showSearchBox.bind(this)} className="showSearchBox col-lg-3 col-md-3 col-sm-3 col-xs-3 profileMenuItem"> 
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuIcon">
								<i className="fa fa-search" aria-hidden="true"></i>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuTit">
								Search Location
							</div>	
						</div>
						</a>

						<a href="/parkingHistory">
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 profileMenuItem">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuIcon"> 
								<i className="fa fa-history" aria-hidden="true"></i>
							</div>
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 profileMenuTit"> 
								Parking History
							</div>
						</div>
						</a>

					</div>
				</header>				
			);
	}
}