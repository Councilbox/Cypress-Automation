import React from 'react';
import { Tooltip } from 'material-ui';
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
} from '../../../../../displayComponents';
import { getSecondary } from '../../../../../styles/colors';
import withWindowSize from '../../../../../HOCs/withWindowSize';
import ParticipantsList from '../ParticipantsList';
import AddGuestModal from '../AddGuestModal';
import StatesHeader from './StatesHeader';
import TypesHeader from './TypesHeader';
import AttendanceHeader from './AttendanceHeader';
import CredentialsHeader from './CredentialsHeader';
import ConveneHeader from './ConveneHeader';
import RefreshCredsSendsButton from '../RefreshCredsSendsButton';
import QRSearchModal from './QRSearchModal';
import { ConfigContext } from '../../../../../containers/AppControl';
import { isMobile } from '../../../../../utils/screen';
import AddConvenedParticipantButton from '../../../prepare/modals/AddConvenedParticipantButton';
import { councilStarted, hasParticipations } from '../../../../../utils/CBX';
import { COUNCIL_TYPES } from '../../../../../constants';
import DropdownParticipant from '../../../../../displayComponents/DropdownParticipant';


const ParticipantsPage = ({
	translate, council, orientation, participants, loading, data, filters, setFilters, ...props
}) => {
	const [addGuest, setAddGuest] = React.useState(false);
	const [QRModal, setQRModal] = React.useState(false);
	const [widthOffset, setwidthOffset] = React.useState(false);
	const secondary = getSecondary();
	const config = React.useContext(ConfigContext);
	const divWidth = React.useRef();
	const getFilters = () => [
		{
			value: 'fullName',
			translation: translate.participant_data
		},
		{
			value: 'dni',
			translation: translate.dni
		},
		{
			value: 'position',
			translation: translate.position
		}
	];

	React.useLayoutEffect(() => {
		if (divWidth && divWidth.current && divWidth.current.offsetWidth < 648) {
			setwidthOffset(true);
		}
	});


	const renderAddGuestButton = () => {
		if (council.councilType === COUNCIL_TYPES.ONE_ON_ONE) {
			return null;
		}

		return (
			<Tooltip title="ALT + G">
				<div>
					<BasicButton
						text={isMobile ? translate.invite_guest : translate.add_guest}
						color={'white'}
						textStyle={{
							color: secondary,
							fontWeight: '700',
							fontSize: '0.9em',
							textTransform: 'none',
						}}
						textPosition="after"
						type="flat"
						icon={<ButtonIcon type="add" color={secondary} />}
						onClick={() => setAddGuest(true)}
						buttonStyle={{
							marginRight: '1em',
							border: `1px solid ${secondary}`,
						}}
					/>
				</div>
			</Tooltip>
		);
	};

	const toggleCharFilter = char => {
		setFilters({
			charFilter: char === filters.charFilter ? null : char
		});
	};

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
		const currentLength = data[getSection(props.view)].list.length;
		setFilters({ limit: currentLength + 24 });
	};

	const toggleOnlyNotSigned = () => {
		setFilters({
			onlyNotSigned: !filters.onlyNotSigned
		});
	};

	const renderHeader = () => {
		if (!data[getSection(props.view)]) {
			return <div style={{
				width: '100%',
				borderBottom: '1px solid gainsboro',
			}} />;
		}

		const headers = {
			STATES: <StatesHeader
				translate={translate}
				stateRecount={data.stateRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			ATTENDANCE: <AttendanceHeader
				translate={translate}
				attendanceRecount={data.attendanceRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			CREDENTIALS: <CredentialsHeader
				translate={translate}
				crendentialSendRecount={data.crendentialSendRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			TYPE: <TypesHeader
				translate={translate}
				participantTypeRecount={data.participantTypeRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,

			CONVENE: <ConveneHeader
				translate={translate}
				conveneSendRecount={data.conveneSendRecount}
				selected={filters.type}
				setSelected={setSelectedType}
			/>,
		};
		return headers[props.view];
	};
	const fields = getFilters();

	console.log(council);
	return (
		<React.Fragment>
			<div
				style={{
					minHeight: '3em',
					maxHeight: !isMobile && '6em',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				{renderHeader()}
				<div style={{
					padding: '.2rem',
					borderBottom: '1px solid gainsboro',
					display: 'flex',
					alignItems: 'center',
					justifyContent: isMobile && 'flex-end',
					paddingRight: '1.313rem'
				}}>
					<BasicButton
						onClick={() => {
							props.updateMenu(!props.menuOpen);
						}}
						buttonStyle={{
							minWidth: '0',
							minHeight: '0',
							width: '2.5rem',
							height: '2.5rem',
							backgroundColor: props.menuOpen ? '#d5d5d5' : 'white',
							boxShadow: '0px 1px 5px 0px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 3px 1px -2px rgb(0 0 0 / 12%)'
						}}
						icon={
							<i
								className="material-icons"
								style={{
									color: secondary,
									fontSize: '1.5rem'
								}}
							>
								settings
							</i>}
					/>
				</div>
			</div>
			<Grid style={{
				padding: '0 8px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.5rem'
			}}>
				<GridItem xs={orientation === 'landscape' ? 4 : 6} md={6} lg={3} style={{ display: 'flex', alignItems: 'center' }}>
					{(council.state === 10 || council.state === 20)
						&& (!councilStarted(council) ? <DropdownParticipant
							council={council}
							participations={participants}
							refetch={data.refetch}
							translate={translate}
							style={{
								width: '10em',
								padding: '.2rem',
								margin: '0 .5rem',
							}} />
							: renderAddGuestButton()
						)}
				</GridItem>
				<GridItem xs={orientation === 'landscape' ? 4 : 6} md={6} lg={3} style={{ display: 'flex', justifyContent: orientation === 'landscape' ? 'flex-start' : 'flex-end', gap: '0 .5rem' }}>
					<BasicButton
						text={<span style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							display: 'block',
						}}>{filters.onlyNotSigned ? translate.show_all : translate.show_unsigned}
						</span>}
						color='white'
						type="flat"
						textStyle={{
							color: secondary,
							fontWeight: '700',
							border: `1px solid ${secondary}`,
						}}
						onClick={toggleOnlyNotSigned}
					/>
					{props.root
						&& <AddConvenedParticipantButton
							participations={hasParticipations(council)}
							translate={translate}
							councilId={council.id}
							refetch={data.refetch}
							council={council}
						/>
					}

					{props.view === 'CREDENTIALS'
						&& <RefreshCredsSendsButton translate={translate} council={council} />
					}
				</GridItem>
				<GridItem xs={orientation === 'landscape' ? 12 : 12} md={12} lg={6}
					style={{
						display: 'flex',
						maxHeight: '4em',
						alignItems: 'center',
						zIndex: '1',
						justifyContent: orientation === 'portrait' ? 'space-between' : 'flex-end'
					}}>
					{orientation === 'landscape' && isMobile
						&& <CharSelector
							onClick={toggleCharFilter}
							translate={translate}
							selectedChar={filters.charFilter}
						/>
					}
					{(config.quickAccess && council.councilType < 2)
						&& <React.Fragment>
							<QRSearchModal
								open={QRModal}
								translate={translate}
								council={council}
								requestClose={() => setQRModal(false)}
							/>
							<div
								style={{
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
								<i className="fa fa-qrcode" aria-hidden="true" style={{ fontSize: '2em', marginLeft: '5px', color: secondary }}></i>
							</div>
						</React.Fragment>
					}
					<div
						style={{
							maxWidth: '8em'
							// maxWidth: "12em"
						}}
					>
						<SelectInput
							// floatingText={translate.filter_by}
							value={filters.filterField}
							onChange={event => updateFilterField(event.target.value)
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
							marginLeft: '0.8em',
							width: '8em'
							// width: '10em'
						}}
					>
						<TextInput
							adornment={<Icon>search</Icon>}
							floatingText={' '}
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
				ref={divWidth}
				style={{
					height: `calc(100% - 4em - ${isMobile && orientation === 'portrait' ? '8em' : `${props.menuOpen ? '6.5' : widthOffset ? '9.5' : '3.5'}em`}  )`,
					overflow: 'hidden',
					display: 'flex',
				}}
			>
				{(!isMobile || orientation !== 'landscape')
					&& <CharSelector
						onClick={toggleCharFilter}
						translate={translate}
						selectedChar={filters.charFilter}
					/>
				}
				{!data[getSection(props.view)] ?
					<LoadingSection />
					: <ParticipantsList
						loadMore={loadMore}
						loading={loading}
						root={props.root}
						loadingMore={loading}
						renderHeader={renderHeader}
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
	);
};

const getSection = view => {
	const sections = {
		STATES: 'liveParticipantsState',
		ATTENDANCE: 'liveParticipantsAttendance',
		CREDENTIALS: 'liveParticipantsCredentials',
		TYPE: 'liveParticipantsType',
		CONVENE: 'liveParticipantsConvene'
	};
	return sections[view];
};

export default withWindowSize(ParticipantsPage);
