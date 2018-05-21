import React from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import withSharedProps from '../../../HOCs/withSharedProps';
import { CardPageLayout, Grid, GridItem, LoadingSection, TextInput, SelectInput, BasicButton, ButtonIcon, FileUploadButton } from '../../../displayComponents';
import { Typography, MenuItem } from 'material-ui'; 
import { getPrimary, getSecondary } from '../../../styles/colors';
import { provinces } from '../../../queries/masters';
import gql from 'graphql-tag';
import { store, bHistory } from '../../../containers/App';
import { getCompanies } from '../../../actions/companyActions';
import { toast } from 'react-toastify';

class LinkCompanyPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data: {
                'key': ''
            },
            errors: {},
            success: false,
            request: false,
            requestError: false
        }
    }


    render(){
        const { translate } = this.props;
        const { data, errors, requestError, success, request } = this.state;
        const primary = getPrimary();
        const secondary = getSecondary();

        return(
            <CardPageLayout title={translate.companies_link}>
                
            </CardPageLayout>
        )
    }
}


export default withSharedProps()(withApollo(LinkCompanyPage));