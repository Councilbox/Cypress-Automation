import React from "react";
import { Drawer, withStyles, Divider, Grid } from "material-ui";
import { isMobile } from "react-device-detect";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, AlertConfirm, GridItem, Scrollbar } from "../../displayComponents";
import * as CBX from '../../utils/CBX';
import { useInterval } from "../../hooks";


const UsersHeader = ({ isMobile, council, classes, client, ...props }) => {
	const [drawerTop, setDrawerTop] = React.useState(false)
	const [participantsOnline, setParticipantsOnline] = React.useState(false)
	const [participantsPresents, setParticipantsPresents] = React.useState(false)
	/*SACAR EL MODAL COMO COMPONENTE SEPARADO Y PEDIR CON INFINITE SCROLL REMOTOS O PRESENTES SEGÚN SEA NECESARIO */
	const [participantsPresentsAll, setParticipantsPresentsAll] = React.useState(false)
	const [state, setState] = React.useState({
		loading: true,
		loadingPresents: true,
		loadingPresentsAll: true,
		showModal: false
	})

	const getData = () => {
		getarticipantsOnline();
		getarticipantsPresents();
	}

	React.useEffect(() => {
		getData();
	}, [council.id]);

	useInterval(getData, 9000);


	const getarticipantsOnline = async () => {
		const response = await client.query({
			query: roomLiveParticipantsOnline,
			variables: {
				councilId: council.id,
				options: {
					limit: 15,
					offset: 0
				}
			}
		});

		setParticipantsOnline({
			...response.data.roomLiveParticipantsOnline
		});
		setState(state => ({ ...state, loading: false }));

	}


	const getarticipantsPresents = async () => {
		const response = await client.query({
			query: roomLiveParticipantsPresents,
			variables: {
				councilId: council.id,
				options: {
					limit: 15,
					offset: 0
				}
			}
		});

		setParticipantsPresents({
			...response.data.roomLiveParticipantsPresents
		});
		setState(state => ({ ...state, loadingPresents: false }));
	}


	//ALL COMPONENTE MODAL
	const verMas = async () => {
		const response = await client.query({
			query: roomLiveParticipantsPresents,
			variables: {
				councilId: council.id,

			}
		});
		setParticipantsPresentsAll({
			...response.data.roomLiveParticipantsPresents
		});
		setState(state => ({ ...state, loadingPresentsAll: false }));
		setState({ showModal: true })
		setDrawerTop(false)

	}

	//USAR LA VARIABLE TOTAL INDIVIDUALMENTE ENTRE REMOTOS Y PRESENTES
	let contParticipants
	if (participantsPresents.list && participantsOnline.list) {
		contParticipants = participantsPresents.list.length + participantsOnline.list.length;
	}

	return (
		<div
			style={{
				height: "3em",
				display: "flex",
				flexDirection: "row",
				width: "100%",
				justifyContent: "space-between",
				// borderBottom: '1px solid gainsboro',
				alignItems: "center",
				background: '#483962',
			}}
		>
			<div style={{ marginLeft: "1em ", marginRight: "1em", color: "white", display: "flex", justifyContent: "center", fontSize: "18px" }}>
				<div
					style={{
						marginRight: "0.7em",
						padding: "0px 12px",
						background: "#75569b",
						borderRadius: "6px",
						cursor: "pointer",
						display: "flex",
						alignItems: "center"
					}}
					onClick={() => setDrawerTop(!drawerTop)}
				>
					<i className="fa fa-users" aria-hidden="true" style={{ marginRight: "5px", }}></i>
					{state.loadingPresents ?
						<div style={{ width: "1em", height: "1.4em" }}><LoadingSection size={"1em"} /></div>
						:
						<span style={{ fontSize: "15px" }} >{contParticipants}</span>
					}

				</div>
				<div style={{ marginRight: "0.7em", padding: "2px 0px", display: "flex", alignItems: "center" }}>
					<i className="fa fa-globe" aria-hidden="true" style={{ marginRight: "5px" }}></i>
					{state.loading ?
						<div style={{ width: "1em", height: "1.4em" }}><LoadingSection size={"1em"} /></div>
						:
						participantsOnline.list.length
					}
				</div>
				<div style={{ marginRight: "0.7em", padding: "2px 0px", display: "flex", alignItems: " center" }}>
					<i className="material-icons" aria-hidden="true" style={{ marginRight: "5px", fontSize: "20px" }}>face</i>
					{state.loadingPresents ?
						<div style={{ width: "1em", height: "1.4em" }}><LoadingSection size={"1em"} /></div>
						:
						participantsPresents.list.length
					}
				</div>
			</div>
			{drawerTop &&
				<Drawer
					className={isMobile ? "drawerUsersRoot" : "drawerUsersRootPc"}
					BackdropProps={{
						className: "drawerUsers"
					}}
					classes={{
						paperAnchorTop: classes.paperAnchorTop,
					}}
					anchor="top"
					open={drawerTop}
					onClose={() => setDrawerTop(false)}
				>


					<div style={{ marginTop: "0.5em", marginBottom: "0.5em" }}>
						<div style={{ marginLeft: "1.3em" }}>
							<div style={{ display: "flex", alignItems: "center", marginBottom: "1em" }} ><i className={"fa fa-globe"} style={{ marginRight: "0.5em" }}></i>Online</div>
							{state.loading ?
								<LoadingSection />
								:
								participantsOnline.list.map(item => {
									return (
										<div key={item.id} style={{ display: "flex", alignItems: "center", fontSize: "14px", marginBottom: "0.2em", width: "90%" }} >
											{CBX.haveGrantedWord(item) &&
												<i className={"fa fa-video-camera"} style={{ marginRight: "0.5em" }}></i>
											}
											<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} >
												{item.name + " " + item.surname}
											</div>
										</div>
									)
								}
								)
							}

						</div>

						<Divider
							style={{ background: "#ffffff4a", margin: "1.5em 0px" }}
						/>
						<div style={{ marginLeft: "1.3em" }}>
							<div style={{ display: "flex", alignItems: "center", marginBottom: "1em" }} ><i className="material-icons" aria-hidden="true" style={{ marginRight: "5px", fontSize: "18px" }}>face</i>Presencial</div>
							{state.loadingPresents ?
								<LoadingSection />
								:
								participantsPresents.list.map(item => {
									return (
										<div key={item.id + "presents"} style={{ display: "flex", alignItems: "center", fontSize: "14px", marginBottom: "0.2em", width: "90%" }} >
											<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} >
												{item.name + " " + item.surname}
											</div>
										</div>
									)
								}
								)
							}
						</div>
						<div style={{ marginLeft: "1.3em", marginTop: "1em" }}>
							{participantsPresents.list.length >= 1 &&
								<div style={{ display: "flex", alignItems: "center", fontSize: "14px", marginBottom: "0.2em", cursor: "pointer" }} onClick={verMas}>Ver más</div>//TRADUCCION
							}
						</div>
					</div>
				</Drawer>
			}
			<AlertConfirm
				requestClose={() => setState({ showModal: false })}
				open={state.showModal}
				buttonCancel={"Close"}
				bodyStyle={{ minWidth: "70vw", height: "55vh" }}
				bodyText={
					<Grid style={{ display: "flex", height: "100%", justifyContent: "space-between" }}>
						<GridItem xs={5} md={5} lg={5}>
							<div style={{ paddingBottom: "1em", display: "flex", alignItems: "center" }}><i className={"fa fa-globe"} style={{ marginRight: "0.5em" }}></i>Online</div>
							<div style={{ border: "1px solid gainsboro", height: "85%", borderRadius: "5px", padding: "10px" }}>
								<Scrollbar>
									{state.loading ?
										<LoadingSection />
										:
										participantsOnline.list.map(item => {
											return (
												<div key={item.id} style={{ display: "flex", alignItems: "center", fontSize: "14px", marginBottom: "0.2em", width: "90%" }} >
													{CBX.haveGrantedWord(item) &&
														<i className={"fa fa-video-camera"} style={{ marginRight: "0.5em" }}></i>
													}
													<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} >
														{item.name + " " + item.surname}
													</div>
												</div>
											)
										}
										)
									}
								</Scrollbar>
							</div>
						</GridItem>
						<GridItem xs={5} md={5} lg={5}>
							<div style={{ paddingBottom: "1em", display: "flex", alignItems: "center" }}><i className="material-icons" aria-hidden="true" style={{ marginRight: "5px", fontSize: "18px" }}>face</i>Presencial</div>
							<div style={{ border: "1px solid gainsboro", height: "85%", borderRadius: "5px", padding: "10px" }}>
								{state.loadingPresentsAll ?
									<LoadingSection />
									:
									participantsPresentsAll.list.map(item => {
										return (
											<div key={item.id + "presents"} style={{ fontSize: "14px", marginBottom: "0.2em", width: "90%" }} >
												<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} >
													{item.name + " " + item.surname}
												</div>
											</div>
										)
									}
									)

								}
							</div>
						</GridItem>
					</Grid>
				}
				title={"Personas Online / Presenciales"} //TRADUCCION
			/>
		</div>
	)
}

