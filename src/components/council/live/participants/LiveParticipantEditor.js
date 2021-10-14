import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import {
	Typography,
	Tooltip
} from 'material-ui';
import gql from 'graphql-tag';
import { liveParticipant, updateParticipantSends } from '../../../../queries';
import { isLandscape, isMobile } from '../../../../utils/screen';
import { getSecondary } from '../../../../styles/colors';
import {
	Grid,
	GridItem,
	BasicButton,
	LoadingSection,
	ParticipantDisplay,
	Scrollbar,
	TextInput
} from '../../../../displayComponents';
import * as CBX from '../../../../utils/CBX';
import withWindowSize from '../../../../HOCs/withWindowSize';
import ParticipantStateList from './ParticipantStateList';
import NotificationsTable from '../../../notifications/NotificationsTable';
import { changeParticipantState } from '../../../../queries/liveParticipant';
import ParticipantSelectActions from './ParticipantSelectActions';
import ResendCredentialsModal from './modals/ResendCredentialsModal';
import { PARTICIPANT_STATES } from '../../../../constants';
import SignatureButton from './SignatureButton';
import { useParticipantContactEdit } from '../../../../hooks';
import OwnedVotesSection from './ownedVotes/OwnedVotesSection';
import DropdownRepresentative from '../../../../displayComponents/DropdownRepresentative';
import RemoveDelegationButton from './RemoveDelegationButton';

