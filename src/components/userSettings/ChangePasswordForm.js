import React, { Fragment } from "react";
import { graphql } from "react-apollo";
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	SectionTitle,
	TextInput
} from "../../displayComponents";
import { getPrimary } from "../../styles/colors";
import { updatePassword } from "../../queries";
import { LinearProgress } from "material-ui/Progress";


class ChangePasswordForm extends React.Component {

	state = {
		success: false,
		loading: false,
		error: false,
		data: {
			currentPassword: "",
			newPassword: "",
			newPasswordConfirm: ""
		},
		errors: {},
		errorsBar: null,
		porcentaje: 0,
		color: "#333333"
	};


	updatePassword = async () => {
		const { data } = this.state;
		if (!this.checkChangePassword()) {
			this.setState({
				loading: true
			});
			const response = await this.props.updatePassword({
				variables: {
					oldPassword: data.currentPassword,
					newPassword: data.newPassword
				}
			});
			if (response.errors) {
				if (response.errors[0].code === 401) {
					this.setState({
						error: true,
						errors: {
							...this.state.errors,
							currentPassword: this.props.translate
								.current_password_incorrect
						}
					});
				}
			} else {
				this.handleButtonSuccess();
			}
		}
	};
	handleKeyUp = event => {
		if (event.nativeEvent.keyCode === 13) {
			this.updatePassword();
		}
		this.setState({
			success: false,
			error: false
		});
	};
	resetButtonStates = () => {
		this.setState({
			error: false,
			loading: false,
			success: false
		});
	};

	checkChangePassword() {
		const { translate } = this.props;
		const { data } = this.state;
		let hasError = false;
		const errors = {
			currentPassword: "",
			newPassword: "",
			newPasswordConfirm: ""
		};

		//current_password_incorrect

		if (data.newPassword !== data.newPasswordConfirm) {
			errors.newPasswordConfirm = translate.register_unmatch_pwds;
			hasError = true;
		}

		if (!data.newPassword) {
			errors.newPassword = translate.no_empty_pwd;
			hasError = true;
		}

		if (!data.currentPassword) {
			errors.currentPassword = translate.no_empty_pwd;
		}

		if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/.test(data.newPassword))) {
			errors.currentPassword = "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"; //TRADUCCION
		}

		this.setState({
			errors: errors
		});
		return hasError;
	}

	updateState(newValues, validate) {
		let errorsBar
		let porcentaje = 100

		if (validate) {
			if (!(/[a-z]/.test(newValues.newPassword))) {
				errorsBar = "Contraseña Insegura"; //TRADUCCION
				porcentaje = porcentaje - 20;
			}
			if (!(/(?=.*[A-Z])/.test(newValues.newPassword))) {
				errorsBar = "Contraseña Insegura"; //TRADUCCION
				porcentaje = porcentaje - 20;
			}
			if (!(/(?=.*[0-9])/.test(newValues.newPassword))) {
				errorsBar = "Contraseña Insegura"; //TRADUCCION
				porcentaje = porcentaje - 20;
			}
			if (!(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newValues.newPassword))) {
				errorsBar = "Contraseña Insegura"; //TRADUCCION
				porcentaje = porcentaje - 20;
			}
			if (!(/.{8,}/.test(newValues.newPassword))) {
				errorsBar = "Contraseña Insegura"; //TRADUCCION
				porcentaje = porcentaje - 20;
			}
			let color = "Green"
			color = porcentaje < 40 ? 'Red' : porcentaje >= 40 && porcentaje <= 80 ? "Orange" : "Green";
			this.setState({
				errorsBar: errorsBar,
				porcentaje,
				color: color,
				data: {
					...this.state.data,
					...newValues
				}
			});
		} else {
			this.setState({
				data: {
					...this.state.data,
					...newValues
				}
			});
		}
	}

	handleButtonSuccess() {
		if (this.state.error) {
			this.setState({
				success: true,
				loading: false
			});
		} else {
			this.setState({
				success: false,
				loading: false
			});
		}
	}

	render() {
		const { translate, classes } = this.props;
		const { data, errors, success, loading, error } = this.state;
		const primary = getPrimary();
		return (
			<Fragment>
				<SectionTitle
					text={translate.change_password}
					color={primary}
				/>
				<br />
				<Grid>
					<GridItem xs={12} md={12} lg={12} style={{ marginBottom: "1em" }}>
						Please confirm that passwords must contain three of the following sets of characters:
						uppercase letters
						lowercase letters
						numbers
						symbols and minimum 8 characters
					</GridItem>
					<GridItem xs={12} md={6} lg={4}>
						<TextInput
							floatingText={translate.current_password}
							type="password"
							onKeyUp={this.handleKeyUp}
							value={data.currentPassword}
							errorText={errors.currentPassword}
							onChange={event =>
								this.updateState({
									currentPassword:
										event.nativeEvent.target.value
								}, false)
							}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={4}>
						<TextInput
							floatingText={translate.new_password}
							type="password"
							onKeyUp={this.handleKeyUp}
							value={data.newPassword}
							onChange={event =>
								this.updateState({
									newPassword: event.nativeEvent.target.value
								}, true)

							}
							errorText={errors.newPassword}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={4}>
						<TextInput
							floatingText={translate.repeat_password}
							type="password"
							onKeyUp={this.handleKeyUp}
							value={data.newPasswordConfirm}
							onChange={event =>
								this.updateState({
									newPasswordConfirm:
										event.nativeEvent.target.value
								}, false)
							}
							errorText={errors.newPasswordConfirm}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={4} style={{ paddingTop: "1em", display: "flex" }}>
						<div style={{ width: "70%", marginRight: "3em" }}>
							<LinearProgress
								variant="determinate"
								value={this.state.porcentaje}
								style={{
									height: "18px",
									backgroundColor: 'lightgrey',
									borderRadius: "10px",
									boxShadow: "rgba(0, 0, 0, 0.15) 0px 12px 20px -10px, rgba(0, 0, 0, 0.18) 0px 4px 20px 0px, rgba(0, 0, 0, 0.23) 0px 7px 8px -5px"
								}}
								className={"barColor" + this.state.color}
							/>
						</div>
						<div style={{ width: "30%" }}>
							{this.state.errorsBar !== undefined ? this.state.errorsBar : "Contraseña segura"} {/*TRADUCCION*/}
						</div>
					</GridItem>
				</Grid>
				<br />
				<BasicButton
					text={translate.save}
					color={success ? "green" : getPrimary()}
					textStyle={{
						color: "white",
						fontWeight: "700"
					}}
					floatRight
					onClick={this.updatePassword}
					loading={loading}
					error={error}
					reset={this.resetButtonStates}
					success={success}
					icon={<ButtonIcon type={"save"} color="white" />}
				/>
			</Fragment>
		);
	}
}

export default graphql(updatePassword, {
	name: "updatePassword",
	options: { errorPolicy: "all" }
})(ChangePasswordForm);
