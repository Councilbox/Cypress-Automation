import React from "react";
import { graphql } from "react-apollo";
import { openCouncilRoom } from "../../../queries/live";
import {
	AlertConfirm,
	BasicButton,
	Checkbox,
	Icon
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import { moment } from '../../../containers/App';
import { useOldState } from "../../../hooks";
import LiveSMS from "./councilMenu/LiveSMS";

const OpenRoomButton = ({ council, translate, ...props }) => {
	const [state, setState] = useOldState({
		sendCredentials: !council.videoEmailsDate,
		confirmModal: false,
		showSMS: false
	});
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(null);
	const primary = getPrimary();

	const openCouncilRoom = async () => {
		setLoading(true);
		const response = await props.openCouncilRoom({
			variables: {
				councilId: council.id,
				timezone: moment().utcOffset(),
				sendCredentials: state.sendCredentials
			}
		});
		if (response.data.openCouncilRoom.success) {
			if(response.data.openCouncilRoom.message === 'Failed SMS'){
				setError(response.data.openCouncilRoom.message);
				setLoading(false);
			}
			//await this.props.refetch();
		}
	}

	const getBody = () => {
		if(state.showSMS){
			return (
				<LiveSMS
					translate={translate}
					council={council}
				/>
			)
		}

		if(error === 'Failed SMS'){
			//TRADUCCION
			return (
				<div>
					<div>
						La sala ha sido abierta correctamente, pero ha fallado el envió de algunos SMS de acceso.
						Posiblemente el problema haya sido la existencia de teléfonos no válidos o sin prefijo. Puede revisarlos/reenviarlos pulsando aquí.
					</div>
					<BasicButton
						text={'Ver'}
						color={'white'}
						onClick={() => setState({ showSMS: true })}
						buttonStyle={{ width: "11em" }}
						textStyle={{
							fontWeight: "700",
							textTransform: "none"
						}}
					/>
				</div>
			)
		}

		return (
			<React.Fragment>
				<div>{translate.open_room_continue}</div>
				<Checkbox
					label={translate.send_video_credentials}
					value={state.sendCredentials}
					onChange={(event, isInputChecked) =>
						setState({
							sendCredentials: isInputChecked
						})
					}
				/>
				{council.videoEmailsDate &&
					<span>{`Enviadas por última vez ${moment(council.videoEmailsDate).format('LLL')}`/*TRADUCCION*/}</span>
				}
				<a
					href={`https://app.councilbox.com/recommendations/${council.language}`}
					rel="noopener noreferrer"
					target="_blank"
				>
					<div
						dangerouslySetInnerHTML={{
							__html:
								translate.room_permits_firs_time_msg
						}}
						style={{ color: primary }}
					/>
				</a>
			</React.Fragment>
		)
	}

	return (
		<React.Fragment>
			<div>
				<BasicButton
					text={translate.open_room}
					color={primary}
					loading={loading}
					onClick={() => setState({ confirmModal: true })}
					textPosition="before"
					icon={
						<Icon
							className="material-icons"
							style={{
								fontSize: "1.1em",
								color: "white"
							}}
						>
							play_arrow
						</Icon>
					}
					buttonStyle={{ width: "11em" }}
					textStyle={{
						color: "white",
						fontSize: "0.75em",
						fontWeight: "700",
						textTransform: "none"
					}}
				/>
			</div>
			<AlertConfirm
				title={translate.open_room}
				bodyText={getBody()}
				open={state.confirmModal}
				buttonAccept={translate.accept}
				loadingAction={loading}
				buttonCancel={translate.cancel}
				hideAccept={state.showSMS || !!error}
				modal={true}
				acceptAction={openCouncilRoom}
				requestClose={() => setState({ confirmModal: false })}
			/>
		</React.Fragment>
	);

}


export default graphql(openCouncilRoom, {
	name: "openCouncilRoom"
})(OpenRoomButton);
