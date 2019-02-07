import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, Grid, GridItem, CollapsibleSection, AgendaNumber, TabsScreen } from '../../../displayComponents';
import { moment } from '../../../containers/App';
import { Paper } from 'material-ui';
import { OptionsDisplay, OptionsDisplayIconIzq } from './OptionsDisplay';
import { StatuteDisplay, StatuteDisplayIconsIzq } from './StatuteDisplay';
import { getPrimary, getSecondary } from '../../../styles/colors';



class CouncilDetails extends React.Component {

    state = {
        agenda: false,
        options: false,
        councilType: false
    }

    toggleAgenda = () => {
        const value = this.state.agenda;
        this.setState({
            agenda: !value
        });
    }

    toggleOptions = () => {
        const value = this.state.options;
        this.setState({
            options: !value
        });
    }

    toggleCouncilType = () => {
        const value = this.state.councilType;
        this.setState({
            councilType: !value
        });
    }

    getTypeText = subjectType => {
        const votingType = this.props.data.votingTypes.find(item => item.value === subjectType)
        return !!votingType ? this.props.translate[votingType.label] : '';
    }

    getCensusName = () => {
        const census = this.props.data.censuses.list.find(census => census.id === this.props.data.council.selectedCensusId);
        return !!census ? census.censusName : '';
    }

