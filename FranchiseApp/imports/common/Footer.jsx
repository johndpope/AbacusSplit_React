import React from 'react';

export default class Footer extends React.Component{
  constructor(props) {
   super(props);
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
    if(location.pathname == "/franchise/companyinfo"){  
        var mainfootershow =  "main-footer";
      // var divwrap = "col-lg-11 col-lg-offset-0 ";
      
    }else if(location.pathname == "/initial-company-setting"){
     
        var mainfootershow =  "main-footer1";
      
    }else{
        // var mainfootershow =  "main-footer";
        var mainfootershow =  "main-footer";
      
    }
    return(
      <div>
         <footer className={mainfootershow}>
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
