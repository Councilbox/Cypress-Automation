import React from 'react';
import gql from 'graphql-tag';
import { toast } from 'react-toastify';
import { withApollo } from 'react-apollo';
import {
	Icon, Table, TableRow, TableCell, TableBody, Input
} from 'material-ui';
import filesize from 'filesize';
import folder from '../../../../assets/img/folder.png';
import folderIcon from '../../../../assets/img/folder.svg';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import upload from '../../../../assets/img/upload.png';
import { isMobile } from '../../../../utils/screen';
import {
	TextInput, ProgressBar, DropDownMenu, AlertConfirm, Scrollbar, LiveToast
} from '../../../../displayComponents';
import { moment } from '../../../../containers/App';
import CreateDocumentFolder from './CreateDocumentFolder';
import { SERVER_URL } from '../../../../config';
import DownloadCompanyDocument from './DownloadCompanyDocument';
import { ACCEPTED_FILE_TYPES } from '../../../../constants';

const CompanyDocumentsPage = ({
	translate, company, client, action, trigger, hideUpload
}) => {
	const [inputSearch, setInputSearch] = React.useState(false);
	const [breadCrumbs, setBreadCrumbs] = React.useState([{
		value: '-1',
		label: translate.my_documentation
	}]);
	const [errorModal, setErrorModal] = React.useState(null);
	const [quota, setQuota] = React.useState(null);
	const [queue, setQueue] = React.useState([]);
	const [deleting, setDeleting] = React.useState(false);
	const [documents, setDocuments] = React.useState(null);
	const [folderModal, setFolderModal] = React.useState(false);
	const [search, setSearch] = React.useState('');
	const [deleteModal, setDeleteModal] = React.useState(false);
	const [editModal, setEditModal] = React.useState(false);
	const primary = getPrimary();
	const secondary = getSecondary();

	const actualFolder = breadCrumbs[breadCrumbs.length - 1].value;

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query CompanyDocuments($companyId: Int!, $folderId: Int, $filters: [FilterInput]){
					companyDocuments(companyId: $companyId, folderId: $folderId, filters: $filters){
						list{
							name
							filesize
							type
							id
							filetype
							date
							lastUpdated
						}
						total
					}

					companyDocumentsQuota(companyId: $companyId){
						total
						used
					}
				}
			`,
			variables: {
				companyId: company.id,
				folderId: breadCrumbs.length > 1 ? actualFolder : null,
				...(search ? {
					filters: [
						{
							field: 'name',
							text: search
						},
					]
				} : {}),
			}
		});

		setDocuments(response.data.companyDocuments.list);
		setQuota(response.data.companyDocumentsQuota);
	}, [company.id, breadCrumbs, search]);

	React.useEffect(() => {
		getData();
	}, [getData]);

	const navigateTo = doc => {
		breadCrumbs.push({
			value: doc.id,
			label: doc.name
		});

		setBreadCrumbs([...breadCrumbs]);
	};

	const deleteDocument = async () => {
		setDeleting(true);
		await client.mutate({
			mutation: gql`
				mutation DeleteCompanyDocument($documentId: Int!){
					deleteCompanyDocument(documentId: $documentId){
						success
					}
				}
			`,
			variables: {
				documentId: deleteModal.id
			}
		});
		getData();
		setDocuments(documents.filter(doc => deleteModal.id !== doc.id));
		setDeleting(false);
		setDeleteModal(false);
	};

	const addToQueue = file => {
		queue.push(file);
		setQueue([...queue]);
	};

	const updateQueueItem = (value, id) => {
		const index = queue.findIndex(item => item.id === id);
		queue[index].uploaded = value;
		setQueue([...queue]);
	};

	const removeFromQueue = id => {
		const index = queue.findIndex(item => item.id === id);
		queue.splice(index, 1);
		setQueue([...queue]);
	};

	const handleFileWithLoading = async event => {
		const { files } = event.nativeEvent.target;

		for (let i = 0; i < files.length; i += 1) {
			const file = files[i];
			if (!file) {
				return;
			}

			try {
				const reader = new FileReader();
				reader.readAsBinaryString(file);

				reader.onload = async () => {
					if ((+quota.used + file.size) > quota.total) {
						return setErrorModal(translate.file_exceeds_rest);
					}

					// TRADUCCION
					if (file.size > (50 * 1024 * 1024)) {
						return setErrorModal('El archivo supera el límite de tamaño');
					}

					const formData = new FormData();
					formData.append('file', file);
					formData.append('data', JSON.stringify({
						companyId: company.id,
						...(breadCrumbs.length > 1 ?
							{
								parentFolder: actualFolder
							}
							: {})
					}));
					const id = Math.random().toString(36).substr(2, 9);

					addToQueue({
						name: file.name,
						size: file.size,
						uploaded: 0,
						id
					});

					const xhr = new XMLHttpRequest();
					xhr.onload = function (e) {
						console.log(e);
					};

					xhr.upload.onprogress = e => {
						if (e.loaded === e.total) {
							removeFromQueue(id);
						} else {
							updateQueueItem(((e.loaded / e.total) * 100).toFixed(2), id);
						}
					};

					xhr.open('POST', `${SERVER_URL}/api/companyDocument`, true);
					xhr.setRequestHeader('x-jwt-token', sessionStorage.getItem('token'));
					xhr.onreadystatechange = () => {
						if (xhr.readyState === XMLHttpRequest.DONE) {
							if (xhr.status === 200) {
								const response = JSON.parse(xhr.responseText);
								console.log(response);
								if (response.success) {
									getData();
								}
							}
							if (xhr.status === 502) {
								toast(
									<LiveToast
										message={'Mete os virus polo cu, pensas que somos un chaiñas'}
										id="error-toast"
									/>, {
										position: toast.POSITION.TOP_RIGHT,
										autoClose: true,
										className: 'errorToast'
									}
								);
							}
						}
					};
					xhr.send(formData);
				};
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div style={{
			width: '100%', height: '100%', padding: '1em', paddingBottom: '2em', paddingTop: isMobile && '0em'
		}}>
			<div>
				<AlertConfirm
					open={deleteModal}
					title={translate.warning}
					loadingAction={deleting}
					requestClose={() => setDeleteModal(false)}
					bodyText={
						<div>
							{deleteModal && deleteModal.type === 0 ?
								<>
									<div dangerouslySetInnerHTML={{ __html: translate.delete_folder_warning.replace(/{{folderName}}/, deleteModal ? deleteModal.name : '') }} />
								</>
								: <>
									<div dangerouslySetInnerHTML={{ __html: translate.delete_document_warning.replace(/{{name}}/, deleteModal ? deleteModal.name : '') }} />
								</>
							}
						</div>
					}
					buttonAccept={translate.accept}
					buttonCancel={translate.cancel}
					acceptAction={deleteDocument}
				/>
				<AlertConfirm
					open={!!errorModal}
					title={translate.warning}
					requestClose={() => setErrorModal(false)}
					bodyText={
						<div>
							{errorModal}
						</div>
					}
					buttonCancel={translate.accept}
				/>
				<CreateDocumentFolder
					requestClose={() => setFolderModal(false)}
					open={folderModal}
					translate={translate}
					refetch={getData}
					company={company}
					parentFolder={breadCrumbs.length > 1 ? actualFolder : null}
				/>
				<input
					multiple
					type="file"
					onChange={handleFileWithLoading}
					onClick={event => { event.target.value = null; }}
					disabled={queue.length > 0}
					accept={ACCEPTED_FILE_TYPES}
					id="raised-button-file"
					style={{
						cursor: 'pointer',
						position: 'absolute',
						top: 0,
						width: 0,
						bottom: 0,
						right: 0,
						left: 0,
						opacity: 0
					}}
				/>
				<div style={{
					display: 'flex', borderBottom: `1px solid${primary}`, flexDirection: isMobile ? 'column-reverse' : 'row', alignItems: !isMobile && 'center', justifyContent: 'space-between'
				}}>
					<div style={{
						display: 'flex',
						alignItems: 'center',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}>
						{breadCrumbs.map((item, index) => (
							<React.Fragment key={index}>
								{index > 0
									&& ' > '
								}
								{(index === breadCrumbs.length - 1) && !hideUpload ?
									<DropDownMenu
										color="transparent"
										id="company-documents-drowpdown"
										styleComponent={{ width: '' }}
										Component={() => <div style={{
											display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5em', paddingRight: '1em', position: 'relative'
										}}>
											<div
												style={{
													cursor: 'pointer'
												}}
											>
												<span style={{ color: primary, fontWeight: 'bold' }}>{item.label}</span>
											</div>
											<i className={'fa fa-sort-desc'}
												style={{
													cursor: 'pointer',
													color: primary,
													paddingLeft: '5px',
													fontSize: '20px',
													position: 'absolute',
													top: '5px',
													right: '0px'
												}}></i>
										</div>
										}
										textStyle={{ color: primary }}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'left',
										}}
										type="flat"
										items={
											<div style={{ padding: '1em' }}>
												<label htmlFor="raised-button-file">
													<div
														id="company-document-upload-file"
														style={{
															display: 'flex', color: 'black', padding: '.5em 0em', cursor: 'pointer'
														}}
													>
														<div style={{ width: '15px' }}>
															<img src={upload} style={{ width: '100%' }}></img>
														</div>
														<div style={{ paddingLeft: '10px' }}>
															{queue.length > 0 ?
																`${translate.uploading}...`
																: translate.upload_file
															}
														</div>
													</div>
												</label>
												<div
													style={{
														display: 'flex',
														color: 'black',
														padding: '.5em 0em',
														borderTop: `1px solid${primary}`,
														cursor: 'pointer'
													}}
													id="company-document-create-folder"
													onClick={() => setFolderModal(true)}
												>
													<div style={{ width: '15px' }}>
														<img src={folder} style={{ width: '100%' }}></img>
													</div>
													<div style={{ paddingLeft: '10px' }}>
														{translate.new_folder}
													</div>
												</div>
											</div>
										}
									/>
									: <span
										id={`navigate-to-level-${index}`}
										style={{
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											direction: 'rtl',
											maxWidth: isMobile ? '50px' : '150px',
											...(index === breadCrumbs.length - 1 ? {
												color: (index === breadCrumbs.length - 1) ? primary : 'inherit'
											} : {
												cursor: 'pointer'
											})
										}}
										onClick={() => {
											breadCrumbs.splice(index + 1);
											setBreadCrumbs([...breadCrumbs]);
										}}
									>{item.label}</span>
								}
							</React.Fragment>
						))}
					</div>

					<div style={{ display: 'flex', alignItems: !isMobile && 'center', flexDirection: isMobile && 'column', gap: '4px' }}>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile && 'flex-end', whiteSpace: 'nowrap' }}>
							{quota
								&& `${filesize(quota.used)} / ${filesize(quota.total)}`
							}
						</div>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'flex-end'
						}}>
							<div style={{
								padding: '0px 8px',
								fontSize: '24px',
								color: '#c196c3',
								display: 'flex',
								alignContent: 'center',
								alignItems: 'center',
								justifyContent: isMobile && 'flex-end'
							}}>
								<i className="fa fa-filter"></i>
							</div>
							<div style={{
								display: 'flex',
								alignContent: 'center',
								marginBottom: '.2rem'
							}}>
								{
									isMobile && !inputSearch ?
										<div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
											<Icon style={{ background: '#f0f3f6' }} onClick={() => setInputSearch(!inputSearch)} >search</Icon>
										</div>
										:
										<TextInput
											className={isMobile && !inputSearch ? 'openInput' : ''}
											disableUnderline={true}
											styleInInput={{
												fontSize: '12px', display: isMobile && !inputSearch ? 'none' : '', color: 'rgba(0, 0, 0, 0.54)', background: '#f0f3f6', padding: isMobile && inputSearch && '4px 5px', paddingLeft: !isMobile && '5px'
											}}
											stylesAdornment={{ background: '#f0f3f6', marginLeft: '0', paddingLeft: isMobile && inputSearch ? '8px' : '4px' }}
											adornment={<Icon onClick={() => setInputSearch(!inputSearch)} >search</Icon>}
											floatingText={' '}
											type="text"
											id="company-document-search-input"
											value={search}
											styles={{ marginTop: '-16px' }}
											stylesTextField={{ marginBottom: '0px' }}
											placeholder={isMobile ? '' : translate.search}
											onChange={event => {
												setSearch(event.target.value);
											}}
										/>
								}

							</div>
						</div>
					</div>
				</div>
			</div>
			<EditFolder
				translate={translate}
				file={editModal}
				trigger={trigger}
				action={action}
				setDeleteModal={setDeleteModal}
				refetch={getData}
				modal={!!editModal}
				setModal={() => {
					setEditModal(false);
				}}
			/>
			<div style={{ marginTop: '2em', height: 'calc(100% - 5em)' }}>
				<Scrollbar horizontalScroll={isMobile && true}>
					<Table style={{ width: '100%', minWidth: '100%' }}>
						<TableBody>
							<TableRow>
								<TableCell style={{
									color: '#a09aa0',
									fontWeight: 'bold',
									borderBottom: '1px solid #979797'
								}}>
									{translate.name}
								</TableCell>
								<TableCell style={{
									color: '#a09aa0',
									fontWeight: 'bold',
									borderBottom: '1px solid #979797'
								}}>
									{translate.type}
								</TableCell>
								<TableCell style={{
									color: '#a09aa0',
									fontWeight: 'bold',
									borderBottom: '1px solid #979797'
								}}>
									{translate.last_edit}
								</TableCell>
								<TableCell style={{
									color: '#a09aa0',
									fontWeight: 'bold',
									borderBottom: '1px solid #979797'
								}}>
									{translate.size}
								</TableCell>
								<TableCell style={{
									color: '#a09aa0',
									fontWeight: 'bold',
									borderBottom: '1px solid #979797'
								}} />
							</TableRow>
							{documents && documents.map((doc, index) => (
								doc.type === 0 ?
									<TableRow
										style={{ cursor: 'pointer' }}
										key={`folder_${doc.id}`}
										id={`folder-${index}`}
										onClick={() => navigateTo(doc)}
									>
										<TableCell>
											<img src={folderIcon} style={{ marginRight: '0.6em' }} />
											{doc.name}
										</TableCell>
										<TableCell>
											{translate.folder}
										</TableCell>
										<TableCell>
											{moment(doc.lastUpdated).format('LLL')}
										</TableCell>
										<TableCell />
										<TableCell>
											{!action
												&& <div style={{ display: 'flex' }}>
													<div
														onClick={event => {
															event.stopPropagation();
															setDeleteModal(doc);
														}}
														id={`delete-folder-${index}`}
														style={{
															cursor: 'pointer',
															color: secondary,
															background: 'white',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															padding: '0.3em',
															width: '100px',
															marginLeft: '11px'
														}}
													>
														{translate.delete}
													</div>
													<div
														onClick={event => {
															event.stopPropagation();
															setEditModal(doc);
														}}
														id={`edit-folder-${index}`}
														style={{
															cursor: 'pointer',
															color: getSecondary(),
															background: 'white',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															padding: '0.3em',
														}}>
														{translate.edit}
													</div>
												</div>
											}

										</TableCell>
									</TableRow>
									: <FileRow
										key={`doc_${doc.id}`}
										translate={translate}
										id={index}
										file={doc}
										trigger={trigger}
										action={action}
										setDeleteModal={setDeleteModal}
										refetch={getData}
									/>
							))}
							{queue.map(item => (
								<DelayedRow key={`delayedRow_${item.id}`} delay={1000}>
									<TableRow>
										<TableCell>
											{item.name}
										</TableCell>
										<TableCell>
										</TableCell>
										<TableCell>
										</TableCell>
										<TableCell>
											<ProgressBar
												value={item.uploaded}
												color={getSecondary()}
											/>
										</TableCell>
										<TableCell>
										</TableCell>
									</TableRow>
								</DelayedRow>
							))}
						</TableBody>
					</Table>
				</Scrollbar>
			</div>
		</div>
	);
};


const DelayedRow = ({ children, delay }) => {
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		let timeout = null;
		if (!ready) {
			timeout = setTimeout(() => {
				setReady(true);
			}, delay);
		}
		return () => clearTimeout(timeout);
	}, [delay]);

	if (ready) {
		return children;
	}

	return <></>;
};


const EditFolder = withApollo(({
	client, translate, file, refetch, modal, setModal
}) => {
	const [filename, setFilename] = React.useState(file.name);
	const [error, setError] = React.useState('');

	React.useEffect(() => {
		if (modal && file) {
			setFilename(file.name);
		}
	}, [file ? file.id : null, modal]);

	const updateFile = async () => {
		if (!filename) {
			return setError(translate.required_field);
		}

		await client.mutate({
			mutation: gql`
				mutation UpdateCompanyDocument($companyDocument: CompanyDocumentInput){
					updateCompanyDocument(companyDocument: $companyDocument){
						success
					}
				}
			`,
			variables: {
				companyDocument: {
					id: file.id,
					name: `${filename}`
				}
			}
		});

		refetch();
		setModal(false);
	};

	return (
		<div style={{ display: 'flex' }}>

			<AlertConfirm
				title={translate.edit_folder}
				acceptAction={updateFile}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				requestClose={setModal}
				open={modal}
				bodyText={
					<Input
						error={error}
						disableUnderline={true}
						id={'titleDraft'}
						style={{
							color: 'rgba(0, 0, 0, 0.65)',
							fontSize: '15px',
							border: error ? '2px solid red' : '1px solid #d7d7d7',
							boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
							width: '100%',
							padding: '.5em 1.6em',
							marginTop: '1em'
						}}
						value={filename}
						onChange={event => setFilename(event.target.value)
						}
					/>
				}
			/>
		</div>
	);
});

const FileRow = withApollo(({
	client, translate, file, refetch, setDeleteModal, action, trigger, id
}) => {
	const nameData = file.name.split('.');
	const extension = nameData.pop();
	const name = nameData.join('.');
	const [modal, setModal] = React.useState(false);
	const [filename, setFilename] = React.useState(name);
	const [error, setError] = React.useState('');


	const updateFile = async () => {
		if (!filename) {
			return setError(translate.required_field);
		}

		await client.mutate({
			mutation: gql`
				mutation UpdateCompanyDocument($companyDocument: CompanyDocumentInput){
					updateCompanyDocument(companyDocument: $companyDocument){
						success
					}
				}
			`,
			variables: {
				companyDocument: {
					id: file.id,
					name: `${filename}.${extension}`
				}
			}
		});

		refetch();
		setModal(false);
	};

	return (
		<TableRow
			id={`file-${id}`}
		>
			<AlertConfirm
				title={translate.edit_document_name}
				acceptAction={updateFile}
				buttonAccept={translate.accept}
				buttonCancel={translate.cancel}
				requestClose={() => setModal(false)}
				open={modal}
				bodyText={
					<Input
						error={error}
						disableUnderline={true}
						id={'titleDraft'}
						style={{
							color: 'rgba(0, 0, 0, 0.65)',
							fontSize: '15px',
							border: error ? '2px solid red' : '1px solid #d7d7d7',
							boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
							width: '100%',
							padding: '.5em 1.6em',
							marginTop: '1em'
						}}
						value={filename}
						onChange={event => setFilename(event.target.value)
						}
					/>
				}
			/>
			<TableCell onClick={() => setModal(true)}>
				{name}
			</TableCell>
			<TableCell>
				{extension.toUpperCase()}
			</TableCell>
			<TableCell>
				{moment(file.lastUpdated).format('LLL')}
			</TableCell>
			<TableCell>
				{filesize(file.filesize)}
			</TableCell>
			<TableCell>
				{(action && trigger) ?
					file.type !== 0 ?
						<div
							id={`document-action-${id}`}
							onClick={() => action(file)}
							style={{ cursor: 'pointer' }}
						>
							{trigger}
						</div>
						: <span />
					: <div style={{ display: 'flex', alignItems: 'center' }}>
						<DownloadCompanyDocument
							translate={translate}
							id={id}
							file={file}
						/>
						<div
							onClick={() => setDeleteModal(file)}
							id={`delete-file-${id}`}
							style={{
								cursor: 'pointer',
								color: getSecondary(),
								background: 'white',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0.3em',
								width: '100px'
							}}
						>
							{translate.delete}
						</div>
						<div
							onClick={() => setModal(true)}
							id={`edit-file-${id}`}
							style={{
								cursor: 'pointer',
								color: getSecondary(),
								background: 'white',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0.3em',
							}}
						>
							{translate.edit}
						</div>
					</div>
				}
			</TableCell>
		</TableRow>
	);
});

export default withApollo(CompanyDocumentsPage);
