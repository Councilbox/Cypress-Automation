import React from "react";
import {
	BasicButton,
	ButtonIcon,
	Grid,
	GridItem,
	MenuItem,
	SelectInput,
	TextInput,
	Checkbox
} from "../../../displayComponents";
import { checkValidEmail } from "../../../utils/index";
import { getPrimary } from "../../../styles/colors";
import { checkEmailExists } from "../../../queries/userAndCompanySignUp";
import { withApollo } from "react-apollo/index";
import { LinearProgress } from "material-ui/Progress";
import PropTypes from 'prop-types';
import TermsModal from "./TermsModal";


class SignUpUser extends React.Component {
	state = {
		errorsBar: null,
		porcentaje: 0,
		repeatEmail: '',
		termsAccepted: false,
		termsModal: false,
		confirmPWD: "",
		subscriptions: [],
		languages: [
			{
				columnName: 'es',
				desc: 'Español'
			},
			{
				columnName: 'en',
				desc: 'English'
			},
			{
				columnName: 'pt',
				desc: 'Portugués'
			},
			{
				columnName: 'cat',
				desc: 'Catalá'
			},
			{
				columnName: 'gal',
				desc: 'Galego'
			},
		]
	};

	nextPage = async () => {
		if (!(await this.checkRequiredFields())) {
			//this.props.nextPage();
			this.props.signUp();
		}
	};

	checkRequiredFields = async () => {
		let errors = {
			name: "",
			surname: "",
			phone: "",
			email: "",
			repeatEmail: '',
			pwd: "",
			termsAccepted: "",
			confirmPWD: ""
		};

		const data = this.props.formData;
		const { translate } = this.props;
		let hasError = false;


		if (!data.termsCheck) {
			hasError = true;
			errors.termsCheck = translate.acept_terms;
		}

		if (!data.name) {
			hasError = true;
			errors.name = translate.field_required;
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
		} else {
			let existsCif = await this.checkEmailExists();
			if (data.email !== this.state.repeatEmail && data.email) {
				hasError = true;
				errors.repeatEmail = translate.register_unmatch_emails;
			}

			if (!checkValidEmail(data.email) || existsCif) {
				hasError = true;
				errors.email = existsCif
					? translate.register_exists_email
					: translate.email_not_valid;
			}
		}

		if (!data.pwd) {
			hasError = true;
			errors.pwd = translate.no_empty_pwd;
		}

		if (data.pwd !== this.state.confirmPWD) {
			hasError = true;
			errors.confirmPWD = translate.no_match_pwd;
		}

		// if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,}$/.test(data.pwd))) {
		// 	hasError = true;
		// 	errors.pwd = "Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"; //TRADUCCION
		// }

		this.props.updateErrors({
			...errors,
			hasError: hasError
		});
		return hasError;
	}

	async checkEmailExists() {
		const response = await this.props.client.query({
			query: checkEmailExists,
			variables: { email: this.props.formData.email }
		});

		return response.data.checkEmailExists.success;
	}

	handleKeyUp = event => {
		const data = this.props.formData;
		let errorsBar
		let porcentaje = 100

		if (!(/[a-z]/.test(data.pwd))) {
			errorsBar = "Contraseña Insegura"; //TRADUCCION
			porcentaje = porcentaje - 20;
		}
		if (!(/(?=.*[A-Z])/.test(data.pwd))) {
			errorsBar = "Contraseña Insegura"; //TRADUCCION
			porcentaje = porcentaje - 20;
		}
		if (!(/(?=.*[0-9])/.test(data.pwd))) {
			errorsBar = "Contraseña Insegura"; //TRADUCCION
			porcentaje = porcentaje - 20;
		}
		if (!(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(data.pwd))) {
			errorsBar = "Contraseña Insegura"; //TRADUCCION
			porcentaje = porcentaje - 20;
		}
		if (!(/.{8,}/.test(data.pwd))) {
			errorsBar = "Contraseña Insegura"; //TRADUCCION
			porcentaje = porcentaje - 20;
		}
		let color = "Green"
		color = porcentaje < 40 ? 'Red' : porcentaje >= 40 && porcentaje <= 80 ? "Orange" : "Green";
		this.setState({
			errorsBar: errorsBar,
			porcentaje,
			color:color,
		})
		if (event.nativeEvent.keyCode === 13) {
			this.nextPage();
		}
		if (this.props.errors.hasError) {
			this.checkRequiredFields();
		}
	};

