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
import { darkGrey, getSecondary } from "../../../../styles/colors";
import { Card, MenuItem } from 'material-ui';
import logo from '../../../../assets/img/logo-icono.png';
import { isMobile } from "react-device-detect";



class FinishActModal extends React.Component {

	state = {
		loading: false,
		step: 1,
		file: '',
		filename: '',
	}

	close = () => {
		this.setState({
			loading: false,
			step: 1,
			file: '',
		});
		this.props.requestClose();
	};

	approveAct = async () => {
		this.setState({
			loading: true
		});
		const response = await this.props.approveAct({
			variables: {
				councilId: this.props.council.id,
				closeCouncil: this.props.liveMode
			}
		});

		if (!!response) {
			if (!response.data.errors) {
				this.setState({
					success: true,
					loading: false
				});
				this.props.refetch();
			}
		}
	}

	approveActWithUserPDF = async () => {
		this.setState({
			loading: true
		});
		const response = await this.props.approveActUserPDF({
			variables: {
				councilId: this.props.council.id,
				base64: this.state.file
			}
		});

		if (!response.data.errors) {
			this.setState({
				loading: false,
				success: true
			});
			this.props.refetch();
		}

		this.setState({
			loading: false
		});
	}


	goToCBXAct = () => {
		this.setState({
			step: 2
		});
	}

	goToDropZone = () => {
		this.setState({
			step: 3
		});
	}

	setFile = (file, filename) => {
		this.setState({
			file,
			filename
		});
	}


	_modalBody() {
		const secondary = getSecondary();

		return (
			<div style={{marginTop: '12px'}}>
				{this.props.show &&
					this.props.config.exportActToWord ?
					<React.Fragment>
						{this.state.step === 1 &&
							<Grid style={{ marginTop: "5px", height: '12em', justifyContent: 'center', alignItems: 'center' }}>
								<GridItem xs={12} md={5} lg={5} style={{ height: "100%", }} >
									<ButtonInModal
										click={this.goToDropZone}
										img={<i className="fa fa-upload" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
										body={'Subir acta en PDF'}
									/>
								</GridItem>
								<GridItem xs={12} md={1} lg={1}></GridItem>
								<GridItem xs={12} md={5} lg={5} style={{ height: "100%" }} >
									<ButtonInModal
										click={this.goToCBXAct}
										img={<img src={logo} style={{ height: '4em', width: 'auto' }} />}
										body={'Usar acta generada por Councilbox'}
									/>
								</GridItem>
							</Grid>

						}
						{this.state.step === 2 &&
							<ActHTML
								ref={(ref => this.actViewer = ref)}
								council={this.props.council}
							/>
						}
						{this.state.step === 3 &&
							<div>
								{this.state.file ?
									<div>
										{this.state.filename}
									</div>
									:
									<UploadAct council={this.props.council} setFile={this.setFile} />
								}
							</div>
						}
					</React.Fragment>
					:
					<ActHTML
						ref={(ref => this.actViewer = ref)}
						council={this.props.council}
					/>
				}
			</div>
		);
	}

	render() {
		const { translate } = this.props;

		return (
			<AlertConfirm
				bodyStyle={{ minWidth: "50vw", height: isMobile ? '26em' : "" }}
				requestClose={this.close}
				open={this.props.show}
				{...(this.props.config.exportActToWord ?
					{
						hideAccept: this.state.step === 1 || (this.state.step === 3 && !this.state.file),
						acceptAction: this.state.step === 3 ? this.approveActWithUserPDF : this.approveAct
					}
					:
					{ acceptAction: this.approveAct }
				)}
				loadingAction={this.state.loading}
				buttonAccept={translate.finish_and_aprove_act}
				buttonCancel={translate.close}
				bodyText={this._modalBody()}
				title={translate.finish_and_aprove_act}
			/>
		);
	}
}

const Block = ({ text, icon, onClick, color = darkGrey }) => {

	return (
		<Card
			onClick={onClick}
			style={{
				backgroundColor: color,
				color: 'white',
				cursor: 'pointer',
				display: 'flex',
				flexDirection: 'column',
				padding: '0.6em',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			{icon && icon}
			{text}
		</Card>
	)
}

class ButtonInModal extends React.Component {
	state = {
		showActions: false
	}

	mouseEnterHandler = () => {
		this.setState({
			showActions: true
		})
	}

	mouseLeaveHandler = () => {
		this.setState({
			showActions: false
		})
	}
	render() {
		const { body, img, click } = this.props;
		return (
			<Card elevation={5} onClick={click} style={{ height: "100%", cursor: "pointer", textAlign: "center", padding: "25px", background: this.state.showActions ? "gainsboro" : "" }} onMouseOver={this.mouseEnterHandler} onMouseLeave={this.mouseLeaveHandler} >
				<div style={{ textAlign: "center", marginBottom: '1.6em' }}>
					{img}
				</div>
				<div>
					{body}
				</div>
			</Card>
		);
	}

}

class UploadAct extends React.Component {

	state = {
		error: ''
	}

	onDrop = (accepted, rejected) => {
		if (accepted.length === 0) {
			this.setState({
				error: 'Tipo de archivo no válido, solo son admiten archivos PDF'//TRADUCCION
			});
			return;
		}

		this.handleFile(accepted[0]);
	}

	handleFile = file => {

		let reader = new FileReader();
		reader.readAsDataURL(file);

		reader.onload = async () => {
			let fileInfo = {
				filename: file.name,
				filetype: file.type,
				filesize: Math.round(file.size / 1000),
				base64: reader.result,
				councilId: this.props.councilID
			};
			this.props.setFile(reader.result, file.name);
		};
	};



	render() {
		return (
			<Dropzone
				onDrop={this.onDrop}
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
								...(this.state.error ? dropzoneStyles.invalid : {}),
								...(isDragActive ? dropzoneStyles.active : {})
							}}
						>
							<input {...getInputProps()} />
							{this.state.error ?
								this.state.error

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
	mutation ApproveActUserPDF($base64: String!, $councilId: Int!) {
		approveCouncilActUserPDF(base64: $base64, councilId: $councilId) {
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
