import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { Paper } from 'material-ui';
import { getSecondary } from '../../../styles/colors';
import { AlertConfirm, BasicButton, LoadingSection } from '../../../displayComponents';
import { councils } from '../../../queries';
import { COUNCIL_STATES } from '../../../constants';
import { ConfigContext } from '../../../containers/AppControl';
import CouncilDetails from '../display/CouncilDetails';
import { useOldState } from '../../../hooks';

const LoadFromPreviousCouncil = ({
	translate, data, council, ...props
}) => {
	const [state, setState] = useOldState({
		modal: false,
		council: null
	});

	const config = React.useContext(ConfigContext);

	const closeModal = () => {
		setState({
			modal: false
		});
	};

	const showCouncilDetails = newCouncil => {
		setState({
			council: newCouncil
		});
	};

	const closeCouncilDetails = () => {
		setState({
			council: null
		});
	};

	const loadFromCouncil = originCouncil => async () => {
		await props.loadFromPreviousCouncil({
			variables: {
				councilId: council.id,
				originId: originCouncil.id
			}
		});

		props.refetch();
		closeModal();
	};

	const showModal = () => {
		setState({
			modal: true
		});
	};

	const renderBody = () => {
		if (!data.loading && data.councils.length === 0) {
			return <span>{translate.no_celebrated_councils}</span>;
		}

		if (!data.councils) {
			return <LoadingSection />;
		}

		if (state.council) {
			return <CouncilDetails council={state.council} translate={translate} inIndex={true} />;
		}

		return (
			<div>
				{data.councils.list.map(item => (
					<Paper
						key={`loadFromCouncil_${item.id}`}
						style={{
							width: '100%',
							marginBottom: '0.6em',
							padding: '0.6em',
							cursor: 'pointer',
							display: 'flex',
							justifyContent: 'space-between'
						}}
						onClick={loadFromCouncil(item)}
					>
						<div className="truncate" style={{ width: '70%' }}>
							{item.name}
						</div>
						<BasicButton
							text={translate.read_details}
							type="flat"
							textStyle={{ color: getSecondary(), fontWeight: '700' }}
							onClick={event => {
								event.stopPropagation();
								showCouncilDetails(item);
							}}
						/>
					</Paper>
				))}
			</div>
		);
	};

	return (
		config.cloneCouncil ?
			<React.Fragment>
				<BasicButton
					text={translate.clone_council_btn}
					color={getSecondary()}
					textStyle={{
						color: 'white',
						fontWeight: '600',
						fontSize: '0.9em',
						textTransform: 'none'
					}}
					buttonStyle={{
						marginBottom: '0.6em'
					}}
					textPosition="after"
					onClick={showModal}
					icon={
						<i className="fa fa-clone" aria-hidden="true" style={{ marginLeft: '0.3em' }}></i>
					}
				/>
				<AlertConfirm
					requestClose={state.council ? closeCouncilDetails : closeModal}
					open={state.modal}
					hideAccept={!!state.council || data.loading || (!data.loading && data.councils.length === 0)}
					buttonAccept={translate.accept}
					buttonCancel={state.council ? translate.back : translate.cancel}
					bodyText={renderBody()}
					title={'Cargar una reunión pasada'/* TRADUCCION */}
				/>
			</React.Fragment>
			: <span />
	);
};

const loadFromPreviousCouncil = gql`
	mutation LoadFromPreviousCouncil($councilId: Int!, $originId: Int!){
		loadFromAnotherCouncil(councilId: $councilId, originId: $originId){
			success
			message
		}
	}
`;

const filterCouncilStates = state => (
	state !== COUNCIL_STATES.CANCELED
&& state !== COUNCIL_STATES.DRAFT
&& state !== COUNCIL_STATES.PRECONVENE
&& state !== COUNCIL_STATES.PREPARING
&& state !== COUNCIL_STATES.SAVED
);

export default compose(
	graphql(loadFromPreviousCouncil, { name: 'loadFromPreviousCouncil' }),
	graphql(councils, {
		options: props => ({
			variables: {
				state: Object.values(COUNCIL_STATES).filter(filterCouncilStates),
				companyId: props.company.id,
				isMeeting: false,
				active: 1
			},
			errorPolicy: 'all'
		})
	})
)(LoadFromPreviousCouncil);
