import React from 'react';
import CompanySideBar from './CompanySideBar';
import OrganizationSideBar from './OrganizationSideBar';
import { ConfigContext } from '../../containers/AppControl';
import { showOrganizationDashboard } from '../../utils/CBX';

const SideBarLite = ({ company, user, ...props }) => {
	const config = React.useContext(ConfigContext);

	if(showOrganizationDashboard(company, config, user)){
		return <OrganizationSideBar {...props} company={company} />
	}

	return (
		<CompanySideBar {...props} company={company} />
	)
}

export default SideBarLite;