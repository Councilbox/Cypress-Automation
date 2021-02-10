import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { TextInput, BasicButton } from '../../../../displayComponents';

const CostManager = ({ council, updateCouncil }) => {
	const [formData, setFormData] = React.useState({
		price: council.price,
		promoCode: council.promoCode
	});
	const [loading, setLoading] = React.useState(false);

	const updatePrice = event => {
		setFormData({
			...formData,
			price: event.target.value
		});
	};

	const updateObservations = event => {
		setFormData({
			...formData,
			promoCode: event.target.value
		});
	};

	const sendUpdate = async () => {
		setLoading(true);
		await updateCouncil({
			variables: {
				council: {
					id: council.id,
					price: formData.price,
					promoCode: formData.promoCode
				}
			}
		});

		setLoading(false);
	};

	return (
		<div>
			<TextInput
				floatingText="Coste"
				value={formData.price || ''}
				onChange={updatePrice}
				styles={{ marginBottom: '0.8em' }}
			/>
			<TextInput
				floatingText="Observaciones sobre el coste"
				value={formData.promoCode || ''}
				onChange={updateObservations}
			/>
			<BasicButton
				buttonStyle={{ marginTop: '1em' }}
				text="Guardar"
				loading={loading}
				onClick={sendUpdate}
			/>
		</div>
	);
};

const updateCouncil = gql`
	mutation UpdateCouncil($council: CouncilInput){
		updateCouncil(council: $council){
			id
			price
			promoCode
		}
	}
`;

export default graphql(updateCouncil, { name: 'updateCouncil' })(CostManager);
