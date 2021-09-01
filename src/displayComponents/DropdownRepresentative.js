import React from 'react';
import { Collapse } from 'material-ui';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import BasicButton from './BasicButton';
import StateIcon from '../components/council/live/participants/StateIcon';
import { PARTICIPANT_STATES } from '../constants';
import { getSecondary } from '../styles/colors';
import AddRepresentativeModal from '../components/council/live/AddRepresentativeModal';
import * as CBX from '../utils/CBX';
import SelectRepresentative from '../components/council/editor/census/modals/SelectRepresentative';
import { addRepresentative as addRepresentativeMutation } from '../queries';


const DropdownRepresentative = ({
	participant, council, refetch, translate, ...props
}) => {
	const [state, setState] = React.useState({
		collapse: false,
		addRepresentative: false,
		selectRepresentative: false,
		representative: {}
	});

	const addRepresentative = async () => {
		const response = await props.addRepresentative({
			variables: {
				representative: state.representative,
				participantId: participant.id
			}
		});
		if (response.data.addRepresentative) {
			if (response.data.addRepresentative.success) {
				props.refetch();
			}
		}
		if (response.errors) {
			if (response.errors[0].message === 'Email already used') {
				setState({
					errors: {
						email: translate.repeated_email
					}
				});
			}
		}
	};

	return (
		<>
			<div style={{
				marginTop: '1rem',
				border: '2px solid #a09aa0',
				borderRadius: '4px',
				padding: '.5rem',
				maxWidth: '50%'
			}}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						cursor: 'pointer',
						color: 'black'
					}}
					onClick={() => setState({ ...state, collapse: !state.collapse })}
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
						<span style={{ fontSize: '2rem' }}>
							<i className="fa fa-caret-down" aria-hidden="true" style={{ transform: state.collapse ? 'rotate(180deg)' : '', transition: 'all' }}></i>
						</span>
					</div>
				</div>
				<Collapse in={state.collapse}>
					<div>
						<BasicButton
							type="flat"
							text={translate.select_representative}
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
						<div style={{ border: `1px solid ${getSecondary()}` }} />
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
				</Collapse>
			</div>

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
				updateRepresentative={ representative => {
					setState({
						...state,
						representative: {
							...state.representative,
							...representative
						}
					});
				}}
				requestClose={() => setState({
					...state,
					selectRepresentative: false
				})}
			/>
		</>
	);
};

export default compose(
	graphql(addRepresentativeMutation, {
		name: 'addRepresentative',
		options: {
			errorPolicy: 'all'
		}
	})
)(DropdownRepresentative);

