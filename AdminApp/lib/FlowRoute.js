import React                            from 'react';
import { FlowRouter }                   from 'meteor/ostrio:flow-router-extra';
import {Meteor}                         from 'meteor/meteor';
import { mount }                        from 'react-mounter';
import Loadable                         from 'react-loadable';
import {Router, Route, browserHistory}  from 'react-router';
// import {Accounts}                       from 'meteor/accounts-base';
// import { Roles }                        from 'meteor/alanning:roles';

import NoAccessLayout from '/imports/layout/NoAccessLayout.jsx';
import NoAccess from '/imports/layout/NoAccess.jsx';
import BaseLayouts                      from '/imports/layout/AdminDashboardLayout.jsx';
import MasterLayout                      from '/imports/layout/MasterLayout.jsx';

// import StudentLayouts                   from '/imports/layout/StudentDashboardLayout.jsx';
// import FranchiseLayouts                 from '/imports/layout/FranchiseLayout.jsx';
// import StaffLayout                      from '/imports/layout/StaffLayout.jsx';
import MainLayout                       from '/imports/layout/MainLayout.jsx';

import InitialLayout                   from '/imports/layout/CompanysettingLayout.jsx';
import CompanyInformation      from '/imports/admin/companySetting/components/CompanyInformation_setting/CompanyInformation.jsx';
import Makepayment             from '/imports/admin/companySetting/components/CompanyInformation_setting/Makepayment.jsx';


