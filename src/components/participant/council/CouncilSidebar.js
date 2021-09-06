import React from 'react';
import FontAwesome from 'react-fontawesome';
import FloatGroup from 'react-float-button';
import { Grid, Button } from 'material-ui';
import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ResultsTimeline from '../ResultsTimeline';
import {
	darkGrey, secondary, getSecondary, getPrimary
} from '../../../styles/colors';
import { AlertConfirm, Badge } from '../../../displayComponents';
import iconVoteInsert from '../../../assets/img/dropping-vote-in-box2.svg';
import { usePolling } from '../../../hooks';
import { commentWallDisabled } from '../../../utils/CBX';


const styles = {
	button: {
		width: '100%',
		height: '100%',
		minWidth: '0',
		color: '#ffffffcc',
		padding: '0',
		margin: '0',
		fontSize: '10px'
	}
};

const councilTimelineQuery = gql`
	query CouncilTimeline($councilId: Int!, ){
		councilTimeline(councilId: $councilId){
			id
		}
	}
`;

const readTimeline = gql`
	query ReadTimeline($councilId: Int!){
		readTimeline(councilId: $councilId){
			id
			type
			date
			content
		}
	}
`;

const createEvidenceRead = gql`
	mutation CreateEvidenceRead($evidenceId: Int!){
		createEvidenceRead(evidenceId: $evidenceId){
			success
		}
	}
`;


