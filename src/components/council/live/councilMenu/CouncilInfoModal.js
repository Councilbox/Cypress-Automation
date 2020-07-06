import React from "react";
import { AlertConfirm, Grid, GridItem, Scrollbar } from "../../../../displayComponents";
import { hasSecondCall } from "../../../../utils/CBX";
import { moment } from '../../../../containers/App';
import { StatuteDisplay } from "../../display/StatuteDisplay";
import { Paper } from "material-ui";
import { withApollo } from "react-apollo";
import conSesionIcon from "../../../../assets/img/con-sesion-icon.svg";
import consejoSinSesion from "../../../../assets/img/consejo-sin-sesion-icon.svg";
import elecciones from "../../../../assets/img/elecciones.svg";
import sinSesionIcon from '../../../../assets/img/sin-sesion-icon.svg';
import { Collapse } from "material-ui";
import gql from "graphql-tag";
import { getSubjectAbrv } from "../../../../displayComponents/AgendaNumber";
import { isMobile } from "../../../../utils/screen";



const CouncilInfoModal = ({ council, requestClose, show, translate, client, ...props }) => {
	const [open, setOpen] = React.useState(false);
	const [openPoints, setOpenPoints] = React.useState(false);
	const [data, setData] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	
	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: agendaManager,
			variables: {
				companyId: council.companyId,
				councilId: council.id
			}
		});
		console.log(response)
		setData(response.data)
		setLoading(true)
	}, [council.id]);

	React.useEffect(() => {
		getData()
	}, []);

	const getTypeText = subjectType => {
		const votingType = data.votingTypes.find(item => item.value === subjectType)
		return !!votingType ? translate[votingType.label] : '';
	}

	return (
		<AlertConfirm
			requestClose={requestClose}
			open={show}
			bodyStyle={{ width: isMobile && "560px", height: "100%" }}
			widthModal={{ height: "100%" }}
			bodyText={
				<Grid style={{ color: "black", height: "100%" }}>
					<Scrollbar>
						<GridItem xs={12} lg={12} md={12} style={{ marginRight: "1em", marginBottom: "1em" }}>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "18px" }}>
								<div>{council.businessName}</div>
								<div style={{ width: "140px", height: '100%' }}><img style={{ width: "100%" }} src={props.logo} /></div>
							</div>
						</GridItem>
						<GridItem xs={12} lg={12} md={12}
							style={{
								marginTop: "1em",
								marginBottom: "1em",
								marginRight: "1em",
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: "1em"
							}}
						>
							<div>
								<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
									<div style={{ display: "flex", alignItems: "center" }}>
										<div style={{ width: "25px", height: "100%", marginRight: "1em" }}>
											<img src={councilTypes[council.councilType].logo} style={{ width: "100%" }} />
										</div>
										<div>
											{translate[councilTypes[council.councilType].name]}
										</div>
									</div>
									<div>
										{open ?
											<i className="material-icons" style={{ fontSize: "27px", cursor: "pointer" }} onClick={() => setOpen(false)}>
												arrow_drop_up
								</i>
											:
											<i className="material-icons" style={{ fontSize: "27px", cursor: "pointer" }} onClick={() => setOpen(true)}>
												arrow_drop_down
								</i>
										}
									</div>
								</div>
								<Collapse in={open} timeout="auto" unmountOnExit >
									<div style={{ fontSize: "13px" }}>{translate[councilTypes[council.councilType].description]}</div>
								</Collapse>
							</div>
						</GridItem>
						<GridItem xs={12} lg={12} md={12}
							style={{
								marginTop: "1em",
								marginBottom: "1em",
								marginRight: "1em",
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: "1em"
							}}
						>
							<div>
								{`${translate.new_location_of_celebrate}: ${
									council.street
									}, ${council.zipcode}, ${council.countryState}, (${
									council.country
									})`}
								<div>
								</div>
								{`${translate["1st_call_date"]}: ${moment(
									council.dateStart
								).format("LLL")}`}
							</div>
							<div>
								{hasSecondCall(council.statute) &&
									`${translate["2nd_call_date"]}: ${council.dateStart2NdCall ? moment(
										council.dateStart2NdCall
									).format("LLL") : '-'}`}
							</div>
							<div>
								{council.autoClose === 1 &&
									<span>Fecha de cierre automático: {moment(council.closeDate).format('LLL')}</span>
								}
								{council.dateEnd &&
									<span>Fecha de finalización: {moment(council.dateEnd).format('LLL')}</span>
								}
							</div>
						</GridItem>
						<GridItem xs={12} lg={12} md={12} style={{
							marginTop: "1em",
							marginBottom: "1em",
							marginRight: "1em",
							boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
							border: '1px solid rgb(97, 171, 183)',
							borderRadius: '4px',
							padding: "1em"
						}}>
							<div>
								<b>{council.name}</b>
							</div>

							<div style={{ marginBottom: "0px" }} className={"marginP0"} dangerouslySetInnerHTML={{
								__html: council.conveneText
							}}></div>
							<div>
								<div>
									<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
										<div style={{ display: "flex", alignItems: "center" }}>
											<div>
												{translate.agenda_points}
											</div>
										</div>
										<div>
											{openPoints ?
												<i className="material-icons" style={{ fontSize: "27px", cursor: "pointer" }} onClick={() => setOpenPoints(false)}>
													arrow_drop_up
								</i>
												:
												<i className="material-icons" style={{ fontSize: "27px", cursor: "pointer" }} onClick={() => setOpenPoints(true)}>
													arrow_drop_down
								</i>
											}
										</div>
									</div>
									<Collapse in={openPoints} timeout="auto" unmountOnExit >
										{loading &&
											<div>{data.agendas.map(agenda => (
												<Paper style={{ marginTop: '0.8em', padding: '0.8em', margin: '0.3em', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
												border: '1px solid rgb(125, 33, 128, 0.58)',
												borderRadius: '4px', }} key={`agenda_${agenda.id}`}>
													<Grid>
														<GridItem xs={1} md={1} lg={1} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
															{getSubjectAbrv(agenda.agendaSubject)}
														</GridItem>
														<GridItem xs={11} md={11} lg={11}>
															<div style={{ display: 'flex', justifyContent: 'space-between' }}>
																<span>
																	{agenda.agendaSubject}
																</span>
																<span>
																	{getTypeText(agenda.subjectType)}
																</span>
															</div>
															<div dangerouslySetInnerHTML={{ __html: agenda.description }} />
														</GridItem>
													</Grid>
												</Paper>
											))}</div>
										}
									</Collapse>
								</div>
							</div>
						</GridItem>
						<GridItem xs={12} lg={12} md={12}
							style={{
								marginTop: "1em",
								marginBottom: "1em",
								marginRight: "1em",
								boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
								border: '1px solid rgb(97, 171, 183)',
								borderRadius: '4px',
								padding: "1em"
							}}
						>
							<StatuteDisplay
								statute={council.statute}
								translate={translate}
								quorumTypes={data.quorumTypes}
							/>
						</GridItem>
					</Scrollbar>
				</Grid >
			}
			title={translate.council_info}
		/>
	);
}

