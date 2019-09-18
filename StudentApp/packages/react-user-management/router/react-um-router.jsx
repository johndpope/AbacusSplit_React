import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import { mount } from 'react-mounter';
import UMLogin from '../clientside/UMLogin.jsx';
import UMSignup from '../clientside/UMSignup.jsx';
import UMRolesList from '../clientside/UMRolesList.jsx';
import UMListOfUsers from '../clientside/UMListOfUsers.jsx';
import ResetPassword from '../clientside/ResetPassword.jsx';
import UMEditUserProfile from '../clientside/UMEditUserProfile.jsx';

import App from '../clientside/App.jsx';


//
// FlowRouter.route('/UMLogin', {
//     action: function(params, queryParams) {
//         mount(UMLogin);
//     }
// });
//
// FlowRouter.route('/UMSignup', {
//     action: function(params, queryParams) {
//         mount(UMSignup);
//     }
// });
//
// FlowRouter.route( '/verify-email/:token', {
//   name: 'verify-email',
//   action( params ) {
//     Accounts.verifyEmail( params.token, ( error ) =>{
//       if ( error ) {
//         Bert.alert( error.reason, 'danger' );
//       }else{
//       	Bert.alert( 'Account Verified!', 'success' );
//       	FlowRouter.go('/');
//       }
//     });
//   },
// });
//
// FlowRouter.route('/UMRolesList', {
//     action: function(params, queryParams) {
//         mount(UMRolesList);
//     }
// });
//
// FlowRouter.route('/UMListOfUsers', {
//     action: function(params, queryParams) {
//         mount(UMListOfUsers);
//     }
// });
//
// FlowRouter.route('/reset-password/:token', {
//     name: 'resetpassword',
//     action: function() {
//       mount(ResetPassword);
//     }
// });
//
// FlowRouter.route('/UMeditUserProfile/:userid', {
//     name: 'resetpassword',
//     action: function() {
//       mount(UMEditUserProfile);
//     }
// });
//
//
// FlowRouter.route('/test', {
//     name: 'resetpassword',
//     action: function() {
//       mount(App);
//     }
// });
