import React from 'react';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { BasicButton, ButtonIcon, CollapsibleSection, LiveToast } from '../../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { checkForUnclosedBraces, removeHTMLTags } from '../../../utils/CBX';
import { PARTICIPANT_STATES } from '../../../constants';
import { toast } from 'react-toastify';
import { Typography } from 'material-ui';

const CommentMenu = ({ agenda, translate, participant, ...props }) => {
    const [vote, setVote] = React.useState(getVote());
    const [state, setState] = React.useState({
        open: false,
        success: false,
        loading: false
    });
    const primary = getPrimary();
    const secondary = getSecondary();


    const resetButtonStates = () => {
        setState({
            ...state,
            success: false,
            loading: false
        });
    }

    const updateComment = async () => {
        if (!checkRequiredFields()) {
            setState({
                ...state,
                loading: true
            });
            const response = await props.updateComment({
                variables: {
                    id: vote.id,
                    text: vote.comment
                }
            });

            if (!!response) {
                await props.refetch();
                setState({
                    loading: false,
                    success: true,
                    open: false
                });
            }
        }
    }

    const checkRequiredFields = () => {
        if (checkForUnclosedBraces(vote.comment)) {
            toast(
                <LiveToast
                    message={translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,
                    className: "errorToast"
                }
            );
            return true;
        }
    }

    function getVote() {
        return {};
        return agenda.votings.find(voting =>
            voting.participantId === participant.id ||
            (voting.author.representative && (voting.author.state === PARTICIPANT_STATES.REPRESENTATED) && voting.author.representative.id === participant.id)
        )
    }

    const toggle = () => {
        setState({
            open: !state.open
        });
    }

    if (!vote) {
        return (<span />);
    }

    const comment = vote.comment;

    return (
        <React.Fragment>
            <div
                style={{
                    width: "100%",
                    alignItems: 'center',
                    marginTop: '0.6em'
                }}
            >
                <Typography style={{ fontWeight: '700', fontSize: '14px', marginBottom: "5px" }}>
                    {(!!vote.comment && removeHTMLTags(comment).length > 0) ?
                        translate.you_have_commented
                        :
                        translate.you_didnt_comment
                    }
                </Typography>
                <BasicButton
                    color={'white'}
                    text={(!!vote.comment && removeHTMLTags(vote.comment).length > 0) ? translate.edit_comment : translate.send_minutes_comment}
                    textStyle={{
                        color: secondary,
                        fontSize: '14px'
                    }}
                    buttonStyle={{
                        width: "160px",
                        float: 'left',
                        padding: '0.3em',
                        border: `1px solid ${secondary}`
                    }}
                    onClick={toggle}
                />

            </div>
            <CollapsibleSection
                trigger={() =>
                    <span></span>
                }
                open={state.open}
                collapse={() =>
                    <div
                        style={{
                            marginTop: '1.2em',
                            padding: '0.3em'
                        }}
                    >
                        <RichTextInput
                            value={comment || ''}
                            translate={translate}
                            onChange={value =>
                                setVote({
                                    ...vote,
                                    comment: value
                                })
                            }
                        />
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'flex-end',
                                marginTop: '0.6em'
                            }}
                        >
                            <BasicButton
                                text={translate.save}
                                onClick={updateComment}
                                loading={state.loading}
                                success={state.success}
                                reset={resetButtonStates}
                                color={secondary}
                                icon={<ButtonIcon type="save" color="white" />}
                                textStyle={{ color: 'white', fontWeight: '700' }}
                            />
                        </div>
                    </div>
                }
            />
        </React.Fragment>
    )

}


const updateComment = gql`
    mutation UpdateComment($text: String!, $id: Int!){
        updateComment(text: $text, id: $id){
            success
            message
        }
    }
`;

export default graphql(updateComment, {
    name: 'updateComment'
})(CommentMenu);