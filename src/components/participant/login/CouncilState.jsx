import React from 'react';
import {
	CardHeader,
	Dialog,
	DialogTitle,
	DialogContent,
	Card
} from 'material-ui';
import FontAwesome from 'react-fontawesome';
import withTranslations from '../../../HOCs/withTranslations';
import withWindowSize from '../../../HOCs/withWindowSize';
import withWindowOrientation from '../../../HOCs/withWindowOrientation';
import OverFlowText from '../../../displayComponents/OverFlowText';
import {
	councilIsInTrash,
	councilIsNotLiveYet,
	councilIsNotCelebrated,
	councilIsFinished,
	councilIsLive,
	checkHybridConditions
} from '../../../utils/CBX';
import {
	getPrimary,
	lightTurquoise,
	getSecondary
} from '../../../styles/colors';
import emptyMeetingTable from '../../../assets/img/empty_meeting_table.png';
import logoIcon from '../../../assets/img/logo-icono.png';
import { moment } from '../../../containers/App';
import { isMobile } from '../../../utils/screen';
import ContactModal from './ContactModal';
import ContactForm from './ContactForm';
import ResultsTimeline from '../ResultsTimeline';
import CouncillParticipantSurvey from '../survey/CouncillParticipantSurvey';
import { Grid, GridItem } from '../../../displayComponents';


const styles = {
	container: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		position: 'relative'
	},
	splittedContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		position: 'relative'
	},
	textContainer: {
		padding: isMobile ? '' : '15px',
		textAlign: 'center'
	},
	imageContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '15px'
	},
	image: {
		maxWidth: '60%'
	},
	textAndImage: {
		display: 'flex',
		alignItems: 'center',
		background: 'blue'
	},
	displaiFlex: {
		display: 'flex'
	},
	bottom1: {
		marginBottom: '1em'
	},
	bottom2: {
		marginBottom: '2em'
	},
};


