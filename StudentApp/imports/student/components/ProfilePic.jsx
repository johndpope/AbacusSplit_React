

import React, {Component} from 'react';
import {Meteor} 		  from 'meteor/meteor';
import {Mongo} 			  from 'meteor/mongo';
import {render} 		  from 'react-dom';
import { FlowRouter }     from 'meteor/ostrio:flow-router-extra';
import {withTracker} 	  from 'meteor/react-meteor-data';
import TrackerReact 	  from 'meteor/ultimatejs:tracker-react';

class ProfilePic extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={

		}
	}

	componentDidMount() {
  	}

  	componentWillMount(){
  	}

	componentWillUnmount(){
	}
  	

  	componentWillReceiveProps(nextProps){
  		console.log('nextProps img=>',nextProps.img);
		this.setState({
		});
  	}

	render(){
		console.log('img=>',this.props.img);
		return(<div className="col-lg-12">
			<img className="col-lg-2 col-md-12 col-sm-12 ClientImgWrap1 displayLogoOne img-responsive" src={this.props.img?this.props.img :"../images/loading.gif"}/>
			</div>);
	}
}
export default withTracker(props=>{

	return{
		post : 1  
	}
	
	
})(ProfilePic);