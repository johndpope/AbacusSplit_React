import React, {Component} from 'react';
import {render} from 'react-dom';
import {withTracker} from 'meteor/react-meteor-data';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import {QuestionPaperMaster} from '/imports/admin/forms/setQuestionPaper/api/questionPaperMaster.js';


import {InstructionMaster} from '/imports/admin/forms/instructions/api/instructionMaster.js';
import {PackageQuestionPaperMaster} from '/imports/paymentProcess/api/packageQuestionPaperMaster.js';
import {PackageManagementMaster} from '/imports/admin/packageManagement/api/packageManagementMaster.js';

import {StudentMaster} from '/imports/student/api/studentMaster.js';
import {MyPracticeExamMaster} from '/imports/student/api/myPracticeExamMaster.js';


class PurchasedPracticeStartExam extends Component {
constructor(props){
super(props);
this.state = ({
showButton:true,
"BtnIndex":'',
"PckgIndex":'',
showstartExamBtn : true,
'defaultBtnTime': '00:05',
"subscription" : {
packageManagementData : Meteor.subscribe("packageManagementData"),

}
});

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

startPracticeExam(event){
  event.preventDefault();
  var btnIndex = event.target.getAttribute('data-index');
  var pckgIndex = event.target.getAttribute('data-text');
  var orderId = event.target.getAttribute('data-id');
  this.setState({
     BtnIndex:btnIndex,
     PckgIndexPckgIndex:pckgIndex,
   });
  this.setState({
    showButton:false,
    showstartExamBtn:false,
  });
  var practiceExamId = event.target.value;

  Meteor.call("updateQuestionPaperMasterAccordingtoPackages",practiceExamId,pckgIndex,btnIndex,orderId,(error,result)=>{
  if(error){
  console.log(error);
  }else{

  }
  });
  Meteor.call("StartPracticeExam",practiceExamId,(error,result)=>{
  if(error){
  swal(error);
  }else{
  var id = result;
  if(id){
  FlowRouter.go('/practiceExam/'+id+'/'+this.props.urlPackageId+'/'+this.state.BtnIndex);
  }
  }
  });
}

gotoPreviousExam(event){
var id = $(event.target).attr('id');
FlowRouter.go("/practiceExam/"+id);
}

ExamComplete(event){
var id = $(event.target).attr('id');
Meteor.call("practiceExamFinished",id,(error,result)=>{
if(error){

}else{
FlowRouter.go("/startPracticeExam");
}
});
}
tryPELoadingAgainforBtn(){
examTime = this.state.defaultBtnTime;
var LoadingInterval = setInterval(function() {

if(examTime){
  var timer = examTime.split(':');
  var minutes = parseInt(timer[0], 10);
  var seconds = parseInt(timer[1], 10);
  --seconds;
  minutes = (seconds < 0) ? --minutes : minutes;
  if (minutes < 0){
  clearInterval(LoadingInterval);
$('.examLoadingTimeDiv').html("Please check your internet connection or refresh your exam window");

  }else{
  seconds = (seconds < 0) ? 59 : seconds;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  minutes = (minutes < 10) ?  minutes : minutes;
$('.examLoadingTimeDiv').html("Exam is loading... Please Wait");
  examTime = minutes + ':' + seconds;
}
}

}, 1000);

}

render(){
if(this.state.showstartExamBtn){
return(
  <div>
    <div className="CountIncrement">0</div>
    <div className="CountDecreBackArrow">0</div>
          <div className="content-wrapper">
              <section className="content-header">
               <h1>Start Purchased Practice Exam</h1>
              </section>
              <section className="content viewContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    <div className="box">
                     {
                        (!this.props.LoadingTest && !this.props.loadingTest2 && !this.props.LoadingTest3 && !this.props.loadingTest4 && !this.props.LoadingPackage)?

                                        !this.props.lastExamId ?
                                           <div className="box-header with-border boxMinHeight ">
                                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ExamInstructionWrap ">
                                                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        Instructions for Practice Exam :
                                                      </div>
                                                      </div>
                                                      <div className="col-lg-12 col-md-11 col-sm-12 col-xs-12 instructionList instructionWrap">
                                                      {this.props.PE_Instruction.instruction}
                                                      </div>
                                                      <form>
                                                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 IagreeExamWrap paddingleftzero paddingrightzero">
                                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 examTable paddingleftzero paddingrightzero">
                                                            <table className="table">
                                                              <thead>
                                                              <tr className="tableHeader">
                                                                <th className="col-lg-2 col-md-2"> Package Details </th>
                                                                <th className="col-lg-2 col-md-2"> Paper Name </th>
                                                                <th colSpan={this.props.maxAttempt}> No. of Attempts : Press start button to start your exam </th>
                                                              </tr>
                                                              </thead>
                                                              <tbody>
                                                                  {this.props.PackageQPMData.map((questionPaper,indexx)=>{
                                                                  return <tr className="" key={indexx}>
                                                                  <td className="col-lg-2 col-md-2 qpTestTitle purchasedlabel">{questionPaper.packageName},{questionPaper.category}/{questionPaper.subCategory}</td>
                                                                  <td className="col-lg-2 col-md-2 qpTestTitle purchasedlabel">{questionPaper.questionPaperName}</td>
                                                                  
                                                                    
                                                                  {questionPaper.noOfAttempts.map((dat,indexxx)=>{
                                                                    return dat.status==true?                             
                                                                      <td className="col-lg-2 col-md-2 attemptedTd" key={indexxx}>
                                                                        <div className="col-lg-12 col-md-12 qpTestTitle qpTestDate tdWhiteText">Attempted on : {dat.attemptedAt}</div>
                                                                      </td>
                                                                    :
                                                                    dat.status==false?
                                                                      <td className="col-lg-2 col-md-2" key={indexxx}>
                                                                      <button type="submit" className="btn btn-primary startBtnPE" name="PracticeExamName" ref="PracticeExamName" data-index={indexxx} data-text={questionPaper.packageId} data-id={questionPaper.order_id} onClick={this.startPracticeExam.bind(this)}value={questionPaper.questionPaper_id}>Attempt</button>
                                                                      </td>
                                                                      :
                                                                    <td className="col-lg-1 col-md-2" key={indexxx}><div className="col-lg-12 col-md-12 qpTestTitle qpTestDate">NA</div></td>
                                                                    })
                                                                   }
                                                                 
                                                                  </tr>
                                                                  })}
                                                                  </tbody>
                                                            </table>    
                                                          </div>
                                                        </div>
                                                      </form>
                                                    </div>
                                                  </div>
                   

                                              : this.state.showButton ?
                                                <div className=" box-header with-border boxMinHeight  studDataNotExist">
                                                  <h3 className="col-lg-12 col-md-12 col-sm-12"> Oops! It seems that you didn't complete your last exam. Do you wish to continue ? </h3>
                                                  <div>
                                                    <button className="btn btn-primary yesContinueBtn col-lg-2 col-lg-offset-4 col-md-2 col-md-offset-4 col-lg-sm col-sm-offset-4 " id={this.props.lastExamId} onClick={this.gotoPreviousExam.bind(this)}>Yes, continue</button> &nbsp;&nbsp;&nbsp;&nbsp;
                                                    <button className="btn btn-danger notContinueBtn col-lg-2 col-md-2  " id={this.props.lastExamId} onClick={this.ExamComplete.bind(this)}>No</button>
                                                </div>
                                                </div>
                                                :
                                                <div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
                                                  <div>
                                                    Loading please wait...!!!
                                                  </div>
                                                  <img src="/images/preloader.gif"/>
                                                </div>
                                                :
                                            <div className="box-header with-border boxMinHeight  studDataNotExist loadingImgWrap">
                                              <div>
                                                Loading please wait...!!!
                                              </div>
                                             {/* <img src="/images/preloader.gif"/>*/}
                                            </div>

                    
                    }
                  </div>
                  </div>
                </div>
              </section>
          </div>
        </div>
        );
        }else{
          return(
          <div>    
            <div className="content-wrapper">
              <section className="content-header">
                {!this.props.examMasterData ?
                <h1>Start Practice Exam </h1>
                :
                <h1>Start Practice Exam</h1>
                }
              </section>
              <section className="content viewContent">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12">
                    <div className="box">
                <div className="box-header with-border boxMinHeight  studDataNotExist">
                    <div className="examLoadingTimeDiv">
                {this.tryPELoadingAgainforBtn()}
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
}
export default IAgreeAndStartExamContainer = withTracker(props=>{
  var urlPackageId= FlowRouter.getParam("packageId");
  clearInterval(Session.get("interval"));
  
  const postHandle   = Meteor.subscribe("LoginInStudent",Meteor.userId());
  const LoadingTest  = !postHandle.ready();
  var studentData    = StudentMaster.findOne({"studentId":Meteor.userId()})||{};
  
  const postHandle2  = Meteor.subscribe("instruction_PE");
  const loadingTest2 = !postHandle2.ready();
  
  // var postHandle3    = Meteor.subscribe("quesPaperPracticeExam");
  // var LoadingTest3   = !postHandle.ready();

  const postHandle4     =  Meteor.subscribe('InCompletedExam');
  const loadingTest4    = !postHandle4.ready();
  
  const postHandle6     =  Meteor.subscribe('LoginStudTodaysExam',moment().format("DD/MM/YYYY"));
  const loadingTest6    = !postHandle6.ready();
  
  const postHandle5     =  Meteor.subscribe('loginUserPackageQP',Meteor.userId());
  const loadingTest5    = !postHandle5.ready();
  
  var PE_Instruction    = InstructionMaster.findOne({"instructionFor" : "Practice Exam"})||{};

  // const postHandlePackage   = Meteor.subscribe("packageManagementData");
  // const LoadingPackage  = !postHandlePackage.ready();


    if(studentData.studentEmail){
      var postHandle3    = Meteor.subscribe("quesPaperPracticeExamSingle",studentData.category,studentData.subCategory);
      // var postHandle3    = Meteor.subscribe("quesPaperPracticeExam",studentData.category,studentData.subCategory);
      var LoadingTest3   = !postHandle.ready();
      // var practiceQPData =  QuestionPaperMaster.find({"category":studentData.category, "subCategory":studentData.subCategory}).fetch();
      var practiceQPData =  QuestionPaperMaster.find({"category":studentData.category, "subCategory":studentData.subCategory, "examType" : "Practice Exam","isDraft":"","paperStatus" : "Assigned"}).fetch();

      var myPracticeExamMasterData = MyPracticeExamMaster.findOne({"StudentId":Meteor.userId(),"examStatus":"InCompleted"})||{};
      var myPEMSEStatus = MyPracticeExamMaster.find({"StudentId":Meteor.userId(),"date":moment().format("DD/MM/YYYY")}).fetch();

      var PackageQPMData = PackageQuestionPaperMaster.find({"buyerId":Meteor.userId(),'packageId':urlPackageId}).fetch();


      var attemptArray=[];
      if(PackageQPMData && PackageQPMData.length> 0 ){
        for(var i = 0;i<PackageQPMData.length;i++){
          var idd=PackageQPMData[i].packageId;
          var  postHandlePackage   = Meteor.subscribe("packageManagementDataPackageIdwise",idd);
          var LoadingPackage  = !postHandlePackage.ready();
          var pckgData = PackageManagementMaster.findOne({"_id":idd});
          if(pckgData){
            PackageQPMData[i].AttemptOfPracticeTest = parseInt(pckgData.AttemptOfPracticeTest);
            attemptArray.push(parseInt(pckgData.AttemptOfPracticeTest));
          }
        }
      }
      var  sorted = attemptArray.slice().sort(function(a, b) {
        return a - b;
      });
      var maxAttempt  = sorted[sorted.length - 1];
      var blankCount=[];
      if(PackageQPMData && PackageQPMData.length> 0 ){
        for(var i = 0;i<PackageQPMData.length;i++){
          blankCount.push(maxAttempt-PackageQPMData[i].AttemptOfPracticeTest);           
        }
      }

      for(i=0;i<blankCount.length;i++){
        var cnt=blankCount[i];   
        for(z=0;z<=cnt;z++){
          var obj={"status":"--"};
          if(PackageQPMData && PackageQPMData.length> 0 ){
            for(var i = 0;i<PackageQPMData.length;i++){
               // PackageQPMData[i].noOfAttempts.push(obj);
               if(PackageQPMData[i].noOfAttempts.length<maxAttempt){
                PackageQPMData[i].noOfAttempts.push(obj);
               }else{
                   null
               }
            }
          }
        }
        obj='';
      }
      if(myPracticeExamMasterData){
        var lastExamId = myPracticeExamMasterData._id;
      }else{
        var lastExamId = '';
      }
    }else{
      var status = '';
    }
  return {
  LoadingTest,
  loadingTest2,
  LoadingTest3,
  loadingTest4,
  practiceQPData,
  status,
  PE_Instruction,
  lastExamId,
  PackageQPMData,
  myPEMSEStatus,
  LoadingPackage,
  urlPackageId,
  maxAttempt
  }

})(PurchasedPracticeStartExam);
