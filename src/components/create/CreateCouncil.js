import React from "react";
import { connect } from "react-redux";
import { LoadingMainApp, LiveToast, AlertConfirm, BlockButton, Grid, GridItem } from "../../displayComponents";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { bHistory } from "../../containers/App";
import { ConfigContext } from '../../containers/AppControl';
import { toast } from 'react-toastify';
import withTranslations from "../../HOCs/withTranslations";
import { getSecondary } from "../../styles/colors";
import CreateWithSession from "./CreateWithSession";
import CreateWithoutSession from "./CreateWithoutSession";
import { checkSecondDateAfterFirst } from "../../utils/CBX";
import { isMobile } from "react-device-detect";
import { Paper } from "material-ui";
import { useHoverRow } from "../../hooks";
import ReactGa from 'react-ga';


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
				ReactGa.event({
					category: "Council created",
					action: "User created a new council with session",
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
				company={props.match.params.company}
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
	HYBRID_VOTING: 'HYBRID_VOTING'
}

const secondary = getSecondary();

const CreateCouncilModal = ({ history, company, createCouncil, translate, config }) => {
	const [options, setOptions] = React.useState(null);
	const [step, setStep] = React.useState(1);
	const [errors, setErrors] = React.useState({});
	const [title, setTitle] = React.useState("Seleccionar tipo de reunión");//TRADUCCION


	const sendCreateCouncil = async type => {
		if (!checkRequiredFields(type)) {
			const response = await createCouncil({
				variables: {
					companyId: company,
					type,
					councilOptions: options
				}
			});
			const newCouncilId = response.data.createCouncil.id;
			if (newCouncilId) {
				ReactGa.event({
					category: "Council created",
					action: "User created a new council with session",
				});
				bHistory.replace(`/company/${company}/council/${newCouncilId}`);
			} else {
				bHistory.replace(`/company/${company}`);
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

		if (type !== 0) {
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

	return (
		<AlertConfirm
			open={true}
			title={title}
			bodyStyle={{ maxWidth: isMobile ? "" : "75vw" }}
			bodyText={
				<React.Fragment>
					{step === 1 &&
						<div style={{ display: isMobile ? "" : 'flex', margin: isMobile ? "" : "2em 0 1.5em 0", justifyContent: 'center', alignItems: 'center' }}>
							<ButtonCreateCouncil
								onClick={councilStep}
								title={'Con sesión'}
								styleButton={{ marginRight: "3%" }}
								icon={<i className="fa fa-users" aria-hidden="true" style={{ marginBottom: "0.3em", fontSize: '4em', color: secondary }}></i>}
								isMobile={isMobile}
								list={
									<ul>
										<li>Lorem ipsum dolor sit amet, consectetsfgur afgdipiscing gfselit. Nulgfl</li>
										<li>Lorem i sgsdgfspsum dolor ssfgit amesfdgt, consectetur adipiscing elit.</li>
										<li>Lorem sfg gsdolor sitsf ametsf consectetgdur adisgspiscing dfgelidgft.s</li>
									</ul>
								}
							/>
							<ButtonCreateCouncil
								onClick={noSessionStep}
								title={'Sin sesión'}
								styleButton={{ marginRight: "3%" }}
								icon={<i className="fa fa-users" aria-hidden="true" style={{ marginBottom: "0.3em", fontSize: '4em', color: secondary }}></i>}
								isMobile={isMobile}
								list={
									<ul>
										<li>Lorem ipsum dolor sit amet, consectetsfgur afgdipiscing gfselit. Nulgfl</li>
										<li>Lorem i sgsdgfspsum dolor ssfgit amesfdgt, consectetur adipiscing elit.</li>
										<li>Lorem sfg gsdolor sitsf ametsf consectetgdur adisgspiscing dfgelidgft.s</li>
									</ul>
								}
							/>
							{config['2stepsCouncil'] &&
								<ButtonCreateCouncil
									onClick={noSessionHybridStep}
									title={'Sin sesión en 2 pasos'}
									icon={<i className="fa fa-list-alt" aria-hidden="true" style={{ marginBottom: "0.3em", fontSize: '4em', color: secondary }}></i>}
									isMobile={isMobile}
									list={
										<ul>
											<li>Lorem ipsum dolor sit amet, consectetsfgur afgdipiscing gfselit. Nulgfl</li>
											<li>Lorem i sgsdgfspsum dolor ssfgit amesfdgt, consectetur adipiscing elit.</li>
											<li>Lorem sfg gsdolor sitsf ametsf consectetgdur adisgspiscing dfgelidgft.s</li>
										</ul>
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
				</React.Fragment>

			}
			hideAccept={step === steps.COUNCIL || step === 1}
			buttonAccept={translate.accept}
			acceptAction={() => sendCreateCouncil(step === steps.HYBRID_VOTING ? 3 : 2)}
			requestClose={history.goBack}
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
					width: "45%",
					height: "450px",
					overflow: 'hidden',
					...styleButton
				}}
			>
				<div
					onClick={onClick}
					{...hoverHandlers}
					style={{
						cursor: "pointer",
						width: "100%",
						// border: "1px solid gainsboro",
						background: hover ? "gainsboro" : "",
						padding: '1.5em',
						height: "100%"
					}}
				>
					<div style={{ textAlign: " center", }}>
						<h2>{title}</h2>
						{icon}
						{list}
					</div>
				</div>
			</Paper>
		);
	}
}



const mapStateToProps = state => ({
	main: state.main,
	company: state.company,
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
)(withRouter(withTranslations()(CreateCouncil))));
