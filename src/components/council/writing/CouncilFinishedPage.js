import React from "react";
import {
	ErrorWrapper,
	LoadingSection
} from "../../../displayComponents";
import { bHistory } from "../../../containers/App";
import { checkCouncilState } from "../../../utils/CBX";
import { graphql, withApollo } from "react-apollo";
import gql from "graphql-tag";
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
					refetch={this.props.data.refetch}					
				/>
			);
		}

		if(council.state === COUNCIL_STATES.APPROVED || council.state === COUNCIL_STATES.FINAL_ACT_SENT){
			return (
				<ActEditorPage
					confirmed={true}
					refetch={this.props.data.refetch}
					translate={translate}
					council={council}
				/>
			)
		}

		if(council.state === COUNCIL_STATES.FINISHED_WITHOUT_ACT){
			return(
				<ActEditorPage
					confirmed={true}
					withoutAct={true}
					refetch={this.props.data.refetch}
					translate={translate}
					council={council}
				/>
			)
		}

		if(council.state === COUNCIL_STATES.NOT_CELEBRATED){
			return(
				<CanceledCouncil
					council={council}
					translate={translate}
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
			councilID: props.councilID
		}
	})
})(withApollo(CouncilFinishedPage));
