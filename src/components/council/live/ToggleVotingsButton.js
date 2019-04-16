import React from "react";
import { compose, graphql } from "react-apollo";
import { closeAgendaVoting, openAgendaVoting } from "../../../queries";
import { BasicButton, ButtonIcon } from "../../../displayComponents";
import { moment } from "../../../containers/App";
import { getPrimary } from "../../../styles/colors";
import { useOldState } from "../../../hooks";
import gql from 'graphql-tag';

const ToggleVotingsButton = ({ agenda, translate, council, ...props }) => {
	const [loading, setLoading] = React.useState(false);
	const [state, setState] = useOldState({
		sendCredentials: !council.videoEmailsDate,
		confirmModal: false
	});
	const primary = getPrimary();

	React.useEffect(() => {
		if(state.sendCredentials !== !council.videoEmailsDate){
			setState({
				sendCredentials: !council.videoEmailsDate
			});
		}
	}, [council.videoEmailsDate]);

	const openVoting = async () => {
		setLoading(true);
		const response = await props.openAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			setLoading(false);
			props.refetch();
		}
	}

	const reopenAgendaVoting = async () => {
		setLoading(true);
		const response = await props.reopenAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			setLoading(false);
			props.refetch();
		}
	}

	const closeAgendaVoting = async () => {
		const cb = async () => {
			setLoading(true);
			const response = await props.closeAgendaVoting({
				variables: {
					agendaId: agenda.id
				}
			});
			if (response) {
				setLoading(false);
				props.refetch();
			}
		}

		if(!props.editedVotings){
			cb();
		} else {
			props.showVotingsAlert(cb);
		}
	}


	return (
		<React.Fragment>
			{agenda.votingState === 0 && (
				<BasicButton
					text={translate.active_votings}
					color={"white"}
					loading={loading}
					disabled={loading}
					onClick={openVoting}
					textPosition="before"
					icon={
						<ButtonIcon
							type="thumbs_up_down"
							color={primary}
						/>
					}
					buttonStyle={{ minWidth: "11em" }}
					textStyle={{
						fontSize: "0.75em",
						fontWeight: "700",
						textTransform: "none",
						color: primary
					}}
				/>
			)}
			{agenda.votingState === 1 && (
				<React.Fragment>
					{council.councilType === 3?
						<div style={{fontSize: '0.9em'}}>
							{`Las votaciones se cerrarán automáticamente ${moment(council.closeDate).format('LLL')}`/*TRADUCCION*/}
						</div>
					:
						<BasicButton
							text={translate.close_point_votations}
							color={primary}
							loading={loading}
							disabled={loading}
							textPosition="before"
							icon={
								<ButtonIcon
									type="lock_open"
									color="white"
								/>
							}
							buttonStyle={{ width: "18em" }}
							onClick={closeAgendaVoting}
							textStyle={{
								fontSize: "0.75em",
								fontWeight: "700",
								textTransform: "none",
								color: "white"
							}}
						/>
					}
				</React.Fragment>
			)}
			{agenda.votingState === 2 &&(
				<BasicButton
					text={translate.reopen_voting}
					color={'white'}
					loading={loading}
					disabled={loading}
					textPosition="before"
					icon={
						<ButtonIcon
							type="thumbs_up_down"
							color={primary}
						/>
					}
					buttonStyle={{ width: "18em" }}
					onClick={reopenAgendaVoting}
					textStyle={{
						fontSize: "0.75em",
						fontWeight: "700",
						textTransform: "none",
						color: primary
					}}
				/>
			)}
		</React.Fragment>
	)
}

const reopenAgendaVoting = gql`
	mutation ReopenAgendaVoting($agendaId: Int!){
		reopenAgendaVoting(agendaId: $agendaId){
			success
			message
		}
	}
`;

export default compose(
	graphql(openAgendaVoting, {
		name: "openAgendaVoting"
	}),

	graphql(closeAgendaVoting, {
		name: "closeAgendaVoting"
	}),
	graphql(reopenAgendaVoting, {
		name: "reopenAgendaVoting"
	})
)(ToggleVotingsButton);
