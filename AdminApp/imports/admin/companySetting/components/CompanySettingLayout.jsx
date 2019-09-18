import React from 'react';
import CompanySettingIndicators from './companySettingIndicators.jsx';
import AdminTempHeader from '/imports/admin/components/AdminTempHeader.jsx';

export const CompanySettingLayout = ({content})=>(

	<div>
		<div className="main-layout col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLR">
			<AdminTempHeader />
			{content}
			<CompanySettingIndicators />
		</div>
	</div>
);