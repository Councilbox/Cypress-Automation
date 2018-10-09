import React from 'react';
import { LoadingSection } from '../../../displayComponents';
import CompanySettingsPage from '../../company/settings/CompanySettingsPage';
import withTranslations from '../../../HOCs/withTranslations';
import { withRouter } from 'react-router-dom';
import { graphql } from 'react-apollo';
import { company } from '../../../queries';

const CompanyEditPage = ({ data, match, translate }) => {

    if(data.loading){
        return <LoadingSection />
    }

    return(
        <div style={{height: 'calc(100% - 3em)'}}>
            <CompanySettingsPage
                key={`company_${company.id}`}
                company={data.company}
                translate={translate}
                confirmCompany={true}
                refetch={data.refetch}
            />
        </div>
    )
}

export default graphql(company, {
    options: props => ({
        variables: {
            id: props.match.params.id
        }
    })
})(withRouter(withTranslations()(CompanyEditPage)));