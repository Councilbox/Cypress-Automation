import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import withSharedProps from '../../../HOCs/withSharedProps';
import { BasicButton, ButtonIcon, CardPageLayout, Grid, GridItem, TextInput } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import gql from 'graphql-tag';
import { bHistory, store } from '../../../containers/App';
import { getCompanies } from '../../../actions/companyActions';
import { toast } from 'react-toastify';

class LinkCompanyPage extends React.Component {

    updateState = (object) => {
        this.setState({
            data: {
                ...this.state.data, ...object
            }
        });
    }
    checkRequiredFields = () => {
        let hasError = false;
        let errors = {
            cif: '',
            linkKey: ''
        }

        if (!this.state.data.cif) {
            hasError = true;
            errors.cif = this.props.translate.required_field;
        }

        if (!this.state.data.linkKey) {
            hasError = true;
            errors.linkKey = this.props.translate.required_field;
        }

        this.setState({
            errors
        });

        return hasError;
    }
    linkCompany = async () => {
        if (!this.checkRequiredFields()) {
            const response = await this.props.linkCompany({
                variables: {
                    userId: this.props.user.id,
                    companyTin: this.state.data.cif,
                    linkKey: this.state.data.linkKey
                }
            });

            if (response.errors) {
                if (response.errors[ 0 ].message === 'Tin-noExists') {
                    this.setState({
                        errors: {
                            cif: 'COMPAÑIA NO EXISTE'
                        }
                    });
                    return;
                }
            }

            if (response.data.linkCompany.success) {
                toast.success(this.props.translate.company_link_success_title);
                store.dispatch(getCompanies(this.props.user.id));
                bHistory.push('/');
            } else {
                switch (response.data.linkCompany.message) {
                    case 'Wrong linkKey':
                        this.setState({
                            errors: {
                                linkKey: 'CLAVE MAESTRA INCORRECTA'
                            }
                        })
                        break;
                    case 'Already Linked':
                        this.setState({
                            errors: {
                                cif: 'ESTA COMPAÑIA YA ESTÁ VINCULADA A TU CUENTA'
                            }
                        })
                        break;
                }
            }

        }
    }

    constructor(props) {
        super(props);
        this.state = {
            data: {
                linkKey: '',
                cif: ''
            },
            showPassword: false,
            errors: {},
            success: false,
            request: false,
            requestError: false
        }
    }

    render() {
        const { translate } = this.props;
        const { data, errors, requestError, success, request } = this.state;
        const primary = getPrimary();
        const secondary = getSecondary();

        return (<CardPageLayout title={translate.companies_link}>
            <Grid style={{ marginTop: '4em' }}>
                <GridItem xs={12} md={12} lg={12}>
                    <div style={{
                        width: '400px',
                        margin: 'auto'
                    }}>
                        <TextInput
                            floatingText={translate.company_new_cif}
                            type="text"
                            required
                            value={data.cif}
                            errorText={errors.cif}
                            onChange={(event) => this.updateState({
                                cif: event.target.value
                            })}
                        />
                    </div>
                </GridItem>
                <GridItem xs={12} md={12} lg={12}>
                    <div style={{
                        width: '400px',
                        margin: 'auto'
                    }}>
                        <TextInput
                            floatingText={translate.company_new_key}
                            type={this.state.showPassword ? 'text' : 'password'}
                            passwordToggler={() => this.setState({ showPassword: !this.state.showPassword })}
                            showPassword={this.state.showPassword}
                            required
                            value={data.linkKey}
                            errorText={errors.linkKey}
                            onChange={(event) => this.updateState({
                                linkKey: event.target.value
                            })}
                        /><br/>
                        <BasicButton
                            text={translate.link}
                            color={getPrimary()}
                            error={requestError}
                            success={success}
                            loading={request}
                            floatRight
                            buttonStyle={{
                                marginTop: '1.5em'
                            }}
                            textStyle={{
                                color: 'white',
                                fontWeight: '700'
                            }}
                            onClick={this.linkCompany}
                            icon={<ButtonIcon type="link" color='white'/>}
                        />
                    </div>
                </GridItem>
            </Grid>
        </CardPageLayout>)
    }
}

const linkCompany = gql`
    mutation linkCompany($userId: Int!, $companyTin: String!, $linkKey: String!){
        linkCompany(userId: $userId, companyTin: $companyTin, linkKey: $linkKey){
            success
            message
        }
    }
`;


export default graphql(linkCompany, {
    name: 'linkCompany',
    options: {
        errorPolicy: 'all'
    }
})(withSharedProps()(withApollo(LinkCompanyPage)));