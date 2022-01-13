import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import {
	BasicButton, AlertConfirm, TextInput,
} from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { checkValidEmail } from '../../../../utils';

const ContactDataButton = ({
	translate, councilId, client
}) => {
	const [data, setData] = React.useState({});
	const [modal, setModal] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [errors, setErrors] = React.useState(false);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
			query CouncilDetailsRoot($id: Int!){
				council(id: $id) {
					id
					contactEmail
					supportEmail
				}
			}
		`,
			variables: {
				id: councilId
			}
		});
		setData(response.data.council);
	}, []);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const updateCouncil = async () => {
		if (!checkRequiredFields()) {
			setLoading(true);
			const response = await client.mutate({
				mutation: gql`
				mutation UpdateCouncil($council: CouncilInput!){
					updateCouncil(council: $council){
						id
					}
				}
			`,
				variables: {
					council: {
						id: councilId,
						contactEmail: data.contactEmail,
						supportEmail: data.supportEmail
					}
				}
			});
			if (response.data.updateCouncil.id) {
				setLoading(false);
				setModal(false);
				setErrors(false);
				getData();
			}
		}
	};

	const checkRequiredFields = () => {
		if (data.contactEmail && !checkValidEmail(data.contactEmail)) {
			setErrors({
				...errors,
				contactEmail: translate.email_not_valid
			});
			return true;
		}

		return false;
	};

	const renderBody = () => {
		return (
			<div style={{ marginTop: '3.5em' }}>
				<div style={{ marginBottom: '1.5em' }}>
					<TextInput
						floatingText={translate.contact_email}
						type="text"
						styleFloatText={{ color: getPrimary(), fontWeight: 'bold', fontSize: '18px' }}
						value={data.contactEmail}
						errorText={errors.contactEmail}
						onChange={event => setData({
							...data,
							contactEmail: event.target.value
						})}
					/>
				</div>
				<div style={{ marginBottom: '2em' }}>
					<TextInput
						floatingText={translate.support_email}
						type="text"
						styleFloatText={{ color: getPrimary(), fontWeight: 'bold', fontSize: '18px' }}
						value={data.supportEmail}
						onChange={event => setData({
							...data,
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
						loading={loading}
						onClick={() => updateCouncil(data)}
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
