import React from 'react';
import {
	MenuItem, TableBody, Table, TableHead, TableRow, TableCell
} from 'material-ui';
import ContentEditable from 'react-contenteditable';
import { GridItem, DropDownMenu, Scrollbar, Grid } from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import { GOVERNING_BODY_TYPES } from '../../../constants';


const GoverningBodyForm = ({ translate, state, updateState }) => {
	const primary = getPrimary();

	const updateGoverningData = object => {
		updateState({
			governingBodyData: {
				...state.governingBodyData,
				...object
			}
		});
	};

	const getGoverningTypeInput = () => {
		const menus = {
			0: <span />,
			1: <SingleAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
			2: <EntityAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
			3: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
			4: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
			5: <ListAdminForm setData={updateGoverningData} translate={translate} data={state.governingBodyData || {}} />,
		};

		return menus[state.governingBodyType] ? menus[state.governingBodyType] : menus[0];
	};


	const type = GOVERNING_BODY_TYPES[Object.keys(GOVERNING_BODY_TYPES).find(
		key => GOVERNING_BODY_TYPES[key].value === state.governingBodyType
	)];

	return (
		<Grid>
			<GridItem xs={12} md={12} lg={12}>
				<div style={{ display: 'flex', marginBottom: '1em' }}>
					<DropDownMenu
						color="transparent"
						id="company-governing-body-select"
						styleComponent={{ width: '' }}
						Component={() => <div
							style={{
								borderRadius: '1px',
								border: `1px solid${primary}`,
								padding: '0.5em 1em',
								cursor: 'pointer'
							}}
						>
							<span style={{ color: primary, fontWeight: 'bold' }}>{
								translate[type.label]
							}</span>
							<i className="fa fa-angle-down" style={{ color: primary, paddingLeft: '5px', fontSize: '20px' }}></i>
						</div>
						}
						textStyle={{ color: primary }}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
						type="flat"
						items={
							<div style={{ color: 'black' }}>
								{Object.keys(GOVERNING_BODY_TYPES).map(key => (
									<MenuItem
										style={{ display: 'flex', padding: '0.5em 1em' }}
										key={key}
										id={`governing-body-${GOVERNING_BODY_TYPES[key].value}`}
										onClick={() => {
											updateState({
												governingBodyType: GOVERNING_BODY_TYPES[key].value
											});
										}}
									>
										{translate[GOVERNING_BODY_TYPES[key].label] || GOVERNING_BODY_TYPES[key].label}
									</MenuItem>
								))}
							</div>
						}
					/>
				</div>
			</GridItem>
			{getGoverningTypeInput()}
		</Grid>
	);
};

