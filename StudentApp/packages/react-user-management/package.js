Package.describe({
  name: 'iassureit:react-user-management',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.5');
  api.use('ecmascript');
  api.use('twbs:bootstrap');
  // api.use('mizzao:user-status');
  // api.use('momentjs:moment');
  // api.use('alanning:roles');
  api.use('accounts-password');
  api.use('accounts-base');
  api.use('patrickml:swal');
  api.use('session');
  // api.use('kadira:flow-router');
  // api.use('kadira:blaze-layout');
  api.use('email');
  // api.use('themeteorchef:bert');
  api.use('ultimatejs:tracker-react');
  // api.use('reactjs:react');
  api.export('UMLogin');

  api.mainModule('react-user-management.js');

  api.use('templating','client');
  // api.use(['kadira:flow-router', 'templating'], 'client');
  api.addFiles('css/user-management.css', 'client');
  api.addFiles('css/hover.css', 'client');
  api.addFiles('clientside/UMListOfUsers.jsx', 'client');
  api.addFiles('clientside/UMLogin.jsx', 'client');
  api.addFiles('clientside/UMSignup.jsx', 'client');
  api.addFiles('clientside/UMRolesList.jsx', 'client');
  api.addFiles('clientside/UMaddRoles.jsx', 'client');
  api.addFiles('clientside/UMadd_role.jsx', 'client');
  api.addFiles('clientside/UMeditRoles.jsx', 'client');
  api.addFiles('clientside/UMDelRolRow.jsx', 'client');
  api.addFiles('clientside/UMAddRolRow.jsx', 'client');
  api.addFiles('clientside/UMSelectRoleUsers.jsx', 'client');
  api.addFiles('clientside/UMUsers.jsx', 'client');
  api.addFiles('clientside/UMForgotPassword.jsx', 'client');
  api.addFiles('clientside/ResetPassword.jsx', 'client');
  api.addFiles('clientside/UMEditUserProfile.jsx', 'client');
  api.addFiles('clientside/UMEditFields.jsx', 'client');
  api.addFiles('clientside/newDate.jsx', 'client');
  api.addFiles('clientside/ProfileCandidateForm.jsx', 'client');
  api.addFiles('clientside/App.jsx', 'client');
  api.addFiles('router/react-um-router.jsx', 'client');
  api.addFiles('serverside/main.js', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('iassureit:react-user-management');
  api.mainModule('react-user-management-tests.js');
});
