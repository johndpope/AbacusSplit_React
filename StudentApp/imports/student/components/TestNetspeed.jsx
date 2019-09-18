
import React, {Component} from 'react';
import {render} from 'react-dom';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {Session} from 'meteor/session';
// import {StudentMaster} from '/imports/admin/forms/student/api/studentMaster.js';
import {StudentMaster} from '/imports/student/api/studentMaster.js';
import {TempImageNetSpeed} from '/imports/s3/api/ClientImageCall.js';

export default class TestNetspeed extends TrackerReact(Component)  {
	constructor(props){
		super(props);
		this.state={
          	// 'tab'       : 0,
          	
    		downloadSpeed :'',
    		uploadSpeed   :'',

    		speedBps:'',
    		speedKbps:'',
    		speedMbps:'',
			}
		}
	
	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		// var speedTest = require('speedtest-net');
		
		  
		Meteor.call("calculateNetspeed",(err,res)=>{
		  if(err){
		  }else{ 
		  }
		});


		Meteor.call("getInternetSpeedParams",(err,res)=>{
		  if(err){
		  }else{
		  	if(res){
		  		this.setState({
		  			downloadSpeed :res.download,
    				uploadSpeed   :res.upload,
		  		});

		  	}		   
		  }
		});	

	}



	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  
 //  	uploadImageForNetspeed(event){
	//     var startTime;
	// 	startTime = (new Date()).getTime();
	//     let self = this;
	//     if (event.currentTarget.files && event.currentTarget.files[0]) {
	// 	    var file = event.currentTarget.files[0];
	// 	      	if (file) {
	// 	      	   var fileName  = file.name;		      	 
	// 	      	     var ext       = fileName.split('.').pop();  
	//                   	if(ext=="jpg" || ext=="png" || ext=="jpeg"){    
	//                         if (file) {   
	// 	        				addImageForNetspeed(file,self);
	// 		     			}else{           
	// 		             			 swal("File not uploaded","Something went wrong","error");  
	// 		                     }     
	//                    	}else{ 
	//                        swal("Please upload file","Only Upload  images format (jpg,png,jpeg)","error");   
	//                     } 
	// 	      	Meteor.call("CountOfImagesNetSpeed",(error,result)=>{
 //                    if(error){
                       
 //                    }else{
 //                    	if(result){
 //                    		var imageForNetspeed=result._id;
 //                    		if(imageForNetspeed){
 //                    			var imageAddr = file.name; 
	// 							var downloadSize = file.size; 
	// 							var endTime;
	// 							endTime = (new Date()).getTime();		      		
	// 					      	this.showResults(imageAddr,downloadSize,startTime,endTime);

 //                    		}
 //                    	}
 //                    }
 //                });  



	// 	      		}

	//     }
	// }
	

				 // showResults(imageAddr,downloadSize,startTime, endTime) {
				 //    	$('input[type=file]').val(null);
				 //        var duration = (endTime - startTime) / 1000;
				 //        var bitsLoaded = downloadSize * 8;
				 //        var speedBps = (bitsLoaded / duration).toFixed(2);
				 //        var speedKbps = (speedBps / 1024).toFixed(2);
				 //        var speedMbps = (speedKbps / 1024).toFixed(2);
				 //        		speedBps:speedBps,
				 //        		speedKbps:speedKbps,
				 //        		speedMbps:speedMbps
				 //        });
				 //    }

	
	  
	render(){
		window.scroll(0,0);
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
									    <div className="text-center">
									    	 <div className="box-header with-border boxMinHeight   loadingImgWrap">
								            	{this.state.downloadSpeed && this.state.uploadSpeed ?
								            		<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 netspeedtext">
								            			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-center"><h2 className="speedtextcolor"> Internet Speed :</h2></div>
												 		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 speedContent">
													 		<h3 className="col-lg-6 col-md-6 col-xs-12 col-sm-12 speedtextcolor"><i className="fa fa-download" aria-hidden="true"></i>&nbsp;Download Speed : {this.state.downloadSpeed}&nbsp; &nbsp;Mbps </h3>
													 		<h3 className="col-lg-6 col-md-6 col-xs-12 col-sm-12 speedtextcolor"><i className="fa fa-upload" aria-hidden="true"></i>&nbsp;Upload Speed : {this.state.uploadSpeed}&nbsp; &nbsp;Mbps</h3>
													 		
												 		</div>
												 		{/*<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 speedContent">
													 		<h3>&nbsp; &nbsp; Mbps</h3>
													 		<h3>&nbsp; &nbsp; Mbps</h3>
												 		</div>*/}
													</div>
													:
													/*<div  className="col-lg-12  col-md-12 col-sm-12 col-xs-12 netspeedtext speedtextcolor">Please wait...</div>*/
													<div  className="col-lg-12  col-md-12 col-sm-12 col-xs-12  speedtextcolor"><img className="netspeedgif" src="/images/netspeed2.gif"/></div>
												}
							            	</div>									       
									      {/* <div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
									      	    <div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 ">
										        	<h5 className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12 ">Upload image to check your internet speed(.png/.jpeg/.pdf/.jpg)</h5>
										       	    <input type="file" className="col-lg-3 col-lg-offset-4 col-md-3 col-md-offset-4 col-sm-12 col-xs-12 netspeedimgbrwse" accept="image/x-png,image/jpeg,image/pdf,image/jpg" onChange={this.uploadImageForNetspeed.bind(this)}/>
										   		</div>							            	
								            	{this.state.speedBps && this.state.speedKbps && this.state.speedMbps?
								            		<div className="col-lg-12  col-md-12 col-sm-12 col-xs-12 netspeedtext">
								            			<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4"><h2 className="speedTitle">Internet Speed :</h2></div>
												 		<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 speedContent">
													 		<h3>{this.state.speedBps} </h3>
													 		<h3>{this.state.speedKbps} </h3>
													 		<h3>{this.state.speedMbps}</h3>
												 		</div>
												 		<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 speedContent">
													 		<h3>&nbsp; &nbsp; Bps</h3>
													 		<h3>&nbsp; &nbsp; Kbps</h3>
													 		<h3>&nbsp; &nbsp; Mbps</h3>
												 		</div>
													</div>
													:
													<div  className="col-lg-12  col-md-12 col-sm-12 col-xs-12 netspeedtext">Please wait...</div>
												}
							            	</div>*/}
									    </div>
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



