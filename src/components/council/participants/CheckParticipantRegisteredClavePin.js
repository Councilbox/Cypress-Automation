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
	const [modal, setModal] = React.useState(false);
	const [code, setCode] = React.useState(null);

	const checkParticipantIsRegistered = async () => {
		const response = await client.query({
			query: gql`
				query checkParticipantIsRegisteredClavePin($dni: String!, $code: String!){
					checkParticipantIsRegisteredClavePin(dni: $dni, code: $code) {
						success
						message
					}
				}
			`,
			variables: {
				dni: participant.dni,
				code
			}
		});

		if (response.data?.checkParticipantIsRegisteredClavePin) {
			const { success } = response.data?.checkParticipantIsRegisteredClavePin;

			if (success) {
				validateParticipant();
				setModal(false);
			} else {
				setPinError('El usuario no está de alta');
				setModal(false);
			}
		}

		console.log(response);
	};

	return (
		<Grid>
			<AlertConfirm
				open={modal}
				title={'Comprobar alta clave pin'}
				requestClose={() => setModal(false)}
				buttonAccept={translate.send}
				acceptAction={checkParticipantIsRegistered}
				bodyText={
					<>
						Introduzca la Fecha de Validez de su DNI (o Fecha de Expedición si es un DNI Permanente)
						<DateTimePicker
							onlyDate={true}
							format={'l'}
							value={code}
							onChange={date => {
								let dateString = null;
								if (date) {
									const newDate = new Date(date);
									dateString = newDate.toISOString();
								}
								setCode(dateString);
							}}
						/>
					</>
				}
			/>
			<GridItem xs={12} lg={12} md={12} style={{ display: isMobile && windowSize === 'xs' ? '' : 'flex' }}>
				<Action
					onClick={() => setModal(true)}
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
