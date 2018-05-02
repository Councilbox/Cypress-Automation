import React, { Component } from 'react';
import { LoadingSection, BasicButton, ButtonIcon, CardPageLayout } from '../../../displayComponents';
import { graphql, compose } from 'react-apollo';
import { createCompanyDraft, draftData } from '../../../queries';
import { getPrimary } from "../../../styles/colors";
import { checkRequiredFields } from '../../../utils/CBX';
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
    };

    createCompanyDraft = async () => {
        const { translate } = this.props;
        const { draft } = this.state;
        if(!checkRequiredFields(translate, draft, this.setState)){
            this.setState({loading: true});
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
    };

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
    };

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