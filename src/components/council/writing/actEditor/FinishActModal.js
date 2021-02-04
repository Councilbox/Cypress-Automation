import React from "react";
import { compose, graphql } from "react-apollo";
import Dropzone from 'react-dropzone';
import gql from 'graphql-tag';
import { Card } from 'material-ui';
import {
	AlertConfirm,
	BasicButton,
	Grid,
	GridItem
} from "../../../../displayComponents";
import { approveAct } from '../../../../queries';
import ActHTML from "../actViewer/ActHTML";
import { getSecondary } from "../../../../styles/colors";
import { useHoverRow, useOldState } from "../../../../hooks";
import logo from '../../../../assets/img/logo-icono.png';
import { isMobile } from "../../../../utils/screen";
import DocumentPreview from "../../../documentEditor/DocumentPreview";


const FinishActModal = ({ requestClose, updateAct, translate, preview, council, finishInModal, ...props }) => {
	const [state, setState] = useOldState({
		loading: false,
		step: 1,
		file: '',
		filename: '',
	});
	const secondary = getSecondary();
	const actViewer = React.useRef();


	const close = () => {
		setState({
			loading: false,
			step: 1,
			file: '',
		});
		requestClose();
	};

	const approveAct = async () => {
		setState({
			loading: true
		});
		await updateAct();
		const response = await props.approveAct({
			variables: {
				councilId: council.id,
				closeCouncil: props.liveMode
			}
		});

		if (response) {
			if (!response.data.errors) {
				setState({
					success: true,
					loading: false
				});
				props.refetch();
			}
		}
	}

	const approveActWithUserPDF = async () => {
		setState({
			loading: true
		});
		const response = await props.approveActUserPDF({
			variables: {
				councilId: council.id,
				base64: state.file,
				closeCouncil: props.liveMode
			}
		});

		if (!response.data.errors) {
			setState({
				loading: false,
				success: true
			});
			props.refetch();
		}

		setState({
			loading: false
		});
	}

	const goToDropZone = () => {
		setState({
			step: 2
		});
	}

	const setFile = (file, filename) => {
		setState({
			file,
			filename
		});
	}

	function _modalBody() {
		if(state.step === 2){
			if(state.file){
				return (
					<div>
						{state.filename}
					</div>
				)
			}

			return (
				<UploadAct
					council={council}
					setFile={setFile}
				/>
			)
		}

		return (
			<div style={{ marginTop: '12px', height: '100%', border: '1px solid gainsboro' }}>
				<DocumentPreview
					translate={translate}
					options={props.options}
					doc={props.doc}
					generatePreview={props.generatePreview}
					company={props.company}
					finishInModal={finishInModal}
				/>
			</div>
		);
	}

	return (
		<AlertConfirm
			bodyStyle={{ minWidth: "50vw", height: isMobile ? '26em' : "100%" }}
			requestClose={close}
			open={props.show}
			extraActions={state.step === 1 &&
				<BasicButton
					color="white"
					buttonStyle={{
						border: `1px solid ${secondary}`
					}}
					textStyle={{
						color: secondary
					}}
					text={translate.upload_pdf_act}
					onClick={goToDropZone}
				/>
			}
			acceptAction={state.step === 2 ? approveActWithUserPDF : approveAct}
			hideAccept={state.step === 2 && !state.file}
			loadingAction={state.loading}
			buttonAccept={state.step === 2 ? translate.send : translate.finish_and_aprove_act}
			buttonCancel={translate.close}
			bodyText={_modalBody()}
			title={translate.finish_and_aprove_act}
		/>
	);
}

const UploadAct = ({ ...props }) => {
	const [error, setError] = React.useState('');

	const onDrop = (accepted, rejected) => {
		if (accepted.length === 0) {
			setError('Tipo de archivo no válido, solo son admiten archivos PDF'/*TRADUCCION*/);
			return;
		}
		handleFile(accepted[0]);
	}

	const handleFile = file => {
		const reader = new FileReader();
		reader.readAsDataURL(file);

		/*TODO ADD LIMIT TO FILE*/

		reader.onload = async () => {
			props.setFile(reader.result, file.name);
		};
	}

	return (
		<Dropzone
			onDrop={onDrop}
			multiple={false}
			accept="application/pdf"
		>
			{({ getRootProps, getInputProps, isDragActive }) => (
					<div
						{...getRootProps()}
						className={`dropzone`}
						style={{
							height: '8em',
							border: '2px dashed gainsboro',
							borderRadius: '3px',
							padding: '0.6em',
							...(error ? dropzoneStyles.invalid : {}),
							...(isDragActive ? dropzoneStyles.active : {})
						}}
					>
						<input {...getInputProps()} />
						{error || (isDragActive ?
								<p>Arrastre los archivos aquí</p>//TRADUCCION
								:
								<p>Arrastre el archivo o haga click para seleccionarlo.</p>)
						}
					</div>
				)}
		</Dropzone>
	)
}


const dropzoneStyles = {
	active: {
		border: '2px dashed turquoise'
	},

	invalid: {
		border: '2px dashed red',
		color: 'red'
	}
}

export const approveActUserPDF = gql`
	mutation ApproveActUserPDF($base64: String!, $councilId: Int!, $closeCouncil: Boolean) {
		approveCouncilActUserPDF(base64: $base64, councilId: $councilId, closeCouncil: $closeCouncil) {
			success
			message
		}
	}
`;

export default compose(
	graphql(approveAct, {
		name: 'approveAct'
	}),
	graphql(approveActUserPDF, {
		name: 'approveActUserPDF'
	})
)(FinishActModal);
