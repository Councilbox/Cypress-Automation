import React from "react";
import { connect } from "react-redux";
import { LoadingMainApp, LiveToast, AlertConfirm, Scrollbar } from "../../displayComponents";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { bHistory } from "../../containers/App";
import { ConfigContext } from '../../containers/AppControl';
import { toast } from 'react-toastify';
import { getSecondary, getPrimary } from "../../styles/colors";
import CreateWithSession from "./CreateWithSession";
import CreateWithoutSession from "./CreateWithoutSession";
import { checkSecondDateAfterFirst } from "../../utils/CBX";
import { Paper } from "material-ui";
import { useHoverRow } from "../../hooks";
import { sendGAevent } from '../../utils/analytics';
import withSharedProps from "../../HOCs/withSharedProps";
import { isMobile } from "../../utils/screen";
import emptyMeetingTable from "../../assets/img/empty_meeting_table.png";
import conSesionIcon from "../../assets/img/con-sesion-icon.svg";
import consejoSinSesion from "../../assets/img/consejo-sin-sesion-icon.svg";
import elecciones from "../../assets/img/elecciones.svg";
import admin from '../../assets/img/admin.svg';
import sinSesionIcon from '../../assets/img/sin-sesion-icon.svg';
import { Collapse } from "material-ui";



const CreateCouncil = props => {
	const [state, setState] = React.useState({
		creating: false
	});

	const config = React.useContext(ConfigContext);

	React.useEffect(() => {
		if (!config.newCreateFlow) {
			createCouncilOneStep();
		}
	});

	const createCouncilOneStep = async () => {
		if (props.match.url === `/company/${props.match.params.company}/council/new` && !state.creating) {
			setState({
				creating: true
			});
			let newCouncilId = await createCouncil(
				props.match.params.company
			);
			if (newCouncilId) {
				sendGAevent({
					category: "Reuniones",
					action: "Creación reunión con sesión",
					label: props.company.businessName
				});
				bHistory.replace(`/company/${props.match.params.company}/council/${newCouncilId}`);
			} else {
				bHistory.replace(`/company/${props.match.params.company}`);
				toast(
					<LiveToast
						message={props.translate.no_statutes}
					/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				}
				);
			}
		}
	}


	const createCouncil = async companyId => {
		const response = await props.createCouncil({
			variables: {
				companyId: companyId
			}
		});
		if (response.data.createCouncil) {
			return response.data.createCouncil.id;
		} else {
			return null;
		}
	}

	return (
		config.newCreateFlow ?
			<CreateCouncilModal
				history={props.history}
				createCouncil={props.createCouncil}
				company={props.company}
				translate={props.translate}
				config={config}
			/>
			:
			<LoadingMainApp />
	);
}

const steps = {
	NO_SESSION: 'NO_SESSION',
	COUNCIL: 'COUNCIL',
	HYBRID_VOTING: 'HYBRID_VOTING',
	BOARD_NO_SESSION: 'BOARD_NO_SESSION'
}

const secondary = getSecondary();

