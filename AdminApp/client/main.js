// import { Router, Route, browserHistory } from 'react-router';
import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';

import '/public/css/dashboard.css';
import './js-image-slider.css';
import './sliderman.css';

import '/imports/systemSecurity/css/login.css';
import '/imports/admin/forms/css/adminSideForms.css';
import '/imports/admin/forms/setQuestionPaper/css/setQuestionPaper.css';
import '/imports/admin/reports/css/report.css';
import '/imports/admin/accessManagement/css/accessManagement.css';
import 'react-table/react-table.css';

// ---------------Asmita----------------
import '/imports/admin/packageManagement/css/packageManagement.css';
import '/imports/admin/SMSManagement/css/sendSMS.css';
import '/imports/admin/franchiseDetails/css/FranchiseDetails.css';
// import '/imports/admin/franchiseStudentManagement/css/AddStudentByFranchise.css';
import '/imports/admin/packageList/css/PackageList.css';
// import '/imports/admin/Certificate/css/certificate.css';
import '/imports/admin/forms/invoice/css/invoice.css';
import '/imports/admin/forms/exam/css/Exam.css';
// import '/imports/admin/forms/student/css/student.css';
import '/imports/admin/configuration/css/configuration.css';

import '/imports/common/css/common.css';

// import '/imports/admin/packageList/api/parallaxeffect.js';
// import { LogoFiles } from "/imports/admin/franchiseDetails/components/Logo.js";
// import { TempLogoImage } from '/imports/admin/franchiseDetails/api/TempLogoImage.js';
// ------------------------------------------------------------------------------------------



import '/imports/admin/companySetting/css/companySetting.css';

$(document).on("click",function() {
    $('.categoryListDataStud').removeClass('categoryListDataStudshow');
});

Meteor.startup(() => {

});

//     