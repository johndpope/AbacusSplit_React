import React, {Component}           from 'react';
import {render}                     from 'react-dom';
import TrackerReact                 from 'meteor/ultimatejs:tracker-react';
import {withTracker}                from 'meteor/react-meteor-data';
import {Meteor}                     from 'meteor/meteor';
import {Link}                       from 'react-router';


export default class Makepayment extends Component{
  componentDidMount() {
  /*  $.getScript('/imports/admin/companySetting/api/tabledatasort.js',function() {
    });*/
 $(document).ready(function()
  {
    $("#myTable").tablesorter();
  }
);

$(document).ready(function()
  {
    $("#myTable").tablesorter( {sortList: [[0,0], [1,0]]} );
  }
);

    $(document).ready(function() {
      $("table")
      .tablesorter({widthFixed: true, widgets: ['zebra']})
      .tablesorterPager({container: $("#pager")});
    });

  } 

  componentWillUnmount(){
  }
  makepayment(e){
        event.preventDefault();    
        var newcompanystatus = "Paid";
        var userID  = Meteor.userId();
      Meteor.call('updatecompanystatus',newcompanystatus,userID,
                  function(error, result) { 
                      if (error) {
                        
                          swal(" Not Paid Successfully",'error');
                      } 
                      else {
                           swal("Paid Successfully");
                                FlowRouter.go('/agent-dashboard');  
                           
                      }
                  }
          );

  }

    makeunpaid(e){
        event.preventDefault();    
        var newcompanystatus = "Unpaid";
        var userID  = Meteor.userId();
      Meteor.call('updatecompanystatusunpaid',newcompanystatus,userID,
                  function(error, result) { 
                      if (error) {
                        
                          swal(" Not Unpaid Successfully",'error');
                      } 
                      else {
                           swal("Unpaid Successfully");
                                // FlowRouter.go('/agent-dashboard');  
                           
                      }
                  }
          );

  }
  render() {

    return (
      <div>
        {/* Content Wrapper. Contains page content */}
        <div className="">
          {/* Content Header (Page header) */}
         
          <section className="col-lg-12 col-md-12 col-xs-12 col-sm-12 contactdetailshead content-header">
              <h1>  Make    Payment      </h1>
            <ol className="breadcrumb">
              <li>
                <Link to="#"><i className="fa fa-dashboard facompanyinfo"/>
                  Home</Link>
              </li>
              <li className="active">Make Payment</li>
            </ol>
          </section>
          {/* /.row */}
          <section className="content">
            <div className="row">
              <div className="col-md-12">
               
                  <div className="box-header with-border">
                    <h3 className="box-title">
                      Make Payment
                    </h3>
        
                  </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 paybrder">

                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  mkpyinpt">
                      <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <img src="/images/Rs.jpg" className="rsimg" />
                      </div>
                      <div className="col-lg-6 col-md-4 col-sm-12 col-xs-12">
                          <span className="blocking-span">
                            <input type=""  className="col-lg-12 oesSignUpForm tmsLoginTextBox" ref="Enterrupees" name="Enterrupees" placeholder="" required/>
                            <span className="floating-label"><i className="fa fa-envelope signupIconFont" aria-hidden="true"/>Enter Rupees</span>                  
                          </span>
                      </div>

                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12  mkpyinpt">
                      <div className="col-lg-6 col-md-2 col-sm-2 col-xs-2 btnaligncentr">          
                        <button type="button" className="btn btn-info " onClick={this.makeunpaid.bind(this)} >Unpaid</button>
                      </div>
                      <div className="col-lg-6 col-md-2 col-sm-2 col-xs-2 btnaligncentr" >          
                        <button type="button" className="btn btn-info " onClick={this.makepayment.bind(this)}>Make Payment</button>
                      </div>
                    
                    </div>
                  </div>
               
              </div>

            </div>
           
       
  
          </section>
        </div>
       
      </div>
    );

  }

}
