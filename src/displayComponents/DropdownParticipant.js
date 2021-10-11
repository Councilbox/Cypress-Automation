import React from 'react';
import BasicButton from './BasicButton';
import StateIcon from '../components/council/live/participants/StateIcon';
import { PARTICIPANT_STATES, PARTICIPANT_VALIDATIONS } from '../constants';
import { getSecondary } from '../styles/colors';
import AddConvenedParticipantButton from '../components/council/prepare/modals/AddConvenedParticipantButton';
import ButtonIcon from './ButtonIcon';
import AddGuestModal from '../components/council/live/participants/AddGuestModal';
import DropDownMenu from './DropDownMenu';
import { councilIsFinished } from '../utils/CBX';
import AddTranslatorModal from '../components/council/live/participants/addTranslatorModal';
import AddCouncilParticipantButton from '../components/council/editor/census/modals/AddCouncilParticipantButton';

const DropdownParticipant = ({
	participations, addCouncil, council, refetch, disabled, translate, style, addTranslator
}) => {
	const [state, setState] = React.useState({
		add: false,
		guest: false,
		translator: false,
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
				Component={() => <div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						cursor: 'pointer',
						color: 'black',
						width: '100%',
						height: '100%',
					}}
				>
					<div style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}>
						<div style={{
							fontSize: '.75em'
						}}>
							<StateIcon
								translate={translate}
								state={PARTICIPANT_STATES.REPRESENTATED}
								color={getSecondary()}
								hideTooltip={true}
							/>
						</div>
						<span>{translate.add}</span>
					</div>
					<div>
						<span style={{ fontSize: '1em' }}>
							<i className="fa fa-caret-down" aria-hidden="true" />
						</span>
					</div>
				</div>
				}
				items={
					<div>
						<BasicButton
							type="flat"
							text={translate.add_participant}
							disabled={councilIsFinished(council) || disabled}
							icon={<ButtonIcon type="add" color={getSecondary()} />}
							onClick={() => setState({ ...state, add: !state.add })}
							color={'white'}
							buttonStyle={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between'
							}}
						/>
						<BasicButton
							text={translate.add_guest}
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
						{addTranslator && <BasicButton
							text={translate.add_translator}
							color={'white'}
							type="flat"
							icon={<ButtonIcon type="add" color={getSecondary()} />}
							onClick={() => setState({ ...state, translator: !state.translator })}
							buttonStyle={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between'
							}}
						/>}
					</div>
				}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			/>

			<AddCouncilParticipantButton
				buttonAdd={false}
				modal={state.add && addCouncil}
				validateBeforeCreate={council.statute.participantValidation !== PARTICIPANT_VALIDATIONS.NONE}
				requestClose={() => setState({ ...state, add: !state.add })}
				participations={participations}
				council={council}
				refetch={refetch}
			/>

			<AddConvenedParticipantButton
				buttonAdd={false}
				modal={state.add && !addCouncil}
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

			<AddTranslatorModal
				show={state.translator}
				council={council}
				refetch={refetch}
				requestClose={() => setState({ ...state, translator: !state.translator })}
				translate={translate}
			/>
		</>
	);
};

export default DropdownParticipant;

