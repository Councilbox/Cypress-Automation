import gql from 'graphql-tag';
import { Input } from 'material-ui';
import React from 'react';
import { withApollo } from 'react-apollo';
import { AlertConfirm, BasicButton, ButtonIcon, DropDownMenu, SuccessMessage } from '../../../displayComponents';
import RichTextInput from '../../../displayComponents/RichTextInput';
import withSharedProps from '../../../HOCs/withSharedProps';
import { useOldState } from '../../../hooks';
import { getPrimary } from '../../../styles/colors';
import AttachmentItem from '../../attachments/AttachmentItem';


const SendMessageToParticipant = ({ participantId, translate, council, open, requestClose, client, user }) => {
    const [status, setStatus] = React.useState('IDDLE');
    const [state, setState] = useOldState({
        subject: '',
        body: ''
    });
    const [attachments, setAttachments] = React.useState([]);
    const primary = getPrimary();

    const send = async () => {
        setStatus('LOADING');
        await client.mutate({
            mutation: gql`
                mutation SendEmailtoParticipant($participantId: Int!, $message: AdminMessageInput, $attachments: [SendAttachmentInput]){
                    sendEmailtoParticipant(participantId: $participantId, message: $message, attachments: $attachments){
                        success
                    }
                }
            `,
            variables: {
                participantId,
                message: {
                    subject: state.subject,
                    body: state.body,
                    replyTo: user.email
                },
                attachments
            }
        });

        setStatus('SUCCESS')
    }

    console.log(attachments);

    const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		if (!file) {
			return;
		}
		let reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async event => {
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: ''+event.loaded,
				base64: btoa(event.target.result)
            };
            setAttachments([...attachments, fileInfo]);
		};
    };

    return (
        <AlertConfirm
            open={open}
            title={translate.send_message}
            requestClose={() => {
                setStatus('IDDLE');
                requestClose();
            }}
            bodyText={
                <>
                    {status === 'SUCCESS' ?
                        <SuccessMessage
                            message={translate.sent}
                        />
                    :
                        <>
                            <div style={{ marginTop: "1em" }}>
                                <div style={{ fontWeight: "bold" }}>{translate.title}</div>
                                <Input
                                    placeholder={translate.title}
                                    disableUnderline={true}
                                    id={"titleDraft"}
                                    style={{
                                        color: "rgba(0, 0, 0, 0.65)",
                                        fontSize: '15px',
                                        boxShadow: '0 2px 1px 0 rgba(0, 0, 0, 0.25)',
                                        //border: !!errors.subject ? "1px solid red" : "1px solid #d7d7d7",
                                        width: "100%",
                                        padding: '.5em 1.6em',
                                        marginTop: "1em"
                                    }}
                                    value={state.subject}
                                    onChange={event => setState({ subject: event.target.value })}
                                    //classes={{ input: props.classes.input }}
                                    //error={!!errors.subject}
                                >
                                </Input>
                            </div>
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
                                        //onClick={() => setCompanyDocumentsModal(true)}
                                    >
                                        <div style={{ paddingLeft: "10px" }} >
                                            {translate.my_documentation}
                                        </div>
                                    </div>
                                </div>
                                }
                            />
                            {attachments.length > 0 && (
                                attachments.map((attachment, index) => (
                                    <AttachmentItem
                                        edit={false}
                                        icon={<i className="fa fa-check" style={{color: 'green'}}/>}
                                        //loading={index === uploading}
                                        key={`attachment${index}`}
                                        attachment={attachment}
                                        translate={translate}
                                    />
                                ))
                            )}
                            <div style={{ marginTop: "1em" }}>
                                <div style={{ marginBottom: "1em", fontWeight: "bold" }}>{translate.message}</div>
                                <RichTextInput
                                    value={state.body}
                                    onChange={value => setState({ body: value })}
                                    //errorText={errors.body}
                                />
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: '0.6em' }}>
                                <BasicButton
                                    text={translate.send}
                                    color={primary}
                                    loading={status === 'LOADING'}
                                    onClick={send}
                                    icon={<ButtonIcon type="send" />}
                                    textStyle={{ color: 'white' }}
                                />
                            </div>

                        </>

                    }
                </>
            }
        />
    )
}

export default withSharedProps()(withApollo(SendMessageToParticipant))