import React from 'react';
import { LoadingSection } from '../../../displayComponents';
import CompanySettingsPage from '../../company/settings/CompanySettingsPage';
import withTranslations from '../../../HOCs/withTranslations';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { company } from '../../../queries';
import { bHistory } from '../../../containers/App';

const CompanyEditPage = ({ data, match, translate }) => {

    if(data.loading){
        return <LoadingSection />
    }

    if(!data.company){
        bHistory.replace('/companies');
    }

    return(
        <div style={{height: 'calc(100% - 3em)'}}>
            <CompanySettingsPage
                key={`company_${company.id}`}
                company={data.company}
                translate={translate}
                confirmCompany={true}
                root={true}
                refetch={data.refetch}
            />
        </div>
    )
}

export default graphql(company, {
    options: props => ({
        variables: {
            id: props.match.params.id
        },
        notifyOnNetworkStatusChange: true,
        fetchPolicy: 'network-only'
    })
})(withRouter(withTranslations()(CompanyEditPage)));