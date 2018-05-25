import React from 'react';
import { connect } from 'react-redux';
import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingMainApp } from '../displayComponents';
import ParticipantLogin from '../components/participant/login/Login';


class ParticipantContainer extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            company: null
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.data.loading && !this.props.data.loading) {
            try {
                this.setState({ loading: true });
                const responseQueryCompany = await this.props.client.query({
                    query: companyQuery,
                    variables: { companyId: this.props.data.council.companyId },
                    fetchPolicy: 'network-only'
                });
                this.setState({
                    loading: false,
                    company: responseQueryCompany.data.company
                });
            } catch (error) {

            }
        }
    }

    render() {
        const { data } = this.props;
        const { loading, company } = this.state;
        if (data.loading || loading) {
            return <LoadingMainApp/>
        }

        return (<div style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            padding: 0,
            margin: 0
        }}>
            <ParticipantLogin participant={data.participant} council={data.council} company={company}/>
        </div>);
    }
}

const mapStateToProps = (state) => ({
    main: state.main,
    translate: state.translate
});

const participantQuery = gql`
    query info($councilId: Int!){
        participant {
            name
            surname
            id
            phone
            email
            language
        }
        council(id: $councilId){
            active
            agendas{
                agendaSubject
                attachments{
                    id
                    agendaId
                    filename
                    filesize
                    filetype
                    councilId
                    state
                }
                councilId
                dateEndVotation
                dateStart
                dateStartVotation
                description
                id
                orderIndex
                pointState
                subjectType
                votingState
            }
            attachments {
                councilId
                filename
                filesize
                filetype
                id
            }
            businessName
            city
            companyId
            conveneText
            councilStarted
            councilType
            country
            countryState
            dateEnd
            dateOpenRoom
            dateRealStart
            dateStart
            dateStart2NdCall
            duration
            firstOrSecondConvene
            fullVideoRecord
            hasLimitDate
            headerLogo
            id
            limitDateResponse
            name
            noCelebrateComment
            president
            proposedActSent
            prototype
            quorumPrototype
            satisfyQuorum
            secretary
            securityType
            sendDate
            sendPointsMode
            shortname
            state
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
                existsPresentWithRemoteVote
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
                existsWhoSignTheAct
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
            street
            tin
            videoMode
            videoRecodingInitialized
            votationType
            weightedVoting
            zipcode
        }
    }
`;

const companyQuery = gql`
    query info($companyId: Int!){
        company(id: $companyId){
            logo    
        }
    }
`;

export default graphql(participantQuery, {
    options: (props) => ({
        variables: {
            councilId: props.match.params.councilId
        },
        fetchPolicy: 'network-only'
    })
})(withApollo(connect(mapStateToProps)(ParticipantContainer)));