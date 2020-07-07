import React from 'react';
import gql from 'graphql-tag';
import { MainContext } from '../../../containers/App';
import { AlertConfirm, DropDownMenu, BasicButton } from '../../../displayComponents';
import { getPrimary, getSecondary } from '../../../styles/colors';
import { addCouncilAttachment } from '../../../queries';
import CompanyDocumentsBrowser from '../../company/drafts/documents/CompanyDocumentsBrowser';
import AttachmentList from '../../attachments/AttachmentList';
import AttachmentItem from '../../attachments/AttachmentItem';


const AttachmentsModal = ({ open, requestClose, company, council, translate, refetch }) => {
    const { client } = React.useContext(MainContext);
    const primary = getPrimary();
    const secondary = getSecondary();
    const [companyDocumentsModal, setCompanyDocumentsModal] = React.useState(false);
    const [addedAttachments, setAddedAttachments] = React.useState([]);
    const [step, setStep] = React.useState(0);
    const [uploading, setUploading] = React.useState(null);

    const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		// if ((file.size / 1000 + totalSize) > MAX_FILE_SIZE) {
		// 	setState({
		// 		...state,
		// 		alert: true
		// 	});
		// 	return;
		// }
		let reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async event => {
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: event.loaded,
				base64: btoa(event.target.result),
				councilId: council.id
			};

			//setUploading(true);
			// const response = await client.mutate({
            //     mutation: addCouncilAttachment,
			// 	variables: {
			// 		attachment: fileInfo
			// 	}
			// });
			//if (response) {
                setAddedAttachments([...addedAttachments, fileInfo]);
				//getData();
				//setUploading(false);
			//}
		};
    };

    const addCompanyDocumentCouncilAttachment = async id => {
        setAddedAttachments([...addedAttachments, id]);
        setCompanyDocumentsModal(false);

		// const response = await client.mutate({
		// 	mutation: gql`
		// 		mutation AttachCompanyDocumentToCouncil($councilId: Int!, $companyDocumentId: Int!){
		// 			attachCompanyDocumentToCouncil(councilId: $councilId, companyDocumentId: $companyDocumentId){
		// 				success
		// 			}
		// 		}
		// 	`,
		// 	variables: {
		// 		councilId: props.councilID,
		// 		companyDocumentId: id
		// 	}
		// });
		// getData();
		// setCompanyDocumentsModal(false);
    }

    const sendAttachments = async () => {
        setStep(1);

        for(let i = 0; i < addedAttachments.length; i++){
            setUploading(i);
            const result = await new Promise(resolve => {
                setTimeout(() => resolve('prueba'), 5000);
            })
        }

        setUploading(null);
        setStep(2);

    }


    const modalBody = () => {
        if(step === 1){
            return (
                <>
                    <div>
                        Subiendo archivos
                    </div>
                    {addedAttachments.length > 0 && (
                        addedAttachments.map((attachment, index) => (
                            <AttachmentItem
                                edit={false}
                                icon={uploading > index && <i className="fa fa-check" style={{color: 'green'}}/>}
                                loading={index === uploading}
                                key={`attachment${index}`}
                                attachment={attachment}
                                translate={translate}
                            />
                        ))
                    )}
                </>
            )
        }

        if(step === 2){
            return (
                'Enviando notificación'
            )
        }

        return (
            <>
                <input
                    type="file"
                    id={"raised-button-file"}
                    onChange={handleFile}
                    //disabled={uploading}
                    style={{
                        cursor: "pointer",
                        position: "absolute",
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
                    styleComponent={{ width: "" }}
                    Component={() =>
                        <BasicButton
                            color={primary}
                            icon={<i className={"fa fa-plus"}
                            style={{
                                cursor: 'pointer',
                                color: 'white',
                                fontWeight: '700',
                                paddingLeft: "5px"
                            }}></i>}
                            text={translate.add}
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
                        <div style={{ padding: "1em" }}>
                            <label htmlFor="raised-button-file">
                                <div style={{ display: "flex", color: "black", padding: ".5em 0em", cursor: "pointer" }}>
                                    <div style={{ paddingLeft: "10px" }}>
                                        {translate.upload_file}
                                    </div>
                                </div>
                            </label>
                        <div
                            style={{
                                display: "flex",
                                color: "black",
                                padding: ".5em 0em",
                                borderTop: "1px solid" + primary,
                                cursor: "pointer"
                            }}
                            onClick={() => setCompanyDocumentsModal(true)}
                        >
                            <div style={{ paddingLeft: "10px" }} >
                                {translate.my_documentation}
                            </div>
                        </div>
                    </div>
                    }
                />
                {addedAttachments.length > 0 && (
                    addedAttachments.map((attachment, index) => (
                        <AttachmentItem
                            edit={false}
                            loadingId={null}
                            key={`attachment${index}`}
                            attachment={attachment}
                            translate={translate}
                            //loadingId={this.props.loadingId}
                            //removeAttachment={this.deleteAttachment}
                            // editName={() => {
                            //     this.editIndex(index);
                            // }}
                        />
                    ))
                )}
            </>
        )
    }

    return (
        <>
            <AlertConfirm
                open={open}
                title={translate.add}
                requestClose={requestClose}
                bodyText={modalBody()}
                buttonAccept={translate.accept}
                acceptAction={sendAttachments}
            />
            <CompanyDocumentsBrowser
                company={company}
                translate={translate}
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
    )
}


export default AttachmentsModal;