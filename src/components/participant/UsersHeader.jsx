import React from "react";
import { Drawer, withStyles, Divider } from "material-ui";
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { LoadingSection, AlertConfirm, Grid, GridItem, Scrollbar, TextInput, Icon, BasicButton } from "../../displayComponents";
import * as CBX from '../../utils/CBX';
import { useInterval } from "../../hooks";
import { getPrimary } from "../../styles/colors";
import { isMobile } from "../../utils/screen";


const participantHeaderLimit = 15;


const UsersHeader = ({ isMobile, council, translate, classes, client, ...props }) => {
	const [drawerTop, setDrawerTop] = React.useState(false);
	const [participantsOnline, setParticipantsOnline] = React.useState(false);
	const [participantsPresents, setParticipantsPresents] = React.useState(false);
	const [state, setState] = React.useState({
		loading: true,
		loadingPresents: true,
		loadingPresentsAll: true,
		showModal: false,
		filters: '',
		offsetOnline: 0,
		offsetPresencial: 0
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
					limit: participantHeaderLimit,
					offset: 0
				},

			}
		});

		setParticipantsOnline({
			...response.data.roomLiveParticipantsOnline
		});
		setState(state => ({ ...state, loading: false }));

	}


	const verMas = async () => {
		setState({ ...state, showModal: true })
		setDrawerTop(false)
	}

	const getarticipantsPresents = async () => {
		const response = await client.query({
			query: roomLiveParticipantsPresents,
			variables: {
				councilId: council.id,
				options: {
					limit: participantHeaderLimit,
					offset: 0
				},

			}
		});

		setParticipantsPresents({
			...response.data.roomLiveParticipantsPresents
		});
		setState(state => ({ ...state, loadingPresents: false }));
	}

	let total = 0
	if (!state.loadingPresents && !state.loading) {
		total = participantsOnline.total + participantsPresents.total
	}

	return (
		<div
			style={{
				height: "3em",
				display: "flex",
				flexDirection: "row",
				width: "100%",
				justifyContent: "space-between",
				alignItems: "center",
				background: '#483962',
			}}
		>
			<div style={{ marginLeft: "1em ", marginRight: "1em", color: "white", display: "flex", justifyContent: "center", fontSize: "16px" }}>
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
					{state.loadingPresents && state.loading ?
						<div style={{ width: "1em", height: "1.4em" }}><LoadingSection size={"1em"} /></div>
						:
						<span style={{ fontSize: "15px" }} >{total}</span>
					}

				</div>
				<div style={{ marginRight: "0.7em", padding: "2px 0px", display: "flex", alignItems: "center" }}>
					<i className="fa fa-globe" aria-hidden="true" style={{ marginRight: "5px" }}></i>
					{state.loading ?
						<div style={{ width: "1em", height: "1.4em" }}><LoadingSection size={"1em"} /></div>
						:
						participantsOnline.total
					}
				</div>
				<div style={{ marginRight: "0.7em", padding: "2px 0px", display: "flex", alignItems: " center" }}>
					<i className="material-icons" aria-hidden="true" style={{ marginRight: "5px", fontSize: "20px" }}>face</i>
					{state.loadingPresents ?
						<div style={{ width: "1em", height: "1.4em" }}><LoadingSection size={"1em"} /></div>
						:
						participantsPresents.total
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
								})
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
							{(participantsPresents.total > participantHeaderLimit || participantsOnline.total > participantHeaderLimit) &&
								<div style={{ display: "flex", alignItems: "center", fontSize: "14px", marginBottom: "0.2em", cursor: "pointer" }}
									onClick={() => verMas()}
								>
									Ver más
								</div> //TRADUCCION
							}
						</div>
					</div>
				</Drawer>
			}
			{state.showModal &&
				<Modal
					requestClose={() => setState({ showModal: false })}
					showModal={state.showModal}
					council={council}
					translate={translate}
				/>
			}
		</div>
	)
}


const initialState = {
	loading: true,
	filters: {
		onlineOffset: 0,
		presentOffset: 0,
		fullName: ''
	},
	data: {
		online: {
			list: [],
			total: 0
		},
		presents: {
			list: [],
			total: 0
		}
	}
}

