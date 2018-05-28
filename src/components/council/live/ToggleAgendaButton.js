import React, { Component, Fragment } from "react";
import { compose, graphql } from "react-apollo";
import { closeAgenda, openAgenda } from "../../../queries";
import { BasicButton, Icon } from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import FontAwesome from "react-fontawesome";
import { Tooltip } from "material-ui";

class ToggleAgendaButton extends Component {
	openAgenda = async () => {
		const { agenda } = this.props;
		const response = await this.props.openAgenda({
			variables: {
				agendaId: agenda.id,
				councilId: agenda.councilId
			}
		});
		if (response) {
			this.props.refetch();
		}
	};
	closeAgenda = async () => {
		const { agenda } = this.props;
		const response = await this.props.closeAgenda({
			variables: {
				agendaId: agenda.id,
				councilId: agenda.councilId
			}
		});
		console.log(response);
		if (response) {
			this.props.refetch();
		}
	};

	constructor(props) {
		super(props);
		this.state = {
			sendCredentials: true,
			confirmModal: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.council) {
			this.setState({
				sendCredentials: !nextProps.council.video_emails_date
			});
		}
	}

	render() {
		const { translate, agenda, active } = this.props;
		const primary = getPrimary();

		return (
			<Fragment>
				{agenda.pointState === 0 ? (
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
							onClick={this.openAgenda}
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
									color: getSecondary(),
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
						onClick={this.closeAgenda}
						textStyle={{
							fontSize: "0.75em",
							fontWeight: "700",
							textTransform: "none",
							color: "white"
						}}
					/>
				)}
			</Fragment>
		);
	}
}

export default compose(
	graphql(openAgenda, {
		name: "openAgenda"
	}),

	graphql(closeAgenda, {
		name: "closeAgenda"
	})
)(ToggleAgendaButton);
