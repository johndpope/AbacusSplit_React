import React, { Component } from 'react';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Meteor } from 'meteor/meteor';
import CompetitionResultView from './CompetitionResultView.jsx';

export default class StudWiseTestReportsTabs extends TrackerReact(Component) {
   	constructor(){
		  super();
		    // this.state = {
		    //    facilityPermission : 'waitingforResult',
		    // }
		}
	componentDidMount(){
		if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}
		$("html,body").scrollTop(0);
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}
  	componentWillMount(){
  // 		 Meteor.call("isAuthenticated","Report","CompetitionResultReport",(err,res)=>{
		// 	if(err){
		// 		console.log(err);
		// 	}else{
		// 		if(res==true){
		//           this.setState({
		//              facilityPermission : res,
		//           });
		//         }else if(res==false){
		//           this.setState({
		//              facilityPermission : res,
		//           });
		//         }
		// 	}
		// });
  	}
	
  render() {
  	// if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			// $('.sidebar').css({display:'block',background: '#222d32'});
    return (
    	<div>
	        {/* Content Wrapper. Contains page content */}
	        <div className="content-wrapper">
	          <section>
	            <div className="row">
	              <div className="col-md-12">
	               <section className="content-header">
		            <h1>Competition Result View</h1>
		           </section>
		           <section className="content viewContent">
		            <div className="row">
		              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
		                <div className="box">
		                  <div className="box-header with-border boxMinHeight">
		                    <div className="box-header with-border">
					           	<h3 className="box-title">Competition Result View</h3>
					        </div>

		                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
		                      	<div className="reportWrapper">
			                        {/*<div className="MarginTop20 col-lg-12 col-md-12"></div>*/}
									<div id="monthlyReport" className="tab-pane fade in active">
									  <CompetitionResultView />
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
	          </section>
	        </div>
	    </div>
	);
	// }else if (this.state.facilityPermission == false ){
	// 		  	FlowRouter.go('/noAccesss')
	// 	  }else if(this.state.facilityPermission == "waitingforResult"){
	// 	  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
	// 		   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
	// 		</div>);
	// 	  }else{ 
	// 	  return (<h1></h1>);
	// 	}
  } 
}