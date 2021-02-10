import React from 'react';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { LoadingSection } from '../../../displayComponents';
import CompanySettingsPage from '../../company/settings/CompanySettingsPage';
import withSharedProps from '../../../HOCs/withSharedProps';
import { company as queryCompany } from '../../../queries';
import { bHistory } from '../../../containers/App';

const CompanyEditPage = ({
 data, user, company, translate
}) => {
    if (data.loading) {
        return <LoadingSection />;
    }

    if (!data.company) {
        bHistory.replace('/companies');
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <CompanySettingsPage
                key={`company_${company.id}`}
                company={data.company}
                translate={translate}
                confirmCompany={user.roles === 'root'}
                organization={company.id !== data.company.id && company.id === data.company.corporationId}
                root={user.roles === 'root'}
                refetch={data.refetch}
            />
        </div>
    );
};

export default graphql(queryCompany, {
    options: props => ({
        variables: {
            id: +props.match.params.id
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only'
    })
})(withRouter(withSharedProps()(CompanyEditPage)));
