
import React from 'react';
import { withApollo } from 'react-apollo';
import {
	AlertConfirm, UnsavedChangesModal
} from '../../../../../displayComponents';
import { census, updateCensus } from '../../../../../queries/census';
import CensusInfoForm from '../../CensusInfoForm';
import { INPUT_REGEX } from '../../../../../constants';
import { removeTypenameField } from '../../../../../utils/CBX';
import { isMobile } from '../../../../../utils/screen';

const EditCensusButton = ({ translate, client, ...props }) => {
	const [initInfo, setInitInfo] = React.useState({});
	const [state, setState] = React.useState({
		data: {},
		errors: {},
		unsavedAlert: false,
	});

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: census,
			variables: {
				id: props.censusId
			}
		});
		setState({ ...state, data: response.data.census });
		setInitInfo(response.data.census);
	}, []);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const checkRequiredFields = () => {
		let hasError = false;

		if (state.data.censusName) {
			if (!(INPUT_REGEX.test(state.data.censusName)) || !state.data.censusName.trim()) {
				hasError = true;
				setState({
					...state,
					errors: {
						...state.errors,
						censusName: translate.invalid_field
					}
				});
			}
		}
		if (state.data.censusDescription) {
			if (!(INPUT_REGEX.test(state.data.censusDescription)) || !state.data.censusDescription.trim()) {
				hasError = true;
				setState({
					...state,
					errors: {
						...state.errors,
						censusDescription: translate.invalid_field
					}
				});
			}
		}

		if (!state.data.censusName) {
			hasError = true;
			setState({
				...state,
				errors: {
					...state.errors,
					censusName: translate.required_field
				}
			});
		}
		if (hasError) {
			return true;
		}
		return false;
	};

	const updateCensusFunction = async () => {
		if (!checkRequiredFields()) {
			const censusData = removeTypenameField(state.data);
			const response = await client.mutate({
				mutation: updateCensus,
				variables: {
					census: censusData
				}
			});
			if (!response.errors) {
				await props.refetch();
				props.requestClose();
			}
		}
	};

	const updateState = object => {
		setState({
			...state,
			data: {
				...state.data,
				...object
			}
		});
	};

	const renderBody = () => (
		<div style={{ minWidth: !isMobile && '800px' }}>
			<CensusInfoForm
				translate={translate}
				errors={state.errors}
				updateState={updateState}
				census={state.data}
			/>
		</div >
	);

	const comprobateChanges = () => {
		const unsavedAlert = JSON.stringify(initInfo) !== JSON.stringify(state.data);
		setState({
			...state,
			unsavedAlert
		});
		return unsavedAlert;
	};

	const closeModal = () => {
		const equals = comprobateChanges();
		if (!equals) {
			props.requestClose();
		}
	};

	return (
		<div>
			<AlertConfirm
				requestClose={closeModal}
				// requestClose={props.requestClose}
				open={props.open}
				acceptAction={updateCensusFunction}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				bodyText={renderBody()}
				title={translate.edit_census}
			/>
			<UnsavedChangesModal
				acceptAction={updateCensusFunction}
				cancelAction={() => {
					setState({ unsavedAlert: false });
					props.requestClose();
				}}
				requestClose={() => setState({ ...state, unsavedAlert: false })}
				open={state.unsavedAlert}
			/>
		</div>
	);
};

export default withApollo(EditCensusButton);