const CouncilState = ({
	translate, council, company, windowSize, windowOrientation, isAssistance, selectHeadFinished, ...props
}) => {
	const [modal, setModal] = React.useState(false);
	const [state, setState] = React.useState({
		width: window.innerWidth,
		height: window.innerHeight,
		expanded: false
	});
	const primary = getPrimary();

	const updateDimensions = () => {
		setState({
			width: window.innerWidth,
			height: window.innerHeight
		});
	};

	const closeContactModal = () => {
		setModal(false);
	};

	const renderCouncilSurvey = () => (
		<CouncillParticipantSurvey
			translate={translate}
			participant={props.participant}
			council={council}
		/>
	);


	const getBody = () => {
		if (councilIsInTrash(council)) {
			return (
				<StateContainer
					widths={state.width}
					heights={state.height}
					windowOrientation={windowOrientation}
				>
					<GridItem lg={6} md={6} xs={12}>
						<TextRender
							title={translate.we_are_sorry}
							text={translate.not_held_council}
							council={council}
							company={company}
							translate={translate}
						/>
					</GridItem>
					<GridItem lg={6} md={6} xs={12}>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
						/>
					</GridItem>
				</StateContainer>
			);
		}

		if (isAssistance && councilIsLive(council)) {
			return (
				<StateContainer
					widths={state.width}
					heights={state.height}
					windowOrientation={windowOrientation}
				>
					<GridItem lg={6} md={6} xs={12}>
						<TextRender
							title={translate.we_are_sorry}
							text={translate.room_opened_use_access_link}
							isHtmlText={true}
							council={council}
							company={company}
							translate={translate}
							styles={styles}
							windowOrientation={windowOrientation}
						/>
					</GridItem>
					<GridItem lg={6} md={6} xs={12}>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
						/>
					</GridItem>
				</StateContainer>
			);
		}

		if (!isAssistance && councilIsNotLiveYet(council)) {
			return (
				<StateContainer
					widths={state.width}
					heights={state.height}
					windowOrientation={windowOrientation}
				>
					<GridItem lg={6} md={6} xs={12}>
						<TextRender
							title={translate.we_are_sorry}
							text={translate.council_not_started_yet_retry_later}
							isHtmlText={true}
							council={council}
							company={company}
							translate={translate}
						/>
					</GridItem>
					<GridItem lg={6} md={6} xs={12}>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
						/>
					</GridItem>
				</StateContainer>
			);
		}

		if (councilIsNotCelebrated(council)) {
			return (
				<StateContainer
					widths={state.width}
					heights={state.height}
					windowOrientation={windowOrientation}
				>
					<GridItem lg={6} md={6} xs={12}>
						<TextRender
							title={translate.we_are_sorry}
							text={translate.not_held_council}
							council={council}
							company={company}
							translate={translate}
						/>
					</GridItem>
					<GridItem lg={6} md={6} xs={12}>
						<Image
							src={emptyMeetingTable}
							widths={state.width}
							windowOrientation={windowOrientation}
						/>
					</GridItem>
				</StateContainer>
			);
		}

		if (councilIsFinished(council) || props.participant.hasVoted || checkHybridConditions(council)) {
			return (
				<React.Fragment>
					{isMobile ?
						<div style={{
							width: '100%',
							padding: '0.5em',
							paddingTop: '1.5em',
							fontSize: '15px'
						}}>
							<div style={{
								width: '100%',
								background: 'white',
								padding: '0.8em 1em',
								borderRadius: '3px',
								boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)'
							}}>
								<div>
									<h3 style={{
										color: primary,
										fontSize: '28px',
										paddingTop: '0.5em'
									}}
									>
										{props.participant.hasVoted ? translate.participation_summary
											:
											checkHybridConditions(council) ?
												'Votaciones remotas finalizadas' // TRADUCCION
												:
												translate.concil_finished}
									</h3>
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1em' }}>
									<div>
										<div style={{ display: 'flex', marginBottom: '1em', fontWeight: '900' }} >
											{council.name}
										</div>
										<div style={{ display: 'flex' }} >
											-
										</div>
									</div>
									<div>
										<Image
											src={emptyMeetingTable}
											style={{ width: '77px', minWidth: '', marginLeft: '2em' }}
											windowOrientation={windowOrientation}
										>
										</Image>
									</div>
								</div>
								{renderCouncilSurvey()}
							</div>
							<div style={{
								marginTop: '1em',
								background: 'white',
								padding: '0.5em',
								boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
								border: 'solid 1px #d7d7d7'
							}}>
								<div>
									{council.dateEnd ? moment(council.dateEnd).format('LLL') : '-'}
								</div>
							</div>
							<div style={{
								marginTop: '1em',
								background: 'white',
								padding: '0.5em',
								boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
								border: 'solid 1px #d7d7d7'
							}}>
								<div style={{ padding: '1em 1em' }}>
									<div style={{ textAlign: 'center' }}>
										{translate.my_participation} - <span style={{ color: primary }}>{`${props.participant.name} ${props.participant.surname}` || ''}</span>
									</div>
									<div style={{ marginTop: '1em', paddingBottom: '1em' }}>
										{selectHeadFinished === 'participacion' &&
											<ResultsTimeline
												disableScroll={true}
												council={council}
												participant={props.participant}
												translate={translate}
												endPage={true}
											/>
										}
										{selectHeadFinished === 'contactAdmin' &&
											<ContactForm
												participant={props.participant}
												translate={translate}
												council={council}
											/>
										}
									</div>
								</div>
							</div>
						</div>
						:
						<div style={{
							width: '100%',
							padding: '0.5em',
							paddingTop: '1.5em',
							fontSize: '15px'
						}}>
							<div style={{
								width: '100%',
								background: 'white',
								padding: '0.8em 1em',
								borderRadius: '3px',
								boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)'
							}}>
								<div style={{
									display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1em', marginBottom: '2em'
								}}>
									<div>
										<h3 style={{
											color: primary,
											fontSize: '28px',
											paddingTop: '0.5em',
											marginBottom: '0px'
										}}
										>
											{props.participant.hasVoted ? translate.participation_summary
												:
												checkHybridConditions(council) ?
													'Votaciones remotas finalizadas' // TRADUCCION
													:
													translate.concil_finished}
										</h3>
										<div style={{
											color: primary,
											paddingBottom: '0.5em',
										}}>
											{council.dateEnd ? moment(council.dateEnd).format('LLL') : '-'}
										</div>
									</div>
									<div>
										<Image
											src={emptyMeetingTable}
											style={{ width: '90px', minWidth: '', marginLeft: '1em' }}
											windowOrientation={windowOrientation}
										>
										</Image>
									</div>
								</div>
								<div style={{ display: 'flex', justifyContent: 'center', padding: '0 1em' }}>
									<div>
										<div style={{
											display: 'flex', marginBottom: '1em', fontWeight: '900', color: '#000000'
										}} >
											{council.name}
										</div>
									</div>
								</div>
								<div>
									{renderCouncilSurvey()}
								</div>
							</div>
							<div style={{
								marginBottom: '1.5em',
								marginTop: '1em',
								background: 'white',
								padding: '0.5em',
								boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
								border: 'solid 1px #d7d7d7'
							}}>
								<div style={{ padding: '1em 1em' }}>
									<div style={{ textAlign: 'left', height: '2em' }}>
										{translate.my_participation} - <span style={{ color: primary }}>{`${props.participant.name} ${props.participant.surname}` || ''}</span>
									</div>
									<div style={{ marginTop: '1em' }}>
										<ResultsTimeline
											council={council}
											participant={props.participant}
											disableScroll
											translate={translate}
											endPage={true}
										/>
									</div>
								</div>
							</div>
						</div>
					}
				</React.Fragment>
			);
		}
	};

	React.useEffect(() => {
		window.addEventListener('resize', updateDimensions);

		return () => window.removeEventListener('resize', updateDimensions);
	}, [council.id]);

	return (
		<div
			style={{
				backgroundColor: 'transparent',
				// backgroundColor: 'white',
				...(windowSize === 'xs' && windowOrientation === 'portrait'
					? styles.container
					: styles.splittedContainer),
			}}
		>
			<div
				style={{
					...styles.textContainer,
					...(windowSize === 'xs' &&
						windowOrientation === 'portrait'
						? { maxWidth: '100%', width: '100%' }
						: { maxWidth: '85%', minWidth: '100%' }),
					// : { maxWidth: "50%", minWidth: "50%" }),
				}}
			>
				{getBody()}
			</div>
			<ContactModal
				open={modal}
				requestClose={closeContactModal}
				participant={props.participant}
				translate={translate}
				council={council}
			/>
		</div>
	);
};


