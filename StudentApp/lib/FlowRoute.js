
import React                            from 'react';
import { FlowRouter }                   from 'meteor/ostrio:flow-router-extra';
import { Meteor }                         from 'meteor/meteor';
import { mount  }                        from 'react-mounter';
import Loadable                         from 'react-loadable';

// import NoAccessLayout   from '/imports/layout/NoAccessLayout.jsx';
import NoAccess   from '/imports/layout/NoAccess.jsx';
import StudentLayouts   from '/imports/layout/StudentDashboardLayout.jsx';
import MainLayout       from '/imports/layout/MainLayout.jsx';
import CommonLayout       from '/imports/layout/CommonLayout.jsx';




// ============================================Student Main Exam new url ============================

  const MultipleCompetition = Loadable({
  loader: () => import('/imports/studentMainExam/components/MultipleCompetition.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StartExam = Loadable({
  loader: () => import('/imports/studentMainExam/components/StartExam.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PracticeExamResult = Loadable({
  loader: () => import('/imports/studentMainExam/components/PracticeExamResult.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ExamResult = Loadable({
  loader: () => import('/imports/studentMainExam/components/ExamResult.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const IAgreeAndStartExam = Loadable({
  loader: () => import('/imports/studentMainExam/components/IAgreeAndStartExam.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});
const PracticeStartExam = Loadable({
  loader: () => import('/imports/studentMainExam/components/PracticeStartExam.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StartPracticeExam = Loadable({
  loader: () => import('/imports/studentMainExam/components/StartPracticeExam.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PurchasedPracticeStartExam = Loadable({
  loader: () => import('/imports/studentMainExam/components/PurchasedPracticeStartExam.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});
const ExamPhotoVerification = Loadable({
  loader: () => import('/imports/admin/reports/components/studentWiseTest/ExamPhotoVerification.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}

});

// ==================================================================================================================================================================================================================================================


const Login = Loadable({
  loader: () => import('/imports/systemSecurity/components/UMLogin.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const Signup = Loadable({
  loader: () => import('/imports/systemSecurity/components/SignUp.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ConfirmOtpModal = Loadable({
  loader: () => import('/imports/systemSecurity/components/ConfirmOtpModal.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ForgotPassword = Loadable({
  loader: () => import('/imports/systemSecurity/components/NewForgotPassword.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const VerifyEmail = Loadable({
  loader: () => import('/imports/systemSecurity/components/VerifyEmail.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const NewResetPassword = Loadable({
  loader: () => import('/imports/systemSecurity/components/NewResetPassword.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ResetPassword = Loadable({
  loader: () => import('/imports/admin/userManagement/components/ResetPassword.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});




// =====================================New Student url===============================================


const CreateStudentRegistration = Loadable({
  loader: () => import('/imports/student/components/CreateStudentRegistration.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentProfile = Loadable({
  loader: () => import('/imports/student/components/StudentProfile.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentResetPassword = Loadable({
  loader: () => import('/imports/student/components/StudentResetPassword.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentDetails = Loadable({
  loader: () => import('/imports/student/components/StudentDetails.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PastExamReports = Loadable({
  loader: () => import('/imports/student/components/PastExamReports.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CompetitionResultReport = Loadable({
  loader: () => import('/imports/studentReports/components/CompetitionResultReport.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ResultView = Loadable({
  loader: () => import('/imports/studentReports/components/ResultView.jsx'),
  loading(){return <div className="col-lg-9 col-lg-offset-1 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PracticeExamReports = Loadable({
  loader: () => import('/imports/student/components/PracticeExamReports.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CompetitionDetailsforPayment = Loadable({
  loader: () => import('/imports/student/components/CompetitionDetailsforPayment.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});



const TestWebcam = Loadable({
  loader: () => import('/imports/student/components/TestWebcam.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const TestNetspeed = Loadable({
  loader: () => import('/imports/student/components/TestNetspeed.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});


// ============================================Payment process new urls=================================================

const MyInvoice = Loadable({
  loader: () => import('/imports/paymentProcess/components/MyInvoice.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PaymentFailure = Loadable({
  loader: () => import('/imports/paymentProcess/components/PaymentFailure.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PaymentGatewayUrl = Loadable({
  loader: () => import('/imports/paymentProcess/components/PaymentGatewayUrl.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const generate_checksum = Loadable({
  loader: () => import('/imports/paymentProcess/api/paymentGateway/router.js'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const MyListOfInvoices = Loadable({
  loader: () => import('/imports/paymentProcess/components/MyListOfInvoices.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PaymentResponse = Loadable({
  loader: () => import('/imports/student/components/PaymentResponse.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PaymentReceipt = Loadable({
  loader: () => import('/imports/student/components/PaymentReceipt.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PackagePaymentResponse = Loadable({
  loader: () => import('/imports/paymentProcess/components/PackagePaymentResponse.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PackagePaymentReceipt = Loadable({
  loader: () => import('/imports/paymentProcess/components/PackagePaymentReceipt.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const MyOrder = Loadable({
  loader: () => import('/imports/student/components/MyOrder.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});





// =================================================================================================



const Certificate = Loadable({
  loader: () => import('/imports/admin/Certificate/components/Certificate.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ParticipationCertificate = Loadable({
  loader: () => import('/imports/admin/Certificate/components/ParticipationCertificate.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const AddModuleFacility = Loadable({
  loader: () => import('/imports/admin/accessManagement/components/AddModuleFacility.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const AssignPermissionToModules = Loadable({
  loader: () => import('/imports/admin/accessManagement/components/AssignPermissionToModules.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});




// ======================================Package Management old url==============================
// const MyPackages = Loadable({
//   loader: () => import('/imports/admin/myPackages/components/MyPackages.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const PackageList = Loadable({
//   loader: () => import('/imports/admin/packageList/components/PackageList.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const PurchasedPackage = Loadable({
//   loader: () => import('/imports/admin/myPackages/components/PurchasedPackage.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// =============================================================================================================================================================================
const MyPackages = Loadable({
  loader: () => import('/imports/packageManagement/components/MyPackages.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PackageList = Loadable({
  loader: () => import('/imports/packageManagement/components/PackageList.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PurchasedPackage = Loadable({
  loader: () => import('/imports/packageManagement/components/PurchasedPackage.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});


// =======================================================================================================




const PracticeTestReport = Loadable({
  loader: () => import('/imports/admin/reports/components/franchiseWisePracticeTest/PracticeTestReport.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentExamReport = Loadable({
  loader: () => import('/imports/admin/reports/components/studentExam/StudentExamReport.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});







const ComingSoon = Loadable({
  loader: () => import('/imports/admin/components/ComingSoon.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentContent = Loadable({
  loader: () => import('/imports/admin/studentContent/StudentContent.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});



//============  System Security =================
FlowRouter.route('/', {
action: function(params, queryParams) {
    mount(MainLayout,{content: (<Login />) });
    }
});



FlowRouter.route('/result', {
action: function(params, queryParams) {
    mount(CommonLayout,{content: (<ResultView />) });
    }
});


FlowRouter.route('/ForgotPassword', {
action: function(params, queryParams) {
    mount(MainLayout,{content: (<ForgotPassword />) });
    }
});


FlowRouter.route('/Signup', {
    action: function(params, queryParams) {
        mount(MainLayout,{content: (<Signup />) });
    }
});

FlowRouter.route('/otpFirstVarification/:mailId', {
    action: function(params, queryParams) {
        mount(MainLayout,{content: (<ConfirmOtpModal />) });
    }
});
FlowRouter.route('/otpVarification/:mailId', {
    action: function(params, queryParams) {
        mount(MainLayout,{content: (<ConfirmOtpModal />) });
    }
});
FlowRouter.route('/forgotOTPVarification/:mailId', {
    action: function(params, queryParams) {
        mount(MainLayout,{content: (<ConfirmOtpModal />) });
    }
});
FlowRouter.route('/verifyAccount', {
    action: function(params, queryParams) {
        mount(MainLayout,{content: (<VerifyEmail />) });
    }
});

FlowRouter.route('/resetPassword/:id', {
    action: function(params, queryParams) {
        mount(MainLayout,{content: (<NewResetPassword />) });
    }
});
FlowRouter.route('/myChangePassword/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<StudentResetPassword />) });
    }
});






//============  Student Profile =================


FlowRouter.route('/studentDashboard', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<StudentContent />) });
    }
});

FlowRouter.route('/Student/Profiles', {
    action: function(params, queryParams) {
      // console.log("in route--->");
        mount(StudentLayouts,{content: (<StudentProfile />) });
    }
});


FlowRouter.route('/myProfile', {  

    action: function(params, queryParams) {
       // console.log("in route--rrr->");
        mount(StudentLayouts,{content: (<StudentProfile />) });
    }
});

FlowRouter.route('/studentRegistration', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<CreateStudentRegistration />) });
    }
});
FlowRouter.route('/editStudentInfo/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<CreateStudentRegistration />) });
    }
});
FlowRouter.route('/admin/editStudentInfo/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<CreateStudentRegistration />) });
    }
});

FlowRouter.route('/studentProfile/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<StudentProfile />) });
    }
});




//============  Student Main Exam =================

FlowRouter.route('/iAgreeAndStartExam', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<IAgreeAndStartExam />) });
    }
});

FlowRouter.route('/iAgreeAndStartExam/:competitionId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<IAgreeAndStartExam />) });
    }
});
FlowRouter.route('/startExam/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<StartExam />) });
    }
});

FlowRouter.route('/examResult/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<ExamResult />) });
    }
});
FlowRouter.route('/competitionDetails/:compId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<CompetitionDetailsforPayment />) });
    }
});

FlowRouter.route('/testWebcam', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<TestWebcam />) });
    }
});

FlowRouter.route('/testNetSpeed', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<TestNetspeed />) });
    }
});
FlowRouter.route('/MultipleCompetition', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<MultipleCompetition />) });
    }
});



//============  Student Practice Exam =================

FlowRouter.route('/startPracticeExam', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PracticeStartExam />) });
    }
});

FlowRouter.route('/practiceExamResult/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PracticeExamResult />) });
    }
});

FlowRouter.route('/startPurchasedPracticeExam', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PurchasedPracticeStartExam />) });
    }
});

FlowRouter.route('/startPurchasedPracticeExam/:packageId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PurchasedPracticeStartExam />) });
    }
});

FlowRouter.route('/startPurchasedPracticeExam/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PurchasedPracticeStartExam />) });
    }
});
FlowRouter.route('/practiceExam/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<StartPracticeExam />) });
    }
});


FlowRouter.route('/practiceExam/:id/:urlPackageId/:BtnIndex', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<StartPracticeExam />) });
    }
});

FlowRouter.route('/practiceExam/:id/:urlPackageId/:BtnIndex/:qIndex/:qAnswer', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<StartPracticeExam />) });
    }
});



