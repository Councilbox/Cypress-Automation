import React, { Component, Fragment} from 'react';
import { TextInput, SelectInput, RichTextInput, LoadingSection, MajorityInput, BasicButton, ButtonIcon, CardPageLayout, Grid, GridItem } from '../displayComponents';
import { MenuItem } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import { createCompanyDraft, draftData } from '../../queries';
import { getPrimary } from "../../styles/colors";
import { hasVotation, majorityNeedsInput, isMajorityFraction } from '../../utils/CBX';
import CompanyDraftForm from './CompanyDraftForm';

class CompanyDraftNew extends Component {

    constructor(props){
        super(props);
        this.state = {
            draft: {
                title: '',
                statuteId: -1,
                type: -1,
                description: '',
                text: '',
                votationType: -1,
                majorityType: -1,
                majority: null,
                majorityDivider: null,
                companyId: this.props.company.id
            },

            errors: {}
        }
    }

    updateState = (object) => {
        this.setState({
            draft: {
                ...this.state.draft,
                ...object
            }
        });
    }

    createCompanyDraft = async () => {
        if(!this.checkRequiredFields()){
            this.setState({loading: true})
            const response = await this.props.createCompanyDraft({
                variables: {
                    draft: this.state.draft
                }
            });
    
            if(!response.errors){
                this.setState({success: true});
                this.timeout = setTimeout(() => this.resetAndClose(), 2000);
            }
        }
    }

    resetAndClose = () => {
        clearTimeout(this.timeout);
        this.setState({
            errors: {},
            draft: {
                title: '',
                statuteId: -1,
                type: -1,
                description: '',
                text: '',
                votationType: -1,
                majorityType: -1,
                majority: null,
                majorityDivider: null,
                companyId: this.props.company.id
            },
            loading: false,
            success: false
        });
        this.props.closeForm();
    }

    checkRequiredFields(){
        const { translate } = this.props;
        const { draft } = this.state;
        let errors = {
            title: '',
            description: '',
            text: '',
            statuteId: '',
            type: '',
            votingType: '',
            majority: '',
            majorityDivider: '',
            majorityType: ''
        }
        let hasError = false;

        if(!draft.title){
            hasError = true;
            errors.title = translate.required_field;
        }

        if(!draft.description){
            hasError = true;
            errors.description = translate.required_field;
        }

        if(!draft.text){
            hasError = true;
            errors.text = translate.required_field;
        }

        if(draft.type === -1){
            hasError = true;
            errors.type = translate.required_field;
        }

        if(draft.statuteId === -1){
            hasError = true;
            errors.statuteId = translate.required_field;
        }

        if(draft.type === 1 && draft.votationType === -1){
            hasError = true;
            errors.votationType = translate.required_field;
        }

        if(hasVotation(draft.votationType) && draft.majorityType === -1){
            hasError = true;
            errors.majorityType = translate.required_field;
        }

        if(majorityNeedsInput(draft.majorityType) && !draft.majority){
            hasError = true;
            errors.majority = translate.required_field;
        }

        if(isMajorityFraction(draft.majorityType) && !draft.majorityDivider){
            hasError = true;
            errors.majorityDivider = translate.required_field;
        }

        this.setState({
            errors
        });

        return hasError;

    }


    render(){
        const { translate, closeForm } = this.props;
        const { draft, errors } = this.state;
        const { loading } = this.props.data;

        if(loading){
            return(
                <LoadingSection />
            )
        }

        return(
            <CardPageLayout title={translate.drafts_new}>
                <BasicButton
                    text={translate.back}
                    color={getPrimary()}
                    textStyle={{color: 'white', fontWeight: '700'}}
                    onClick={() => closeForm()}
                    icon={<ButtonIcon type="keyboard_arrow_left" color='white' />}
                />
                <BasicButton
                    text={translate.save}
                    color={getPrimary()}
                    loading={this.state.loading}
                    success={this.state.success}
                    textStyle={{color: 'white', fontWeight: '700'}}
                    onClick={() => this.createCompanyDraft()}
                    icon={<ButtonIcon type="save" color='white' />}
                />

                <div style={{marginTop: '1.8em'}}>
                    <CompanyDraftForm
                        draft={draft}
                        errors={errors}
                        translate={translate}
                        companyStatutes={this.props.data.companyStatutes}
                        updateState={this.updateState}
                        draftTypes={this.props.data.draftTypes}
                        votingTypes={this.props.data.votingTypes}
                        majorityTypes={this.props.data.majorityTypes}
                    />
                </div>
            </CardPageLayout>
        )
    }
}

export default compose(
    graphql(createCompanyDraft, {
        name: 'createCompanyDraft', 
        options: {
            errorPolicy: 'all'
        }
    }),
    graphql(draftData, {
        options: props => ({
            variables: {
                companyId: props.company.id
            }
        })
    })
)(CompanyDraftNew);