
import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Session} from 'meteor/session';
import Webcam from 'react-webcam';

export default class TestWebcam extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
          	'tab'       : 0,
          	'cameraOnStatus'       : true,
			}
		}		
	

	componentWillMount(){

		navigator.getMedia = ( 
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
		navigator.getMedia({video: true}, function() {
		  }, ()=> {
		  this.setState({"cameraOnStatus":false});		  	
		    // swal("Please start your webcam","","warning");
		});
	}

	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
	}



	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
	render(){
		window.scroll(0,0);
		console.log("this.state.cameraOnStatus",this.state.cameraOnStatus);
		return(
			
			<div>
			    <div className="content-wrapper">
			    <section className="content-header">
		            <h1 className="stud"></h1>
		         </section>		         
			      <section className="content viewContent">
			        <div className="row">
			          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
			            <div className="box"> 
			            	<div className="box-header with-border boxMinHeight">
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
					            	<div className="col-lg-12 webCamStyle">
					            		{this.state.cameraOnStatus==true?
									    <div className="text-center">									       
									        <Webcam className="videoSizeDisplay" autoPlay="true"
									          audio={false}
									          height={600}
									          width={600}
									          ref={node => this.webcam = node}
									        />
									    </div>
									    :
									    <div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
							            	<div>
											 	Please turn on the camera and refresh the window...!!! 
											</div>
							            </div>
									}
									</div>
								</div>
							</div>
						</div>
					  </div>
					</div>
				  </section>
				</div>
			</div>
			);
		
	}
}

