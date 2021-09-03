import React from 'react';
import { withApollo } from 'react-apollo';
import BasicButton from './BasicButton';
import StateIcon from '../components/council/live/participants/StateIcon';
import { PARTICIPANT_STATES } from '../constants';
import { getSecondary } from '../styles/colors';
import AddRepresentativeModal from '../components/council/live/AddRepresentativeModal';
import SelectRepresentative from '../components/council/editor/census/modals/SelectRepresentative';
import { updateCouncilParticipant } from '../queries/councilParticipant';
import DropDownMenu from './DropDownMenu';


const DropdownRepresentative = ({
	client, participant, council, refetch, translate, ...props
}) => {
	const [state, setState] = React.useState({
		addRepresentative: false,
		selectRepresentative: false,
		representative: {}
	});

	// const addRepresentative = async (representative) => {
	// 	console.log(representative)
	// 	const response = await client.mutate({
	// 		mutation: updateCouncilParticipant,
	// 		variables: {
	// 			representative: representative,
	// 			participantId: participant.id
	// 		}
	// 	});

	// 	if(response.data.addRepresentative.success){
	// 		refetch()
	// 	}
	// }


	return (
		<>
			<DropDownMenu
				styleComponent={{
					marginTop: '1rem',
					border: '2px solid #a09aa0',
					borderRadius: '4px',
					padding: '.5rem',
					maxWidth: '50%',
					marginLeft: '.5em',
				}}
				Component={() => <div
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
					}}>
						<StateIcon
							translate={translate}
							state={PARTICIPANT_STATES.REPRESENTATED}
							color={getSecondary()}
							hideTooltip={true}
							styles={{ padding: '0em' }}
						/>
						<span>{participant.representative ? translate.change_representative : translate.add_representative}</span>
					</div>
					<div>
						<span style={{ fontSize: '1rem' }}>
							<i className="fa fa-caret-down" aria-hidden="true" />
						</span>
					</div>
				</div>
				}

				items={
					<div>
						<BasicButton
							type="flat"
							text={<div style={{ marginRight: '4em' }}>{translate.select_representative}</div>}
							onClick={() => { setState({ ...state, selectRepresentative: !state.selectRepresentative }); }}
							buttonStyle={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between'
							}}
							icon={<div style={{ display: 'flex', alignItems: 'center', color: getSecondary() }}>
								<StateIcon
									translate={translate}
									state={PARTICIPANT_STATES.REPRESENTATED}
									color={getSecondary()}
									hideTooltip={true}
									styles={{ padding: '0em' }}
								/>
								<i className="fa fa-chevron-right" aria-hidden="true"></i>

							</div>
							}
							textStyle={{
								color: 'black'
							}}
						/>
						<BasicButton
							type="flat"
							text={translate.add_representative}
							onClick={() => { setState({ ...state, addRepresentative: !state.addRepresentative }); }}
							buttonStyle={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between'
							}}
							icon={<div style={{ display: 'flex', alignItems: 'center', color: getSecondary() }}>
								<StateIcon
									translate={translate}
									state={PARTICIPANT_STATES.REPRESENTATED}
									color={getSecondary()}
									hideTooltip={true}
									styles={{ padding: '0em' }}
								/>
								<i className="fa fa-plus" aria-hidden="true"></i>

							</div>
							}
							textStyle={{
								color: 'black'
							}}
						/>
					</div>
				}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			/>

			<AddRepresentativeModal
				show={state.addRepresentative}
				council={council}
				participant={participant}
				refetch={refetch}
				requestClose={() => setState({ ...state, addRepresentative: false })
				}
				translate={translate}
			/>
			<SelectRepresentative
				open={state.selectRepresentative}
				council={council}
				translate={translate}
				updateRepresentative={representative => {
					// addRepresentative(representative)
				}}
				requestClose={() => setState({
					...state,
					selectRepresentative: false
				})}
			/>
		</>
	);
};

export default withApollo(React.memo(DropdownRepresentative));

