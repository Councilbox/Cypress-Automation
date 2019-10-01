import React from "react";
import { graphql } from "react-apollo";
import { endCouncil } from "../../../../queries/council";
import { AlertConfirm, BasicButton, Icon } from "../../../../displayComponents";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { AGENDA_STATES } from "../../../../constants";
import { bHistory } from "../../../../containers/App";
import { pointIsClosed } from "../../../../utils/CBX";

class EndCouncilButton extends React.Component {

	state = {
		confirmModal: false
	};

	endCouncil = async () => {
		const { council } = this.props;
		const response = await this.props.endCouncil({
			variables: {
				councilId: council.id
			}
		});
		if (!response.errors) {
			bHistory.push(
				`/company/${council.companyId}/council/${
					council.id
				}/finished`
			);
		}
	};

	getUnclosedPoints = () => {
		const { agendas } = this.props.council;
		return agendas.filter(agenda => !pointIsClosed(agenda));
	};


	render() {
		const { translate } = this.props;
		const unclosed = this.getUnclosedPoints();
		const primary = getPrimary();
		const secondary = getSecondary();
		const { agendas } = this.props.council;
		const lastPointClosed = agendas[agendas.length - 1].pointState === AGENDA_STATES.CLOSED;

		return (
			<React.Fragment>
				<div>
					<BasicButton
						text={translate.finish_council}
						id={'finalizarReunionEnReunion'}
						color={lastPointClosed? primary : secondary}
						onClick={() => this.setState({ confirmModal: true })}
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
						buttonStyle={{ minWidth: "13em" }}
						textStyle={{
							color: "white",
							fontSize: "0.75em",
							fontWeight: "700",
							textTransform: "none"
						}}
					/>
				</div>
				<AlertConfirm
					title={translate.finish_council}
					bodyText={
						<React.Fragment>
							{unclosed.length > 0 ? (
								<React.Fragment>
									<div>{translate.unclosed_points_desc}</div>
									<ul>
										{unclosed.map(agenda => {
											return (
												<li
													key={`unclosed${agenda.id}`}
												>
													{agenda.agendaSubject}
												</li>
											);
										})}
									</ul>
								</React.Fragment>
							) : (
								<div>{translate.council_will_be_end}</div>
							)}
						</React.Fragment>
					}
					open={this.state.confirmModal}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					modal={true}
					acceptAction={this.endCouncil}
					requestClose={() => this.setState({ confirmModal: false })}
				/>
			</React.Fragment>
		);
	}
}

export default graphql(endCouncil, {
	name: "endCouncil"
})(EndCouncilButton);
