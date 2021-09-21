import React from 'react';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import {
	Scrollbar,
	LiveToast,
	BasicButton,
	ButtonIcon,
	UnsavedChangesModal
} from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';
import { updateStatute as updateStatuteMutation } from '../../../queries';
import { getPrimary } from '../../../styles/colors';
import withSharedProps from '../../../HOCs/withSharedProps';
import StatuteForm from './StatuteForm';
import { bHistory } from '../../../containers/App';
import StatuteEditorUndoChangesButton from './StatuteEditorUndoChangesButton';

const StatuteEditor = ({
	statuteId,
	translate,
	organization,
	company,
	censusList,
	client
}) => {
	const [statute, setStatute] = React.useState(null);
	const [unsavedAlert, setUnsavedAlert] = React.useState(false);
	const [editorHeight, setEditorHeight] = React.useState('100%');
	const [state, setState] = React.useState({
		statute: {},
		errors: {}
	});
	const disabled = statute && (statute.companyId !== company.id);
	const statuteEditorRef = React.useRef();

	React.useLayoutEffect(() => {
		let timeout;
		if (statuteEditorRef.current && statuteEditorRef.currentoffsetHeight !== `${statuteEditorRef.current?.offsetHeight + 180}px`) {
			timeout = setTimeout(() => {
				setEditorHeight(statuteEditorRef.current?.offsetHeight ? `${statuteEditorRef.current?.offsetHeight + 180}px` : '100%');
			}, 500);
		}

		return () => clearTimeout(timeout);
	}, [statuteEditorRef.current]);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query CompanyStatute($statuteId: ID!) {
					companyStatute(statuteId: $statuteId) {
						id
						companyId
						title
						lastEdited
						existPublicUrl
						language
						companyType
						defaultVote
						videoConfig
						autoSendAct
						autoApproveAct
						hideVotingsRecountFinished
						addParticipantsListToAct
						existsAdvanceNoticeDays
						advanceNoticeDays
						existsSecondCall
						minimumSeparationBetweenCall
						firstCallQuorumType
						firstCallQuorum
						secondCallQuorumType
						secondCallQuorum
						existsDelegatedVote
						delegatedVoteWay
						existMaxNumDelegatedVotes
						maxNumDelegatedVotes
						existsPresentWithRemoteVote
						existsLimitedAccessRoom
						limitedAccessRoomMinutes
						existsQualityVote
						qualityVoteOption
						canAddPoints
						canReorderPoints
						existsAct
						includedInActBook
						canUnblock
						includeParticipantsList
						existsWhoSignTheAct
						hasPresident
						hasSecretary
						prototype
						intro
						constitution
						canEarlyVote
						canSenseVoteDelegate
						conclusion
						actTemplate
						conveneHeader
						conveneFooter
						censusId
						requireProxy
						quorumPrototype
						existsComments
						firstCallQuorumDivider
						secondCallQuorumDivider
						canEditConvene
						notifyPoints
						doubleColumnDocs
						proxy
						proxySecondary
						voteLetter
						voteLetterSecondary
						voteLetterWithSense
						voteLetterWithSenseSecondary
						introSecondary
						conclusionSecondary
						constitutionSecondary
					}
				} 
			`,
			variables: {
				statuteId
			}
		});

		setStatute(response.data.companyStatute);
		setState({
			...state,
			errors: {},
			statute: response.data.companyStatute
		});
	}, [statuteId]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	function checkRequiredFields() {
		const errors = {
			advanceNoticeDays: '',
			minimumSeparationBetweenCall: '',
			maxNumDelegatedVotes: '',
			limitedAccessRoomMinutes: '',
			conveneHeader: '',
			intro: '',
			constitution: '',
			conclusion: ''
		};
		let hasError = false;
		let notify = false;

		// eslint-disable-next-line no-shadow
		const { statute } = state;

		if (statute.existsAdvanceNoticeDays && Number.isNaN(Number(statute.advanceNoticeDays))) {
			errors.advanceNoticeDays = translate.required_field;
			hasError = true;
		}

		if (statute.existsSecondCall && Number.isNaN(Number(statute.minimumSeparationBetweenCall))) {
			errors.minimumSeparationBetweenCall = translate.required_field;
			hasError = true;
		}

		if (statute.existsMaxNumDelegatedVotes && Number.isNaN(Number(statute.maxNumDelegatedVotes))) {
			hasError = true;
			errors.maxNumDelegatedVotes = translate.required_field;
		}

		if (statute.existsLimitedAccessRoom && Number.isNaN(Number(statute.limitedAccessRoomMinutes))) {
			hasError = true;
			errors.limitedAccessRoomMinutes = translate.required_field;
		}

		if (CBX.checkForUnclosedBraces(statute.conveneHeader)) {
			hasError = true;
			notify = true;
			errors.conveneHeader = translate.revise_text;
		}

		if (statute.existsAct) {
			if (CBX.checkForUnclosedBraces(statute.intro)) {
				hasError = true;
				notify = true;
				errors.intro = translate.revise_text;
			}

			if (CBX.checkForUnclosedBraces(statute.constitution)) {
				hasError = true;
				notify = true;
				errors.constitution = translate.revise_text;
			}

			if (CBX.checkForUnclosedBraces(statute.conclusion)) {
				hasError = true;
				notify = true;
				errors.conclusion = translate.revise_text;
			}
		}

		if (notify) {
			toast(
				<LiveToast
					message={translate.revise_text}
					id="text-error-toast"
				/>,
				{
					position: toast.POSITION.TOP_RIGHT,
					autoClose: false,
					className: 'errorToast'
				}
			);
		}

		setState(oldState => ({
			...oldState,
			errors,
			error: hasError
		}));

		return hasError;
	}

	const updateStatute = async () => {
		if (!checkRequiredFields()) {
			setState({
				...state,
				loading: true
			});
			const cleanedData = CBX.removeTypenameField(state.statute);
			const response = await client.mutate({
				mutation: updateStatuteMutation,
				variables: {
					statute: cleanedData
				}
			});
			if (response.errors) {
				setState({
					...state,
					error: true
				});
			} else {
				setState({
					...state,
					error: false,
					loading: false,
				});
				bHistory.back();
			}
		}
	};

	const updateState = object => {
		if (state.statute.companyId !== company.id) {
			return;
		}

		setState(oldState => ({
			...oldState,
			statute: {
				...oldState.statute,
				...object
			}
		}));
	};

	const comprobateChanges = () => JSON.stringify(statute) !== JSON.stringify(state.statute);

	const goBack = () => {
		if (!comprobateChanges()) {
			bHistory.back();
		} else {
			setUnsavedAlert(true);
		}
	};

	return (
		<div
			style={{
				height: '100%'
			}}
		>
			<div
				style={{
					height: `calc(100% - ${disabled ? '0' : '3.5em'})`
				}}
			>
				<Scrollbar>
					<div
						style={{
							padding: '1em'
						}}
					>
						<>
							{disabled &&
								<>
									<div
										style={{
											position: 'absolute',
											top: '0',
											left: '0',
											width: '100%',
											height: editorHeight,
											zIndex: 1000000
										}}
										onClick={() => { }}
									/>
									<div
										style={{
											width: '100%',
											textAlign: 'center',
											border: '1px solid black',
											borderRadius: '4px',
											fontWeight: '700',
											padding: '0.6em 0',
											margin: '1em 0'
										}}
									>
										{translate.organization_statute} <br />
										{translate.read_only}
									</div>
								</>
							}
							<div style={{ paddingLeft: '1em', paddingRight: '1.5em', overflow: 'hidden' }} ref={statuteEditorRef}>
								<StatuteForm
									statute={state.statute}
									censusList={censusList}
									company={company}
									disabled={disabled}
									translate={translate}
									organization={organization}
									updateState={updateState}
									errors={state.errors}
								/>
								<br />
							</div>

						</>
					</div>
				</Scrollbar>
			</div>
			{(!disabled && statute) &&
				<div
					style={{
						width: '100%',
						height: '3.5em',
						paddingTop: '0.5em',
						borderTop: '1px solid gainsboro',
						display: 'flex',
						paddingRight: '1em',
						justifyContent: 'flex-end',
						alignItems: 'center'
					}}
				>
					<div>
						<BasicButton
							id="council-editor-return"
							text={translate.back}
							type="flat"
							color={'white'}
							textStyle={{
								fontWeight: '700',
								color: 'black',
								textTransform: 'none'
							}}
							buttonStyle={{
								marginRight: '0.8em',
							}}
							onClick={goBack}
						// onClick={() => bHistory.back()}
						/>
						{JSON.stringify(statute) !== JSON.stringify(state.statute) &&
							<StatuteEditorUndoChangesButton
								action={() => setState({
									...state,
									statute
								})}
								translate={translate}
							/>
						}
						<BasicButton
							text={translate.save}
							id="council-statute-save-button"
							disabled={state.error}
							color={getPrimary()}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								textTransform: 'none'
							}}
							onClick={updateStatute}
							loading={state.loading}
							error={state.error}
							icon={
								<ButtonIcon
									type={'save'}
									color="white"
								/>
							}
						/>
					</div>
				</div>
			}
			<UnsavedChangesModal
				acceptAction={updateStatute}
				cancelAction={() => bHistory.back()}
				requestClose={() => setUnsavedAlert(false)}
				loadingAction={state.loading}
				open={unsavedAlert}
			/>
		</div>
	);
};

export default withApollo(withSharedProps()(StatuteEditor));


