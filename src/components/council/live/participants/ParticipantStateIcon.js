import React from 'react';
import FontAwesome from 'react-fontawesome';
import { Tooltip } from 'material-ui';
import { getSecondary } from '../../../../styles/colors';
import {
	getParticipantStateString,
	isRepresentative,
	participantIsGuest
} from '../../../../utils/CBX';

const mainIconSize = 1.75;
const subIconSize = 1;

const DoubleIcon = ({
	main,
	sub,
	subSize = subIconSize,
	subColor = getSecondary(),
	mainColor = getSecondary()
}) => (
		<div
			style={{
				position: 'relative',
				height: '2.5em',
				display: 'flex',
				alignItems: 'center',
				width: '2.75em',
				justifyContent: 'center'
			}}
		>
			<FontAwesome
				name={main}
				style={{
					margin: '0.5em',
					color: mainColor,
					fontSize: `${mainIconSize}em`
				}}
			/>
			<FontAwesome
				name={sub}
				style={{
					margin: '0.5em',
					color: subColor,
					fontSize: `${subSize}em`,
					position: 'absolute',
					top: `${mainIconSize - 0.25 - subSize}em`,
					right: 0
				}}
			/>
		</div>
	);

const IconSwitch = ({
	participant,
	translate,
	tooltip,
	isIntention,
	representative,
	noTooltip
}) => {
	let state;
	if (!isIntention) {
		state = getParticipantStateString(participant.state);
	} else {
		state = getParticipantStateString(participant.live.assistanceIntention);
	}
	const secondary = getSecondary();
	let tooltipValue;
	let icon;

	switch (state) {
		case 'REMOTE':
			tooltipValue = `${
				representative ? translate.representative + ' - ' : ''
			}${
				tooltip === 'change'
					? translate.change_to_remote
					: translate.remote_assistance
			}`;
			icon = (
				<FontAwesome
					name={'globe'}
					style={{
						margin: '0.5em',
						color: secondary,
						fontSize: `${mainIconSize}em`
					}}
				/>
			);
			break;

		case 'PRESENT':
			tooltipValue = `${
				representative ? translate.representative + ' - ' : ''
			}${
				tooltip === 'change'
					? translate.change_to_present
					: translate.physically_present_assistance
			}`;
			icon = (
				<FontAwesome
					name={'user'}
					style={{
						margin: '0.5em',
						color: secondary,
						fontSize: `${mainIconSize}em`
					}}
				/>
			);
			break;

		case 'REPRESENTATED':
			tooltipValue = `${
				representative ? translate.representative + ' - ' : ''
			}${
				tooltip === 'change'
					? translate.add_representative
					: translate.representated
			}`;
			icon = <DoubleIcon main={'user-o'} sub={'user'} />;
			break;

		case 'DELEGATED':
			tooltipValue = `${
				representative ? translate.representative + ' - ' : ''
			}${
				tooltip === 'change'
					? translate.to_delegate_vote
					: translate.delegated
			}`;

			icon = (
				<DoubleIcon
					main={'user'}
					sub={'user'}
					mainColor={getSecondary()}
				/>
			);
			break;

		case 'PHYSICALLY_PRESENT':
			tooltipValue = `${
				representative ? translate.representative + ' - ' : ''
			}${
				tooltip === 'change'
					? translate.change_to_present
					: translate.physically_present_assistance
			}`;
			icon = (
				<FontAwesome
					name={'user'}
					style={{
						margin: '0.5em',
						color: secondary,
						fontSize: `${mainIconSize}em`
					}}
				/>
			);
			break;

		case 'NO_PARTICIPATE':
			tooltipValue = `${
				representative ? translate.representative + ' - ' : ''
			}${
				tooltip === 'change'
					? translate.change_to_no_participate
					: translate.no_assist_assistance
			}`;

			icon = <DoubleIcon main={'user-o'} sub={'times'} />;
			break;

		case 'PRESENT_WITH_REMOTE_VOTE':
			tooltipValue = `${
				representative ? translate.representative + ' - ' : ''
			}${
				tooltip === 'change'
					? translate.change_to_present_with_remote_vote
					: translate.physically_present_with_remote_vote
			}`;

			icon = <DoubleIcon main={'user-o'} sub={'mobile'} subSize={1.75} />;

			break;

		default:
			tooltipValue = translate.not_confirmed_assistance;
			icon = (
				<FontAwesome
					name={'question'}
					style={{
						margin: '0.5em',
						color: secondary,
						fontSize: `${mainIconSize}em`
					}}
				/>
			);
	}

	if (noTooltip) {
		return icon;
	}
	return (
		<Tooltip title={tooltipValue}>
			<div>{icon}</div>
		</Tooltip>
	);
};

const ParticipantStateIcon = ({
	participant,
	translate,
	tooltip,
	isIntention,
	noTooltip
}) => {
	if (participantIsGuest(participant)) {
		return (
			<Tooltip title={translate.guest}>
				<div>
					<DoubleIcon main={'user-o'} sub={'eye'} />
				</div>
			</Tooltip>
		);
	}

	if (isRepresentative(participant)) {
		return (
			<IconSwitch
				participant={participant}
				translate={translate}
				tooltip={tooltip}
				noTooltip={noTooltip}
				isIntention={isIntention}
				representative
			/>
		);
	}

	return (
		<IconSwitch
			participant={participant}
			translate={translate}
			tooltip={tooltip}
			noTooltip={noTooltip}
			isIntention={isIntention}
		/>
	);
};

export default ParticipantStateIcon;
