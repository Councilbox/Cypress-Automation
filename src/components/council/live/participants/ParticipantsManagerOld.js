import React from "react";

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