const SingleAdminForm = ({ translate, setData, data = {} }) => {
	const primary = getPrimary();
	return (
		<div style={{ width: '100%', display: 'flex' }}>
			<div style={{ height: '100%', width: '100%' }}>
				<div style={{
					display: 'flex', justifyContent: 'space-between', width: '100%', padding: '1em'
				}}>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.name}</div>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.dni}</div>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.email}</div>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.phone}</div>
				</div>
				<div style={{
					color: 'black', display: 'flex', justifyContent: 'space-between', width: '100%', padding: '1em'
				}}>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="single-admin-name"
							html={data.name || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									name: event.target.value
								});
							}}
						/>
					</div>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="single-admin-dni"
							html={data.dni || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									dni: event.target.value
								});
							}}
						/>
					</div>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="single-admin-email"
							html={data.email || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									email: event.target.value
								});
							}}
						/>
					</div>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="single-admin-phone"
							html={data.phone || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									phone: event.target.value
								});
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const EntityAdminForm = ({ translate, setData, data = {} }) => {
	const primary = getPrimary();
	return (
		<div style={{ width: '100%', display: 'flex' }}>
			<div style={{ height: '100%', width: '100%' }}>
				<div style={{ marginTop: '1em', color: 'black', fontWeight: '700' }}>{translate.entity}</div>
				<div>
					<ContentEditable
						id="entity-admin-entity-name"
						html={data.entityName || ''}
						style={{ borderBottom: '1px solid grey', width: '20em' }}
						onChange={event => {
							setData({
								entityName: event.target.value
							});
						}}
					/>
				</div>
				<div style={{ marginTop: '1em', color: 'black', fontWeight: '700' }}>{translate.representative}</div>
				<div style={{
					display: 'flex', justifyContent: 'space-between', width: '100%', padding: '1em'
				}}>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.name}</div>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.dni}</div>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.email}</div>
					<div style={{ textTransform: 'uppercase', color: primary, width: '25%' }}>{translate.phone}</div>
				</div>
				<div style={{
					color: 'black', display: 'flex', justifyContent: 'space-between', width: '100%', padding: '1em'
				}}>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="entity-admin-name"
							html={data.name || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									name: event.target.value
								});
							}}
						/>
					</div>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="entity-admin-dni"
							html={data.dni || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									dni: event.target.value
								});
							}}
						/>
					</div>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="entity-admin-email"
							html={data.email || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									email: event.target.value
								});
							}}
						/>
					</div>
					<div style={{ width: '25%', paddingRight: '1.2em' }}>
						<ContentEditable
							id="entity-admin-phone"
							html={data.phone || ''}
							style={{ borderBottom: '1px solid grey' }}
							onChange={event => {
								setData({
									phone: event.target.value
								});
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

const ListAdminForm = ({ translate, setData, data }) => {
	const primary = getPrimary();
	React.useEffect(() => {
		if (!data.list) {
			setData({
				list: []
			});
		}
	}, [data.list]);


	const setAdminData = (newData, index) => {
		const list = [...data.list] || [];
		list[index] = {
			...list[index],
			...newData
		};

		setData({
			list: [...list]
		});
	};

	const deleteRow = index => {
		const newList = [...data.list];
		newList.splice(index, 1);
		setData({
			list: newList
		});
	};

	const addRow = () => {
		const list = data.list || [];

		const newList = [...list, {
			name: '',
			surname: '',
			dni: '',
			phone: '',
			email: '',
			id: new Date()
		}];

		setData({
			list: newList
		});
	};

	return (
		<>
			<div style={{ fontWeight: 'bold', color: primary, paddingBottom: '1em' }}>
				{translate.admins}
				<i
					className={'fa fa-plus-circle'}
					id="list-admin-add-button"
					style={{
						color: primary, marginLeft: '4px', fontSize: '22px', cursor: 'pointer'
					}}
					onClick={addRow}
				></i>
			</div>
			<div
				style={{
					height: 'calc( 100% - 10em )',
					boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
					padding: '1em',
					width: '100%',
					// maxHeight: expandAdministradores ? "100%" : "20em",
					overflow: 'hidden',
					position: 'relative',
					paddingBottom: '2.5em',
					transition: 'max-height 0.5s'
				}}
			>
				<div style={{ height: 'calc(30vh - 64px)' }}>
					<Scrollbar horizontalScroll>
						<Table>
							<TableHead>
								<TableCell>
									{translate.name}
								</TableCell>
								<TableCell>
									{translate.surname}
								</TableCell>
								<TableCell>
									{translate.dni}
								</TableCell>
								<TableCell>
									{translate.email}
								</TableCell>
								<TableCell>
									{translate.position}
								</TableCell>
								<TableCell>
									{translate.appointment}
								</TableCell>
								<TableCell>
									{translate.table_councils_duration}
								</TableCell>
								<TableCell style={{ minWidth: '5em' }}>
									{translate.votes}
								</TableCell>
								<TableCell>
									{translate.social_capital}
								</TableCell>
								<TableCell>
									{translate.new_delete}
								</TableCell>
							</TableHead>
							<TableBody>
								{data.list && data.list.map((item, index) => (
									<TableRow key={`data_keys_${index}`} style={{ color: 'black', width: '100%', padding: '1em' }}>
										<TableCell>
											<ContentEditable
												id="list-admin-name"
												html={item.name || ''}
												style={{ borderBottom: '1px solid grey' }}
												onChange={event => {
													setAdminData({
														name: event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-surname"
												html={item.surname || ''}
												style={{ borderBottom: '1px solid grey' }}
												onChange={event => {
													setAdminData({
														surname: event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-dni"
												html={item.dni || ''}
												style={{ borderBottom: '1px solid grey' }}
												onChange={event => {
													setAdminData({
														dni: event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-email"
												html={item.email || ''}
												style={{ borderBottom: '1px solid grey' }}
												onChange={event => {
													setAdminData({
														email: event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-position"
												html={item.position || ''}
												style={{ borderBottom: '1px solid grey' }}
												onChange={event => {
													setAdminData({
														position: event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-date"
												html={item.apointmentDate || ''}
												style={{ borderBottom: '1px solid grey' }}
												onChange={event => {
													setAdminData({
														apointmentDate: event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-length"
												html={item.apointmentLength || ''}
												style={{ borderBottom: '1px solid grey', width: 'calc(100% - 2em)' }}
												onChange={event => {
													setAdminData({
														apointmentLength: event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-votes"
												html={(item.numParticipations && item.numParticipations !== 0) ? `${item.numParticipations}` : 0}
												style={{ borderBottom: item.numParticipations && item.numParticipations !== 0 ? '1px solid grey' : '' }}
												onChange={event => {
													setAdminData({
														numParticipations: +event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<ContentEditable
												id="list-admin-social-capital"
												html={(item.socialCapital && item.socialCapital !== 0) ? `${item.socialCapital}` : 0}
												style={{ borderBottom: (item.socialCapital && item.socialCapital !== 0) ? '1px solid grey' : '' }}
												onChange={event => {
													setAdminData({
														socialCapital: +event.target.value
													}, index);
												}}
											/>
										</TableCell>
										<TableCell>
											<div
												id="list-admin-delete-button"
												onClick={() => deleteRow(index)}
												style={{
													color: 'white',
													display: 'flex',
													cursor: 'pointer',
													alignItems: 'center',
													justifyContent: 'center',
													backgroundColor: primary,
													borderRadius: '50%',
													height: '1.2em',
													width: '1.2em'
												}}
											>X</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

					</Scrollbar>
				</div>
			</div>
		</>
	);
};


export const getCouncilAdminPosition = (index, translate) => {
	const positions = {
		0: translate.president,
		1: translate.vice_president,
		2: translate.secretary,
		3: translate.vice_secretary
	};

	return positions[index];
};

export default GoverningBodyForm;
