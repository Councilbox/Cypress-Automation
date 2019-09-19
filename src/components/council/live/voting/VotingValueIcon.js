import React from "react";
import { VOTE_VALUES } from "../../../../constants";
import { getSecondary } from "../../../../styles/colors";
import FontAwesome from "react-fontawesome";

const VotingValueIcon = ({ vote, color, fixed }) => {
	if(fixed){
		console.log(vote);
	}

	switch (vote) {
		case VOTE_VALUES.NO_VOTE:
			return (
				<FontAwesome
					name={"circle"}
					style={{
						margin: "0.5em",
						color: !!color ? color : "grey",
						fontSize: "1em"
					}}
				/>
			);

		case VOTE_VALUES.NEGATIVE:
			return (
				<FontAwesome
					name={"times"}
					style={{
						margin: "0.5em",
						color: !!color ? color : "red",
						fontSize: "1em"
					}}
				/>
			);

		case VOTE_VALUES.POSITIVE:
			return (
				<FontAwesome
					name={"check"}
					style={{
						margin: "0.5em",
						color: !!color ? color : "green",
						fontSize: "1em"
					}}
				/>
			);

		case VOTE_VALUES.ABSTENTION:
			return (
				<FontAwesome
					name={"circle-o"}
					style={{
						margin: "0.5em",
						color: !!color ? color : getSecondary(),
						fontSize: "1em"
					}}
				/>
			);
		default:
			return <div />;
	}
};

export default VotingValueIcon;
