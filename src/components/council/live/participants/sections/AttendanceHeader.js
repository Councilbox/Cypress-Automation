import React from "react";
import {
	LoadingSection,
	Grid,
	Icon,
	SelectInput,
	MenuItem,
	GridItem,
	BasicButton,
	ButtonIcon,
	TextInput
} from "../../../../../displayComponents";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import {
	PARTICIPANTS_LIMITS,
	PARTICIPANT_STATES
} from "../../../../../constants";
import { Tooltip } from 'material-ui';
import { isMobile } from 'react-device-detect';
import { getSecondary } from "../../../../../styles/colors";
import withWindowSize from "../../../../../HOCs/withWindowSize";
import ParticipantsList from "../ParticipantsList";
import StateIcon from "../StateIcon";
import AddGuestModal from "../AddGuestModal";

const selectedStyle = {
	borderBottom: `3px solid ${getSecondary()}`,
	color: getSecondary(),
	fontWeight: '700'
}

const AttendanceHeader = ({ attendanceRecount, selected, setSelected, translate }) => {
	return (
		<React.Fragment>
			<Grid
				spacing={0}
				xs={12}
				lg={12}
				md={12}
				style={{
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
						...(selected === null?
							selectedStyle
						:
							{}
						)
					}}
				>
					<StateIcon
						color={selected === null? getSecondary() : 'grey'}
						translate={translate}
						state={"ALL"}
						number={attendanceRecount.all}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(-1);
					}}
					style={{
						cursor: "pointer",
						...(selected === -1?
							selectedStyle
						:
							{}
						)
					}}
				>
					<StateIcon
						color={selected === -1? getSecondary() : 'grey'}
						translate={translate}
						state={null}
						number={attendanceRecount.notConfirmed}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							PARTICIPANT_STATES.NO_PARTICIPATE
						);
					}}
					style={{
						cursor: "pointer",
						...(selected === PARTICIPANT_STATES.NO_PARTICIPATE?
							selectedStyle
						:
							{}
						)
					}}
				>
					<StateIcon
						translate={translate}
						color={selected === PARTICIPANT_STATES.NO_PARTICIPATE? getSecondary() : 'grey'}
						state={PARTICIPANT_STATES.NO_PARTICIPATE}
						number={attendanceRecount.noParticipate}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(PARTICIPANT_STATES.REMOTE);
					}}
					style={{
						cursor: "pointer",
						...(selected === PARTICIPANT_STATES.REMOTE?
							selectedStyle
						:
							{}
						)
					}}
				>
					<StateIcon
						color={selected === PARTICIPANT_STATES.REMOTE? getSecondary() : 'grey'}
						translate={translate}
						state={PARTICIPANT_STATES.REMOTE}
						number={attendanceRecount.remote}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							PARTICIPANT_STATES.PHYSICALLY_PRESENT
						);
					}}
					style={{
						cursor: "pointer",
						...(selected === PARTICIPANT_STATES.PHYSICALLY_PRESENT?
							selectedStyle
						:
							{}
						)
					}}
				>
					<StateIcon
						color={selected === PARTICIPANT_STATES.PHYSICALLY_PRESENT? getSecondary() : 'grey'}
						translate={translate}
						state={PARTICIPANT_STATES.PHYSICALLY_PRESENT}
						number={attendanceRecount.present}
					/>
				</div>
				{/* <div onClick={()=>{setSelected(PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE)}} style={{cursor: 'pointer', backgroundColor: selected === PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE && 'lightGrey'}}>
					<StateIcon translate={translate} state={PARTICIPANT_STATES.PRESENT_WITH_REMOTE_VOTE} number={attendanceRecount.presentWithElectronicVote} />
				</div> */}
				<div
					onClick={() => {
						setSelected(
							PARTICIPANT_STATES.DELEGATED
						);
					}}
					style={{
						cursor: "pointer",
						...(selected === PARTICIPANT_STATES.DELEGATED?
							selectedStyle
						:
							{}
						)
					}}
				>
					<StateIcon
						color={selected === PARTICIPANT_STATES.DELEGATED? getSecondary() : 'grey'}
						translate={translate}
						state={PARTICIPANT_STATES.DELEGATED}
						number={attendanceRecount.delegated}
					/>
				</div>
				<div
					onClick={() => {
						setSelected(
							PARTICIPANT_STATES.REPRESENTATED
						);
					}}
					style={{
						cursor: "pointer",
						...(selected === PARTICIPANT_STATES.REPRESENTATED?
							selectedStyle
						:
							{}
						)
					}}
				>
					<StateIcon
						translate={translate}
						color={selected === PARTICIPANT_STATES.REPRESENTATED? getSecondary() : 'grey'}
						state={PARTICIPANT_STATES.REPRESENTATED}
						number={attendanceRecount.representated}
					/>
				</div>
			</Grid>
		</React.Fragment>
	);
};

export default AttendanceHeader;