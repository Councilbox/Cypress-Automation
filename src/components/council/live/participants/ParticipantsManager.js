import React from "react";
import ReactDOM from "react-dom";
import {
	SwitchButton,
	Grid,
	GridItem,
	SelectInput,
	BasicButton,
	ButtonIcon,
	CollapsibleSection,
	AlertConfirm,
	FilterButton,
} from "../../../../displayComponents";
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { Paper, Tooltip, MenuItem } from "material-ui";
import LiveParticipantEditor from "./LiveParticipantEditor";
import StatesContainer from "./sections/StatesContainer";
import ConveneContainer from "./sections/ConveneContainer";
import CredentialsContainer from "./sections/CredentialsContainer";
import AttendanceContainer from "./sections/AttendanceContainer";
import TypesContainer from "./sections/TypesContainer";
import FontAwesome from "react-fontawesome";
import { isMobile } from 'react-device-detect';


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

	_renderAddGuestButton = () => {
		const secondary = getSecondary();

		return (
			<Tooltip title="ALT + G">
				<div>
					<BasicButton
						text={isMobile? 'Invitar' : this.props.translate.add_guest} //TRADUCCION
						color={"white"}
						textStyle={{
							color: secondary,
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none",
						}}
						textPosition="after"
						type="flat"
						icon={<ButtonIcon type="add" color={secondary} />}
						onClick={() => this.updateState({ addGuest: true })}
						buttonStyle={{
							marginRight: "1em",
							border: `1px solid ${secondary}`,
						}}
					/>
				</div>
			</Tooltip>
		)
	}

	_renderSection = () => {
		let { view, layout, addGuest } = this.state;
		let { council, translate } = this.props;
		switch (view) {
			case 'STATES':
				return <StatesContainer
					council={council}
					translate={translate}
					addGuestButton={this._renderAddGuestButton}
					layout={layout}
					menuOpen={this.state.open}
					editParticipant={this.editParticipant}
					addGuest={addGuest}
					updateState={this.updateState}
				/>
			case 'CONVENE':
				return <ConveneContainer
					council={council}
					addGuestButton={this._renderAddGuestButton}
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
					addGuestButton={this._renderAddGuestButton}
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
					addGuestButton={this._renderAddGuestButton}
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
					addGuestButton={this._renderAddGuestButton}
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
		const secondary = getSecondary();
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
					position: "relative"
				}}
			>
				<div style={{minWidth: '14em'}}>
					<SelectInput
						fullWidth
						floatingText={'Tipo de visualización'} //TRADUCCION
						value={this.state.view}
						onChange={(event => this.setState({ view: event.target.value}))}
					>
						<MenuItem value={'STATES'}>
							{translate.states}
						</MenuItem>
						<MenuItem value={'TYPE'} >
							{translate.types}
						</MenuItem>
						<MenuItem value={'ATTENDANCE'}>
							{translate.assistance}
						</MenuItem>
						<MenuItem value={'CREDENTIALS'}>
							{translate.credentials}
						</MenuItem>
					</SelectInput>
				</div>
				{!isMobile &&
					<React.Fragment>
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
					</React.Fragment>
				}
			</div>
		)
	}

	render() {
		const primary = getPrimary();
		const { translate, council } = this.props;
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
				<AlertConfirm
					open={!!this.state.editParticipant}
					requestClose={() => {
						this.setState({
							editParticipant: undefined
						});
					}}
					bodyText={
						<div style={{height: '70vh'}}>
							<LiveParticipantEditor
								translate={translate}
								council={council}
								//refetch={this.props.data.refetch}
								id={this.state.editParticipant}

							/>
						</div>
					}
				/>
				<i
					className="material-icons"
					style={{
						position: 'absolute',
						zIndex: 1000,
						cursor: 'pointer',
						top: isMobile? '2.5em' : '1.8em',
						right: '1em',
						color: secondary
					}}
					onClick={() => this.setState({open: !this.state.open})}
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
							{
								this._renderSection()
							}
						</Paper>
					</GridItem>
				</Grid>
			</Paper>
		);
	}
}

export default ParticipantsManager;
