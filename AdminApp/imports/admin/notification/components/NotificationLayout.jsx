import React from 'react';
import AdminTempHeader from '../../dashboard/components/AdminTempHeader.jsx';
import Adminfooter from '../../dashboard/components/Adminfooter.jsx';

export const NotificationLayout = ({content})=>(

	<div>
		<div className="main-layout col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLR">
			<AdminTempHeader />
			{content}
			<Adminfooter />
		</div>
	</div>
);