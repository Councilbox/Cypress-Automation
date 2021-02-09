import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import {
	CustomDialog,
    BasicButton,
    LoadingSection,
    Checkbox
} from '../../../../displayComponents';
import RichTextInput from '../../../../displayComponents/RichTextInput';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { removeHTMLTags } from '../../../../utils/CBX';

const CHAR_LIMIT = 300;

class AnnouncementModal extends React.Component {
	state = {
        text: '',
        blockUser: true,
        errorText: ''
    };

    static getDerivedStateFromProps(nextProps, prevProps) {
        if (!nextProps.data.loading && nextProps.data.adminAnnouncemment) {
            return {
                text: nextProps.data.adminAnnouncement.text
            };
        }

        return null;
    }

    addAnnouncement = async () => {
        if (removeHTMLTags(this.state.text.toString()).length <= CHAR_LIMIT) {
            const response = await this.props.addRoomAnnouncement({
                variables: {
                    message: {
                        councilId: this.props.council.id,
                        text: this.state.text,
                        blockUser: this.state.blockUser,
                        participantId: -1
                    }
                }
            });
            this.props.requestClose();
        } else {
            this.setState({
                errorText: this.props.translate.max_chars_exceeded
            });
        }
    }

    closeAnnouncement = async () => {
        const response = await this.props.closeRoomAnnouncement({
            variables: {
                councilId: this.props.council.id
            }
        });

        this.props.requestClose();
    }

	_renderBody() {
        const { translate } = this.props;
        const primary = getPrimary();

        if (this.props.data.loading) {
            return <LoadingSection />;
        }

		return (
			<div style={{ width: '650px' }}>
                 <Checkbox
                    label={translate.notice_block_check}
                    styleInLabel={{ color: primary, fontSize: '12px' }}
                    colorCheckbox={'primary'}
                    value={this.state.blockUser}
                    onChange={() => this.setState({ blockUser: !this.state.blockUser })}
                />

				<RichTextInput
					translate={translate}
                    type="text"
                    maxChars={CHAR_LIMIT}
                    errorText={this.state.errorText}
                    floatingText={this.state.errorText}
					value={this.state.text}
					onChange={value => {
                        this.setState({
                            text: value
                        });
					}}
				/>
			</div>
		);
	}

	render() {
        const { translate } = this.props;

		return (
            <CustomDialog
                requestClose={this.props.requestClose}
                open={this.props.show}
                actions={
                    <React.Fragment>
                        <BasicButton
                            text={translate.cancel}
                            onClick={this.props.requestClose}
                            type="flat"
                            textStyle={{ fontWeight: '700', textTransform: 'none' }}
                        />
                        {this.props.data.adminAnnouncement && this.props.data.adminAnnouncement
                            && <BasicButton
                                text={translate.hide_announcement}
                                onClick={this.closeAnnouncement}
                                color={getSecondary()}
                                textStyle={{ fontWeight: '700', color: 'white', textTransform: 'none' }}
                                buttonStyle={{ marginLeft: '0.3em', marginRight: '0.3em' }}
                            />
                        }
                        <BasicButton
                            text={translate.save}
                            onClick={this.addAnnouncement}
                            color={getPrimary()}
                            textStyle={{ fontWeight: '700', textTransform: 'none', color: 'white' }}
                        />
                    </React.Fragment>
                }
                children={this._renderBody()}
                title={translate.show_announcement}
            />
		);
	}
}

const addRoomAnnouncement = gql`
    mutation AddRoomAnnouncement($message: RoomMessageInput!){
        addRoomAnnouncement(message: $message){
            success
            message
        }
    }
`;

const adminAnnouncement = gql`
    query AdminAnnouncement($councilId: Int!){
        adminAnnouncement(councilId: $councilId){
            text
            id
            active
        }
    }
`;

const closeRoomAnnouncement = gql`
    mutation CloseRoomAnnouncement($councilId: Int!){
        closeRoomAnnouncement(councilId: $councilId){
            success
        }
    }
`;

export default compose(
    graphql(addRoomAnnouncement, {
	    name: 'addRoomAnnouncement'
    }),
    graphql(closeRoomAnnouncement, {
        name: 'closeRoomAnnouncement'
    }),
    graphql(adminAnnouncement, {
        options: props => ({
            variables: {
                councilId: props.council.id
            }
        })
    })
)(AnnouncementModal);
