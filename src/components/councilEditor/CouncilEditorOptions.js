import React, { Component, Fragment } from 'react';
import { MenuItem } from 'material-ui';
import { BasicButton, TextInput, LoadingSection, SelectInput, Radio, Checkbox, Icon } from '../displayComponents';
import { councilStepFive, updateCouncil } from '../../queries';
import { graphql, compose } from 'react-apollo';
import { getPrimary } from '../../styles/colors';

let primary = getPrimary();

class CouncilEditorOptions extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: '',
            errors: {
                confirmAssistance: '',
                actPointMajorityDivider: ''
            }
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    componentWillReceiveProps(nextProps){
        primary = getPrimary();
        if(this.props.data.loading && !nextProps.loading){
            this.setState({
                data: {
                    council: nextProps.data.council
                }
            });
        }
    }


    updateCouncil = () => {
        const { __typename, statute, platform, ...council } = this.state.data.council;
        this.props.updateCouncil({
            variables: {
                council: {
                    ...council,
                    step: this.props.actualStep >= 5? this.props.actualStep : 5
                }
            }
        })
    }

    nextPage = () => {
        if(true){
            this.updateCouncil();
            this.props.nextStep();
        }
    }

    previousPage = () => {
        if(true){
            this.updateCouncil();
            this.props.previousStep();
        }
    }
    
    _renderNumberInput(){
        return(
            <Fragment>
                <TextInput
                    type={"number"}
                    errorText={this.state.errors.actPointMajority}
                    value={this.state.data.council.actPointMajority}
                    onChange={(event) => this.setState({
                        ...this.state,
                        data: {
                            ...this.state.data,
                            council: {
                                ...this.state.data.council,
                                actPointMajority: event.nativeEvent.target.value
                            }
                        }
                    })}
                />
                {this.state.data.council.actPointMajorityType === 0 &&
                    <span style={{color: 'white', padding: '0.5em', backgroundColor: primary, marginRight: '1em'}}>%</span>
                }
                {this.state.data.council.actPointMajorityType === 5 &&
                    <Fragment>
                        <span style={{color: 'white', padding: '0.5em', backgroundColor: primary, marginRight: '1em'}}>/</span>
                        <TextInput
                            type={"number"}
                            errorText={this.state.errors.act_point_majority_divider}
                            value={this.state.data.council.actPointMajorityDivider}
                            onChange={(event) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    council : {
                                        ...this.state.data.council,
                                        actPointMajorityDivider: event.nativeEvent.target.value
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
        const { council } = this.state.data;
        if(this.props.data.loading || !this.state.data){
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
                    icon={<Icon className="material-icons" style={{color: 'white'}}>save</Icon>}
                    textPosition="after"
                    onClick={this.updateCouncil} 
                />

                <BasicButton
                    text={translate.previous}
                    color={primary}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    textPosition="after"
                    onClick={this.previousPage}
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
                    value={council.confirmAssistance === 1? true : false}
                    onChange={(event, isInputChecked) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council: {
                                    ...council,
                                    confirmAssistance: isInputChecked? 1 : 0
                                }
                            }
                            
                        })
                    }
                />
               <div>{translate.video}</div>
                <Checkbox
                    label={translate.room_video_broadcast}
                    value={council.councilType === 0? true : false}
                    onChange={(event, isInputChecked) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council: {
                                    ...council,
                                    councilType: isInputChecked? 0 : 1,
                                    fullVideoRecord: 0
                                }
                            }
                            
                        })
                    }
                />
                {council.councilType === 0 ?
                    <Checkbox
                        label={translate.full_video_record}
                        value={council.fullVideoRecord === 0? false : true}
                        onChange={(event, isInputChecked) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    council: {
                                        ...council,
                                        fullVideoRecord: isInputChecked? 1 : 0
                                    }
                                }
                            
                            })
                        }
                    /> 
                :
                    <Checkbox
                        label={translate.auto_close}
                        value={council.autoClose === 0? false : true}
                        onChange={(event, isInputChecked) => this.setState({
                                ...this.state,
                                data: {
                                    ...this.state.data,
                                    council: {
                                        ...council,
                                        autoClose: isInputChecked? 1 : 0
                                    }
                                }
                            
                            })
                        }
                    />
                }
                
                <div>{translate.security}</div>
                <Radio
                    value={'0'}
                    checked={council.securityType === 0}
                    onChange={(event, value) => this.setState({
                        data: {
                            ...this.state.data,
                            council: {
                                ...council,
                                securityType: parseInt(event.target.value, 10)
                            }
                        }
                    })}
                    name="security"
                    label={translate.new_security_none}
                />
                <Radio
                    value={'1'}
                    checked={council.securityType === 1}
                    onChange={(event, value) => this.setState({
                        data: {
                            ...this.state.data,
                            council: {
                                ...council,
                                securityType: parseInt(event.target.value, 10)
                            }
                        }
                    })}
                    name="security"
                    label={translate.new_security_email}
                />
                <Radio
                    value={'2'}
                    checked={council.securityType === 2}
                    onChange={(event) => this.setState({
                        data: {
                            ...this.state.data,
                            council: {
                                ...council,
                                securityType: parseInt(event.target.value, 10)
                            }
                        }
                    })}
                    name="security"
                    label={translate.new_security_sms}
                />
                <h5>{translate.approve_act_draft_at_end}</h5>
                <Checkbox
                    label={translate.approve_act_draft_at_end_desc}
                    value={council.approveActDraft === 0? false : true}
                    onChange={(event, isInputChecked) => this.setState({
                            ...this.state,
                            data: {
                                ...this.state.data,
                                council: {
                                    ...council,
                                    approveActDraft: isInputChecked? 1 : 0
                                }
                            }

                        })
                    }
                />
                {council.approveActDraft === 1 &&
                    <Fragment>
                        <SelectInput
                            floatingLabelText={translate.majority_label}
                            value={council.actPointMajorityType}
                            onChange={(event, index) => {
                                this.setState({
                                    ...this.state,
                                    data: {
                                        ...this.state.data,
                                        council: {
                                            ...council,
                                            actPointMajorityType: event.target.value
                                        }
                                    }
                                    
                                })}
                            }
                        >
                            {this.props.data.majorityTypes.map((majority) => {
                                return(
                                    <MenuItem value={majority.value} key={`majority${majority.value}`}>{translate[majority.label]}</MenuItem>
                                );
                            })}
                        </SelectInput>
                        {council.actPointMajorityType === 0 &&
                            this._renderNumberInput()
                        }
                        {council.actPointMajorityType === 5 &&
                            this._renderNumberInput()
                        }
                        {council.actPointMajorityType === 6 &&
                            this._renderNumberInput()
                        }
                    </Fragment>
                }

            </div>
        );
    }
}

export default compose(
    graphql(councilStepFive, {
        name: "data",
        options: (props) => ({
            variables: {
                id: props.councilID
            }
        })
    }),

    graphql(updateCouncil, {
        name: 'updateCouncil'
    })
)(CouncilEditorOptions);