const LiveParticipantEditor = ({ data, translate, client, ...props }) => {
	const [ownedVotes, setOwnedVotes] = React.useState(null);
	const [loadingOwnedVotes, setLoadingOwnedVotes] = React.useState(true);

	const landscape = isLandscape() || window.innerWidth > 700;
	const participant = { ...data.liveParticipant };

	const showStateMenu = () => !(participant.representatives && participant.representatives.length > 0);

	const refreshEmailStates = React.useCallback(async () => {
		const response = await props.updateParticipantSends({
			variables: {
				participantId: showStateMenu() ? participant.id : participant.representatives[0].id
			}
		});

		if (response.data.updateParticipantSends.success) {
			if (data.loading) {
				await data.refetch();
			}
		}
	}, [data]);

	const updateOwnedVotes = React.useCallback(async () => {
		if (participant.id) {
			const response = await client.query({
				query: gql`
					query ParticipantOwnedVotesLimited(
						$participantId: Int!
						$filters: [FilterInput]
						$options: OptionsInput
					) {
						participantOwnedVotes(
							participantId: $participantId
							filters: $filters
							options: $options
						) {
							list {
								id
								name
								surname
								state
							}
							total
							meta
						}
					}
				`,
				variables: {
					participantId: participant.id,
					options: {
						limit: 15,
						offset: 0
					}
				}
			});

			setOwnedVotes(response.data.participantOwnedVotes);
			setLoadingOwnedVotes(false);
		}
	}, [participant?.id]);

	React.useEffect(() => {
		updateOwnedVotes();
	}, [updateOwnedVotes]);

	React.useEffect(() => {
		let interval;
		if (participant.id) {
			refreshEmailStates();
			interval = setInterval(refreshEmailStates, 15000);
		}
		return () => clearInterval(interval);
	}, [participant.id]);

	if (!data.liveParticipant) {
		return <LoadingSection />;
	}

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				paddingTop: '2em',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'stretch',
				alignContent: 'stretch',
				marginTop: '30px',
				padding: isMobile ? '' : props.windowSize === 'xs' ? '1.3em' : '1em',
			}}
		>
			<Scrollbar>
				<div>
					<div style={{ width: '100%', padding: '0.5em' }}>
						<Grid style={{
							boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)', border: CBX.hasHisVoteDelegated(participant) ? '' : 'solid 1px #61abb7', borderRadius: '4px', padding: '1em'
						}}>
							<GridItem xs={12} md={4} lg={4}>
								<Typography variant="body2" >
									<div style={{ paddingLeft: '1em' }}>
									</div>
									<div >
										<ParticipantDisplay
											participant={participant}
											translate={translate}
											root={props.root}
											canEdit={!CBX.hasHisVoteDelegated(participant) && !CBX.isRepresented(participant)}
											council={props.council}
											refetch={data.refetch}
										/>
									</div>
								</Typography>
								{participant.personOrEntity !== 1
									&& <div style={{ display: 'flex', alignItems: 'center' }}>
										{showStateMenu()
											&& <ParticipantStateList
												participant={participant}
												council={props.council}
												translate={translate}
												refetch={props.refetch}
												inDropDown={true}
											/>
										}
										<div style={{ paddingLeft: landscape ? '1em' : '0', marginBottom: '0.5em' }}>
											<b>{`${translate.current_status}:  `}</b>
											{translate[CBX.getParticipantStateField(participant)]}
										</div>
									</div>
								}
								<Grid style={{ marginTop: '1em', display: 'flex' }}>
									{(CBX.showSendCredentials(participant.state) && props.council.councilType !== 4)
										&& <GridItem xs={6} md={8} lg={5} style={{}}>
											<div style={{}}>
												<ResendCredentialsModal
													participant={participant}
													council={props.council}
													translate={translate}
													security={CBX.hasAccessKey(props.council)}
													refetch={data.refetch}
												/>
											</div>
										</GridItem>
									}
									<GridItem xs={6} md={8} lg={5}>
										{!CBX.isRepresented(participant) && props.council.councilType < 2 && !CBX.hasHisVoteDelegated(participant) && participant.personOrEntity !== 1
											&& <div>
												<SignatureButton
													participant={participant}
													council={props.council}
													refetch={data.refetch}
													translate={translate}
												/>
											</div>
										}
									</GridItem>
								</Grid>
							</GridItem>
							<GridItem xs={12} md={8} lg={8}>
								<Grid style={{ display: 'flex', flexDirection: 'column' }}>
									<GridItem xs={12} md={6} lg={6}>
										<ParticipantSelectActions
											participant={participant}
											council={props.council}
											translate={translate}
											refetch={() => {
												data.refetch();
												updateOwnedVotes();
											}}
										/>
									</GridItem>
									<GridItem xs={12} md={6} lg={6}>
										{CBX.canHaveRepresentative(participant)
											&& !(participant.hasDelegatedVotes) && !(participant.represented.length > 0) &&
											(
												<DropdownRepresentative
													participant={participant}
													translate={translate}
													council={props.council}
													refetch={data.refetch}
												/>
											)}
									</GridItem>
								</Grid>
							</GridItem>
						</Grid>
						{CBX.isRepresented(participant) ?
							<ParticipantBlock
								{...props}
								participant={participant.representative}
								translate={translate}
								active={true}
								data={data}
								type={PARTICIPANT_STATES.REPRESENTATED}
							/>
							: (participant.representatives && participant.representatives.length > 0)
							&& <ParticipantBlock
								{...props}
								participant={participant.representatives[0]}
								translate={translate}
								active={false}
								action={
									<GrantVoteButton
										participant={participant}
										refetch={data.refetch}
										representative={participant.representatives[0]}
										translate={translate}
									/>
								}
								data={data}
								type={PARTICIPANT_STATES.REPRESENTATED}
							/>
						}
						<OwnedVotesSection
							translate={translate}
							participant={participant}
							council={props.council}
							ownedVotes={ownedVotes}
							updateOwnedVotes={updateOwnedVotes}
							loading={loadingOwnedVotes}
						/>
						{CBX.hasHisVoteDelegated(participant)
							&&
							<ParticipantBlock
								{...props}
								active={false}
								participant={participant.representative}
								translate={translate}
								data={data}
								type={PARTICIPANT_STATES.DELEGATED}
								action={
									participant.state === PARTICIPANT_STATES.DELEGATED &&
									<RemoveDelegationButton
										delegatedVote={participant}
										participant={participant}
										translate={translate}
										refetch={updateOwnedVotes}
									/>
								}
							/>
						}
						<NotificationsTable
							liveMobil={isMobile}
							notifications={(participant.representatives && participant.representatives.length > 0) ? participant.representatives[0].notifications : participant.notifications}
							translate={translate}
						/>
					</div>
				</div>
			</Scrollbar>
		</div>
	);
};

