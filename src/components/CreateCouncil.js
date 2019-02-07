import React from "react";
import { connect } from "react-redux";
import { LoadingMainApp, LiveToast, AlertConfirm, BlockButton, Grid, GridItem } from "../displayComponents";
import { withRouter } from "react-router-dom";
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { bHistory } from "../containers/App";
import { ConfigContext } from '../containers/AppControl';
import { toast } from 'react-toastify';
import withTranslations from "../HOCs/withTranslations";
import { darkGrey } from "../styles/styles";
import { getSecondary } from "../styles/colors";


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


const CreateCouncilModal = ({ history, company, createCouncil, translate }) => {

	const secondary = getSecondary();

	const sendCreateCouncil = async type => {
		const response = await createCouncil({
			variables: {
				companyId: company,
				type
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

	return (
		<AlertConfirm
			open={true}
			title="Seleccionar tipo de reunión"//TRADUCCION
			bodyText={
				<Grid style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
					<GridItem xs={12} md={5} lg={5}>
						<BlockButton
							onClick={() => sendCreateCouncil(0)}
							icon={<i className="fa fa-users" aria-hidden="true" style={{fontSize: '4em', color: secondary}}></i>}
							text="Con sesión"
						/>
					</GridItem>
					<GridItem xs={12} md={5} lg={5}>
						<BlockButton
							onClick={() => sendCreateCouncil(2)}
							icon={<i className="fa fa-list-alt" aria-hidden="true" style={{fontSize: '4em', color: secondary}}></i>}
							text="Sin sesión"
						/>
					</GridItem>
				</Grid>
			}
			hideAccept={true}
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
	mutation CreateCouncil($companyId: Int!, $type: Int) {
		createCouncil(companyId: $companyId, type: $type) {
			id
		}
	}
`;

export default graphql(createCouncil, { name: 'createCouncil' })(connect(
	mapStateToProps
)(withRouter(withTranslations()(CreateCouncil))));
