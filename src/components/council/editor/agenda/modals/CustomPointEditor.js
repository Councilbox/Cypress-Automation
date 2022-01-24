import React from 'react';
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { AlertConfirm } from '../../../../../displayComponents';
import CustomPointForm from './CustomPointForm';
import { useValidateAgenda } from './NewCustomPointModal';
import DeleteAgendaButton from './DeleteAgendaButton';
import { addAgendaAttachment } from '../../../../../queries';


const CustomPointEditor = ({ translate, updateCustomAgenda, ...props }) => {
	const [agenda, setAgenda] = React.useState(cleanObject(props.agenda));
	const [attachments, setAttachments] = React.useState([...props.agenda.attachments] || []);
	const [attachmentsToRemove, setAttachmentsToRemove] = React.useState([]);
	const [errors, setErrors] = React.useState({});
	const [items, setItems] = React.useState(props.agenda.items.map(item => cleanObject(item)));
	const [options, setOptions] = React.useState({
		...cleanObject(props.agenda.options),
		multiselect: props.agenda.options.maxSelections > 1
	});
	const validateCustomAgenda = useValidateAgenda(translate, setErrors);

	const addCustomPoint = async () => {
		if (!validateCustomAgenda(items, options, agenda, attachments)) {
			const response = await updateCustomAgenda({
				variables: {
					agenda,
					items,
					options
				}
			});

			if (attachments.length > 0) {
				// eslint-disable-next-line no-underscore-dangle
				await Promise.all(attachments.filter(attachment => !attachment.__typename).map(attachment => {
					if (attachment.filename) {
						const fileInfo = {
							...attachment,
							state: 0,
							agendaId: props.agenda.id,
							councilId: props.council.id
						};

						return props.client.mutate({
							mutation: addAgendaAttachment,
							variables: {
								attachment: fileInfo
							}
						});
					}
					const fileInfo = {
						filename: attachment.name,
						filesize: attachment.filesize.toString(),
						documentId: attachment.id,
						filetype: attachment.filetype,
						state: 0,
						agendaId: props.agenda.id,
						councilId: props.council.id
					};

					return props.client.mutate({
						mutation: gql`
							mutation attachCompanyDocumentToAgenda($attachment: AgendaAttachmentInput){
								attachCompanyDocumentToAgenda(attachment: $attachment){
									id
								}
							}
						`,
						variables: {
							attachment: fileInfo
						}
					});
				}));
			}

			if (attachmentsToRemove.length > 0) {
				await Promise.all(attachmentsToRemove.map(item => props.client.mutate({
					mutation: gql`
						mutation deleteAgendaAttachment($attachmentId: Int!){
							deleteAgendaAttachment(attachmentId: $attachmentId){
								success
							}
						}
					`,
					variables: {
						attachmentId: item.id
					}
				})));
			}
			if (response) {
				await props.refetch();
				props.requestClose();
			}
		}
	};

	const addOption = () => {
		setItems([
			...items,
			{
				value: ''
			}
		]);
		setErrors({
			...errors,
			itemsLength: null
		});
	};

	const updateItem = (index, value) => {
		const newItems = [...items];
		newItems[index].value = value;
		setItems(newItems);
	};

	const removeItem = index => {
		const newItems = [...items];
		newItems.splice(index, 1);
		setItems(newItems);
	};

	const updateOptions = object => {
		setOptions({
			...options,
			...object
		});
	};

	const updateAgenda = object => {
		setAgenda({
			...agenda,
			...object
		});
	};

	const renderBody = () => (
		<div style={{
			marginTop: '1em',
			marginBottom: '2em',
			width: window.innerWidth > 720 ? '720px' : '100%',
			height: '100%',
			overflow: 'hidden'
		}}>
			<CustomPointForm
				{...{
					...props,
					agenda,
					attachments,
					options,
					items,
					errors,
					translate,
					updateAgenda,
					updateAttachments: setAttachments,
					deletedAttachments: attachmentsToRemove,
					setDeletedAttachments: setAttachmentsToRemove,
					updateItem,
					updateOptions,
					removeItem,
					addOption,
				}}
			/>
		</div>
	);

	return (
		<AlertConfirm
			requestClose={props.requestClose}
			open={props.open}
			acceptAction={addCustomPoint}
			buttonAccept={translate.accept}
			buttonCancel={translate.cancel}
			extraActions={
				props.deleteButton
				&& <DeleteAgendaButton
					agenda={agenda}
					refetch={props.refetch}
					requestClose={props.requestClose}
					council={props.council}
					translate={translate}
				/>
			}
			bodyText={renderBody()}
			title={translate.edit}
			bodyStyle={{
				height: 'calc(75vh - 64px)',
				overflow: 'hidden',
				width: '100%',
			}}
		/>
	);
};

const updateCustomAgenda = gql`
	mutation UpdateCustomAgenda($agenda: AgendaInput!, $options: PollOptionsInput!, $items: [PollItemInput]!){
		updateCustomAgenda(agenda: $agenda, options: $options, items: $items){
			id
			items {
				id
				value
			}
			options {
				id
				maxSelections
			}
		}
	}
`;


const cleanObject = object => {
	const {
		__typename, items, options, attachments, ballots, qualityVoteSense, votingsRecount, ...rest
	} = object;
	return rest;
};

export default graphql(updateCustomAgenda, {
	name: 'updateCustomAgenda'
})(withApollo(CustomPointEditor));
