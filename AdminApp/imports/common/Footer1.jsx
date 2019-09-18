import React from 'react';

export default class Footer1 extends React.Component{
  
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
      <div>
         <footer className="main-footer1">
        <div className="pull-right col-lg-12">
        </div>
        <strong>Copyright © 2018 <a href="" className="footclr">Online Abacus</a></strong> All rights
        reserved.
        <div className="iAssureITNM col-lg-12 ">
        <strong>Design & Developed by <a href="http://iassureit.com">iAssure International Technology Pvt Ltd</a></strong>
        </div>
      </footer>
      </div>
    );
  }
}
