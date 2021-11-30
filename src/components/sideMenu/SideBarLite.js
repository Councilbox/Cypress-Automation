import React from 'react';
import CompanySideBar from './CompanySideBar';
import OrganizationSideBar from './OrganizationSideBar';
import { ConfigContext } from '../../containers/AppControl';
import { showOrganizationDashboard } from '../../utils/CBX';

const SideBarLite = props => {
	const config = React.useContext(ConfigContext);

	if (showOrganizationDashboard(props.company, config, props.user) && (!config.oneOnOneDashboard || props.company.id === props.company.corporationId)) {
		return <OrganizationSideBar {...props} />;
	}

	return (
		<CompanySideBar {...props} />
	);
};

export default SideBarLite;
