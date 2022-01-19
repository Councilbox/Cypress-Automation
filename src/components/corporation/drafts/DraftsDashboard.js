import React from 'react';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import {
	MenuItem, Table, TableRow, TableHead, TableCell, TableBody, InputAdornment
} from 'material-ui';
import { corporationDrafts, deleteCorporationDraft } from '../../../queries';
import {
	LoadingSection, SelectInput, TextInput, AlertConfirm, CloseIcon, Scrollbar
} from '../../../displayComponents';
import { getPrimary } from '../../../styles/colors';
import withTranslations from '../../../HOCs/withTranslations';
import NewCorporationDraft from './NewCorporationDraft';
import { bHistory } from '../../../containers/App';

const DEFAULT_OPTIONS = {
	limit: 10,
	offset: 0,
	orderBy: 'title',
	orderDirection: 'ASC'
};

class DraftsDashboard extends React.PureComponent {
	state = {
		filterText: '',
		language: 'es',
		companyType: 'all',
		deleteModal: false,
		draftType: 'all',
		new: false,
		limit: DEFAULT_OPTIONS.limit
	}

	timeout = null;

	updateLimit = value => {
		this.setState({
			limit: value
		}, this.refresh);
	}

	updateLanguage = value => {
		this.setState({
			language: value
		}, this.refresh);
	}

	updateCompanyType = value => {
		this.setState({
			companyType: value
		}, this.refresh);
	}

	updateDraftType = value => {
		this.setState({
			draftType: value
		}, this.refresh);
	}

