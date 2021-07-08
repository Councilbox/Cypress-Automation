import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	Card, Table, TableBody, TableRow, TableHead, TableCell
} from 'material-ui';
import {
	LoadingSection, CollapsibleSection, BasicButton, Scrollbar, TextInput, Grid, PaginationFooter
} from '../../../displayComponents';
import withTranslations from '../../../HOCs/withTranslations';
import { lightGrey, getSecondary, secondary } from '../../../styles/colors';
import CouncilItem from './CouncilItem';
import CouncilsSectionTrigger from './CouncilsSectionTrigger';
import { bHistory } from '../../../containers/App';


const corporationConvenedCouncils = gql`
	query corporationConvenedCouncils($options: OptionsInput){
		corporationConvenedCouncils(options: $options){
			list{
				id
				name
				state
				dateStart
				councilType
				prototype
				participants {
					id
				}
				company{
					id
					businessName
				}
			}
			total
		}
	}
`;

const corporationLiveCouncils = gql`
	query corporationLiveCouncils($options: OptionsInput){
		corporationLiveCouncils(options: $options){
			list{
				id
				name
				state
				dateStart
				councilType
				prototype
				participants {
					id
				}
				company{
					id
					businessName
				}
			}
			total
		}
	}
`;

const CouncilDetailsRoot = gql`
	query CouncilDetailsRoot($id: Int!){
		council(id: $id) {
			id
		}
	}
`;


const CouncilsDashboard = ({ translate, client }) => {
	const convenedTrigger = () => (
		<CouncilsSectionTrigger
			text={translate.companies_calendar}
			icon={'calendar-o'}
			description={translate.companies_calendar_desc}
		/>
	);

	const convenedSection = () => (
		<Councils
			translate={translate}
			client={client}
			query={corporationConvenedCouncils}
		/>
	);

	const celebrationTrigger = () => (
		<CouncilsSectionTrigger
			text={translate.companies_live}
			icon={'users'}
			description={translate.companies_live_desc}
		/>
	);

	const celebrationSection = () => (
		<Councils
			translate={translate}
			client={client}
			query={corporationLiveCouncils}
		/>
	);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				backgroundColor: lightGrey
			}}
		>
			<Scrollbar>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
						margin: '1.4em'
					}}
				>
					<BasicButton
						text={'KPI'}
						color="white"
						onClick={() => bHistory.push('/kpi')}
						buttonStyle={{
							border: `1px solid ${secondary}`
						}}
					/>
				</div>
				<SearchCouncils />
				<Card style={{ margin: '1.4em' }}>
					<CollapsibleSection trigger={convenedTrigger} collapse={convenedSection} />
				</Card>
				<Card style={{ margin: '1.4em' }}>
					<CollapsibleSection trigger={celebrationTrigger} collapse={celebrationSection} />
				</Card>


			</Scrollbar>
		</div>
	);
};


const Councils = ({ translate, client, query }) => {
	const [councils, setCouncils] = React.useState([]);
	const [loading, setLoading] = React.useState(true);
	const [pageCouncils, setpageCouncils] = React.useState(1);


	const getDataCouncils = React.useCallback(async () => {
		setLoading(true);
		const response = await client.query({
			query,
			variables: {
				options: {
					limit: 10,
					offset: (pageCouncils - 1) * 10
				},
			},
		});

		if (response.data) {
			Object.entries(response.data).forEach(([name, value]) => {
				if (name === 'corporationLiveCouncils' || name === 'corporationConvenedCouncils') {
					setCouncils(value);
				}
			});
			setLoading(false);
		}
	}, [pageCouncils]);

	React.useEffect(() => {
		getDataCouncils();
	}, [getDataCouncils]);


	return (
		<div style={{ padding: '1em' }}>
			<BasicButton
				backgroundColor={{ backgroundColor: 'white', border: `1px solid ${getSecondary()}`, boxShadow: 'none' }}
				icon={
					<i
						className={'fa fa-refresh'}
						style={{
							color: getSecondary(),
						}}
					/>
				}
				onClick={getDataCouncils}
			/>
			{loading ?
				<LoadingSection />
				: <div>
					<Table
						style={{ width: '100%', maxWidth: '100%' }}
					>
						<TableHead>
							<TableRow>
								<TableCell style={{}}>Total</TableCell>
								<TableCell style={{}}>ID</TableCell>
								<TableCell style={{}}>Entidad</TableCell>
								<TableCell style={{}}>Nombre</TableCell>
								<TableCell style={{}}>Fecha</TableCell>
								<TableCell style={{}}>Estado</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{councils.list
								&& councils.list.map((council, index) => (
									<CouncilItem
										index={index}
										key={`council_${council.id}`}
										council={council}
										translate={translate}
									/>
								))}
						</TableBody>
					</Table>

					<Grid style={{ marginTop: '1em' }}>
						<PaginationFooter
							page={pageCouncils}
							translate={translate}
							length={councils.list && councils.list.length}
							total={councils.list && councils.total}
							limit={10}
							changePage={setpageCouncils}
						/>
					</Grid>
				</div>
			}
		</div>
	);
};


export const SearchCouncils = withApollo(({ client, reload }) => {
	const [idCouncilSearch, setIdCouncilSearch] = React.useState(0);
	const [error, setError] = React.useState('');
	const [loading, setLoading] = React.useState(false);

	const goToId = async () => {
		if (!Number.isNaN(Number(idCouncilSearch)) || idCouncilSearch !== 0) {
			setLoading(true);
			const response = await client.query({
				query: CouncilDetailsRoot,
				variables: {
					id: parseInt(idCouncilSearch, 10)
				}
			});
			if (response.data.council && response.data.council.id) {
				setError('');
				bHistory.push(`/council/${idCouncilSearch}`);
				if (reload) {
					window.location.reload(true);
				}
				setLoading(false);
			} else {
				setError('Esta reunion no existe');
				setLoading(false);
			}
		} else {
			setError('Escribe un numero');
			setLoading(false);
		}
	};
	return (
		<div
			style={{
				margin: '1.4em',
				boxShadow: 'rgba(0, 0, 0, 0.5) 0px 2px 4px 0px',
				border: `1px solid${getSecondary()}`,
				borderRadius: '4px',
				padding: '0.5em',
				color: 'black'
			}}>
			<div>
				<div>Id de reunión:</div>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<div style={{ marginRight: '10px' }}>Id</div>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<TextInput
							type="text"
							value={idCouncilSearch === 0 ? '' : idCouncilSearch}
							disableUnderline={true}
							styles={{ fontWeight: 'bold', width: '300px' }}
							styleInInput={{ backgroundColor: '#ececec', paddingLeft: '5px', border: !!error && '2px solid red' }}
							onKeyUp={event => {
								if (event.keyCode === 13) {
									goToId(event);
								}
							}}
							onChange={event => setIdCouncilSearch(event.target.value)}
						/>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', marginTop: '6px' }}>
						<BasicButton
							text={<i className={loading ? 'fa fa-circle-o-notch fa-spin' : 'fa fa-search'} style={{ color: 'black' }} />}
							onClick={goToId}
							backgroundColor={{
								backgroundColor: 'white', minWidth: '0', marginLeft: '1em', minHeight: '0px', boxShadow: 'none', borderRadius: '4px', border: ' 1px solid black'
							}}
						/>
					</div>
					{error
						&& <div style={{
							display: 'flex', alignItems: 'center', marginTop: '6px', marginLeft: '15px', color: 'red', fontWeight: 'bold'
						}}>
							{error}
						</div>
					}
				</div>
			</div>
		</div>
	);
});

export default withTranslations()(withApollo(CouncilsDashboard));
