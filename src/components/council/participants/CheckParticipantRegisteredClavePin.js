import React from 'react';
import { withApollo } from 'react-apollo';
import {
	Grid,
	GridItem,
	LoadingSection
} from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';
import withWindowSize from '../../../HOCs/withWindowSize';
import { ReactComponent as ValidateIcon } from '../../../assets/img/validate-participant-icon.svg';
import useClaveJusticia from '../../../hooks/claveJusticia';


const Action = ({
	children, loading, onClick, disabled = false, styles
}) => (
	<div
		style={{
			display: 'flex',
			alignItems: 'center',
			height: '37px',
			borderRadius: '4px',
			border: `solid 1px ${disabled ? 'grey' : getSecondary()}`,
			padding: isMobile ? '0.3em 0.3em' : '0.3em 1.3em',
			cursor: disabled ? 'auto' : 'pointer',
			marginRight: '0.5em',
			marginBottom: isMobile && '0.5em',
			...styles
		}}
		onClick={!disabled ? onClick : () => { }}
	>
		{loading ? (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<LoadingSection size={20} />
			</div>
		) : (
			children
		)}
	</div>
);


const CheckParticipantRegisteredClavePin = ({
	translate,
	disabled,
	client,
	validateParticipant,
	setPinError,
	participant,
	windowSize
}) => {
	const secondary = getSecondary();
	const { checkUserIsRegistered } = useClaveJusticia({
		client
	});

	const checkParticipantIsRegistered = async () => {
		if (!participant.dni || participant.dni.length < 9) {
			return setPinError(translate.invalid_dni);
		}
		const result = await checkUserIsRegistered(participant.dni);

		if (result.success) {
			validateParticipant();
		} else {
			setPinError(result.message || translate.participant_not_registered);
		}
	};

	return (
		<Grid>
			<GridItem xs={12} lg={12} md={12} style={{ display: isMobile && windowSize === 'xs' ? '' : 'flex' }}>
				<Action
					onClick={checkParticipantIsRegistered}
				>
					<div
						style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}
					>
						<div style={{ width: '3em', color: disabled ? 'grey' : secondary }}>
							<ValidateIcon fill={secondary} />
						</div>
						<div style={{
							display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: disabled ? 'grey' : secondary
						}}>
							<span style={{ fontSize: '0.9em' }}>{translate.validate_participant_data}</span>
						</div>
					</div>
				</Action>
			</GridItem>
		</Grid>
	);
};

export default withWindowSize(withApollo(CheckParticipantRegisteredClavePin));
