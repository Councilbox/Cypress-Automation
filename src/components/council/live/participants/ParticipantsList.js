import React from 'react';
import {
	Grid, LoadMoreButton, Scrollbar, LoadingSection, AlertConfirm
} from '../../../../displayComponents';

import ParticipantItem from './ParticipantItem';
import SignatureModal from './modals/SignatureModal';
import LiveParticipantEditor from './LiveParticipantEditor';
import { useOldState } from '../../../../hooks';
import { PARTICIPANT_STATES } from '../../../../constants';
import { getMainRepresentative } from '../../../../utils/CBX';
import { isMobile } from '../../../../utils/screen';

const ParticipantsList = ({
	mode, translate, layout, council, refetch, loadMore, loading, loadingMore, participants, root
}) => {
	const [state, setState] = useOldState({
		showSignatureModal: false,
		participantToSign: null,
		editParticipant: null
	});

	const getSignatureParticipant = participant => {
		if (participant.state === PARTICIPANT_STATES.REPRESENTATED) {
			return getMainRepresentative(participant);
		}
		return participant;
	};

	const showSignatureModal = participant => () => {
		setState({
			...state,
			showSignatureModal: true,
			participantToSign: getSignatureParticipant(participant)
		});
	};


	return (
		<React.Fragment>
			{loading && false ?
				<div
					style={{
						marginTop: '5em',
						width: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<LoadingSection />
				</div>

				: participants.list.length > 0 ? (
					<Scrollbar>
						<Grid spacing={0} style={{ padding: '1em' }} alignContent={'flex-start'}>
							{participants.list.map(
								(participant, index) => <React.Fragment key={`participant_${participant.id}`}>
									<ParticipantItem
										layout={layout}
										key={`participant_${participant.id}`}
										participant={participant}
										id={`participant-item-${index}`}
										translate={translate}
										mode={mode}
										refetch={refetch}
										showSignatureModal={showSignatureModal(participant)}
										editParticipant={() => setState({
											editParticipant: participant.id
										})}
										council={council}
									/>
								</React.Fragment>
							)}
							{(participants.list.length < participants.total) && (
								<LoadMoreButton
									onClick={loadMore}
									loading={loadingMore}
								/>
							)}
						</Grid>
						{state.showSignatureModal
							&& <SignatureModal
								show={state.showSignatureModal}
								council={council}
								participant={state.participantToSign}
								refetch={refetch}
								requestClose={() => {
									setState({ showSignatureModal: false, participantToSign: null });
								}
								}
								translate={translate}
							/>
						}
						{state.editParticipant
							&& <AlertConfirm
								open={!!state.editParticipant}
								classNameDialog={isMobile ? 'livePArticipants' : ''}
								bodyStyle={
									isMobile ? { padding: '0.3em', maxWidth: '100%' } : { minWidth: '90vw', overflowY: 'hidden' }
								}
								fullWidth={true}
								// fullScreen={true}
								requestClose={() => {
									setState({
										editParticipant: undefined
									});
									refetch();
								}}
								bodyText={
									<div style={{ height: '70vh' }}>
										<LiveParticipantEditor
											translate={translate}
											council={council}
											root={root}
											refetch={refetch}
											id={state.editParticipant}

										/>
									</div>
								}
							/>
						}
					</Scrollbar>
				)
					: (
						<div style={{ marginLeft: '2em' }}>
							{translate.no_results}
						</div>
					)
			}
		</React.Fragment>
	);
};


export default ParticipantsList;
