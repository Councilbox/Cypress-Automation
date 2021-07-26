import React from 'react';
import gql from 'graphql-tag';
import { MainContext } from '../../../containers/App';
import {
	AlertConfirm, DropDownMenu, BasicButton, SuccessMessage, LoadingSection, CloseIcon
} from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { addCouncilAttachment } from '../../../queries';
import CompanyDocumentsBrowser from '../../company/drafts/documents/CompanyDocumentsBrowser';
import AttachmentItem from '../../attachments/AttachmentItem';
import RichTextInput from '../../../displayComponents/RichTextInput';
import { ACCEPTED_FILE_TYPES } from '../../../constants';


const AttachmentsModal = ({
	open, requestClose, company, council, translate, refetch
}) => {
	const { client } = React.useContext(MainContext);
	const primary = getPrimary();
	const secondary = getSecondary();
	const [message, setMessage] = React.useState('');
	const [companyDocumentsModal, setCompanyDocumentsModal] = React.useState(false);
	const [attachments, setAttachments] = React.useState([]);
	const [step, setStep] = React.useState(0);
	const [uploading, setUploading] = React.useState(null);
	const [errors, setErrors] = React.useState({});

	const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		const reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async loadEvent => {
			const fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: loadEvent.loaded,
				base64: btoa(loadEvent.target.result),
				councilId: council.id
			};


			setAttachments([...attachments, fileInfo]);
		};
	};

	const addCompanyDocumentCouncilAttachment = async id => {
		setAttachments([...attachments, id]);
		setCompanyDocumentsModal(false);
	};

	const validateForm = async () => {
		const newErrors = {};

		if (attachments.length === 0) {
			errors.attachments = translate.no_file_indicated;
		} else {
			const alreadyUsed = [];

			attachments.forEach(a => {
				const found = council.attachments.find(attachment => a.filename === attachment.filename);
				if (found) {
					alreadyUsed.push(a.filename);
				}
			});

			if (alreadyUsed.length > 0) {
				newErrors.repeatedAttachments = alreadyUsed;
			}
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return true;
		}

		return false;
	};

	const notifyAttachmentsAdded = async attachmentsAdded => {
		await client.mutate({
			mutation: gql`
				mutation NotifyAddedCouncilAttachments($councilId: Int!, $attachments: [Int], $message: String){
					notifyAddedCouncilAttachments(councilId: $councilId, attachments: $attachments, message: $message){
						success
					}
				}
			`,
			variables: {
				councilId: council.id,
				attachments: attachmentsAdded,
				message
			}
		});
		refetch();
		setStep(3);
	};

	const sendAttachments = async () => {
		if (!await validateForm()) {
			setStep(1);
			const addedAttachments = [];

			for (let i = 0; i < attachments.length; i++) {
				const attachment = attachments[i];
				setUploading(i);
				if (attachment.id) {
					// eslint-disable-next-line no-await-in-loop
					const response = await client.mutate({
						mutation: gql`
							mutation AttachCompanyDocumentToCouncil($councilId: Int!, $companyDocumentId: Int!){
								attachCompanyDocumentToCouncil(councilId: $councilId, companyDocumentId: $companyDocumentId){
									id
								}
							}
						`,
						variables: {
							councilId: council.id,
							companyDocumentId: attachment.id
						}
					});
					addedAttachments.push(response.data.attachCompanyDocumentToCouncil.id);
				} else {
					// eslint-disable-next-line no-await-in-loop
					const response = await client.mutate({
						mutation: addCouncilAttachment,
						variables: {
							attachment
						}
					});
					addedAttachments.push(response.data.addCouncilAttachment.id);
				}
			}

			setUploading(null);
			setStep(2);
			notifyAttachmentsAdded(addedAttachments);
		}
	};

	const resetAndClose = () => {
		requestClose();
		setStep(0);
		setAttachments([]);
		setMessage('');
	};

	const documentIsAlreadyUsed = filename => (errors.repeatedAttachments ? ((errors.repeatedAttachments.findIndex(item => item === filename) !== -1) ?
		translate.used_attachment_error
		: null) : null);

	const modalBody = () => {
		if (step === 1) {
			return (
				<>
					<div>
						{translate.uploading_files}
					</div>
					{attachments.length > 0 && (
						attachments.map((attachment, index) => (
							<AttachmentItem
								edit={false}
								icon={(uploading > index) && <i className="fa fa-check" style={{ color: 'green' }}/>}
								loading={index === uploading}
								key={`attachment${index}`}
								attachment={attachment}
								translate={translate}
							/>
						))
					)}
				</>
			);
		}

		if (step === 2) {
			return (
				<LoadingSection />
			);
		}

		if (step === 3) {
			return <SuccessMessage />;
		}

		return (
			<>
				<input
					type="file"
					id={'raised-button-file'}
					onChange={handleFile}
					accept={ACCEPTED_FILE_TYPES}
					// disabled={uploading}
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
				<DropDownMenu
					color="transparent"
					styleComponent={{ width: '' }}
					Component={() => <BasicButton
						color={primary}
						icon={<i className={'fa fa-plus'}
							style={{
								cursor: 'pointer',
								color: 'white',
								fontWeight: '700',
								paddingLeft: '5px'
							}}></i>}
						text={translate.add}
						textStyle={{
							color: 'white'
						}}
						buttonStyle={{
							width: '100%',
							marginBottom: '1em'
						}}
					/>
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
								<div style={{
									display: 'flex', color: 'black', padding: '.5em 0em', cursor: 'pointer'
								}}>
									<div style={{ paddingLeft: '10px' }}>
										{translate.upload_file}
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
								onClick={() => setCompanyDocumentsModal(true)}
							>
								<div style={{ paddingLeft: '10px' }} >
									{translate.my_documentation}
								</div>
							</div>
						</div>
					}
				/>
				{errors.attachments
&& <div style={{ color: 'red' }}>
	{errors.attachments}
</div>
				}
				{attachments.length > 0 && (
					attachments.map((attachment, index) => (
						<AttachmentItem
							edit={false}
							error={documentIsAlreadyUsed(attachment.filename)}
							loadingId={null}
							key={`attachment${index}`}
							attachment={attachment}
							translate={translate}
							icon={
								<CloseIcon
									style={{
										float: 'right',
										color: primary
									}}
									onClick={() => {
										attachments.splice(index, 1);
										setAttachments([...attachments]);
									}}
								/>
							}
						/>
					))
				)}
				<div style={{ marginTop: '1em' }}>
					<RichTextInput
						value={message}
						onChange={value => setMessage(value)}
					/>
				</div>

			</>
		);
	};

	return (
		<>
			<AlertConfirm
				open={open}
				title={translate.add}
				requestClose={resetAndClose}
				bodyText={modalBody()}
				loadingAction={step > 0 && step < 3}
				buttonAccept={translate.accept}
				acceptAction={step === 0 ? sendAttachments : resetAndClose}
			/>
			<CompanyDocumentsBrowser
				company={company}
				translate={translate}
				requestClose={() => setCompanyDocumentsModal(false)}
				open={companyDocumentsModal}
				action={file => addCompanyDocumentCouncilAttachment({
					...file,
					filename: file.name
				})}
				trigger={
					<div style={{ color: secondary }}>
						{translate.select}
					</div>
				}
			/>
		</>
	);
};


export default AttachmentsModal;