export const ParticipantBlock = withApollo(({
	children, translate, type, client, data, action, active, participant, ...props
}) => {
	const {
		edit,
		setEdit,
		saving,
		success,
		email,
		setEmail,
		phone,
		setPhone,
		errors,
		updateParticipantContactInfo
	} = useParticipantContactEdit({
		participant, client, translate, council: props.council
	});

	const secondary = getSecondary();

	const texts = {
		[PARTICIPANT_STATES.DELEGATED]: translate.delegated_in,
		[PARTICIPANT_STATES.REPRESENTATED]: translate.represented_by,
		5: translate.representative_of,
		3: translate.delegated_vote_from.capitalize()
	};

	const text = texts[type];

	return (
		<Grid style={{
			marginBottom: '1em',
			display: 'flex',
			alignItems: 'center',
			boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
			border: 'solid 1px #61abb7',
			borderRadius: '4px',
			padding: '1em',
			contentVisibility: 'auto',
			marginTop: '1em',
			justifyContent: 'space-between'
		}}>
			<GridItem xs={12} md={4} lg={3}>
				<div style={{ display: 'flex' }}>
					<div style={{
						color: secondary, position: 'relative', width: '24px', minWidth: '24px'
					}}>
						<i
							className={type === PARTICIPANT_STATES.REPRESENTATED ? 'fa fa-user-o' : 'fa fa-user'}
							style={{
								position: 'absolute', left: '0', top: '0', fontSize: '19px'
							}}
						/>
						<i
							className={'fa fa-user'}
							style={{ position: 'absolute', right: '4px', bottom: '4px' }}
						/>
					</div>
					<div style={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis'
					}}>
						{`${text}:`}
						<b>{`${participant.name} ${participant.surname || ''}`}</b>
					</div>
					{type === PARTICIPANT_STATES.REPRESENTATED
						&& <div style={{ display: 'flex', alignItems: 'center' }}>
							<Tooltip title={translate.edit_participant_contact}>
								<i
									onClick={() => setEdit(!edit)}
									className="fa fa-pencil-square-o"
									aria-hidden="true"
									style={{
										color: secondary,
										fontSize: '1em',
										cursor: 'pointer',
										marginLeft: '0.3em',
										paddingTop: '3px'
									}}>
								</i>
							</Tooltip>
						</div>
					}
				</div>
				{edit
					&& <>
						<TextInput
							floatingText={translate.email}
							type="text"
							required
							value={email}
							errorText={errors.email}
							onChange={event => setEmail(event.target.value)
							}
						/>
						{props.council.securityType === 2
							&& <TextInput
								type="text"
								floatingText={translate.phone}
								required
								value={phone}
								errorText={errors.phone}
								onChange={event => setPhone(event.target.value)
								}
							/>
						}
						<BasicButton
							text={translate.save}
							color={secondary}
							loading={saving}
							success={success}
							textStyle={{
								color: 'white'
							}}
							onClick={updateParticipantContactInfo}
							buttonStyle={{
								marginTop: '0.6em'
							}}
						/>
					</>
				}
			</GridItem>
			{active
				&& <GridItem xs={12} md={3} lg={3} style={{ display: 'flex', justifyContent: props.innerWidth < 960 ? '' : 'center' }}>
					<div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
						<div>
							<ParticipantStateList
								participant={participant}
								council={props.council}
								translate={translate}
								refetch={props.refetch}
								inDropDown={true}
							/>
						</div>
						<div style={{
							width: '100%',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}>
							{translate[CBX.getParticipantStateField(participant)]}
						</div>
					</div>
				</GridItem>
			}
			<GridItem xs={12} md={5} lg={6}>
				<Grid style={{}}>
					{(active && props.council.councilType !== 4)
						&& <GridItem xs={12} md={9} lg={6} style={{}}>
							<div style={{ marginRight: '1em', borderRadius: '4px' }}>
								<ResendCredentialsModal
									participant={participant}
									council={props.council}
									translate={translate}
									security={CBX.hasAccessKey(props.council)}
									refetch={data.refetch}
								/>
							</div>
						</GridItem>
					}
					<GridItem xs={12} md={5} lg={5}>
						{action
							|| <div>
								{(active && props.council.councilType < 2)
									&& <SignatureButton
										participant={participant}
										council={props.council}
										refetch={data.refetch}
										translate={translate}
									/>
								}
							</div>
						}
					</GridItem>
					<GridItem xs={12} md={9} lg={6} style={{ display: 'flex' }}>
						{active
							&& <ParticipantSelectActions
								participant={participant}
								council={props.council}
								translate={translate}
								refetch={data.refetch}
								onlyButtonDelegateVote={true}
							/>
						}
					</GridItem>
				</Grid>
			</GridItem>
		</Grid>
	);
});

const setMainRepresentative = gql`
	mutation setMainRepresentative($participantId: Int!, $representativeId: Int!){
		setMainRepresentative(participantId: $participantId, representativeId: $representativeId){
			success
		}
	}
`;


const GrantVoteButton = withApollo(({
	participant, representative, refetch, translate, client
}) => {
	const secondary = getSecondary();

	const appointRepresentative = async () => {
		const response = await client.mutate({
			mutation: setMainRepresentative,
			variables: {
				participantId: participant.id,
				representativeId: representative.id
			}
		});

		if (response.data) {
			refetch();
		}
	};

	return (
		<BasicButton
			text={translate.grant_vote}
			type="flat"
			color="white"
			textStyle={{ color: secondary }}
			onClick={appointRepresentative}
			buttonStyle={{ border: `1px solid ${secondary}` }}
		/>
	);
});

export default compose(
	graphql(liveParticipant, {
		options: props => ({
			variables: {
				participantId: props.id
			},
			notifyOnNetworkStatusChange: true
		})
	}),
	graphql(changeParticipantState, {
		name: 'changeParticipantState'
	}),
	graphql(updateParticipantSends, {
		name: 'updateParticipantSends'
	}),
	withApollo
)(withWindowSize(LiveParticipantEditor));
