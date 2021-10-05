import React from 'react';
import Dialog, {
	DialogActions,
	DialogContent,
	DialogTitle
} from 'material-ui/Dialog';
import {
	BasicButton,
	Checkbox,
	LoadingSection,
	TextInput
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { useOldState } from '../../../hooks';


const PlaceModal = ({ council, translate, ...props }) => {
	const [data, setData] = React.useState({
		street: council.street,
		city: council.city,
		country: council.country,
		zipcode: council.zipcode,
		countryState: council.countryState,
		remoteCelebration: 0
	});

	const [state, setState] = useOldState({
		remoteCelebration: council.remoteCelebration,
		errors: {
			address: '',
			city: '',
			country: '',
			zipcode: '',
			region: ''
		}
	});
	const primary = getPrimary();


	const saveAndClose = () => {
		if (!checkRequiredFields()) {
			if (!state.remoteCelebration) {
				props.saveAndClose(data);
			} else {
				props.saveAndClose({
					street: translate.remote_celebration,
					remoteCelebration: 1,
					country: '',
					countryState: '',
					city: '',
					zipcode: ''
				});
			}
		}
	};

	const renderActionButtons = () => (
		<React.Fragment>
			<BasicButton
				text={translate.close}
				id={'close-button'}
				type="flat"
				color={'white'}
				textStyle={{
					fontWeight: '700',
					fontSize: '0.9em',
					textTransform: 'none'
				}}
				textPosition="after"
				onClick={() => {
					props.close();
					setState({
						...state,
						remoteCelebration: council.remoteCelebration
					});
				}}
			/>
			<BasicButton
				text={translate.accept}
				color={primary}
				id="accept-button"
				textStyle={{
					color: 'white',
					fontWeight: '700',
					fontSize: '0.9em',
					textTransform: 'none'
				}}
				buttonStyle={{ marginLeft: '1em' }}
				textPosition="after"
				onClick={saveAndClose}
			/>
		</React.Fragment>
	);

	function checkRequiredFields() {
		if (state.remoteCelebration) {
			return false;
		}

		const errors = {
			country: '',
			countryState: '',
			street: '',
			zipcode: '',
			city: ''
		};

		let hasError = false;

		if (!data.country) {
			hasError = true;
			errors.country = translate.field_required;
		}

		if (!data.street) {
			hasError = true;
			errors.street = translate.field_required;
		}

		if (!data.city) {
			hasError = true;
			errors.city = translate.field_required;
		}

		if (!data.zipcode) {
			hasError = true;
			errors.zipcode = translate.field_required;
		}

		if (!data.countryState) {
			hasError = true;
			errors.countryState = translate.field_required;
		}

		setState({
			...state,
			errors
		});

		return hasError;
	}


	if (!data) {
		return <LoadingSection />;
	}

	return (
		<Dialog disableBackdropClick={true} open={props.open}>
			<DialogTitle>{translate.new_location_of_celebrate}</DialogTitle>
			<DialogContent>
				<Checkbox
					label={translate.remote_celebration}
					id="council-place-remote"
					value={state.remoteCelebration === 1}
					onChange={(event, isInputChecked) => setState({
						remoteCelebration: isInputChecked ? 1 : 0
					})
					}
				/>
				{!state.remoteCelebration && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<TextInput
							floatingText={translate.company_new_country}
							type="text"
							id="council-place-country"
							errorText={state.errors.country}
							value={data.country}
							onChange={event => setData({
								...data,
								country: event.nativeEvent.target.value
							})
							}
						/>
						<TextInput
							floatingText={translate.company_new_country_state}
							id="council-place-country-state"
							type="text"
							errorText={state.errors.countryState}
							value={data.countryState}
							onChange={event => setData({
								...data,
								countryState: event.nativeEvent.target.value
							})
							}
						/>
						<TextInput
							floatingText={translate.company_new_zipcode}
							type="text"
							id="council-place-zipcode"
							errorText={state.errors.zipcode}
							value={data.zipcode}
							onChange={event => setData({
								...data,
								zipcode: event.nativeEvent.target.value
							})
							}
						/>
						<TextInput
							floatingText={translate.company_new_locality}
							id="council-place-city"
							type="text"
							errorText={state.errors.city}
							value={data.city}
							onChange={event => setData({
								...data,
								city: event.nativeEvent.target.value
							})
							}
						/>
						<TextInput
							floatingText={translate.company_new_address}
							type="text"
							id="council-place-address"
							errorText={state.errors.street}
							value={data.street}
							onChange={event => setData({
								...data,
								street: event.nativeEvent.target.value
							})
							}
						/>
					</div>
				)}
			</DialogContent>
			<DialogActions>{renderActionButtons()}</DialogActions>
		</Dialog>
	);
};


export default PlaceModal;
