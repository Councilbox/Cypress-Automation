import React from 'react';
import { graphql } from 'react-apollo';
import { councilStepTwo } from '../../../../queries';
import { LoadingSection } from '../../../../displayComponents';
import gql from 'graphql-tag';
import AgendaEditor from './AgendaEditor';
import Scrollbar from  'react-perfect-scrollbar';

const AgendaTab = ({ council, translate, data }) => {
	if(data.loading){
		return <LoadingSection />;
	}

	const getTypeText = (subjectType) => {
		const votingType = data.votingTypes.find(item => item.value === subjectType)
		return !!votingType? translate[votingType.label] : '';
	}


	return(
		<div style={{ height: "100%", overflow: 'hidden', position: 'relative', paddingBottom: '2em' }}>
			<Scrollbar option={{ suppressScrollX: true }}>
				{!!data.council.agendas && (
					<React.Fragment>
						{data.council.agendas.map((agenda, index) => {
							return (
								<div style={{marginTop: '2.5em', padding: '1em' }} key={`agenda${agenda.id}`}>
									<AgendaEditor
										agenda={agenda}
										readOnly={true}
										council={council}
										recount={data.councilRecount}
										translate={translate}
										majorityTypes={data.majorityTypes}
										typeText={getTypeText(agenda.subjectType)}
									/>
									{index < data.council.agendas.length -1 &&
										<hr style={{marginTop: '2.5em'}} />
									}
								</div>
							);
						})}
					</React.Fragment>
				)}
			</Scrollbar>
		</div>
	)
}

const CouncilActData = gql`
	query CouncilActData($councilId: Int!) {
		council(id: $councilId) {
			id
			businessName
			country
			countryState
			currentQuorum
			secretary
			president
			street
			city
			name
			dateRealStart
			dateEnd
			qualityVoteId
			firstOrSecondConvene
			act {
				id
				intro
				constitution
				conclusion
			}
			agendas {
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
					vote
				}
				numPresentCensus
				presentCensus
				numCurrentRemoteCensus
				currentRemoteCensus
				comment
			}
			statute {
				id
				prototype
				existsQualityVote
			}
		}
		councilRecount(councilId: $councilId){
			id
			socialCapitalTotal
			partTotal
			numTotal
		}
		votingTypes {
			label
			value
		}

		majorityTypes {
			label
			value
		}
	}
`;

export default graphql(CouncilActData, {
    options: props => ({
        variables: {
            councilId: props.council.id
        }
    })
})(AgendaTab);