    render() {
        if (this.props.data.loading) {
            return <LoadingSection />
        }

        const { council } = this.props.data;
        const { translate, inIndex } = this.props;


        return (
            <div>
                <h5 style={{ marginTop: inIndex ? "" : '1em' }}>{council.name}</h5>
                {council.statute.hasSecondCall === 1 ?
                    <React.Fragment>
                        {council.dateStart ? moment(new Date(council.dateStart)).format('LLL') : '-'}
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <div>
                            {`${translate["1st_call_date"]}: ${council.dateStart ? moment(new Date(council.dateStart)).format('LLL') : '-'}`}
                        </div>
                        <div>
                            {`${translate["2nd_call_date"]}: ${council.dateStart2NdCall ? moment(new Date(council.dateStart2NdCall)).format('LLL') : '-'}`}
                        </div>
                    </React.Fragment>

                }
                Censo seleccionado: {this.getCensusName()}
                {!inIndex ? (
                    <div>
                        <div style={{ padding: '1em', paddingTop: '0', border: '1px solid gainsboro', marginTop: '1em' }}>
                            <CollapsibleSection
                                trigger={() =>
                                    <div
                                        style={{
                                            marginTop: '1em',
                                            fontWeight: '700',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                        onClick={this.toggleAgenda}
                                    >
                                        {translate.agenda}
                                        {this.state.agenda ?
                                            <i className="fa fa-caret-up" aria-hidden="true" style={{ marginLeft: '2em' }}></i>
                                            :
                                            <i className="fa fa-caret-down" aria-hidden="true" style={{ marginLeft: '2em' }}></i>
                                        }
                                    </div>
                                }
                                collapse={() =>
                                    this.props.data.agendas.map(agenda => (
                                        <Paper style={{ marginTop: '0.8em', padding: '0.8em', margin: '0.3em' }} key={`agenda_${agenda.id}`}>
                                            <Grid>
                                                <GridItem xs={1} md={1} lg={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {agenda.orderIndex}
                                                </GridItem>
                                                <GridItem xs={11} md={11} lg={11}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>
                                                            {agenda.agendaSubject}
                                                        </span>
                                                        <span>
                                                            {this.getTypeText(agenda.subjectType)}
                                                        </span>
                                                    </div>
                                                    <div dangerouslySetInnerHTML={{ __html: agenda.description }} />
                                                </GridItem>
                                            </Grid>
                                        </Paper>
                                    ))}
                            />
                        </div>
                        <div style={{ padding: '1em', paddingTop: '0', border: '1px solid gainsboro', marginTop: '1em' }}>
                            <CollapsibleSection
                                trigger={() =>
                                    <div
                                        style={{
                                            marginTop: '1em',
                                            fontWeight: '700',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                        onClick={this.toggleOptions}
                                    >
                                        {translate.options}
                                        {this.state.options ?
                                            <i className="fa fa-caret-up" aria-hidden="true" style={{ marginLeft: '2em' }}></i>
                                            :
                                            <i className="fa fa-caret-down" aria-hidden="true" style={{ marginLeft: '2em' }}></i>
                                        }
                                    </div>
                                }
                                collapse={() => (
                                    <OptionsDisplay council={council} translate={translate} />
                                )}
                            />
                        </div>
                        <div style={{ padding: '1em', paddingTop: '0', border: '1px solid gainsboro', marginTop: '1em' }}>
                            <CollapsibleSection
                                trigger={() =>
                                    <div
                                        style={{
                                            marginTop: '1em',
                                            fontWeight: '700',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                        onClick={this.toggleCouncilType}
                                    >
                                        {translate.council_type}
                                        {this.state.councilType ?
                                            <i className="fa fa-caret-up" aria-hidden="true" style={{ marginLeft: '2em' }}></i>
                                            :
                                            <i className="fa fa-caret-down" aria-hidden="true" style={{ marginLeft: '2em' }}></i>
                                        }
                                    </div>
                                }
                                collapse={() => (
                                    <StatuteDisplay
                                        statute={council.statute}
                                        translate={translate}
                                        quorumTypes={this.props.data.quorumTypes}
                                    />
                                )}
                            />
                        </div>
                    </div>
                ) : (
                        <div style={{ paddingTop: "1em" }}>
                            <TabsScreen
                                uncontrolled={true}
                                stylesTabPane={{padding: '1em', minHeight: '425px'}}
                                stylesInTabPane={{ width: '90%', margin: '0 auto' }}
                                stylesTab={{ paddingBottom: "0" }}
                                tabsInfo={[
                                    {
                                        text: translate.agenda,
                                        component: () => {
                                            return (
                                                <div style={{ marginTop: "0.8em" }}>
                                                    <div style={{ display: "flex", marginLeft: '58px', justifyContent: 'space-between', fontWeight: ' 700', marginBottom: "10px" }}>
                                                        <div>{translate.certificate_title}</div>
                                                        <div style={{ marginRight: "57px" }}>{translate.type}</div>
                                                    </div>

                                                    {this.props.data.agendas.map((agenda, index) => (
                                                        <React.Fragment key={`agendaSelector${agenda.id}`}>
                                                            {index > 0 && (
                                                                <div
                                                                    style={{
                                                                        margin: 0,
                                                                        padding: "11px",
                                                                        width: "1px",
                                                                        borderRight: `3px solid ${getSecondary()}`,
                                                                        height: "3em",
                                                                    }}
                                                                />
                                                            )}
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <AgendaNumber
                                                                    index={index + 1}
                                                                    open={agenda.pointState === 1}
                                                                    activeColor={getPrimary()}
                                                                    voting={agenda.votingState === 1 && agenda.subjectType !== 0}
                                                                    translate={translate}
                                                                    secondaryColor={getSecondary()}
                                                                    moreStyles={{ minWidth: '44px', minHeight: '44px', width: "50px", height: "44px", maxWidth: "53px", maxHeight: "44px", borderRadius: "2em" }}
                                                                    onlyShowCalendar={true}

                                                                />
                                                                <div style={{ marginLeft: "15px", display: "flex", justifyContent: 'space-between', width: "100%" }}>
                                                                    <div>
                                                                        <div style={{ whiteSpace: 'nowrap', maxWidth: '215px', maxHeight: '45px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                            {agenda.agendaSubject}
                                                                        </div>
                                                                        {/* <div>
                                                            {agenda.description}
                                                        </div> */}
                                                                    </div>
                                                                    <div style={{ width: "150px", textAlign: "center" }}>
                                                                        <div>{this.getTypeText(agenda.subjectType)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            );
                                        }
                                    },
                                    {
                                        text: translate.options,
                                        component: () => {
                                            return (
                                                <React.Fragment>
                                                    <div style={{
                                                        fontWeight: '700',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontWeight: ' 700'
                                                    }}>
                                                        {translate.options}
                                                    </div>
                                                    <div style={{ marginTop: "1em" }}>
                                                        <OptionsDisplayIconIzq council={council} translate={translate} />

                                                    </div>
                                                </React.Fragment>
                                            );
                                        }
                                    },
                                    {
                                        text: translate.council_type,
                                        component: () => {
                                            return (
                                                <React.Fragment>
                                                    <div style={{
                                                        fontWeight: '700',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontWeight: ' 700'
                                                    }}>
                                                        {translate.council_type}
                                                    </div>
                                                    <div style={{ marginTop: "1em" }}>
                                                        <StatuteDisplayIconsIzq
                                                            statute={council.statute}
                                                            translate={translate}
                                                            quorumTypes={this.props.data.quorumTypes}
                                                        />
                                                    </div>
                                                </React.Fragment>
                                            );
                                        }
                                    },
                                ]
                                }
                            ></TabsScreen>
                        </div>
                    )}
            </div>
        )
    }
}

const councilDetails = gql`
    query CouncilDetails($id: Int!, $companyId: Int!){
        council(id: $id) {
			id
			businessName
			country
			countryState
            street
            approveActDraft
            confirmAssistance
            selectedCensusId
            city
            securityType
            councilType
            fullVideoRecord
            autoClose
			name
			remoteCelebration
			dateStart
			dateStart2NdCall
            firstOrSecondConvene
            company{
                businessName
            }
            participants {
                id
                name
                surname
                email
                dni
            }
			statute {
				id
                prototype
                existsSecondCall
                existsQualityVote
                minimumSeparationBetweenCall
                existsAdvanceNoticeDays
                advanceNoticeDays
                quorumPrototype
                firstCallQuorumType
                secondCallQuorumType
                existsDelegatedVote
                existMaxNumDelegatedVotes
                maxNumDelegatedVotes
                limitedAccessRoomMinutes
                existsLimitedAccessRoom
                existsComments
                notifyPoints
                existsQualityVote
                existsPresentWithRemoteVote
                canAddPoints
                canReorderPoints
                canUnblock
                existsAct
                includedInActBook
                includeParticipantsList
                conveneHeader
                intro
                constitution
                conclusion
			}
		}

		agendas(councilId: $id) {
            id
            agendaSubject
			orderIndex
            description
            subjectType
			majorityType
			majority
			majorityDivider
			comment
        }

        censuses(companyId: $companyId){
            list {
				id
				companyId
				censusName
				censusDescription
				defaultCensus
				quorumPrototype
				state
				creatorId
				creator{
					name
					surname
					id
				}
				creationDate
				lastEdit
			}
			total
        }

        votingTypes {
            value
            label
        }

        quorumTypes {
            label
            value
        }
    }
`;

export default graphql(councilDetails, {
    options: props => ({
        variables: {
            id: props.council.id,
            companyId: props.council.companyId
        }
    })
})(CouncilDetails);