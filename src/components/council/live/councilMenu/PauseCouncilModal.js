import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, LoadingSection } from '../../../../displayComponents';
import RichTextInput from '../../../../displayComponents/RichTextInput';


const PauseCouncilModal = ({
	open, council, requestClose, client, translate, refetch
}) => {
	const [status, setStatus] = React.useState('IDDLE');
	const [message, setMessage] = React.useState('');

	const initPauseCouncil = async () => {
		setStatus('PAUSING');

		await client.mutate({
			mutation: gql`
				mutation pauseCouncil($councilId: Int!, $message: String){
					pauseCouncil(councilId: $councilId, message: $message){
						success
						message
					}
				}
			`,
			variables: {
				councilId: council.id,
				message
			}
		});

		setStatus('SUCCESS');
		refetch();
	};

	React.useEffect(() => {
		if (!open && status !== 'IDDLE') {
			setMessage('');
			setStatus('IDDLE');
		}
	}, [open]);

	return (
		<AlertConfirm
			open={open}
			title={translate.pause_council}
			acceptAction={initPauseCouncil}
			buttonAccept={translate.confirm}
			buttonCancel={status !== 'IDDLE' ? translate.close : translate.cancel}
			hideAccept={status !== 'IDDLE'}
			requestClose={requestClose}
			bodyText={
				<>
					{status === 'IDDLE' ?
						<RichTextInput
							floatingText={translate.indications_optional}
							type="text"
							id="pause-council-text-editor"
							translate={translate}
							value={message}
							onChange={value => {
								setMessage(value);
							}}
						/>
						: <div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }}>
							{status === 'PAUSING'
								&& <>
									<div>
										{translate.pausing_council}
									</div>
									<div>
										<LoadingSection size={14} />
									</div>
								</>
							}
							{status === 'SUCCESS'
								&& <>
									<div>
										{translate.council_paused}
									</div>
									<div>
										<i className="fa fa-check" style={{ color: 'green' }}></i>
									</div>
								</>
							}
						</div>
					}
				</>
			}
		/>
	);
};

export default withApollo(PauseCouncilModal);
