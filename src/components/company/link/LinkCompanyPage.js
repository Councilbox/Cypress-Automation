import React from "react";
import { graphql, withApollo } from "react-apollo";
import withSharedProps from "../../../HOCs/withSharedProps";
import {
	BasicButton,
	ButtonIcon,
	CardPageLayout,
	Grid,
	LiveToast,
	GridItem,
	TextInput
} from "../../../displayComponents";
import { getPrimary } from "../../../styles/colors";
import { bHistory, store } from "../../../containers/App";
import { getCompanies } from "../../../actions/companyActions";
import { toast } from "react-toastify";
import { linkCompany } from "../../../queries/company";

class LinkCompanyPage extends React.Component {
	state = {
		data: {
			linkKey: "",
			cif: ""
		},
		showPassword: false,
		errors: {},
		success: false,
		request: false,
		requestError: false
	};

	updateState = object => {
		this.setState({
			data: {
				...this.state.data,
				...object
			}
		});
	};

	checkRequiredFields = () => {
		let hasError = false;
		let errors = {
			cif: "",
			linkKey: ""
		};

		if (!this.state.data.cif) {
			hasError = true;
			errors.cif = this.props.translate.required_field;
		}

		if (!this.state.data.linkKey) {
			hasError = true;
			errors.linkKey = this.props.translate.required_field;
		}

		this.setState({
			errors
		});

		return hasError;
	};

	linkCompany = async () => {
		if (!this.checkRequiredFields()) {
			const response = await this.props.linkCompany({
				variables: {
					companyTin: this.state.data.cif,
					linkKey: this.state.data.linkKey
				}
			});

			if (response.errors) {
				if (response.errors[0].message === "Tin-noExists") {
					this.setState({
						errors: {
							cif: "COMPAÑIA NO EXISTE"
						}
					});
					return;
				}
			}

			if (response.data.linkCompany.success) {
				toast(
					<LiveToast
						message={this.props.translate.company_link_success_title}
					/>, {
						position: toast.POSITION.TOP_RIGHT,
						autoClose: true,				
						className: "successToast"
					}
				);
				store.dispatch(getCompanies(this.props.user.id));
				bHistory.push("/");
			} else {
				switch (response.data.linkCompany.message) {
					case "Wrong linkKey":
						this.setState({
							errors: {
								linkKey: this.props.translate.incorrect_master_key
							}
						});
						break;
					case "Already Linked":
						this.setState({
							errors: {
								cif: this.props.translate.company_already_linked
							}
						});
						break;
					default:
						this.setState({
							errors: {
								linkKey: this.props.translate.incorrect_master_key
							}
						});
				}
			}
		}
	};

	render() {
		const { translate } = this.props;
		const { data, errors, requestError, success, request } = this.state;

		return (
			<CardPageLayout title={translate.companies_link_company}>
				<Grid style={{ marginTop: "4em" }}>
					<GridItem xs={12} md={12} lg={12}>
						<div
							style={{
								width: "400px",
								margin: "auto"
							}}
						>
							<TextInput
								floatingText={translate.entity_cif}
								type="text"
								required
								value={data.cif}
								errorText={errors.cif}
								onChange={event =>
									this.updateState({
										cif: event.target.value
									})
								}
							/>
						</div>
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<div
							style={{
								width: "400px",
								margin: "auto"
							}}
						>
							<TextInput
								floatingText={translate.company_new_key}
								type={
									this.state.showPassword
										? "text"
										: "password"
								}
								passwordToggler={() =>
									this.setState({
										showPassword: !this.state.showPassword
									})
								}
								showPassword={this.state.showPassword}
								required
								helpPopover={true}
								helpTitle={translate.company_new_key}
								helpDescription={'Un usuario autorizado puede proporcionarte esta clave accediendo al panel de configuración de la empresa'}//TRADUCCION
								value={data.linkKey}
								errorText={errors.linkKey}
								onChange={event =>
									this.updateState({
										linkKey: event.target.value
									})
								}
							/>
							<br />
							<BasicButton
								text={translate.link}
								color={getPrimary()}
								error={requestError}
								success={success}
								loading={request}
								floatRight
								buttonStyle={{
									marginTop: "1.5em"
								}}
								textStyle={{
									color: "white",
									fontWeight: "700"
								}}
								onClick={this.linkCompany}
								icon={<ButtonIcon type="link" color="white" />}
							/>
						</div>
					</GridItem>
				</Grid>
			</CardPageLayout>
		);
	}
}



export default graphql(linkCompany, {
	name: "linkCompany",
	options: {
		errorPolicy: "all"
	}
})(withSharedProps()(withApollo(LinkCompanyPage)));