const FranchiseCompanySettingTabs = Loadable({
  loader: () => import('/imports/admin/companySetting/components/CompanyInformation_setting/FranchiseCompanySettingTabs.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/> </div>}
});

const MultipleCompetition = Loadable({
  loader: () => import('/imports/admin/forms/exam/MultipleCompetition.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const SendSMS = Loadable({
  loader: () => import('/imports/admin/SMSManagement/components/SendSMS.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});


const SentSMSReport = Loadable({
  loader: () => import('/imports/admin/SMSManagement/components/SentSMSReport.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});





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

const AdminContent = Loadable({
  loader: () => import('/imports/admin/adminContent/AdminContent.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ResetPassword = Loadable({
  loader: () => import('/imports/admin/userManagement/components/ResetPassword.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});



const CompanySettingTabs = Loadable({
  loader: () => import('/imports/admin/companySetting/components/CompanyInformation_setting/CompanySettingTabs.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const DocumentDownload = Loadable({
  loader: () => import('/imports/admin/companySetting/components/CompanyInformation_setting/DocumentDownload.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CreateUser = Loadable({
  loader: () => import('/imports/admin/userManagement/components/CreateUser.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const NotificationManagement = Loadable({
  loader: () => import('/imports/admin/notification/NotificationManagement.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const SiteShutdownTime = Loadable({
  loader: () => import('/imports/admin/notification/SiteShutdownTime.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const NotificationList = Loadable({
  loader: () => import('/imports/admin/notification/NotificationList.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const CreateAdmin = Loadable({
//   loader: () => import('/imports/admin/userManagement/components/CreateAdmin.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

const EditUserProfile = Loadable({
  loader: () => import('/imports/admin/userManagement/components/EditUserProfile.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const UMRolesList = Loadable({
  loader: () => import('/imports/admin/userManagement/components/UMRolesList.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const UMListOfUsers = Loadable({
  loader: () => import('/imports/admin/userManagement/components/UMListOfUsers.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const UMEditUserProfile = Loadable({
  loader: () => import('/imports/admin/userManagement/components/EditUserProfile.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});



const AddCategory = Loadable({
  loader: () => import('/imports/admin/forms/addCategory/AddCategory.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const AddQuestion = Loadable({
  loader: () => import('/imports/admin/forms/addQuestions/AddQuestion.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const UploadQuestions = Loadable({
  loader: () => import('/imports/admin/forms/addQuestions/UploadQuestions.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const QuestionCategoryTab = Loadable({
  loader: () => import('/imports/admin/forms/addQuestions/QuestionCategoryTab.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const Instructions = Loadable({
  loader: () => import('/imports/admin/forms/instructions/components/Instructions.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const QuestionPaper = Loadable({
  loader: () => import('/imports/admin/forms/setQuestionPaper/QuestionPaper.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const SetQuestionPaper = Loadable({
  loader: () => import('/imports/admin/forms/setQuestionPaper/SetQuestionPaper.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const AddQuestionInPaper = Loadable({
  loader: () => import('/imports/admin/forms/setQuestionPaper/AddQuestionInPaper.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/> </div>}
});

const PracticeQuestionPaper = Loadable({
  loader: () => import('/imports/admin/forms/setQuestionPaper/PracticeQuestionPaper.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const FinalQuestionPaper = Loadable({
  loader: () => import('/imports/admin/forms/setQuestionPaper/FinalQuestionPaper.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CreateExam = Loadable({
  loader: () => import('/imports/admin/forms/exam/CreateExam.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ListofExams = Loadable({
  loader: () => import('/imports/admin/forms/exam/ListofExams.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const StartExam = Loadable({
//   loader: () => import('/imports/admin/forms/exam/StartExam.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

const PracticeExamResult = Loadable({
  loader: () => import('/imports/admin/forms/exam/PracticeExamResult.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ExamResult = Loadable({
  loader: () => import('/imports/admin/forms/exam/ExamResult.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const IAgreeAndStartExam = Loadable({
//   loader: () => import('/imports/admin/forms/exam/IAgreeAndStartExam.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });
// const PracticeStartExam = Loadable({
//   loader: () => import('/imports/admin/forms/exam/PracticeStartExam.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });



// const StartPracticeExam = Loadable({
//   loader: () => import('/imports/admin/forms/exam/StartPracticeExam.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const PurchasedPracticeStartExam = Loadable({
//   loader: () => import('/imports/admin/forms/exam/PurchasedPracticeStartExam.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const CreateStudentRegistration = Loadable({
//   loader: () => import('/imports/admin/forms/student/CreateStudentRegistration.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

const ListOfStudent = Loadable({
  loader: () => import('/imports/admin/forms/student/ListOfStudent.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentCount = Loadable({
  loader: () => import('/imports/admin/forms/student/StudentCount.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const FranchiseWiseStudents = Loadable({
  loader: () => import('/imports/admin/forms/student/FranchiseWiseStudents.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const StudentProfile = Loadable({
//   loader: () => import('/imports/admin/forms/student/StudentProfile.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const StudentResetPassword = Loadable({
//   loader: () => import('/imports/admin/forms/student/StudentResetPassword.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

const StudentDetails = Loadable({
  loader: () => import('/imports/admin/forms/student/StudentDetails.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PastExamReports = Loadable({
  loader: () => import('/imports/admin/forms/student/PastExamReports.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PracticeExamReports = Loadable({
  loader: () => import('/imports/admin/forms/student/PracticeExamReports.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const RegistrationReportsTabs = Loadable({
  loader: () => import('/imports/admin/reports/components/studentRegistration/RegistrationReportsTabs.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CategoryWiseReportsTabs = Loadable({
  loader: () => import('/imports/admin/reports/components/categoryWiseTest/CategoryWiseReportsTabs.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudWiseTestReportsTabs = Loadable({
  loader: () => import('/imports/admin/reports/components/studentWiseTest/StudWiseTestReportsTabs.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}

});

const ExamPhotoVerification = Loadable({
  loader: () => import('/imports/admin/reports/components/studentWiseTest/ExamPhotoVerification.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}

});

const FranchiseWiseCompetitionResultReport = Loadable({
  loader: () => import('/imports/admin/reports/components/studentWiseTest/FranchiseWiseCompetitionResultReport.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}

});

const CreatePackage = Loadable({
  loader: () => import('/imports/admin/packageManagement/components/CreatePackage.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const UMListOfPackage = Loadable({
  loader: () => import('/imports/admin/packageManagement/components/UMListOfPackage.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const UMEditPackage = Loadable({
  loader: () => import('/imports/admin/packageManagement/components/UMEditPackage.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PackageList = Loadable({
  loader: () => import('/imports/admin/packageList/components/PackageList.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const MyInvoice = Loadable({
  loader: () => import('/imports/admin/forms/invoice/components/MyInvoice.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});
const PaymentFailure = Loadable({
  loader: () => import('/imports/admin/forms/invoice/components/PaymentFailure.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PaymentGatewayUrl = Loadable({
  loader: () => import('/imports/admin/forms/invoice/components/PaymentGatewayUrl.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const Certificate = Loadable({
//   loader: () => import('/imports/admin/Certificate/components/Certificate.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const ParticipationCertificate = Loadable({
//   loader: () => import('/imports/admin/Certificate/components/ParticipationCertificate.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });


const CreateRank = Loadable({
  loader: () => import('/imports/admin/forms/createRank/components/CreateRank.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const generate_checksum = Loadable({
  loader: () => import('/imports/paymentGateway/router.js'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const AddFranchiseDetails = Loadable({
  loader: () => import('/imports/admin/franchiseDetails/components/AddFranchiseDetails.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const FranchiseDashboard = Loadable({
//   loader: () => import('/imports/admin/components/Dashboard'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const AddStudentByFranchise = Loadable({
//   loader: () => import('/imports/admin/franchiseStudentManagement/components/AddStudentByFranchise.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

const FranchiseStudentProfile = Loadable({
  loader: () => import('/imports/admin/franchiseStudentManagement/components/FranchiseStudentProfile.jsx'),
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

const MyListOfInvoices = Loadable({
  loader: () => import('/imports/admin/forms/invoice/components/MyListOfInvoices.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CompetitionDetailsforPayment = Loadable({
  loader: () => import('/imports/admin/forms/student/CompetitionDetailsforPayment.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CompetitionPaymentSummary = Loadable({
  loader: () => import('/imports/admin/reports/components/competitionPaymentSummary/CompetitionPaymentSummary.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const FranchiseCompetitionPaymentSummary = Loadable({
  loader: () => import('/imports/admin/reports/components/competitionPaymentSummary/FranchiseCompetitionPaymentSummary.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const FranchisePaymentDetails = Loadable({
  loader: () => import('/imports/admin/reports/components/competitionPaymentSummary/FranchisePaymentDetails.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CreateStaff = Loadable({
  loader: () => import('/imports/admin/userManagement/components/CreateStaff.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const UMListofStaff = Loadable({
  loader: () => import('/imports/admin/userManagement/components/UMListofStaff.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const FranchiseProfile = Loadable({
  loader: () => import('/imports/admin/forms/franchise/FranchiseProfile.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ListOfUsersStudent = Loadable({
  loader: () => import('/imports/admin/userManagement/components/ListOfUsersStudent.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const MyPackages = Loadable({
//   loader: () => import('/imports/admin/myPackages/components/MyPackages.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const PurchasedPackage = Loadable({
//   loader: () => import('/imports/admin/myPackages/components/PurchasedPackage.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

const ListOfStudentsbyfranchise = Loadable({
  loader: () => import('/imports/admin/franchiseStudentManagement/components/ListofstudentbyFranchise.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const PracticeTestReport = Loadable({
  loader: () => import('/imports/admin/reports/components/franchiseWisePracticeTest/PracticeTestReport.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentWisePayment = Loadable({
  loader: () => import('/imports/admin/reports/components/studentWisePaymentDetails/StudentWisePayment.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const StudentExamReport = Loadable({
  loader: () => import('/imports/admin/reports/components/studentExam/StudentExamReport.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ListOfPaidStudents = Loadable({
  loader: () => import('/imports/admin/reports/components/listOfPaidStudents/ListOfPaidStudents.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const CompanySettingRoute = Loadable({
  loader: () => import('/imports/admin/companySetting/lib/companySettingRoute.js'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const PaymentResponse = Loadable({
//   loader: () => import('/imports/admin/forms/student/PaymentResponse.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const PackagePaymentResponse = Loadable({
//   loader: () => import('/imports/admin/forms/invoice/components/PackagePaymentResponse.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const PackagePaymentReceipt = Loadable({
//   loader: () => import('/imports/admin/forms/invoice/components/PackagePaymentReceipt.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const PaymentReceipt = Loadable({
//   loader: () => import('/imports/admin/forms/student/PaymentReceipt.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const MyOrder = Loadable({
//   loader: () => import('/imports/admin/forms/student/MyOrder.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const TestWebcam = Loadable({
//   loader: () => import('/imports/admin/forms/student/TestWebcam.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const TestNetspeed = Loadable({
//   loader: () => import('/imports/admin/forms/student/TestNetspeed.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

const Configuration = Loadable({
  loader: () => import('/imports/admin/configuration/components/Configuration.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ListOfFranchise = Loadable({
  loader: () => import('/imports/admin/franchiseDetails/components/ListOfFranchise.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

const ComingSoon = Loadable({
  loader: () => import('/imports/admin/components/ComingSoon.jsx'),
  loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
});

// const StudentContent = Loadable({
//   loader: () => import('/imports/admin/studentContent/StudentContent.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const FranchiseContent = Loadable({
//   loader: () => import('/imports/admin/franchiseContent/FranchiseContent.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });

// const StudentRegistrationForFranchise = Loadable({
//   loader: () => import('/imports/admin/reports/components/studentRegistrationForFranchise/StudentRegistrationForFranchise.jsx'),
//   loading(){return <div className="col-lg-10 col-lg-offset-2 col-md-10 col-md-offset-2 col-sm-10 col-sm-offset-2 pageLoadingWrap loaderSize"><img className="loaderImageSize" src="/images/loading1.gif" alt="loading"/></div>}
// });


// ==============================Main Layout========================================
FlowRouter.route('/initial-company-setting', {
    action: function(params, queryParams) {
        mount(InitialLayout,{content: (<FranchiseCompanySettingTabs />) });
    }
});

FlowRouter.route('/franchise/companyinfo', {
    action: function(params, queryParams) {
        mount(FranchiseLayouts,{content: (<CompanySettingTabs />) });
    }
});


FlowRouter.route('/initial-company-setting/:id', {

    action: function(params, queryParams) {
        mount(InitialLayout,{content: (<FranchiseCompanySettingTabs />) });
    }
});

FlowRouter.route('/franchise/companyinfo', {
    action: function(params, queryParams) {
        mount(FranchiseLayouts,{content: (<CompanySettingTabs />) });
    }
});


FlowRouter.route('/', {
action: function(params, queryParams) {
    mount(MainLayout,{content: (<Login />) });
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

FlowRouter.route('/Admin/ResetPasswords/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ResetPassword />) });
    }
}); 

FlowRouter.route('/Franchise/ResetPasswords/:id', {
    action: function(params, queryParams) {
        mount(FranchiseLayouts,{content: (<ResetPassword />) });
    }
});

FlowRouter.route('/resetPassword/:id', {
    action: function(params, queryParams) {
        mount(MainLayout,{content: (<NewResetPassword />) });
    }
});



// ============================Admin Dashboard Layout==============================

FlowRouter.route('/adminDashboard', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AdminContent />) });
    }
});


FlowRouter.route('/DocumentDownload/:franchiseId/:docType/:docId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<DocumentDownload />) });
    }
});



FlowRouter.route('/AddCategories', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddCategory />) });
    }
});
FlowRouter.route('/AddCategories/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddCategory />) });
    }
});

FlowRouter.route('/AddQuestions', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddQuestion />) });
    }
});

FlowRouter.route('/AddQuestions/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddQuestion />) });
    }
});

FlowRouter.route('/UploadQuestions', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<UploadQuestions />) });
    }
});
FlowRouter.route('/QuestionCategoryTabs', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<QuestionCategoryTab />) });
    }
});


// FlowRouter.route('/QuestionCategoryTabs', {
//     action: function(params, queryParams) {
//         mount(BaseLayouts,{content: (<QuestionCategoryTab />) });
//     }
// });


FlowRouter.route('/QuestionCategoryTabs/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<QuestionCategoryTab />) });
    }
});


FlowRouter.route('/Admin/AddInstructions', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<Instructions />) });
    }
});
FlowRouter.route('/Admin/AddInstructions/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<Instructions />) });
    }
});


FlowRouter.route('/Admin/QuestionPapers', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<QuestionPaper />) });
    }
});


FlowRouter.route('/Admin/QuestionPapers/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<QuestionPaper />) });
    }
});

FlowRouter.route('/Admin/QuestionPapers/:paperId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<QuestionPaper />) });
    }
});


FlowRouter.route('/Admin/CreateQuestionPapers', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<SetQuestionPaper />) });
    }
});

FlowRouter.route('/Admin/StudentCount', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<StudentCount />) });
    }
});

FlowRouter.route('/Admin/CreateQuestionPapers/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<SetQuestionPaper />) });
    }
});

FlowRouter.route('/CreateQuestionPapers/:category/:subCategory/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddQuestionInPaper />) });
    }
});

FlowRouter.route('/Admin/FinalQuestionPapers', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<FinalQuestionPaper />) });
    }
});

FlowRouter.route('/Admin/practiceQuestionPapers', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<PracticeQuestionPaper />) });
    }
});

FlowRouter.route('/Admin/CreateExams', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreateExam />) });
    }
});

FlowRouter.route('/admin/notifiaction', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<NotificationManagement />) });
    }
});

FlowRouter.route('/admin/notificationList', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<NotificationList />) });
    }
});

FlowRouter.route('/Admin/CreateExams/:examId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreateExam />) });
    }
});

FlowRouter.route('/Admin/CreateExams/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreateExam />) });
    }
});


FlowRouter.route('/Admin/ListofExams', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ListofExams />) });
    }
});

FlowRouter.route('/Admin/ListOfStudents/:fId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ListOfStudent />) });
    }
});

FlowRouter.route('/Admin/ListOfStudents/:fId/:orderId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ListOfStudent />) });
    }
});

FlowRouter.route('/Admin/FranchiseWiseStudents', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<FranchiseWiseStudents />) });
    }
});

