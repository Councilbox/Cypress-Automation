import React from 'react';
import fileSize from 'filesize';
import Dropzone from 'react-dropzone';
import gql from 'graphql-tag';
import {
	Card, Table, TableCell, TableBody, TableRow
} from 'material-ui';
import { withApollo } from 'react-apollo';
import { isMobile } from 'react-device-detect';
import { BasicButton, Checkbox, AlertConfirm } from '../../../displayComponents';
import { addCouncilAttachment, removeCouncilAttachment } from '../../../queries';
import { moment } from '../../../containers/App';
import { getPrimary } from '../../../styles/colors';
import upload from '../../../assets/img/upload.svg';
import MenuSuperiorTabs from '../../dashboard/MenuSuperiorTabs';
import { SERVER_URL } from '../../../config';
import { ACCEPTED_FILE_TYPES } from '../../../constants';

const ParticipantCouncilAttachments = ({
	translate, participant, client, council
}) => {
	const [data, setData] = React.useState(null);
	const [confirmationModal, setConfirmationModal] = React.useState(false);
	const [tab, setTab] = React.useState(translate.your_documentation);
	const [check, setCheck] = React.useState(false);
	const [checkError, setCheckError] = React.useState('');
	const [uploadFile, setUploadFile] = React.useState(false);
	const primary = getPrimary();

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: gql`
				query CouncilAttachments($councilId: Int!){
					councilAttachments(councilId: $councilId){
						id
						filename
						creationDate
						filesize
						participantId
						filetype
					}
				}
			`,
			variables: {
				councilId: council.id
			}
		});
		setData(response.data.councilAttachments);
	});

	const councilAttachments = tab === 'Documentación administración';

	const filterAttachments = attachment => {
		if (councilAttachments) {
			return !attachment.participantId;
		}

		return attachment.participantId;
	};

	React.useEffect(() => {
		getData();
	}, [participant.id]);

	const handleFile = async file => {
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.readAsBinaryString(file);
		reader.onload = async event => {
			const fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: event.loaded,
				base64: btoa(event.target.result),
				councilId: council.id
			};

			await client.mutate({
				mutation: addCouncilAttachment,
				variables: {
					attachment: fileInfo
				}
			});
			getData();
			setUploadFile(false);
		};
	};

	const downloadAttachment = async attachment => {
		const participantToken = sessionStorage.getItem('participantToken');
		const response = await fetch(`${SERVER_URL}/councilAttachment/${attachment.id}`, {
			headers: new Headers({
				'x-jwt-token': participantToken,
			})
		});

		if (response.status === 200) {
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = attachment.filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
		}
	};

	const onDrop = accepted => {
		if (accepted.length === 0) {
			return;
		}
		handleFile(accepted[0]);
	};

	const deleteAttachment = async id => {
		await client.mutate({
			mutation: removeCouncilAttachment,
			variables: {
				attachmentId: id,
				councilId: council.id
			}
		});
		getData();
		setConfirmationModal(false);
	};

	return (
		<div style={{
			width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
		}}>
			<AlertConfirm
				open={confirmationModal}
				title={translate.warning}
				buttonCancel={translate.close}
				buttonAccept={translate.accept}
				acceptAction={() => deleteAttachment(confirmationModal.id)}
				bodyText={
					<div>
						¿Desea eliminar el documento {confirmationModal.filename}?
					</div>
				}
				requestClose={() => setConfirmationModal(false)}
			/>
			<div style={{
				width: '100%',
				paddingLeft: '4px',
			}}>
				<div style={{ padding: '1em', paddingTop: '2em', display: 'flex', flexDirection: isMobile ? 'column' : 'row' }} >
					<div
						style={{
							color: '#154481',
							fontSize: '1.9em',
							marginRight: '1em'
						}}
					>{`${participant.name} ${participant.surname || ''}`}</div>
					<MenuSuperiorTabs
						items={[
							translate.your_documentation,
							translate.documentation_added_by_admin
						]}
						setSelect={setTab}
						selected={tab}
					/>
				</div>
				<div style={{
					padding: '1em', paddingBottom: '1em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #154481'
				}}>
					<div>
						{tab === translate.your_documentation &&
							<BasicButton
								text={
									<div style={{ display: 'flex' }}>
										<div>
											<img
												src={upload}
												style={{
													paddingRight: '5px',
													height: '16px'
												}}
											/>
										</div>
										<div>
											{translate.upload_file}
										</div>
									</div>
								}
								color={primary}
								textStyle={{
									color: 'white',
									fontWeight: '700',
									borderRadius: '4px',
									boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
									padding: '5px 16px',
									minHeight: '0'
								}}
								textPosition="before"
								fullWidth={true}
								onClick={() => setUploadFile(true)}
							/>
						}
					</div>
				</div>
				<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
					<div style={{
						marginTop: '2em', height: '100%', marginBottom: '2em', width: '100%'
					}}>
						{isMobile ?
							<>
								{data && data.filter(filterAttachments).map(attachment => (
									<Card style={{ position: 'relative', padding: '1.2em', marginTop: '5px' }} key={attachment.id}>
										<i
											className="fa fa-trash-o"
											style={{
												color: 'red',
												fontSize: '18px',
												cursor: 'pointer',
												position: 'absolute',
												top: '10px',
												right: '10px'
											}}
											onClick={() => setConfirmationModal(attachment)}
										></i>
										<div
											style={{
												userSelect: 'none',
											}}
											onClick={() => downloadAttachment(attachment)}
										>
											{translate.name} {attachment.filename}
										</div>
									</Card>
								))}
							</>
							: <Table style={{ width: '100%', maxWidth: '100%' }}>
								<TableBody>
									<TableRow>
										<TableCell style={{
											color: '#a09aa0',
											fontWeight: 'bold',
											borderBottom: '1px solid #979797',
											width: '40%'
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
									{data && data.filter(filterAttachments).map(attachment => (
										<TableRow key={`attachment_${attachment.id}`}>
											<TableCell>
												<div
													style={{
														cursor: 'pointer'
													}}
													onClick={() => downloadAttachment(attachment)}
												>
													{attachment.filename}
												</div>
											</TableCell>
											<TableCell>
												{attachment.filetype}
											</TableCell>
											<TableCell>
												{moment(attachment.creationDate).format('LLL')}
											</TableCell>
											<TableCell >
												{fileSize(attachment.filesize)}
											</TableCell>
											<TableCell>
												{!councilAttachments &&
													<i
														className="fa fa-trash-o"
														style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
														onClick={() => setConfirmationModal(attachment)}
													></i>
												}

											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

						}
					</div>
				</div>
			</div>
			<AlertConfirm
				open={uploadFile}
				requestClose={() => setUploadFile(false)}
				bodyText={
					<Dropzone
						disabledClick={true}
						disabled={!check}
						onDrop={onDrop}
					>
						{({ getRootProps, getInputProps }) => (
							<div
								style={{ maxWidth: '700px', margin: '1em', marginTop: '2em' }}
								{...getRootProps()}
							>
								<input {...getInputProps()} accept={ACCEPTED_FILE_TYPES} />
								<div style={{
									color: 'black', fontSize: '20px', marginBottom: '1em', textAlign: 'center'
								}}>{translate.upload_attachment_help_title}</div>
								<div
									style={{ marginBottom: '1em', display: 'flex', justifyContent: 'center' }}
								>
									<BasicButton
										onClick={event => {
											if (!check) {
												event.stopPropagation();
												setCheckError(true);
											}
										}}
										text={translate.select_files}
										color={primary}
										textStyle={{
											color: 'white',
											fontWeight: '700',
											fontSize: '0.9em',
											textTransform: 'none'
										}}
										loadingColor={'primary'}
										buttonStyle={{
											border: `1px solid ${primary}`,
											height: '100%',
											marginTop: '5px',
											borderRadius: '4px',
											boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
											maxWidth: '300px'
										}}
									/>
								</div>
								<div style={{ color: '#154481', textAlign: 'center', marginBottom: '2em' }}>
									{translate.upload_attachment_drag_and_drop_help}
								</div>
								{(!check && checkError)
									&& <div style={{ color: 'red', fontWeight: '700' }}>
										{translate.confirmation_needed_to_upload}
									</div>
								}
								<div style={{ color: 'black', marginBottom: '1em' }}>
									<Checkbox
										value={check}
										onChange={(event, isInputChecked) => {
											setCheck(isInputChecked);
										}}
										styleLabel={{ alignItems: 'unset', fontSize: '14px', color: 'black' }}
										styleInLabel={{ fontSize: '14px', color: 'black' }}
										label={translate.upload_files_legal_warning}
									/>
								</div>
							</div>
						)}
					</Dropzone>
				}
			/>
		</div>
	);
};

export default withApollo(ParticipantCouncilAttachments);
