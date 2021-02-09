import React from 'react';
import { withApollo } from 'react-apollo';
import { toast } from 'react-toastify';
import { Button } from 'material-ui';
import gql from 'graphql-tag';
import { LiveToast, AlertConfirm } from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';
import { AGENDA_STATES } from '../../../constants';
import RichTextInput from '../../../displayComponents/RichTextInput';


const updateCommentMutation = gql`
    mutation UpdateComment($text: String!, $id: Int!){
        updateComment(text: $text, id: $id){
            success
            message
        }
    }
`;

const CommentModal = ({ translate, agenda, participant, council, client, ...props }) => {
    const [loading, setLoading] = React.useState(false);
    const [state, setState] = React.useState({
        open: false,
        vote: getOwnVote(),
    });

    React.useEffect(() => {
        if(agenda.votingState !== AGENDA_STATES.INITIAL){
            setState({
                ...state,
                vote: getOwnVote()
            });
        }
    }, [agenda.votingState]);

    function getOwnVote() {
        return agenda.votings.find(voting => (
            voting.participantId === participant.id
            || voting.delegateId === participant.id ||
            voting.author.representative.id === participant.id));
    }

    const originalComment = getOwnVote();

    const toggle = () => {
        setState({
            ...state,
            open: !state.open
        });
    };

    const updateComment = async () => {
        if(!checkRequiredFields()){
            setLoading(true);
            await client.mutate({
                mutation: updateCommentMutation,
                variables: {
                    id: state.vote.id,
                    text: state.vote.comment
                }
            });

            setLoading(false);
            props.refetch();
            toggle();
        }
    };

    const checkRequiredFields = () => {
        if (CBX.checkForUnclosedBraces(state.vote.comment)) {
            toast(
                <LiveToast
                    message={translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,
                    className: 'errorToast'
                }
            );
            return true;
        }
    };

    return (
        <React.Fragment>
            {state.vote &&
                <Button size="small" color="primary" onClick={toggle} disabled={!(CBX.agendaVotingsOpened(agenda) && CBX.councilHasComments(council.statute))}>
                    {(!!originalComment && originalComment.comment) ? translate.edit_comment : translate.send_comment}
                </Button>
            }

            <AlertConfirm
                open={state.open}
                requestClose={toggle}
                bodyText={
                    <RichTextInput
                        value={state.vote !== undefined ? state.vote.comment : ''}
                        translate={translate}
                        onChange={value => setState({
                                ...state,
                                vote: {
                                    ...state.vote,
                                    comment: value
                                }
                            })
                        }
                    />
                }
                loadingAction={loading}
                title={translate.send_comment}
                acceptAction={updateComment}
                buttonAccept={translate.send}
                buttonCancel={translate.cancel}
            />
        </React.Fragment>
    );
};

export default withApollo(CommentModal);