FlowRouter.route('/StudentInformations/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<StudentDetails />) });
    }
});

// FlowRouter.route('/Franchise/StudentInformations/:id', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<StudentDetails />) });
//     }
// });



FlowRouter.route('/Admin/Reports', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<RegistrationReportsTabs />) });
    }
});



FlowRouter.route('/Admin/Category-Reports', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CategoryWiseReportsTabs />) });
    }
});
FlowRouter.route('/Admin/StudentWiseTestTaken-Reports', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<StudWiseTestReportsTabs />) });
    }
});

FlowRouter.route('/Admin/CompetitionWiseStudentPhotoVerify-Report', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ExamPhotoVerification />) });
    }
});

FlowRouter.route('/Admin/franchisewiseCompetitionResult-Reports', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<FranchiseWiseCompetitionResultReport />) });
    }
});

FlowRouter.route('/Admin/competitionwisePaymentSummary', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CompetitionPaymentSummary />) });
    }
});

FlowRouter.route('/Admin/competitionwisePaymentSummary/:compId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CompetitionPaymentSummary />) });
    }
});

FlowRouter.route('/Admin/franchisewisePaymentDetails/:compId/:franchId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<FranchisePaymentDetails />) });
    }
});
FlowRouter.route('/Admin/CreatePackages', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreatePackage />) });
    }
});
FlowRouter.route('/Admin/CreatePackages/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreatePackage />) });
    }
});
FlowRouter.route('/Admin/UMListOfPackages', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<UMListOfPackage />) });
    }
});

