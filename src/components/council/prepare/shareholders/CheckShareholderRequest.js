import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton, AlertConfirm } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import ApproveRequestButton from './ApproveRequestButton';
import AddShareholder from './AddShareholder';
import { downloadFile } from '../../../../utils/CBX';
import RefuseRequestButton from './RefuseRequestButton';
import DelegateVoteButton from './DelegateVoteButton';
import { getVote } from '../../../participant/ResultsTimeline';
import SendRequestConfirmationButton from './SendRequestConfirmationButton';
import { SERVER_URL } from '../../../../config';
import { useDownloadDocument } from '../../../../hooks';

export const getTypeText = (text, translate) => {
	const texts = {
		access: translate.assistance,
		// 'access': 'Asistencia a la junta general',
		vote: translate.early_vote,
		represent: translate.vote_delegation,
		representation: translate.vote_represented
	};

	return texts[text];
};


const CheckShareholderRequest = ({
	request, translate, refetch, client, council
}) => {
	const [modal, setModal] = React.useState(false);
	const [modalAlert, setModalAlert] = React.useState(false);
	const [inModal, setInModal] = React.useState(null);
	const [representative, setRepresentative] = React.useState(false);
	const secondary = getSecondary();
	const [, download] = useDownloadDocument();

	const downloadAttachment = async (requestId, index) => {
		const response = await client.query({
			query: gql`
			query ShareholdersRequestAttachment($requestId: Int!, $index: Int!){
				shareholdersRequestAttachment(requestId: $requestId, index: $index){
					base64
					filename
					filetype
				}
			}
			`,
			variables: {
				requestId,
				index
			}
		});
		const file = response.data.shareholdersRequestAttachment;
		const base64 = file.base64.split(';base64,').pop();
		downloadFile(base64, file.filetype, file.filename);
	};

	const downloadNew = async attachment => {
		download(`${SERVER_URL}/portalRequestAttachment/${attachment.id}`, attachment.filename);
	};

	const modalBody = () => (
		<>
			<div>
				<h5>{translate.data}:</h5>
				<div>
					{`${translate.name}: ${request.data.name} ${request.data.surname || ''}`}
				</div>
				<div>
					{`${translate.dni}: ${request.data.dni}`}
				</div>
				<div>
					{translate.type_of_request}: {getTypeText(request.data.requestType, translate)}
				</div>
				{Object.prototype.hasOwnProperty.call(request.data, 'assistanceIntention') &&
					<>
						{translate.assistance_intention}:
						{request.data.assistanceIntention === 0 && translate.customer_initial}
						{request.data.assistanceIntention === 5 && translate.in_person}
					</>
				}
				{request.data.requestType === 'vote'
					&& <>
						{request.data.earlyVotes && request.data.earlyVotes.map((vote, index) => (
							<div key={`early_vote_${index}`}>
								<div style={{ fontWeight: '700' }}>{vote.name}</div>
								<div>-{getVote(+vote.value, translate)}</div>
							</div>
						))}
					</>
				}
				{(request.data.requestType === 'represent' || request.data.requestType === 'representation')
					&& <>
						En:
						{Array.isArray(request.data.representative) ?
							<div style={{ marginBotton: '2em' }}>
								{(request.data.representative[0].value === 'el presidente' || request.data.representative[0].value === 'el secretario' || (request.data.representative[0].value && request.data.representative[0].value.includes('Presidente'))) ?
									request.data.representative[0].value
									: request.data.representative[0].info.map((data, index) => (
										data.value
										&& <div key={index}>
											{data.name}  - {data.value}
										</div>
									))}
							</div>
							: request.data.representative
							&& <div style={{ marginBotton: '2em' }}>
								<div>
									{request.data.representative.name} {request.data.representative.surname || ''}
								</div>
							</div>

						}

						{request.data.earlyVotes && request.data.earlyVotes.map((vote, index) => (
							<div key={`early_votes_${index}`}>
								<div style={{ fontWeight: '700' }}>{vote.name}</div>
								<div>-{getVote(+vote.value, translate)}</div>
							</div>
						))}
					</>
				}
			</div>
			<div style={{ marginTop: '1em', marginBottom: '1.6em' }}>
				{request.data.attachments?.length > 0
					&& <div>  {translate.attachments} :</div>
				}
				{request.data.attachments ?
					request.data.attachments?.map((attachment, index) => (
						<div
							key={index}
							onClick={() => downloadAttachment(request.id, index)}
							style={{ cursor: 'pointer' }}
						>
							<i className='fa fa-file-pdf-o'></i>  {attachment.name}
						</div>
					))
					: ''
				}
				{request.attachments?.length > 0
					&& <div>  {translate.attachments} :</div>
				}
				{request.attachments ?
					request.attachments?.map((attachment, index) => (
						<div key={index} onClick={() => downloadNew(attachment)} style={{ cursor: 'pointer' }}>
							<i className='fa fa-file-pdf-o'></i>  {attachment.filename}
						</div>
					))
					: ''
				}
			</div>
			<AddShareholder
				request={request}
				council={council}
				refetch={refetch}
				translate={translate}
			/>
			<RefuseRequestButton
				request={request}
				refetch={refetch}
				translate={translate}
			/>
			{request.state !== '3'
				&& <ApproveRequestButton
					request={request}
					refetch={refetch}
					translate={translate}
				/>
			}
			{request.participantCreated
				&& <SendRequestConfirmationButton
					request={request}
					refetch={refetch}
					translate={translate}
				/>

			}
			{request.participantCreated && request.data.requestType === 'represent'
				&& <DelegateVoteButton
					request={request}
					refetch={refetch}
					translate={translate}
					setRepresentative={setRepresentative}
				/>
			}
		</>
	);


	const closeModal = () => {
		if (!representative && request.data.requestType === 'represent' && request.participantCreated) {
			setModalAlert(true);
		} else {
			setModal(false);
		}
	};

	const closeModals = () => {
		setModal(false);
		setModalAlert(false);
		refetch();
	};

	const closeModalAlert = () => {
		setModalAlert(false);
		if (inModal) {
			setInModal(false);
		}
		refetch();
	};


	return (
		<>
			<AlertConfirm
				title={inModal ? translate.to_delegate_vote : 'Alerta'}// TRADUCCION
				bodyText={
					<div>
						{inModal ?
							<div style={{ display: 'flex', marginTop: '1em', justifyContent: 'flex-end' }}>
								<DelegateVoteButton
									text={translate.continue}
									request={request}
									refetch={refetch}
									translate={translate}
									setRepresentative={setRepresentative}
									closeModal={() => setModalAlert(false)}
									setInModal={setInModal}
									inModal={inModal}
									closeModalAlert={() => { setModalAlert(false); refetch(); }}
								/>
							</div>
							: <div>
								<div>{translate.user_marked_delegation_vote}</div>
								<div style={{ display: 'flex', marginTop: '1em', justifyContent: 'flex-end' }}>
									<DelegateVoteButton
										text={translate.to_delegate_vote}
										request={request}
										refetch={refetch}
										translate={translate}
										setRepresentative={setRepresentative}
										closeModal={() => setModalAlert(false)}
										setInModal={setInModal}
										inModal={inModal}
									/>
									<BasicButton
										text={translate.close}
										onClick={closeModals}
										buttonStyle={{
											border: `1px solid ${secondary}`,
											marginLeft: '1em'
										}}
										color="white"
										textStyle={{ color: secondary }}
									// onClick={approveRequest}
									/>
								</div>
							</div>
						}
					</div>
				}
				requestClose={closeModalAlert}
				open={modalAlert}
			/>
			<BasicButton
				text="Revisar"
				onClick={() => setModal(request)}
				buttonStyle={{
					border: `1px solid ${secondary}`
				}}
				color="white"
				textStyle={{ color: secondary }}
			// onClick={approveRequest}
			/>
			<AlertConfirm
				title={'Solicitud'}
				bodyText={modalBody()}
				requestClose={closeModal}
				open={modal}
			/>
		</>
	);
};

export default withApollo(CheckShareholderRequest);
