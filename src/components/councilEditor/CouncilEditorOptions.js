import React, { Component, Fragment } from 'react';
import {TextField, FontIcon, SelectField, MenuItem, Checkbox } from 'material-ui';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { BasicButton, TextInput, LoadingSection } from '../displayComponents';
import CouncilboxApi from '../../api/CouncilboxApi';
import { getCouncilDataStepFive, majorities, saveCouncilData } from '../../queries';
import { graphql, compose } from 'react-apollo';
import { urlParser } from '../../utils';
import { primary } from '../../styles/colors';

class CouncilEditorOptions extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: '',
            errors: {
                confirm_assistance: '',
                act_point_majority_divider: ''
            }
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    componentWillReceiveProps(nextProps){
        if(this.props.data.loading && !nextProps.loading){
            this.setState({
                data: nextProps.data.council
            });
        }
    }


    saveDraft = () => {
        this.props.saveCouncil({
            variables: {
                data: urlParser({
                    data: this.state.data
                })
            }
        })
    }

    nextPage = () => {
        if(true){
            this.saveDraft();
            this.props.nextStep();
        }
    }
    
    _renderNumberInput(){
        return(
            <Fragment>
                <TextInput
                    type={"number"}
                    errorText={this.state.errors.act_point_majority}
                    value={this.state.data.council.act_point_majority}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            council: {
                                ...this.state.data.council,
                                act_point_majority: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                {this.state.data.council.act_point_majority_type === 0 &&
                    <span style={{color: 'white', padding: '0.5em', backgroundColor: primary, marginRight: '1em'}}>%</span>
                }
                {this.state.data.council.act_point_majority_type === 5 &&
                    <Fragment>
                        <span style={{color: 'white', padding: '0.5em', backgroundColor: primary, marginRight: '1em'}}>/</span>
                        <TextInput
                            type={"number"}
                            errorText={this.state.errors.act_point_majority_divider}
                            value={this.state.data.council.act_point_majority_divider}
                            onChange={(event) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    council : {
                                        ...this.state.data.council,
                                        act_point_majority_divider: event.nativeEvent.target.value
                                    }
                                }
                                
                            })}
                        />
                    </Fragment>
                }
            </Fragment>
        );
    }

    render(){
        const { translate } = this.props;
        if(this.props.data.loading || this.props.types.loading || !this.state.data){
            return(
                <LoadingSection />
            );
        }

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                {translate.new_options}
                <BasicButton
                    text={translate.save}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">save</FontIcon>}
                    textPosition="after"
                    onClick={this.saveDraft} 
                />

                <BasicButton
                    text={translate.previous}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.props.previousStep}
                />
                <BasicButton
                    text={translate.next}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.nextPage}
                />
                <div>{translate.confirm_assistance}</div>
                <Checkbox
                    label={translate.confirm_assistance_desc}
                    checked={this.state.data.council.confirm_assistance === 1? true : false}
                    onCheck={(event, isInputChecked) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council: {
                                    ...this.state.data.council,
                                    confirm_assistance: isInputChecked? 1 : 0
                                }
                            }
                            
                        })
                    }
                />
               <div>{translate.video}</div>
                <Checkbox
                    label={translate.room_video_broadcast}
                    checked={this.state.data.council.council_type === 0? true : false}
                    onCheck={(event, isInputChecked) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council: {
                                    ...this.state.data.council,
                                    council_type: isInputChecked? 0 : 1
                                }
                            }
                            
                        })
                    }
                />
                <Checkbox
                    label={translate.full_video_record}
                    checked={this.state.data.council.full_video_record === 0? false : true}
                    onCheck={(event, isInputChecked) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council: {
                                    ...this.state.data.council,
                                    full_video_record: isInputChecked? 1 : 0
                                }
                            }
                           
                        })
                    }
                />
                <div>{translate.security}</div>
                <RadioButtonGroup 
                    name="security"
                    valueSelected={this.state.data.council.security_type}
                    onChange={(event, value) => this.setState({
                        data: {
                            ...this.state.data,
                            council: {
                                ...this.state.data.council,
                                security_type: value
                            }
                        }
                    })}
                >
                    <RadioButton
                        value={0}
                        label={translate.new_security_none}
                    />
                    <RadioButton
                        value={1}
                        label={translate.new_security_email}
                    />
                    <RadioButton
                        value={2}
                        label={translate.new_security_sms}
                    />
                </RadioButtonGroup>
                <h5>{translate.approve_act_draft_at_end}</h5>
                <Checkbox
                    label={translate.approve_act_draft_at_end_desc}
                    checked={this.state.data.council.approve_act_draft === 0? false : true}
                    onCheck={(event, isInputChecked) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council: {
                                    ...this.state.data.council,
                                    approve_act_draft: isInputChecked? 1 : 0
                                }
                            }

                        })
                    }
                />
                {this.state.data.council.approve_act_draft === 1 &&
                    <Fragment>
                        <SelectField
                            floatingLabelText={translate.majority_label}
                            value={this.state.data.council.act_point_majority_type}
                            onChange={(event, index, value) => {
                                this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        council: {
                                            ...this.state.data.council,
                                            act_point_majority_type: value
                                        }
                                    }
                                    
                                })}
                            }
                        >
                            {this.props.types.majorities.map((majority) => {
                                return(
                                    <MenuItem value={majority.value} key={`majority${majority.value}`}>{translate[majority.label]}</MenuItem>
                                );
                            })

                            }
                        </SelectField>
                        {this.state.data.council.act_point_majority_type === 0 &&
                            this._renderNumberInput()
                        }
                        {this.state.data.council.act_point_majority_type === 5 &&
                            this._renderNumberInput()
                        }
                        {this.state.data.council.act_point_majority_type === 6 &&
                            this._renderNumberInput()
                        }
                    </Fragment>
                }

            </div>
        );
    }
}

export default compose(
    graphql(getCouncilDataStepFive, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 5
                }
            }
        })
    }),

    graphql(saveCouncilData, {
        name: 'saveCouncil'
    }),

    graphql(majorities, {
        name: 'types'
    })
)(CouncilEditorOptions);
