import React from "react";
import { graphql, withApollo } from "react-apollo";
import { checkValidEmail } from "../../utils";
import {
	BasicButton,
	ButtonIcon,
	SectionTitle,
	AlertConfirm
} from "../../displayComponents";
import { updateUser } from "../../queries";
import { store } from "../../containers/App";
import { setUserData } from "../../actions/mainActions";
import { getPrimary } from "../../styles/colors";
import UserForm from './UserForm';
import { checkEmailExists } from "../../queries/userAndCompanySignUp";
import CompanyLinksManager from "../corporation/users/CompanyLinksManager";



class UpdateUserForm extends React.Component {
	state = {
		data: this.props.user,
		error: false,
		loading: false,
		success: false,
		errors: {},
		modal: false,
		companies: [],
		// companies: fixedCompany ? [fixedCompany] : [],
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.user.id !== prevState.data.id) {
			return {
				data: nextProps.user
			}
		}

		return null;
	}

	saveUser = async () => {
		if (!await this.checkRequiredFields()) {
			this.setState({
				loading: true
			});
			const { __typename, type, actived, roles, ...data } = this.state.data;

			if (this.props.user.email !== data.email) {
				this.setState({
					modal: true
				});
			}

			const response = await this.props.updateUser({
				variables: {
					user: data
				}
			});
			if (response.errors) {
				this.setState({
					error: true,
					loading: false,
					success: false
				});
			} else {
				this.setState({
					success: true,
					error: false,
					loading: false
				});
				store.dispatch(setUserData(response.data.updateUser));
			}
		}
	};

	resetButtonStates = () => {
		this.setState({
			error: false,
			loading: false,
			success: false
		});
	};

	updateState = (newValues) => {
		this.setState({
			data: {
				...this.state.data,
				...newValues
			}
		});
	}

	async checkRequiredFields() {
		const { translate } = this.props;

		let errors = {
			name: "",
			surname: "",
			phone: "",
			email: "",
			pwd: "",
			confirmPWD: ""
		};

		const data = this.state.data;
		let hasError = false;

		if (!data.name) {
			hasError = true;
			errors.name = translate.field_required;
		}

		if (!checkValidEmail(data.email.toLowerCase())) {
			hasError = true;
			errors.email = translate.email_not_valid;
		} else {
			if (data.email.toLowerCase() !== this.props.user.email.toLowerCase()) {
				if (await this.checkEmailExists()) {
					errors.email = translate.register_exists_email
				}
			}
		}

		if (!data.surname) {
			hasError = true;
			errors.surname = translate.field_required;
		}

		if (!data.phone) {
			hasError = true;
			errors.phone = translate.field_required;
		}

		if (!data.email) {
			hasError = true;
			errors.email = translate.field_required;
		}

		if (!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(data.email))) {
			hasError = true;
			errors.email = "invalid email";
		}

		this.setState({
			errors: errors,
			error: hasError
		});
		return hasError;
	}

	onKeyUp = () => {
		this.checkRequiredFields();
	}

	async checkEmailExists() {
		const response = await this.props.client.query({
			query: checkEmailExists,
			variables: { email: this.state.data.email }
		});

		return response.data.checkEmailExists.success;
	}
	_renderBodyModal = () => {
		return (
			<React.Fragment>
				Se va a enviar un Email para confirmar el cambio de Email.
			</React.Fragment>
		)
	}

	render() {
		const { translate, edit, company } = this.props;
		const { data, errors, error, success, loading } = this.state;
		const primary = getPrimary();
		
		return (
			<React.Fragment>
				<div style={{ paddingTop: 0 }} {...(error ? { onKeyUp: this.onKeyUp } : {})}>
					<SectionTitle
						// TRADUCCION
						// text={translate.user_data}
						text={edit ? "Editar Usuario" : translate.user_data}
						color={primary}
					/>
					<br />
					<UserForm
						data={data}
						updateState={this.updateState}
						errors={errors}
						onKeyUp={this.onKeyUp}
						languages={this.props.languages}
						translate={translate}
					/>
					<br />
					<CompanyLinksManager
						linkedCompanies={this.state.companies}
						translate={translate}
						company={{ id: company }}
						addCheckedCompanies={companies => this.setState({
							companies: companies
						})}
					/>
					<br />
					<BasicButton
						text={translate.save}
						color={getPrimary()}
						error={error}
						reset={this.resetButtonStates}
						success={success}
						loading={loading}
						floatRight
						textStyle={{
							color: "white",
							fontWeight: "700"
						}}
						onClick={error ? () => { } : this.saveUser}
						icon={<ButtonIcon type="save" color="white" />}
					/>
				</div>
				<AlertConfirm
					requestClose={() => this.setState({ modal: false })}
					open={this.state.modal}
					acceptAction={() => this.setState({ modal: false })}
					buttonAccept={translate.accept}
					bodyText={this._renderBodyModal()}
					title={"Envio Email"}
				/>
			</React.Fragment>
		);
	}
}

export default graphql(updateUser, {
	name: "updateUser"
})(withApollo(UpdateUserForm));
