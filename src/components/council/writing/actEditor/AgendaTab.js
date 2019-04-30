import React from 'react';
import { graphql } from 'react-apollo';
import { LoadingSection, Scrollbar } from '../../../../displayComponents';
import gql from 'graphql-tag';
import AgendaEditor from './AgendaEditor';

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
			<Scrollbar>
				{!!data.agendas && (
					<React.Fragment>
						{data.agendas.map((agenda, index) => {
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
									{index < data.agendas.length -1 &&
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
			quorumPrototype
			secretary
			president
			street
			city
			name
			remoteCelebration
			dateStart
			dateStart2NdCall
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
			statute {
				id
				prototype
				existsQualityVote
			}
		}

		agendas(councilId: $councilId) {
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
				author {
					id
					socialCapital
					numParticipations
				}
			}
			numPresentCensus
			presentCensus
			numCurrentRemoteCensus
			currentRemoteCensus
			comment
		}

		councilRecount(councilId: $councilId){
			socialCapitalTotal
			partTotal
			weighedPartTotal
			numTotal
		}

		participantsWithDelegatedVote(councilId: $councilId){
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

		councilAttendants(
			councilId: $councilId
		) {
			list {
				name
				surname
			}
		}

		majorityTypes {
			label
			value
		}
	}
`;

export default AgendaTab;

