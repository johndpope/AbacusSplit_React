import React from 'react';
import {render} from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

export default class DoHaveProfile extends React.Component{
  constructor(){
    super();
    this.state ={
      "subscription" : {
      }
    }
  }
  componentWillMount(){
  }
  componentWillUnmount(){
  }

  render(){
    return(
      <div id="DoHaveProfile">
        <div className="row text-center outerdoyouHaveProfile">
           <div className="logoWrapper col-lg-6 col-lg-offset-3 col-md-12 col-md-offset-4 col-sm-12 col-sm-offset-4 col-xs-4 col-xs-offset-4">
              <img src="../images/AssureIDlogo.png" className="loginPageLogo"  alt="AssureID logo"/> 
           </div>
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 assureIdAouter">
              <h3>Welcome to AssureID</h3>
              <p><h5>Your AssureID is </h5></p>
              <div className="progress hideMe">
                <div className="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: 100 + '%'}}>
                  <b>please wait...</b>
                </div>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12" id="idBlock">
                <div className="idBlock col-lg-5 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12">
                  <b>IN29094</b>
                </div>
              </div>
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 assureIdQuestion">
              {/*<p><h5>Do you have AssureID profile?</h5></p>*/}
              <div className="col-lg-12 col-md-6 col-sm-6 col-xs-6">
                <a href="/profileForms"><button type="button" className="btn col-lg-12 submitBtn pull-right">Create your own profile</button></a>
              </div>
              {/*<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <a href="/profileForms"><button type="button" className="btn col-lg-9 cancelBtn pull-left">No</button></a>
              </div>*/}
            </div>
          </div>               
        </div>        
      </div>
    );
  }
}
