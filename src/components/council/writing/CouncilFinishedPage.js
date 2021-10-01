import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import {
	ErrorWrapper,
	LoadingSection
} from '../../../displayComponents';
import { bHistory } from '../../../containers/App';
import { checkCouncilState } from '../../../utils/CBX';
import withSharedProps from '../../../HOCs/withSharedProps';
import ActEditorPage from './actEditor/ActEditorPage';
import { COUNCIL_STATES } from '../../../constants';
import CanceledCouncil from './canceled/CanceledCouncil';

const CouncilFinishedPage = ({
	translate, client, match, company
}) => {
	const [data, setData] = React.useState({});
	const [loading, setLoading] = React.useState(true);

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: councilDetails,
			variables: {
				councilID: +match.params.council
			}
		});
		if (response.data) {
			setData(response.data);
		}
		setLoading(false);
	}, [match.params.council]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	React.useEffect(() => {
		if (data.council) {
			checkCouncilState(
				{
					state: data.council.state,
					id: data.council.id
				},
				company,
				bHistory,
				'finished'
			);
		}
	});

	const { council, error } = data;

	if (loading) {
		return <LoadingSection />;
	}

	if (error) {
		return <ErrorWrapper error={error} translate={translate} />;
	}

	if (council.state === COUNCIL_STATES.FINISHED) {
		return (
			<ActEditorPage
				translate={translate}
				council={council}
				agendas={data.agendas}
				councilRecount={data.councilRecount}
				refetch={getData}
				participantsWithDelegatedVote={data.participantsWithDelegatedVote}
				socialCapital={data.councilSocialCapital}
				totalVotes={data.councilTotalVotes}
			/>
		);
	}

	if (council.state === COUNCIL_STATES.APPROVED || council.state === COUNCIL_STATES.FINAL_ACT_SENT) {
		return (
			<ActEditorPage
				translate={translate}
				council={council}
				confirmed={true}
				agendas={data.agendas}
				councilRecount={data.councilRecount}
				refetch={getData}
				participantsWithDelegatedVote={data.participantsWithDelegatedVote}
				socialCapital={data.councilSocialCapital}
				totalVotes={data.councilTotalVotes}
			/>
		);
	}

	if (council.state === COUNCIL_STATES.FINISHED_WITHOUT_ACT) {
		return (
			<ActEditorPage
				confirmed={true}
				withoutAct={true}
				translate={translate}
				council={council}
				agendas={data.agendas}
				councilRecount={data.councilRecount}
				participantsWithDelegatedVote={data.participantsWithDelegatedVote}
				socialCapital={data.councilSocialCapital}
				totalVotes={data.councilTotalVotes}
				{...data}
				refetch={getData}
			/>
		);
	}

	if (council.state === COUNCIL_STATES.NOT_CELEBRATED || council.state === COUNCIL_STATES.CANCELED) {
		return (
			<CanceledCouncil
				council={council}
				goTo={() => { bHistory.push(`/company/${company.id}/councils/drafts`); }}
				translate={translate}
				socialCapital={data.councilSocialCapital}
				totalVotes={data.councilTotalVotes}
			/>
		);
	}

	return <LoadingSection />;
};

export const councilDetails = gql`
	query CouncilDetails($councilID: Int!) {
		council(id: $councilID) {
			dateEnd
			id
			dateRealStart
			dateStart
			countryState
			street
			zipcode
			wallActive
			companyId
			councilType
			quorumPrototype
			dateStart2NdCall
			state
			sendActDate
			noCelebrateComment
			street
			remoteCelebration
			country
			name
			statute {
				id
				prototype
				councilId
				statuteId
				title
				existPublicUrl
				addParticipantsListToAct
				existsAdvanceNoticeDays
				advanceNoticeDays
				existsSecondCall
				minimumSeparationBetweenCall
				canEditConvene
				firstCallQuorumType
				firstCallQuorum
				firstCallQuorumDivider
				secondCallQuorumType
				secondCallQuorum
				secondCallQuorumDivider
				existsDelegatedVote
				delegatedVoteWay
				existMaxNumDelegatedVotes
				maxNumDelegatedVotes
				existsLimitedAccessRoom
				limitedAccessRoomMinutes
				existsQualityVote
				qualityVoteOption
				quorumPrototype
				canUnblock
				canAddPoints
				canReorderPoints
				existsAct
				includedInActBook
				includeParticipantsList
				existsComments
				canEarlyVote
				conveneHeader
				intro
				requireProxy
				constitution
				conclusion
				actTemplate
				censusId
			}
		}

		agendas(councilId: $councilID) {
			id
			orderIndex
			agendaSubject
			subjectType
			abstentionVotings
			abstentionManual
			noVoteVotings
			votingsRecount
			noVoteManual
			positiveVotings
			positiveManual
			negativeVotings
			negativeManual
			description
			majorityType
			majority
			majorityDivider
			items {
				id
				value
			}
			options {
				id
				maxSelections
			}
			ballots {
				id
				participantId
				weight
				value
				itemId
			}
			numNoVoteVotings
			numPositiveVotings
			numNegativeVotings
			numAbstentionVotings
			numPresentCensus
			presentCensus
			remoteCensus
			numRemoteCensus
			numCurrentRemoteCensus
			currentRemoteCensus
			comment
		}

		councilRecount(councilId: $councilID){
			socialCapitalTotal
			partTotal
			numTotal
			numRemote
			partRemote
			socialCapitalRemote
			numCurrentRemote
			partCurrentRemote
			socialCapitalCurrentRemote
			numPresent
			partPresent
			socialCapitalPresent
			numRightVoting
			partRightVoting
			socialCapitalRightVoting
			numNoParticipate
			partNoParticipate
			socialCapitalNoParticipate
			numDelegations
			numRepresentations
			numGuests
		}

		votingTypes {
			label
			value
		}

		majorityTypes {
			label
			value
		}

		councilTotalVotes(councilId: $councilID)
		councilSocialCapital(councilId: $councilID)
	}
`;

export default withSharedProps()(withApollo(withRouter(CouncilFinishedPage)));