const CreateCouncilModal = ({ history, company, createCouncil, translate, config }) => {
	const [options, setOptions] = React.useState(null);
	const [step, setStep] = React.useState(1);
	const [errors, setErrors] = React.useState({});
	const [creating, setCreating] = React.useState(false);
	const [title, setTitle] = React.useState("Seleccionar tipo de reunión");//TRADUCCION


	const sendCreateCouncil = async type => {
		if (!checkRequiredFields(type) && !creating) {
			setCreating(true);
			const response = await createCouncil({
				variables: {
					companyId: company.id,
					type,
					councilOptions: options
				}
			});
			const newCouncilId = response.data.createCouncil.id;
			if (newCouncilId) {
				sendGAevent({
					category: "Reuniones",
					action: "Creación reunión con sesión",
					label: company.businessName
				});
				setCreating(false);
				bHistory.replace(`/company/${company.id}/council/${newCouncilId}`);
			} else {
				bHistory.replace(`/company/${company.id}`);
				toast(
					<LiveToast
						message={translate.no_statutes}
					/>, {
					position: toast.POSITION.TOP_RIGHT,
					autoClose: true,
					className: "errorToast"
				}
				);
			}
		}
	}

	const checkRequiredFields = type => {
		let hasError = false;
		let errors = {}

		if (type !== 0 && type !== 4) {
			if (!options.dateStart) {
				hasError = true;
				errors.dateStart = translate.required_field;
			}
			if (!options.closeDate) {
				hasError = true;
				errors.closeDate = translate.required_field;
			}

			if (options.dateStart && options.closeDate) {
				if (!checkSecondDateAfterFirst(options.dateStart, options.closeDate)) {
					hasError = true;
					errors.errorMessage = 'La fecha de fin no puede ser anterior a la fecha de comienzo.';//TRADUCCION
				}
			}
		}

		setErrors(errors);

		return hasError;
	}

	const councilStep = () => {
		sendCreateCouncil(0);
	}

	const noSessionStep = () => {
		setStep(steps.NO_SESSION);
	}

	const noSessionHybridStep = () => {
		setStep(steps.HYBRID_VOTING);
	}

	const boardWithoutSessionStep = () => {
		sendCreateCouncil(4);
	}

	return (
		<AlertConfirm
			open={true}
			widthModal={{ borderRadius: "8px", }}
			// title={title}
			//bodyStyle={{ maxWidth: isMobile ? "" : "75vw" }}
			bodyStyle={{ overflow: "hidden" }}
			PaperProps={{
				style: {
					width: '100%',
					height: '100%',
				}
			}}
			bodyText={
				<div style={{ height: "100%", }}>
					<Scrollbar>
						<div style={{ margin: "2em", }}>
							{step === 1 &&
								<div style={{ height: "100%" }}>
									<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5em" }}>
										{/* TRADUCCION */}
										<div style={{ display: "flex" }}>
											<div style={{ color: getPrimary(), fontSize: "24px", fontStyle: "italic" }}>¿Qué tipo de reunión desea celebrar?</div>
											<div style={{ display: "flex", justifyContent: 'center', textAlign: 'center', marginLeft: "15px" }}>
												<img src={emptyMeetingTable} style={{ width: '70px', }} alt="empty-table" />
											</div>
										</div>
										<div style={{ color: "black", cursor: "pointer", }} onClick={() => setStep(10)}>
											<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
												<i className="material-icons" style={{ color: getPrimary(), fontSize: '14px', paddingRight: "0.3em", marginTop: "4px" }} >
													help
                    			</i>
								¿Qué diferencias hay entre los tipos de reunión?
							</div>
										</div>
									</div>
									<div style={{ height: "100%" }}>

										<ButtonCreateCouncil
											onClick={councilStep}
											title={'Con sesión'}
											styleButton={{ marginRight: "3%" }}
											icon={<img src={conSesionIcon}></img>}
											// icon={<i className="fa fa-users" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
											isMobile={isMobile}
											list={
												<div>Reunión por defecto con videollamada. Se necesita un administrador e incluye petición de palabra.</div>
											}
										/>
										<ButtonCreateCouncil
											onClick={noSessionStep}
											title={'Sin sesión'}
											styleButton={{ marginRight: "3%" }}
											icon={<img src={sinSesionIcon}></img>}
											// icon={<i className="fa fa-list-ol" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
											isMobile={isMobile}
											list={
												<div>Reunión automática con apertura de votaciones para los convocados. Sin administrador y con límite de tiempo.</div>
											}
										/>
										{config['boardWithoutSession'] &&
											<ButtonCreateCouncil
												onClick={boardWithoutSessionStep}
												title={'Consejo sin sesión'}
												styleButton={{ marginRight: "3%" }}
												icon={<img src={consejoSinSesion}></img>}
												// icon={<i className="fa fa-envelope" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
												isMobile={isMobile}
												list={
													<div>Reunión sin sesión con acuerdos por escrito, sin convocatoria, con carta de voto y con aprobación de todos los consejeros (artículo 248.2 de la Ley de Sociedades de Capital)</div>
												}
											/>
										}
										{config['2stepsCouncil'] &&
											<ButtonCreateCouncil
												onClick={noSessionHybridStep}
												title={'Elecciones'}
												icon={<img src={elecciones}></img>}
												// icon={<i className="fa fa-list-alt" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
												isMobile={isMobile}
												list={
													<div>Reunión con votación remota temporal y que permite votación presencial. Requiere de un administrador</div>
												}
											/>
										}
									</div>
								</div>
							}
							{step === 10 &&
								<div style={{ height: "100%" }}>
									<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", }}>
										<div onClick={() => setStep(1)} style={{ color: getSecondary(), cursor: "pointer", paddingBottom: "1em" }}>
											{/* TRADUCCION */}
									Volver
								</div>
									</div>
									<ButtonInfoCouncil
										title={'Con sesión'}
										styleButton={{ marginRight: "3%" }}
										icon={<img src={conSesionIcon} style={{ width: "100%" }}></img>}
										// icon={<i className="fa fa-users" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
										isMobile={isMobile}
										infoExtra={
											<div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
												<div style={{ width: "35px", paddingRight: "15px" }}>
													<img src={admin} style={{ width: "100%" }} ></img>
												</div>
										Requiere un administrador que gestione la sesión
									</div>
										}
										list={
											<div>
												Cualquier tipo de reunión con sesión: puede ser presencial,  por videoconferencia segura con turnos de palabra o combinando ambas. Se puede gestionar convocatoria, asistencia, votaciones, redacción automática de acta y firma de documentos.
									</div>
										}
									/>
									<ButtonInfoCouncil
										title={'Sin sesión'}
										styleButton={{ marginRight: "3%" }}
										icon={<img src={sinSesionIcon} style={{ width: "100%" }}></img>}
										// icon={<i className="fa fa-list-ol" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
										isMobile={isMobile}
										list={
											<div>Reunión automática con apertura de votaciones para los convocados. Sin administrador y con límite de tiempo.  </div>
										}
									/>
									{config['boardWithoutSession'] &&
										<ButtonInfoCouncil
											title={'Consejo sin sesión'}
											styleButton={{ marginRight: "3%" }}
											icon={<img src={consejoSinSesion} style={{ width: "100%" }}></img>}
											// icon={<i className="fa fa-envelope" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
											isMobile={isMobile}
											list={
												<div>Reunión sin sesión con acuerdos por escrito, sin convocatoria, con carta de voto y con aprobación de todos los consejeros (artículo 248.2 de la Ley de Sociedades de Capital)</div>
											}
										/>
									}
									{config['2stepsCouncil'] &&
										<ButtonInfoCouncil
											title={'Elecciones'}
											icon={<img src={elecciones} style={{ width: "100%" }}></img>}
											// icon={<i className="fa fa-list-alt" aria-hidden="true" style={{ fontSize: '4em', color: secondary }}></i>}
											isMobile={isMobile}
											list={
												<div>Reunión con votación remota temporal y que permite votación presencial.</div>
											}
										/>
									}
								</div>
							}
							{step === steps.NO_SESSION &&
								<CreateWithoutSession
									hybrid={false}
									setOptions={setOptions}
									translate={translate}
									setTitle={setTitle}
									errors={errors}
								/>
							}
							{step === steps.COUNCIL &&
								<CreateWithSession setOptions={setOptions} />
							}
							{step === steps.HYBRID_VOTING &&
								<CreateWithoutSession
									hybrid={true}
									setOptions={setOptions}
									translate={translate}
									setTitle={setTitle}
									errors={errors}
								/>
							}
						</div>
					</Scrollbar>
				</div>
			}
			hideAccept={step === steps.COUNCIL || step === 1 || step === 10}
			buttonAccept={translate.accept}
			acceptAction={() => sendCreateCouncil(step === steps.HYBRID_VOTING ? 3 : 2)}
			requestClose={step != 10 && history.goBack}
			cancelAction={history.goBack}
			buttonCancel='Cancelar'
		/>
	)
}



