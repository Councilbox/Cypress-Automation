import React, { Component, Fragment } from 'react';
import { CardPageLayout, BasicButton, LoadingSection, DropDownMenu } from "../displayComponents";
import ParticipantsTable from '../councilEditor/ParticipantsTable';
import NewParticipantForm from '../councilEditor/NewParticipantForm';
import { primary, secondary } from '../../styles/colors';
import { FontIcon } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import { councilDetails, participantsQuery, majorities, quorums, votationTypes } from '../../queries';

class CouncilLivePage extends Component {

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

    render(){
        const council = this.props.data.councilDetails;
        const { translate } = this.props;

        if(this.props.data.loading){
            return(
                <LoadingSection />
            );
        }

        return(
            <CardPageLayout title={translate.open_room}>
                <div>Preparando abrir sala</div>
            </CardPageLayout>
        );
    }
}

export default  compose(
    graphql(majorities, {
        name: 'majorities'
    }),

    graphql(quorums, {
        name: 'quorums'
    }),

    graphql(votationTypes, {
        name: 'votations'
    }),
    
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
)(CouncilLivePage);