//============  Student Reports   =================

FlowRouter.route('/pastExamReports', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PastExamReports />) });
    }
});

FlowRouter.route('/competitionReport', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<CompetitionResultReport />) });
    }
});


FlowRouter.route('/PracticeExamReports', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PracticeExamReports />) });
    }
});



//============  Package Management =================

FlowRouter.route('/MyPackages', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<MyPackages />) });
    }
});

FlowRouter.route('/PurchasedPackage', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PurchasedPackage />) });
    }
});

FlowRouter.route('/PackageList', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PackageList />) });
    }
});
FlowRouter.route('/PackageList/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PackageList />) });
    }
});


//============  Payment Process =================

FlowRouter.route('/MyInvoice/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<MyInvoice />) });
    }
});

FlowRouter.route('/myOrderInvoice/:id', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PackageList />) });
    }
});

FlowRouter.route('/PaymentGatewayUrl', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PaymentGatewayUrl />) });
    }
});
FlowRouter.route('/paytmResponse', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content:'' });
    }
});
FlowRouter.route('/generate_checksum', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<generate_checksum />) });
    }
});
FlowRouter.route('/myListOfInvoices', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<MyListOfInvoices />) });
    }
});

FlowRouter.route('/payment-response/:userId/:compId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PaymentResponse />) });
    }
});
FlowRouter.route('/packagePayment-response/:orderId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PackagePaymentResponse />) });
    }
});
FlowRouter.route('/packagePayment-success/:orderId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PackagePaymentReceipt />) });
    }
});

FlowRouter.route('/payment-success/:compId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PaymentReceipt />) });
    }
});

FlowRouter.route('/payment-failure/:compId', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PaymentFailure />) });
    }
});
FlowRouter.route('/payment-failure', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<PaymentFailure />) });
    }
});

FlowRouter.route('/my-order', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<MyOrder />) });
    }
});


//============  Certificate Module =================

FlowRouter.route('/Certificate', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<Certificate />) });
    }
});

FlowRouter.route('/ParticipationCertificate', {
    action: function(params, queryParams) {
        mount(StudentLayouts,{content: (<ParticipationCertificate />) });
    }
});



//============  Access Management =================




FlowRouter.route('/noAccesss',{
  action:function(params,queryParams){
    mount(NoAccessLayout)
  }
});

FlowRouter.route('/noAccesssPage',{
  action:function(params,queryParams){
    mount(NoAccess)
  }
});
