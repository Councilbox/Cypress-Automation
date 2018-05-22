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
                key: '',
                cif: ''
            },
            errors: {},
            success: false,
            request: false,
            requestError: false
        }
    }

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data,
                ...object
            }
        });
    }


    render(){
        const { translate } = this.props;
        const { data, errors, requestError, success, request } = this.state;
        const primary = getPrimary();
        const secondary = getSecondary();

        return(
            <CardPageLayout title={translate.companies_link}>
                <Grid>
                    <GridItem xs={12} md={12} lg={12}>
                        <TextInput
                            floatingText={translate.company_new_cif}
                            type="text"
                            value={data.cif}
                            errorText={errors.cif}
                            onChange={(event) => this.updateState({
                                cif: event.target.value
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} md={12} lg={12}>
                        <div style={{width: '300px', margin: 'auto'}}>
                            <TextInput
                                floatingText={translate.company_new_key}
                                type="text"
                                value={data.linkKey}
                                errorText={errors.linkKey}
                                onChange={(event) => this.updateState({
                                    linkKey: event.target.value
                                })}
                            />
                        </div>
                    </GridItem>
                </Grid>
                <BasicButton
                    text={translate.link}
                    color={getPrimary()}
                    error={requestError}
                    success={success}
                    loading={request}
                    floatRight
                    textStyle={{
                        color: 'white',
                        fontWeight: '700'
                    }}
                    onClick={this.linkCompanyToUser}
                    icon={<ButtonIcon type="add" color='white'/>}
                />
            </CardPageLayout>
        )
    }
}


export default withSharedProps()(withApollo(LinkCompanyPage));