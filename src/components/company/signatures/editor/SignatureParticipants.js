import React from 'react';
import { EnhancedTable, CloseIcon, BasicButton, ButtonIcon } from '../../../../displayComponents';
import { PARTICIPANTS_LIMITS } from '../../../../constants';
import { TableRow, TableCell } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../../../../styles/colors';
import NewParticipantModal from './NewParticipantModal';
import ParticipantEditorModal from './ParticipantEditorModal';

class SignatureParticipants extends React.Component {

    state = {
        newParticipantModal: false,
        participantId: null
    }

    deleteParticipant = async participantId => {
        const response = await this.props.removeSignatureParticipant({
            variables: {
                participantId: participantId
            }
        });

        if(response.data.removeSignatureParticipant.success){
            this.props.data.refetch();
        }
    }

    editParticipant = id => {
        this.setState({
            editParticipant: id
        })
    }

    render(){
        const { translate } = this.props;
        const { signatureParticipants = { list: [], total: 0}, loading, refetch } = this.props.data;
        const primary = getPrimary();

        return(
            <React.Fragment>
                <NewParticipantModal
                    open={this.state.newParticipantModal}
                    translate={translate}
                    signature={this.props.signature}
                    refetch={this.props.data.refetch}
                    requestClose={() => this.setState({ newParticipantModal: false })}
                />
                {!!this.state.editParticipant &&
                    <ParticipantEditorModal
                        participantId={this.state.editParticipant}
                        key={this.state.editParticipant}
                        translate={translate}
                        signature={this.props.signature}
                        refetch={this.props.data.refetch}
                        requestClose={() => this.setState({ editParticipant: null })}
                    />
                }
                <EnhancedTable
                    ref={table => (this.table = table)}
                    translate={translate}
                    defaultLimit={PARTICIPANTS_LIMITS[0]}
                    defaultFilter={"fullName"}
                    defaultOrder={["fullName", "asc"]}
                    limits={PARTICIPANTS_LIMITS}
                    menuButtons={
                        <React.Fragment>
                            <BasicButton
                                text={translate.add_participant}
                                color={'white'}
                                textStyle={{color: primary, textTransform: 'none', fontWeight: '700'}}
                                buttonStyle={{border: `2px solid ${primary}`, marginRight: '1.2em'}}
                                icon={<ButtonIcon type="add" color={primary} />}
                                onClick={() => this.setState({ newParticipantModal: true })}
                            />
                        </React.Fragment>
                    }
                    page={1}
                    loading={loading}
                    length={signatureParticipants.list.length}
                    total={signatureParticipants.total}
                    refetch={this.props.data.refetch}
                    action={this._renderDeleteIcon}
                    fields={[
                        {
                            value: "fullName",
                            translation: translate.participant_data
                        },
                        {
                            value: "dni",
                            translation: translate.dni
                        },
                        {
                            value: "email",
                            translation: translate.email
                        }
                    ]}
                    headers={[
                        {
                            name: 'fullName',
                            text: translate.participant_data,
                            canOrder: true
                        },
                        {
                            name: 'dni',
                            text: translate.dni,
                            canOrder: true
                        },
                        {   
                            name: 'email',
                            text: translate.email,
                            canOrder: true
                        },
                        {
                            text: ''
                        }
                    ]}
                >
                    {signatureParticipants.list.length > 0 &&
                        signatureParticipants.list.map(participant => (
                            <HoverableRow
                                participant={participant}
                                key={`participant_${participant.id}`}
                                deleteParticipant={this.deleteParticipant}
                                editParticipant={this.editParticipant}
                            />
                        ))
                    }
                </EnhancedTable>
            </React.Fragment>
        )
    }
}

class HoverableRow extends React.Component {

    state = {
        showActions: false
    }

    handleMouseEnter = () => {
        this.setState({
            showActions: true
        });
    }

    handleMouseLeave = () => {
        this.setState({
            showActions: false
        });
    }

    render(){
        const { participant, translate, deleteAction } = this.props;

        return(
            <TableRow
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                hover
                style={{
                    cursor: 'pointer'
                }}
                onClick={() => this.props.editParticipant(participant.id)}
            >
                <TableCell>
                    {`${participant.name} ${participant.surname}`}
                </TableCell>
                
                <TableCell>
                    {participant.dni}
                </TableCell>
                <TableCell>
                    {participant.email}
                </TableCell>
                <TableCell>
                    {this.state.showActions?
                        <CloseIcon
                            style={{
                                color: getPrimary()
                            }}
                            onClick={() => this.props.deleteParticipant(participant.id)}
                        />
                    :
                        <div style={{width: '4em'}} />
                    }
                </TableCell>
            </TableRow>
        )
    }
}

const signatureParticipants = gql`
    query SignatureParticipants($signatureId: Int!, $filters: [FilterInput], $options: OptionsInput){
        signatureParticipants(signatureId: $signatureId, filters: $filters, options: $options){
            list{
                id
                name
                surname
                dni
                email
            }
            total
        }
    }
`;

const removeSignatureParticipant = gql`
    mutation RemoveSignatureParticipant($participantId: Int!){
        removeSignatureParticipant(id: $participantId){
            success
            message
        }
    }
`;

export default compose(
    graphql(removeSignatureParticipant, {
        name: 'removeSignatureParticipant'
    }),
    graphql(signatureParticipants, {
        options: props => ({
            variables: {
                signatureId: props.signature.id,
                options: {
                    limit: PARTICIPANTS_LIMITS[0],
                    offset: 0
                }
            }
        })
    })
)(SignatureParticipants);


