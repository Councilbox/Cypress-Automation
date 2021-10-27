/* eslint-disable no-loop-func */
import gql from 'graphql-tag';
import React from 'react';
import { withApollo } from 'react-apollo';
import { bHistory } from '../../../../containers/App';
import { AlertConfirm, BasicButton } from '../../../../displayComponents';
import StatusIcon from '../../../../displayComponents/StatusIcon';
import { getPrimary } from '../../../../styles/colors';
import { createCouncil as createMutation } from '../../../create/CreateCouncil';


const CloneCouncilRoot = ({ council, translate, client }) => {
	const [modal, setModal] = React.useState(false);
	const [status, setStatus] = React.useState('IDDLE');
	const newCouncilId = React.useRef(null);
	const [steps, setSteps] = React.useState([
		{
			text: 'Crear nueva reunión',
			status: 'IDDLE',
			action: 'createCouncil'
		}, {
			text: 'Clonar datos de la reunión',
			status: 'IDDLE',
			action: 'cloneAnotherCouncil'
		}
	]);

	const createCouncil = async () => {
		const response = await client.mutate({
			mutation: createMutation,
			variables: {
				companyId: council.companyId
			}
		});

		newCouncilId.current = response.data.createCouncil.id;
		return response;
	};

	const cloneAnotherCouncil = async () => {
		return client.mutate({
			mutation: gql`
				mutation LoadFromPreviousCouncil($councilId: Int!, $originId: Int!){
					loadFromAnotherCouncil(councilId: $councilId, originId: $originId){
						success
						message
					}
				}
			`,
			variables: {
				councilId: newCouncilId.current,
				originId: council.id
			}
		});
	};

	const actions = {
		createCouncil,
		cloneAnotherCouncil
	};

	const cloneCouncil = async () => {
		setStatus('LOADING');

		let i = 0;
		do {
			const step = steps[i];

			if (step.status !== 'DONE') {
				setSteps(oldSteps => {
					oldSteps[i].status = 'LOADING';
					return [...oldSteps];
				});


				// eslint-disable-next-line no-await-in-loop
				const response = await actions[step.action]();

				console.log(response);

				setSteps(oldSteps => {
					oldSteps[i].status = 'DONE';
					return [...oldSteps];
				});
			}
			i++;
		} while (i < steps.length);

		setStatus('FINISHED');
	};

	return (
		<>
			<BasicButton
				text="Clonar esta reunión"
				onClick={() => setModal(true)}
				color="white"
				type="flat"
				textStyle={{
					color: getPrimary(),
					fontWeight: '700'
				}}
				buttonStyle={{
					marginRight: '1em',
					border: `1px solid ${getPrimary()}`
				}}
			/>
			<AlertConfirm
				open={modal}
				requestClose={() => setModal(false)}
				hideAccept={status === 'LOADING'}
				acceptAction={() => {
					if (status === 'IDDLE') {
						cloneCouncil();
					}

					if (status === 'FINISHED') {
						bHistory.push(`/council/${newCouncilId.current}`);
					}
				}}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				title={'Clonar reunión'}
				bodyText={
					<>
						{status === 'IDDLE' &&
							'Esto creará una nueva reunión y clonará los datos de esta en la nueva'
						}
						{status === 'LOADING' &&
							steps.map(step => (
								<div key={step.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
									<div>
										{step.text}
									</div>
									<div>
										<StatusIcon status={step.status} />
									</div>
								</div>
							))
						}
						{status === 'FINISHED' &&
							'Reunión clonada desea ir a la nueva reunión?'
						}
					</>
				}
			/>
		</>
	);
};

export default withApollo(CloneCouncilRoot);
