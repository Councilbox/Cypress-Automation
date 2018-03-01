import React, { Component, Fragment } from 'react';
import { CardPageLayout, BasicButton, LoadingSection, DropDownMenu } from "../displayComponents";
import ParticipantsTable from '../councilEditor/ParticipantsTable';
import NewParticipantForm from '../councilEditor/NewParticipantForm';
import { getPrimary, getSecondary } from '../../styles/colors';
import { FontIcon } from 'material-ui';
import DateHeader from './DateHeader';
import { graphql, compose } from 'react-apollo';
import { bHistory } from '../../containers/App';
import { councilDetails, participantsQuery } from '../../queries';

class CouncilPreparePage extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            participants: false,
            addParticipantModal: false
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
        const council = this.props.data.councilDetails;
        const { translate } = this.props;
        const primary = getPrimary();

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <CardPageLayout title={translate.prepare_room}>
                <DateHeader
                    title={council.name}
                    date={council.date_start}
                    button={
                        <Fragment>
                            <BasicButton
                                text={translate.prepare_room}
                                color={primary}
                                buttonStyle={{margin: '0', height: '100%'}}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<FontIcon className="material-icons">add</FontIcon>}
                                textPosition="after"
                                onClick={this.goToPrepareRoom}
                            />
                            <DropDownMenu />
                        </Fragment>
                    }
                />
                <BasicButton
                    text={this.state.page? translate.convene : translate.new_list_called}
                    color={primary}
                    buttonStyle={{margin: '0', height: '100%'}}
                    textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                    icon={<FontIcon className="material-icons">add</FontIcon>}
                    textPosition="after"
                    onClick={() => this.setState({
                        page: !this.state.page
                    })} 
                />
                {!this.state.page?
                    <Fragment>
                        <div
                            dangerouslySetInnerHTML={{__html: this.props.data.councilDetails.email_text}}
                            style={{border: `1px solid ${getSecondary()}`, padding: '2em'}} 
                        />
                    </Fragment>
                :

                    <Fragment>
                        <BasicButton
                            text={translate.add_participant}
                            color={primary}
                            buttonStyle={{margin: '0', height: '100%'}}
                            textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                            icon={<FontIcon className="material-icons">add</FontIcon>}
                            textPosition="after"
                            onClick={() => this.setState({
                                addParticipantModal: true
                            })} 
                        />
                        <ParticipantsTable
                            participants={this.props.participantList.participants}
                            councilID={this.props.councilID}
                            translate={translate}
                            refetch={this.props.participantList.refetch}
                        />
                        <NewParticipantForm
                            translate={translate}
                            show={this.state.addParticipantModal}
                            close={this.closeAddParticipantModal}
                            councilID={this.props.councilID}
                            refetch={this.props.participantList.refetch}
                        />
                    </Fragment>
                }
            </CardPageLayout>
        );
    }
}

export default  compose(
    graphql(participantsQuery, {
        name: "participantList",
        options: (props) => ({
            variables: {
                councilID: props.councilID
            }
        })
    }),
    graphql(councilDetails, {
        name: "data",
        options: (props) => ({
            variables: {
                councilInfo: {
                    companyID: props.companyID,
                    councilID: props.councilID,
                    step: 6
                }
            }
        })
    })
)(CouncilPreparePage);