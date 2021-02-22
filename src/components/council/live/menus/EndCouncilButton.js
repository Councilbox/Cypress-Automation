import React from 'react';
import { withApollo } from 'react-apollo';
import { endCouncil as endCouncilMutation } from '../../../../queries/council';
import { AlertConfirm, BasicButton, Icon, LoadingSection } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { bHistory } from '../../../../containers/App';
import { CouncilActData } from '../../writing/actEditor/ActEditor';
import { buildDoc } from '../../../documentEditor/utils';
import { ConfigContext } from '../../../../containers/AppControl';
import { approveAct, updateCouncilAct } from '../../../../queries';
import { CouncilLiveContext } from '../../../../containers/CouncilLiveContainer';
import { sendAct } from '../../writing/actEditor/SendActPage';

const buildFinishSteps = council => {
	const steps = [{
		name: 'finish_council',
		action: 'endCouncil',
		status: 'IDDLE'
	}];

	if (council.statute.existsAct && council.statute.autoApproveAct) {
		steps.push({
			name: 'auto_approve_act',
			action: 'autoApproveAct',
			status: 'IDDLE'
		});

		if (council.statute.autoSendAct) {
			steps.push({
				name: 'auto_send_act',
				action: 'autoSendAct',
				status: 'IDDLE'
			});
		}
	}
	return steps;
};

const EndCouncilButton = ({ client, council, translate, ...props }) => {
	const [confirmModal, setConfirmModal] = React.useState(false);
	const [steps, setSteps] = React.useState(buildFinishSteps(council));
	const [loading, setLoading] = React.useState(false);
	const config = React.useContext(ConfigContext);
	const councilLiveContext = React.useContext(CouncilLiveContext);
	const primary = getPrimary();
	const secondary = getSecondary();
	const unclosed = props.unclosedAgendas;

	const endCouncil = async () => {
		await client.mutate({
			mutation: endCouncilMutation,
			variables: {
				councilId: council.id
			}
		});
	};

	const autoApproveAct = async () => {
		const response = await client.query({
			query: CouncilActData,
			variables: {
				councilID: council.id,
				companyId: council.companyId,
				options: {
					limit: 10000,
					offset: 0
				}
			}
		});

		const document = {
			fragments: buildDoc(response.data, translate, 'act'),
			options: {
				stamp: !config.disableDocumentStamps,
				doubleColumn: response.data.council.statute.doubleColumnDocs === 1,
				language: response.data.council.language,
				secondaryLanguage: 'en'
			}
		};

		await client.mutate({
			mutation: updateCouncilAct,
			variables: {
				councilAct: {
					document,
					councilId: council.id
				}
			}
		});

		await client.mutate({
			mutation: approveAct,
			variables: {
				councilId: council.id,
				closeCouncil: false
			}
		});
	};

	const autoSendAct = async () => {
		await client.mutate({
			mutation: sendAct,
			variables: {
				councilId: council.id,
				group: 'convened'
			}
		});
	};

	const actions = {
		endCouncil,
		autoApproveAct,
		autoSendAct
	};

	const startEndCouncilProcess = async () => {
		setLoading(true);
		councilLiveContext.disableCouncilStateCheck(true);
		for (let i = 0; i < steps.length; i += 1) {
			const step = steps[i];

			setSteps(oldSteps => {
				oldSteps[i].status = 'LOADING';
				return [...oldSteps];
			});

			// eslint-disable-next-line no-await-in-loop
			await actions[step.action]();

			setSteps(oldSteps => {
				oldSteps[i].status = 'DONE';
				return [...oldSteps];
			});
		}

		bHistory.push(
			`/company/${council.companyId}/council/${council.id
			}/finished`
		);
		councilLiveContext.disableCouncilStateCheck(false);
		setLoading(false);
	};

	const renderBody = () => {
		if (!loading) {
			return (
				<React.Fragment>
					{unclosed.length > 0 ? (
						<React.Fragment>
							<div>{translate.unclosed_points_desc}</div>
							<ul>
								{unclosed.map(agenda => (
									<li
										key={`unclosed${agenda.id}`}
									>
										{agenda.agendaSubject}
									</li>
								))}
							</ul>
						</React.Fragment>
					) : (
						<div>{translate.council_will_be_end}</div>
					)}
				</React.Fragment>
			);
		}

		return (
			<>
				{steps.map(step => (
					<div style={{ width: '90%', display: 'flex', justifyContent: 'space-between' }} key={`step_${step.name}`}>
						<div>
							{translate[step.name]}
						</div>
						<div>
							{step.status === 'LOADING'
								&& <LoadingSection size={14} />
							}
							{step.status === 'DONE'
								&& <i className="fa fa-check" style={{ color: 'green' }}></i>
							}
						</div>
					</div>

				))}
			</>
		);
	};

	return (
		<React.Fragment>
			<div>
				<BasicButton
					text={translate.finish_council}
					id={'finalizarReunionEnReunion'}
					color={unclosed.length === 0 ? primary : secondary}
					onClick={() => setConfirmModal(true)}
					textPosition="before"
					icon={
						<Icon
							className="material-icons"
							style={{
								fontSize: '1.1em',
								color: 'white'
							}}
						>
							play_arrow
						</Icon>
					}
					open={this.state.confirmModal}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					modal={true}
					acceptAction={this.endCouncil}
					requestClose={() => this.setState({ confirmModal: false })}
				/>
			</div>
			<AlertConfirm
				title={translate.finish_council}
				bodyText={renderBody()}
				open={confirmModal}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={startEndCouncilProcess}
				requestClose={() => setConfirmModal(false)}
			/>
		</React.Fragment>
	);
};

export default withApollo(EndCouncilButton);
