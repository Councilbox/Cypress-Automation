import React, { Fragment } from 'react';
import { MenuItem } from 'material-ui';
import { withApollo } from 'react-apollo';
import {
	Checkbox,
	Grid,
	GridItem,
	LiveToast,
	SectionTitle,
	SelectInput,
	TextInput,
} from '../../../displayComponents';
import * as CBX from '../../../utils/CBX';
import { draftDetails } from '../../../queries';
import { getPrimary } from '../../../styles/colors';
import QuorumInput from '../../../displayComponents/QuorumInput';
import { ConfigContext } from '../../../containers/AppControl';
import StatuteDocSection from './StatuteDocSection';
import { useValidRTMP } from '../../../hooks';
import withSharedProps from '../../../HOCs/withSharedProps';
import { toast } from 'react-toastify';
import gql from 'graphql-tag';
import StatuteForm from './StatuteForm';


const StatuteEditor = ({
	statuteId,
	translate,
	company,
	censusList,
	client
}) => {
	const [statute, setStatute] = React.useState(null);
	const [state, setState] = React.useState({
		statute: {},
		errors: {}
	});

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
		console.log(response);
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

		const { statute } = state;

		if (statute.existsAdvanceNoticeDays && Number.isNaN(statute.advanceNoticeDays)) {
			errors.advanceNoticeDays = translate.required_field;
			hasError = true;
		}

		if (statute.existsSecondCall && Number.isNaN(statute.minimumSeparationBetweenCall)) {
			errors.minimumSeparationBetweenCall = translate.required_field;
			hasError = true;
		}

		if (statute.existsMaxNumDelegatedVotes && Number.isNaN(statute.maxNumDelegatedVotes)) {
			hasError = true;
			errors.maxNumDelegatedVotes = translate.required_field;
		}

		if (statute.existsLimitedAccessRoom && Number.isNaN(statute.limitedAccessRoomMinutes)) {
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
				/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
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

	// const updateStatute = async () => {
	// 	if (!checkRequiredFields()) {
	// 		setState({
	// 			...state,
	// 			loading: true
	// 		});
	// 		const statute = CBX.removeTypenameField(state.statute);
	// 		const response = await props.updateStatute({
	// 			variables: {
	// 				statute
	// 			}
	// 		});
	// 		if (response.errors) {
	// 			setState({
	// 				...state,
	// 				error: true,
	// 				loading: false,
	// 				success: false,
	// 			});
	// 		} else {
	// 			setState({
	// 				...state,
	// 				error: false,
	// 				loading: false,
	// 				success: true,
	// 				unsavedAlert: false,
	// 				unsavedChanges: false
	// 			});
	// 			//await data.refetch();
	// 			//store.dispatch(setUnsavedChanges(false));
	// 		}
	// 	}
	// };

	const updateState = object => {
		if (state.statute.companyId !== company.id) {
			return;
		}

		if (!state.unsavedChanges) {
			//store.dispatch(setUnsavedChanges(true));
		}


		setState(oldState => ({
			...oldState,
			statute: {
				...oldState.statute,
				...object
			},
			//unsavedChanges: JSON.stringify({ ...oldState.statute, ...object }) !== JSON.stringify(data.companyStatutes[oldState.selectedStatute])
		}));
	};

	return (
		<div>
			<StatuteForm
				statute={state.statute}
				censusList={censusList}
				company={company}
				//disabled={disabled}
				translate={translate}
				//organization={props.organization}
				updateState={updateState}
				errors={state.errors}
			/>
		</div>
	);
};

export default withApollo(withSharedProps()(StatuteEditor));


