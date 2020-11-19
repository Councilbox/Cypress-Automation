import React from "react";
import { compose, graphql } from "react-apollo";
import { closeAgenda, openAgenda, openActPoint } from "../../../queries";
import { BasicButton, Icon, LiveToast } from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import FontAwesome from "react-fontawesome";
import { Tooltip } from "material-ui";
import { councilHasSession, getActPointSubjectType } from '../../../utils/CBX';
import { toast } from 'react-toastify';
import { AGENDA_STATES, COUNCIL_TYPES } from '../../../constants';

const ToggleAgendaButton = ({ agenda, council, active, translate, ...props }) => {
	const openAgenda = async () => {
		if(agenda.subjectType === getActPointSubjectType()){
			const response = await props.openActPoint({
				variables: {
					councilId: agenda.councilId
				}
			});
			if (response) {
				props.refetch();
			}
		}else{
			const response = await props.openAgenda({
				variables: {
					agendaId: agenda.id
				}
			});
			if (response) {
				if(response.errors){
					toast(
						<LiveToast
							message={translate.open_point_error}
						/>, {
							position: toast.POSITION.TOP_RIGHT,
							autoClose: true,
							className: "errorToast"
						}
					);
				}
				props.refetch();
			}
		}
	};

	const closeAgenda = async () => {
		const response = await props.closeAgenda({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			props.refetch();
			props.nextPoint();
		}
	}

	const primary = getPrimary();
	const secondary = getSecondary();

	if(!councilHasSession(council)){
		return <span/>
	}

	return (
		<React.Fragment>
			{agenda.pointState === AGENDA_STATES.INITIAL ? (
				active ? (
					<BasicButton
						text={translate.discuss_agenda}
						color={"white"}
						textPosition="before"
						icon={
							<Icon
								className="material-icons"
								style={{
									fontSize: "1.1em",
									color: primary
								}}
							>
								lock_open
							</Icon>
						}
						buttonStyle={{ width: "11em" }}
						onClick={openAgenda}
						textStyle={{
							fontSize: "0.75em",
							fontWeight: "700",
							textTransform: "none",
							color: primary
						}}
					/>
				) : (
					<Tooltip title={translate.warning_unclosed_agenda}>
						<FontAwesome
							name="lock"
							style={{
								color: secondary,
								fontSize: "2em"
							}}
						/>
					</Tooltip>
				)
			) : (
				<BasicButton
					text={translate.close_point}
					color={primary}
					textPosition="before"
					icon={
						<Icon
							className="material-icons"
							style={{
								fontSize: "1.1em",
								color: "white"
							}}
						>
							lock_open
						</Icon>
					}
					buttonStyle={{ width: "11em" }}
					onClick={closeAgenda}
					textStyle={{
						fontSize: "0.75em",
						fontWeight: "700",
						textTransform: "none",
						color: "white"
					}}
				/>
			)}
		</React.Fragment>
	)
}


export default compose(
	graphql(openAgenda, {
		name: "openAgenda"
	}),
	graphql(openActPoint, {
		name: 'openActPoint'
	}),
	graphql(closeAgenda, {
		name: "closeAgenda"
	})
)(ToggleAgendaButton);