	updateFilterText = text => {
		this.setState({
			filterText: text
		}, () => {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.refresh(), 450);
		});
	}

	openDeleteModal = id => {
		this.setState({
			deleteModal: true,
			deleteId: id
		});
	}

	refresh = async () => {
		const variables = {
			options: {
				...DEFAULT_OPTIONS
			}
		};

		variables.options.limit = this.state.limit;
		variables.filters = [{ field: 'title', text: this.state.filterText }];
		variables.filters = [...variables.filters, { field: 'language', text: this.state.language }];
		if (this.state.companyType !== 'all') {
			variables.filters = [...variables.filters, { field: 'companyType', text: this.state.companyType }];
		}
		if (this.state.draftType !== 'all') {
			variables.filters = [...variables.filters, { field: 'type', text: this.state.draftType }];
		}

		await this.props.data.refetch(variables);
	}

	deleteCorporationDraft = async () => {
		const response = await this.props.deleteCorporationDraft({
			variables: {
				id: this.state.deleteId
			}
		});


		if (!response.errors) {
			this.setState({
				deleteModal: false,
				deleteId: null
			});
			this.refresh();
		}
	}

	edit = id => {
		bHistory.push(`/drafts/edit/${id}`);
	}

	closeEdit = () => {
		this.props.data.refetch();
		this.setState({
			new: false
		});
	}

	render() {
		const { translate } = this.props;

		if (this.state.new) {
			return (
				<div style={{ height: 'calc(100vh - 3em)' }}>
					<NewCorporationDraft
						translate={translate}
						data={this.props.data}
						requestClose={this.closeEdit}
					/>
				</div>
			);
		}

		return (
			<div
				style={{
					height: 'calc(100vh - 3em)',
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
						<div>
							<TextInput
								startAdornment={
									<InputAdornment position="start" style={{ marginRight: '1em' }}>
										<i className="fa fa-search" aria-hidden="true"></i>
									</InputAdornment>
								}
								floatingText={' '}
								type="text"
								value={this.state.filterText}
								onChange={event => {
									this.updateFilterText(event.target.value);
								}}
							/>
						</div>
					</div>
				</div>
				<div style={{
					height: 'calc(100% - 6.5em)',
					flexDirection: 'column',
					// overflowX: 'hidden',
					padding: '1em'
				}}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div style={{ display: 'flex' }} >
							<SelectInput
								value={this.state.limit}
								onChange={event => {
									this.updateLimit(event.target.value);
								}}
							>
								<MenuItem value={10}>
									10
								</MenuItem>
								<MenuItem value={20}>
									20
								</MenuItem>
								<MenuItem value={100}>
									100
								</MenuItem>
							</SelectInput>
							<div style={{ marginLeft: '1.5em' }}>
								<SelectInput
									value={this.state.language}
									onChange={event => {
										this.updateLanguage(event.target.value);
									}}
								>
									{!this.props.data.loading
										&& this.props.data.languages.map(language => (
											<MenuItem value={language.columnName} key={`language_${language.columnName}`}>
												{language.desc}
											</MenuItem>
										))}
								</SelectInput>
							</div>
							<div style={{ marginLeft: '1.5em' }}>
								<SelectInput
									value={this.state.companyType}
									onChange={event => {
										this.updateCompanyType(event.target.value);
									}}
								>
									<MenuItem value='all'>
										{translate.all_plural}
									</MenuItem>
									{!this.props.data.loading
										&& this.props.data.companyTypes.map(companyType => (
											<MenuItem
												key={companyType.label}
												value={companyType.value}
											>
												{translate[companyType.label]}
											</MenuItem>
										))}
								</SelectInput>
							</div>
							<div style={{ marginLeft: '1.5em' }}>
								<SelectInput
									value={this.state.draftType}
									onChange={event => {
										this.updateDraftType(event.target.value);
									}}
								>
									<MenuItem value='all'>
										{translate.all_plural}
									</MenuItem>
									{!this.props.data.loading
										&& this.props.data.draftTypes.map(draftType => (
											<MenuItem
												key={draftType.label}
												value={draftType.value}
											>
												{translate[draftType.label]}
											</MenuItem>
										))}
								</SelectInput>
							</div>
						</div>
					</div>
					{this.props.data.loading ?
						<LoadingSection />
						: <React.Fragment>
							<Table
								style={{ width: '100%', maxWidth: '100%' }}
							>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: '70%' }}>{translate.certificate_title}</TableCell>
										<TableCell style={{}}>{translate.draft_type}</TableCell>
										<TableCell style={{}}>{translate.delete}</TableCell>
									</TableRow>
								</TableHead>
							</Table>
							<div style={{ height: 'calc( 100% - 5em)', width: '100%' }}>
								<Scrollbar>
									<Table
										style={{ width: '100%', maxWidth: '100%' }}
									>
										{this.props.data.loading ?
											<LoadingSection />
											: this.props.data.platformDrafts.list.length > 0 ?
												<TableBody style={{ marginBottom: '1em' }}>
													{this.props.data.platformDrafts.list.map(draft => (
														<TableRow hover={true} key={`draft_${draft.id}`}>
															<TableCell style={{ width: '70%' }}>
																{draft.title}
															</TableCell>
															<TableCell>
																{this.props.translate[this.props.data.draftTypes[draft.type].label]}
															</TableCell>
															<TableCell>
																<CloseIcon
																	style={{ color: getPrimary() }}
																	onClick={event => {
																		this.openDeleteModal(draft.id);
																		event.stopPropagation();
																	}}
																/>
															</TableCell>
														</TableRow>
													))}
												</TableBody>
												: translate.no_results
										}
									</Table>
								</Scrollbar>
							</div>
						</React.Fragment>
						// <Table style={{ maxWidth: "100%" }}>
						//     <TableHead>
						//         <TableRow>
						//             <TableCell>
						//                 <TableSortLabel
						//                     active={'title' === this.state.orderBy}
						//                     direction={this.state.orderDirection}
						//                     onClick={() =>
						//                         this.orderBy('title')
						//                     }
						//                 >
						//                     {translate.certificate_title}
						//                 </TableSortLabel>
						//             </TableCell>
						//             <TableCell>
						//                 <TableSortLabel
						//                     active={'draftType' === this.state.orderBy}
						//                     direction={this.state.orderDirection}
						//                     onClick={() =>
						//                         this.orderBy('draftType')
						//                     }
						//                 >
						//                     {translate.draft_type}
						//                 </TableSortLabel>
						//             </TableCell>
						//             <TableCell>
						//                 {translate.delete}
						//             </TableCell>
						//         </TableRow>
						//     </TableHead>
						//     {this.props.data.platformDrafts.list.length > 0 ?
						//         <TableBody>
						//             {this.props.data.platformDrafts.list.map(draft => (
						//                 <TableRow hover={true} onClick={() => this.edit(draft.id)} key={`draft_${draft.id}`}>
						//                     <TableCell style={{ fontSize: '0.9em' }}>
						//                         {draft.title}
						//                     </TableCell>
						//                     <TableCell>
						//                         {this.props.translate[this.props.data.draftTypes[draft.type].label]}
						//                     </TableCell>
						//                     <TableCell>
						//                         <CloseIcon
						//                             style={{ color: getPrimary() }}
						//                             onClick={event => {
						//                                 this.openDeleteModal(draft.id);
						//                                 event.stopPropagation();
						//                             }}
						//                         />
						//                     </TableCell>
						//                 </TableRow>
						//             ))}
						//         </TableBody>
						//         :
						//         translate.no_results

						//     }
						// </Table>
					}
				</div>
				<AlertConfirm
					requestClose={() => this.setState({ deleteModal: false, deleteId: null })}
					open={this.state.deleteModal}
					acceptAction={this.deleteCorporationDraft}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					bodyText={
						<div>
							{translate.question_delete}
						</div>
					}
					title={translate.attention}
				/>
			</div >
		);
	}
}

export default compose(
	graphql(corporationDrafts, {
		options: () => ({
			variables: {
				filters: [{ field: 'language', text: 'es' }],
				options: DEFAULT_OPTIONS
			}
		})
	}),
	graphql(deleteCorporationDraft, {
		name: 'deleteCorporationDraft'
	})
)(withTranslations()(DraftsDashboard));