FlowRouter.route('/Edit/Admin/UMListOfPackages/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<UMEditPackage />) });
    }
});


FlowRouter.route('/Admin/CreateUsers', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreateUser />) });
    }
});





FlowRouter.route('/Admin/UMListOfUsers', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<UMListOfUsers />) });
    }
});

FlowRouter.route('/Admin/UMListOfUsers/:role', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<UMListOfUsers />) });
    }
});

FlowRouter.route('/Admin/SendSMS', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<SendSMS />) });
    }
});
FlowRouter.route('/Admin/sentSMSReport', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<SentSMSReport />) });
    }
});

// FlowRouter.route('/Franchise/UMListOfUsers', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<UMListOfUsers />) });
//     }
// });

FlowRouter.route('/EditProfiles/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<EditUserProfile />) });
    }
}); 

// FlowRouter.route('/Franchise/EditProfiles/:id', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<EditUserProfile />) });
//     }
// });

FlowRouter.route('/admin/showEditQuestion/:paperId/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddQuestion />) });
    }
});
FlowRouter.route('/admin/createTemplate', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreateTemplate />) });
    }
});
FlowRouter.route('/admin/createTemplate/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreateTemplate />) });
    }
});

FlowRouter.route('/admin/ViewTemplates', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ViewTemplates />) });
    }
});
FlowRouter.route('/admin/FranchiseDetails', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddFranchiseDetails />) });
    }
});