const CouncilSidebar = ({
	translate, council, participant, agendas, ...props
}) => {
	const prevAgendas = React.useRef(null);
	const [votingsWarning, setVotingsWarning] = React.useState(null);

	const closeAll = () => {
		props.setContent(null);
	};

	const renderVideoButton = () => (
		<Button
			className={'NoOutline prueba'}
			style={styles.button}
			onClick={closeAll}
		>
			<div style={{ display: 'unset' }}>
				<div>
					<i
						className="fa fa-video-camera"
						style={{
							color: !props.modalContent ? secondary : '',
							fontSize: '24px',
							padding: '0',
							margin: '0',
							marginTop: '4px',
							width: '1em',
							height: '1em',
							overflow: 'hidden',
							userSelect: 'none',
						}}
					/>
				</div>
				<div style={{
					color: 'white',
					fontSize: '0.55rem',
					textTransform: 'none'
				}}>
					{translate.video}
				</div>
			</div>
		</Button>
	);

	function checkAgendas() {
		const opened = agendas.agendas.reduce((acc, agenda) => {
			if (agenda.votingState === 1) {
				acc.push(agenda);
			}
			return acc;
		}, []);
		if (!votingsWarning) {
			return {
				opened,
				read: new Set(),
				show: opened.length > 0
			};
		}
		prevAgendas.current = agendas.agendas;

		return {
			...votingsWarning,
			opened,
			show: opened.filter(item => !votingsWarning.read.has(item.id)).length > 0,
			read: (opened.length > votingsWarning.opened.length) ? new Set(opened) : votingsWarning.read
		};
	}

	React.useEffect(() => {
		if (agendas) {
			if (JSON.stringify(agendas.agendas) !== JSON.stringify(prevAgendas.current)) {
				setVotingsWarning(checkAgendas());
			}
		}
	}, [agendas]);

	const buildReadArray = (read, opened) => new Set([...Array.from(read), ...opened.map(agenda => agenda.id)]);

	const updateReadVotings = () => {
		setVotingsWarning({
			...votingsWarning,
			read: buildReadArray(votingsWarning.read, votingsWarning.opened),
			show: false
		});
	};

	function selectAgenda() {
		props.setContent('agenda');
		updateReadVotings();
	}

	const renderVotingsWarning = () => {
		const hideEnterModal = props.modalContent === 'agenda';
		return (
			((votingsWarning && votingsWarning.show) && !hideEnterModal) && (
				<div style={{ position: 'absolute', width: '100%', bottom: '5.7em' }}>
					<div
						onClick={selectAgenda}
						style={{
							background: 'white',
							width: '100%',
							fontWeight: 'bold',
							padding: '0.7em',
							paddingRight: '1em',
							display: 'flex',
							justifyContent: 'space-between',
							fontSize: '14px'
						}}
					>
						<div style={{ color: getSecondary(), whiteSpace: 'nowrap', marginRight: '10px' }}>
							{translate.opened_votings} ({votingsWarning.opened.length})
						</div>
						<div style={{
							maxWidth: '40%', color: '#3b3b3b', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'
						}}>
							{votingsWarning.opened[votingsWarning.opened.length - 1].agendaSubject}
						</div>
					</div>
					<div style={{
						width: '0',
						height: '0',
						borderLeft: '5px solid transparent',
						borderRight: '5px solid transparent',
						borderTop: '11px solid white',
						left: '28.8%',
						position: 'relative'
					}}></div>
				</div>
			)
		);
	};

	const renderAgendaButton = () => {
		let activeIcon = false;
		if (agendas) {
			agendas.agendas.forEach(item => {
				activeIcon = !!(item.votingState === 1 || activeIcon);
			});
		}

		return (
			<Button
				className={'NoOutline'}
				style={styles.button}
				onClick={selectAgenda}
			>
				<div style={{ display: 'unset' }}>
					<div>
						<i className="material-icons" style={{
							color: props.modalContent === 'agenda' ? secondary : '',
							fontSize: '24px',
							padding: '0',
							margin: '0',
							width: '1em',
							height: '1em',
							overflow: 'hidden',
							userSelect: 'none',
							position: 'relative'
						}}>
							calendar_today
							{activeIcon
								&& <img src={iconVoteInsert} style={{
									color: secondary, position: 'absolute', left: '5.2px', width: '13px'
								}}></img>
							}
						</i>
					</div>
					<div style={{
						color: 'white',
						fontSize: '0.55rem',
						textTransform: 'none'
					}}>
						{council.councilType === 5 ? translate.council : translate.agenda}
					</div>
				</div>
			</Button>
		);
	};

	const renderPrivateMessageButton = () => {
		const disabled = commentWallDisabled(council);
		return (
			<Button
				className={'NoOutline'}
				title={'sendMessage'}
				style={styles.button}
				onClick={event => {
					if (disabled) {
						return props.setAdminMessage(false, event);
					}
					props.setAdminMessage(!props.adminMessage, event);
				}}
			>
				<div style={{ display: 'unset' }}>
					<div>
						<i className="material-icons" style={{
							fontSize: '24px',
							padding: '0',
							margin: '0',
							width: '1em',
							height: '1em',
							overflow: 'hidden',
							userSelect: 'none',
							color: disabled ? 'grey' : props.adminMessage ? getPrimary() : '#ffffffcc',
						}}>
							chat_bubble_outline
						</i>
					</div>
					<div style={{
						color: disabled ? 'grey' : 'white',
						fontSize: '0.55rem',
						textTransform: 'none'
					}}>
						{translate.message}
					</div>
				</div>
			</Button>
		);
	};


	if (!props.noSession && props.isMobile) {
		return (
			<AlertConfirm
				open={true}
				classNameDialog={'modal100SinMenu'}
				PaperProps={{
					style: {
						margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: '0px'
					}
				}}
				bodyStyle={{ maxWidth: '100vw', width: '100%', padding: '0' }}
				bodyText={
					<div style={{ height: '100%' }}>
						{props.agenda}
					</div>
				}
			/>
		);
	}

	if (props.isMobile) {
		return (
			<div style={{
				float: 'left',
				zIndex: '0'
			}}>
				<div style={{
					borderTop: '1px solid dimgrey',
					backgroundColor: darkGrey,
					height: 'calc( 3.5rem + 1px )',
					zIndex: '1000',
					position: 'absolute',
					display: 'flex',
					flexDirection: 'row',
					left: '0px',
					width: '100vw',
					alignItems: 'center',
					bottom: '0px',
					// overflow: 'hidden',
					fontSize: '0.55em'
				}}>
					<div style={{
						height: '3.5rem', width: '100vw', display: 'flex', color: '#ffffffcc',
					}}>

						<div style={{ width: '20%', textAlign: 'center', paddingTop: '0.35rem' }}>
							{!props.modalContent ?
								<FloatGroup
									delay={0.02}
									style={{
										width: '100%',
										height: '100%',
										minWidth: '0',
										color: '#ffffffcc',
										padding: '0',
										margin: '0',
										fontSize: '10px'
									}}
								>
									{renderVideoButton()}
									<Button style={{
										left: '0.9em',
										bottom: '20px',
										background: 'white',
										width: '45px',
										borderRadius: '45px',
										height: '45px',
										padding: '0',
										margin: '0px',
										minWidth: '0',
										boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)'
									}}
									onClick={props.middle}>
										<div>
											<i
												className="fa fa-compress"
												style={{
													color: 'grey',
													padding: '0',
													margin: '0',
													fontSize: '24px',
													overflow: 'hidden',
													userSelect: 'none'
												}}
											/>
										</div>
									</Button>
									<Button style={{
										left: '0.9em',
										bottom: '20px',
										background: 'white',
										width: '45px',
										borderRadius: '45px',
										height: '45px',
										padding: '0',
										margin: '0',
										minWidth: '0',
										boxShadow: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)'
									}}
									onClick={props.full}>
										<div>
											<i
												className={'fa fa-expand'}
												style={{
													color: 'grey',
													padding: '0',
													margin: '0',
													fontSize: '24px',
													width: '1em',
													height: '1em',
													overflow: 'hidden',
													userSelect: 'none'
												}}
											/>
										</div>
									</Button>
								</FloatGroup>
								: renderVideoButton()
							}
						</div>
						{renderVotingsWarning()}
						<div style={{ width: '20%', textAlign: 'center', paddingTop: '0.35rem' }}>
							{renderAgendaButton()}
						</div>
						{props.askWordMenu}
						<div style={{ width: '20%', textAlign: 'center', paddingTop: '0.35rem' }}>
							{renderPrivateMessageButton()}
						</div>
						<div style={{ width: '20%', textAlign: 'center', paddingTop: '0.35rem' }}>
							<TimelineButton
								council={council}
								translate={translate}
								onClick={() => props.setContent('timeline')}
								actived={props.modalContent === 'timeline'}
								participant={participant}
							/>
						</div>
					</div>
				</div>
				<AlertConfirm
					// open={!!props.modalContent}
					open={true}
					classNameDialog={props.modalContent ? 'modal100block' : 'modal100none'}
					PaperProps={{
						// style: { margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: "0px" }
						style: {
							margin: 0, width: '100%', borderRadius: '0', maxHeight: '100vh', height: '100%  ', boxShadow: 'none', top: '0px', display: props.modalContent ? 'block' : 'none'
						}
					}}
					bodyStyle={{
						maxWidth: '100vw', width: '100%', padding: '0', height: '100%'
					}}
					bodyText={
						<div style={{ height: '100%' }}>
							{props.modalContent === 'agenda'
								&& props.agenda
							}
							{props.modalContent === 'timeline'
								&& <ResultsTimeline
									council={council}
									participant={participant}
									translate={translate}
									endPage={true}
								/>
							}
						</div>
					}
				/>
				<AlertConfirm
					open={props.adminMessage}
					classNameDialog={'modal100Comentario'}
					bodyStyle={{ maxWidth: '100vw', width: '100%', padding: '0' }}
					PaperProps={{
						style: {
							margin: '0',
							transition: 'bottom 0.4s',
							display: 'flex',
							position: 'fixed',
							minHeight: '50px',
							width: '100vw',
							bottom: props.click ? '0' : '3.7rem',
							left: '0',
							alignItems: 'center',
							justifyContent: 'center',
							borderTop: '1px solid gainsboro'
						}
					}}
					bodyText={
						<div style={{
							borderRadiusTopLeft: '5px',
							position: 'relative',
							width: '100%',
							height: '100%',
							background: '#f1f1f1'
						}}>
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								{props.comentario}
							</div>
						</div>
					}
				/>
			</div>
		);
	}
	return (
		<div style={{
			float: 'left',
			zIndex: '0'
		}}>
			<div style={{
				backgroundColor: darkGrey,
				height: 'calc( 3.5rem + 1px )',
				zIndex: '1000',
				position: 'absolute',
				display: 'flex',
				flexDirection: 'row',
				left: '0px',
				width: 'calc( 100vw - 20px )',
				alignItems: 'center',
				bottom: '0px',
				fontSize: '0.55em',
				marginLeft: '10px',
				marginRight: '10px'
			}}>
				<Grid
					item xs={6}
					md={8}
					style={{
						height: '3.5rem',
						width: '100vw',
						display: 'flex',
						color: '#ffffffcc',
						paddingRight: '3px'
					}}
				>
					{props.askWordMenu}
					<div
						style={{
							width: '50%',
							textAlign: 'center',
							paddingTop: '0.35rem',
							borderTop: '1px solid dimgrey',
							borderRight: '1px solid dimgrey'
						}}
					>
						{renderPrivateMessageButton()}
					</div>
				</Grid>
				<Grid
					item xs={6}
					md={4}
					style={{
						height: '3.5rem',
						width: '100vw',
						display: 'flex',
						color: '#ffffffcc',
						paddingLeft: '6px'
					}}
				>
					<div
						style={{
							width: '50%',
							textAlign: 'center',
							paddingTop: '0.35rem',
							borderTop: '1px solid dimgrey',
							borderLeft: '1px solid dimgrey'
						}}
					>
						{renderAgendaButton()}
					</div>
					<div style={{
						width: '50%', textAlign: 'center', paddingTop: '0.35rem', borderTop: '1px solid dimgrey', borderRight: '1px solid dimgrey',
					}}>
						<TimelineButton
							council={council}
							onClick={() => props.setContent('timeline')}
							actived={props.modalContent === 'timeline'}
							participant={participant}
							translate={translate}
						/>
					</div>
				</Grid>
			</div>

			{props.adminMessage
				&& <Grid item xs={6} md={8} style={{
					transition: 'bottom 0.7s',
					display: 'flex',
					position: 'fixed',
					minHeight: '50px',
					bottom: '3.7rem',
					left: '0',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: '1000',
				}}>
					<div style={{
						width: '100vw',
						marginLeft: '10px',
						paddingRight: '6px'
					}}
					>
						<div style={{
							borderTop: '1px solid gainsboro',
							borderRadiusTopLeft: '5px',
							position: 'relative',
							width: '100%',
							height: '100%',
							background: '#f1f1f1'
						}}
						>
							<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
								{props.comentario}
							</div>
						</div>
					</div>
				</Grid>
			}
		</div>
	);
};


