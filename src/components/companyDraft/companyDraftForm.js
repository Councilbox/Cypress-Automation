import React, { Component, Fragment} from 'react';
import { TextInput, SelectInput, RichTextInput, LoadingSection, MajorityInput, BasicButton, ButtonIcon, CardPageLayout, Grid, GridItem } from '../displayComponents';
import { Typography, MenuItem } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import { createCompanyDraft, draftData } from '../../queries';
import { getPrimary } from "../../styles/colors";
import { hasVotation, majorityNeedsInput, isMajorityFraction } from '../../utils/CBX';

class CompanyDraftForm extends Component {

    constructor(props){
        super(props);
        this.state = {
            draft: {
                title: '',
                statuteId: -1,
                type: -1,
                description: '',
                text: '',
                type: -1,
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
                type: -1,
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
                <Grid>
                    <GridItem xs={12} lg={3} md={3}>
                        <TextInput
                            floatingText={translate.title}
                            type="text"
                            required
                            errorText={errors.title}
                            value={draft.title}
                            onChange={(event) => this.updateState({
                                title: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>
                    <GridItem xs={12} lg={3} md={3}>
                        <SelectInput
                            floatingText={translate.council_type}
                            value={draft.statuteId}
                            errorText={errors.statuteId}
                            onChange={(event) => this.updateState({
                                statuteId: event.target.value
                            })}
                        >
                            {this.props.data.companyStatutes.map((council) => {
                                    return <MenuItem value={council.id} key={`counciltype_${council.id}`}>{translate[council.title] || council.title}</MenuItem>
                                })
                            }
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={12} lg={3} md={3}>
                        <SelectInput
                            floatingText={translate.draft_type}
                            value={draft.type}
                            errorText={errors.type}
                            onChange={(event) => this.updateState({
                                type: event.target.value
                            })}
                        >
                            {this.props.data.draftTypes.map((draft) => {
                                    return <MenuItem value={draft.value} key={`draftType_${draft.id}`}>{translate[draft.label]}</MenuItem>
                                })
                            }
                        </SelectInput>
                    </GridItem>
                    <GridItem xs={12} lg={3} md={3}>
                        {draft.type === 1 &&
                            <SelectInput
                                floatingText={translate.point_type}
                                value={draft.votationType}
                                errorText={errors.votationType}
                                onChange={(event) => this.updateState({
                                    votationType: event.target.value
                                })}
                            >
                                {this.props.data.votingTypes.map((votingType) => {
                                        return <MenuItem value={votingType.value} key={`votingTypeType_${votingType.value}`}>{translate[votingType.label]}</MenuItem>
                                    })
                                }
                            </SelectInput>
                        }
                    </GridItem>
                    <GridItem xs={11} lg={12} md={12}>
                        <TextInput
                            floatingText={translate.description}
                            type="text"
                            errorText={errors.description}
                            required
                            value={draft.description}
                            onChange={(event) => this.updateState({
                                description: event.nativeEvent.target.value
                            })}
                        />
                    </GridItem>
                    {hasVotation(draft.votationType) &&
                        <Fragment>
                            <GridItem xs={6} lg={2} md={2}>
                                    <SelectInput
                                        floatingText={translate.majority_label}
                                        value={draft.majorityType || 1}
                                        errorText={errors.majorityType}
                                        onChange={(event) => this.updateState({
                                            majorityType: event.target.value
                                        })}
                                    >
                                        {this.props.data.majorityTypes.map((majority) => {
                                                return <MenuItem value={majority.value} key={`majorityType_${majority.value}`}>{translate[majority.label]}</MenuItem>
                                            })
                                        }
                                    </SelectInput>
                            </GridItem>
                            <GridItem xs={6} lg={2} md={2}>
                                {majorityNeedsInput(draft.majorityType) &&
                                    <MajorityInput
                                        type={draft.majorityType}
                                        style={{marginLeft: '1em'}}
                                        majorityError={errors.majority}
                                        dividerError={errors.majorityDivider}
                                        onChange={(value) => this.updateState({
                                            majority: +value
                                        })}
                                        onChangeDivider={(value) => this.updateState({
                                            majorityDivider: +value
                                        })}
                                    />
                                }
                            </GridItem>
                        </Fragment>
                    }
                    <GridItem xs={11} lg={12} md={12}>
                        <RichTextInput
                            value={draft.text || ''}
                            errorText={errors.text}
                            onChange={(value) => this.updateState({
                                text: value
                            })}
                        />
                    </GridItem>
                </Grid>
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
)(CompanyDraftForm);