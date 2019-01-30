import React from "react";
import {
	ErrorWrapper,
	LoadingSection
} from "../../../displayComponents";
import { bHistory } from "../../../containers/App";
import { checkCouncilState } from "../../../utils/CBX";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
import { withRouter } from 'react-router-dom';
import withSharedProps from '../../../HOCs/withSharedProps';
import ActEditorPage from "./actEditor/ActEditorPage";
import { COUNCIL_STATES } from '../../../constants';
import CanceledCouncil from './canceled/CanceledCouncil';


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
				conveneHeader
				intro
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
			noVoteManual
			positiveVotings
			positiveManual
			negativeVotings
			negativeManual
			description
			majorityType
			majority
			majorityDivider
			votings {
				id
				participantId
				comment
				author {
					socialCapital
					numParticipations
				}
				vote
			}
			numPresentCensus
			presentCensus
			numCurrentRemoteCensus
			currentRemoteCensus
			socialCapitalPresent
			socialCapitalRemote
			socialCapitalNoParticipate
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

		participantsWithDelegatedVote(councilId: $councilID){
			name
			surname
			state
			representative {
				name
				surname
			}
		}

		votingTypes {
			label
			value
		}

		majorityTypes {
			label
			value
		}

		councilAttendants(
			councilId: $councilID
		) {
			list {
				name
				surname
				state
			}
			total
		}

		councilTotalVotes(councilId: $councilID)
		councilSocialCapital(councilId: $councilID)
	}
`;

class CouncilFinishedPage extends React.Component {

	componentDidMount() {
		this.props.data.refetch();
	}

	componentDidUpdate(){
		if(!this.props.data.loading){
			checkCouncilState(
				{
					state: this.props.data.council.state,
					id: this.props.data.council.id
				},
				this.props.company,
				bHistory,
				"finished"
			);
		}
	}

	render() {
		const { council, error, loading } = this.props.data;
		const { translate } = this.props;

		if (loading) {
			return <LoadingSection />;
		}

		if (error) {
			return <ErrorWrapper error={error} translate={translate} />;
		}

		if(council.state === COUNCIL_STATES.FINISHED) {
			return (
				<ActEditorPage
					translate={translate}
					council={council}
					agendas={this.props.data.agendas}
					councilRecount={this.props.data.councilRecount}
					refetch={this.props.data.refetch}
					participantsWithDelegatedVote={this.props.data.participantsWithDelegatedVote}
					socialCapital={this.props.data.councilSocialCapital}
					councilAttendants={this.props.data.councilAttendants}
					totalVotes={this.props.data.councilTotalVotes}
				/>
			);
		}

		if(council.state === COUNCIL_STATES.APPROVED || council.state === COUNCIL_STATES.FINAL_ACT_SENT){
			return (
				<ActEditorPage
					translate={translate}
					council={council}
					agendas={this.props.data.agendas}
					councilRecount={this.props.data.councilRecount}
					refetch={this.props.data.refetch}
					participantsWithDelegatedVote={this.props.data.participantsWithDelegatedVote}
					socialCapital={this.props.data.councilSocialCapital}
					councilAttendants={this.props.data.councilAttendants}
					totalVotes={this.props.data.councilTotalVotes}
				/>
			)
		}

		if(council.state === COUNCIL_STATES.FINISHED_WITHOUT_ACT){
			return(
				<ActEditorPage
					confirmed={true}
					withoutAct={true}
					translate={translate}
					council={council}
					agendas={this.props.data.agendas}
					councilRecount={this.props.data.councilRecount}
					refetch={this.props.data.refetch}
					participantsWithDelegatedVote={this.props.data.participantsWithDelegatedVote}
					socialCapital={this.props.data.councilSocialCapital}
					councilAttendants={this.props.data.councilAttendants}
					totalVotes={this.props.data.councilTotalVotes}
					{...this.props.data}
				/>
			)
		}

		if(council.state === COUNCIL_STATES.NOT_CELEBRATED || council.state === COUNCIL_STATES.CANCELED){
			return(
				<CanceledCouncil
					council={council}
					translate={translate}
					socialCapital={this.props.data.councilSocialCapital}
					totalVotes={this.props.data.councilTotalVotes}
				/>
			)
		}

		return <LoadingSection />;
	}
}

export default graphql(councilDetails, {
	name: "data",
	options: props => ({
		variables: {
			councilID: props.match.params.council,
		}
	})
})(withSharedProps()(withApollo(withRouter(CouncilFinishedPage))));
