import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { BasicButton } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import EditorStepLayout from '../../../council/editor/EditorStepLayout';
import SignatureParticipants from './SignatureParticipants';

const SignatureStepTwoIvnosys = ({ client, translate, ...props }) => {
	const [state, setState] = React.useState({
		loading: false,
		error: false
	});

	const sendSignature = async () => {
		setState({
			...state,
			loading: true
		});
		const response = await client.mutate({
			mutation: gql`
				mutation SendSignature($id: Int!){
					sendSignature(id: $id){
						success
					}
				}
			`,
			variables: {
				id: props.signature.id
			}
		});

		if (response.data && response.data.sendSignature && response.data.sendSignature.success) {
			setState({
				...state,
				error: false,
				loading: false
			});
			props.refetch();
		}

		if (response.errors && response.errors[0].message === 'There is no participants added') {
			setState({
				...state,
				loading: false,
				error: translate.participants_required
			});
		}
	};

	const primary = getPrimary();
	const secondary = getSecondary();

	return (
		<EditorStepLayout
			body={
				<div>
					<SignatureParticipants
						company={props.company}
						refetch={props.refetch}
						signature={props.signature}
						translate={translate}
						error={state.error}
						setError={error => {
							setState({
								...state,
								error
							});
						}}
					/>
				</div>
			}
			buttons={
				<div>
					<BasicButton
						text={translate.previous}
						color={secondary}
						textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
						buttonStyle={{ marginRight: '0.8em' }}
						onClick={props.prevStep}
					/>
					<BasicButton
						text={translate.save}
						color={secondary}
						textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
						/// ///cambiar esto
						// onClick={saveSignature}
					/>
					<BasicButton
						text={translate.new_send_to_sign}
						color={primary}
						loading={state.loading}
						textStyle={{ color: 'white', textTransform: 'none', fontWeight: '700' }}
						buttonStyle={{ marginLeft: '0.8em' }}
						onClick={sendSignature}
					/>
				</div>
			}
		/>
	);
};


export default withApollo(SignatureStepTwoIvnosys);
