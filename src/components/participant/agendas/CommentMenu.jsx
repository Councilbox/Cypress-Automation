import React from 'react';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { BasicButton, ButtonIcon } from '../../../displayComponents';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { getSecondary } from '../../../styles/colors';


class CommentMenu extends React.Component {

    state = {
        comment: this.props.agenda.voting[0].comment
    }

    updateComment = async () => {
        const response = await this.props.updateComment({
            variables: {
                id: this.props.agenda.voting[0].id,
                text: this.state.comment
            }
        });

        console.log(response);
    }

    render(){
        const secondary = getSecondary();

        return(
            <div
                style={{
                    marginTop: '1.2em'
                }}
            >
                <RichTextInput
                    value={this.state.comment || ''}
                    onChange={value =>
                        this.setState({
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
                        text={this.props.translate.save}
                        onClick={this.updateComment}
                        color={secondary}
                        icon={<ButtonIcon type="save" color="white" />}
                        textStyle={{ color: 'white', fontWeight: '700'}}
                    />
                </div>
            </div>
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