import React from 'react';
import { EnhancedTable, CloseIcon, BasicButton, ButtonIcon, RefreshButton } from '../../../../displayComponents';
import { PARTICIPANTS_LIMITS, SIGNATURE_PARTICIPANTS_STATES } from '../../../../constants';
import { TableRow, TableCell } from 'material-ui';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { getPrimary } from '../../../../styles/colors';
import { getSignerStatusTranslateField } from '../../../../utils/CBX';

class SignersList extends React.Component {

    refresh = async () => {
        await this.props.refreshStates();
    }

    render(){
        const { translate } = this.props;
        const { signatureParticipants = { list: [], total: 0}, loading, refetch } = this.props.data;
        const primary = getPrimary();

        return(
            <React.Fragment>
                <EnhancedTable
                    ref={table => (this.table = table)}
                    translate={translate}
                    defaultLimit={PARTICIPANTS_LIMITS[0]}
                    defaultFilter={"fullName"}
                    defaultOrder={["fullName", "asc"]}
                    limits={PARTICIPANTS_LIMITS}
                    menuButtons={
                        <div style={{marginRight: '0.8em'}}>
                            <RefreshButton 
                                translate={translate}
                                tooltip={translate.refresh_convened}
                                onClick={this.refresh}
                            />
                        </div>
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
                            name: 'status',
                            text: translate.signed,
                            canOrder: true
                        }
                    ]}
                >
                    {signatureParticipants.list.length > 0 &&
                        signatureParticipants.list.map(participant => ( 
                            <TableRow
                                key={`participant_${participant.id}`}
                                style={{
                                    backgroundColor: participant.status === SIGNATURE_PARTICIPANTS_STATES.SIGNED? '#dcf9f6' : 'inherit'
                                }}
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
                                {translate[getSignerStatusTranslateField(participant.status)]}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </EnhancedTable>
            </React.Fragment>
        )
    }
}

const signatureParticipants = gql`
    query SignatureParticipants($signatureId: Int!, $filters: [FilterInput], $options: OptionsInput){
        signatureParticipants(signatureId: $signatureId, filters: $filters, options: $options){
            list{
                id
                name
                status
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
)(SignersList);