import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton, SuccessMessage } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';

const reducer = (state, action) => {
	const actions = {
		SEND: {
			...state,
			status: 'LOADING',
			modal: true
		},
		SUCCESS: {
			...state,
			status: 'SUCCESS',
			modal: true
		},
		CLOSE_MODAL: {
			...state,
			status: 'INITIAL',
			modal: false
		}
	};

	return actions[action.type] || state;
};


const SendRequestConfirmationButton = ({ client, request, translate }) => {
	const [state, dispatch] = React.useReducer(reducer, {
		status: 'INITIAL',
		modal: false
	});
	const secondary = getSecondary();

	const resendConfirmation = async () => {
		dispatch({ type: 'SEND' });
		await client.mutate({
			mutation: gql`
				mutation sendShareholderConfirmation($participantId: Int!){
					sendShareholderConfirmation(participantId: $participantId){
						success
					}
				}
			`,
			variables: {
				participantId: request.participantId
			}
		});

		dispatch({ type: 'SUCCESS' });
	};


	return (
		<>
			<AlertConfirm
				open={state.modal}
				requestClose={() => dispatch({ type: 'CLOSE_MODAL' })}
				title={translate.sending}
				bodyText={
					state.status === 'SUCCESS' ?
						<SuccessMessage
							message={translate.tooltip_sent}
						/>
						: translate.sending
				}
			/>
			<BasicButton
				buttonStyle={{
					border: `1px solid ${secondary}`,
					marginLeft: '0.3em'
				}}
				color="white"
				textStyle={{ color: secondary }}
				text={translate.resend}
				onClick={resendConfirmation}
			/>
		</>
	);
};

export default withApollo(SendRequestConfirmationButton);
