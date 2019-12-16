import React from 'react';
import CompanySideBar from './CompanySideBar';
import OrganizationSideBar from './OrganizationSideBar';

const SideBarLite = ({ company, ...props }) => {

	if(company.id === company.corporationId){
		return <OrganizationSideBar {...props} company={company} />
	}

	return (
		<CompanySideBar {...props} company={company} />
	)
}

export default SideBarLite;