import React, { Fragment, Component } from 'react';
import { getPrimary, getSecondary } from '../../../styles/colors';
import * as CBX from '../../../utils/CBX';
import { Card } from 'material-ui';
import NewParticipantForm from '../editor/NewParticipantForm';
import ConvenedParticipantsTable from './ConvenedParticipantsTable';
import { CardPageLayout, BasicButton, LoadingSection, Icon, DropDownMenu, ErrorWrapper, AlertConfirm, ButtonIcon } from "../../../displayComponents";


class ParticipantsSection extends Component{

    constructor(props){
        super(props);
        this.state = {
            showModal: false
        };
    }

    closeAddParticipantModal = () => {
        this.setState({
            addParticipantModal: false
        });
    };


    render(){
        const { translate, council, refetch, totalVotes, socialCapital } = this.props;
        const primary = getPrimary();
        const secondary = getSecondary();
    
        return (
            <Card style={{marginTop: '1em', padding: '1.5em'}}>
                <ConvenedParticipantsTable
                    participants={council.participants}
                    councilId={council.id}
                    totalVotes={totalVotes}
                    socialCapital={socialCapital}
                    participations={CBX.hasParticipations(council)}
                    translate={translate}
                    refetch={refetch}
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
    
            </Card>
        );
    }
}

export default ParticipantsSection;