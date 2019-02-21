import React from "react";
import {
	CustomDialog,
    Icon,
    BasicButton,
    LoadingSection,
	LiveToast
} from "../../../../displayComponents";
import RichTextInput from "../../../../displayComponents/RichTextInput";
import { Typography } from "material-ui";
import { graphql, compose } from "react-apollo";
import { noCelebrateCouncil } from "../../../../queries";
import { bHistory } from "../../../../containers/App";
import { checkForUnclosedBraces } from '../../../../utils/CBX';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import { getPrimary, getSecondary } from '../../../../styles/colors';

class AnnouncementModal extends React.Component {
	state = {
        text: '',
        errorText: ''
    };

    static getDerivedStateFromProps(nextProps, prevProps){
        if(!nextProps.data.loading && nextProps.data.adminAnnouncemment){
            return {
                text: nextProps.data.adminAnnouncement.text
            };
        }

        return null;
    }

    addAnnouncement = async () => {
        const response = await this.props.addRoomAnnouncement({
            variables: {
                message: {
                    councilId: this.props.council.id,
                    text: this.state.text,
                    participantId: -1
                }
            }
        })
        this.props.requestClose();
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

        if(this.props.data.loading){
            return <LoadingSection />;
        }

		return (
			<div style={{ width: "650px" }}>
				<RichTextInput
					translate={translate}
					type="text"
					errorText={this.state.errorText}
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
                            textStyle={{fontWeight: '700', textTransform: 'none'}}
                        />
                        <BasicButton
                            text={'Ocultar mensaje'}
                            onClick={this.closeAnnouncement}
                            color={getSecondary()}
                            textStyle={{fontWeight: '700', color: 'white', textTransform: 'none'}}
                            buttonStyle={{marginLeft: '0.3em', marginRight: '0.3em'}}
                        />
                        <BasicButton
                            text={translate.save}
                            onClick={this.addAnnouncement}
                            color={getPrimary()}
                            textStyle={{fontWeight: '700', textTransform: 'none', color: 'white'}}
                        />
                    </React.Fragment>
                }
                children={this._renderBody()}
                title={'Mostrar aviso a los participantes'}//TRADUCCION
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
	    name: "addRoomAnnouncement"
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