FlowRouter.route('/admin/editFranchiseDetails/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddFranchiseDetails />) });
    }
});

FlowRouter.route('/admin/addStudentByFranchise', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddStudentByFranchise />) });
    }
});

FlowRouter.route('/admin/editStudentByFranchise/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddStudentByFranchise />) });
    }
});

FlowRouter.route('/admin/FranchiseDetails', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddFranchiseDetails />) });
    }
});

FlowRouter.route('/admin/editFranchiseDetails/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddFranchiseDetails />) });
    }
});
FlowRouter.route('/admin/addStudentByFranchise', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddStudentByFranchise />) });
    }
});
FlowRouter.route('/admin/editStudentByFranchise/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddStudentByFranchise />) });
    }
});

FlowRouter.route('/admin/CreateRank', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CreateRank />) });
    }
});

FlowRouter.route('/admin/addFacilities', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddModuleFacility />) });
    }
});

FlowRouter.route('/admin/siteShutdownTime', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<SiteShutdownTime />) });
    }
});
FlowRouter.route('/admin/siteShutdownTime/:Id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<SiteShutdownTime />) });
    }
});

FlowRouter.route('/admin/addFacilities/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AddModuleFacility />) });
    }
});

FlowRouter.route('/admin/AssignPermissionstoModules', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AssignPermissionToModules />) });
    }
});

