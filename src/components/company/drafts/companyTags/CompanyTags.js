import React from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import {
	Table, TableHead, TableRow, TableCell, TableBody, IconButton, Icon, Divider
} from 'material-ui';
import {
	CloseIcon, Scrollbar, Grid, GridItem, TextInput, AlertConfirm
} from '../../../../displayComponents';
import withSharedProps from '../../../../HOCs/withSharedProps';
import { useHoverRow } from '../../../../hooks';
import { getPrimary } from '../../../../styles/colors';
import AddCompanyTag from './AddCompanyTag';
import EditTagModal from './EditTagModal';
import { sendGAevent } from '../../../../utils/analytics';
import { isMobile } from '../../../../utils/screen';


export const query = gql`
	query companyTags($companyId: Int!, $filters: [FilterInput]){
		companyTags(companyId: $companyId, filters: $filters){
			id
			key
			value
			description
		}
	}
`;

const deleteCompanyTag = gql`
	mutation DeleteCompanyTag($tagId: Int!){
		deleteCompanyTag(tagId: $tagId){
			success
			message
		}
	}
`;

const CompanyTags = ({ client, translate, company }) => {
	const [data, setData] = React.useState(null);
	const [editTag, setEditTag] = React.useState(null);
	const [buscarTags, setBuscarTags] = React.useState('');
	const [toggleText, setToggleText] = React.useState(true);
	const [inputSearch, setInputSearch] = React.useState(false);

	const getData = async () => {
		const response = await client.query({
			query,
			variables: {
				companyId: company.id,
				...(buscarTags ? {
					filters: [
						{
							field: 'key',
							text: buscarTags
						},
					]
				} : {}),
			}
		});
		setData(response.data.companyTags);
	};

	React.useEffect(() => {
		getData();
	}, [company.id, buscarTags]);

	React.useEffect(() => {
		sendGAevent({
			category: 'Etiquetas',
			action: 'Entrada al listado',
			label: company.businessName
		});
	}, [sendGAevent]);

	const openEditTag = tag => {
		setEditTag(tag);
	};

	const closeEditTag = () => {
		setEditTag(null);
	};


	const deleteTag = async id => {
		await client.mutate({
			mutation: deleteCompanyTag,
			variables: {
				tagId: id
			}
		});
		getData();
	};

	if (isMobile) {
		return (
			<div style={{ height: 'calc( 100% - 5em )' }}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<AddCompanyTag
						translate={translate}
						company={company}
						refetch={getData}
						styles={{ height: '0' }}
					/>
					<div style={{ maxWidth: '10em', marginLeft: '1em' }}>
						<TextInput
							className={isMobile && !inputSearch ? 'openInput' : ''}
							disableUnderline={true}
							styleInInput={{
								fontSize: '12px', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', paddingLeft: '5px', padding: isMobile && inputSearch && '4px 5px'
							}}
							stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: isMobile && inputSearch ? '8px' : '4px' }}
							adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
							floatingText={' '}
							type="text"
							value={buscarTags}
							placeholder={isMobile ? '' : translate.search_templates}
							onChange={event => {
								setBuscarTags(event.target.value);
							}}
							id="company-tag-search-input"
						/>
					</div>
				</div>
				{!!editTag
					&& <EditTagModal
						tag={editTag}
						company={company}
						open={!!editTag}
						requestClose={closeEditTag}
						translate={translate}
						refetch={getData}
					/>
				}
				{data
					&& <Grid style={{ width: '100%', height: '100%', marginTop: '1em' }}>
						<GridItem xs={12} md={12} lg={12} style={{ width: '99%', height: 'calc( 100% - 3em )' }}>
							<div style={{
								border: `1px solid ${getPrimary()}`, boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)', borderRadius: '2px', height: '100%', overflow: 'hidden', marginBottom: '4em', paddingBottom: '1em'
							}}>
								<Divider />
								<div style={{ height: '100%' }}>
									<div style={{ height: '100%' }}>
										<Scrollbar>
											<div style={{ height: '100%' }}>
												{data.length > 0 ?
													<Table style={{ maxWidth: '100%', width: '100%' }}>
														<TableHead>
															<TableRow style={{ color: 'black', borderBottom: `1px solid ${getPrimary()}` }}>
																<TableCell style={{ color: 'black', fontSize: '16px', border: 'none' }}>
																	<div>{translate.key}</div>
																</TableCell>
																<TableCell style={{
																	color: 'black', fontSize: '16px', display: 'flex', border: 'none'
																}}>
																	<div>
																		<div style={{
																			display: 'flex', alignItems: 'center', color: '#969696', minHeight: '42px', marginBottom: '0.5em'
																		}}>
																			<div style={{}} onClick={() => setToggleText(!toggleText)}>
																				<i className="material-icons" style={{
																					color: getPrimary(), fontSize: '14px', paddingRight: '0.3em', cursor: 'pointer'
																				}} >
																					help
																				</i>
																			</div>
																			<AlertConfirm
																				open={!toggleText}
																				title={translate.help}
																				requestClose={() => setToggleText(!toggleText)}
																				acceptAction={() => setToggleText(!toggleText)}
																				bodyText={
																					<div style={{}}>
																						<div>{translate.tags_description}</div>
																					</div>
																				}
																			/>
																		</div>
																	</div>
																</TableCell>
															</TableRow>
														</TableHead>
														<TableBody id={'company-tags-table-body'} >
															{data.map((tag, index) => (
																<HoverableRow
																	key={`tag_${tag.id}`}
																	tag={tag}
																	id={`tag-${index}`}
																	editTag={openEditTag}
																	translate={translate}
																	deleteTag={deleteTag}
																/>
															))}
														</TableBody>
													</Table>
													: <div style={{ padding: '1em' }}>{translate.no_results}</div>
												}
											</div>
										</Scrollbar>
									</div>
								</div>
							</div>
						</GridItem>
					</Grid>
				}
			</div>
		);
	}
	return (
		<div style={{ height: 'calc( 100% - 5em )' }}>
			<AddCompanyTag
				translate={translate}
				company={company}
				refetch={getData}
			/>
			{!!editTag
				&& <EditTagModal
					tag={editTag}
					company={company}
					open={!!editTag}
					requestClose={closeEditTag}
					translate={translate}
					refetch={getData}
				/>
			}
			{data
				&& <Grid style={{ width: '100%', height: '100%', marginTop: '1em' }}>
					<Scrollbar>
						<GridItem xs={12} md={12} lg={12} style={{ width: '99%', height: 'calc( 100% - 3em )' }}>
							<div style={{
								display: 'flex', alignItems: 'center', color: '#969696', minHeight: '42px', marginBottom: '0.5em'
							}}>
								<div id="company-tags-help-toggle" onClick={() => setToggleText(!toggleText)}>
									<i className="material-icons" style={{
										color: getPrimary(), fontSize: '14px', paddingRight: '0.3em', cursor: 'pointer'
									}} >
										help
									</i>
								</div>
								<div style={{ height: '100%' }}>
									{toggleText
										&& <div id="company-tags-help-text">{translate.tags_description}</div>
									}
								</div>
							</div>
							<div style={{
								border: `1px solid ${getPrimary()}`, boxShadow: ' 0 2px 4px 0 rgba(0, 0, 0, 0.5)', borderRadius: '2px', height: '390px', overflow: 'hidden', marginBottom: '4em', paddingBottom: '4em'
							}}>
								<div style={{ width: '100%' }}>
									<div style={{ maxWidth: '10em', marginLeft: '1em' }}>
										<TextInput
											disableUnderline={true}
											styleInInput={{ fontSize: '12px', color: getPrimary() }}
											stylesAdornment={{}}
											adornment={<Icon style={{ color: getPrimary() }}>search</Icon>}
											type="text"
											value={buscarTags}
											onChange={event => {
												setBuscarTags(event.target.value);
											}}
											id="company-tag-search-input"
										/>
									</div>
								</div>
								<Divider />
								<div style={{ height: '100%' }}>
									<div style={{ height: '100%' }}>
										<Scrollbar>
											<div style={{ height: '100%' }}>
												{data.length > 0 ?
													<Table style={{ maxWidth: '100%', width: '100%' }}>
														<TableHead>
															<TableRow style={{ color: 'black' }}>
																<TableCell style={{ color: 'black', fontSize: '16px' }}>
																	{translate.key}
																</TableCell>
																<TableCell style={{ color: 'black', fontSize: '16px' }}>
																	{translate.value}
																</TableCell>
																<TableCell style={{ color: 'black', fontSize: '16px' }}>
																	{translate.description}
																</TableCell>
																<TableCell style={{ width: '2em' }} />
															</TableRow>
														</TableHead>
														<TableBody id={'company-tags-table-body'} >
															{data.map((tag, index) => (
																<HoverableRow
																	key={`tag_${tag.id}`}
																	tag={tag}
																	id={`tag-${index}`}
																	editTag={openEditTag}
																	translate={translate}
																	deleteTag={deleteTag}
																/>
															))}
														</TableBody>
													</Table>
													: <div style={{ padding: '1em' }}>{translate.no_results}</div>
												}
											</div>
										</Scrollbar>
									</div>
								</div>
							</div>
						</GridItem>
					</Scrollbar>
				</Grid>
			}
		</div>
	);
};