const ButtonCreateCouncil = ({ isMobile, title, icon, list, styleButton, onClick }) => {
	const [hover, hoverHandlers] = useHoverRow();

	if (isMobile) {
		return (
			<Paper
				elevation={6}
				style={{
					width: '100%',
					marginTop: "15px"
				}}
			>
				<div
					onClick={onClick}
					{...hoverHandlers}
					style={{
						cursor: "pointer",
						width: "100%",
						border: "1px solid gainsboro",
						background: hover ? "gainsboro" : "",
						paddingTop: '0.5em',
					}}
				>
					<div style={{ textAlign: " center", }}>
						<h2 style={{ padding: "0 0.3em 0.3em 0.3em" }}>{title}</h2>
						{icon}
						<div style={{ textAlign: isMobile ? "left" : '', width: isMobile ? "90%" : '' }}>{list}</div>
					</div>
				</div>
			</Paper>
		);
	} else {
		return (
			<Paper
				elevation={6}
				style={{
					width: "100%",
					// height: "450px",
					overflow: 'hidden',
					borderRadius: "8px",
					marginBottom: "1em",
					boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
					...styleButton
				}}
			>
				<div style={{ display: "flex", padding: '1.5em', background: hover ? "gainsboro" : "", cursor: "pointer", }}
					onClick={onClick}
					{...hoverHandlers}
				>
					<div style={{ width: "90px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
					<div style={{ color: "black", marginLeft: "2em" }}>
						<div style={{ fontSize: "24px" }}>{title}</div>
						<div style={{ fontSize: "14px" }}>{list}</div>
					</div>
				</div>
			</Paper>
		);
	}
}

const ButtonInfoCouncil = ({ isMobile, title, icon, list, styleButton, infoExtra }) => {
	const [open, setOpen] = React.useState(false);

	return (
		<Paper
			elevation={6}
			style={{
				width: "100%",
				// height: "450px",
				overflow: 'hidden',
				borderRadius: "8px",
				marginBottom: "1em",
				boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
				...styleButton
			}}
		>
			<div style={{ padding: '1.5em', }}>
				<div style={{ display: "flex" }}>
					<div style={{ width: "80px" }}>{icon}</div>
					<div style={{ fontSize: "22px", color: "black", marginLeft: "1em" }}>{title}</div>
				</div>
				<div style={{ marginTop: "1em" }}>
					<div style={{ fontSize: "14px", color: "black" }}>{list}</div>
					<div style={{ color: getSecondary() }}>{infoExtra}</div>
				</div>
				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<div style={{ display: "flex", alignItems: "center" }}>
						{open ?
							<i className="material-icons" style={{ fontSize: "40px", color: getPrimary(), cursor: "pointer" }} onClick={() => setOpen(false)}>
								keyboard_arrow_up
							</i>
							:
							<i className="material-icons" style={{ fontSize: "40px", color: getPrimary(), cursor: "pointer" }} onClick={() => setOpen(true)}>
								keyboard_arrow_down
							</i>
						}
					</div>
				</div>
				<div style={{ marginTop: "1em", }}>
					<Collapse in={open} timeout="auto" unmountOnExit >
						dasdas
					</Collapse>
				</div>
			</div>
		</Paper >
	);

}



const mapStateToProps = state => ({
	main: state.main,
	user: state.user,
	council: state.council
});

export const createCouncil = gql`
	mutation CreateCouncil($companyId: Int!, $type: Int, $councilOptions: CouncilInput) {
		createCouncil(companyId: $companyId, type: $type, councilOptions: $councilOptions) {
			id
		}
	}
`;

export default graphql(createCouncil, { name: 'createCouncil' })(connect(
	mapStateToProps
)(withRouter(withSharedProps()(CreateCouncil))));
