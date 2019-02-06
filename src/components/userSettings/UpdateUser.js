import React from "react";
import { graphql, withApollo } from "react-apollo";
import { checkValidEmail } from "../../utils";
import {
	BasicButton,
	ButtonIcon,
	SectionTitle
} from "../../displayComponents";
import { updateUser } from "../../queries";
import { store } from "../../containers/App";
import { setUserData } from "../../actions/mainActions";
import { getPrimary } from "../../styles/colors";
import UserForm from './UserForm';
import { checkEmailExists } from "../../queries/userAndCompanySignUp";


class UpdateUserForm extends React.Component {
	state = {
		data: this.props.user,
		error: false,
		loading: false,
		success: false,
		errors: {}
	};

	static getDerivedStateFromProps(nextProps, prevState){
		if(nextProps.user.id !== prevState.data.id){
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
			const { __typename, type, ...data } = this.state.data;

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
		}else{
			if(data.email.toLowerCase() !== this.props.user.email.toLowerCase()){
				if(await this.checkEmailExists()){
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

	render() {
		const { translate } = this.props;
		const { data, errors, error, success, loading } = this.state;
		const primary = getPrimary();

		return (
			<React.Fragment>
				<div style={{paddingTop: 0}} {...(error? {onKeyUp: this.onKeyUp} : {})}>
					<SectionTitle
						text={translate.user_data}
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
						onClick={error? () => {} : this.saveUser}
						icon={<ButtonIcon type="save" color="white" />}
					/>
				</div>
			</React.Fragment>
		);
	}
}

export default graphql(updateUser, {
	name: "updateUser"
})(withApollo(UpdateUserForm));
