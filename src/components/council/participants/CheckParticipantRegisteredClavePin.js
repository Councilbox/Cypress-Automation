import React from 'react';
import { withApollo } from 'react-apollo';
import {
	BasicButton,
	Grid,
	GridItem
} from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';
import withWindowSize from '../../../HOCs/withWindowSize';
import { ReactComponent as ValidateIcon } from '../../../assets/img/validate-participant-icon.svg';
import useClaveJusticia from '../../../hooks/claveJusticia';


const CheckParticipantRegisteredClavePin = ({
	translate,
	disabled,
	client,
	validateParticipant,
	setPinError,
	participant,
	windowSize
}) => {
	const [loading, setLoading] = React.useState(false);
	const secondary = getSecondary();
	const { checkUserIsRegistered } = useClaveJusticia({
		client
	});

	const checkParticipantIsRegistered = async () => {
		if (!participant.dni || participant.dni.length < 9) {
			return setPinError(translate.invalid_dni);
		}

		setLoading(true);
		const result = await checkUserIsRegistered(participant.dni);

		setLoading(false);
		if (result.success) {
			validateParticipant();
		} else {
			setPinError(result.message || translate.participant_not_registered);
		}
	};

	return (
		<Grid>
			<GridItem xs={12} lg={12} md={12} style={{ display: isMobile && windowSize === 'xs' ? '' : 'flex' }}>
				<BasicButton
					onClick={checkParticipantIsRegistered}
					icon={<ValidateIcon fill={secondary} style={{ height: '18px' }} />}
					text={translate.clave_justicia_check_participant_registration}
					loading={loading}
					disabled={disabled}
					color="white"
					textStyle={{
						color: secondary
					}}
					loadingColor={secondary}
					buttonStyle={{
						border: `1px solid ${secondary}`
					}}
				/>
			</GridItem>
		</Grid>
	);
};

export default withWindowSize(withApollo(CheckParticipantRegisteredClavePin));
