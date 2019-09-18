import React, {Component}   from 'react';
import Header 		from '/imports/common/Header.jsx';
import Footer 		from '/imports/common/Footer.jsx';


export default function NoAccessLayout(){

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
		        <Header/>
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