FlowRouter.route('/admin/AssignPermissionstoModules/:roleType', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<AssignPermissionToModules />) });
    }
});

FlowRouter.route('/admin/UMRolesList', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<UMRolesList />) });
    }
});

FlowRouter.route('/admin/Configuration', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<Configuration />) });
    }
});

FlowRouter.route('/Admin/profile/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<FranchiseProfile />) });
    }
});

FlowRouter.route('/admin/companyinfo', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<CompanySettingTabs />) });
    }
});




FlowRouter.route('/Admin/listofstudentusers/:companyId', {

    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ListOfUsersStudent />) });
         }
});

FlowRouter.route('/Admin/listofFranchise', {

    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ListOfFranchise />) });
         }
});



// ==============================Student Dashboard Layouts=======================


// FlowRouter.route('/studentDashboard', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StudentContent />) });
//     }
// });

// FlowRouter.route('/Student/Profiles', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StudentProfile />) });
//     }
// });
// FlowRouter.route('/iAgreeAndStartExam', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<IAgreeAndStartExam />) });
//     }
// });

// FlowRouter.route('/iAgreeAndStartExam/:competitionId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<IAgreeAndStartExam />) });
//     }
// });

// FlowRouter.route('/startPracticeExam', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PracticeStartExam />) });
//     }
// });


// FlowRouter.route('/startPurchasedPracticeExam', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PurchasedPracticeStartExam />) });
//     }
// });

// FlowRouter.route('/startPurchasedPracticeExam/:packageId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PurchasedPracticeStartExam />) });
//     }
// });




// FlowRouter.route('/startPurchasedPracticeExam/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PurchasedPracticeStartExam />) });
//     }
// });