const councilTypes = [
	{ name: 'with_session', logo: conSesionIcon, description: 'with_session_description' },
	{ name: 'without_session', logo: sinSesionIcon, description: 'without_session_description' },
	{ name: 'board_without_session', logo: consejoSinSesion, description: 'board_without_session_description' },
	{ name: 'elections', logo: elecciones, description: 'elections_description' }
]


export const agendaManager = gql`
	query AgendaManagerFields($companyId: Int!, $councilId: Int!) {
		agendas(councilId: $councilId) {
			abstentionManual
			abstentionVotings
			agendaSubject
			items {
				id
				value
			}
			ballots {
				id
				weight
				admin
				value
				participantId
				itemId
			}
			options {
				maxSelections
				minSelections
				id
				writeIn
			}
			attachments {
				id
				agendaId
				filename
				filesize
				filetype
				councilId
				state
			}
			comment
			commentRightColumn
			councilId
			currentRemoteCensus
			dateEndVotation
			dateStart
			dateStartVotation
			description
			id
			majority
			majorityDivider
			majorityType
			negativeManual
			negativeVotings
			noParticipateCensus
			noVoteManual
			noVoteVotings
			numAbstentionManual
			numAbstentionVotings
			numCurrentRemoteCensus
			numNegativeManual
			numNegativeVotings
			numNoParticipateCensus
			numNoVoteManual
			numNoVoteVotings
			numPositiveManual
			numPositiveVotings
			numPresentCensus
			numRemoteCensus
			numTotalManual
			numTotalVotings
			orderIndex
			pointState
			positiveManual
			positiveVotings
			presentCensus
			remoteCensus
			socialCapitalCurrentRemote
			socialCapitalNoParticipate
			socialCapitalPresent
			socialCapitalRemote
			sortable
			subjectType
			totalManual
			totalVotings
			votingState
		}
		languages {
			desc
			columnName
		}

		companyStatutes(companyId: $companyId) {
			title
			id
		}

		majorityTypes {
			value
			label
		}

		quorumTypes {
			label
			value
		}

		votingTypes {
			label
			value
		}

		draftTypes {
			id
			label
		}
	}
`;


export default withApollo(CouncilInfoModal);
