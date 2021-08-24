import React from 'react';
import { withApollo } from 'react-apollo';
import {
	MenuItem, Table, TableRow, TableCell, InputAdornment, TableHead
} from 'material-ui';
import {
	LoadingSection, TextInput, ButtonIcon, SelectInput, BasicButton, Link, Scrollbar
} from '../../../displayComponents';
import UserItem from './UserItem';
import NewUser from './NewUser';
import { corporationUsers as corporationUsersQuery } from '../../../queries/corporation';
import withTranslations from '../../../HOCs/withTranslations';
import { getSecondary } from '../../../styles/colors';

import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';

const DEFAULT_OPTIONS = {
	limit: 100,
	offset: 0,
	orderBy: 'lastConnectionDate',
	orderDirection: 'DESC'
};

const UsersDashboard = ({ translate, client }) => {
	const [filterText, setFilterText] = React.useState('');
	const [state, setState] = React.useState({
		filterText: '',
		limit: DEFAULT_OPTIONS.limit,
		selecteOptionMenu: 'Registrados',
		loading: true
	});
	const [addUser, setAddUser] = React.useState(false);

	const getData = async () => {
		setState({ ...state, loading: true });
		const response = await client.query({
			query: corporationUsersQuery,
			variables: {
				options: DEFAULT_OPTIONS,
				actived: state.selecteOptionMenu === 'Registrados',
				filters: [{ field: 'fullName', text: filterText }],
				corporationId: 1
			},
		});
		setState({ ...state, corporationUsers: response.data.corporationUsers, loading: false });
	};

	React.useEffect(() => {
		const timeout = setTimeout(getData, 300);
		return () => clearTimeout(timeout);
	}, [state.selecteOptionMenu, filterText]);


	const setSelecteOptionMenu = value => {
		setState({
			...state,
			selecteOptionMenu: value
		});
	};

	const updateLimit = value => {
		setState({
			...state,
			limit: value
		});
	};

	if (addUser) {
		return <NewUser translate={translate} requestClose={() => setAddUser(false)} />;
	}

	return (
		<div
			style={{
				height: '100%',
				position: 'relative',
				overflow: 'hidden'
			}}
		>
			<div
				style={{
					paddingLeft: '1.4em',
					paddingRight: '1.4em',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					borderBottom: '1px solid gainsboro'
				}}
			>

				<div style={{
					width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'
				}}>
					<div style={{ marginLeft: '0.6em', justifyContent: 'flex-end' }}>
						{/* //REVISAR este es el buscador que se vuelve loco al escribir... va para adelante y atras sin sentido y no busca */}
						<TextInput
							startAdornment={
								<InputAdornment position="start" style={{ marginRight: '1em' }}>
									<i className="fa fa-search" aria-hidden="true"></i>
								</InputAdornment>
							}
							floatingText={' '}
							type="text"
							value={filterText}
							onChange={event => setFilterText(event.target.value)}
						/>
					</div>
				</div>
			</div>
			<div style={{
				height: 'calc(100% - 6em)',
				flexDirection: 'column',
				padding: '1em'
			}}>
				<div style={{
					display: 'flex', padding: '1em', justifyContent: 'space-between', paddingTop: '0px', alignItems: 'center'
				}}>
					<div style={{ fontSize: '13px' }}>
						<MenuSuperiorTabs
							// TRADUCCION
							items={['Registrados', 'Pendientes de confirmar']}
							setSelect={setSelecteOptionMenu}
							selected={state.selecteOptionMenu}
						/>
					</div>
				</div>
				<div
					style={{
						width: '100%',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<div>
						<BasicButton
							text={translate.users_add}
							color={getSecondary()}
							icon={<ButtonIcon type="add" color="white" />}
							textStyle={{ textTransform: 'none', color: 'white', fontWeight: '700' }}
							onClick={() => setAddUser(true)}
						/>
					</div>
					<div>
						<SelectInput
							value={state.limit}
							onChange={event => {
								updateLimit(event.target.value);
							}}
						>
							<MenuItem value={10}>
								10
							</MenuItem>
							<MenuItem value={20}>
								20
							</MenuItem>
						</SelectInput>
					</div>
				</div>
				{state.loading ?
					<LoadingSection />
					: <TablaRegistrados
						translate={translate}
						corporationUsers={state.corporationUsers.list}
					/>
				}
			</div>
		</div>
	);
};


const TablaRegistrados = ({ translate, corporationUsers }) => (
	<div style={{
		height: 'calc(100% - 4em)',
	}}>
		<Table
			style={{ width: '100%', maxWidth: '100%' }}
		>
			<TableHead>
				<TableRow>
					<TableCell style={{ width: '15%', padding: '4px 56px 4px 15px', textAlign: 'center' }}>{translate.state}</TableCell>
					<TableCell style={{ width: '10%', padding: '4px 56px 4px 15px' }}>Id</TableCell>
					<TableCell style={{ width: '25%', padding: '4px 56px 4px 15px' }}>{translate.name}</TableCell>
					<TableCell style={{ width: '25%', padding: '4px 56px 4px 15px' }}>{translate.email}</TableCell>
					<TableCell style={{ width: '25%', padding: '4px 56px 4px 15px' }}>Ultima Conexion</TableCell>
				</TableRow>
			</TableHead>
		</Table>
		<div style={{ height: 'calc( 100% - 5em)' }}>
			<Scrollbar>
				{corporationUsers.map(user => (
					<Link to={`/users/edit/${user.id}`} key={`user_${user.id}`} >
						<UserItem
							user={user}
							clickable={true}
							translate={translate}
						/>
					</Link>
				))
				}
			</Scrollbar>
		</div>
	</div>
);


export default (withTranslations()(withApollo(UsersDashboard)));