/*
const {
    translate,
    totalVotes,
    totalSocialCapital,
    participations,
    council
} = this.props;
const { editingParticipant, participant } = this.state;
const { loading, signatureParticipants, refetch } = this.props.data;
let headers = [
    {
        text: translate.participant_data,
        name: "fullName",
        canOrder: true
    },
    {
        text: translate.dni,
        name: "dni",
        canOrder: true
    },
    {
        text: translate.position,
        name: "position",
        canOrder: true
    },
    {
        text: translate.votes,
        name: "numParticipations",
        canOrder: true
    }
];

if (participations) {
    headers.push({
        text: translate.census_type_social_capital,
        name: "socialCapital",
        canOrder: true
    });
}
headers.push({ text: translate.delete });
    <div style={{ width: "100%" }}>
       <ChangeCensusMenu
            translate={translate}
            council={council}
            participations={participations}
            refetch={refetch}
            handleCensusChange={this.props.handleCensusChange}
            reloadCensus={this.props.reloadCensus}
            showAddModal={this.props.showAddModal}
            censuses={this.props.censuses}
            totalVotes={this.props.totalVotes}
            totalSocialCapital={this.props.totalSocialCapital}
        />
        <CouncilParticipantEditor
            translate={translate}
            close={this.closeParticipantEditor}
            councilId={council.id}
            participations={participations}
            participant={participant}
            opened={editingParticipant}
            refetch={refetch}
        />
        {!!signatureParticipants && (
            <React.Fragment>
                <EnhancedTable
                    ref={table => (this.table = table)}
                    translate={translate}
                    defaultLimit={PARTICIPANTS_LIMITS[0]}
                    defaultFilter={"fullName"}
                    defaultOrder={["fullName", "asc"]}
                    limits={PARTICIPANTS_LIMITS}
                    page={1}
                    loading={loading}
                    length={councilParticipants.list.length}
                    total={councilParticipants.total}
                    refetch={this.props.data.refetch}
                    action={this._renderDeleteIcon}
                    fields={[
                        {
                            value: "fullName",
                            translation: translate.participant_data
                        },
                        {
                            value: "dni",
                            translation: translate.dni
                        },
                        {
                            value: "position",
                            translation: translate.position
                        }
                    ]}
                    headers={headers}
                >
                    {councilParticipants.list.map(
                        (participant, index) => {
                            return (
                                <React.Fragment
                                    key={`participant${participant.id}`}
                                >
                                    <TableRow
                                        hover={true}
                                        onClick={() =>
                                            this.setState({
                                                editingParticipant: true,
                                                participant: participant
                                            })
                                        }
                                        style={{
                                            cursor: "pointer",
                                            fontSize: "0.5em"
                                        }}
                                    >
                                        <TableCell>
                                            {`${participant.name} ${
                                                participant.surname
                                            }`}
                                        </TableCell>
                                        <TableCell>
                                            {participant.dni}
                                        </TableCell>
                                        <TableCell>
                                            {participant.position}
                                        </TableCell>
                                        <TableCell>
                                            {!CBX.isRepresentative(
                                                participant
                                            ) &&
                                                `${
                                                    participant.numParticipations
                                                } (${(
                                                    (participant.numParticipations /
                                                        totalVotes) *
                                                    100
                                                ).toFixed(2)}%)`}
                                        </TableCell>
                                        {this.props.participations && (
                                            <TableCell>
                                                {!CBX.isRepresentative(
                                                    participant
                                                ) &&
                                                    `${
                                                        participant.socialCapital
                                                    } (${(
                                                        (participant.socialCapital /
                                                            totalSocialCapital) *
                                                        100
                                                    ).toFixed(2)}%)`}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {!CBX.isRepresentative(
                                                participant
                                            ) &&
                                                this._renderDeleteIcon(
                                                    participant.id
                                                )}
                                        </TableCell>
                                    </TableRow>

                                    {!!participant.representative && (
                                        <TableRow
                                            hover={true}
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                    "WhiteSmoke"
                                            }}
                                            onClick={() =>
                                                this.setState({
                                                    editParticipant: true,
                                                    editIndex: index
                                                })
                                            }
                                        >
                                            <TableCell>
                                                <div
                                                    style={{
                                                        fontSize:
                                                            "0.9em",
                                                        width: "100%"
                                                    }}
                                                >
                                                    {`${
                                                        translate.represented_by
                                                    }: ${
                                                        participant
                                                            .representative
                                                            .name
                                                    } ${
                                                        participant
                                                            .representative
                                                            .surname
                                                    }`}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    style={{
                                                        fontSize:
                                                            "0.9em",
                                                        width: "100%"
                                                    }}
                                                >
                                                    {
                                                        participant
                                                            .representative
                                                            .dni
                                                    }
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div
                                                    style={{
                                                        fontSize:
                                                            "0.9em",
                                                        width: "100%"
                                                    }}
                                                >
                                                    {
                                                        participant
                                                            .representative
                                                            .position
                                                    }
                                                </div>
                                            </TableCell>
                                            {participations && (
                                                <TableCell />
                                            )}
                                            <TableCell />
                                            <TableCell />
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            );
                        }
                    )}
                </EnhancedTable>
            </React.Fragment>
        )}
    {this.props.children}
</div>*/