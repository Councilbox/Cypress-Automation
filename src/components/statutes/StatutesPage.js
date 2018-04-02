import React, { Component, Fragment } from 'react';
import withSharedProps from '../../HOCs/withSharedProps';
import { graphql, compose } from 'react-apollo';
import { LoadingSection, CardPageLayout, SelectInput, TextInput, Grid, AlertConfirm, GridItem, BasicButton, ButtonIcon, DeleteIcon } from '../displayComponents';
import { MenuItem } from 'material-ui';
import { statutes, updateStatute, deleteStatute, createStatute } from '../../queries';
import { getPrimary } from '../../styles/colors';
import { withRouter } from 'react-router-dom';
import StatuteEditor from './StatuteEditor';


class StatutesPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            selectedStatute: 0,
            newStatute: false,
            newStatuteName: '',
            statute: {},
            success: false,
            requestError: false,
            requesting: false,
            unsavedChanges: false,
            errors: {}
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props.data.loading && !nextProps.data.loading){
            this.setState({
                statute: {
                    ...nextProps.data.companyStatutes[this.state.selectedStatute]
                }
            });
        }
    }

    resetButtonStates = () => {
        this.setState({
            error: false,
            loading: false,
            success: false
        });
    }

    updateStatute = async () => {
        if(!this.checkRequiredFields()){
            this.setState({
                loading: true
            });
            const { __typename, ...data } = this.state.statute;

            const response = await this.props.updateStatute({
                variables: {
                    statute: data
                }
            });
            if(response.errors){
                this.setState({
                    error: true,
                    loading: false,
                    success: false
                });
            }else{
                this.setState({
                    error: false,
                    loading: false,
                    success: true,
                    unsavedChanges: false
                });
            }
        }
    }

    deleteStatute = async () => {
        const { id } = this.state.statute;
        const response = await this.props.deleteStatute({
            variables: {
                statuteId: id
            }
        });
        if(response){
            this.props.data.refetch();
            this.setState({
                statute: this.props.data.companyStatutes[0],
                selectedStatute: 0
            })
        }
    }

    checkRequiredFields(){
        return false;
    }

    createStatute = async () => {
        if(this.state.newStatuteName){
            const statute = {
                title: this.state.newStatuteName,
                companyId: this.props.company.id
            }
            const response = await this.props.createStatute({
                variables: {
                    statute: statute
                }
            });
            if(!response.errors){
                const updated = await this.props.data.refetch();
                if(updated){
                    this.setState({
                        newStatute: false
                    });
                    this.handleStatuteChange(this.props.data.companyStatutes.length - 1);
                }
            }
        }else{
            this.setState({
                errors: {
                    ...this.state.errors,
                    newStatuteName: this.props.translate.required_field
                }
            })
        }
        
    }

    updateState = (object) => {
        this.setState({
            statute: {
                ...this.state.statute,
                ...object
            },
            unsavedChanges: true
        })
    }

    handleStatuteChange = (index) => {
        if(!this.state.unsavedChanges){
            this.setState({
                statute: null
            }, () => this.setState({
                    selectedStatute: index,
                    statute: {
                        ...this.props.data.companyStatutes[index]
                    }
                })
            );
        }else{
            alert('tienes cambios sin guardar');
        }
    }

    render(){
        const { loading, companyStatutes } = this.props.data;
        const { translate } = this.props;
        const { statute, success, requesting, requestError, errors } = this.state;
    
        if(loading){
            return <LoadingSection />
        }      

        return(
            <CardPageLayout title={translate.statutes}>
                <div style={{float: 'right', paddingRight: '2em', width: '50%'}}>
                    <Grid alignContent="flex-end" >
                        <GridItem xs={6} md={4} lg={4}>
                            <BasicButton
                                text={translate.save}
                                color={getPrimary()}
                                error={requestError}
                                success={success}
                                reset={this.resetButtonStates}
                                loading={requesting}
                                textStyle={{color: 'white', fontWeight: '700'}}
                                onClick={this.updateStatute}
                                icon={<ButtonIcon type="save" color='white' />}
                            />
                            <BasicButton
                                text={translate.add_council_type}
                                color={getPrimary()}
                                textStyle={{color: 'white', fontWeight: '700'}}
                                onClick={() =>  this.setState({newStatute: true})}
                                icon={<ButtonIcon type="add" color='white' />}
                            />
                        </GridItem>
                        <GridItem xs={6} md={1} lg={1}>
                            <DeleteIcon
                                onClick={() => this.deleteStatute(statute.id)}
                            />
                        </GridItem>

                        <GridItem xs={6} md={7} lg={7}>
                            <SelectInput
                                floatingText={translate.statute}
                                value={this.state.selectedStatute}
                                onChange={(event) => this.handleStatuteChange(event.target.value)}
                            >
                                {companyStatutes.map((statute, index) => {
                                        return <MenuItem value={index} key={`statute_${statute.id}`}>{translate[statute.title] || statute.title}</MenuItem>
                                    })
                                }
                            </SelectInput>
                        </GridItem>
                    </Grid>
                </div>
                {!!statute &&
                    <Fragment>
                        <StatuteEditor
                            statute={statute}
                            translate={translate}
                            updateState={this.updateState}
                            errors={this.state.errors}
                        />
                    
                        <AlertConfirm
                            requestClose={() => this.setState({newStatute: false})}
                            open={this.state.newStatute}
                            acceptAction={this.createStatute}
                            buttonAccept={translate.accept}
                            buttonCancel={translate.cancel}
                            bodyText={
                                <TextInput
                                    floatingText={translate.council_type}
                                    required
                                    type="text"
                                    errorText={errors.newStatuteName}
                                    value={statute.newStatuteName}
                                    onChange={(event) => this.setState({
                                            newStatuteName: event.target.value
                                        })
                                    }
                                />
                            }
                            title={translate.add_council_type}
                        />
                    </Fragment>
                }            
            </CardPageLayout>
        )
    }
}

