import React, { Component, Fragment } from 'react';
import { CardPageLayout, BasicButton, LoadingSection, DropDownMenu, Icon, ErrorWrapper, AlertConfirm } from "../displayComponents";
import ParticipantsTable from '../councilEditor/ParticipantsTable';
import NewParticipantForm from '../councilEditor/NewParticipantForm';
import { getPrimary, getSecondary } from '../../styles/colors';
import { MenuItem, Paper } from 'material-ui';
import DateHeader from './DateHeader';
import { graphql } from 'react-apollo';
import { bHistory } from '../../containers/App';
import { councilDetails } from '../../queries';
import * as CBX from '../../utils/CBX';
import FontAwesome from 'react-fontawesome';

class CouncilPreparePage extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            participants: false,
            addParticipantModal: false,
            showModal: false
        }
    }

    componentDidMount(){
        this.props.data.refetch();
    }

    closeAddParticipantModal = () => {
        this.setState({
            addParticipantModal: false
        });
    }

    goToPrepareRoom = () => {
        bHistory.push(`/company/${this.props.companyID}/council/${this.props.councilID}/live`);
    }

    render(){
        const { council, error, loading } = this.props.data;
        const { translate } = this.props;
        const primary = getPrimary();

        if(loading){
            return(
                <LoadingSection />
            );
        }

        if(error){
            return(
                <ErrorWrapper error={error} translate={translate} />
            )
        }

        return(
            <CardPageLayout title={translate.prepare_room}>
                <DateHeader
                    council={council}
                    translate={translate}
                    button={
                        <div>
                            <BasicButton
                                text={translate.prepare_room}
                                color={primary}
                                buttonStyle={{margin: '0', height: '100%'}}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<FontAwesome
                                    name={'user-plus'}
                                    style={{fontSize: '1em', color: 'white', marginLeft: '0.3em'}}
                                /> }
                                textPosition="after"
                                onClick={this.goToPrepareRoom}
                            />
                            <DropDownMenu 
                                title={'cosas'} 
                                color={primary}
                                textStyle={{color: 'white', fontWeight: '700'}}
                                items={
                                    <Fragment>
                                        <MenuItem onClick={() => alert('hola')}>HOLA</MenuItem>
                                        <MenuItem onClick={() => alert('adios')}>ADIOS</MenuItem>
                                    </Fragment>
                                } 
                            />
                        </div>
                    }
                />
                <div>
                    <BasicButton
                        text={this.state.page? translate.convene : translate.new_list_called}
                        color={primary}
                        buttonStyle={{margin: '0', height: '100%'}}
                        textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                        icon={<Icon className="material-icons" style={{color: 'white'}}>add</Icon>}
                        textPosition="after"
                        onClick={() => this.setState({
                            page: !this.state.page
                        })} 
                    />
                </div>
                {!this.state.page?
                    <Paper style={{marginTop: '1.5em'}}>
                        <div
                            dangerouslySetInnerHTML={{__html: council.emailText}}
                            style={{padding: '2em'}} 
                        />
                    </Paper>
                :

                    <Fragment>
                        <div>
                            <BasicButton
                                text={translate.add_participant}
                                color={primary}
                                buttonStyle={{margin: '0', height: '100%'}}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<Icon className="material-icons" style={{color: 'white'}}>add</Icon>}
                                textPosition="after"
                                onClick={() => this.setState({
                                    showModal: true
                                })} 
                            />
                        </div>
                        <ParticipantsTable
                            participants={council.participants}
                            councilId={council.id}
                            totalVotes={this.props.data.councilTotalVotes}
                            socialCapital={this.props.data.councilSocialCapital}
                            participations={CBX.hasParticipations(council)}
                            translate={translate}
                            refetch={this.props.data.refetch}
                        />
                        <AlertConfirm
                            requestClose={() => this.setState({showModal: false})}
                            open={this.state.showModal}
                            bodyText={
                                <div style={{maxWidth: '850px'}}>
                                    <NewParticipantForm
                                        translate={translate}
                                        requestClose={() => this.setState({
                                            showModal: false
                                        })}
                                        participations={CBX.hasParticipations(council)}
                                        close={this.closeAddParticipantModal}
                                        councilID={this.props.councilID}
                                    />
                                </div>
                            }
                        />

                    </Fragment>
                }
            </CardPageLayout>
        );
    }
}

export default graphql(councilDetails, {
    name: "data",
    options: (props) => ({
        variables: {
            councilID: props.councilID,
        }
    })
})(CouncilPreparePage);