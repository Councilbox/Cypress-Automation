import React from "react";
import { compose, graphql } from "react-apollo";
import { closeAgenda, openAgenda, openActPoint } from "../../../queries";
import { BasicButton, Icon } from "../../../displayComponents";
import { getPrimary, getSecondary } from "../../../styles/colors";
import FontAwesome from "react-fontawesome";
import { Tooltip } from "material-ui";
import { getActPointSubjectType } from '../../../utils/CBX';

class ToggleAgendaButton extends React.Component {
	state = {
		sendCredentials: true,
		confirmModal: false
	}

	static getDerivedStateFromProps(nextProps){
		if(nextProps.council){
			return {
				sendCredentials: !nextProps.council.videoEmailsDate
			}
		}

		return null;
	}

	openAgenda = async () => {
		const { agenda } = this.props;
		if(agenda.subjectType === getActPointSubjectType()){
			const response = await this.props.openActPoint({
				variables: {
					councilId: agenda.councilId
				}
			});
			if (response) {
				this.props.refetch();
			}
		}else{
			const response = await this.props.openAgenda({
				variables: {
					agendaId: agenda.id,
					councilId: agenda.councilId
				}
			});
			if (response) {
				this.props.refetch();
			}
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


	render() {
		const { translate, agenda, active } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
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
			</React.Fragment>
		);
	}
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
