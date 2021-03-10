import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { DatePicker } from 'material-ui';
import {
	Grid,
	GridItem,
	LoadingSection,
	AlertConfirm,
	DateTimePicker
} from '../../../displayComponents';
import { getSecondary } from '../../../styles/colors';
import { isMobile } from '../../../utils/screen';
import withWindowSize from '../../../HOCs/withWindowSize';

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
	const checkParticipantIsRegistered = async () => {
		const response = await client.query({
			query: gql`
				query checkParticipantIsRegisteredClavePin($dni: String!){
					checkParticipantIsRegisteredClavePin(dni: $dni) {
						success
						message
					}
				}
			`,
			variables: {
				dni: participant.dni
			}
		});

		if (response.data?.checkParticipantIsRegisteredClavePin) {
			const { success } = response.data?.checkParticipantIsRegisteredClavePin;

			if (success) {
				validateParticipant();
			} else {
				setPinError('El usuario no está de alta');
			}
		}

		console.log(response);
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
						<div style={{ width: '3em', color: disabled ? 'grey' : getSecondary() }}>
							icon?
						</div>
						<div style={{
							display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: disabled ? 'grey' : getSecondary()
						}}>
							<span style={{ fontSize: '0.9em' }}>Validar estado de alta</span>
						</div>
					</div>
				</Action>
			</GridItem>
		</Grid>
	);
};

export default withWindowSize(withApollo(CheckParticipantRegisteredClavePin));
