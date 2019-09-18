import React,{Component} from 'react';
import { render } from 'react-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Content from './content/Content';


export default class Dashboard extends Component{
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
      <div className="hold-transition skin-blue sidebar-mini">
        <div className="wrapper">   
          <Header />
          <Sidebar />
          <Content />
          <Footer />
        </div>
      </div>
    );
  }
}
