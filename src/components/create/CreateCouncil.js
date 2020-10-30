import React from "react";
import { connect } from "react-redux";
import { LoadingMainApp, LiveToast, AlertConfirm, Scrollbar } from "../../displayComponents";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { bHistory } from "../../containers/App";
import { ConfigContext } from '../../containers/AppControl';
import { toast } from 'react-toastify';
import { getSecondary, getPrimary } from "../../styles/colors";
import CreateWithSession from "./CreateWithSession";
import CreateWithoutSession from "./CreateWithoutSession";
import CreateNoBoard from "./CreateNoBoard";
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


const CreateCouncil = props => {
	const config = React.useContext(ConfigContext);

	return (
		<CreateCouncilModal
			history={props.history}
			client={props.client}
			createCouncil={props.createCouncil}
			company={props.company}
			translate={props.translate}
			config={config}
		/>
	);
}

const steps = {
	NO_SESSION: 'NO_SESSION',
	COUNCIL: 'COUNCIL',
	HYBRID_VOTING: 'HYBRID_VOTING',
	BOARD_NO_SESSION: 'BOARD_NO_SESSION',
	ONE_ON_ONE: 'ONE_ON_ONE'
}

const CreateCouncilModal = ({ history, company, createCouncil, translate, config, client }) => {
	const [options, setOptions] = React.useState(null);
	const [step, setStep] = React.useState(1);
	const [errors, setErrors] = React.useState({});
	const [creating, setCreating] = React.useState(false);
	const [title, setTitle] = React.useState(translate.select_meeting_type);//TRADUCCION


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

		if ([0, 4, 5].findIndex(item => item === type) === -1) {
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
					errors.errorMessage = translate.end_date_earlier_the_start;
				}
			}
		}

		setErrors(errors);

		return hasError;
	}

	const councilStep = () => {
		sendCreateCouncil(0);
	}

	const createOneOneOne = () => {
		sendCreateCouncil(5);
	}

	const noSessionStep = () => {
		setStep(steps.NO_SESSION);
	}

	const noSessionHybridStep = () => {
		setStep(steps.HYBRID_VOTING);
	}

	const boardWithoutSessionStep = () => {
		setStep(steps.BOARD_NO_SESSION);
		//sendCreateCouncil(4);
	}
	
	return (
		<AlertConfirm
			fullWidth={isMobile && true}
			classNameDialog={isMobile && 'noMarginM'}
			open={true}
			widthModal={{ borderRadius: "8px", }}
			bodyStyle={{ overflow: "hidden", maxWidth: !isMobile && "75vw" }}
			PaperProps={{
				style: {
					width: isMobile ? '100vw' : '65vw',
					height: isMobile ? '100%' : '75vh',
				}
			}}
			bodyText={
				<div style={{ height: "100%", paddingTop: step != 10 && '3em' }}>
					<Scrollbar>
						<div style={{}}>
							{step === 1 &&
								<div style={{ height: "100%", padding: isMobile ? "0em 1em 0em" : "0em 2em 2em 2em" }}>
									<div style={{ display: !isMobile && "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5em" }}>
										<div style={{ display: "flex" }}>
											<div style={{ color: getPrimary(), fontSize: isMobile ? "17px" : "24px", fontStyle: "italic" }}>
												{translate.create_council_title}
											</div>
											{!isMobile &&
												<div style={{ display: "flex", justifyContent: 'center', textAlign: 'center', marginLeft: "15px" }}>
													<img src={emptyMeetingTable} style={{ width: '70px', }} alt="empty-table" />
												</div>
											}
										</div>
										<div style={{ color: "black", cursor: "pointer", paddingTop: "8px", paddingBottom: "8px" }} onClick={() => setStep(10)}>
											<div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: '13px' }}>
												<i className="material-icons" style={{ color: getPrimary(), fontSize: '13px', paddingRight: "0.3em", marginTop: "4px" }} >
													help
                    							</i>
												{translate.create_council_help}
											</div>
										</div>
									</div>
									<div style={{ height: "100%" }}>
										<ButtonCreateCouncil
											onClick={councilStep}
											title={translate.with_session}
											styleButton={{ marginRight: "3%" }}
											icon={<img src={conSesionIcon}></img>}
											isMobile={isMobile}
											list={
												<div>{translate.with_session_description}</div>
											}
										/>
										<ButtonCreateCouncil
											onClick={noSessionStep}
											title={translate.without_session}
											styleButton={{ marginRight: "3%" }}
											icon={<img src={sinSesionIcon}></img>}
											isMobile={isMobile}
											list={
											<div>{translate.without_session_description}</div>
											}
										/>
										{config['boardWithoutSession'] &&
											<ButtonCreateCouncil
												onClick={boardWithoutSessionStep}
												title={translate.board_without_session}
												styleButton={{ marginRight: "3%" }}
												icon={<img src={consejoSinSesion}></img>}
												isMobile={isMobile}
												list={
													<div>{translate.board_without_session_description}</div>
												}
											/>
										}
										{config['2stepsCouncil'] &&
											<ButtonCreateCouncil
												onClick={noSessionHybridStep}
												title={translate.elections}
												icon={<img src={elecciones}></img>}
												isMobile={isMobile}
												list={
													<div>{translate.elections_description}</div>
												}
											/>
										}
										{config['onOnOneCouncil'] &&
											<ButtonCreateCouncil
												onClick={createOneOneOne}
												title={'Cita 1 a 1'}
												isMobile={isMobile}
											/>
										}
									</div>
								</div>
							}
							{step === 10 &&
								<div style={{ height: "100%", padding: isMobile ? "0em 1em 0em" : "0em 2em 2em 2em" }}>
									<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", }}>
										<div onClick={() => setStep(1)} style={{ color: getSecondary(), cursor: "pointer", paddingBottom: "1em" }}>
											{translate.back}
										</div>
									</div>
									
									<ButtonInfoCouncil
										title={translate.with_session}
										styleButton={{ marginRight: "3%" }}
										icon={<img src={conSesionIcon} style={{ width: "100%" }}></img>}
										isMobile={isMobile}
										infoExtra={
											<div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
												<div style={{ width: "35px", paddingRight: "15px", display: "flex" }}>
													<img src={admin} style={{ width: "100%" }} ></img>
												</div>
												{translate.admin_required}
											</div>
										}
										list={
											<div style={{ fontSize: "15px" }}>
												{translate.with_session_description}
											</div>
										}
									/>
									<ButtonInfoCouncil
										title={translate.without_session}
										styleButton={{ marginRight: "3%" }}
										icon={<img src={sinSesionIcon} style={{ width: "100%" }}></img>}
										isMobile={isMobile}
										list={
											<div style={{ fontSize: "15px" }}>
												{translate.without_session_description}
											</div>
										}
									/>
									{config['boardWithoutSession'] &&
										<ButtonInfoCouncil
											title={translate.board_without_session}
											styleButton={{ marginRight: "3%" }}
											icon={<img src={consejoSinSesion} style={{ width: "100%" }}></img>}
											isMobile={isMobile}
											list={
												<div style={{ fontSize: "15px" }}>
													{translate.board_without_session_description}
												</div>
											}
										/>
									}
									{config['2stepsCouncil'] &&
										<ButtonInfoCouncil
											title={translate.elections}
											icon={<img src={elecciones} style={{ width: "100%" }}></img>}
											isMobile={isMobile}
											list={
												<div style={{ fontSize: "15px" }}>
													{translate.elections_description}
												</div>
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
							{step === steps.BOARD_NO_SESSION &&
								<CreateNoBoard
									setOptions={setOptions}
									translate={translate}
									setTitle={setTitle}
									options={options}
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
			acceptAction={() => sendCreateCouncil(step === steps.HYBRID_VOTING ?
				3 : 
			step === steps.BOARD_NO_SESSION? 4 : 2)}
			requestClose={step != 10 && history.goBack}
			cancelAction={history.goBack}
			buttonCancel={translate.cancel}
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
					width: "100%",
					overflow: 'hidden',
					borderRadius: "8px",
					marginBottom: "1em",
					boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
					...styleButton
				}}
			>
				<div style={{ padding: '1.5em', background: hover ? "rgba(97, 171, 183, 0.22)" : "", cursor: "pointer", }}
					onClick={onClick}
					{...hoverHandlers}
				>
					<div style={{ width: "90px", margin: "0 auto" }}>{icon}</div>
					<div style={{ color: "black", textAlign: "center" }}>
						<div style={{ fontSize: "24px" }}>{title}</div>
						<div style={{ fontSize: "14px" }}>{list}</div>
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
				<div style={{ display: "flex", padding: '1.5em', background: hover ? "rgba(97, 171, 183, 0.22)" : "", cursor: "pointer", }}
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
)(withRouter(withSharedProps()(withApollo(CreateCouncil)))));
