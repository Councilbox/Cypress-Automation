import React from 'react';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { closeAgendaVoting as closeAgendaVotingMutation, openAgendaVoting } from '../../../queries';
import { BasicButton, ButtonIcon } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import { getPrimary } from '../../../styles/colors';
import { useOldState } from '../../../hooks';
import { isAnonym, isConfirmationRequest } from '../../../utils/CBX';
import { isMobile } from '../../../utils/screen';

const ToggleVotingsButton = ({
	agenda, translate, council, ...props
}) => {
	const [loading, setLoading] = React.useState(false);
	const [state, setState] = useOldState({
		sendCredentials: !council.videoEmailsDate,
		confirmModal: false
	});
	const primary = getPrimary();

	React.useEffect(() => {
		if (state.sendCredentials !== !council.videoEmailsDate) {
			setState({
				sendCredentials: !council.videoEmailsDate
			});
		}
	}, [council.videoEmailsDate]);

	const openVoting = async () => {
		setLoading(true);
		const response = await props.openAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			setLoading(false);
			props.refetch();
		}
	};

	const openHybridVotings = async () => {
		setLoading(true);
		await props.openHybridVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		setLoading(false);
		props.refetch();
	};

	const reopenAgendaVoting = async () => {
		setLoading(true);
		const response = await props.reopenAgendaVoting({
			variables: {
				agendaId: agenda.id
			}
		});
		if (response) {
			setLoading(false);
			props.refetch();
		}
	};

	const closeAgendaVoting = async () => {
		const cb = async () => {
			setLoading(true);
			const response = await props.closeAgendaVoting({
				variables: {
					agendaId: agenda.id
				}
			});
			if (response) {
				setLoading(false);
				props.refetch();
			}
		};

		if (!props.editedVotings) {
			cb();
		} else {
			props.showVotingsAlert(cb);
		}
	};

	const getVotingClosedSection = () => {
		if (isAnonym(agenda.subjectType)) {
			return <span />;
		}

		return (
			<div style={{ width: '100%', ...(!isMobile ? { float: 'right' } : {}) }}>
				<BasicButton
					text={isConfirmationRequest(agenda.subjectType) ? translate.open_to_answer : translate.reopen_voting}
					color={'white'}
					loading={loading}
					disabled={loading}
					textPosition="before"
					icon={
						<ButtonIcon
							type="thumbs_up_down"
							color={primary}
						/>
					}
					floatRight={!isMobile}
					buttonStyle={{ width: '18em' }}
					onClick={reopenAgendaVoting}
					textStyle={{
						fontSize: '0.75em',
						fontWeight: '700',
						textTransform: 'none',
						color: primary,
					}}
				/>
			</div>
		);
	};

	return (
		<React.Fragment >
			{agenda.votingState === 0 && (
				<div style={{ width: '100%', ...(!isMobile ? { float: 'right' } : {}) }}>
					<BasicButton
						text={isConfirmationRequest(agenda.subjectType) ? translate.open_to_answer : translate.active_votings}
						color={'white'}
						loading={loading}
						disabled={loading}
						onClick={openVoting}
						textPosition="before"
						icon={
							<ButtonIcon
								type="thumbs_up_down"
								color={primary}
							/>
						}
						floatRight={!isMobile}
						buttonStyle={{ minWidth: '11em' }}
						textStyle={{
							fontSize: '0.75em',
							fontWeight: '700',
							textTransform: 'none',
							color: primary
						}}
					/>
				</div>
			)}
			{agenda.votingState === 1 && (
				<React.Fragment>
					{council.councilType === 3 ?
						<div style={{ fontSize: '0.9em' }}>
							<div>{`${translate.votings_closing_date} ${moment(council.closeDate).format('LLL')}`}</div>
							<div style={{ ...(!isMobile ? { float: 'right' } : {}) }}>
								<BasicButton
									text={translate.close_point_votations}
									color={primary}
									loading={loading}
									disabled={loading}
									textPosition="before"
									icon={
										<ButtonIcon
											type="lock_open"
											color="white"
										/>
									}
									floatRight={!isMobile}
									buttonStyle={{ width: '18em' }}
									onClick={closeAgendaVoting}
									textStyle={{
										fontSize: '0.75em',
										fontWeight: '700',
										textTransform: 'none',
										color: 'white'
									}}
								/>
							</div>
						</div>
						: <div style={{ width: '100%', ...(!isMobile ? { float: 'right' } : {}) }}>
							<BasicButton
								text={isConfirmationRequest(agenda.subjectType) ? translate.close_answers : translate.close_point_votations}
								color={primary}
								loading={loading}
								disabled={loading}
								textPosition="before"
								icon={
									<ButtonIcon
										type="lock_open"
										color="white"
									/>
								}
								floatRight={!isMobile}
								buttonStyle={{ width: '18em' }}
								onClick={closeAgendaVoting}
								textStyle={{
									fontSize: '0.75em',
									fontWeight: '700',
									textTransform: 'none',
									color: 'white'
								}}
							/>
						</div>
					}
				</React.Fragment>
			)}
			{agenda.votingState === 2 && getVotingClosedSection()}
			{agenda.votingState === 4
&& <div style={{ width: '100%', ...(!isMobile ? { float: 'right' } : {}) }}>
	<BasicButton
		text={translate.close_point_votations}
		color={primary}
		loading={loading}
		disabled={loading}
		textPosition="before"
		icon={
			<ButtonIcon
				type="lock_open"
				color="white"
			/>
		}
		floatRight={!isMobile}
		buttonStyle={{ width: '18em' }}
		onClick={closeAgendaVoting}
		textStyle={{
			fontSize: '0.75em',
			fontWeight: '700',
			textTransform: 'none',
			color: 'white',
		}}
	/>
</div>
			}
			{agenda.votingState === 3
&& <div style={{ width: '100%', ...(!isMobile ? { float: 'right' } : {}) }}>
	<BasicButton
		text={translate.open_in_person_votings}
		color={'white'}
		loading={loading}
		disabled={loading}
		onClick={openHybridVotings}
		textPosition="before"
		icon={
			<ButtonIcon
				type="thumbs_up_down"
				color={primary}
			/>
		}
		floatRight={!isMobile}
		buttonStyle={{ minWidth: '11em' }}
		textStyle={{
			fontSize: '0.75em',
			fontWeight: '700',
			textTransform: 'none',
			color: primary
		}}
	/>
</div>
			}
		</React.Fragment>
	);
};

const reopenAgendaVoting = gql`
	mutation ReopenAgendaVoting($agendaId: Int!){
		reopenAgendaVoting(agendaId: $agendaId){
			success
			message
		}
	}
`;

const openHybridVoting = gql`
	mutation OpenHybridVoting($agendaId: Int!){
		openHybridVoting(agendaId: $agendaId){
			success
			message
		}
	}
`;

export default compose(
	graphql(openAgendaVoting, {
		name: 'openAgendaVoting'
	}),

	graphql(openHybridVoting, {
		name: 'openHybridVoting'
	}),

	graphql(closeAgendaVotingMutation, {
		name: 'closeAgendaVoting'
	}),
	graphql(reopenAgendaVoting, {
		name: 'reopenAgendaVoting'
	})
)(ToggleVotingsButton);
