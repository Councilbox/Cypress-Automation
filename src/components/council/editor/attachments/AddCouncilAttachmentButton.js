import React from 'react';
import { ACCEPTED_FILE_TYPES } from '../../../../constants';
import { BasicButton, DropDownMenu } from '../../../../displayComponents';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import CompanyDocumentsBrowser from '../../../company/drafts/documents/CompanyDocumentsBrowser';

const AddCouncilAttachmentButton = ({
	handleFile,
	company,
	loading,
	translate,
	text,
	handleCompanyDocumentFile
}) => {
	const primary = getPrimary();
	const secondary = getSecondary();
	const [companyDocumentsModal, setCompanyDocumentsModal] = React.useState(false);

	const buttonLabel = text || translate.add;

	return (
		<>
			<input
				type="file"
				id={'raised-button-file'}
				accept={ACCEPTED_FILE_TYPES}
				onChange={handleFile}
				disabled={loading}
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
			<CompanyDocumentsBrowser
				company={company}
				translate={translate}
				requestClose={() => setCompanyDocumentsModal(false)}
				open={companyDocumentsModal}
				action={async file => {
					await handleCompanyDocumentFile(file);
					setCompanyDocumentsModal(false);
				}}
				trigger={
					<div style={{ color: secondary }}>
						{translate.select}
					</div>
				}
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
					text={buttonLabel}
					textStyle={{
						color: 'white'
					}}
					buttonStyle={{
						width: '100%'
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
		</>
	);
};

export default AddCouncilAttachmentButton;
