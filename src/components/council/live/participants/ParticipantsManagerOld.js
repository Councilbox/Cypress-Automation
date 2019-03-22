import React from "react";
import ReactDOM from "react-dom";
import {
	Grid,
	GridItem,
	SelectInput,
	CollapsibleSection,
	FilterButton,
} from "../../../../displayComponents";
import { getSecondary, getPrimary } from '../../../../styles/colors';
import { Paper, MenuItem } from "material-ui";
import ConveneContainer from "./sections/ConveneContainer";
import CredentialsContainer from "./sections/CredentialsContainer";
import AttendanceContainer from "./sections/AttendanceContainer";
import TypesContainer from "./sections/TypesContainer";
import FontAwesome from "react-fontawesome";
import { isMobile } from 'react-device-detect';


class ParticipantsManager extends React.Component {


	handleKeyPress = event => {
		const key = event.nativeEvent;
		if (key.altKey) {
			if (key.code === "KeyG") {
				this.setState({ addGuest: true });
			}
		}
	};

	

	

	
}

export default ParticipantsManager;
