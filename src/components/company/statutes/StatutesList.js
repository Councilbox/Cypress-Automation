import React from 'react';
import { withApollo } from 'react-apollo';
import { TableCell, TableRow, Tooltip } from 'material-ui';
import { deleteStatute as deleteStatuteMutation } from '../../../queries';
import { AlertConfirm, CloseIcon, EnhancedTable } from '../../../displayComponents';
import { bHistory, client, moment } from '../../../containers/App';
import { getPrimary } from '../../../styles/colors';
import StatuteNameEditor from './StatuteNameEditor';
import withSharedProps from '../../../HOCs/withSharedProps';


const StatutesList = ({ statutes, translate, refetch, company }) => {
	const [deleteId, setDeleteId] = React.useState(null);
	const [editName, setEditName] = React.useState(null);
	const primary = getPrimary();

	const deleteStatute = async () => {
		const response = await client.mutate({
			mutation: deleteStatuteMutation,
			variables: {
				statuteId: deleteId
			}
		});
		if (response) {
			refetch();
			setDeleteId(null);
		}
	};

	return (
		<>
			<AlertConfirm
				title={translate.attention}
				bodyText={translate.question_delete}
				open={deleteId}
				buttonAccept={translate.delete}
				buttonCancel={translate.cancel}
				modal={true}
				acceptAction={deleteStatute}
				requestClose={() => setDeleteId(null)}
			/>
			<EnhancedTable
				hideTextFilter={true}
				translate={translate}
				defaultLimit={10000}
				defaultFilter={'title'}
				// limits={DRAFTS_LIMITS}
				page={1}
				loading={false}
				length={statutes.length}
				total={statutes.length}
				selectedCategories={[{
					field: 'type',
					value: 'all',
					label: translate.all_plural
				}]}
				refetch={refetch}
				headers={[
					{
						text: translate.name,
						name: 'title',
					},
					{
						name: '',
						text: translate.last_edit
					},
					{
						name: '',
						text: ''
					},
					{
						name: '',
						text: ''
					}
				]}
				companyID={company.id}
			>
				{statutes.map((statute, index) => (
					<TableRow key={statute.id} id={`company-statute-${index}`}>
						<TableCell>
							{translate[statute.title]}
						</TableCell>
						<TableCell>
							{statute.lastEdited ? moment(statute.lastEdited).format('LLL') : '-'}
						</TableCell>
						<TableCell>
							{statute.companyId !== company.id ? translate.organization_statute : ''}
						</TableCell>
						<TableCell>
							{statute.companyId !== company.id ?
								<Tooltip title={translate.see}>
									<i
										className="fa fa-eye"
										aria-hidden="true"
										style={{
											cursor: 'pointer',
											fontSize: '1.8em',
											marginLeft: '0.2em',
											color: primary
										}}
										id={`company-statute-visualize-${index}`}
										onClick={event => {
											event.stopPropagation();
											bHistory.push(`/company/${company.id}/statutes/edit/${statute.id}`);
										}}
									></i>
								</Tooltip>
								:
								<>
									<Tooltip title={translate.rename_council_type}>
										<i
											className="fa fa-pencil-square-o"
											aria-hidden="true"
											style={{
												cursor: 'pointer',
												fontSize: '1.8em',
												marginLeft: '0.2em',
												color: primary
											}}
											id={`company-statute-rename-${index}`}
											onClick={event => {
												event.stopPropagation();
												setEditName(statute);
											}}
										></i>
									</Tooltip>
									<Tooltip title={translate.edit}>
										<i
											className="fa fa-list-alt"
											aria-hidden="true"
											style={{
												cursor: 'pointer',
												fontSize: '1.8em',
												marginLeft: '0.2em',
												color: primary
											}}
											id={`company-statute-edit-${index}`}
											onClick={event => {
												event.stopPropagation();
												bHistory.push(`/company/${company.id}/statutes/edit/${statute.id}`);
											}}
										></i>
									</Tooltip>
									<Tooltip title={translate.delete}>
										<span>
											<CloseIcon
												style={{
													color: primary,
													marginTop: '-10px'
												}}
												id={`company-statute-delete-${index}`}
												onClick={event => {
													event.stopPropagation();
													setDeleteId(statute.id);
												}}
											/>
										</span>
									</Tooltip>
								</>

							}
						</TableCell>
					</TableRow>
				))}
			</EnhancedTable>
			{editName &&
				<StatuteNameEditor
					requestClose={() => setEditName(null)}
					key={editName.id}
					statute={editName}
					translate={translate}
					refetch={refetch}
				/>
			}
		</>
	);
};

export default withApollo(withSharedProps()(StatutesList));
