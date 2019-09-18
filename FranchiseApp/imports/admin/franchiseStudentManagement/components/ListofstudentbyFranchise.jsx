import React, { Component } from 'react';
import TimeAgo from 'react-timeago';
import { render } from 'react-dom';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import {withTracker} 		 from 'meteor/react-meteor-data';
import { StudentMaster }  from '/imports/admin/forms/student/api/studentMaster.js';
import Liststudent from './Liststudent.jsx';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';

 class ListOfUserStudent extends Component {
/*--------------- Search User --------------*/

buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
       return "(?=.*" + word + ")";
    });

    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
 }
componentDidMount() {
    
    $("html,body").scrollTop(0); 
    if ( !$('body').hasClass('adminLte')) {
      var adminLte = document.createElement("script");
      adminLte.type="text/javascript";
      adminLte.src = "/js/adminLte.js";
      $("body").append(adminLte);
    }
    // this.getAllFranchiseDetails();
  }
    componentWillUnmount(){
      $("script[src='/js/adminLte.js']").remove();
      $("link[href='/css/dashboard.css']").remove();
    }

 getTextValue(event){
     var studentName= $('.SearchFranchise').val();
     if(studentName){
         var RegExpBuildValue = this.buildRegExp(studentName);
         this.setState({
             firstname   : RegExpBuildValue,
             
         });
     }else{
         this.setState({
             firstname   : '',
             
         });
     }
 }

//  componentDidUpdate(){
//      $('.pagination'+this.state.counter).addClass("active");
//      Session.set('pageUMNumber',this.state.counter);
//      // if(Session.get("questionUMCount"))
//  }

  

	render(){
       return(
        <div>
        {/* Content Wrapper. Contains page content */}
        <div className="content-wrapper">
          {/* Content Header (Page header) */}
          <section className="content-header">
            <h3 className="contentTitle">User Management</h3>
          </section>
          {/* Main content */}
          <section className="content viewContent">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                <div className="box">
                 
                  <div className="box-header with-border boxMinHeight">
                    <div className="box-header with-border">
                        <h3 className="box-title">List of Students</h3>
                    </div>
                     {/* <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="pull-right dwnldAsExcelAdmin fa fa-download download-table-xls-button btn report-list-downloadXLXS"
                            table="listOfUsersDwnld"
                            filename="listOfUsersDwnld"
                            sheet="tablexls"
                            buttonText=""/> */}
               
                <div className="box-body">
                <div className="col-lg-12 userListdropDownList">
                
                 
                </div>
                <div className="col-lg-12 col-md-12 searchTableBoxAlignSETUM">
                       <span className="blocking-span">
                           <input type="text" name="search"  className="col-lg-7 col-md-7 col-sm-7 SearchExam SearchFranchise inputTextSearch"  required/>
                           <span className="floating-label">Search by  Student name</span>
                       </span>
                </div>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive noLRPad">
                    <table id="listOfUsersDwnld" className="UMTableSAU table table-bordered table-striped table-hover myTable dataTable no-footer formTable col-lg-10 col-md-10 col-sm-10 col-xs-12">
                        <thead className="table-head umtblhdr tableHeader">
                        <tr className="hrTableHeader info">
                            <th className="col-lg-1 col-md-1 col-sm-3 col-xs-6">Sr. No</th>
                            <th className="umHeader col-lg-2 col-md-2 col-sm-3 col-xs-6">
                                <input type="checkbox" className="allSelector col-lg-1" name="allSelector" /> 
                            <span className="col-lg-11">Name</span>
                            </th>
                            <th className="umHeader col-lg-1 col-md-1 col-sm-6 col-xs-6"> 							    
                                
                                Mobile Number
                            </th>
                            <th className="umHeader col-lg-1 col-md-1 hidden-xs hidden-sm"> Franchise Name </th>
                            <th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1"> School Name </th>

                            <th className="umHeader col-lg-1 col-md-1 col-sm-1 col-xs-1"> Addess </th>

                            <th className="umHeader col-lg-2 col-md-1 col-sm-1 col-xs-3"> Action </th>
                        </tr>
                        </thead>
                        <tbody className="noLRPad">
                            { this.props.listofstudentusers.map( (listofstudent, index)=>{
                                return <Liststudent key={listofstudent._id} listofstudentValues={listofstudent} serialNum={index}/>
                              }) 
                            }
                        </tbody>
                    </table>
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

	} 

}


export default studentlist = withTracker((props)=>{
// console.log("inside the listofstudentby---");
var id = FlowRouter.getParam("companyId");
const postHandle     = Meteor.subscribe('showAllStudent');

var userId = Meteor.userId();
const userHandle     = Meteor.subscribe('currentUserfunction',userId);

const loading        = !postHandle.ready() && !userHandle.ready();
var companyID = parseInt(id);
// if(id && !postHandle.ready()){
  var companyID = Meteor.user().profile.companyId;
// }
// console.log("companyID-==>>",companyID);


const listofstudentusers = StudentMaster.find({"companyId" : companyID}).fetch();
//  console.log("listofstudentusers==>>>>",listofstudentusers);
//  console.log("id==>>>>",id);


  
return {
    loading,
    listofstudentusers, 
  };
})(ListOfUserStudent);