const reducer = (state, action) => {
	const actions = {
		'LOAD_DATA': () => ({
			...state,
			loading: false,
			data: {
				...state.data,
				...(action.value.online? {
					online: {
						list: [...state.data.online.list, ...action.value.online.list],
						total: action.value.online.total
					},
				} : {}),
				...(action.value.presents? {
					presents: {
						list: [...state.data.presents.list, ...action.value.presents.list],
						total: action.value.presents.total
					},
				} : {})
			}
		}),
		'RESET_DATA': () => ({
			...state,
			loading: false,
			data: {
				...state.data,
				...(action.value.online? {
					online: {
						list: action.value.online.list,
						total: action.value.online.total
					},
				} : {}),
				...(action.value.presents? {
					presents: {
						list: action.value.presents.list,
						total: action.value.presents.total
					},
				} : {})
			}
		}),
		'SET_FULLNAME': () => ({
			...state,
			filters: {
				onlineOffset: 0,
				presentOffset: 0,
				fullName: action.value
			}
		}),
		'ONLINE_OFFSET': () => ({
			...state,
			filters: {
				...state.filters,
				onlineOffset: action.value
			}
		}),
		'PRESENTS_OFFSET': () => ({
			...state,
			filters: {
				...state.filters,
				presentOffset: action.value
			}
		})
	}

	return actions[action.type] ? actions[action.type]() : state;
}


