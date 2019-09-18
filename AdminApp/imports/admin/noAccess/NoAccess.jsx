import React,{Component} from 'react';
import { render } from 'react-dom';

export default class NoAccess extends Component{
  
  constructor() {
   super();
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
  	return(
  			<div className="box-header with-border  permissiondiv">
					<img src="/images/noAccess.jpg" />
			</div>
  		);
  }
}
