import React from "react";
import {
	BasicButton,
	ButtonIcon,
	ErrorAlert,
	FileUploadButton,
	Grid,
	GridItem,
	LoadingSection,
	ProgressBar,
	DropDownMenu
} from "../../../../displayComponents/index";
import upload from '../../../../assets/img/upload.png';
import { getPrimary, getSecondary } from "../../../../styles/colors";
import { compose, graphql, withApollo } from "react-apollo";
import { MAX_FILE_SIZE } from "../../../../constants";
import { Typography } from "material-ui";
import AttachmentList from "../../../attachments/AttachmentList";
import { formatSize, showAddCouncilAttachment } from "../../../../utils/CBX";
import { addCouncilAttachment, councilStepFour, removeCouncilAttachment, updateCouncil } from "../../../../queries";
import EditorStepLayout from '../EditorStepLayout';
import gql from 'graphql-tag';
import CompanyDocumentsBrowser from "../../../company/drafts/documents/CompanyDocumentsBrowser";
import withSharedProps from "../../../../HOCs/withSharedProps";


const StepAttachments = ({ client, translate, ...props }) => {
	const [uploading, setUploading] = React.useState(false);
	const [data, setData] = React.useState(null);
	const [companyDocumentsModal, setCompanyDocumentsModal] = React.useState(false);
	const [loading, setLoading] = React.useState(true);
	const [state, setState] = React.useState({
		loading: false,
		success: false,
		alert: false
	});
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

		let totalSize = 0;
		if (attachments.length !== 0) {
			if (attachments.length > 1) {
				totalSize = attachments.reduce(
					(a, b) => a + +b.filesize / 1000,
					0
				);
			} else {
				totalSize = attachments[0].filesize / 1000;
			}
		}
		setTotalSize(totalSize);
		setLoading(false);

	}, [props.councilID]);

	React.useEffect(() => {
		getData();
	}, [getData]);


	const addCompanyDocumentCouncilAttachment = async id => {
		const response = await client.mutate({
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
		setCompanyDocumentsModal(false);
	}


	const handleFile = async event => {
		const file = event.nativeEvent.target.files[0];
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
		let reader = new FileReader();
		reader.readAsBinaryString(file);

		reader.onload = async event => {
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: event.loaded,
				base64: btoa(event.target.result),
				councilId: props.councilID
			};

			setUploading(true);
			const response = await props.addAttachment({
				variables: {
					attachment: fileInfo
				}
			});
			if (response) {
				getData();
				setUploading(false);
			}
		};
	};

	const removeCouncilAttachment = async attachmentID => {
		await props.removeCouncilAttachment({
			variables: {
				attachmentId: attachmentID,
				councilId: props.councilID
			}
		});
		getData();
	};

	const updateCouncil = async step => {
		setState({
			...state,
			loading: true
		})
		const { attachments, __typename, ...council } = data.council;
		await props.updateCouncil({
			variables: {
				council: {
					...council,
					step: step
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
		setUploading(false);
	}

	const nextPage = async () => {
		if (!uploading) {
			await updateCouncil(5);
			props.nextStep();
		}
	};

	let attachments = [];
	if(!loading){
		attachments = data.council.attachments;
	}

	return (
		<EditorStepLayout
			body={
				<React.Fragment>
					<Grid>
						<CompanyDocumentsBrowser
							company={props.company}
							translate={translate}
							open={companyDocumentsModal}
							action={file => addCompanyDocumentCouncilAttachment(file.id)}
							trigger={
								<div style={{ color: secondary }}>
									{translate.select}
								</div>
							}
						/>
						<GridItem xs={12} md={10} style={{marginTop: '0.5em'}}>
							<ProgressBar
								value={
									totalSize > 0
										? (totalSize / MAX_FILE_SIZE) *
										100
										: 0
								}
								color={secondary}
								style={{ height: "1.2em" }}
							/>

							<Typography variant="caption">
								{`${formatSize(totalSize * 1000)} (${translate.max}. 15Mb)`}
							</Typography>
						</GridItem>
						<GridItem xs={12} md={2}>
							{showAddCouncilAttachment(attachments) && (
								<>
									<input
										type="file"
										id={"raised-button-file"}
										onChange={handleFile}
										disabled={uploading}
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
								</>
							)}
						</GridItem>
					</Grid>

					{loading?
							<LoadingSection />
						:
						attachments.length > 0 && (
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
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						textPosition="after"
						onClick={props.previousStep}
					/>
					<BasicButton
						text={translate.save}
						color={secondary}
						loading={state.loading}
						success={state.success}
						reset={resetButtonStates}
						textStyle={{
							color: "white",
							fontWeight: "700",
							marginLeft: "0.5em",
							marginRight: "0.5em",
							fontSize: "0.9em",
							textTransform: "none"
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
							color: "white",
							fontWeight: "700",
							fontSize: "0.9em",
							textTransform: "none"
						}}
						textPosition="after"
						onClick={nextPage}
					/>
				</React.Fragment>
			}
		/>
	);
}

export default compose(
	withApollo,
	withSharedProps(),
	graphql(addCouncilAttachment, {
		name: "addAttachment"
	}),

	graphql(updateCouncil, {
		name: "updateCouncil"
	}),

	graphql(removeCouncilAttachment, {
		name: "removeCouncilAttachment"
	})
)(StepAttachments);
