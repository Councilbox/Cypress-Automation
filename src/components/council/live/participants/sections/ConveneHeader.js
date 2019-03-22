import React from "react";
import {
	LoadingSection,
	Grid,
	Icon,
	SelectInput,
	MenuItem,
	TextInput,
	BasicButton,
	GridItem,
	LiveToast
} from "../../../../../displayComponents";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import {
	PARTICIPANTS_LIMITS,
	EMAIL_TRACK_STATES
} from "../../../../../constants";
import ParticipantsList from "../ParticipantsList";
import { getSecondary } from "../../../../../styles/colors";
import withWindowSize from "../../../../../HOCs/withWindowSize";
import EmailIcon from "../EmailIcon";
import { toast } from "react-toastify";
import { updateConveneSends } from "../../../../../queries";
import AddGuestModal from "../AddGuestModal";


const ConveneHeader = ({ conveneSendRecount, selected, setSelected, translate }) => {	
	return (
		<React.Fragment>
			<Grid
				spacing={0}
				xs={12}
				lg={12}
				md={12}
				style={{
					backgroundColor: "whiteSmoke",
					width: "100%",
					height: "3em",
					borderBottom: "1px solid gainsboro",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingLeft: "1.5em",
					paddingRight: "2.5em"
				}}
			>
				<div
					onClick={() => {
						setSelected(null);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected === null &&
							"lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={"ALL"}
						number={conveneSendRecount.all}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							EMAIL_TRACK_STATES.FAILED
						);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected ===
								EMAIL_TRACK_STATES.FAILED && "lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={EMAIL_TRACK_STATES.FAILED}
						number={conveneSendRecount.failed}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							EMAIL_TRACK_STATES.NOT_SENT
						);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected ===
								EMAIL_TRACK_STATES.NOT_SENT && "lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={EMAIL_TRACK_STATES.NOT_SENT}
						number={conveneSendRecount.notSend}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS
						);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected ===
								EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS &&
							"lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={EMAIL_TRACK_STATES.INVALID_EMAIL_ADDRESS}
						number={conveneSendRecount.invalidAddress}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(EMAIL_TRACK_STATES.SPAM);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected ===
								EMAIL_TRACK_STATES.SPAM && "lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={EMAIL_TRACK_STATES.SPAM}
						number={conveneSendRecount.spam}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							EMAIL_TRACK_STATES.PENDING_SHIPPING
						);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected ===
								EMAIL_TRACK_STATES.PENDING_SHIPPING &&
							"lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={EMAIL_TRACK_STATES.PENDING_SHIPPING}
						number={conveneSendRecount.pendingShipping}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							EMAIL_TRACK_STATES.DELIVERED
						);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected ===
								EMAIL_TRACK_STATES.DELIVERED && "lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={EMAIL_TRACK_STATES.DELIVERED}
						number={conveneSendRecount.delivered}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							EMAIL_TRACK_STATES.OPENED
						);
					}}
					style={{
						cursor: "pointer",
						backgroundColor:
							selected ===
								EMAIL_TRACK_STATES.OPENED && "lightGrey"
					}}
				>
					<EmailIcon
						translate={translate}
						reqCode={EMAIL_TRACK_STATES.OPENED}
						number={conveneSendRecount.opened}
					/>
				</div>
			</Grid>
		</React.Fragment>
	);
}

export default ConveneHeader;
