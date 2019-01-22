import React from "react";
import { compose, graphql } from "react-apollo";
import { closeAgendaVoting, openAgendaVoting } from "../../../queries";
import { BasicButton, Icon } from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import gql from 'graphql-tag';

class ToggleVotingsButton extends React.Component {
	state = {
		sendCredentials: true,
		confirmModal: false
	};

	openVoting = async () => {
		this.setState({
			loading: true
		});
		const response = await this.props.openAgendaVoting({
			variables: {
				agendaId: this.props.agenda.id
			}
		});
		if (response) {
			this.setState({
				loading: false
			});
			this.props.refetch();
		}
	};

	reopenAgendaVoting = async () => {
		this.setState({
			loading: true
		});
		const response = await this.props.reopenAgendaVoting({
			variables: {
				agendaId: this.props.agenda.id
			}
		});
		if (response) {
			this.setState({
				loading: false
			});
			this.props.refetch();
		}
	};

	closeAgendaVoting = async () => {
		const cb = async () => {
			this.setState({
				loading: true
			});
			const { agenda } = this.props;
			const response = await this.props.closeAgendaVoting({
				variables: {
					agendaId: agenda.id
				}
			});
			if (response) {
				this.setState({
					loading: false
				});
				this.props.refetch();
			}
		}

		if(!this.props.editedVotings){
			cb();
		} else {
			this.props.showVotingsAlert(cb);
		}

	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.council) {
			this.setState({
				sendCredentials: !nextProps.council.videoEmailsDate
			});
		}
	}

	render() {
		const { translate, agenda } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				{agenda.votingState === 0 && (
					<BasicButton
						text={translate.active_votings}
						color={"white"}
						loading={this.state.loading}
						disabled={this.state.loading}
						onClick={this.openVoting}
						textPosition="before"
						icon={
							<Icon
								className="material-icons"
								style={{
									fontSize: "1.1em",
									color: primary
								}}
							>
								thumbs_up_down
							</Icon>
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
				{agenda.votingState === 1 &&(
					<BasicButton
						text={translate.close_point_votations}
						color={primary}
						loading={this.state.loading}
						disabled={this.state.loading}
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
						buttonStyle={{ width: "18em" }}
						onClick={this.closeAgendaVoting}
						textStyle={{
							fontSize: "0.75em",
							fontWeight: "700",
							textTransform: "none",
							color: "white"
						}}
					/>
				)}
				{agenda.votingState === 2 &&(
					<BasicButton
						text={'Reabrir votaciones'}//TRADUCCION
						color={'white'}
						loading={this.state.loading}
						disabled={this.state.loading}
						textPosition="before"
						icon={
							<Icon
								className="material-icons"
								style={{
									fontSize: "1.1em",
									color: primary
								}}
							>
								thumbs_up_down
							</Icon>
						}
						buttonStyle={{ width: "18em" }}
						onClick={this.reopenAgendaVoting}
						textStyle={{
							fontSize: "0.75em",
							fontWeight: "700",
							textTransform: "none",
							color: primary
						}}
					/>
				)}
			</React.Fragment>
		);
	}
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
