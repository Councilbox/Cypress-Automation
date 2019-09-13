import React from "react";
import {
	AlertConfirm,
	Grid,
	GridItem
} from "../../../../displayComponents";
import { compose, graphql } from "react-apollo";
import { approveAct } from '../../../../queries';
import ActHTML from "../actViewer/ActHTML";
import Dropzone from 'react-dropzone';
import gql from 'graphql-tag';
import { getSecondary } from "../../../../styles/colors";
import { useHoverRow, useOldState } from "../../../../hooks";
import { Card } from 'material-ui';
import logo from '../../../../assets/img/logo-icono.png';
import { isMobile } from "react-device-detect";


const FinishActModal = ({ requestClose, translate, council, ...props }) => {
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
		const response = await props.approveAct({
			variables: {
				councilId: council.id,
				closeCouncil: props.liveMode
			}
		});

		if (!!response) {
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

	const goToCBXAct = () => {
		setState({
			step: 2
		});
	}

	const goToDropZone = () => {
		setState({
			step: 3
		});
	}

	const setFile = (file, filename) => {
		setState({
			file,
			filename
		});
	}

	function _modalBody() {

		return (
			<div style={{marginTop: '12px'}}>
				{props.show &&
					props.config.exportActToWord ?
					<React.Fragment>
						{state.step === 1 &&
							<Grid style={{ marginTop: "5px", height: '12em', justifyContent: 'center', alignItems: 'center' }}>
								<GridItem xs={12} md={5} lg={5} style={{ height: "100%", }} >
									<ButtonInModal
										click={goToDropZone}
										img={<i className="fa fa-upload" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
										body={'Subir acta en PDF'}
									/>
								</GridItem>
								<GridItem xs={12} md={1} lg={1}></GridItem>
								<GridItem xs={12} md={5} lg={5} style={{ height: "100%" }} >
									<ButtonInModal
										click={goToCBXAct}
										img={<img src={logo} alt="councilbox_icon" style={{ height: '4em', width: 'auto' }} />}
										body={'Usar acta generada por Councilbox'}
									/>
								</GridItem>
							</Grid>

						}
						{state.step === 2 &&
							<ActHTML
								key="preview"
								ref={actViewer}
								council={council}
							/>
						}
						{state.step === 3 &&
							<div>
								{state.file ?
									<div>
										{state.filename}
									</div>
									:
									<UploadAct council={council} setFile={setFile} />
								}
							</div>
						}
					</React.Fragment>
					:
					<ActHTML
						ref={actViewer}
						council={council}
					/>
				}
			</div>
		);
	}

	return (
		<AlertConfirm
			bodyStyle={{ minWidth: "50vw", height: isMobile ? '26em' : "" }}
			requestClose={close}
			open={props.show}
			{...(props.config.exportActToWord ?
				{
					hideAccept: state.step === 1 || (state.step === 3 && !state.file),
					acceptAction: state.step === 3 ? approveActWithUserPDF : approveAct
				}
				:
				{ acceptAction: approveAct }
			)}
			loadingAction={state.loading}
			buttonAccept={translate.finish_and_aprove_act}
			buttonCancel={translate.close}
			bodyText={_modalBody()}
			title={translate.finish_and_aprove_act}
		/>
	);


}

const ButtonInModal = ({ body, img, click }) => {
	const [showActions, handlers] = useHoverRow();

	return (
		<Card
			elevation={5}
			onClick={click}
			style={{
				height: "100%",
				cursor: "pointer",
				textAlign: "center",
				padding: "25px",
				background: showActions ? "gainsboro" : ""
			}}
			{...handlers}
		>
			<div style={{ textAlign: "center", marginBottom: '1.6em' }}>
				{img}
			</div>
			<div style={{fontSize: "1.1em"}}>
				{body}
			</div>
		</Card>
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

		let reader = new FileReader();
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
			{({ getRootProps, getInputProps, isDragActive }) => {
				return (
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
						{error ?
							error

							:
							isDragActive ?
								<p>Arrastre los archivos aquí</p>//TRADUCCION
								:
								<p>Arrastre el archivo o haga click para seleccionarlo.</p>
						}
					</div>
				)
			}}
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
