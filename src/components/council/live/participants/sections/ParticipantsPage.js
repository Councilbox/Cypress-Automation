import React from "react";
import {
	LoadingSection,
	Grid,
	GridItem,
	Icon,
	SelectInput,
	BasicButton,
	ButtonIcon,
	CharSelector,
	MenuItem,
	TextInput
} from "../../../../../displayComponents";
import { Tooltip } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { getSecondary } from "../../../../../styles/colors";
import withWindowSize from "../../../../../HOCs/withWindowSize";
import ParticipantsList from "../ParticipantsList";
import AddGuestModal from "../AddGuestModal";
import StatesHeader from './StatesHeader';
import TypesHeader from './TypesHeader';
import AttendanceHeader from './AttendanceHeader';
import CredentialsHeader from './CredentialsHeader';
import ConveneHeader from './ConveneHeader';
import RefreshCredsSendsButton from "../RefreshCredsSendsButton";
import QRSearchModal from "./QRSearchModal";


const ParticipantsPage = ({ translate, council, orientation, participants, loading, data, filters, setFilters, ...props }) => {
	const [addGuest, setAddGuest] = React.useState(false);
	const [QRModal, setQRModal] = React.useState(false);
	const secondary = getSecondary();

	const _getFilters = () => {
		return [
			{
				value: "fullName",
				translation: translate.participant_data
			},
			{
				value: "dni",
				translation: translate.dni
			},
			{
				value: "position",
				translation: translate.position
			}
		];
	}

	const _renderAddGuestButton = () => {
		return (
			<Tooltip title="ALT + G">
				<div>
					<BasicButton
						text={isMobile? translate.invite_guest : translate.add_guest}
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
						onClick={() => setAddGuest(true)}
						buttonStyle={{
							marginRight: "1em",
							border: `1px solid ${secondary}`,
						}}
					/>
				</div>
			</Tooltip>
		)
	}

	const toggleCharFilter = char => {
		setFilters({
			charFilter: char === filters.charFilter? null : char
		});
	}

	const setSelectedType = newValue => {
		setFilters({ type: newValue });
	};

	const updateFilterField = value => {
		setFilters({
			filterField: value
		});
	};

	const updateFilterText = async value => {
		setFilters({
			filterText: value
		});
	};

	const loadMore = () => {
		const currentLength = data.liveParticipantsState.list.length;
		setFilters({ limit: currentLength + 24 });
	};

	const toggleOnlyNotSigned = () => {
		setFilters({
			onlyNotSigned: !filters.onlyNotSigned
		})
	}

	const _renderHeader = () => {

		if(!data[getSection(props.view)]){
			return <div/>
		}

		const headers = {
			'STATES': <StatesHeader
				translate={translate}
				stateRecount={data.stateRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			'ATTENDANCE': <AttendanceHeader
				translate={translate}
				attendanceRecount={data.attendanceRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			'CREDENTIALS': <CredentialsHeader
				translate={translate}
				crendentialSendRecount={data.crendentialSendRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			'TYPE': <TypesHeader
				translate={translate}
				participantTypeRecount={data.participantTypeRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			'CONVENE': <ConveneHeader
				translate={translate}
				conveneSendRecount={data.conveneSendRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,
		}
		return headers[props.view];
	};
	const fields = _getFilters();

	return (
		<React.Fragment>
			<div
				style={{
					minHeight: "3em",
					maxHeight: '6em',
					overflow: "hidden"
				}}
			>
				{_renderHeader()}
			</div>
			<QRSearchModal
				open={QRModal}
				translate={translate}
				council={council}
				requestClose={() => setQRModal(false)}
			/>
			<Grid style={{ padding: "0 8px", width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<GridItem xs={orientation === 'landscape'? 2 : 6} md={3} lg={3} style={{display: 'flex', alignItems: 'center', height: '3.5em'}}>
					{_renderAddGuestButton()}
				</GridItem>
				<GridItem xs={orientation === 'landscape'? 4 : 6} md={3} lg={3} style={{display: 'flex', justifyContent: orientation === 'landscape'? 'flex-start' : 'flex-end'}}>
					<BasicButton
						text={filters.onlyNotSigned? translate.show_all : translate.show_unsigned}
						color='white'
						buttonStyle={{marginRight: '1em'}}
						type="flat"
						textStyle={{color: secondary, fontWeight: '700', border: `1px solid ${secondary}`}}
						onClick={toggleOnlyNotSigned}
					/>
					{props.view === 'CREDENTIALS' &&
						<RefreshCredsSendsButton translate={translate} council={council} />
					}
				</GridItem>
				<GridItem xs={orientation === 'landscape'? 6 : 12} md={6} lg={6} style={{display: 'flex', height: '4em', alignItems: 'center', justifyContent: orientation === 'portrait'? 'space-between' : 'flex-end'}}>
					{orientation === 'landscape' && isMobile &&
						<CharSelector
							onClick={toggleCharFilter}
							translate={translate}
							selectedChar={filters.charFilter}
						/>
					}
					<div style={{
							height: '100%',
							display: 'flex',
							padding: '0.6em',
							marginRight: '1em',
							alignItems: 'center',
							justifyContent: 'center',
							border: '1px solid gainsboro',
							cursor: 'pointer'
						}}
						className="withShadow"
						onClick={() => setQRModal(true)}
					>
						<i className="fa fa-qrcode" aria-hidden="true" style={{fontSize: '2em', marginLeft: '5px', color: secondary}}></i>
					</div>
					<div
						style={{
							maxWidth: "12em"
						}}
					>
						<SelectInput
							// floatingText={translate.filter_by}
							value={filters.filterField}
							onChange={event =>
								updateFilterField(event.target.value)
							}
						>
							{fields.map(field => (
								<MenuItem
									key={`field_${field.value}`}
									value={field.value}
								>
									{field.translation}
								</MenuItem>
							))}
						</SelectInput>
					</div>
					<div
						style={{
							marginLeft: "0.8em",
							width: '10em'
						}}
					>
						<TextInput
							adornment={<Icon>search</Icon>}
							floatingText={" "}
							type="text"
							autoComplete="off"
							value={filters.filterText}
							onChange={event => {
								updateFilterText(event.target.value);
							}}
						/>
					</div>
				</GridItem>
			</Grid>
			<div
				style={{
					height: `calc(100% - 4em - ${isMobile && orientation === 'portrait'? '8em' : `${props.menuOpen? '6.5' : '3.5'}em`} )`,
					overflow: "hidden",
					display: 'flex',
				}}
			>
				{(!isMobile || orientation !== 'landscape') &&
					<CharSelector
						onClick={toggleCharFilter}
						translate={translate}
						selectedChar={filters.charFilter}
					/>
				}
				{!data[getSection(props.view)]?
					<LoadingSection />
				:
					<ParticipantsList
						loadMore={loadMore}
						loading={loading}
						loadingMore={loading}
						renderHeader={_renderHeader}
						refetch={data.refetch}
						participants={data[getSection(props.view)]}
						layout={props.layout}
						council={council}
						translate={translate}
						editParticipant={props.editParticipant}
						mode={props.view}
					/>
				}
			</div>
			<AddGuestModal
				show={addGuest}
				council={council}
				refetch={data.refetch}
				requestClose={() => setAddGuest(false)}
				translate={translate}
			/>
		</React.Fragment>
	)
}

const getSection = view => {
	const sections = {
        'STATES': 'liveParticipantsState',
        'ATTENDANCE': 'liveParticipantsAttendance',
        'CREDENTIALS': 'liveParticipantsCredentials',
        'TYPE': 'liveParticipantsType',
        'CONVENE': 'liveParticipantsConvene'
	}
	return sections[view];
}

export default withWindowSize(ParticipantsPage);