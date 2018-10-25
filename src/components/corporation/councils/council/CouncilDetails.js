import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { LoadingSection } from '../../../../displayComponents';
import CouncilItem from '../CouncilItem';
import { getSecondary } from '../../../../styles/colors';
import DownloadAttendantsPDF from '../../../council/writing/actEditor/DownloadAttendantsPDF';
import withTranslations from '../../../../HOCs/withTranslations';

class CouncilDetails extends React.Component {

    render(){
        const { translate } = this.props;

        if(this.props.data.loading){
            return <LoadingSection />
        }

        const secondary = getSecondary();

        return (
            <div>
                <CouncilItem council={this.props.data.council} />
                <div
                    style={{
                        width: '100%',
                        border: `2px solid ${secondary}`,
                        fontSize: '18px',
                        color: secondary,
                        fontWeight: '700',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    Asistentes {`(Total: ${this.props.data.councilAttendants.list.length})`}
                    <div style={{fontSize: '1rem', marginLeft: '0.6em'}}>
                        <DownloadAttendantsPDF
                            council={this.props.data.council}
                            translate={translate}
                            color={secondary}
                        />
                    </div>
                </div>
                {this.props.data.councilAttendants.list.map(attendant => (
                    <div>
                        
                    </div>
                ))

                }
            </div>
        )
    }
}

const CouncilDetailsRoot = gql`
    query CouncilDetailsRoot($id: Int!){
        council(id: $id) {
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
            company{
                businessName
            }
            participants {
                id
            }
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

		agendas(councilId: $id) {
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
        councilAttendants(councilId: $id) {
			list {
				name
				surname
			}
		}
    }
`;


export default graphql(CouncilDetailsRoot, {
    options: props => ({
        variables: {
            id: props.match.params.id
        }
    })
})(withRouter(withTranslations()(CouncilDetails)));