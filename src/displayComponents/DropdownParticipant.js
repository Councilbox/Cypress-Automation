import React from 'react';
import BasicButton from './BasicButton';
import StateIcon from '../components/council/live/participants/StateIcon';
import { PARTICIPANT_STATES } from '../constants';
import { getSecondary } from '../styles/colors';
import AddConvenedParticipantModal from '../components/council/prepare/modals/AddConvenedParticipantModal';
import { isMobile } from '../utils/screen';
import ButtonIcon from './ButtonIcon';
import AddGuestModal from '../components/council/live/participants/AddGuestModal';
import DropDownMenu from './DropDownMenu';
import { councilIsFinished } from '../utils/CBX';

const DropdownParticipant = ({
	participations, council, refetch, translate, style
}) => {
	const [state, setState] = React.useState({
		add: false,
		guest: false,
	});

	return (
		<>
			<DropDownMenu
				styleComponent={{
					width: '',
					maxWidth: '100%',
					border: '2px solid #a09aa0',
					borderRadius: '4px',
					padding: '0.5rem',
					...style
				}}
				Component={() =>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
							cursor: 'pointer',
							color: 'black'
						}}
					>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							fontSize: '.9rem'
						}}>
							<StateIcon
								translate={translate}
								state={PARTICIPANT_STATES.REPRESENTATED}
								color={getSecondary()}
								hideTooltip={true}
								styles={{ padding: '0em' }}
							/>
							<span>{translate.add}</span>
						</div>
						<div>
							<span style={{ fontSize: '1rem' }}>
								<i className="fa fa-caret-down" aria-hidden="true"/>
							</span>
						</div>
					</div>
				}
				items={
					<div>
						<BasicButton
							type="flat"
							text={translate.add_participant}
							disabled={councilIsFinished(council)}
							textPosition="after"
							icon={!isMobile ? <ButtonIcon type="add" color={getSecondary()} /> : null}
							onClick={() => setState({ ...state, add: !state.add })}
							color={'white'}

							buttonStyle={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between'
							}}
						/>
						<BasicButton
							text={isMobile ? translate.invite_guest : translate.add_guest}
							color={'white'}
							type="flat"
							icon={<ButtonIcon type="add" color={getSecondary()} />}
							onClick={() => setState({ ...state, guest: !state.guest })}
							buttonStyle={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between'
							}}
						/>
					</div>
				}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			/>

			<AddConvenedParticipantModal
				modal={state.add}
				requestClose={() => setState({ ...state, add: !state.add })}
				participations={participations}
				translate={translate}
				councilId={council.id}
				council={council}
				refetch={refetch}
			/>

			<AddGuestModal
				show={state.guest}
				council={council}
				refetch={refetch}
				requestClose={() => setState({ ...state, guest: !state.guest })}
				translate={translate}
			/>
		</>
	);
};

export default DropdownParticipant;