// FlowRouter.route('/pastExamReports', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PastExamReports />) });
//     }
// });
// FlowRouter.route('/MyPackages', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<MyPackages />) });
//     }
// });

// FlowRouter.route('/PurchasedPackage', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PurchasedPackage />) });
//     }
// });
// FlowRouter.route('/MultipleCompetition', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<MultipleCompetition />) });
//     }
// });

// FlowRouter.route('/PracticeExamReports', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PracticeExamReports />) });
//     }
// });
// FlowRouter.route('/startExam/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StartExam />) });
//     }
// });

// FlowRouter.route('/studentRegistration', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<CreateStudentRegistration />) });
//     }
// });
// FlowRouter.route('/practiceExam/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StartPracticeExam />) });
//     }
// });


// FlowRouter.route('/practiceExam/:id/:urlPackageId/:BtnIndex', {

//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StartPracticeExam />) });
//     }
// });

// FlowRouter.route('/examResult/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<ExamResult />) });
//     }
// });
// FlowRouter.route('/myProfile', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StudentProfile />) });
//     }
// });
// FlowRouter.route('/practiceExamResult/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PracticeExamResult />) });
//     }
// });
// FlowRouter.route('/editStudentInfo/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<CreateStudentRegistration />) });
//     }
// });
// FlowRouter.route('/myChangePassword/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StudentResetPassword />) });
//     }
// });


// FlowRouter.route('/PackageList', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PackageList />) });
//     }
// });
// FlowRouter.route('/PackageList/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PackageList />) });
//     }
// });
// FlowRouter.route('/MyInvoice/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<MyInvoice />) });
//     }
// });

// FlowRouter.route('/Certificate', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<Certificate />) });
//     }
// });

// FlowRouter.route('/ParticipationCertificate', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<ParticipationCertificate />) });
//     }
// });

// FlowRouter.route('/myOrderInvoice/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PackageList />) });
//     }
// });

// FlowRouter.route('/PaymentGatewayUrl', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PaymentGatewayUrl />) });
//     }
// });



// FlowRouter.route('/paytmResponse', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content:'' });
//     }
// });

// FlowRouter.route('/generate_checksum', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<generate_checksum />) });
//     }
// });
// FlowRouter.route('/admin/editStudentInfo/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<CreateStudentRegistration />) });
//     }
// });

// FlowRouter.route('/studentProfile/:id', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<StudentProfile />) });
//     }
// });

// FlowRouter.route('/testWebcam', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<TestWebcam />) });
//     }
// });

// FlowRouter.route('/testNetSpeed', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<TestNetspeed />) });
//     }
// });

// FlowRouter.route('/myListOfInvoices', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<MyListOfInvoices />) });
//     }
// });

// FlowRouter.route('/competitionDetails/:compId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<CompetitionDetailsforPayment />) });
//     }
// });

// FlowRouter.route('/payment-response/:userId/:compId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PaymentResponse />) });
//     }
// });


// FlowRouter.route('/packagePayment-response/:orderId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PackagePaymentResponse />) });
//     }
// });
// FlowRouter.route('/packagePayment-success/:orderId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PackagePaymentReceipt />) });
//     }
// });

// FlowRouter.route('/payment-success/:compId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PaymentReceipt />) });
//     }
// });

// FlowRouter.route('/payment-failure/:compId', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PaymentFailure />) });
//     }
// });
// FlowRouter.route('/payment-failure', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<PaymentFailure />) });
//     }
// });

// FlowRouter.route('/my-order', {
//     action: function(params, queryParams) {
//         mount(StudentLayouts,{content: (<MyOrder />) });
//     }
// });


// ====================Staff Layouts=======================================

//  FlowRouter.route('/staffDashboard', {
// action: function(params, queryParams) {
//     mount(StaffLayout,{content: (<FranchiseContent />) });
//     }
// });



// ====================Franchise Layouts=======================================


// FlowRouter.route('/franchise/CreateStaff', { 
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<CreateStaff />) });
//     }
// });

// FlowRouter.route('/franchise/UMListofStaff_Student', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<UMListOfUsers />) });
//     }
// });

