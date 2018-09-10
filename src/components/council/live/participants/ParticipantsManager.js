import React from "react";
import ReactDOM from "react-dom";
import {
	Radio,
	Grid,
	GridItem,
	BasicButton,
	ButtonIcon,
} from "../../../../displayComponents";
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { Paper, Tooltip } from "material-ui";
import LiveParticipantEditor from "./LiveParticipantEditor";
import AddGuestModal from "./AddGuestModal";
import StatesContainer from "./sections/StatesContainer";
import ConveneContainer from "./sections/ConveneContainer";
import CredentialsContainer from "./sections/CredentialsContainer";
import AttendanceContainer from "./sections/AttendanceContainer";
import TypesContainer from "./sections/TypesContainer";


class ParticipantsManager extends React.Component {
	state = {
		addGuest: false,
		layout: 'squares', // table, compact
		loadingMore: false,
		refreshing: false,
		editParticipant: undefined,
		view: 'STATES' // CONVENE, CREDENTIALS, ATTENDANCE, TYPE
	};

	componentDidMount() {
		// this.props.data.refetch();
		ReactDOM.findDOMNode(this.div).focus();
	}

	editParticipant = id => {
		this.setState({
			editParticipant: id
		});
	};

	handleKeyPress = event => {
		const key = event.nativeEvent;
		if (key.altKey) {
			if (key.code === "KeyG") {
				this.setState({ addGuest: true });
			}
		}
	};

	updateState = object => {
		this.setState({
			...object
		});
	};

	changeTableLayout = () => {
		this.setState({
			layout: this.state.layout === 'compact' ? 'full' : 'compact'
		});
	}

	_renderSection = () => {
		let { view, layout } = this.state;
		let { council, translate } = this.props;
		switch (view) {
			case 'STATES':
				return <StatesContainer
					council={council}
					translate={translate}
					layout={layout}
					editParticipant={this.editParticipant}
				/>
			case 'CONVENE':
				return <ConveneContainer
					council={council}
					translate={translate}
					layout={layout}
					editParticipant={this.editParticipant}
				/>
			case 'CREDENTIALS':
				return <CredentialsContainer
					council={council}
					translate={translate}
					layout={layout}
					editParticipant={this.editParticipant}
				/>
			case 'ATTENDANCE':
				return <AttendanceContainer
					council={council}
					translate={translate}
					layout={layout}
					editParticipant={this.editParticipant}
				/>
			case 'TYPE':
				return <TypesContainer
					council={council}
					translate={translate}
					layout={layout}
					editParticipant={this.editParticipant}
				/>
			default:
				return 'Error';
		}
	}

	render() {
		const { translate, council } = this.props;
		const primary = getPrimary();
		const secondary = getSecondary();

		if (!!this.state.editParticipant) {
			return (
				<Paper
					style={{
						height: "100%",
					}}>
					<LiveParticipantEditor
						translate={translate}
						council={council}
						// refetch={this.props.data.refetch}
						id={this.state.editParticipant}
						requestClose={() => {
							this.setState({
								editParticipant: undefined
							});
						}}
					/>
				</Paper>
			)
		}

		return (
			<div
				style={{
					height: "100%",
					width: "100%",
					overflowX: 'hidden',
					padding: 0,
					margin: 0,
					outline: 0
				}}
				tabIndex="0"
				onKeyDown={this.handleKeyPress}
				ref={ref => (this.div = ref)}
			>
				<Grid spacing={0} style={{
					height: "100%",
				}}>
					<GridItem
						xs={9}
						md={9}
						lg={9}
						style={{
							height: "100%",
							overflow: "hidden"
						}}
					>
						<Paper
							style={{
								height: "100%",
							}}
						>
							{this.state.editParticipant}
							{
								this._renderSection()
							}
						</Paper>
					</GridItem>
					<GridItem
						xs={3}
						md={3}
						lg={3}
						style={{
							height: "100%",
							padding: "1em",
							position: "relative"
						}}
					>
						{/* Añadir invitado */}
						<Tooltip title="ALT + G">
							<div>
								<BasicButton
									text={translate.add_guest}
									color={"white"}
									textStyle={{
										color: secondary,
										fontWeight: "700",
										fontSize: "0.9em",
										textTransform: "none",
									}}
									textPosition="after"
									icon={<ButtonIcon type="add" color={secondary} />}
									onClick={() => this.updateState({ addGuest: true })}
									buttonStyle={{
										marginRight: "1em",
										border: `2px solid ${secondary}`,
										width: '100%'
									}}
								/>
							</div>
						</Tooltip>
						<br />
						{/* Vista */}
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<h3>{translate.view || 'VISTA' /*TRADUCIR*/}</h3>
							<Radio
								value={"0"}
								checked={this.state.layout === "compact"}
								onChange={() => this.setState({ layout: 'compact' })}
								name="compact"
								label={translate.compact_table}
							/>
							<Radio
								value={"1"}
								checked={this.state.layout === "table"}
								onChange={() => this.setState({ layout: 'table' })}
								name="table"
								label={translate.table}
							/>
							<Radio
								value={"2"}
								checked={this.state.layout === "squares"}
								onChange={() => this.setState({ layout: 'squares' })}
								name="squares"
								label={translate.grid}
							/>
						</div>
						{/* Ver  */}
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<h3>{translate.see}</h3>
							<Radio
								value={"0"}
								checked={this.state.view === "STATES"}
								onChange={() => this.setState({ view: 'STATES' })}
								name="STATES"
								label={translate.states || 'ESTADOS' /*TRADUCIR*/}
							/>
							<Radio
								value={"4"}
								checked={this.state.view === "TYPE"}
								onChange={() => this.setState({ view: 'TYPE' })}
								name="TYPE"
								label={translate.types || 'TYPE' /*TRADUCIR*/}
							/>
							{council.conveneSendDate &&
								<React.Fragment>
									<Radio
										value={"1"}
										checked={this.state.view === "CONVENE"}
										onChange={() => this.setState({ view: 'CONVENE' })}
										name="CONVENE"
										label={translate.convene || 'CONVENE'}
									/>
									{
										council.confirmAssistance &&
										<Radio
											value={"3"}
											checked={this.state.view === "ATTENDANCE"}
											onChange={() => this.setState({ view: 'ATTENDANCE' })}
											name="ATTENDANCE"
											label={translate.assistance || 'ATTENDANCE'}
										/>
									}
								</React.Fragment>
							}

							{council.videoEmailsDate &&
								<Radio
									value={"2"}
									checked={this.state.view === "CREDENTIALS"}
									onChange={() => this.setState({ view: 'CREDENTIALS' })}
									name="CREDENTIALS"
									label={translate.credentials || 'CREDENTIALS'}
								/>
							}
						</div>
					</GridItem>
					<AddGuestModal
						show={this.state.addGuest}
						council={council}
						// refetch={this.props.data.refetch}
						requestClose={() => this.setState({ addGuest: false })}
						translate={translate}
					/>
				</Grid>
			</div >
		);
	}
}

export default ParticipantsManager;
