import React from "react";
import {
	BasicButton,
	ButtonIcon,
	ErrorWrapper,
	LoadingSection
} from "../../../../displayComponents/index";
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from "material-ui/Dialog";
import {
	councilParticipants
} from "../../../../queries/councilParticipant";
import { PARTICIPANTS_LIMITS } from "../../../../constants";
import { getPrimary, getSecondary } from "../../../../styles/colors";
import ParticipantsTable from "./ParticipantsTable";
import * as CBX from "../../../../utils/CBX";
import { councilStepTwo, updateCouncil } from "../../../../queries";
import { compose, graphql } from "react-apollo";
import gql from "graphql-tag";
import EditorStepLayout from '../EditorStepLayout';


class StepCensus extends React.Component {
	state = {
		placeModal: false,
		censusChangeAlert: false,
		addParticipant: false,
		noParticipantsError: false,
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
					},
				}
			}
			if(nextProps.participants){
				if(nextProps.participants.councilParticipants){
					if(nextProps.participants.councilParticipants.total > 0){
						return {
							participantsLength: nextProps.participants.councilParticipants.total
						}
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

	resetButtonStates = () => {
		this.setState({
			loading: false,
			success: false
		})
	}

	saveDraft = async step => {
		this.setState({
			loading: true
		})
		const { __typename, participants, ...council } = this.props.data.council;
		await this.props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
				}
			}
		});

		this.setState({
			loading: false,
			success: true
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

	reloadCensus = () => {
		this.setState({
			censusChangeAlert: true,
			censusChangeId: this.props.data.council.selectedCensusId
		});
	};

	nextPage = () => {
		if(this.state.participantsLength > 0){
			this.saveDraft(3);
			this.props.nextStep();
		} else {
			this.setState({
				noParticipantsError: true
			});
		}
	};

	previousPage = () => {
		this.saveDraft(2);
		this.props.previousStep();
	};

	sendCensusChange = async () => {
		this.setState({
			loading: true
		})
		const response = await this.props.changeCensus({
			variables: {
				censusId: this.state.censusChangeId,
				councilId: this.props.data.council.id
			}
		});
		if (response) {
			this.setState({
				censusChangeAlert: false,
				loading: false
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

	checkParticipants = () => {
		return this.state.participantsLength <= 0;
	}

	render() {
		const { translate } = this.props;
		const { council, error } = this.props.data;
		const primary = getPrimary();
		const secondary = getSecondary();

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

		if(this.state.loading){
			return <LoadingSection />
		}

		return (
			<EditorStepLayout
				body={
					<React.Fragment>
						{!council?
							<div
								style={{
									height: "300px",
									width: "100%",
									display: "flex",
									alignItems: "center",
									justifyContent: "center"
								}}
							>
								<LoadingSection />
							</div>
						:
							<React.Fragment>
								<ParticipantsTable
									translate={translate}
									data={this.props.participants}
									refetch={async type => {
										this.props.data.refetch();
										const participants = await this.props.participants.refetch();
										if(type === 'delete'){
											this.setState({
												participantsLength: participants.data.councilParticipants.total
											})
										}
										//console.log(participants);
									}}
									key={`${this.props.data.council.selectedCensusId}`}
									council={council}
									updateParticipantLength={this.updateParticipantLength}
									handleCensusChange={this.handleCensusChange}
									reloadCensus={this.reloadCensus}
									showAddModal={() => this.setState({ addParticipant: true })}
									censuses={this.props.data.censuses}
									editable={true}
									totalVotes={this.props.data.councilTotalVotes}
									totalSocialCapital={this.props.data.councilSocialCapital}
									participations={CBX.hasParticipations(council)}
								/>
								{this.checkParticipants() &&
									<div
										style={{
											color: 'red',
											fontWeight: '700',
											marginTop: '1em',
											width: '100%',
											display: 'flex',
											justifyContent: 'center'
										}}
									>
										{translate.participants_required}
									</div>

								}
							</React.Fragment>
						}
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
				}
				buttons={
					<React.Fragment>
						<BasicButton
							text={translate.previous}
							color={secondary}
							disabled={this.props.data.loading}
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
							disabled={this.props.data.loading}
							reset={this.resetButtonStates}
							loading={this.state.loading}
							success={this.state.success}
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
							disabled={this.props.data.loading}
							textStyle={{
								color: "white",
								fontWeight: "700",
								fontSize: "0.9em",
								textTransform: "none"
							}}
							textPosition="after"
							onClick={this.nextPage}
						/>
					</React.Fragment>
				}
			/>
		);
	}
}

const changeCensus = gql`
	mutation changeCensus($councilId: Int!, $censusId: Int!) {
		changeCensus(councilId: $councilId, censusId: $censusId){
			success
		}
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
	graphql(councilParticipants, {
		name: 'participants',
		options: props => ({
			variables: {
				councilId: props.councilID,
				options: {
					limit: PARTICIPANTS_LIMITS[0],
					offset: 0,
					orderBy: 'fullName',
					orderDirection: 'asc'
				}
			},
			forceFetch: true,
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(changeCensus,  {
		name: "changeCensus"
	}),
	graphql(updateCouncil, {
		name: "updateCouncil"
	})
)(StepCensus);
