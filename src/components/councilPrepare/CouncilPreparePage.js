import React, { Component, Fragment } from 'react';
import { CardPageLayout, BasicButton, LoadingSection, DropDownMenu, Icon, ErrorWrapper } from "../displayComponents";
import ParticipantsTable from '../councilEditor/ParticipantsTable';
import NewParticipantForm from '../councilEditor/NewParticipantForm';
import { getPrimary, getSecondary } from '../../styles/colors';
import DateHeader from './DateHeader';
import { graphql, compose } from 'react-apollo';
import { bHistory } from '../../containers/App';
import { councilDetails } from '../../queries';

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
                    title={council.name}
                    date={council.dateStart}
                    button={
                        <Fragment>
                            <BasicButton
                                text={translate.prepare_room}
                                color={primary}
                                buttonStyle={{margin: '0', height: '100%'}}
                                textStyle={{color: 'white', fontWeight: '700', fontSize: '0.9em', textTransform: 'none'}}
                                icon={<Icon className="material-icons" style={{color: 'white'}}>add</Icon>}
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
                    icon={<Icon className="material-icons" style={{color: 'white'}}>add</Icon>}
                    textPosition="after"
                    onClick={() => this.setState({
                        page: !this.state.page
                    })} 
                />
                {!this.state.page?
                    <Fragment>
                        <div
                            dangerouslySetInnerHTML={{__html: council.emailText}}
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
                            icon={<Icon className="material-icons" style={{color: 'white'}}>add</Icon>}
                            textPosition="after"
                            onClick={() => this.setState({
                                addParticipantModal: true
                            })} 
                        />
                        <ParticipantsTable
                            participants={council.participants}
                            councilID={this.props.councilID}
                            translate={translate}
                            refetch={this.props.data.refetch}
                        />
                        <NewParticipantForm
                            translate={translate}
                            show={this.state.addParticipantModal}
                            close={this.closeAddParticipantModal}
                            councilID={this.props.councilID}
                            refetch={this.props.data.refetch}
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