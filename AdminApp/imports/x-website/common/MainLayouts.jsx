import React from 'react';
import MenuBarContainer from './SpotylHeader.jsx';
import RRNProfileMenu from './RRNProfileMenu.jsx';

export const MainLayouts = ({content})=>(
	<div>
		<div className="main-layout col-lg-12 col-md-12 col-sm-12 col-xs-12 noPadLR">
			<MenuBarContainer />
			{content}
			<RRNProfileMenu />
		</div>
	</div>
); 