const TextRender = ({
	title, text, isHtmlText, council, company, translate, windowOrientation
}) => {
	const [modal, setModal] = React.useState(false);
	const primary = getPrimary();

	const openModal = () => {
		setModal(true);
	};

	const closeModal = () => {
		setModal(false);
	};


	return (
		<React.Fragment>
			<h3 style={{ color: primary, marginBottom: windowOrientation === 'landscape' ? '' : '1em' }}>{title}</h3>

			{text && (
				<p style={{ fontSize: '1.1em', marginBottom: windowOrientation === 'landscape' ? '' : '2em' }}>
					{isHtmlText ? (
						<span dangerouslySetInnerHTML={{ __html: text }} />
					) : (
						text
					)}
				</p>
			)}

			{(council.noCelebrateComment && council.noCelebrateComment.trim() !== '') && (
				<div style={{ maxWidth: '100%', position: 'relative' }}>
					<p style={{ marginBottom: '0px' }}>
						{translate.reason_not_held_council}:
					</p>
					<OverFlowText
						icon={'info-circle'}
						action={openModal}
					>
						<p
							style={{
								maxWidth: '100%',
								marginBottom: '8px',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								overflow: 'hidden'
							}}
						>
							<div dangerouslySetInnerHTML={{
								__html: council.noCelebrateComment
							}} />
						</p>
					</OverFlowText>
				</div>
			)}

			<CouncilInfoCardRender council={council} company={company} windowOrientation={windowOrientation} />

			<TextDialog
				handleClose={closeModal}
				text={council.noCelebrateComment}
				open={modal}
			/>
		</React.Fragment>
	);
};


export const CouncilInfoCardRender = ({ council, windowOrientation }) => (
	<React.Fragment>
		<div
			style={{
				backgroundColor: lightTurquoise,
				borderRadius: '4px'
			}}
		>
			<CardHeader
				title={
					<div style={{ marginBottom: windowOrientation === 'landscape' ? '' : '10px' }}>
						<img src={logoIcon} style={{ height: logoIcon !== '' ? '2em' : '' }} alt="icono councilbox"></img>{logoIcon !== '' ? <br /> : ''}
						<b>{council.name}</b>
					</div>
				}
				subheader={
					council.timezone ?
						moment(new Date(council.dateStart)).format('LLL')
						:
						moment(new Date(council.dateStart)).utcOffset(0).format('LLL')
				}
			/>
		</div>
	</React.Fragment>
);

const TextDialog = ({
	open, handleClose, title, text
}) => (
	<Dialog
		open={open}
		onClose={handleClose}
		aria-labelledby="simple-dialog-title"
	>
		{title && (
			<DialogTitle id="simple-dialog-title">
				Set backup account
			</DialogTitle>
		)}
		<DialogContent>
			<FontAwesome
				name={'close'}
				style={{
					position: 'absolute',
					right: '10px',
					top: '5px',
					cursor: 'pointer',
					color: getSecondary()
				}}
				onClick={handleClose}
			/>
			{text}
		</DialogContent>
	</Dialog>
);

const Image = ({
	src, style
}) => (
	<div
		style={{
			width: '100%',
			height: '100%',
			marginTop: '1em',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			...style
		}}>
		<img
			style={{ width: '50%' }}
			src={src}
			alt="empty table"
		/>
	</div>
);

const StateContainer = ({
	children
}) => (
	<Card
		style={{
			padding: '3em',
			margin: 'auto',
			marginTop: '2em',
			height: isMobile ? 'calc(100vh - 12em)' : '60vh',
			display: 'flex',
			alignItems: 'center'
		}}
	>
		<Grid>
			{children}
		</Grid>
	</Card>
);

export default withTranslations()(
	withWindowOrientation(withWindowSize(CouncilState))
);
