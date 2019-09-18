import React, {Component} from 'react';
import {render} from 'react-dom';
import {Session} from 'meteor/session';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {withTracker} from 'meteor/react-meteor-data';
import {ExamMaster} from '/imports/admin/forms/exam/api/examMaster.js';
import {CompetitionRegisterOrder} from '/imports/admin/forms/student/api/competitionRegisterOrder.js';
import {PackageOrderMaster} from '/imports/admin/forms/invoice/api/packageOrderMaster.js';

class MyOrder extends Component{

constructor(){
  super();
    this.state = {
        competitionId     : FlowRouter.getParam('compId'),
        reciptdata        : "",
        facilityPermission : 'waitingforResult',
        competitonFee : '',

    }
    this.viewreceipt = this.viewreceipt.bind(this);
}

componentWillMount(){
    Meteor.call("isAuthenticated","MyAccount","MyOrder",(err,res)=>{
      if(err){
        console.log(err);
      }else{
        this.setState({
           facilityPermission : res,
        });
      }
    });
}

// compareCompFeeandonlineFee(competitionId,competitonFees){
//      Session.set("compFee",null);
//    Meteor.call("getLatestCompetition",competitionId,competitonFees,(err,res)=>{
//       if(err){
//         swal(err);
//       }else{
//        Session.set("compFee",res);
//       }
//     });
//    console.log("wow-->",Session.get('compFee'));
//    return Session.get('compFee');
   // console.log("competitionId",competitionId);
   // var isReady = Meteor.subscribe("singleCompetition",competitionId).ready();
   //   if(isReady){
   //   var competitionData = ExamMaster.findOne({"_id":competitionId});
   //    if(competitionData){
   //       console.log("competitionData",competitionData);
   //      if(competitionData.competitionFees==competitonFees){
   //        return competitionData.competitionFees
   //      }else{
   //        return competitionData.competitionFees;
   //      }
   //    }
   // }
// }

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

viewreceipt(event){
var receiptid = $(event.currentTarget).attr('recipt-link');
// console.log("receiptid==>>",receiptid);
FlowRouter.go('/payment-success/' + receiptid);
}




render(){
  if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
      $('.sidebar').css({display:'block',background: '#222d32'});
return(
<div>
  <div className="content-wrapper">
    <section className="content-header">
      <h1> My Order</h1>
    </section>
    <section className="content viewContent">
      <div className="row">
          <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
            <div className="box">
            <div className="box-header with-border boxMinHeight">
              <section className="NotificationContent">
                <div className="box-body">
                  <div className="col-lg-12">
                    <section className="NotificationContent">
                      <div className="box-body">
                      {
                        this.props.competitionregorder.length>0 || this.props.myPackageOrderData.length>0?
                        <div>
                        {this.props.competitionregorder.map((myorder,index)=>{  
                            return<div className="col-lg-8 col-lg-offset-2 col-sm-12 col-xs-12 col-md-8 col-md-offset-2 borderdetails " key={index}>
                                    <div className="col-lg-12 col-md-12 col-sm-12 compReceipt">Competiton Receipt</div>
                                    <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 payrecreg ">
                                    <div className="col-lg-6 col-md-6 col-sm-6 payrecreg">
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>Tansaction Id</h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>: {myorder.transactionId}</h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>Amount </h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>: {myorder.competitionOriginalFees}</h4></div>                                  
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>Date</h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"> <h4>: {moment(myorder.paymentDate).format('DD/MM/YYYY')}</h4></div>                                  
                                      <div className="col-lg-12 col-md-12 col-sm-12"><h4 className="receiptBtn"><a href={`payment-success/${myorder.competitionId}`}>View Receipt </a></h4></div>                                  
                      
                                    </div>
                              </div> 
                            </div>  
                             })}

                           { this.props.myPackageOrderData.map((myorder,index)=>{  
                            return<div className="col-lg-8 col-lg-offset-2 col-sm-12 col-xs-12 col-md-8 col-md-offset-2 borderdetails "key={index}>
                            <div className="col-lg-12 col-md-12 col-sm-12 packageReceipt">Package Receipt</div>
                                    <div className="col-lg-12 col-sm-12 col-xs-12 col-md-12 payrecreg ">
                                    <div className="col-lg-6 col-md-6 col-sm-6 payrecreg">
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>Tansaction Id</h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>: {myorder.transactionId}</h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>Amount </h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>: {myorder.amount}</h4></div>                                  
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                      <div className="col-lg-6 col-md-6 col-sm-6"><h4>Date</h4></div>                                  
                                      <div className="col-lg-6 col-md-6 col-sm-6"> <h4>: {moment(myorder.paymentDate).format('DD/MM/YYYY')}</h4></div>                                  
                                      <div className="col-lg-12 col-md-12 col-sm-12"><h4 className="receiptBtn"><a href={`packagePayment-success/${myorder._id}`}>View Receipt </a></h4></div>                                  
                            
                                    </div>
                              </div> 
                            </div>  
                             })}
                          </div>
                          :
                          <div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
                            <div>
                              You have not yet purchased any exam or package...!!! 
                            </div>
                          </div>
                        }


                      </div>
                   
                  </section>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  </div>

);
   }else if (this.state.facilityPermission == false ){
          return (<div>{FlowRouter.go('/noAccesss')}</div>);
      }else if(this.state.facilityPermission == "waitingforResult"){
        return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
         <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
      </div>);
      }else{ 
      return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap"><h3>You don't have access.</h3></div>);
    }
}
}


export default MyOrder = withTracker(props=>{

const postHandle1             = Meteor.subscribe('showAllCompRegOrder');
const loading1                = !postHandle1.ready();
const postHandle              = Meteor.subscribe('showLoginStuddntOrders');
const loading                 = !postHandle.ready();

const competitionregorder     = CompetitionRegisterOrder.find({"studentId":Meteor.userId(),"status":"paid"}).fetch();
const myPackageOrderData      = PackageOrderMaster.find({"buyerId":Meteor.userId(),"status":"paid"}).fetch();

return{
  competitionregorder,
  loading1,
  loading,
  myPackageOrderData,
  }
})(MyOrder);