import React from "react";
import { AlertConfirm, Grid, GridItem, Scrollbar } from "../../../../displayComponents";
import { hasSecondCall, agendaPointNotOpened, agendaClosed, agendaPointOpened, agendaVotingsOpened } from "../../../../utils/CBX";
import { moment } from '../../../../containers/App';
import { StatuteDisplay } from "../../display/StatuteDisplay";
import { Paper } from "material-ui";
import { withApollo } from "react-apollo";
import { Collapse } from "material-ui";
import gql from "graphql-tag";
import { isMobile } from "../../../../utils/screen";
import { Tooltip } from "material-ui";
import { councilTypesInfo } from "../../../../constants";


const CouncilInfoModal = ({ council, requestClose, show, translate, client, ...props }) => {
	const [open, setOpen] = React.useState(false);
	const [openPoints, setOpenPoints] = React.useState(false);
	const [data, setData] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	
	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: agendaManager,
			variables: {
				companyId: council.companyId,
				councilId: council.id
			}
		});
		setData(response.data);
		setLoading(false);
	}, [council.id]);

	React.useEffect(() => {
		if(show){
			getData();
		}
	}, [show]);

	const agendaStateIcon = agenda => {
        let title = '';
        if (council.councilType >= 2) {
            return <span />;
        }

        let icon = 'fa fa-lock';
        let color = ""
        if (agendaPointNotOpened(agenda) || agendaClosed(agenda)) {
            icon = "fa fa-lock colorGrey";
            title = translate.closed;
        }
        if (agendaPointOpened(agenda)) {
            icon = "fa fa-unlock-alt colorGren";
            color = "#278289";
            title = translate.in_discussion;
        }
        return (
            <Tooltip title={title}>
                <i
                    className={icon}
                    aria-label={icon === "fa fa-lock colorGrey" ? "punto cerrado" : "punto abierto"}
                    style={{ marginRight: '0.6em', cursor: 'auto', fontSize: "18px", color: color }}
                ></i>
            </Tooltip>
        );
	}
	
	const agendaVotingIcon = agenda => {
        let mostrar = agenda.subjectType !== 0;
        if (mostrar) {
            let title = translate.closed_votings;
            let color = 'default';
            if (agendaVotingsOpened(agenda)) {
                title = translate.opened_votings;
                color = "#278289";
            }
            return (
                <Tooltip title={title}>
                    <i
                        className={"material-icons"}
                        aria-label={title}
                        style={{ marginRight: '0.6em', fontSize: "18px", color, cursor: 'context-menu', }}
                    >
                        how_to_vote
                    </i>
                </Tooltip>
            );
        }
        return <span />;
    }

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
											<img src={councilTypesInfo[council.councilType].logo} style={{ width: "100%" }} />
										</div>
										<div>
											{translate[councilTypesInfo[council.councilType].name]}
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
									<div style={{ fontSize: "13px" }}>{translate[councilTypesInfo[council.councilType].description]}</div>
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
									<span>{translate.date_end}: {moment(council.closeDate).format('LLL')}</span>
								}
								{council.dateEnd &&
									<span>{translate.date_end}: {moment(council.dateEnd).format('LLL')}</span>
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
										{!loading &&
											<div>{data.agendas.map(agenda => (
												<Paper style={{ marginTop: '0.8em', padding: '0.8em', margin: '0.3em', boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
												border: `${agendaPointOpened(agenda) ? '2' : '1'}px solid rgb(125, 33, 128, 0.58)`,
												borderRadius: '4px', }} key={`agenda_${agenda.id}`}>
													<Grid>
														<GridItem xs={12} md={12} lg={12}>
															<div style={{ display: 'flex', justifyContent: 'space-between' }}>
																<div style={{display: 'flex', alignItems: 'center', width: '80%'}}>
																	{agendaStateIcon(agenda)}
																	{agendaVotingIcon(agenda)}
																	{agenda.agendaSubject}
																</div>
																<div>
																	{getTypeText(agenda.subjectType)}
																</div>
															</div>
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
							{!loading &&
								<StatuteDisplay
									statute={council.statute}
									translate={translate}
									quorumTypes={data.quorumTypes}
								/>
							}

						</GridItem>
					</Scrollbar>
				</Grid >
			}
			title={translate.council_info}
		/>
	);
}




export const agendaManager = gql`
	query AgendaManagerFields($councilId: Int!) {
		agendas(councilId: $councilId) {
			abstentionManual
			abstentionVotings
			agendaSubject
			id
			subjectType
			pointState
			councilId
			votingState
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
	}
`;


export default withApollo(CouncilInfoModal);