export default withSharedProps()(withRouter(compose(
    graphql(updateStatute, {
        name: 'updateStatute'
    }),
    graphql(deleteStatute, {
        name: 'deleteStatute'
    }),
    graphql(createStatute, {
        name: 'createStatute'
    }),
    graphql(statutes, {
        options: (props) => ({
            variables: {
                companyId: props.match.params.company
            }
        })
    })
)(StatutesPage)));

const newStatute = {
    companyId: '',
    title: '',
    existsAdvanceNoticeDays: 0,
    advanceNoticeDays: 0,
    existsSecondCall: 0,
    minimumSeparationBetweenCall: 0,
    firstCallQuorumType: 0,
    firstCallQuorum: 0,
    secondCallQuorumType: 0,
    secondCallQuorum: 0,
    existsDelegatedVote: 0,
    delegatedVoteWay: 0,
    existMaxNumDelegatedVotes: 0,
    maxNumDelegatedVotes: 0,
    existsPresentWithRemoteVote: 0,
    existsLimitedAccessRoom: 0,
    limitedAccessRoomMinutes: 0,
    existsQualityVote: 0,
    qualityVoteOption: 0,
    canAddPoints: 0,
    canReorderPoints: 0,
    existsAct: 0,
    existsWhoWasSentAct: 0,
    whoWasSentAct: 0,
    includedInActBook: 0,
    whoWasSentActWay: 0,
    canUnblock: 0,
    includeParticipantsList: 0,
    existsWhoSignTheAct: 0,
    prototype: 0,
    intro: '',
    constitution: '',
    conclusion: '',
    actTemplate: 0,
    conveneHeader: '',
    censusId: '',
    quorumPrototype: 0,
    existsComments: 1,
    firstCallQuorumDivider: '',
    secondCallQuorumDivider: '',
    canEditConvene: 0,
    notifyPoints: 0
}