import React from 'react';
import { graphql, withApollo } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import { Typography } from 'material-ui';
import gql from 'graphql-tag';
import {
	BasicButton,
	ButtonIcon,
	ErrorAlert,
	Grid,
	GridItem,
	LoadingSection,
	ProgressBar
} from '../../../../displayComponents/index';
import { getPrimary, getSecondary } from '../../../../styles/colors';
import { MAX_FILE_SIZE } from '../../../../constants';
import AttachmentList from '../../../attachments/AttachmentList';
import { formatSize, showAddCouncilAttachment } from '../../../../utils/CBX';
import {
	councilStepFour,
	updateCouncil as updateCouncilMutation
} from '../../../../queries';
import EditorStepLayout from '../EditorStepLayout';
import withSharedProps from '../../../../HOCs/withSharedProps';
import AddCouncilAttachmentButton from './AddCouncilAttachmentButton';
import { useCouncilAttachments } from '../../../../hooks/council';
import EditorStepper from '../EditorStepper';


const StepAttachments = ({ client, translate, step, ...props }) => {
	const [data, setData] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [state, setState] = React.useState({
		loading: false,
		success: false,
		alert: false
	});
	const {
		addCouncilAttachment,
		removeCouncilAttachment: removeAttachment,
		loading: uploading
	} = useCouncilAttachments({ client });
	const [totalSize, setTotalSize] = React.useState(0);
	const primary = getPrimary();
	const secondary = getSecondary();

	const getData = React.useCallback(async () => {
		const response = await client.query({
			query: councilStepFour,
			variables: {
				id: props.councilID
			}
		});

		setData(response.data);
		const { attachments } = response.data.council;

		let size = 0;
		if (attachments.length !== 0) {
			if (attachments.length > 1) {
				size = attachments.reduce(
					(a, b) => a + +b.filesize / 1000,
					0
				);
			} else {
				size = attachments[0].filesize / 1000;
			}
		}
		setTotalSize(size);
		setLoading(false);
	}, [props.councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);


	const addCompanyDocumentCouncilAttachment = async id => {
		await client.mutate({
			mutation: gql`
				mutation AttachCompanyDocumentToCouncil($councilId: Int!, $companyDocumentId: Int!){
					attachCompanyDocumentToCouncil(councilId: $councilId, companyDocumentId: $companyDocumentId){
						id
					}
				}
			`,
			variables: {
				councilId: props.councilID,
				companyDocumentId: id
			}
		});
		getData();
	};


	const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
		event.target.value = '';
		if (!file) {
			return;
		}
		if ((file.size / 1000 + totalSize) > MAX_FILE_SIZE) {
			setState({
				...state,
				alert: true
			});
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
				councilId: props.councilID
			};
			await addCouncilAttachment(fileInfo);
			getData();
		};
	};

	const removeCouncilAttachment = async attachmentID => {
		await removeAttachment({
			attachmentId: attachmentID,
			councilId: props.councilID
		});
		getData();
	};

	const updateCouncil = async stepIn => {
		setState({
			...state,
			loading: true
		});
		const { attachments, __typename, ...council } = data.council;
		await props.updateCouncil({
			variables: {
				council: {
					...council,
					stepIn
				}
			}
		});

		setState({
			...state,
			loading: false,
			success: true
		});
	};

	const resetButtonStates = () => {
		setState({
			...state,
			loading: false,
			success: false,
		});
	};

	const nextPage = async () => {
		if (!uploading) {
			await updateCouncil(5);
			props.nextStep();
		}
	};

	const previousPage = async () => {
		await updateCouncil(3);
		props.previousStep();
	};

	let attachments = [];
	if (!loading) {
		attachments = data.council.attachments;
	}

	return (
		<React.Fragment>
			<div
				style={{
					width: '100%',
					textAlign: 'center',
				}}
			>
				<div style={{
					marginBottom: '1.2em', marginTop: '0.8em', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem'
				}}>
					<EditorStepper
						translate={translate}
						active={step - 1}
						goToPage={nextPage}
						previousPage={previousPage}
					/>
				</div>
			</div>
			<EditorStepLayout
				body={
					<React.Fragment>
						<Grid>
							<GridItem xs={12} md={10} style={{ marginTop: '0.5em' }}>
								<ProgressBar
									value={
										totalSize > 0 ?
											(totalSize / MAX_FILE_SIZE)
											* 100
											: 0
									}
									color={secondary}
									style={{ height: '1.2em' }}
								/>

								<Typography variant="caption">
									{`${formatSize(totalSize * 1000)} (${translate.max}. 15Mb)`}
								</Typography>
							</GridItem>
							<GridItem xs={12} md={2}>
								{showAddCouncilAttachment(attachments) && (
									<>
										<AddCouncilAttachmentButton
											company={props.company}
											handleCompanyDocumentFile={file => addCompanyDocumentCouncilAttachment(file.id)}
											handleFile={handleFile}
											loading={uploading}
											translate={translate}
										/>
									</>
								)}
							</GridItem>
						</Grid>

						{loading ?
							<LoadingSection />
							: attachments.length > 0 && (
								<AttachmentList
									attachments={attachments}
									refetch={getData}
									deleteAction={removeCouncilAttachment}
									translate={translate}
								/>
							)
						}
						<ErrorAlert
							title={translate.error}
							bodyText={translate.file_exceeds_rest}
							open={state.alert}
							requestClose={() => setState({ ...state, alert: false })}
							buttonAccept={translate.accept}
						/>
					</React.Fragment>
				}
				buttons={
					<React.Fragment>
						<BasicButton
							text={translate.previous}
							disabled={uploading}
							color={secondary}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							textPosition="after"
							onClick={previousPage}
						/>
						<BasicButton
							text={translate.save}
							color={secondary}
							loading={state.loading}
							success={state.success}
							reset={resetButtonStates}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								marginLeft: '0.5em',
								marginRight: '0.5em',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							icon={<ButtonIcon color="white" type="save" />}
							textPosition="after"
							onClick={() => updateCouncil(4)}
						/>
						<BasicButton
							text={translate.next}
							loading={loading || uploading}
							id={'attachmentSiguienteNew'}
							loadingColor={'white'}
							color={primary}
							textStyle={{
								color: 'white',
								fontWeight: '700',
								fontSize: '0.9em',
								textTransform: 'none'
							}}
							textPosition="after"
							onClick={nextPage}
						/>
					</React.Fragment>
				}
			/>
		</React.Fragment >
	);
};

export default compose(
	withApollo,
	withSharedProps(),
	graphql(updateCouncilMutation, {
		name: 'updateCouncil'
	})
)(StepAttachments);
