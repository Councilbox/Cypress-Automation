import React, { Component, Fragment } from 'react';
import { MenuItem } from 'material-ui';
import { BasicButton, TextInput, MajorityInput, LoadingSection, SelectInput, Radio, Checkbox, ButtonIcon } from '../displayComponents';
import { councilStepFive, updateCouncil } from '../../queries';
import { graphql, compose } from 'react-apollo';
import { getPrimary, getSecondary } from '../../styles/colors';
import { Typography } from 'material-ui';
import * as CBX from '../../utils/CBX';

let primary = getPrimary();

class CouncilEditorOptions extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: '',
            errors: {
                confirmAssistance: '',
                actPointMajorityDivider: -1
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

    updateCouncilData(data){
        this.setState({
            ...this.state,
            data: {
                council: {
                    ...this.state.data.council,
                    ...data
                }
            }
        });
    }


    updateCouncil = (step) => {
        const { __typename, statute, platform, ...council } = this.state.data.council;
        this.props.updateCouncil({
            variables: {
                council: {
                    ...council,
                    step: step
                }
            }
        })
    }

    nextPage = () => {
        if(true){
            this.updateCouncil(6);
            this.props.nextStep();
        }
    }

    previousPage = () => {
        if(true){
            this.updateCouncil(5);
            this.props.previousStep();
        }
    }
    
    _renderNumberInput(){
        const { council } = this.state.data;
        return(
            <div className="row">
                <div style={{width: '3em'}}>
                    <TextInput
                        type={"number"}
                        errorText={this.state.errors.actPointMajority}
                        value={council.actPointMajority}
                        onChange={(event) => this.updateCouncilData({
                            actPointMajority: event.nativeEvent.target.value
                        })}
                    />
                </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    {council.actPointMajorityType === 0 &&
                        <span style={{color: 'white', padding: '0.5em', backgroundColor: primary, marginRight: '1em'}}>%</span>
                    }
                    {council.actPointMajorityType === 5 &&
                        <span style={{color: 'white', padding: '0.5em', backgroundColor: primary, marginRight: '1em'}}>/</span>
                    }
                </div>
                <div style={{width: '3em'}}>
                    {council.actPointMajorityType === 5 &&
                        <TextInput
                            type={"number"}
                            errorText={this.state.errors.act_point_majority_divider}
                            value={council.actPointMajorityDivider}
                            onChange={(event) => this.updateCouncilData({
                                actPointMajorityDivider: event.nativeEvent.target.value
                            })}
                        />
                    }
                </div>
            </div>
        );
    }

    _renderSecurityForm(){
        const { council } = this.state.data;
        const { translate } = this.props;

        return(
            <Fragment>
                <Radio
                    value={'0'}
                    checked={council.securityType === 0}
                    onChange={(event, value) => this.updateCouncilData({
                        securityType: parseInt(event.target.value, 10)
                    })}
                    name="security"
                    label={translate.new_security_none}
                />
                <Radio
                    value={'1'}
                    checked={council.securityType === 1}
                    onChange={(event, value) => this.updateCouncilData({
                        securityType: parseInt(event.target.value, 10)
                    })}
                    name="security"
                    label={translate.new_security_email}
                />
                <Radio
                    value={'2'}
                    checked={council.securityType === 2}
                    onChange={(event) => this.updateCouncilData({
                        securityType: parseInt(event.target.value, 10)
                    })}
                    name="security"
                    label={translate.new_security_sms}
                />
                <br/>
                {CBX.showUserUniqueKeyMessage(council) &&
                    <Typography>
                        {translate.key_autogenerated_by_participant}
                    </Typography>
                }

            </Fragment>
        )
    }

    render(){
        const { translate } = this.props;
        const { council } = this.state.data;

        if(this.props.data.loading || !this.state.data){
            return(
                <LoadingSection />
            );
        }
        const { statute } = this.props.data.council;
        

        return(
            <div style={{width: '100%', height: '100%', padding: '2em'}}>
                <Typography variant="title">
                    {translate.new_options}
                </Typography>

                <Typography variant="subheading" style={{marginTop: '2em'}}>
                    {translate.confirm_assistance}
                </Typography>
                <Checkbox
                    label={translate.confirm_assistance_desc}
                    value={council.confirmAssistance === 1? true : false}
                    onChange={(event, isInputChecked) => this.updateCouncilData({
                            confirmAssistance: isInputChecked? 1 : 0
                        })
                    }
                />

                <Typography variant="subheading" style={{marginTop: '2em'}}>
                    {translate.video}
                </Typography>
                <Checkbox
                    label={translate.room_video_broadcast}
                    value={council.councilType === 0? true : false}
                    onChange={(event, isInputChecked) => this.updateCouncilData({
                            councilType: isInputChecked? 0 : 1,
                            fullVideoRecord: 0  
                        })
                    }
                />
                {council.councilType === 0 ?
                    <Checkbox
                        label={translate.full_video_record}
                        value={council.fullVideoRecord === 0? false : true}
                        onChange={(event, isInputChecked) => this.updateCouncilData({
                                fullVideoRecord: isInputChecked? 1 : 0
                            })
                        }
                    /> 
                :
                    <Checkbox
                        label={translate.auto_close}
                        value={council.autoClose === 0? false : true}
                        onChange={(event, isInputChecked) => this.updateCouncilData({
                                autoClose: isInputChecked? 1 : 0
                            })
                        }
                    />
                }
                
                <Typography variant="subheading" style={{marginTop: '2em'}}>
                    {translate.security}
                </Typography>
                {this._renderSecurityForm()}


                {CBX.hasAct(statute) &&
                    <Fragment>
                        <Typography variant="subheading" style={{marginTop: '2em'}}>
                            {translate.approve_act_draft_at_end}
                        </Typography>
                        <Checkbox
                            label={translate.approve_act_draft_at_end_desc}
                            value={council.approveActDraft === 0? false : true}
                            onChange={(event, isInputChecked) => this.updateCouncilData({
                                    approveActDraft: isInputChecked? 1 : 0
                                })
                            }
                        />
                        {council.approveActDraft === 1 &&
                            <div className="row">
                                <div className="col-lg-3 col-md-3 col-xs-4">
                                    <SelectInput
                                        floatingLabelText={translate.majority_label}
                                        value={council.actPointMajorityType}
                                        onChange={(event, index) => {
                                            this.updateCouncilData({
                                                actPointMajorityType: event.target.value
                                            })}
                                        }
                                    >
                                        {this.props.data.majorityTypes.map((majority) => {
                                            return(
                                                <MenuItem value={majority.value} key={`majority${majority.value}`}>{translate[majority.label]}</MenuItem>
                                            );
                                        })}
                                    </SelectInput>
                                </div>
                                <div className="col-lg-8 col-md-8 col-xs-8">
                                    {CBX.majorityNeedsInput(council.actPointMajorityType) &&
                                        <MajorityInput
                                            type={council.actPointMajorityType}
                                            style={{marginLeft: '1em'}}
                                            value={council.actPointMajority}
                                            divider={council.actPointMajorityDivider}
                                            onChange={(value) => this.updateCouncilData({
                                                actPointMajority: +value
                                            })}
                                            onChangeDivider={(value) => this.updateCouncilData({
                                                actPointMajorityDivider: +value
                                            })}
                                        />

                                    }
                                </div>
                            </div>
                        }
                    </Fragment>
                }
                
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-xs-12">
                        <div style={{float: 'right'}}>
                            <BasicButton
                                text={translate.previous}
                                color={getSecondary()}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                textPosition="after"
                                onClick={this.previousPage}
                            />
                            <BasicButton
                                text={translate.save}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', marginLeft: '0.5em', marginRight: '0.5em', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<ButtonIcon type="save" color='white' />}
                                textPosition="after"
                                onClick={() => this.updateCouncil(5)} 
                            />
                            <BasicButton
                                text={translate.next}
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                textPosition="after"
                                onClick={this.nextPage}
                            />
                        </div>
                    </div>
                </div>
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
            },
            notifyOnNetworkStatusChange: true
        })
    }),

    graphql(updateCouncil, {
        name: 'updateCouncil'
    })
)(CouncilEditorOptions);