const HoverableRow = ({
	translate, tag, deleteTag, editTag, id
}) => {
	const [show, handlers] = useHoverRow();
	const primary = getPrimary();
	const [modal, setModal] = React.useState(false);

	const renderModalBody = () => (
		<div style={{ width: window.innerWidth > 650 ? '650px' : '100%' }}>
			{translate.remove_tag_warning.replaceAll('{{name}}', `${tag.key}`)}
		</div>
	);

	if (isMobile) {
		return (
			<TableRow
				{...handlers}
				id={id}
				style={{
					background: show && 'rgba(0, 0, 0, 0.07)'
				}}
			>
				<TableCell style={{ color: 'black' }}>
					{tag.key}
				</TableCell>
				<TableCell>
					<div style={{
						width: '4em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
					}}>
						<React.Fragment>
							<IconButton
								onClick={event => {
									event.stopPropagation();
									editTag(tag);
								}}
								id={`${id}-edit-button`}
								style={{
									width: '32px',
									height: '32px'
								}}
							>
								<i className="fa fa-edit"
									style={{
										cursor: 'pointer',
										fontSize: '22px',
										color: primary
									}}
								/>
							</IconButton>
							<CloseIcon
								id={`${id}-delete-icon`}
								style={{ color: primary }}
								onClick={() => setModal(true)}
							/>
						</React.Fragment>
					</div>
					<AlertConfirm
						open={modal}
						title={translate.delete_tag}
						requestClose={() => setModal(false)}
						acceptAction={event => {
							deleteTag(tag.id);
							event.stopPropagation();
						}}
						buttonAccept={translate.accept}
						buttonCancel={translate.cancel}
						bodyText={renderModalBody()}
					/>
				</TableCell>
			</TableRow>
		);
	}
	return (
		<TableRow
			{...handlers}
			id={id}
			style={{
				background: show && 'rgba(0, 0, 0, 0.07)'
			}}
		>
			<TableCell style={{ color: 'black' }}>
				{tag.key}
			</TableCell>
			<TableCell style={{ color: getPrimary() }}>
				{tag.value}
			</TableCell>
			<TableCell style={{ color: getPrimary() }}>
				{tag.description}
			</TableCell>
			<TableCell>
				<div style={{
					width: '4em', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
				}}>
					{show
						&& <React.Fragment>
							<IconButton
								onClick={event => {
									event.stopPropagation();
									editTag(tag);
								}}
								id={`${id}-edit-button`}
								style={{
									width: '32px',
									height: '32px'
								}}
							>
								<i className="fa fa-edit"
									style={{
										cursor: 'pointer',
										fontSize: '22px',
										color: primary
									}}
								/>
							</IconButton>
							<CloseIcon
								id={`${id}-delete-icon`}
								style={{ color: primary }}
								onClick={() => setModal(true)}
							/>
						</React.Fragment>

					}
				</div>
				<AlertConfirm
					open={modal}
					title={translate.delete_tag}
					requestClose={() => setModal(false)}
					acceptAction={event => {
						deleteTag(tag.id);
						event.stopPropagation();
					}}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={renderModalBody()}
				/>
			</TableCell>
		</TableRow>
	);
};

export default withSharedProps()(withApollo(CompanyTags));
