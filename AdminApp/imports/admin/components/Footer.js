import React,{Component} from 'react';

export default class Footer extends Component{
  render(){
    return(
      <footer className="main-footer">
        <div className="pull-right hidden-xs">
        </div>
        <strong>Copyright © 2018 <a href="">Online Abacus</a></strong> All rights
        reserved.
        <div className="iAssureITNM">
        <strong>Design & Developed by <a href="http://iassureit.com">iAssure International Technology Pvt Ltd</a></strong>
        </div>
      </footer>
    );
  }
}
