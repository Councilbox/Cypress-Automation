import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { withRouter } from 'react-router-dom';
import withSharedProps from '../../../HOCs/withSharedProps';
import {
	Scrollbar,
	LoadingSection,
} from '../../../displayComponents';
import { statutes } from '../../../queries';
import { censuses } from '../../../queries/census';
import StatuteEditor from './StatuteEditor';
import { getSecondary } from '../../../styles/colors';
import StatutesList from './StatutesList';
import StatuteCreateButton from './StatuteCreateButton';


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
	// 							
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
	// 		
	// 	</>
	// );


	if (statuteId) {
		return (
			<StatuteEditor
				statuteId={statuteId}
				censusList={censusList}
				company={props.company}
				translate={translate}
				organization={props.organization}
			/>
		);
	}

	return (
		<div
			style={{
				height: '100%'
			}}
		>
			<Scrollbar>
				<div
					style={{
						padding: '1em'
					}}
				>
					<StatuteCreateButton
						refetch={data.refetch}
					/>
					<StatutesList
						statutes={data.companyStatutes}
						translate={translate}
						refetch={data.refetch}
					/>
				</div>
			</Scrollbar>
		</div>
	);
};


export default withSharedProps()(
	compose(
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