const styles = {
	paperAnchorTop: {
		top: isMobile ? '88px' : "104px",
		left: !isMobile && '10px',
		width: '150px!important',
		maxHeight: "calc( 100% - 10rem )!important",
		background: '#74559bed',
		color: "white",
		boxShadow: "none",
		borderRadius: isMobile && "5px"

	},
	paper: {
		top: "88px",
		width: '150px!important',
	}
}


const roomLiveParticipantsOnline = gql`
query roomLiveParticipantsOnline ( $councilId: Int!, $filters: [FilterInput], $options: OptionsInput ) {
	roomLiveParticipantsOnline( councilId: $councilId, filters: $filters, options: $options) {
		list {
			id
			state
			councilId
			name
			personOrEntity
			position
			type
			assistanceLastDateConfirmed
			online
			requestWord
			numParticipations
			surname
		}
	}
}
`;

const roomLiveParticipantsPresents = gql`
query roomLiveParticipantsPresents ( $councilId: Int!, $filters: [FilterInput], $options: OptionsInput) {
	roomLiveParticipantsPresents( councilId: $councilId, filters: $filters, options: $options ) {
		list {
			id
			state
			councilId
			name
			personOrEntity
			position
			email
			phone
			dni
			type
			signed
			assistanceIntention
			assistanceLastDateConfirmed
			online
			requestWord
			numParticipations
			surname
		}
	}
}
`;


export default withStyles(styles)(withApollo(UsersHeader));
