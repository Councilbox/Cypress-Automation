import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import withSharedProps from '../../../HOCs/withSharedProps';
import {
	AlertConfirm,
	BasicButton,
	ButtonIcon,
	LiveToast,
	Scrollbar,
	UnsavedChangesModal,
	LoadingSection,
	TextInput,
	VTabs
} from '../../../displayComponents';
import {
	createStatute as createStatuteMutation,
	statutes,
	updateStatute as updateStatuteMutation
} from '../../../queries';
import { censuses } from '../../../queries/census';
import { store } from '../../../containers/App';
import { setUnsavedChanges } from '../../../actions/mainActions';
import StatuteEditor from './StatuteEditor';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { checkForUnclosedBraces, removeTypenameField } from '../../../utils/CBX';
import { isMobile } from '../../../utils/screen';
import StatutesList from './StatutesList';


const StatutesPage = ({
	data, translate, client, hideCardPageLayout, statuteId, ...props
}) => {
	const [censusList, setCensusList] = React.useState(null);

	React.useEffect(() => {
		const requestCensus = async () => {
			const response = await client.query({
				query: censuses,
				variables: {
					companyId: +props.company.id
				}
			});

			setCensusList(response.data);
		};

		requestCensus();
	}, [censuses]);

	

	// const openEditModal = index => {
	// 	setState({
	// 		...state,
	// 		editModal: index
	// 	});
	// };

	// const resetButtonStates = () => {
	// 	setState({
	// 		...state,
	// 		error: false,
	// 		loading: false,
	// 		success: false
	// 	});
	// };

	// const createStatute = async () => {
	// 	const regex = new RegExp('^[a-zA-Z0-9-áéíóú]');

	// 	if (state.newStatuteName) {
	// 		if ((regex.test(state.newStatuteName)) && state.newStatuteName.trim()) {
	// 			setState({
	// 				...state,
	// 				newLoading: true
	// 			});
	// 			const statute = {
	// 				title: state.newStatuteName,
	// 				companyId: props.company.id
	// 			};
	// 			const response = await props.createStatute({
	// 				variables: {
	// 					statute
	// 				}
	// 			});
	// 			if (!response.errors) {
	// 				const updated = await data.refetch();
	// 				if (updated) {
	// 					setState({
	// 						...state,
	// 						newStatute: false
	// 					});
	// 					handleStatuteChange(data.companyStatutes.length - 1);
	// 				}
	// 				setState({
	// 					...state,
	// 					newStatuteName: '',
	// 					newStatute: false,
	// 					newLoading: false
	// 				});
	// 			}
	// 		} else {
	// 			setState({
	// 				...state,
	// 				errors: {
	// 					...state.errors,
	// 					newStatuteName: translate.enter_valid_name
	// 				}
	// 			});
	// 		}
	// 	} else {
	// 		setState({
	// 			...state,
	// 			errors: {
	// 				...state.errors,
	// 				newStatuteName: translate.required_field
	// 			}
	// 		});
	// 	}
	// };

	

	// const showNewStatute = () => setState({
	// 	...state,
	// 	newStatute: true,
	// 	errors: {
	// 		...state.errors,
	// 		newStatuteName: ''
	// 	}
	// });

	// const restoreStatute = () => {
	// 	setState({
	// 		...state,
	// 		statute: null,
	// 		unsavedChanges: false,
	// 		rollbackAlert: false,
	// 		unsavedAlert: false
	// 	});

	// 	store.dispatch(setUnsavedChanges(false));
	// };

	// React.useLayoutEffect(() => {
	// 	setEditorHeight(statuteEditorRef.current?.offsetHeight || '100%');
	// }, [statuteEditorRef.current]);

	const { companyStatutes } = data;
	//const { statute, errors, success } = state;
	const secondary = getSecondary();

	if (!companyStatutes) {
		return <LoadingSection />;
	}

	//const disabled = statute && (statute.companyId !== props.company.id);

	// const body = () => (
	// 	<>
	// 		{companyStatutes.length > 0 ? (
	// 			<div style={{ height: `calc( 100% ${isMobile ? '- 2em' : ''})`, paddingRight: '0', display: !isMobile && 'flex' }}>
	// 				<div>
	// 					<VTabs
	// 						tabs={tabs}
	// 						changeTab={handleStatuteChange}
	// 						index={state.selectedStatute}
	// 						additionalTab={
	// 							<BasicButton
	// 								text={translate.add_council_type}
	// 								id={'anadirTipoDeReunion'}
	// 								fullWidth
	// 								loading={state.newLoading}
	// 								textStyle={{ fontWeight: '700', textTransform: 'none', color: 'white' }}
	// 								color={secondary}
	// 								icon={<ButtonIcon type="add" color="white" />}
	// 								onClick={showNewStatute}
	// 							/>
	// 						}
	// 						additionalTabAction={showNewStatute}
	// 						translate={translate}
	// 						editAction={openEditModal}
	// 					>
	// 					</VTabs>
	// 				</div>
	// 				<div style={{ width: '100%', height: '100%' }}>
	// 					{!!statute && (
	// 						<React.Fragment>
	// 							<div style={{ overflow: 'hidden', height: 'calc(100% - 4.5em)', width: '100%' }}>
	// 								<Scrollbar>
	// 									<div style={{ position: 'relative' }}>
	// 										{disabled
	// 											&& <>
	// 												<div
	// 													style={{
	// 														position: 'absolute',
	// 														top: '0',
	// 														left: '0',
	// 														width: '100%',
	// 														height: editorHeight,
	// 														// backgroundColor: 'red',
	// 														zIndex: 1000000
	// 													}}
	// 													onClick={() => { }}
	// 												/>
	// 												<div
	// 													style={{
	// 														width: '100%',
	// 														textAlign: 'center',
	// 														border: '1px solid black',
	// 														borderRadius: '4px',
	// 														fontWeight: '700',
	// 														padding: '0.6em 0',
	// 														margin: '1em 0'
	// 													}}
	// 												>
	// 													{translate.organization_statute} <br />
	// 													{translate.read_only}
	// 												</div>
	// 											</>
	// 										}
	// 										<div style={{ paddingLeft: '1em', paddingRight: '1.5em', overflow: 'hidden' }} ref={statuteEditorRef}>
	// 											<StatuteEditor
	// 												companyStatutes={companyStatutes}
	// 												statute={statute}
	// 												censusList={censusList}
	// 												company={props.company}
	// 												disabled={disabled}
	// 												translate={translate}
	// 												organization={props.organization}
	// 												updateState={updateState}
	// 												errors={state.errors}
	// 											/>
	// 											<br />
	// 										</div>
	// 									</div>
	// 								</Scrollbar>
	// 							</div>
	// 							<div
	// 								style={{
	// 									width: '100%',
	// 									height: '3.5em',
	// 									paddingTop: '0.5em',
	// 									borderTop: '1px solid gainsboro',
	// 									display: 'flex',
	// 									paddingRight: '1em',
	// 									justifyContent: 'flex-end',
	// 									alignItems: 'center'
	// 								}}
	// 							>
	// 								<div>
	// 									{state.unsavedChanges
	// 										&& <BasicButton
	// 											id="discard-changes-button"
	// 											color={getSecondary()}
	// 											textStyle={{
	// 												color: 'white',
	// 												fontWeight: '700',
	// 												textTransform: 'none'
	// 											}}
	// 											buttonStyle={{
	// 												marginRight: '0.8em'
	// 											}}
	// 											onClick={() => setState({
	// 												...state,
	// 												rollbackAlert: true
	// 											})}
	// 											icon={
	// 												<ButtonIcon
	// 													type={'replay'}
	// 													color="white"
	// 												/>
	// 											}
	// 										/>
	// 									}
	// 									{!disabled
	// 										&& <BasicButton
	// 											text={translate.save}
	// 											id="council-statute-save-button"
	// 											disabled={state.error}
	// 											color={success ? 'green' : getPrimary()}
	// 											textStyle={{
	// 												color: 'white',
	// 												fontWeight: '700',
	// 												textTransform: 'none'
	// 											}}
	// 											onClick={updateStatute}
	// 											loading={state.loading}
	// 											error={state.error}
	// 											reset={resetButtonStates}
	// 											success={success}
	// 											icon={
	// 												<ButtonIcon
	// 													type={'save'}
	// 													color="white"
	// 												/>
	// 											}
	// 										/>
	// 									}
	// 								</div>
	// 							</div>
	// 						</React.Fragment>
	// 					)}
	// 				</div>
	// 			</div>
	// 		) : (
	// 			<div
	// 				style={{
	// 					width: '100%',
	// 					height: '100%',
	// 					display: 'flex',
	// 					alignItems: 'center',
	// 					flexDirection: 'column',
	// 					marginTop: '4em'
	// 				}}
	// 			>
	// 				<span style={{ fontSize: '1.1em', fontWeight: '700', marginBottom: '1em' }}>
	// 					{translate.no_council_types}
	// 				</span>
	// 				<BasicButton
	// 					text={translate.add_council_type}
	// 					textStyle={{ fontWeight: '700', textTransform: 'none', color: 'white' }}
	// 					color={secondary}
	// 					icon={<ButtonIcon type="add" color="white" />}
	// 					onClick={showNewStatute}
	// 				/>
	// 			</div>
	// 		)}
	// 		<UnsavedChangesModal
	// 			cancelAction={() => {
	// 				restoreStatute();
	// 			}}
	// 			acceptAction={updateStatute}
	// 			requestClose={() => setState({ ...state, unsavedAlert: false })}
	// 			open={state.unsavedAlert}
	// 		/>
	// 		<AlertConfirm
	// 			title={translate.attention}
	// 			bodyText={translate.are_you_sure_undo_changes}
	// 			open={state.rollbackAlert}
	// 			buttonAccept={translate.accept}
	// 			acceptAction={restoreStatute}
	// 			buttonCancel={translate.cancel}
	// 			modal={true}
	// 			requestClose={() => setState({ ...state, rollbackAlert: false })}
	// 		/>
	// 		<AlertConfirm
	// 			requestClose={() => setState({ ...state, newStatute: false })
	// 			}
	// 			open={state.newStatute}
	// 			acceptAction={createStatute}
	// 			buttonAccept={translate.accept}
	// 			buttonCancel={translate.cancel}
	// 			bodyText={
	// 				<TextInput
	// 					id={'anadirTipoDeReunionInputEnModal'}
	// 					floatingText={translate.council_type}
	// 					required
	// 					type="text"
	// 					errorText={errors.newStatuteName}
	// 					value={statute ? statute.newStatuteName : state.newStatuteName}
	// 					onChange={event => setState({
	// 						...state,
	// 						newStatuteName: event.target.value
	// 					})}
	// 				/>
	// 			}
	// 			title={translate.add_council_type}
	// 		/>
	// 	</>
	// );


	if (statuteId) {
		return (
			<StatuteEditor
				statuteId={statuteId}
				censusList={censusList}
				company={props.company}
				//disabled={disabled}
				translate={translate}
				organization={props.organization}
			/>
		);
	}

	return (
		<>
			<StatutesList
				statutes={data.companyStatutes}
				translate={translate}
				refetch={data.refetch}
			/>
		</>
	);
};


export default withSharedProps()(
	compose(
		graphql(updateStatuteMutation, {
			name: 'updateStatute'
		}),
		graphql(createStatuteMutation, {
			name: 'createStatute'
		}),
		graphql(statutes, {
			options: props => ({
				variables: {
					companyId: props.companyId
				},
				notifyOnNetworkStatusChange: true,
				fetchPolicy: 'network-only'
			})
		})
	)(withRouter(withApollo(StatutesPage)))
);
