import React,{Component} from 'react';
import render from 'react-dom';
import FlowRouter from 'meteor/ostrio:flow-router-extra';
import { withTracker } from 'meteor/react-meteor-data';
import QuikWalletSettings from './QuikWalletSettings.jsx';
export default  class Configuration extends Component{

	constructor(props){
		super(props);
		this.state={
			facilityPermission : 'waitingforResult',
		}
	}

	componentWillMount(){
  		 Meteor.call("isAuthenticated","WalletConfiguration","quikWallet",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res==true){
		          this.setState({
		             facilityPermission : res,
		          });
		        }else if(res==false){
		          this.setState({
		             facilityPermission : res,
		          });
		        }
			}
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
		if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});
		return(
			<div>
	        {/* Content Wrapper. Contains page content */}
	        <div className="content-wrapper">
	          {/* Content Header (Page header) */}
	          <section className="content-header">
	            <h1>Add Configurations</h1>
	          </section>
	          {/* Main content */}
	          <section className="content viewContent">
	            <div className="row">
	              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
	                <div className="box">
	                  <div className="box-header with-border boxMinHeight">
			        	<div className="outerServiceBlock outerServiceBlockQuick col-lg-12 col-md-12 col-sm-12 col-xs-12">
			        		 <div  >
						        {/*<h3>System Configurations</h3>*/}
						        <hr/>
						        <div className="col-xs-3">
						          
						          <ul className="nav nav-tabs tabs-left sideways nav-tabConf">
						            <li className="active"><a href="#home-v" data-toggle="tab">Payment Gateway</a></li>
						           {/* <li><a href="#profile-v" data-toggle="tab">S3 Details</a></li>*/}
						          </ul>
						        </div>

						        <div className="col-xs-9">
						          
						          <div className="tab-content">
						            <div className="tab-pane active" id="home-v"><QuikWalletSettings/></div>
						            <div className="tab-pane" id="profile-v"></div>
						          </div>
						        </div>

						        <div className="clearfix"></div>

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
		}else if (this.state.facilityPermission == false ){
			  	FlowRouter.go('/noAccesss')
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access.</h3>
		  		 </div>
		  	);
		}
	}
}