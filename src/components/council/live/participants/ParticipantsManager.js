import React from "react";
import ReactDOM from "react-dom";
import {
	Grid,
	GridItem,
	SelectInput,
	CollapsibleSection,
	FilterButton,
} from "../../../../displayComponents";
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { Paper, MenuItem } from "material-ui";
import StatesContainer from "./sections/StatesContainer";
import ConveneContainer from "./sections/ConveneContainer";
import CredentialsContainer from "./sections/CredentialsContainer";
import AttendanceContainer from "./sections/AttendanceContainer";
import TypesContainer from "./sections/TypesContainer";
import FontAwesome from "react-fontawesome";
import { isMobile } from 'react-device-detect';


class ParticipantsManager extends React.Component {
	state = {
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

	toggleSettings = () => {
		const newValue = !this.state.open
		this.setState({open: newValue});
	}

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
		let { view, layout, addGuest } = this.state;
		let { council, translate } = this.props;
		switch (view) {
			case 'STATES':
				return <StatesContainer
					council={council}
					translate={translate}
					layout={layout}
					menuOpen={this.state.open}
					editParticipant={this.editParticipant}
					addGuest={addGuest}
					updateState={this.updateState}
				/>
			case 'CONVENE':
				return <ConveneContainer
					council={council}
					translate={translate}
					layout={layout}
					menuOpen={this.state.open}
					editParticipant={this.editParticipant}
					addGuest={addGuest}
					updateState={this.updateState}
				/>
			case 'CREDENTIALS':
				return <CredentialsContainer
					council={council}
					translate={translate}
					layout={layout}
					menuOpen={this.state.open}
					editParticipant={this.editParticipant}
					addGuest={addGuest}
					updateState={this.updateState}
				/>
			case 'ATTENDANCE':
				return <AttendanceContainer
					council={council}
					translate={translate}
					layout={layout}
					menuOpen={this.state.open}
					editParticipant={this.editParticipant}
					addGuest={addGuest}
					updateState={this.updateState}
				/>
			case 'TYPE':
				return <TypesContainer
					council={council}
					translate={translate}
					layout={layout}
					menuOpen={this.state.open}
					editParticipant={this.editParticipant}
					addGuest={addGuest}
					updateState={this.updateState}
				/>
			default:
				return 'Error';
		}
	}

	_renderTableOptions = () => {
		const { translate } = this.props;
		const primary = getPrimary();

		return (
			<div
				style={{
					display: 'flex',
					width: '100%',
					justifyContent: 'flex-end',
					alignItems: 'center',
					backgroundColor: 'white',
					borderBottom: '1px solid gainsboro',
					position: "relative",
					overflow: 'hidden'
				}}
			>
				<div style={{overflow: 'hidden', marginRight: '0.6em', display: 'flex'}}>
					<FilterButton
						tooltip={translate.grid}
						onClick={() => this.setState({ layout: 'squares' })}
						active={this.state.layout === "squares"}
						size= {'2.55em'}
					>
						<FontAwesome
							name={"th-large"}
							style={{
								color: primary,
								fontSize: "0.9em"
							}}
						/>
					</FilterButton>
					<FilterButton
						tooltip={translate.table}
						onClick={() => this.setState({ layout: 'table' })}
						active={this.state.layout === "table"}
						size= {'2.55em'}
					>
						<FontAwesome
							name={"th-list"}
							style={{
								color: primary,
								fontSize: "0.9em"
							}}
						/>
					</FilterButton>
				</div>

				<div style={{minWidth: '14em'}}>
					<SelectInput
						fullWidth
						floatingText={translate.visualization_type}
						value={this.state.view}
						onChange={(event => this.setState({ view: event.target.value}))}
					>
						<MenuItem value={'STATES'}>
							{translate.by_participant_state}
						</MenuItem>
						<MenuItem value={'TYPE'}>
							{translate.by_participant_type}
						</MenuItem>
						<MenuItem value={'ATTENDANCE'}>
							{translate.assistance_intention}
						</MenuItem>
						<MenuItem value={'CREDENTIALS'}>
							{translate.by_attend_intention}
						</MenuItem>
					</SelectInput>
				</div>
			</div>
		)
	}

	render() {
		const secondary = getSecondary();

		return (
			<Paper
				style={{
					width: "calc(100% - 1.2em)",
					height: "calc(100% - 1.2em)",
					overflowX: 'hidden',
					padding: 0,
					margin: '0.6em',
					outline: 0
				}}
				tabIndex="0"
				onKeyDown={this.handleKeyPress}
				ref={ref => (this.div = ref)}
			>
				<i
					className="material-icons"
					style={{
						position: 'absolute',
						zIndex: 600,
						cursor: 'pointer',
						top: isMobile? '2.5em' : '1.8em',
						right: '1em',
						color: secondary
					}}
					onClick={this.toggleSettings}
				>
					settings
				</i>
				<Grid spacing={0} style={{
					height: "100%",
				}}>
					<GridItem
						xs={12}
						md={12}
						lg={12}
						style={{
							height: "100%",
							overflow: 'hidden'
						}}
					>
						<Paper
							style={{
								height: "100%",
								position: 'relative'
							}}
						>
							<CollapsibleSection
								trigger={() => <span/>}
								open={this.state.open}
								collapse={this._renderTableOptions}
							/>
							{this.state.editParticipant}
							{this._renderSection()}
						</Paper>
					</GridItem>
				</Grid>
			</Paper>
		);
	}
}

export default ParticipantsManager;
