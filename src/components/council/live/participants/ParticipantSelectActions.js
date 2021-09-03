import React from 'react';
import { graphql } from 'react-apollo';
import { Button } from 'material-ui';
import * as CBX from '../../../../utils/CBX';
import { getLightGrey } from '../../../../styles/colors';
import { PARTICIPANT_STATES } from '../../../../constants';
import { changeParticipantState } from '../../../../queries/liveParticipant';
import { Grid, LoadingSection } from '../../../../displayComponents';
import DelegateOwnVoteModal from '../DelegateOwnVoteModal';
import DelegateVoteModal from '../DelegateVoteModal';
import EarlyVotingModal from './EarlyVotingModal';
import { isMobile } from '../../../../utils/screen';


class ParticipantSelectActions extends React.Component {
	state = {
		loading: false,
		delegateVote: false,
		delegateOwnVote: false,
		addRepresentative: false
	};


	changeParticipantState = async (state, index) => {
		const { participant } = this.props;
		this.setState({
			loading: index
		});

		const response = await this.props.changeParticipantState({
			variables: {
				participantId: participant.id,
				state
			}
		});

		if (response) {
			this.setState({
				loading: false
			});
			this.props.refetch();
		}
	};

	render() {
		const {
			translate, participant, council, onlyButtonDelegateVote
		} = this.props;
		const { loading } = this.state;
		if (onlyButtonDelegateVote) {
			return (
				// CBX.canAddDelegateVotes(council.statute, participant) && (
				// <GridItem xs={12} md={6} lg={4}>
				<div>
					{CBX.canAddDelegateVotes(council.statute, participant) && (
						<ButtonActions
							loading={loading === 6}
							active={participant.state === PARTICIPANT_STATES.DELEGATED}
							onClick={() => {
								this.setState({
									delegateVote: true
								});
							}}
						>
							<div
								style={{ display: 'flex', alignItems: 'center' }}
							>
								<div style={{
									display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
								}}>
									<span style={{ fontSize: '0.9em' }}>{translate.add_delegated}</span>
								</div>
							</div>
						</ButtonActions>
					)}
					<DelegateVoteModal
						show={this.state.delegateVote}
						council={council}
						participant={participant}
						refetch={this.props.refetch}
						requestClose={() => this.setState({ delegateVote: false })
						}
						translate={translate}
					/>
				</div>
				// </GridItem>
				// )
			);
		}
		return (
			<Grid
				style={{
					marginTop: '1em',
					marginLeft: '.5em',
					width: '100%',
					display: 'flex',
					flexDirection: isMobile ? 'column' : 'row',
					alignItems: !isMobile && 'center',
					gap: '.5rem',
				}}
			>
				{(this.props.council.councilType !== 4 && this.props.council.councilType !== 5 && participant.numParticipations > 0)
					&& <EarlyVotingModal
						council={this.props.council}
						participant={participant}
						translate={translate}
						buttonStyle={{
							borderRadius: '4px',
							border: 'solid 1px #a09aa0',
							padding: '1em',
							cursor: 'pointer',
							margin: ' 0 .5em 0 0',

						}}
						textStyle={{
							color: 'black',
							display: 'block',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							textTransform: 'none'
						}}
					/>
				}
				{CBX.canDelegateVotes(council.statute, participant) && (
					<ButtonActions
						loading={loading === 5}
						active={participant.state === PARTICIPANT_STATES.DELEGATED}
						onClick={() => this.setState({
							delegateOwnVote: true
						})
						}
					>
						<span style={{
							fontSize: '0.9em', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'none'
						}}>{translate.to_delegate_vote}</span>
					</ButtonActions>
				)}
				{CBX.canAddDelegateVotes(council.statute, participant) && (
					<ButtonActions
						loading={loading === 6}
						active={participant.state === PARTICIPANT_STATES.DELEGATED}
						onClick={() => {
							this.setState({
								delegateVote: true
							});
						}}
					>
						<span style={{
							fontSize: '0.9em', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textTransform: 'none'
						}}>{translate.add_delegated}</span>

					</ButtonActions>
				)}

				{this.state.delegateOwnVote
					&& <DelegateOwnVoteModal
						show={this.state.delegateOwnVote}
						council={council}
						participant={participant}
						refetch={this.props.refetch}
						requestClose={() => this.setState({ delegateOwnVote: false })
						}
						translate={translate}
					/>
				}

				{(participant.state === PARTICIPANT_STATES.REMOTE
					|| participant.state === PARTICIPANT_STATES.NO_PARTICIPATE
					|| participant.state
					=== PARTICIPANT_STATES.PHYSICALLY_PRESENT
					|| participant.state
					=== PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE) && (
					<DelegateVoteModal
						show={this.state.delegateVote}
						council={council}
						participant={participant}
						refetch={this.props.refetch}
						requestClose={() => this.setState({ delegateVote: false })
						}
						translate={translate}
					/>
				)}
			</Grid>
		);
	}
}


// active poner background
const ButtonActions = ({
	children, loading, onClick, active
}) => (
	<Button
		variant="flat"
		style={{
			display: 'flex',
			alignItems: 'center',
			borderRadius: '4px',
			border: 'solid 1px #a09aa0',
			color: 'black',
			padding: '1em',
			cursor: 'pointer',
			marginRight: '0.5em',
			outline: '0px',
			backgroundColor: active ? getLightGrey() : 'transparent',
		}}
		onClick={onClick}
	>
		{loading ? (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<LoadingSection size={20} />
			</div>
		) : (
			children
		)}
	</Button>
);


export default graphql(changeParticipantState, {
	name: 'changeParticipantState'
})(ParticipantSelectActions);
