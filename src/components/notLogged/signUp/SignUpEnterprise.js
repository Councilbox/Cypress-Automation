import React, { Component } from 'react';
import {
    BasicButton,
    ButtonIcon,
    LoadingSection,
    SelectInput,
    TextInput,
    Grid,
    GridItem
} from '../../../displayComponents';
import { MenuItem } from 'material-ui/Menu';
import { graphql } from 'react-apollo';
import { getPrimary } from '../../../styles/colors';
import { companyTypes } from '../../../queries/masters';
import { withApollo } from "react-apollo/index";
import { checkCifExists } from '../../../queries/userAndCompanySignUp';

class SignUpEnterprise extends Component {

     nextPage = async () => {
        let isSuccess = await this.checkRequiredFields();
        if (!isSuccess) {
            this.props.nextPage();
        }
    };

    async checkRequiredFields() {
        const { translate } = this.props;

        const data = this.props.formData;
        let errors = {
            businessName: '',
            type: '',
            cif: ''
        };
        let hasError = false;

        if (!data.businessName.length > 0) {
            hasError = true;
            errors.businessName = translate.field_required
        }

        if (data.type === '') {
            hasError = true;
            errors.type = translate.field_required
        }
        let existsCif = await this.checkCifExists();

        if (!data.cif.length > 0 || existsCif) {
            hasError = true;
            errors.cif = existsCif ? translate.vat_previosly_save : translate.field_required
        }

        this.props.updateErrors(errors);

        return hasError;
    }

    async checkCifExists() {
        const response = await this.props.client.query({
            query: checkCifExists,
            variables: { cif: this.props.formData.cif }
        });

        return response.data.checkCifExists.success;
    }

    handleTypeChange = (event) => {
        this.props.updateState({
            type: event.target.value
        });
    };

    render() {
        if (this.props.data.loading) {
            return (<LoadingSection/>);
        }
        const { translate } = this.props;
        const primary = getPrimary();

        return (<div style={{
            width: '100%',
            padding: '6%',
            height: '100%'
        }}>
                <span style={{
                    fontSize: '1.3em',
                    fontWeight: '700',
                    color: primary
                }}>{translate.company_data}</span>
            <Grid style={{ marginTop: '2em' }}>
                <GridItem xs={12} md={12} lg={12}>
                    <TextInput
                        floatingText={translate.entity_name}
                        type="text"
                        value={this.props.formData.businessName}
                        onChange={(event) => this.props.updateState({
                            businessName: event.nativeEvent.target.value
                        })}
                        errorText={this.props.errors.businessName}
                        required/>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <SelectInput
                        floatingText={translate.company_type}
                        value={this.props.formData.type}
                        onChange={this.handleTypeChange}
                        errorText={this.props.errors.type}
                        required>
                        {this.props.data.companyTypes.map((type) => {
                            return <MenuItem key={type.label}
                                             value={type.value}>{translate[ type.label ]}</MenuItem>
                        })}
                    </SelectInput>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <TextInput
                        floatingText={translate.cif}
                        type="text"
                        value={this.props.formData.cif}
                        onChange={(event) => this.props.updateState({
                            cif: event.target.value
                        })}
                        errorText={this.props.errors.cif}
                        required/>
                </GridItem>
                <GridItem xs={12} md={6} lg={6}> </GridItem>
                <GridItem xs={12} md={6} lg={6}>
                    <BasicButton
                        text={translate.continue}
                        color={primary}
                        textStyle={{
                            color: 'white',
                            fontWeight: '700'
                        }}
                        onClick={this.nextPage}
                        fullWidth
                        icon={<ButtonIcon color='white' type="arrow_forward"/>}
                    />
                </GridItem>
            </Grid>
        </div>);
    }
}

export default graphql(companyTypes)(withApollo(SignUpEnterprise));