const TimelineButton = graphql(gql`
	subscription councilTimelineTotal($councilId: Int!){
		councilTimelineTotal(councilId: $councilId)
	}
`, {
	name: 'timelineTotal',
	options: props => ({
		variables: {
			councilId: props.council.id
		}
	})
})(withApollo(({
	onClick, actived, council, translate, client, participant, timelineTotal
}) => {
	const [total, setTotal] = React.useState(0);
	const [lastEvidenceId, setlastEvidenceId] = React.useState(0);
	const [timelineLastRead, setTimelineLastRead] = React.useState(0);
	const [arrayTimeline, setArrayTimeline] = React.useState(null);

	React.useEffect(() => {
		if (timelineTotal.councilTimelineTotal) {
			if (timelineTotal.councilTimelineTotal !== total) {
				setTotal(timelineTotal.councilTimelineTotal);
			}
		}
	}, [timelineTotal]);

	const readTimelines = React.useCallback(async () => {
		const response = await client.query({
			query: readTimeline,
			variables: {
				councilId: council.id,
			}
		});

		if (response.data && response.data.readTimeline.length > 0) {
			setTimelineLastRead(JSON.parse(response.data.readTimeline[response.data.readTimeline.length - 1].content).data.participant.timeline);
		}
	}, [participant.id]);

	React.useEffect(() => {
		readTimelines();
	}, [readTimelines]);

	const getTimeline = React.useCallback(async () => {
		const response = await client.query({
			query: councilTimelineQuery,
			variables: {
				councilId: council.id,
			}
		});

		if (response.data && response.data.councilTimeline) {
			setTotal(response.data.councilTimeline.length);
			setArrayTimeline(response.data.councilTimeline);
			if (response.data.councilTimeline[response.data.councilTimeline.length - 1] !== undefined) {
				setlastEvidenceId(response.data.councilTimeline[response.data.councilTimeline.length - 1].id);
			}
		}
	}, [council.id, client, councilTimelineQuery]);


	React.useEffect(() => {
		getTimeline();
	}, [getTimeline]);

	usePolling(getTimeline, 100000);


	const evidenceRead = async () => {
		await client.mutate({
			mutation: createEvidenceRead,
			variables: {
				evidenceId: lastEvidenceId
			}
		});
		readTimelines();
	};


	const enterTimeline = () => {
		onClick();
		evidenceRead();
	};


	let resultado;
	let unread = 0;
	if (arrayTimeline != null) {
		resultado = arrayTimeline.findIndex(item => item.id === timelineLastRead);
		unread = total - (resultado + 1);
	} else {
		unread = 0;
	}

	return (
		<Button
			className={'NoOutline'}
			style={styles.button}
			onClick={enterTimeline}
		>
			<div style={{ display: 'unset' }}>
				<Badge badgeContent={unread} hide={unread === 0} color="primary">
					<div>
						<FontAwesome
							name={'file-text-o'}
							style={{
								color: actived ? secondary : '',
								fontSize: '24px',
								width: '1em',
								height: '1em',
								overflow: 'hidden',
								userSelect: 'none'
							}}
						/>
					</div>
				</Badge>
				<div style={{
					color: 'white',
					fontSize: '0.55rem',
					textTransform: 'none'
				}}>
					{translate.summary}
				</div>
			</div>
		</Button>
	);
}));


export default CouncilSidebar;