// FlowRouter.route('/franchiseDashboard', {
// action: function(params, queryParams) {
//     mount(FranchiseLayouts,{content: (<FranchiseContent />) });
//     }
// });

// FlowRouter.route('/franchise/Reports', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<RegistrationReportsTabs />) });
//     }
// });

// FlowRouter.route('/franchise/FranchiseDetails', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<AddFranchiseDetails />) });
//     }
// });

// FlowRouter.route('/franchise/PackageList', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<PackageList />) });
//     }
// });

// FlowRouter.route('/franchise/editFranchiseDetails/:id', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<AddFranchiseDetails />) });
//     }
// });

// FlowRouter.route('/franchise/addStudentByFranchise', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<AddStudentByFranchise />) });
//     }
// });
// FlowRouter.route('/franchise/editStudentByFranchise/:id', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<AddStudentByFranchise />) });
//     }
// });

// FlowRouter.route('/franchise/studentWiseTestTaken-reports', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<StudentRegistrationForFranchise />) });
//     }
// });

// FlowRouter.route('/franchise/profile/:id', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<FranchiseProfile />) });
//     }
// });

// FlowRouter.route('/franchise/profile', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<FranchiseProfile />) });
//     }
// });

// FlowRouter.route('/FranchiseSide/userProfile/:id', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<FranchiseProfile />) });
//     }
// });




// FlowRouter.route('/franchise/listOfStudentsbyfranchise', {

//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<ListOfStudentsbyfranchise />) });
//     }
// });

FlowRouter.route('/franchise/listOfStudentsbyfranchise', {

    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ListOfStudentsbyfranchise />) });
    }
});
FlowRouter.route('/Admin/comingsoon', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<ComingSoon />) });

    }
});


FlowRouter.route('/PackageList/:fId/:studentId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<PackageList />) });
    }
});
FlowRouter.route('/PackageList/:fId/:studentId/:orderId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<PackageList />) });
    }
});

FlowRouter.route('/PackageList/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<PackageList />) });
    }
});

// FlowRouter.route('/comingsoon', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<ComingSoon />) });

//     }
// });


// FlowRouter.route('/franchise/PracticeTestTaken', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<PracticeTestReport />) });

//     }
// });

// FlowRouter.route('/Franchise/FranchiseCompetitionPaymentSummary', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<FranchiseCompetitionPaymentSummary />) });
//     }
// });

// FlowRouter.route('/Franchise/FranchiseCompetitionPaymentSummary/:compId', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<FranchiseCompetitionPaymentSummary />) });
//     }
// });

// FlowRouter.route('/Franchise/franchisewisePaymentDetails/:compId/:franchId', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<FranchisePaymentDetails />) });
//     }
// });

FlowRouter.route('/admin/PracticeTestTaken', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<PracticeTestReport />) });

    }
});

FlowRouter.route('/MyInvoice/:id', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<MyInvoice />) });
    }
});

FlowRouter.route('/MyInvoice/:id/:fId/:studentId', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<MyInvoice />) });
    }
});

// FlowRouter.route('/franchise/studentPayment', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<StudentWisePayment />) });

//     }
// });

FlowRouter.route('/admin/studentPayment', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<StudentWisePayment />) });

    }
});

// FlowRouter.route('/franchise/FinalTestTaken', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<StudentExamReport />) });

//     }
// });
// FlowRouter.route('/franchise/StudentWiseFinalExamTaken-Reports', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<StudWiseTestReportsTabs />) });
//     }
// });

FlowRouter.route('/admin/FinalTestTaken', {
    action: function(params, queryParams) {
        mount(BaseLayouts,{content: (<StudentExamReport />) });

    }
});

// FlowRouter.route('/franchise/ListOfPaidStudents', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<ListOfPaidStudents />) });
//     }
// });

// FlowRouter.route('/franchise/ListOfPaidStudents/:examId/:category', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<ListOfPaidStudents />) });
//     }
// });

// FlowRouter.route('/franchise/CreateUsers', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<CreateUser />) });
//     }
// });

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
