import React from 'react';
import { BasicButton } from '../../../../displayComponents';
import { getSecondary } from '../../../../styles/colors';
import SignatureModal from './modals/SignatureModal';

const SignatureButton = ({
	participant, translate, council, refetch
}) => {
	const [modal, setModal] = React.useState(false);
	const secondary = getSecondary();

	return (
		<React.Fragment>
			<SignatureModal
				show={modal}
				council={council}
				participant={participant}
				refetch={refetch}
				requestClose={() => setModal(false)}
				translate={translate}
			/>
			<BasicButton
				text={participant.signed ? translate.user_signed : translate.to_sign}
				fullWidth
				buttonStyle={{
					borderRadius: '4px',
					marginRight: '10px',
					width: '150px',
					border: `1px solid ${secondary}`,
					padding: '1em',
				}}
				type="flat"
				color={participant.signed ? secondary : 'white'}
				onClick={() => setModal(true)}
				textStyle={{ color: participant.signed ? 'white' : secondary }}
			/>
		</React.Fragment>

	);
};

export default SignatureButton;