	render() {
		const primary = getPrimary();
		const { translate, classes } = this.props;
		const data = this.props.formData;

		return (
			<div
				style={{
					width: "100%",
					padding: "6%"
				}}
				onKeyUp={this.handleKeyUp}
			>
				<div
					style={{
						fontSize: "1.3em",
						fontWeight: "700",
						color: primary
					}}
				>
					{translate.user_data}
				</div>
				<Grid style={{ marginTop: "2em" }}>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.name}
							type="text"
							value={data.name}
							errorText={this.props.errors.name}
							onChange={event =>
								this.props.updateState({
									name: event.target.value
								})
							}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.surname}
							type="text"
							value={data.surname}
							onChange={event =>
								this.props.updateState({
									surname: event.target.value
								})
							}
							errorText={this.props.errors.surname}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.phone}
							type="text"
							value={data.phone}
							onChange={event =>
								this.props.updateState({
									phone: event.target.value
								})
							}
							errorText={this.props.errors.phone}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<SelectInput
							floatingText={translate.language}
							value={data.preferredLanguage}
							errorText={this.props.errors.language}
							onChange={event =>
								this.props.updateState({
									preferredLanguage: event.target.value
								})
							}
							required
						>
							{this.state.languages.map(language => {
								return (
									<MenuItem
										key={language.id}
										value={language.columnName}
									>
										{language.desc}
									</MenuItem>
								);
							})}
						</SelectInput>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.login_email}
							type="text"
							value={data.email}
							onChange={event =>
								this.props.updateState({
									email: event.target.value.toLowerCase()
								})
							}
							errorText={this.props.errors.email}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.repeat_email}
							type="text"
							value={this.state.repeatEmail}
							onChange={event =>
								this.setState({
									repeatEmail: event.target.value
								})
							}
							errorText={this.props.errors.repeatEmail}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.login_password}
							type="password"
							value={data.pwd}
							onChange={event =>
								this.props.updateState({
									pwd: event.target.value
								})
							}
							errorText={this.props.errors.pwd}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<TextInput
							floatingText={translate.login_confirm_password}
							type="password"
							value={this.state.confirmPWD}
							onChange={event =>
								this.setState({
									confirmPWD: event.target.value
								})
							}
							errorText={this.props.errors.confirmPWD}
							required
						/>
					</GridItem>
					<GridItem xs={12} md={6} lg={6} style={{ height: "50px" }}>
						<div style={{ width: "100%", marginRight: "3em" }}>
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
						<div style={{ width: "100%" }}>
							{this.state.errorsBar !== undefined ? this.state.errorsBar : "Contraseña segura"} {/*TRADUCCION*/}
						</div>
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						{" "}
					</GridItem>
					<GridItem xs={12} md={12} lg={12}>
						<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
							<Checkbox
								label={translate.login_read_terms + ' '}
								value={this.state.termsCheck}
								onChange={(event, isInputChecked) =>
									this.setState({
										termsAccepted: isInputChecked
									})
								}
								onClick={() => {
									this.setState({
										termsAccepted: true
									});
								}}
							/>
							<a
								style={{
									color: primary,
									fontWeight: '700',
									cursor: 'pointer',
									textTransform: 'lowerCase',
									marginLeft: '0.4em'
								 }}
								onClick={event => {
									event.stopPropagation();
									this.setState({
										termsModal: true,
									});
								}}
							>
								{translate.login_read_terms2}
							</a>
						</div>
						{this.props.errors.termsCheck && (
							<div style={{ color: "red" }}>
								{this.props.errors.termsCheck}
							</div>
						)}
					</GridItem>
					<GridItem xs={12} md={6} lg={6}>
						<BasicButton
							text={translate.send}
							loading={this.props.loading}
							color={primary}
							textStyle={{
								color: "white",
								fontWeight: "700"
							}}
							onClick={this.nextPage}
							fullWidth
							icon={
								<ButtonIcon
									color="white"
									type="send"
								/>
							}
						/>
					</GridItem>
				</Grid>
				<TermsModal
					open={this.state.termsModal}
					translate={translate}
					close={() => {
						this.setState({
							termsModal: false
						});
					}}
				/>
			</div>
		);
	}
}
SignUpUser.propTypes = {
	classes: PropTypes.object.isRequired,
};


export default withApollo(SignUpUser);
