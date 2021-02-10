import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Tooltip, Typography } from 'material-ui';
import { getSecondary } from '../../../../styles/colors';
import { ConfigContext } from '../../../../containers/AppControl';
import { AlertConfirm, TextInput } from '../../../../displayComponents';

const DenyVote = ({
 translate, client, refetch, participant
}) => {
    const [modal, setModal] = React.useState(false);
    const [text, setText] = React.useState(participant.voteDeniedReason ? participant.voteDeniedReason : '');
    const secondary = getSecondary();
    const config = React.useContext(ConfigContext);

    if (!config.denyVote) {
        return null;
    }

    const renderBody = () => {
        if (!participant.voteDenied) {
            return (
            <div>
                {translate.deny_vote_warning_question}
                <div style={{
                        marginTop: '1em'
                    }}
                >
                    <TextInput
                        value={text}
                        floatingText={translate.vote_denied_reason}
                        onChange={event => setText(event.target.value)}
                    />
                </div>

            </div>
            );
        }

        return (
            <div>
                {translate.undeny_vote_question}
            </div>
        );
    };

    const toggleDeniedVote = async value => {
        await client.mutate({
            mutation: gql`
                mutation SetParticipantVoteDenied($participantId: Int, $value: Boolean!, $text: String){
                    setParticipantVoteDenied(participantId: $participantId, value: $value, text: $text){
                        success
                    }
                }
            `,
            variables: {
                participantId: participant.id,
                value,
                text
            }
        });

        refetch();
        setModal(false);
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}
        >
            <AlertConfirm
                requestClose={() => setModal(false)}
                title={translate.warning}
                open={modal}
                acceptAction={participant.voteDenied ? () => toggleDeniedVote(false) : () => toggleDeniedVote(true)}
                buttonAccept={translate.accept}
                buttonCancel={translate.cancel}
                bodyText={renderBody()}
            />
            <div
                style={{
                    width: '2em',
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <i className="fa fa-times" aria-hidden="true" style={{
                        color: secondary,
                        fontSize: '0.8em',
                        marginRight: '0.3em'
                }}></i>
            </div>
            {participant.voteDenied ?
                <Tooltip title={participant.voteDeniedReason}>
                    <Typography variant="body1" className="truncate">
            <span style={{ color: 'red', fontWeight: '700' }}>{translate.denied_vote}</span>
                        <span onClick={() => setModal(true)} style={{ fontSize: '0.9em', color: secondary, cursor: 'pointer' }}>({translate.restore_vote_right})</span>
                    </Typography>
                </Tooltip>
            : <Typography variant="body1" className="truncate" style={{ cursor: 'pointer' }} onClick={() => setModal(true)}>
                    {translate.deny_right_to_vote}
                </Typography>
            }

        </div>
    );
};

export default withApollo(DenyVote);
