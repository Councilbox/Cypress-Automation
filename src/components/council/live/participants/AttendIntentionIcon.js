import React from "react";
import { Icon } from "../../../../displayComponents";
import FontAwesome from "react-fontawesome";
import { Tooltip } from "material-ui";
import { getPrimary } from "../../../../styles/colors";

const AttendIntentionIcon = ({ participant, translate, size = "1.3em" }) => {
	const primary = getPrimary();

	if (participant.assistanceLastDateConfirmed) {
		switch (participant.assistanceIntention) {
			case 0:
				return (
					<Tooltip title={`${translate.remote_assistance_short}`}>
						<FontAwesome
							name={"globe"}
							style={{
								margin: "0.5em",
								color: primary,
								fontSize: size
							}}
						/>
					</Tooltip>
				);

			case 5:
				return (
					<Tooltip title={translate.confirmed_assistance}>
						<FontAwesome
							name={"user"}
							style={{
								margin: "0.5em",
								color: primary,
								fontSize: size
							}}
						/>
					</Tooltip>
				);

			case 6:
				return (
					<Tooltip title={translate.no_assist_assistance}>
						<FontAwesome
							name={"times"}
							style={{
								margin: "0.5em",
								color: primary,
								fontSize: size
							}}
						/>
					</Tooltip>
				);
		}
	}

	return (
		<Tooltip title={translate.not_confirmed_assistance}>
			<FontAwesome
				name={"question"}
				style={{
					margin: "0.5em",
					color: primary,
					fontSize: size
				}}
			/>
		</Tooltip>
	);
};

export default AttendIntentionIcon;
