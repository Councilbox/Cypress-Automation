import React from "react";
import { graphql, withApollo, compose } from "react-apollo";
import { checkValidEmail } from "../../utils";
import {
	BasicButton,
	ButtonIcon,
	SectionTitle,
	AlertConfirm,
	Scrollbar
} from "../../displayComponents";
import { updateUser } from "../../queries";
import { store } from "../../containers/App";
import { setUserData } from "../../actions/mainActions";
import { getPrimary, secondary } from "../../styles/colors";
import UserForm from './UserForm';
import { checkEmailExists } from "../../queries/userAndCompanySignUp";
import CompanyLinksManager from "../corporation/users/CompanyLinksManager";
import NotificationsTable from "../notifications/NotificationsTable";
import * as CBX from "../../utils/CBX";
import gql from "graphql-tag";
import UserSendsList from "../corporation/users/UserSendsList";




class UpdateUserForm extends React.Component {
	state = {
		data: this.props.user,
		error: false,
		loading: false,
		success: false,
		errors: {},
		modal: false,
		companies: this.props.user.companies,
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
			const { __typename, type, actived, roles, companies, sends, ...data } = this.state.data;

			// if (this.props.user.email !== data.email) {
			// 	this.setState({
			// 		modal: true
			// 	});
			// }

			const response = await this.props.updateUser({
				variables: {
					user: data,
					companies: this.state.companies.map(company => company.id),
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
		const { data, errors, error, success, loading, council } = this.state;
		const primary = getPrimary();
		return (
			<div style={{ height: '100%' }}>
				<div style={{ paddingTop: 0, height: 'calc(100% - 3.5em)' }} {...(error ? { onKeyUp: this.onKeyUp } : {})}>
					<Scrollbar>
						<div style={{ padding: '1.5em' }}>
							<SectionTitle
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
							{this.props.admin &&
								<CompanyLinksManager
									linkedCompanies={this.state.companies}
									translate={translate}
									company={company}
									addCheckedCompanies={companies => this.setState({
										companies
									})}
								/>
							}
						</div>
						<br />
						{this.state.data.actived === 0 &&
							<div style={{ padding: '1em' }}>
								<UserSendsList
									enRoot={false}
									user={this.state.data}
									translate={this.props.translate}
									refetch={this.props.refetch}
								/>
							</div>

						}
					</Scrollbar>
				</div>
				<div style={{ height: '3.5em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginRight: '1em', borderTop: '1px solid gainsboro' }}>
					<BasicButton
						text={translate.send}
						color={primary}
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
			</div >
		);
	}
}

export default compose(
	graphql(
		updateUser, {
		name: "updateUser"
	}),
)(withApollo(UpdateUserForm));
