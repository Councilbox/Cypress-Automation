import React from "react";
import { Card } from "material-ui";
import withTranslations from "../../../HOCs/withTranslations";
import withDetectRTC from "../../../HOCs/withDetectRTC";
import { councilIsLive, councilIsFinished, checkHybridConditions } from "../../../utils/CBX";
import { checkIsCompatible } from '../../../utils/webRTC';
import LoginForm from "./LoginForm";
import CouncilState from "./CouncilState";
import { NotLoggedLayout, Scrollbar } from '../../../displayComponents';
import { isMobile } from "../../../utils/screen";
import RequestDataInfo from "./RequestDataInfo";
import DataAuthorization from "./DataAuthorization";
import { ConfigContext } from "../../../containers/AppControl";

// '850px'
const width = window.innerWidth > 450 ? '850px' : '100%'

const styles = {
	viewContainer: {
		width: "100vw",
		height: "100vh",
		position: "relative"
	},
	mainContainer: {
		width: "100%",
		display: "flex",
		height: '100%',
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		position: "relative",
		padding: isMobile ? "" : "10px"
	},
	cardContainer: {
		margin: isMobile ? "20%" : "20px",
		marginBottom: '5px',
		minWidth: width,
		maxWidth: "100%",
		//height: '50vh',
		//minHeight: isMobile? '70vh' : '50vh',
	}
};

const reducer = (state, action) => {
	const actions = {
		'SUCCESS': () => {
			return ({
				...state,
				status: 'SUCCESS',
				message: action.payload.message
			})
		},
		'ERROR': () => ({
			...state,
			status: 'ERROR',
			message: action.payload.message
		})
	}

	return actions[action.type] ? actions[action.type]() : state;
}

const ParticipantLogin = ({ participant, council, company, ...props }) => {
	const [selectHeadFinished, setSelectHeadFinished] = React.useState("participacion");
	const [{ status, message }, updateState] = React.useReducer(reducer, { status: 'WAITING' });
	const config = React.useContext(ConfigContext);

	const finishedVoted = (councilIsFinished(council) || participant.hasVoted);

	const loginForm = () => (
		<LoginForm
			participant={participant}
			council={council}
			company={company}
			status={status}
			message={message}
			updateState={updateState}
		/>
	)

	if ((finishedVoted || !councilIsLive(council)) && isMobile) {
		return (
			<NotLoggedLayout
				translate={props.translate}
				helpIcon={true}
				languageSelector={false}
				councilIsFinished={councilIsFinished(council)}
				setSelectHeadFinished={setSelectHeadFinished}
				selectHeadFinished={selectHeadFinished}
				styleFix={{ overflow: 'hidden', }}
			>
				<div style={{ width: "100%", background: "transparent", height: "calc( 100% - 3em )" }} >
					<div style={{ width: "100%", background: "transparent", height: "100%" }}>
						<CouncilState council={council} company={company} participant={participant} selectHeadFinished={selectHeadFinished} />
					</div>
				</div>
			</NotLoggedLayout>
		);
	}
	const renderLogin = ((councilIsLive(council) && !participant.hasVoted) && !checkHybridConditions(council));
	return (
		<NotLoggedLayout
			translate={props.translate}
			helpIcon={true}
			languageSelector={false}
			styleFix={{ overflow: 'hidden', }}
		>
			{renderLogin ?
				<>
					{(participant.legalTermsAccepted || !config.participantTermsCheck) ?
						<div style={{
							...styles.mainContainer,
							height: "calc( 100% - 3em ) "
						}}>
							<Card style={{
								...styles.cardContainer,
								background: finishedVoted && 'transparent',
								boxShadow: finishedVoted && "none",
								minWidth: window.innerWidth > 450 ? '550px' : '100%',
							}} elevation={6}>
								{loginForm()}
							</Card>
							<Card style={{
								width: window.innerWidth > 450 ? '550px' : '100%'
							}}>
								<RequestDataInfo
									data={{}}
									translate={props.translate}
									message={message}
									status={'SUCCESS'} //SUCCESS
								/>
							</Card>
						</div>
						:
						<div style={{
							...styles.mainContainer
						}}>
							<Card style={{
								...styles.cardContainer,
								padding: '2em',
								background: finishedVoted && 'transparent',
								boxShadow: finishedVoted && "none",
								minWidth: window.innerWidth > 750 ? '650px' : '100%'
							}} elevation={6}>
								<DataAuthorization
									participant={participant}
									council={council}
									company={company}
									refetch={props.refetch}
								/>
							</Card>
							<Card style={{
								width: window.innerWidth > 750 ? '650px' : '100%'
							}}>
								<RequestDataInfo
									data={{}}
									translate={props.translate}
									message={message}
									status={'SUCCESS'} //SUCCESS
								/>
							</Card>
						</div>
					}
				</>
				:
				<Scrollbar>
					<div style={{
						...styles.mainContainer,
						height: councilIsFinished(council) || props.participant?.hasVoted || checkHybridConditions(council) ? "" :'calc( 100% - 3em )',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center'
					}}>
						<Card style={{
							...styles.cardContainer,
							background: finishedVoted && 'transparent',
							boxShadow: finishedVoted && "none",
							minWidth: width,
							height: '90%'
						}} elevation={6}>
							<CouncilState council={council} company={company} participant={participant} />
						</Card>
					</div>
				</Scrollbar>
			}
		</NotLoggedLayout >
	);
}


export default withTranslations()(withDetectRTC()(ParticipantLogin));
