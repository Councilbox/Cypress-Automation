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
import { darkGrey } from "../../styles/styles";
import { getSecondary } from "../../styles/colors";
import CreateWithSession from "./CreateWithSession";
import CreateWithoutSession from "./CreateWithoutSession";
import { checkSecondDateAfterFirst } from "../../utils/CBX";


//props.council.id

const CreateCouncil = props => {
	const [state, setState] = React.useState({
		creating: false
	});

	const [loading, setLoading] = React.useState(false);

	const config = React.useContext(ConfigContext);

	React.useEffect(() => {
		if(!config.newCreateFlow){
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
			if(newCouncilId){
				bHistory.replace(`/company/${props.match.params.company}/council/${newCouncilId}`);
			}else{
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
		if(response.data.createCouncil){
			return response.data.createCouncil.id;
		}else{
			return null;
		}
	}

	return (
		config.newCreateFlow?
			<CreateCouncilModal
				history={props.history}
				createCouncil={props.createCouncil}
				company={props.match.params.company}
				translate={props.translate}
			/>
		:
			<LoadingMainApp />
	);
}

const steps = {
	NO_SESSION: 'NO_SESSION',
	COUNCIL: 'COUNCIL'
}

const CreateCouncilModal = ({ history, company, createCouncil, translate }) => {
	const [options, setOptions] = React.useState(null);
	const [step, setStep] = React.useState(1);
	const [errors, setErrors] = React.useState({});
	const [title, setTitle] = React.useState("Seleccionar tipo de reunión");//TRADUCCION

	const secondary = getSecondary();

	const sendCreateCouncil = async type => {
		if(!checkRequiredFields()){
			const response = await createCouncil({
				variables: {
					companyId: company,
					type,
					councilOptions: options
				}
			});
			const newCouncilId = response.data.createCouncil.id;
			if(newCouncilId){
				bHistory.replace(`/company/${company}/council/${newCouncilId}`);
			}else{
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

	const checkRequiredFields = () => {
		let hasError = false;
		let errors = {}

		if(step === steps.NO_SESSION){
			if(!options.dateStart){
				hasError = true;
				errors.dateStart = translate.required_field;
			}
			if(!options.closeDate){
				hasError = true;
				errors.closeDate = translate.required_field;
			}

			if(options.dateStart && options.closeDate){
				if(!checkSecondDateAfterFirst(options.dateStart, options.closeDate)){
					hasError = true;
					errors.errorMessage = 'La fecha de fin no puede ser anterior a la fecha de comienzo.';
				}
			}
		}

		setErrors(errors);

		return hasError;
	}

	const councilStep = () => {
		sendCreateCouncil(0);
		//setStep(steps.COUNCIL);
	}

	const noSessionStep = () => {
		setStep(steps.NO_SESSION);
	}

	return (
		<AlertConfirm
			open={true}
			title={title}
			bodyText={
				<React.Fragment>
					{step === 1 &&
						<Grid style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
							<GridItem xs={12} md={5} lg={5}>
								<BlockButton
									onClick={councilStep}
									icon={<i className="fa fa-users" aria-hidden="true" style={{fontSize: '4em', color: secondary}}></i>}
									text="Con sesión"
								/>
							</GridItem>
							<GridItem xs={12} md={5} lg={5}>
								<BlockButton
									onClick={noSessionStep}
									icon={<i className="fa fa-list-alt" aria-hidden="true" style={{fontSize: '4em', color: secondary}}></i>}
									text="Sin sesión"
								/>
							</GridItem>
						</Grid>
					}
					{step === steps.NO_SESSION &&
						<CreateWithoutSession
							setOptions={setOptions}
							translate={translate}
							setTitle={setTitle}
							errors={errors}
						/>
					}
					{step === steps.COUNCIL &&
						<CreateWithSession setOptions={setOptions} />
					}
				</React.Fragment>

			}
			hideAccept={step !== steps.NO_SESSION}
			buttonAccept={translate.accept}
			acceptAction={() => sendCreateCouncil(2)}
			requestClose={history.goBack}
			cancelAction={history.goBack}
			buttonCancel='Cancelar'
		/>
	)
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
