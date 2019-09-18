import React                   from 'react';
import { FlowRouter }   from 'meteor/ostrio:flow-router-extra';
import { mount }               from 'react-mounter';

import FranchiseLayouts     from '/imports/layout/FranchiseLayout.jsx';

//--------- Company Setting --------------
import CompanySettingTabs      from '/imports/admin/companySetting/components/CompanyInformation_setting/CompanySettingTabs.jsx';
import FranchiseCompanySettingTabs      from '/imports/admin/companySetting/components/CompanyInformation_setting/FranchiseCompanySettingTabs.jsx';
import CompanyInformation      from '/imports/admin/companySetting/components/CompanyInformation_setting/CompanyInformation.jsx';
import Makepayment             from '/imports/admin/companySetting/components/CompanyInformation_setting/Makepayment.jsx';

import BaseLayouts                      from '/imports/layout/AdminDashboardLayout.jsx';

import InitialLayout                   from '/imports/layout/CompanysettingLayout.jsx';

// FlowRouter.route('/initial-company-setting', {
//     action: function(params, queryParams) {
//         mount(InitialLayout,{content: (<FranchiseCompanySettingTabs />) });
//     }
// });

// FlowRouter.route('/franchise/companyinfo', {
//     action: function(params, queryParams) {
//         mount(FranchiseLayouts,{content: (<CompanySettingTabs />) });
//     }
// });


