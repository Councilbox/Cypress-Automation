import React from 'react';
import { withApollo } from 'react-apollo';
import { bHistory, client } from '../../../containers/App';
import { AlertConfirm, BasicButton, ButtonIcon, TextInput } from '../../../displayComponents';
import {
	createStatute as createStatuteMutation,
} from '../../../queries';
import withSharedProps from '../../../HOCs/withSharedProps';
import { getSecondary } from '../../../styles/colors';


const StatuteCreateButton = ({ company, translate, refetch }) => {
	const [modal, setModal] = React.useState(false);
	const [name, setName] = React.useState('');
	const [error, setError] = React.useState('');
	const [loading, setLoading] = React.useState(false);
	const secondary = getSecondary();

	const createStatute = async () => {
		const regex = new RegExp('^[a-zA-Z0-9-áéíóú]');

		if (name) {
			if ((regex.test(name)) && name.trim()) {
				setLoading(true);
				const statute = {
					title: name,
					companyId: company.id
				};
				const response = await client.mutate({
					mutation: createStatuteMutation,
					variables: {
						statute
					}
				});
				if (!response.errors) {
					const updated = await refetch();
					if (updated) {
						setModal(false);
						bHistory.push(`${window.location.pathname}/${response.data.createCompanyStatute.id}`);
					}
					setName('');
				}
			} else {
				setError(translate.enter_valid_name);
			}
			setLoading(false);
		} else {
			setError(translate.required_field);
		}
	};

	return (
		<>
			<BasicButton
				text={translate.add_council_type}
				id="company-statute-create-button"
				textStyle={{ fontWeight: '700', textTransform: 'none', color: 'white' }}
				color={secondary}
				icon={<ButtonIcon type="add" color="white" />}
				onClick={() => setModal(true)}
			/>
			<AlertConfirm
				requestClose={() => setModal(false)}
				open={modal}
				loadingAction={loading}
				acceptAction={createStatute}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={
					<TextInput
						id={'new-council-type-input'}
						floatingText={translate.council_type}
						required
						type="text"
						errorText={error}
						value={name}
						onChange={event => setName(event.target.value)}
					/>
				}
				title={translate.add_council_type}
			/>
		</>
	);
};

export default withApollo(withSharedProps()(StatuteCreateButton));
