import React, {Component}   from 'react';
import NoAccessHeader 		from '/imports/common/NoAccessHeader.jsx';
import Footer 		from '/imports/common/Footer.jsx';


export default function NoAccess(){

    if ( !$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }

   
    $("script[src='/js/adminLte.js']").remove();
    $("link[href='/css/dashboard.css']").remove();


	return(
		  	<div className="hold-transition">
		      <div className="wrapper">
		        <NoAccessHeader/>
		        <div className="container-fluid main-container">

			  	<div className="box-header with-border  permissiondiv">
					<img src="/images/noAccess.jpg" />
				</div>
	            <Footer/>

	    	    </div>
		      </div>
		    </div>
		)
}
