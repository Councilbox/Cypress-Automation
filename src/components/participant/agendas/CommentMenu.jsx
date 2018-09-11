import React from 'react';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { BasicButton, ButtonIcon, CollapsibleSection, LiveToast } from '../../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary, getPrimary } from '../../../styles/colors';
import { checkForUnclosedBraces, removeHTMLTags } from '../../../utils/CBX';
import { toast } from 'react-toastify';
import { Typography } from 'material-ui';

class CommentMenu extends React.Component {

    state = {
        vote: this.props.agenda.votings.find(voting => voting.participantId === this.props.participant.id),
        open: false,
        success: false,
        loading: false
    }

    resetButtonStates = () => {
        this.setState({
            success: false,
            loading: false
        })
    }

    updateComment = async () => {
        if(!this.checkRequiredFields()){
            this.setState({
                loading: true
            });
            const response = await this.props.updateComment({
                variables: {
                    id: this.props.agenda.voting.id,
                    text: this.state.comment
                }
            });

            if(!!response){
                await this.props.refetch();
                this.setState({
                    loading: false,
                    success: true
                });
            }
        }
    }

    checkRequiredFields = () => {
        if(checkForUnclosedBraces(this.state.comment)){
            toast(
                <LiveToast
                    message={this.props.translate.revise_text}
                />, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: true,			
                    className: "errorToast"
                }
            );
            return true;
        }
    }

    toggle = () => {
        this.setState({
            open: !this.state.open
        });
    }

    render(){
        const secondary = getSecondary();
        const primary = getPrimary();
        const { vote } = this.state;

        if(!vote){
            return (<span />);   
        }

        const comment = vote.comment;

        return(
            <React.Fragment>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '0.6em'
                    }}
                >
                    <Typography style={{ fontWeight: '700', fontSize: '14px'}}>
                        {(!!comment && removeHTMLTags(comment).length > 0)?
                            'Has comentado'
                        : 
                            'No has comentado'
                        }
                    </Typography>
                    <BasicButton
                        color={this.state.open? primary : 'white'}
                        text={(!!comment && removeHTMLTags(comment).length > 0)? 'Editar comentario' : 'Enviar comentario acta'} //TRADUCCION
                        textStyle={{
                            color: this.state.open? 'white' : primary,
                            fontWeight: '700',
                            fontSize: '14px'
                        }}
                        buttonStyle={{
                            float: 'left',
                            marginLeft: '0.6em',
                            padding: '0.3em',
                            border: `2px solid ${primary}`
                        }}
                        onClick={this.toggle}
                    />

                </div>
                <CollapsibleSection
                    trigger={() =>
                        <span></span>
                    }
                    open={this.state.open}
                    collapse={() =>
                        <div
                            style={{
                                marginTop: '1.2em',
                                padding: '0.3em'
                            }}
                        >
                            <RichTextInput
                                value={this.state.comment || ''}
                                onChange={value =>
                                    this.setState({
                                        vote: {
                                            ...this.state.vote,
                                            comment: value
                                        }
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
                                    text={this.props.translate.save}
                                    onClick={this.updateComment}
                                    loading={this.state.loading}
                                    success={this.state.success}
                                    reset={this.resetButtonStates}
                                    color={secondary}
                                    icon={<ButtonIcon type="save" color="white" />}
                                    textStyle={{ color: 'white', fontWeight: '700'}}
                                />
                            </div>
                        </div>
                    }
                />
            </React.Fragment>
        )
    }
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