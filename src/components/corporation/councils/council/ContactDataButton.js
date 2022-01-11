import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import {
	BasicButton, AlertConfirm, TextInput,
} from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';

const ContactDataButton = ({
	translate, council, client, refetch
}) => {
	const [state, setState] = React.useState({
		contactEmail: council.contactEmail || ''
	});
	const [modal, setModal] = React.useState(false);

	const updateCouncil = async object => {
		await client.mutate({
			mutation: gql`
				mutation UpdateCouncil($council: CouncilInput!){
					updateCouncil(council: $council){
						id
					}
				}
			`,
			variables: {
				council: {
					...object,
					id: council.id
				}
			}
		});
		refetch();
	};

	const renderBody = () => {
		return (
			<div style={{ marginTop: '3.5em' }}>
				<div style={{ marginBottom: '1.5em' }}>
					<TextInput
						floatingText={translate.contact_email}
						type="text"
						styleFloatText={{ color: getPrimary(), fontWeight: 'bold', fontSize: '18px' }}
						value={state.contactEmail}
						onChange={event => setState({
							...state,
							contactEmail: event.target.value
						})}
					/>
				</div>
				<div style={{ marginBottom: '2em' }}>
					<TextInput
						floatingText={translate.support_email}
						type="text"
						styleFloatText={{ color: getPrimary(), fontWeight: 'bold', fontSize: '18px' }}
						value={state.supportEmail}
						onChange={event => setState({
							...state,
							supportEmail: event.target.value
						})}
					/>
				</div>
				<div>
					<BasicButton
						text={translate.save}
						backgroundColor={{
							color: 'white',
							fontWeight: '700',
							fontSize: '0.9em',
							textTransform: 'none',
							background: getPrimary(),
							width: '100%'
						}}
						onClick={() => updateCouncil(state)}
					/>
				</div>
			</div>
		);
	};

	return (
		<>
			<AlertConfirm
				open={modal}
				requestClose={() => {
					setModal(false);
				}}
				bodyStyle={{
					minWidth: '398px',
					height: '335px'
				}}
				bodyText={renderBody()}
			/>
			<BasicButton
				text={'Datos de contacto'}
				buttonStyle={{ marginTop: '0.5em', marginBottom: '1.4em', marginRight: '0.6em' }}
				backgroundColor={{
					color: getSecondary(),
					fontWeight: '700',
					fontSize: '0.9em',
					textTransform: 'none',
					border: `1px solid ${getSecondary()}`,
					background: 'white',
					boxShadow: 'none',
					borderRadius: '0'
				}}
				onClick={() => setModal(true)}
			/>
		</>
	);
};


export default withApollo(ContactDataButton);