const Modal = withApollo(({ translate, showModal, requestClose, council: { id }, client }) => {
	const [state, dispatch] = React.useReducer(reducer, initialState);
	const [loading, setLoading] = React.useState(false);
	const actualSearch = React.useRef(null);

	const { fullName, presentOffset, onlineOffset } = state.filters;


	const getPresents = async text => {
		return await client.query({
			query: roomLiveParticipantsPresents,
			variables: {
				councilId: id,
				options: {
					limit: participantHeaderLimit,
					offset: presentOffset
				},
				...(text ? {
					filters: [
						{
							field: 'fullName',
							text
						}
					]
				} : {})
			},
		});
	};

	const getOnline = async text => {
		return await client.query({
			query: roomLiveParticipantsOnline,
			variables: {
				councilId: id,
				options: {
					limit: participantHeaderLimit,
					offset: onlineOffset
				},
				...(text ? {
					filters: [
						{
							field: 'fullName',
							text
						}
					]
				} : {})
			},
		});
	};


	const getData = React.useCallback(async () => {
		const [response, responseOnline] = await Promise.all([getPresents(fullName), getOnline(fullName)]);

		if (fullName !== actualSearch.current) {
			actualSearch.current = fullName;
			dispatch({
				type: 'RESET_DATA', value: {
					presents: response.data.roomLiveParticipantsPresents,
					online: responseOnline.data.roomLiveParticipantsOnline
				}
			});
		}
	}, [fullName]);

	const loadMorePresents = React.useCallback(async () => {
		setLoading(true);
		const [response] = await Promise.all([getPresents(fullName)]);
		dispatch({
			type: 'LOAD_DATA', value: {
				presents: response.data.roomLiveParticipantsPresents,
			}
		});
		setLoading(false);
	}, [presentOffset]);

	const loadMoreRemote = React.useCallback(async () => {
		setLoading(true);
		const [response] = await Promise.all([getOnline(fullName)]);
		dispatch({
			type: 'LOAD_DATA', value: {
				online: response.data.roomLiveParticipantsOnline
			}
		});
		setLoading(false);
	}, [onlineOffset]);

	React.useEffect(() => {
		if(showModal && presentOffset !== 0){
			loadMorePresents();
		}
	}, [presentOffset]);

	React.useEffect(() => {
		if(showModal && onlineOffset !== 0){
			loadMoreRemote();
		}
	}, [onlineOffset]);

	React.useEffect(() => {
		let timeout;
		if (showModal) {
			timeout = setTimeout(getData, 400);
		}
		return () => clearTimeout(timeout);
	}, [getData, showModal]);


	const renderBody = () => (
		<Scrollbar>
			<Grid style={{ height: "100%", justifyContent: "space-between", overflow: "hidden", padding: "0.2em" }}>
				<GridItem xs={12} md={12} lg={12} style={{ display: "flex", justifyContent: "flex-end", maxHeight: "5em" }}>
					<div>
						<TextInput
							adornment={<Icon>search</Icon>}
							type="text"
							labelNone={true}
							value={fullName}
							onChange={event => {
								dispatch({ type: 'SET_FULLNAME', value: event.target.value });
							}}
						/>
					</div>
				</GridItem>
				<GridItem xs={12} md={5} lg={5} style={{ height: isMobile ? "20em" : "100%" }}>
					<div style={{ marginBottom: "1em", display: "flex", alignItems: "center" }}>
						<i className={"fa fa-globe"} style={{ marginRight: "0.5em" }}></i>
						Online
					</div>
					<div style={{ border: "1px solid gainsboro", height: "80%", borderRadius: "5px", padding: "10px" }}>
						<div style={{ width: "100%", height: "95%" }}>
							<Scrollbar>
								{state.loading ?
									<LoadingSection />
									:
									<div>
										{state.data.online.list.map(item => {
											return (
												<div key={item.id} style={{ alignItems: "center", fontSize: "14px", marginBottom: "0.2em", width: "90%" }} >
													{CBX.haveGrantedWord(item) &&
														<i className={"fa fa-video-camera"} style={{ marginRight: "0.5em" }}></i>
													}
													<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} >
														{item.name + " " + item.surname}
													</div>
												</div>
											)
										}
										)}
									</div>
								}
							</Scrollbar>
							{!state.loading &&
								state.data.online.total !== state.data.online.list.length &&
								<div style={{ cursor: "pointer", color: getPrimary() }} onClick={() => { dispatch({ type: 'ONLINE_OFFSET', value: onlineOffset + participantHeaderLimit }) }}>Ver más</div>
							}
						</div>
					</div>
				</GridItem>
				<GridItem xs={12} md={5} lg={5} style={{ height: isMobile ? "20em" : "100%" }}>
					<div style={{ marginBottom: "1em", display: "flex", alignItems: "center" }}>
						<i className="material-icons" aria-hidden="true" style={{ marginRight: "5px", fontSize: "18px" }}>
							face
						</i>
						Presencial
					</div>
					<div style={{ border: "1px solid gainsboro", height: "80%", borderRadius: "5px", padding: "10px" }}>
						<div style={{ width: "100%", height: "95%" }}>
							<Scrollbar>
								{state.loading ?
									<LoadingSection />
									:
									state.data.presents.list.map(item => {
										return (
											<div key={item.id + "presents"} style={{ fontSize: "14px", marginBottom: "0.2em", width: "90%" }} >
												<div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }} >
													{item.name + " " + item.surname}
												</div>
											</div>
										)
									})
								}
							</Scrollbar>
							{!state.loading &&
								state.data.presents.total !== state.data.presents.list.length &&
								<BasicButton
									text={translate.see_more}
									type="flat"
									onClick={() => { dispatch({ type: 'PRESENTS_OFFSET', value: presentOffset + participantHeaderLimit }) }}
									loading={loading}
									loadingColor={getPrimary()}
									color="transparent"
									buttonStyle={{
										marginBottom: '5px'
									}}
									textStyle={{
										color: getPrimary()
									}}
								/>
							}
						</div>
					</div>
				</GridItem>
			</Grid>
		</Scrollbar>
	)


	return (
		<AlertConfirm
			requestClose={requestClose}
			open={showModal}
			buttonCancel={translate.close}
			bodyStyle={{ minWidth: "70vw", height: "70vh" }}
			bodyText={renderBody()}
			title={"Personas Online / Presenciales"} //TRADUCCION
		/>
	)
})


const styles = {
	paperAnchorTop: {
		top: isMobile ? '88px' : "104px",
		left: !isMobile && '10px',
		width: '200px!important',
		maxHeight: "calc( 100% - 10rem )!important",
		background: '#74559bed',
		color: "white",
		boxShadow: "none",
		borderRadius: isMobile && "5px"

	},
	paper: {
		top: "88px",
		width: '200px!important',
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
		total
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
		total
	}
}
`;


export default withStyles(styles)(withApollo(UsersHeader));
