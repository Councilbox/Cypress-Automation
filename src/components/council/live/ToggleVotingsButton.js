import React from "react";
import { compose, graphql } from "react-apollo";
import { closeAgendaVoting, openAgendaVoting } from "../../../queries";
import { BasicButton, Icon } from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";

class ToggleVotingsButton extends React.Component {
	state = {
		sendCredentials: true,
		confirmModal: false
	};

	openVoting = async () => {
		const response = await this.props.openAgendaVoting({
			variables: {
				agendaId: this.props.agenda.id
			}
		});
		if (response) {
			this.props.refetch();
		}
	};

	closeAgendaVoting = async () => {
		const { agenda } = this.props;
		const response = await this.props.closeAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			this.props.refetch();
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
				{agenda.votingState === 0 ? (
					<BasicButton
						text={translate.active_votings}
						color={"white"}
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
				) : (
					<BasicButton
						text={translate.close_point_votations}
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
						buttonStyle={{ width: "15em" }}
						onClick={this.closeAgendaVoting}
						textStyle={{
							fontSize: "0.75em",
							fontWeight: "700",
							textTransform: "none",
							color: "white"
						}}
					/>
				)}
			</React.Fragment>
		);
	}
}

export default compose(
	graphql(openAgendaVoting, {
		name: "openAgendaVoting"
	}),

	graphql(closeAgendaVoting, {
		name: "closeAgendaVoting"
	})
)(ToggleVotingsButton);
