import React from "react";
import {
	BasicButton,
	ButtonIcon,
	ErrorWrapper,
	Grid,
	GridItem,
	LoadingSection
} from "../../../../displayComponents/index";
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from "material-ui/Dialog";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import ParticipantsTable from "./ParticipantsTable";
import * as CBX from "../../../../utils/CBX";
import { councilStepTwo, updateCouncil } from "../../../../queries";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import CouncilHeader from '../CouncilHeader';


class StepCensus extends React.Component {
	state = {
		placeModal: false,
		censusChangeAlert: false,
		addParticipant: false,
		censusChangeId: "",
		data: {
			censuses: []
		}
	};

	componentDidMount() {
		this.props.data.refetch();
	}

	static getDerivedStateFromProps(nextProps, prevState){
		if(!nextProps.data.loading){
			if(nextProps.data.council.id !== prevState.data.id){
				const { __typename, statute, ...council } = nextProps.data.council;
				return {
					data: {
						...council
					}
				}
			}
		}

		return null;
	}

	closeAddParticipantModal = () => {
		this.setState({
			addParticipant: false
		});
	};

	saveDraft = step => {
		const { __typename, participants, ...council } = this.props.data.council;
		this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
				}
			}
		});
	};
	handleCensusChange = event => {
		if (event.target.value !== this.props.data.council.selectedCensusId) {
			this.setState({
				censusChangeAlert: true,
				censusChangeId: event.target.value
			});
		}
	};
	
	nextPage = () => {
		this.saveDraft(3);
		this.props.nextStep();
	};

	previousPage = () => {
		this.saveDraft(2);
		this.props.previousStep();
	};

	sendCensusChange = async () => {
		const response = await this.props.mutate({
			variables: {
				censusId: this.state.censusChangeId,
				councilId: this.props.councilID
			}
		});
		if (response) {
			this.setState({
				censusChangeAlert: false
			});
			const newData = await this.props.data.refetch();
			if (newData) {
				this.setState({
					data: {
						...this.state.data,
						...newData.data.council
					}
				});
			}
		}
	};

	_renderCensusChangeButtons() {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<BasicButton
					text={translate.cancel}
					color={"white"}
					textStyle={{
						color: primary,
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					textPosition="after"
					onClick={() => this.setState({ censusChangeAlert: false })}
					buttonStyle={{ marginRight: "1em" }}
				/>
				<BasicButton
					text={translate.want_census_change}
					color={primary}
					textStyle={{
						color: "white",
						fontWeight: "700",
						fontSize: "0.9em",
						textTransform: "none"
					}}
					icon={<ButtonIcon type="save" color="white" />}
					textPosition="after"
					onClick={this.sendCensusChange}
				/>
			</React.Fragment>
		);
	}

	render() {
		const { translate } = this.props;
		const { council, loading, error } = this.props.data;
		const primary = getPrimary();
		const secondary = getSecondary();

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return (
				<div
					style={{
						width: "100%",
						height: "100%",
						padding: "2em"
					}}
				>
					<ErrorWrapper error={error} translate={translate} />
				</div>
			);
		}

		return (
			<div
				style={{
					width: "100%",
					height: "100%"
				}}
			>
				<React.Fragment>
					<CouncilHeader
						translate={translate}
						council={council}
					/>
					<ParticipantsTable
						translate={translate}
						council={council}
						handleCensusChange={this.handleCensusChange}
						showAddModal={() =>
							this.setState({ addParticipant: true })
						}
						censuses={this.props.data.censuses}
						editable={true}
						totalVotes={this.props.data.councilTotalVotes}
						totalSocialCapital={
							this.props.data.councilSocialCapital
						}
						participations={CBX.hasParticipations(council)}
					/>
					<br />
					<Grid>
						<GridItem xs={12}>
							<div style={{ float: "right" }}>
								<BasicButton
									text={translate.previous}
									color={secondary}
									textStyle={{
										color: "white",
										fontWeight: "700",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									textPosition="after"
									onClick={this.previousPage}
								/>
								<BasicButton
									text={translate.save}
									color={secondary}
									textStyle={{
										color: "white",
										fontWeight: "700",
										fontSize: "0.9em",
										marginLeft: "0.5em",
										marginRight: "0.5em",
										textTransform: "none"
									}}
									icon={
										<ButtonIcon type="save" color="white" />
									}
									textPosition="after"
									onClick={() => this.saveDraft(2)}
								/>
								<BasicButton
									text={translate.table_button_next}
									color={primary}
									textStyle={{
										color: "white",
										fontWeight: "700",
										fontSize: "0.9em",
										textTransform: "none"
									}}
									textPosition="after"
									onClick={this.nextPage}
								/>
							</div>
						</GridItem>
					</Grid>
					<Dialog
						disableBackdropClick={false}
						open={this.state.censusChangeAlert}
						onClose={() =>
							this.setState({ censusChangeAlert: false })
						}
					>
						<DialogTitle>{translate.census_change}</DialogTitle>
						<DialogContent>
							{translate.census_change_warning.replace(
								"<br/>",
								""
							)}
						</DialogContent>
						<DialogActions>
							{this._renderCensusChangeButtons()}
						</DialogActions>
					</Dialog>
				</React.Fragment>
			</div>
		);
	}
}

const changeCensus = gql`
	mutation ChangeCensus($councilId: Int!, $censusId: Int!) {
		changeCensus(councilId: $councilId, censusId: $censusId)
	}
`;

export default compose(
	graphql(councilStepTwo, {
		name: "data",
		options: props => ({
			variables: {
				id: props.councilID,
				companyId: props.companyID
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(changeCensus),
	graphql(updateCouncil, {
		name: "updateCouncil"
	})
)(StepCensus);
